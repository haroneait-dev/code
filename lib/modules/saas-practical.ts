import type { Module } from "../curriculum";

export const saasPracticalModule: Module = {
  id: "saas-practical",
  title: "SaaS Pratique (Supabase, Vercel, Auth)",
  emoji: "🚀",
  color: "#9a8060",
  lessons: [
    {
      id: "supabase-setup",
      title: "Setup Supabase avec Claude Code",
      duration: "18 min",
      tag: "Backend",
      intro:
        "Supabase = ton backend en 10 minutes : Postgres + Auth + Storage + Realtime. Voici le workflow exact qu'on utilise sur ce projet pour partir d'un schéma vide et arriver à une API sécurisée par RLS, le tout piloté par Claude Code.",
      sections: [
        {
          heading: "1. Créer le projet et récupérer les clés",
          body: "Va sur <strong>supabase.com</strong> → New project → choisis une région proche de tes utilisateurs (eu-west-3 pour la France). Note bien le mot de passe Postgres, tu en auras besoin pour les migrations CLI plus tard. Une fois le projet provisionné (≈2 min), récupère les 3 clés depuis <code>Settings → API</code>.",
        },
        {
          code: {
            lang: "bash",
            label: ".env.local",
            code: `NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...  # SERVEUR UNIQUEMENT — jamais NEXT_PUBLIC_`,
          },
        },
        {
          callout: {
            type: "warn",
            icon: "⚠️",
            text: "La SERVICE_ROLE_KEY bypasse toutes les RLS. Si elle leak côté client, n'importe qui peut lire/écrire dans toutes tes tables. Ne la préfixe JAMAIS par NEXT_PUBLIC_ et ne la commit pas.",
          },
        },
        {
          heading: "2. Schéma SQL via le SQL Editor",
          body: "Plutôt que de cliquer dans Table Editor, demande à Claude Code de générer le SQL complet (tables + index + RLS) et colle-le dans <strong>SQL Editor → New query</strong>. Tu gardes ainsi le schéma versionné dans ton repo (<code>supabase/schema.sql</code>).",
          code: {
            lang: "sql",
            label: "supabase/schema.sql",
            code: `create table wiki_tips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  author_email text not null,
  votes int not null default 0,
  created_at timestamptz default now()
);

create index wiki_tips_votes_idx on wiki_tips (votes desc);

alter table wiki_tips enable row level security;

-- Lecture publique
create policy "read all" on wiki_tips
  for select using (true);

-- Seul l'auteur peut supprimer
create policy "delete own" on wiki_tips
  for delete using (auth.jwt() ->> 'email' = author_email);`,
          },
        },
        {
          heading: "3. Client SSR vs client browser",
          body: "Deux clients distincts selon le contexte : <code>@supabase/ssr</code> pour les Route Handlers / Server Components (lit les cookies), et un client lazy pour le browser. Le pattern Proxy évite d'instancier Supabase au build time quand les env vars ne sont pas encore là.",
          code: {
            lang: "ts",
            label: "lib/supabase.ts",
            code: `import { createBrowserClient } from "@supabase/ssr";

let _client: ReturnType<typeof createBrowserClient> | null = null;

export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_, prop) {
    if (!_client) {
      _client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
    }
    return _client[prop as keyof typeof _client];
  },
});`,
          },
        },
        {
          callout: {
            type: "tip",
            icon: "💡",
            text: "Active RLS sur TOUTES tes tables dès la création, même les tables 'internes'. C'est plus simple d'ouvrir une policy plus tard que de découvrir une fuite en prod.",
          },
        },
        {
          keypoints: [
            "3 env vars : URL + ANON_KEY (public) + SERVICE_ROLE_KEY (serveur strict)",
            "Versionne ton schéma SQL dans le repo, pas dans Table Editor",
            "RLS activée partout, policies explicites par table",
            "Client Proxy lazy pour éviter le crash au build sans env vars",
          ],
        },
      ],
    },
    {
      id: "auth-oauth-github",
      title: "Auth OAuth GitHub + middleware Next.js",
      duration: "22 min",
      tag: "Auth",
      intro:
        "GitHub OAuth en 15 minutes chrono : un toggle dans Supabase, une callback route Next.js, un middleware qui rafraîchit la session sur chaque request. Voici le setup exact, copier-coller-fonctionne.",
      sections: [
        {
          heading: "1. Activer le provider GitHub",
          body: "Dans Supabase : <code>Authentication → Providers → GitHub → Enable</code>. Il te demande Client ID + Client Secret. Va créer une OAuth App sur <strong>github.com/settings/developers</strong> avec comme Authorization callback URL : <code>https://xxxxx.supabase.co/auth/v1/callback</code> (l'URL Supabase, pas la tienne).",
        },
        {
          callout: {
            type: "info",
            icon: "ℹ️",
            text: "Pour le dev local, crée une SECONDE OAuth App GitHub avec callback localhost:3000. GitHub n'autorise qu'une seule callback URL par app.",
          },
        },
        {
          heading: "2. Le bouton de connexion",
          code: {
            lang: "ts",
            label: "Côté client",
            code: `async function signInWithGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: \`\${window.location.origin}/auth/callback\`,
      scopes: "read:user user:email",
    },
  });
  if (error) console.error(error);
}`,
          },
        },
        {
          heading: "3. Callback route (PKCE flow)",
          body: "Supabase redirige vers <code>/auth/callback?code=xxx</code>. Tu dois échanger ce code contre une session, puis rediriger vers l'app. Le client SSR pose les cookies de session automatiquement.",
          code: {
            lang: "ts",
            label: "app/auth/callback/route.ts",
            code: `import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: (list) => list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)),
        },
      }
    );
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(\`\${origin}\${next}\`);
}`,
          },
        },
        {
          heading: "4. Middleware pour rafraîchir la session",
          body: "Sans middleware, le token JWT expire au bout d'une heure et l'utilisateur est déconnecté silencieusement. Le middleware Next.js (ou <code>proxy.ts</code> selon ta version) intercepte CHAQUE request pour refresh le token via le refresh_token cookie.",
          code: {
            lang: "ts",
            label: "middleware.ts (racine du projet)",
            code: `import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => list.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)),
      },
    }
  );
  // Refresh la session + gate les routes privées
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};`,
          },
        },
        {
          callout: {
            type: "warn",
            icon: "🔒",
            text: "Ne JAMAIS faire de gate auth côté client uniquement (du genre `if (!user) redirect`). Un attaquant peut désactiver le JS. Les routes sensibles doivent vérifier le JWT côté serveur dans le Route Handler.",
          },
        },
        {
          keypoints: [
            "Provider GitHub activé côté Supabase, callback URL pointant vers supabase.co (pas vers toi)",
            "Route /auth/callback obligatoire pour échanger le code PKCE en session",
            "Middleware sur toutes les routes pour refresh le token JWT + gate les routes privées",
            "Vérif d'auth côté serveur, jamais juste côté client",
          ],
        },
      ],
    },
    {
      id: "vercel-deploy",
      title: "Déployer un projet Next.js sur Vercel",
      duration: "15 min",
      tag: "Deploy",
      intro:
        "Vercel + Next.js c'est 3 commandes pour passer du localhost à une URL publique en HTTPS, edge cache inclus. Voici le workflow CLI qu'on utilise au quotidien — sans cliquer dans le dashboard.",
      sections: [
        {
          heading: "1. Installation et link initial",
          code: {
            lang: "bash",
            label: "Setup one-time",
            code: `npm i -g vercel

# Dans le dossier du projet
vercel link
# ? Set up "~/projects/mon-saas"? [Y/n] y
# ? Which scope? Mon team
# ? Link to existing project? [y/N] n
# ? What's your project's name? mon-saas
# ? In which directory is your code located? ./`,
          },
        },
        {
          heading: "2. Variables d'environnement",
          body: "Ne JAMAIS copier-coller tes secrets dans le dashboard Vercel. Push-les en CLI, c'est plus rapide et tu peux scripter.",
          code: {
            lang: "bash",
            label: "Push env vars vers Vercel",
            code: `# Une variable, un environnement
vercel env add ANTHROPIC_API_KEY production
# (prompt qui te demande la valeur, paste, Entrée)

# Importer tout un .env.local d'un coup
vercel env pull .env.production.local

# Lister
vercel env ls`,
          },
        },
        {
          heading: "3. Preview vs Production",
          body: "Chaque <code>git push</code> sur une branche crée une URL de preview unique (<code>mon-saas-git-feat-x.vercel.app</code>). Le push sur <strong>main</strong> déploie en production. Tu peux aussi forcer en CLI :",
          code: {
            lang: "bash",
            label: "Deploy commands",
            code: `vercel              # Preview deploy (URL unique)
vercel --prod       # Production deploy
vercel logs --follow  # Logs en temps réel
vercel rollback     # Revenir au déploiement précédent`,
          },
        },
        {
          callout: {
            type: "tip",
            icon: "🚀",
            text: "Active Deployment Protection sur les previews (Settings → Deployment Protection → Vercel Authentication). Ça évite que Google indexe tes URL de staging et que les clients voient des features en cours.",
          },
        },
        {
          heading: "4. Custom domain",
          body: "Settings → Domains → Add. Vercel te donne soit un CNAME (sous-domaine) soit des A records (apex domain). Le SSL est automatique via Let's Encrypt, propagation DNS en ~2 min.",
          table: {
            headers: ["Type domaine", "Record", "Valeur"],
            rows: [
              ["www.app.com", "CNAME", "cname.vercel-dns.com"],
              ["app.com (apex)", "A", "76.76.21.21"],
              ["Vérification", "TXT", "Fourni par Vercel"],
            ],
          },
        },
        {
          callout: {
            type: "warn",
            icon: "⚠️",
            text: "Si ton app utilise NEXT_PUBLIC_SITE_URL pour les redirects OAuth, n'oublie pas de l'updater APRÈS avoir branché le custom domain, sinon les redirections cassent en prod.",
          },
        },
        {
          keypoints: [
            "vercel link une fois, puis push = deploy automatique",
            "Env vars via CLI (vercel env add/pull), jamais en dur",
            "Preview par branche, production par push sur main",
            "Custom domain + SSL en 2 min, mais update les URLs OAuth",
          ],
        },
      ],
    },
    {
      id: "subagents-parallel-content",
      title: "Subagents en parallèle pour générer du contenu en masse",
      duration: "25 min",
      tag: "Workflow",
      intro:
        "Tu dois générer 200 pages SEO, 50 articles MDX, ou traduire une doc complète ? Le pattern subagents parallèles te permet de paralléliser le travail tout en gardant un contrôle qualité. Cette leçon décrit le workflow exact qu'on a utilisé pour écrire 194 articles MDX en une après-midi.",
      sections: [
        {
          heading: "1. Le pattern orchestrateur → workers",
          body: "L'idée : un agent <strong>orchestrateur</strong> (toi en chat principal) lance N <strong>subagents Task</strong> en parallèle, chacun avec un prompt focused sur UNE tâche atomique (ex: \"écris l'article sur X\"). Chaque subagent a son propre contexte vierge, donc pas de pollution croisée.",
          bullets: [
            "Orchestrateur = découpe le plan, distribue, agrège",
            "Workers = exécutent une tâche unique, retournent un résultat structuré",
            "Tu peux lancer 5-10 subagents simultanément en un seul message",
            "Coût ≈ N × coût d'un appel, mais latence ≈ celle d'1 seul",
          ],
        },
        {
          heading: "2. Préparer le plan en amont",
          body: "Avant de lancer 200 subagents, génère d'abord un <strong>fichier de plan</strong> (CSV ou JSON) avec toutes les tâches. Chaque ligne = un slug + un titre + des keywords. Le subagent reçoit UNE ligne et produit UN fichier.",
          code: {
            lang: "json",
            label: "content-plan.json",
            code: `[
  {
    "slug": "claude-code-vs-cursor",
    "title": "Claude Code vs Cursor : comparatif 2026",
    "keywords": ["claude code", "cursor", "ai coding"],
    "outline": ["Intro", "Pricing", "Workflow", "Verdict"]
  },
  {
    "slug": "supabase-rls-guide",
    "title": "Guide complet RLS Supabase",
    "keywords": ["rls", "postgres", "supabase security"],
    "outline": ["C'est quoi RLS", "Syntaxe policies", "Pièges"]
  }
]`,
          },
        },
        {
          heading: "3. Le prompt subagent type",
          body: "Le prompt doit être <strong>auto-suffisant</strong> : un subagent ne voit pas l'historique du chat principal. Inclus le contexte, le format de sortie, et explicite le chemin d'écriture.",
          code: {
            lang: "txt",
            label: "Prompt envoyé à chaque Task",
            code: `Tu es un rédacteur SEO. Écris un article MDX complet sur :

Titre: "Claude Code vs Cursor : comparatif 2026"
Slug: claude-code-vs-cursor
Keywords: claude code, cursor, ai coding
Plan: Intro, Pricing, Workflow, Verdict

Contraintes:
- 1200-1500 mots
- Frontmatter MDX avec title, date, description
- Ton: pragmatique, exemples concrets
- Écris le fichier directement à content/blog/<slug>.mdx
- Pas de placeholders, pas de "Lorem ipsum"

Quand fini, réponds juste "DONE: <slug>"`,
          },
        },
        {
          heading: "4. Gestion des timeouts et reprises",
          body: "Sur 200 tâches, statistiquement il y aura des échecs (timeout, rate limit, contenu refusé). Prévois un <strong>script de reprise</strong> qui scan le dossier de sortie et relance uniquement les slugs manquants.",
          code: {
            lang: "bash",
            label: "Script de check",
            code: `# Liste les slugs prévus vs ceux écrits
jq -r '.[].slug' content-plan.json | sort > /tmp/expected.txt
ls content/blog/*.mdx | xargs -n1 basename | sed 's/.mdx//' | sort > /tmp/done.txt

# Slugs manquants à re-générer
comm -23 /tmp/expected.txt /tmp/done.txt`,
          },
        },
        {
          callout: {
            type: "success",
            icon: "⚡",
            text: "Sur ce projet, on a écrit 194 articles MDX en 3 vagues de subagents parallèles (≈65 par vague). Temps total : 40 min vs ~30h en séquentiel. Coût : ~12€ d'API.",
          },
        },
        {
          heading: "5. Déduplication post-process",
          body: "Les subagents indépendants peuvent produire du contenu similaire (intros copier-collées, mêmes exemples). Un dernier passage de <strong>linting sémantique</strong> détecte les doublons : embed chaque article, calcule la similarité cosine, flag les paires > 0.92.",
        },
        {
          callout: {
            type: "warn",
            icon: "⚠️",
            text: "Ne lance pas 50 subagents d'un coup si chacun fait des Write/Edit sur les MÊMES fichiers. Tu auras des conflits silencieux. Garantis qu'un subagent = un fichier de sortie unique.",
          },
        },
        {
          keypoints: [
            "Découper en plan structuré AVANT de lancer les workers",
            "Prompt subagent auto-suffisant (zéro contexte partagé)",
            "Script de reprise pour les inévitables échecs",
            "Un subagent = un fichier de sortie, sinon conflits",
            "Dédup sémantique en post-process pour éviter le contenu jumeau",
          ],
        },
      ],
    },
    {
      id: "debug-ssr-vs-client",
      title: "Debug : pourquoi 'This page couldn't load' ?",
      duration: "20 min",
      tag: "Debug",
      intro:
        "Le classique : ça marche en local, ça plante en prod. Erreur cryptique \"This page couldn't load\" ou écran blanc. Voici la checklist de diagnostic systématique qu'on déroule à chaque fois, du plus fréquent au plus tordu.",
      sections: [
        {
          heading: "1. Vérifier les env vars Vercel (90% des cas)",
          body: "L'erreur N°1 : tu as ajouté une nouvelle variable dans <code>.env.local</code> mais oublié de la pousser sur Vercel. Le build passe (Next.js ne crash pas sur env manquante), mais le runtime explose à la première utilisation.",
          code: {
            lang: "bash",
            label: "Diagnostic env",
            code: `# Compare local vs prod
cat .env.local | grep -v '^#' | cut -d= -f1 | sort > /tmp/local-env.txt
vercel env ls production | awk 'NR>3 {print $1}' | sort > /tmp/vercel-env.txt
diff /tmp/local-env.txt /tmp/vercel-env.txt`,
          },
        },
        {
          heading: "2. Deployment Protection activée par erreur",
          body: "Si tu as activé <strong>Vercel Authentication</strong> sur ton projet, TOUTES les requêtes (y compris depuis ton frontend) reçoivent une page de login Vercel à la place de ta réponse JSON. Symptôme typique : <code>fetch('/api/...')</code> retourne du HTML au lieu de JSON, et JSON.parse explose.",
        },
        {
          callout: {
            type: "warn",
            icon: "🛡️",
            text: "Settings → Deployment Protection → désactive sur 'Production' (laisse-la sur 'Preview' si tu veux). Ou ajoute des bypass tokens pour tes appels API legit.",
          },
        },
        {
          heading: "3. Session client-only qui ne suit pas en SSR",
          body: "Tu utilises <code>supabase.auth.getSession()</code> côté serveur dans un Route Handler ? Si tu instancies un client browser, il n'a pas accès aux cookies. Résultat : <code>session = null</code> en prod, alors que ton client voit bien l'utilisateur connecté.",
          code: {
            lang: "ts",
            label: "Le bug classique",
            code: `// ❌ NE MARCHE PAS dans une Route Handler
import { supabase } from "@/lib/supabase"; // client browser
export async function POST() {
  const { data } = await supabase.auth.getSession();
  // data.session === null en prod
}

// ✅ Bon pattern : extraire le token du header
export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error) return new Response("unauthorized", { status: 401 });
}`,
          },
        },
        {
          heading: "4. Modales invisibles : backdrop-filter et z-index",
          body: "Cas tordu mais fréquent : ta modale s'ouvre (le DOM est là, tu la vois dans l'inspecteur) mais elle est invisible. Causes typiques :",
          bullets: [
            "<code>backdrop-filter: blur()</code> appliqué sur un parent qui crée un nouveau stacking context → le z-index enfant ne grimpe plus au-dessus",
            "Un ancêtre avec <code>overflow: hidden</code> + <code>transform</code> qui clip la modale",
            "Modale rendue dans un portail mais le portail target n'existe pas encore au mount",
            "Position <code>fixed</code> qui devient relative à un ancêtre transformé (bug spec CSS)",
          ],
        },
        {
          callout: {
            type: "info",
            icon: "🔍",
            text: "Astuce : dans l'inspecteur Chrome, sélectionne ta modale → 3D View (Layers panel). Si elle n'est pas au top de la pile, tu vois immédiatement quel ancêtre la coince.",
          },
        },
        {
          heading: "5. Démarche systématique",
          body: "Quand ça plante en prod et marche en local, déroule cette checklist dans l'ordre. C'est lent au début, hyper rapide après 10 fois.",
          table: {
            headers: ["Étape", "Check", "Commande"],
            rows: [
              ["1", "Env vars présentes en prod ?", "vercel env ls production"],
              ["2", "Logs runtime ?", "vercel logs --follow"],
              ["3", "Network tab : réponse = HTML ou JSON ?", "DevTools → Network"],
              ["4", "Deployment protection off ?", "Settings → Deployment Protection"],
              ["5", "Session côté serveur OK ?", "Log auth.getUser() en Route Handler"],
              ["6", "Reproduire en local avec NODE_ENV=production", "npm run build && npm start"],
            ],
          },
        },
        {
          callout: {
            type: "tip",
            icon: "💡",
            text: "Garde TOUJOURS <code>vercel logs --follow</code> ouvert dans un terminal pendant que tu reproduis le bug. 80% du temps, l'erreur exacte est dans les logs et te fait gagner 1h de debug.",
          },
        },
        {
          keypoints: [
            "Env vars Vercel décalées du .env.local = cause N°1",
            "Deployment Protection sur production casse tous tes appels API",
            "Client browser Supabase ne marche pas côté serveur, utilise le token Bearer",
            "Modale invisible = stacking context cassé par un parent (backdrop-filter, transform)",
            "vercel logs --follow + reproduire avec npm run build && npm start",
          ],
        },
      ],
    },
  ],
};
