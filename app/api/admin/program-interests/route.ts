import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("program_interests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ interests: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  const status = body?.status as string | undefined;

  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });

  const { error } = await admin.from("program_interests").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
