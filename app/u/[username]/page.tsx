import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, Settings, Calendar, ThumbsUp } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Avatar } from "@/components/site/Avatar";
import { getServerSupabase } from "@/lib/supabase-server";
import type {
  PublicProfile,
  CommunityPost,
  CommunityComment,
} from "@/lib/community/types";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  return {
    title: `@${username}`,
    description: `Profil de @${username} sur Claude Mastery.`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await getServerSupabase();

  const { data: profile } = await supabase
    .from("community_profiles")
    .select(
      "user_id, username, display_name, bio, avatar_url, points_post, points_comment, created_at"
    )
    .eq("username", username)
    .maybeSingle();

  if (!profile) notFound();
  const p = profile as PublicProfile;

  const [{ data: posts }, { data: comments }, { data: me }] = await Promise.all([
    supabase
      .from("community_posts")
      .select("id, slug, title, score, comment_count, created_at, category")
      .eq("author_id", p.user_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("community_comments")
      .select("id, post_id, body, score, created_at")
      .eq("author_id", p.user_id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase.auth.getUser().then((r) => ({ data: r.data.user })),
  ]);

  const isMe = me?.id === p.user_id;
  const memberSince = new Date(p.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="communaute" />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-16">
        {/* Header */}
        <header className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            <Avatar
              name={p.display_name ?? p.username}
              initial={(p.username[0] ?? "?").toUpperCase()}
              size={80}
            />
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-1 flex-wrap">
                <h1 className="text-[28px] md:text-[34px] font-bold tracking-tight text-on-surface truncate">
                  {p.display_name ?? p.username}
                </h1>
              </div>
              <div className="text-body-sm text-on-surface-variant mb-3">
                @{p.username}
              </div>
              {p.bio && (
                <p className="text-body-rt text-on-surface leading-relaxed mb-4 max-w-xl">
                  {p.bio}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-body-sm text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" strokeWidth={1.5} />
                  {p.points_post + p.points_comment} points
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  Membre depuis {memberSince}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              {isMe ? (
                <Link
                  href="/profil/parametres"
                  className="btn-secondary h-10 px-5 rounded-full inline-flex items-center justify-center gap-2 text-body-sm font-medium"
                >
                  <Settings className="w-4 h-4" strokeWidth={1.75} />
                  Modifier le profil
                </Link>
              ) : me ? (
                <Link
                  href={`/messages/nouveau?to=${p.username}`}
                  className="btn-primary h-10 px-5 rounded-full inline-flex items-center justify-center gap-2 text-body-sm font-medium"
                >
                  <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
                  Message privé
                </Link>
              ) : null}
            </div>
          </div>
        </header>

        {/* Posts + Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <h2 className="text-body-sm uppercase tracking-wider font-semibold text-on-surface-variant mb-3">
              Posts récents
            </h2>
            {posts && posts.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {(posts as Pick<
                  CommunityPost,
                  | "id"
                  | "slug"
                  | "title"
                  | "score"
                  | "comment_count"
                  | "created_at"
                  | "category"
                >[]).map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/communaute/${post.slug}`}
                      className="block bg-surface-container-lowest border border-outline-variant rounded-xl p-4 hover:border-primary transition-colors"
                    >
                      <div className="text-body-rt font-medium text-on-surface mb-1 line-clamp-2">
                        {post.title}
                      </div>
                      <div className="text-xs text-on-surface-variant flex items-center gap-3">
                        <span>{post.score} pts</span>
                        <span>{post.comment_count} commentaires</span>
                        <span>{relativeTime(post.created_at)}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Aucun post pour l'instant." />
            )}
          </section>

          <section>
            <h2 className="text-body-sm uppercase tracking-wider font-semibold text-on-surface-variant mb-3">
              Commentaires récents
            </h2>
            {comments && comments.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {(comments as Pick<
                  CommunityComment,
                  "id" | "post_id" | "body" | "score" | "created_at"
                >[]).map((c) => (
                  <li
                    key={c.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4"
                  >
                    <div className="text-body-sm text-on-surface mb-2 line-clamp-3">
                      {c.body}
                    </div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-3">
                      <span>{c.score} pts</span>
                      <span>{relativeTime(c.created_at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Pas encore commenté." />
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-8 text-center text-body-sm text-on-surface-variant">
      {text}
    </div>
  );
}

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `il y a ${d} j`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
