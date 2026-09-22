import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword } from "@/lib/password";
import { createReferralSession, generateUniqueReferralCode } from "@/lib/referral-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = (body?.name as string | undefined)?.trim();
  const email = (body?.email as string | undefined)?.trim().toLowerCase();
  const password = body?.password as string | undefined;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: existing } = await admin
    .from("referral_accounts")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const code = await generateUniqueReferralCode(name);
  const password_hash = hashPassword(password);

  const { data: account, error } = await admin
    .from("referral_accounts")
    .insert({ name, email, password_hash, code })
    .select("id, name, email, code, wallet_balance, total_earned, created_at")
    .single();

  if (error || !account) {
    return NextResponse.json({ error: error?.message ?? "Failed to create account" }, { status: 500 });
  }

  await createReferralSession(account.id);

  return NextResponse.json({ account });
}
