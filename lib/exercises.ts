import type { Exercise } from "./curriculum";

export const exercisesByLesson: Record<string, Exercise[]> = {
  // ── MODULE 1 : INTRODUCTION ──────────────────────────────
  "chatting-vs-delegating": [
    {
      level: "débutant",
      icon: "✍️",
      title: "Convertissez un prompt \"chat\" en délégation",
      description:
        "Prenez ce prompt : \"Comment créer un composant Button en React ?\" et réécris-le en mode délégation : une vraie mission avec contexte et objectif final.",
      hint: "Pensez à : quel est le vrai résultat ? Dans quel projet ? Avec quelles contraintes de style ?",
    },
    {
      level: "intermédiaire",
      icon: "🚀",
      title: "Votre première vraie délégation",
      description:
        "Ouvrez Claude Code sur un projet réel. Déléguez-lui la création d'un README.md complet basé sur la structure du projet : sans lui donner d'instructions step-by-step.",
      hint: "Tapez juste : \"analyse ce projet et générez un README.md professionnel\"",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Mission autonome de bout en bout",
      description:
        "Donnez à Claude une mission qui touche au moins 5 fichiers différents. Observez comment il planifie et exécutez sans intervention. Notez ce qui vous surprend.",
      hint: "Ex: \"Ajoutez un système de logging structuré à toutes les routes API de ce projet\"",
    },
  ],

  "what-is-cc": [
    {
      level: "débutant",
      icon: "🔍",
      title: "Explorez les capacités de Claude Code",
      description:
        "Faites la liste de 5 choses que Claude Code peut faire que l'interface web de Claude.ai ne peut pas faire. Cherchez dans la doc officielle ou teste directement.",
      hint: "Focus sur : accès filesystem, terminal, git, autonomie multi-étapes",
    },
    {
      level: "intermédiaire",
      icon: "⚡",
      title: "Comparez avec vos outils actuels",
      description:
        "Si vous utilisez Copilot, Cursor ou Windsurf, écrivez un tableau comparatif : autocomplete vs agent autonome. Quelle est la différence fondamentale d'approche ?",
      hint: "La clé : autocomplete réagit à votre code, Claude Code agit sur votre projet",
    },
    {
      level: "avancé",
      icon: "🎯",
      title: "Identifiez vos 5 quick wins",
      description:
        "Sur votre projet principal, liste 5 tâches répétitives que vous pourriez déléguer à Claude Code dès aujourd'hui. Estimez le temps économisé par tâche.",
      hint: "Types : refactoring, tests, docs, migrations, code review, setup CI",
    },
  ],

  "installation": [
    {
      level: "débutant",
      icon: "💻",
      title: "Installation complèvous en 5 minutes",
      description:
        "Installez Claude Code, configurez votre clé API et tapez votre toute première commande. Objectif : avoir Claude Code qui répond dans votre terminal.",
      hint: "npm install -g @anthropic-ai/claude-code → claude → dis bonjour !",
    },
    {
      level: "intermédiaire",
      icon: "🔧",
      title: "Intégration VS Code",
      description:
        "Configurez Claude Code dans VS Code via le terminal intégré. Lancez-le depuis un projet existant et demandez-lui d'expliquer la structure du projet.",
      hint: "Ctrl+` pour ouvrir le terminal intégré, puis tapez 'claude'",
    },
    {
      level: "avancé",
      icon: "🌍",
      title: "Config multi-environnements",
      description:
        "Configurez des clés API différentes pour vos projets perso et pro via des variables d'environnement dans votre shell. Vérifiez que chaque contexte utilise le bon compte.",
      hint: "Utilisez direnv ou des fichiers .env.local spécifiques par projet",
    },
  ],

  "first-steps": [
    {
      level: "débutant",
      icon: "👋",
      title: "Conversation de découverte",
      description:
        "Ouvrez Claude Code dans un projet et tapez 5 prompts différents pour explorer ses réactions : une question, une demande de lecture, une analyse, une création, une modification.",
      hint: "Observez comment il lit les fichiers automatiquement avant de répondre",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Maîtrisez les interruptions",
      description:
        "Lancez une action longue (ex: \"analyse tout le projet\"), interromps avec Ctrl+C au bon moment. Reprenez avec un prompt plus ciblé. Pratiquez le contrôle du flux.",
      hint: "L'objectif : apprendre à interrompre sans perdre le contexte utile",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Session productivité 30min",
      description:
        "Lancez une session Claude Code de 30 min sur un vrai projet. Objectif : fermer 3 tickets/tâches réels. Mesurez le nombre de prompts utilisés vs actions réalisées.",
      hint: "Un bon ratio : 1 prompt → 3-5 actions de Claude. Si c'est 1:1, vous dialoguez encore.",
    },
  ],

  // ── MODULE 2 : OUTILS FICHIERS ───────────────────────────
  "read-tool": [
    {
      level: "débutant",
      icon: "📖",
      title: "Lisez et explique votre propre code",
      description:
        "Pointez Claude vers un fichier que vous avez écrit il y a longtemps et que vous ne vous rappelez plus bien. Demandez-lui de l'expliquer comme si vous étiez junior.",
      hint: "\"Expliquez-moi ce fichier comme si j'y revenais après 6 mois d'absence\"",
    },
    {
      level: "intermédiaire",
      icon: "🔍",
      title: "Analyse comparative",
      description:
        "Demandez à Claude de lire deux fichiers similaires (ex: deux controllers) et de lister les différences de patterns et d'inconsistances entre eux.",
      hint: "\"Comparez userController.ts et productController.ts : quelles inconsistances vous voyez ?\"",
    },
    {
      level: "avancé",
      icon: "🗺️",
      title: "Cartographie d'un codebase inconnu",
      description:
        "Clonez un repo open-source que vous ne connaissez pas. Demandez à Claude de vous faire une visite guidée de l'architecture en 10 minutes, module par module.",
      hint: "\"Explorez ce projet et explique-moi l'architecture : entrée des requêvos, logique, données\"",
    },
  ],

  "write-tool": [
    {
      level: "débutant",
      icon: "📝",
      title: "Générez votre première config",
      description:
        "Demandez à Claude de créer un fichier .eslintrc.json adapté à votre stack (React/TS, Node, Python…). Observez comment il adapte la config à ce qu'il voit dans votre projet.",
      hint: "Ne lui donnez pas la config : laissez-le choisir basé sur les fichiers du projet",
    },
    {
      level: "intermédiaire",
      icon: "🏗️",
      title: "Préparez une feature complèvous",
      description:
        "Demandez à Claude de créer tous les fichiers nécessaires pour une feature CRUD simple (ex: gestion de tags) avec les types, le service, le controller et les tests.",
      hint: "Un seul prompt, tous les fichiers : c'est la puissance du Write multi-fichiers",
    },
    {
      level: "avancé",
      icon: "🤖",
      title: "Génération guidée par les types",
      description:
        "Donnez à Claude une interface TypeScript complexe et demandez-lui de générer l'implémentation complèvous, les mock data pour les tests, et le schéma de BDD correspondant.",
      hint: "\"Voici l'interface IPaymentGateway : génère l'implémentation Stripe, les mocks Jest et le schéma Prisma\"",
    },
  ],

  "edit-tool": [
    {
      level: "débutant",
      icon: "✏️",
      title: "Renommage en cascade",
      description:
        "Dans un fichier de votre projet, demandez à Claude de renommer une variable mal nommée (ex: 'data', 'temp', 'x') partout où elle apparaît, avec un nom plus descriptif.",
      hint: "\"Dans ce fichier, renomme 'data' en 'userProfile' partout : garde la cohérence\"",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Modernisation du code",
      description:
        "Prenez un fichier JavaScript avec des callbacks ou des .then() et demandez à Claude de le convertir en async/await, en gardant exactement le même comportement.",
      hint: "\"Convertissez ce fichier en async/await : zero changement de comportement, seulement la syntaxe\"",
    },
    {
      level: "avancé",
      icon: "🛡️",
      title: "Ajout de gestion d'erreurs systématique",
      description:
        "Identifiez un module de votre projet qui n'a pas de gestion d'erreurs cohérente. Demandez à Claude d'ajouter une gestion d'erreurs uniforme à toutes les fonctions async.",
      hint: "Spécifiez le pattern d'erreur de votre projet (Result type, exceptions custom, etc.)",
    },
  ],

  "glob-grep": [
    {
      level: "débutant",
      icon: "🔎",
      title: "Audit des TODO",
      description:
        "Demandez à Claude de trouver tous les TODO, FIXME et HACK dans votre codebase et de les lister avec leur contexte. Combien vous en avez ?",
      hint: "\"Cherchez tous les TODO/FIXME du projet, liste-les avec le fichier et la ligne\"",
    },
    {
      level: "intermédiaire",
      icon: "📊",
      title: "Analyse des dépendances",
      description:
        "Demandez à Claude de trouver tous les imports de bibliothèques externes et de lister celles qui ne sont plus dans package.json (code mort) ou qui sont peu utilisées.",
      hint: "Grep les imports, croise avec package.json : cherche les orphelins",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Détection de patterns inconsistants",
      description:
        "Demandez à Claude d'analyser votre codebase et de trouver des endroits où le même problème est résolu de manières différentes (ex: dates formatées de 3 façons différentes).",
      hint: "\"Analyse le projet et trouve les inconsistances de patterns : endroits où la même chose est faite différemment\"",
    },
  ],

  // ── MODULE 3 : CODE & DEBUG ───────────────────────────────
  "code-gen": [
    {
      level: "débutant",
      icon: "⚡",
      title: "Composant React from scratch",
      description:
        "Demandez à Claude de créer un composant UI que vous avez besoin : une Card, un Modal, un Dropdown. Donnez le contexte de votre design system existant.",
      hint: "Montrez-lui d'abord un composant existant pour qu'il comprenne votre style",
    },
    {
      level: "intermédiaire",
      icon: "🧪",
      title: "Code + tests en une passe",
      description:
        "Demandez à Claude de créer une fonction utilitaire ET ses tests Jest en même temps, dans le même prompt. Vérifiez que les tests passent sans modification.",
      hint: "\"Créez la fonction formatCurrency ET ses tests : les tests doivent passer directement\"",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Feature complèvous en TDD",
      description:
        "Donnez à Claude une spec en langage naturel d'une feature. Demandez-lui d'écrire les tests d'abord (TDD), puis l'implémentation qui les fait passer.",
      hint: "\"Voici la spec de la feature de recherche. Écris les tests d'abord, puis implémente.\"",
    },
  ],

  "refactoring": [
    {
      level: "débutant",
      icon: "🧹",
      title: "Nettoyage d'un fichier God",
      description:
        "Identifiez le fichier le plus long de votre projet (le fameux \"God file\"). Demandez à Claude de proposer un plan de découpage en modules plus petits.",
      hint: "\"Ce fichier est trop grand. Propose un découpage en modules cohérents sans rien casser\"",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Migration de pattern",
      description:
        "Choisissez un pattern obsolèvous dans votre projet (class components React, callbacks Node, require() CommonJS). Demandez à Claude de migrer un fichier complet vers le pattern moderne.",
      hint: "Un fichier à la fois, tests à l'appui : ne refactorez jamais sans filet de sécurité",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Refactoring avec plan d'abord",
      description:
        "Sur un module complexe, demandez à Claude de faire un plan de refactoring en 5 étapes avec les risques identifiés. Validez le plan, puis exécutez étape par étape.",
      hint: "\"Faites un plan de refactoring de ce module : liste les étapes, les risques, l'ordre optimal\"",
    },
  ],

  "debugging": [
    {
      level: "débutant",
      icon: "🐛",
      title: "Debug votre première erreur avec Claude",
      description:
        "Prenez une erreur réelle que vous avez eu récemment. Collez la stack trace dans Claude Code et observez sa méthode d'investigation : compare à ce que vous auriez fait vous-même.",
      hint: "Ne lui dites pas la solution si vous la connaissez déjà : observe comment il arrive au même point",
    },
    {
      level: "intermédiaire",
      icon: "🔬",
      title: "Boucle test-fix autonome",
      description:
        "Lancez npm test (ou équivalent). Si des tests échouent, donne le résultat à Claude et dis \"corrige tout ce qui échoue\". Ne l’aidez pas : laissez-le itérer.",
      hint: "S'il est bloqué après 3 tentatives, c'est le moment de lui donner un indice ciblé",
    },
    {
      level: "avancé",
      icon: "🎯",
      title: "Investigation de bug de performance",
      description:
        "Identifiez une page ou une requêvous lente dans votre app. Demandez à Claude d'investiguer, de profiler et de proposer des optimisations avec impact estimé.",
      hint: "\"Cette route /api/dashboard prend 3s. Trouve pourquoi et optimise : cible < 300ms\"",
    },
  ],

  // ── MODULE 4 : GIT & TERMINAL ─────────────────────────────
  "git-ops": [
    {
      level: "débutant",
      icon: "📦",
      title: "Votre premier commit via Claude",
      description:
        "Faites des modifications dans un projet. Demandez à Claude de créer le commit : observe comment il analyse les changements et rédige un message descriptif.",
      hint: "Comparez son message de commit à votre message habituel : qui est le plus informatif ?",
    },
    {
      level: "intermédiaire",
      icon: "🌿",
      title: "Résolution de conflits assistée",
      description:
        "Créez artificiellement un conflit de merge (modifie le même fichier sur deux branches). Demandez à Claude de le résoudre en gardant la logique des deux côtés.",
      hint: "Expliquez-lui l'intention de chaque branche : le contexte aide à prendre la bonne décision",
    },
    {
      level: "avancé",
      icon: "📋",
      title: "Audit de l'historique Git",
      description:
        "Demandez à Claude d'analyser les 50 derniers commits de votre projet et de vous dire : qualité des messages, fichiers les plus changés, auteurs principaux, patterns de bug récurrents.",
      hint: "\"Analyse git log --oneline -50 et donne-moi un rapport sur la santé du projet\"",
    },
  ],

  "github-pr": [
    {
      level: "débutant",
      icon: "🔗",
      title: "Votre première PR via Claude",
      description:
        "Créez une branche, fais un petit changement, et demandez à Claude de créer la PR avec un titre, une description et un test plan complets.",
      hint: "Dites juste \"crée une PR\" : Claude s'occupe de tout le reste avec gh CLI",
    },
    {
      level: "intermédiaire",
      icon: "💬",
      title: "Traitez les review comments",
      description:
        "Prenez une vraie PR avec des commentaires de review. Donnez les commentaires à Claude et demandez-lui d'adresser chaque point avec les modifications nécessaires.",
      hint: "\"Voici les comments de review de la PR #42. Traitez chaque point et réponds aux commentaires.\"",
    },
    {
      level: "avancé",
      icon: "🤖",
      title: "Automatisez votre review de PR",
      description:
        "Configurez un script qui lance Claude Code sur chaque PR pour faire une review automatique (sécurité, perf, style). Intégrez-le dans votre workflow GitHub Actions.",
      hint: "claude --print 'Review ce diff pour bugs, sécurité et perf' dans votre workflow CI",
    },
  ],

  "bash": [
    {
      level: "débutant",
      icon: "💻",
      title: "Déléguez vos commandes répétitives",
      description:
        "Pensez à 3 commandes bash que vous tapez régulièrement mais que vous devez chercher (docker, ffmpeg, imagemagick, etc.). Demandez à Claude de les exécuter pour vous.",
      hint: "\"Compresse toutes les images PNG du dossier public/ en gardant une qualité correcte\"",
    },
    {
      level: "intermédiaire",
      icon: "🔧",
      title: "Script d'automatisation",
      description:
        "Identifiez une tâche manuelle récurrente (deploy, backup, cleanup). Demandez à Claude de créer un script bash pour l'automatiser, avec gestion des erreurs.",
      hint: "Décrivez ce que vous faites manuellement : Claude transforme ça en script robuste",
    },
    {
      level: "avancé",
      icon: "⚙️",
      title: "Pipeline de dev complet",
      description:
        "Demandez à Claude de créer un Makefile (ou package.json scripts) qui orchestre tout votre workflow : install, lint, test, build, deploy : avec les bonnes dépendances entre étapes.",
      hint: "\"Créez un Makefile avec les targets : dev, test, build, deploy, clean : avec les bonnes dépendances\"",
    },
  ],

  // ── MODULE 5 : CONFIGURATION AVANCÉE ─────────────────────
  "settings": [
    {
      level: "débutant",
      icon: "⚙️",
      title: "Créez votre premier settings.json",
      description:
        "Créez un ~/.claude/settings.json avec les outils autorisés pour votre workflow habituel. Lancez Claude Code et vérifiez qu'il ne demande plus confirmation pour ces outils.",
      hint: "Commencez minimal : autorise Read, Edit, Bash(npm *), Bash(git *)",
    },
    {
      level: "intermédiaire",
      icon: "🛡️",
      title: "Settings d'équipe",
      description:
        "Créez un .claude/settings.json dans un projet d'équipe qui bloque les commandes dangereuses et standardise les outils autorisés. Documentez chaque règle.",
      hint: "Deny: rm -rf, sudo, curl vers l'extérieur : Allow: npm, git, tests locaux",
    },
    {
      level: "avancé",
      icon: "🔐",
      title: "Profils par projet",
      description:
        "Configurez des settings différents pour vos projets perso (permissif) et pro (restrictif). Utilisez les .claude/settings.local.json pour vos overrides personnels.",
      hint: "Local = non-versionné = vos préférences perso sans impacter l'équipe",
    },
  ],

  "mcp": [
    {
      level: "débutant",
      icon: "🔌",
      title: "Connectez votre premier MCP server",
      description:
        "Configurez le MCP server GitHub officiel (@modelcontextprotocol/server-github) et demandez à Claude de lister les issues ouvertes d'un de vos repos.",
      hint: "npx -y @modelcontextprotocol/server-github dans mcpServers de settings.json",
    },
    {
      level: "intermédiaire",
      icon: "🗄️",
      title: "Claude qui requêvous votre BDD",
      description:
        "Configurez le MCP server PostgreSQL (ou SQLite). Demandez à Claude d'analyser vos données, de trouver des anomalies et de proposer des optimisations de requêvos.",
      hint: "\"Analyse la table users, trouve les comptes inactifs depuis 90 jours et propose un script de nettoyage\"",
    },
    {
      level: "avancé",
      icon: "🛠️",
      title: "Créez votre MCP server custom",
      description:
        "Identifiez un outil interne (API interne, système de tickets, monitoring) et créez un MCP server minimal qui l'expose à Claude. Connectez et testez.",
      hint: "Commencez par 1 seul outil exposé : un GET endpoint suffit pour valider le concept",
    },
  ],

  "hooks": [
    {
      level: "débutant",
      icon: "🪝",
      title: "Auto-format après chaque édition",
      description:
        "Configurez un hook PostToolUse qui lance Prettier automatiquement sur chaque fichier que Claude modifie. Plus jamais de fichiers non-formatés.",
      hint: "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null || true",
    },
    {
      level: "intermédiaire",
      icon: "📋",
      title: "Log d'audit des commandes",
      description:
        "Créez un hook qui enregistre dans un fichier toutes les commandes bash que Claude exécute, avec timestamp et projet. Idéal pour les environnements sensibles.",
      hint: "jq -r '.tool_input.command' | sed \"s/^/$(date) | /\" >> ~/.claude/audit.log",
    },
    {
      level: "avancé",
      icon: "🔔",
      title: "Notification de fin de tâche",
      description:
        "Créez un hook de notification (Slack, email, ou même une notification macOS) qui se déclenche quand Claude termine une tâche longue. Fini d'attendre devant l'écran.",
      hint: "osascript -e 'display notification \"Claude a terminé\" with title \"Claude Code\"'",
    },
  ],

  // ── MODULE 6 : MÉMOIRE & CONTEXTE ─────────────────────────
  "claude-md": [
    {
      level: "débutant",
      icon: "📄",
      title: "Créez votre premier CLAUDE.md",
      description:
        "Sur votre projet principal, demandez à Claude de générer un CLAUDE.md complet en explorant le codebase. Lisez-le, corrigez les inexactitudes et sauvegardez.",
      hint: "\"Explorez ce projet et créez un CLAUDE.md avec la stack, les conventions et les commandes importantes\"",
    },
    {
      level: "intermédiaire",
      icon: "📚",
      title: "CLAUDE.md d'équipe avec règles métier",
      description:
        "Enrichissez votre CLAUDE.md avec les règles métier implicites de votre domaine : les choses qu'un nouveau dev doit savoir et que Claude ne peut pas deviner seul.",
      hint: "Ajoutez une section \"Règles métier\" avec les invariants, les cas limites, les décisions d'archi",
    },
    {
      level: "avancé",
      icon: "🗂️",
      title: "Hiérarchie de CLAUDE.md par module",
      description:
        "Créez des CLAUDE.md dans les sous-dossiers critiques (src/auth/, src/payments/) avec des instructions spécifiques à chaque domaine. Vérifiez que Claude les respecte.",
      hint: "Chaque sous-dossier a ses propres conventions : un seul CLAUDE.md à la racine ne suffit pas",
    },
  ],

  "memory-system": [
    {
      level: "débutant",
      icon: "🧠",
      title: "Configurez vos préférences",
      description:
        "Dites à Claude 5 choses sur vos préférences de travail (langage préféré, style de réponse, niveau d'explication). Vérifiez qu'il s'en souvient dans une nouvelle session.",
      hint: "\"Souviens-vous que je préfère les réponses courtes, le TypeScript strict et les commits en anglais\"",
    },
    {
      level: "intermédiaire",
      icon: "📝",
      title: "Conservez les décisions d'architecture",
      description:
        "Après une session où vous avez pris des décisions importantes (choix d'une lib, pattern adopté), demande à Claude de mémoriser ces décisions pour les sessions futures.",
      hint: "\"Mémorisez ces décisions d'architecture pour ce projet\" : il crée les fichiers de mémoire",
    },
    {
      level: "avancé",
      icon: "🔄",
      title: "Audit et nettoyage de la mémoire",
      description:
        "Explorez vos fichiers de mémoire (~/.claude/memory/). Identifiez les mémoires obsolèvos ou incorrectes. Demandez à Claude de les mettre à jour ou de les supprimer.",
      hint: "\"Montrez-moi toutes vos mémoires sur ce projet et dis-moi lesquelles sont encore valides\"",
    },
  ],

  "context-management": [
    {
      level: "débutant",
      icon: "🧹",
      title: "Pratiquez /compact intelligemment",
      description:
        "Lancez une session de 20 min sur un projet. Quand vous sentez que les réponses sont moins précises, utilisez /compact. Observez la différence avant/après.",
      hint: "/status vous montre le % de contexte utilisé : compacte autour de 70%",
    },
    {
      level: "intermédiaire",
      icon: "🎯",
      title: "Session ciblée vs session large",
      description:
        "Comparez deux approches : une session longue fourre-tout vs des sessions courtes et ciblées (une par tâche). Laquelle produit les meilleurs résultats ?",
      hint: "Sessions courtes + CLAUDE.md bien fait = meilleure qualité que longue session sans structure",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Optimisez le ratio tokens/résultats",
      description:
        "Sur une tâche complexe, comparez le coût (/cost) entre : une session naive vs la même tâche avec /compact et contexte ciblé. Calculez votre ROI.",
      hint: "Un bon CLAUDE.md peut réduire les tokens de 30-50% en évitant les re-explications",
    },
  ],

  // ── MODULE 7 : PRODUCTIVITÉ ───────────────────────────────
  "slash-commands": [
    {
      level: "débutant",
      icon: "⚡",
      title: "Utilisez /commit tous les jours",
      description:
        "Pendant une semaine, utilisez /commit pour tous vos commits au lieu de git commit manuel. Comparez la qualité des messages : les vôtres vs ceux de Claude.",
      hint: "Spoiler : les messages de Claude seront meilleurs et plus consistants",
    },
    {
      level: "intermédiaire",
      icon: "🛠️",
      title: "Créez votre premier skill",
      description:
        "Identifiez une tâche que vous faites souvent avec Claude (ex: générer des tests, faire une review de sécurité). Transforme-la en skill dans ~/.claude/commands/.",
      hint: "Un skill = un fichier .md avec les instructions détaillées de la tâche",
    },
    {
      level: "avancé",
      icon: "🤝",
      title: "Skills partagés en équipe",
      description:
        "Créez 3 skills utiles pour votre équipe dans .claude/commands/ (versionné). Présentez-les à l'équipe. Objectif : uniformiser les workflows avec Claude.",
      hint: "Bons skills d'équipe : /review-pr, /add-tests, /update-changelog, /check-security",
    },
  ],

  "keyboard-shortcuts": [
    {
      level: "débutant",
      icon: "⌨️",
      title: "Mémorisez les 5 raccourcis essentiels",
      description:
        "Ctrl+C, Escape, ↑/↓, Ctrl+L, Shift+Enter. Pratiquez chacun 3 fois maintenant. Ces 5 raccourcis couvrent 90% de vos besoins quotidiens.",
      hint: "Ctrl+C = interrompre Claude | Escape = annuler votre saisie | Shift+Enter = nouvelle ligne",
    },
    {
      level: "intermédiaire",
      icon: "🚀",
      title: "Configurez vos raccourcis custom",
      description:
        "Créez ~/.claude/keybindings.json avec au moins 2 raccourcis personnalisés qui correspondent à vos habitudes (ex: votre raccourci pour ouvrir Claude depuis VS Code).",
      hint: "Lancez /keybindings pour avoir un guide interactif de configuration",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Challenge vitesse : 0 souris pendant 1h",
      description:
        "Pendant une heure, utilisez Claude Code sans toucher la souris. Tout au clavier : navigation, édition, validation. Mesurez votre productivité avant vs après.",
      hint: "Le mode clavier seul force à utiliser les raccourcis : vous découvrez les patterns les plus efficaces",
    },
  ],

  "tips": [
    {
      level: "débutant",
      icon: "💡",
      title: "Vos 3 prompts signature",
      description:
        "Écris les 3 types de prompts que vous utilisez le plus souvent. Affinez-les jusqu'à ce qu'ils produisent systématiquement d'excellents résultats. Sauvegardez-les.",
      hint: "Un bon prompt signature : contexte + objectif + contraintes + format de sortie attendu",
    },
    {
      level: "intermédiaire",
      icon: "🔢",
      title: "Multi-terminaux en parallèle",
      description:
        "Ouvrez 3 terminaux avec Claude Code sur 3 branches différentes. Travaille en parallèle sur 3 features. Mesurez combien de features vous terminez en 1 heure.",
      hint: "Chaque terminal = un contexte séparé = 0 interference entre les tâches",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Intégrez Claude Code dans votre CI/CD",
      description:
        "Mettez en place Claude Code dans votre pipeline GitHub Actions pour : review automatique des PR, génération de changelog, vérification des breaking changes.",
      hint: "claude --print --output-format json dans vos workflows : parse le JSON pour les checks",
    },
  ],

  // ── MODULE 8 : TOKENS & MODÈLES ───────────────────────────
  "how-models-work": [
    {
      level: "débutant",
      icon: "🧮",
      title: "Comptez vos tokens",
      description:
        "Prenez un fichier de 100 lignes de votre projet. Estimez le nombre de tokens (règle : ~4 caractères = 1 token en anglais, ~5 en français). Vérifiez avec /status.",
      hint: "1 fichier de 100 lignes ≈ 800-1500 tokens selon le contenu",
    },
    {
      level: "intermédiaire",
      icon: "🎯",
      title: "Optimisez l'ordre de votre contexte",
      description:
        "Réorganisez votre CLAUDE.md pour que les instructions les plus importantes soient au début (haute attention) et les infos générales à la fin. Testez si ça change les résultats.",
      hint: "Le modèle accorde plus d'attention au début et à la fin : les instructions critiques vont là",
    },
    {
      level: "avancé",
      icon: "⚡",
      title: "Benchmark attention sur votre projet",
      description:
        "Comparez les résultats sur une même tâche avec un contexte court (fichiers pertinents seulement) vs contexte large (tout le projet). Mesurez qualité et coût.",
      hint: "Contexte ciblé = moins de tokens + meilleure attention = meilleur résultat moins cher",
    },
  ],

  "pricing": [
    {
      level: "débutant",
      icon: "💰",
      title: "Calculez votre budget mensuel",
      description:
        "Estimez votre usage mensuel de Claude Code basé sur vos habitudes (nb de sessions, durée, complexité). Calculez le coût avec les tarifs Sonnet. Est-ce viable ?",
      hint: "Une session de 1h ≈ 50k-200k tokens input selon l'intensité. Sonnet ≈ $3/MTok input.",
    },
    {
      level: "intermédiaire",
      icon: "📊",
      title: "Audit d'une semaine de sessions",
      description:
        "Pendant une semaine, notez /cost après chaque session. Identifiez quelles sessions coûtent cher vs peu. Y a-t-il des patterns pour réduire sans perdre en qualité ?",
      hint: "Les sessions longues sans /compact coûtent souvent 3-5x plus que les sessions bien gérées",
    },
    {
      level: "avancé",
      icon: "🎯",
      title: "Stratégie de choix de modèle",
      description:
        "Définissez des règles claires pour vous : quand utiliser Haiku, Sonnet, Opus. Appliquez ces règles pendant 2 semaines. Mesurez le coût total vs qualité obtenue.",
      hint: "Règle simple : Haiku=CI/scripts, Sonnet=dev quotidien, Opus=architecture/debugging complexe",
    },
  ],

  // ── MODULE 9 : PLAN MODE & AGENTS ─────────────────────────
  "plan-mode": [
    {
      level: "débutant",
      icon: "📋",
      title: "Votre premier plan d'implémentation",
      description:
        "Avant de coder votre prochaine feature, demandez un plan à Claude. Lisez le plan, pose des questions, demandez des clarifications. Validez seulement quand vous êvos d'accord.",
      hint: "\"Avant de commencer, fais-moi un plan détaillé de comment vous allez implémenter X\"",
    },
    {
      level: "intermédiaire",
      icon: "🔄",
      title: "Plan → feedback → exécution",
      description:
        "Demandez un plan, modifie 2-3 aspects basés sur votre connaissance du projet, valide le plan modifié, puis lancez l'exécution. Mesurez le nb de \"retraits\" vs sans plan.",
      hint: "Un bon plan évite 80% des aller-retours : l'investissement de 5min vaut les 30min économisées",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Plan pour une migration complexe",
      description:
        "Prenez la migration la plus complexe de votre backlog (changement de BDD, migration auth, upgrade majeur). Demandez un plan complet avec estimation des risques et stratégie de rollback.",
      hint: "Un plan de migration inclut : ordre d'exécution, points de rollback, tests de validation",
    },
  ],

  "subagents": [
    {
      level: "débutant",
      icon: "🔍",
      title: "Subagent pour explorer sans polluer",
      description:
        "Sur un gros projet, utilisez un subagent Explorez pour comprendre l'architecture d'un module inconnu. Observez que votre contexte principal reste propre.",
      hint: "\"Utilisez un subagent pour explorer src/payments/ et me faire un rapport de l'architecture\"",
    },
    {
      level: "intermédiaire",
      icon: "⚡",
      title: "Tâches en parallèle",
      description:
        "Lancez 3 subagents en parallèle sur 3 modules différents pour générer leurs tests unitaires. Comparez le temps total vs séquentiel.",
      hint: "\"Lancez 3 subagents en parallèle : génère les tests pour auth/, payments/ et users/\"",
    },
    {
      level: "avancé",
      icon: "🤖",
      title: "Agent de recherche spécialisé",
      description:
        "Créez un workflow où un subagent recherche la doc officielle d'une lib et rapporte les best practices, puis l'agent principal implémente selon ces guidelines.",
      hint: "Séparation claire : subagent=recherche, agent principal=implémentation",
    },
  ],

  "multi-agent": [
    {
      level: "débutant",
      icon: "🔱",
      title: "Orchestration simple",
      description:
        "Divisez une tâche en 2 sous-tâches indépendantes, déléguez chacune à un subagent, récupérez et consolidez les résultats. Ex: générer tests + docs en parallèle.",
      hint: "\"Générez les tests ET la documentation de ce module en parallèle avec 2 subagents\"",
    },
    {
      level: "intermédiaire",
      icon: "🏭",
      title: "Pipeline de qualité automatisé",
      description:
        "Créez un workflow multi-agents : agent 1 = implémente la feature, agent 2 = review sécurité, agent 3 = génère les tests. L'orchestrateur consolide.",
      hint: "Chaque agent a un rôle strict : évitez les chevauchements de responsabilités",
    },
    {
      level: "avancé",
      icon: "🌐",
      title: "Migration codebase entière",
      description:
        "Planifiez une migration de codebase (JS→TS, old patterns→new) en utilisant des agents parallèles par module. Créez l'orchestration et exécutez sur un sous-ensemble de test.",
      hint: "Commencez par 3-5 modules pour valider le workflow avant de scaler à tout le projet",
    },
  ],

  // ── MODULE 10 : PROJET SAAS ───────────────────────────────
  "project-setup": [
    {
      level: "débutant",
      icon: "🚀",
      title: "Préparez votre projet en 10 minutes",
      description:
        "Choisissez un projet perso que vous voulez créer. Demandez à Claude de créer la structure complèvous, installer les dépendances, configurer TypeScript/ESLint/Prettier en 1 seul prompt.",
      hint: "\"Créez un projet [nom] avec [stack]. Structure les dossiers, configurez les outils, écrivez le CLAUDE.md\"",
    },
    {
      level: "intermédiaire",
      icon: "🏗️",
      title: "Feature complèvous en TDD",
      description:
        "Sur votre projet SaaS, choisis une feature (ex: auth, payments, notifications). Demandez à Claude de l'implémenter complètement avec tests, en utilisant le Plan Mode d'abord.",
      hint: "Plan → validation → implémentation → tests → commit → PR. Le workflow complet.",
    },
    {
      level: "avancé",
      icon: "🌐",
      title: "Déploiement automatisé",
      description:
        "Configurez un workflow complet : Claude Code génère le code, les tests passent, Vercel déploie automatiquement. Zéro intervention manuelle entre le prompt et la prod.",
      hint: "git push → GitHub Actions (tests) → Vercel (deploy). Claude code, vous relisez, vous publiez.",
    },
  ],

  "existing-project": [
    {
      level: "débutant",
      icon: "🔍",
      title: "Onboarding Claude sur votre projet legacy",
      description:
        "Sur votre projet le plus legacy, demandez à Claude de générer un CLAUDE.md complet. Lisez-le et corrigez : c'est le meilleur moyen de documenter ce que personne ne comprend.",
      hint: "\"Explorez ce projet legacy et créez un CLAUDE.md : architecture, patterns, pièges à éviter\"",
    },
    {
      level: "intermédiaire",
      icon: "🧹",
      title: "Quick wins sur la dette technique",
      description:
        "Demandez à Claude d'identifier les 5 quick wins de dette technique (haute valeur, faible risque). Exécutez-les en une session, avec tests à l'appui.",
      hint: "\"Identifiez les 5 améliorations les plus impactantes et les moins risquées de ce codebase\"",
    },
    {
      level: "avancé",
      icon: "🏗️",
      title: "Migration progressive avec feature flags",
      description:
        "Planifiez une migration d'une partie critique de votre legacy (ex: l'auth) en utilisant des feature flags pour un déploiement progressif sans risque.",
      hint: "Feature flags = deploy en prod sans activer = rollback instantané si problème",
    },
  ],

  "professional-tips": [
    {
      level: "débutant",
      icon: "📈",
      title: "Mesurez votre avant/après",
      description:
        "Pendant une semaine normale (sans Claude Code intensif), note le temps par tâche. La semaine suivante avec Claude Code, notez les mêmes métriques. Calculez votre ROI.",
      hint: "Métriques : features livrées, bugs fixés, temps de review, temps de setup",
    },
    {
      level: "intermédiaire",
      icon: "👥",
      title: "Convertissez un collègue",
      description:
        "Présentez Claude Code à un collègue sceptique. Faites une démo live de 15 min sur un vrai problème qu'il a. Objectif : lui montrer une chose qu'il ne croyait pas possible.",
      hint: "Choisissez un problème concret qu'il a en ce moment : l'abstraction convainc moins que le résultat",
    },
    {
      level: "avancé",
      icon: "🏆",
      title: "Construisez votre stack Claude Code idéal",
      description:
        "Documentez votre setup complet : settings.json, skills customs, CLAUDE.md templates, hooks, MCP servers. Partagez-le avec la communauté ou votre équipe.",
      hint: "Votre setup = votre productivité personnalisée. Plus il est documenté, plus il est transmissible.",
    },
  ],
};
