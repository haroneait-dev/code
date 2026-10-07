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
  SECTIONS,
  getCategory,
  stubsByCategory,
  type CategoryId,
} from "@/lib/wiki-manifest";
import { loadArticle } from "@/lib/wiki-loader";
import { ARTICLE_QUIZZES } from "@/lib/article-quizzes";
import { ArticleQuiz } from "@/components/wiki/ArticleQuiz";
import { ReadingProgress } from "@/components/site/ReadingProgress";

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
    title: article.title,
    description: article.description,
    alternates: { canonical: `/wiki/${category}/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/wiki/${category}/${slug}`,
      modifiedTime: article.updatedAt,
    },
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
  const section = SECTIONS.find((sec) => sec.id === cat.section);
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

  // Données structurées pour les moteurs de recherche : article, fil d'Ariane, quiz en FAQ.
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claude-code-harone1.vercel.app";
  const url = `${site}/wiki/${cat.id}/${slug}`;
  const quiz = ARTICLE_QUIZZES[`${cat.id}/${slug}`];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: article.title,
      description: article.description,
      inLanguage: "fr-FR",
      dateModified: article.updatedAt,
      mainEntityOfPage: url,
      image: `${url}/opengraph-image`,
      author: { "@type": "Organization", name: "Claude Mastery" },
      publisher: { "@type": "Organization", name: "Claude Mastery" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Wiki", item: `${site}/wiki` },
        { "@type": "ListItem", position: 2, name: cat.name, item: `${site}/wiki/${cat.id}` },
        { "@type": "ListItem", position: 3, name: article.title, item: url },
      ],
    },
    ...(quiz
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: quiz.map((q) => ({
              "@type": "Question",
              name: q.q,
              acceptedAnswer: { "@type": "Answer", text: `${q.options[q.answer]}. ${q.why}` },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ReadingProgress />
      <SiteHeader active={cat?.section === "claude" ? "claude" : cat?.section === "code" ? "code" : "wiki"} showSearch />

      <div className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-10 xl:px-margin-desktop flex gap-10 xl:gap-12 py-8 relative">
        {/* Left sidebar — categories + articles in current cat */}
        <aside className="hidden lg:block w-60 xl:w-64 flex-shrink-0 sticky top-[96px] h-[calc(100vh-120px)] overflow-y-auto pr-2">
          <h3 className="font-body-sm text-on-surface-variant uppercase tracking-wider mb-4 font-semibold text-xs">
            <Link href={section?.href ?? "/wiki"} className="hover:text-primary transition-colors">
              {section ? `Partie ${section.name}` : "Catégories"}
            </Link>
          </h3>
          <ul className="space-y-0.5 mb-6">
            {CATEGORIES.filter((c) => c.section === cat.section).map((c) => {
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
        <main className="flex-1 max-w-[740px] w-full min-w-0">
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
            <h1 className="font-display-xl text-[34px] md:text-[48px] font-extrabold tracking-tight mb-5 text-on-surface leading-[1.1]">
              {article.title}
            </h1>
            <p className="text-on-surface-variant text-[18px] md:text-[20px] mb-7 leading-[1.6]">
              {article.description}
            </p>
            <div className="flex items-center gap-4 text-body-sm text-on-surface-variant pb-8 border-b border-outline-variant mb-12">
              <span>Mis à jour le {formatDateFr(article.updatedAt)}</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full" />
              <span>{article.readingMinutes} min de lecture</span>
            </div>

            {headings.length > 2 && (
              <details className="2xl:hidden mb-12 rounded-md border border-outline-variant bg-surface-container-low px-5 py-4">
                <summary className="cursor-pointer font-semibold text-on-surface text-[15px]">
                  Sur cette page ({headings.length} parties)
                </summary>
                <ol className="mt-4 grid gap-2 list-decimal pl-5 text-[15px] text-on-surface-variant">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="hover:text-primary transition-colors">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            {article.tiktok && (
              <a
                href={article.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-10 flex items-center justify-between gap-4 rounded-lg border-[1.5px] border-on-surface bg-surface-container-lowest px-5 py-4 shadow-[4px_4px_0_rgb(var(--c-mark))] hover:bg-[rgb(var(--c-mark)/0.35)] transition-colors"
              >
                <span>
                  <span className="block font-semibold text-[16.5px] text-on-surface">Ce sujet en vidéo</span>
                  <span className="block text-[14.5px] text-on-surface-variant">Une minute pour l'essentiel, sur TikTok</span>
                </span>
                <span className="btn-primary h-10 px-4 rounded-md inline-flex items-center font-semibold text-[14.5px] shrink-0">Voir la vidéo</span>
              </a>
            )}
            <ArticleBody body={article.body} />
            {ARTICLE_QUIZZES[`${category}/${slug}`] && (
              <ArticleQuiz id={`${category}/${slug}`} questions={ARTICLE_QUIZZES[`${category}/${slug}`]} />
            )}

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
        <aside className="hidden 2xl:block w-60 flex-shrink-0 sticky top-[96px] h-[calc(100vh-120px)] pl-6 border-l border-outline-variant overflow-y-auto">
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

// « 2026-10-03 » → « 3 octobre 2026 » ; laisse passer les valeurs non datées
function formatDateFr(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}
