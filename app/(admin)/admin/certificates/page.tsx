"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search, Plus, RefreshCw, ExternalLink, Copy, Mail,
  ShieldOff, Eye, ChevronLeft, ChevronRight, Filter, FileDown,
} from "lucide-react";
import { CERT_META, formatDateShort } from "@/lib/certificates";
import type { Certificate, CertificateType } from "@/lib/certificates";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active:  { bg: "#e8f8f1", text: "#1f9d63" },
  revoked: { bg: "#fef0ef", text: "#c0392b" },
};

const TYPE_LABELS: Record<string, string> = {
  genai:      "GenAI & Agentic AI",
  fde:        "Forward Deployed Eng.",
  internship: "FDE Internship",
};

export default function AdminCertificatesPage() {
  const [certs, setCerts]       = useState<Certificate[]>([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]         = useState(1);
  const LIMIT = 20;

  // Revoke modal
  const [revokeTarget, setRevokeTarget] = useState<Certificate | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revoking, setRevoking]         = useState(false);

  // Send email state
  const [sendingId, setSendingId] = useState<string | null>(null);

  // PDF generation state
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });
    if (search)       params.set("search", search);
    if (typeFilter)   params.set("type", typeFilter);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/certificates?${params}`);
    const { data, count } = await res.json();
    setCerts(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, search, typeFilter, statusFilter]);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, typeFilter, statusFilter]);

  const copyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
  };

  const sendEmail = async (cert: Certificate) => {
    setSendingId(cert.id);
    await fetch(`/api/admin/certificates/${cert.id}/send`, { method: "POST" });
    setSendingId(null);
  };

  const generatePdf = async (cert: Certificate) => {
    setGeneratingPdfId(cert.id);
    try {
      const res = await fetch(`/api/admin/certificates/${cert.id}/pdf`, { method: "POST" });
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        alert(data.error ?? "PDF generation failed.");
      }
    } catch {
      alert("PDF generation failed.");
    }
    setGeneratingPdfId(null);
  };

  const handleRevoke = async () => {
    if (!revokeTarget || !revokeReason.trim()) return;
    setRevoking(true);
    await fetch(`/api/admin/certificates/${revokeTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke", revocationReason: revokeReason }),
    });
    setRevoking(false);
    setRevokeTarget(null);
    setRevokeReason("");
    fetchCerts();
  };

  const totalPages = Math.ceil(total / LIMIT);

  // Stats
  const active  = certs.filter(c => c.status === "active").length;
  const revoked = certs.filter(c => c.status === "revoked").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f4fafb", fontFamily: "system-ui, sans-serif" }}>
      {/* Page header */}
      <div style={{ background: "#0a3a44", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Link href="/admin/dashboard" style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", textDecoration: "none" }}>
            ← Admin Dashboard
          </Link>
          <h1 style={{ color: "white", margin: "4px 0 0", fontSize: "22px", fontWeight: "800" }}>
            Certificate Management
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Link
            href="/admin/invoices/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              borderRadius: "24px",
              background: "rgba(127,181,212,0.18)",
              border: "1.5px solid rgba(127,181,212,0.5)",
              color: "#7fb5d4",
              fontWeight: "700",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <Plus size={14} /> Create Invoice
          </Link>
          <Link
            href="/admin/certificates/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 20px",
              borderRadius: "24px",
              background: "#079DB3",
              color: "white",
              fontWeight: "700",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <Plus size={14} /> Generate Certificate
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
          {[
            { label: "Total Certificates", value: total, color: "#079DB3" },
            { label: "Active",             value: active,  color: "#1f9d63" },
            { label: "Revoked",            value: revoked, color: "#c0392b" },
            { label: "This Page",          value: certs.length, color: "#85a0a4" },
          ].map(s => (
            <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1.5px solid #dbe9eb" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#85a0a4", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "white", borderRadius: "12px", padding: "16px", border: "1.5px solid #dbe9eb", marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: "1", minWidth: "200px", position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#85a0a4" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email or certificate ID…"
              style={{ width: "100%", paddingLeft: "30px", padding: "8px 8px 8px 32px", borderRadius: "8px", border: "1.5px solid #dbe9eb", fontSize: "13px", outline: "none", color: "#0a3a44", boxSizing: "border-box" }}
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbe9eb", fontSize: "13px", color: "#0a3a44", outline: "none" }}
          >
            <option value="">All Types</option>
            <option value="genai">GenAI & Agentic AI</option>
            <option value="fde">Forward Deployed Eng.</option>
            <option value="internship">FDE Internship</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbe9eb", fontSize: "13px", color: "#0a3a44", outline: "none" }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
          </select>
          <button
            onClick={fetchCerts}
            style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #dbe9eb", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#0a3a44" }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <div style={{ fontSize: "12px", color: "#85a0a4", display: "flex", alignItems: "center", gap: "4px" }}>
            <Filter size={11} /> {total} result{total !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: "12px", border: "1.5px solid #dbe9eb", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#85a0a4" }}>Loading…</div>
          ) : certs.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#85a0a4" }}>
              No certificates found.{" "}
              <Link href="/admin/certificates/new" style={{ color: "#079DB3" }}>Generate one →</Link>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8fbfc", borderBottom: "1.5px solid #dbe9eb" }}>
                  {["Certificate ID", "Student", "Type", "Issue Date", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: "700", color: "#0a3a44", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certs.map((cert, i) => {
                  const sc = STATUS_COLORS[cert.status] ?? STATUS_COLORS.active;
                  return (
                    <tr key={cert.id} style={{ borderBottom: i < certs.length - 1 ? "1px solid #f0f4f5" : "none" }}>
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: "700", color: "#079DB3", fontSize: "12px" }}>
                        {cert.certificate_id}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: "600", color: "#0a3a44" }}>{cert.student_name}</div>
                        <div style={{ fontSize: "11px", color: "#85a0a4" }}>{cert.student_email}</div>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#5f7679" }}>
                        {CERT_META[cert.certificate_type as CertificateType]?.label ?? cert.certificate_type}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#5f7679" }}>
                        {formatDateShort(cert.issue_date)}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ padding: "3px 9px", borderRadius: "12px", background: sc.bg, color: sc.text, fontWeight: "700", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          {cert.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <a
                            href={`/certificate-view/${cert.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View"
                            style={{ padding: "5px 8px", borderRadius: "6px", background: "#e3f7fb", color: "#079DB3", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                          >
                            <Eye size={12} />
                          </a>
                          <button
                            onClick={() => copyUrl(cert.verification_url)}
                            title="Copy verification URL"
                            style={{ padding: "5px 8px", borderRadius: "6px", background: "#f4fafb", color: "#0a3a44", border: "1px solid #dbe9eb", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            onClick={() => sendEmail(cert)}
                            title="Send to student"
                            disabled={sendingId === cert.id}
                            style={{ padding: "5px 8px", borderRadius: "6px", background: "#f4fafb", color: "#0a3a44", border: "1px solid #dbe9eb", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                          >
                            <Mail size={12} />
                          </button>
                          <button
                            onClick={() => generatePdf(cert)}
                            title={cert.pdf_storage_path ? "Re-generate PDF" : "Generate PDF"}
                            disabled={generatingPdfId === cert.id}
                            style={{ padding: "5px 8px", borderRadius: "6px", background: cert.pdf_storage_path ? "#e8f8f1" : "#f4fafb", color: cert.pdf_storage_path ? "#1f9d63" : "#0a3a44", border: `1px solid ${cert.pdf_storage_path ? "#9de5c4" : "#dbe9eb"}`, cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                          >
                            {generatingPdfId === cert.id ? (
                              <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid currentColor", borderTopColor: "transparent", display: "inline-block", animation: "spin 0.6s linear infinite" }} />
                            ) : (
                              <FileDown size={12} />
                            )}
                          </button>
                          <a
                            href={cert.verification_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Verify online"
                            style={{ padding: "5px 8px", borderRadius: "6px", background: "#f4fafb", color: "#0a3a44", border: "1px solid #dbe9eb", cursor: "pointer", display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                          >
                            <ExternalLink size={12} />
                          </a>
                          {cert.status === "active" && (
                            <button
                              onClick={() => setRevokeTarget(cert)}
                              title="Revoke"
                              style={{ padding: "5px 8px", borderRadius: "6px", background: "#fef0ef", color: "#c0392b", border: "1px solid #fcc", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                            >
                              <ShieldOff size={12} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "20px" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #dbe9eb", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#0a3a44" }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span style={{ fontSize: "13px", color: "#85a0a4" }}>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{ padding: "8px 14px", borderRadius: "8px", border: "1.5px solid #dbe9eb", background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#0a3a44" }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Revoke Modal ── */}
      {revokeTarget && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(10,58,68,0.5)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div style={{
            background: "white", borderRadius: "16px", padding: "28px",
            maxWidth: "440px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <h3 style={{ margin: "0 0 8px", color: "#0a3a44", fontSize: "18px" }}>Revoke Certificate</h3>
            <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#5f7679" }}>
              Certificate: <strong style={{ color: "#079DB3" }}>{revokeTarget.certificate_id}</strong>
            </p>
            <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#5f7679" }}>
              Student: <strong>{revokeTarget.student_name}</strong>
            </p>
            <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#c0392b", fontWeight: "600" }}>
              ⚠ This action will mark the certificate as revoked. The verification URL remains valid and will show REVOKED status.
            </p>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "700", color: "#0a3a44" }}>
              Revocation Reason *
            </label>
            <textarea
              value={revokeReason}
              onChange={e => setRevokeReason(e.target.value)}
              placeholder="Enter reason for revoking this certificate…"
              rows={3}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1.5px solid #dbe9eb", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button
                onClick={() => { setRevokeTarget(null); setRevokeReason(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1.5px solid #dbe9eb", background: "white", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={revoking || !revokeReason.trim()}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: "#c0392b", color: "white", cursor: "pointer", fontWeight: "700", fontSize: "13px", opacity: revoking ? 0.6 : 1 }}
              >
                {revoking ? "Revoking…" : "Revoke Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
