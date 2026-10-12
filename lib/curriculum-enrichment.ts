import data from "./curriculum-details.json";
import type { Lesson, Module } from "./curriculum";

type LessonDetails = Pick<Lesson, "level" | "objectives" | "prerequisites" | "takeaways" | "quiz" | "commands" | "resources" | "practice" | "minutes">;
type ModuleDetails = Pick<Module, "level" | "outcome" | "minutes" | "project">;

// Données éditoriales explicites, communes aux modules historiques et supplémentaires.
// Le contrôle avant build valide les liens, quiz, durées et champs obligatoires.
export function applyCurriculumDetails(modules: Module[]) {
  const lessons = data.lessons as Record<string, LessonDetails>;
  const details = data.modules as Record<string, ModuleDetails>;
  for (const module of modules) {
    Object.assign(module, details[module.id]);
    for (const lesson of module.lessons) Object.assign(lesson, lessons[lesson.id]);
    module.minutes = module.lessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 0), 0);
  }
}
