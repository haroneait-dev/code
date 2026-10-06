import { LEVELS } from "@/lib/quiz";
import { THEMES } from "@/lib/applications";

// Adresse de partage d'un résultat : /test/<niveau>/<theme>
export const LEVEL_SLUGS = ["debutant", "intermediaire", "avance", "expert"] as const;

export function shareParams() {
  return LEVEL_SLUGS.flatMap((niveau) => THEMES.map((t) => ({ niveau, theme: t.id })));
}

export function decodeShare(niveau: string, theme: string) {
  const i = LEVEL_SLUGS.indexOf(niveau as (typeof LEVEL_SLUGS)[number]);
  return {
    level: i >= 0 ? LEVELS[i] : null,
    theme: THEMES.find((t) => t.id === theme) ?? null,
  };
}

export function sharePath(levelIndex: number, theme: string) {
  return `/test/${LEVEL_SLUGS[levelIndex]}/${theme}`;
}
