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
   - Contenu gratuit limité (module `intro` actuel) → reste derrière paywall
   - Stripe pour les paiements, gestion abonnements via Supabase

### Implications techniques à anticiper
- **SEO** : titres, meta, sitemap, OG images pour le partage social
- **Analytics** : tracker conversions visiteur → inscrit → payant (Vercel Analytics + éventuellement PostHog/Plausible)
- **Performance** : Core Web Vitals au top — le mobile TikTok est exigeant
- **Stripe-ready** : prévoir la table `subscriptions` dans Supabase dès maintenant, même si pas activée
- **Auth gate actuel** = fondation du futur paywall (juste à étendre)
- **Partage social** : OG images dynamiques par leçon → boost le partage TikTok/Twitter

### Ton & positionnement
- 100% français, ton accessible mais expert
- Public cible : développeurs FR curieux de l'IA, freelances, étudiants
- Différenciation : la seule formation Claude Code structurée en français

## Stack
- **Framework** : Next.js 16 App Router (Turbopack)
- **Language** : TypeScript
- **Auth + DB** : Supabase (auth, postgres, RLS)
- **IA** : Anthropic API (`@anthropic-ai/sdk`) — claude-sonnet-4-6
- **Déploiement** : Vercel
- **Fonts** : Inter + JetBrains Mono (Google Fonts)

## Architecture

```
app/
  page.tsx              # SPA principale (~1900 lignes, "use client")
  globals.css           # Tous les styles + animations
  layout.tsx            # Root layout
  auth/callback/        # OAuth PKCE callback (Supabase SSR)
  api/
    chat/               # POST — assistant IA avec streaming + web search
    wiki/               # GET liste, POST nouvelle tip
    wiki/[id]/          # DELETE (admin seulement, vérifie JWT)
    wiki/[id]/vote/     # POST upvote
    skills/             # GET liste skills communauté
    skills/[id]/vote/   # POST upvote skill
lib/
  curriculum.ts         # Tout le contenu de la formation (modules + leçons)
  exercises.ts          # Exercices par leçon
  supabase.ts           # Client Supabase lazy-init via Proxy
```

## Patterns importants

### SPA pattern
`app/page.tsx` est un seul composant "use client". L'état `view` gère la navigation :
- `"home"` → HomePage
- `"lesson"` → LessonView
- `"wiki"` → WikiView

### Accès libre (depuis octobre 2026)
- Aucune connexion : formation, wiki et fiches sont accessibles à tous.
- Communauté, messagerie, notifications, profils, assistant IA et admin sont désactivés.
  Leur code est resté en place ; `proxy.ts` redirige leurs pages vers `/` et leurs API répondent 410.
- Articles retirés : redirections permanentes dans `next.config.mjs`.

### Supabase client
- Client lazy via Proxy dans `lib/supabase.ts`
- Routes API utilisent `createClient` avec `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS
- Auth OAuth PKCE via `@supabase/ssr` dans `app/auth/callback/route.ts`

### Streaming IA
- Route `/api/chat` : POST avec `Authorization: Bearer <token>`
- Vérifie le token Supabase, puis appelle Anthropic avec streaming + web_search
- Client lit le body stream avec `ReadableStream` + `TextDecoder`

## Variables d'environnement
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_ADMIN_EMAIL=haroneait@gmail.com
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
```

## Design (direction « Atelier », octobre 2026)
- Papier chaud `#fbf6ee`, encre `#2b2119`, vert sapin `#2f5d46` pour les actions, souci `#f2b23e` / `#fbe3a8` pour surligner
- Jetons dans `tailwind.config.ts` (noms Material conservés) et `app/globals.css`
- Polices : Bricolage Grotesque (titres), Figtree (texte), JetBrains Mono (code)
- Classes utiles : `.text-mark` (surligneur), `.tag-note` (étiquette post-it), `.btn-primary`, `.btn-secondary`
- À éviter : dégradés de texte, halos flous animés, bandeaux défilants, compteurs animés, glassmorphism

## Commandes
```bash
npm run dev    # Dev server
npm run build  # Build prod
git push       # Déploie sur Vercel (auto)
```

## Conventions
- Répondre en français (le site est en français)
- Composants inline dans `page.tsx` (pas de fichiers séparés)
- Styles inline avec `style={{}}` — pas de classes Tailwind dans les composants
- Ne pas toucher aux routes API sans vérifier l'auth
