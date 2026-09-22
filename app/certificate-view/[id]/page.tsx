// Certificate view + print page — no auth required.
// Used for: preview, "View Certificate" button, and browser print-to-PDF.

import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { CertificateTemplate } from "@/components/certificates/certificate-template";
import { CertificateToolbar } from "./toolbar";
import { AutoPrint } from "./auto-print";
import { buildVerificationUrl } from "@/lib/certificates";
import type { Certificate } from "@/lib/certificates";
import type { Metadata } from "next";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const admin = supabaseAdmin();
  const { data: cert } = await admin.from("certificates").select("certificate_id").eq("id", id).single();
  return {
    title: cert ? `${cert.certificate_id} — Counts AI Certificate` : "Certificate — Counts AI",
  };
}

export default async function CertificateViewPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const autoPrint = sp.print === "1";

  const admin = supabaseAdmin();
  const { data: cert, error } = await admin
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !cert) notFound();

  // Always reconstruct the verification URL from the live app URL
  const verifyUrl = buildVerificationUrl(cert.certificate_id);

  // QR code pointing to the live URL
  let qrSvg = "";
  try {
    qrSvg = await QRCode.toString(verifyUrl, {
      type: "svg",
      width: 88,
      margin: 1,
      color: { dark: "#062F36", light: "#ffffff" },
    });
  } catch {
    qrSvg = "";
  }

  // Load logo from public folder as base64
  let logoDataUrl = "";
  try {
    const logoPath = path.join(process.cwd(), "public", "logo-light.png");
    if (fs.existsSync(logoPath)) {
      logoDataUrl = `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
    }
  } catch {
    logoDataUrl = "";
  }

  // Load signature from public folder as base64
  let signatureDataUrl = "";
  try {
    const sigPath = path.join(process.cwd(), "public", "signature.png");
    if (fs.existsSync(sigPath)) {
      signatureDataUrl = `data:image/png;base64,${fs.readFileSync(sigPath).toString("base64")}`;
    }
  } catch {
    signatureDataUrl = "";
  }

  // Merge live URL into cert object
  const certWithLiveUrl: Certificate = { ...(cert as Certificate), verification_url: verifyUrl };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .cert-page {
          background: #eef2f3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          padding: 32px 16px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cert-wrapper {
          box-shadow: 0 12px 48px rgba(6,47,54,0.18), 0 2px 8px rgba(6,47,54,0.08);
          border-radius: 2px;
          flex-shrink: 0;
          max-width: 100%;
          overflow: auto;
        }
        .toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          padding: 10px 22px;
          border-radius: 24px;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.15s;
        }
        .btn:hover { opacity: 0.85; }
        .btn-primary { background: #079DB3; color: white; }
        .btn-secondary { background: white; color: #062F36; border: 2px solid #D7E2E4; }
        .status-revoked-bar {
          background: #fff1f1;
          border: 1px solid #fcc;
          color: #c0392b;
          padding: 10px 20px;
          border-radius: 6px;
          text-align: center;
          margin-bottom: 16px;
          font-weight: 700;
          font-size: 14px;
          max-width: 700px;
        }
        @media print {
          .cert-page {
            background: white !important;
            padding: 0 !important;
            display: block !important;
            min-height: unset !important;
          }
          .toolbar, .no-print { display: none !important; }
          .cert-wrapper {
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: visible !important;
          }
          /* Force all background colors, gradients, and images to print */
          *, *::before, *::after {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      <div className="cert-page">
        {cert.status === "revoked" && (
          <div className="status-revoked-bar no-print">
            ⚠ This certificate has been revoked
            {cert.revoked_at ? ` on ${new Date(cert.revoked_at).toLocaleDateString("en-GB")}` : ""}.
          </div>
        )}

        {!autoPrint && <CertificateToolbar verifyUrl={verifyUrl} />}
        {autoPrint && <AutoPrint />}

        <div className="cert-wrapper">
          <CertificateTemplate
            cert={certWithLiveUrl}
            qrSvg={qrSvg}
            logoDataUrl={logoDataUrl}
            signatureDataUrl={signatureDataUrl}
          />
        </div>
      </div>
    </>
  );
}
