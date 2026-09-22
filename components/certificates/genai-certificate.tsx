// GenAI Certificate — two-panel layout with satin left panel + dot-pattern right.
// Font sizes bumped in header/footer, verify block expanded, spacing tuned.

import { CERT_META, SIGNATORY, formatDate } from "@/lib/certificates";
import type { Certificate } from "@/lib/certificates";

interface Props {
  cert: Certificate;
  qrSvg: string;
  logoDataUrl: string;
  signatureDataUrl?: string;
}

export function GenAICertificate({ cert, qrSvg, logoDataUrl, signatureDataUrl }: Props) {
  const meta = CERT_META["genai"];
  const programDesc =
    "A comprehensive program in modern AI systems, including generative AI, agentic architectures, and real-world application development.";

  // Satin: smooth multi-angle light sweeps, no fiber lines
  const satinBg = [
    "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.07) 22%, transparent 42%, rgba(7,157,179,0.20) 57%, transparent 72%, rgba(255,255,255,0.18) 88%, rgba(7,157,179,0.04) 100%)",
    "linear-gradient(215deg, rgba(255,255,255,0.10) 0%, transparent 38%, rgba(255,255,255,0.08) 62%, transparent 100%)",
    "#062F36",
  ].join(", ");

  return (
    <div
      style={{
        width: "1122px",
        height: "794px",
        display: "flex",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — satin navy + vertical CERTIFICATE text
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          width: "264px",
          flexShrink: 0,
          background: satinBg,
          borderRight: "3px solid #079DB3",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "26px 0 22px",
          boxSizing: "border-box",
        }}
      >
        {/* Logo + LONDON grouped tightly */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          {logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoDataUrl}
              alt="Counts AI"
              style={{ height: "40px", objectFit: "contain", filter: "brightness(0) invert(1)" }}
            />
          ) : (
            <span style={{ fontSize: "15px", fontWeight: "900", color: "#fff", letterSpacing: "2px" }}>COUNTS AI</span>
          )}
          <span style={{ fontSize: "9px", fontWeight: "300", color: "rgba(255,255,255,0.50)", letterSpacing: "8px", textTransform: "uppercase", lineHeight: 1 }}>LONDON</span>
        </div>

        {/* Teal divider */}
        <div style={{ width: "36px", height: "1px", background: "rgba(7,157,179,0.55)", margin: "14px 0 0" }} />

        {/* ── CERTIFICATE + OF COMPLETION vertical text ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          {/* "CERTIFICATE" — main vertical text, bottom-to-top */}
          <span
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "84px",
              fontWeight: "900",
              color: "rgba(255,255,255,0.94)",
              letterSpacing: "-3px",
              lineHeight: 1,
              display: "block",
              // Subtle text shadow for depth
              textShadow: "1px 1px 8px rgba(0,0,0,0.35), -1px -1px 0 rgba(7,157,179,0.12)",
            }}
          >
            CERTIFICATE
          </span>

          {/* "OF COMPLETION" — thin, teal */}
          <span
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "11.5px",
              fontWeight: "400",
              color: "rgba(7,157,179,0.85)",
              letterSpacing: "5.5px",
              lineHeight: 1,
              display: "block",
            }}
          >
            OF COMPLETION
          </span>
        </div>

        {/* Bottom micro-text */}
        <p style={{ margin: 0, fontSize: "7.5px", color: "rgba(255,255,255,0.22)", letterSpacing: "1.2px", textAlign: "center", padding: "0 14px" }}>
          COUNTS AI LTD · REG. NO. 16375927
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — dot-pattern background, clean content
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          backgroundImage: "radial-gradient(circle, rgba(6,47,54,0.055) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          display: "flex",
          flexDirection: "column",
          padding: "22px 34px 16px 36px",
          boxSizing: "border-box",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <p style={{ margin: 0, fontSize: "11px", fontWeight: "700", color: "#079DB3", letterSpacing: "3.5px" }}>
            {meta.title}
          </p>
          <p style={{ margin: 0, fontSize: "9px", color: "#8AA5AB", textAlign: "right" }}>
            Counts AI Ltd · Registered in England &amp; Wales
          </p>
        </div>

        {/* Header rule */}
        <div style={{ height: "1px", background: "#D7E2E4" }} />

        {/* ── BODY — vertically centred ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: "8px",
          }}
        >
          <p style={{ margin: "0 0 12px 0", fontSize: "8.5px", fontWeight: "600", color: "#536B73", letterSpacing: "5.5px", textTransform: "uppercase" }}>
            This is to certify that
          </p>

          <h1 style={{ margin: "0 0 6px 0", fontSize: "58px", fontWeight: "900", color: "#062F36", lineHeight: "1.0", letterSpacing: "-1.5px", textAlign: "center" }}>
            {cert.student_name}
          </h1>

          {/* Teal accent bar */}
          <div style={{ width: "54px", height: "3px", background: "#079DB3", margin: "8px 0 14px", borderRadius: "2px" }} />

          <p style={{ margin: "0 0 7px 0", fontSize: "8.5px", fontWeight: "600", color: "#536B73", letterSpacing: "5.5px", textTransform: "uppercase" }}>
            has successfully completed the
          </p>

          <p style={{ margin: "0 0 8px 0", fontSize: "30px", fontWeight: "700", color: "#079DB3", textAlign: "center" }}>
            {cert.program_name}
          </p>

          <p style={{ margin: "0 0 20px 0", fontSize: "10.5px", color: "#6B8A92", lineHeight: "1.65", textAlign: "center", maxWidth: "460px" }}>
            {programDesc}
          </p>

          {/* Three-column metadata */}
          <div style={{ display: "flex", alignItems: "stretch" }}>
            {[
              { label: "COMPLETED", value: cert.completion_date ? formatDate(cert.completion_date) : "—" },
              { label: "ISSUED",    value: formatDate(cert.issue_date) },
              { label: "CERTIFICATE ID", value: cert.certificate_id },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                {i > 0 && <div style={{ width: "1px", background: "#D0DCE0", margin: "0 24px" }} />}
                <div style={{ textAlign: "center", minWidth: "124px" }}>
                  <p style={{ margin: "0 0 5px 0", fontSize: "8px", fontWeight: "700", color: "#079DB3", letterSpacing: "2.5px" }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: "12.5px", fontWeight: "700", color: "#062F36" }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer rule */}
        <div style={{ height: "1px", background: "#D7E2E4", margin: "0 0 14px 0" }} />

        {/* ── FOOTER: Signature | Seal | QR+Verify ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Signature */}
          <div style={{ width: "200px", flexShrink: 0, alignSelf: "flex-start" }}>
            {signatureDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={signatureDataUrl}
                alt="Signature"
                style={{
                  height: "82px",
                  width: "auto",
                  objectFit: "contain",
                  objectPosition: "left bottom",
                  display: "block",
                  maxWidth: "190px",
                  mixBlendMode: "multiply",
                }}
              />
            ) : (
              <div style={{ height: "82px" }} />
            )}
            <div style={{ width: "152px", height: "1px", background: "rgba(6,47,54,0.22)", margin: "1px 0 6px" }} />
            <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "800", color: "#062F36" }}>
              {SIGNATORY.name}
            </p>
            <p style={{ margin: "0 0 1px 0", fontSize: "10px", color: "#536B73" }}>{SIGNATORY.title}</p>
            <p style={{ margin: 0, fontSize: "10px", fontWeight: "700", color: "#062F36" }}>{SIGNATORY.company}</p>
          </div>

          {/* Seal */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
              <circle cx="55" cy="55" r="52" fill="none" stroke="rgba(7,157,179,0.22)" strokeWidth="1.5" strokeDasharray="3 2.5" />
              <circle cx="55" cy="55" r="45" fill="none" stroke="rgba(7,157,179,0.10)" strokeWidth="0.8" />
              {/* Full circle path so the complete text wraps all the way around */}
              <path id="sarc" d="M 8 55 a 47 47 0 0 1 94 0 a 47 47 0 0 1 -94 0" fill="none" />
              <text fontSize="5.5" fill="rgba(7,157,179,0.60)" fontWeight="700" letterSpacing="2.8"
                fontFamily="Helvetica Neue, Arial, sans-serif">
                <textPath href="#sarc" startOffset="3%">
                  COUNTS AI · AI TALENT FOR A BRIGHTER TOMORROW ·
                </textPath>
              </text>
              {logoDataUrl ? (
                <image href={logoDataUrl} x="22" y="22" width="66" height="66" opacity="0.22" />
              ) : (
                <text x="55" y="60" textAnchor="middle" fontSize="12" fontWeight="900"
                  fill="rgba(6,47,54,0.25)" fontFamily="Helvetica Neue, Arial, sans-serif">CAI</text>
              )}
            </svg>
          </div>

          {/* QR + Verify — bigger fonts, no URL wrapping issues */}
          <div
            style={{
              width: "248px",
              flexShrink: 0,
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: qrSvg }}
              style={{ width: "82px", height: "82px", flexShrink: 0 }}
            />
            <div style={{ paddingTop: "3px" }}>
              <p style={{ margin: "0 0 5px 0", fontSize: "9px", fontWeight: "700", color: "#079DB3", letterSpacing: "2px" }}>
                VERIFY CREDENTIAL
              </p>
              <p style={{ margin: "0 0 3px 0", fontSize: "8.5px", color: "#536B73", lineHeight: "1.45" }}>
                Scan the QR or visit:
              </p>
              <p style={{ margin: "0 0 8px 0", fontSize: "8px", color: "#079DB3", fontWeight: "600" }}>
                countsai.com/verify
              </p>
              <p style={{ margin: "0 0 3px 0", fontSize: "7.5px", fontWeight: "700", color: "#536B73", letterSpacing: "1.5px" }}>
                CERTIFICATE ID
              </p>
              <p style={{ margin: 0, fontSize: "9px", fontWeight: "800", color: "#062F36", letterSpacing: "0.3px" }}>
                {cert.certificate_id}
              </p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM STRIP ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "8px",
            paddingTop: "7px",
            borderTop: "1px solid rgba(215,226,228,0.6)",
          }}
        >
          <p style={{ margin: 0, fontSize: "8.5px", color: "#96B0B5", letterSpacing: "0.2px" }}>
            {SIGNATORY.registered} · {SIGNATORY.address} · {SIGNATORY.phone} · {SIGNATORY.email}
          </p>
          <p style={{ margin: 0, fontSize: "8.5px", color: "#96B0B5", letterSpacing: "2.5px", fontWeight: "600" }}>
            LONDON · GLOBAL · HUMAN-ALIGNED AI
          </p>
        </div>
      </div>
    </div>
  );
}
