import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

const VALID_KINDS = new Set(["post", "comment", "user", "message"]);
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let payload: { target_kind?: string; target_id?: string; reason?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const targetKind = (payload.target_kind ?? "").trim();
  const targetId = (payload.target_id ?? "").trim();
  const reason = (payload.reason ?? "").trim();

  if (!VALID_KINDS.has(targetKind)) {
    return NextResponse.json(
      { error: "Type de cible invalide." },
      { status: 400 }
    );
  }
  if (!UUID_RE.test(targetId)) {
    return NextResponse.json(
      { error: "Identifiant de cible invalide." },
      { status: 400 }
    );
  }
  if (reason.length < 4 || reason.length > 500) {
    return NextResponse.json(
      { error: "La raison doit faire entre 4 et 500 caractères." },
      { status: 400 }
    );
  }

  const admin = getServiceSupabase();
  const { data: profile } = await admin
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();

  const p = profile as { username: string | null } | null;
  if (!p || !p.username) {
    return NextResponse.json(
      {
        error:
          "Tu dois avoir choisi un pseudo pour signaler.",
      },
      { status: 403 }
    );
  }

  const { error } = await (supabase.from("community_reports") as any).insert({
    reporter_id: user.id,
    target_kind: targetKind,
    target_id: targetId,
    reason,
  });

  if (error) {
    console.error("[community.reports] insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
