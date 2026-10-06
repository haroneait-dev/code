// Applications à brancher sur Claude, rangées par thème.
// « kind » dit comment l'application se connecte :
// - connecteur : se branche en quelques clics depuis claude.ai (Paramètres > Connecteurs)
// - mcp : serveur MCP officiel, à ajouter dans Claude ou Claude Code
// - communautaire : serveur MCP maintenu par la communauté, à vérifier avant usage
// - sans-mcp : pas besoin de connecteur, Claude Code s'en sert directement

export type AppKind = "connecteur" | "mcp" | "communautaire" | "sans-mcp";

export type App = {
  name: string;
  kind: AppKind;
  what: string;
  prompt: string;
  url: string;
  setup?: string;
};

export type Theme = {
  id: string;
  name: string;
  intro: string;
  forWho: string;
  learn: { title: string; href: string }[];
  apps: App[];
};

export const KIND_LABEL: Record<AppKind, string> = {
  connecteur: "Connecteur",
  mcp: "MCP officiel",
  communautaire: "MCP communautaire",
  "sans-mcp": "Sans MCP",
};

export const THEMES: Theme[] = [
  {
    id: "e-commerce",
    name: "E-commerce",
    intro:
      "Gérer une boutique en ligne avec Claude : fiches produits, prix, e-mails, publicités, SEO et suivi des ventes, sans passer d'un outil à l'autre.",
    forWho: "Boutiques Shopify, dropshipping, marques en ligne, freelances e-commerce.",
    learn: [
      { title: "Claude pour les entrepreneurs", href: "/wiki/cas-usage/entrepreneurs" },
      { title: "Les connecteurs", href: "/wiki/claude-ai/integrations-natives" },
      { title: "Créer un skill pour vos fiches produits", href: "/wiki/claude-ai/skills-claude" },
    ],
    apps: [
      {
        name: "Shopify",
        kind: "mcp",
        what: "Lire et modifier produits, collections, commandes et stocks, et interroger les ventes de la boutique.",
        prompt: "Liste mes 20 produits sans texte alternatif sur les images et propose un texte pour chacun.",
        url: "https://shopify.dev/docs/apps/build/devmcp",
      },
      {
        name: "Stripe",
        kind: "mcp",
        what: "Paiements, clients, abonnements, remboursements et liens de paiement.",
        prompt: "Quels clients ont eu un paiement refusé ce mois-ci ? Prépare un e-mail de relance pour chacun.",
        url: "https://docs.stripe.com/mcp",
        setup: "claude mcp add --transport http stripe https://mcp.stripe.com",
      },
      {
        name: "Klaviyo",
        kind: "mcp",
        what: "Campagnes e-mail et SMS, flows, segments et statistiques d'ouverture et de revenus.",
        prompt: "Compare le revenu par destinataire de mes 5 dernières campagnes et dis-moi ce qui marche.",
        url: "https://developers.klaviyo.com/en/docs/klaviyo_mcp_server",
      },
      {
        name: "Canva",
        kind: "connecteur",
        what: "Créer et modifier des visuels : bannières, publications, visuels produits à partir de vos modèles.",
        prompt: "Crée 3 visuels Instagram pour la sortie de mon nouveau sac, au format carré, avec ma charte.",
        url: "https://www.canva.com",
      },
      {
        name: "Semrush",
        kind: "connecteur",
        what: "Mots-clés, positions, concurrents, trafic et backlinks pour le référencement de la boutique.",
        prompt: "Trouve 15 mots-clés à faible concurrence autour de « sac cabine » et classe-les par potentiel.",
        url: "https://www.semrush.com",
      },
      {
        name: "Ubersuggest",
        kind: "connecteur",
        what: "Volumes de recherche, idées de mots-clés et d'articles, audit SEO de site.",
        prompt: "Fais une carte des mots-clés autour de « sac banane » avec leurs volumes, rangés par intention.",
        url: "https://neilpatel.com/ubersuggest/",
      },
      {
        name: "Trendtrack",
        kind: "connecteur",
        what: "Veille publicitaire : publicités Meta et TikTok qui marchent, boutiques concurrentes, produits gagnants.",
        prompt: "Montre-moi les publicités de concurrents dans ma niche qui tournent depuis plus de 30 jours.",
        url: "https://www.trendtrack.io",
      },
      {
        name: "Google Sheets",
        kind: "connecteur",
        what: "Suivi des marges, des stocks et des fournisseurs dans un tableur partagé.",
        prompt: "Mets à jour mon tableau de marges avec les nouveaux prix fournisseurs et signale les produits sous 30 %.",
        url: "https://workspace.google.com/products/sheets/",
      },
    ],
  },
  {
    id: "vibe-coding",
    name: "Vibe coding",
    intro:
      "Créer un site ou une application en décrivant ce que vous voulez, même en débutant. Claude Code écrit le code, et ces outils lui donnent une base de données, un hébergement et des yeux pour tester.",
    forWho: "Créateurs de SaaS, indépendants, étudiants, porteurs de projet qui veulent un prototype vite.",
    learn: [
      { title: "Installer Claude Code", href: "/wiki/demarrer/installation" },
      { title: "Votre premier prompt", href: "/wiki/demarrer/premier-prompt" },
      { title: "Les 30 astuces des utilisateurs avancés", href: "/wiki/demarrer/astuces-avancees" },
      { title: "Installer un serveur MCP", href: "/wiki/mcp/installer-serveur-mcp" },
    ],
    apps: [
      {
        name: "GitHub",
        kind: "mcp",
        what: "Dépôts, issues, pull requests et revues de code, directement depuis Claude.",
        prompt: "Lis les issues ouvertes étiquetées « bug », corrige la plus simple et ouvre une pull request.",
        url: "https://github.com/github/github-mcp-server",
      },
      {
        name: "Supabase",
        kind: "mcp",
        what: "Base de données Postgres, authentification et stockage : tables, migrations, requêtes, logs.",
        prompt: "Crée une table « commandes » avec les bonnes politiques de sécurité et génère les types TypeScript.",
        url: "https://supabase.com/docs/guides/getting-started/mcp",
      },
      {
        name: "Vercel",
        kind: "mcp",
        what: "Déploiements, domaines, variables d'environnement et logs d'erreur de vos sites.",
        prompt: "Mon dernier déploiement a échoué : lis les logs et corrige la cause.",
        url: "https://vercel.com/docs/mcp",
      },
      {
        name: "Figma",
        kind: "mcp",
        what: "Transformer une maquette Figma en code fidèle : couleurs, espacements, composants.",
        prompt: "Code cette page Figma en React avec Tailwind, en réutilisant mes composants existants.",
        url: "https://help.figma.com/hc/en-us/articles/32132100833559",
        setup: "claude mcp add --transport http figma https://mcp.figma.com/mcp",
      },
      {
        name: "Playwright",
        kind: "mcp",
        what: "Un navigateur que Claude pilote pour tester votre site : cliquer, remplir, faire des captures.",
        prompt: "Teste le parcours d'inscription sur mobile et montre-moi ce qui casse.",
        url: "https://github.com/microsoft/playwright-mcp",
        setup: "claude mcp add playwright -- npx @playwright/mcp@latest",
      },
      {
        name: "Context7",
        kind: "communautaire",
        what: "Donne à Claude la documentation à jour des bibliothèques (Next.js, Tailwind…) au lieu de sa mémoire.",
        prompt: "En t'appuyant sur la doc actuelle de Next.js, ajoute une page avec chargement progressif.",
        url: "https://github.com/upstash/context7",
      },
      {
        name: "Sentry",
        kind: "mcp",
        what: "Les erreurs réelles de vos utilisateurs, avec la trace complète, pour les corriger à la source.",
        prompt: "Quelles sont les 3 erreurs les plus fréquentes cette semaine ? Corrige la première.",
        url: "https://docs.sentry.io/product/sentry-mcp/",
        setup: "claude mcp add --transport http sentry https://mcp.sentry.dev/mcp",
      },
      {
        name: "Stripe",
        kind: "mcp",
        what: "Ajouter le paiement à votre application, avec les bons produits et prix créés pour vous.",
        prompt: "Ajoute un abonnement à 3 €/mois avec Stripe Checkout et une page de compte.",
        url: "https://docs.stripe.com/mcp",
      },
    ],
  },
  {
    id: "video-motion",
    name: "Vidéo et motion design",
    intro:
      "Produire des vidéos courtes, des animations et des voix off. Avec Claude Code, une vidéo peut s'écrire comme du code : vous décrivez, il anime, vous ajustez.",
    forWho: "Créateurs TikTok et YouTube, monteurs, agences, marques qui publient beaucoup de vidéos.",
    learn: [
      { title: "Fichiers, Docs, Slides et Design", href: "/wiki/claude-ai/docs-slides-design" },
      { title: "Installer Claude Code", href: "/wiki/demarrer/installation" },
      { title: "Les skills dans Claude Code", href: "/wiki/skills/structure-skill" },
    ],
    apps: [
      {
        name: "Remotion",
        kind: "sans-mcp",
        what: "Créer des vidéos en React : textes animés, sous-titres, graphiques, formats TikTok. Claude Code écrit les animations et lance le rendu.",
        prompt: "Crée une vidéo verticale de 20 secondes qui présente 3 astuces, avec des titres animés et une barre de progression.",
        url: "https://www.remotion.dev",
        setup: "npx create-video@latest",
      },
      {
        name: "FFmpeg",
        kind: "sans-mcp",
        what: "Couper, assembler, compresser, recadrer en 9:16, extraire l'audio : Claude Code écrit et lance les commandes.",
        prompt: "Découpe cette vidéo en extraits de 30 secondes au format vertical et compresse-les pour TikTok.",
        url: "https://ffmpeg.org",
      },
      {
        name: "ElevenLabs",
        kind: "mcp",
        what: "Voix off réalistes, doublage, effets sonores et transcription.",
        prompt: "Génère une voix off française dynamique pour ce script de 45 secondes.",
        url: "https://github.com/elevenlabs/elevenlabs-mcp",
      },
      {
        name: "Canva",
        kind: "connecteur",
        what: "Miniatures, visuels de couverture et habillage de vidéos à partir de vos modèles.",
        prompt: "Crée 4 miniatures YouTube pour cette vidéo, avec un gros titre lisible sur mobile.",
        url: "https://www.canva.com",
      },
      {
        name: "Blender",
        kind: "connecteur",
        what: "Scènes 3D, objets et animations : Claude prépare et modifie la scène pour vous.",
        prompt: "Crée une scène simple avec mon produit qui tourne sur un socle, éclairage studio.",
        url: "https://www.blender.org",
      },
      {
        name: "Adobe",
        kind: "connecteur",
        what: "Travailler avec les applications Adobe (retouche, montage, design) depuis la conversation.",
        prompt: "Prépare 3 variantes de couleurs de ce visuel pour une campagne d'automne.",
        url: "https://www.adobe.com",
      },
    ],
  },
  {
    id: "design",
    name: "Design et image de marque",
    intro:
      "Créer une identité visuelle, des maquettes et des supports cohérents. Claude propose, vous choisissez, il décline sur tous les formats.",
    forWho: "Designers, fondateurs, community managers, étudiants en design.",
    learn: [
      { title: "Fichiers, Docs, Slides et Design", href: "/wiki/claude-ai/docs-slides-design" },
      { title: "Créer un projet par client", href: "/wiki/claude-ai/projects-creation" },
    ],
    apps: [
      {
        name: "Figma",
        kind: "mcp",
        what: "Lire vos maquettes, vos composants et vos variables de design pour les respecter partout.",
        prompt: "Liste les couleurs et typographies de ce fichier et repère les incohérences.",
        url: "https://help.figma.com/hc/en-us/articles/32132100833559",
      },
      {
        name: "Canva",
        kind: "connecteur",
        what: "Décliner une charte en publications, présentations, affiches et cartes de visite.",
        prompt: "Décline ce logo en 5 publications LinkedIn et une bannière de profil.",
        url: "https://www.canva.com",
      },
      {
        name: "Claude Design",
        kind: "sans-mcp",
        what: "Intégré à Claude : maquettes d'écrans et de pages directement dans la conversation.",
        prompt: "Dessine la page d'accueil mobile d'une application de recettes, style chaleureux.",
        url: "https://claude.ai",
      },
      {
        name: "Adobe",
        kind: "connecteur",
        what: "Retouche et création avec les applications Adobe.",
        prompt: "Supprime l'arrière-plan de ces 10 photos produit et uniformise la lumière.",
        url: "https://www.adobe.com",
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing et réseaux sociaux",
    intro:
      "Planifier du contenu, analyser ce qui marche et suivre vos clients, en laissant Claude croiser les chiffres de plusieurs outils.",
    forWho: "Community managers, freelances marketing, créateurs de contenu, PME.",
    learn: [
      { title: "Rédiger avec Claude", href: "/wiki/cas-usage/rediger" },
      { title: "Analyser des données", href: "/wiki/cas-usage/analyser-donnees" },
      { title: "La recherche web", href: "/wiki/claude-ai/recherche" },
    ],
    apps: [
      {
        name: "HubSpot",
        kind: "connecteur",
        what: "Contacts, entreprises, affaires et historique client du CRM.",
        prompt: "Quels prospects n'ont pas été relancés depuis 3 semaines ? Rédige une relance personnalisée pour chacun.",
        url: "https://www.hubspot.com",
      },
      {
        name: "Semrush",
        kind: "connecteur",
        what: "SEO, publicité payante et analyse de la concurrence.",
        prompt: "Compare mon site à mes 3 concurrents principaux et donne 5 actions SEO prioritaires.",
        url: "https://www.semrush.com",
      },
      {
        name: "Supermetrics",
        kind: "connecteur",
        what: "Rassembler les chiffres de Meta Ads, Google Ads, TikTok, GA4 et d'autres sources dans une seule analyse.",
        prompt: "Compare le coût par achat de mes campagnes Meta et Google sur les 30 derniers jours.",
        url: "https://supermetrics.com",
      },
      {
        name: "Notion",
        kind: "mcp",
        what: "Calendrier éditorial, idées de contenus et briefs dans votre espace Notion.",
        prompt: "Crée un calendrier éditorial d'un mois dans Notion avec 3 idées de TikTok par semaine.",
        url: "https://developers.notion.com/docs/mcp",
        setup: "claude mcp add --transport http notion https://mcp.notion.com/mcp",
      },
      {
        name: "Canva",
        kind: "connecteur",
        what: "Visuels pour chaque publication, aux bons formats.",
        prompt: "Transforme ce calendrier en 12 visuels prêts à publier.",
        url: "https://www.canva.com",
      },
    ],
  },
  {
    id: "productivite",
    name: "Productivité et organisation",
    intro:
      "Faire de Claude un assistant qui connaît vos documents, vos e-mails et votre agenda, pour préparer, trier et résumer à votre place.",
    forWho: "Tout le monde : salariés, indépendants, étudiants, managers.",
    learn: [
      { title: "Les connecteurs", href: "/wiki/claude-ai/integrations-natives" },
      { title: "Cowork : confier une vraie tâche", href: "/wiki/claude-agents/cowork" },
      { title: "La mémoire", href: "/wiki/claude-ai/memoire" },
    ],
    apps: [
      {
        name: "Gmail et Google Agenda",
        kind: "connecteur",
        what: "Retrouver un e-mail, préparer des réponses, organiser des rendez-vous.",
        prompt: "Résume les e-mails importants de la semaine et propose des créneaux pour les 3 réunions demandées.",
        url: "https://workspace.google.com",
      },
      {
        name: "Google Drive",
        kind: "connecteur",
        what: "Chercher et lire vos documents, tableurs et présentations.",
        prompt: "Retrouve le dernier devis envoyé à ce client et compare-le à celui de l'an dernier.",
        url: "https://drive.google.com",
      },
      {
        name: "Microsoft 365",
        kind: "connecteur",
        what: "Outlook, Teams, SharePoint et OneDrive pour ceux qui travaillent chez Microsoft.",
        prompt: "Prépare un résumé de ce fil Teams avec les décisions et les tâches de chacun.",
        url: "https://www.microsoft.com/microsoft-365",
      },
      {
        name: "Notion",
        kind: "mcp",
        what: "Notes, wikis d'équipe, bases de tâches et comptes rendus.",
        prompt: "Transforme ces notes de réunion en tâches dans ma base Notion, avec responsables et dates.",
        url: "https://developers.notion.com/docs/mcp",
      },
      {
        name: "Slack",
        kind: "connecteur",
        what: "Rechercher dans les canaux, résumer des discussions, rédiger des messages.",
        prompt: "Qu'est-ce que j'ai raté dans #projet-site depuis lundi ?",
        url: "https://slack.com",
      },
      {
        name: "Asana",
        kind: "mcp",
        what: "Projets, tâches et échéances de l'équipe.",
        prompt: "Quelles tâches de mon équipe sont en retard ? Propose un nouveau planning réaliste.",
        url: "https://asana.com",
        setup: "claude mcp add --transport sse asana https://mcp.asana.com/sse",
      },
    ],
  },
  {
    id: "donnees",
    name: "Données et finance",
    intro:
      "Poser des questions à vos chiffres en français, sans écrire de formules ni de SQL, et obtenir des graphiques et des tableaux propres.",
    forWho: "Gérants, comptables, analystes, porteurs de projet qui suivent leurs chiffres.",
    learn: [
      { title: "Analyser des données", href: "/wiki/cas-usage/analyser-donnees" },
      { title: "Vérifier les réponses", href: "/wiki/claude-bases/verifier-reponses" },
    ],
    apps: [
      {
        name: "Google Sheets",
        kind: "connecteur",
        what: "Lire, compléter et mettre en forme vos tableurs.",
        prompt: "Fais un tableau de bord mensuel de mes ventes avec l'évolution par catégorie.",
        url: "https://workspace.google.com/products/sheets/",
      },
      {
        name: "Airtable",
        kind: "communautaire",
        what: "Bases de données simples : clients, stocks, projets.",
        prompt: "Quels clients n'ont pas commandé depuis 90 jours ?",
        url: "https://github.com/domdomegg/airtable-mcp-server",
      },
      {
        name: "Stripe",
        kind: "mcp",
        what: "Chiffre d'affaires, abonnements, désabonnements et remboursements.",
        prompt: "Calcule mon revenu mensuel récurrent et le taux de désabonnement des 6 derniers mois.",
        url: "https://docs.stripe.com/mcp",
      },
      {
        name: "DBHub",
        kind: "communautaire",
        what: "Interroger une base de données (Postgres, MySQL…) en lecture seule, en langage naturel.",
        prompt: "Combien d'inscrits par semaine depuis septembre, et d'où viennent-ils ?",
        url: "https://github.com/bytebase/dbhub",
      },
    ],
  },
  {
    id: "automatisation",
    name: "Automatisation sans code",
    intro:
      "Brancher Claude sur des centaines d'applications d'un coup et déclencher des actions automatiques, sans écrire de code.",
    forWho: "Indépendants, petites équipes, personnes qui répètent les mêmes tâches chaque semaine.",
    learn: [
      { title: "Cowork : confier une vraie tâche", href: "/wiki/claude-agents/cowork" },
      { title: "Routines et tâches programmées", href: "/wiki/cli/cloud-routines-remote" },
    ],
    apps: [
      {
        name: "Zapier",
        kind: "mcp",
        what: "Accès à des milliers d'applications via vos actions Zapier : CRM, formulaires, e-mails, tableurs.",
        prompt: "Quand je te donne une facture, ajoute-la à mon tableau et envoie-la à mon comptable.",
        url: "https://zapier.com/mcp",
      },
      {
        name: "n8n",
        kind: "mcp",
        what: "Automatisations hébergées chez vous, que Claude peut déclencher ou appeler comme outils.",
        prompt: "Lance mon workflow « nouvelle commande » pour cette commande et dis-moi le résultat.",
        url: "https://docs.n8n.io",
      },
      {
        name: "Make",
        kind: "mcp",
        what: "Vos scénarios Make deviennent des outils que Claude peut lancer.",
        prompt: "Lance le scénario qui publie mon article de blog sur les réseaux.",
        url: "https://www.make.com",
      },
    ],
  },
];

// ─── Une page par application (/applications/<slug>) ───────────────────
export function appSlug(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type AppPage = {
  slug: string;
  name: string;
  kind: AppKind;
  url: string;
  setup?: string;
  uses: { theme: Theme; what: string; prompt: string }[];
};

export function allApps(): AppPage[] {
  const map = new Map<string, AppPage>();
  for (const t of THEMES) {
    for (const a of t.apps) {
      const slug = appSlug(a.name);
      const cur = map.get(slug) ?? { slug, name: a.name, kind: a.kind, url: a.url, setup: a.setup, uses: [] };
      cur.setup ??= a.setup;
      cur.uses.push({ theme: t, what: a.what, prompt: a.prompt });
      map.set(slug, cur);
    }
  }
  return [...map.values()];
}
