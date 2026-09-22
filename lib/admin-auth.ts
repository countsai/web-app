import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "cai_admin_token";
const EXPIRY_MS   = 12 * 60 * 60 * 1000; // 12 h

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-admin-secret-change-in-production";
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export function createAdminToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(JSON.stringify({ payload, sig })).toString("base64url");
}

export function verifyAdminToken(token: string): boolean {
  try {
    const raw = Buffer.from(token, "base64url").toString();
    const { payload, sig }: { payload: string; sig: string } = JSON.parse(raw);

    const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
    // Constant-time compare to prevent timing attacks
    const ok = timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(sig,      "hex")
    );
    if (!ok) return false;

    const ts = parseInt(payload.split(":")[1] ?? "0", 10);
    return Date.now() - ts < EXPIRY_MS;
  } catch {
    return false;
  }
}

// ── Server-side cookie read ───────────────────────────────────────────────────

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

// ── Middleware helper — use in API route handlers ─────────────────────────────
// Returns null if authorized, or the error NextResponse if not.

export async function requireAdmin(
  req: NextRequest
): Promise<NextResponse | null> {
  // Prefer Authorization: Bearer header (useful for programmatic calls)
  const bearer = req.headers.get("authorization")?.replace("Bearer ", "");
  if (bearer && verifyAdminToken(bearer)) return null;

  // Fall back to httpOnly cookie
  const cookieVal = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieVal && verifyAdminToken(cookieVal)) return null;

  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
export { EXPIRY_MS };
