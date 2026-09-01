import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hasSessionCookie =
    req.cookies.has("fintrack-session") ||
    req.cookies.has("authjs.session-token") ||
    req.cookies.has("__Secure-authjs.session-token") ||
    req.cookies.has("next-auth.session-token");

  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isRegisterPage = req.nextUrl.pathname.startsWith("/register");
  const isPublicAuthPage = isLoginPage || isRegisterPage;
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");
  const isCronApi = req.nextUrl.pathname.startsWith("/api/cron");

  // Allow auth API routes and cron API to pass through
  if (isApiAuth || isCronApi) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login page
  if (!hasSessionCookie && !isPublicAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect authenticated users away from auth pages
  if (hasSessionCookie && isPublicAuthPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
