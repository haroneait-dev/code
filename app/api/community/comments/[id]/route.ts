import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = getServiceSupabase();

  const { data: comment } = await admin
    .from("community_comments")
    .select("id, author_id, deleted_at")
    .eq("id", id)
    .maybeSingle();
  const c = comment as
    | { id: string; author_id: string; deleted_at: string | null }
    | null;
  if (!c || c.deleted_at) {
    return NextResponse.json(
      { error: "Commentaire introuvable." },
      { status: 404 }
    );
  }
  if (c.author_id !== user.id) {
    return NextResponse.json(
      { error: "Tu ne peux supprimer que tes propres commentaires." },
      { status: 403 }
    );
  }

  const { error } = await admin
    .from("community_comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", c.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
