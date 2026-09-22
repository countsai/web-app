import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const admin = supabaseAdmin();

  const getUid = (obj: { metadata?: { supabase_user_id?: string } }) =>
    obj.metadata?.supabase_user_id ?? null;

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const uid = getUid(sub);
      if (!uid) break;

      // current_period_end lives on the subscription item in newer API versions
      const rawSub = sub as any;
      const periodEnd = rawSub.current_period_end ?? rawSub.items?.data?.[0]?.current_period_end;

      await admin.from("subscriptions").upsert({
        user_id: uid,
        stripe_subscription_id: sub.id,
        stripe_customer_id: sub.customer as string,
        plan: (sub.metadata.plan as "plus" | "ultra") ?? "plus",
        status: sub.status as any,
        trial_ends_at: sub.trial_end
          ? new Date(sub.trial_end * 1000).toISOString()
          : null,
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const uid = getUid(sub);
      if (!uid) break;

      await admin.from("subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("user_id", uid);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data } = await admin.from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (data) {
        await admin.from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("user_id", data.user_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
