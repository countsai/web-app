"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, RefreshCw, FileDown, ChevronLeft, ChevronRight } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS, formatCurrency } from "@/lib/invoices";
import type { ConsultancyInvoice, InvoiceStatus } from "@/lib/invoices";

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #D7E2E4",
  borderRadius: "4px",
  fontSize: "13px",
  color: "#062F36",
  background: "#fff",
  outline: "none",
};

const btnPrimary: React.CSSProperties = {
  padding: "9px 18px",
  background: "#079DB3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  fontSize: "13px",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  textDecoration: "none",
};

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<ConsultancyInvoice[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]         = useState(1);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const LIMIT = 20;

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search)       params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    const res  = await fetch(`/api/admin/invoices?${params}`);
    const json = await res.json();
    setInvoices(json.data ?? []);
    setTotal(json.count ?? 0);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const generatePdf = async (inv: ConsultancyInvoice) => {
    setGeneratingId(inv.id);
    try {
      const res  = await fetch(`/api/admin/invoices/${inv.id}/pdf`, { method: "POST" });
      const data = await res.json();
      if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
    } finally {
      setGeneratingId(null);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ padding: "32px 40px", fontFamily: "'Helvetica Neue', sans-serif", color: "#062F36" }}>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 700, color: "#079DB3", letterSpacing: "2.5px" }}>
            FINANCIAL DOCUMENTS
          </p>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 900, letterSpacing: "-0.5px" }}>
            Consultancy Invoices
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#536B73" }}>
            {total} invoice{total !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={fetchInvoices} style={{ ...inputStyle, cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
            <RefreshCw size={13} /> Refresh
          </button>
          <Link href="/admin/invoices/new" style={btnPrimary}>
            <Plus size={14} /> New Invoice
          </Link>
        </div>
      </div>

      {/* Breadcrumb nav */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "1px solid #D7E2E4", paddingBottom: "14px" }}>
        <Link href="/admin/certificates" style={{ fontSize: "13px", color: "#536B73", textDecoration: "none" }}>
          Certificates
        </Link>
        <span style={{ color: "#D7E2E4" }}>·</span>
        <span style={{ fontSize: "13px", color: "#079DB3", fontWeight: 700 }}>Consultancy Invoices</span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <div style={{ position: "relative" }}>
          <Search size={13} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#8AA5AB" }} />
          <input
            placeholder="Search name, email, invoice #…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: "30px", width: "260px" }}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABELS) as InvoiceStatus[]).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #D7E2E4", borderRadius: "4px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: "#062F36", color: "#fff" }}>
              {["Invoice No.", "Consultant", "Date", "Period", "Amount", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: "28px", textAlign: "center", color: "#536B73" }}>Loading…</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "28px", textAlign: "center", color: "#536B73" }}>No invoices found.</td></tr>
            ) : invoices.map((inv, i) => {
              const colors = STATUS_COLORS[inv.status as InvoiceStatus];
              return (
                <tr key={inv.id} style={{ borderTop: i === 0 ? "none" : "1px solid #D7E2E4", background: i % 2 === 0 ? "#fff" : "#FAFCFC" }}>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: "#062F36", fontFamily: "monospace", fontSize: "12px" }}>
                    {inv.invoice_number}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ fontWeight: 600 }}>{inv.consultant_name}</div>
                    <div style={{ fontSize: "11px", color: "#536B73" }}>{inv.consultant_email}</div>
                  </td>
                  <td style={{ padding: "11px 14px", color: "#536B73" }}>
                    {new Date(inv.invoice_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "11px 14px", color: "#536B73", fontSize: "12px" }}>
                    {new Date(inv.service_start_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    {" to "}
                    {new Date(inv.service_end_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "11px 14px", fontWeight: 700 }}>
                    {formatCurrency(inv.amount, inv.currency)}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ background: colors.bg, color: colors.text, padding: "3px 9px", borderRadius: "3px", fontSize: "11px", fontWeight: 700 }}>
                      {STATUS_LABELS[inv.status as InvoiceStatus]}
                    </span>
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href={`/admin/invoices/${inv.id}`} style={{ fontSize: "12px", color: "#079DB3", fontWeight: 600, textDecoration: "none" }}>
                        View
                      </Link>
                      <button
                        onClick={() => generatePdf(inv)}
                        disabled={generatingId === inv.id}
                        style={{ fontSize: "12px", color: "#536B73", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", padding: 0 }}
                      >
                        <FileDown size={12} /> {generatingId === inv.id ? "…" : "PDF"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
          <span style={{ fontSize: "13px", color: "#536B73" }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...inputStyle, cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ ...inputStyle, cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
