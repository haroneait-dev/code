import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CourseProgress } from "@/components/learn/CourseProgress";
import { curriculum } from "@/lib/curriculum";

export function generateStaticParams() { return curriculum.map(module => ({ moduleId: module.id })); }
export async function generateMetadata({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = curriculum.find(module => module.id === moduleId);
  return module ? { title: `${module.title} : leçons et projet`, description: module.outcome, alternates: { canonical: `/learn/${module.id}` } } : { title: "Module introuvable" };
}
export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = curriculum.find(module => module.id === moduleId);
  if (!module) notFound();
  return <div className="min-h-screen flex flex-col"><SiteHeader active="learn" />
    <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section">
      <nav aria-label="Fil d’Ariane" className="mb-6 text-small"><Link href="/learn" className="text-primary underline inline-flex items-center min-h-11">Formation</Link></nav>
      <div className="max-w-reading">
        <p className="tag-note mb-4">{module.level} · {module.minutes} min</p>
        <h1 className="font-display-xl text-h1 font-bold mb-6">{module.title}</h1>
        <p className="text-body text-on-surface-variant mb-8">{module.outcome}</p>
        <CourseProgress ids={module.lessons.map(lesson => lesson.id)} segmented />
        <section className="py-section" aria-labelledby="lecons">
          <h2 id="lecons" className="text-h2 font-headline-lg mb-6">Les leçons</h2>
          <ol className="divide-y divide-outline-variant">
            {module.lessons.map((lesson, index) => <li key={lesson.id}><Link href={`/learn/${module.id}/${lesson.id}`} className="flex gap-4 py-5 min-h-11 hover:text-primary">
              <span className="text-small tabular-nums pt-1">{index + 1}.</span><span className="min-w-0"><span className="block text-body font-semibold">{lesson.title}</span><span className="block text-small text-on-surface-variant mt-1">{lesson.level} · {lesson.minutes} min</span></span>
            </Link></li>)}
          </ol>
        </section>
        {module.project && <section className="p-6 rounded-lg border border-outline-variant bg-surface-container-low" aria-labelledby="projet">
          <h2 id="projet" className="font-headline-lg text-h2 mb-4">Projet de fin de module</h2>
          <h3 className="text-h3 font-semibold mb-3">{module.project.title}</h3>
          <p className="text-body mb-5">{module.project.description}</p>
          <ol className="list-decimal pl-5 space-y-3 text-body mb-6">{module.project.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <p className="text-body"><strong>Validation : </strong>{module.project.success}</p>
        </section>}
      </div>
    </main><SiteFooter /></div>;
}
