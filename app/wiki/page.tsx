import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionToc } from "@/components/site/SectionToc";
import {
  SECTIONS,
  articleCount,
  articleCountBySection,
  categoriesBySection,
} from "@/lib/wiki-manifest";

export const metadata = {
  title: "Wiki",
  description:
    "Le wiki francophone sur Claude et Claude Code : l'assistant au quotidien, l'agent de développement, les modèles et l'actualité.",
};

export default function WikiIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="wiki" showSearch />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-14 md:py-20">
        <section className="mb-14 max-w-3xl">
          <p className="tag-note mb-7">Wiki · {articleCount()} articles</p>
          <h1 className="font-display-xl font-extrabold tracking-tight text-on-surface text-[40px] leading-[1.05] md:text-[64px] md:leading-[1] mb-6">
            Tout le savoir, <span className="text-mark">rangé</span>.
          </h1>
          <p className="text-[18px] md:text-[19px] text-on-surface-variant leading-relaxed">
            Deux grandes parties : Claude, l'assistant que tout le monde peut
            utiliser, et Claude Code, l'agent des développeurs. Plus les sujets
            communs aux deux.
          </p>
        </section>

        <nav aria-label="Parties du wiki" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="group bg-surface-container-lowest border border-outline-variant rounded-lg p-6 soft-lift flex flex-col"
            >
              <span className="font-headline-lg text-[22px] font-bold text-on-surface mb-2">
                {s.name}
              </span>
              <span className="text-[15px] text-on-surface-variant leading-relaxed flex-grow mb-4">
                {s.description}
              </span>
              <span className="font-mono text-[13px] text-on-surface-variant tabular-nums">
                {articleCountBySection(s.id)} articles
              </span>
            </a>
          ))}
        </nav>

        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="mb-20 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
              <h2 className="font-headline-lg text-[32px] md:text-[40px] leading-[1.1] font-bold tracking-tight">
                {s.name}
              </h2>
              {s.href !== "/wiki" && (
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline underline-offset-4"
                >
                  Parcours conseillé
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              )}
            </div>
            <SectionToc categories={categoriesBySection(s.id).map((c) => c.id)} />
          </section>
        ))}
      </main>

      <SiteFooter />
    </div>
  );
}
