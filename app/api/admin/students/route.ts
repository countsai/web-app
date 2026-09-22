import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

// ─── GET: list students (profiles with account_type = jobseeker) ───────────────

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const page   = parseInt(searchParams.get("page") ?? "1", 10);
    const limit  = parseInt(searchParams.get("limit") ?? "25", 10);
    const offset = (page - 1) * limit;

    const admin = supabaseAdmin();

    let query = admin
      .from("profiles")
      .select("id, email, full_name, phone, account_type, created_at", { count: "exact" })
      .eq("account_type", "jobseeker")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: students, error, count } = await query;
    if (error) throw error;

    // Attach certificate counts
    const emails = (students ?? []).map((s) => s.email).filter(Boolean);
    let certCounts: Record<string, number> = {};

    if (emails.length > 0) {
      const { data: certs } = await admin
        .from("certificates")
        .select("student_email")
        .in("student_email", emails)
        .eq("status", "active");

      for (const c of certs ?? []) {
        certCounts[c.student_email] = (certCounts[c.student_email] ?? 0) + 1;
      }
    }

    const enriched = (students ?? []).map((s) => ({
      ...s,
      certificate_count: certCounts[s.email] ?? 0,
    }));

    return NextResponse.json({ data: enriched, count });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[admin/students GET]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── POST: create a new student ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const { fullName, email, phone } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Full name and email are required." }, { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();
    const admin = supabaseAdmin();

    // Check if profile already exists
    const { data: existing } = await admin
      .from("profiles")
      .select("id, email")
      .eq("email", emailLower)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "DUPLICATE", message: "A student with this email already exists.", existingId: existing.id },
        { status: 409 }
      );
    }

    // Create auth user (auto-confirm, random temp password)
    const tempPassword = `CountsAI_${Math.random().toString(36).slice(2, 10)}!`;
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: emailLower,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message ?? "Failed to create auth user." }, { status: 500 });
    }

    const userId = authData.user.id;

    // Upsert profile (Supabase trigger may have already created it)
    const { error: profileError } = await admin
      .from("profiles")
      .upsert({
        id:           userId,
        email:        emailLower,
        full_name:    fullName.trim(),
        phone:        phone?.trim() || null,
        account_type: "jobseeker",
      }, { onConflict: "id" });

    if (profileError) {
      // Rollback: delete auth user if profile upsert failed
      await admin.auth.admin.deleteUser(userId);
      throw profileError;
    }

    // Audit
    await admin.from("certificate_audit_log").insert({
      certificate_id: "N/A",
      action: "student_created",
      actor: "admin",
      metadata: { student_email: emailLower, student_name: fullName },
    }).maybeSingle();

    return NextResponse.json({ data: { id: userId, email: emailLower, full_name: fullName } }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[admin/students POST]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
