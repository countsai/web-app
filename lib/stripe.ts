import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const PLANS = {
  plus: {
    name: "Career Plus",
    priceId: process.env.STRIPE_PLUS_PRICE_ID!,
    amount: 2900,
    currency: "gbp",
    trialDays: 7,
  },
  ultra: {
    name: "Career Ultra",
    priceId: process.env.STRIPE_ULTRA_PRICE_ID!,
    amount: 7900,
    currency: "gbp",
    trialDays: 0,
  },
} as const;
