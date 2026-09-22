import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, email, phone, country, city,
      education, university, graduationYear,
      currentRole, yearsExperience, technicalSkills,
      aiExperience, githubUrl, linkedinUrl, portfolioUrl,
      motivation, preferredStart,
    } = body;

    if (!fullName || !email || !phone || !country || !education || !motivation) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const { error } = await admin.from("training_applications").insert({
      full_name:        fullName,
      email,
      phone,
      country,
      city:             city || null,
      education,
      university:       university || null,
      graduation_year:  graduationYear || null,
      applicant_role:   currentRole || null,
      years_experience: yearsExperience || null,
      technical_skills: technicalSkills || null,
      ai_experience:    aiExperience || null,
      github_url:       githubUrl || null,
      linkedin_url:     linkedinUrl || null,
      portfolio_url:    portfolioUrl || null,
      motivation,
      preferred_start:  preferredStart || null,
      status:           "new",
    });

    if (error) {
      console.error("[training/apply]", error.message, error.details);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[training/apply] unhandled:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
