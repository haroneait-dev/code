import { curriculum } from "./curriculum";
import { exercisesByLesson } from "./exercises";

export { learningLevels } from "./curriculum";
export const lessonEntries = curriculum.flatMap(module => module.lessons.map(lesson => ({ module, lesson, href: `/learn/${module.id}/${lesson.id}` })));
export function findLesson(id: string) { return lessonEntries.find(entry => entry.lesson.id === id); }
export const courseStats = {
  modules: curriculum.length,
  lessons: lessonEntries.length,
  minutes: lessonEntries.reduce((sum, { lesson }) => sum + (lesson.minutes ?? 0), 0),
  quizzes: lessonEntries.filter(({ lesson }) => lesson.quiz?.length).length,
  exercises: lessonEntries.reduce((sum, { lesson }) => sum + (exercisesByLesson[lesson.id] ?? lesson.exercises ?? []).length + (lesson.practice ? 1 : 0), 0),
};

export function jsonLd(value: object) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://claude-code-harone1.vercel.app";
