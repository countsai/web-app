// Consultancy Invoice system — shared types, constants, and helpers.
// Keeps invoice concerns separate from certificate concerns.

export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'cancelled';

export interface ConsultancyInvoice {
  id: string;
  invoice_number: string;
  consultant_id: string | null;
  consultant_name: string;
  consultant_email: string;
  invoice_date: string;
  service_start_date: string;
  service_end_date: string;
  description: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  notes: string | null;
  pdf_storage_path: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceAuditLog {
  id: string;
  invoice_id: string;
  invoice_number: string;
  action: string;
  actor: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_SERVICE_DESCRIPTION =
  "Forward Deployed Engineering consultancy and AI engineering project support, " +
  "including Generative AI, LLM integration, AI agents and automations, " +
  "retrieval-augmented generation (RAG), embeddings and vector databases, " +
  "API and backend development, cloud-based AI applications, deployment, " +
  "system integration, evaluation and monitoring.";

export const CONSULTANCY_BASIS_TEXT =
  "This invoice records consultancy services provided to Counts AI Ltd by the " +
  "above-named consultant during the stated service period. The engagement was " +
  "undertaken on an independent consultant basis, in accordance with the terms " +
  "and conditions agreed between the consultant and Counts AI Ltd.";

export const INVOICE_LEGAL_NOTE =
  "This document records consultancy services and is not an employment contract. " +
  "The engagement terms, scope and payment arrangements are governed by the " +
  "agreement between the consultant and Counts AI Ltd.";

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft:     'Draft',
  issued:    'Issued',
  paid:      'Paid',
  cancelled: 'Cancelled',
};

export const SUPPORTED_CURRENCIES = ['GBP', 'USD', 'EUR'];

// ─── Invoice number generation ────────────────────────────────────────────────
// Generates CAI-INV-{YEAR}-{000001} style numbers.
// Count-based: caller passes the current year's existing count.

export function buildInvoiceNumber(year: number, seq: number): string {
  return `CAI-INV-${year}-${String(seq).padStart(6, '0')}`;
}

// ─── Currency formatting ──────────────────────────────────────────────────────

const CURRENCY_SYMBOLS: Record<string, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

export function formatCurrency(amount: number, currency = 'GBP'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + ' ';
  return `${symbol}${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Status colours (for admin UI) ───────────────────────────────────────────

export const STATUS_COLORS: Record<InvoiceStatus, { bg: string; text: string }> = {
  draft:     { bg: '#f0f4f8', text: '#4a6274' },
  issued:    { bg: '#e8f8f1', text: '#1f9d63' },
  paid:      { bg: '#e7f5f4', text: '#079DB3' },
  cancelled: { bg: '#fef0ef', text: '#c0392b' },
};

// ─── Issued invoice guard ─────────────────────────────────────────────────────
// Issued/paid invoices must not be silently modified.
// Callers check this before allowing field edits.

export function isImmutable(status: InvoiceStatus): boolean {
  return status === 'issued' || status === 'paid';
}
