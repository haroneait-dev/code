// Prompts prêts à copier, par catégorie.
// Les passages entre crochets sont à remplacer par vos informations.
// Chaque prompt applique une technique de métier réelle, expliquée dans « why ».

export type PromptLevel = "Débutant" | "Intermédiaire" | "Avancé";
export type Prompt = { title: string; text: string; why?: string; tip?: string; level?: PromptLevel };
export type PromptGroup = { id: string; name: string; intro: string; method?: string[]; prompts: Prompt[] };

const BASE_GROUPS: PromptGroup[] = [
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "bases",
    name: "Les indispensables",
    intro: "Des formules qui marchent pour presque tout, à garder sous la main.",
    method: [
      "Donnez le contexte (qui vous êtes, pour qui), l'objectif, les contraintes et le format attendu.",
      "Montrez un exemple de ce que vous voulez : Claude imite mieux qu'il ne devine.",
      "Demandez-lui de poser ses questions avant de répondre quand la demande est floue.",
    ],
    prompts: [
      {
        title: "Le cadre complet",
        level: "Débutant",
        text: "Contexte : [qui vous êtes, la situation].\nObjectif : [ce que vous voulez obtenir].\nPublic : [à qui c'est destiné].\nContraintes : [longueur, ton, ce qu'il faut éviter].\nFormat : [liste, tableau, e-mail, plan…].\nAvant de répondre, pose-moi les questions dont tu as besoin.",
        why: "Les quatre informations que Claude ne peut pas deviner, plus une porte de sortie : s'il manque quelque chose, il demande au lieu d'inventer.",
      },
      {
        title: "Trois versions très différentes",
        level: "Débutant",
        text: "Propose 3 versions très différentes de [texte / idée] : une prudente, une audacieuse, une inattendue. Pour chacune : son point fort et son point faible. Recommande ensuite celle que tu choisirais pour [objectif] et pourquoi.",
        why: "Forcer des directions opposées évite trois variantes presque identiques, et la recommandation finale vous fait gagner le temps du choix.",
      },
      {
        title: "Critique sans pitié",
        level: "Débutant",
        text: "Voici mon [texte / plan / idée] : [contenu].\nJoue le relecteur exigeant d'un [rôle expert]. Liste les 5 plus gros problèmes, du plus grave au moins grave, avec pour chacun une correction concrète. Ne me flatte pas et ne réécris pas tout.",
        why: "Par défaut, un assistant a tendance à complimenter. Lui donner un rôle exigeant et un format (5 problèmes classés) donne une critique utilisable.",
      },
      {
        title: "Explique-moi simplement",
        level: "Débutant",
        text: "Explique-moi [sujet] comme à quelqu'un d'intelligent qui n'y connaît rien. Commence par une analogie de la vie courante, puis les 3 idées essentielles, puis un exemple concret. Termine par 3 questions pour vérifier que j'ai compris, et attends mes réponses.",
        why: "Analogie, puis idées clés, puis exemple : la progression des bons professeurs. Les questions finales transforment la lecture en apprentissage actif.",
      },
      {
        title: "Vérifier une information",
        level: "Débutant",
        text: "Fais une recherche web sur l'affirmation suivante : « [affirmation] ». Dis-moi si elle est vraie, fausse ou à nuancer. Cite au moins 2 sources indépendantes, précise la date de chaque source, et signale ce dont tu n'es pas sûr.",
        why: "Exiger deux sources indépendantes et datées limite les erreurs et les informations périmées.",
        tip: "Activez la recherche web avant d'envoyer.",
      },
      {
        title: "Transformer un brouillon en texte propre",
        level: "Débutant",
        text: "Voici mes notes en vrac : [notes]. Transforme-les en [type de document] clair, sans rien inventer : si une information manque, mets [À COMPLÉTER] à la place. Garde mes idées et mon vocabulaire.",
        why: "Le marqueur [À COMPLÉTER] empêche Claude de combler les trous avec des faits inventés.",
      },
      {
        title: "Le meta-prompt",
        level: "Intermédiaire",
        text: "Je veux un prompt pour que Claude fasse cette tâche de façon fiable et répétable : [tâche].\nRédige ce prompt avec : le rôle, le contexte, les étapes, les règles, le format de sortie et un exemple. Ensuite, liste les 3 cas où il risque d'échouer et comment les éviter.",
        why: "Claude écrit de très bons prompts pour lui-même. Lui demander ses propres points faibles rend le prompt plus robuste.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "contenu",
    name: "Contenu et réseaux sociaux",
    intro: "TikTok, Instagram, LinkedIn, YouTube : accroches, scripts, formats et calendrier, avec les méthodes des créateurs.",
    method: [
      "Donnez à Claude vos 3 meilleurs contenus comme exemples de ton.",
      "Une idée par contenu, une accroche dans les 2 premières secondes, une fin qui appelle une action.",
      "Demandez plusieurs accroches : c'est l'élément qui fait le plus varier les vues.",
    ],
    prompts: [
      {
        title: "Script TikTok ou Reels de 30 secondes",
        level: "Débutant",
        text: "Écris un script vidéo verticale de 30 secondes sur [sujet] pour [cible].\nStructure :\n- 0 à 2 s : accroche qui ouvre une question (pas de « Salut tout le monde »).\n- 2 à 25 s : une seule idée, 3 étapes maximum, une phrase par plan.\n- 25 à 30 s : chute + question pour les commentaires.\nPour chaque phrase, indique ce qu'on voit à l'écran et le texte incrusté. Propose 3 accroches alternatives.",
        why: "Les premières secondes décident si la personne reste. Une seule idée par vidéo et une question finale augmentent la rétention et les commentaires.",
      },
      {
        title: "Banque d'accroches",
        level: "Débutant",
        text: "Donne-moi 15 accroches pour une vidéo sur [sujet], en variant les formats : la question, le chiffre précis, l'erreur à éviter, le contre-intuitif, l'avant/après, la promesse concrète, la curiosité. Moins de 12 mots chacune. Classe les 3 meilleures et explique pourquoi.",
        why: "Varier volontairement les formats d'accroche permet de tester ce qui marche auprès de votre audience au lieu de répéter le même schéma.",
      },
      {
        title: "Une idée, sept formats",
        level: "Intermédiaire",
        text: "Décline cette idée : « [idée] » en 7 contenus adaptés à chaque réseau :\n1. Script TikTok de 30 secondes.\n2. Carrousel Instagram de 7 diapositives (texte de chaque diapositive).\n3. Post LinkedIn de 150 mots avec une première ligne forte.\n4. Fil X de 5 messages.\n5. Description YouTube Shorts avec mots-clés.\n6. Story en 3 écrans avec un sondage.\n7. Objet et introduction de newsletter.",
        why: "Le recyclage de contenu (content repurposing) multiplie la portée d'une seule idée. Chaque réseau a ses codes : la même phrase ne marche pas partout.",
      },
      {
        title: "Calendrier éditorial d'un mois",
        level: "Intermédiaire",
        text: "Crée un calendrier éditorial de 4 semaines pour [compte] sur [réseaux], à raison de [nombre] publications par semaine, pour [objectif : notoriété, ventes, abonnés].\nAlterne les piliers : éduquer (conseils), prouver (résultats, avis), divertir (coulisses, tendances), convertir (offre). Environ 80 % de valeur, 20 % de promotion.\nTableau : date | réseau | format | pilier | sujet | accroche.",
        why: "Les piliers de contenu évitent de tourner en rond, et la règle 80/20 empêche de lasser l'audience avec de la promotion.",
      },
      {
        title: "Analyser ce qui marche",
        level: "Avancé",
        text: "Voici les statistiques de mes 30 dernières publications (export) : [tableau avec sujet, format, durée, accroche, vues, rétention, partages, abonnés gagnés].\nIdentifie : les 3 sujets, formats et types d'accroche qui surperforment, ce qui sous-performe, et l'effet de l'heure de publication. Propose 10 idées de contenu qui reprennent les schémas gagnants.",
        why: "Vos propres chiffres battent toutes les recommandations générales. Claude repère les schémas que l'œil rate dans un tableau.",
      },
      {
        title: "Titre et miniature YouTube",
        level: "Intermédiaire",
        text: "Pour une vidéo YouTube sur [sujet] (public : [cible]), propose 10 titres de moins de 60 caractères qui donnent envie de cliquer sans mentir, puis 5 concepts de miniature (texte de 3 à 4 mots maximum, élément visuel principal, émotion). Associe les meilleures paires titre et miniature qui se complètent sans se répéter.",
        why: "Titre et miniature fonctionnent ensemble : la miniature crée l'émotion, le titre précise la promesse. Les répéter gaspille l'espace.",
      },
      {
        title: "Post LinkedIn qui génère des échanges",
        level: "Débutant",
        text: "Écris un post LinkedIn sur [sujet / expérience] pour [cible]. Première ligne de moins de 12 mots qui donne envie de cliquer « voir plus ». Une histoire courte et vraie, puis la leçon, puis une question ouverte. Phrases courtes, aérées, pas de jargon, pas plus de 3 émojis.",
        why: "Sur LinkedIn, seules les premières lignes sont visibles avant « voir plus ». Une histoire vécue suivie d'une question ouverte suscite davantage de commentaires qu'un conseil abstrait.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "marketing",
    name: "Marketing et publicité",
    intro: "Persona, positionnement, publicités, pages de vente et analyse de campagnes, avec les frameworks des marketeurs.",
    method: [
      "Commencez par la cible et son problème, jamais par le produit.",
      "Utilisez des frameworks éprouvés (AIDA, PAS) comme structure, pas comme formule magique.",
      "Testez plusieurs variantes : Claude produit les hypothèses, vos chiffres tranchent.",
    ],
    prompts: [
      {
        title: "Persona basé sur des données",
        level: "Débutant",
        text: "À partir de ces informations sur mes clients : [avis, questions fréquentes, données de vente, sondages], crée 2 personas réalistes. Pour chacun : situation, objectif, frustrations, objections à l'achat, mots qu'il emploie, où il s'informe, et ce qui le décide à acheter. Distingue ce qui vient de mes données de ce qui est une hypothèse.",
        why: "Un persona inventé de toutes pièces induit en erreur. Partir de vraies données et séparer faits et hypothèses le rend utile.",
      },
      {
        title: "Positionnement en une phrase",
        level: "Intermédiaire",
        text: "Aide-moi à formuler mon positionnement. Mon offre : [offre]. Ma cible : [cible]. Mes concurrents : [liste].\nRemplis : « Pour [cible] qui [besoin], [marque] est [catégorie] qui [bénéfice principal], contrairement à [alternative], parce que [preuve]. »\nPropose 3 versions, puis le slogan et les 3 messages clés qui en découlent.",
        why: "Ce modèle de positionnement oblige à préciser la cible, la différence et la preuve. Sans lui, les messages restent génériques.",
      },
      {
        title: "Publicité Meta ou TikTok (5 angles)",
        level: "Intermédiaire",
        text: "Crée 5 publicités pour [produit] à destination de [cible], chacune avec un angle différent : problème, bénéfice, preuve sociale, objection levée, comparaison.\nPour chacune : texte principal (125 caractères visibles avant « plus »), titre (40 caractères), description courte, idée de visuel ou de vidéo, et appel à l'action. Aucune promesse invérifiable.",
        why: "Tester des angles différents (et non des variantes de mots) est ce qui fait progresser une campagne. Les premiers 125 caractères sont ceux réellement lus.",
      },
      {
        title: "Page de vente (structure AIDA)",
        level: "Avancé",
        text: "Rédige la page de vente de [offre] pour [cible], en suivant AIDA :\n- Attention : titre qui nomme le résultat désiré, sous-titre qui précise pour qui.\n- Intérêt : le problème décrit avec les mots du client.\n- Désir : la solution, les bénéfices, 3 preuves ([témoignages, chiffres réels]), ce qui est inclus.\n- Action : prix, garantie, réponse aux 5 objections en FAQ, appel à l'action répété.\nIndique où placer chaque visuel.",
        why: "AIDA (Attention, Intérêt, Désir, Action) suit le cheminement mental de l'acheteur. Les objections traitées en FAQ lèvent les derniers freins.",
      },
      {
        title: "Analyse d'une campagne",
        level: "Avancé",
        text: "Voici les résultats de ma campagne [plateforme] sur [période] : [tableau par publicité : dépense, impressions, clics, CTR, CPC, conversions, coût par conversion, revenu].\nCalcule le ROAS par publicité, identifie les gagnantes et les perdantes, explique les écarts probables (accroche, visuel, audience), et propose une réallocation du budget et 3 nouveaux tests. Signale si les volumes sont trop faibles pour conclure.",
        why: "Le ROAS (revenu divisé par la dépense) dit ce qui rapporte vraiment. Demander de signaler les volumes trop faibles évite de tirer des conclusions d'un hasard statistique.",
      },
      {
        title: "Choisir le bon appel à l'action",
        level: "Intermédiaire",
        text: "Voici une page de mon site : [type de page, contenu, public, maturité du visiteur]. Parmi ces 8 objectifs d'appel à l'action : orienter, engager, diffuser, capturer, qualifier, convertir, localiser, fidéliser, lequel correspond à cette page ? Propose ensuite 3 formulations d'appel à l'action pour cet objectif, l'endroit exact où le placer, et ce qu'il faut retirer pour qu'il n'y ait pas plusieurs choix concurrents au même endroit.",
        why: "Un appel à l'action efficace sert un seul objectif, adapté à la maturité du visiteur : on ne demande pas d'acheter à quelqu'un qui découvre son problème. Trop de choix au même endroit font baisser les clics.",
      },
      {
        title: "Concevoir un lead magnet",
        level: "Avancé",
        text: "Mon article le plus visité est « [titre] » ; ses lecteurs cherchent surtout à [besoin]. Propose 3 idées de ressource gratuite à offrir contre une adresse e-mail (checklist, modèle, mini-guide, outil). Critères : liée au contenu lu, répond au besoin le plus difficile, utilisable en 5 minutes, demande le moins d'informations possible. Pour la meilleure, rédige son contenu, le texte de l'encart de capture et l'e-mail de remise, avec un consentement explicite.",
        why: "La plupart des visiteurs venus de Google ne sont pas prêts à acheter : sans contact, leur visite reste une statistique. Une ressource très ciblée attire des contacts qualifiés. Ce n'est pas un facteur de classement, mais une audience qui revient.",
      },
      {
        title: "Veille concurrentielle",
        level: "Intermédiaire",
        text: "Fais une recherche web sur ces concurrents : [liste]. Pour chacun : offre et prix, promesse principale, cible, canaux visibles, points forts et faibles d'après leurs avis clients. Termine par un tableau comparatif et 3 opportunités que personne n'occupe.",
        why: "Les avis clients des concurrents révèlent leurs faiblesses mieux que leur site. Les opportunités non occupées donnent un angle de différenciation.",
        tip: "Activez la recherche web.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "vente",
    name: "Vente et prospection",
    intro: "Messages de prospection, appels, objections, propositions commerciales et relances.",
    method: [
      "Personnalisez chaque message avec un élément vrai et vérifiable sur le prospect.",
      "Parlez de son problème avant votre solution, et demandez peu (un échange de 15 minutes, pas une vente).",
    ],
    prompts: [
      {
        title: "Message de prospection personnalisé",
        level: "Débutant",
        text: "Écris un message de prospection pour [prénom], [poste] chez [entreprise]. Ce que je sais d'elle ou de lui : [élément réel : publication, actualité, recrutement]. Mon offre : [offre] qui aide [type d'entreprise] à [résultat].\nMoins de 80 mots : une phrase personnalisée, le problème probable, une preuve courte, une question simple pour ouvrir un échange. Pas de flatterie, pas de pièce jointe.",
        why: "Un message court, personnalisé et qui demande peu obtient beaucoup plus de réponses qu'une présentation de l'entreprise.",
      },
      {
        title: "Séquence de relance",
        level: "Intermédiaire",
        text: "Le prospect n'a pas répondu à ce message : [message]. Écris 3 relances espacées (J+3, J+7, J+14), chacune apportant quelque chose de nouveau : une ressource utile, un cas client, puis un message de clôture poli qui laisse la porte ouverte.",
        why: "Chaque relance doit apporter de la valeur. Le message de clôture (« je ne vous relancerai plus ») obtient souvent des réponses.",
      },
      {
        title: "Répondre aux objections",
        level: "Intermédiaire",
        text: "Voici les objections que j'entends en rendez-vous : [liste, ex. « c'est trop cher », « on n'a pas le temps », « on a déjà un prestataire »]. Pour chacune : la vraie crainte derrière, une question pour creuser, et une réponse qui s'appuie sur [preuves réelles]. Puis fais-moi un jeu de rôle : tu es le prospect, tu me poses ces objections une par une, et tu notes mes réponses.",
        why: "Une objection cache souvent une autre crainte. Le jeu de rôle permet de s'entraîner avant le vrai rendez-vous.",
      },
      {
        title: "Proposition commerciale",
        level: "Avancé",
        text: "Rédige une proposition commerciale pour [client] à partir de mes notes de rendez-vous : [notes].\nStructure : leur situation et leur objectif (avec leurs mots), les enjeux s'ils ne font rien, la solution proposée en étapes, le calendrier, 3 options de prix (essentielle, recommandée, complète), les preuves, les prochaines étapes. 2 pages maximum.",
        why: "Reformuler la situation avec les mots du client montre qu'on l'a écouté. Trois options orientent le choix vers celle du milieu, au lieu d'un oui ou non.",
      },
      {
        title: "Préparer un rendez-vous",
        level: "Débutant",
        text: "J'ai rendez-vous avec [entreprise] demain. Fais une recherche web et prépare-moi : leur activité, leurs actualités récentes, leurs concurrents, les défis probables de leur secteur, 5 questions intelligentes à poser, et les points de mon offre les plus pertinents pour eux.",
        why: "Arriver avec des questions précises sur leur situation crédibilise immédiatement et oriente l'échange vers leurs besoins.",
        tip: "Activez la recherche web.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "travail",
    name: "Travail et productivité",
    intro: "Réunions, e-mails, documents, décisions et organisation : gagner du temps chaque jour.",
    method: [
      "Collez le vrai matériau (notes, fil d'e-mails, document) plutôt que de le résumer vous-même.",
      "Demandez des formats directement réutilisables : tableau, liste d'actions, brouillon prêt à envoyer.",
    ],
    prompts: [
      {
        title: "Compte rendu de réunion",
        level: "Débutant",
        text: "Voici mes notes (ou la transcription) de réunion : [notes].\nRédige un compte rendu avec : décisions prises, actions (qui, quoi, pour quand) en tableau, points en suspens, et date de la prochaine étape. Une ligne par élément. Signale les actions sans responsable ou sans date.",
        why: "Signaler les actions sans responsable ni date évite le classique « tout le monde pensait que quelqu'un d'autre s'en occupait ».",
      },
      {
        title: "E-mail difficile",
        level: "Débutant",
        text: "Aide-moi à répondre à cet e-mail : « [e-mail] ». Je veux [refuser / négocier / recadrer / annoncer une mauvaise nouvelle] tout en préservant la relation. Contexte : [contexte].\nDonne 3 versions : diplomate, directe, très courte. Puis dis-moi laquelle tu enverrais et pourquoi.",
        why: "Comparer trois tons aide à trouver le bon équilibre, surtout quand l'émotion rend difficile le recul.",
      },
      {
        title: "Résumer un long document",
        level: "Débutant",
        text: "Résume ce document en 3 niveaux : une phrase, 5 points clés, puis une page. Ensuite, indique ce qui me concerne si je suis [rôle], les chiffres et dates importants, et les points qui demandent une décision ou une vérification.",
        why: "Plusieurs niveaux de lecture permettent de décider vite si on doit lire le reste. Le filtre par rôle fait ressortir ce qui compte pour vous.",
      },
      {
        title: "Aide à la décision",
        level: "Intermédiaire",
        text: "Je dois choisir entre : [options]. Mes critères et leur importance : [critères avec poids]. Contexte : [contexte].\nFais une matrice de décision pondérée (note de 1 à 5 par critère, total pondéré), puis joue l'avocat du diable contre l'option gagnante. Termine par ce qui pourrait me faire changer d'avis.",
        why: "La matrice pondérée rend le choix explicite, et l'avocat du diable révèle les risques qu'on minimise quand on a déjà une préférence.",
      },
      {
        title: "Préparer un entretien d'embauche",
        level: "Débutant",
        text: "Je passe un entretien pour [poste] chez [entreprise]. Offre : [offre]. Mon CV : [CV].\nPrépare : les 10 questions les plus probables, pour chacune une réponse structurée avec la méthode STAR (Situation, Tâche, Action, Résultat) tirée de mon parcours, les 3 points faibles qu'on risque de soulever et comment y répondre, et 5 questions à poser au recruteur.",
        why: "La méthode STAR transforme une réponse vague en exemple concret et mesurable, ce que les recruteurs attendent.",
      },
      {
        title: "Organiser sa semaine",
        level: "Débutant",
        text: "Voici mes tâches de la semaine : [liste avec échéances], et mes contraintes : [rendez-vous, horaires]. Classe-les avec la matrice d'Eisenhower (urgent / important), propose un planning jour par jour avec des blocs de concentration, et dis-moi ce que je devrais déléguer ou abandonner.",
        why: "La matrice d'Eisenhower sépare l'urgent de l'important, et les blocs de concentration protègent le travail de fond des interruptions.",
      },
      {
        title: "Procédure à partir d'une explication",
        level: "Intermédiaire",
        text: "Voici comment je fais [tâche] (explication orale transcrite ou notes) : [texte]. Transforme-le en procédure écrite qu'un nouveau collègue peut suivre seul : prérequis, étapes numérotées, points de vigilance, et checklist finale.",
        why: "Documenter une tâche une fois permet de la déléguer, et la checklist évite les oublis.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "etudes",
    name: "Études",
    intro: "Apprendre avec Claude, pas à sa place : méthodes de révision validées par la recherche.",
    method: [
      "Demandez des questions plutôt que des résumés : se tester mémorise mieux que relire.",
      "Faites corriger vos productions sans les faire réécrire.",
      "Vérifiez les sources de tout ce qui finit dans un devoir.",
    ],
    prompts: [
      {
        title: "Professeur particulier",
        level: "Débutant",
        text: "Sois mon professeur de [matière], niveau [niveau]. Explique [notion] étape par étape avec un exemple. Ensuite, pose-moi une question à la fois et attends ma réponse avant de continuer. Si je me trompe, ne donne pas la réponse tout de suite : donne un indice.",
        why: "Chercher soi-même avec un indice fait mieux retenir que lire la réponse. Une question à la fois garde un rythme de cours réel.",
      },
      {
        title: "Fiche de révision et questions",
        level: "Débutant",
        text: "À partir de ce cours : [cours], fais une fiche de révision d'une page : définitions, idées clés, un schéma en texte, les erreurs fréquentes. Puis 10 questions de type examen, du plus facile au plus difficile, avec les corrigés à la fin, séparés.",
        why: "Se tester (pratique de récupération) est l'une des méthodes de révision les plus efficaces selon la recherche en sciences cognitives.",
      },
      {
        title: "Planning de révisions espacées",
        level: "Intermédiaire",
        text: "Mon examen de [matière] est le [date]. Chapitres : [liste]. Je peux réviser [temps] par jour.\nCrée un planning de révision espacée : chaque chapitre revu plusieurs fois avec des intervalles croissants (par exemple J+1, J+3, J+7), en alternant les matières, avec des séances de questions plutôt que de relecture.",
        why: "La répétition espacée et l'alternance des sujets améliorent nettement la mémorisation à long terme par rapport aux révisions massées la veille.",
      },
      {
        title: "Corriger sans réécrire",
        level: "Débutant",
        text: "Voici ma rédaction : [texte]. Ne la réécris pas. Liste mes erreurs (orthographe, grammaire, structure, argumentation) avec la règle correspondante, puis donne-moi 3 conseils pour progresser et un exercice ciblé sur mon erreur la plus fréquente.",
        why: "Corriger soi-même ses erreurs à partir d'explications fait progresser, alors qu'un texte réécrit n'apprend rien.",
      },
      {
        title: "La technique Feynman",
        level: "Intermédiaire",
        text: "Je vais t'expliquer [notion] avec mes mots, comme à un enfant de 12 ans : [mon explication]. Repère les passages flous, les erreurs et ce que j'ai sauté. Pose-moi ensuite 3 questions sur ces points faibles.",
        why: "Expliquer simplement révèle ce qu'on n'a pas vraiment compris. C'est la méthode attribuée au physicien Richard Feynman.",
      },
      {
        title: "Plan de dissertation ou de mémoire",
        level: "Intermédiaire",
        text: "Sujet : « [sujet] ». Aide-moi à construire un plan, sans rédiger à ma place : reformule la problématique, propose 2 plans possibles (en 2 ou 3 parties) avec leurs arguments, les exemples à chercher, et les objections à anticiper. Indique les sources sérieuses à consulter.",
        why: "Travailler la problématique et le plan est le cœur de l'exercice. Claude aide à structurer sans faire le travail interdit.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "donnees",
    name: "Données et finance",
    intro: "Analyser des tableaux, construire des formules, suivre ses chiffres et préparer un budget.",
    method: [
      "Joignez le fichier plutôt que de recopier les chiffres.",
      "Demandez les formules et la méthode, pas seulement le résultat, pour pouvoir vérifier.",
      "Recalculez toujours un chiffre clé à la main.",
    ],
    prompts: [
      {
        title: "Premières observations sur un fichier",
        level: "Débutant",
        text: "Voici mon fichier [ventes / dépenses / clients] : [fichier]. Décris d'abord ce qu'il contient (colonnes, période, lignes manquantes ou incohérentes). Puis donne 5 observations importantes avec les chiffres, un graphique pertinent pour chacune, et 3 questions que ces données soulèvent.",
        why: "Vérifier la qualité des données avant de les analyser évite des conclusions fausses à cause de doublons ou de lignes vides.",
      },
      {
        title: "Formule Excel ou Google Sheets",
        level: "Débutant",
        text: "Dans mon tableau, la colonne A contient [contenu], B [contenu], C [contenu]. Je veux [résultat]. Donne-moi la formule pour [Excel / Google Sheets] en français, explique chaque partie, et propose une version qui gère les cellules vides et les erreurs.",
        why: "Comprendre la formule permet de l'adapter. La gestion des cellules vides évite les #N/A et #DIV/0! qui cassent un tableau.",
      },
      {
        title: "Tableau de bord mensuel",
        level: "Intermédiaire",
        text: "À partir de ces données : [fichier], construis un tableau de bord mensuel avec : chiffre d'affaires, nombre de commandes, panier moyen, marge, évolution par rapport au mois précédent et à l'an dernier, top 5 et flop 5 des produits. Commente les 3 évolutions les plus importantes et propose une action pour chacune.",
        why: "Comparer à la fois au mois précédent et à l'année précédente sépare les vraies tendances des effets de saison.",
      },
      {
        title: "Prévisionnel simple",
        level: "Avancé",
        text: "Aide-moi à construire un prévisionnel sur 12 mois pour [activité]. Hypothèses : [prix, volumes, croissance, charges fixes, charges variables, salaires]. Fais 3 scénarios (prudent, réaliste, optimiste), le seuil de rentabilité, et la trésorerie mois par mois. Mets les hypothèses dans des cellules séparées pour que je puisse les modifier.",
        why: "Trois scénarios montrent l'incertitude au lieu d'un chiffre unique trompeur, et des hypothèses séparées rendent le modèle réutilisable.",
        tip: "Faites relire par un expert-comptable avant toute décision importante.",
      },
      {
        title: "Budget personnel",
        level: "Débutant",
        text: "Voici mes relevés des 3 derniers mois : [relevés]. Classe les dépenses par catégorie, calcule la moyenne mensuelle de chacune, repère les abonnements et les dépenses qui augmentent, et propose 3 économies réalistes sans changer mon mode de vie. Applique la règle 50/30/20 (besoins, envies, épargne) et dis-moi où j'en suis.",
        why: "La règle 50/30/20 donne un repère simple. Repérer les abonnements oubliés est souvent l'économie la plus facile.",
        tip: "Masquez vos numéros de compte avant d'envoyer.",
      },
      {
        title: "Nettoyer des données en désordre",
        level: "Intermédiaire",
        text: "Ce fichier contient des données en désordre : [fichier]. Uniformise les dates au format JJ/MM/AAAA, les noms (majuscules, espaces), les numéros de téléphone, supprime les doublons, et signale les lignes que tu n'as pas pu corriger. Rends un nouveau fichier et un résumé des modifications.",
        why: "Un résumé des modifications garde la trace de ce qui a changé et permet de vérifier qu'aucune donnée n'a été perdue.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "claude-code",
    name: "Claude Code",
    intro: "Pour coder avec l'agent : explorer, planifier, corriger avec preuve, relire et automatiser.",
    method: [
      "Donnez toujours un moyen de vérifier : un test, une commande, une capture.",
      "Plan d'abord (Shift+Tab), exécution ensuite.",
      "Une tâche par session, /clear entre deux sujets.",
    ],
    prompts: [
      {
        title: "Comprendre un projet inconnu",
        level: "Débutant",
        text: "Explore ce projet sans rien modifier. Explique-moi : à quoi il sert, son architecture (avec un schéma en texte), les dossiers importants, comment le lancer et le tester, les conventions de code, et les 3 endroits les plus risqués à modifier.",
        why: "Interdire les modifications pendant l'exploration évite les surprises, et les zones à risque orientent vos premières tâches.",
      },
      {
        title: "Planifier avant de coder",
        level: "Débutant",
        text: "Je veux ajouter [fonctionnalité]. Ne code pas encore : lis le code concerné, propose un plan avec les fichiers à modifier, les risques, les cas limites et comment on vérifiera que ça marche. J'attends ton plan avant que tu commences.",
        why: "Corriger un plan coûte quelques secondes, corriger du code mal parti coûte une session entière.",
        tip: "Ou passez en mode plan avec Shift+Tab.",
      },
      {
        title: "Corriger un bug avec preuve",
        level: "Intermédiaire",
        text: "Voici le bug : [description ou message d'erreur]. Reproduis-le d'abord avec un test qui échoue. Trouve la cause (pas le symptôme) et explique-la. Corrige, puis montre-moi que le nouveau test passe et que toute la suite de tests passe toujours.",
        why: "Le test qui échoue d'abord prouve que le bug est compris, et reste en place pour qu'il ne revienne jamais.",
      },
      {
        title: "Revue de code exigeante",
        level: "Intermédiaire",
        text: "Relis les changements de cette branche par rapport à main comme un développeur senior exigeant : bugs, sécurité, cas limites, performance, lisibilité, tests manquants. Classe les remarques par gravité (bloquant, important, mineur) et propose une correction pour chacune. Ne modifie rien.",
        why: "Classer par gravité permet de traiter l'essentiel d'abord. Demander de ne rien modifier garde la revue séparée de la correction.",
        tip: "Pour une revue approfondie, essayez aussi /code-review.",
      },
      {
        title: "Écrire les tests manquants",
        level: "Intermédiaire",
        text: "Analyse [fichier ou module] et liste les comportements qui ne sont pas couverts par les tests. Écris les tests dans le style de ceux qui existent déjà, en couvrant les cas normaux, les cas limites et les erreurs. Lance-les et corrige seulement les tests, pas le code, sauf si tu trouves un vrai bug : dans ce cas, signale-le d'abord.",
        why: "Écrire des tests dans le style existant garde la cohérence. Signaler un bug au lieu de le corriger discrètement vous laisse décider.",
      },
      {
        title: "Refactor sans casser",
        level: "Avancé",
        text: "Refactorise [module] pour [objectif : lisibilité, découpage, performance] sans changer son comportement. Avant de commencer, vérifie que les tests existants passent et ajoute ceux qui manquent pour protéger le comportement actuel. Avance par petites étapes, en lançant les tests après chacune.",
        why: "Des tests en place avant le refactor sont le filet de sécurité. Les petites étapes permettent de savoir exactement ce qui a cassé.",
      },
      {
        title: "Mettre à jour CLAUDE.md",
        level: "Intermédiaire",
        text: "D'après cette session, qu'est-ce que tu aurais aimé savoir dès le départ sur ce projet ? Propose les lignes à ajouter au CLAUDE.md : commandes, conventions, pièges. Courtes, concrètes, sans doublon avec ce qui y est déjà. Garde le fichier sous 200 lignes.",
        why: "Chaque erreur évitée une fois l'est pour toutes les sessions suivantes. Un CLAUDE.md court reste lu et utile.",
      },
      {
        title: "Créer un skill à partir d'une habitude",
        level: "Avancé",
        text: "Je fais souvent [tâche] de cette façon : [étapes]. Crée un skill dans .claude/skills/[nom]/SKILL.md avec une description précise (quand l'utiliser), les étapes, les règles, un exemple de résultat attendu, et les vérifications à faire à la fin. Puis teste-le sur [cas].",
        why: "La description décide si Claude déclenche le skill au bon moment. L'exemple et les vérifications rendent le résultat constant.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "vie",
    name: "Vie quotidienne",
    intro: "Budget, repas, démarches, voyages, santé et logement.",
    method: [
      "Donnez vos contraintes réelles (budget, temps, régime, nombre de personnes).",
      "Vérifiez les informations officielles (droits, démarches) sur les sites publics.",
      "Ne transmettez pas vos numéros sensibles complets.",
    ],
    prompts: [
      {
        title: "Menus de la semaine et liste de courses",
        level: "Débutant",
        text: "Propose les menus de la semaine pour [nombre] personnes, budget [montant], [contraintes : végétarien, sans gluten, enfants]. Repas de moins de 30 minutes en semaine, un plat préparé en double le dimanche pour le lundi. Termine par la liste de courses rangée par rayon, avec les quantités.",
        why: "Cuisiner en double et regrouper la liste par rayon fait gagner du temps et réduit le gaspillage.",
      },
      {
        title: "Comprendre un courrier administratif",
        level: "Débutant",
        text: "Explique-moi ce courrier simplement : [texte ou photo]. Ce qu'on me demande, les délais, ce qui se passe si je ne fais rien, et les étapes à suivre. Indique sur quel site officiel vérifier.",
        why: "Les courriers administratifs sont rédigés en langage juridique. Claude les traduit, le site officiel confirme.",
        tip: "Masquez vos numéros (sécurité sociale, fiscal) avant d'envoyer la photo.",
      },
      {
        title: "Lettre de réclamation",
        level: "Débutant",
        text: "Rédige une lettre de réclamation à [entreprise ou organisme] pour [problème], avec les faits : [dates, montants, échanges]. Ton ferme et factuel, demande précise (remboursement, réparation, délai), mention des pièces jointes. Indique si une lettre recommandée avec accusé de réception est conseillée.",
        why: "Une lettre factuelle, datée et avec une demande précise est plus efficace et constitue une trace en cas de litige.",
      },
      {
        title: "Organiser un voyage",
        level: "Débutant",
        text: "Organise un voyage de [durée] à [destination] pour [personnes], budget [montant] tout compris, en [mois]. Itinéraire jour par jour sans trop de déplacements, quartiers où loger, transports, budget détaillé, et 3 conseils que les touristes ignorent. Signale ce qui doit être réservé à l'avance.",
        why: "Limiter les déplacements et réserver le nécessaire à l'avance sont les deux leviers qui améliorent le plus un voyage.",
        tip: "Activez la recherche web pour les prix et horaires à jour.",
      },
      {
        title: "Comparer des offres",
        level: "Débutant",
        text: "Compare ces offres de [forfait mobile / assurance / énergie / crédit] : [détails ou liens]. Fais un tableau avec le coût total sur [durée] (frais compris), les conditions importantes et les pièges. Recommande la meilleure pour mon usage : [usage].",
        why: "Le coût total sur la durée réelle révèle les offres d'appel dont le prix augmente après quelques mois.",
      },
      {
        title: "Préparer une consultation médicale",
        level: "Débutant",
        text: "J'ai rendez-vous chez [médecin] pour [motif]. Aide-moi à préparer : la chronologie de mes symptômes à partir de mes notes ([notes]), mes traitements actuels, et les questions à poser. Ne fais pas de diagnostic.",
        why: "Une consultation préparée est plus efficace. Claude organise l'information, le médecin diagnostique.",
      },
    ],
  },
];

import { EXPERT_GROUPS } from "@/lib/prompts-expert";

// Ordre affiché : les indispensables, puis les catégories expert, puis les autres.
export const PROMPT_GROUPS: PromptGroup[] = [BASE_GROUPS[0], ...EXPERT_GROUPS, ...BASE_GROUPS.slice(1)];
