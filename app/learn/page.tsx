import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Layers } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { curriculum, totalLessons } from "@/lib/curriculum";

export const metadata = {
  title: "Formation — Claude Mastery",
  description:
    "Formation interactive et complète sur Claude Code, organisée en modules progressifs.",
};

export default function LearnIndexPage() {
  const totalModules = curriculum.length;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="formation" showSearch />

      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        {/* Hero */}
        <section className="mb-16 max-w-3xl">
          <div className="inline-flex items-center border border-outline-variant rounded-full px-4 py-1 mb-6">
            <span className="text-[11px] font-bold tracking-wider uppercase text-on-surface-variant">
              Formation Claude Code
            </span>
          </div>
          <h1 className="font-display-xl text-display-xl md:text-[64px] md:leading-[1] font-extrabold tracking-tight mb-6 text-on-surface">
            De zéro à <span className="text-gradient">expert</span> Claude Code.
          </h1>
          <p className="font-body-rt text-body-rt md:text-[19px] text-on-surface-variant leading-relaxed mb-8">
            Une formation structurée en {totalModules} modules et{" "}
            {totalLessons} leçons pratiques. Du premier prompt à l'orchestration
            d'agents, tout est couvert.
          </p>
          <div className="flex flex-wrap gap-6 text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-2">
              <Layers className="w-4 h-4" strokeWidth={1.5} />
              {totalModules} modules
            </span>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
              {totalLessons} leçons
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              ~10 heures de contenu
            </span>
          </div>
        </section>

        {/* Modules */}
        <section>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8">
            Programme complet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculum.map((mod, idx) => {
              const firstLesson = mod.lessons[0];
              return (
                <Link
                  key={mod.id}
                  href={
                    firstLesson
                      ? `/learn/${mod.id}/${firstLesson.id}`
                      : `/learn`
                  }
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 soft-lift flex flex-col group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-code-md text-on-surface-variant">
                      Module {String(idx + 1).padStart(2, "0")}
                    </div>
                    <span className="text-2xl" aria-hidden>
                      {mod.emoji}
                    </span>
                  </div>
                  <h3 className="font-body-rt text-body-rt font-semibold mb-3 text-on-surface group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <ul className="space-y-1.5 mb-6 flex-grow">
                    {mod.lessons.slice(0, 3).map((l) => (
                      <li
                        key={l.id}
                        className="text-body-sm text-on-surface-variant flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-on-surface-variant" />
                        <span className="truncate">{l.title}</span>
                      </li>
                    ))}
                    {mod.lessons.length > 3 && (
                      <li className="text-body-sm text-on-surface-variant italic pl-3">
                        + {mod.lessons.length - 3} leçon
                        {mod.lessons.length - 3 > 1 ? "s" : ""}…
                      </li>
                    )}
                  </ul>
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant">
                    <span className="text-[12px] font-code-md text-primary bg-primary-fixed/30 px-2 py-1 rounded">
                      {mod.lessons.length} leçon
                      {mod.lessons.length > 1 ? "s" : ""}
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
      </main>

      <SiteFooter />
    </div>
  );
}
