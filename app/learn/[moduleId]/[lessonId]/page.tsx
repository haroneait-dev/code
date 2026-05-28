import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  LessonSectionRenderer,
  ExerciseList,
  slugify,
} from "@/components/learn/LessonSectionRenderer";
import { curriculum } from "@/lib/curriculum";
import { exercisesByLesson } from "@/lib/exercises";

export function generateStaticParams() {
  return curriculum.flatMap((mod) =>
    mod.lessons.map((l) => ({ moduleId: mod.id, lessonId: l.id }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const mod = curriculum.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  if (!lesson || !mod) return { title: "Leçon — Claude Mastery" };
  return {
    title: `${lesson.title} — ${mod.title} — Claude Mastery`,
    description: lesson.intro,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const mod = curriculum.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  if (!mod || !lesson) notFound();

  // Prev / next lesson navigation
  const allLessons = curriculum.flatMap((m) =>
    m.lessons.map((l) => ({ modId: m.id, modTitle: m.title, l }))
  );
  const idx = allLessons.findIndex(
    (x) => x.modId === moduleId && x.l.id === lessonId
  );
  const prev = idx > 0 ? allLessons[idx - 1] : null;
  const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  const headings = lesson.sections.filter((s) => s.heading);
  const exercises = exercisesByLesson[lesson.id] ?? lesson.exercises ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="formation" showSearch />

      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex gap-gutter py-8 relative">
        {/* Left sidebar — module lessons */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-[96px] h-[calc(100vh-120px)] overflow-y-auto pr-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Tous les modules
          </Link>
          <div className="mb-2 text-xs font-code-md text-on-surface-variant uppercase tracking-wider">
            {mod.emoji} {mod.title}
          </div>
          <ul className="space-y-0.5">
            {mod.lessons.map((l, i) => {
              const active = l.id === lesson.id;
              return (
                <li key={l.id}>
                  <Link
                    href={`/learn/${mod.id}/${l.id}`}
                    className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? "bg-surface-container-lowest text-primary border border-outline-variant"
                        : "text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface"
                    }`}
                  >
                    <span
                      className={`text-xs font-code-md mt-0.5 ${
                        active ? "text-primary" : "text-on-surface-variant"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body-sm leading-snug">{l.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Lesson content */}
        <main className="flex-grow max-w-[760px] w-full min-w-0">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-6 flex-wrap">
            <Link
              href="/learn"
              className="hover:text-primary transition-colors"
            >
              Formation
            </Link>
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-on-surface-variant">{mod.title}</span>
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-on-surface truncate">{lesson.title}</span>
          </nav>

          <article>
            {lesson.tag && (
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary bg-primary-fixed/30 px-2 py-1 rounded mb-4 font-semibold">
                <Tag className="w-3 h-3" strokeWidth={2} />
                {lesson.tag}
              </div>
            )}
            <h1 className="font-display-xl text-[40px] md:text-[48px] font-extrabold tracking-tight mb-4 text-on-surface leading-[1.1]">
              {lesson.title}
            </h1>
            <p
              className="text-on-surface-variant text-lg mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.intro }}
            />
            <div className="flex items-center gap-4 text-body-sm text-on-surface-variant pb-8 border-b border-outline-variant mb-10">
              <Clock className="w-4 h-4" strokeWidth={1.75} />
              <span>{lesson.duration}</span>
            </div>

            <div className="space-y-8">
              {lesson.sections.map((s, i) => (
                <LessonSectionRenderer key={i} section={s} />
              ))}
            </div>

            {exercises.length > 0 && <ExerciseList exercises={exercises} />}

            {/* Prev / Next */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 pt-8 border-t border-outline-variant">
              {prev ? (
                <Link
                  href={`/learn/${prev.modId}/${prev.l.id}`}
                  className="group p-4 border border-outline-variant rounded-xl hover:bg-surface-container-lowest transition-colors"
                >
                  <div className="inline-flex items-center gap-2 text-xs text-on-surface-variant mb-1">
                    <ArrowLeft className="w-3 h-3" strokeWidth={1.75} />
                    Précédent
                  </div>
                  <div className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    {prev.l.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next && (
                <Link
                  href={`/learn/${next.modId}/${next.l.id}`}
                  className="group p-4 border border-outline-variant rounded-xl hover:bg-surface-container-lowest transition-colors text-right"
                >
                  <div className="inline-flex items-center gap-2 text-xs text-on-surface-variant mb-1 justify-end w-full">
                    Suivant
                    <ArrowRight className="w-3 h-3" strokeWidth={1.75} />
                  </div>
                  <div className="text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    {next.l.title}
                  </div>
                </Link>
              )}
            </div>
          </article>
        </main>

        {/* Right sidebar — TOC */}
        <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-[96px] h-[calc(100vh-120px)] pl-4 border-l border-outline-variant">
          <h3 className="font-body-sm text-on-surface-variant uppercase tracking-wider mb-4 font-semibold text-xs">
            Sur cette page
          </h3>
          <ul className="space-y-3">
            {headings.map((h, i) => (
              <li key={i}>
                <a
                  href={`#${slugify(h.heading!)}`}
                  className="font-body-sm text-on-surface-variant hover:text-primary transition-colors block"
                >
                  {h.heading}
                </a>
              </li>
            ))}
            {exercises.length > 0 && (
              <li className="pt-2 mt-2 border-t border-outline-variant">
                <a
                  href="#exercices"
                  className="font-body-sm text-primary hover:text-on-surface transition-colors block"
                >
                  Exercices ({exercises.length})
                </a>
              </li>
            )}
          </ul>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
