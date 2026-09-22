import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, accountType, companyName, contactName } = await req.json();

    if (!email || !password || !accountType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const admin = supabaseAdmin();

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message ?? "Registration failed." }, { status: 400 });
    }

    // Insert profile
    const { error: profileError } = await admin.from("profiles").insert({
      id: authData.user.id,
      email,
      full_name: accountType === "business" ? contactName : fullName,
      account_type: accountType,
      company_name: accountType === "business" ? companyName : null,
    });

    if (profileError) {
      console.error("[register] profile insert:", profileError.message, profileError.details);
      await admin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 });
    }

    return NextResponse.json({ userId: authData.user.id }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message
      : typeof e === "object" ? JSON.stringify(e)
      : String(e);
    console.error("[register] unhandled:", msg);
    return NextResponse.json({ error: msg || "Internal server error" }, { status: 500 });
  }
}
