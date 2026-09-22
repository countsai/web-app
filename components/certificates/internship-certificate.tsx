// Forward Deployed Engineer Internship — corporate experience certificate.
// A4 landscape 1122×794. Dark header band, two-column layout.

import { SIGNATORY, formatDate } from "@/lib/certificates";
import type { Certificate } from "@/lib/certificates";

interface Props {
  cert: Certificate;
  qrSvg: string;
  logoDataUrl: string;
  signatureDataUrl?: string;
}

const INTERNSHIP_PHONE_FULL = "+44 7384 050895";

const DURATION_WORDS = [
  "one","two","three","four","five","six",
  "seven","eight","nine","ten","eleven","twelve",
];

function calcDuration(start?: string, end?: string): string {
  if (!start || !end) return "one";
  const s = new Date(start);
  const e = new Date(end);
  // Day-based: count inclusive days then divide by avg month length.
  // This correctly counts May 1–June 30 as 2 months (61 days), not 1.
  const days = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
  const months = Math.max(1, Math.round(days / 30.44));
  return DURATION_WORDS[months - 1] ?? `${months}`;
}

export function InternshipCertificate({ cert, qrSvg, logoDataUrl, signatureDataUrl }: Props) {
  const role = cert.role || "Forward Deployed Engineer";
  const startDate = cert.internship_start_date ? formatDate(cert.internship_start_date) : "—";
  const endDate   = cert.internship_end_date   ? formatDate(cert.internship_end_date)   : "—";
  const period    = cert.internship_start_date && cert.internship_end_date
    ? `${startDate} to ${endDate}` : "N/A";
  const durationWord = calcDuration(cert.internship_start_date, cert.internship_end_date);
  const durationMonths = durationWord === "one" ? "One Month" : `${durationWord.charAt(0).toUpperCase() + durationWord.slice(1)} Months`;

  return (
    <div
      style={{
        width: "1122px",
        height: "794px",
        position: "relative",
        background: "#ffffff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── Subtle dot grid ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(6,47,54,0.065) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          zIndex: 0,
        }}
      />

      {/* ── Dark header band ── */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "94px",
          background: "linear-gradient(135deg, #004057 0%, #002d3d 55%, #005068 100%)",
          zIndex: 3,
        }}
      />

      {/* ── Teal accent line below header ── */}
      <div
        style={{
          position: "absolute",
          top: "94px", left: 0, right: 0,
          height: "3px",
          background: "#079DB3",
          zIndex: 3,
        }}
      />

      {/* ── Header content ── */}
      <div
        style={{
          position: "absolute",
          top: "18px", left: "38px", right: "38px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoDataUrl}
              alt="Counts AI"
              style={{ height: "34px", objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
          ) : (
            <span style={{ fontSize: "16px", fontWeight: "900", color: "#fff", letterSpacing: "2px" }}>
              COUNTS AI
            </span>
          )}
          <div style={{ width: "1px", height: "34px", background: "rgba(255,255,255,0.2)" }} />
          <div>
            <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "900", color: "#ffffff", letterSpacing: "1px", lineHeight: 1 }}>
              CERTIFICATE OF INTERNSHIP
            </p>
            <p style={{ margin: 0, fontSize: "8.5px", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>
              Forward Deployed Engineer · Counts AI Ltd · London
            </p>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 2px 0", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", fontWeight: "600" }}>
            REFERENCE
          </p>
          <p style={{ margin: "0 0 4px 0", fontSize: "10px", fontWeight: "700", color: "rgba(7,157,179,0.9)", letterSpacing: "0.5px" }}>
            {cert.certificate_id}
          </p>
          <p style={{ margin: 0, fontSize: "7.5px", color: "rgba(255,255,255,0.4)" }}>
            Issued: {formatDate(cert.issue_date)}
          </p>
        </div>
      </div>

      {/* ── LEFT BODY COLUMN ── */}
      <div
        style={{
          position: "absolute",
          top: "106px", left: "38px",
          width: "580px",
          bottom: "148px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingRight: "36px",
          zIndex: 4,
        }}
      >
        <p style={{ margin: "0 0 10px 0", fontSize: "9px", fontWeight: "600", color: "#536B73", letterSpacing: "3.5px", textTransform: "uppercase" }}>
          This is to certify that
        </p>

        <h1 style={{ margin: "0 0 6px 0", fontSize: "40px", fontWeight: "900", color: "#062F36", lineHeight: "1.0", letterSpacing: "-1.5px" }}>
          {cert.student_name}
        </h1>

        <div style={{ width: "48px", height: "3px", background: "#079DB3", margin: "8px 0 14px" }} />

        <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#536B73", lineHeight: "1.6" }}>
          has successfully completed a{" "}
          <strong style={{ color: "#062F36", fontWeight: "700" }}>{durationWord}-month</strong>{" "}
          internship as a{" "}
          <strong style={{ color: "#062F36", fontWeight: "700" }}>Forward Deployed Engineer</strong>{" "}
          with{" "}
          <strong style={{ color: "#062F36", fontWeight: "700" }}>Counts AI Ltd</strong>,
          contributing to multiple AI engineering projects involving Generative AI, LLM integration,
          prompt engineering, AI agent and multi-agent system development, workflow automations,
          retrieval-augmented generation (RAG), embeddings, vector databases, API and backend
          development, data pipelines, cloud infrastructure and deployment, system integration,
          evaluation, monitoring, and production-oriented AI solutions.
        </p>
        <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#536B73", lineHeight: "1.6" }}>
          Throughout the internship, they demonstrated strong technical aptitude, attentiveness,
          professionalism, and a commendable commitment to learning. They approached assigned
          responsibilities with enthusiasm and demonstrated good problem-solving abilities,
          adaptability, and an ability to work with modern AI engineering technologies and
          development practices. Their contribution, dedication, and willingness to learn and
          take on new challenges were highly appreciated.
        </p>
        <p style={{ margin: 0, fontSize: "11px", color: "#536B73", lineHeight: "1.6" }}>
          We sincerely appreciate their contribution during the internship and wish them every
          success and the very best in all their future academic and professional endeavours.
        </p>

        {/* Signature block */}
        <div style={{ marginTop: "auto" }}>
          {signatureDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={signatureDataUrl}
              alt="Signature"
              style={{
                height: "72px",
                width: "auto",
                objectFit: "contain",
                objectPosition: "left bottom",
                display: "block",
                maxWidth: "190px",
                mixBlendMode: "multiply",
              }}
            />
          ) : (
            <div style={{ height: "72px" }} />
          )}
          <div style={{ width: "155px", height: "1px", background: "#062F36", opacity: 0.2, margin: "1px 0 5px" }} />
          <p style={{ margin: "0 0 1px 0", fontSize: "13px", fontWeight: "800", color: "#062F36" }}>
            {SIGNATORY.name}
          </p>
          <p style={{ margin: "0 0 1px 0", fontSize: "10px", color: "#536B73" }}>
            {SIGNATORY.title}
          </p>
          <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", color: "#062F36" }}>
            {SIGNATORY.company}
          </p>
        </div>
      </div>

      {/* ── Vertical divider ── */}
      <div
        style={{
          position: "absolute",
          left: "620px", top: "112px", bottom: "148px",
          width: "1px",
          background: "#D7E2E4",
          zIndex: 4,
        }}
      />

      {/* ── RIGHT COLUMN: structured metadata ── */}
      <div
        style={{
          position: "absolute",
          top: "106px", left: "642px", right: "38px", bottom: "148px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 4,
        }}
      >
        {[
          { label: "INTERN",             value: cert.student_name, large: true },
          { label: "ROLE",               value: role },
          { label: "INTERNSHIP PERIOD",  value: period },
          { label: "DURATION",           value: durationMonths },
          { label: "CERTIFICATE ID",     value: cert.certificate_id },
        ].map((item, i) => (
          <div key={i}>
            {i > 0 && (
              <div style={{ width: "100%", height: "1px", background: "#D7E2E4", margin: "9px 0" }} />
            )}
            <p style={{ margin: "0 0 3px 0", fontSize: "8px", fontWeight: "700", color: "#536B73", letterSpacing: "2.5px" }}>
              {item.label}
            </p>
            <p style={{ margin: 0, fontSize: item.large ? "17px" : "12px", fontWeight: item.large ? "900" : "700", color: "#062F36", lineHeight: 1.2, letterSpacing: "0.1px" }}>
              {item.value}
            </p>
          </div>
        ))}

        {/* QR verify block */}
        <div
          style={{
            marginTop: "14px",
            padding: "14px 18px",
            background: "rgba(231,245,244,0.45)",
            border: "1px solid #D7E2E4",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            boxSizing: "border-box",
          }}
        >
          {/* QR constrained to 80×80, SVG clipped to fit */}
          <div
            dangerouslySetInnerHTML={{ __html: qrSvg }}
            style={{
              width: "82px",
              height: "82px",
              flexShrink: 0,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 5px 0", fontSize: "9px", fontWeight: "700", color: "#079DB3", letterSpacing: "2px" }}>
              VERIFY CREDENTIAL
            </p>
            <p style={{ margin: "0 0 3px 0", fontSize: "8.5px", color: "#536B73", lineHeight: 1.4 }}>
              Scan the QR code or visit:
            </p>
            <p style={{ margin: "0 0 10px 0", fontSize: "8.5px", color: "#079DB3", fontWeight: "600" }}>
              countsai.com/verify
            </p>
            <p style={{ margin: "0 0 3px 0", fontSize: "8px", fontWeight: "700", color: "#536B73", letterSpacing: "1.5px" }}>
              CERTIFICATE ID
            </p>
            <p style={{ margin: 0, fontSize: "9.5px", fontWeight: "800", color: "#062F36", letterSpacing: "0.3px" }}>
              {cert.certificate_id}
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer rule ── */}
      <div
        style={{
          position: "absolute",
          bottom: "138px", left: "38px", right: "38px",
          height: "1px",
          background: "#D7E2E4",
          zIndex: 4,
        }}
      />

      {/* ── Footer: company + disclaimer ── */}
      <div
        style={{
          position: "absolute",
          bottom: "24px", left: "38px", right: "38px",
          height: "108px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 4,
        }}
      >
        <p style={{ margin: 0, fontSize: "8.5px", color: "#536B73", lineHeight: "1.7" }}>
          <strong style={{ color: "#062F36" }}>Counts AI Ltd</strong> ·{" "}
          {SIGNATORY.registered} · Registered Office: {SIGNATORY.address} ·{" "}
          {INTERNSHIP_PHONE_FULL} · {SIGNATORY.email}
        </p>

        <div
          style={{
            padding: "8px 14px",
            background: "rgba(6,47,54,0.03)",
            border: "1px solid rgba(6,47,54,0.07)",
            borderRadius: "2px",
          }}
        >
          <p style={{ margin: 0, fontSize: "8px", color: "#536B73", lineHeight: "1.6", fontStyle: "italic" }}>
            <strong style={{ color: "#062F36", fontStyle: "normal", fontWeight: "700" }}>Note:</strong>{" "}
            The internship was undertaken on a consultant basis during the above-mentioned period,
            in accordance with the terms and conditions agreed between the intern and Counts AI Ltd.
          </p>
        </div>

        <p style={{ margin: 0, fontSize: "7.5px", color: "#C5D4D7", letterSpacing: "2px", fontWeight: "600" }}>
          COUNTS AI · BUILDING THE NEXT GENERATION OF AI ENGINEERS · LONDON · GLOBAL · HUMAN-ALIGNED AI
        </p>
      </div>
    </div>
  );
}
