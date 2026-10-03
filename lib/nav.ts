export const NAV_LINKS = [
  { key: "formation", href: "/learn", label: "Formation" },
  { key: "wiki", href: "/wiki", label: "Wiki" },
  { key: "fiches", href: "/fiches", label: "Fiches" },
  { key: "nouveautes", href: "/wiki/actualites/nouveautes-2026", label: "Nouveautés" },
] as const;

// Accepte aussi les clés des anciennes pages désactivées (communauté, messages)
export type NavKey = (typeof NAV_LINKS)[number]["key"] | (string & {}) | null;
