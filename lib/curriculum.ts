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

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  tag?: string;
  intro: string;
  sections: LessonSection[];
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
        id: "what-is-cc",
        title: "Qu'est-ce que Claude Code ?",
        duration: "5 min",
        tag: "Fondamentaux",
        intro:
          "Claude Code est le CLI officiel d'Anthropic qui amène Claude directement dans votre terminal. C'est un agent de codage autonome capable de lire, écrire, éditer des fichiers, exécuter des commandes shell, interagir avec Git et bien plus encore.",
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
];

export const totalLessons = curriculum.reduce(
  (acc, mod) => acc + mod.lessons.length,
  0
);
