"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, CheckCircle2, AlertCircle, ArrowLeft, UserPlus, Users } from "lucide-react";
import { CERT_META } from "@/lib/certificates";
import type { CertificateType } from "@/lib/certificates";

interface StudentResult {
  id: string;
  full_name: string;
  email: string;
}

interface IssuedCert {
  id: string;
  certificate_id: string;
}

// Mode: search existing registered student, or enter details manually
type InputMode = "search" | "manual";

export default function NewCertificatePage() {
  // Form state
  const [certType, setCertType]         = useState<CertificateType>("genai");
  const [inputMode, setInputMode]       = useState<InputMode>("search");

  // Search mode
  const [studentSearch, setStudentSearch] = useState("");
  const [students, setStudents]         = useState<StudentResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
  const [searching, setSearching]       = useState(false);

  // Manual mode
  const [manualName, setManualName]     = useState("");
  const [manualEmail, setManualEmail]   = useState("");

  const [completionDate, setCompletionDate] = useState("");
  const [issueDate, setIssueDate]       = useState(new Date().toISOString().split("T")[0]);
  const [internshipStart, setInternshipStart] = useState("");
  const [internshipEnd, setInternshipEnd]   = useState("");
  const [skills, setSkills]             = useState("");
  const [role, setRole]                 = useState("Forward Deployed Engineer");

  // UI state
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");
  const [duplicate, setDuplicate]       = useState<IssuedCert | null>(null);
  const [issued, setIssued]             = useState<{ certificateId: string; id: string } | null>(null);
  const [forceCreate, setForceCreate]   = useState(false);

  // Student search with debounce
  const searchStudents = useCallback(async (q: string) => {
    if (q.length < 2) { setStudents([]); return; }
    setSearching(true);
    const res = await fetch(`/api/admin/certificates/students?q=${encodeURIComponent(q)}`);
    const { data } = await res.json();
    setStudents(data ?? []);
    setSearching(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => searchStudents(studentSearch), 300);
    return () => clearTimeout(t);
  }, [studentSearch, searchStudents]);

  // Auto-validate internship duration (~1 month)
  const internshipWarning = (() => {
    if (!internshipStart || !internshipEnd) return "";
    const start = new Date(internshipStart);
    const end   = new Date(internshipEnd);
    const days  = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (days < 20) return `⚠ Duration is only ${Math.round(days)} days — expected approximately 1 month.`;
    if (days > 45) return `⚠ Duration is ${Math.round(days)} days — expected approximately 1 month.`;
    return "";
  })();

  // Derive the effective student name/email based on mode
  const effectiveName  = inputMode === "search" ? selectedStudent?.full_name ?? "" : manualName.trim();
  const effectiveEmail = inputMode === "search" ? selectedStudent?.email ?? "" : manualEmail.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === "search" && !selectedStudent) { setError("Please select a student."); return; }
    if (inputMode === "manual" && (!manualName.trim() || !manualEmail.trim())) { setError("Full name and email are required."); return; }
    setError("");
    setSubmitting(true);
    setDuplicate(null);

    const body: Record<string, unknown> = {
      certificateType: certType,
      studentId:       inputMode === "search" ? selectedStudent?.id : null,
      studentName:     effectiveName,
      studentEmail:    effectiveEmail,
      issueDate,
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      forceCreate,
    };

    if (certType !== "internship") body.completionDate = completionDate || null;
    if (certType === "internship") {
      body.internshipStartDate = internshipStart;
      body.internshipEndDate   = internshipEnd;
      body.role = role;
    }

    const res = await fetch("/api/admin/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (res.status === 409 && json.error === "DUPLICATE") {
      setDuplicate(json.existing);
    } else if (!res.ok) {
      const raw = json.error;
      setError(typeof raw === "string" ? raw : raw?.message ?? JSON.stringify(raw) ?? "Failed to generate certificate.");
    } else {
      setIssued({ certificateId: json.data.certificate_id, id: json.data.id });
    }

    setSubmitting(false);
  };

  // ── Success screen ────────────────────────────────────────────────────────────
  if (issued) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://countsai.com";
    const verifyUrl = `${appUrl}/verify/${issued.certificateId}`;
    return (
      <div style={{ minHeight: "100vh", background: "#f4fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ background: "white", borderRadius: "20px", padding: "40px", maxWidth: "520px", width: "100%", textAlign: "center", border: "1.5px solid #dbe9eb" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#e8f8f1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={32} color="#1f9d63" />
          </div>
          <h2 style={{ color: "#0a3a44", margin: "0 0 8px", fontSize: "22px", fontWeight: "800" }}>
            Certificate Issued Successfully ✓
          </h2>
          <p style={{ color: "#5f7679", margin: "0 0 24px", fontSize: "14px" }}>
            The certificate has been generated and is ready for the student.
          </p>
          <div style={{ background: "#f4fafb", borderRadius: "12px", padding: "16px", marginBottom: "24px", textAlign: "left" }}>
            <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#85a0a4", fontWeight: "600" }}>CERTIFICATE ID</p>
            <p style={{ margin: "0 0 14px", fontFamily: "monospace", fontWeight: "800", color: "#079DB3", fontSize: "15px" }}>{issued.certificateId}</p>
            <p style={{ margin: "0 0 4px", fontSize: "12px", color: "#85a0a4", fontWeight: "600" }}>VERIFICATION URL</p>
            <p style={{ margin: "0", fontSize: "12px", color: "#079DB3", wordBreak: "break-all" }}>{verifyUrl}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a
              href={`/certificate-view/${issued.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "12px 24px", borderRadius: "24px", background: "#079DB3", color: "white", fontWeight: "700", fontSize: "13px", textDecoration: "none", display: "block" }}
            >
              View Certificate
            </a>
            <button
              onClick={() => navigator.clipboard?.writeText(verifyUrl)}
              style={{ padding: "12px 24px", borderRadius: "24px", background: "white", color: "#0a3a44", border: "1.5px solid #dbe9eb", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
            >
              Copy Verification URL
            </button>
            <Link
              href="/admin/certificates"
              style={{ padding: "12px 24px", borderRadius: "24px", background: "#e3f7fb", color: "#079DB3", fontWeight: "700", fontSize: "13px", textDecoration: "none", display: "block" }}
            >
              Back to All Certificates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  const labelStyle: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: "700", color: "#0a3a44", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #dbe9eb", fontSize: "13px", outline: "none", color: "#0a3a44", boxSizing: "border-box" };

  return (
    <div style={{ minHeight: "100vh", background: "#f4fafb", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#0a3a44", padding: "20px 32px" }}>
        <Link href="/admin/certificates" style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <ArrowLeft size={12} /> All Certificates
        </Link>
        <h1 style={{ color: "white", margin: "4px 0 0", fontSize: "22px", fontWeight: "800" }}>
          Generate Certificate
        </h1>
      </div>

      <div style={{ maxWidth: "640px", margin: "32px auto", padding: "0 20px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ background: "white", borderRadius: "16px", padding: "28px", border: "1.5px solid #dbe9eb", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Certificate Type */}
            <div>
              <label style={labelStyle}>Certificate Type *</label>
              <select
                value={certType}
                onChange={e => { setCertType(e.target.value as CertificateType); setDuplicate(null); }}
                style={inputStyle}
              >
                {(Object.entries(CERT_META) as [CertificateType, typeof CERT_META[CertificateType]][]).map(([key, m]) => (
                  <option key={key} value={key}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Student — mode toggle */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                <label style={labelStyle}>Student *</label>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    type="button"
                    onClick={() => { setInputMode("search"); setManualName(""); setManualEmail(""); setDuplicate(null); }}
                    style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", border: "1.5px solid #dbe9eb", cursor: "pointer", background: inputMode === "search" ? "#079DB3" : "white", color: inputMode === "search" ? "white" : "#536B73", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <Users size={10} /> Search
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputMode("manual"); setSelectedStudent(null); setStudentSearch(""); setStudents([]); setDuplicate(null); }}
                    style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", border: "1.5px solid #dbe9eb", cursor: "pointer", background: inputMode === "manual" ? "#079DB3" : "white", color: inputMode === "manual" ? "white" : "#536B73", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <UserPlus size={10} /> Manual
                  </button>
                </div>
              </div>

              {inputMode === "search" ? (
                selectedStudent ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #079DB3", background: "#e3f7fb" }}>
                    <div>
                      <div style={{ fontWeight: "700", color: "#0a3a44", fontSize: "13px" }}>{selectedStudent.full_name}</div>
                      <div style={{ fontSize: "11px", color: "#85a0a4" }}>{selectedStudent.email}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setSelectedStudent(null); setStudentSearch(""); setDuplicate(null); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#85a0a4", fontSize: "18px" }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div style={{ position: "relative" }}>
                    <Search size={13} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#85a0a4" }} />
                    <input
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      placeholder="Search by name or email…"
                      style={{ ...inputStyle, padding: "10px 14px 10px 32px" }}
                    />
                    {(students.length > 0 || searching) && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1.5px solid #dbe9eb", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 10, maxHeight: "200px", overflowY: "auto" }}>
                        {searching && <div style={{ padding: "10px 14px", color: "#85a0a4", fontSize: "13px" }}>Searching…</div>}
                        {students.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => { setSelectedStudent(s); setStudentSearch(""); setStudents([]); setDuplicate(null); }}
                            style={{ width: "100%", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #f0f4f5" }}
                          >
                            <div style={{ fontWeight: "600", color: "#0a3a44", fontSize: "13px" }}>{s.full_name}</div>
                            <div style={{ fontSize: "11px", color: "#85a0a4" }}>{s.email}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <input
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="Full name *"
                    style={inputStyle}
                    required={inputMode === "manual"}
                  />
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={e => setManualEmail(e.target.value)}
                    placeholder="Email address *"
                    style={inputStyle}
                    required={inputMode === "manual"}
                  />
                  <p style={{ margin: 0, fontSize: "11px", color: "#85a0a4" }}>
                    Certificate will be issued using these details. A platform account is not required.
                  </p>
                </div>
              )}
            </div>

            {/* Duplicate warning */}
            {duplicate && (
              <div style={{ background: "#fff8e6", border: "1px solid #f5c84e", borderRadius: "10px", padding: "14px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <AlertCircle size={16} color="#d4820a" style={{ marginTop: "1px", flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#0a3a44" }}>
                      Student already has an active {CERT_META[certType].label} certificate.
                    </p>
                    <p style={{ margin: "0 0 8px", fontSize: "12px", color: "#85a0a4" }}>
                      Existing ID: <strong style={{ color: "#079DB3" }}>{duplicate.certificate_id}</strong>
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a
                        href={`/certificate-view/${duplicate.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "5px 12px", borderRadius: "6px", background: "#079DB3", color: "white", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}
                      >
                        View Existing
                      </a>
                      <button
                        type="button"
                        onClick={() => { setForceCreate(true); setDuplicate(null); }}
                        style={{ padding: "5px 12px", borderRadius: "6px", background: "white", border: "1px solid #dbe9eb", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
                      >
                        Issue Another Anyway
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Type-specific fields */}
            {certType !== "internship" && (
              <div>
                <label style={labelStyle}>Completion Date</label>
                <input type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)} style={inputStyle} />
              </div>
            )}

            {certType === "internship" && (
              <>
                <div>
                  <label style={labelStyle}>Role</label>
                  <input value={role} onChange={e => setRole(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Internship Start Date *</label>
                    <input type="date" value={internshipStart} onChange={e => setInternshipStart(e.target.value)} style={inputStyle} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Internship End Date *</label>
                    <input type="date" value={internshipEnd} onChange={e => setInternshipEnd(e.target.value)} style={inputStyle} required />
                  </div>
                </div>
                {internshipWarning && (
                  <p style={{ margin: "0", fontSize: "12px", color: "#d4820a", fontWeight: "600" }}>{internshipWarning}</p>
                )}
              </>
            )}

            <div>
              <label style={labelStyle}>Issue Date *</label>
              <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} style={inputStyle} required />
            </div>

            <div>
              <label style={labelStyle}>Skills / Learning Outcomes (comma-separated)</label>
              <textarea
                value={skills}
                onChange={e => setSkills(e.target.value)}
                placeholder="e.g. LLMs, RAG, AI Agents, Vector Databases…"
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {error && (
              <div style={{ background: "#fef0ef", border: "1px solid #fcc", borderRadius: "8px", padding: "12px", fontSize: "13px", color: "#c0392b", fontWeight: "600" }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <Link
                href="/admin/certificates"
                style={{ flex: 1, padding: "13px", borderRadius: "12px", background: "white", color: "#0a3a44", border: "1.5px solid #dbe9eb", fontWeight: "700", fontSize: "13px", textDecoration: "none", textAlign: "center" }}
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting || (inputMode === "search" && !selectedStudent) || (inputMode === "manual" && (!manualName.trim() || !manualEmail.trim()))}
                style={{ flex: 2, padding: "13px", borderRadius: "12px", background: "#079DB3", color: "white", border: "none", fontWeight: "800", fontSize: "13px", cursor: "pointer", opacity: submitting ? 0.7 : 1, textTransform: "uppercase", letterSpacing: "0.5px" }}
              >
                {submitting ? "Generating…" : "Issue Certificate"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
