// ─── Wiki manifest ────────────────────────────────────────────────────
// Consolidated taxonomy. Source of truth for article slugs & categories.
// Articles themselves live as MDX files in content/wiki/<cat>/<slug>.mdx

export type CategoryId =
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

export type Category = {
  id: CategoryId;
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
    id: "demarrer",
    name: "Démarrer",
    icon: "terminal",
    description: "Installation, premiers pas, configuration de base.",
  },
  {
    id: "modeles",
    name: "Modèles Claude",
    icon: "sparkles",
    description: "Opus, Sonnet, Haiku — capacités, comparatifs, choix.",
  },
  {
    id: "cli",
    name: "CLI Claude Code",
    icon: "command",
    description: "Tout sur le CLI : sessions, settings, modes, automation.",
  },
  {
    id: "outils",
    name: "Outils intégrés",
    icon: "wrench",
    description: "Read, Write, Edit, Bash, Grep et compagnie — en détail.",
  },
  {
    id: "slash-commands",
    name: "Slash Commands",
    icon: "zap",
    description: "Commandes built-in et création de commandes custom.",
  },
  {
    id: "hooks",
    name: "Hooks",
    icon: "git",
    description: "Automatisation via PreToolUse, PostToolUse, SessionStart, etc.",
  },
  {
    id: "skills",
    name: "Skills (Agent SDK)",
    icon: "puzzle",
    description: "Système de skills réutilisables — créer, publier, composer.",
  },
  {
    id: "subagents",
    name: "Subagents",
    icon: "users",
    description: "Délégation à des agents spécialisés en parallèle.",
  },
  {
    id: "mcp",
    name: "MCP",
    icon: "plug",
    description: "Model Context Protocol — serveurs, clients, primitives.",
  },
  {
    id: "prompt-engineering",
    name: "Prompt Engineering",
    icon: "sparkles",
    description: "Techniques avancées pour formuler des requêtes efficaces.",
  },
  {
    id: "api",
    name: "API Anthropic",
    icon: "cloud",
    description: "Utiliser l'API directement — SDK, streaming, tools, caching.",
  },
  {
    id: "workflows",
    name: "Workflows & Sécurité",
    icon: "shield",
    description: "Workflows production, sécurité, bonnes pratiques.",
  },
  {
    id: "claude-ai",
    name: "Claude.ai (Web)",
    icon: "globe",
    description: "Interface web grand public — Projects, Artifacts, abonnements.",
  },
  {
    id: "enterprise",
    name: "Architecture & Enterprise",
    icon: "lock",
    description: "Déploiement, sécurité, conformité, multi-cloud.",
  },
  {
    id: "obsidian",
    name: "Obsidian + Claude",
    icon: "layers",
    description: "Connecter ton vault Obsidian à Claude — approche fichiers et MCP.",
  },
  {
    id: "actualites",
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
  { category: "demarrer", slug: "modes-interactif-one-shot", title: "Modes interactif vs one-shot", description: "Quand utiliser le mode interactif et quand préférer l'exécution one-shot." },
  { category: "demarrer", slug: "authentification", title: "Authentification et clés API", description: "Configurer son compte, gérer les clés API Anthropic." },
  { category: "demarrer", slug: "configurer-projet", title: "Configurer un projet pour Claude Code", description: "Préparer un repo pour tirer le meilleur de Claude Code." },
  { category: "demarrer", slug: "claude-md", title: "Le fichier CLAUDE.md", description: "Anatomie complète d'un CLAUDE.md efficace." },
  { category: "demarrer", slug: "permissions-sandbox", title: "Permissions et sandbox", description: "Comprendre le modèle de permissions et les modes sandbox." },
  { category: "demarrer", slug: "migration-cursor-copilot", title: "Migrer depuis Cursor ou Copilot", description: "Différences clés et stratégie de transition." },
  { category: "demarrer", slug: "ide-vscode-cursor-windsurf", title: "Configurer les IDE (VS Code, Cursor, Windsurf, Zed)", description: "Extensions officielles et tierces dans les éditeurs modernes." },
  { category: "demarrer", slug: "troubleshooting-installation", title: "Résolution des conflits d'installation", description: "Erreurs Node.js/NPM, conflits Python, pare-feu, permissions." },
  { category: "demarrer", slug: "config-globale", title: "Le fichier de config globale", description: "Anatomie de la config user en dehors de CLAUDE.md." },
  { category: "demarrer", slug: "anthropic-quickstarts", title: "Anthropic Quickstarts", description: "Architectures de référence officielles (AWS, GCP, Vercel templates)." },
  { category: "demarrer", slug: "meta-prompt-tool", title: "Le Meta-Prompt Tool d'Anthropic", description: "Outil officiel pour générer des prompts parfaits." },
  { category: "demarrer", slug: "migration-openai", title: "Migrer de GPT-4o à Claude Sonnet", description: "Correspondance des concepts pour passer d'OpenAI à Anthropic." },

  // ═══ MODÈLES CLAUDE ══════════════════════════════════════════════
  { category: "modeles", slug: "opus-4-7", title: "Claude Opus 4.7 — haute réflexion", description: "Le modèle premium d'Anthropic : capacités, benchmarks, cas d'usage." },
  { category: "modeles", slug: "sonnet-4-6", title: "Claude Sonnet 4.6 — standard industrie pour le code", description: "Le workhorse pour le développement : équilibre vitesse/qualité." },
  { category: "modeles", slug: "haiku-4-5", title: "Claude Haiku 4.5 — vitesse et coût", description: "Le modèle rapide pour les tâches simples et le grand volume." },
  { category: "modeles", slug: "comparatif-modeles", title: "Comparatif des modèles Claude", description: "Tableau récapitulatif Opus / Sonnet / Haiku — quand choisir lequel." },
  { category: "modeles", slug: "extended-thinking-mecanismes", title: "Extended Thinking : mécanismes et token budgeting", description: "Comment fonctionne le raisonnement étendu, facturation des tokens de réflexion." },
  { category: "modeles", slug: "extended-thinking-software", title: "Extended Thinking : impact sur l'ingénierie logicielle", description: "Pourquoi le thinking améliore la résolution de bugs complexes (SWE-bench)." },
  { category: "modeles", slug: "vision-capacites", title: "Claude Vision : capacités de lecture graphique", description: "Limites de résolution, formats supportés, cas d'usage UI/UX." },
  { category: "modeles", slug: "contexte-200k", title: "Contexte 200K tokens", description: "Gérer un contexte long, prompt structure, lost in the middle." },
  { category: "modeles", slug: "pricing-tokens", title: "Pricing et tokens", description: "Comment Anthropic facture, calcul du coût, optimisation." },
  { category: "modeles", slug: "choisir-bon-modele", title: "Choisir le bon modèle", description: "Décisionnel : Opus vs Sonnet vs Haiku selon ton cas." },
  { category: "modeles", slug: "limites-quotas", title: "Limites et quotas", description: "Rate limits, quotas par tier, comment monter en tier." },
  { category: "modeles", slug: "evolution-claude", title: "Claude 3 → 3.5 → 4 → 4.5 → 4.6 → 4.7", description: "Historique technique de l'évolution des modèles Anthropic." },
  { category: "modeles", slug: "benchmark-interne", title: "Benchmarks internes & évaluation de performance", description: "Lire et reproduire MMLU, HumanEval, SWE-bench sur tes propres cas." },
  { category: "modeles", slug: "model-drift", title: "Model Drift et mises à jour silencieuses", description: "Détecter et gérer les changements de comportement (claude-X-latest)." },

  // ═══ CLI CLAUDE CODE ═════════════════════════════════════════════
  { category: "cli", slug: "architecture-interne", title: "Architecture interne du CLI", description: "Comment Claude Code fonctionne sous le capot." },
  { category: "cli", slug: "settings-json", title: "settings.json en profondeur", description: "Toutes les options de configuration disponibles." },
  { category: "cli", slug: "sessions-reprise", title: "Sessions et reprise", description: "Comment Claude Code gère l'état entre les sessions." },
  { category: "cli", slug: "variables-env", title: "Variables d'environnement", description: "Toutes les env vars que Claude Code reconnaît." },
  { category: "cli", slug: "continue-checkpoints", title: "--continue et checkpoints", description: "Reprendre une session interrompue, restaurer un checkpoint." },
  { category: "cli", slug: "clear-resume-cost", title: "/clear, /resume, /cost", description: "Commandes de gestion de session essentielles." },
  { category: "cli", slug: "permissions-modes", title: "Modes de permissions", description: "ask, allow, deny — configurer finement les autorisations." },
  { category: "cli", slug: "output-styles", title: "Output styles", description: "Personnaliser le format de sortie de Claude." },
  { category: "cli", slug: "status-line-custom", title: "Status line custom", description: "Configurer une status line personnalisée via hook." },
  { category: "cli", slug: "headless-mode", title: "Mode headless (claude -p)", description: "Exécuter Claude Code sans interface interactive, parfait pour CI." },
  { category: "cli", slug: "pipes-automation", title: "Pipes et automation", description: "Chaîner Claude Code avec d'autres outils en CLI." },
  { category: "cli", slug: "update-versions", title: "Mise à jour et versions", description: "Upgrader, downgrader, gérer plusieurs versions." },
  { category: "cli", slug: "memoire-oubli-selectif", title: "Gestion fine de la mémoire", description: "Forcer le CLI à oublier certaines parties d'une session longue." },
  { category: "cli", slug: "cicd-execution", title: "Mode non-interactif et CI/CD", description: "Automatiser des refactors via GitHub Actions, GitLab CI." },
  { category: "cli", slug: "multi-projet-context-switching", title: "Multi-projet et context switching", description: "Comment le CLI gère le passage entre repos Git." },
  { category: "cli", slug: "themes-accessibilite", title: "Thèmes et accessibilité", description: "Couleurs, contraste, mode compact, lecteurs d'écran." },

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
  { category: "hooks", slug: "on-model-error", title: "Le hook OnModelError", description: "Intercepter rate limits, overloaded, timeouts pour retry/notify." },
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
  { category: "subagents", slug: "creer-subagent-custom", title: "Créer un subagent custom", description: "Définir frontmatter, prompt, outils autorisés." },
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
  { category: "mcp", slug: "serveur-puppeteer", title: "Le serveur MCP Puppeteer", description: "Automatisation web headless via Claude." },
  { category: "mcp", slug: "routing-aggregation", title: "Routing et agrégation de serveurs MCP", description: "Proxys MCP pour exposer plusieurs serveurs via un point d'entrée." },

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

  // ═══ API ANTHROPIC ═══════════════════════════════════════════════
  { category: "api", slug: "premier-appel-api", title: "Premier appel API", description: "Hello world avec l'API Anthropic." },
  { category: "api", slug: "sdk-python", title: "SDK Python", description: "anthropic-sdk-python : install, usage, options." },
  { category: "api", slug: "sdk-typescript", title: "SDK TypeScript", description: "@anthropic-ai/sdk : install, usage, options." },
  { category: "api", slug: "streaming", title: "Streaming", description: "Recevoir une réponse token par token." },
  { category: "api", slug: "tool-use", title: "Tool use (function calling)", description: "Définir des outils que Claude peut appeler." },
  { category: "api", slug: "vision-integration", title: "Intégration de la Vision API", description: "Encodage base64, payloads multi-modaux." },
  { category: "api", slug: "batch-api", title: "Batch API", description: "Traiter des milliers de requêtes en async (50% off)." },
  { category: "api", slug: "prompt-caching-implementation", title: "Implémentation technique du Prompt Caching", description: "En-têtes HTTP, TTL, gestion financière." },
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
  { category: "claude-ai", slug: "pro-team-enterprise", title: "Claude Pro vs Team vs Enterprise", description: "Plans, SLA, SSO, gouvernance, pricing." },
  { category: "claude-ai", slug: "artifacts-architecture", title: "Les Artifacts : fonctionnement et architecture", description: "Génération, rendu live (React, HTML, SVG), sandboxing." },
  { category: "claude-ai", slug: "projects-creation", title: "Création et optimisation de Projects", description: "Bases de connaissances, custom instructions, fichiers." },
  { category: "claude-ai", slug: "projects-knowledge-base", title: "Project Knowledge Base : limites et partage", description: "Mémoire contextuelle, maximiser les quotas tokens." },
  { category: "claude-ai", slug: "claude-pages", title: "Claude Pages", description: "L'espace d'édition collaborative pour documents longs." },
  { category: "claude-ai", slug: "app-mobile", title: "L'application mobile (iOS/Android)", description: "Dictée, vision live, limitations vs desktop." },
  { category: "claude-ai", slug: "model-selector-web", title: "Le sélecteur de modèles web", description: "Bascules automatiques en cas de quota atteint." },
  { category: "claude-ai", slug: "historique-export", title: "Historique et export des données", description: "Procédures RGPD, rétention, export complet." },
  { category: "claude-ai", slug: "integrations-natives", title: "Intégrations natives Claude.ai", description: "GitHub, Google Drive, Notion — sans passer par le CLI." },
  { category: "claude-ai", slug: "shared-chats", title: "Partage de conversations", description: "Snapshots, ce qui est inclus/masqué dans un lien public." },
  { category: "claude-ai", slug: "extensions-tierces", title: "Extensions navigateur non officielles", description: "Outils tiers pour améliorer l'UI/UX web." },

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

  // ═══ OBSIDIAN + CLAUDE ═══════════════════════════════════════════
  { category: "obsidian", slug: "guide-complet", title: "Obsidian + Claude : le guide complet", description: "Connecter ton vault Obsidian à Claude — approche directe (fichiers) et approche MCP, cas d'usage, sécurité." },
  { category: "obsidian", slug: "serveurs-mcp", title: "Serveurs MCP Obsidian : installation & config", description: "Local REST API, mcp-obsidian, obsidian-claude-code-mcp — configuration Claude Desktop & Claude Code, dépannage." },

  // ═══ ACTUALITÉS & RESSOURCES ═════════════════════════════════════
  { category: "actualites", slug: "nouveautes-2026", title: "Nouveautés Claude Code (2026)", description: "Opus 4.8 par défaut, computer use, auto mode, orchestration multi-agents, mémoire « dreaming », installeur natif." },
  { category: "actualites", slug: "sources-ressources", title: "Sources & ressources externes", description: "Liens officiels Anthropic, MCP, Obsidian, changelogs — la base de données externe du wiki." },
];

// ─── Helpers ─────────────────────────────────────────────────────────

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function stubsByCategory(id: CategoryId): ArticleStub[] {
  return ARTICLE_STUBS.filter((a) => a.category === id);
}

export function articleCount(): number {
  return ARTICLE_STUBS.length;
}
