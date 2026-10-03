import { NextResponse, type NextRequest } from "next/server";

// Le site est en accès libre : aucune connexion n'est demandée.
// Les fonctions qui exigeaient un compte (communauté, messagerie,
// notifications, profils, assistant IA, administration) sont désactivées.
// Leurs pages renvoient vers l'accueil et leurs API répondent 410.
const DISABLED_PAGES = [
  "/communaute",
  "/messages",
  "/profil",
  "/u",
  "/onboarding",
  "/admin",
  "/auth",
  "/experience",
];

const DISABLED_APIS = [
  "/api/admin",
  "/api/chat",
  "/api/community",
  "/api/cron",
  "/api/messages",
  "/api/notifications",
  "/api/profile",
  "/api/whoami",
  "/api/wiki",
  "/api/skills",
];

const matches = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (matches(path, DISABLED_APIS)) {
    return NextResponse.json(
      { error: "Cette fonctionnalité a été retirée." },
      { status: 410 }
    );
  }

  if (matches(path, DISABLED_PAGES)) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/communaute/:path*",
    "/messages/:path*",
    "/profil/:path*",
    "/u/:path*",
    "/onboarding/:path*",
    "/admin/:path*",
    "/auth/:path*",
    "/experience/:path*",
    "/api/admin/:path*",
    "/api/chat/:path*",
    "/api/community/:path*",
    "/api/cron/:path*",
    "/api/messages/:path*",
    "/api/notifications/:path*",
    "/api/profile/:path*",
    "/api/whoami/:path*",
    "/api/wiki/:path*",
    "/api/skills/:path*",
  ],
};
