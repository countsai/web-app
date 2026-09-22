import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = supabaseAdmin();

    // Fetch profile
    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("id, email, full_name, phone, account_type, created_at")
      .eq("id", id)
      .maybeSingle();

    if (profileErr) throw profileErr;
    if (!profile) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    // Fetch certificates
    const { data: certificates, error: certErr } = await admin
      .from("certificates")
      .select("*")
      .eq("student_email", profile.email)
      .order("created_at", { ascending: false });

    if (certErr) throw certErr;

    // Fetch audit log — by cert IDs if any, plus student_created entries
    const certIds = (certificates ?? []).map((c) => c.id);
    let auditQuery = admin
      .from("certificate_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (certIds.length > 0) {
      auditQuery = auditQuery.in("certificate_id", certIds);
    } else {
      auditQuery = auditQuery.eq("action", "student_created");
    }

    const { data: audit } = await auditQuery;

    return NextResponse.json({ data: { profile, certificates: certificates ?? [], audit: audit ?? [] } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[admin/students/[id] GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
