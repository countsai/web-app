import { NextRequest, NextResponse } from "next/server";
import { stripe, PLANS } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, email, plan } = await req.json() as {
      userId: string;
      email: string;
      plan: "plus" | "ultra";
    };

    if (!userId || !email || !plan) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const planConfig = PLANS[plan];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Create or retrieve Stripe customer
    const existing = await stripe.customers.list({ email, limit: 1 });
    let customerId: string;

    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      subscription_data: planConfig.trialDays > 0
        ? { trial_period_days: planConfig.trialDays, metadata: { supabase_user_id: userId, plan } }
        : { metadata: { supabase_user_id: userId, plan } },
      success_url: `${appUrl}/auth/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/auth/register`,
      metadata: { supabase_user_id: userId, plan },
      allow_promotion_codes: true,
    });

    // Store customer ID in subscription record
    const admin = supabaseAdmin();
    await admin.from("subscriptions").upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      plan,
      status: planConfig.trialDays > 0 ? "trialing" : "incomplete",
      trial_ends_at: planConfig.trialDays > 0
        ? new Date(Date.now() + planConfig.trialDays * 86400000).toISOString()
        : null,
    }, { onConflict: "user_id" });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
