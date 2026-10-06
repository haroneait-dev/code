// Mini-quiz de fin d'article : 3 questions pour vérifier qu'on a compris.
// Clé : "categorie/slug". La bonne réponse est l'indice `answer`.

export type MiniQuestion = { q: string; options: string[]; answer: number; why: string };

export const ARTICLE_QUIZZES: Record<string, MiniQuestion[]> = {
  "claude-bases/bien-demander": [
    {
      q: "Quels sont les quatre ingrédients d'une bonne demande ?",
      options: ["Politesse, longueur, émojis, majuscules", "Contexte, objectif, contraintes, format", "Un mot-clé, une question, un exemple, une source"],
      answer: 1,
      why: "Contexte, objectif, contraintes et format : Claude sait qui vous êtes, ce que vous voulez et sous quelle forme.",
    },
    {
      q: "La première réponse ne vous plaît pas. Le mieux ?",
      options: ["Recommencer une nouvelle conversation", "Dire précisément ce qui ne va pas et itérer", "Écrire la même demande en majuscules"],
      answer: 1,
      why: "Une réponse est un brouillon : « plus court », « garde le 2e paragraphe »… deux ou trois allers-retours suffisent.",
    },
    {
      q: "Votre demande est floue. Quelle phrase ajouter ?",
      options: ["« Fais de ton mieux. »", "« Avant de répondre, pose-moi les questions dont tu as besoin. »", "« Réponds vite. »"],
      answer: 1,
      why: "Claude vous demande ce qui lui manque au lieu de deviner.",
    },
  ],
  "claude-bases/verifier-reponses": [
    {
      q: "Qu'est-ce qu'une hallucination ?",
      options: ["Un bug d'affichage", "Une information fausse affirmée avec assurance", "Une réponse trop longue"],
      answer: 1,
      why: "Le modèle complète avec quelque chose de plausible mais faux : un chiffre, une référence, une date.",
    },
    {
      q: "Quand faut-il vérifier le plus ?",
      options: ["Pour une idée de recette", "Pour un chiffre, une loi ou une source citée dans un travail important", "Jamais, Claude est fiable"],
      answer: 1,
      why: "Plus l'enjeu est élevé et l'information précise, plus on remonte à la source.",
    },
    {
      q: "Le meilleur réflexe pour une info d'actualité ?",
      options: ["Activer la recherche web et ouvrir les sources", "Demander deux fois la même chose", "Faire confiance à la date de coupure"],
      answer: 0,
      why: "La recherche web donne des sources que vous pouvez ouvrir et contrôler.",
    },
  ],
  "claude-bases/confidentialite": [
    {
      q: "Que ne faut-il jamais envoyer à un assistant IA ?",
      options: ["Un texte à corriger", "Vos mots de passe et numéros de carte complets", "Une question de cuisine"],
      answer: 1,
      why: "Remplacez les données sensibles par des données fictives : elles ne sont presque jamais utiles à la tâche.",
    },
    {
      q: "À quoi sert une conversation incognito ?",
      options: ["À aller plus vite", "À ne pas la garder dans l'historique ni dans la mémoire", "À utiliser un autre modèle"],
      answer: 1,
      why: "Idéal pour les sujets privés que vous ne voulez pas retrouver plus tard.",
    },
    {
      q: "Où choisir si vos conversations peuvent servir à entraîner les modèles ?",
      options: ["Dans les paramètres de confidentialité", "C'est impossible", "En écrivant « ne m'entraîne pas »"],
      answer: 0,
      why: "C'est un réglage du compte, à vérifier une fois.",
    },
  ],
  "claude-ai/projects-creation": [
    {
      q: "Quel est l'intérêt principal d'un projet ?",
      options: ["Payer moins cher", "Partager un même contexte (documents, instructions) entre conversations", "Avoir un modèle plus puissant"],
      answer: 1,
      why: "Chaque nouvelle conversation du projet part de vos documents et de vos consignes.",
    },
    {
      q: "Que mettre dans les instructions d'un projet ?",
      options: ["Les règles propres à ce sujet : ton, public, format attendu", "Votre mot de passe", "Rien, c'est inutile"],
      answer: 0,
      why: "Les instructions s'appliquent à toutes les conversations du projet.",
    },
    {
      q: "Un bon découpage ?",
      options: ["Un seul projet pour tout", "Un projet par grand sujet ou par client", "Un projet par message"],
      answer: 1,
      why: "Un projet par sujet garde un contexte propre et pertinent.",
    },
  ],
  "mcp/introduction-mcp": [
    {
      q: "À quoi sert MCP ?",
      options: ["À entraîner un modèle", "À relier Claude à des outils et des données externes", "À traduire les réponses"],
      answer: 1,
      why: "MCP est un standard ouvert : un serveur expose des outils que Claude peut utiliser.",
    },
    {
      q: "Avant de brancher un serveur MCP, on vérifie…",
      options: ["Qu'il vient d'une source de confiance et ne demande que les droits utiles", "Sa couleur", "Rien du tout"],
      answer: 0,
      why: "Un serveur MCP agit avec vos accès : préférez les versions officielles.",
    },
    {
      q: "Dans Claude Code, la commande pour ajouter un serveur est…",
      options: ["claude mcp add", "claude install-server", "npm mcp"],
      answer: 0,
      why: "Puis /mcp dans la session pour vérifier et se connecter.",
    },
  ],
  "demarrer/claude-md": [
    {
      q: "Que contient un bon CLAUDE.md ?",
      options: ["Toute la documentation du projet", "Les commandes, conventions et pièges essentiels, en peu de lignes", "Les clés d'API"],
      answer: 1,
      why: "Court et à jour : il est chargé à chaque session.",
    },
    {
      q: "Quand le mettre à jour ?",
      options: ["Jamais", "Quand Claude répète une erreur : on ajoute une ligne", "Une fois par an"],
      answer: 1,
      why: "Chaque correction profite à toutes les sessions suivantes, et à toute l'équipe s'il est versionné.",
    },
    {
      q: "Quelle commande crée un premier CLAUDE.md ?",
      options: ["/init", "/clear", "/compact"],
      answer: 0,
      why: "/init analyse le projet et propose un premier fichier, à relire et raccourcir.",
    },
  ],
  "cli/permissions-modes": [
    {
      q: "Quel mode permet d'explorer et proposer un plan sans rien modifier ?",
      options: ["plan", "bypassPermissions", "acceptEdits"],
      answer: 0,
      why: "Le mode plan lit et propose ; vous validez avant toute modification.",
    },
    {
      q: "Quel raccourci change de mode pendant la session ?",
      options: ["Ctrl+C", "Shift+Tab", "Alt+F4"],
      answer: 1,
      why: "Shift+Tab fait défiler les modes disponibles.",
    },
    {
      q: "bypassPermissions est à réserver…",
      options: ["À votre machine principale", "Aux environnements isolés (conteneur jetable)", "Aux débutants"],
      answer: 1,
      why: "Il saute la couche de permission : jamais sur une machine avec vos données.",
    },
  ],
  "hooks/introduction-hooks": [
    {
      q: "Qu'est-ce qu'un hook ?",
      options: ["Un script lancé automatiquement à un moment précis de la session", "Un modèle spécialisé", "Un raccourci clavier"],
      answer: 0,
      why: "Avant un outil, après une modification, à la fin d'un tour… il s'exécute à chaque fois.",
    },
    {
      q: "Pour formater le code après chaque modification, on utilise…",
      options: ["PostToolUse", "SessionEnd", "Notification"],
      answer: 0,
      why: "PostToolUse s'exécute après l'appel d'un outil, par exemple après Edit.",
    },
    {
      q: "Pour bloquer une commande dangereuse avant qu'elle s'exécute…",
      options: ["PreToolUse", "Stop", "PreCompact"],
      answer: 0,
      why: "PreToolUse peut refuser l'appel avant qu'il ait lieu.",
    },
  ],
  "skills/structure-skill": [
    {
      q: "Quel fichier est obligatoire dans un skill ?",
      options: ["SKILL.md", "package.json", "README.txt"],
      answer: 0,
      why: "SKILL.md contient l'en-tête (nom, description) et les instructions.",
    },
    {
      q: "À quoi sert la description du skill ?",
      options: ["À la décoration", "À ce que Claude sache quand l'utiliser", "À rien"],
      answer: 1,
      why: "C'est elle que Claude lit pour décider de charger le skill.",
    },
    {
      q: "Où placer un skill partagé avec l'équipe d'un projet ?",
      options: [".claude/skills/<nom>/ dans le dépôt", "Sur le bureau", "Dans node_modules"],
      answer: 0,
      why: "Versionné avec le projet, il est disponible pour tous ceux qui clonent le dépôt.",
    },
  ],
};
