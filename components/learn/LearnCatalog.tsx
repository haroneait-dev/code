"use client";

import Link from "next/link";
import { useState } from "react";
import type { LearningLevel } from "@/lib/curriculum";
import { CourseProgress } from "./CourseProgress";

type ModuleSummary = { id: string; title: string; level?: LearningLevel; outcome?: string; minutes: number; lessonIds: string[] };
const levels: LearningLevel[] = ["débutant", "intermédiaire", "avancé"];

export function LearnCatalog({ modules }: { modules: ModuleSummary[] }) {
  const [level, setLevel] = useState<LearningLevel | "tous">("tous");
  const displayed = modules.filter(module => level === "tous" || module.level === level);
  return <section aria-labelledby="programme">
    <h2 id="programme" className="text-h2 font-headline-lg font-semibold mb-4">Votre parcours, du débutant à l’avancé</h2>
    <p className="text-body text-on-surface-variant max-w-reading mb-6">Suivez les niveaux dans cet ordre. Dans chaque module, les prérequis indiquent les leçons utiles avant de commencer.</p>
    <label className="flex flex-wrap items-center gap-3 mb-8 text-small font-semibold">Filtrer par niveau
      <select value={level} onChange={event => setLevel(event.target.value as typeof level)} className="border border-outline rounded bg-surface px-3 py-2 text-on-surface">
        <option value="tous">Tous les niveaux</option>
        {levels.map(value => <option key={value} value={value}>{value}</option>)}
      </select>
    </label>
    <p role="status" className="text-small text-on-surface-variant mb-4">{displayed.length} modules affichés</p>
    <ol className="grid md:grid-cols-2 gap-6">
      {displayed.map(module => <li key={module.id} className="min-w-0 border border-outline-variant rounded-lg bg-surface-container-lowest p-6 flex flex-col">
        <p className="text-small text-primary mb-3">{module.level} · {module.minutes} min · {module.lessonIds.length} leçons</p>
        <h3 className="text-h3 font-headline-lg font-semibold mb-3"><Link className="hover:text-primary underline-offset-4 hover:underline" href={`/learn/${module.id}`}>{module.title}</Link></h3>
        <p className="text-body text-on-surface-variant mb-6 flex-grow">{module.outcome}</p>
        <CourseProgress ids={module.lessonIds} />
        <Link href={`/learn/${module.id}`} className="text-small font-semibold text-primary inline-flex items-center min-h-11 mt-4">Voir les leçons et le projet →</Link>
      </li>)}
    </ol>
  </section>;
}
