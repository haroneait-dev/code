import assert from "node:assert/strict";
import { curriculum, learningLevels, type Module } from "../lib/curriculum";
import { checkCurriculum } from "./check-curriculum";

assert.deepEqual(checkCurriculum(curriculum), []);
const rank = curriculum.map(module => learningLevels.indexOf(module.level!));
assert.deepEqual(rank, [...rank].sort((a, b) => a - b));
function rejected(change: (modules: Module[]) => void, pattern: RegExp) {
  const fixture: Module[] = structuredClone(curriculum);
  change(fixture);
  assert(checkCurriculum(fixture).some(error => pattern.test(error)), `Mutation non détectée : ${pattern}`);
}
rejected(modules => { modules[0].lessons[0].resources![0].href = "/wiki/inconnu/absent"; }, /Ressource interne introuvable/);
rejected(modules => { modules[0].lessons[0].prerequisites = ["absente"]; }, /Prérequis invalide/);
rejected(modules => { modules[0].lessons[0].quiz![0].answer = 99; }, /une seule bonne réponse/);
rejected(modules => { const q = modules[0].lessons[0].quiz![0]; q.options[1] = q.options[0]; }, /une seule bonne réponse/);
rejected(modules => { modules[0].lessons[0].objectives = []; modules[0].lessons[0].takeaways = []; }, /Ni objectifs/);
rejected(modules => { modules[0].lessons[0].prerequisites = [modules[0].lessons[1].id]; }, /Cycle de prérequis/);
console.log("Contrôles négatifs validés : liens, prérequis, quiz, contenu et cycles.");
