export const NAV_LINKS = [
  { key: "claude", href: "/claude", label: "Claude" },
  { key: "code", href: "/claude-code", label: "Claude Code" },
  { key: "learn", href: "/learn", label: "Formation" },
  { key: "wiki", href: "/wiki", label: "Wiki" },
  { key: "fiches", href: "/fiches", label: "Fiches" },
  { key: "apps", href: "/applications", label: "Applications" },
  { key: "prompts", href: "/prompts", label: "Prompts" },
  { key: "evolution", href: "/evolution", label: "Évolution" },
  { key: "models", href: "/choisir-modele", label: "Choisir un modèle" },
  { key: "test", href: "/test", label: "Test de niveau" },
  { key: "patch", href: "/patch-notes", label: "Patch notes" },
] as const;

// Accepte aussi les clés des anciennes pages désactivées (communauté, messages)
export type NavKey = (typeof NAV_LINKS)[number]["key"] | (string & {}) | null;
