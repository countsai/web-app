import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getReferralAccountId } from "@/lib/referral-auth";

export async function POST() {
  const accountId = await getReferralAccountId();
  if (!accountId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const admin = supabaseAdmin();
  const { data: account, error: accountError } = await admin
    .from("referral_accounts")
    .select("wallet_balance")
    .eq("id", accountId)
    .single();

  if (accountError || !account) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  if (account.wallet_balance <= 0) {
    return NextResponse.json({ error: "No balance available to withdraw yet." }, { status: 400 });
  }

  const { data: pending } = await admin
    .from("payout_requests")
    .select("id")
    .eq("referral_account_id", accountId)
    .eq("status", "requested")
    .maybeSingle();

  if (pending) {
    return NextResponse.json({ error: "Payout already requested. Payouts are processed monthly." }, { status: 409 });
  }

  const { error: insertError } = await admin.from("payout_requests").insert({
    referral_account_id: accountId,
    amount: account.wallet_balance,
    status: "requested",
  });
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  const { error: updateError } = await admin
    .from("referral_accounts")
    .update({ wallet_balance: 0 })
    .eq("id", accountId);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
