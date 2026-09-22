import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, skills, message } = await req.json();
    if (!name || !email) return NextResponse.json({ error: "Name and email required." }, { status: 400 });
    const admin = supabaseAdmin();
    const { error } = await admin.from("talent_pool").insert({
      name, email,
      phone:  phone  || null,
      skills: skills || null,
      message: message || null,
      status: "new",
    });
    if (error) {
      console.error("[talent-pool]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
