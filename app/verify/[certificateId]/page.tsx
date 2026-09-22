"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CERT_META, formatDate } from "@/lib/certificates";
import type { Certificate, CertificateType } from "@/lib/certificates";
import { CheckCircle2, XCircle, AlertCircle, Shield, ExternalLink } from "lucide-react";

type PublicCert = Pick<Certificate,
  | "id" | "certificate_id" | "certificate_type" | "student_name" | "program_name"
  | "role" | "issue_date" | "completion_date"
  | "internship_start_date" | "internship_end_date"
  | "status" | "revoked_at" | "revocation_reason" | "verification_url"
>;

export default function VerifyPage() {
  const params = useParams<{ certificateId: string }>();
  const [cert, setCert]     = useState<PublicCert | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/certificates/${params.certificateId}`)
      .then(r => r.json())
      .then(({ data, error }) => {
        if (error === "NOT_FOUND" || !data) setNotFound(true);
        else setCert(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.certificateId]);

  const isActive  = cert?.status === "active";
  const isRevoked = cert?.status === "revoked";

  const statusColor = isActive  ? "#1f9d63" : isRevoked ? "#c0392b" : "#85a0a4";
  const statusBg    = isActive  ? "#e8f8f1" : isRevoked ? "#fef0ef" : "#f4f4f4";
  const statusLabel = isActive  ? "ACTIVE"  : isRevoked ? "REVOKED" : "UNKNOWN";
  const StatusIcon  = isActive  ? CheckCircle2 : isRevoked ? XCircle : AlertCircle;

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

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "40px 20px" }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#85a0a4" }}>
            Verifying certificate…
          </div>
        )}

        {/* Not found */}
        {!loading && notFound && (
          <div style={{
            background: "white",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            border: "1.5px solid #fdd",
          }}>
            <XCircle size={48} color="#c0392b" style={{ marginBottom: "16px" }} />
            <h2 style={{ color: "#0a3a44", margin: "0 0 8px 0" }}>Certificate Not Found</h2>
            <p style={{ color: "#85a0a4", margin: "0 0 20px 0" }}>
              The certificate ID <strong style={{ color: "#0a3a44" }}>{params.certificateId}</strong> does not exist
              in the Counts AI registry.
            </p>
            <p style={{ color: "#85a0a4", fontSize: "13px" }}>
              If you believe this is an error, please contact{" "}
              <a href="mailto:info@countsai.com" style={{ color: "#079DB3" }}>info@countsai.com</a>.
            </p>
          </div>
        )}

        {/* Certificate found */}
        {!loading && cert && (
          <>
            {/* Status banner */}
            <div style={{
              background: statusBg,
              border: `2px solid ${statusColor}`,
              borderRadius: "12px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}>
              <StatusIcon size={28} color={statusColor} />
              <div>
                <div style={{ fontSize: "18px", fontWeight: "800", color: statusColor }}>
                  {isActive ? "✓ Certificate Verified" : isRevoked ? "⚠ Certificate Revoked" : "Unknown Status"}
                </div>
                <div style={{ fontSize: "12px", color: "#5f7679", marginTop: "2px" }}>
                  {isActive
                    ? "This credential has been verified as authentic and is currently active."
                    : isRevoked
                    ? "This certificate is no longer valid."
                    : "Status could not be determined."}
                </div>
              </div>
            </div>

            {/* Revocation notice */}
            {isRevoked && (
              <div style={{
                background: "#fef0ef",
                border: "1px solid #fcc",
                borderRadius: "10px",
                padding: "14px 16px",
                marginBottom: "20px",
              }}>
                <p style={{ margin: "0 0 4px 0", fontWeight: "700", color: "#c0392b", fontSize: "13px" }}>
                  This certificate is no longer active.
                </p>
                {cert.revoked_at && (
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#85a0a4" }}>
                    Revoked on: {formatDate(cert.revoked_at)}
                  </p>
                )}
              </div>
            )}

            {/* Certificate details card */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              border: "1.5px solid #dbe9eb",
              marginBottom: "20px",
            }}>
              <Row label="Certificate ID"    value={<code style={{ fontFamily: "monospace", color: "#079DB3", fontWeight: "700", fontSize: "14px" }}>{cert.certificate_id}</code>} />
              <Divider />
              <Row label="Recipient"         value={<strong style={{ color: "#0a3a44", fontSize: "17px" }}>{cert.student_name}</strong>} />
              <Divider />
              <Row label="Certificate"       value={CERT_META[cert.certificate_type as CertificateType]?.label ?? cert.certificate_type} />
              <Divider />
              {cert.certificate_type === "internship" && cert.role && (
                <>
                  <Row label="Role" value={cert.role} />
                  <Divider />
                </>
              )}
              {cert.certificate_type === "internship" && cert.internship_start_date && (
                <>
                  <Row
                    label="Internship Period"
                    value={`${formatDate(cert.internship_start_date)} – ${formatDate(cert.internship_end_date ?? undefined)}`}
                  />
                  <Divider />
                </>
              )}
              {cert.completion_date && cert.certificate_type !== "internship" && (
                <>
                  <Row label="Completion Date" value={formatDate(cert.completion_date)} />
                  <Divider />
                </>
              )}
              <Row label="Issue Date"        value={formatDate(cert.issue_date)} />
              <Divider />
              <Row label="Issued By"         value="Counts AI Ltd" />
              <Divider />
              <Row
                label="Status"
                value={
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    background: statusBg,
                    color: statusColor,
                    fontWeight: "700",
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                  }}>
                    <StatusIcon size={11} /> {statusLabel}
                  </span>
                }
              />
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                href={`/certificate-view/${cert.id}`}
                target="_blank"
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
                <ExternalLink size={13} /> View Certificate
              </Link>
            </div>

            {/* Footer note */}
            <div style={{
              marginTop: "32px",
              padding: "14px",
              background: "rgba(0,151,178,0.05)",
              border: "1px solid rgba(0,151,178,0.15)",
              borderRadius: "10px",
            }}>
              <p style={{ margin: "0", fontSize: "11px", color: "#85a0a4", lineHeight: "1.6" }}>
                This certificate was issued by <strong>Counts AI Ltd</strong>, registered in England and Wales.
                For verification queries, contact{" "}
                <a href="mailto:info@countsai.com" style={{ color: "#079DB3" }}>info@countsai.com</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", gap: "12px" }}>
      <span style={{ fontSize: "12px", color: "#85a0a4", fontWeight: "600", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontSize: "13px", color: "#33474b", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#f0f4f5", margin: "0" }} />;
}
