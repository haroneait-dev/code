import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = getServiceSupabase();

  const { data: post } = await admin
    .from("community_posts")
    .select("id, author_id, deleted_at")
    .eq("slug", slug)
    .maybeSingle();
  const p = post as
    | { id: string; author_id: string; deleted_at: string | null }
    | null;
  if (!p || p.deleted_at) {
    return NextResponse.json({ error: "Post introuvable." }, { status: 404 });
  }
  if (p.author_id !== user.id) {
    return NextResponse.json(
      { error: "Tu ne peux supprimer que tes propres posts." },
      { status: 403 }
    );
  }

  const { error } = await admin
    .from("community_posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", p.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
