# Audit du design Claude Mastery

Audit initial du 12 octobre 2026, avant toute modification de l’interface. Source : branche `main` du dépôt `haroneait-dev/code`. Build initial réussi.

## Méthode et captures avant

Les 14 pages ci-dessous ont été parcourues dans Chrome via Playwright, en clair et sombre, à 390 × 900 et 1440 × 900. Les captures sont pleine page. Les animations sont réduites pour rendre les captures comparables ; les effets ont aussi été examinés dans le code. Les mesures de largeur et les erreurs JavaScript sont enregistrées dans [mesures avant](captures/avant/mesures.json).

| Page | Titre à 390 px | Titre à 1440 px | Captures avant |
| --- | --- | --- | --- |
| `/` | 42px | 72px | [390 light](captures/avant/accueil-390-light.jpg) · [390 dark](captures/avant/accueil-390-dark.jpg) · [1440 light](captures/avant/accueil-1440-light.jpg) · [1440 dark](captures/avant/accueil-1440-dark.jpg) |
| `/claude` | 40px | 64px | [390 light](captures/avant/claude-390-light.jpg) · [390 dark](captures/avant/claude-390-dark.jpg) · [1440 light](captures/avant/claude-1440-light.jpg) · [1440 dark](captures/avant/claude-1440-dark.jpg) |
| `/claude-code` | 40px | 64px | [390 light](captures/avant/claude-code-390-light.jpg) · [390 dark](captures/avant/claude-code-390-dark.jpg) · [1440 light](captures/avant/claude-code-1440-light.jpg) · [1440 dark](captures/avant/claude-code-1440-dark.jpg) |
| `/learn` | 48px | 64px | [390 light](captures/avant/learn-390-light.jpg) · [390 dark](captures/avant/learn-390-dark.jpg) · [1440 light](captures/avant/learn-1440-light.jpg) · [1440 dark](captures/avant/learn-1440-dark.jpg) |
| `/learn/intro/chatting-vs-delegating` | 40px | 48px | [390 light](captures/avant/learn-intro-chatting-vs-delegating-390-light.jpg) · [390 dark](captures/avant/learn-intro-chatting-vs-delegating-390-dark.jpg) · [1440 light](captures/avant/learn-intro-chatting-vs-delegating-1440-light.jpg) · [1440 dark](captures/avant/learn-intro-chatting-vs-delegating-1440-dark.jpg) |
| `/wiki` | 40px | 64px | [390 light](captures/avant/wiki-390-light.jpg) · [390 dark](captures/avant/wiki-390-dark.jpg) · [1440 light](captures/avant/wiki-1440-light.jpg) · [1440 dark](captures/avant/wiki-1440-dark.jpg) |
| `/wiki/claude-bases/bien-demander` | 34px | 48px | [390 light](captures/avant/wiki-claude-bases-bien-demander-390-light.jpg) · [390 dark](captures/avant/wiki-claude-bases-bien-demander-390-dark.jpg) · [1440 light](captures/avant/wiki-claude-bases-bien-demander-1440-light.jpg) · [1440 dark](captures/avant/wiki-claude-bases-bien-demander-1440-dark.jpg) |
| `/fiches` | 48px | 64px | [390 light](captures/avant/fiches-390-light.jpg) · [390 dark](captures/avant/fiches-390-dark.jpg) · [1440 light](captures/avant/fiches-1440-light.jpg) · [1440 dark](captures/avant/fiches-1440-dark.jpg) |
| `/applications` | 40px | 64px | [390 light](captures/avant/applications-390-light.jpg) · [390 dark](captures/avant/applications-390-dark.jpg) · [1440 light](captures/avant/applications-1440-light.jpg) · [1440 dark](captures/avant/applications-1440-dark.jpg) |
| `/prompts` | 40px | 64px | [390 light](captures/avant/prompts-390-light.jpg) · [390 dark](captures/avant/prompts-390-dark.jpg) · [1440 light](captures/avant/prompts-1440-light.jpg) · [1440 dark](captures/avant/prompts-1440-dark.jpg) |
| `/test` | 40px | 60px | [390 light](captures/avant/test-390-light.jpg) · [390 dark](captures/avant/test-390-dark.jpg) · [1440 light](captures/avant/test-1440-light.jpg) · [1440 dark](captures/avant/test-1440-dark.jpg) |
| `/evolution` | 40px | 64px | [390 light](captures/avant/evolution-390-light.jpg) · [390 dark](captures/avant/evolution-390-dark.jpg) · [1440 light](captures/avant/evolution-1440-light.jpg) · [1440 dark](captures/avant/evolution-1440-dark.jpg) |
| `/choisir-modele` | 40px | 60px | [390 light](captures/avant/choisir-modele-390-light.jpg) · [390 dark](captures/avant/choisir-modele-390-dark.jpg) · [1440 light](captures/avant/choisir-modele-1440-light.jpg) · [1440 dark](captures/avant/choisir-modele-1440-dark.jpg) |
| `/patch-notes` | 40px | 64px | [390 light](captures/avant/patch-notes-390-light.jpg) · [390 dark](captures/avant/patch-notes-390-dark.jpg) · [1440 light](captures/avant/patch-notes-1440-light.jpg) · [1440 dark](captures/avant/patch-notes-1440-dark.jpg) |

## Incohérences constatées

- Typographie : les pages utilisent une multitude de tailles arbitraires ; le titre des leçons et celui des articles ne suivent pas la même échelle. L’introduction de la première leçon occupe une grande partie du premier écran mobile.
- Rythme : sections avec `py-12`, `py-16`, `py-20`, `py-24` et espacements asymétriques. Les longues descriptions des portes de l’accueil retardent l’accès au contenu.
- Rayons : valeurs de 3 px à 18 px, classes `sm`, `md`, `lg`, `xl`, `2xl` et pilules. Pas de distinction claire entre champs et cartes.
- Ombres : plusieurs décalages et couleurs, y compris deux cartes côte à côte sur l’accueil et des ombres au survol.
- Boutons : hauteur de 36 px dans l’en-tête contre 48 px ailleurs ; padding et tailles de texte définis localement. Recherche, thème et menu ont des cibles de 36 ou 40 px.
- Couleurs : hexadécimaux dans les boutons, ScrollStory, les quiz et les encarts des leçons ; couleurs de niveaux en `rgba` ; coloration de code importée sans jetons de thème.
- Navigation : sept liens desktop plus le test ; pas de regroupement des ressources. Le pied de page aligne huit liens de plateforme dans une seule colonne.
- Animations : PageCurtain intercepte les liens et attend 420 ms ; apparitions de 28 px avec rotation et délais cumulés. Objets flottants, curseurs clignotants et flou des révélations.
- Formation : durée totale écrite en dur ; pas de page récapitulative `/learn/[moduleId]`, ni de niveau, objectifs, quiz ou projet explicites dans le modèle de leçon.
- Débordements : aucun débordement horizontal de document constaté sur les 56 combinaisons initiales. Les tableaux et blocs de code doivent garder leur défilement propre. La largeur des deux barres latérales de leçon laisse peu de place au texte à 1440 px.

## Corrections réalisées

- Six niveaux typographiques responsives communs, deux rayons et deux espacements de section. Les alias hérités pointent sur les mêmes jetons ; les tailles arbitraires des pages publiques ont été remplacées. Les marges doublées entre conteneur et introduction ont été supprimées après revue des captures.
- Boutons de 48 px avec géométrie commune, cibles des boutons et champs d’au moins 44 px. Focus visible, menu mobile avec focus initial, boucle de tabulation, retour du focus et fermeture par Échap.
- Cinq liens principaux desktop et un menu Ressources. Pied de page réparti entre plateforme, ressources et informations légales, sans doublons.
- Une seule ombre disponible dans le système, non utilisée sur les cartes courantes. Suppression des ombres et rotations locales ; couleurs des encarts, niveaux et textes reliées aux variables des deux thèmes. Les couleurs fixes du terminal sombre constituent l’exception prévue.
- PageCurtain remplacé par une barre de 180 ms, sans interception des liens ni attente avant navigation. ScrollFX : déplacement de 12 px, durée de 400 ms, sans rotation ni délai en cascade. ScrollStory garde sa scène sur un fond `surface-container-low`, sans numéro monumental. ClickRipple est limité aux boutons principaux.
- Suppression des compteurs animés, objets flottants, curseurs clignotants et signal pulsant. Lecteur de démonstration commandé par le visiteur, sans boucle ; réduction des animations prise en compte dans les composants Motion.
- Accueil : promesse, CTA « Commencer la formation », deux portes raccourcies, démonstration, trois actualités et défi. Suppression des exemples longs dans les portes et du dernier encart redondant.
- Articles et leçons : largeur de 70 caractères, interligne 1,7, tableaux et code à défilement interne, code contrasté dans les deux thèmes. Le sommaire de leçon est accessible dans un encart ; la seconde barre latérale n’écrase plus le texte.
- Formation : 14 modules et 49 leçons enrichis, objectifs, prérequis liés, synthèses, commandes attestées dans le wiki, ressources, mini-projets et quiz corrigés. Les 483 minutes proviennent des durées existantes ; les 142 exercices et mini-projets sont calculés depuis les données. Les projets de module ont 3 à 5 étapes.
- Nouvelles pages récapitulatives de module, parcours conseillé et filtre de niveau. Progression locale avec Meter et StepProgress, synchronisation entre onglets, récupération en mémoire si le stockage est refusé. Les quiz de leçon n’envoient pas d’événement analytique.
- Métadonnées uniques pour les 49 leçons, JSON-LD Course sur l’index et LearningResource par leçon. Contrôle de formation obligatoire avant build et tests négatifs pour vérifier son efficacité.
- CLAUDE.md actualisé, patch note Site 3.3 ajoutée. Les API, proxy, configuration Next.js, code Supabase désactivé et URL existantes sont conservés.

## Captures après

Les pages de référence ont de nouveau été parcourues à 390 et 1440 px dans les deux thèmes. Les pages de module Introduction et API, ainsi que la redirection historique `/experience`, complètent le contrôle. Le format PNG est utilisé pour les captures dépassant la hauteur maximale du JPEG.

| Page | Titre mobile / desktop | Captures après |
| --- | --- | --- |
| `/` | 38px / 64px | [390 light](captures/apres/accueil-390-light.jpg) · [390 dark](captures/apres/accueil-390-dark.jpg) · [1440 light](captures/apres/accueil-1440-light.jpg) · [1440 dark](captures/apres/accueil-1440-dark.jpg) |
| `/claude` | 32px / 48px | [390 light](captures/apres/claude-390-light.jpg) · [390 dark](captures/apres/claude-390-dark.jpg) · [1440 light](captures/apres/claude-1440-light.jpg) · [1440 dark](captures/apres/claude-1440-dark.jpg) |
| `/claude-code` | 32px / 48px | [390 light](captures/apres/claude-code-390-light.jpg) · [390 dark](captures/apres/claude-code-390-dark.jpg) · [1440 light](captures/apres/claude-code-1440-light.jpg) · [1440 dark](captures/apres/claude-code-1440-dark.jpg) |
| `/learn` | 32px / 48px | [390 light](captures/apres/learn-390-light.jpg) · [390 dark](captures/apres/learn-390-dark.jpg) · [1440 light](captures/apres/learn-1440-light.jpg) · [1440 dark](captures/apres/learn-1440-dark.jpg) |
| `/learn/intro/chatting-vs-delegating` | 32px / 48px | [390 light](captures/apres/learn-intro-chatting-vs-delegating-390-light.jpg) · [390 dark](captures/apres/learn-intro-chatting-vs-delegating-390-dark.jpg) · [1440 light](captures/apres/learn-intro-chatting-vs-delegating-1440-light.jpg) · [1440 dark](captures/apres/learn-intro-chatting-vs-delegating-1440-dark.jpg) |
| `/wiki` | 32px / 48px | [390 light](captures/apres/wiki-390-light.jpg) · [390 dark](captures/apres/wiki-390-dark.jpg) · [1440 light](captures/apres/wiki-1440-light.jpg) · [1440 dark](captures/apres/wiki-1440-dark.jpg) |
| `/wiki/claude-bases/bien-demander` | 32px / 48px | [390 light](captures/apres/wiki-claude-bases-bien-demander-390-light.jpg) · [390 dark](captures/apres/wiki-claude-bases-bien-demander-390-dark.jpg) · [1440 light](captures/apres/wiki-claude-bases-bien-demander-1440-light.jpg) · [1440 dark](captures/apres/wiki-claude-bases-bien-demander-1440-dark.jpg) |
| `/fiches` | 32px / 48px | [390 light](captures/apres/fiches-390-light.jpg) · [390 dark](captures/apres/fiches-390-dark.jpg) · [1440 light](captures/apres/fiches-1440-light.jpg) · [1440 dark](captures/apres/fiches-1440-dark.jpg) |
| `/applications` | 32px / 48px | [390 light](captures/apres/applications-390-light.jpg) · [390 dark](captures/apres/applications-390-dark.jpg) · [1440 light](captures/apres/applications-1440-light.jpg) · [1440 dark](captures/apres/applications-1440-dark.jpg) |
| `/prompts` | 32px / 48px | [390 light](captures/apres/prompts-390-light.png) · [390 dark](captures/apres/prompts-390-dark.png) · [1440 light](captures/apres/prompts-1440-light.jpg) · [1440 dark](captures/apres/prompts-1440-dark.jpg) |
| `/test` | 32px / 48px | [390 light](captures/apres/test-390-light.jpg) · [390 dark](captures/apres/test-390-dark.jpg) · [1440 light](captures/apres/test-1440-light.jpg) · [1440 dark](captures/apres/test-1440-dark.jpg) |
| `/evolution` | 32px / 48px | [390 light](captures/apres/evolution-390-light.jpg) · [390 dark](captures/apres/evolution-390-dark.jpg) · [1440 light](captures/apres/evolution-1440-light.jpg) · [1440 dark](captures/apres/evolution-1440-dark.jpg) |
| `/choisir-modele` | 32px / 48px | [390 light](captures/apres/choisir-modele-390-light.jpg) · [390 dark](captures/apres/choisir-modele-390-dark.jpg) · [1440 light](captures/apres/choisir-modele-1440-light.jpg) · [1440 dark](captures/apres/choisir-modele-1440-dark.jpg) |
| `/patch-notes` | 32px / 48px | [390 light](captures/apres/patch-notes-390-light.jpg) · [390 dark](captures/apres/patch-notes-390-dark.jpg) · [1440 light](captures/apres/patch-notes-1440-light.jpg) · [1440 dark](captures/apres/patch-notes-1440-dark.jpg) |
| `/learn/intro` | 32px / 48px | [390 light](captures/apres/learn-intro-390-light.jpg) · [390 dark](captures/apres/learn-intro-390-dark.jpg) · [1440 light](captures/apres/learn-intro-1440-light.jpg) · [1440 dark](captures/apres/learn-intro-1440-dark.jpg) |
| `/learn/api` | 32px / 48px | [390 light](captures/apres/learn-api-390-light.jpg) · [390 dark](captures/apres/learn-api-390-dark.jpg) · [1440 light](captures/apres/learn-api-1440-light.jpg) · [1440 dark](captures/apres/learn-api-1440-dark.jpg) |
| `/experience` | 38px / 64px | [390 light](captures/apres/experience-390-light.jpg) · [390 dark](captures/apres/experience-390-dark.jpg) · [1440 light](captures/apres/experience-1440-light.jpg) · [1440 dark](captures/apres/experience-1440-dark.jpg) |

## Résultats des contrôles

- **Build** : `npm run build` réussi avant chaque commit d’étape ; 1 107 pages produites pour la version finale, dont 14 nouvelles pages de module. Aucune dépendance ajoutée.
- **Données** : `npm run check:curriculum` et `npm run test:curriculum` réussis. Les tests négatifs couvrent ressource absente, prérequis absent, indice de réponse invalide, options dupliquées, absence de contenu pédagogique et cycle de prérequis.
- **Captures** : 56 avant et 68 après ; aucune capture vide, aucun document plus large que le viewport, aucun statut d’échec ni erreur JavaScript. [Mesures après](captures/apres/mesures.json).
- **Formation** : 98 visites de leçon et 28 visites de module en clair et sombre à 390 px, sans débordement ; 49 titres uniques et JSON-LD conformes aux données. Filtre, navigation, quiz, sauvegarde après rechargement, stockage corrompu ou refusé et focus du menu vérifiés. [Rapport fonctionnel](captures/verification-fonctionnelle.json).
- **Contraste** : 20 paires principales de couleurs de texte atteignent au moins 4,5:1 dans les deux thèmes. Les chiffres souci sur fond clair ont été remplacés par un jeton plus contrasté. [Ratios contrôlés](captures/contrastes-jetons.json).
- **Périmètre protégé** : aucun changement des routes API, de proxy.ts, de next.config.mjs ni du code Supabase désactivé. La route `/experience` garde sa redirection existante vers l’accueil.

## Limites et conflits avec CLAUDE.md

- Les captures et tests sont locaux, dans Chrome, avec une hauteur de viewport de 900 px. Ils ne remplacent pas une revue sur Safari/iOS, un lecteur d’écran ou un appareil physique. Les paires de contraste contrôlées ne constituent pas un audit exhaustif de tous les états interactifs.
- Les Core Web Vitals réels et les scores Lighthouse avant/après ne sont pas mesurés. Aucun résultat de performance en production n’est revendiqué. Les données complètes du cours restent côté serveur ; le catalogue client ne reçoit que les résumés.
- Le déploiement Vercel et son éventuelle protection ne font pas partie de la vérification locale. Les liens internes sont contrôlés automatiquement ; les deux pages d’entrée de documentation officielle ont été ouvertes, mais chaque détail historique du cours n’a pas été réaudité. Le nouvel enrichissement s’appuie sur le texte existant et les articles du wiki, sans ajouter de chiffre de produit.
- Les MP4 du logo 3D sont absents du dépôt. Les posters WebP existants sont conservés comme affichage de remplacement, ce qui évite les requêtes 404 observées initialement.
- **Conflit résolu** : CLAUDE.md décrivait un rideau plein écran avec logo. La mission impose une navigation non bloquante et prime pour le design ; la barre courte remplace ce rideau. La description et les règles de sobriété ont été mises à jour.

Les commandes reproductibles sont décrites dans [verification.md](verification.md). Les sources officielles liées dans les ressources sont [Claude Code](https://code.claude.com/docs/en/overview) et [la documentation de l’API Claude](https://platform.claude.com/docs/en/intro).
