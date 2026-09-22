-- ============================================================
-- Consultancy Invoices Schema
-- Run this against your Supabase project after certificates-schema.sql
-- ============================================================

-- ── Status enum ─────────────────────────────────────────────
CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'paid', 'cancelled');

-- ── Main invoice table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.consultancy_invoices (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number      text UNIQUE NOT NULL,          -- CAI-INV-2026-000001
  consultant_id       uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  consultant_name     text NOT NULL,
  consultant_email    text NOT NULL,
  invoice_date        date NOT NULL,
  service_start_date  date NOT NULL,
  service_end_date    date NOT NULL,
  description         text NOT NULL,
  amount              numeric(12, 2) NOT NULL CHECK (amount >= 0),
  currency            text NOT NULL DEFAULT 'GBP',
  status              invoice_status NOT NULL DEFAULT 'draft',
  notes               text,
  pdf_storage_path    text,
  created_by          text DEFAULT 'admin',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ── Audit log ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invoice_audit_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id    uuid NOT NULL REFERENCES public.consultancy_invoices(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  action        text NOT NULL,  -- created | updated | pdf_generated | downloaded | cancelled | status_changed
  actor         text DEFAULT 'admin',
  metadata      jsonb DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Auto-update updated_at ───────────────────────────────────
CREATE OR REPLACE FUNCTION update_invoice_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoices_updated_at ON public.consultancy_invoices;
CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON public.consultancy_invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoice_updated_at();

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invoices_consultant_id ON public.consultancy_invoices(consultant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status        ON public.consultancy_invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date  ON public.consultancy_invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoice_audit_invoice_id ON public.invoice_audit_log(invoice_id);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE public.consultancy_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_audit_log    ENABLE ROW LEVEL SECURITY;

-- Consultants can only see their own invoices
CREATE POLICY "Consultants view own invoices"
  ON public.consultancy_invoices FOR SELECT
  USING (auth.uid() = consultant_id);

-- Admins (service role) bypass RLS entirely
-- (service role client used in all API routes)

-- Storage bucket for invoices (run separately in Supabase dashboard or use this as reference)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', false);
