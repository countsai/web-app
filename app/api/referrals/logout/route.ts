import { NextResponse } from "next/server";
import { clearReferralSession } from "@/lib/referral-auth";

export async function POST() {
  await clearReferralSession();
  return NextResponse.json({ ok: true });
}
