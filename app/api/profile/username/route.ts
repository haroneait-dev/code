import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";
import {
  isValidUsername,
  normalizeUsername,
  isReservedUsername,
} from "@/lib/community/types";

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let payload: { username?: string; display_name?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const raw = (payload.username ?? "").toString();
  const username = normalizeUsername(raw);

  if (!isValidUsername(username)) {
    return NextResponse.json(
      {
        error:
          "Le pseudo doit faire 3 à 20 caractères et ne contenir que des minuscules, chiffres et _.",
      },
      { status: 400 }
    );
  }
  if (isReservedUsername(username)) {
    return NextResponse.json(
      { error: "Ce pseudo est réservé." },
      { status: 400 }
    );
  }

  const displayName =
    typeof payload.display_name === "string"
      ? payload.display_name.trim().slice(0, 40)
      : null;

  // Use service role to bypass RLS for the write.
  const admin = getServiceSupabase();

  const { data: existing } = await admin
    .from("profiles")
    .select("user_id")
    .eq("username", username)
    .maybeSingle();

  if (existing && (existing as { user_id: string }).user_id !== user.id) {
    return NextResponse.json(
      { error: "Ce pseudo est déjà pris." },
      { status: 409 }
    );
  }

  const { error } = await admin
    .from("profiles")
    .update({
      username,
      display_name: displayName || username,
      onboarded: true,
    })
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, username });
}
