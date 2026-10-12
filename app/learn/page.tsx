import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CourseProgress } from "@/components/learn/CourseProgress";
import { LearnCatalog } from "@/components/learn/LearnCatalog";
import { curriculum } from "@/lib/curriculum";
import { courseStats, jsonLd, learningLevels, lessonEntries, siteOrigin } from "@/lib/learning";

export const metadata = {
  title: "Formation Claude Code : programme et parcours",
  description: "Apprenez Claude Code en français : modules progressifs, objectifs, quiz, exercices et projets. Accès gratuit, sans compte.",
  alternates: { canonical: "/learn" },
};

export default function LearnIndexPage() {
  const modules = [...curriculum].sort((a, b) => learningLevels.indexOf(a.level ?? "débutant") - learningLevels.indexOf(b.level ?? "débutant"));
  return <div className="min-h-screen flex flex-col">
    <SiteHeader active="learn" showSearch />
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org", "@type": "Course", name: "Formation Claude Code en français",
        description: metadata.description, inLanguage: "fr", isAccessibleForFree: true,
        url: `${siteOrigin}/learn`, timeRequired: `PT${courseStats.minutes}M`,
        provider: { "@type": "Organization", name: "Claude Mastery", url: siteOrigin },
        hasPart: modules.map(module => ({ "@type": "Course", name: module.title, url: `${siteOrigin}/learn/${module.id}`, timeRequired: `PT${module.minutes}M` })),
      }) }} />
      <section className="mb-section max-w-reading">
        <p className="tag-note mb-6">Formation Claude Code</p>
        <h1 className="font-display-xl text-h1 font-bold tracking-tight mb-6">Apprendre, pratiquer, vérifier.</h1>
        <p className="text-body text-on-surface-variant mb-8">Un parcours gratuit pour découvrir Claude Code, puis approfondir votre pratique. Chaque leçon présente ses objectifs, une mise en pratique et un quiz corrigé.</p>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[[courseStats.modules, "modules"], [courseStats.lessons, "leçons"], [(courseStats.minutes / 60).toLocaleString("fr-FR", { maximumFractionDigits: 1 }), "heures de leçons"], [courseStats.quizzes, "quiz"], [courseStats.exercises, "exercices et mini-projets"]].map(([value, label]) => <div key={label} className="border-t border-outline-variant pt-3"><dt className="text-small text-on-surface-variant">{label}</dt><dd className="text-h3 font-semibold tabular-nums">{value}</dd></div>)}
        </dl>
        <p className="text-small text-on-surface-variant mb-6">Durées de lecture estimées, hors pratique. Les exercices incluent les mini-projets des leçons.</p>
        <CourseProgress ids={lessonEntries.map(({ lesson }) => lesson.id)} />
      </section>
      <LearnCatalog modules={modules.map(module => ({ id: module.id, title: module.title, level: module.level, outcome: module.outcome, minutes: module.minutes ?? 0, lessonIds: module.lessons.map(lesson => lesson.id) }))} />
    </main><SiteFooter />
  </div>;
}
