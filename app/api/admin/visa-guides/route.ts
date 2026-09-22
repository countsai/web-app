import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from("visa_guides")
    .select("*")
    .order("country", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guides: data ?? [] });
}

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const body = await req.json().catch(() => null);
  const country = body?.country as string | undefined;
  if (!country) return NextResponse.json({ error: "country is required" }, { status: 400 });

  const { data, error } = await admin
    .from("visa_guides")
    .insert({
      country,
      country_code: body?.country_code ?? "",
      title: body?.title ?? "",
      content: body?.content ?? "",
      visa_type: body?.visa_type ?? "",
      processing_time: body?.processing_time ?? "",
      difficulty: body?.difficulty ?? "Medium",
      sponsorship_likelihood: body?.sponsorship_likelihood ?? "",
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ guide: data });
}

export async function PATCH(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const body = await req.json().catch(() => null);
  const id = body?.id as string | undefined;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const fields = ["country", "country_code", "title", "content", "visa_type", "processing_time", "difficulty", "sponsorship_likelihood"] as const;
  const update: Record<string, string> = {};
  for (const field of fields) {
    if (body?.[field] !== undefined) update[field] = body[field];
  }
  if (Object.keys(update).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const { error } = await admin.from("visa_guides").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  const admin = supabaseAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await admin.from("visa_guides").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
