import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { REFERRAL_COMMISSION } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = (body?.code as string | undefined)?.trim().toUpperCase();
  const name = body?.name as string | undefined;
  const email = (body?.email as string | undefined)?.trim().toLowerCase();
  const plan = body?.plan as "free" | "premium" | undefined;

  if (!code || !name || !email || (plan !== "free" && plan !== "premium")) {
    return NextResponse.json({ error: "code, name, email and plan are required" }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: account } = await admin
    .from("referral_accounts")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (!account) return NextResponse.json({ ok: true });

  const { data: existing } = await admin
    .from("referred_signups")
    .select("id")
    .eq("referral_account_id", account.id)
    .eq("email", email)
    .maybeSingle();

  if (existing) return NextResponse.json({ ok: true });

  const status = plan === "premium" ? "success" : "pending";
  const now = new Date().toISOString();

  const { error: insertError } = await admin.from("referred_signups").insert({
    referral_account_id: account.id,
    name,
    email,
    status,
    signed_up_at: now,
    converted_at: status === "success" ? now : null,
  });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  if (status === "success") {
    const { data: acc } = await admin
      .from("referral_accounts")
      .select("wallet_balance, total_earned")
      .eq("id", account.id)
      .single();

    if (acc) {
      await admin
        .from("referral_accounts")
        .update({
          wallet_balance: acc.wallet_balance + REFERRAL_COMMISSION,
          total_earned: acc.total_earned + REFERRAL_COMMISSION,
        })
        .eq("id", account.id);
    }
  }

  return NextResponse.json({ ok: true });
}
