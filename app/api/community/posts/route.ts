import { NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase-server";
import {
  isValidCategory,
  slugify,
  type CommunityCategory,
} from "@/lib/community/categories";

const MAX_TAGS = 5;
const MAX_TAG_LEN = 24;

export async function POST(req: Request) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let payload: {
    title?: string;
    body?: string;
    category?: string;
    tags?: string[];
  };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const title = (payload.title ?? "").trim();
  const body = (payload.body ?? "").trim();
  const category = payload.category ?? "questions";
  const tags = Array.isArray(payload.tags) ? payload.tags : [];

  if (title.length < 4 || title.length > 200) {
    return NextResponse.json(
      { error: "Le titre doit faire entre 4 et 200 caractères." },
      { status: 400 }
    );
  }
  if (body.length > 20000) {
    return NextResponse.json(
      { error: "Corps trop long (20 000 max)." },
      { status: 400 }
    );
  }
  if (!isValidCategory(category)) {
    return NextResponse.json(
      { error: "Catégorie invalide." },
      { status: 400 }
    );
  }

  const cleanTags = Array.from(
    new Set(
      tags
        .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
        .filter((t) => t.length > 0 && t.length <= MAX_TAG_LEN)
        .filter((t) => /^[a-z0-9-]+$/.test(t))
    )
  ).slice(0, MAX_TAGS);

  // Make sure the user has a username
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
        error: "Tu dois avoir choisi un pseudo pour poster.",
      },
      { status: 403 }
    );
  }

  // Build unique slug
  const base = slugify(title) || "post";
  let slug = base;
  for (let i = 0; i < 6; i++) {
    const { data: exists } = await admin
      .from("community_posts")
      .select("id")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();
    if (!exists) break;
    slug = `${base}-${randomSuffix(4)}`;
  }

  const { data: inserted, error } = await admin
    .from("community_posts")
    .insert({
      author_id: user.id,
      slug,
      title,
      body,
      category: category as CommunityCategory,
      tags: cleanTags,
    })
    .select("id, slug")
    .single();

  if (error) {
    console.error("[community.posts] insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    post: inserted as { id: string; slug: string },
  });
}

function randomSuffix(n: number) {
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]/g, "")
    .slice(0, n);
}
