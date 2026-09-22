import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPassword } from "@/lib/password";
import { createReferralSession } from "@/lib/referral-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = (body?.email as string | undefined)?.trim().toLowerCase();
  const password = body?.password as string | undefined;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: account, error } = await admin
    .from("referral_accounts")
    .select("id, name, email, code, wallet_balance, total_earned, created_at, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!account || !verifyPassword(password, account.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createReferralSession(account.id);

  return NextResponse.json({
    account: {
      id: account.id,
      name: account.name,
      email: account.email,
      code: account.code,
      wallet_balance: account.wallet_balance,
      total_earned: account.total_earned,
      created_at: account.created_at,
    },
  });
}
