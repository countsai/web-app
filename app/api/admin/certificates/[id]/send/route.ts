import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { CERT_META, formatDate } from "@/lib/certificates";
import type { CertificateType } from "@/lib/certificates";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const admin = supabaseAdmin();

    const { data: cert, error: fetchErr } = await admin
      .from("certificates")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !cert) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    const meta = CERT_META[cert.certificate_type as CertificateType];
    const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://countsai.com"}/certificate-view/${cert.id}`;
    const verifyUrl = cert.verification_url;

    // Send via Resend if configured
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Your Certificate from Counts AI</title></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0a3a44">
  <div style="text-align:center;margin-bottom:24px">
    <h1 style="color:#079DB3;font-size:28px;margin:0">🎓 Congratulations!</h1>
  </div>
  <p>Dear <strong>${cert.student_name}</strong>,</p>
  <p>We are delighted to inform you that your certificate has been issued.</p>
  <div style="background:#e3f7fb;border-left:4px solid #079DB3;padding:16px;border-radius:8px;margin:20px 0">
    <p style="margin:0 0 6px 0"><strong>Certificate:</strong> ${meta.label}</p>
    <p style="margin:0 0 6px 0"><strong>Certificate ID:</strong> ${cert.certificate_id}</p>
    <p style="margin:0 0 6px 0"><strong>Issue Date:</strong> ${formatDate(cert.issue_date)}</p>
    <p style="margin:0"><strong>Status:</strong> Active ✓</p>
  </div>
  <div style="text-align:center;margin:28px 0">
    <a href="${viewUrl}" style="display:inline-block;background:#079DB3;color:white;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:bold;margin:0 8px">View Certificate</a>
    <a href="${verifyUrl}" style="display:inline-block;background:#0a3a44;color:white;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:bold;margin:0 8px">Verify Online</a>
  </div>
  <p>You can add this credential to your LinkedIn profile or share it with employers using the verification link:</p>
  <p style="word-break:break-all;color:#079DB3">${verifyUrl}</p>
  <hr style="border:none;border-top:1px solid #dbe9eb;margin:24px 0">
  <p style="font-size:12px;color:#85a0a4">Counts AI Ltd · 124 City Rd, London EC1V 2NX · info@countsai.com</p>
</body>
</html>`;

      const { error: emailErr } = await resend.emails.send({
        from: "Counts AI <certificates@countsai.com>",
        to: cert.student_email,
        subject: `Your ${meta.label} Certificate — Counts AI`,
        html,
      });

      if (emailErr) {
        console.error("[send cert email]", emailErr);
        return NextResponse.json({ error: "Email send failed." }, { status: 500 });
      }
    } else {
      console.warn("[send cert] RESEND_API_KEY not set — email skipped.");
    }

    // Audit
    await admin.from("certificate_audit_log").insert({
      certificate_id: cert.certificate_id,
      action: "emailed",
      actor: "admin",
      metadata: { to: cert.student_email },
    });

    return NextResponse.json({ success: true, emailSent: !!apiKey });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
