# CLAUDE.md — Formation Claude Code

## Vision & Roadmap business

Le site est une **plateforme de formation Claude Code en français**. Objectif : devenir la référence francophone pour apprendre à utiliser Claude Code.

### Phases de monétisation
1. **Phase 1 — Lancement & visibilité** (actuelle)
   - Mise en ligne propre du site sur Vercel (domaine custom souhaité)
   - Promotion via **TikTok** : courtes vidéos pédagogiques, démos, tips Claude Code
   - Objectif : générer un flux constant de visiteurs, construire une audience
   - Le site doit donc être **ultra propre visuellement** (TikTok = première impression)
   - Onboarding rapide, mobile-first impeccable (majorité du trafic TikTok = mobile)

2. **Phase 2 — Monétisation par pub**
   - Quand le trafic est suffisant (objectif : quelques milliers de visites/mois)
   - Intégrer des annonces (Google AdSense ou équivalent)
   - Garder l'UX propre : pas de pub intrusive

3. **Phase 3 — Freemium / Premium**
   - Bascule vers un modèle payant :
     - **3€/mois** (abonnement)
     - **100€ paiement unique** (accès à vie)
   - Contenu gratuit limité → le reste derrière paywall (à décider le moment venu)
   - Stripe pour les paiements, gestion abonnements via Supabase

### Implications techniques à anticiper
- **SEO** : titres, meta, sitemap, OG images pour le partage social
- **Analytics** : tracker conversions visiteur → inscrit → payant (Vercel Analytics + éventuellement PostHog/Plausible)
- **Performance** : Core Web Vitals au top — le mobile TikTok est exigeant
- **Stripe-ready** : prévoir la table `subscriptions` dans Supabase dès maintenant, même si pas activée
- **Paywall futur** : le code d'authentification Supabase est conservé (désactivé) et pourra servir de base
- **Partage social** : OG images dynamiques par leçon → boost le partage TikTok/Twitter

### Ton & positionnement
- 100% français, ton accessible mais expert
- Public cible : développeurs FR curieux de l'IA, freelances, étudiants
- Différenciation : la seule formation Claude Code structurée en français

## Stack
- **Framework** : Next.js 16 App Router (Turbopack), React 18, TypeScript
- **Styles** : Tailwind 3 (jetons « Atelier » en variables CSS, mode sombre par classe `.dark`)
- **Animations** : `motion` (composants dans `components/ui/motion.tsx`)
- **Contenu** : MDX dans `content/wiki/<categorie>/<slug>.mdx`, rendu par react-markdown
- **Statistiques** : Vercel Analytics (`@vercel/analytics`, événements via `track()`)
- **DB** : Supabase (code des anciennes fonctions à compte encore présent, désactivé)
- **Déploiement** : Vercel (branche → aperçu, `main` → production)
- **Polices** : Bricolage Grotesque (titres), Figtree (texte), JetBrains Mono (code)

## Architecture

```
app/
  page.tsx                  # Accueil (portes Claude / Claude Code, nouveautés, bandeau de guidage)
  claude/  claude-code/     # Les deux parties du site, avec parcours conseillé
  wiki/                     # Index, catégories, articles ([category]/[slug])
  learn/                    # Formation Claude Code (modules et leçons)
  fiches/                   # Fiches mémo
  applications/             # Apps et MCP par thème + parcours débutant → expert
  prompts/                  # Prompts prêts à copier
  test/                     # Test de niveau (10 questions) + pages de résultat partagé
  patch-notes/              # Patch notes du site et nouveautés Claude
  recherche/                # Recherche
  evolution/                # L'évolution de Claude en graphiques animés (données : lib/evolution.ts)
  choisir-modele/           # Comparateur de modèles (données : lib/models.ts)
  template.tsx              # Transition d'entrée de page (CSS)
  (comparatifs : catégorie du wiki, content/wiki/comparatifs/)
  opengraph-image.tsx       # Images de partage (modèle dans lib/og.tsx)
components/
  site/                     # En-tête, pied, menus, bandeau de parcours, progression, thème…
  ui/motion.tsx             # BlurFade, WordReveal, StepProgress, Meter
  quiz/  wiki/              # Test de niveau, rendu et mini-quiz des articles
lib/
  wiki-manifest.ts          # SOURCE DE VÉRITÉ du wiki : catégories, articles, parties
  curriculum.ts  exercises.ts  fiches.ts
  applications.ts  app-paths.ts   # Apps par thème, parcours en 4 niveaux
  quiz.ts  share.ts               # Test de niveau, liens de partage
  article-quizzes.ts              # Mini-quiz de fin d'article
  prompts.ts  patch-notes.ts  nav.ts  og.tsx
remotion/                   # Compositions Remotion : ClaudeCodeDemo (lue dans le site), TikTokAstuces, TikTok-<id> (vidéos listées dans remotion/videos.ts)
public/media/               # Logo 3D en vidéo et objets 3D des sections (sections/*.webp), rendus Blender
public/fonts/               # Polices locales pour le rendu vidéo Remotion
proxy.ts                    # Désactive les anciennes pages/API à compte (308 / 410)
next.config.mjs             # Redirections des articles retirés
```

## Patterns importants

### Wiki
- Ajouter un article = créer le `.mdx` (frontmatter `title`, `description`, `updatedAt`, `readingMinutes`) **et** l'entrée dans `lib/wiki-manifest.ts`.
- Retirer un article = le sortir du manifest et ajouter une redirection dans `next.config.mjs`.
- Liens internes : uniquement vers des articles existants (`/wiki/<cat>/<slug>`).
- Schémas : SVG dans `public/schemas/`, insérés en Markdown `![description](/schemas/x.svg)`.

### Accès libre (depuis octobre 2026)
- Aucune connexion : tout est accessible à tous.
- Communauté, messagerie, notifications, profils, assistant IA et admin sont désactivés ; leur code reste, `proxy.ts` redirige leurs pages et leurs API répondent 410.
- Données du visiteur (test, progression, thème) : seulement dans `localStorage`, rien n'est envoyé.

### Couleurs et mode sombre
- Toutes les couleurs passent par des variables `--c-<nom>` (canaux RGB) définies dans `app/globals.css` pour `:root` et `.dark`.
- Dans les classes arbitraires, utiliser `rgb(var(--c-mark))`, jamais un hexadécimal en dur (sinon le mode sombre casse).

### Animations et vidéos
- Rendre une vidéo Remotion : `npx remotion render remotion/index.ts <Composition> sortie.mp4 --browser-executable=<chemin headless_shell>`.
- Le logo 3D est un rendu Blender (Cycles) assemblé en MP4 avec ffmpeg sur le fond clair et sur le fond sombre.
- Toute animation doit respecter « réduire les animations » et ne pas retarder l'affichage du contenu principal (vérifier avec Lighthouse).

## Variables d'environnement
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL          # optionnel, domaine de production
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY             # assistant IA (désactivé)
```

## Design (direction « Atelier », octobre 2026)
- Papier chaud `#fbf6ee`, encre `#2b2119`, vert sapin `#2f5d46` pour les actions, souci `#f2b23e` / `#fbe3a8` pour surligner
- Classes utiles : `.text-mark` (surligneur), `.tag-note` (étiquette post-it), `.btn-primary`, `.btn-secondary`, `.soft-lift`
- À éviter : dégradés de texte, halos flous animés, bandeaux défilants, compteurs animés, glassmorphism
- Animations courtes, toujours compatibles avec « réduire les animations »

## Commandes
```bash
npm run dev    # Serveur de développement
npm run build  # Build de production (à lancer avant chaque push)
git push       # Une branche crée un aperçu Vercel ; main part en production
```

## Conventions
- Tout le site est en français, au vouvoiement, avec la typographie française (espace avant : ; ? !, guillemets « »), sans tiret cadratin comme ponctuation.
- Composants en fichiers séparés dans `components/`, styles en classes Tailwind.
- Mobile d'abord : vérifier à 390 px de large qu'aucun élément ne déborde.
- Vérifier les faits sur Claude dans la documentation officielle avant de les écrire, et citer les sources en fin d'article.
- Ne pas toucher aux routes API sans vérifier l'auth.
- À chaque mise à jour du site ou nouveauté de Claude : ajouter une entrée en haut de `lib/patch-notes.ts` (page /patch-notes).
