import type { Exercise } from "./curriculum";

export const exercisesByLesson: Record<string, Exercise[]> = {
  // ── MODULE 1 : INTRODUCTION ──────────────────────────────
  "chatting-vs-delegating": [
    {
      level: "débutant",
      icon: "✍️",
      title: "Convertis un prompt \"chat\" en délégation",
      description:
        "Prends ce prompt : \"Comment créer un composant Button en React ?\" et réécris-le en mode délégation — une vraie mission avec contexte et objectif final.",
      hint: "Pense à : quel est le vrai résultat ? Dans quel projet ? Avec quelles contraintes de style ?",
    },
    {
      level: "intermédiaire",
      icon: "🚀",
      title: "Ta première vraie délégation",
      description:
        "Ouvre Claude Code sur un projet réel. Délègue-lui la création d'un README.md complet basé sur la structure du projet — sans lui donner d'instructions step-by-step.",
      hint: "Tape juste : \"analyse ce projet et génère un README.md professionnel\"",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Mission autonome de bout en bout",
      description:
        "Donne à Claude une mission qui touche au moins 5 fichiers différents. Observe comment il planifie et exécute sans intervention. Note ce qui te surprend.",
      hint: "Ex: \"Ajoute un système de logging structuré à toutes les routes API de ce projet\"",
    },
  ],

  "what-is-cc": [
    {
      level: "débutant",
      icon: "🔍",
      title: "Explore les capacités de Claude Code",
      description:
        "Fais la liste de 5 choses que Claude Code peut faire que l'interface web de Claude.ai ne peut pas faire. Cherche dans la doc officielle ou teste directement.",
      hint: "Focus sur : accès filesystem, terminal, git, autonomie multi-étapes",
    },
    {
      level: "intermédiaire",
      icon: "⚡",
      title: "Compare avec tes outils actuels",
      description:
        "Si tu utilises Copilot, Cursor ou Windsurf, écris un tableau comparatif : autocomplete vs agent autonome. Quelle est la différence fondamentale d'approche ?",
      hint: "La clé : autocomplete réagit à ton code, Claude Code agit sur ton projet",
    },
    {
      level: "avancé",
      icon: "🎯",
      title: "Identifie tes 5 quick wins",
      description:
        "Sur ton projet principal, liste 5 tâches répétitives que tu pourrais déléguer à Claude Code dès aujourd'hui. Estime le temps économisé par tâche.",
      hint: "Types : refactoring, tests, docs, migrations, code review, setup CI",
    },
  ],

  "installation": [
    {
      level: "débutant",
      icon: "💻",
      title: "Installation complète en 5 minutes",
      description:
        "Installe Claude Code, configure ta clé API et tape ta toute première commande. Objectif : avoir Claude Code qui répond dans ton terminal.",
      hint: "npm install -g @anthropic-ai/claude-code → claude → dis bonjour !",
    },
    {
      level: "intermédiaire",
      icon: "🔧",
      title: "Intégration VS Code",
      description:
        "Configure Claude Code dans VS Code via le terminal intégré. Lance-le depuis un projet existant et demande-lui d'expliquer la structure du projet.",
      hint: "Ctrl+` pour ouvrir le terminal intégré, puis tape 'claude'",
    },
    {
      level: "avancé",
      icon: "🌍",
      title: "Config multi-environnements",
      description:
        "Configure des clés API différentes pour tes projets perso et pro via des variables d'environnement dans ton shell. Vérifie que chaque contexte utilise le bon compte.",
      hint: "Utilise direnv ou des fichiers .env.local spécifiques par projet",
    },
  ],

  "first-steps": [
    {
      level: "débutant",
      icon: "👋",
      title: "Conversation de découverte",
      description:
        "Ouvre Claude Code dans un projet et tape 5 prompts différents pour explorer ses réactions : une question, une demande de lecture, une analyse, une création, une modification.",
      hint: "Observe comment il lit les fichiers automatiquement avant de répondre",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Maîtrise les interruptions",
      description:
        "Lance une action longue (ex: \"analyse tout le projet\"), interromps avec Ctrl+C au bon moment. Reprends avec un prompt plus ciblé. Pratique le contrôle du flux.",
      hint: "L'objectif : apprendre à interrompre sans perdre le contexte utile",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Session productivité 30min",
      description:
        "Lance une session Claude Code de 30 min sur un vrai projet. Objectif : fermer 3 tickets/tâches réels. Mesure le nombre de prompts utilisés vs actions réalisées.",
      hint: "Un bon ratio : 1 prompt → 3-5 actions de Claude. Si c'est 1:1, tu chattas encore.",
    },
  ],

  // ── MODULE 2 : OUTILS FICHIERS ───────────────────────────
  "read-tool": [
    {
      level: "débutant",
      icon: "📖",
      title: "Lis et explique ton propre code",
      description:
        "Pointe Claude vers un fichier que tu as écrit il y a longtemps et que tu ne te rappelles plus bien. Demande-lui de l'expliquer comme si tu étais junior.",
      hint: "\"Explique-moi ce fichier comme si j'y revenais après 6 mois d'absence\"",
    },
    {
      level: "intermédiaire",
      icon: "🔍",
      title: "Analyse comparative",
      description:
        "Demande à Claude de lire deux fichiers similaires (ex: deux controllers) et de lister les différences de patterns et d'inconsistances entre eux.",
      hint: "\"Compare userController.ts et productController.ts — quelles inconsistances tu vois ?\"",
    },
    {
      level: "avancé",
      icon: "🗺️",
      title: "Cartographie d'un codebase inconnu",
      description:
        "Clone un repo open-source que tu ne connais pas. Demande à Claude de te faire une visite guidée de l'architecture en 10 minutes, module par module.",
      hint: "\"Explore ce projet et explique-moi l'architecture : entrée des requêtes, logique, données\"",
    },
  ],

  "write-tool": [
    {
      level: "débutant",
      icon: "📝",
      title: "Génère ta première config",
      description:
        "Demande à Claude de créer un fichier .eslintrc.json adapté à ton stack (React/TS, Node, Python…). Observe comment il adapte la config à ce qu'il voit dans ton projet.",
      hint: "Ne lui donne pas la config — laisse-le choisir basé sur les fichiers du projet",
    },
    {
      level: "intermédiaire",
      icon: "🏗️",
      title: "Scaffold une feature complète",
      description:
        "Demande à Claude de créer tous les fichiers nécessaires pour une feature CRUD simple (ex: gestion de tags) avec les types, le service, le controller et les tests.",
      hint: "Un seul prompt, tous les fichiers — c'est la puissance du Write multi-fichiers",
    },
    {
      level: "avancé",
      icon: "🤖",
      title: "Génération guidée par les types",
      description:
        "Donne à Claude une interface TypeScript complexe et demande-lui de générer l'implémentation complète, les mock data pour les tests, et le schéma de BDD correspondant.",
      hint: "\"Voici l'interface IPaymentGateway — génère l'implémentation Stripe, les mocks Jest et le schéma Prisma\"",
    },
  ],

  "edit-tool": [
    {
      level: "débutant",
      icon: "✏️",
      title: "Renommage en cascade",
      description:
        "Dans un fichier de ton projet, demande à Claude de renommer une variable mal nommée (ex: 'data', 'temp', 'x') partout où elle apparaît, avec un nom plus descriptif.",
      hint: "\"Dans ce fichier, renomme 'data' en 'userProfile' partout — garde la cohérence\"",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Modernisation du code",
      description:
        "Prends un fichier JavaScript avec des callbacks ou des .then() et demande à Claude de le convertir en async/await, en gardant exactement le même comportement.",
      hint: "\"Convertis ce fichier en async/await — zero changement de comportement, seulement la syntaxe\"",
    },
    {
      level: "avancé",
      icon: "🛡️",
      title: "Ajout de gestion d'erreurs systématique",
      description:
        "Identifie un module de ton projet qui n'a pas de gestion d'erreurs cohérente. Demande à Claude d'ajouter une gestion d'erreurs uniforme à toutes les fonctions async.",
      hint: "Spécifie le pattern d'erreur de ton projet (Result type, exceptions custom, etc.)",
    },
  ],

  "glob-grep": [
    {
      level: "débutant",
      icon: "🔎",
      title: "Audit des TODO",
      description:
        "Demande à Claude de trouver tous les TODO, FIXME et HACK dans ton codebase et de les lister avec leur contexte. Combien tu en as ?",
      hint: "\"Cherche tous les TODO/FIXME du projet, liste-les avec le fichier et la ligne\"",
    },
    {
      level: "intermédiaire",
      icon: "📊",
      title: "Analyse des dépendances",
      description:
        "Demande à Claude de trouver tous les imports de bibliothèques externes et de lister celles qui ne sont plus dans package.json (code mort) ou qui sont peu utilisées.",
      hint: "Grep les imports, croise avec package.json — cherche les orphelins",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Détection de patterns inconsistants",
      description:
        "Demande à Claude d'analyser ton codebase et de trouver des endroits où le même problème est résolu de manières différentes (ex: dates formatées de 3 façons différentes).",
      hint: "\"Analyse le projet et trouve les inconsistances de patterns — endroits où la même chose est faite différemment\"",
    },
  ],

  // ── MODULE 3 : CODE & DEBUG ───────────────────────────────
  "code-gen": [
    {
      level: "débutant",
      icon: "⚡",
      title: "Composant React from scratch",
      description:
        "Demande à Claude de créer un composant UI que tu as besoin — une Card, un Modal, un Dropdown. Donne le contexte de ton design system existant.",
      hint: "Montre-lui d'abord un composant existant pour qu'il comprenne ton style",
    },
    {
      level: "intermédiaire",
      icon: "🧪",
      title: "Code + tests en une passe",
      description:
        "Demande à Claude de créer une fonction utilitaire ET ses tests Jest en même temps, dans le même prompt. Vérifie que les tests passent sans modification.",
      hint: "\"Crée la fonction formatCurrency ET ses tests — les tests doivent passer directement\"",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Feature complète en TDD",
      description:
        "Donne à Claude une spec en langage naturel d'une feature. Demande-lui d'écrire les tests d'abord (TDD), puis l'implémentation qui les fait passer.",
      hint: "\"Voici la spec de la feature de recherche. Écris les tests d'abord, puis implémente.\"",
    },
  ],

  "refactoring": [
    {
      level: "débutant",
      icon: "🧹",
      title: "Nettoyage d'un fichier God",
      description:
        "Identifie le fichier le plus long de ton projet (le fameux \"God file\"). Demande à Claude de proposer un plan de découpage en modules plus petits.",
      hint: "\"Ce fichier est trop grand. Propose un découpage en modules cohérents sans rien casser\"",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Migration de pattern",
      description:
        "Choisis un pattern obsolète dans ton projet (class components React, callbacks Node, require() CommonJS). Demande à Claude de migrer un fichier complet vers le pattern moderne.",
      hint: "Un fichier à la fois, tests à l'appui — ne refactore jamais sans filet de sécurité",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Refactoring avec plan d'abord",
      description:
        "Sur un module complexe, demande à Claude de faire un plan de refactoring en 5 étapes avec les risques identifiés. Valide le plan, puis exécute étape par étape.",
      hint: "\"Fais un plan de refactoring de ce module — liste les étapes, les risques, l'ordre optimal\"",
    },
  ],

  "debugging": [
    {
      level: "débutant",
      icon: "🐛",
      title: "Debug ta première erreur avec Claude",
      description:
        "Prends une erreur réelle que tu as eu récemment. Colle la stack trace dans Claude Code et observe sa méthode d'investigation — compare à ce que tu aurais fait toi-même.",
      hint: "Ne lui dis pas la solution si tu la connais déjà — observe comment il arrive au même point",
    },
    {
      level: "intermédiaire",
      icon: "🔬",
      title: "Boucle test-fix autonome",
      description:
        "Lance npm test (ou équivalent). Si des tests échouent, donne le résultat à Claude et dis \"corrige tout ce qui échoue\". Ne l'aide pas — laisse-le itérer.",
      hint: "S'il est bloqué après 3 tentatives, c'est le moment de lui donner un indice ciblé",
    },
    {
      level: "avancé",
      icon: "🎯",
      title: "Investigation de bug de performance",
      description:
        "Identifie une page ou une requête lente dans ton app. Demande à Claude d'investiguer, de profiler et de proposer des optimisations avec impact estimé.",
      hint: "\"Cette route /api/dashboard prend 3s. Trouve pourquoi et optimise — cible < 300ms\"",
    },
  ],

  // ── MODULE 4 : GIT & TERMINAL ─────────────────────────────
  "git-ops": [
    {
      level: "débutant",
      icon: "📦",
      title: "Ton premier commit via Claude",
      description:
        "Fais des modifications dans un projet. Demande à Claude de créer le commit — observe comment il analyse les changements et rédige un message descriptif.",
      hint: "Compare son message de commit au tien habituel — qui est le plus informatif ?",
    },
    {
      level: "intermédiaire",
      icon: "🌿",
      title: "Résolution de conflits assistée",
      description:
        "Crée artificiellement un conflit de merge (modifie le même fichier sur deux branches). Demande à Claude de le résoudre en gardant la logique des deux côtés.",
      hint: "Explique-lui l'intention de chaque branche — le contexte aide à prendre la bonne décision",
    },
    {
      level: "avancé",
      icon: "📋",
      title: "Audit de l'historique Git",
      description:
        "Demande à Claude d'analyser les 50 derniers commits de ton projet et de te dire : qualité des messages, fichiers les plus changés, auteurs principaux, patterns de bug récurrents.",
      hint: "\"Analyse git log --oneline -50 et donne-moi un rapport sur la santé du projet\"",
    },
  ],

  "github-pr": [
    {
      level: "débutant",
      icon: "🔗",
      title: "Ta première PR via Claude",
      description:
        "Crée une branche, fais un petit changement, et demande à Claude de créer la PR avec un titre, une description et un test plan complets.",
      hint: "Dis juste \"crée une PR\" — Claude s'occupe de tout le reste avec gh CLI",
    },
    {
      level: "intermédiaire",
      icon: "💬",
      title: "Adresse les review comments",
      description:
        "Prends une vraie PR avec des commentaires de review. Donne les commentaires à Claude et demande-lui d'adresser chaque point avec les modifications nécessaires.",
      hint: "\"Voici les comments de review de la PR #42. Adresse chaque point et réponds aux commentaires.\"",
    },
    {
      level: "avancé",
      icon: "🤖",
      title: "Automatise ta review de PR",
      description:
        "Configure un script qui lance Claude Code sur chaque PR pour faire une review automatique (sécurité, perf, style). Intègre-le dans ton workflow GitHub Actions.",
      hint: "claude --print 'Review ce diff pour bugs, sécurité et perf' dans ton workflow CI",
    },
  ],

  "bash": [
    {
      level: "débutant",
      icon: "💻",
      title: "Délègue tes commandes répétitives",
      description:
        "Pense à 3 commandes bash que tu tapes régulièrement mais que tu dois chercher (docker, ffmpeg, imagemagick, etc.). Demande à Claude de les exécuter pour toi.",
      hint: "\"Compresse toutes les images PNG du dossier public/ en gardant une qualité correcte\"",
    },
    {
      level: "intermédiaire",
      icon: "🔧",
      title: "Script d'automatisation",
      description:
        "Identifie une tâche manuelle récurrente (deploy, backup, cleanup). Demande à Claude de créer un script bash pour l'automatiser, avec gestion des erreurs.",
      hint: "Décris ce que tu fais manuellement — Claude transforme ça en script robuste",
    },
    {
      level: "avancé",
      icon: "⚙️",
      title: "Pipeline de dev complet",
      description:
        "Demande à Claude de créer un Makefile (ou package.json scripts) qui orchestre tout ton workflow : install, lint, test, build, deploy — avec les bonnes dépendances entre étapes.",
      hint: "\"Crée un Makefile avec les targets : dev, test, build, deploy, clean — avec les bonnes dépendances\"",
    },
  ],

  // ── MODULE 5 : CONFIGURATION AVANCÉE ─────────────────────
  "settings": [
    {
      level: "débutant",
      icon: "⚙️",
      title: "Crée ton premier settings.json",
      description:
        "Crée un ~/.claude/settings.json avec les outils autorisés pour ton workflow habituel. Lance Claude Code et vérifie qu'il ne demande plus confirmation pour ces outils.",
      hint: "Commence minimal : autorise Read, Edit, Bash(npm *), Bash(git *)",
    },
    {
      level: "intermédiaire",
      icon: "🛡️",
      title: "Settings d'équipe",
      description:
        "Crée un .claude/settings.json dans un projet d'équipe qui bloque les commandes dangereuses et standardise les outils autorisés. Documente chaque règle.",
      hint: "Deny: rm -rf, sudo, curl vers l'extérieur — Allow: npm, git, tests locaux",
    },
    {
      level: "avancé",
      icon: "🔐",
      title: "Profils par projet",
      description:
        "Configure des settings différents pour tes projets perso (permissif) et pro (restrictif). Utilise les .claude/settings.local.json pour tes overrides personnels.",
      hint: "Local = non-versionné = tes préférences perso sans impacter l'équipe",
    },
  ],

  "mcp": [
    {
      level: "débutant",
      icon: "🔌",
      title: "Connecte ton premier MCP server",
      description:
        "Configure le MCP server GitHub officiel (@modelcontextprotocol/server-github) et demande à Claude de lister les issues ouvertes d'un de tes repos.",
      hint: "npx -y @modelcontextprotocol/server-github dans mcpServers de settings.json",
    },
    {
      level: "intermédiaire",
      icon: "🗄️",
      title: "Claude qui requête ta BDD",
      description:
        "Configure le MCP server PostgreSQL (ou SQLite). Demande à Claude d'analyser tes données, de trouver des anomalies et de proposer des optimisations de requêtes.",
      hint: "\"Analyse la table users, trouve les comptes inactifs depuis 90 jours et propose un script de nettoyage\"",
    },
    {
      level: "avancé",
      icon: "🛠️",
      title: "Crée ton MCP server custom",
      description:
        "Identifie un outil interne (API interne, système de tickets, monitoring) et crée un MCP server minimal qui l'expose à Claude. Connecte et teste.",
      hint: "Commence par 1 seul outil exposé — un GET endpoint suffit pour valider le concept",
    },
  ],

  "hooks": [
    {
      level: "débutant",
      icon: "🪝",
      title: "Auto-format après chaque édition",
      description:
        "Configure un hook PostToolUse qui lance Prettier automatiquement sur chaque fichier que Claude modifie. Plus jamais de fichiers non-formatés.",
      hint: "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true",
    },
    {
      level: "intermédiaire",
      icon: "📋",
      title: "Log d'audit des commandes",
      description:
        "Crée un hook qui enregistre dans un fichier toutes les commandes bash que Claude exécute, avec timestamp et projet. Idéal pour les environnements sensibles.",
      hint: "echo \"$(date) | $CLAUDE_TOOL_INPUT_COMMAND\" >> ~/.claude/audit.log",
    },
    {
      level: "avancé",
      icon: "🔔",
      title: "Notification de fin de tâche",
      description:
        "Crée un hook de notification (Slack, email, ou même une notification macOS) qui se déclenche quand Claude termine une tâche longue. Fini d'attendre devant l'écran.",
      hint: "osascript -e 'display notification \"Claude a terminé\" with title \"Claude Code\"'",
    },
  ],

  // ── MODULE 6 : MÉMOIRE & CONTEXTE ─────────────────────────
  "claude-md": [
    {
      level: "débutant",
      icon: "📄",
      title: "Crée ton premier CLAUDE.md",
      description:
        "Sur ton projet principal, demande à Claude de générer un CLAUDE.md complet en explorant le codebase. Lis-le, corrige les inexactitudes et sauvegarde.",
      hint: "\"Explore ce projet et crée un CLAUDE.md avec la stack, les conventions et les commandes importantes\"",
    },
    {
      level: "intermédiaire",
      icon: "📚",
      title: "CLAUDE.md d'équipe avec règles métier",
      description:
        "Enrichis ton CLAUDE.md avec les règles métier implicites de ton domaine — les choses qu'un nouveau dev doit savoir et que Claude ne peut pas deviner seul.",
      hint: "Ajoute une section \"Règles métier\" avec les invariants, les cas limites, les décisions d'archi",
    },
    {
      level: "avancé",
      icon: "🗂️",
      title: "Hiérarchie de CLAUDE.md par module",
      description:
        "Crée des CLAUDE.md dans les sous-dossiers critiques (src/auth/, src/payments/) avec des instructions spécifiques à chaque domaine. Vérifie que Claude les respecte.",
      hint: "Chaque sous-dossier a ses propres conventions — un seul CLAUDE.md à la racine ne suffit pas",
    },
  ],

  "memory-system": [
    {
      level: "débutant",
      icon: "🧠",
      title: "Configure tes préférences",
      description:
        "Dis à Claude 5 choses sur tes préférences de travail (langage préféré, style de réponse, niveau d'explication). Vérifie qu'il s'en souvient dans une nouvelle session.",
      hint: "\"Souviens-toi que je préfère les réponses courtes, le TypeScript strict et les commits en anglais\"",
    },
    {
      level: "intermédiaire",
      icon: "📝",
      title: "Capture les décisions d'architecture",
      description:
        "Après une session où tu as pris des décisions importantes (choix d'une lib, pattern adopté), demande à Claude de mémoriser ces décisions pour les sessions futures.",
      hint: "\"Mémorise ces décisions d'architecture pour ce projet\" — il crée les fichiers de mémoire",
    },
    {
      level: "avancé",
      icon: "🔄",
      title: "Audit et nettoyage de la mémoire",
      description:
        "Explore tes fichiers de mémoire (~/.claude/memory/). Identifie les mémoires obsolètes ou incorrectes. Demande à Claude de les mettre à jour ou de les supprimer.",
      hint: "\"Montre-moi toutes tes mémoires sur ce projet et dis-moi lesquelles sont encore valides\"",
    },
  ],

  "context-management": [
    {
      level: "débutant",
      icon: "🧹",
      title: "Pratique /compact intelligemment",
      description:
        "Lance une session de 20 min sur un projet. Quand tu sens que les réponses sont moins précises, utilise /compact. Observe la différence avant/après.",
      hint: "/status te montre le % de contexte utilisé — compacte autour de 70%",
    },
    {
      level: "intermédiaire",
      icon: "🎯",
      title: "Session ciblée vs session large",
      description:
        "Compare deux approches : une session longue fourre-tout vs des sessions courtes et ciblées (une par tâche). Laquelle produit les meilleurs résultats ?",
      hint: "Sessions courtes + CLAUDE.md bien fait = meilleure qualité que longue session sans structure",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Optimise le ratio tokens/résultats",
      description:
        "Sur une tâche complexe, compare le coût (/cost) entre : une session naive vs la même tâche avec /compact et contexte ciblé. Calcule ton ROI.",
      hint: "Un bon CLAUDE.md peut réduire les tokens de 30-50% en évitant les re-explications",
    },
  ],

  // ── MODULE 7 : PRODUCTIVITÉ ───────────────────────────────
  "slash-commands": [
    {
      level: "débutant",
      icon: "⚡",
      title: "Utilise /commit tous les jours",
      description:
        "Pendant une semaine, utilise /commit pour tous tes commits au lieu de git commit manuel. Compare la qualité des messages — les tiens vs ceux de Claude.",
      hint: "Spoiler : les messages de Claude seront meilleurs et plus consistants",
    },
    {
      level: "intermédiaire",
      icon: "🛠️",
      title: "Crée ton premier skill",
      description:
        "Identifie une tâche que tu fais souvent avec Claude (ex: générer des tests, faire une review de sécurité). Transforme-la en skill dans ~/.claude/commands/.",
      hint: "Un skill = un fichier .md avec les instructions détaillées de la tâche",
    },
    {
      level: "avancé",
      icon: "🤝",
      title: "Skills partagés en équipe",
      description:
        "Crée 3 skills utiles pour ton équipe dans .claude/commands/ (versionné). Présente-les à l'équipe. Objectif : uniformiser les workflows avec Claude.",
      hint: "Bons skills d'équipe : /review-pr, /add-tests, /update-changelog, /check-security",
    },
  ],

  "keyboard-shortcuts": [
    {
      level: "débutant",
      icon: "⌨️",
      title: "Mémorise les 5 raccourcis essentiels",
      description:
        "Ctrl+C, Escape, ↑/↓, Ctrl+L, Shift+Enter. Pratique chacun 3 fois maintenant. Ces 5 raccourcis couvrent 90% de tes besoins quotidiens.",
      hint: "Ctrl+C = interrompre Claude | Escape = annuler ta saisie | Shift+Enter = nouvelle ligne",
    },
    {
      level: "intermédiaire",
      icon: "🚀",
      title: "Configure tes raccourcis custom",
      description:
        "Crée ~/.claude/keybindings.json avec au moins 2 raccourcis personnalisés qui correspondent à tes habitudes (ex: ton raccourci pour ouvrir Claude depuis VS Code).",
      hint: "Lance /keybindings pour avoir un guide interactif de configuration",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Challenge vitesse : 0 souris pendant 1h",
      description:
        "Pendant une heure, utilise Claude Code sans toucher la souris. Tout au clavier : navigation, édition, validation. Mesure ta productivité avant vs après.",
      hint: "Le mode clavier seul force à utiliser les raccourcis — tu discovers les patterns les plus efficaces",
    },
  ],

  "tips": [
    {
      level: "débutant",
      icon: "💡",
      title: "Tes 3 prompts signature",
      description:
        "Écris les 3 types de prompts que tu utilises le plus souvent. Affine-les jusqu'à ce qu'ils produisent systématiquement d'excellents résultats. Sauvegarde-les.",
      hint: "Un bon prompt signature : contexte + objectif + contraintes + format de sortie attendu",
    },
    {
      level: "intermédiaire",
      icon: "🔢",
      title: "Multi-terminaux en parallèle",
      description:
        "Ouvre 3 terminaux avec Claude Code sur 3 branches différentes. Travaille en parallèle sur 3 features. Mesure combien de features tu closes en 1 heure.",
      hint: "Chaque terminal = un contexte séparé = 0 interference entre les tâches",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Intègre Claude Code dans ton CI/CD",
      description:
        "Mets en place Claude Code dans ton pipeline GitHub Actions pour : review automatique des PR, génération de changelog, vérification des breaking changes.",
      hint: "claude --print --output-format json dans tes workflows — parse le JSON pour les checks",
    },
  ],

  // ── MODULE 8 : TOKENS & MODÈLES ───────────────────────────
  "how-models-work": [
    {
      level: "débutant",
      icon: "🧮",
      title: "Compte tes tokens",
      description:
        "Prends un fichier de 100 lignes de ton projet. Estime le nombre de tokens (règle : ~4 caractères = 1 token en anglais, ~5 en français). Vérifie avec /status.",
      hint: "1 fichier de 100 lignes ≈ 800-1500 tokens selon le contenu",
    },
    {
      level: "intermédiaire",
      icon: "🎯",
      title: "Optimise l'ordre de ton contexte",
      description:
        "Réorganise ton CLAUDE.md pour que les instructions les plus importantes soient au début (haute attention) et les infos générales à la fin. Teste si ça change les résultats.",
      hint: "Le modèle accorde plus d'attention au début et à la fin — les instructions critiques vont là",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Benchmark attention sur ton projet",
      description:
        "Compare les résultats sur une même tâche avec un contexte court (fichiers pertinents seulement) vs contexte large (tout le projet). Mesure qualité et coût.",
      hint: "Contexte ciblé = moins de tokens + meilleure attention = meilleur résultat moins cher",
    },
  ],

  "pricing": [
    {
      level: "débutant",
      icon: "💰",
      title: "Calcule ton budget mensuel",
      description:
        "Estime ton usage mensuel de Claude Code basé sur tes habitudes (nb de sessions, durée, complexité). Calcule le coût avec les tarifs Sonnet. Est-ce viable ?",
      hint: "Une session de 1h ≈ 50k-200k tokens input selon l'intensité. Sonnet ≈ $3/MTok input.",
    },
    {
      level: "intermédiaire",
      icon: "📊",
      title: "Audit d'une semaine de sessions",
      description:
        "Pendant une semaine, note /cost après chaque session. Identifie quelles sessions coûtent cher vs peu. Y a-t-il des patterns pour réduire sans perdre en qualité ?",
      hint: "Les sessions longues sans /compact coûtent souvent 3-5x plus que les sessions bien gérées",
    },
    {
      level: "avancé",
      icon: "🎯",
      title: "Stratégie de choix de modèle",
      description:
        "Définis des règles claires pour toi : quand utiliser Haiku, Sonnet, Opus. Applique ces règles pendant 2 semaines. Mesure le coût total vs qualité obtenue.",
      hint: "Règle simple : Haiku=CI/scripts, Sonnet=dev quotidien, Opus=architecture/debugging complexe",
    },
  ],

  // ── MODULE 9 : PLAN MODE & AGENTS ─────────────────────────
  "plan-mode": [
    {
      level: "débutant",
      icon: "📋",
      title: "Ton premier plan d'implémentation",
      description:
        "Avant de coder ta prochaine feature, demande un plan à Claude. Lis le plan, pose des questions, demande des clarifications. Valide seulement quand tu es d'accord.",
      hint: "\"Avant de commencer, fais-moi un plan détaillé de comment tu vas implémenter X\"",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Plan → feedback → exécution",
      description:
        "Demande un plan, modifie 2-3 aspects basés sur ta connaissance du projet, valide le plan modifié, puis lance l'exécution. Mesure le nb de \"retraits\" vs sans plan.",
      hint: "Un bon plan évite 80% des aller-retours — l'investissement de 5min vaut les 30min économisées",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Plan pour une migration complexe",
      description:
        "Prends la migration la plus complexe de ta backlog (changement de BDD, migration auth, upgrade majeur). Demande un plan complet avec estimation des risques et stratégie de rollback.",
      hint: "Un plan de migration inclut : ordre d'exécution, points de rollback, tests de validation",
    },
  ],

  "subagents": [
    {
      level: "débutant",
      icon: "🔍",
      title: "Subagent pour explorer sans polluer",
      description:
        "Sur un gros projet, utilise un subagent Explore pour comprendre l'architecture d'un module inconnu. Observe que ton contexte principal reste propre.",
      hint: "\"Utilise un subagent pour explorer src/payments/ et me faire un rapport de l'architecture\"",
    },
    {
      level: "intermédiaire",
      icon: "⚡",
      title: "Tâches en parallèle",
      description:
        "Lance 3 subagents en parallèle sur 3 modules différents pour générer leurs tests unitaires. Compare le temps total vs séquentiel.",
      hint: "\"Lance 3 subagents en parallèle : génère les tests pour auth/, payments/ et users/\"",
    },
    {
      level: "avancé",
      icon: "🤖",
      title: "Agent de recherche spécialisé",
      description:
        "Crée un workflow où un subagent recherche la doc officielle d'une lib et rapporte les best practices, puis l'agent principal implémente selon ces guidelines.",
      hint: "Séparation claire : subagent=recherche, agent principal=implémentation",
    },
  ],

  "multi-agent": [
    {
      level: "débutant",
      icon: "🔱",
      title: "Orchestration simple",
      description:
        "Divise une tâche en 2 sous-tâches indépendantes, délègue chacune à un subagent, récupère et consolide les résultats. Ex: générer tests + docs en parallèle.",
      hint: "\"Génère les tests ET la documentation de ce module en parallèle avec 2 subagents\"",
    },
    {
      level: "intermédiaire",
      icon: "🏭",
      title: "Pipeline de qualité automatisé",
      description:
        "Crée un workflow multi-agents : agent 1 = implémente la feature, agent 2 = review sécurité, agent 3 = génère les tests. L'orchestrateur consolide.",
      hint: "Chaque agent a un rôle strict — évite les chevauchements de responsabilités",
    },
    {
      level: "avancé",
      icon: "🌐",
      title: "Migration codebase entière",
      description:
        "Planifie une migration de codebase (JS→TS, old patterns→new) en utilisant des agents parallèles par module. Crée l'orchestration et exécute sur un sous-ensemble de test.",
      hint: "Commence par 3-5 modules pour valider le workflow avant de scaler à tout le projet",
    },
  ],

  // ── MODULE 10 : PROJET SAAS ───────────────────────────────
  "project-setup": [
    {
      level: "débutant",
      icon: "🚀",
      title: "Scaffold ton projet en 10 minutes",
      description:
        "Choisis un projet perso que tu veux créer. Demande à Claude de créer la structure complète, installer les dépendances, configurer TypeScript/ESLint/Prettier en 1 seul prompt.",
      hint: "\"Crée un projet [nom] avec [stack]. Structure les dossiers, configure les outils, écris le CLAUDE.md\"",
    },
    {
      level: "intermédiaire",
      icon: "🏗️",
      title: "Feature complète en TDD",
      description:
        "Sur ton projet SaaS, choisis une feature (ex: auth, payments, notifications). Demande à Claude de l'implémenter complètement avec tests, en utilisant le Plan Mode d'abord.",
      hint: "Plan → validation → implémentation → tests → commit → PR. Le workflow complet.",
    },
    {
      level: "avancé",
      icon: "🌐",
      title: "Déploiement automatisé",
      description:
        "Configure un workflow complet : Claude Code génère le code, les tests passent, Vercel déploie automatiquement. Zéro intervention manuelle entre le prompt et la prod.",
      hint: "git push → GitHub Actions (tests) → Vercel (deploy). Claude code, tu reviews, tu pushes.",
    },
  ],

  "existing-project": [
    {
      level: "débutant",
      icon: "🔍",
      title: "Onboarding Claude sur ton projet legacy",
      description:
        "Sur ton projet le plus legacy, demande à Claude de générer un CLAUDE.md complet. Lis-le et corrige — c'est le meilleur moyen de documenter ce que personne ne comprend.",
      hint: "\"Explore ce projet legacy et crée un CLAUDE.md — architecture, patterns, pièges à éviter\"",
    },
    {
      level: "intermédiaire",
      icon: "🧹",
      title: "Quick wins sur la dette technique",
      description:
        "Demande à Claude d'identifier les 5 quick wins de dette technique (haute valeur, faible risque). Exécute-les en une session, avec tests à l'appui.",
      hint: "\"Identifie les 5 améliorations les plus impactantes et les moins risquées de ce codebase\"",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Migration progressive avec feature flags",
      description:
        "Planifie une migration d'une partie critique de ton legacy (ex: l'auth) en utilisant des feature flags pour un déploiement progressif sans risque.",
      hint: "Feature flags = deploy en prod sans activer = rollback instantané si problème",
    },
  ],

  "professional-tips": [
    {
      level: "débutant",
      icon: "📈",
      title: "Mesure ton avant/après",
      description:
        "Pendant une semaine normale (sans Claude Code intensif), note le temps par tâche. La semaine suivante avec Claude Code, note les mêmes métriques. Calcule ton ROI.",
      hint: "Métriques : features livrées, bugs fixés, temps de review, temps de setup",
    },
    {
      level: "intermédiaire",
      icon: "👥",
      title: "Convertis un collègue",
      description:
        "Présente Claude Code à un collègue sceptique. Fais une démo live de 15 min sur un vrai problème qu'il a. Objectif : lui montrer une chose qu'il ne croyait pas possible.",
      hint: "Choisis un problème concret qu'il a en ce moment — l'abstraction convainc moins que le résultat",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Construis ton stack Claude Code idéal",
      description:
        "Documente ton setup complet : settings.json, skills customs, CLAUDE.md templates, hooks, MCP servers. Partage-le avec la communauté ou ton équipe.",
      hint: "Ton setup = ta productivité personnalisée. Plus il est documenté, plus il est transmissible.",
    },
  ],
};
