import { getServerSupabase } from "@/lib/supabase-server";
import type {
  CommunityPost,
  CommunityComment,
  PublicProfile,
} from "@/lib/community/types";

type Author = Pick<
  PublicProfile,
  "user_id" | "username" | "display_name" | "avatar_url"
>;

export type PostListItem = Pick<
  CommunityPost,
  | "id"
  | "slug"
  | "title"
  | "body"
  | "category"
  | "tags"
  | "score"
  | "comment_count"
  | "created_at"
  | "author_id"
> & {
  author: Author | null;
};

export type SortMode = "new" | "top";

async function attachAuthors<T extends { author_id: string }>(
  rows: T[]
): Promise<(T & { author: Author | null })[]> {
  if (rows.length === 0) return rows.map((r) => ({ ...r, author: null }));
  const supabase = await getServerSupabase();
  const ids = Array.from(new Set(rows.map((r) => r.author_id)));
  const { data, error } = await supabase
    .from("community_profiles")
    .select("user_id, username, display_name, avatar_url")
    .in("user_id", ids);
  if (error) {
    // Si la vue est cassée/absente, tous les auteurs deviendraient "Anonyme"
    // silencieusement — on logue pour que ça remonte dans les logs Vercel.
    console.error("[community.attachAuthors] failed:", error.message);
  }
  const map = new Map<string, Author>();
  for (const a of (data as Author[] | null) ?? []) {
    map.set(a.user_id, a);
  }
  return rows.map((r) => ({ ...r, author: map.get(r.author_id) ?? null }));
}

export async function listPosts(opts: {
  category?: string;
  sort?: SortMode;
  limit?: number;
} = {}): Promise<PostListItem[]> {
  const { category, sort = "new", limit = 30 } = opts;
  const supabase = await getServerSupabase();

  let q = supabase
    .from("community_posts")
    .select(
      "id, slug, title, body, category, tags, score, comment_count, created_at, author_id"
    )
    .is("deleted_at", null)
    .limit(limit);

  if (category) q = q.eq("category", category);
  q = sort === "top"
    ? q.order("score", { ascending: false })
    : q.order("created_at", { ascending: false });

  const { data, error } = await q;
  if (error) {
    console.error("[community.listPosts] failed:", error.message);
    return [];
  }
  return attachAuthors((data ?? []) as PostListItem[]);
}

export async function getPostBySlug(
  slug: string
): Promise<PostListItem | null> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("community_posts")
    .select(
      "id, slug, title, body, category, tags, score, comment_count, created_at, author_id"
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) return null;
  const [withAuthor] = await attachAuthors([data as PostListItem]);
  return withAuthor;
}

export type CommentWithAuthor = Pick<
  CommunityComment,
  "id" | "post_id" | "parent_id" | "author_id" | "body" | "score" | "created_at"
> & {
  author: Author | null;
};

export async function listComments(
  postId: string
): Promise<CommentWithAuthor[]> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("community_comments")
    .select(
      "id, post_id, parent_id, author_id, body, score, created_at"
    )
    .eq("post_id", postId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error || !data) {
    if (error) console.error("[community.listComments] failed:", error.message);
    return [];
  }
  return attachAuthors((data ?? []) as CommentWithAuthor[]);
}

export async function getUserVotes(
  userId: string,
  targets: { kind: "post" | "comment"; ids: string[] }[]
): Promise<Record<string, -1 | 1>> {
  const supabase = await getServerSupabase();
  const map: Record<string, -1 | 1> = {};
  for (const t of targets) {
    if (t.ids.length === 0) continue;
    const { data } = await supabase
      .from("community_votes")
      .select("target_id, value")
      .eq("voter_id", userId)
      .eq("target_kind", t.kind)
      .in("target_id", t.ids);
    for (const row of (data as { target_id: string; value: -1 | 1 }[]) ?? []) {
      map[row.target_id] = row.value;
    }
  }
  return map;
}

export async function countPostsByCategory(): Promise<Record<string, number>> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("community_posts")
    .select("category")
    .is("deleted_at", null);
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data as { category: string }[]) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}
