import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

// ─── GET: fetch single certificate + audit log ────────────────────────────────

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
      .select("*")
      .eq("id", id)
      .single();

    if (error || !cert) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    const { data: auditLog } = await admin
      .from("certificate_audit_log")
      .select("*")
      .eq("certificate_id", cert.certificate_id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ data: cert, auditLog: auditLog ?? [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// ─── PATCH: update or revoke a certificate ────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;
  try {
    const { id } = await params;
    const body = await req.json();
    const admin = supabaseAdmin();

    // Load existing cert
    const { data: existing, error: fetchErr } = await admin
      .from("certificates")
      .select("certificate_id, status")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
    }

    // Build update payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    let auditAction = "status_changed";

    if (body.action === "revoke") {
      if (!body.revocationReason?.trim()) {
        return NextResponse.json({ error: "Revocation reason is required." }, { status: 400 });
      }
      updates.status            = "revoked";
      updates.revoked_at        = new Date().toISOString();
      updates.revoked_by        = body.revokedBy ?? "admin";
      updates.revocation_reason = body.revocationReason;
      auditAction = "revoked";
    } else if (body.action === "reinstate") {
      updates.status            = "active";
      updates.revoked_at        = null;
      updates.revoked_by        = null;
      updates.revocation_reason = null;
      auditAction = "reinstated";
    } else {
      // Generic field update
      const allowed = ["skills", "completion_date", "internship_start_date", "internship_end_date"];
      for (const field of allowed) {
        if (body[field] !== undefined) updates[field] = body[field];
      }
    }

    const { data, error } = await admin
      .from("certificates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await admin.from("certificate_audit_log").insert({
      certificate_id: existing.certificate_id,
      action: auditAction,
      actor: body.actor ?? "admin",
      metadata: updates,
    });

    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
