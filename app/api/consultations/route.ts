import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, countryCode, interestedIn } = await req.json();
    if (!name || !email || !phone || !interestedIn) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const admin = supabaseAdmin();
    const { error } = await admin.from("consultations").insert({
      name,
      email: email || null,
      phone,
      country_code: countryCode || "+44",
      interested_in: interestedIn,
      status: "new",
    });
    if (error) {
      console.error("[consultations]", error.message, error.details);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[consultations] unhandled:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
