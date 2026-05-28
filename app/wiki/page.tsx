import Link from "next/link";
import {
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
  ArrowRight,
} from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CATEGORIES, ARTICLE_STUBS, articleCount, stubsByCategory } from "@/lib/wiki-manifest";

const ICONS = {
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

export const metadata = {
  title: "Wiki — Claude Mastery",
  description:
    "La référence francophone sur Claude Code, Claude API et l'écosystème Anthropic.",
};

export default function WikiIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="wiki" showSearch />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        {/* Hero */}
        <section className="mb-16 max-w-3xl">
          <div className="inline-flex items-center border border-outline-variant rounded-full px-4 py-1 mb-6">
            <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
              Wiki Claude · {articleCount()} articles
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl md:text-[64px] md:leading-[1] font-extrabold tracking-tight mb-6 text-on-surface">
            La <span className="text-gradient">référence</span> francophone.
          </h1>
          <p className="font-body-rt text-body-rt md:text-[19px] text-on-surface-variant leading-relaxed">
            Tout ce qu'il faut savoir sur Claude Code, l'API Anthropic, MCP,
            les hooks, les skills et l'écosystème — organisé par thèmes.
          </p>
        </section>

        {/* Categories grid */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = ICONS[cat.icon];
              const count = stubsByCategory(cat.id).length;
              const firstSlug = stubsByCategory(cat.id)[0]?.slug;
              const href = firstSlug ? `/wiki/${cat.id}/${firstSlug}` : `/wiki`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 soft-lift flex flex-col group"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-4 text-on-surface">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-body-rt text-body-rt font-semibold mb-2 text-on-surface">
                    {cat.name}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mb-4 flex-grow">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[12px] font-code-md text-primary bg-primary-fixed/30 inline-block px-2 py-1 rounded">
                      {count} article{count > 1 ? "s" : ""}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all"
                      strokeWidth={1.75}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All articles index — quick navigation */}
        <section>
          <h2 className="font-headline-lg text-headline-lg mb-8 text-on-surface">
            Tous les articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {ARTICLE_STUBS.map((a) => (
              <Link
                key={`${a.category}-${a.slug}`}
                href={`/wiki/${a.category}/${a.slug}`}
                className="text-body-sm text-on-surface-variant hover:text-primary transition-colors py-1.5 truncate"
              >
                {a.title}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
