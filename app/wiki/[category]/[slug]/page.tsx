import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Terminal,
  Sparkles,
  Plug,
  Layers,
  Shield,
  Wrench,
  Command,
  Zap,
  Puzzle,
  Users,
  Cloud,
  GitBranch,
  Lock,
  Globe,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ArticleBody } from "@/components/wiki/ArticleBody";
import {
  ARTICLE_STUBS,
  CATEGORIES,
  getCategory,
  stubsByCategory,
  type CategoryId,
} from "@/lib/wiki-manifest";
import { loadArticle } from "@/lib/wiki-loader";

const CAT_ICONS = {
  terminal: Terminal,
  sparkles: Sparkles,
  plug: Plug,
  layers: Layers,
  shield: Shield,
  wrench: Wrench,
  command: Command,
  zap: Zap,
  puzzle: Puzzle,
  users: Users,
  cloud: Cloud,
  git: GitBranch,
  lock: Lock,
  globe: Globe,
};

export function generateStaticParams() {
  return ARTICLE_STUBS.map((a) => ({ category: a.category, slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = await loadArticle(category as CategoryId, slug);
  if (!article) return { title: "Wiki — Claude Mastery" };
  return {
    title: `${article.title} — Wiki — Claude Mastery`,
    description: article.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const cat = getCategory(category as CategoryId);
  const article = cat ? await loadArticle(cat.id, slug) : null;
  if (!cat || !article) notFound();

  const articlesInCat = stubsByCategory(cat.id);
  const idx = articlesInCat.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? articlesInCat[idx - 1] : null;
  const next = idx < articlesInCat.length - 1 ? articlesInCat[idx + 1] : null;

  // Extract H2 headings from body for TOC
  const headings = Array.from(
    article.body.matchAll(/^##\s+(.+)$/gm)
  ).map((m) => ({
    text: m[1].trim(),
    id: slugifyHeading(m[1].trim()),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="wiki" showSearch />

      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex gap-gutter py-8 relative">
        {/* Left sidebar — categories + articles in current cat */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-[96px] h-[calc(100vh-120px)] overflow-y-auto pr-4">
          <h3 className="font-body-sm text-on-surface-variant uppercase tracking-wider mb-4 font-semibold text-xs">
            Catégories
          </h3>
          <ul className="space-y-0.5 mb-6">
            {CATEGORIES.map((c) => {
              const Icon = CAT_ICONS[c.icon];
              const active = c.id === cat.id;
              const firstSlug = stubsByCategory(c.id)[0]?.slug;
              const href = firstSlug ? `/wiki/${c.id}/${firstSlug}` : `/wiki`;
              return (
                <li key={c.id}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-surface-container-lowest text-primary border border-outline-variant"
                        : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-body-sm">{c.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="pt-6 border-t border-outline-variant">
            <h3 className="font-body-sm text-on-surface-variant uppercase tracking-wider mb-3 font-semibold text-xs">
              Dans {cat.name}
            </h3>
            <ul className="space-y-0.5">
              {articlesInCat.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/wiki/${a.category}/${a.slug}`}
                    className={`block px-3 py-1.5 rounded-lg text-body-sm transition-colors ${
                      a.slug === article.slug
                        ? "text-on-surface font-medium bg-surface-container-lowest"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Article */}
        <main className="flex-grow max-w-[760px] w-full min-w-0">
          <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-6 flex-wrap">
            <Link href="/wiki" className="hover:text-primary transition-colors">
              Wiki
            </Link>
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <Link href={`/wiki/${cat.id}/${articlesInCat[0]?.slug ?? ""}`} className="hover:text-primary transition-colors">
              {cat.name}
            </Link>
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-on-surface truncate">{article.title}</span>
          </nav>

          <article>
            <h1 className="font-display-xl text-[40px] md:text-[48px] font-extrabold tracking-tight mb-4 text-on-surface leading-[1.1]">
              {article.title}
            </h1>
            <p className="text-on-surface-variant text-lg mb-6 leading-relaxed">
              {article.description}
            </p>
            <div className="flex items-center gap-4 text-body-sm text-on-surface-variant pb-8 border-b border-outline-variant mb-10">
              <span>Mis à jour le {article.updatedAt}</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span>{article.readingMinutes} min de lecture</span>
            </div>

            <ArticleBody body={article.body} />

            {/* Prev / Next */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 pt-8 border-t border-outline-variant">
              {prev ? (
                <Link
                  href={`/wiki/${cat.id}/${prev.slug}`}
                  className="group p-4 border border-outline-variant rounded-xl hover:bg-surface-container-lowest transition-colors"
                >
                  <div className="inline-flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                    <ArrowLeft className="w-3 h-3" strokeWidth={1.75} />
                    Précédent
                  </div>
                  <div className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/wiki/${cat.id}/${next.slug}`}
                  className="group p-4 border border-outline-variant rounded-xl hover:bg-surface-container-lowest transition-colors text-right sm:col-start-2"
                >
                  <div className="inline-flex items-center gap-2 text-xs text-on-surface-variant mb-1 justify-end w-full">
                    Suivant
                    <ArrowRight className="w-3 h-3" strokeWidth={1.75} />
                  </div>
                  <div className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    {next.title}
                  </div>
                </Link>
              )}
            </div>
          </article>
        </main>

        {/* Right sidebar — TOC */}
        <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-[96px] h-[calc(100vh-120px)] pl-4 border-l border-outline-variant overflow-y-auto">
          <h3 className="font-body-sm text-on-surface-variant uppercase tracking-wider mb-4 font-semibold text-xs">
            Sur cette page
          </h3>
          <ul className="space-y-3">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="font-body-sm text-on-surface-variant hover:text-primary transition-colors block"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

function slugifyHeading(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
