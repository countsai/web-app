import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });
    const admin = supabaseAdmin();
    const { error } = await admin.from("program_interests").insert({
      user_id:  null,
      name:     name || null,
      email,
      status:   "interested",
    });
    if (error) {
      console.error("[program-interest]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
