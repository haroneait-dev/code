import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { curriculum, type Module } from "../lib/curriculum";
import { ARTICLE_STUBS } from "../lib/wiki-manifest";

const root = path.resolve(__dirname, "..");
const articlePaths = new Set(ARTICLE_STUBS.map(article => `/wiki/${article.category}/${article.slug}`));
const wikiText = ARTICLE_STUBS.map(article => readFileSync(path.join(root, "content", "wiki", article.category, `${article.slug}.mdx`), "utf8")).join("\n");
const levels = new Set(["débutant", "intermédiaire", "avancé"]);

export function checkCurriculum(modules: Module[]): string[] {
  const errors: string[] = [];
  const ids = modules.flatMap(module => module.lessons.map(lesson => lesson.id));
  const lessonIds = new Set(ids);
  const moduleIds = new Set(modules.map(module => module.id));
  const lessonPaths = new Set(modules.flatMap(module => module.lessons.map(lesson => `/learn/${module.id}/${lesson.id}`)));
  if (ids.length !== lessonIds.size) errors.push("Identifiants de leçons dupliqués.");
  if (moduleIds.size !== modules.length) errors.push("Identifiants de modules dupliqués.");
  const prerequisites = new Map<string, string[]>();
  for (const module of modules) {
    const fail = (message: string) => errors.push(`${module.id} : ${message}`);
    if (!module.level || !levels.has(module.level) || !module.outcome) fail("Niveau ou résultat du module absent.");
    if (!module.project || module.project.steps.length < 3 || module.project.steps.length > 5 || !module.project.success) fail("Projet incomplet : 3 à 5 étapes et un critère sont nécessaires.");
    if (module.minutes !== module.lessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 0), 0)) fail("Durée du module incohérente.");
    for (const lesson of module.lessons) {
      const failLesson = (message: string) => errors.push(`${module.id}/${lesson.id} : ${message}`);
      if (!lesson.objectives?.length && !lesson.takeaways?.length) failLesson("Ni objectifs ni points à retenir.");
      if ((lesson.objectives?.length ?? 0) < 2 || (lesson.objectives?.length ?? 0) > 4) failLesson("Il faut 2 à 4 objectifs.");
      if ((lesson.takeaways?.length ?? 0) < 3 || (lesson.takeaways?.length ?? 0) > 5) failLesson("Il faut 3 à 5 points à retenir.");
      if (!lesson.level || !levels.has(lesson.level)) failLesson("Niveau absent ou invalide.");
      if (!Number.isInteger(lesson.minutes) || !lesson.minutes || lesson.minutes !== Number(lesson.duration.match(/^(\d+)\s*min$/)?.[1])) failLesson("Durée absente ou incohérente.");
      if (!lesson.practice?.title || !lesson.practice.description || !lesson.practice.success) failLesson("Mini-projet incomplet.");
      prerequisites.set(lesson.id, lesson.prerequisites ?? []);
      for (const id of lesson.prerequisites ?? []) if (!lessonIds.has(id) || id === lesson.id) failLesson(`Prérequis invalide : ${id}`);
      if (lesson.quiz?.length !== 3) failLesson("Le quiz doit contenir exactement 3 questions.");
      for (const [index, question] of (lesson.quiz ?? []).entries()) {
        const { answer, options } = question;
        // Le format du wiki porte un seul indice answer. Il doit désigner
        // exactement une option non vide, distincte de toutes les autres.
        if (!Number.isInteger(answer) || !Array.isArray(options) || options.length < 2 || answer < 0 || answer >= options.length || options.some(option => !option.trim()) || new Set(options).size !== options.length || !question.q.trim() || !question.why.trim()) failLesson(`Question ${index + 1} : une seule bonne réponse et une explication sont nécessaires.`);
      }
      if ((lesson.resources?.length ?? 0) < 2 || (lesson.resources?.length ?? 0) > 4) failLesson("Il faut 2 à 4 ressources.");
      for (const resource of lesson.resources ?? []) {
        if (resource.href.startsWith("/")) {
          if (!articlePaths.has(resource.href) && !lessonPaths.has(resource.href)) failLesson(`Ressource interne introuvable : ${resource.href}`);
          if (articlePaths.has(resource.href) && !existsSync(path.join(root, "content", `${resource.href.slice(1)}.mdx`))) failLesson(`Fichier wiki absent : ${resource.href}`);
        } else {
          try {
            const url = new URL(resource.href);
            if (url.protocol !== "https:" || !["code.claude.com", "docs.claude.com", "platform.claude.com"].includes(url.hostname)) failLesson(`Source externe non officielle : ${resource.href}`);
          } catch { failLesson(`URL invalide : ${resource.href}`); }
        }
      }
      for (const command of lesson.commands ?? []) if (!command.command.trim() || !command.description.trim() || !wikiText.includes(command.command)) failLesson(`Commande absente du wiki : ${command.command}`);
    }
  }
  // Les prérequis doivent former un parcours réalisable, sans boucle.
  const visited = new Set<string>();
  const visiting = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) { errors.push(`Cycle de prérequis : ${id}`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const prerequisite of prerequisites.get(id) ?? []) visit(prerequisite);
    visiting.delete(id); visited.add(id);
  }
  for (const id of lessonIds) visit(id);
  return errors;
}

if (!process.env.CURRICULUM_CHECK_IMPORT_ONLY) {
  const errors = checkCurriculum(curriculum);
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
  else console.log(`Formation valide : ${curriculum.length} modules, ${curriculum.reduce((sum, module) => sum + module.lessons.length, 0)} leçons.`);
}
