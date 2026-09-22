"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Shield, Plus, RefreshCw, ExternalLink,
  FileDown, ChevronDown, ChevronUp, AlertTriangle, CheckCircle,
} from "lucide-react";
import type { Certificate, CertificateType } from "@/lib/certificates";
import { CERT_META } from "@/lib/certificates";

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  account_type: string;
  created_at: string;
}

interface AuditEntry {
  id: string;
  certificate_id: string;
  action: string;
  actor: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const CERT_TYPES: { value: CertificateType; label: string }[] = [
  { value: "genai",      label: "GenAI & Agentic AI" },
  { value: "fde",        label: "Forward Deployed Engineering" },
  { value: "internship", label: "FDE Internship" },
];

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { background: string; color: string }> = {
    active:  { background: "#e8f8f1", color: "#1f9d63" },
    revoked: { background: "#fef0ef", color: "#c0392b" },
  };
  const style = map[status] ?? { background: "#f3f4f6", color: "#6b7280" };
  return (
    <span className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize" style={style}>
      {status}
    </span>
  );
}

// ─── Certificate generation form ──────────────────────────────────────────────

interface GenFormProps {
  studentId: string;
  studentName: string;
  studentEmail: string;
  existingCerts: Certificate[];
  onSuccess: () => void;
}

function GenerateCertForm({ studentId, studentName, studentEmail, existingCerts, onSuccess }: GenFormProps) {
  const [certType, setCertType]         = useState<CertificateType>("genai");
  const [completionDate, setCompletion] = useState("");
  const [issueDate, setIssueDate]       = useState(new Date().toISOString().slice(0, 10));
  const [internshipStart, setIntStart]  = useState("");
  const [internshipEnd, setIntEnd]      = useState("");
  const [skills, setSkills]             = useState("");
  const [role, setRole]                 = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]               = useState<{ type: "error" | "success" | "duplicate"; text: string; cert?: Certificate } | null>(null);
  const [pdfGenerating, setPdfGen]  = useState(false);
  const [pdfUrl, setPdfUrl]         = useState<string | null>(null);
  const [createdCert, setCreatedCert] = useState<Certificate | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completionDate) { setMsg({ type: "error", text: "Completion date is required." }); return; }
    setSubmitting(true);
    setMsg(null);

    const payload: Record<string, unknown> = {
      certificateType:    certType,
      studentId,
      studentName,
      studentEmail,
      completionDate,
      issueDate,
      skills:             skills.split(",").map((s) => s.trim()).filter(Boolean),
      role:               role.trim() || undefined,
    };
    if (certType === "internship") {
      payload.internshipStartDate = internshipStart;
      payload.internshipEnd       = internshipEnd;
    }

    try {
      const res = await fetch("/api/admin/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();

      if (res.status === 409 && body.error === "DUPLICATE") {
        setMsg({ type: "duplicate", text: "A certificate of this type already exists for this student.", cert: body.existing });
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        setMsg({ type: "error", text: body.error ?? "Failed to create certificate." });
        setSubmitting(false);
        return;
      }

      setCreatedCert(body.data);
      setMsg({ type: "success", text: `Certificate ${body.data.certificate_id} created.` });
      setSubmitting(false);
      onSuccess();
    } catch {
      setMsg({ type: "error", text: "Network error. Please try again." });
      setSubmitting(false);
    }
  };

  const generatePdf = async () => {
    if (!createdCert) return;
    setPdfGen(true);
    try {
      const res = await fetch(`/api/admin/certificates/${createdCert.id}/pdf`, { method: "POST" });
      const body = await res.json();
      if (res.ok && body.url) setPdfUrl(body.url);
      else setMsg({ type: "error", text: body.error ?? "PDF generation failed." });
    } catch {
      setMsg({ type: "error", text: "Network error during PDF generation." });
    }
    setPdfGen(false);
  };

  return (
    <form onSubmit={handleGenerate} className="space-y-4 mt-4">
      {/* Certificate type */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
          Certificate Type
        </label>
        <select
          value={certType}
          onChange={(e) => { setCertType(e.target.value as CertificateType); setMsg(null); }}
          className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
          style={{ borderColor: "#D7E2E4", color: "#071A24" }}
        >
          {CERT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
            Completion Date <span style={{ color: "#c0392b" }}>*</span>
          </label>
          <input type="date" required value={completionDate} onChange={(e) => setCompletion(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
            style={{ borderColor: "#D7E2E4", color: "#071A24" }}
          />
        </div>
        <div>
          <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
            Issue Date
          </label>
          <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
            style={{ borderColor: "#D7E2E4", color: "#071A24" }}
          />
        </div>
      </div>

      {/* Internship-specific fields */}
      {certType === "internship" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
              Internship Start
            </label>
            <input type="date" value={internshipStart} onChange={(e) => setIntStart(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
              style={{ borderColor: "#D7E2E4", color: "#071A24" }}
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
              Internship End
            </label>
            <input type="date" value={internshipEnd} onChange={(e) => setIntEnd(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
              style={{ borderColor: "#D7E2E4", color: "#071A24" }}
            />
          </div>
        </div>
      )}

      {/* Role */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
          Role / Title <span className="text-[10px] font-normal normal-case" style={{ opacity: 0.6 }}>(optional)</span>
        </label>
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
          placeholder="e.g. AI Engineer"
          className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
          style={{ borderColor: "#D7E2E4", color: "#071A24" }}
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#536B73" }}>
          Skills <span className="text-[10px] font-normal normal-case" style={{ opacity: 0.6 }}>(comma-separated)</span>
        </label>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
          placeholder="Prompt Engineering, LangChain, RAG"
          className="w-full h-10 px-3.5 rounded-xl border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#079DB3]/30"
          style={{ borderColor: "#D7E2E4", color: "#071A24" }}
        />
      </div>

      {/* Feedback */}
      {msg && (
        <div
          className="flex items-start gap-2 p-3 rounded-xl text-sm"
          style={{
            background: msg.type === "success" ? "#e8f8f1" : msg.type === "duplicate" ? "#fef9ec" : "#fef0ef",
            color: msg.type === "success" ? "#1f9d63" : msg.type === "duplicate" ? "#b45309" : "#c0392b",
          }}
        >
          {msg.type === "success" ? <CheckCircle size={14} className="shrink-0 mt-0.5" /> : <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
          <span>{msg.text}</span>
          {msg.type === "duplicate" && msg.cert && (
            <Link href={`/verify/${msg.cert.certificate_id}`} target="_blank" className="ml-auto text-xs underline whitespace-nowrap">
              View existing
            </Link>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap pt-1">
        {!createdCert ? (
          <button
            type="submit"
            disabled={submitting}
            className="h-9 px-5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#079DB3" }}
          >
            {submitting ? "Generating…" : `Generate ${CERT_META[certType].label} Certificate`}
          </button>
        ) : (
          <button
            type="button"
            onClick={generatePdf}
            disabled={pdfGenerating || !!pdfUrl}
            className="h-9 px-5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#062F36" }}
          >
            <FileDown size={13} />
            {pdfGenerating ? "Generating PDF…" : pdfUrl ? "PDF Generated" : "Generate PDF"}
          </button>
        )}
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="h-9 px-4 rounded-xl text-sm font-semibold border flex items-center gap-1.5 transition-colors hover:bg-muted/30"
            style={{ borderColor: "#D7E2E4", color: "#536B73" }}
          >
            Download PDF <ExternalLink size={11} />
          </a>
        )}
        {createdCert && (
          <Link
            href={`/verify/${createdCert.certificate_id}`}
            target="_blank"
            className="h-9 px-4 rounded-xl text-sm font-semibold border flex items-center gap-1.5 transition-colors hover:bg-muted/30"
            style={{ borderColor: "#D7E2E4", color: "#536B73" }}
          >
            Verify <ExternalLink size={11} />
          </Link>
        )}
      </div>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile]         = useState<Profile | null>(null);
  const [certificates, setCerts]      = useState<Certificate[]>([]);
  const [audit, setAudit]             = useState<AuditEntry[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [showGenForm, setShowGenForm] = useState(false);
  const [showAudit, setShowAudit]     = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/students/${id}`);
      const body = await res.json();
      if (!res.ok) { setError(body.error ?? "Failed to load student."); setLoading(false); return; }
      setProfile(body.data.profile);
      setCerts(body.data.certificates);
      setAudit(body.data.audit);
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-5 w-32 rounded-lg" style={{ background: "#E7F5F4" }} />
        <div className="h-24 rounded-2xl" style={{ background: "#E7F5F4" }} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-16">
        <AlertTriangle size={28} className="mx-auto mb-3" style={{ color: "#D7E2E4" }} />
        <p className="font-semibold" style={{ color: "#536B73" }}>{error || "Student not found."}</p>
        <Link href="/admin/students" className="text-sm mt-3 inline-flex items-center gap-1 hover:underline" style={{ color: "#079DB3" }}>
          <ArrowLeft size={13} /> Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-3xl">
      {/* Back */}
      <Link href="/admin/students" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: "#536B73" }}>
        <ArrowLeft size={13} /> Back to Students
      </Link>

      {/* Profile card */}
      <div className="border rounded-2xl p-5" style={{ borderColor: "#D7E2E4" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-black shrink-0" style={{ background: "#E7F5F4", color: "#079DB3" }}>
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight" style={{ color: "#071A24" }}>{profile.full_name}</h1>
              <p className="text-sm mt-0.5" style={{ color: "#536B73" }}>{profile.email}</p>
              {profile.phone && <p className="text-xs mt-0.5" style={{ color: "#536B73", opacity: 0.7 }}>{profile.phone}</p>}
            </div>
          </div>
          <button
            onClick={fetchData}
            className="h-8 w-8 rounded-xl border flex items-center justify-center transition-colors hover:bg-muted/30 shrink-0"
            style={{ borderColor: "#D7E2E4", color: "#536B73" }}
          >
            <RefreshCw size={13} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t" style={{ borderColor: "#D7E2E4" }}>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black mb-0.5" style={{ color: "#536B73", opacity: 0.6 }}>Joined</p>
            <p className="text-sm font-semibold" style={{ color: "#071A24" }}>{fmt(profile.created_at)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black mb-0.5" style={{ color: "#536B73", opacity: 0.6 }}>Certificates</p>
            <p className="text-sm font-semibold" style={{ color: "#071A24" }}>{certificates.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-black mb-0.5" style={{ color: "#536B73", opacity: 0.6 }}>Account Type</p>
            <p className="text-sm font-semibold capitalize" style={{ color: "#071A24" }}>{profile.account_type}</p>
          </div>
        </div>
      </div>

      {/* Certificates section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield size={15} style={{ color: "#079DB3" }} />
            <h2 className="text-base font-bold" style={{ color: "#071A24" }}>Certificates</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#E7F5F4", color: "#079DB3" }}>
              {certificates.length}
            </span>
          </div>
          <button
            onClick={() => setShowGenForm((v) => !v)}
            className="h-8 px-3.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-opacity hover:opacity-90"
            style={{ background: "#079DB3" }}
          >
            <Plus size={12} />
            {showGenForm ? "Cancel" : "Generate Certificate"}
          </button>
        </div>

        {showGenForm && (
          <div className="border rounded-2xl p-5 mb-5" style={{ borderColor: "#D7E2E4", background: "#f8faf9" }}>
            <h3 className="text-sm font-bold mb-1" style={{ color: "#071A24" }}>New Certificate</h3>
            <p className="text-xs" style={{ color: "#536B73" }}>
              Certificate wording, signatories, and company details are fixed. Fill in the student-specific fields below.
            </p>
            <GenerateCertForm
              studentId={profile.id}
              studentName={profile.full_name}
              studentEmail={profile.email}
              existingCerts={certificates}
              onSuccess={fetchData}
            />
          </div>
        )}

        {certificates.length === 0 ? (
          <div className="border rounded-2xl py-10 text-center" style={{ borderColor: "#D7E2E4" }}>
            <Shield size={24} className="mx-auto mb-2.5" style={{ color: "#D7E2E4" }} />
            <p className="text-sm font-semibold" style={{ color: "#536B73" }}>No certificates yet</p>
            <p className="text-xs mt-1" style={{ color: "#536B73", opacity: 0.7 }}>Click "Generate Certificate" to issue one.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {certificates.map((cert) => (
              <div key={cert.id} className="border rounded-2xl p-4 flex items-center gap-4" style={{ borderColor: "#D7E2E4" }}>
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#E7F5F4" }}>
                  <Shield size={15} style={{ color: "#079DB3" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight" style={{ color: "#071A24" }}>
                    {CERT_META[cert.certificate_type]?.label ?? cert.certificate_type}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#536B73" }}>
                    {cert.certificate_id} · Issued {fmt(cert.issue_date)}
                  </p>
                </div>
                <StatusBadge status={cert.status} />
                <div className="flex items-center gap-1.5 shrink-0">
                  {cert.pdf_storage_path && (
                    <a
                      href={`/api/admin/certificates/${cert.id}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-7 w-7 rounded-lg border flex items-center justify-center transition-colors hover:bg-muted/30"
                      style={{ borderColor: "#D7E2E4", color: "#536B73" }}
                      title="Download PDF"
                    >
                      <FileDown size={12} />
                    </a>
                  )}
                  <Link
                    href={`/verify/${cert.certificate_id}`}
                    target="_blank"
                    className="h-7 w-7 rounded-lg border flex items-center justify-center transition-colors hover:bg-muted/30"
                    style={{ borderColor: "#D7E2E4", color: "#536B73" }}
                    title="Verify"
                  >
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit log (collapsible) */}
      {audit.length > 0 && (
        <div>
          <button
            onClick={() => setShowAudit((v) => !v)}
            className="flex items-center gap-2 text-sm font-semibold mb-3 hover:underline"
            style={{ color: "#536B73" }}
          >
            Audit Log ({audit.length})
            {showAudit ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          {showAudit && (
            <div className="border rounded-2xl overflow-hidden" style={{ borderColor: "#D7E2E4" }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "#F8FAF9", borderBottom: "1px solid #D7E2E4" }}>
                    {["Date", "Action", "Certificate", "Actor"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-black uppercase tracking-wider" style={{ color: "#536B73" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {audit.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: i < audit.length - 1 ? "1px solid #f1f5f4" : "none" }}>
                      <td className="px-3 py-2.5" style={{ color: "#536B73" }}>{fmt(a.created_at)}</td>
                      <td className="px-3 py-2.5 font-semibold capitalize" style={{ color: "#071A24" }}>{a.action.replace(/_/g, " ")}</td>
                      <td className="px-3 py-2.5 font-mono" style={{ color: "#536B73" }}>{a.certificate_id}</td>
                      <td className="px-3 py-2.5" style={{ color: "#536B73" }}>{a.actor ?? "system"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
