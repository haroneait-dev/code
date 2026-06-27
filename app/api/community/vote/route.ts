import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

type VoteKind = "post" | "comment";

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let payload: { target_kind?: string; target_id?: string; value?: number };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const target_kind = payload.target_kind;
  const target_id = payload.target_id;
  const value = payload.value;

  if (target_kind !== "post" && target_kind !== "comment") {
    return NextResponse.json(
      { error: "target_kind invalide." },
      { status: 400 }
    );
  }
  if (typeof target_id !== "string" || target_id.length < 8) {
    return NextResponse.json(
      { error: "target_id invalide." },
      { status: 400 }
    );
  }
  if (value !== 1 && value !== -1) {
    return NextResponse.json(
      { error: "value doit être 1 ou -1." },
      { status: 400 }
    );
  }

  const admin = getServiceSupabase();

  // Gate: user must have a username
  const { data: profile } = await admin
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();
  const p = profile as { username: string | null } | null;
  if (!p || !p.username) {
    return NextResponse.json(
      { error: "Tu dois choisir un pseudo pour voter." },
      { status: 403 }
    );
  }

  // Prevent voting on own content
  const ownerTable =
    target_kind === "post" ? "community_posts" : "community_comments";
  const { data: target } = await admin
    .from(ownerTable)
    .select("author_id, deleted_at")
    .eq("id", target_id)
    .maybeSingle();
  const t = target as { author_id: string; deleted_at: string | null } | null;
  if (!t || t.deleted_at) {
    return NextResponse.json(
      { error: "Cible introuvable." },
      { status: 404 }
    );
  }
  if (t.author_id === user.id) {
    return NextResponse.json(
      { error: "Tu ne peux pas voter sur ton propre contenu." },
      { status: 400 }
    );
  }

  // Get existing vote
  const { data: existing } = await admin
    .from("community_votes")
    .select("value")
    .eq("voter_id", user.id)
    .eq("target_kind", target_kind)
    .eq("target_id", target_id)
    .maybeSingle();
  const e = existing as { value: number } | null;

  if (e && e.value === value) {
    // Toggle off — same value clicked again
    const { error } = await admin
      .from("community_votes")
      .delete()
      .eq("voter_id", user.id)
      .eq("target_kind", target_kind)
      .eq("target_id", target_id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, value: 0 satisfies number });
  }

  // Upsert
  const { error } = await admin
    .from("community_votes")
    .upsert(
      {
        voter_id: user.id,
        target_kind: target_kind as VoteKind,
        target_id,
        value,
      },
      { onConflict: "voter_id,target_kind,target_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, value });
}
