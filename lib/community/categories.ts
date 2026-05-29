export type CommunityCategory =
  | "prompt-engineering"
  | "developpement-web"
  | "automatisation"
  | "bugs"
  | "idees"
  | "questions"
  | "ressources";

export const COMMUNITY_CATEGORIES: {
  id: CommunityCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "prompt-engineering",
    label: "Prompt Engineering",
    description: "Templates, structures, techniques de prompting.",
  },
  {
    id: "developpement-web",
    label: "Développement Web",
    description: "React, Next.js, fullstack avec Claude.",
  },
  {
    id: "automatisation",
    label: "Automatisation",
    description: "Hooks, MCP, workflows scriptés.",
  },
  {
    id: "bugs",
    label: "Bugs & Erreurs",
    description: "Bugs reproductibles, comportements bizarres.",
  },
  {
    id: "idees",
    label: "Idées & Features",
    description: "Idées de skills, agents, extensions.",
  },
  {
    id: "questions",
    label: "Questions",
    description: "Quand tu bloques, demande.",
  },
  {
    id: "ressources",
    label: "Ressources",
    description: "Articles, vidéos, outils utiles.",
  },
];

export function categoryLabel(id: string): string {
  return (
    COMMUNITY_CATEGORIES.find((c) => c.id === id)?.label ?? id
  );
}

export function isValidCategory(id: string): id is CommunityCategory {
  return COMMUNITY_CATEGORIES.some((c) => c.id === id);
}

// Slug helper: title → url-safe ASCII slug
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
