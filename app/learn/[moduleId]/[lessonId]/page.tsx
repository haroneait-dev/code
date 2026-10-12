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
import { LessonOverview, LessonDetails } from "@/components/learn/LessonDetails";
import { CourseProgress, LessonCompletion } from "@/components/learn/CourseProgress";
import { jsonLd, siteOrigin } from "@/lib/learning";
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
  if (!lesson || !mod) return { title: "Leçon : Claude Mastery" };
  return {
    title: `${lesson.title} : ${mod.title}`,
    description: `${lesson.title} : ${lesson.objectives?.join(". ") ?? lesson.intro}`.slice(0, 160),
    alternates: { canonical: `/learn/${mod.id}/${lesson.id}` },
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
      <SiteHeader active="learn" showSearch />

      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex gap-gutter py-8 relative">
        {/* Left sidebar : module lessons */}
        <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-[96px] h-[calc(100vh-120px)] overflow-y-auto pr-4">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-on-surface transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Tous les modules
          </Link>
          <div className="mb-2 text-small font-code-md text-on-surface-variant uppercase tracking-wider">
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
                      className={`text-small font-code-md mt-0.5 ${
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
        <main className="lesson-content flex-grow max-w-reading w-full min-w-0">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-on-surface-variant font-body-sm mb-6 flex-wrap">
            <Link
              href="/learn"
              className="hover:text-primary transition-colors"
            >
              Formation
            </Link>
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <Link href={`/learn/${mod.id}`} className="text-on-surface-variant hover:text-primary">{mod.title}</Link>
            <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
            <span className="text-on-surface truncate">{lesson.title}</span>
          </nav>

          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
            "@context": "https://schema.org", "@type": "LearningResource",
            name: lesson.title, description: lesson.intro, inLanguage: "fr",
            learningResourceType: "Leçon", educationalLevel: lesson.level,
            timeRequired: `PT${lesson.minutes}M`, isAccessibleForFree: true,
            url: `${siteOrigin}/learn/${mod.id}/${lesson.id}`,
            isPartOf: { "@type": "Course", name: mod.title, url: `${siteOrigin}/learn/${mod.id}` },
            teaches: lesson.objectives,
          }) }} />
          <article>
            {lesson.tag && (
              <div className="inline-flex items-center gap-2 text-small uppercase tracking-wider text-primary bg-primary-fixed/30 px-2 py-1 rounded mb-4 font-semibold">
                <Tag className="w-3 h-3" strokeWidth={2} />
                {lesson.tag}
              </div>
            )}
            <h1 className="text-h1 font-display-xl font-extrabold tracking-tight mb-4 text-on-surface">
              {lesson.title}
            </h1>
            <LessonOverview lesson={lesson} />
            <p
              className="text-on-surface-variant text-body mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.intro }}
            />


            <details className="mb-8 border border-outline-variant rounded-lg p-4">
              <summary className="cursor-pointer text-small font-semibold flex items-center">Sur cette page</summary>
              <ul className="mt-3 space-y-2 text-small">{headings.map(heading => <li key={heading.heading}><a className="text-primary inline-flex items-center min-h-11" href={`#${slugify(heading.heading!)}`}>{heading.heading}</a></li>)}</ul>
            </details>
            <div className="space-y-8">
              {lesson.sections.map((s, i) => (
                <LessonSectionRenderer key={i} section={s} />
              ))}
            </div>

            {exercises.length > 0 && <ExerciseList exercises={exercises} />}

            <LessonDetails lesson={lesson} />
            <LessonCompletion id={lesson.id} />
            <div className="mt-6"><CourseProgress ids={mod.lessons.map(item => item.id)} segmented /></div>

            {/* Prev / Next */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 pt-8 border-t border-outline-variant">
              {prev ? (
                <Link
                  href={`/learn/${prev.modId}/${prev.l.id}`}
                  className="group p-4 border border-outline-variant rounded-lg hover:bg-surface-container-lowest transition-colors"
                >
                  <div className="inline-flex items-center gap-2 text-small text-on-surface-variant mb-1">
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
                  className="group p-4 border border-outline-variant rounded-lg hover:bg-surface-container-lowest transition-colors text-right"
                >
                  <div className="inline-flex items-center gap-2 text-small text-on-surface-variant mb-1 justify-end w-full">
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


      </div>

      <SiteFooter />
    </div>
  );
}
