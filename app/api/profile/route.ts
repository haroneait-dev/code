import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

export async function PATCH(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: { display_name?: string; bio?: string; avatar_url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const update: Record<string, string | null> = {};
  if (typeof body.display_name === "string") {
    const v = body.display_name.trim();
    if (v.length === 0 || v.length > 40) {
      return NextResponse.json(
        { error: "Le nom affiché doit faire 1 à 40 caractères." },
        { status: 400 }
      );
    }
    update.display_name = v;
  }
  if (typeof body.bio === "string") {
    const v = body.bio.trim();
    if (v.length > 280) {
      return NextResponse.json(
        { error: "La bio est limitée à 280 caractères." },
        { status: 400 }
      );
    }
    update.bio = v.length === 0 ? null : v;
  }
  if (typeof body.avatar_url === "string") {
    const v = body.avatar_url.trim();
    if (v.length > 500) {
      return NextResponse.json(
        { error: "URL d'avatar trop longue." },
        { status: 400 }
      );
    }
    update.avatar_url = v.length === 0 ? null : v;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Rien à mettre à jour." }, { status: 400 });
  }

  const admin = getServiceSupabase();
  const { error } = await admin
    .from("profiles")
    .update(update)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
