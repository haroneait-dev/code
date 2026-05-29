import Link from "next/link";
import { MessageCircle, ThumbsUp, Plus, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Avatar } from "@/components/site/Avatar";
import { listPosts, countPostsByCategory } from "@/lib/community/queries";
import {
  COMMUNITY_CATEGORIES,
  categoryLabel,
} from "@/lib/community/categories";
import type { SortMode } from "@/lib/community/queries";

export const metadata = {
  title: "Communauté",
  description:
    "Discute de Claude Code avec la communauté francophone : prompts, bugs, idées, astuces.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{ sort?: string; categorie?: string }>;
};

export default async function CommunityPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const sort: SortMode = sp.sort === "top" ? "top" : "new";
  const category = sp.categorie;

  const [posts, counts] = await Promise.all([
    listPosts({ category, sort, limit: 40 }),
    countPostsByCategory(),
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="communaute" showSearch />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Sidebar — categories */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant mb-3">
              Catégories
            </h2>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href={`/communaute${sort === "top" ? "?sort=top" : ""}`}
                  className={catItem(!category)}
                >
                  <span>Toutes</span>
                  <span className="text-xs text-on-surface-variant">
                    {total}
                  </span>
                </Link>
              </li>
              {COMMUNITY_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/communaute?categorie=${c.id}${sort === "top" ? "&sort=top" : ""}`}
                    className={catItem(category === c.id)}
                  >
                    <span>{c.label}</span>
                    <span className="text-xs text-on-surface-variant">
                      {counts[c.id] ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Feed */}
        <section className="col-span-1 lg:col-span-9 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b border-outline-variant gap-3">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              {category ? categoryLabel(category) : "Flux"}
            </h1>
            <div className="flex gap-2">
              <SortLink
                label="Récents"
                active={sort === "new"}
                href={
                  category
                    ? `/communaute?categorie=${category}`
                    : "/communaute"
                }
              />
              <SortLink
                label="Populaires"
                active={sort === "top"}
                href={
                  category
                    ? `/communaute?categorie=${category}&sort=top`
                    : "/communaute?sort=top"
                }
              />
            </div>
          </div>

          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            posts.map((p) => (
              <Link
                key={p.id}
                href={`/communaute/${p.slug}`}
                className="block bg-surface-container-lowest rounded-2xl p-5 md:p-6 border border-outline-variant soft-lift group"
              >
                <div className="flex items-center gap-3 mb-3 min-w-0">
                  <Avatar
                    name={p.author?.display_name ?? p.author?.username ?? "?"}
                    initial={(p.author?.username?.[0] ?? "?").toUpperCase()}
                    size={36}
                  />
                  <div className="min-w-0">
                    <div className="text-body-sm font-medium text-on-surface truncate">
                      {p.author?.display_name ?? p.author?.username ?? "Anonyme"}
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      {p.author?.username ? `@${p.author.username} · ` : ""}
                      {relativeTime(p.created_at)} · {categoryLabel(p.category)}
                    </div>
                  </div>
                </div>
                <h3 className="text-[18px] md:text-[20px] font-semibold mb-2 text-on-surface group-hover:text-primary transition-colors">
                  {p.title}
                </h3>
                {p.body && (
                  <p className="text-body-sm text-on-surface-variant mb-3 line-clamp-2">
                    {p.body}
                  </p>
                )}
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 bg-surface-container rounded text-xs text-on-surface-variant"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-5 pt-3 border-t border-outline-variant/60 text-body-sm text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" strokeWidth={1.75} />
                    {p.score}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" strokeWidth={1.75} />
                    {p.comment_count}
                  </span>
                </div>
              </Link>
            ))
          )}
        </section>
      </main>

      {/* Floating CTA */}
      <Link
        href="/communaute/nouveau"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 btn-primary px-5 py-3.5 rounded-full shadow-lg hover:-translate-y-1 transition-all duration-300 text-body-sm font-medium"
      >
        <Plus className="w-5 h-5" strokeWidth={2} />
        Nouvelle discussion
      </Link>

      <SiteFooter />
    </div>
  );
}

function catItem(active: boolean) {
  return active
    ? "w-full flex justify-between items-center px-4 py-2.5 rounded-lg bg-primary-fixed/50 text-primary font-medium text-body-sm"
    : "w-full flex justify-between items-center px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-body-sm transition-colors";
}

function SortLink({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-medium text-body-sm border border-outline-variant"
          : "px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-body-sm transition-colors"
      }
    >
      {label}
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-12 text-center">
      <Sparkles
        className="w-10 h-10 mx-auto mb-4 text-on-surface-variant"
        strokeWidth={1.25}
      />
      <h3 className="text-body-rt font-semibold text-on-surface mb-2">
        Encore rien ici.
      </h3>
      <p className="text-body-sm text-on-surface-variant mb-6">
        Sois le premier à lancer la conversation.
      </p>
      <Link
        href="/communaute/nouveau"
        className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-body-sm font-medium"
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        Créer une discussion
      </Link>
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
