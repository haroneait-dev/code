// ─── Wiki manifest ────────────────────────────────────────────────────
// Consolidated taxonomy. Source of truth for article slugs & categories.
// Articles themselves live as MDX files in content/wiki/<cat>/<slug>.mdx

export type CategoryId =
  | "claude-bases"
  | "claude-agents"
  | "cas-usage"
  | "demarrer"
  | "modeles"
  | "cli"
  | "outils"
  | "slash-commands"
  | "hooks"
  | "skills"
  | "subagents"
  | "mcp"
  | "prompt-engineering"
  | "api"
  | "workflows"
  | "claude-ai"
  | "enterprise"
  | "plugins"
  | "obsidian"
  | "actualites";

export type CategoryIcon =
  | "terminal"
  | "sparkles"
  | "plug"
  | "layers"
  | "shield"
  | "wrench"
  | "command"
  | "zap"
  | "puzzle"
  | "users"
  | "cloud"
  | "git"
  | "lock"
  | "globe";

export type SectionId = "claude" | "code" | "commun";

export const SECTIONS: { id: SectionId; name: string; description: string; href: string }[] = [
  {
    id: "claude",
    name: "Claude",
    description: "L'assistant au quotidien : chat, projets, mémoire, recherche, fichiers, Cowork, extensions.",
    href: "/claude",
  },
  {
    id: "code",
    name: "Claude Code",
    description: "L'agent de développement : CLI, outils, hooks, skills, MCP, plugins, API.",
    href: "/claude-code",
  },
  {
    id: "commun",
    name: "Pour les deux",
    description: "Les modèles, l'art de bien formuler ses demandes, et l'actualité.",
    href: "/wiki",
  },
];

export type Category = {
  id: CategoryId;
  section: SectionId;
  name: string;
  icon: CategoryIcon;
  description: string;
};

export type ArticleStub = {
  slug: string;
  title: string;
  category: CategoryId;
  description: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "claude-bases",
    section: "claude",
    name: "Bien démarrer avec Claude",
    icon: "sparkles",
    description: "Premiers pas, offres et limites, modèles, bien formuler ses demandes, confidentialité.",
  },
  {
    id: "demarrer",
    section: "code",
    name: "Démarrer avec Claude Code",
    icon: "terminal",
    description: "Installation, premiers pas, configuration de base.",
  },
  {
    id: "modeles",
    section: "commun",
    name: "Modèles Claude",
    icon: "sparkles",
    description: "Fable, Opus, Sonnet, Haiku : capacités, prix, comparatifs, choix.",
  },
  {
    id: "cli",
    section: "code",
    name: "CLI Claude Code",
    icon: "command",
    description: "Tout sur le CLI : sessions, settings, modes, automation.",
  },
  {
    id: "outils",
    section: "code",
    name: "Outils intégrés",
    icon: "wrench",
    description: "Read, Write, Edit, Bash, Grep et compagnie — en détail.",
  },
  {
    id: "slash-commands",
    section: "code",
    name: "Slash Commands",
    icon: "zap",
    description: "Commandes built-in et création de commandes custom.",
  },
  {
    id: "hooks",
    section: "code",
    name: "Hooks",
    icon: "git",
    description: "Automatisation via PreToolUse, PostToolUse, SessionStart, etc.",
  },
  {
    id: "skills",
    section: "code",
    name: "Skills (Agent SDK)",
    icon: "puzzle",
    description: "Système de skills réutilisables — créer, publier, composer.",
  },
  {
    id: "subagents",
    section: "code",
    name: "Subagents",
    icon: "users",
    description: "Délégation à des agents spécialisés en parallèle.",
  },
  {
    id: "mcp",
    section: "code",
    name: "MCP",
    icon: "plug",
    description: "Model Context Protocol — serveurs, clients, primitives.",
  },
  {
    id: "prompt-engineering",
    section: "commun",
    name: "Prompt Engineering",
    icon: "sparkles",
    description: "Techniques avancées pour formuler des requêtes efficaces.",
  },
  {
    id: "api",
    section: "code",
    name: "API Anthropic",
    icon: "cloud",
    description: "Utiliser l'API directement — SDK, streaming, tools, caching.",
  },
  {
    id: "workflows",
    section: "code",
    name: "Workflows & Sécurité",
    icon: "shield",
    description: "Workflows production, sécurité, bonnes pratiques.",
  },
  {
    id: "claude-ai",
    section: "claude",
    name: "Les fonctions de Claude",
    icon: "globe",
    description: "Projets, mémoire, recherche, fichiers, Docs et Slides, connecteurs, skills, applications.",
  },
  {
    id: "enterprise",
    section: "code",
    name: "Architecture & Enterprise",
    icon: "lock",
    description: "Déploiement, sécurité, conformité, multi-cloud.",
  },
  {
    id: "plugins",
    section: "code",
    name: "Plugins & mods",
    icon: "layers",
    description: "Installer, créer et publier des plugins, et modifier l'interface avec les mods.",
  },
  {
    id: "claude-agents",
    section: "claude",
    name: "Claude qui agit pour vous",
    icon: "zap",
    description: "Cowork, Dispatch, tâches programmées, Claude dans Chrome et dans Microsoft 365.",
  },
  {
    id: "cas-usage",
    section: "claude",
    name: "Cas d'usage concrets",
    icon: "users",
    description: "Études, rédaction, données, entrepreneuriat, vie quotidienne : des méthodes prêtes à l'emploi.",
  },
  {
    id: "obsidian",
    section: "claude",
    name: "Obsidian + Claude",
    icon: "layers",
    description: "Connecter ton vault Obsidian à Claude — approche fichiers et MCP.",
  },
  {
    id: "actualites",
    section: "commun",
    name: "Actualités & ressources",
    icon: "zap",
    description: "Nouveautés Claude Code 2026 et sources externes fiables.",
  },
];

// ─── Article list ─────────────────────────────────────────────────────
// Each entry will become content/wiki/<category>/<slug>.mdx

export const ARTICLE_STUBS: ArticleStub[] = [
  // ═══ DÉMARRER ════════════════════════════════════════════════════
  { category: "demarrer", slug: "installation", title: "Installation de Claude Code", description: "Installer le CLI sur macOS, Linux, Windows." },
  { category: "demarrer", slug: "premier-prompt", title: "Votre premier prompt", description: "Lancer Claude Code et formuler une première requête." },
  { category: "demarrer", slug: "astuces-avancees", title: "Les 30 astuces des utilisateurs avancés", description: "Vérification, plan d'abord, sessions parallèles, CLAUDE.md vivant, hooks et permissions : ce que font les pros." },
  { category: "demarrer", slug: "modes-interactif-one-shot", title: "Modes interactif vs one-shot", description: "Quand utiliser le mode interactif et quand préférer l'exécution one-shot." },
  { category: "demarrer", slug: "authentification", title: "Authentification et clés API", description: "Configurer son compte, gérer les clés API Anthropic." },
  { category: "demarrer", slug: "configurer-projet", title: "Configurer un projet pour Claude Code", description: "Préparer un repo pour tirer le meilleur de Claude Code." },
  { category: "demarrer", slug: "claude-md", title: "Mémoire & gestion du contexte (CLAUDE.md)", description: "Hiérarchie des fichiers mémoire, anatomie d'un CLAUDE.md, compaction et contexte propre." },
  { category: "demarrer", slug: "permissions-sandbox", title: "Permissions et sandbox", description: "Comprendre le modèle de permissions et les modes sandbox." },
  { category: "demarrer", slug: "migration-cursor-copilot", title: "Migrer depuis Cursor ou Copilot", description: "Différences clés et stratégie de transition." },
  { category: "demarrer", slug: "ide-vscode-cursor-windsurf", title: "Configurer les IDE (VS Code, Cursor, Windsurf, Zed)", description: "Extensions officielles et tierces dans les éditeurs modernes." },
  { category: "demarrer", slug: "troubleshooting-installation", title: "Résolution des conflits d'installation", description: "Erreurs Node.js/NPM, conflits Python, pare-feu, permissions." },
  { category: "demarrer", slug: "config-globale", title: "Le fichier de config globale", description: "Anatomie de la config user en dehors de CLAUDE.md." },
  { category: "demarrer", slug: "anthropic-quickstarts", title: "Anthropic Quickstarts", description: "Architectures de référence officielles (AWS, GCP, Vercel templates)." },
  { category: "demarrer", slug: "meta-prompt-tool", title: "Le Meta-Prompt Tool d'Anthropic", description: "Outil officiel pour générer des prompts parfaits." },

  // ═══ MODÈLES CLAUDE ══════════════════════════════════════════════
  { category: "modeles", slug: "opus-sonnet-5-5", title: "Claude Opus 5.5 et Sonnet 5.5", description: "La génération 5.5 (septembre 2026) : prix, contexte 1M, ce qui change dans Claude Code et en API." },
  { category: "modeles", slug: "sonnet-5", title: "Claude Sonnet 5 : l'agentique à grande échelle", description: "Contexte 1M par défaut, raisonnement adaptatif, nouveau tokenizer (+30 %), breaking changes API et guide de migration." },
  { category: "modeles", slug: "adaptive-thinking-effort", title: "Raisonnement adaptatif & paramètre effort", description: "La fin de budget_tokens : thinking adaptatif, les 5 niveaux d'effort (low → max, dont xhigh) et la migration API." },
  { category: "modeles", slug: "fable-5-mythos-5", title: "Claude Fable 5.1 et Mythos 5.1", description: "Fable 5.1 pour tous, Mythos 5.1 pour les professionnels vérifiés, et l'histoire de la suspension de juin 2026." },
  { category: "modeles", slug: "j-space-interpretabilite", title: "J-space : l'espace de travail interne de Claude", description: "La recherche de juillet 2026 sur le J-space et la J-lens, et ce que ça change pour la sécurité de l'IA." },
  { category: "modeles", slug: "haiku-4-5", title: "Claude Haiku 4.5 : vitesse et coût", description: "Le modèle rapide pour les tâches simples et le grand volume." },
  { category: "modeles", slug: "comparatif-modeles", title: "Comparatif des modèles Claude", description: "Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 4.5 : prix, contexte et usages en un tableau." },
  { category: "modeles", slug: "extended-thinking-mecanismes", title: "La réflexion étendue (extended thinking)", description: "Réflexion adaptative vs budget_tokens, paramètre effort, limites de sortie et Task Budgets." },
  { category: "modeles", slug: "extended-thinking-software", title: "Extended Thinking : impact sur l'ingénierie logicielle", description: "Pourquoi le thinking améliore la résolution de bugs complexes (SWE-bench)." },
  { category: "modeles", slug: "vision-capacites", title: "Claude Vision : capacités de lecture graphique", description: "Limites de résolution, formats supportés, cas d'usage UI/UX." },
  { category: "modeles", slug: "contexte-200k", title: "Fenêtre de contexte : 200K, 1M et compaction", description: "Gérer un contexte long, structurer le prompt, lost in the middle, auto-compaction." },
  { category: "modeles", slug: "pricing-tokens", title: "Tarification & optimisation des coûts", description: "Facturation par tokens, ordres de grandeur par modèle, et leviers cumulables (Batch, caching)." },
  { category: "modeles", slug: "choisir-bon-modele", title: "Choisir le bon modèle", description: "Décisionnel : Opus vs Sonnet vs Haiku selon ton cas." },
  { category: "modeles", slug: "limites-quotas", title: "Limites et quotas", description: "Rate limits, quotas par tier, comment monter en tier." },
  { category: "modeles", slug: "evolution-claude", title: "L'évolution des modèles Claude", description: "Chronologie de Claude 3 à Claude 5.5, et quels modèles sont encore disponibles." },
  { category: "modeles", slug: "benchmark-interne", title: "Benchmarks internes & évaluation de performance", description: "Lire et reproduire MMLU, HumanEval, SWE-bench sur tes propres cas." },
  { category: "modeles", slug: "model-drift", title: "Model Drift et mises à jour silencieuses", description: "Détecter et gérer les changements de comportement (claude-X-latest)." },

  // ═══ CLI CLAUDE CODE ═════════════════════════════════════════════
  { category: "cli", slug: "architecture-interne", title: "Architecture interne du CLI", description: "Comment Claude Code fonctionne sous le capot." },
  { category: "cli", slug: "settings-json", title: "Le fichier settings.json", description: "Les 5 niveaux de settings.json, fusion, bloc permissions, champ env et sélection de modèle." },
  { category: "cli", slug: "sessions-reprise", title: "Sessions et reprise", description: "Comment Claude Code gère l'état entre les sessions." },
  { category: "cli", slug: "variables-env", title: "Les variables d'environnement", description: "Modèle, désactivation de comportements, proxy d'entreprise, OpenTelemetry et ordre de lecture." },
  { category: "cli", slug: "continue-checkpoints", title: "--continue et checkpoints", description: "Reprendre une session interrompue, restaurer un checkpoint." },
  { category: "cli", slug: "clear-resume-cost", title: "/clear, /resume, /cost", description: "Commandes de gestion de session essentielles." },
  { category: "cli", slug: "permissions-modes", title: "Les modes de permission", description: "Les 6 modes, auto par défaut depuis août 2026, et lequel choisir selon le contexte." },
  { category: "cli", slug: "output-styles", title: "Output styles", description: "Personnaliser le format de sortie de Claude." },
  { category: "cli", slug: "status-line-custom", title: "Status line custom", description: "Configurer une status line personnalisée via hook." },
  { category: "cli", slug: "headless-mode", title: "Mode headless (claude -p)", description: "Exécuter Claude Code sans interface interactive, parfait pour CI." },
  { category: "cli", slug: "pipes-automation", title: "Pipes et automation", description: "Chaîner Claude Code avec d'autres outils en CLI." },
  { category: "cli", slug: "update-versions", title: "Mise à jour et versions", description: "Upgrader, downgrader, gérer plusieurs versions." },
  { category: "cli", slug: "memoire-oubli-selectif", title: "Gestion fine de la mémoire", description: "Forcer le CLI à oublier certaines parties d'une session longue." },
  { category: "cli", slug: "cicd-execution", title: "Mode non-interactif et CI/CD", description: "Automatiser des refactors via GitHub Actions, GitLab CI." },
  { category: "cli", slug: "multi-projet-context-switching", title: "Multi-projet et context switching", description: "Comment le CLI gère le passage entre repos Git." },
  { category: "cli", slug: "themes-accessibilite", title: "Thèmes et accessibilité", description: "Couleurs, contraste, mode compact, lecteurs d'écran." },
  { category: "cli", slug: "dynamic-workflows-agents-arriere-plan", title: "Dynamic workflows : des dizaines d'agents", description: "Ultracode, /deep-research, suivre un run avec /workflows, sauvegarder, reprendre, limites et coût." },
  { category: "cli", slug: "effort-fast-advisor", title: "Effort, fast mode et advisor", description: "Régler la puissance de Claude : niveaux d'effort jusqu'à ultracode, fast mode d'Opus, advisor." },
  { category: "cli", slug: "agent-view-sessions", title: "Agent view : sessions en parallèle", description: "Lancer des sessions avec claude --bg, les suivre et leur répondre depuis claude agents." },
  { category: "cli", slug: "cloud-routines-remote", title: "Cloud, routines et Remote Control", description: "Suivre une session depuis son téléphone, lancer Claude dans le cloud, programmer des routines." },
  { category: "cli", slug: "goal-loop-monitor", title: "/goal, /loop et Monitor", description: "Faire travailler Claude jusqu'à une condition, à intervalle régulier, ou en réaction à une sortie." },
  { category: "cli", slug: "artifacts", title: "Artifacts : publier une page", description: "Transformer le travail d'une session en page interactive partageable sur claude.ai." },

  // ═══ OUTILS INTÉGRÉS ═════════════════════════════════════════════
  { category: "outils", slug: "read", title: "L'outil Read", description: "Lire des fichiers, images, PDF, notebooks — toutes les options." },
  { category: "outils", slug: "write", title: "L'outil Write", description: "Créer ou écraser un fichier — règles et best practices." },
  { category: "outils", slug: "edit", title: "L'outil Edit", description: "Modifier un fichier existant via remplacement exact." },
  { category: "outils", slug: "notebook-edit", title: "NotebookEdit en profondeur", description: "Manipuler des notebooks Jupyter, différences avec Edit." },
  { category: "outils", slug: "bash", title: "L'outil Bash", description: "Exécuter des commandes shell — sandbox, timeouts, sécurité." },
  { category: "outils", slug: "glob", title: "L'outil Glob", description: "Trouver des fichiers par pattern — syntaxe et cas d'usage." },
  { category: "outils", slug: "grep", title: "L'outil Grep", description: "Rechercher dans le contenu — regex, multiline, contextes." },
  { category: "outils", slug: "web-fetch", title: "L'outil WebFetch", description: "Récupérer une URL, contournement anti-bots, rendu JS." },
  { category: "outils", slug: "web-search", title: "L'outil WebSearch", description: "Recherche web en temps réel via Anthropic." },
  { category: "outils", slug: "task-subagents", title: "L'outil Task (subagents)", description: "Déléguer à un subagent spécialisé." },
  { category: "outils", slug: "todo-write", title: "L'outil TodoWrite", description: "Gérer une liste de tâches pendant une session." },
  { category: "outils", slug: "exit-plan-mode", title: "ExitPlanMode", description: "Le mode planification et sa sortie." },
  { category: "outils", slug: "output-management", title: "Output management", description: "Comment Claude gère et tronque les outputs longs." },
  { category: "outils", slug: "tool-use-patterns", title: "Tool use patterns", description: "Patterns récurrents — parallélisation, chaînage, branching." },
  { category: "outils", slug: "combiner-outils", title: "Combiner les outils efficacement", description: "Workflows multi-outils pour des tâches complexes." },
  { category: "outils", slug: "merge-conflicts-handling", title: "Gestion des conflits d'édition", description: "Comment Claude résout les modifications concurrentes." },

  // ═══ SLASH COMMANDS ══════════════════════════════════════════════
  { category: "slash-commands", slug: "help-clear-resume", title: "/help, /clear, /resume", description: "Les commandes de base pour naviguer une session." },
  { category: "slash-commands", slug: "init-review-security", title: "/init, /review, /security-review", description: "Commandes de bootstrap et de review automatique." },
  { category: "slash-commands", slug: "cost-compact", title: "/cost et /compact", description: "Suivre le coût et compacter le contexte." },
  { category: "slash-commands", slug: "creer-slash-command", title: "Créer une slash command custom", description: "Structure, frontmatter, déploiement." },
  { category: "slash-commands", slug: "arguments-namespacing", title: "Arguments et namespacing", description: "Passer des arguments, organiser ses commandes en namespaces." },
  { category: "slash-commands", slug: "mcp-permissions", title: "/mcp et /permissions", description: "Gérer MCP et les permissions à la volée." },
  { category: "slash-commands", slug: "slash-dans-hooks", title: "Slash commands dans les hooks", description: "Déclencher des commandes depuis un hook." },
  { category: "slash-commands", slug: "markdown-frontmatter", title: "Markdown frontmatter dans les commandes", description: "Les champs supportés et leur effet." },
  { category: "slash-commands", slug: "bash-injection-securisee", title: "Bash injection sécurisée", description: "Comment Claude protège contre l'injection dans les commandes." },
  { category: "slash-commands", slug: "skills-vs-slash", title: "Skills vs slash commands", description: "Quand utiliser un skill plutôt qu'une commande." },
  { category: "slash-commands", slug: "arguments-complexes", title: "Slash commands avec arguments complexes", description: "Parser regex, chemins, flags personnalisés." },
  { category: "slash-commands", slug: "config-modifications-chaud", title: "/config et modifications à chaud", description: "Modifier les variables internes du CLI en pleine session." },
  { category: "slash-commands", slug: "partage-equipe", title: "Partage et centralisation en équipe", description: "Versionner les slash commands dans un repo d'entreprise." },

  // ═══ HOOKS ═══════════════════════════════════════════════════════
  { category: "hooks", slug: "introduction-hooks", title: "Qu'est-ce qu'un hook ?", description: "Concept, cas d'usage, philosophie." },
  { category: "hooks", slug: "pre-post-tool-use", title: "PreToolUse / PostToolUse", description: "Intercepter avant ou après chaque appel d'outil." },
  { category: "hooks", slug: "session-start-stop", title: "SessionStart / Stop", description: "Hooks de cycle de vie de la session." },
  { category: "hooks", slug: "user-prompt-submit", title: "UserPromptSubmit", description: "Modifier ou rejeter un prompt avant traitement." },
  { category: "hooks", slug: "notification", title: "Notification hook", description: "Notifications custom (terminal, OS, Slack)." },
  { category: "hooks", slug: "pre-compact", title: "PreCompact", description: "Hook déclenché avant la compaction de contexte." },
  { category: "hooks", slug: "hook-lifecycle", title: "Hook lifecycle", description: "Ordre exact d'exécution des hooks." },
  { category: "hooks", slug: "securite-rce", title: "Sécurité : éviter le RCE", description: "Risques et bonnes pratiques pour éviter l'injection." },
  { category: "hooks", slug: "performance", title: "Hooks et performance", description: "Comment des hooks lents ralentissent une session." },
  { category: "hooks", slug: "environnement", title: "Hooks et environnement", description: "Variables disponibles dans un hook, contexte d'exécution." },
  { category: "hooks", slug: "exemples-pratiques", title: "Exemples pratiques : auto-format, anti-secrets, audit log", description: "Recettes prêtes à copier-coller." },
  { category: "hooks", slug: "debugging-hooks", title: "Debugging hooks", description: "Diagnostiquer un hook qui ne se déclenche pas." },
  { category: "hooks", slug: "erreurs-stopfailure", title: "Réagir aux erreurs : StopFailure et PostToolUseFailure", description: "Les hooks officiels pour être prévenu d'une erreur d'API ou d'un outil qui échoue." },
  { category: "hooks", slug: "observabilite-otel", title: "Hooks pour l'observabilité", description: "Envoyer traces vers OpenTelemetry, Langfuse, Phoenix." },
  { category: "hooks", slug: "chainage-hooks", title: "Chaînage de hooks (pipeline)", description: "Ordre d'exécution quand plusieurs scripts écoutent le même event." },

  // ═══ SKILLS ══════════════════════════════════════════════════════
  { category: "skills", slug: "skill-vs-agent-vs-mcp", title: "Skill vs agent vs MCP", description: "Différences entre les 3 mécanismes d'extension." },
  { category: "skills", slug: "structure-skill", title: "Structure d'un skill", description: "Anatomie d'un skill : fichiers, dépendances, manifeste." },
  { category: "skills", slug: "skill-md-frontmatter", title: "SKILL.md frontmatter", description: "Tous les champs frontmatter et leur effet." },
  { category: "skills", slug: "installer-skill", title: "Installer un skill", description: "npx claude-mem add, install manuelle, depuis Git." },
  { category: "skills", slug: "publier-skill", title: "Publier un skill", description: "npm publish, organisation, versioning." },
  { category: "skills", slug: "skills-officiels", title: "Skills officiels Anthropic", description: "Tour d'horizon des skills maintenus par Anthropic." },
  { category: "skills", slug: "skills-tiers", title: "Skills tiers populaires", description: "Les meilleurs skills créés par la communauté." },
  { category: "skills", slug: "tester-skill", title: "Tester un skill localement", description: "Workflow de dev pour itérer rapidement." },
  { category: "skills", slug: "versioning", title: "Versioning des skills", description: "SemVer, breaking changes, migration." },
  { category: "skills", slug: "composer-skills", title: "Composer plusieurs skills", description: "Faire collaborer plusieurs skills dans une session." },
  { category: "skills", slug: "cycle-de-vie", title: "Cycle de vie d'un Skill", description: "Activation, exécution, destruction — gestion mémoire et ressources." },
  { category: "skills", slug: "secrets-skills", title: "Sécurisation des secrets dans les skills", description: "Injection propre de tokens API tiers (Slack, Jira, etc.)." },
  { category: "skills", slug: "doc-generation", title: "Génération auto de doc de skills", description: "Générer SKILL.md à partir de commentaires TSDoc/JSDoc." },

  // ═══ SUBAGENTS ═══════════════════════════════════════════════════
  { category: "subagents", slug: "pourquoi-subagents", title: "Pourquoi des subagents ?", description: "Cas d'usage, bénéfices, anti-patterns." },
  { category: "subagents", slug: "types-fournis", title: "Types fournis (Explore, Plan, code-reviewer)", description: "Inventaire des subagents disponibles par défaut." },
  { category: "subagents", slug: "creer-subagent-custom", title: "Créer des subagents personnalisés", description: "Fichier Markdown + YAML (name, description, tools, model), agents intégrés, résolution du modèle et coût." },
  { category: "subagents", slug: "frontmatter-agent", title: "Frontmatter agent", description: "Champs name, description, tools, model, etc." },
  { category: "subagents", slug: "quand-deleguer", title: "Quand déléguer à un subagent ?", description: "Heuristiques pour décider." },
  { category: "subagents", slug: "parallelisation", title: "Parallélisation", description: "Lancer plusieurs subagents en parallèle." },
  { category: "subagents", slug: "cout-token-budgeting", title: "Coût et token budgeting", description: "Combien coûte un subagent, comment budgeter." },
  { category: "subagents", slug: "erreurs-courantes", title: "Erreurs courantes", description: "Les pièges les plus fréquents." },
  { category: "subagents", slug: "sous-traitance-recursive", title: "Sous-traitance récursive : agents créés par agents", description: "Limites, boucles infinies, arbres de dépendances." },
  { category: "subagents", slug: "code-reviewer-isolation", title: "Le subagent code-reviewer en isolation", description: "Audit d'une PR avant validation humaine." },
  { category: "subagents", slug: "state-sharing", title: "Partage d'état entre agents", description: "Transmettre résultats et fichiers temporaires." },

  // ═══ MCP ═════════════════════════════════════════════════════════
  { category: "mcp", slug: "introduction-mcp", title: "Qu'est-ce que MCP ?", description: "Le Model Context Protocol expliqué." },
  { category: "mcp", slug: "architecture-client-serveur", title: "Architecture client/serveur", description: "Comment client et serveur MCP communiquent." },
  { category: "mcp", slug: "installer-serveur-mcp", title: "Installer un serveur MCP", description: "Configurer un serveur MCP dans Claude Code." },
  { category: "mcp", slug: "serveurs-officiels", title: "Serveurs officiels (Filesystem, Git, Postgres)", description: "Les serveurs maintenus par Anthropic." },
  { category: "mcp", slug: "serveurs-populaires", title: "Serveurs populaires (Supabase, Vercel, Linear)", description: "Les serveurs tiers à connaître." },
  { category: "mcp", slug: "creer-serveur-ts-setup", title: "Créer un serveur MCP TypeScript : setup & primitives", description: "Initialiser un serveur, exposer outils/resources/prompts." },
  { category: "mcp", slug: "creer-serveur-ts-deploiement", title: "Créer un serveur MCP TypeScript : déploiement & distribution", description: "NPM, Docker, exécutable — variables d'env distantes." },
  { category: "mcp", slug: "creer-serveur-py-setup", title: "Créer un serveur MCP Python : setup & primitives", description: "Démarrer un serveur en Python." },
  { category: "mcp", slug: "creer-serveur-py-deploiement", title: "Créer un serveur MCP Python : déploiement & distribution", description: "PyPI, Docker, packaging." },
  { category: "mcp", slug: "securite-mcp", title: "Sécurité des serveurs MCP", description: "Risques d'un serveur MCP malveillant, bonnes pratiques." },
  { category: "mcp", slug: "limites-protocole", title: "Limites du protocole", description: "Ce que MCP ne sait pas (encore) faire." },
  { category: "mcp", slug: "debugging-inspector", title: "Debugging avec mcp inspector", description: "L'outil officiel pour inspecter un serveur." },
  { category: "mcp", slug: "json-rpc-mapping", title: "JSON-RPC 2.0 sous le capot", description: "Spécifications réseau du protocole MCP." },
  { category: "mcp", slug: "primitives-resources-tools-prompts", title: "Resources, Tools, Prompts — les primitives MCP", description: "Différences et quand utiliser l'une plutôt que l'autre." },
  { category: "mcp", slug: "transports-stdio-sse", title: "Transports MCP : Stdio vs SSE", description: "Choisir le bon mode selon local vs distant." },
  { category: "mcp", slug: "serveur-memory", title: "Le serveur MCP Memory (Knowledge Graph)", description: "Construire un graphe de connaissances persistant pour Claude." },
  { category: "mcp", slug: "routing-aggregation", title: "Routing et agrégation de serveurs MCP", description: "Proxys MCP pour exposer plusieurs serveurs via un point d'entrée." },
  { category: "mcp", slug: "evolution-2026-apps-elicitation", title: "MCP en 2026 : Apps, élicitation, sampling & Streamable HTTP", description: "Don à l'Agentic AI Foundation, MCP Apps (UI interactives), élicitation, sampling et transport sans état." },

  // ═══ PROMPT ENGINEERING ══════════════════════════════════════════
  { category: "prompt-engineering", slug: "anatomie-prompt", title: "Anatomie d'un prompt", description: "Les composants d'un prompt efficace." },
  { category: "prompt-engineering", slug: "balises-xml", title: "Balises XML pour structurer", description: "Pourquoi et comment Claude excelle avec XML." },
  { category: "prompt-engineering", slug: "system-vs-user", title: "System prompt vs user prompt", description: "Différences, bonnes pratiques, exemples." },
  { category: "prompt-engineering", slug: "few-shot", title: "Few-shot prompting", description: "Fournir des exemples pour guider la réponse." },
  { category: "prompt-engineering", slug: "chain-of-thought", title: "Chain of Thought", description: "Forcer Claude à raisonner étape par étape." },
  { category: "prompt-engineering", slug: "role-prompting", title: "Role prompting", description: "Donner un rôle à Claude pour orienter sa réponse." },
  { category: "prompt-engineering", slug: "output-format", title: "Output formatting (JSON, Markdown)", description: "Obtenir un format de sortie strict." },
  { category: "prompt-engineering", slug: "contexte-long", title: "Gérer le contexte long", description: "Stratégies pour les contextes de 100K+ tokens." },
  { category: "prompt-engineering", slug: "prompt-caching-concepts", title: "Prompt Caching : concepts et stratégies", description: "Design de prompt pour maximiser le cache hit." },
  { category: "prompt-engineering", slug: "iterer-prompt", title: "Itérer sur un prompt", description: "Méthodologie pour améliorer un prompt." },
  { category: "prompt-engineering", slug: "tester-prompt", title: "Tester un prompt", description: "Évaluation systématique, regression testing." },
  { category: "prompt-engineering", slug: "anti-patterns", title: "Anti-patterns prompt engineering", description: "Ce qu'il ne faut PAS faire." },
  { category: "prompt-engineering", slug: "prefilling", title: "Prefilling (pré-remplissage de la réponse)", description: "Dicter les premiers mots de la réponse pour forcer un format." },
  { category: "prompt-engineering", slug: "meta-prompting", title: "Meta-Prompting avec Claude", description: "Utiliser Claude pour écrire de meilleurs prompts pour Claude." },
  { category: "prompt-engineering", slug: "lost-in-the-middle", title: "Lost in the Middle", description: "Structurer un document de 150K tokens pour éviter l'oubli central." },
  { category: "prompt-engineering", slug: "prompting-sonnet-5", title: "Prompter les modèles 2026 (Opus 4.6+ / Sonnet 5)", description: "Fin du sur-prompting, positivité prescriptive, prompt matching, contrôle par effort et résolution des échecs." },

  // ═══ API ANTHROPIC ═══════════════════════════════════════════════
  { category: "api", slug: "premier-appel-api", title: "Premier appel API", description: "Hello world avec l'API Anthropic." },
  { category: "api", slug: "sdk-python", title: "SDK Python", description: "anthropic-sdk-python : install, usage, options." },
  { category: "api", slug: "sdk-typescript", title: "SDK TypeScript", description: "@anthropic-ai/sdk : install, usage, options." },
  { category: "api", slug: "streaming", title: "Streaming", description: "Recevoir une réponse token par token." },
  { category: "api", slug: "tool-use", title: "Tool use (function calling)", description: "Définir des outils que Claude peut appeler." },
  { category: "api", slug: "vision-integration", title: "Intégration de la Vision API", description: "Encodage base64, payloads multi-modaux." },
  { category: "api", slug: "batch-api", title: "L'API Batch (Message Batches)", description: "Traiter de gros volumes à -50 % : custom_id, limites 100k/256 Mo/29 j, et combinaison avec le caching." },
  { category: "api", slug: "prompt-caching-implementation", title: "Le prompt caching (API)", description: "Multiplicateurs de prix, préfixe minimal par modèle, vérification des hits et invalidateurs silencieux." },
  { category: "api", slug: "citations-api", title: "Citations API pour RAG", description: "Forcer et récupérer les pointeurs vers les sources." },
  { category: "api", slug: "files-api", title: "Files API", description: "Uploader des fichiers réutilisables côté Anthropic." },
  { category: "api", slug: "best-practices-production", title: "Best practices production", description: "Retries, observability, fallbacks." },
  { category: "api", slug: "rate-limit-headers", title: "Gestion fine du Rate Limiting", description: "Parser anthropic-ratelimit-* pour adapter dynamiquement." },
  { category: "api", slug: "metadata-user-id", title: "Métadonnées (metadata.user_id)", description: "Tracking et isolation des requêtes par utilisateur final." },
  { category: "api", slug: "ttft-tuning", title: "Time-To-First-Token (TTFT) tuning", description: "Optimiser pour que Claude commence à répondre vite." },
  { category: "api", slug: "token-budgeting", title: "Token budgeting et dépassement de contexte", description: "Sliding window, résumé dynamique pour agents long-running." },
  { category: "api", slug: "evals-automatisees", title: "Évaluations (Evals) automatisées", description: "promptfoo, framework Anthropic — valider sans régression." },

  // ═══ WORKFLOWS & SÉCURITÉ ════════════════════════════════════════
  { category: "workflows", slug: "code-review-auto", title: "Code review automatisé", description: "Workflow pour auditer chaque PR avec Claude." },
  { category: "workflows", slug: "refactor-grande-echelle", title: "Refactor à grande échelle", description: "Renommer/restructurer des centaines de fichiers." },
  { category: "workflows", slug: "debug-avec-claude", title: "Debug avec Claude", description: "Approche systématique pour résoudre des bugs." },
  { category: "workflows", slug: "generation-tests", title: "Génération de tests", description: "Faire écrire des tests à Claude (unit, integration, e2e)." },
  { category: "workflows", slug: "migration-stack", title: "Migration de stack", description: "Faire migrer un codebase d'un framework à un autre." },
  { category: "workflows", slug: "onboarding-dev", title: "Onboarding nouveau dev", description: "Utiliser Claude pour accélérer l'arrivée d'un nouveau." },
  { category: "workflows", slug: "secrets-env", title: "Secrets et .env", description: "Empêcher Claude de leaker tes secrets." },
  { category: "workflows", slug: "prompt-injection", title: "Prompt injection", description: "Comprendre et se protéger des attaques par injection." },
  { category: "workflows", slug: "donnees-sensibles", title: "Données sensibles", description: "Travailler avec des données confidentielles." },
  { category: "workflows", slug: "audit-trail", title: "Audit trail", description: "Tracer toutes les actions de Claude pour compliance." },
  { category: "workflows", slug: "migration-db", title: "Migration de bases de données automatisée", description: "Schéma SQL → migration Prisma/Liquibase + rollback." },
  { category: "workflows", slug: "doc-vivante", title: "Documentation technique vivante", description: "Boucle code → MkDocs/Mermaid à chaque commit." },
  { category: "workflows", slug: "faux-positifs-audit", title: "Faux positifs en audit de sécurité", description: "Calibrer /security-review pour éviter le bruit." },

  // ═══ CLAUDE.AI WEB ═══════════════════════════════════════════════
  { category: "claude-ai", slug: "projects-creation", title: "Les projets : un espace par sujet", description: "Créer un projet, écrire de bonnes instructions, y ranger ses documents." },
  { category: "claude-ai", slug: "projects-knowledge-base", title: "Bien nourrir un projet", description: "Quels documents ajouter, comment Claude les consulte, des réponses fidèles à vos sources." },
  { category: "claude-ai", slug: "memoire", title: "La mémoire de Claude", description: "Topics, mémoire par projet, recherche dans l'historique, sujets sensibles, contrôle." },
  { category: "claude-ai", slug: "recherche", title: "Recherche web et mode Research", description: "Des réponses à jour et sourcées, et des rapports documentés en quelques minutes." },
  { category: "claude-ai", slug: "docs-slides-design", title: "Fichiers, Docs, Slides et Design", description: "Envoyer des fichiers, créer des Excel, Word, PowerPoint, PDF, et les nouveaux éditeurs." },
  { category: "claude-ai", slug: "artifacts-architecture", title: "Artifacts : mini-applications et graphiques", description: "Simulateurs, quiz, tableaux de bord et pages interactives à créer et partager." },
  { category: "claude-ai", slug: "integrations-natives", title: "Les connecteurs", description: "Relier Claude à Gmail, Agenda, Drive, Microsoft 365, Notion et vos outils." },
  { category: "claude-ai", slug: "skills-claude", title: "Les skills dans Claude", description: "Enregistrer une méthode de travail que Claude applique tout seul." },
  { category: "claude-ai", slug: "app-mobile", title: "L'application mobile", description: "Mode vocal, appareil photo, widgets, raccourcis et suivi des tâches." },
  { category: "claude-ai", slug: "application-bureau", title: "L'application de bureau", description: "Accès rapide au clavier, dictée, captures, Cowork et Claude Code." },
  { category: "claude-ai", slug: "shared-chats", title: "Partager une conversation", description: "Ce que contient un lien partagé et ce qu'il faut vérifier avant." },

  // ═══ ENTERPRISE ══════════════════════════════════════════════════
  { category: "enterprise", slug: "data-privacy", title: "Politique de confidentialité des données", description: "Non-utilisation des données API/Enterprise pour l'entraînement." },
  { category: "enterprise", slug: "aws-bedrock", title: "Déployer Claude sur AWS Bedrock", description: "IAM, débit provisionné, appels API." },
  { category: "enterprise", slug: "gcp-vertex", title: "Déployer Claude sur Google Cloud Vertex AI", description: "Authentification GCP, chiffrement CMEK, SDKs Vertex." },
  { category: "enterprise", slug: "resilience-multi-cloud", title: "Résilience multi-cloud", description: "Fallback Anthropic ↔ AWS ↔ GCP pour 99.99% uptime." },
  { category: "enterprise", slug: "sovereign-hosting", title: "Sovereign hosting & résidence des données", description: "EU Data Boundary, RGPD, HIPAA, SOC 2 Type II." },
  { category: "enterprise", slug: "content-safety", title: "Filtres de modération et Content Safety", description: "Guardrails Anthropic pour contenus toxiques/illégaux." },
  { category: "enterprise", slug: "prompt-injection-enterprise", title: "Détection des prompt injections (Enterprise)", description: "LLM-as-a-Judge en amont et en aval des appels." },
  { category: "enterprise", slug: "api-gateways", title: "Gestion des clés API et API Gateways", description: "Proxys (Kong, Cloudflare, LiteLLM) — rotation, cache, rate-limit." },
  { category: "enterprise", slug: "threat-modeling-agents", title: "Threat modeling pour agents autonomes", description: "Risques d'exécution autonome de code dans un réseau d'entreprise." },
  { category: "enterprise", slug: "clouds", title: "Claude sur Bedrock, Vertex & Foundry", description: "Déployer via Bedrock, Vertex AI et Foundry : prérequis, réglages gérés, IDs de modèles et limites." },
  { category: "enterprise", slug: "vercel-plugin-ai-sdk", title: "Claude Code × Vercel : plugin, AI SDK & Gateway", description: "Le plugin Vercel pour agents (47+ skills, validation PostToolUse), l'AI SDK 7 avec HarnessAgent en sandbox, et le routage via AI Gateway." },

  // ═══ OBSIDIAN + CLAUDE ═══════════════════════════════════════════
  // ═══ PLUGINS ═════════════════════════════════════════════════════
  { category: "plugins", slug: "introduction-plugins", title: "Les plugins : installer et gérer", description: "Ce qu'un plugin contient, les marketplaces, les portées, et ce qu'il coûte en contexte." },
  { category: "plugins", slug: "creer-plugin", title: "Créer et publier un plugin", description: "Du dossier vide à la marketplace : manifeste, test avec --plugin-dir, validation, evals." },
  { category: "plugins", slug: "mods", title: "Les mods", description: "Des plugins en JavaScript qui dessinent dans l'interface et interceptent les appels d'outils." },
  // ═══ BIEN DÉMARRER AVEC CLAUDE ═══════════════════════════════════
  { category: "claude-bases", slug: "premiers-pas", title: "Premiers pas avec Claude", description: "Où l'utiliser, l'interface « One Claude », une première conversation utile." },
  { category: "claude-bases", slug: "offres-et-limites", title: "Offres et limites d'usage", description: "Free, Pro, Max, Team, Enterprise, et comment fonctionnent les limites de 5 heures et hebdomadaires." },
  { category: "claude-bases", slug: "choisir-modele", title: "Choisir son modèle", description: "Opus, Sonnet, Haiku, Fable : lequel choisir et quand demander plus de réflexion." },
  { category: "claude-bases", slug: "bien-demander", title: "Bien formuler ses demandes", description: "Contexte, objectif, contraintes, format : la méthode et des modèles à copier." },
  { category: "claude-bases", slug: "personnaliser", title: "Personnaliser Claude", description: "Préférences de profil, styles et instructions de projet." },
  { category: "claude-bases", slug: "confidentialite", title: "Confidentialité et données", description: "Entraînement, conservation, incognito, export, suppression, ce qu'il ne faut pas envoyer." },
  { category: "claude-bases", slug: "verifier-reponses", title: "Vérifier les réponses", description: "Quand Claude se trompe, et une méthode simple pour vérifier ce qui compte." },
  { category: "claude-bases", slug: "erreurs-debutant", title: "Les 12 erreurs de débutant", description: "Demandes vagues, conversations sans fin, confiance aveugle : les pièges et les bons réflexes." },
  { category: "claude-bases", slug: "glossaire", title: "Le glossaire de l'IA et de Claude", description: "Token, contexte, agent, MCP, skill, hook, worktree : 50 mots expliqués simplement." },
  // ═══ CLAUDE QUI AGIT ══════════════════════════════════════════════
  { category: "claude-agents", slug: "cowork", title: "Cowork : Claude qui travaille dans vos fichiers", description: "Dossiers, applications, navigateur intégré, tâches en plusieurs étapes." },
  { category: "claude-agents", slug: "dispatch-taches", title: "Dispatch et tâches programmées", description: "Confier une tâche depuis le téléphone et programmer du travail récurrent." },
  { category: "claude-agents", slug: "claude-chrome", title: "Claude dans Chrome", description: "L'extension qui lit, clique et remplit des formulaires pour vous, et ses règles de sécurité." },
  { category: "claude-agents", slug: "claude-microsoft-365", title: "Claude dans Excel, Word, PowerPoint et Outlook", description: "Les compléments Microsoft 365 et le contexte partagé entre fichiers." },
  // ═══ CAS D'USAGE ══════════════════════════════════════════════════
  { category: "cas-usage", slug: "etudiants", title: "Pour les études", description: "Comprendre, réviser, préparer un examen ou un mémoire sans tricher." },
  { category: "cas-usage", slug: "rediger", title: "Rédiger", description: "E-mails, courriers, CV, lettres de motivation, publications, textes longs." },
  { category: "cas-usage", slug: "analyser-donnees", title: "Analyser des données", description: "Tableurs, budgets, graphiques et tableaux de bord sans formules." },
  { category: "cas-usage", slug: "entrepreneurs", title: "Entreprendre", description: "De l'idée au marketing : étude de marché, prévisionnel, communication, gestion." },
  { category: "cas-usage", slug: "vie-quotidienne", title: "Au quotidien", description: "Démarches, budget, repas, voyages, santé, maison." },
  { category: "obsidian", slug: "guide-complet", title: "Obsidian + Claude : le guide complet", description: "Connecter ton vault Obsidian à Claude — approche directe (fichiers) et approche MCP, cas d'usage, sécurité." },
  { category: "obsidian", slug: "serveurs-mcp", title: "Serveurs MCP Obsidian : installation & config", description: "Local REST API, mcp-obsidian, obsidian-claude-code-mcp — configuration Claude Desktop & Claude Code, dépannage." },

  // ═══ ACTUALITÉS & RESSOURCES ═════════════════════════════════════
  { category: "actualites", slug: "nouveautes-claude-2026", title: "Nouveautés de Claude (2026)", description: "Le journal mois par mois de l'assistant : One Claude, Docs, Cowork, mémoire, Chrome, Office." },
  { category: "actualites", slug: "nouveautes-2026", title: "Nouveautés Claude Code (2026)", description: "Le journal mois par mois de l'outil des développeurs : modèles, auto mode, agent view, workflows, plugins, mods." },
  { category: "actualites", slug: "claude-tag-slack", title: "Claude Tag — l'IA ambiante dans Slack", description: "Le coéquipier IA persistant d'Anthropic et Salesforce : mémoire de canal, mode multi-joueurs et défis de gouvernance." },
  { category: "actualites", slug: "claude-science", title: "Claude Science — l'atelier IA pour chercheurs", description: "60+ compétences en génomique/chémoinformatique, intégration BioNeMo de NVIDIA et calcul distribué via Modal." },
  { category: "actualites", slug: "backdoor-chine-distillation", title: "Le « backdoor » chinois : traçage & distillation", description: "L'alerte NVDB de juillet 2026, la réalité du mécanisme anti-distillation, et le conflit Anthropic / Alibaba." },
  { category: "actualites", slug: "auto-amelioration-recursive", title: "L'auto-amélioration récursive de Claude", description: "Claude écrit 80 % du code d'Anthropic, et l'expérience d'optimisation passée de 3× à 52× en moins d'un an." },
  { category: "actualites", slug: "sources-ressources", title: "Sources & ressources externes", description: "Liens officiels Anthropic, MCP, Obsidian, changelogs — la base de données externe du wiki." },
];

// ─── Helpers ─────────────────────────────────────────────────────────

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function stubsByCategory(id: CategoryId): ArticleStub[] {
  return ARTICLE_STUBS.filter((a) => a.category === id);
}

export function categoriesBySection(section: SectionId): Category[] {
  return CATEGORIES.filter((c) => c.section === section);
}

export function articleCountBySection(section: SectionId): number {
  const ids = new Set(categoriesBySection(section).map((c) => c.id));
  return ARTICLE_STUBS.filter((a) => ids.has(a.category)).length;
}

export function articleCount(): number {
  return ARTICLE_STUBS.length;
}
