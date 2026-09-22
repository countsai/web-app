"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import { DEFAULT_SERVICE_DESCRIPTION, SUPPORTED_CURRENCIES } from "@/lib/invoices";

const today = new Date().toISOString().split("T")[0];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #D7E2E4",
  borderRadius: "4px",
  fontSize: "13px",
  color: "#062F36",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#536B73",
  letterSpacing: "1.5px",
  marginBottom: "6px",
};

const fieldStyle: React.CSSProperties = { marginBottom: "20px" };

interface StudentResult { id: string; full_name: string; email: string; }

export default function NewInvoicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  // Consultant search
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState<StudentResult[]>([]);
  const [searching, setSearching]   = useState(false);
  const [selected, setSelected]     = useState<StudentResult | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  // Form fields
  const [consultantName, setConsultantName]   = useState("");
  const [consultantEmail, setConsultantEmail] = useState("");
  const [invoiceDate, setInvoiceDate]         = useState(today);
  const [startDate, setStartDate]             = useState("");
  const [endDate, setEndDate]                 = useState("");
  const [description, setDescription]         = useState(DEFAULT_SERVICE_DESCRIPTION);
  const [amount, setAmount]                   = useState("");
  const [currency, setCurrency]               = useState("GBP");
  const [status, setStatus]                   = useState("draft");
  const [notes, setNotes]                     = useState("");

  // Live search students
  useEffect(() => {
    if (!query.trim() || selected) return;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res  = await fetch(`/api/admin/certificates/students?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        setResults(json.data ?? []);
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => clearTimeout(searchTimer.current);
  }, [query, selected]);

  const pickStudent = (s: StudentResult) => {
    setSelected(s);
    setConsultantName(s.full_name);
    setConsultantEmail(s.email);
    setQuery(s.full_name);
    setResults([]);
  };

  const clearStudent = () => {
    setSelected(null);
    setQuery("");
    setConsultantName("");
    setConsultantEmail("");
    setResults([]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
      setError("Please enter a valid amount. Amount must be explicitly entered — it cannot be auto-generated.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultantId:    selected?.id || null,
          consultantName,
          consultantEmail,
          invoiceDate,
          serviceStartDate: startDate,
          serviceEndDate:   endDate,
          description,
          amount:           Number(amount),
          currency,
          status,
          notes: notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create invoice."); setSubmitting(false); return; }
      router.push(`/admin/invoices/${data.data.id}`);
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  };

  const sectionHead = (label: string) => (
    <div style={{ borderBottom: "2px solid #062F36", paddingBottom: "6px", marginBottom: "20px", marginTop: "32px" }}>
      <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: "#079DB3", letterSpacing: "2.5px" }}>{label}</p>
    </div>
  );

  return (
    <div style={{ padding: "32px 40px", fontFamily: "'Helvetica Neue', sans-serif", color: "#062F36", maxWidth: "800px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "#536B73", marginBottom: "24px" }}>
        <Link href="/admin/certificates" style={{ color: "#536B73", textDecoration: "none" }}>Certificates</Link>
        <span>·</span>
        <Link href="/admin/invoices" style={{ color: "#536B73", textDecoration: "none" }}>Invoices</Link>
        <span>·</span>
        <span style={{ color: "#062F36" }}>New</span>
      </div>

      <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 700, color: "#079DB3", letterSpacing: "2.5px" }}>NEW DOCUMENT</p>
      <h1 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: 900 }}>Consultancy Invoice</h1>
      <p style={{ margin: "0 0 32px", fontSize: "13px", color: "#536B73" }}>
        This invoice documents independent consultancy services provided to Counts AI Ltd.
        It is not an employment document.
      </p>

      {error && (
        <div style={{ background: "#fef0ef", border: "1px solid #f5b7b1", borderRadius: "4px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#c0392b" }}>
          {error}
        </div>
      )}

      <form onSubmit={submit}>
        {sectionHead("CONSULTANT")}

        {/* Student lookup */}
        <div style={fieldStyle}>
          <label style={labelStyle}>SEARCH EXISTING STUDENT / CONSULTANT</label>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#8AA5AB" }} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); if (selected) clearStudent(); }}
              placeholder="Search by name or email…"
              style={{ ...inputStyle, paddingLeft: "30px" }}
            />
          </div>
          {searching && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#536B73" }}>Searching…</p>}
          {results.length > 0 && !selected && (
            <div style={{ border: "1px solid #D7E2E4", borderRadius: "4px", marginTop: "4px", background: "#fff", boxShadow: "0 4px 12px rgba(6,47,54,0.08)" }}>
              {results.map(s => (
                <div key={s.id} onClick={() => pickStudent(s)} style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f4f5" }}>
                  <div style={{ fontWeight: 600, fontSize: "13px" }}>{s.full_name}</div>
                  <div style={{ fontSize: "12px", color: "#536B73" }}>{s.email}</div>
                </div>
              ))}
            </div>
          )}
          {selected && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#e7f5f4", border: "1px solid #079DB3", borderRadius: "4px", padding: "8px 12px", marginTop: "6px" }}>
              <span style={{ fontSize: "12px", color: "#062F36" }}>Selected: <strong>{selected.full_name}</strong> — {selected.email}</span>
              <button type="button" onClick={clearStudent} style={{ background: "none", border: "none", color: "#079DB3", cursor: "pointer", fontSize: "12px" }}>Change</button>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>CONSULTANT NAME *</label>
            <input required value={consultantName} onChange={e => setConsultantName(e.target.value)} style={inputStyle} placeholder="Full legal name" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>CONSULTANT EMAIL *</label>
            <input required type="email" value={consultantEmail} onChange={e => setConsultantEmail(e.target.value)} style={inputStyle} placeholder="email@example.com" />
          </div>
        </div>

        {sectionHead("INVOICE DETAILS")}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>INVOICE DATE *</label>
            <input required type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>SERVICE START DATE *</label>
            <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>SERVICE END DATE *</label>
            <input required type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>AMOUNT * (do not invent — enter actual)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 1500.00"
              style={inputStyle}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>CURRENCY</label>
            <select value={currency} onChange={e => setCurrency(e.target.value)} style={inputStyle}>
              {SUPPORTED_CURRENCIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>STATUS</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
              <option value="draft">Draft</option>
              <option value="issued">Issued</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {sectionHead("SERVICES")}

        <div style={fieldStyle}>
          <label style={labelStyle}>SERVICE DESCRIPTION *</label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>NOTES (optional)</label>
          <textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Any additional notes for this invoice…"
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "11px 28px", background: "#062F36", color: "#fff", border: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 700, cursor: submitting ? "default" : "pointer", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Creating…" : "Create Invoice"}
          </button>
          <Link href="/admin/invoices" style={{ padding: "11px 20px", border: "1px solid #D7E2E4", borderRadius: "4px", fontSize: "14px", color: "#536B73", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
