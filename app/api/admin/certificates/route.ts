import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { buildVerificationUrl, CERT_META } from "@/lib/certificates";
import type { CertificateType } from "@/lib/certificates";
import { requireAdmin } from "@/lib/admin-auth";

// ─── GET: list all certificates ───────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;
  try {
    const admin = supabaseAdmin();
    const { searchParams } = new URL(req.url);
    const type   = searchParams.get("type");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page   = parseInt(searchParams.get("page") ?? "1", 10);
    const limit  = parseInt(searchParams.get("limit") ?? "25", 10);
    const offset = (page - 1) * limit;

    let query = admin
      .from("certificates")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (type)   query = query.eq("certificate_type", type);
    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(
        `student_name.ilike.%${search}%,student_email.ilike.%${search}%,certificate_id.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ data, count });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[admin/certificates GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── POST: generate a single certificate ──────────────────────────────────────

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;
  try {
    const body = await req.json();
    const {
      certificateType,
      studentId,
      studentName,
      studentEmail,
      completionDate,
      internshipStartDate,
      internshipEndDate,
      issueDate,
      skills,
      forceCreate,
    } = body;

    if (!certificateType || !studentName || !studentEmail || !issueDate) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    // ── Duplicate protection ──────────────────────────────────────────────────
    if (!forceCreate) {
      const { data: existing } = await admin
        .from("certificates")
        .select("id, certificate_id")
        .eq("student_email", studentEmail)
        .eq("certificate_type", certificateType)
        .eq("status", "active")
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "DUPLICATE", existing },
          { status: 409 }
        );
      }
    }

    // ── Generate unique certificate ID ────────────────────────────────────────
    const meta = CERT_META[certificateType as CertificateType];
    const year = new Date().getFullYear();
    const rand = Math.random().toString(36).toUpperCase().slice(2, 8);
    const certificateId = `${meta.idPrefix}-${year}-${rand}`;

    const verificationUrl = buildVerificationUrl(certificateId);

    // Internship role/program defaults
    const role        = certificateType === "internship" ? (body.role || "Forward Deployed Engineer") : null;
    const programName = meta.programName;

    const record = {
      certificate_id:        certificateId,
      certificate_type:      certificateType,
      student_id:            studentId || null,
      student_name:          studentName,
      student_email:         studentEmail,
      program_name:          programName,
      role,
      completion_date:       completionDate || null,
      internship_start_date: internshipStartDate || null,
      internship_end_date:   internshipEndDate || null,
      issue_date:            issueDate,
      skills:                skills || [],
      verification_url:      verificationUrl,
      status:                "active",
      created_by:            "admin",
    };

    const { data, error } = await admin
      .from("certificates")
      .insert(record)
      .select()
      .single();

    if (error) throw error;

    // Audit log
    await admin.from("certificate_audit_log").insert({
      certificate_id: certificateId,
      action: "created",
      actor: "admin",
      metadata: { student_email: studentEmail, type: certificateType },
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    const msg =
      e instanceof Error ? e.message :
      (e != null && typeof e === "object" && "message" in e) ? String((e as Record<string, unknown>).message) :
      JSON.stringify(e);
    console.error("[admin/certificates POST]", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
