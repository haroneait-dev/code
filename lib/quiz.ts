// Test de niveau : 10 questions.
// Q1 choisit le thème, Q2 et Q3 mesurent la pratique, Q4 à Q10 les connaissances.

export type Option = { label: string; value: string; points?: number };
export type Question = {
  id: string;
  kind: "profil" | "savoir";
  question: string;
  hint?: string;
  options: Option[];
  // Pour les questions de savoir : l'explication et l'article qui en parle.
  explain?: string;
  href?: string;
};

export const QUESTIONS: Question[] = [
  {
    id: "objectif",
    kind: "profil",
    question: "Qu'est-ce que vous voulez faire avec Claude ?",
    hint: "Choisissez ce qui vous parle le plus. Vous pourrez tout explorer ensuite.",
    options: [
      { label: "Vendre en ligne (boutique, e-commerce)", value: "e-commerce" },
      { label: "Créer un site ou une application", value: "vibe-coding" },
      { label: "Faire des vidéos et des animations", value: "video-motion" },
      { label: "Design et image de marque", value: "design" },
      { label: "Marketing et réseaux sociaux", value: "marketing" },
      { label: "Être plus efficace au travail ou en cours", value: "productivite" },
      { label: "Analyser des chiffres et des données", value: "donnees" },
      { label: "Automatiser des tâches répétitives", value: "automatisation" },
    ],
  },
  {
    id: "usage",
    kind: "profil",
    question: "Vous utilisez Claude (ou une autre IA) à quelle fréquence ?",
    options: [
      { label: "Jamais, je découvre", value: "0", points: 0 },
      { label: "Quelques fois, pour essayer", value: "1", points: 1 },
      { label: "Chaque semaine", value: "2", points: 2 },
      { label: "Tous les jours, avec des projets et des connecteurs", value: "3", points: 3 },
    ],
  },
  {
    id: "terminal",
    kind: "profil",
    question: "Et le code, le terminal ?",
    options: [
      { label: "Jamais ouvert un terminal", value: "0", points: 0 },
      { label: "Un peu, en suivant des tutoriels", value: "1", points: 1 },
      { label: "Régulièrement (Git, npm, scripts)", value: "2", points: 2 },
      { label: "C'est mon métier", value: "3", points: 3 },
    ],
  },
  {
    id: "demande",
    kind: "savoir",
    question: "Laquelle de ces demandes donnera la meilleure réponse ?",
    options: [
      { label: "« Écris un mail de relance. »", value: "a" },
      { label: "« Écris un super mail de relance, sois créatif ! »", value: "b" },
      { label: "« Je suis graphiste, un client me doit 800 € depuis 30 jours. Relance ferme mais polie, 100 mots maximum. »", value: "c", points: 1 },
      { label: "Je ne sais pas", value: "?" },
    ],
    explain: "Contexte, objectif et format : plus Claude en sait, plus la réponse est utile du premier coup.",
    href: "/wiki/claude-bases/bien-demander",
  },
  {
    id: "verifier",
    kind: "savoir",
    question: "Claude vous donne une date et une source précises pour un exposé. Que faites-vous ?",
    options: [
      { label: "Je recopie, il ne se trompe jamais", value: "a" },
      { label: "Je vérifie la source avant de l'utiliser", value: "b", points: 1 },
      { label: "Je lui redemande, s'il répète c'est que c'est vrai", value: "c" },
      { label: "Je ne sais pas", value: "?" },
    ],
    explain: "Claude peut affirmer quelque chose de faux avec assurance. Plus l'enjeu est important, plus on vérifie à la source.",
    href: "/wiki/claude-bases/verifier-reponses",
  },
  {
    id: "projet",
    kind: "savoir",
    question: "À quoi sert un « projet » dans Claude ?",
    options: [
      { label: "À regrouper conversations, documents et instructions sur un même sujet", value: "a", points: 1 },
      { label: "À payer moins cher", value: "b" },
      { label: "À partager son écran avec Claude", value: "c" },
      { label: "Je ne sais pas", value: "?" },
    ],
    explain: "Un projet garde vos documents et vos consignes : chaque nouvelle conversation part de ce contexte.",
    href: "/wiki/claude-ai/projects-creation",
  },
  {
    id: "mcp",
    kind: "savoir",
    question: "Un connecteur (ou serveur MCP), c'est…",
    options: [
      { label: "Un modèle plus puissant", value: "a" },
      { label: "Un branchement qui permet à Claude d'utiliser une autre application (Gmail, Shopify, Notion…)", value: "b", points: 1 },
      { label: "Un câble pour l'ordinateur", value: "c" },
      { label: "Je ne sais pas", value: "?" },
    ],
    explain: "MCP est le standard qui relie Claude à vos outils, pour qu'il lise et agisse dans vos vraies données.",
    href: "/wiki/mcp/introduction-mcp",
  },
  {
    id: "skill",
    kind: "savoir",
    question: "Qu'est-ce qu'un skill ?",
    options: [
      { label: "Un niveau de compétence affiché sur votre profil", value: "a" },
      { label: "Une méthode écrite (instructions, exemples, scripts) que Claude applique quand la tâche s'y prête", value: "b", points: 1 },
      { label: "Une extension de navigateur", value: "c" },
      { label: "Je ne sais pas", value: "?" },
    ],
    explain: "Un skill, c'est votre façon de faire enregistrée une fois : Claude la réutilise à chaque fois.",
    href: "/wiki/claude-ai/skills-claude",
  },
  {
    id: "claude-md",
    kind: "savoir",
    question: "Dans Claude Code, le fichier CLAUDE.md sert à…",
    options: [
      { label: "Stocker votre clé d'API", value: "a" },
      { label: "Donner le contexte permanent du projet : commandes, conventions, pièges", value: "b", points: 1 },
      { label: "Enregistrer l'historique des conversations", value: "c" },
      { label: "Je ne sais pas", value: "?" },
    ],
    explain: "Claude le lit au début de chaque session. Un CLAUDE.md court et à jour évite de tout réexpliquer.",
    href: "/wiki/demarrer/claude-md",
  },
  {
    id: "workflow",
    kind: "savoir",
    question: "Vous devez modifier 300 fichiers dans un projet. Le plus adapté ?",
    options: [
      { label: "Une seule longue conversation, fichier par fichier", value: "a" },
      { label: "Un dynamic workflow ou /batch qui répartit le travail entre plusieurs agents et vérifie", value: "b", points: 1 },
      { label: "Copier-coller chaque fichier dans claude.ai", value: "c" },
      { label: "Je ne sais pas", value: "?" },
    ],
    explain: "Pour les gros chantiers, plusieurs agents en parallèle avec vérification sont plus rapides et plus fiables.",
    href: "/wiki/cli/dynamic-workflows-agents-arriere-plan",
  },
];

export const MAX_SCORE = 6 + QUESTIONS.filter((q) => q.kind === "savoir").length; // 13

export const LEVELS = ["Débutant", "Intermédiaire", "Avancé", "Expert"] as const;
export type LevelName = (typeof LEVELS)[number];

export type QuizResult = {
  theme: string;
  score: number;
  level: LevelName;
  levelIndex: number;
  code: boolean;
  date: string;
};

export function computeResult(answers: Record<string, string>): QuizResult {
  let score = 0;
  for (const q of QUESTIONS) {
    if (q.id === "objectif") continue;
    const opt = q.options.find((o) => o.value === answers[q.id]);
    score += opt?.points ?? 0;
  }
  const levelIndex = score <= 3 ? 0 : score <= 7 ? 1 : score <= 10 ? 2 : 3;
  const theme = answers.objectif ?? "productivite";
  const code = Number(answers.terminal ?? 0) >= 2 || theme === "vibe-coding";
  return { theme, score, level: LEVELS[levelIndex], levelIndex, code, date: new Date().toISOString() };
}

// Les lectures conseillées selon le niveau et le profil.
export function readingsFor(r: QuizResult): { title: string; href: string; why: string }[] {
  const claude = [
    [
      { title: "Premiers pas avec Claude", href: "/wiki/claude-bases/premiers-pas", why: "L'interface et une première conversation utile." },
      { title: "Bien formuler ses demandes", href: "/wiki/claude-bases/bien-demander", why: "La méthode qui change tout, avec des modèles à copier." },
      { title: "Les 12 erreurs de débutant", href: "/wiki/claude-bases/erreurs-debutant", why: "Les pièges à éviter dès le départ." },
      { title: "Le glossaire", href: "/wiki/claude-bases/glossaire", why: "Pour ne plus bloquer sur le vocabulaire." },
    ],
    [
      { title: "Créer ses projets", href: "/wiki/claude-ai/projects-creation", why: "Un espace par sujet avec vos documents." },
      { title: "La mémoire", href: "/wiki/claude-ai/memoire", why: "Ce qu'il retient de vous, et comment le corriger." },
      { title: "Les connecteurs", href: "/wiki/claude-ai/integrations-natives", why: "Brancher vos outils du quotidien." },
      { title: "Vérifier les réponses", href: "/wiki/claude-bases/verifier-reponses", why: "Savoir quand faire confiance." },
    ],
    [
      { title: "Les skills dans Claude", href: "/wiki/claude-ai/skills-claude", why: "Enregistrer vos méthodes une fois pour toutes." },
      { title: "Cowork", href: "/wiki/claude-agents/cowork", why: "Confier une vraie tâche en plusieurs étapes." },
      { title: "Claude dans Chrome", href: "/wiki/claude-agents/claude-chrome", why: "Le laisser naviguer et agir sur le web." },
      { title: "Qu'est-ce que MCP ?", href: "/wiki/mcp/introduction-mcp", why: "Comprendre ce qu'il y a derrière les connecteurs." },
    ],
    [
      { title: "Dispatch : piloter depuis le téléphone", href: "/wiki/claude-agents/dispatch-taches", why: "Lancer des tâches où que vous soyez." },
      { title: "Installer Claude Code", href: "/wiki/demarrer/installation", why: "L'étape suivante : l'agent qui code pour vous." },
      { title: "Créer un serveur MCP", href: "/wiki/mcp/creer-serveur-ts-setup", why: "Brancher vos propres outils." },
      { title: "Les plugins", href: "/wiki/plugins/introduction-plugins", why: "Partager toute votre configuration." },
    ],
  ];
  const code = [
    [
      { title: "Installer Claude Code", href: "/wiki/demarrer/installation", why: "Installation et connexion en 5 minutes." },
      { title: "Votre premier prompt", href: "/wiki/demarrer/premier-prompt", why: "Déléguer une vraie tâche dès le départ." },
      { title: "Bien formuler ses demandes", href: "/wiki/claude-bases/bien-demander", why: "La base, valable aussi dans le terminal." },
      { title: "Le glossaire", href: "/wiki/claude-bases/glossaire", why: "Worktree, hook, MCP… expliqués simplement." },
    ],
    [
      { title: "CLAUDE.md et AGENTS.md", href: "/wiki/demarrer/claude-md", why: "Le contexte du projet, une fois pour toutes." },
      { title: "Les modes de permission", href: "/wiki/cli/permissions-modes", why: "Travailler sans valider chaque action." },
      { title: "Installer un serveur MCP", href: "/wiki/mcp/installer-serveur-mcp", why: "Brancher GitHub, Supabase, Figma…" },
      { title: "Suivre la formation", href: "/learn", why: "Les modules pas à pas, avec exercices." },
    ],
    [
      { title: "Les 30 astuces des utilisateurs avancés", href: "/wiki/demarrer/astuces-avancees", why: "Ce que font les équipes qui l'utilisent tous les jours." },
      { title: "Structure d'un skill", href: "/wiki/skills/structure-skill", why: "Automatiser vos habitudes." },
      { title: "Les hooks", href: "/wiki/hooks/introduction-hooks", why: "Formater, tester, bloquer automatiquement." },
      { title: "Les sous-agents", href: "/wiki/subagents/pourquoi-subagents", why: "Déléguer sans saturer le contexte." },
    ],
    [
      { title: "Dynamic workflows", href: "/wiki/cli/dynamic-workflows-agents-arriere-plan", why: "Des dizaines d'agents pour les gros chantiers." },
      { title: "Agent view", href: "/wiki/cli/agent-view-sessions", why: "Plusieurs sessions en parallèle." },
      { title: "Créer un plugin", href: "/wiki/plugins/creer-plugin", why: "Packager et partager votre configuration." },
      { title: "Les mods", href: "/wiki/plugins/mods", why: "Modifier Claude Code lui-même." },
    ],
  ];
  return (r.code ? code : claude)[r.levelIndex];
}

export const STORAGE_KEY = "cm-parcours";

export function loadResult(): QuizResult | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QuizResult) : null;
  } catch {
    return null;
  }
}

export function saveResult(r: QuizResult) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
  } catch {
    // stockage indisponible (navigation privée) : le résultat reste affiché
  }
}
