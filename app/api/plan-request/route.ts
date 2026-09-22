import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId, fullName, email, phone, plan } = await req.json();

    if (!userId || !fullName || !email || !plan) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (plan !== "plus" && plan !== "ultra" && plan !== "premium") {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    const { error } = await admin.from("plan_requests").insert({
      user_id: userId,
      full_name: fullName,
      email,
      phone: phone || null,
      plan,
      status: "pending",
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit your request." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
