import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ─── GET: public certificate verification — NO AUTH REQUIRED ──────────────────
// Returns only intentionally public information.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    const { certificateId } = await params;
    const admin = supabaseAdmin();

    const { data, error } = await admin
      .from("certificates")
      .select(
        "id, certificate_id, certificate_type, student_name, program_name, role, " +
        "issue_date, completion_date, internship_start_date, internship_end_date, " +
        "status, revoked_at, revocation_reason, verification_url"
      )
      .eq("certificate_id", certificateId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    }

    // Audit view
    await admin.from("certificate_audit_log").insert({
      certificate_id: certificateId,
      action: "viewed",
      actor: "public",
      metadata: { ip: req.headers.get("x-forwarded-for") ?? "unknown" },
    });

    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
