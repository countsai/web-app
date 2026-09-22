import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, COOKIE_NAME_EXPORT as COOKIE, EXPIRY_MS } from "@/lib/admin-auth";

// Server-side credential verification — credentials never leave the server.
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@countsai.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin123";
const ADMIN_PIN      = process.env.ADMIN_PIN      ?? "482913";

export async function POST(req: NextRequest) {
  try {
    const { email, password, pin } = await req.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD || pin !== ADMIN_PIN) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = createAdminToken();

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:   EXPIRY_MS / 1000,
      path:     "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
