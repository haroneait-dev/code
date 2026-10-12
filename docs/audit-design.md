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

## Corrections et vérification après

Cette section sera complétée après les étapes de design, de données et de contrôle. Les captures ne constituent pas une mesure de Core Web Vitals en conditions réelles.
