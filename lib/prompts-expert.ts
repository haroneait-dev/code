// Catégories « expert » de la page Prompts : SEO, e-commerce, recherche de niche,
// visuels produit. Techniques de métier génériques, sans aucune marque.

import type { PromptGroup } from "@/lib/prompts";

export const EXPERT_GROUPS: PromptGroup[] = [
  // ─────────────────────────────────────────────────────────────────────
  {
    id: "seo",
    name: "SEO et blog",
    intro:
      "La méthode complète d'un article qui se positionne : données de recherche réelles, intention et maturité du lecteur, analyse du top 3, cocon sémantique, jus de lien, réponses directes, indexation et suivi.",
    method: [
      "Un article se construit sur les vraies questions des internautes (« Autres questions posées », suggestions de Google), pas sur l'intuition de l'IA.",
      "Une requête = une page : jamais deux pages sur la même intention, sinon elles se concurrencent.",
      "L'IA accélère, l'apport humain (expérience, avis, données vérifiées) fait la différence. Un article 100 % généré n'a aucune raison d'être mis en avant.",
      "Chaque chiffre externe est vérifié sur la source officielle et daté ; sinon, on renvoie vers la source au lieu de le citer.",
    ],
    prompts: [
      {
        title: "Analyse complète avant d'écrire",
        level: "Intermédiaire",
        text: "Mot-clé principal : « [mot-clé] ». Voici les questions de la section « Autres questions posées » et les suggestions de Google pour ce mot-clé : [liste ou capture].\nAvant d'écrire quoi que ce soit, analyse et note :\n0. Persona : quelle peur ou quelle vérification de mon client cet article traite-t-il ? (sinon, change d'angle)\n1. Intention : informationnelle, comparative ou pratique ; et maturité du lecteur (il découvre son problème, cherche une solution, compare, est prêt à acheter).\n2. La question principale à laquelle l'introduction doit répondre.\n3. Les mots-clés secondaires et variantes naturelles (singulier, pluriel, synonymes).\n4. Le type d'article parmi : comparer pour aider à acheter, résoudre un problème (choisir, utiliser, entretenir), preuves concrètes, crédibilité, infos de base, actualité.\n5. La structure H2/H3 des 3 premiers résultats Google (recherche web) et ce qu'ils ne couvrent pas.\n6. L'angle différenciant (donnée vérifiée et datée, méthode pas à pas, tableau comparatif, avis argumenté).\n7. 3 à 5 questions courtes à me poser pour intégrer mon expérience.\n8. Les faits externes à vérifier sur une source officielle.",
        why: "C'est l'étape que la plupart sautent. Elle évite d'écrire un article de plus qui répète les autres : l'intention, le top 3 et l'angle différenciant décident du positionnement bien plus que la longueur.",
        tip: "Activez la recherche web. Une capture de la page Google suffit pour les questions et suggestions.",
      },
      {
        title: "Rédiger l'article (format anti-pavé)",
        level: "Avancé",
        text: "À partir de cette analyse : [analyse] et de mes réponses : [mes réponses], rédige l'article.\nStructure :\n- H1 avec le mot-clé principal (50 à 65 caractères).\n- Introduction de 60 à 100 mots qui répond à la question dans les 2 premières phrases.\n- Selon le type : encadré « À retenir » (3 points) pour un guide ; sommaire seulement s'il y a 6 sections ou plus ; étapes numérotées pour un tutoriel. Pas de gabarit identique à tous les articles.\n- 3 à 6 H2 repris des vraies questions des internautes. Sous chaque H2 en forme de question, une réponse directe de 40 à 60 mots en premier paragraphe, puis le développement.\n- Plusieurs formats par section quand c'est utile (texte, liste, tableau).\n- FAQ de 2 à 5 questions seulement s'il en reste de vraies.\n- Conclusion de 40 à 70 mots avec un seul appel à l'action, descriptif, adapté à la maturité du lecteur.\nFormatage : paragraphes de 2 à 4 phrases, une idée par section, gras sur 1 à 2 passages essentiels par section, 1 à 2 encarts « À savoir » maximum.\nRègles : aucun superlatif, aucune promesse invérifiable, aucun chiffre inventé ; là où mon expérience manque, laisse [APPORT : question].",
        why: "Les internautes balaient la page, surtout sur mobile : un paragraphe acceptable sur ordinateur devient un pavé sur téléphone. La réponse directe sous chaque H2 est le format repris par les extraits de Google et par les IA.",
      },
      {
        title: "Plan de maillage et jus de lien",
        level: "Intermédiaire",
        text: "Voici mes pages : [collections, fiches, articles publiés avec leur URL]. Pour l'article « [titre] », propose 3 à 5 liens internes maximum :\n- le lien vers la page qui vend le plus (en général la catégorie du silo) placé tôt, dans le premier tiers, dans le texte ;\n- 1 à 2 liens vers des articles publiés du même silo ;\n- aucun lien vers un autre silo sauf nécessité ; aucun lien répété ;\n- des ancres descriptives (jamais « cliquez ici ») ;\n- uniquement des URL existantes et publiées.\nPuis liste les pages existantes qui devraient ajouter un lien vers ce nouvel article (maillage retour), avec l'ancre proposée.",
        why: "L'autorité d'une page se répartit entre ses liens : 3 liens = un tiers chacun. Peu de liens bien choisis, vers les pages qui vendent, transmettent plus que dix liens décoratifs. Un lien vers une page non publiée est un lien cassé.",
      },
      {
        title: "Cocon sémantique d'une boutique",
        level: "Avancé",
        text: "Ma boutique vend [produits]. Mes catégories : [liste]. Construis le cocon sémantique :\n1. Pour chaque catégorie, la requête COMMERCIALE qu'elle porte (ex. « [produit] [caractéristique] »).\n2. Pour chaque catégorie, 4 à 8 articles qui portent des requêtes D'INFORMATION (« comment… », « quel… choisir », « c'est quoi… »), sans jamais viser la même requête que la catégorie.\n3. Le regroupement en silos (thèmes), le blog ou la rubrique de chaque silo.\n4. Les règles de liens : article → sa catégorie, catégorie → ses articles, articles du même silo entre eux, pas de mélange entre silos.\n5. L'ordre de publication pour qu'aucun article ne renvoie vers une page pas encore publiée.\nRends une arborescence puis un tableau.",
        why: "La catégorie porte l'intention d'achat, l'article l'intention d'information : les séparer évite qu'ils se battent. Le silo concentre la pertinence thématique, et l'ordre de publication évite les liens cassés.",
      },
      {
        title: "Classer des mots-clés par intention",
        level: "Débutant",
        text: "Voici une liste de mots-clés avec leurs volumes mensuels (tous tirés du même outil) : [liste].\nClasse chacun : informationnel, commercial (comparer), transactionnel (acheter), navigationnel (une marque).\nIndique le type de page qui doit le cibler (article, catégorie, fiche produit, comparatif), regroupe les variantes d'une même recherche dans une seule page, et écarte les mots-clés de marques déposées.\nTableau : mot-clé | volume | intention | type de page | groupe.",
        why: "Google classe selon l'intention : une requête d'achat ne se gagne pas avec un article. Garder un seul outil pour tous les volumes évite de comparer des chiffres incomparables.",
      },
      {
        title: "Balise title et méta-description",
        level: "Débutant",
        text: "Page : [type et sujet]. Mot-clé : « [mot-clé] ». Nom du site : [nom].\nPropose 5 titles (50 à 60 caractères, mot-clé au début, nom du site en fin si la place le permet) et 5 méta-descriptions (140 à 155 caractères, contiennent le mot-clé, un fait vérifiable : dimension, matière, particularité, sans superlatif ni « livraison offerte » en tête).\nCompte les caractères de chacune et recommande la meilleure paire.",
        why: "Au-delà d'environ 60 caractères, Google coupe le titre. Une description factuelle et précise attire un clic plus qualifié qu'une promesse vague.",
      },
      {
        title: "Réponses directes pour les extraits et les IA",
        level: "Intermédiaire",
        text: "Voici les questions réelles posées sur « [sujet] » : [liste]. Pour chacune, écris une réponse de 40 à 60 mots : la réponse directe dans la première phrase, puis une précision utile ou une limite. Ensuite, formule le H2 de chaque question exactement comme l'internaute la pose.",
        why: "Un passage autonome, factuel et court est le format le plus souvent repris dans les extraits de Google et dans les réponses des assistants IA.",
      },
      {
        title: "Questions d'apport humain",
        level: "Débutant",
        text: "Je prépare un article sur « [sujet] ». Pose-moi 5 questions courtes pour en tirer mon expérience réelle : une astuce, un choix que je ferais et pourquoi, une erreur que je vois souvent, une vérification que je conseille. Ensuite, intègre mes réponses comme des avis ou des conseils, jamais comme des faits, et signale celles que tu as écartées (promesse invérifiable, cliché, marque tierce, contradiction avec un autre article).",
        why: "L'apport humain est ce qui distingue un article utile d'un contenu généré en série. Le filtrer évite d'y glisser des promesses ou des clichés.",
      },
      {
        title: "Checklist avant publication",
        level: "Intermédiaire",
        text: "Vérifie cet article avant publication et coche chaque point (OK / à corriger + correction) :\n- mot-clé dans le H1, l'introduction, au moins un H2, le title et la méta-description ;\n- réponse dans les 2 premières phrases ;\n- aucun superlatif, aucune promesse invérifiable, aucun chiffre non sourcé ;\n- 3 à 5 liens internes existants, le plus important dans le premier tiers ;\n- structure bâtie sur de vraies questions ;\n- réponse directe de 40 à 60 mots sous chaque H2 en question ;\n- paragraphes de 2 à 4 phrases, gras limité ;\n- un seul appel à l'action ;\n- tableaux lisibles sur mobile.\nArticle : [article]",
        why: "Une checklist systématique attrape les oublis qu'on ne voit plus à la relecture, et garde une qualité constante d'un article à l'autre.",
      },
      {
        title: "Après publication : indexation et maillage retour",
        level: "Débutant",
        text: "Je viens de publier [URL]. Donne-moi la liste d'actions :\n1. Demander l'indexation une seule fois dans la Search Console (Inspection de l'URL) et ce qu'il faut vérifier au passage : page accessible, pas de balise noindex, canonique correcte, rendu correct.\n2. Les pages existantes du même silo qui doivent ajouter un lien vers cet article (avec l'ancre).\n3. Un texte court et factuel pour le partager si j'ai un réseau social actif.\nRappelle ce que la demande d'indexation ne garantit pas.",
        why: "La demande d'indexation accélère la découverte et vérifie l'accessibilité, mais la répéter ne sert à rien et elle ne garantit ni l'indexation ni le positionnement. Le maillage retour, lui, aide durablement.",
      },
      {
        title: "Bilan SEO de la semaine",
        level: "Avancé",
        text: "Voici mes chiffres de la semaine : Search Console [pages indexées / découvertes, erreurs, requêtes, impressions, clics, positions], analytics [trafic, pages d'entrée, sources], ventes [commandes]. Fais un tableau de bord court : chiffres, écarts avec la semaine précédente, 3 constats, 3 actions maximum. Rappelle ce qu'il ne faut pas sur-interpréter (temps de lecture court, faibles volumes, délais d'indexation).",
        why: "Un bilan régulier et court transforme les chiffres en décisions. Un temps de lecture court n'est pas un échec si la page a répondu : regarder aussi le défilement, les clics et les conversions.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "e-commerce",
    name: "E-commerce",
    intro:
      "Fiches produits exactes et bien référencées, catégories qui portent les requêtes d'achat, Google Shopping, audit de boutique et veille concurrentielle orientée décision.",
    method: [
      "Ne jamais écrire depuis la mémoire : partir des données réelles du produit (dimensions, matières, ce que dit le fournisseur).",
      "Ce que le fournisseur affirme sans preuve s'écrit « annoncé par le fournisseur ». Une donnée absente s'écrit « non indiqué », jamais inventée.",
      "Recalculer ce qui se calcule (volume, poids, rapport prix) plutôt que recopier le fournisseur.",
      "Écriture honnête : pas de superlatif, pas de promesse invérifiable, pas de fausse urgence ni de prix barré fictif.",
    ],
    prompts: [
      {
        title: "Fiche produit exacte et référencée",
        level: "Intermédiaire",
        text: "Rédige la fiche de [produit] à partir de ces données réelles uniquement : [dimensions, poids, matières, compartiments, coloris, ce que dit le fournisseur].\nRègles :\n- calcule ce qui se calcule (ex. volume en litres = hauteur x largeur x profondeur en cm / 1 000) et n'écris jamais une valeur fournisseur supérieure au calcul ;\n- ce qui n'est pas prouvé s'écrit « annoncé par le fournisseur » ; ce qui manque, « non indiqué » ;\n- matière décrite exactement (synthétique = synthétique) ; limites dites clairement (ex. « repousse la pluie légère, ne protège pas d'une immersion »).\nStructure : nom du produit en H2, une phrase de présentation factuelle, caractéristiques en liste (matière, dimensions, capacité calculée, poids, compartiments, coloris), puis 1 lien vers la catégorie et 1 lien vers un produit complémentaire.\nTermine par la liste des informations manquantes à me demander.",
        why: "Une fiche exacte réduit les retours et les litiges, et Google comme les clients repèrent les incohérences. Calculer plutôt que recopier évite les capacités gonflées des fournisseurs.",
      },
      {
        title: "Checklist avant d'activer un produit",
        level: "Intermédiaire",
        text: "Vérifie si ce produit peut passer de brouillon à actif. Coche chaque point (OK / à corriger) :\n1. Image principale propre : fond blanc pur, aucun texte, produit à 75-90 % de l'image.\n2. Chaque variante (coloris, taille) a sa propre image liée.\n3. Description conforme, sans valeur incohérente ni mot exagéré.\n4. Titre produit propre (sans nom de boutique, sans mots en langue étrangère inutiles), title et méta-description renseignés.\n5. Prix aligné sur le marché du type de produit, aucun prix barré fictif.\n6. Tous les textes alternatifs renseignés.\n7. Liens internes vers des pages existantes et actives.\nProduit : [données ou export].",
        why: "Google Shopping affiche l'image liée à la variante et refuse les images principales avec du texte. Une checklist d'activation évite de mettre en ligne un produit refusé ou trompeur.",
      },
      {
        title: "Description de catégorie en questions-réponses",
        level: "Intermédiaire",
        text: "Écris la description de la catégorie « [nom] », qui porte la requête commerciale « [mot-clé] ». Produits de la catégorie : [liste avec leurs vraies caractéristiques].\n- H2 d'introduction : le format en une idée, 2 à 3 phrases factuelles.\n- 3 à 5 H2 en questions fréquentes réelles, chacun avec une réponse vérifiable.\n- 3 à 5 liens internes au total : produits actifs (nom exact) et articles publiés du même silo, ancres descriptives.\n- 150 à 350 mots.\nAvant d'écrire « chaque modèle… », vérifie produit par produit : un seul contre-exemple et tu reformules.\nDonne aussi le title (60 caractères max), la méta-description (155 max) et le texte alternatif de l'image de catégorie.",
        why: "La catégorie porte l'intention d'achat : la répondre par des questions réelles aide à choisir et nourrit les extraits de Google. Une généralisation fausse (« tous nos modèles… ») est une erreur fréquente et trompeuse.",
      },
      {
        title: "Titres pour Google Shopping",
        level: "Intermédiaire",
        text: "Optimise les titres produits envoyés au flux Google Shopping : [liste avec type, attributs : matière, couleur, taille, capacité, genre].\nStructure : Type de produit + attributs les plus recherchés + variante. 150 caractères maximum, l'essentiel dans les 70 premiers. Pas de texte promotionnel, pas de majuscules excessives, pas de nom de boutique.\nTableau : titre actuel | titre optimisé | nombre de caractères.",
        why: "Google Shopping associe les requêtes au titre du flux (souvent le titre du produit lui-même). Les attributs recherchés en début de titre augmentent la correspondance ; le texte promotionnel peut faire refuser le produit.",
      },
      {
        title: "Textes alternatifs du catalogue",
        level: "Débutant",
        text: "Voici les images d'un produit : [liste : principale, détails, mises en situation]. Écris un texte alternatif par image : une phrase qui décrit ce que montre l'image (type, caractéristique, coloris, angle, fond), moins de 125 caractères, sans « image de », sans répéter les mêmes mots-clés d'une image à l'autre. Propose aussi un nom de fichier : minuscules, sans accents, tirets, une seule extension.",
        why: "Un alt précis sert les personnes malvoyantes et Google Images. Un nom de fichier descriptif, fixé avant l'import, renforce le signal ; un alt vide ou en double est une occasion perdue.",
      },
      {
        title: "Audit complet de la boutique",
        level: "Avancé",
        text: "Voici l'export de ma boutique : [produits avec statut, titre, SEO, description, images et alts, variantes et prix ; catégories ; articles ; pages ; politiques].\nFais un audit qui ne signale que ce qui est vérifié (un doute devient une question) :\n- Contrôles automatiques : statut, liens internes cassés ou vers des brouillons, valeurs calculables incohérentes, mots exagérés, images sans alt ou trop petites, variantes sans image, title > 60 et description > 160 caractères, catégories et articles sans métadonnées.\n- Contrôles de cohérence : livraison, retours et délais identiques partout ; coordonnées identiques ; mentions légales complètes.\n- Priorités : P1 Google et légal, P2 catalogue, P3 images et fichiers, P4 blog et finitions.\nRends : constats numérotés (fait vérifié, où, pourquoi c'est un problème, correctif, effort), ce qui est sain, et l'ordre d'exécution. Ne propose aucune suppression sans mon accord.",
        why: "Un audit utile priorise : un produit refusé par Google ou une mention légale manquante passe avant un alt imparfait. Ne signaler que le vérifié évite de corriger des « problèmes » qui n'en sont pas.",
        tip: "Avec Claude Code ou un connecteur, faites extraire les données par requêtes et contrôler par script plutôt que relire à la main.",
      },
      {
        title: "Veille concurrentielle orientée décision",
        level: "Intermédiaire",
        text: "Question à trancher : [ex. quel prix pour X ? quel angle pour l'article Y ? quel produit ajouter ?].\nFais une recherche web sur ces concurrents : [liste]. Relève dans un tableau daté : produit équivalent, prix, promotion, livraison, garantie, angle de l'argumentaire, preuves avancées (vérifiables ou non).\nCompare à la médiane du type de produit, puis conclus par : 3 constats maximum, la décision proposée (garder, ajuster, tester), le risque, et la date de la prochaine vérification. Ne recopie aucun texte concurrent.",
        why: "Une veille sans question produit des tableaux qui ne servent à rien. Partir d'une décision à prendre et finir par une action rend chaque relevé utile.",
        tip: "Activez la recherche web.",
      },
      {
        title: "Prix de référence et promotions honnêtes",
        level: "Avancé",
        text: "Je prépare une promotion sur [produits] pour [événement commercial]. Prix actuels et date depuis laquelle ils sont en place : [liste]. Calcule le prix promotionnel pour une remise de [X] %, vérifie que le prix de référence affiché correspond au prix le plus bas pratiqué dans les 30 jours précédents, et signale les produits où la remise afficherait un prix barré trompeur. Rappelle la règle et propose un texte d'annonce sans fausse urgence.",
        why: "En France, le prix de référence d'une réduction est le prix le plus bas des 30 derniers jours (article L112-1-1 du Code de la consommation). Fixer ses prix à l'avance évite une promotion illégale.",
        tip: "Vérifiez la règle à jour sur le site de la DGCCRF avant de lancer la promotion.",
      },
      {
        title: "Analyser les avis clients",
        level: "Intermédiaire",
        text: "Voici [nombre] avis sur [mes produits / ceux d'un concurrent] : [avis]. Extrais les 5 bénéfices les plus cités avec les mots exacts des clients, les 5 craintes ou reproches les plus fréquents, et les questions qui reviennent avant l'achat. Propose ensuite les corrections de fiche et les questions de FAQ qui y répondent, sans rien promettre que le produit ne tient pas.",
        why: "Le vocabulaire et les craintes des clients sont le meilleur matériau pour une fiche : ils répondent aux vraies hésitations au lieu de deviner.",
      },
      {
        title: "Fiches en série avec Claude Code",
        level: "Avancé",
        text: "Le fichier produits.csv contient [nombre] produits avec leurs caractéristiques. Pour chaque ligne : calcule les valeurs calculables, génère titre, description (structure du modèle fiche-modele.html), title, méta-description et textes alternatifs, et écris le résultat dans produits-enrichis.csv sans modifier les colonnes existantes. Liste à part les produits où une donnée manque ou contredit le calcul. Commence par 5 produits et attends ma validation.",
        why: "Traiter tout le catalogue avec un seul modèle garantit la cohérence, et la liste des anomalies montre où les données fournisseur sont fausses.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "niche",
    name: "Recherche de niche",
    intro:
      "Trouver, mesurer et valider une niche e-commerce avant d'investir : volumes, sous-catégories, difficulté, saisonnalité, concurrence réelle sur Google, marge et conformité.",
    method: [
      "Un seul outil pour tous les volumes de recherche, sinon les chiffres ne se comparent pas. Tout chiffre est daté et sourcé ; on distingue mesuré et estimé.",
      "Une niche = un produit précis avec ses sous-catégories, pas un univers généraliste.",
      "Tous les critères comptent, pas seulement le volume : un gros volume tenu par des enseignes ou saisonnier est un piège.",
    ],
    prompts: [
      {
        title: "Grille de validation d'une niche",
        level: "Intermédiaire",
        text: "Évalue la niche « [produit] » avec ces données (toutes du même outil, datées) : [volume du mot-clé principal, sous-catégories avec volumes, difficulté SEO, volumes sur 13 mois, top 10 Google, prix constatés, coût livré estimé].\nNote chaque critère (validé / limite / éliminatoire) :\n- mot-clé principal ≥ 5 000 recherches par mois ;\n- au moins 8 sous-catégories distinctes ≥ 500 recherches (variantes fusionnées, marques exclues) ;\n- difficulté SEO ≤ 35 sur la majorité des mots-clés ;\n- saisonnalité : pic divisé par creux sur 13 mois ; 3 ou plus = saisonnier ;\n- top 10 Google : au moins 2 petites boutiques indépendantes et au plus 4 marques, enseignes ou places de marché ;\n- produit léger, peu encombrant, peu fragile ;\n- prix de vente constaté et coût livré ≤ un tiers du prix (×3 à ×4) ;\n- niveau de conformité (faible, moyen, élevé).\nConclus : retenir, creuser ou écarter, avec la raison principale. Sépare clairement mesuré et estimé.",
        why: "Valider sur une grille complète évite les deux erreurs classiques : la niche à gros volume dominée par les enseignes, et la niche saisonnière qui ne vend que deux mois par an. Les seuils sont des repères à adapter à votre modèle.",
      },
      {
        title: "Compter les vraies sous-catégories",
        level: "Intermédiaire",
        text: "Voici les mots-clés liés à « [produit] » avec leurs volumes : [liste triée par volume]. Élimine les marques, enseignes et requêtes navigationnelles ; fusionne les variantes d'une même recherche (singulier/pluriel, avec ou sans tiret ou accent) ; écarte les requêtes « pas cher », fabrication maison ou promesses invérifiables. Rends le nombre de sous-catégories distinctes ≥ 500 et leur volume cumulé.",
        why: "Une même recherche écrite de trois façons n'est pas trois sous-catégories. Les outils donnent aussi des volumes très différents selon l'orthographe : il faut tester les variantes avant de conclure.",
      },
      {
        title: "La technique de la place de marché",
        level: "Avancé",
        text: "Voici des requêtes où une grande place de marché généraliste (type Amazon) apparaît dans les 3 premiers résultats Google : [liste avec volumes et position]. Filtre : marques, livres, licences, produits adultes, saisonniers, lourds, bas de gamme (moins de 20 €), requêtes navigationnelles. Pour les requêtes restantes, explique pourquoi c'est un signal de concurrence SEO faible, et ce qu'il faut encore vérifier dans le reste du top 10.",
        why: "Quand une place de marché se classe sans optimiser sa page (souvent une page de résultats de recherche), la concurrence SEO dédiée est faible. Mais ce signal ne dit rien du reste du top 10 : la vérification Google reste obligatoire.",
      },
      {
        title: "Construire le méga menu d'une niche",
        level: "Avancé",
        text: "À partir de ces sous-catégories mesurées : [liste avec volumes], construis le méga menu de la boutique :\n- 20 liens au maximum, un seul critère de classement par colonne (usage, type, matière…), titres de colonnes non cliquables ;\n- colonnes de gauche à droite par volume cumulé, liens de haut en bas par volume décroissant, volumes entre parenthèses ;\n- synonymes et variantes dans la même catégorie ;\n- petits volumes (100 à 500) en pages secondaires reliées à leur catégorie mère, absentes du menu ;\n- aucune catégorie de moins de 2 produits ; aucune marque ni requête « pas cher ».\nTermine par le nombre de liens, les pages secondaires et le volume cumulé.",
        why: "Le menu est la première architecture SEO de la boutique : chaque lien est une catégorie qui porte une requête. Le classer par volume met en avant ce que les gens cherchent vraiment.",
      },
      {
        title: "Niveau de conformité d'un produit",
        level: "Intermédiaire",
        text: "Pour [produit], estime le niveau de conformité à respecter pour le vendre dans l'Union européenne : faible (produit passif), moyen (électrique sans radio), élevé (radio, batterie lithium, sécurité, allégation santé). Liste les obligations probables (sécurité générale des produits, marquage CE, recyclage, étiquetage, personne responsable dans l'UE) et les documents à demander au fournisseur. Précise que ce n'est pas un avis juridique et à quel organisme officiel faire valider.",
        why: "Un produit non conforme peut être bloqué ou retiré, et la responsabilité retombe sur le vendeur. Estimer le niveau tôt évite d'investir dans une niche impossible à vendre légalement.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────
  {
    id: "visuels",
    name: "Visuels produit",
    intro:
      "Des prompts pour générateurs d'images qui restent fidèles au vrai produit : image principale sur fond blanc, mises en situation, bannières, contrôle qualité et nommage des fichiers.",
    method: [
      "Toujours partir d'une vraie photo du produit : on améliore la scène, la lumière, la présentation, jamais le produit (une image « plus belle » que la réalité crée des retours).",
      "Structure du prompt : Sujet → Lumière → Style → Palette et matières → Paramètres, puis un prompt négatif.",
      "Une correction = une seule variable à la fois.",
    ],
    prompts: [
      {
        title: "Image principale sur fond blanc",
        level: "Intermédiaire",
        text: "Use the attached photo as the exact product reference. Keep the [type of product] identical: same shape, color, details and proportions. Do not add, remove or redesign any element.\n\n[Colour] [type of product], three-quarter front view, centered, product filling 85% of the frame.\nSoft diffused studio light from the left, gentle contact shadow falling to the right.\nClean packshot, commercial product photography, sharp detail.\nSeamless pure white background (#FFFFFF), matte [material] texture visible.\nSquare 1:1, high resolution.\n\nNegative prompt: text, letters, logo, watermark, props, hands, people, grey or gradient background, extra parts, color shift, distorted proportions, glossy plastic sheen, oversaturated colors.",
        why: "Les plateformes d'achat exigent une image principale sur fond uni, sans texte. La phrase d'ouverture de fidélité et le prompt négatif empêchent l'IA de redessiner le produit ou d'inventer des étiquettes.",
        tip: "Les prompts d'image fonctionnent mieux en anglais. Un coloris = sa propre photo de référence, jamais « change la couleur ».",
      },
      {
        title: "Mise en situation fidèle",
        level: "Intermédiaire",
        text: "Use the attached photo as the exact product reference. Keep the product identical. Do not add any element not present on the reference.\n\n[Product] [in use / in a simple scene], no person or only hands, no face.\nSoft directional daylight from the left, gentle shadows to the right.\nEditorial lifestyle photography, minimal composition.\n[Décor : light wood / linen / plaster wall], [palette de la marque], matte finish.\n[Aspect ratio], high resolution.\n\nNegative prompt: face, added objects, props, invented text, logo, label, numbers, clutter, distorted proportions.",
        why: "Une scène simple et cohérente avec votre direction artistique aide à se projeter. Interdire les objets ajoutés évite que l'IA invente des accessoires que le client ne recevra pas.",
      },
      {
        title: "Bannière d'article au format large",
        level: "Débutant",
        text: "[Ouverture de fidélité au produit]\n\n[Simple scene centered], no person.\nSoft directional daylight, gentle shadows.\nEditorial photography, wide negative space on both sides, subject in the central third of the width.\n[Décor et matières], [palette].\nUltra-wide aspect ratio 21:9, high resolution.\n\nNegative prompt: people, face, logo, text, letters, label, numbers, clutter, distorted proportions.",
        why: "Les thèmes recadrent souvent les bannières en pleine largeur : un sujet centré dans le tiers central survit au recadrage. Varier le décor d'un article à l'autre évite l'effet « visuel généré en série ».",
      },
      {
        title: "Contrôle qualité d'un visuel généré",
        level: "Intermédiaire",
        text: "Voici la photo de référence de mon produit [image 1] et l'image générée [image 2]. Contrôle dans l'ordre et réponds OK / problème pour chaque point :\n1. Produit identique (forme, détails, couleur).\n2. Aucun texte, logo, chiffre ni étiquette inventé (mais les marquages réellement présents sur la référence doivent être conservés).\n3. Proportions et taille relative réalistes (dimensions réelles : [dimensions]).\n4. Ombre présente et orientée selon la lumière.\n5. Aucun visage ; mains cohérentes si présentes.\n6. Recadrage : sujet entier dans la zone utile.\nPropose ensuite UNE seule correction à faire en premier, avec le prompt de correction.",
        why: "Comparer à la référence point par point attrape les hallucinations (poche en plus, fausse marque). Corriger une variable à la fois évite de casser ce qui était bon.",
      },
      {
        title: "Retirer un texte inventé",
        level: "Débutant",
        text: "Remove all text, letters and numbers from the [label / patch / tag] on the product. Keep it as a plain blank surface of the same material and color. Change nothing else in the image.",
        why: "Les générateurs écrivent souvent de faux textes. Une passe de correction ciblée, qui interdit de toucher au reste, règle le problème sans dégrader l'image.",
      },
      {
        title: "Nommer et décrire les fichiers",
        level: "Débutant",
        text: "Voici la liste des visuels de [produit] : [description de chaque image]. Pour chacun, propose : un nom de fichier (ce que montre l'image, minuscules, sans accents, tirets, une seule extension .webp) et un texte alternatif d'une phrase. Indique aussi à quelle variante (coloris) chaque image doit être liée.",
        why: "Le nom de fichier est figé à l'import : on le choisit avant. Lier chaque image à sa variante permet aux plateformes d'afficher la bonne photo pour chaque coloris.",
      },
    ],
  },
];
