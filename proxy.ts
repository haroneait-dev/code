import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminEmail } from "@/lib/admin";

const PROTECTED_PREFIXES = ["/learn", "/wiki", "/communaute"];
const COMMUNITY_USERNAME_PREFIXES = ["/communaute", "/messages", "/profil"];
const ADMIN_PREFIXES = ["/admin"];
const ONBOARDING_PATH = "/onboarding";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) =>
          cookies.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          ),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );
  const isAdminRoute = ADMIN_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  // Not logged in: bounce to home with login modal
  if ((isProtected || isAdminRoute) && !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("login", "1");
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // Admin route: must be on the allowlist
  if (isAdminRoute && user) {
    if (!isAdminEmail(user.email)) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return res; // admins bypass the username check
  }

  const needsUsername = COMMUNITY_USERNAME_PREFIXES.some(
    (p) => path === p || path.startsWith(`${p}/`)
  );

  // Community route + logged in: make sure a username is set (self-service onboarding)
  if (needsUsername && user) {
    // Admins always have access
    if (isAdminEmail(user.email)) return res;

    // Look up profile (RLS lets users read their own row)
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .maybeSingle();

    const p = profile as { username?: string | null } | null;

    if (!p?.username) {
      const url = req.nextUrl.clone();
      url.pathname = ONBOARDING_PATH;
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/learn/:path*",
    "/wiki/:path*",
    "/communaute/:path*",
    "/messages/:path*",
    "/profil/:path*",
    "/admin/:path*",
    "/learn",
    "/wiki",
    "/communaute",
    "/messages",
    "/profil",
    "/admin",
  ],
};
