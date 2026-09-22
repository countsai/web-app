import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const [profilesRes, subsRes, planRequestsRes] = await Promise.all([
    admin
      .from("profiles")
      .select("id, email, full_name, account_type, company_name, phone, created_at")
      .order("created_at", { ascending: false }),
    admin.from("subscriptions").select("user_id, plan, status, current_period_end"),
    admin.from("plan_requests").select("user_id, phone").not("phone", "is", null),
  ]);

  if (profilesRes.error) return NextResponse.json({ error: profilesRes.error.message }, { status: 500 });
  if (subsRes.error) return NextResponse.json({ error: subsRes.error.message }, { status: 500 });
  if (planRequestsRes.error) return NextResponse.json({ error: planRequestsRes.error.message }, { status: 500 });

  const subsByUser = new Map((subsRes.data ?? []).map((s) => [s.user_id, s]));
  const phoneByUser = new Map<string, string>();
  for (const pr of planRequestsRes.data ?? []) {
    if (pr.phone && !phoneByUser.has(pr.user_id)) phoneByUser.set(pr.user_id, pr.phone);
  }

  const now = Date.now();
  const users = (profilesRes.data ?? []).map((p) => {
    const sub = subsByUser.get(p.id);
    const isPremium =
      !!sub &&
      (sub.status === "active" || sub.status === "trialing") &&
      !!sub.current_period_end &&
      new Date(sub.current_period_end).getTime() > now;

    return {
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      account_type: p.account_type,
      company_name: p.company_name,
      phone: p.phone ?? phoneByUser.get(p.id) ?? null,
      created_at: p.created_at,
      plan: isPremium ? "Premium" : "Free",
      subscription_status: sub?.status ?? null,
      current_period_end: sub?.current_period_end ?? null,
    };
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const body = await req.json().catch(() => null);
  const userId = body?.userId as string | undefined;
  const plan = body?.plan as "Premium" | "Free" | undefined;

  if (!userId || (plan !== "Premium" && plan !== "Free")) {
    return NextResponse.json({ error: "userId and plan ('Premium' | 'Free') are required" }, { status: 400 });
  }

  if (plan === "Premium") {
    const farFuture = new Date("2099-12-31T00:00:00Z").toISOString();
    const { data: existing } = await admin
      .from("subscriptions")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const { error } = existing
      ? await admin
          .from("subscriptions")
          .update({ plan: "ultra", status: "active", current_period_end: farFuture })
          .eq("user_id", userId)
      : await admin
          .from("subscriptions")
          .insert({ user_id: userId, plan: "ultra", status: "active", current_period_end: farFuture });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await admin
      .from("subscriptions")
      .update({ status: "canceled", current_period_end: null })
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
