// ─── Aggregator for extra curriculum modules ─────────────────────────
// Each new module lives in its own file in this folder. This file
// re-exports them as a single array merged into the main curriculum.

import type { Module } from "../curriculum";
import { promptEngineeringModule } from "./prompt-engineering";
import { skillsModule } from "./skills";
import { apiModule } from "./api";
import { saasPracticalModule } from "./saas-practical";

export const extraModules: Module[] = [
  promptEngineeringModule,
  skillsModule,
  apiModule,
  saasPracticalModule,
];
