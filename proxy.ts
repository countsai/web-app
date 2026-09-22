import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In a real app, you would check for a session cookie or token
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected route groups
  const isCandidateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/career-scan") ||
    pathname.startsWith("/career-map") ||
    pathname.startsWith("/jobs/matches") ||
    pathname.startsWith("/apply-studio") ||
    pathname.startsWith("/applications") ||
    pathname.startsWith("/proof-of-work") ||
    pathname.startsWith("/skills-roadmap") ||
    pathname.startsWith("/recruiter-outreach") ||
    pathname.startsWith("/visa-support");

  const isEmployerRoute = pathname.startsWith("/employer");
  const isAdminRoute = pathname.startsWith("/admin");

  // Allow all for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
