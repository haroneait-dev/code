// Prompts prêts à copier, par catégorie.
// Les passages entre crochets sont à remplacer par vos informations.

export type Prompt = { title: string; text: string; tip?: string };
export type PromptGroup = { id: string; name: string; intro: string; prompts: Prompt[] };

export const PROMPT_GROUPS: PromptGroup[] = [
  {
    id: "bases",
    name: "Les indispensables",
    intro: "Des formules qui marchent pour presque tout, à garder sous la main.",
    prompts: [
      {
        title: "Le cadre complet",
        text: "Contexte : [qui vous êtes, la situation].\nObjectif : [ce que vous voulez obtenir].\nContraintes : [longueur, ton, ce qu'il faut éviter].\nFormat : [liste, tableau, e-mail, plan…].\nAvant de répondre, pose-moi les questions dont tu as besoin.",
        tip: "La dernière phrase évite les réponses à côté quand votre demande est floue.",
      },
      {
        title: "Trois versions très différentes",
        text: "Propose 3 versions très différentes de [texte / idée], avec pour chacune son point fort et son point faible. Recommande ensuite celle que tu choisirais et pourquoi.",
      },
      {
        title: "Critique sans pitié",
        text: "Voici mon [texte / plan / idée]. Joue le relecteur exigeant : liste les 5 plus gros problèmes, du plus grave au moins grave, avec une correction concrète pour chacun. Ne me flatte pas.",
      },
      {
        title: "Explique-moi simplement",
        text: "Explique-moi [sujet] comme à quelqu'un d'intelligent qui n'y connaît rien. Utilise un exemple de la vie courante, puis vérifie ma compréhension avec 3 questions.",
      },
      {
        title: "Vérifier une information",
        text: "Fais une recherche web sur [affirmation]. Dis-moi si c'est vrai, faux ou nuancé, cite tes sources, et précise ce dont tu n'es pas sûr.",
        tip: "Activez la recherche web avant d'envoyer.",
      },
    ],
  },
  {
    id: "e-commerce",
    name: "E-commerce",
    intro: "Pour les boutiques en ligne : fiches, SEO, e-mails, service client.",
    prompts: [
      {
        title: "Fiche produit",
        text: "Rédige la fiche produit de [produit] pour ma boutique [nom], qui vend [type de produits] à [cible].\nCaractéristiques : [liste].\nStructure : accroche de 2 lignes, 4 bénéfices concrets, caractéristiques en liste, une FAQ de 3 questions.\nTon : [ton]. Pas de superlatifs, pas de promesse que je ne peux pas tenir.",
      },
      {
        title: "Titre et description Google",
        text: "Propose 5 titres SEO (60 caractères maximum) et 5 méta-descriptions (155 caractères maximum) pour la page [produit / collection], autour du mot-clé « [mot-clé] ». Indique le nombre de caractères de chacun.",
      },
      {
        title: "Réponse à un avis négatif",
        text: "Un client a laissé cet avis : « [avis] ». Rédige une réponse publique courte, polie et sincère, qui reconnaît le problème, explique ce qu'on fait pour le régler et invite à nous contacter. Pas de formules toutes faites.",
      },
      {
        title: "Séquence d'e-mails de bienvenue",
        text: "Écris une séquence de 3 e-mails de bienvenue pour les nouveaux inscrits de [boutique] : J0 (bienvenue et histoire de la marque), J2 (produit phare et preuve sociale), J5 (code de [X] % qui expire). Objet, préheader et corps pour chacun, 120 mots maximum.",
      },
      {
        title: "Idées de produits complémentaires",
        text: "Je vends [produit principal] à [cible]. Propose 10 produits complémentaires à proposer en vente additionnelle, classés par logique d'achat, avec un exemple de phrase pour les présenter au panier.",
      },
    ],
  },
  {
    id: "contenu",
    name: "Contenu et réseaux sociaux",
    intro: "Pour TikTok, Instagram, LinkedIn, YouTube et les newsletters.",
    prompts: [
      {
        title: "Script TikTok de 30 secondes",
        text: "Écris un script TikTok de 30 secondes sur [sujet] pour [cible].\n- Accroche en moins de 2 secondes qui crée une question.\n- Une seule idée, 3 étapes maximum.\n- Fin avec une question pour les commentaires.\nIndique ce qu'on voit à l'écran pour chaque phrase.",
      },
      {
        title: "Une idée, cinq formats",
        text: "Décline cette idée : « [idée] » en 5 formats : post LinkedIn (150 mots), carrousel de 6 diapositives, script de vidéo courte, tweet, et objet + introduction de newsletter.",
      },
      {
        title: "Calendrier éditorial",
        text: "Crée un calendrier éditorial de 4 semaines pour [compte] sur [réseau], à raison de [N] publications par semaine. Alterne conseils, coulisses, preuves et questions. Présente-le en tableau : date, format, sujet, accroche.",
      },
      {
        title: "Dix accroches",
        text: "Donne-moi 10 accroches différentes pour une vidéo sur [sujet] : 2 questions, 2 chiffres, 2 erreurs à éviter, 2 promesses concrètes, 2 contre-intuitives.",
      },
    ],
  },
  {
    id: "travail",
    name: "Travail et productivité",
    intro: "Réunions, e-mails, documents : gagner du temps chaque jour.",
    prompts: [
      {
        title: "Compte rendu de réunion",
        text: "Voici mes notes de réunion : [notes]. Rédige un compte rendu avec : décisions prises, actions (qui, quoi, pour quand), points en suspens. Une ligne par élément.",
      },
      {
        title: "E-mail difficile",
        text: "Aide-moi à répondre à cet e-mail : « [e-mail] ». Je veux [refuser / négocier / recadrer] tout en gardant une bonne relation. 3 versions : diplomate, directe, très courte.",
      },
      {
        title: "Préparer un entretien",
        text: "Je passe un entretien pour [poste] chez [entreprise]. Voici l'offre : [offre] et mon CV : [CV]. Prépare les 10 questions les plus probables, avec pour chacune les points clés de ma réponse tirés de mon parcours.",
      },
      {
        title: "Résumer un long document",
        text: "Résume ce document en 3 niveaux : une phrase, 5 points clés, puis un résumé d'une page. Signale ce qui me concerne si je suis [rôle].",
      },
    ],
  },
  {
    id: "etudes",
    name: "Études",
    intro: "Apprendre avec Claude, pas à sa place.",
    prompts: [
      {
        title: "Professeur particulier",
        text: "Sois mon professeur de [matière], niveau [niveau]. Explique [notion] étape par étape, puis pose-moi une question à la fois et attends ma réponse avant de continuer. Corrige mes erreurs en expliquant pourquoi.",
      },
      {
        title: "Fiche de révision",
        text: "À partir de ce cours : [cours], fais une fiche de révision d'une page : définitions, idées clés, un schéma en texte, et 5 questions d'examen avec leurs corrigés à la fin.",
      },
      {
        title: "Corriger sans réécrire",
        text: "Voici ma rédaction : [texte]. Ne la réécris pas. Liste mes erreurs (orthographe, grammaire, structure, argumentation), explique chacune, et donne-moi 3 conseils pour progresser.",
      },
    ],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    intro: "Pour coder avec l'agent dans le terminal.",
    prompts: [
      {
        title: "Comprendre un projet inconnu",
        text: "Explore ce projet sans rien modifier. Explique-moi : à quoi il sert, son architecture, les dossiers importants, comment le lancer et le tester, et les 3 endroits les plus risqués à modifier.",
      },
      {
        title: "Planifier avant de coder",
        text: "Je veux ajouter [fonctionnalité]. Ne code pas encore : lis le code concerné, propose un plan avec les fichiers à modifier, les risques et comment on vérifiera que ça marche. J'attends ton plan.",
        tip: "Ou passez en mode plan avec Shift+Tab.",
      },
      {
        title: "Corriger un bug avec preuve",
        text: "Voici le bug : [description / erreur]. Reproduis-le d'abord avec un test qui échoue, corrige la cause (pas le symptôme), puis montre-moi que le test passe et que les autres tests passent toujours.",
      },
      {
        title: "Revue de code exigeante",
        text: "Relis les changements de cette branche comme un développeur senior exigeant : bugs, sécurité, cas limites, lisibilité. Classe les remarques par gravité et propose une correction pour chacune.",
      },
      {
        title: "Mettre à jour CLAUDE.md",
        text: "D'après cette session, qu'est-ce que tu aurais aimé savoir dès le départ sur ce projet ? Propose les lignes à ajouter au CLAUDE.md, courtes et concrètes.",
      },
    ],
  },
  {
    id: "vie",
    name: "Vie quotidienne",
    intro: "Budget, repas, démarches, voyages.",
    prompts: [
      {
        title: "Menus de la semaine",
        text: "Propose les menus de la semaine pour [nombre] personnes, budget [montant], [contraintes : végétarien, sans gluten…]. Repas rapides en semaine. Termine par la liste de courses rangée par rayon.",
      },
      {
        title: "Analyser son budget",
        text: "Voici mes dépenses du mois : [relevé]. Classe-les par catégorie, montre ce qui a le plus augmenté, et propose 3 économies réalistes sans changer mon mode de vie.",
      },
      {
        title: "Lettre administrative",
        text: "Rédige une lettre à [organisme] pour [demande], avec mes informations : [infos]. Ton formel, références et pièces jointes à mentionner, et la formule de politesse adaptée.",
        tip: "Ne mettez jamais vos numéros sensibles complets : remplacez-les par des X et complétez à la main.",
      },
      {
        title: "Organiser un voyage",
        text: "Organise un voyage de [durée] à [destination] pour [personnes], budget [montant], en [mois]. Itinéraire jour par jour, transports, quartiers où loger, et 3 conseils que les touristes ignorent.",
        tip: "Activez la recherche web pour les prix et horaires à jour.",
      },
    ],
  },
];
