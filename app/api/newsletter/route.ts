import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inscription à la newsletter. Pas de compte : seulement un e-mail.
// La table est protégée par RLS ; l'écriture passe par la clé service, côté serveur.
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: { email?: unknown; source?: unknown; site?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège invisible : rempli seulement par les robots.
  if (typeof body.site === "string" && body.site.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  const source = typeof body.source === "string" ? body.source.slice(0, 60) : null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Inscription indisponible pour le moment." }, { status: 503 });
  }

  const db = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await db.from("newsletter_subscribers").insert({ email, source });
  if (error && error.code !== "23505") {
    // 23505 : déjà inscrit, on répond comme un succès
    return NextResponse.json({ error: "Inscription indisponible pour le moment." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
