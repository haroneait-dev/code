import Link from "next/link";
import type { Lesson } from "@/lib/curriculum";
import { findLesson } from "@/lib/learning";
import { ArticleQuiz } from "@/components/wiki/ArticleQuiz";

export function LessonOverview({ lesson }: { lesson: Lesson }) {
  return <section aria-label="Préparer cette leçon" className="my-8 p-5 rounded-lg border border-outline-variant bg-surface-container-low text-body">
    <p className="text-small text-primary font-semibold mb-4">{lesson.level} · {lesson.minutes} min</p>
    <h2 className="font-headline-lg text-h3 mb-3">Objectifs</h2>
    <ul className="list-disc pl-5 space-y-2 mb-5">{lesson.objectives?.map(objective => <li key={objective}>{objective}</li>)}</ul>
    <h3 className="font-semibold text-body mb-2">Prérequis</h3>
    {lesson.prerequisites?.length ? <ul className="space-y-1">{lesson.prerequisites.map(id => {
      const entry = findLesson(id);
      return entry ? <li key={id}><Link href={entry.href} className="text-primary underline underline-offset-4 inline-flex items-center min-h-11">{entry.lesson.title}</Link></li> : null;
    })}</ul> : <p>Aucun prérequis. Vous pouvez commencer ici.</p>}
  </section>;
}

export function LessonDetails({ lesson }: { lesson: Lesson }) {
  return <div className="mt-section space-y-section">
    {!!lesson.takeaways?.length && <section aria-labelledby="retenir"><h2 id="retenir" className="text-h2 font-headline-lg mb-5">À retenir</h2><ul className="list-disc pl-5 space-y-3 text-body">{lesson.takeaways.map(point => <li key={point}>{point}</li>)}</ul></section>}
    {!!lesson.commands?.length && <section aria-labelledby="commandes"><h2 id="commandes" className="text-h2 font-headline-lg mb-5">Commandes vues</h2><dl className="space-y-4">{lesson.commands.map(item => <div key={item.command}><dt className="font-mono text-body text-primary break-words">{item.command}</dt><dd className="text-body text-on-surface-variant">{item.description}</dd></div>)}</dl></section>}
    {lesson.practice && <section className="p-5 border border-outline-variant rounded-lg bg-surface-container-low" aria-labelledby="pratique"><h2 id="pratique" className="text-h2 font-headline-lg mb-4">À vous de jouer</h2><h3 className="text-h3 font-semibold mb-3">{lesson.practice.title}</h3><p className="text-body mb-4">{lesson.practice.description}</p><p className="text-body"><strong>Critère de réussite : </strong>{lesson.practice.success}</p></section>}
    {!!lesson.quiz?.length && <ArticleQuiz key={lesson.id} id={lesson.id} questions={lesson.quiz} analytics={false} />}
    {!!lesson.resources?.length && <section aria-labelledby="ressources"><h2 id="ressources" className="text-h2 font-headline-lg mb-5">Pour approfondir</h2><ul className="space-y-2 text-body">{lesson.resources.map(resource => <li key={resource.href}><Link href={resource.href} className="text-primary underline underline-offset-4 inline-flex items-center min-h-11" {...(resource.href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{resource.title}{resource.href.startsWith("https://") && <span className="sr-only"> (nouvel onglet)</span>}</Link></li>)}</ul></section>}
  </div>;
}
