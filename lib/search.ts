// ─── Recherche site ──────────────────────────────────────────────────
// Index de recherche statique construit à partir du curriculum (formation)
// et du manifest wiki. Tout est statique → recherche instantanée côté serveur.

import { curriculum } from "@/lib/curriculum";
import { ARTICLE_STUBS, getCategory } from "@/lib/wiki-manifest";
import { allApps } from "@/lib/applications";
import { PROMPT_GROUPS } from "@/lib/prompts";

export type SearchResult = {
  type: "lesson" | "wiki" | "page";
  title: string;
  description: string;
  href: string;
  context: string; // module (formation) ou catégorie (wiki)
};

type IndexItem = SearchResult & { haystack: string };

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // retire les accents
}

let cachedIndex: IndexItem[] | null = null;

function buildIndex(): IndexItem[] {
  if (cachedIndex) return cachedIndex;
  const items: IndexItem[] = [];

  // Leçons de la formation
  for (const mod of curriculum) {
    for (const lesson of mod.lessons) {
      items.push({
        type: "lesson",
        title: lesson.title,
        description: lesson.intro,
        href: `/learn/${mod.id}/${lesson.id}`,
        context: mod.title,
        haystack: normalize(
          [lesson.title, lesson.intro, lesson.tag ?? "", mod.title].join(" "),
        ),
      });
    }
  }

  // Articles du wiki
  for (const stub of ARTICLE_STUBS) {
    const cat = getCategory(stub.category);
    items.push({
      type: "wiki",
      title: stub.title,
      description: stub.description,
      href: `/wiki/${stub.category}/${stub.slug}`,
      context: cat?.name ?? "Wiki",
      haystack: normalize(
        [stub.title, stub.description, cat?.name ?? ""].join(" "),
      ),
    });
  }

  // Pages du site
  const pages = [
    { title: "Test de niveau", description: "10 questions pour savoir par où commencer.", href: "/test" },
    { title: "Applications à brancher sur Claude", description: "Apps et serveurs MCP par thème, de débutant à expert.", href: "/applications" },
    { title: "Prompts prêts à copier", description: "Des prompts testés par catégorie.", href: "/prompts" },
    { title: "Patch notes", description: "Les mises à jour du site et les nouveautés de Claude.", href: "/patch-notes" },
    { title: "Formation Claude Code", description: "Les modules pas à pas.", href: "/learn" },
    { title: "Fiches mémo", description: "L'essentiel sur une page.", href: "/fiches" },
  ];
  for (const p of pages) {
    items.push({ type: "page", ...p, context: "Page", haystack: normalize(`${p.title} ${p.description}`) });
  }
  for (const a of allApps()) {
    items.push({
      type: "page",
      title: `Claude + ${a.name}`,
      description: a.uses[0].what,
      href: `/applications/${a.slug}`,
      context: "Application",
      haystack: normalize(`${a.name} ${a.uses.map((u) => `${u.what} ${u.theme.name}`).join(" ")}`),
    });
  }
  for (const g of PROMPT_GROUPS) {
    items.push({
      type: "page",
      title: `Prompts : ${g.name}`,
      description: g.intro,
      href: `/prompts#${g.id}`,
      context: "Prompts",
      haystack: normalize(`prompt ${g.name} ${g.intro} ${g.prompts.map((x) => x.title).join(" ")}`),
    });
  }

  cachedIndex = items;
  return items;
}

export function searchSite(query: string, limit = 40): SearchResult[] {
  const q = normalize(query).trim();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const index = buildIndex();

  const scored: { item: IndexItem; score: number }[] = [];

  for (const item of index) {
    const normTitle = normalize(item.title);
    let score = 0;
    let allTokensMatch = true;

    for (const token of tokens) {
      if (!item.haystack.includes(token)) {
        allTokensMatch = false;
        break;
      }
      // un match dans le titre vaut plus qu'un match dans le corps
      score += normTitle.includes(token) ? 3 : 1;
    }

    if (!allTokensMatch) continue;
    // bonus si le titre commence par la requête complète
    if (normTitle.startsWith(q)) score += 5;
    scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => {
      // on retire le haystack interne du résultat exposé
      const { haystack: _haystack, ...rest } = item;
      void _haystack;
      return rest;
    });
}
