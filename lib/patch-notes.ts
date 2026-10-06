// Patch notes : chaque mise à jour du site et chaque nouveauté de Claude.
// Ajouter les nouvelles entrées EN HAUT de la liste.

export type NoteKind = "site" | "claude" | "claude-code";

export type PatchNote = {
  date: string; // AAAA-MM-JJ
  kind: NoteKind;
  version?: string; // version du site ou de Claude Code
  title: string;
  items: string[];
  href?: string;
};

export const KIND_INFO: Record<NoteKind, { label: string; className: string }> = {
  site: { label: "Le site", className: "bg-[rgb(var(--c-mark))] text-on-primary-fixed" },
  claude: { label: "Claude", className: "bg-[rgb(var(--c-green-soft))] text-on-surface" },
  "claude-code": { label: "Claude Code", className: "bg-surface-container-high text-on-surface" },
};

export const PATCH_NOTES: PatchNote[] = [
  {
    date: "2026-10-06",
    kind: "site",
    version: "Site 2.6",
    title: "Page Prompts entièrement refaite",
    items: [
      "79 prompts en 11 catégories, dont 4 nouvelles : SEO, marketing et publicité, vente et prospection, données et finance.",
      "Chaque prompt applique une vraie technique de métier (intention de recherche, cocon sémantique, données structurées, AIDA, méthode STAR…) expliquée dans « Pourquoi ça marche ».",
      "La méthode de chaque catégorie, un niveau par prompt, une recherche et un filtre par niveau.",
    ],
    href: "/prompts",
  },
  {
    date: "2026-10-06",
    kind: "site",
    version: "Site 2.5",
    title: "Comparatifs, une page par application, badges et défi de la semaine",
    items: [
      "3 comparatifs : Claude, ChatGPT ou Gemini ; Claude Code, Cursor ou Copilot ; quelle offre Claude choisir.",
      "Une page par application (Shopify, Notion, Figma…) avec ses demandes à copier et la marche à suivre pour la brancher.",
      "Badge à partager quand vous validez un niveau d'un parcours.",
      "Un défi concret chaque semaine sur l'accueil.",
      "Recherche rapide avec Ctrl+K (ou la loupe) depuis n'importe quelle page.",
      "Pages plus rapides sur mobile, et plus lisibles pour Google.",
    ],
    href: "/wiki/comparatifs/claude-chatgpt-gemini",
  },
  {
    date: "2026-10-06",
    kind: "site",
    version: "Site 2.4",
    title: "Patch notes, prompts, mini-quiz et mode sombre",
    items: [
      "Nouvelle page Patch notes : toutes les mises à jour du site et les nouveautés de Claude au même endroit.",
      "Nouvelle page Prompts : 30 prompts prêts à copier, en 7 catégories.",
      "Mini-quiz de 3 questions à la fin de 9 articles clés.",
      "Cases à cocher et barre de progression sur les parcours de la page Applications.",
      "Schémas dans les articles sur MCP, les hooks et le premier prompt.",
      "Mode sombre, avec un bouton en haut de chaque page.",
      "Résultat du test partageable sur WhatsApp, X ou par lien.",
    ],
    href: "/prompts",
  },
  {
    date: "2026-10-06",
    kind: "site",
    version: "Site 2.3",
    title: "Test de niveau et parcours guidé",
    items: [
      "Test de niveau en 10 questions, avec barre de progression.",
      "Résultat : votre niveau, un plan sur mesure, 4 lectures conseillées et les corrections.",
      "Bandeau de guidage sur l'accueil qui rappelle votre prochaine étape.",
    ],
    href: "/test",
  },
  {
    date: "2026-10-06",
    kind: "site",
    version: "Site 2.2",
    title: "Page Applications : de débutant à expert",
    items: [
      "8 thèmes : e-commerce, vibe coding, vidéo et motion, design, marketing, productivité, données, automatisation.",
      "44 applications et connecteurs MCP, avec une demande à essayer pour chacune.",
      "Un parcours en 4 niveaux par thème, avec un projet de validation à chaque niveau.",
    ],
    href: "/applications",
  },
  {
    date: "2026-10-06",
    kind: "site",
    version: "Site 2.1",
    title: "Les 181 anciens articles revus",
    items: [
      "Tous les articles datés d'avant octobre vérifiés sur la documentation officielle.",
      "Erreurs corrigées : commandes, champs et chiffres qui n'existaient pas ou plus.",
      "Exemples mis à jour avec les modèles actuels, vouvoiement et sources partout.",
    ],
    href: "/wiki",
  },
  {
    date: "2026-10-03",
    kind: "site",
    version: "Site 2.0",
    title: "Articles plus lisibles et nouveaux guides",
    items: [
      "Colonne de texte élargie, sommaire repliable dans les articles.",
      "Nouveaux guides : les 30 astuces des utilisateurs avancés, les 12 erreurs de débutant, le glossaire.",
      "Guide complet des dynamic workflows.",
    ],
    href: "/wiki/demarrer/astuces-avancees",
  },
  {
    date: "2026-10-02",
    kind: "claude-code",
    version: "2.1.288",
    title: "Retrouver ses sessions et moins de travail perdu",
    items: [
      "Ctrl+F pour chercher une session dans claude agents, et filtre n:texte par nom.",
      "Une coupure d'API en pleine réponse reprend à partir de la réponse partielle.",
      "/code-review --max-findings pour régler le nombre de remarques.",
    ],
    href: "/wiki/actualites/nouveautes-2026",
  },
  {
    date: "2026-10-01",
    kind: "claude-code",
    version: "2.1.287",
    title: "Les mods arrivent",
    items: [
      "Des plugins qui ajoutent des panneaux et modifient le comportement de Claude Code.",
      "Mod intégré « You should know », désactivé par défaut.",
    ],
    href: "/wiki/plugins/mods",
  },
  {
    date: "2026-09-30",
    kind: "claude",
    title: "Claude for Government disponible",
    items: [
      "Ouvert aux administrations américaines, dans un environnement certifié FedRAMP High.",
      "Claude Code et Claude pour Microsoft 365 en accès anticipé.",
    ],
    href: "/wiki/actualites/nouveautes-claude-2026",
  },
  {
    date: "2026-09-29",
    kind: "claude-code",
    version: "2.1.285",
    title: "Ouvrir l'application de bureau depuis le terminal",
    items: [
      "claude --desktop ouvre l'application de bureau sur le dossier courant.",
      "claude plugin configure pour régler un plugin sans éditer de fichier.",
    ],
    href: "/wiki/actualites/nouveautes-2026",
  },
  {
    date: "2026-09-28",
    kind: "claude",
    title: "Sonnet 5.5",
    items: [
      "Plus de 30 % plus rapide que Sonnet 5, et moins de tokens par tâche.",
      "2 $ / 10 $ par million de tokens, 1M de tokens de contexte.",
      "Devient la cible de l'alias sonnet dans Claude Code (2.1.284).",
    ],
    href: "/wiki/modeles/opus-sonnet-5-5",
  },
  {
    date: "2026-09-22",
    kind: "claude",
    title: "Opus 5.5",
    items: [
      "Au niveau de Fable 5.1 sur la plupart des tâches, pour moins cher.",
      "Nouveau modèle par défaut de Claude Code.",
    ],
    href: "/wiki/modeles/opus-sonnet-5-5",
  },
  {
    date: "2026-09-16",
    kind: "claude",
    title: "One Claude : chat, Cowork et Artifacts réunis",
    items: [
      "Une seule interface : Claude choisit comment traiter votre demande.",
      "Claude Docs, Slides et Design pour écrire, présenter et maquetter dans la conversation.",
    ],
    href: "/wiki/claude-ai/docs-slides-design",
  },
];
