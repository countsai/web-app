-- ============================================================
-- Certificate Management System — Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Atomic sequences for unique certificate IDs (per type, guaranteed no gaps on failure)
create sequence if not exists cert_seq_genai       start 1 increment 1;
create sequence if not exists cert_seq_fde         start 1 increment 1;
create sequence if not exists cert_seq_internship  start 1 increment 1;

-- ============================================================
-- Main certificates table
-- ============================================================
create table if not exists public.certificates (
  id                    uuid        default gen_random_uuid() primary key,
  certificate_id        text        not null unique,
  certificate_type      text        not null check (certificate_type in ('genai', 'fde', 'internship')),

  -- Student reference + snapshot (snapshot never changes even if profile is updated)
  student_id            uuid        references public.profiles(id) on delete set null,
  student_name          text        not null,
  student_email         text        not null,

  -- Certificate content snapshots
  program_name          text        not null,
  role                  text,                          -- internship: "Forward Deployed Engineer"
  completion_date       date,
  internship_start_date date,
  internship_end_date   date,
  issue_date            date        not null,
  skills                text[]      default '{}',
  template_id           text        default 'default' not null,

  -- Verification
  verification_url      text        not null,
  pdf_storage_path      text,

  -- Status
  status                text        not null default 'active'
                          check (status in ('active', 'revoked')),

  -- Revocation
  revoked_at            timestamptz,
  revoked_by            text,
  revocation_reason     text,

  -- Audit
  created_by            text        default 'admin',
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

-- Indexes
create index if not exists idx_cert_certificate_id   on public.certificates(certificate_id);
create index if not exists idx_cert_student_id       on public.certificates(student_id);
create index if not exists idx_cert_type             on public.certificates(certificate_type);
create index if not exists idx_cert_status           on public.certificates(status);
create index if not exists idx_cert_issue_date       on public.certificates(issue_date);
create index if not exists idx_cert_student_email    on public.certificates(student_email);

-- RLS
alter table public.certificates enable row level security;

drop policy if exists "Students can view own certificates" on public.certificates;
create policy "Students can view own certificates"
  on public.certificates for select
  using (auth.uid() = student_id);

drop policy if exists "Service role full access certificates" on public.certificates;
create policy "Service role full access certificates"
  on public.certificates for all
  using (auth.role() = 'service_role');

-- Updated_at trigger
drop trigger if exists certificates_updated_at on public.certificates;
create trigger certificates_updated_at
  before update on public.certificates
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Certificate audit log
-- ============================================================
create table if not exists public.certificate_audit_log (
  id              uuid        default gen_random_uuid() primary key,
  certificate_id  text        not null,
  action          text        not null,
  -- actions: 'created', 'viewed', 'downloaded', 'emailed', 'resent', 'revoked', 'status_changed'
  actor           text,       -- "admin" or admin identifier
  metadata        jsonb       default '{}' not null,
  created_at      timestamptz default now() not null
);

create index if not exists idx_cert_audit_cert_id on public.certificate_audit_log(certificate_id);
create index if not exists idx_cert_audit_created on public.certificate_audit_log(created_at);

alter table public.certificate_audit_log enable row level security;

drop policy if exists "Service role full access cert audit" on public.certificate_audit_log;
create policy "Service role full access cert audit"
  on public.certificate_audit_log for all
  using (auth.role() = 'service_role');

-- ============================================================
-- RPC: generate_certificate_id(cert_type)
-- Atomically draws from the right sequence and formats the ID.
-- Uses security definer so the service role can call it.
-- ============================================================
create or replace function generate_certificate_id(cert_type text)
returns text
language plpgsql
security definer
as $$
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

-- ============================================================
-- Storage bucket for certificate PDFs
-- ============================================================
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;

-- Service role: full access
drop policy if exists "Service role full access cert storage" on storage.objects;
create policy "Service role full access cert storage"
  on storage.objects for all
  using (bucket_id = 'certificates' and auth.role() = 'service_role');

-- Students: read their own certificate files
drop policy if exists "Students can read own cert files" on storage.objects;
create policy "Students can read own cert files"
  on storage.objects for select
  using (bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text);

notify pgrst, 'reload schema';
