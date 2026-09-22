import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnon);

// Server-side client with elevated privileges (API routes only)
export function supabaseAdmin() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type AccountType     = "jobseeker" | "business";
export type PlanStatus      = "trialing" | "active" | "canceled" | "past_due" | "incomplete";
export type PlanName        = "plus" | "ultra";
export type PlanRequestStatus = "pending" | "contacted" | "paid" | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  account_type: AccountType;
  company_name: string | null;
  phone: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: PlanName;
  status: PlanStatus;
  trial_ends_at: string | null;
  current_period_end: string | null;
  created_at: string;
}

// Manual payment requests — collected directly while Stripe/Razorpay isn't live yet
export interface PlanRequest {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  plan: PlanName;
  status: PlanRequestStatus;
  created_at: string;
}

// Rocket Boost: candidate master profile
export interface CandidateProfile {
  id: string;
  resume_url: string | null;
  resume_filename: string | null;
  headline: string;
  summary: string;
  skills: string[];
  target_roles: string[];
  preferred_locations: string[];
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  notice_period: string;
  visa_status: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  experience: unknown[];
  education: unknown[];
  certifications: unknown[];
  verification_status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Referral Partner Programme
// ============================================================

export interface ReferralAccount {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  code: string;
  wallet_balance: number;
  total_earned: number;
  created_at: string;
}

export type ReferredSignupStatus = "pending" | "success";

export interface ReferredSignup {
  id: string;
  referral_account_id: string;
  name: string;
  email: string;
  status: ReferredSignupStatus;
  signed_up_at: string;
  converted_at: string | null;
}

export type PayoutRequestStatus = "requested" | "paid";

export interface PayoutRequest {
  id: string;
  referral_account_id: string;
  amount: number;
  status: PayoutRequestStatus;
  requested_at: string;
  paid_at: string | null;
}
