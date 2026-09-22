import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin-auth";
import { isImmutable } from "@/lib/invoices";
import type { InvoiceStatus } from "@/lib/invoices";

type Params = { params: Promise<{ id: string }> };

// ─── GET: single invoice + audit log ─────────────────────────────────────────

export async function GET(req: NextRequest, { params }: Params) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = supabaseAdmin();

    const { data: invoice, error } = await admin
      .from("consultancy_invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    const { data: auditLog } = await admin
      .from("invoice_audit_log")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ data: invoice, auditLog: auditLog ?? [] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : (typeof e === "object" && e !== null && "message" in e) ? String((e as { message: unknown }).message) : JSON.stringify(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── PATCH: update status or fields ──────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  const authErr = await requireAdmin(req);
  if (authErr) return authErr;

  try {
    const { id } = await params;
    const admin = supabaseAdmin();
    const body = await req.json();

    // Fetch current record to enforce immutability
    const { data: current, error: fetchErr } = await admin
      .from("consultancy_invoices")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !current) {
      return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
    }

    // Guard: issued/paid invoices cannot have financial fields silently modified
    const issuedOrPaid = isImmutable(current.status as InvoiceStatus);
    const financialFields = ["amount", "description", "service_start_date", "service_end_date"];
    if (issuedOrPaid) {
      const attemptedFinancialChange = financialFields.some((f) => f in body);
      if (attemptedFinancialChange && body.status === undefined) {
        return NextResponse.json(
          { error: `Invoice is ${current.status}. Financial fields cannot be modified. Change status to draft first via admin.` },
          { status: 409 }
        );
      }
    }

    const allowed = [
      "status", "notes", "invoice_date",
      "service_start_date", "service_end_date",
      "description", "amount", "currency",
      "consultant_name", "consultant_email",
    ];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    const { data: updated, error: updateErr } = await admin
      .from("consultancy_invoices")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    const action = updates.status
      ? `status_changed_to_${updates.status}`
      : "updated";

    await admin.from("invoice_audit_log").insert({
      invoice_id:     id,
      invoice_number: current.invoice_number,
      action,
      actor:          "admin",
      metadata:       { changed_fields: Object.keys(updates) },
    });

    return NextResponse.json({ data: updated });
  } catch (e) {
    console.error("[admin/invoices PATCH]", e);
    const msg = e instanceof Error ? e.message : (typeof e === "object" && e !== null && "message" in e) ? String((e as { message: unknown }).message) : JSON.stringify(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
