// Défi de la semaine : un petit exercice concret, qui change chaque lundi.
// Ajouter des défis à la fin de la liste ; la rotation suit le numéro de semaine.

export type Defi = { title: string; level: "Débutant" | "Intermédiaire" | "Avancé"; text: string; prompt?: string; href: string };

export const DEFIS: Defi[] = [
  {
    title: "Le mail que vous repoussez",
    level: "Débutant",
    text: "Prenez l'e-mail difficile que vous repoussez depuis des jours. Faites-en écrire trois versions par Claude (diplomate, directe, très courte) et envoyez la meilleure.",
    prompt: "Aide-moi à répondre à cet e-mail : « [e-mail] ». 3 versions : diplomate, directe, très courte.",
    href: "/wiki/claude-bases/bien-demander",
  },
  {
    title: "Votre premier projet",
    level: "Débutant",
    text: "Créez un projet sur un sujet qui vous occupe en ce moment (un client, un examen, un voyage), déposez-y 3 documents et écrivez ses instructions. Posez-lui ensuite 5 questions.",
    href: "/wiki/claude-ai/projects-creation",
  },
  {
    title: "Le fact-check",
    level: "Débutant",
    text: "Demandez à Claude un sujet que vous connaissez très bien, avec la recherche web activée. Vérifiez chaque source qu'il cite. Combien sont exactes ?",
    href: "/wiki/claude-bases/verifier-reponses",
  },
  {
    title: "Un skill pour votre tâche répétitive",
    level: "Intermédiaire",
    text: "Repérez une tâche que vous expliquez souvent à Claude (compte rendu, fiche produit, post). Écrivez-en un skill avec un exemple parfait, et testez-le sur trois cas.",
    href: "/wiki/claude-ai/skills-claude",
  },
  {
    title: "Brancher un premier connecteur",
    level: "Intermédiaire",
    text: "Connectez Google Drive, Notion ou Gmail, et demandez à Claude de préparer votre réunion de demain à partir de vos vrais documents.",
    href: "/applications",
  },
  {
    title: "Le tableau qui parle",
    level: "Intermédiaire",
    text: "Envoyez un fichier Excel ou CSV de vos dépenses ou ventes. Demandez 3 observations et un graphique. Vérifiez un chiffre à la main.",
    href: "/wiki/cas-usage/analyser-donnees",
  },
  {
    title: "Une page web en 20 minutes",
    level: "Intermédiaire",
    text: "Installez Claude Code et faites-lui créer la page de présentation de votre activité, puis mettez-la en ligne sur Vercel.",
    href: "/wiki/demarrer/installation",
  },
  {
    title: "Le CLAUDE.md minimal",
    level: "Avancé",
    text: "Dans un de vos projets, lancez /init puis réduisez le CLAUDE.md à moins de 40 lignes vraiment utiles. Comparez une même demande avant et après.",
    href: "/wiki/demarrer/claude-md",
  },
  {
    title: "Un hook qui vous fait gagner du temps",
    level: "Avancé",
    text: "Ajoutez un hook PostToolUse qui formate automatiquement le code après chaque modification de Claude.",
    href: "/wiki/hooks/introduction-hooks",
  },
  {
    title: "Deux sessions en parallèle",
    level: "Avancé",
    text: "Lancez deux sessions Claude Code dans deux worktrees sur deux petites tâches différentes, et suivez-les avec claude agents.",
    href: "/wiki/cli/agent-view-sessions",
  },
];

// Numéro de semaine depuis une date fixe (lundi 5 octobre 2026), pour une rotation stable.
export function currentDefiIndex(now = new Date()) {
  const start = Date.UTC(2026, 9, 5);
  const weeks = Math.floor((now.getTime() - start) / (7 * 24 * 3600 * 1000));
  return ((weeks % DEFIS.length) + DEFIS.length) % DEFIS.length;
}
