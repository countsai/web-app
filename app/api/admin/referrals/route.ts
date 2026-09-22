import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const [accountsRes, signupsRes, payoutsRes] = await Promise.all([
    admin
      .from("referral_accounts")
      .select("id, name, email, code, wallet_balance, total_earned, created_at")
      .order("created_at", { ascending: false }),
    admin
      .from("referred_signups")
      .select("id, referral_account_id, name, email, status, signed_up_at, converted_at"),
    admin
      .from("payout_requests")
      .select("id, referral_account_id, amount, status, requested_at, paid_at")
      .order("requested_at", { ascending: false }),
  ]);

  if (accountsRes.error) return NextResponse.json({ error: accountsRes.error.message }, { status: 500 });
  if (signupsRes.error) return NextResponse.json({ error: signupsRes.error.message }, { status: 500 });
  if (payoutsRes.error) return NextResponse.json({ error: payoutsRes.error.message }, { status: 500 });

  const accounts = (accountsRes.data ?? []).map((account) => ({
    ...account,
    referrals: (signupsRes.data ?? []).filter((s) => s.referral_account_id === account.id),
  }));

  return NextResponse.json({ accounts, payouts: payoutsRes.data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const status = body?.status as string | undefined;

  if (!id || status !== "paid") {
    return NextResponse.json({ error: "id and status='paid' are required" }, { status: 400 });
  }

  const { error } = await admin
    .from("payout_requests")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
