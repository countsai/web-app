import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Employer-facing talent pool — only admin-vetted candidates are visible.
const VISIBLE_STATUSES = ["Client Ready", "Top Talent"];

export async function GET() {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("candidate_profiles")
    .select("id, headline, skills, target_roles, preferred_locations, visa_status, verification_status, updated_at, profiles(full_name)")
    .in("verification_status", VISIBLE_STATUSES)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ candidates: data ?? [] });
}
