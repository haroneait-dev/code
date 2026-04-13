export interface CodeExample {
  lang: string;
  label?: string;
  code: string;
}

export interface Callout {
  type: "tip" | "warn" | "info" | "success";
  icon: string;
  text: string;
}

export interface Exercise {
  level: "débutant" | "intermédiaire" | "avancé";
  icon: string;
  title: string;
  description: string;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  tag?: string;
  intro: string;
  sections: LessonSection[];
  exercises?: Exercise[];
}

export interface LessonSection {
  heading?: string;
  body?: string;
  code?: CodeExample;
  callout?: Callout;
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  keypoints?: string[];
}

export interface Module {
  id: string;
  title: string;
  emoji: string;
  color: string;
  lessons: Lesson[];
}

export const curriculum: Module[] = [
  // ─────────────────────────────────────────────────────────
  // MODULE 1 — INTRODUCTION
  // ─────────────────────────────────────────────────────────
  {
    id: "intro",
    title: "Introduction",
    emoji: "🚀",
    color: "#7c3aed",
    lessons: [
      {
        id: "chatting-vs-delegating",
        title: "Chatter vs Déléguer — le mindset qui change tout",
        duration: "6 min",
        tag: "Mindset",
        intro:
          "La majorité des gens utilisent Claude pour chatter — poser des questions, obtenir des réponses, comme un moteur de recherche amélioré. Les experts, eux, délèguent — ils confient des missions entières à Claude et récupèrent des résultats concrets. Cette leçon est la plus importante de toute la formation.",
        sections: [
          {
            heading: "La différence fondamentale",
            body: "Chatter, c'est demander à Claude d'écrire une fonction. Déléguer, c'est lui confier d'implémenter toute la feature d'authentification, de la tester, de la committer et d'ouvrir la PR — pendant que vous faites autre chose.",
          },
          {
            table: {
              headers: ["💬 Chatter (débutant)", "🚀 Déléguer (expert)"],
              rows: [
                ["\"Écris-moi une fonction de tri\"", "\"Implémenter le tri et la pagination sur /api/products\""],
                ["Une réponse, une action", "Un objectif, N actions autonomes"],
                ["Vous guidez chaque étape", "Claude planifie et exécute seul"],
                ["Résultat : un bout de code", "Résultat : une feature complète et testée"],
                ["Gain de temps : 10 min", "Gain de temps : 2-4 heures"],
              ],
            },
          },
          {
            heading: "Pourquoi la plupart restent bloqués en mode \"chat\"",
            bullets: [
              "Ils ont appris Claude comme un chatbot — ancrer sa réponse immédiate",
              "Ils ne font pas confiance à l'IA pour prendre des décisions",
              "Ils ne savent pas comment structurer une mission complète",
              "Ils n'ont pas de CLAUDE.md pour donner le contexte projet",
            ],
          },
          {
            heading: "Le shift mental à opérer",
            body: "Arrêtez de voir Claude comme un assistant qui répond à vos questions. Commencez à le voir comme un senior dev à qui vous confiez des missions. Vous définissez l'objectif et les contraintes — Claude gère l'exécution.",
          },
          {
            callout: {
              type: "success",
              icon: "🎯",
              text: "<strong>La règle des 5 minutes :</strong> Si expliquer ce que vous voulez prend plus de 5 min, c'est que vous pensez encore en \"chat\". Une vraie délégation tient en 2-3 phrases claires sur l'objectif final.",
            },
          },
          {
            heading: "Exemples de vraie délégation",
            code: {
              lang: "text",
              label: "Prompts de délégation (pas de chat)",
              code: `# ❌ Chat : micro-instructions
> écris une fonction qui prend un email en paramètre
> maintenant ajoute la validation
> maintenant ajoute les tests

# ✅ Délégation : mission complète
> dans src/auth/, crée un système de validation d'email
  robuste avec tests unitaires, gestion des edge cases
  (emails internationaux, sous-domaines) et intégration
  au formulaire existant dans components/RegisterForm.tsx

# ✅ Délégation encore plus forte
> les users se plaignent que le login est lent.
  Trouve pourquoi, corrige, teste et commit.`,
            },
          },
        ],
        exercises: [
          {
            level: "débutant",
            icon: "✍️",
            title: "Convertis un prompt \"chat\" en délégation",
            description: "Prends ce prompt : \"Comment créer un composant Button en React ?\" et réécris-le en mode délégation — donne une vraie mission à Claude avec contexte et objectif final.",
            hint: "Pense à : quel est le vrai résultat que tu veux ? Dans quel projet ? Avec quelles contraintes ?",
          },
          {
            level: "intermédiaire",
            icon: "🚀",
            title: "Ta première vraie délégation",
            description: "Ouvre Claude Code sur un projet réel (ou crée un dossier test). Délègue-lui la création d'un fichier README.md complet basé sur la structure du projet — sans lui donner d'instructions step-by-step.",
            hint: "Dis juste : \"analyse ce projet et génère un README.md complet et professionnel\"",
          },
          {
            level: "avancé",
            icon: "🏆",
            title: "Mission autonome de bout en bout",
            description: "Donne à Claude une mission qui touche au moins 5 fichiers différents. Observe comment il planifie, exécute et itère sans que tu intervienne. Note ce qui t'a surpris.",
            hint: "Ex: \"Ajoute un système de logging structuré (Winston/Pino) à toutes les routes API de ce projet\"",
          },
        ],
      },
      {
        id: "what-is-cc",
        title: "Qu'est-ce que Claude Code ?",
        duration: "5 min",
        tag: "Fondamentaux",
        intro:
          "Claude Code est le CLI officiel d'Anthropic qui amène Claude directement dans votre terminal. C'est un agent de codage autonome capable de lire, écrire, éditer des fichiers, exécuter des commandes shell, interagir avec Git et bien plus encore.",
        exercises: [
          {
            level: "débutant",
            icon: "🔍",
            title: "Explore la doc officielle",
            description: "Va sur claude.ai et demande à Claude de t'expliquer la différence entre l'interface web et Claude Code CLI. Note 3 choses que Claude Code peut faire que le chat ne peut pas.",
            hint: "Focus sur : filesystem, terminal, autonomie",
          },
          {
            level: "intermédiaire",
            icon: "⚡",
            title: "Compare avec GitHub Copilot",
            description: "Si tu as déjà utilisé Copilot ou Cursor, écris un court paragraphe sur la différence fondamentale d'approche entre un outil d'autocomplétion et un agent autonome comme Claude Code.",
            hint: "La clé : autocomplete réagit à votre code, Claude Code agit sur votre projet",
          },
          {
            level: "avancé",
            icon: "🏗️",
            title: "Identifie 5 cas d'usage dans ton projet actuel",
            description: "Prends ton projet principal et liste 5 tâches répétitives ou complexes que tu pourrais déléguer à Claude Code dès aujourd'hui. Estime le temps gagné par tâche.",
            hint: "Types de tâches : refactoring, génération de tests, documentation, migrations, review",
          },
        ],
        sections: [
          {
            heading: "Un agent, pas un simple chatbot",
            body: "Contrairement à l'interface web de Claude, Claude Code a accès à votre système de fichiers, à votre terminal et à vos outils de développement. Il peut exécuter du code, lancer des tests, créer des commits et ouvrir des PR de façon autonome.",
          },
          {
            callout: {
              type: "info",
              icon: "💡",
              text: "<strong>Définition :</strong> Claude Code est un \"agentic coding assistant\" — il planifie, agit et itère jusqu'à atteindre l'objectif, sans que vous ayez à tout détailler step by step.",
            },
          },
          {
            heading: "Ce que Claude Code peut faire",
            bullets: [
              "Lire et comprendre n'importe quel codebase en profondeur",
              "Créer, modifier, supprimer des fichiers avec précision",
              "Exécuter des commandes bash, lancer des tests, builder des projets",
              "Faire des opérations Git (commit, branch, merge, PR)",
              "Se connecter à des services externes via MCP servers",
              "Se souvenir du contexte grâce aux fichiers CLAUDE.md et à la mémoire persistante",
              "Exécuter des tâches complexes en plusieurs étapes de façon autonome",
            ],
          },
          {
            heading: "Pourquoi c'est différent des autres outils IA",
            body: "Des outils comme GitHub Copilot sont des assistants d'auto-complétion intégrés dans l'IDE. Claude Code est un agent entier qui comprend le contexte global du projet, peut naviguer dans de larges codebases, et exécuter des workflows complets de A à Z.",
          },
          {
            callout: {
              type: "tip",
              icon: "🎯",
              text: "<strong>Cas d'usage idéaux :</strong> Refactoring de code legacy, implémentation de features complexes, debugging difficile, revue de PR, génération de tests, migration de dépendances.",
            },
          },
        ],
      },
      {
        id: "installation",
        title: "Installation & Configuration",
        duration: "8 min",
        tag: "Setup",
        intro:
          "L'installation de Claude Code se fait en une commande npm. Vous aurez besoin d'une clé API Anthropic et de Node.js ≥ 18.",
        sections: [
          {
            heading: "Prérequis",
            bullets: [
              "Node.js version 18 ou supérieure",
              "npm ou yarn",
              "Un compte Anthropic avec accès API",
              "Une clé API Anthropic (console.anthropic.com)",
            ],
          },
          {
            heading: "Installation globale",
            code: {
              lang: "bash",
              label: "Terminal",
              code: `# Installation via npm (recommandé)
npm install -g @anthropic-ai/claude-code

# Vérifier la version installée
claude --version

# Lancer Claude Code pour la première fois
claude`,
            },
          },
          {
            heading: "Configuration de la clé API",
            body: "Lors du premier lancement, Claude Code vous demandera votre clé API. Elle est stockée de façon sécurisée dans votre keychain système. Vous pouvez aussi la passer via une variable d'environnement.",
            code: {
              lang: "bash",
              label: "~/.zshrc ou ~/.bashrc",
              code: `# Option 1 : variable d'environnement (dans votre shell config)
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Option 2 : lors du premier lancement interactif
# Claude Code vous guidera dans la configuration`,
            },
          },
          {
            callout: {
              type: "warn",
              icon: "⚠️",
              text: "<strong>Sécurité :</strong> Ne committez jamais votre clé API dans un dépôt Git. Utilisez des variables d'environnement ou votre keychain système.",
            },
          },
          {
            heading: "Intégration IDE (VS Code)",
            body: "Claude Code dispose d'une extension officielle pour VS Code qui ajoute une interface graphique dans votre sidebar et permet d'utiliser Claude Code directement depuis l'éditeur.",
            code: {
              lang: "bash",
              label: "VS Code",
              code: `# Dans VS Code, ouvrir le terminal intégré et lancer :
claude

# Ou installer l'extension depuis le marketplace :
# Rechercher "Claude Code" dans les extensions VS Code`,
            },
          },
          {
            callout: {
              type: "success",
              icon: "✅",
              text: "Claude Code est aussi disponible sur <strong>JetBrains IDE</strong> (IntelliJ, WebStorm, PyCharm...), en <strong>desktop app</strong> Mac/Windows, et sur <strong>claude.ai/code</strong>.",
            },
          },
        ],
      },
      {
        id: "first-steps",
        title: "Premiers pas dans le terminal",
        duration: "6 min",
        tag: "Pratique",
        intro:
          "Une fois Claude Code installé, découvrons comment naviguer dans l'interface, envoyer des messages et comprendre les réponses.",
        sections: [
          {
            heading: "Lancer Claude Code",
            code: {
              lang: "bash",
              label: "Terminal",
              code: `# Depuis n'importe quel répertoire
claude

# Dans un projet spécifique
cd mon-projet
claude

# Avec un message direct (mode non-interactif)
claude "explique la structure de ce projet"`,
            },
          },
          {
            heading: "L'interface interactive",
            body: "Une fois lancé, vous verrez un prompt où vous tapez vos instructions. Claude Code affiche ses actions en temps réel : les fichiers qu'il lit, les commandes qu'il exécute, et les fichiers qu'il modifie. Vous pouvez approuver ou refuser chaque action.",
          },
          {
            callout: {
              type: "info",
              icon: "🔍",
              text: "<strong>Mode de permission :</strong> Par défaut, Claude Code vous demande confirmation avant d'exécuter des actions potentiellement destructives (suppression, écriture réseau, etc.). Vous pouvez configurer ce comportement dans les settings.",
            },
          },
          {
            heading: "Exemples de premières interactions",
            code: {
              lang: "text",
              label: "Exemples de prompts",
              code: `> explique-moi la structure de ce projet

> quels sont les bugs dans src/auth.ts ?

> crée un composant React Button avec TypeScript

> lance les tests et dis-moi ce qui échoue

> fais un commit de tous les changements actuels`,
            },
          },
          {
            heading: "Interrompre une action",
            table: {
              headers: ["Raccourci", "Action"],
              rows: [
                ["Ctrl+C", "Interrompre l'action en cours"],
                ["Escape", "Annuler la saisie actuelle"],
                ["Ctrl+L", "Vider l'écran"],
                ["↑ / ↓", "Naviguer dans l'historique"],
              ],
            },
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 2 — OUTILS FICHIERS
  // ─────────────────────────────────────────────────────────
  {
    id: "files",
    title: "Outils Fichiers",
    emoji: "📁",
    color: "#3b82f6",
    lessons: [
      {
        id: "read-tool",
        title: "Lire des fichiers (Read)",
        duration: "5 min",
        tag: "Core Tool",
        intro:
          "L'outil Read est le point d'entrée de Claude Code pour explorer votre codebase. Il lit les fichiers texte, images, PDFs et notebooks Jupyter.",
        sections: [
          {
            heading: "Comment fonctionne l'outil Read",
            body: "Quand vous demandez à Claude de comprendre votre code, il utilise automatiquement l'outil Read pour accéder aux fichiers. Vous n'avez pas à le spécifier — Claude décide seul des fichiers à lire selon votre demande.",
          },
          {
            code: {
              lang: "text",
              label: "Exemples de prompts déclenchant Read",
              code: `> lis le fichier src/utils/auth.ts et explique-le moi

> qu'est-ce que fait la fonction parseUser dans models/user.ts ?

> compare app.js et server.js

> résume le contenu de README.md`,
            },
          },
          {
            heading: "Lecture partielle de grands fichiers",
            body: "Pour les fichiers volumineux, Claude Code peut lire par plages de lignes grâce aux paramètres offset et limit. Cela évite de charger tout le fichier en mémoire.",
          },
          {
            callout: {
              type: "tip",
              icon: "💡",
              text: "<strong>Astuce :</strong> Vous pouvez demander à Claude de lire plusieurs fichiers en même temps en les citant dans le même message. Claude les lira en parallèle pour plus d'efficacité.",
            },
          },
          {
            heading: "Formats supportés",
            bullets: [
              "Fichiers texte (.ts, .js, .py, .go, .rs, .java, .md, etc.)",
              "Images (.png, .jpg, .gif, .webp) — Claude les \"voit\"",
              "PDFs — lecture jusqu'à 20 pages par requête",
              "Notebooks Jupyter (.ipynb) — code, texte et outputs",
            ],
          },
        ],
      },
      {
        id: "write-tool",
        title: "Créer des fichiers (Write)",
        duration: "5 min",
        tag: "Core Tool",
        intro:
          "L'outil Write permet à Claude de créer de nouveaux fichiers ou de réécrire entièrement des fichiers existants. Il est utilisé pour la génération de code.",
        sections: [
          {
            heading: "Créer de nouveaux fichiers",
            code: {
              lang: "text",
              label: "Prompts exemples",
              code: `> crée un fichier utils/formatDate.ts avec des fonctions
  de formatage de dates en TypeScript

> génère un fichier de config ESLint pour un projet React/TS

> crée un Dockerfile pour une app Node.js Express`,
            },
          },
          {
            callout: {
              type: "warn",
              icon: "⚠️",
              text: "<strong>Attention :</strong> Write <em>écrase</em> le contenu existant. Pour modifier partiellement un fichier existant, préférez l'outil Edit qui ne remplace que les sections modifiées.",
            },
          },
          {
            heading: "Bonne pratique : Read avant Write",
            body: "Claude Code lit toujours un fichier existant avant de le réécrire afin de conserver le contexte et d'éviter de perdre du code. Si vous lui demandez de créer un fichier qui existe déjà, il vous en informera.",
          },
          {
            heading: "Création de fichiers multiples",
            code: {
              lang: "text",
              label: "Exemple de prompt avancé",
              code: `> crée une feature d'authentification complète :
  - src/auth/authService.ts (logique métier)
  - src/auth/authRouter.ts (routes Express)
  - src/auth/authMiddleware.ts (middleware JWT)
  - src/auth/__tests__/auth.test.ts (tests unitaires)`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "🚀",
              text: "Claude peut créer plusieurs fichiers en une seule réponse. Pour des features complètes, demandez-lui de tout générer d'un coup avec le contexte de votre projet.",
            },
          },
        ],
      },
      {
        id: "edit-tool",
        title: "Éditer des fichiers (Edit)",
        duration: "7 min",
        tag: "Core Tool",
        intro:
          "L'outil Edit est le plus utilisé de Claude Code. Il effectue des remplacements précis de chaînes de caractères dans vos fichiers, sans toucher au reste du code.",
        sections: [
          {
            heading: "Fonctionnement du Edit",
            body: "Edit prend un old_string et un new_string. Il localise exactement old_string dans le fichier et le remplace par new_string. Si old_string n'est pas unique, Claude fournit plus de contexte pour le rendre unique.",
          },
          {
            code: {
              lang: "text",
              label: "Exemples de demandes d'édition",
              code: `> renomme la fonction getUserById en findUserById dans models/user.ts

> ajoute de la gestion d'erreur dans la fonction fetchData de api/client.ts

> convertis les callbacks en async/await dans src/legacy.js

> remplace tous les console.log par notre logger custom dans utils/`,
            },
          },
          {
            heading: "Éditions multiples simultanées",
            body: "Claude Code peut effectuer plusieurs Edit sur différents fichiers dans une même réponse. C'est très efficace pour les refactorings qui touchent plusieurs endroits.",
          },
          {
            callout: {
              type: "info",
              icon: "📝",
              text: "<strong>replace_all :</strong> Pour renommer une variable dans tout un fichier, Claude peut utiliser replace_all qui remplace toutes les occurrences d'un coup — idéal pour les renames de variables ou de fonctions.",
            },
          },
          {
            heading: "Vérification des changements",
            code: {
              lang: "bash",
              label: "Vérifier ce que Claude a modifié",
              code: `# Voir les changements non commités
git diff

# Voir les fichiers modifiés
git status

# Annuler si besoin
git checkout -- src/auth.ts`,
            },
          },
          {
            callout: {
              type: "success",
              icon: "✅",
              text: "<strong>Bonne pratique :</strong> Après un Edit important, demandez à Claude de <strong>lancer les tests</strong> pour vérifier que rien n'est cassé.",
            },
          },
        ],
      },
      {
        id: "glob-grep",
        title: "Recherche avec Glob & Grep",
        duration: "6 min",
        tag: "Core Tool",
        intro:
          "Glob et Grep permettent à Claude de naviguer efficacement dans de larges codebases : Glob pour trouver des fichiers par pattern, Grep pour chercher du texte dans les fichiers.",
        sections: [
          {
            heading: "L'outil Glob — trouver des fichiers",
            body: "Glob supporte les patterns de type *.js, **/*.tsx, src/**/*.test.ts etc. Il retourne les fichiers triés par date de modification.",
            code: {
              lang: "text",
              label: "Exemples d'usage de Glob",
              code: `> trouve tous les composants React dans le projet

> quels sont les fichiers de test présents ?

> liste tous les fichiers TypeScript dans src/

> trouve les fichiers qui ont été modifiés récemment`,
            },
          },
          {
            heading: "L'outil Grep — chercher dans le contenu",
            body: "Grep supporte les expressions régulières complètes. Il peut filtrer par type de fichier, afficher le contexte autour des matches, et compter les occurrences.",
            code: {
              lang: "text",
              label: "Exemples d'usage de Grep",
              code: `> cherche tous les usages de la fonction useAuth dans le projet

> où est-ce que l'on importe axios ?

> trouve tous les TODO et FIXME dans le code

> cherche les appels API qui utilisent /api/users`,
            },
          },
          {
            heading: "Combinaison puissante",
            body: "Claude combine souvent Glob et Grep pour naviguer dans votre codebase : d'abord Glob pour trouver les fichiers pertinents, puis Grep pour localiser le code précis, puis Read pour comprendre le contexte.",
          },
          {
            callout: {
              type: "tip",
              icon: "🔍",
              text: "<strong>Pour les grandes codebases :</strong> Guider Claude avec des paths spécifiques accélère la recherche. Ex: \"dans le dossier src/auth/\" plutôt que \"dans tout le projet\".",
            },
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 3 — CODE & DEBUG
  // ─────────────────────────────────────────────────────────
  {
    id: "code",
    title: "Code & Debug",
    emoji: "⚡",
    color: "#f97316",
    lessons: [
      {
        id: "code-gen",
        title: "Génération de code",
        duration: "8 min",
        tag: "Pratique",
        intro:
          "Claude Code excelle dans la génération de code de haute qualité. Plus vous lui donnez de contexte, plus le code généré sera précis et adapté à votre projet.",
        sections: [
          {
            heading: "Donner du contexte pour un meilleur résultat",
            body: "Avant de générer du code, Claude lit automatiquement les fichiers pertinents de votre projet pour comprendre les conventions, les types existants, les patterns utilisés.",
          },
          {
            code: {
              lang: "text",
              label: "Prompts de génération efficaces",
              code: `# Vague → résultat générique
> crée une fonction de validation

# Précis → résultat adapté au projet
> crée une fonction validateUserInput dans src/validators/user.ts
  qui valide le schéma UserCreateInput défini dans types/user.ts,
  utilise zod comme les autres validators du projet, et retourne
  un Result<ValidUser, ValidationError>`,
            },
          },
          {
            heading: "Génération de composants UI",
            code: {
              lang: "text",
              label: "Exemple React/Next.js",
              code: `> crée un composant DataTable réutilisable avec :
  - TypeScript generics pour les données
  - pagination côté client
  - tri par colonne
  - recherche/filtre
  - le même style que les composants dans src/ui/`,
            },
          },
          {
            heading: "Génération de tests",
            code: {
              lang: "text",
              label: "Génération de tests",
              code: `> génère les tests unitaires pour src/auth/authService.ts
  utilise Jest et les mocks pattern déjà en place dans __mocks__/

> ajoute des tests d'intégration pour l'endpoint POST /api/users
  avec les cas : création réussie, email dupliqué, données invalides`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "🎯",
              text: "<strong>Pro tip :</strong> Demandez à Claude de générer le code <em>puis</em> de le tester immédiatement. Claude lancera les tests et itèrera jusqu'à ce qu'ils passent.",
            },
          },
        ],
      },
      {
        id: "refactoring",
        title: "Refactoring de code",
        duration: "7 min",
        tag: "Pratique",
        intro:
          "Claude Code est excellent pour moderniser et améliorer du code existant. Il comprend le contexte global du projet avant de proposer des changements.",
        sections: [
          {
            heading: "Types de refactoring supportés",
            bullets: [
              "Migration callbacks → async/await → Promises",
              "Conversion JavaScript → TypeScript",
              "Extraction de fonctions et composants",
              "Suppression de code dupliqué (DRY)",
              "Optimisation des performances",
              "Migration de bibliothèques (ex: moment → date-fns)",
              "Mise à niveau des patterns React (class → hooks)",
            ],
          },
          {
            code: {
              lang: "text",
              label: "Exemples de refactoring",
              code: `> refactore utils/api.js pour utiliser async/await
  au lieu des callbacks, en gardant la même API publique

> convertis ce composant React class en functional component
  avec hooks dans src/components/UserProfile.jsx

> extrait la logique de validation de ce formulaire dans
  un custom hook useFormValidation

> remplace les magic strings par des enums TypeScript
  dans tout le dossier src/constants/`,
            },
          },
          {
            heading: "Refactoring progressif",
            body: "Pour les grands refactorings, il vaut mieux procéder par étapes. Demandez à Claude de faire un plan d'abord, puis d'exécuter chaque étape en vérifiant que les tests passent à chaque fois.",
          },
          {
            callout: {
              type: "warn",
              icon: "⚠️",
              text: "<strong>Avant un grand refactoring :</strong> Assurez-vous d'avoir une bonne couverture de tests. Si non, demandez d'abord à Claude de générer les tests avant de refactorer.",
            },
          },
        ],
      },
      {
        id: "debugging",
        title: "Debug & résolution de bugs",
        duration: "8 min",
        tag: "Pratique",
        intro:
          "Claude Code est un partenaire de debugging redoutable. Il peut analyser des stack traces, reproduire des bugs, et proposer des corrections précises.",
        sections: [
          {
            heading: "Passer une erreur directement",
            code: {
              lang: "text",
              label: "Debug avec stack trace",
              code: `> j'ai cette erreur, aide-moi à la corriger :
TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (src/components/UserList.tsx:23:18)
    at renderWithHooks (react-dom.development.js:14985:18)

> les tests échouent avec cette erreur :
FAIL src/auth/__tests__/auth.test.ts
  ● AuthService › login › should return token on valid credentials
    Expected: "Bearer eyJ..."
    Received: undefined`,
            },
          },
          {
            heading: "Debug en autonomie",
            body: "Vous pouvez aussi laisser Claude investiguer lui-même. Il va lire les fichiers pertinents, analyser le code, chercher la source du problème et proposer un fix.",
            code: {
              lang: "text",
              label: "Debug autonome",
              code: `> le login ne fonctionne pas sur mobile, investigation et fix stp

> les performances sont mauvaises sur la page /dashboard,
  trouve les bottlenecks et optimise

> après le dernier deploy, l'upload d'images est cassé`,
            },
          },
          {
            heading: "Lancer et corriger les tests en boucle",
            code: {
              lang: "text",
              label: "Boucle test-fix",
              code: `> lance les tests, corriges les erreurs, relances,
  jusqu'à ce que tout soit vert

> npm run test -- --watch est en rouge, corrige tout`,
            },
          },
          {
            callout: {
              type: "info",
              icon: "🔄",
              text: "<strong>Itération automatique :</strong> Claude Code peut rentrer dans une boucle \"fix → test → fix\" de façon autonome jusqu'à la résolution complète. C'est l'un de ses super-pouvoirs.",
            },
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 4 — GIT & TERMINAL
  // ─────────────────────────────────────────────────────────
  {
    id: "git",
    title: "Git & Terminal",
    emoji: "🔀",
    color: "#22c55e",
    lessons: [
      {
        id: "git-ops",
        title: "Opérations Git",
        duration: "8 min",
        tag: "Git",
        intro:
          "Claude Code a un accès complet à Git via la commande bash. Il peut effectuer toutes les opérations Git courantes et suivre les meilleures pratiques de commit.",
        sections: [
          {
            heading: "Créer des commits",
            body: "Claude Code suit un protocole strict pour les commits : il vérifie d'abord git status et git diff, analyse les changements, rédige un message de commit clair, puis commit avec la co-authorship Claude.",
            code: {
              lang: "bash",
              label: "Ce que Claude exécute pour un commit",
              code: `# 1. Voir les changements
git status
git diff

# 2. Voir l'historique pour respecter le style
git log --oneline -10

# 3. Créer le commit
git add src/auth/authService.ts src/auth/authRouter.ts
git commit -m "feat(auth): add JWT refresh token support

- Implement refresh token generation on login
- Add /auth/refresh endpoint
- Store refresh tokens in Redis with TTL

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"`,
            },
          },
          {
            heading: "Opérations de branching",
            code: {
              lang: "text",
              label: "Prompts Git courants",
              code: `> crée une branche feature/user-auth et bascule dessus

> merge la branche develop dans main

> rebase ma branche sur main

> montre-moi l'historique des commits des 7 derniers jours

> qui a modifié ce fichier en dernier et pourquoi ? (git blame)`,
            },
          },
          {
            heading: "Résolution de conflits",
            code: {
              lang: "text",
              label: "Résoudre des conflits",
              code: `> j'ai des conflits de merge dans src/models/user.ts, résous-les
  en gardant les changements des deux branches si possible

> explique les conflits dans ces fichiers et dis-moi
  quelle version garder`,
            },
          },
          {
            callout: {
              type: "warn",
              icon: "🛡️",
              text: "<strong>Sécurité :</strong> Claude Code ne fait jamais de <code>git push --force</code> sur main/master sans votre confirmation explicite. Les opérations destructives nécessitent toujours votre accord.",
            },
          },
        ],
      },
      {
        id: "github-pr",
        title: "GitHub & Pull Requests",
        duration: "7 min",
        tag: "GitHub",
        intro:
          "Via le CLI gh de GitHub, Claude Code peut créer des PR, commenter des issues, déclencher des workflows CI/CD et interagir avec l'écosystème GitHub.",
        sections: [
          {
            heading: "Créer une Pull Request",
            code: {
              lang: "bash",
              label: "Ce que Claude exécute pour une PR",
              code: `# 1. Vérifier les commits de la branche
git log main...HEAD --oneline

# 2. Voir tous les changements
git diff main...HEAD

# 3. Créer la PR avec gh
gh pr create \\
  --title "feat(auth): add JWT refresh token support" \\
  --body "## Summary
- Implement refresh token generation on login
- Add /auth/refresh endpoint
- Store refresh tokens in Redis with TTL

## Test plan
- [ ] Login returns both access + refresh token
- [ ] /auth/refresh returns new access token
- [ ] Expired refresh token returns 401

🤖 Generated with Claude Code"`,
            },
          },
          {
            heading: "Demandes PR courantes",
            code: {
              lang: "text",
              label: "Prompts GitHub",
              code: `> crée une PR depuis ma branche feature/auth vers develop

> liste les PR ouvertes sur ce repo

> lis les commentaires de la PR #42 et adresse les feedbacks

> vérifie le statut des checks CI pour la PR en cours

> close l'issue #15 avec un commit de fix`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "🤖",
              text: "<strong>Workflow complet :</strong> Claude peut gérer tout le cycle de vie d'une feature : créer la branche → implémenter → tester → commit → PR → adresser les reviews → merge.",
            },
          },
        ],
      },
      {
        id: "bash",
        title: "Terminal & Commandes Bash",
        duration: "6 min",
        tag: "Terminal",
        intro:
          "Claude Code peut exécuter n'importe quelle commande bash, lancer des processus en background, et interagir avec votre environnement système.",
        sections: [
          {
            heading: "Exécution de commandes",
            code: {
              lang: "text",
              label: "Exemples de commandes bash",
              code: `> lance npm test et montre-moi les résultats

> build le projet et dis-moi si il y a des erreurs TypeScript

> lance le serveur de dev en background

> vérifie si le port 3000 est utilisé

> installe les dépendances manquantes

> liste les variables d'environnement disponibles`,
            },
          },
          {
            heading: "Processus en background",
            body: "Claude peut lancer des processus en background (serveurs, watchers, etc.) et revenir les vérifier plus tard. Les outputs sont capturés et accessibles.",
            code: {
              lang: "bash",
              label: "Processus background",
              code: `# Claude peut lancer et monitorer
npm run dev &      # Serveur en background
npm run test:watch # Tests en watch mode

# Il peut aussi tuer des processus
kill $(lsof -t -i:3000)`,
            },
          },
          {
            callout: {
              type: "info",
              icon: "🔒",
              text: "<strong>Sécurité :</strong> Claude Code ne peut pas exécuter des commandes interactives nécessitant une saisie (comme <code>sudo</code> ou <code>gcloud auth login</code>). Dans ce cas, il vous demandera de les lancer vous-même.",
            },
          },
          {
            heading: "Timeout et limites",
            bullets: [
              "Timeout par défaut : 2 minutes par commande",
              "Timeout max configurable : 10 minutes (600 000ms)",
              "Les commandes en background n'ont pas de timeout",
              "Claude préfère les outils dédiés (Grep, Glob) au bash natif",
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 5 — CONFIGURATION AVANCÉE
  // ─────────────────────────────────────────────────────────
  {
    id: "config",
    title: "Configuration Avancée",
    emoji: "⚙️",
    color: "#ec4899",
    lessons: [
      {
        id: "settings",
        title: "Settings & Permissions",
        duration: "9 min",
        tag: "Config",
        intro:
          "Le fichier settings.json contrôle le comportement de Claude Code : permissions, outils autorisés, variables d'environnement, et plus encore.",
        sections: [
          {
            heading: "Localisation des settings",
            bullets: [
              "Global (utilisateur) : ~/.claude/settings.json",
              "Projet (partagé équipe) : .claude/settings.json",
              "Projet (personnel, non-versionné) : .claude/settings.local.json",
            ],
          },
          {
            heading: "Structure du settings.json",
            code: {
              lang: "json",
              label: "~/.claude/settings.json",
              code: `{
  // Modèle Claude à utiliser
  "model": "claude-opus-4-6",

  // Outils explicitement autorisés (sans demander)
  "allowedTools": ["Read", "Edit", "Bash(git *)"],

  // Outils toujours refusés
  "deniedTools": ["Bash(rm -rf *)"],

  // Variables d'environnement injectées
  "env": {
    "NODE_ENV": "development",
    "LOG_LEVEL": "debug"
  },

  // Mode de permission
  "permissions": {
    "allow": ["Bash(npm *)"],
    "deny": ["Bash(curl *)", "WebSearch"]
  }
}`,
            },
          },
          {
            heading: "Modes de permission",
            table: {
              headers: ["Mode", "Description", "Usage"],
              rows: [
                [
                  "default",
                  "Demande confirmation pour les actions risquées",
                  "Usage quotidien",
                ],
                [
                  "acceptEdits",
                  "Accepte auto les modifications fichiers",
                  "Confiance dans le projet",
                ],
                [
                  "bypassPermissions",
                  "Aucune confirmation demandée",
                  "Scripts automatisés",
                ],
              ],
            },
          },
          {
            callout: {
              type: "warn",
              icon: "⚠️",
              text: "<strong>bypassPermissions :</strong> Ce mode désactive toutes les confirmations. À utiliser uniquement dans des environnements sûrs et automatisés (CI/CD), jamais en interactif.",
            },
          },
          {
            heading: "Exemple de config pour une équipe",
            code: {
              lang: "json",
              label: ".claude/settings.json (partagé dans le repo)",
              code: `{
  "allowedTools": [
    "Read", "Write", "Edit", "Glob", "Grep",
    "Bash(npm *)", "Bash(git *)", "Bash(pnpm *)"
  ],
  "deniedTools": [
    "Bash(rm -rf *)",
    "Bash(sudo *)",
    "WebSearch"
  ],
  "env": {
    "NODE_ENV": "development"
  }
}`,
            },
          },
        ],
      },
      {
        id: "mcp",
        title: "MCP Servers",
        duration: "10 min",
        tag: "Avancé",
        intro:
          "Le Model Context Protocol (MCP) est un standard ouvert qui permet à Claude Code de se connecter à des services externes : bases de données, APIs, outils DevOps, et plus.",
        sections: [
          {
            heading: "Qu'est-ce que MCP ?",
            body: "MCP est un protocole client-serveur. Claude Code (le client) peut se connecter à des MCP servers qui exposent des outils supplémentaires. Cela étend les capacités de Claude bien au-delà du filesystem local.",
          },
          {
            heading: "Configurer un MCP server",
            code: {
              lang: "json",
              label: "~/.claude/settings.json — section mcpServers",
              code: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_URL": "postgresql://localhost:5432/mydb"
      }
    }
  }
}`,
            },
          },
          {
            heading: "MCP servers populaires",
            table: {
              headers: ["Server", "Description", "Usage"],
              rows: [
                ["@mcp/server-github", "GitHub API complète", "Issues, PRs, repos"],
                ["@mcp/server-postgres", "Requêtes SQL directes", "Exploration de BDD"],
                ["@mcp/server-brave-search", "Recherche web Brave", "Info temps réel"],
                ["@mcp/server-slack", "Slack API", "Lire/écrire messages"],
                ["@mcp/server-puppeteer", "Browser automation", "Tests E2E, scraping"],
              ],
            },
          },
          {
            callout: {
              type: "info",
              icon: "🔌",
              text: "<strong>Écosystème ouvert :</strong> N'importe qui peut créer un MCP server. Il existe des centaines de servers dans l'écosystème pour Notion, Jira, AWS, GCP, Stripe, et bien d'autres.",
            },
          },
          {
            heading: "Créer son propre MCP server",
            code: {
              lang: "typescript",
              label: "Exemple simple de MCP server",
              code: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "mon-serveur",
  version: "1.0.0",
});

// Exposer un outil à Claude
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_weather",
    description: "Récupère la météo d'une ville",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string" }
      }
    }
  }]
}));

// Gérer l'appel à l'outil
server.setRequestHandler("tools/call", async (req) => {
  const { city } = req.params.arguments;
  const weather = await fetchWeather(city);
  return { content: [{ type: "text", text: weather }] };
});`,
            },
          },
        ],
      },
      {
        id: "hooks",
        title: "Le système de Hooks",
        duration: "9 min",
        tag: "Avancé",
        intro:
          "Les hooks permettent d'exécuter des commandes shell automatiquement avant ou après les actions de Claude Code. C'est le moyen d'intégrer Claude dans vos workflows existants.",
        sections: [
          {
            heading: "Types de hooks",
            table: {
              headers: ["Hook", "Déclenchement", "Usage typique"],
              rows: [
                ["PreToolUse", "Avant chaque appel d'outil", "Validation, logging"],
                ["PostToolUse", "Après chaque appel d'outil", "Linting, formatage"],
                ["Notification", "Quand Claude envoie une notif", "Alertes custom"],
                [
                  "UserPromptSubmit",
                  "À chaque prompt utilisateur",
                  "Preprocessing, context injection",
                ],
              ],
            },
          },
          {
            heading: "Configuration des hooks",
            code: {
              lang: "json",
              label: "~/.claude/settings.json — section hooks",
              code: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo \"[AUDIT] Claude exécute: $CLAUDE_TOOL_INPUT_COMMAND\""
          }
        ]
      }
    ]
  }
}`,
            },
          },
          {
            heading: "Variables d'environnement dans les hooks",
            table: {
              headers: ["Variable", "Contenu"],
              rows: [
                ["CLAUDE_TOOL_NAME", "Nom de l'outil (Edit, Bash, etc.)"],
                ["CLAUDE_TOOL_INPUT_FILE_PATH", "Chemin du fichier (pour Edit/Write)"],
                ["CLAUDE_TOOL_INPUT_COMMAND", "Commande bash (pour Bash)"],
                ["CLAUDE_FILE_PATHS", "Fichiers modifiés (liste)"],
              ],
            },
          },
          {
            heading: "Exemples de hooks utiles",
            code: {
              lang: "json",
              label: "Hooks pratiques pour un projet JS",
              code: `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "type": "command",
          "command": "npx eslint --fix \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null || true"
        }]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{
          "type": "command",
          "command": "echo \"Contexte projet: $(cat .claude/context.md 2>/dev/null)\""
        }]
      }
    ]
  }
}`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "🪝",
              text: "<strong>Cas d'usage puissants :</strong> Auto-formatage après chaque édition, log d'audit de toutes les commandes, injection automatique de contexte projet, notifications Slack quand Claude termine une tâche longue.",
            },
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 6 — MÉMOIRE & CONTEXTE
  // ─────────────────────────────────────────────────────────
  {
    id: "memory",
    title: "Mémoire & Contexte",
    emoji: "🧠",
    color: "#06b6d4",
    lessons: [
      {
        id: "claude-md",
        title: "Fichiers CLAUDE.md",
        duration: "8 min",
        tag: "Contexte",
        intro:
          "Les fichiers CLAUDE.md sont la façon principale de donner à Claude un contexte persistant sur votre projet. Claude les lit automatiquement au démarrage de chaque session.",
        sections: [
          {
            heading: "Où placer les CLAUDE.md",
            bullets: [
              "Racine du projet (chargé toujours)",
              "Sous-dossiers (chargé quand Claude travaille dans ce dossier)",
              "~/.claude/CLAUDE.md (contexte global utilisateur)",
            ],
          },
          {
            heading: "Que mettre dans CLAUDE.md",
            code: {
              lang: "markdown",
              label: "CLAUDE.md (exemple complet)",
              code: `# Mon Projet — Context pour Claude

## Stack technique
- Runtime: Node.js 20 + TypeScript 5.4
- Framework: Express 5 + Prisma ORM
- Tests: Vitest + Supertest
- Linter: ESLint + Prettier

## Conventions
- Utiliser async/await, pas de callbacks
- Préfixer les interfaces avec 'I' (ex: IUser)
- Les erreurs via Result<T, E> de neverthrow
- Commits en anglais, format Conventional Commits

## Architecture
- src/controllers/ — handlers HTTP
- src/services/ — logique métier
- src/repositories/ — accès BDD via Prisma
- src/utils/ — helpers partagés

## Commandes utiles
- npm run dev — serveur de dev avec hot reload
- npm test — vitest en watch mode
- npm run db:migrate — migrations Prisma

## Pièges à éviter
- Ne jamais commiter .env
- Les migrations Prisma nécessitent une review manuelle
- Ne pas modifier schema.prisma sans backup de la BDD`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "💡",
              text: "<strong>CLAUDE.md hiérarchique :</strong> Un CLAUDE.md dans src/auth/ peut donner des instructions spécifiques à l'authentification. Claude combine tous les CLAUDE.md du projet.",
            },
          },
          {
            heading: "Maintenir le CLAUDE.md à jour",
            body: "Demandez à Claude lui-même de mettre à jour le CLAUDE.md quand vous ajoutez une nouvelle convention ou technologie au projet. Il le fera proprement.",
          },
        ],
      },
      {
        id: "memory-system",
        title: "Système de mémoire persistante",
        duration: "8 min",
        tag: "Contexte",
        intro:
          "Claude Code dispose d'un système de mémoire basé sur des fichiers qui persiste entre les sessions. Il peut se souvenir de vos préférences, du contexte du projet, et de feedbacks passés.",
        sections: [
          {
            heading: "Types de mémoires",
            table: {
              headers: ["Type", "Contenu", "Quand utilisé"],
              rows: [
                [
                  "user",
                  "Profil, préférences, expertise",
                  "Pour adapter les réponses",
                ],
                [
                  "feedback",
                  "Ce que vous aimez/n'aimez pas",
                  "Éviter de répéter les mêmes erreurs",
                ],
                [
                  "project",
                  "État du projet, décisions, deadlines",
                  "Contexte des tâches en cours",
                ],
                [
                  "reference",
                  "Liens vers ressources externes",
                  "Savoir où chercher l'info",
                ],
              ],
            },
          },
          {
            heading: "Demander à Claude de se souvenir",
            code: {
              lang: "text",
              label: "Commandes de mémoire",
              code: `> souviens-toi que je préfère les réponses concises sans
  résumé à la fin

> retiens que ce projet utilise pnpm, pas npm

> mémorise : on utilise conventional commits en anglais

> oublie que j'utilise yarn, j'ai migré vers pnpm

> quelles sont tes mémoires sur ce projet ?`,
            },
          },
          {
            heading: "Localisation de la mémoire",
            code: {
              lang: "bash",
              label: "Fichiers de mémoire",
              code: `# Mémoire globale utilisateur
~/.claude/memory/MEMORY.md          # Index
~/.claude/memory/user_profile.md    # Profil utilisateur
~/.claude/memory/feedback_*.md      # Feedbacks

# Mémoire par projet (chemin encodé)
~/.claude/projects/[path-hash]/memory/`,
            },
          },
          {
            callout: {
              type: "info",
              icon: "🧠",
              text: "<strong>Mémoire vs CLAUDE.md :</strong> CLAUDE.md est pour des infos stables du projet (architecture, conventions). La mémoire est pour des infos évolutives (état du projet, préférences découvertes en cours de session).",
            },
          },
        ],
      },
      {
        id: "context-management",
        title: "Gérer le contexte de conversation",
        duration: "6 min",
        tag: "Contexte",
        intro:
          "Claude Code a une fenêtre de contexte finie. Savoir la gérer permet d'éviter les dégradations de performance sur de longues sessions.",
        sections: [
          {
            heading: "Commandes de gestion du contexte",
            table: {
              headers: ["Commande", "Effet"],
              rows: [
                ["/clear", "Efface toute la conversation (repart de zéro)"],
                ["/compact", "Compresse l'historique en gardant l'essentiel"],
                ["/status", "Affiche l'utilisation de la fenêtre de contexte"],
              ],
            },
          },
          {
            heading: "Quand compacter la conversation",
            code: {
              lang: "text",
              label: "Signaux pour compacter",
              code: `# Claude commence à oublier des instructions précédentes
# Les réponses deviennent plus lentes ou moins pertinentes
# /status montre > 70% de la fenêtre utilisée
# Début d'une nouvelle tâche sans rapport avec la précédente`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "🔄",
              text: "<strong>Astuce :</strong> Pour les longues sessions, faites des pauses régulières avec <code>/compact</code>. Claude garde l'essentiel et vos CLAUDE.md rechargent le contexte projet automatiquement.",
            },
          },
          {
            heading: "Lancer une session fraîche sur une tâche",
            body: "Pour les tâches importantes et complexes, commencez une nouvelle session propre avec /clear ou en relançant claude. Vous aurez ainsi toute la fenêtre de contexte disponible.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 7 — PRODUCTIVITÉ
  // ─────────────────────────────────────────────────────────
  {
    id: "productivity",
    title: "Productivité",
    emoji: "🏆",
    color: "#eab308",
    lessons: [
      {
        id: "slash-commands",
        title: "Slash Commands intégrées",
        duration: "7 min",
        tag: "Commandes",
        intro:
          "Les slash commands sont des raccourcis qui déclenchent des workflows prédéfinis dans Claude Code. Il en existe des intégrées et vous pouvez en créer.",
        sections: [
          {
            heading: "Commandes intégrées",
            table: {
              headers: ["Commande", "Description"],
              rows: [
                ["/help", "Affiche l'aide et toutes les commandes disponibles"],
                ["/clear", "Efface la conversation courante"],
                ["/compact", "Compresse le contexte de la conversation"],
                ["/status", "Affiche les infos de la session (contexte, modèle)"],
                ["/memory", "Gère les mémoires persistantes"],
                ["/config", "Affiche la configuration actuelle"],
                ["/cost", "Affiche le coût de la session en cours"],
                ["/fast", "Bascule en mode Fast (même modèle, output plus rapide)"],
              ],
            },
          },
          {
            heading: "Skills (commandes customs)",
            body: "Les skills sont des fichiers markdown dans ~/.claude/commands/ ou .claude/commands/ qui définissent des workflows complets. Vous les invoquez avec /nom-du-skill.",
            code: {
              lang: "markdown",
              label: "~/.claude/commands/commit.md",
              code: `# Skill : /commit

Créer un commit Git propre avec ces étapes :
1. git status pour voir les changements
2. git diff pour analyser les modifications
3. git log -5 pour respecter le style du projet
4. Rédiger un message Conventional Commits
5. git add (fichiers spécifiques, pas -A)
6. Créer le commit avec Co-Authored-By Claude`,
            },
          },
          {
            heading: "Skills populaires de la communauté",
            bullets: [
              "/commit — Créer un commit propre",
              "/review-pr — Revue de code d'une PR",
              "/test — Générer et lancer des tests",
              "/deploy — Déploiement guidé",
              "/docs — Générer la documentation",
              "/refactor — Refactoring guidé avec plan",
            ],
          },
          {
            callout: {
              type: "tip",
              icon: "⚡",
              text: "<strong>Créer vos propres skills :</strong> Identifiez vos workflows répétitifs et créez un skill pour chacun. En équipe, partagez les skills dans .claude/commands/ versionné dans le repo.",
            },
          },
        ],
      },
      {
        id: "keyboard-shortcuts",
        title: "Raccourcis clavier",
        duration: "5 min",
        tag: "Productivité",
        intro:
          "Maîtriser les raccourcis clavier de Claude Code vous rendra beaucoup plus rapide au quotidien.",
        sections: [
          {
            heading: "Raccourcis essentiels",
            table: {
              headers: ["Raccourci", "Action"],
              rows: [
                ["Ctrl+C", "Interrompre l'action en cours de Claude"],
                ["Escape", "Annuler la saisie en cours"],
                ["Ctrl+L", "Vider l'affichage (garde le contexte)"],
                ["↑ / ↓", "Naviguer dans l'historique des prompts"],
                ["Tab", "Auto-complétion (paths, commandes)"],
                ["Ctrl+R", "Recherche dans l'historique"],
                ["Ctrl+A", "Aller au début de la ligne"],
                ["Ctrl+E", "Aller à la fin de la ligne"],
                ["Shift+Enter", "Nouvelle ligne sans envoyer"],
              ],
            },
          },
          {
            heading: "Mode Fast",
            body: "Le mode Fast active un output plus rapide pour le même modèle Claude. Idéal pour les tâches simples ou répétitives. Activez-le avec /fast ou Ctrl+F selon la configuration.",
          },
          {
            heading: "Personnaliser les raccourcis",
            code: {
              lang: "json",
              label: "~/.claude/keybindings.json",
              code: `[
  {
    "key": "ctrl+shift+c",
    "command": "claude.openInTerminal"
  },
  {
    "key": "ctrl+shift+k",
    "command": "claude.clearConversation"
  }
]`,
            },
          },
          {
            callout: {
              type: "info",
              icon: "⌨️",
              text: "Les raccourcis sont personnalisables via le skill <strong>/keybindings</strong> ou directement dans <code>~/.claude/keybindings.json</code>.",
            },
          },
        ],
      },
      {
        id: "tips",
        title: "Tips & Meilleures pratiques",
        duration: "10 min",
        tag: "Expert",
        intro:
          "Ces conseils avancés vous permettront de tirer le maximum de Claude Code au quotidien et d'éviter les pièges courants.",
        sections: [
          {
            heading: "1. Donner des tâches complètes, pas des micro-instructions",
            body: "Claude Code est plus efficace quand vous lui donnez des objectifs complets plutôt que des instructions step-by-step. Faites confiance à son jugement pour planifier.",
            code: {
              lang: "text",
              label: "Comparaison : micro vs macro",
              code: `# Micro (moins efficace)
> lis auth.ts
> maintenant regarde user.ts
> maintenant modifie la ligne 42

# Macro (plus efficace) ✅
> dans src/auth/, le refresh token expire trop tôt.
  Analyse le problème, propose un fix et implémente-le
  avec les tests correspondants`,
            },
          },
          {
            heading: "2. Profiter de la recherche parallèle",
            body: "Claude peut appeler plusieurs outils en parallèle. Demandez-lui plusieurs analyses simultanées pour aller plus vite.",
            code: {
              lang: "text",
              label: "Tâches parallèles",
              code: `> analyse en même temps :
  - les performances de /api/users (logs)
  - les tests qui échouent (npm test)
  - les erreurs TypeScript (tsc --noEmit)`,
            },
          },
          {
            heading: "3. Utiliser les CLAUDE.md pour le onboarding",
            body: "Un CLAUDE.md bien rédigé au démarrage d'un projet économise des heures de re-contextualisation. Traitez-le comme la doc principale de votre projet.",
          },
          {
            heading: "4. Surveiller les coûts",
            code: {
              lang: "text",
              label: "Optimiser les coûts",
              code: `# Voir le coût de la session
/cost

# Utiliser /compact régulièrement pour réduire les tokens

# Pour les tâches répétitives simples, /fast est moins cher

# Éviter de mettre de gros fichiers binaires ou logs
  dans le contexte`,
            },
          },
          {
            heading: "5. Mode autonome pour les tâches longues",
            body: "Pour les refactorings ou features complexes, donnez à Claude une description complète et laissez-le travailler en autonomie. Revenez pour valider le résultat.",
            callout: {
              type: "success",
              icon: "🏆",
              text: "<strong>Pattern gagnant :</strong> Décrivez la tâche complète → Claude planifie et exécute → Vous reviewez avec <code>git diff</code> → Feedback si besoin.",
            },
          },
          {
            heading: "6. Workflow CI/CD avec Claude Code",
            code: {
              lang: "bash",
              label: "Claude Code en CI (GitHub Actions)",
              code: `# .github/workflows/claude-review.yml
name: Claude Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Claude Code Review
        run: |
          claude --print "Review this PR for bugs and issues:
          $(git diff origin/main...HEAD)"
        env:
          ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}`,
            },
          },
          {
            heading: "7. Construire ses propres agents",
            body: "Claude Code peut être utilisé comme SDK pour construire des agents personnalisés. L'Agent SDK permet de créer des automatisations complexes avec Claude comme moteur.",
            code: {
              lang: "typescript",
              label: "Lancer Claude Code en mode agent",
              code: `// Utiliser claude programmatiquement
import { execSync } from "child_process";

const result = execSync(
  'claude --print --output-format json "analyse ce fichier et retourne les bugs"',
  { encoding: "utf-8" }
);

const parsed = JSON.parse(result);
console.log(parsed.result);`,
            },
          },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // MODULE 8 — TOKENS & MODÈLES IA
  // ─────────────────────────────────────────────────────────
  {
    id: "tokens",
    title: "Tokens & Modèles IA",
    emoji: "🧬",
    color: "#a855f7",
    lessons: [
      {
        id: "how-models-work",
        title: "Comment fonctionnent les modèles IA",
        duration: "8 min",
        tag: "Théorie",
        intro:
          "Comprendre comment Claude fonctionne sous le capot vous permet de l'utiliser bien plus efficacement. Tokens, fenêtre de contexte, attention — ces concepts ont un impact direct sur votre workflow.",
        sections: [
          {
            heading: "Qu'est-ce qu'un token ?",
            body: "Un token est la plus petite unité de texte traitée par le modèle. Ce n'est ni un mot, ni un caractère — c'est un fragment de texte d'environ 3-4 caractères en moyenne en anglais (un peu plus en français). Le modèle lit et génère des tokens, pas des mots.",
          },
          {
            callout: {
              type: "info",
              icon: "📏",
              text: "<strong>Exemples de tokenisation :</strong> \"Claude\" = 1 token. \"Claude Code\" = 2 tokens. \"anticonstitutionnellement\" = 5-6 tokens. Un fichier de 1000 lignes de code ≈ 3000-5000 tokens.",
            },
          },
          {
            heading: "La fenêtre de contexte",
            body: "Le modèle a une limite de tokens qu'il peut traiter en une fois — c'est la fenêtre de contexte. Claude claude-sonnet-4-6 et Opus 4.6 ont une fenêtre de 200 000 tokens (~150 000 mots). Tout ce que Claude peut \"voir\" à un instant T (historique, fichiers lus, instructions) doit tenir dans cette fenêtre.",
          },
          {
            heading: "Le mécanisme d'attention",
            body: "Le modèle utilise un mécanisme d'attention pour pondérer l'importance de chaque token par rapport aux autres. Les tokens récents et les tokens du début du contexte ont tendance à recevoir plus d'attention. C'est pourquoi les instructions dans CLAUDE.md (chargées au début) ont plus d'impact que les instructions enterrées au milieu d'une longue conversation.",
          },
          {
            callout: {
              type: "tip",
              icon: "💡",
              text: "<strong>Implication pratique :</strong> Plus le contexte est long, plus le modèle peut \"diluer\" son attention sur des parties importantes. Gardez le contexte propre avec <code>/compact</code> et des CLAUDE.md bien structurés.",
            },
          },
          {
            heading: "Tokens input vs output",
            bullets: [
              "Tokens input = tout ce que Claude reçoit (historique + fichiers lus + votre prompt)",
              "Tokens output = ce que Claude génère (réponse + code écrit)",
              "Les tokens input sont moins chers que les tokens output",
              "La majorité du coût vient des tokens input sur les longues sessions",
            ],
          },
          {
            heading: "Prompt caching",
            body: "Claude Code utilise le prompt caching d'Anthropic : si le début d'un contexte reste identique entre deux requêtes, les tokens en cache sont jusqu'à 10x moins chers. C'est pourquoi les CLAUDE.md et instructions stables au début du contexte réduisent significativement les coûts.",
          },
        ],
      },
      {
        id: "pricing",
        title: "Tarification & gestion des coûts",
        duration: "7 min",
        tag: "Pratique",
        intro:
          "Claude Code se paie à l'usage via l'API Anthropic. Comprendre la tarification vous permet d'optimiser vos coûts sans sacrifier la qualité.",
        sections: [
          {
            heading: "Modèles disponibles et prix",
            table: {
              headers: ["Modèle", "Input (MTok)", "Output (MTok)", "Usage idéal"],
              rows: [
                ["claude-opus-4-6", "~$15", "~$75", "Tâches complexes, architecture"],
                ["claude-sonnet-4-6", "~$3", "~$15", "Usage quotidien équilibré"],
                ["claude-haiku-4-5", "~$0.25", "~$1.25", "Tâches simples, CI/CD"],
              ],
            },
          },
          {
            callout: {
              type: "info",
              icon: "💰",
              text: "<strong>Prix avec cache :</strong> Les tokens en cache coûtent ~90% moins cher. Sur une longue session Claude Code, le cache peut réduire la facture de 50-70%. Les prix varient, vérifiez <code>anthropic.com/pricing</code> pour les tarifs actuels.",
            },
          },
          {
            heading: "Voir le coût de votre session",
            code: {
              lang: "text",
              label: "Dans Claude Code",
              code: `# Afficher le coût de la session en cours
/cost

# Résultat exemple :
Session cost: $0.23
  Input tokens:  45,230 (cache read: 38,100)
  Output tokens: 2,847
  Cache savings: ~$0.34`,
            },
          },
          {
            heading: "Stratégies pour réduire les coûts",
            bullets: [
              "Utiliser /compact régulièrement pour réduire les tokens input",
              "Écrire des CLAUDE.md précis pour éviter les re-explications",
              "Utiliser claude-haiku pour les tâches répétitives (linting, formatage)",
              "Éviter de coller de gros logs ou fichiers inutiles dans le contexte",
              "Utiliser le mode --print pour les scripts (pas de contexte interactif)",
              "Limiter le nombre de fichiers lus au strict nécessaire",
            ],
          },
          {
            heading: "Budgets par cas d'usage typiques",
            table: {
              headers: ["Tâche", "Coût estimé", "Modèle recommandé"],
              rows: [
                ["Bug fix simple", "$0.02-0.10", "Sonnet"],
                ["Feature complète (200 lignes)", "$0.20-0.80", "Sonnet/Opus"],
                ["Refactoring d'un module", "$0.50-2.00", "Opus"],
                ["Session de 2h sur un projet", "$2-8", "Sonnet"],
                ["Revue de PR automatisée (CI)", "$0.05-0.20", "Haiku/Sonnet"],
              ],
            },
          },
          {
            callout: {
              type: "tip",
              icon: "🎯",
              text: "<strong>Rapport qualité/prix :</strong> Sonnet est le sweet spot pour 95% des usages. Réservez Opus pour les tâches d'architecture complexe où vous avez vraiment besoin du maximum de raisonnement.",
            },
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 9 — PLAN MODE & AGENTS
  // ─────────────────────────────────────────────────────────
  {
    id: "plan-agents",
    title: "Plan Mode & Agents",
    emoji: "🤖",
    color: "#06b6d4",
    lessons: [
      {
        id: "plan-mode",
        title: "Plan Mode — planifier avant d'agir",
        duration: "8 min",
        tag: "Fonctionnalité clé",
        intro:
          "Le Plan Mode est une fonctionnalité majeure de Claude Code qui lui permet de réfléchir et planifier une implémentation complexe AVANT d'écrire le moindre code. C'est essentiel pour les tâches importantes.",
        sections: [
          {
            heading: "Pourquoi utiliser le Plan Mode ?",
            body: "Sans plan, Claude peut foncer dans l'implémentation et prendre de mauvaises décisions architecturales qui nécessitent un refactoring complet. Le Plan Mode force une réflexion structurée avant l'action.",
          },
          {
            heading: "Activer le Plan Mode",
            code: {
              lang: "text",
              label: "Activer explicitement",
              code: `# Option 1 : demander un plan explicitement
> avant de coder, fais d'abord un plan détaillé de comment
  tu vas implémenter le système d'authentification

# Option 2 : utiliser le slash command
/plan implémente un système de paiement Stripe

# Option 3 : EnterPlanMode (dans l'interface)
# Claude liste les étapes, vous validez, puis il exécute`,
            },
          },
          {
            heading: "Ce que Claude produit en Plan Mode",
            bullets: [
              "Liste des fichiers à créer/modifier avec leur rôle",
              "Dépendances entre les composants",
              "Ordre d'implémentation optimal",
              "Points de risque identifiés à l'avance",
              "Questions à clarifier avant de commencer",
              "Estimation du scope (pour valider que c'est réaliste)",
            ],
          },
          {
            code: {
              lang: "text",
              label: "Exemple de workflow avec Plan Mode",
              code: `> /plan ajouter un système de notifications en temps réel
  avec WebSockets dans ce projet Express + React

# Claude répond avec un plan :
## Plan d'implémentation

### Backend (Express)
1. src/websocket/wsServer.ts — serveur WebSocket avec ws
2. src/websocket/notificationService.ts — logique métier
3. src/models/notification.ts — modèle Prisma
4. Migration BDD pour la table notifications

### Frontend (React)
5. src/hooks/useNotifications.ts — hook WebSocket
6. src/components/NotificationBell.tsx — UI
7. src/components/NotificationList.tsx — liste

### Risques identifiés
- Gestion des reconnexions WebSocket côté client
- Scalabilité si > 1000 connexions simultanées

Validez ce plan ? Je commence par le backend.

> oui, vas-y`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "🏗️",
              text: "<strong>Bonne pratique :</strong> Pour toute feature qui touche > 3 fichiers, utilisez systématiquement le Plan Mode. Vous économiserez du temps et de l'argent en évitant les dead ends.",
            },
          },
          {
            heading: "Modifier le plan avant l'exécution",
            body: "Le Plan Mode est un aller-retour. Vous pouvez demander à Claude de modifier son plan (\"n'utilise pas WebSockets, utilise SSE plutôt\") avant qu'il commence à coder. C'est le moment idéal pour aligner sur l'architecture.",
          },
        ],
      },
      {
        id: "subagents",
        title: "Subagents — déléguer des sous-tâches",
        duration: "9 min",
        tag: "Avancé",
        intro:
          "Les subagents permettent à Claude Code de spawner des agents secondaires pour exécuter des tâches en parallèle ou des recherches indépendantes. C'est la fonctionnalité la plus puissante pour les tâches complexes.",
        sections: [
          {
            heading: "Concept des subagents",
            body: "Un subagent est une instance séparée de Claude qui travaille sur une sous-tâche spécifique. L'agent principal garde le contexte global et orchestre les subagents. Les subagents ont leur propre fenêtre de contexte, ce qui protège le contexte principal.",
          },
          {
            callout: {
              type: "info",
              icon: "🔱",
              text: "<strong>Architecture :</strong> Agent principal → délègue à subagents → récupère les résultats → synthétise. Chaque subagent reçoit des instructions précises et retourne un résultat structuré.",
            },
          },
          {
            heading: "Quand utiliser les subagents",
            bullets: [
              "Recherche dans de larges codebases (protège le contexte principal)",
              "Tâches parallèles indépendantes (ex: analyser 5 modules simultanément)",
              "Exploration exploratoire (le subagent peut \"se perdre\" sans polluer le contexte)",
              "Vérifications de sécurité ou qualité sur du code généré",
              "Revue de code indépendante (second regard sans biais du contexte)",
            ],
          },
          {
            code: {
              lang: "text",
              label: "Demander un subagent",
              code: `> utilise un subagent pour explorer et comprendre
  l'architecture du module src/payments/ sans polluer
  notre contexte actuel, puis rapporte-moi les points clés

> lance des subagents en parallèle pour :
  - analyser les performances de /api/orders
  - checker la couverture de tests de src/auth/
  - trouver tous les TODO dans le codebase
  Synthétise les résultats quand c'est fait`,
            },
          },
          {
            heading: "Types de subagents disponibles",
            table: {
              headers: ["Type", "Spécialité", "Outils disponibles"],
              rows: [
                ["general-purpose", "Tâches générales", "Tous les outils"],
                ["Explore", "Exploration de codebase", "Glob, Grep, Read, Bash (lecture)"],
                ["Plan", "Architecture & planification", "Analyse seulement, pas d'édition"],
              ],
            },
          },
          {
            callout: {
              type: "warn",
              icon: "💸",
              text: "<strong>Coût :</strong> Chaque subagent démarre avec un contexte frais — il ne bénéficie pas du cache. Sur des tâches simples, un subagent peut coûter plus cher qu'une réponse directe. Utilisez-les pour des tâches qui le justifient.",
            },
          },
        ],
      },
      {
        id: "multi-agent",
        title: "Workflows multi-agents",
        duration: "10 min",
        tag: "Expert",
        intro:
          "La collaboration entre plusieurs agents est le niveau ultime de Claude Code. Un orchestrateur coordonne des agents spécialisés pour accomplir des tâches qui dépassent les capacités d'un seul agent.",
        sections: [
          {
            heading: "Pattern Orchestrateur → Agents spécialisés",
            body: "L'orchestrateur reçoit l'objectif global, décompose en sous-tâches, délègue à des agents spécialisés (un pour la recherche, un pour l'implémentation, un pour les tests), puis consolide les résultats.",
          },
          {
            code: {
              lang: "text",
              label: "Exemple de workflow multi-agents",
              code: `> Je veux migrer toute la codebase de JavaScript vers TypeScript.
  Utilise plusieurs agents :
  1. Un agent Explore pour inventorier tous les fichiers JS
     et identifier les plus complexes
  2. Un agent Plan pour définir la stratégie de migration
     par ordre de priorité
  3. Ensuite tu implementeras toi-même en commençant
     par les fichiers les moins dépendants`,
            },
          },
          {
            heading: "Agents de recherche (Research agents)",
            body: "Un pattern très puissant : spawner un agent dont le seul rôle est de chercher de l'information (dans le code, sur le web, dans la doc) et de la synthétiser pour l'agent principal.",
            code: {
              lang: "text",
              label: "Agent de recherche",
              code: `> utilise un subagent pour rechercher dans la doc officielle
  de Prisma comment implémenter des transactions nested,
  et rapporte-moi les patterns recommandés avec des exemples

> lance un agent de recherche pour trouver comment
  les autres endpoints de l'app gèrent la pagination,
  puis applique le même pattern à /api/products`,
            },
          },
          {
            heading: "Isolation de contexte — pourquoi c'est crucial",
            body: "Quand un agent explore un large module ou fait des recherches, il peut lire des dizaines de fichiers. Si c'est dans le contexte principal, toute cette info \"pollue\" la fenêtre et dilue l'attention sur l'essentiel. Les subagents isolent cette exploration.",
          },
          {
            callout: {
              type: "success",
              icon: "🏆",
              text: "<strong>Pattern expert :</strong> Agent principal = chef de projet (contexte propre, décisions finales). Subagents = consultants spécialisés (contexte dédié, livrables précis). Ce pattern permet de traiter des codebases entiers de façon cohérente.",
            },
          },
          {
            heading: "Tâches en parallèle avec subagents",
            code: {
              lang: "text",
              label: "Parallélisation",
              code: `> Lance ces 3 tâches en parallèle avec des subagents :
  - Subagent 1 : génère les tests unitaires pour src/auth/
  - Subagent 2 : génère les tests unitaires pour src/payments/
  - Subagent 3 : génère les tests unitaires pour src/users/
  Quand les 3 sont finis, consolide et lance npm test`,
            },
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // MODULE 10 — PROJET SAAS COMPLET
  // ─────────────────────────────────────────────────────────
  {
    id: "saas-project",
    title: "Projet SaaS Complet",
    emoji: "🏗️",
    color: "#f97316",
    lessons: [
      {
        id: "project-setup",
        title: "Démarrer un projet from scratch",
        duration: "10 min",
        tag: "Projet réel",
        intro:
          "Voyons comment créer un projet SaaS complet avec Claude Code, de l'initialisation jusqu'au déploiement. C'est le workflow que les devs pros utilisent au quotidien.",
        sections: [
          {
            heading: "Étape 1 : Définir le projet et le stack",
            code: {
              lang: "text",
              label: "Prompt d'initialisation",
              code: `> je veux créer un SaaS de gestion de tâches pour les équipes.
  Stack souhaité :
  - Next.js 15 (App Router) + TypeScript
  - Prisma + PostgreSQL
  - Authentification avec NextAuth.js
  - Paiements avec Stripe
  - Déploiement sur Vercel

  Commence par créer la structure du projet et le CLAUDE.md
  avec toutes les conventions qu'on va suivre`,
            },
          },
          {
            heading: "Étape 2 : Laisser Claude créer la structure",
            body: "Claude va créer la structure de dossiers, installer les dépendances, configurer TypeScript, ESLint, Prettier, configurer la base de données et écrire le CLAUDE.md de référence pour toute la suite du projet.",
          },
          {
            callout: {
              type: "tip",
              icon: "🎯",
              text: "<strong>Pro tip :</strong> Demandez à Claude de créer le CLAUDE.md <em>en premier</em>. Toutes les décisions d'architecture prises au démarrage seront documentées et Claude s'y référera pour toute la suite du projet.",
            },
          },
          {
            heading: "Étape 3 : Implémenter feature par feature",
            code: {
              lang: "text",
              label: "Workflow feature",
              code: `# Pour chaque feature, suivre ce workflow :

# 1. Plan
> /plan implémenter l'authentification avec NextAuth.js

# 2. Validation du plan
> ok, commence par le backend (providers + API routes)

# 3. Tests en continu
> maintenant génère les tests et vérifie que tout passe

# 4. Commit
> /commit

# 5. PR si en équipe
> /review-pr`,
            },
          },
          {
            heading: "Étape 4 : Intégration Stripe",
            code: {
              lang: "text",
              label: "Exemple intégration Stripe",
              code: `> implémente les paiements Stripe avec :
  - Plans Free/Pro/Enterprise
  - Checkout session pour l'upgrade
  - Webhook pour les événements (payment_succeeded,
    subscription_cancelled, etc.)
  - Gestion des trials 14 jours
  - Portal client pour gérer l'abonnement

  Utilise les patterns Stripe recommandés pour Next.js
  et les types TypeScript de @stripe/stripe-js`,
            },
          },
        ],
      },
      {
        id: "existing-project",
        title: "Intégration dans un projet existant",
        duration: "8 min",
        tag: "Projet réel",
        intro:
          "Intégrer Claude Code sur un projet existant (legacy ou en cours) demande une approche différente d'un projet from scratch. Il faut d'abord que Claude comprenne l'existant.",
        sections: [
          {
            heading: "Étape 1 : Onboarding Claude sur le projet",
            code: {
              lang: "text",
              label: "Première session sur un projet existant",
              code: `> explore ce projet et crée un CLAUDE.md complet qui documente :
  - l'architecture globale
  - les patterns et conventions utilisés
  - les dépendances clés et leur rôle
  - les commandes importantes (dev, test, build)
  - les zones sensibles à ne pas toucher sans review

  Prends ton temps pour bien explorer avant d'écrire`,
            },
          },
          {
            callout: {
              type: "info",
              icon: "🔍",
              text: "<strong>Cette étape est cruciale :</strong> Un CLAUDE.md bien fait au départ évite les incohérences. Claude va lire la codebase, comprendre les patterns, et les respecter automatiquement dans toutes les sessions suivantes.",
            },
          },
          {
            heading: "Étape 2 : Identifier les quick wins",
            code: {
              lang: "text",
              label: "Audit rapide",
              code: `> fais un audit rapide du projet et identifie :
  - les 5 plus gros problèmes de qualité/dette technique
  - les tests manquants les plus critiques
  - les dépendances obsolètes ou avec vulnérabilités
  - le code mort ou inutilisé

  Priorise par impact/effort`,
            },
          },
          {
            heading: "Gestion du code legacy",
            body: "Pour du code legacy sans tests, la règle d'or est : tests d'abord, refactoring ensuite. Demandez toujours à Claude de \"photographier\" le comportement actuel avec des tests avant de toucher au code.",
            code: {
              lang: "text",
              label: "Approche code legacy",
              code: `# MAUVAIS : refactorer directement
> refactore src/legacy/userManager.js

# BON : tests → refactoring ✅
> 1. analyse le comportement actuel de src/legacy/userManager.js
  2. génère des tests qui documentent ce comportement
  3. vérifie que les tests passent sur le code actuel
  4. ensuite seulement, propose un refactoring`,
            },
          },
          {
            heading: "Étape 3 : Middleware et règles personnalisées",
            body: "Sur un projet existant, les règles métier sont souvent implicites dans le code. Aidez Claude à les identifier et les documenter dans CLAUDE.md pour qu'elles soient respectées.",
            code: {
              lang: "text",
              label: "Extraire les règles implicites",
              code: `> en analysant le middleware d'authentification et les guards
  dans ce projet, identifie et documente toutes les règles
  de permissions implicites. Ajoute-les au CLAUDE.md
  sous une section "Règles métier"`,
            },
          },
        ],
      },
      {
        id: "professional-tips",
        title: "Usage professionnel & retours terrain",
        duration: "10 min",
        tag: "Expert",
        intro:
          "Les conseils de devs qui utilisent Claude Code en production au quotidien. Ce qui marche vraiment, les pièges à éviter, et les patterns qui font gagner le plus de temps.",
        sections: [
          {
            heading: "Ce qui change vraiment dans le workflow",
            bullets: [
              "On écrit plus de specs/prompts et moins de code boilerplate",
              "La revue de code devient la compétence principale (pas l'écriture)",
              "Les tests sont générés en même temps que le code, pas après",
              "La documentation suit naturellement (Claude commente en écrivant)",
              "On peut tacler des refactorings qu'on repoussait depuis des mois",
            ],
          },
          {
            heading: "Gérer plusieurs terminaux",
            body: "Une technique pro : ouvrir plusieurs instances de Claude Code en parallèle, chacune sur une branche différente pour des features distinctes. Vous orchestrez les travaux et mergez les résultats.",
            code: {
              lang: "bash",
              label: "Multiple instances Claude Code",
              code: `# Terminal 1 : feature/auth
cd projet && git checkout feature/auth && claude

# Terminal 2 : feature/payments (en parallèle)
cd projet && git checkout feature/payments && claude

# Terminal 3 : fix/bugs
cd projet && git checkout fix/bugs && claude

# Chaque Claude travaille sur sa branche indépendamment`,
            },
          },
          {
            callout: {
              type: "tip",
              icon: "⚡",
              text: "<strong>Multiplicateur de productivité :</strong> 3 instances Claude en parallèle = 3x plus de features développées simultanément. Vous devenez le chef d'orchestre pendant que les agents codent.",
            },
          },
          {
            heading: "Stratégies avancées de code review",
            code: {
              lang: "text",
              label: "Review de code approfondie",
              code: `# Review de sécurité
> fais une revue de sécurité de ce diff en cherchant :
  injections SQL, XSS, IDOR, secrets exposés,
  mauvaise gestion des erreurs révélant des infos sensibles

# Review de performance
> analyse ce composant React pour les re-renders inutiles,
  les dépendances manquantes dans useEffect, et les
  opportunités de mémoïsation

# Review d'architecture
> cette implémentation respecte-t-elle les patterns
  du reste du projet ? Qu'est-ce qui serait fait différemment
  par un senior dev ?`,
            },
          },
          {
            heading: "Prompts de processus créatif",
            body: "Claude Code n'est pas qu'un exécutant. Il peut proposer des approches, challenger vos décisions et suggérer des alternatives que vous n'aviez pas envisagées.",
            code: {
              lang: "text",
              label: "Challenger ses propres décisions",
              code: `> j'ai prévu d'implémenter le cache avec Redis.
  Quelles sont les alternatives que je n'ai peut-être
  pas considérées pour ce cas d'usage ? Quels sont
  les trade-offs de chaque approche ?

> voici mon implémentation actuelle. Qu'est-ce qu'un
  dev senior ferait différemment et pourquoi ?`,
            },
          },
          {
            heading: "Automatisation de la création de prompts",
            body: "Une technique avancée : demander à Claude de générer les prompts pour les tâches futures. Claude connaît votre projet et peut créer des instructions précises pour les prochaines sessions.",
            code: {
              lang: "text",
              label: "Générer ses propres prompts",
              code: `> génère un prompt complet et précis que je pourrai
  utiliser dans une prochaine session pour implémenter
  les notifications push. Le prompt doit inclure tout
  le contexte nécessaire pour qu'un Claude fresh
  puisse l'exécuter sans autres explications`,
            },
          },
          {
            heading: "Conclusion : le bon état d'esprit",
            bullets: [
              "Claude Code est un senior dev junior — très compétent, mais à guider",
              "Plus vous lui donnez de contexte, meilleur est le résultat",
              "Vérifiez toujours le code généré avec git diff avant de committer",
              "Les CLAUDE.md sont votre investissement le plus rentable",
              "Commencez par les tâches répétitives et monotones pour gagner du temps",
              "Progressivement, déléguez des tâches de plus en plus complexes",
            ],
          },
        ],
      },
    ],
  },
];

export const totalLessons = curriculum.reduce(
  (acc, mod) => acc + mod.lessons.length,
  0
);
