// ── Wiki content: catégories + articles ──────────────────────────────────────
// Static TypeScript content for now (zero DB). Migrate to MDX/DB later if needed.

export type CategoryId =
  | "fondamentaux"
  | "prompt-engineering"
  | "integration-api"
  | "architecture"
  | "securite";

export type Section =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "callout"; variant: "tip" | "info" | "warning"; title: string; text: string }
  | { type: "code"; lang: string; filename?: string; code: string }
  | { type: "two-col"; left: { title: string; text: string }; right: { title: string; text: string } };

export type Article = {
  slug: string;
  category: CategoryId;
  title: string;
  description: string;
  updatedAt: string;
  readingMinutes: number;
  sections: Section[];
};

export type Category = {
  id: CategoryId;
  name: string;
  icon: "terminal" | "sparkles" | "plug" | "layers" | "shield";
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "fondamentaux",
    name: "Fondamentaux",
    icon: "terminal",
    description: "Tout pour démarrer avec Claude Code et l'écosystème Anthropic.",
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    icon: "sparkles",
    description: "Techniques avancées pour formuler des requêtes efficaces.",
  },
  {
    id: "integration-api",
    name: "Intégration API",
    icon: "plug",
    description: "Connecter Claude à vos applications, outils, et workflows.",
  },
  {
    id: "architecture",
    name: "Architecture Avancée",
    icon: "layers",
    description: "Agents, MCP, hooks, skills — l'écosystème en profondeur.",
  },
  {
    id: "securite",
    name: "Sécurité & Éthique",
    icon: "shield",
    description: "Bonnes pratiques de sécurité, alignement, et usage responsable.",
  },
];

export const ARTICLES: Article[] = [
  {
    slug: "structure-prompt-parfait",
    category: "prompt-engineering",
    title: "La Structure d'un Prompt Parfait",
    description:
      "Maîtrisez l'art de formuler des requêtes précises pour obtenir des résultats exceptionnels avec Claude.",
    updatedAt: "2026-05-18",
    readingMinutes: 8,
    sections: [
      {
        type: "heading",
        level: 2,
        id: "introduction",
        text: "1. Introduction au Contexte",
      },
      {
        type: "paragraph",
        text: "Un prompt efficace commence toujours par un contexte clair. Claude a besoin de comprendre non seulement ce que vous voulez, mais pourquoi vous le voulez et dans quel cadre cela s'inscrit.",
      },
      {
        type: "callout",
        variant: "tip",
        title: "Règle d'or",
        text: "Traitez Claude comme un consultant brillant mais nouvellement arrivé dans votre entreprise. Donnez-lui le contexte qu'il lui manquerait naturellement.",
      },
      {
        type: "heading",
        level: 2,
        id: "system-prompt",
        text: "2. Le Rôle (System Prompting)",
      },
      {
        type: "paragraph",
        text: "Définir un rôle aide Claude à ajuster son ton, son vocabulaire et son approche analytique.",
      },
      {
        type: "code",
        lang: "text",
        filename: "prompt.txt",
        code: `Tu es un architecte logiciel senior expert en systèmes distribués.
Ton objectif est d'analyser l'architecture proposée ci-dessous
et d'identifier les points de défaillance uniques (SPOF).

Adopte un ton direct, technique et professionnel.`,
      },
      {
        type: "heading",
        level: 2,
        id: "xml-tags",
        text: "3. Utilisation des Balises XML",
      },
      {
        type: "paragraph",
        text: "Claude est particulièrement doué pour comprendre la structure XML. Utilisez-la pour séparer clairement les instructions des données.",
      },
      {
        type: "two-col",
        left: {
          title: "À éviter",
          text: "Mélanger le texte à analyser avec les instructions dans un seul paragraphe confus.",
        },
        right: {
          title: "Recommandé",
          text: "Encadrer les documents sources avec <document>...</document>.",
        },
      },
      {
        type: "heading",
        level: 2,
        id: "exemples",
        text: "4. Exemples (Few-shot prompting)",
      },
      {
        type: "paragraph",
        text: "Fournir 2 à 5 exemples concrets de paires entrée/sortie augmente drastiquement la qualité des réponses sur des tâches spécifiques.",
      },
    ],
  },
  {
    slug: "demarrer-claude-code",
    category: "fondamentaux",
    title: "Démarrer avec Claude Code",
    description:
      "Installation, premier projet, et tour d'horizon des commandes essentielles.",
    updatedAt: "2026-05-18",
    readingMinutes: 5,
    sections: [
      {
        type: "heading",
        level: 2,
        id: "installation",
        text: "1. Installation",
      },
      {
        type: "paragraph",
        text: "Claude Code s'installe via npm en une commande. Assurez-vous d'avoir Node.js 20+ installé.",
      },
      {
        type: "code",
        lang: "bash",
        code: `npm install -g @anthropic-ai/claude-code
claude --version`,
      },
      {
        type: "callout",
        variant: "info",
        title: "Authentification",
        text: "Au premier lancement, Claude Code vous demandera une clé API. Récupérez-la sur console.anthropic.com.",
      },
      {
        type: "heading",
        level: 2,
        id: "premier-projet",
        text: "2. Votre premier projet",
      },
      {
        type: "paragraph",
        text: "Naviguez dans votre projet et lancez simplement la commande claude. Vous obtenez un agent contextualisé sur votre codebase.",
      },
      {
        type: "code",
        lang: "bash",
        code: `cd mon-projet
claude`,
      },
    ],
  },
  {
    slug: "hooks-automation",
    category: "architecture",
    title: "Hooks & Automation",
    description:
      "Automatisez vos workflows avec des hooks pre/post opération configurables.",
    updatedAt: "2026-05-18",
    readingMinutes: 7,
    sections: [
      {
        type: "heading",
        level: 2,
        id: "intro",
        text: "1. Qu'est-ce qu'un hook ?",
      },
      {
        type: "paragraph",
        text: "Un hook est un script shell exécuté par le runtime Claude Code à des moments précis : avant un outil, après un outil, à la fin d'une session, etc.",
      },
      {
        type: "callout",
        variant: "warning",
        title: "Attention",
        text: "Les hooks tournent avec vos droits utilisateur. Ne configurez jamais un hook depuis une source non fiable.",
      },
      {
        type: "heading",
        level: 2,
        id: "configuration",
        text: "2. Configuration via settings.json",
      },
      {
        type: "code",
        lang: "json",
        filename: ".claude/settings.json",
        code: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "echo 'About to run a shell command'"
      }
    ]
  }
}`,
      },
    ],
  },
];

export function getArticle(category: CategoryId, slug: string): Article | undefined {
  return ARTICLES.find((a) => a.category === category && a.slug === slug);
}

export function articlesByCategory(category: CategoryId): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
