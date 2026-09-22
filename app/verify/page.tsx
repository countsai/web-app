"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Search, CheckCircle2, ArrowRight } from "lucide-react";

export default function VerifyIndexPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = id.trim().toUpperCase();
    if (!trimmed) { setError("Please enter a certificate ID."); return; }
    router.push(`/verify/${trimmed}`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f8fa", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0a3a44", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Counts AI" style={{ height: "28px", objectFit: "contain" }} />
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
          <Shield size={13} />
          Certificate Verification
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "60px 20px" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "rgba(7,157,179,0.12)", display: "flex",
            alignItems: "center", justifyContent: "center", margin: "0 auto 20px"
          }}>
            <Shield size={30} color="#079DB3" />
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "28px", fontWeight: "900", color: "#062F36" }}>
            Verify a Certificate
          </h1>
          <p style={{ margin: 0, fontSize: "15px", color: "#536B73", lineHeight: 1.6 }}>
            Enter the certificate ID printed on the credential to confirm its authenticity with the Counts AI registry.
          </p>
        </div>

        {/* Search card */}
        <div style={{
          background: "white", borderRadius: "16px", padding: "32px",
          border: "1.5px solid #dbe9eb",
          boxShadow: "0 4px 24px rgba(6,47,54,0.07)",
          marginBottom: "24px"
        }}>
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#536B73", letterSpacing: "1.5px", marginBottom: "8px" }}>
              CERTIFICATE ID
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                value={id}
                onChange={e => { setId(e.target.value); setError(""); }}
                placeholder="e.g. CAI-GENAI-2026-AIHYZB"
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: error ? "1.5px solid #c0392b" : "1.5px solid #D7E2E4",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "#062F36",
                  outline: "none",
                  letterSpacing: "0.5px",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 20px",
                  background: "#079DB3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                <Search size={15} /> Verify
              </button>
            </div>
            {error && (
              <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#c0392b" }}>{error}</p>
            )}
            <p style={{ margin: "12px 0 0", fontSize: "12px", color: "#8AA5AB" }}>
              The certificate ID is printed in the footer of the credential, e.g. <span style={{ fontFamily: "monospace", color: "#079DB3" }}>CAI-GENAI-2026-XXXXX</span>
            </p>
          </form>
        </div>

        {/* What we verify */}
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1.5px solid #dbe9eb", marginBottom: "32px" }}>
          <p style={{ margin: "0 0 16px", fontSize: "11px", fontWeight: 700, color: "#8AA5AB", letterSpacing: "1.5px" }}>WHAT WE VERIFY</p>
          {[
            ["Recipient name", "Confirms the credential belongs to the named individual."],
            ["Program & type", "Confirms which Counts AI programme was completed."],
            ["Issue date", "Confirms when the credential was issued."],
            ["Active status", "Confirms the certificate has not been revoked."],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "14px" }}>
              <CheckCircle2 size={16} color="#079DB3" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#062F36" }}>{title}</div>
                <div style={{ fontSize: "12px", color: "#536B73", marginTop: "2px" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px",
          background: "rgba(7,157,179,0.05)",
          border: "1px solid rgba(7,157,179,0.15)",
          borderRadius: "10px",
          fontSize: "12px",
          color: "#85a0a4",
          lineHeight: 1.6,
          textAlign: "center"
        }}>
          Certificates are issued by <strong style={{ color: "#062F36" }}>Counts AI Ltd</strong>, registered in England and Wales.
          For queries contact{" "}
          <a href="mailto:info@countsai.com" style={{ color: "#079DB3" }}>info@countsai.com</a>
          {" · "}
          <Link href="/" style={{ color: "#079DB3", textDecoration: "none" }}>
            countsai.com <ArrowRight size={10} style={{ display: "inline" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}
