import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;

  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let payload: { body?: string; parent_id?: string | null };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const body = (payload.body ?? "").trim();
  if (body.length < 1 || body.length > 10000) {
    return NextResponse.json(
      { error: "Le commentaire doit faire entre 1 et 10 000 caractères." },
      { status: 400 }
    );
  }

  const parentId =
    typeof payload.parent_id === "string" && payload.parent_id.length > 0
      ? payload.parent_id
      : null;

  const admin = getServiceSupabase();

  // Check profile gate
  const { data: profile } = await admin
    .from("profiles")
    .select("status, username")
    .eq("user_id", user.id)
    .maybeSingle();
  const p = profile as { status: string; username: string | null } | null;
  if (!p || p.status !== "approved" || !p.username) {
    return NextResponse.json(
      { error: "Tu dois être approuvé et avoir un pseudo pour commenter." },
      { status: 403 }
    );
  }

  // Make sure the post exists and is not deleted
  const { data: post } = await admin
    .from("community_posts")
    .select("id, deleted_at")
    .eq("id", postId)
    .maybeSingle();
  const pp = post as { id: string; deleted_at: string | null } | null;
  if (!pp || pp.deleted_at) {
    return NextResponse.json({ error: "Post introuvable." }, { status: 404 });
  }

  // If parent_id provided, it must belong to the same post
  if (parentId) {
    const { data: parent } = await admin
      .from("community_comments")
      .select("id, post_id, deleted_at")
      .eq("id", parentId)
      .maybeSingle();
    const par = parent as
      | { id: string; post_id: string; deleted_at: string | null }
      | null;
    if (!par || par.deleted_at || par.post_id !== postId) {
      return NextResponse.json(
        { error: "Commentaire parent invalide." },
        { status: 400 }
      );
    }
  }

  const { data: inserted, error } = await admin
    .from("community_comments")
    .insert({
      post_id: postId,
      parent_id: parentId,
      author_id: user.id,
      body,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[community.comments] insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    comment: inserted as { id: string },
  });
}
