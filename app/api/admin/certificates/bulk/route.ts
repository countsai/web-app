import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buildVerificationUrl, CERT_META } from "@/lib/certificates";
import type { CertificateType } from "@/lib/certificates";
import { requireAdmin } from "@/lib/admin-auth";

// ─── POST: bulk certificate generation ────────────────────────────────────────

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;
  try {
    const body = await req.json();
    const { certificateType, students, issueDate, completionDate, skills } = body;

    if (!certificateType || !Array.isArray(students) || students.length === 0 || !issueDate) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const meta = CERT_META[certificateType as CertificateType];
    const results: { email: string; success: boolean; certificateId?: string; error?: string }[] = [];

    for (const student of students) {
      try {
        const { studentId, studentName, studentEmail } = student;

        if (!studentName || !studentEmail) {
          results.push({ email: studentEmail ?? "unknown", success: false, error: "Missing name or email." });
          continue;
        }

        // Duplicate check per student
        const { data: existing } = await admin
          .from("certificates")
          .select("certificate_id")
          .eq("student_email", studentEmail)
          .eq("certificate_type", certificateType)
          .eq("status", "active")
          .maybeSingle();

        if (existing) {
          results.push({ email: studentEmail, success: false, error: `Already has active ${meta.label} certificate: ${existing.certificate_id}` });
          continue;
        }

        // Generate unique ID
        const { data: certIdData, error: rpcErr } = await admin.rpc(
          "generate_certificate_id",
          { cert_type: certificateType as CertificateType }
        );
        if (rpcErr) throw rpcErr;
        const certificateId: string = certIdData as string;

        const verificationUrl = buildVerificationUrl(certificateId);

        const record = {
          certificate_id:   certificateId,
          certificate_type: certificateType,
          student_id:       studentId || null,
          student_name:     studentName,
          student_email:    studentEmail,
          program_name:     meta.programName,
          role:             certificateType === "internship" ? "Forward Deployed Engineer" : null,
          completion_date:  completionDate || null,
          issue_date:       issueDate,
          skills:           skills || [],
          verification_url: verificationUrl,
          status:           "active",
          created_by:       "admin",
        };

        const { error: insertErr } = await admin.from("certificates").insert(record);
        if (insertErr) throw insertErr;

        await admin.from("certificate_audit_log").insert({
          certificate_id: certificateId,
          action: "created",
          actor: "admin",
          metadata: { student_email: studentEmail, type: certificateType, bulk: true },
        });

        results.push({ email: studentEmail, success: true, certificateId });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results.push({ email: student.studentEmail ?? "unknown", success: false, error: msg });
      }
    }

    const succeeded = results.filter(r => r.success).length;
    const failed    = results.filter(r => !r.success).length;

    return NextResponse.json({ results, succeeded, failed }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
