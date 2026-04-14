# CLAUDE.md — Formation Claude Code

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

### Auth gate
- Utilisateurs non connectés : accès uniquement au module `"intro"`
- Cliquer sur un module verrouillé → ouvre `AuthModal`
- `isAdmin` = `user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL`

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

## Design
- Palette sombre : `--bg-dark: #0b0a09` + tons beige
- Animations : orbs violet/bleu en fond, gradient text, scroll reveal, 3D tilt sur hover
- Glassmorphism sur la nav desktop
- Chat widget flottant (bas droite) — uniquement pour utilisateurs connectés

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
