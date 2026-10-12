# Mission : design pro et sobre + formation enrichie

Tu travailles sur **Claude Mastery**, un site Next.js 16 (App Router, Turbopack, React 18, TypeScript, Tailwind 3) qui apprend Claude et Claude Code en français. Le site est gratuit, sans compte, et il est promu sur TikTok, donc la majorité des visiteurs sont sur mobile.

Avant toute chose, lis `CLAUDE.md` à la racine : il fait foi pour l'architecture, les conventions et la direction artistique. En cas de conflit entre ce prompt et `CLAUDE.md`, applique ce prompt pour le design et signale le conflit dans ton résumé final.

Tu as deux chantiers, à faire dans cet ordre :
- **Partie A**, le design : le rendre professionnel, sobre et épuré.
- **Partie B**, la formation : l'enrichir en données.

---

## Règles générales (non négociables)

1. **Langue** : tout le texte visible est en français, au vouvoiement, avec la typographie française : espace avant `: ; ? !` et guillemets « ». N'utilise jamais le tiret cadratin (—) comme ponctuation.
2. **Couleurs** : toutes les couleurs passent par les variables `--c-<nom>` de `app/globals.css`, définies pour `:root` et `.dark`. Dans les classes Tailwind arbitraires, écris `rgb(var(--c-…))` et jamais un hexadécimal en dur. Seule exception : le terminal sombre, qui reste sombre dans les deux thèmes.
3. **Mobile d'abord** : vérifie chaque page modifiée à 390 px de large. Aucun débordement horizontal n'est accepté.
4. **Performance** : ne dégrade pas les Core Web Vitals. Aucune nouvelle dépendance lourde. Aucune police supplémentaire.
5. **Accessibilité** : contraste WCAG AA, focus visible au clavier, cibles tactiles d'au moins 44 px, et « réduire les animations » respecté partout.
6. **Faits** : n'invente aucun chiffre, aucune commande et aucun nom de fonctionnalité de Claude ou Claude Code. Reprends ce qui existe déjà dans `content/wiki/` ou `lib/`, ou vérifie dans la documentation officielle (docs.claude.com, code.claude.com) et cite la source. Dans le doute, n'écris pas.
7. **Ne touche pas** aux éléments suivants :
   - les routes API et `proxy.ts` ;
   - le code Supabase désactivé ;
   - `next.config.mjs`, sauf pour ajouter une redirection ;
   - les URL existantes : aucune page ne doit disparaître.
8. **Patch notes** : à la fin, ajoute une entrée en haut de `lib/patch-notes.ts`, de type `kind: "site"`, avec la version suivante.
9. **Validation** : `npm run build` doit passer sans erreur avant chaque commit. Fais des commits petits et clairs, en français.

---

## Partie A : design pro, sobre et épuré

### Objectif

Le site doit inspirer confiance au premier coup d'œil, comme un bon manuel ou la documentation d'un outil haut de gamme. Il garde son identité : papier chaud, encre, vert sapin, touche de souci. Il doit en revanche y avoir moins d'effets et plus de rigueur.

### A1. Audit d'abord, sans rien modifier

Parcours ces pages en clair et en sombre, à 390 px et à 1440 px :
- `/`
- `/claude`
- `/claude-code`
- `/learn` et une leçon
- `/wiki` et un article
- `/fiches`
- `/applications`
- `/prompts`
- `/test`
- `/evolution`
- `/choisir-modele`
- `/patch-notes`

Écris ensuite dans `docs/audit-design.md` la liste des incohérences trouvées :
- tailles de titres différentes d'une page à l'autre ;
- espacements irréguliers ;
- rayons de bordure multiples ;
- ombres décalées utilisées de façon inégale ;
- boutons de styles différents ;
- couleurs en dur ;
- éléments qui débordent ;
- textes trop longs sur mobile.

### A2. Système de design resserré

Dans `tailwind.config.*` et `app/globals.css`, fixe et documente les éléments suivants.

**Échelle typographique** : 6 niveaux au maximum (display, h1, h2, h3, corps, petit), chacun avec sa taille mobile et desktop. Remplace partout les tailles arbitraires (`text-[38px]`, `text-[42px]`, etc.) par ces niveaux.

**Espacements de section** : 2 valeurs seulement, une section normale et une section compacte.

**Rayons** : 2 valeurs, petit pour les boutons et les champs, moyen pour les cartes.

**Ombres** : un seul style d'ombre décalée « post-it », réservé aux éléments vraiment mis en avant. Une seule carte par écran au maximum. Partout ailleurs, utilise une bordure fine.

**Boutons** : `.btn-primary` et `.btn-secondary`, avec la même hauteur, le même padding et le même poids partout. Supprime les variantes ad hoc.

**Largeur de lecture** : 68 à 72 caractères pour le texte courant.

### A3. Sobriété des animations

Garde les animations, mais rends-les discrètes et rapides :
- **Transition de page** (`components/site/PageCurtain.tsx`) : remplace le rideau plein écran par un fondu enchaîné court (200 ms au plus), ou par une fine barre de progression en haut. Ne bloque jamais la navigation plus de 150 ms.
- **`components/site/ScrollFX.tsx`** :
  - garde le surligneur tracé ;
  - réduis l'apparition des blocs à 12 px de déplacement et 0,4 s, sans rotation.
- **`components/site/ScrollStory.tsx`** :
  - garde la section, mais avec un fond `surface-container-low` au lieu du vert plein ;
  - réduis le grand numéro de fond à une opacité très faible, ou supprime-le.
- **`ClickRipple`** : garde-le uniquement sur `.btn-primary`.
- **Interdits** : dégradés de texte, halos flous, glassmorphism, bandeaux défilants, compteurs animés, animations en boucle hors du logo 3D de l'accueil.

### A4. Hiérarchie et lisibilité

- **Accueil** : la promesse, un seul appel à l'action principal (« Commencer la formation » ou « Faire le test de niveau »), puis les deux portes Claude et Claude Code. Allège tout ce qui suit : regroupe, raccourcis, supprime les doublons.
- **En-tête** : 6 liens au maximum sur desktop, regroupés si besoin (par exemple « Ressources » pour Fiches, Prompts, Évolution et Patch notes). Le menu mobile doit être clair, avec des cibles de 44 px.
- **Articles et leçons** :
  - interligne 1,7 ;
  - titres h2 avec un espace généreux au-dessus ;
  - blocs de code bien contrastés ;
  - tableaux avec défilement horizontal sur mobile.
- **Pied de page** : des colonnes rangées, sans liens en double.

### A5. Contrôle

Fais des captures avant et après des pages de A1 (Playwright est disponible), en clair et en sombre, à 390 et à 1440 px. Liste dans `docs/audit-design.md` ce qui a été corrigé.

---

## Partie B : enrichir la formation en données

### Ce qui existe

- `lib/curriculum.ts` contient les modules et les leçons.
  - Une leçon (`Lesson`) a les champs `id`, `title`, `duration`, `tag?`, `intro`, `sections`, `exercises?`.
  - Une section (`LessonSection`) a les champs `heading`, `body`, `code`, `callout`, `bullets`, `table`, `keypoints`.
- `lib/modules/` contient des modules supplémentaires (api, prompt-engineering, saas-practical, skills), réunis dans `lib/modules/_index.ts`.
- Les pages sont `app/learn/page.tsx`, `app/learn/[moduleId]/page.tsx` et `app/learn/[moduleId]/[lessonId]/page.tsx`.
- Ressources liées :
  - `lib/exercises.ts` et `lib/fiches.ts` ;
  - `lib/article-quizzes.ts` pour les mini-quiz ;
  - `lib/wiki-manifest.ts`, la source de vérité du wiki.

### B1. Nouvelles données par leçon

Étends les types sans casser l'existant : chaque nouveau champ est optionnel.

- `level` : `"débutant" | "intermédiaire" | "avancé"`.
- `objectives: string[]` : 2 à 4 objectifs, chacun commence par un verbe (« Installer… », « Écrire un CLAUDE.md… »).
- `prerequisites: string[]` : identifiants des leçons à faire avant.
- `takeaways: string[]` : 3 à 5 points à retenir.
- `quiz` : 3 questions à choix multiples, de la même forme que `lib/article-quizzes.ts`, avec l'explication de chaque bonne réponse.
- `commands` : les commandes ou raccourcis vus dans la leçon, avec une ligne d'explication chacun. Uniquement des commandes réelles, déjà présentes dans le wiki.
- `resources` : 2 à 4 liens internes vers des articles existants (`/wiki/<cat>/<slug>` présents dans `lib/wiki-manifest.ts`) et vers la documentation officielle.
- `practice` : un mini-projet concret (« À vous de jouer ») avec un critère de réussite vérifiable.
- `minutes: number` : la durée en minutes, calculée de façon cohérente avec `duration`.

### B2. Nouvelles données par module

- `level`, `outcome` (ce que l'on sait faire à la fin, en une phrase) et `minutes`, ce dernier calculé à partir des leçons.
- `project` : un projet de fin de module avec 3 à 5 étapes et un critère de validation.

### B3. Remplissage

Remplis ces champs pour **toutes** les leçons et **tous** les modules, y compris ceux de `lib/modules/`.
- Le contenu vient du texte de la leçon et des articles du wiki. N'ajoute aucune affirmation qui n'y figure pas déjà.
- Écris dans un français simple, au vouvoiement, avec des phrases courtes.

### B4. Affichage, toujours sobre

**Page leçon :**
- en haut, un encart avec le niveau, la durée, les objectifs et les prérequis (avec des liens) ;
- en bas, dans cet ordre : « À retenir », les commandes vues, « À vous de jouer », le quiz, puis les ressources ;
- la leçon précédente et la suivante.

**Page module** : le résultat attendu, la durée totale, la liste des leçons avec leur niveau et leur durée, et le projet de fin de module.

**Page `/learn` :**
- un résumé chiffré, entièrement calculé depuis les données, jamais écrit en dur : nombre de modules, nombre de leçons, heures totales, nombre de quiz et nombre d'exercices ;
- un parcours conseillé débutant → avancé ;
- un filtre par niveau.

**Progression :**
- case « Leçon terminée » enregistrée dans `localStorage` (rien n'est envoyé) ;
- barre de progression par module et sur `/learn` ;
- réutilise les composants existants : `Meter` et `StepProgress` dans `components/ui/motion.tsx`.

**SEO :**
- données structurées `Course` (sur `/learn`) et `LearningResource` (sur chaque leçon) en JSON-LD ;
- titre et description uniques par leçon.

### B5. Contrôles automatiques

Ajoute un script `scripts/check-curriculum.ts`, lancé avant le build ou dans `npm run lint`, qui fait échouer le build si :
- un lien de `resources` ou de `prerequisites` pointe vers une leçon ou un article qui n'existe pas ;
- un quiz n'a pas exactement une bonne réponse par question ;
- une leçon n'a ni objectifs ni « à retenir ».

---

## Livrables attendus

1. `docs/audit-design.md`, avec l'audit, les corrections et les captures avant / après.
2. Le système de design resserré, documenté en commentaire dans `tailwind.config.*` et `app/globals.css`.
3. Les animations adoucies (A3) et la hiérarchie revue (A4).
4. Les types étendus, les données remplies pour toutes les leçons et tous les modules, et l'affichage associé (B1 à B4).
5. `scripts/check-curriculum.ts`.
6. Une entrée de patch note, `CLAUDE.md` mis à jour (nouveaux champs, nouveaux composants, règles de sobriété) et `npm run build` vert.
7. Un résumé final contenant :
   - la liste de ce qui a changé ;
   - la liste de ce que tu n'as pas pu vérifier ;
   - tout conflit avec `CLAUDE.md`.

Travaille par étapes : l'audit, puis le système de design, puis les pages, puis les données, puis l'affichage, puis les contrôles. Lance le build et fais un commit à chaque étape.
