import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, company, email, website, country,
      companySize, service, description, timeline, budget,
    } = body;

    if (!name || !company || !email || !service || !description) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const { error } = await admin.from("business_leads").insert({
      name,
      company,
      email,
      website:      website || null,
      country:      country || null,
      company_size: companySize || null,
      service,
      description,
      timeline:     timeline || null,
      budget:       budget || null,
      status:       "new",
    });

    if (error) {
      console.error("[business/contact]", error.message, error.details);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[business/contact] unhandled:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
