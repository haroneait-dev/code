import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Avatar } from "@/components/site/Avatar";
import {
  getPostBySlug,
  listComments,
  getUserVotes,
} from "@/lib/community/queries";
import { categoryLabel } from "@/lib/community/categories";
import { getServerSupabase } from "@/lib/supabase-server";
import { CommentTree, ReplyForm } from "@/components/community/CommentTree";
import { VoteWidget } from "@/components/community/VoteWidget";
import { DeletePostButton } from "@/components/community/DeletePostButton";
import { ReportButton } from "@/components/community/ReportButton";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Discussion introuvable" };
  return {
    title: post.title,
    description: post.body.slice(0, 160),
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [comments, supabase] = await Promise.all([
    listComments(post.id),
    getServerSupabase(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canPost = !!user;
  const isMyPost = user?.id === post.author_id;

  const userVotes = user
    ? await getUserVotes(user.id, [
        { kind: "post", ids: [post.id] },
        { kind: "comment", ids: comments.map((c) => c.id) },
      ])
    : {};
  const postVote = (userVotes[post.id] ?? 0) as -1 | 0 | 1;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="communaute" />

      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-body-sm text-on-surface-variant mb-6">
          <Link href="/communaute" className="hover:text-primary transition-colors">
            Communauté
          </Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
          <Link
            href={`/communaute?categorie=${post.category}`}
            className="hover:text-primary transition-colors"
          >
            {categoryLabel(post.category)}
          </Link>
        </nav>

        {/* Post */}
        <article className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 mb-8 flex gap-5">
          <div className="hidden sm:block shrink-0 pt-1">
            <VoteWidget
              targetKind="post"
              targetId={post.id}
              initialScore={post.score}
              initialValue={postVote}
              canVote={canPost && !isMyPost}
            />
          </div>
          <div className="flex-1 min-w-0">
            <header className="flex items-center gap-3 mb-5 min-w-0">
              <Avatar
                name={post.author?.display_name ?? post.author?.username ?? "?"}
                initial={(post.author?.username?.[0] ?? "?").toUpperCase()}
                size={40}
              />
              <div className="min-w-0">
                {post.author?.username ? (
                  <Link
                    href={`/u/${post.author.username}`}
                    className="text-body-rt font-medium text-on-surface hover:text-primary transition-colors truncate block"
                  >
                    {post.author.display_name ?? post.author.username}
                  </Link>
                ) : (
                  <span className="text-body-rt font-medium text-on-surface">
                    Anonyme
                  </span>
                )}
                <div className="text-xs text-on-surface-variant">
                  {post.author?.username ? `@${post.author.username} · ` : ""}
                  {relativeTime(post.created_at)}
                </div>
              </div>
            </header>

            <h1 className="font-display-xl text-[28px] md:text-[36px] font-bold tracking-tight mb-4 text-on-surface leading-[1.15]">
              {post.title}
            </h1>

            {post.body && (
              <div className="text-body-rt text-on-surface whitespace-pre-wrap leading-relaxed mb-5">
                {post.body}
              </div>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-1 bg-surface-container rounded text-xs text-on-surface-variant"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-5 pt-4 border-t border-outline-variant/60 text-body-sm text-on-surface-variant sm:hidden">
              <VoteWidget
                targetKind="post"
                targetId={post.id}
                initialScore={post.score}
                initialValue={postVote}
                canVote={canPost && !isMyPost}
                orientation="horizontal"
              />
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                {post.comment_count} commentaires
              </span>
              {isMyPost ? (
                <DeletePostButton slug={post.slug} />
              ) : (
                <ReportButton targetKind="post" targetId={post.id} />
              )}
            </div>
            <div className="hidden sm:flex items-center gap-5 pt-4 border-t border-outline-variant/60 text-body-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                {post.comment_count} commentaires
              </span>
              {isMyPost ? (
                <DeletePostButton slug={post.slug} />
              ) : (
                <ReportButton targetKind="post" targetId={post.id} />
              )}
            </div>
          </div>
        </article>

        {/* Comments */}
        <section>
          <h2 className="text-body-rt font-semibold text-on-surface mb-5">
            {post.comment_count > 0
              ? `${post.comment_count} commentaire${post.comment_count > 1 ? "s" : ""}`
              : "Lance la discussion"}
          </h2>

          {canPost ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 mb-6">
              <ReplyForm postId={post.id} />
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-5 mb-6 text-body-sm text-on-surface-variant">
              <Link href={`/?login=1&from=/communaute/${slug}`} className="text-primary font-medium hover:underline">
                Connecte-toi
              </Link>{" "}
              pour commenter.
            </div>
          )}

          <CommentTree
            postId={post.id}
            comments={comments}
            canPost={canPost}
            userVotes={userVotes}
            currentUserId={user?.id ?? null}
          />
        </section>
      </main>

      <SiteFooter />
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
