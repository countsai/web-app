-- ============================================================
-- CountsAI Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Profiles (extends Supabase Auth users)
create table if not exists public.profiles (
  id              uuid references auth.users on delete cascade primary key,
  email           text not null,
  full_name       text,
  account_type    text check (account_type in ('jobseeker', 'business')) not null,
  company_name    text,
  created_at      timestamptz default now() not null
);

-- Migration: contact phone number for admin outreach
alter table public.profiles add column if not exists phone text;

-- Subscriptions
create table if not exists public.subscriptions (
  id                      uuid default gen_random_uuid() primary key,
  user_id                 uuid references public.profiles(id) on delete cascade not null unique,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  plan                   text check (plan in ('plus', 'ultra')) default 'plus' not null,
  status                  text check (status in ('trialing', 'active', 'canceled', 'past_due', 'incomplete')) not null,
  trial_ends_at           timestamptz,
  current_period_end      timestamptz,
  razorpay_payment_id     text unique,
  created_at              timestamptz default now() not null,
  updated_at              timestamptz default now() not null
);

-- Plan requests (manual payment collection while Stripe/Razorpay isn't live yet)
create table if not exists public.plan_requests (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references public.profiles(id) on delete cascade not null,
  full_name       text not null,
  email           text not null,
  phone           text,
  plan            text check (plan in ('plus', 'ultra', 'premium')) not null,
  status          text check (status in ('pending', 'contacted', 'paid', 'cancelled')) default 'pending' not null,
  created_at      timestamptz default now() not null
);

-- Migration: add Razorpay payment tracking to existing subscriptions table
alter table public.subscriptions add column if not exists razorpay_payment_id text unique;

-- Row Level Security
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.plan_requests enable row level security;

-- Policies: users can read/update their own data
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can view own plan requests" on public.plan_requests;
create policy "Users can view own plan requests"
  on public.plan_requests for select
  using (auth.uid() = user_id);

-- Service role can do everything (used by API routes)
drop policy if exists "Service role full access profiles" on public.profiles;
create policy "Service role full access profiles"
  on public.profiles for all
  using (auth.role() = 'service_role');

drop policy if exists "Service role full access subscriptions" on public.subscriptions;
create policy "Service role full access subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');

drop policy if exists "Service role full access plan requests" on public.plan_requests;
create policy "Service role full access plan requests"
  on public.plan_requests for all
  using (auth.role() = 'service_role');

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Rocket Boost: Candidate Master Profile
-- ============================================================

create table if not exists public.candidate_profiles (
  id                    uuid references public.profiles(id) on delete cascade primary key,
  resume_url            text,
  resume_filename       text,
  headline              text default '' not null,
  summary               text default '' not null,
  skills                text[] default '{}' not null,
  target_roles          text[] default '{}' not null,
  preferred_locations   text[] default '{}' not null,
  salary_min            integer,
  salary_max            integer,
  salary_currency       text default 'GBP' not null,
  notice_period         text default '' not null,
  visa_status           text default '' not null,
  linkedin_url          text default '' not null,
  github_url            text default '' not null,
  portfolio_url         text default '' not null,
  experience            jsonb default '[]' not null,
  education             jsonb default '[]' not null,
  certifications        jsonb default '[]' not null,
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

alter table public.candidate_profiles enable row level security;

drop policy if exists "Users can view own candidate profile" on public.candidate_profiles;
create policy "Users can view own candidate profile"
  on public.candidate_profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own candidate profile" on public.candidate_profiles;
create policy "Users can insert own candidate profile"
  on public.candidate_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own candidate profile" on public.candidate_profiles;
create policy "Users can update own candidate profile"
  on public.candidate_profiles for update
  using (auth.uid() = id);

drop policy if exists "Service role full access candidate profiles" on public.candidate_profiles;
create policy "Service role full access candidate profiles"
  on public.candidate_profiles for all
  using (auth.role() = 'service_role');

drop trigger if exists candidate_profiles_updated_at on public.candidate_profiles;
create trigger candidate_profiles_updated_at
  before update on public.candidate_profiles
  for each row execute procedure public.handle_updated_at();

-- Migration: admin vetting fields for the "Verify Candidates" admin workspace
alter table public.candidate_profiles add column if not exists verification_status text default 'Profile Submitted' not null;
alter table public.candidate_profiles add column if not exists admin_notes text default '' not null;

-- Migration: extended profile fields for onboarding wizard
alter table public.candidate_profiles add column if not exists title text default '' not null;
alter table public.candidate_profiles add column if not exists first_name text default '' not null;
alter table public.candidate_profiles add column if not exists last_name text default '' not null;
alter table public.candidate_profiles add column if not exists languages jsonb default '[]' not null;
alter table public.candidate_profiles add column if not exists publications jsonb default '[]' not null;
alter table public.candidate_profiles add column if not exists research_works jsonb default '[]' not null;
alter table public.candidate_profiles add column if not exists awards jsonb default '[]' not null;
alter table public.candidate_profiles add column if not exists onboarding_completed boolean default false not null;

-- Storage bucket for resume uploads (private — accessed via signed URLs)
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do nothing;

drop policy if exists "Users can upload own resume" on storage.objects;
create policy "Users can upload own resume"
  on storage.objects for insert
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update own resume" on storage.objects;
create policy "Users can update own resume"
  on storage.objects for update
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can read own resume" on storage.objects;
create policy "Users can read own resume"
  on storage.objects for select
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete own resume" on storage.objects;
create policy "Users can delete own resume"
  on storage.objects for delete
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- Referral Partner Programme
-- ============================================================
-- Referral partners have their own login, separate from Supabase Auth.
-- All access goes through service-role API routes (/api/referrals/*,
-- /api/admin/referrals), so RLS below only grants the service role.

create table if not exists public.referral_accounts (
  id              uuid default gen_random_uuid() primary key,
  name            text not null,
  email           text not null unique,
  password_hash   text not null,
  code            text not null unique,
  wallet_balance  numeric default 0 not null,
  total_earned    numeric default 0 not null,
  created_at      timestamptz default now() not null
);

create table if not exists public.referral_sessions (
  token                 uuid default gen_random_uuid() primary key,
  referral_account_id   uuid references public.referral_accounts(id) on delete cascade not null,
  created_at            timestamptz default now() not null,
  expires_at            timestamptz not null
);

create table if not exists public.referred_signups (
  id                    uuid default gen_random_uuid() primary key,
  referral_account_id   uuid references public.referral_accounts(id) on delete cascade not null,
  name                  text not null,
  email                 text not null,
  status                text check (status in ('pending', 'success')) default 'pending' not null,
  signed_up_at          timestamptz default now() not null,
  converted_at          timestamptz
);

create table if not exists public.payout_requests (
  id                    uuid default gen_random_uuid() primary key,
  referral_account_id   uuid references public.referral_accounts(id) on delete cascade not null,
  amount                numeric not null,
  status                text check (status in ('requested', 'paid')) default 'requested' not null,
  requested_at          timestamptz default now() not null,
  paid_at               timestamptz
);

alter table public.referral_accounts enable row level security;
alter table public.referral_sessions  enable row level security;
alter table public.referred_signups   enable row level security;
alter table public.payout_requests    enable row level security;

drop policy if exists "Service role full access referral accounts" on public.referral_accounts;
create policy "Service role full access referral accounts"
  on public.referral_accounts for all
  using (auth.role() = 'service_role');

drop policy if exists "Service role full access referral sessions" on public.referral_sessions;
create policy "Service role full access referral sessions"
  on public.referral_sessions for all
  using (auth.role() = 'service_role');

drop policy if exists "Service role full access referred signups" on public.referred_signups;
create policy "Service role full access referred signups"
  on public.referred_signups for all
  using (auth.role() = 'service_role');

drop policy if exists "Service role full access payout requests" on public.payout_requests;
create policy "Service role full access payout requests"
  on public.payout_requests for all
  using (auth.role() = 'service_role');

-- ============================================================
-- Visa & Relocation Guides
-- ============================================================
-- Managed by admins, readable by everyone (public marketing pages
-- and the candidate Visa Hub both read this table directly).

create table if not exists public.visa_guides (
  id                      uuid default gen_random_uuid() primary key,
  country                 text not null,
  country_code            text default '' not null,
  title                   text default '' not null,
  content                 text default '' not null,
  visa_type               text default '' not null,
  processing_time         text default '' not null,
  difficulty              text check (difficulty in ('Easy', 'Medium', 'Hard')) default 'Medium' not null,
  sponsorship_likelihood  text default '' not null,
  created_at              timestamptz default now() not null,
  updated_at              timestamptz default now() not null
);

alter table public.visa_guides enable row level security;

drop policy if exists "Anyone can view visa guides" on public.visa_guides;
create policy "Anyone can view visa guides"
  on public.visa_guides for select
  using (true);

drop policy if exists "Service role full access visa guides" on public.visa_guides;
create policy "Service role full access visa guides"
  on public.visa_guides for all
  using (auth.role() = 'service_role');

drop trigger if exists visa_guides_updated_at on public.visa_guides;
create trigger visa_guides_updated_at
  before update on public.visa_guides
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Jobs
-- ============================================================

create table if not exists public.jobs (
  id               uuid default gen_random_uuid() primary key,
  title            text not null,
  company          text default '' not null,
  location         text default '' not null,
  remote_type      text default '' not null,
  employment_type  text default 'Full-time' not null,
  salary_range     text default '' not null,
  experience_level text default '' not null,
  skills           text[] default '{}' not null,
  description      text default '' not null,
  requirements     text default '' not null,
  application_url  text default '' not null,
  closing_date     date,
  access_type      text check (access_type in ('free', 'pro')) default 'free' not null,
  published        boolean default false not null,
  featured         boolean default false not null,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

alter table public.jobs enable row level security;

drop policy if exists "Anyone can view published jobs" on public.jobs;
create policy "Anyone can view published jobs"
  on public.jobs for select using (published = true);

drop policy if exists "Service role full access jobs" on public.jobs;
create policy "Service role full access jobs"
  on public.jobs for all using (auth.role() = 'service_role');

drop trigger if exists jobs_updated_at on public.jobs;
create trigger jobs_updated_at
  before update on public.jobs
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Training Applications
-- ============================================================

create table if not exists public.training_applications (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references public.profiles(id) on delete set null,
  full_name        text not null,
  email            text not null,
  phone            text not null,
  country          text not null,
  city             text,
  education        text not null,
  university       text,
  graduation_year  text,
  applicant_role   text,
  years_experience text,
  technical_skills text,
  ai_experience    text,
  github_url       text,
  linkedin_url     text,
  portfolio_url    text,
  resume_url       text,
  motivation       text not null,
  preferred_start  text,
  status           text check (status in ('new','reviewing','shortlisted','accepted','rejected','enrolled','completed')) default 'new' not null,
  admin_notes      text default '' not null,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

alter table public.training_applications enable row level security;

drop policy if exists "Service role full access training applications" on public.training_applications;
create policy "Service role full access training applications"
  on public.training_applications for all using (auth.role() = 'service_role');

drop trigger if exists training_applications_updated_at on public.training_applications;
create trigger training_applications_updated_at
  before update on public.training_applications
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Business Leads
-- ============================================================

create table if not exists public.business_leads (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  company      text not null,
  email        text not null,
  website      text,
  country      text,
  company_size text,
  service      text not null,
  description  text not null,
  timeline     text,
  budget       text,
  status       text check (status in ('new','contacted','qualified','proposal','won','lost')) default 'new' not null,
  admin_notes  text default '' not null,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

alter table public.business_leads enable row level security;

drop policy if exists "Service role full access business leads" on public.business_leads;
create policy "Service role full access business leads"
  on public.business_leads for all using (auth.role() = 'service_role');

drop trigger if exists business_leads_updated_at on public.business_leads;
create trigger business_leads_updated_at
  before update on public.business_leads
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Free Consultations
-- ============================================================

create table if not exists public.consultations (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  email        text,
  phone        text not null,
  country_code text default '+44' not null,
  interested_in text not null,
  status       text check (status in ('new','contacted','converted','closed')) default 'new' not null,
  admin_notes  text default '' not null,
  created_at   timestamptz default now() not null
);

alter table public.consultations enable row level security;

drop policy if exists "Service role full access consultations" on public.consultations;
create policy "Service role full access consultations"
  on public.consultations for all using (auth.role() = 'service_role');

-- ============================================================
-- Program Interests (Join Now clicks for 3-month program)
-- ============================================================

create table if not exists public.program_interests (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete set null,
  name       text,
  email      text not null,
  status     text check (status in ('interested','contacted','enrolled','dropped')) default 'interested' not null,
  admin_notes text default '' not null,
  created_at timestamptz default now() not null
);

alter table public.program_interests enable row level security;

drop policy if exists "Service role full access program interests" on public.program_interests;
create policy "Service role full access program interests"
  on public.program_interests for all using (auth.role() = 'service_role');

-- ============================================================
-- Talent Pool (resume submissions for future roles)
-- ============================================================

create table if not exists public.talent_pool (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles(id) on delete set null,
  name       text not null,
  email      text not null,
  phone      text,
  skills     text,
  message    text,
  resume_url text,
  status     text check (status in ('new','reviewed','shortlisted','contacted')) default 'new' not null,
  admin_notes text default '' not null,
  created_at timestamptz default now() not null
);

alter table public.talent_pool enable row level security;

drop policy if exists "Service role full access talent pool" on public.talent_pool;
create policy "Service role full access talent pool"
  on public.talent_pool for all using (auth.role() = 'service_role');

-- ============================================================
-- Certificate Management System
-- ============================================================

create sequence if not exists cert_seq_genai       start 1 increment 1;
create sequence if not exists cert_seq_fde         start 1 increment 1;
create sequence if not exists cert_seq_internship  start 1 increment 1;

create table if not exists public.certificates (
  id                    uuid        default gen_random_uuid() primary key,
  certificate_id        text        not null unique,
  certificate_type      text        not null check (certificate_type in ('genai', 'fde', 'internship')),
  student_id            uuid        references public.profiles(id) on delete set null,
  student_name          text        not null,
  student_email         text        not null,
  program_name          text        not null,
  role                  text,
  completion_date       date,
  internship_start_date date,
  internship_end_date   date,
  issue_date            date        not null,
  skills                text[]      default '{}',
  template_id           text        default 'default' not null,
  verification_url      text        not null,
  pdf_storage_path      text,
  status                text        not null default 'active' check (status in ('active', 'revoked')),
  revoked_at            timestamptz,
  revoked_by            text,
  revocation_reason     text,
  created_by            text        default 'admin',
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

create index if not exists idx_cert_certificate_id on public.certificates(certificate_id);
create index if not exists idx_cert_student_id     on public.certificates(student_id);
create index if not exists idx_cert_type           on public.certificates(certificate_type);
create index if not exists idx_cert_status         on public.certificates(status);
create index if not exists idx_cert_issue_date     on public.certificates(issue_date);

alter table public.certificates enable row level security;

drop policy if exists "Students can view own certificates" on public.certificates;
create policy "Students can view own certificates"
  on public.certificates for select using (auth.uid() = student_id);

drop policy if exists "Service role full access certificates" on public.certificates;
create policy "Service role full access certificates"
  on public.certificates for all using (auth.role() = 'service_role');

drop trigger if exists certificates_updated_at on public.certificates;
create trigger certificates_updated_at
  before update on public.certificates
  for each row execute procedure public.handle_updated_at();

create table if not exists public.certificate_audit_log (
  id              uuid        default gen_random_uuid() primary key,
  certificate_id  text        not null,
  action          text        not null,
  actor           text,
  metadata        jsonb       default '{}' not null,
  created_at      timestamptz default now() not null
);

create index if not exists idx_cert_audit_cert_id on public.certificate_audit_log(certificate_id);

alter table public.certificate_audit_log enable row level security;

drop policy if exists "Service role full access cert audit" on public.certificate_audit_log;
create policy "Service role full access cert audit"
  on public.certificate_audit_log for all using (auth.role() = 'service_role');

create or replace function generate_certificate_id(cert_type text)
returns text language plpgsql security definer as $$
declare
  seq_val  bigint;
  year_str text := to_char(now(), 'YYYY');
  prefix   text;
begin
  if cert_type = 'genai' then
    select nextval('cert_seq_genai') into seq_val;
    prefix := 'CAI-GENAI-' || year_str || '-';
  elsif cert_type = 'fde' then
    select nextval('cert_seq_fde') into seq_val;
    prefix := 'CAI-FDE-' || year_str || '-';
  elsif cert_type = 'internship' then
    select nextval('cert_seq_internship') into seq_val;
    prefix := 'CAI-FDE-INT-' || year_str || '-';
  else
    raise exception 'Invalid certificate type: %', cert_type;
  end if;
  return prefix || lpad(seq_val::text, 6, '0');
end;
$$;

insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;

drop policy if exists "Service role full access cert storage" on storage.objects;
create policy "Service role full access cert storage"
  on storage.objects for all
  using (bucket_id = 'certificates' and auth.role() = 'service_role');

drop policy if exists "Students can read own cert files" on storage.objects;
create policy "Students can read own cert files"
  on storage.objects for select
  using (bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text);

-- Force PostgREST schema cache refresh
notify pgrst, 'reload schema';
