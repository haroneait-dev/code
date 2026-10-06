export const NAV_LINKS = [
  { key: "claude", href: "/claude", label: "Claude" },
  { key: "code", href: "/claude-code", label: "Claude Code" },
  { key: "wiki", href: "/wiki", label: "Wiki" },
  { key: "fiches", href: "/fiches", label: "Fiches" },
  { key: "apps", href: "/applications", label: "Applications" },
] as const;

// Accepte aussi les clés des anciennes pages désactivées (communauté, messages)
export type NavKey = (typeof NAV_LINKS)[number]["key"] | (string & {}) | null;
