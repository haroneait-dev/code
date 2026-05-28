import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ThumbsUp, MessageCircle, Reply } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Avatar } from "@/components/site/Avatar";
import { THREADS, getThread, categoryLabel } from "@/lib/community";

export function generateStaticParams() {
  return THREADS.map((t) => ({ id: t.id }));
}

const SAMPLE_REPLIES = [
  {
    author: "Marie_Prompt",
    initial: "M",
    ago: "Il y a 1 heure",
    text: "J'utilise une approche similaire avec <thinking> et <answer> séparés. Ça force vraiment Claude à expliciter son raisonnement avant de répondre.",
    upvotes: 12,
  },
  {
    author: "AlexD_Dev",
    initial: "A",
    ago: "Il y a 45 min",
    text: "Sur les tâches très longues, j'ajoute aussi un budget de tokens explicite dans le prompt. Évite que Claude tronque la sortie pour gagner du temps.",
    upvotes: 8,
  },
  {
    author: "CodeMaster",
    initial: "C",
    ago: "Il y a 20 min",
    text: "Bonne idée. Tu as testé avec extended thinking activé ? Sur Sonnet 4.6 c'est devenu vraiment puissant pour ce genre de raisonnement.",
    upvotes: 4,
  },
];

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = getThread(id);
  if (!thread) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="communaute" showSearch />

      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-6 flex-wrap">
          <Link
            href="/communaute"
            className="hover:text-primary transition-colors"
          >
            Communauté
          </Link>
          <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-on-surface">
            {categoryLabel(thread.category)}
          </span>
        </nav>

        {/* Original post */}
        <article className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Avatar name={thread.author.name} initial={thread.author.initial} />
            <div>
              <div className="font-body-rt text-body-sm font-medium text-on-surface">
                {thread.author.name}
              </div>
              <div className="font-body-sm text-xs text-on-surface-variant">
                {thread.createdAgo} · {categoryLabel(thread.category)}
              </div>
            </div>
          </div>

          <h1 className="font-display-xl text-[28px] md:text-[36px] font-extrabold tracking-tight text-on-surface mb-4 leading-tight">
            {thread.title}
          </h1>

          <p className="font-body-rt text-body-rt text-on-surface leading-relaxed mb-6">
            {thread.excerpt}
          </p>

          {thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {thread.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-surface-container-high rounded text-xs text-on-surface-variant"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/60">
            <button
              type="button"
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-sm text-sm"
            >
              <ThumbsUp className="w-4 h-4" strokeWidth={1.75} />
              <span>{thread.upvotes}</span>
            </button>
            <span className="flex items-center gap-2 text-on-surface-variant font-body-sm text-sm">
              <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
              <span>{thread.replies} réponses</span>
            </span>
          </div>
        </article>

        {/* Replies */}
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
          Réponses ({SAMPLE_REPLIES.length})
        </h2>

        <ul className="space-y-4 mb-12">
          {SAMPLE_REPLIES.map((r, i) => (
            <li
              key={i}
              className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={r.author} initial={r.initial} size={32} />
                <div className="flex items-baseline gap-2">
                  <div className="font-body-rt text-body-sm font-medium text-on-surface">
                    {r.author}
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    {r.ago}
                  </div>
                </div>
              </div>
              <p className="font-body-rt text-body-rt text-on-surface leading-relaxed mb-4">
                {r.text}
              </p>
              <div className="flex items-center gap-4 pt-3 border-t border-outline-variant/60">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>{r.upvotes}</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm"
                >
                  <Reply className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Répondre</span>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Reply composer */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4">
          <textarea
            placeholder="Votre réponse…"
            rows={4}
            className="w-full bg-transparent border-none outline-none resize-none font-body-rt text-body-rt text-on-surface placeholder:text-on-surface-variant"
          />
          <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
            <span className="text-xs text-on-surface-variant">
              Markdown supporté · Soyez courtois
            </span>
            <button
              type="button"
              className="btn-primary px-5 h-9 rounded-full text-body-sm font-medium"
            >
              Publier
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
