// Parcours de progression par thème, du débutant à l'expert.
// Chaque niveau : un objectif, des étapes concrètes, et un projet qui valide le niveau.

export type Level = {
  level: "Débutant" | "Intermédiaire" | "Avancé" | "Expert";
  goal: string;
  steps: string[];
  project: string;
};

export const PATHS: Record<string, Level[]> = {
  "e-commerce": [
    {
      level: "Débutant",
      goal: "Utiliser Claude comme assistant de rédaction pour la boutique, sans rien connecter.",
      steps: [
        "Créez un projet « Ma boutique » et déposez-y votre charte : ton, cible, mots interdits, livraison et retours.",
        "Faites rédiger une fiche produit à partir d'une photo et de 5 caractéristiques, puis corrigez-la jusqu'à ce qu'elle vous ressemble.",
        "Demandez 10 questions qu'un client se pose avant d'acheter ce produit, et transformez-les en FAQ.",
        "Prenez l'habitude de vérifier chaque chiffre (dimensions, matière, délais) : Claude ne connaît pas votre stock.",
      ],
      project: "Réécrire 5 fiches produits avec le même ton et la même structure, et les publier.",
    },
    {
      level: "Intermédiaire",
      goal: "Brancher vos outils pour que Claude travaille sur vos vraies données.",
      steps: [
        "Connectez un outil SEO (Semrush ou Ubersuggest) et faites une carte des mots-clés de votre niche, rangés par intention d'achat.",
        "Connectez Google Sheets et tenez un tableau de marges que Claude met à jour quand les prix fournisseurs changent.",
        "Créez un skill « fiche produit » qui contient votre structure, vos règles et un exemple parfait : chaque nouvelle fiche suit la même méthode.",
        "Utilisez la veille publicitaire (Trendtrack) pour repérer les angles qui marchent chez les concurrents.",
      ],
      project: "Une collection complète optimisée : description, titres SEO, textes alternatifs et liens internes, à partir d'une recherche de mots-clés réelle.",
    },
    {
      level: "Avancé",
      goal: "Laisser Claude agir dans la boutique, avec des garde-fous.",
      steps: [
        "Connectez Shopify et commencez en lecture seule : audits des produits sans image, sans texte alternatif, sans description.",
        "Passez aux modifications par petits lots (10 produits), en relisant chaque lot avant le suivant.",
        "Connectez Klaviyo et faites analyser vos campagnes : revenu par destinataire, objets qui marchent, segments oubliés.",
        "Avec Cowork, confiez une tâche complète : « prépare le lancement du produit X » (fiche, visuels Canva, e-mail, publication).",
      ],
      project: "Un audit complet de la boutique avec un plan de corrections priorisé, puis l'application des 20 premières corrections.",
    },
    {
      level: "Expert",
      goal: "Automatiser les tâches récurrentes et piloter la boutique avec les chiffres.",
      steps: [
        "Programmez des routines : bilan hebdomadaire des ventes, alertes de stock, veille concurrentielle chaque lundi.",
        "Croisez les sources : ventes Shopify, paiements Stripe, campagnes Klaviyo et publicités dans une seule analyse.",
        "Écrivez vos méthodes en skills partagés avec votre équipe ou vos freelances, pour que tout le monde travaille pareil.",
        "Avec Claude Code, construisez de petits outils sur mesure : import de catalogue fournisseur, calcul de prix, flux Google Shopping.",
      ],
      project: "Un tableau de bord hebdomadaire automatique qui arrive chaque lundi avec 3 actions concrètes à mener.",
    },
  ],
  "vibe-coding": [
    {
      level: "Débutant",
      goal: "Créer une première page web en décrivant ce que vous voulez.",
      steps: [
        "Dans Claude, demandez une page simple en artifact (« une page de présentation pour mon activité ») et modifiez-la par la conversation.",
        "Installez Claude Code et lancez-le dans un dossier vide : demandez le même site, puis ouvrez-le dans votre navigateur.",
        "Apprenez les 5 commandes de base : /init, /clear, /rewind, /model et Échap pour interrompre.",
        "Activez le mode plan (Shift+Tab) avant chaque nouvelle fonctionnalité : lisez le plan avant de laisser Claude coder.",
      ],
      project: "Un site vitrine d'une page, en ligne sur Vercel, avec votre propre nom de domaine.",
    },
    {
      level: "Intermédiaire",
      goal: "Construire une vraie application avec base de données et comptes utilisateurs.",
      steps: [
        "Écrivez un CLAUDE.md : la stack, les commandes, les règles du projet. Corrigez-le à chaque erreur répétée de Claude.",
        "Branchez Supabase : tables, authentification et règles de sécurité (RLS) générées et expliquées par Claude.",
        "Versionnez avec GitHub : une branche par fonctionnalité, Claude écrit les commits et ouvre les pull requests.",
        "Donnez-lui des yeux avec Playwright : il teste le parcours lui-même et corrige ce qui casse.",
      ],
      project: "Une petite application avec inscription, une page privée et des données enregistrées (liste de tâches, carnet de recettes…).",
    },
    {
      level: "Avancé",
      goal: "Livrer un produit fiable : paiement, erreurs suivies, tests.",
      steps: [
        "Ajoutez le paiement avec Stripe (abonnement ou paiement unique) et testez-le en mode test avant tout.",
        "Branchez Sentry : Claude lit les vraies erreurs de vos utilisateurs et les corrige à la source.",
        "Faites écrire des tests pour chaque fonctionnalité importante, et un hook qui les lance après chaque modification.",
        "Pré-autorisez les commandes sûres et passez en mode auto pour travailler sans validations répétitives.",
      ],
      project: "Un SaaS minimal en ligne : inscription, paiement, une fonctionnalité utile, et un suivi des erreurs.",
    },
    {
      level: "Expert",
      goal: "Travailler comme une équipe : plusieurs agents, de l'automatisation et de la revue.",
      steps: [
        "Lancez plusieurs sessions en parallèle dans des worktrees, chacune sur une fonctionnalité.",
        "Utilisez /code-review et /ultrareview avant chaque mise en ligne, et une revue automatique sur chaque pull request.",
        "Pour les gros chantiers (migration, audit de sécurité), demandez un dynamic workflow.",
        "Emballez vos skills, hooks et serveurs MCP dans un plugin pour réutiliser votre configuration partout.",
      ],
      project: "Une refonte ou une migration complète menée par des agents en parallèle, sans régression grâce aux tests.",
    },
  ],
  "video-motion": [
    {
      level: "Débutant",
      goal: "Préparer vos vidéos avec Claude : idées, scripts et sous-titres.",
      steps: [
        "Faites générer 20 idées de vidéos courtes sur votre sujet, puis choisissez les 5 meilleures avec lui.",
        "Écrivez un script de 30 secondes avec une accroche dans les 2 premières secondes et une seule idée par vidéo.",
        "Collez une transcription et demandez des sous-titres découpés en phrases courtes, lisibles sur mobile.",
        "Créez un projet avec votre ton et vos meilleures vidéos pour que chaque script vous ressemble.",
      ],
      project: "Une semaine de contenu : 5 scripts, 5 descriptions et 5 idées de miniatures.",
    },
    {
      level: "Intermédiaire",
      goal: "Automatiser le montage simple avec Claude Code.",
      steps: [
        "Installez Claude Code et FFmpeg, puis faites couper, recadrer en 9:16 et compresser vos vidéos par une simple demande.",
        "Générez des miniatures et des visuels de couverture avec Canva connecté.",
        "Ajoutez une voix off avec ElevenLabs à partir de vos scripts.",
        "Faites découper une longue vidéo en extraits courts à partir de la transcription (« trouve les 5 meilleurs moments »).",
      ],
      project: "Transformer une vidéo longue en 5 extraits verticaux sous-titrés, prêts à publier.",
    },
    {
      level: "Avancé",
      goal: "Créer des animations par le code avec Remotion.",
      steps: [
        "Créez un projet Remotion et faites animer un titre, une liste et une barre de progression.",
        "Construisez un modèle réutilisable (format TikTok, vos couleurs, vos polices) que vous remplissez avec un texte.",
        "Ajoutez des sous-titres animés synchronisés avec la voix off.",
        "Faites générer des graphiques animés à partir de vos données (chiffres, évolution, comparaison).",
      ],
      project: "Un modèle de vidéo « 3 astuces » que vous déclinez en 10 vidéos en changeant seulement le texte.",
    },
    {
      level: "Expert",
      goal: "Une chaîne de production vidéo presque automatique.",
      steps: [
        "Enchaînez script, voix off, animation et rendu dans un seul flux piloté par Claude Code.",
        "Écrivez vos règles de montage (rythme, couleurs, transitions) dans un skill pour garder une identité constante.",
        "Ajoutez la 3D avec Blender pour les présentations de produits.",
        "Programmez une routine qui prépare chaque semaine les scripts à partir de vos idées et des tendances.",
      ],
      project: "Produire 30 vidéos d'un mois en une journée de travail, avec une identité visuelle constante.",
    },
  ],
  design: [
    {
      level: "Débutant",
      goal: "Utiliser Claude pour trouver des idées et formuler une direction visuelle.",
      steps: [
        "Décrivez votre marque en 5 mots et demandez 3 directions visuelles très différentes, avec couleurs et polices.",
        "Envoyez des captures de sites que vous aimez et demandez ce qui les rend efficaces.",
        "Faites critiquer un de vos visuels : lisibilité, hiérarchie, contraste.",
        "Testez Claude Design pour une première maquette d'écran.",
      ],
      project: "Une mini-charte d'une page : couleurs, polices, ton et 3 exemples d'usage.",
    },
    {
      level: "Intermédiaire",
      goal: "Décliner une identité sur tous les supports.",
      steps: [
        "Connectez Canva et déclinez votre charte en publications, bannières et présentations.",
        "Créez un projet par client avec sa charte, pour que chaque demande la respecte.",
        "Faites vérifier l'accessibilité : contrastes, tailles de texte, lisibilité sur mobile.",
        "Utilisez Claude pour rédiger les textes au bon format en même temps que les visuels.",
      ],
      project: "Un kit de lancement complet : 10 visuels réseaux sociaux, une bannière et une présentation.",
    },
    {
      level: "Avancé",
      goal: "Faire le lien entre design et code.",
      steps: [
        "Connectez Figma : Claude lit vos composants, couleurs et espacements.",
        "Faites coder une maquette Figma avec Claude Code, en réutilisant vos composants.",
        "Repérez les incohérences dans un fichier (couleurs en double, tailles de texte non standard).",
        "Transformez vos styles en variables de design partagées entre Figma et le code.",
      ],
      project: "Une page réelle codée depuis une maquette Figma, fidèle au pixel près sur mobile et ordinateur.",
    },
    {
      level: "Expert",
      goal: "Un design system vivant, maintenu avec Claude.",
      steps: [
        "Documentez votre design system (composants, règles, exemples) et faites-en un skill.",
        "Faites auditer régulièrement le site ou l'application contre ce design system.",
        "Générez les variantes de composants (états, tailles, thèmes clair et sombre) automatiquement.",
        "Mettez en place une revue visuelle avec captures d'écran à chaque modification.",
      ],
      project: "Un design system documenté, utilisé par Claude pour produire de nouveaux écrans cohérents.",
    },
  ],
  marketing: [
    {
      level: "Débutant",
      goal: "Écrire plus vite et mieux pour vos réseaux.",
      steps: [
        "Créez un projet avec votre cible, votre ton et vos meilleures publications.",
        "Faites décliner une idée en 5 formats : post LinkedIn, script TikTok, carrousel, e-mail, story.",
        "Demandez 10 accroches différentes et testez-les.",
        "Utilisez la recherche web pour vérifier une tendance ou un chiffre avant de publier.",
      ],
      project: "Un mois de publications planifié, rédigé et relu.",
    },
    {
      level: "Intermédiaire",
      goal: "Piloter votre contenu avec des données.",
      steps: [
        "Connectez Notion et tenez votre calendrier éditorial avec Claude.",
        "Connectez Semrush pour choisir vos sujets selon ce que les gens cherchent vraiment.",
        "Exportez les statistiques de vos réseaux et faites analyser ce qui marche (format, heure, sujet).",
        "Créez un skill avec votre méthode de rédaction pour garder une qualité constante.",
      ],
      project: "Une stratégie de contenu sur 3 mois, basée sur une recherche de mots-clés et vos statistiques réelles.",
    },
    {
      level: "Avancé",
      goal: "Relier marketing et ventes.",
      steps: [
        "Connectez HubSpot : segments, relances, historique des prospects.",
        "Connectez Supermetrics pour comparer vos campagnes publicitaires entre plateformes.",
        "Faites rédiger des séquences d'e-mails personnalisées par segment.",
        "Mesurez le coût d'acquisition par canal et laissez Claude proposer où mettre le budget.",
      ],
      project: "Un rapport mensuel qui relie publications, campagnes et ventes, avec 5 décisions à prendre.",
    },
    {
      level: "Expert",
      goal: "Un marketing automatisé et mesuré.",
      steps: [
        "Programmez une routine de rapport hebdomadaire qui croise toutes vos sources.",
        "Automatisez la publication avec Zapier ou Make après votre validation.",
        "Confiez à Cowork des campagnes complètes : recherche, rédaction, visuels, planification.",
        "Formalisez vos méthodes en plugins partagés avec l'équipe.",
      ],
      project: "Une machine de contenu qui publie chaque semaine et vous envoie ses résultats chaque lundi.",
    },
  ],
  productivite: [
    {
      level: "Débutant",
      goal: "Gagner du temps sur les tâches de tous les jours.",
      steps: [
        "Faites résumer un long document, un e-mail ou un compte rendu en 5 points.",
        "Rédigez vos e-mails difficiles avec lui (refus, relance, réclamation).",
        "Réglez vos préférences de profil une fois pour toutes : langue, ton, métier.",
        "Créez un projet par grand sujet (travail, études, maison).",
      ],
      project: "Une semaine où chaque e-mail important passe par Claude : notez le temps gagné.",
    },
    {
      level: "Intermédiaire",
      goal: "Connecter vos outils pour qu'il retrouve tout seul.",
      steps: [
        "Connectez Gmail, Agenda et Drive : « prépare ma réunion de demain avec ce client ».",
        "Connectez Notion ou Slack selon votre équipe.",
        "Utilisez la mémoire pour qu'il retienne vos projets en cours.",
        "Créez des skills pour vos documents récurrents (compte rendu, devis, rapport).",
      ],
      project: "Une routine du matin : résumé des e-mails, agenda du jour et 3 priorités.",
    },
    {
      level: "Avancé",
      goal: "Déléguer de vraies tâches.",
      steps: [
        "Avec Cowork, confiez des tâches en plusieurs étapes qui touchent vos fichiers et vos applications.",
        "Avec Claude dans Chrome, faites remplir des formulaires ou comparer des offres en ligne.",
        "Connectez Asana ou votre outil de gestion de projet pour suivre les tâches de l'équipe.",
        "Relisez toujours avant une action qui envoie, paie ou supprime.",
      ],
      project: "Une tâche administrative complète (dossier, déclaration, organisation d'un événement) menée par Claude sous votre contrôle.",
    },
    {
      level: "Expert",
      goal: "Un assistant qui travaille même quand vous n'êtes pas là.",
      steps: [
        "Programmez des tâches récurrentes : rapports, tris, rappels.",
        "Pilotez Claude depuis votre téléphone avec Dispatch.",
        "Construisez une base de connaissances personnelle (Obsidian ou Notion) que Claude enrichit.",
        "Automatisez avec Zapier ou Make ce qui se répète chaque semaine.",
      ],
      project: "Un système personnel où les tâches répétitives se font seules et où vous ne validez que l'essentiel.",
    },
  ],
  donnees: [
    {
      level: "Débutant",
      goal: "Poser des questions à un fichier de données.",
      steps: [
        "Envoyez un fichier Excel ou CSV et demandez ce qu'il contient, puis 3 observations importantes.",
        "Faites créer un graphique clair et demandez pourquoi ce type de graphique.",
        "Vérifiez un ou deux chiffres à la main : c'est la meilleure façon d'apprendre à lui faire confiance.",
        "Demandez les formules Excel plutôt que les résultats, pour pouvoir les réutiliser.",
      ],
      project: "Analyser vos dépenses ou vos ventes de l'année avec 5 graphiques commentés.",
    },
    {
      level: "Intermédiaire",
      goal: "Travailler sur des données vivantes.",
      steps: [
        "Connectez Google Sheets ou Airtable pour analyser et mettre à jour sans exporter.",
        "Créez un tableau de bord mensuel que Claude remplit et commente.",
        "Nettoyez des données en désordre (doublons, formats de dates, fautes).",
        "Faites créer un petit outil interactif (calculateur, simulateur) en artifact.",
      ],
      project: "Un tableau de bord mensuel automatique de votre activité.",
    },
    {
      level: "Avancé",
      goal: "Interroger vos bases de données en français.",
      steps: [
        "Connectez une base en lecture seule (DBHub) et posez vos questions sans écrire de SQL.",
        "Faites expliquer chaque requête générée pour apprendre le SQL au passage.",
        "Connectez Stripe pour suivre revenu récurrent, désabonnements et remboursements.",
        "Croisez plusieurs sources pour répondre à une vraie question métier.",
      ],
      project: "Un rapport trimestriel qui croise ventes, clients et paiements.",
    },
    {
      level: "Expert",
      goal: "Des analyses automatiques et fiables.",
      steps: [
        "Avec Claude Code, écrivez des scripts d'analyse versionnés et réexécutables.",
        "Programmez des alertes quand un indicateur sort de la normale.",
        "Mettez en place des contrôles : chaque chiffre clé recalculé par une deuxième méthode.",
        "Documentez vos définitions d'indicateurs dans un skill pour que toute l'équipe parle des mêmes chiffres.",
      ],
      project: "Un système d'alertes qui vous prévient dès qu'un chiffre important bouge anormalement.",
    },
  ],
  automatisation: [
    {
      level: "Débutant",
      goal: "Repérer ce qui mérite d'être automatisé.",
      steps: [
        "Listez avec Claude les tâches que vous répétez chaque semaine et le temps qu'elles prennent.",
        "Pour chacune, demandez s'il vaut mieux un modèle de texte, un skill ou une vraie automatisation.",
        "Commencez par une automatisation simple et sans risque (copier des données d'un formulaire vers un tableur).",
        "Notez chaque étape à la main avant de l'automatiser.",
      ],
      project: "Une liste de 10 tâches classées par temps gagné et par facilité.",
    },
    {
      level: "Intermédiaire",
      goal: "Brancher Claude sur vos automatisations.",
      steps: [
        "Connectez Zapier ou Make et exposez vos premières actions à Claude.",
        "Faites déclencher une automatisation depuis la conversation (« ajoute ce client et envoie le devis »).",
        "Ajoutez une étape de validation humaine avant tout envoi.",
        "Testez sur des données fictives avant les vraies.",
      ],
      project: "Une automatisation complète d'un processus réel (nouveau client, facture, prise de rendez-vous).",
    },
    {
      level: "Avancé",
      goal: "Des automatisations intelligentes.",
      steps: [
        "Avec n8n, construisez des flux où Claude décide (trier un e-mail, classer une demande, répondre).",
        "Gérez les erreurs : que se passe-t-il si une étape échoue ?",
        "Journalisez chaque action pour pouvoir vérifier ce qui a été fait.",
        "Programmez des routines Claude pour les tâches qui demandent du jugement.",
      ],
      project: "Un tri automatique de votre boîte de réception ou de vos demandes clients.",
    },
    {
      level: "Expert",
      goal: "Vos propres connecteurs et agents.",
      steps: [
        "Créez votre propre serveur MCP pour un outil interne qui n'a pas de connecteur.",
        "Construisez un agent avec l'Agent SDK pour un processus métier complet.",
        "Mettez en place des permissions fines et une revue des actions sensibles.",
        "Mesurez le temps gagné et le taux d'erreur, et améliorez en continu.",
      ],
      project: "Un serveur MCP maison qui donne à Claude l'accès à un outil de votre entreprise.",
    },
  ],
};
