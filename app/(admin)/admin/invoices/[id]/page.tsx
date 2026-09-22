"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FileDown, ArrowLeft, AlertTriangle } from "lucide-react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  formatCurrency,
  isImmutable,
  CONSULTANCY_BASIS_TEXT,
  SUPPORTED_CURRENCIES,
} from "@/lib/invoices";
import type { ConsultancyInvoice, InvoiceAuditLog, InvoiceStatus } from "@/lib/invoices";

const inputStyle: React.CSSProperties = {
  padding: "9px 13px",
  border: "1px solid #D7E2E4",
  borderRadius: "4px",
  fontSize: "13px",
  color: "#062F36",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#536B73",
  letterSpacing: "1.5px",
  marginBottom: "5px",
};

const NAVY = "#062F36";
const TEAL = "#079DB3";

function fmtDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [invoice, setInvoice]   = useState<ConsultancyInvoice | null>(null);
  const [auditLog, setAuditLog] = useState<InvoiceAuditLog[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Edit state
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState("");

  // Editable fields
  const [eStatus, setEStatus]   = useState<InvoiceStatus>("draft");
  const [eAmount, setEAmount]   = useState("");
  const [eCurrency, setECurrency] = useState("GBP");
  const [eDesc, setEDesc]       = useState("");
  const [eNotes, setENotes]     = useState("");
  const [eInvDate, setEInvDate] = useState("");
  const [eStart, setEStart]     = useState("");
  const [eEnd, setEEnd]         = useState("");
  const [eName, setEName]       = useState("");
  const [eEmail, setEEmail]     = useState("");

  // PDF
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError]     = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/admin/invoices/${id}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Not found."); setLoading(false); return; }
      setInvoice(data.data);
      setAuditLog(data.auditLog ?? []);
      populateForm(data.data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (inv: ConsultancyInvoice) => {
    setEStatus(inv.status);
    setEAmount(String(inv.amount));
    setECurrency(inv.currency);
    setEDesc(inv.description);
    setENotes(inv.notes ?? "");
    setEInvDate(inv.invoice_date);
    setEStart(inv.service_start_date);
    setEEnd(inv.service_end_date);
    setEName(inv.consultant_name);
    setEEmail(inv.consultant_email);
  };

  useEffect(() => { load(); }, [id]);

  const save = async () => {
    if (!invoice) return;
    setSaving(true);
    setSaveError("");
    try {
      const body: Record<string, unknown> = {
        status:           eStatus,
        notes:            eNotes || null,
        invoice_date:     eInvDate,
        consultant_name:  eName,
        consultant_email: eEmail,
      };
      if (!isImmutable(invoice.status) || eStatus !== invoice.status) {
        body.amount           = Number(eAmount);
        body.currency         = eCurrency;
        body.description      = eDesc;
        body.service_start_date = eStart;
        body.service_end_date   = eEnd;
      }
      const res  = await fetch(`/api/admin/invoices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Save failed."); setSaving(false); return; }
      setInvoice(data.data);
      populateForm(data.data);
      setEditing(false);
    } catch (e) {
      setSaveError(String(e));
    } finally {
      setSaving(false);
    }
  };

  const generatePdf = async () => {
    if (!invoice) return;
    setPdfLoading(true);
    setPdfError("");
    try {
      const res  = await fetch(`/api/admin/invoices/${id}/pdf`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setPdfError(data.error ?? "PDF generation failed."); return; }
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
      await load();
    } catch (e) {
      setPdfError(String(e));
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadExisting = async () => {
    setPdfLoading(true);
    setPdfError("");
    try {
      const res  = await fetch(`/api/admin/invoices/${id}/pdf`);
      const data = await res.json();
      if (!res.ok) { setPdfError(data.error ?? "Could not get PDF link."); return; }
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) return <div style={{ padding: "48px", color: NAVY, fontFamily: "'Helvetica Neue', sans-serif" }}>Loading…</div>;
  if (error)   return <div style={{ padding: "48px", color: "#c0392b", fontFamily: "'Helvetica Neue', sans-serif" }}>{error}</div>;
  if (!invoice) return null;

  const immutable = isImmutable(invoice.status);
  const colors    = STATUS_COLORS[invoice.status];

  return (
    <div style={{ padding: "32px 40px", fontFamily: "'Helvetica Neue', sans-serif", color: NAVY, maxWidth: "900px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "#536B73", marginBottom: "24px" }}>
        <Link href="/admin/invoices" style={{ color: "#536B73", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
          <ArrowLeft size={13} /> Invoices
        </Link>
        <span>·</span>
        <span style={{ fontFamily: "monospace", fontSize: "12px", color: NAVY }}>{invoice.invoice_number}</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 700, color: TEAL, letterSpacing: "2.5px" }}>CONSULTANCY INVOICE</p>
          <h1 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: 900 }}>{invoice.consultant_name}</h1>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontFamily: "monospace", fontSize: "13px", color: "#536B73" }}>{invoice.invoice_number}</span>
            <span style={{ background: colors.bg, color: colors.text, padding: "3px 10px", borderRadius: "3px", fontSize: "11px", fontWeight: 700 }}>
              {STATUS_LABELS[invoice.status]}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {invoice.pdf_storage_path ? (
            <button onClick={downloadExisting} disabled={pdfLoading} style={{ padding: "9px 16px", border: "1px solid #D7E2E4", borderRadius: "4px", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", color: "#536B73", background: "#fff" }}>
              <FileDown size={13} /> {pdfLoading ? "…" : "Download PDF"}
            </button>
          ) : null}
          <button onClick={generatePdf} disabled={pdfLoading} style={{ padding: "9px 16px", background: TEAL, color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            <FileDown size={13} /> {pdfLoading ? "Generating…" : invoice.pdf_storage_path ? "Re-generate PDF" : "Generate PDF"}
          </button>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ padding: "9px 16px", background: NAVY, color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              Edit
            </button>
          )}
        </div>
      </div>

      {pdfError && (
        <div style={{ background: "#fef0ef", border: "1px solid #f5b7b1", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#c0392b", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={14} /> {pdfError}
        </div>
      )}

      {/* Immutability warning */}
      {immutable && !editing && (
        <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "12px", color: "#7d5c00", display: "flex", gap: "8px", alignItems: "center" }}>
          <AlertTriangle size={14} /> This invoice is <strong>{STATUS_LABELS[invoice.status]}</strong>. Financial fields are locked. Change status to Draft to edit amounts, dates, or description.
        </div>
      )}

      {/* Edit form */}
      {editing ? (
        <div style={{ border: "1px solid #D7E2E4", borderRadius: "4px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ margin: "0 0 18px", fontSize: "11px", fontWeight: 700, color: TEAL, letterSpacing: "2.5px" }}>EDIT INVOICE</p>

          {saveError && (
            <div style={{ background: "#fef0ef", border: "1px solid #f5b7b1", borderRadius: "4px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px", color: "#c0392b" }}>
              {saveError}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={labelStyle}>CONSULTANT NAME</label>
              <input value={eName} onChange={e => setEName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>CONSULTANT EMAIL</label>
              <input type="email" value={eEmail} onChange={e => setEEmail(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={labelStyle}>STATUS</label>
              <select value={eStatus} onChange={e => setEStatus(e.target.value as InvoiceStatus)} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="issued">Issued</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>INVOICE DATE</label>
              <input type="date" value={eInvDate} onChange={e => setEInvDate(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>SERVICE START</label>
              <input type="date" value={eStart} onChange={e => setEStart(e.target.value)} disabled={immutable && eStatus === invoice.status} style={{ ...inputStyle, opacity: (immutable && eStatus === invoice.status) ? 0.5 : 1 }} />
            </div>
            <div>
              <label style={labelStyle}>SERVICE END</label>
              <input type="date" value={eEnd} onChange={e => setEEnd(e.target.value)} disabled={immutable && eStatus === invoice.status} style={{ ...inputStyle, opacity: (immutable && eStatus === invoice.status) ? 0.5 : 1 }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
            <div>
              <label style={labelStyle}>AMOUNT {immutable && eStatus === invoice.status ? "(locked)" : "*"}</label>
              <input type="number" min="0" step="0.01" value={eAmount} onChange={e => setEAmount(e.target.value)} disabled={immutable && eStatus === invoice.status} style={{ ...inputStyle, opacity: (immutable && eStatus === invoice.status) ? 0.5 : 1 }} />
            </div>
            <div>
              <label style={labelStyle}>CURRENCY</label>
              <select value={eCurrency} onChange={e => setECurrency(e.target.value)} disabled={immutable && eStatus === invoice.status} style={{ ...inputStyle, opacity: (immutable && eStatus === invoice.status) ? 0.5 : 1 }}>
                {SUPPORTED_CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>DESCRIPTION {immutable && eStatus === invoice.status ? "(locked)" : ""}</label>
            <textarea rows={4} value={eDesc} onChange={e => setEDesc(e.target.value)} disabled={immutable && eStatus === invoice.status} style={{ ...inputStyle, resize: "vertical", opacity: (immutable && eStatus === invoice.status) ? 0.5 : 1 }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>NOTES</label>
            <textarea rows={2} value={eNotes} onChange={e => setENotes(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={save} disabled={saving} style={{ padding: "9px 22px", background: NAVY, color: "#fff", border: "none", borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: saving ? "default" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button onClick={() => { setEditing(false); setSaveError(""); populateForm(invoice); }} style={{ padding: "9px 16px", border: "1px solid #D7E2E4", borderRadius: "4px", fontSize: "13px", color: "#536B73", background: "#fff", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* View mode — two-column detail grid */
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: "1px solid #D7E2E4", borderRadius: "4px", marginBottom: "24px", overflow: "hidden" }}>
          {[
            ["Invoice Number", invoice.invoice_number, true],
            ["Status",         STATUS_LABELS[invoice.status]],
            ["Invoice Date",   fmtDate(invoice.invoice_date)],
            ["Currency",       invoice.currency],
            ["Service Period", `${fmtDate(invoice.service_start_date)} to ${fmtDate(invoice.service_end_date)}`],
            ["Amount",         formatCurrency(invoice.amount, invoice.currency)],
          ].map(([label, value, mono], i) => (
            <div key={String(label)} style={{ padding: "14px 18px", borderBottom: "1px solid #D7E2E4", background: i % 2 === 0 ? "#fff" : "#FAFCFC" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#8AA5AB", letterSpacing: "1.5px", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: NAVY, fontFamily: mono ? "monospace" : undefined }}>{value}</div>
            </div>
          ))}

          <div style={{ gridColumn: "1 / -1", padding: "14px 18px", borderBottom: "1px solid #D7E2E4" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#8AA5AB", letterSpacing: "1.5px", marginBottom: "4px" }}>CONSULTANT</div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>{invoice.consultant_name}</div>
            <div style={{ fontSize: "12px", color: "#536B73" }}>{invoice.consultant_email}</div>
          </div>

          <div style={{ gridColumn: "1 / -1", padding: "14px 18px", borderBottom: "1px solid #D7E2E4" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#8AA5AB", letterSpacing: "1.5px", marginBottom: "6px" }}>SERVICE DESCRIPTION</div>
            <div style={{ fontSize: "13px", lineHeight: "1.6", color: NAVY }}>{invoice.description}</div>
          </div>

          {/* Consultancy basis box */}
          <div style={{ gridColumn: "1 / -1", padding: "14px 18px", borderBottom: invoice.notes ? "1px solid #D7E2E4" : undefined, background: "#f4fbfc", borderLeft: `3px solid ${TEAL}` }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: TEAL, letterSpacing: "1.5px", marginBottom: "6px" }}>CONSULTANCY BASIS</div>
            <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#536B73" }}>{CONSULTANCY_BASIS_TEXT}</div>
          </div>

          {invoice.notes && (
            <div style={{ gridColumn: "1 / -1", padding: "14px 18px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#8AA5AB", letterSpacing: "1.5px", marginBottom: "6px" }}>NOTES</div>
              <div style={{ fontSize: "13px", lineHeight: "1.6", color: NAVY }}>{invoice.notes}</div>
            </div>
          )}
        </div>
      )}

      {/* Audit log */}
      <div>
        <p style={{ margin: "0 0 12px", fontSize: "11px", fontWeight: 700, color: "#8AA5AB", letterSpacing: "2px" }}>AUDIT LOG</p>
        {auditLog.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#536B73" }}>No audit entries.</p>
        ) : (
          <div style={{ border: "1px solid #D7E2E4", borderRadius: "4px", overflow: "hidden" }}>
            {auditLog.map((entry, i) => (
              <div key={entry.id} style={{ padding: "10px 16px", borderBottom: i < auditLog.length - 1 ? "1px solid #D7E2E4" : undefined, display: "flex", justifyContent: "space-between", alignItems: "center", background: i % 2 === 0 ? "#fff" : "#FAFCFC" }}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "monospace", color: NAVY }}>{entry.action}</span>
                  <span style={{ fontSize: "12px", color: "#536B73", marginLeft: "10px" }}>by {entry.actor ?? "system"}</span>
                </div>
                <div style={{ fontSize: "11px", color: "#8AA5AB" }}>
                  {new Date(entry.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
