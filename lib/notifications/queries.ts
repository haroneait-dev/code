import { getServerSupabase } from "@/lib/supabase-server";

export type NotificationKind =
  | "comment_reply"
  | "post_reply"
  | "dm"
  | "mention";

export interface NotificationActor {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

export interface NotificationPost {
  id: string;
  slug: string;
  title: string;
}

export interface NotificationRow {
  id: string;
  kind: NotificationKind;
  actor_id: string | null;
  post_id: string | null;
  comment_id: string | null;
  conversation_id: string | null;
  body_preview: string | null;
  read_at: string | null;
  created_at: string;
  actor: NotificationActor | null;
  post: NotificationPost | null;
}

const LIST_LIMIT = 30;

export async function listNotifications(
  userId: string
): Promise<NotificationRow[]> {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("notifications")
    .select(
      "id, kind, actor_id, post_id, comment_id, conversation_id, body_preview, read_at, created_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(LIST_LIMIT);

  if (error || !data) {
    if (error) console.error("[notifications.list] failed:", error.message);
    return [];
  }

  const rows = data as Omit<NotificationRow, "actor" | "post">[];

  const actorIds = Array.from(
    new Set(rows.map((r) => r.actor_id).filter((v): v is string => !!v))
  );
  const postIds = Array.from(
    new Set(rows.map((r) => r.post_id).filter((v): v is string => !!v))
  );

  const actorMap = new Map<string, NotificationActor>();
  if (actorIds.length > 0) {
    const { data: actors } = await supabase
      .from("community_profiles")
      .select("user_id, username, display_name, avatar_url")
      .in("user_id", actorIds);
    for (const a of (actors as NotificationActor[] | null) ?? []) {
      actorMap.set(a.user_id, a);
    }
  }

  const postMap = new Map<string, NotificationPost>();
  if (postIds.length > 0) {
    const { data: posts } = await supabase
      .from("community_posts")
      .select("id, slug, title")
      .in("id", postIds);
    for (const p of (posts as NotificationPost[] | null) ?? []) {
      postMap.set(p.id, p);
    }
  }

  return rows.map((r) => ({
    ...r,
    actor: r.actor_id ? actorMap.get(r.actor_id) ?? null : null,
    post: r.post_id ? postMap.get(r.post_id) ?? null : null,
  }));
}

export async function countUnread(userId: string): Promise<number> {
  const supabase = await getServerSupabase();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    console.error("[notifications.countUnread] failed:", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function markRead(
  userId: string,
  ids?: string[]
): Promise<number> {
  const supabase = await getServerSupabase();
  const now = new Date().toISOString();

  let q = supabase
    .from("notifications")
    .update({ read_at: now }, { count: "exact" })
    .eq("user_id", userId)
    .is("read_at", null);

  if (ids && ids.length > 0) {
    q = q.in("id", ids);
  }

  const { error, count } = await q;
  if (error) {
    console.error("[notifications.markRead] failed:", error.message);
    return 0;
  }
  return count ?? 0;
}
