import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("candidate_profiles")
    .select("*, profiles(full_name, email, phone, account_type, created_at)")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ candidates: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const verification_status = body?.verification_status as string | undefined;
  const admin_notes = body?.admin_notes as string | undefined;

  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const update: Record<string, string> = {};
  if (verification_status !== undefined) update.verification_status = verification_status;
  if (admin_notes !== undefined) update.admin_notes = admin_notes;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { error } = await admin.from("candidate_profiles").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
