import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { buildInvoiceNumber, DEFAULT_SERVICE_DESCRIPTION } from "@/lib/invoices";

// ─── GET: list all invoices ───────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const admin = supabaseAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page   = parseInt(searchParams.get("page")  ?? "1",  10);
    const limit  = parseInt(searchParams.get("limit") ?? "25", 10);
    const offset = (page - 1) * limit;

    let query = admin
      .from("consultancy_invoices")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq("status", status);
    if (search) {
      query = query.or(
        `consultant_name.ilike.%${search}%,consultant_email.ilike.%${search}%,invoice_number.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ data, count });
  } catch (e) {
    const msg = e instanceof Error ? e.message : (typeof e === "object" && e !== null && "message" in e) ? String((e as { message: unknown }).message) : JSON.stringify(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── POST: create a new invoice ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const {
      consultantId,
      consultantName,
      consultantEmail,
      invoiceDate,
      serviceStartDate,
      serviceEndDate,
      description,
      amount,
      currency = "GBP",
      status = "draft",
      notes,
    } = body;

    if (!consultantName || !consultantEmail || !invoiceDate || !serviceStartDate || !serviceEndDate) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return NextResponse.json({ error: "A valid amount is required." }, { status: 400 });
    }
    if (Number(amount) < 0) {
      return NextResponse.json({ error: "Amount cannot be negative." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const year  = new Date().getFullYear();

    // Sequence: count existing invoices for this year to assign next number
    const { count: yearCount } = await admin
      .from("consultancy_invoices")
      .select("id", { count: "exact", head: true })
      .like("invoice_number", `CAI-INV-${year}-%`);

    const invoiceNumber = buildInvoiceNumber(year, (yearCount ?? 0) + 1);

    const record = {
      invoice_number:     invoiceNumber,
      consultant_id:      consultantId || null,
      consultant_name:    consultantName,
      consultant_email:   consultantEmail,
      invoice_date:       invoiceDate,
      service_start_date: serviceStartDate,
      service_end_date:   serviceEndDate,
      description:        description || DEFAULT_SERVICE_DESCRIPTION,
      amount:             Number(amount),
      currency,
      status,
      notes:              notes || null,
      created_by:         "admin",
    };

    const { data, error } = await admin
      .from("consultancy_invoices")
      .insert(record)
      .select()
      .single();

    if (error) throw error;

    // Audit
    await admin.from("invoice_audit_log").insert({
      invoice_id:     data.id,
      invoice_number: invoiceNumber,
      action:         "created",
      actor:          "admin",
      metadata:       { consultant_email: consultantEmail, status },
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.error("[admin/invoices POST]", e);
    const msg = e instanceof Error
      ? e.message
      : (typeof e === "object" && e !== null && "message" in e)
        ? String((e as { message: unknown }).message)
        : JSON.stringify(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
