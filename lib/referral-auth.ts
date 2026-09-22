import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const REFERRAL_SESSION_COOKIE = "referral_session";
const REFERRAL_SESSION_DAYS = 30;

export async function getReferralAccountId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFERRAL_SESSION_COOKIE)?.value;
  if (!token) return null;

  const admin = supabaseAdmin();
  const { data } = await admin
    .from("referral_sessions")
    .select("referral_account_id, expires_at")
    .eq("token", token)
    .maybeSingle();

  if (!data || new Date(data.expires_at) < new Date()) return null;
  return data.referral_account_id;
}

export async function createReferralSession(accountId: string): Promise<void> {
  const admin = supabaseAdmin();
  const expiresAt = new Date(Date.now() + REFERRAL_SESSION_DAYS * 86400000).toISOString();
  const { data, error } = await admin
    .from("referral_sessions")
    .insert({ referral_account_id: accountId, expires_at: expiresAt })
    .select("token")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create referral session");

  const cookieStore = await cookies();
  cookieStore.set(REFERRAL_SESSION_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: REFERRAL_SESSION_DAYS * 86400,
  });
}

export async function clearReferralSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(REFERRAL_SESSION_COOKIE)?.value;
  if (token) {
    const admin = supabaseAdmin();
    await admin.from("referral_sessions").delete().eq("token", token);
  }
  cookieStore.delete(REFERRAL_SESSION_COOKIE);
}

export async function generateUniqueReferralCode(name: string): Promise<string> {
  const admin = supabaseAdmin();
  const base = (name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 5) || "FRIEND");

  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
    const code = `${base}${suffix}`;
    const { data } = await admin
      .from("referral_accounts")
      .select("id")
      .eq("code", code)
      .maybeSingle();
    if (!data) return code;
  }

  throw new Error("Failed to generate a unique referral code");
}
