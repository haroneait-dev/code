import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static assets and API auth routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;

  // No session → send to /auth (unless already there)
  if (!token) {
    if (pathname.startsWith("/auth")) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  try {
    const session = await verifyToken(token);

    // step = setup_2fa → only /auth/setup-2fa allowed
    if (session.step === "setup_2fa") {
      if (pathname === "/auth/setup-2fa") return NextResponse.next();
      return NextResponse.redirect(new URL("/auth/setup-2fa", request.url));
    }

    // step = needs_2fa → only /auth/verify-2fa allowed
    if (session.step === "needs_2fa") {
      if (pathname === "/auth/verify-2fa") return NextResponse.next();
      return NextResponse.redirect(new URL("/auth/verify-2fa", request.url));
    }

    // Fully authenticated → block /auth pages, allow everything else
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    // Invalid token → clear cookie and go to /auth
    const res = pathname.startsWith("/auth")
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth", request.url));
    res.cookies.set("session", "", { maxAge: 0, path: "/" });
    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
