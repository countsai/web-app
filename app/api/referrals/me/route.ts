import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getReferralAccountId } from "@/lib/referral-auth";

export async function GET() {
  const accountId = await getReferralAccountId();
  if (!accountId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const admin = supabaseAdmin();
  const [accountRes, referralsRes, payoutsRes] = await Promise.all([
    admin
      .from("referral_accounts")
      .select("id, name, email, code, wallet_balance, total_earned, created_at")
      .eq("id", accountId)
      .single(),
    admin
      .from("referred_signups")
      .select("id, name, email, status, signed_up_at, converted_at")
      .eq("referral_account_id", accountId)
      .order("signed_up_at", { ascending: false }),
    admin
      .from("payout_requests")
      .select("id, amount, status, requested_at, paid_at")
      .eq("referral_account_id", accountId)
      .order("requested_at", { ascending: false }),
  ]);

  if (accountRes.error || !accountRes.data) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }
  if (referralsRes.error) return NextResponse.json({ error: referralsRes.error.message }, { status: 500 });
  if (payoutsRes.error) return NextResponse.json({ error: payoutsRes.error.message }, { status: 500 });

  return NextResponse.json({
    account: accountRes.data,
    referrals: referralsRes.data ?? [],
    payouts: payoutsRes.data ?? [],
  });
}
