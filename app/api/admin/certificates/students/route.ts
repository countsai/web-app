import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

// ─── GET: search students for certificate form ────────────────────────────────
// Returns jobseeker profiles matching a search query.

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") ?? "";

    if (search.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from("profiles")
      .select("id, full_name, email, account_type")
      .eq("account_type", "jobseeker")
      .or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
      .order("full_name")
      .limit(20);

    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
