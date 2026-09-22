import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, Document } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import * as fs from "fs";
import * as path from "path";
import { createElement } from "react";
import type { ReactElement } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { InvoicePDF } from "@/lib/pdf/invoice-pdf";
import type { ConsultancyInvoice } from "@/lib/invoices";

type Params = { params: Promise<{ id: string }> };

// ─── POST: generate PDF, upload to storage, return signed URL ─────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = supabaseAdmin();

    const { data: invoice, error: fetchErr } = await admin
      .from("consultancy_invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    // Load logo
    let logoDataUrl = "";
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      const logoBuffer = fs.readFileSync(logoPath);
      logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch { /* render without logo */ }

    // Render PDF
    const element = createElement(InvoicePDF, {
      invoice: invoice as ConsultancyInvoice,
      logoDataUrl,
    }) as unknown as ReactElement<DocumentProps, typeof Document>;
    const pdfBuffer = await renderToBuffer(element);

    // Upload to invoices bucket
    const storagePath = `invoices/${invoice.invoice_number}.pdf`;

    const { error: uploadErr } = await admin.storage
      .from("invoices")
      .upload(storagePath, pdfBuffer, { contentType: "application/pdf", upsert: true });

    if (uploadErr) {
      return NextResponse.json({ error: "PDF upload failed: " + uploadErr.message }, { status: 500 });
    }

    await admin
      .from("consultancy_invoices")
      .update({ pdf_storage_path: storagePath })
      .eq("id", id);

    await admin.from("invoice_audit_log").insert({
      invoice_id:     id,
      invoice_number: invoice.invoice_number,
      action:         "pdf_generated",
      actor:          "admin",
      metadata:       { storage_path: storagePath },
    });

    const { data: signedData, error: signErr } = await admin.storage
      .from("invoices")
      .createSignedUrl(storagePath, 3600);

    if (signErr || !signedData?.signedUrl) {
      return NextResponse.json({ ok: true, storagePath });
    }

    return NextResponse.json({ ok: true, storagePath, downloadUrl: signedData.signedUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : (typeof e === "object" && e !== null && "message" in e) ? String((e as { message: unknown }).message) : JSON.stringify(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── GET: return signed URL for existing PDF ──────────────────────────────────

export async function GET(req: NextRequest, { params }: Params) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = supabaseAdmin();

    const { data: invoice, error } = await admin
      .from("consultancy_invoices")
      .select("invoice_number, pdf_storage_path")
      .eq("id", id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }
    if (!invoice.pdf_storage_path) {
      return NextResponse.json({ error: "PDF not yet generated." }, { status: 404 });
    }

    const { data: signedData, error: signErr } = await admin.storage
      .from("invoices")
      .createSignedUrl(invoice.pdf_storage_path, 3600);

    if (signErr || !signedData?.signedUrl) {
      return NextResponse.json({ error: "Could not create signed URL." }, { status: 500 });
    }

    return NextResponse.json({ downloadUrl: signedData.signedUrl });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
