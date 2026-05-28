import Link from "next/link";
import { ThumbsUp, MessageCircle, Flame, Plus, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Avatar } from "@/components/site/Avatar";
import {
  THREAD_CATEGORIES,
  POPULAR_TAGS,
  HOT_THREADS,
  TOP_CONTRIBUTORS,
  categoryLabel,
} from "@/lib/community";
import { loadFeed } from "@/lib/community-loader";

export const metadata = {
  title: "Communauté — Claude Mastery",
  description:
    "Discutez de Claude Code avec la communauté francophone : prompts, bugs, idées, astuces.",
};

export const revalidate = 600; // refresh feed every 10 min

const TOTAL = THREAD_CATEGORIES.reduce((s, c) => s + c.count, 0);

export default async function CommunityPage() {
  const feed = await loadFeed();
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="communaute" showSearch />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left: filters */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-8">
          <div>
            <h2 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-4 font-semibold text-xs">
              Catégories
            </h2>
            <ul className="flex flex-col gap-1">
              <li>
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm flex justify-between items-center transition-colors"
                >
                  <span>Toutes les discussions</span>
                  <span className="text-on-surface-variant text-xs">
                    {TOTAL}
                  </span>
                </button>
              </li>
              {THREAD_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm flex justify-between items-center transition-colors"
                  >
                    <span>{c.label}</span>
                    <span className="text-xs">{c.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-4 font-semibold text-xs">
              Étiquettes populaires
            </h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-body-sm text-xs hover:bg-surface-container hover:text-on-surface cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: feed */}
        <section className="col-span-1 lg:col-span-6 flex flex-col gap-6">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              Flux de discussions
            </h1>
            <div className="flex gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm border border-outline-variant"
              >
                Récents
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-body-sm text-body-sm transition-colors"
              >
                Populaires
              </button>
            </div>
          </div>

          {feed.map((t) => {
            const isReddit = t.source === "reddit";
            const href = isReddit ? t.permalink : `/communaute/${t.id}`;
            const Wrapper = isReddit ? "a" : Link;
            const linkProps = isReddit
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Wrapper
                key={t.id}
                href={href}
                {...linkProps}
                className="block bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant soft-lift group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={t.author.name} initial={t.author.initial} />
                    <div className="min-w-0">
                      <div className="font-body-rt text-body-sm font-medium text-on-surface truncate">
                        {t.author.name}
                      </div>
                      <div className="font-body-sm text-xs text-on-surface-variant">
                        {t.createdAgo} · {categoryLabel(t.category)}
                      </div>
                    </div>
                  </div>
                  {isReddit && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] uppercase tracking-wider font-semibold bg-primary-fixed/40 text-primary shrink-0">
                      <ExternalLink className="w-3 h-3" strokeWidth={2} />
                      Reddit
                    </span>
                  )}
                </div>
                <h3 className="font-headline-lg-mobile text-xl font-semibold mb-2 text-on-surface group-hover:text-primary transition-colors">
                  {t.title}
                </h3>
                {t.excerpt && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-4 line-clamp-3">
                    {t.excerpt}
                  </p>
                )}
                {t.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {t.tags.map((tag) => (
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
                  <span className="flex items-center gap-2 text-on-surface-variant font-body-sm text-sm">
                    <ThumbsUp className="w-4 h-4" strokeWidth={1.75} />
                    <span>{t.upvotes}</span>
                  </span>
                  <span className="flex items-center gap-2 text-on-surface-variant font-body-sm text-sm">
                    <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                    <span>{t.replies} réponses</span>
                  </span>
                </div>
              </Wrapper>
            );
          })}

          <button
            type="button"
            className="w-full h-11 rounded-lg border border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-sm text-body-sm mt-4"
          >
            Charger plus de discussions
          </button>
        </section>

        {/* Right: hot + contributors */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant">
            <h2 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2 font-semibold text-xs">
              <Flame className="w-4 h-4 text-primary" strokeWidth={1.75} />
              En feu
            </h2>
            <ul className="flex flex-col gap-4">
              {HOT_THREADS.map((h) => (
                <li key={h.id} className="group cursor-pointer">
                  <div className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {h.title}
                  </div>
                  <div className="font-body-sm text-xs text-on-surface-variant">
                    {h.replies} réponses · {h.activeAgo}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant">
            <h2 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-4 font-semibold text-xs">
              Top contributeurs
            </h2>
            <ul className="flex flex-col gap-4">
              {TOP_CONTRIBUTORS.map((c) => (
                <li key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={c.name} initial={c.initial} size={32} />
                    <div className="font-body-sm text-sm text-on-surface">
                      {c.name}
                    </div>
                  </div>
                  <span className="font-body-sm text-xs text-primary font-medium">
                    {c.points >= 1000
                      ? (c.points / 1000).toFixed(1) + "k"
                      : c.points}{" "}
                    pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>

      {/* Floating new discussion button */}
      <Link
        href="/communaute/nouveau"
        className="fixed bottom-8 right-8 z-40 inline-flex items-center gap-2 btn-primary px-6 py-4 rounded-full shadow-lg hover:-translate-y-1 transition-all duration-300 font-body-rt text-body-sm font-medium"
      >
        <Plus className="w-5 h-5" strokeWidth={2} />
        Nouvelle discussion
      </Link>

      <SiteFooter />
    </div>
  );
}
