import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const PRO_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 1 month

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment_link.paid" || event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const email = (payment?.email as string | undefined)?.trim().toLowerCase();

    if (email) {
      const admin = supabaseAdmin();
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (profile) {
        await admin.from("subscriptions").upsert({
          user_id: profile.id,
          plan: "plus",
          status: "active",
          current_period_end: new Date(Date.now() + PRO_DURATION_MS).toISOString(),
          razorpay_payment_id: payment.id,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
    }
  }

  return NextResponse.json({ received: true });
}
