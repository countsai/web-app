import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import QRCode from "qrcode";
import * as fs from "fs";
import * as path from "path";
import { createElement } from "react";
import type { ReactElement } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { CertificatePDF } from "@/lib/pdf/certificate-pdf";
import type { Certificate } from "@/lib/certificates";

// ─── POST /api/admin/certificates/[id]/pdf ────────────────────────────────────
// Generates a PDF for the certificate, uploads to Supabase Storage,
// updates pdf_storage_path in DB, and returns a signed download URL.

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = supabaseAdmin();

    // Fetch certificate
    const { data: cert, error: fetchErr } = await admin
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !cert) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    // Load logo as base64 data URL
    let logoDataUrl = "";
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      const logoBuffer = fs.readFileSync(logoPath);
      logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch {
      // Logo file not found — render without logo
    }

    // Generate QR code as PNG data URL
    const qrDataUrl = await QRCode.toDataURL(cert.verification_url, {
      width: 200,
      margin: 1,
      errorCorrectionLevel: "M",
    });

    // Render PDF to buffer
    const element = createElement(CertificatePDF, {
      cert: cert as Certificate,
      logoDataUrl,
      qrDataUrl,
    }) as unknown as ReactElement<DocumentProps, typeof Document>;
    const pdfBuffer = await renderToBuffer(element);

    // Upload to Supabase Storage — bucket: certificates
    const storagePath = `certificates/${cert.certificate_id}.pdf`;

    const { error: uploadErr } = await admin.storage
      .from("certificates")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadErr) {
      console.error("[pdf upload]", uploadErr);
      return NextResponse.json({ error: "PDF upload failed: " + uploadErr.message }, { status: 500 });
    }

    // Update pdf_storage_path in DB
    const { error: updateErr } = await admin
      .from("certificates")
      .update({ pdf_storage_path: storagePath })
      .eq("id", id);

    if (updateErr) {
      console.error("[pdf db update]", updateErr);
    }

    // Audit
    await admin.from("certificate_audit_log").insert({
      certificate_id: cert.certificate_id,
      action: "pdf_generated",
      actor: "admin",
      metadata: { storage_path: storagePath },
    });

    // Create a short-lived signed URL (1 hour)
    const { data: signedData, error: signErr } = await admin.storage
      .from("certificates")
      .createSignedUrl(storagePath, 3600);

    if (signErr || !signedData?.signedUrl) {
      return NextResponse.json({ ok: true, storagePath });
    }

    return NextResponse.json({ ok: true, storagePath, downloadUrl: signedData.signedUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[pdf generate]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── GET: return a signed download URL for the existing PDF ──────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = supabaseAdmin();

    const { data: cert, error } = await admin
      .from("certificates")
      .select("certificate_id, pdf_storage_path")
      .eq("id", id)
      .single();

    if (error || !cert) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    if (!cert.pdf_storage_path) {
      return NextResponse.json({ error: "PDF not yet generated." }, { status: 404 });
    }

    const { data: signedData, error: signErr } = await admin.storage
      .from("certificates")
      .createSignedUrl(cert.pdf_storage_path, 3600);

    if (signErr || !signedData?.signedUrl) {
      return NextResponse.json({ error: "Could not create signed URL." }, { status: 500 });
    }

    return NextResponse.json({ downloadUrl: signedData.signedUrl });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
