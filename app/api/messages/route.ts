import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let payload: { conversation_id?: string; body?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const conversationId = (payload.conversation_id ?? "").trim();
  const body = (payload.body ?? "").trim();

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversation_id requis." },
      { status: 400 }
    );
  }
  if (body.length < 1 || body.length > 5000) {
    return NextResponse.json(
      { error: "Le message doit faire entre 1 et 5000 caractères." },
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
        error: "Tu dois avoir choisi un pseudo pour envoyer un message.",
      },
      { status: 403 }
    );
  }

  const { data: participation } = await admin
    .from("conversation_participants")
    .select("conversation_id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!participation) {
    return NextResponse.json(
      { error: "Tu n'es pas membre de cette conversation." },
      { status: 403 }
    );
  }

  const { data: inserted, error } = await admin
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body,
    })
    .select("id, conversation_id, sender_id, body, created_at, deleted_at")
    .single();

  if (error) {
    console.error("[messages] insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: inserted });
}
