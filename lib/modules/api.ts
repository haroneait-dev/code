import type { Module } from "../curriculum";

export const apiModule: Module = {
  id: "api",
  title: "API Anthropic",
  emoji: "🔌",
  color: "#9a8060",
  lessons: [
    {
      id: "first-api-call",
      title: "Votre premier appel à l'API Anthropic",
      duration: "12 min",
      tag: "Démarrage",
      intro:
        "Avant d'orchestrer des agents complexes, il faut savoir parler à Claude depuis votre terminal et votre code. Dans cette leçon, on récupère une clé API, on envoie un premier message en <code>curl</code>, puis on installe les SDK Python et TypeScript pour industrialiser nos appels.",
      sections: [
        {
          heading: "1. Récupérer une clé API",
          body:
            "Rendez-vous sur <strong>console.anthropic.com</strong>, créez un compte (ou connectez-vous), puis allez dans <em>Settings → API Keys</em>. Cliquez sur <code>Create Key</code>, donnez-lui un nom parlant (ex. <code>dev-laptop</code>) et copiez-la <strong>immédiatement</strong> : elle ne sera plus jamais affichée.",
        },
        {
          callout: {
            type: "warn",
            icon: "🔐",
            text: "Ne committez jamais votre clé dans Git. Stockez-la dans un fichier <code>.env.local</code> (Next.js) ou via <code>export ANTHROPIC_API_KEY=...</code> dans votre shell.",
          },
        },
        {
          heading: "2. Premier appel en curl",
          body:
            "Pour valider que tout fonctionne sans installer de SDK, lancez un appel <code>curl</code> direct sur l'endpoint <code>/v1/messages</code>.",
          code: {
            lang: "bash",
            label: "Terminal",
            code: `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: $ANTHROPIC_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 256,
    "messages": [
      {"role": "user", "content": "Dis-moi bonjour en haïku."}
    ]
  }'`,
          },
        },
        {
          heading: "3. SDK Python",
          body:
            "Le SDK officiel gère l'authentification, les retries et le typage. Installez-le avec <code>pip install anthropic</code>, puis utilisez le client synchrone.",
          code: {
            lang: "python",
            label: "premier_appel.py",
            code: `from anthropic import Anthropic

client = Anthropic()  # lit ANTHROPIC_API_KEY depuis l'env

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=512,
    system="Tu réponds toujours en français, de manière concise.",
    messages=[
        {"role": "user", "content": "Explique l'API Anthropic en 3 phrases."}
    ],
)

print(message.content[0].text)
print(f"Tokens: {message.usage.input_tokens} in / {message.usage.output_tokens} out")`,
          },
        },
        {
          heading: "4. SDK TypeScript",
          body:
            "Côté JS/TS — parfait pour Next.js, Bun ou Node — installez <code>npm i @anthropic-ai/sdk</code>. L'API est quasi identique à la version Python.",
          code: {
            lang: "ts",
            label: "lib/anthropic.ts",
            code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // process.env.ANTHROPIC_API_KEY

const message = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 512,
  system: "Tu es un assistant développeur précis.",
  messages: [
    { role: "user", content: "Donne-moi un exemple de fetch en TypeScript." },
  ],
});

const first = message.content[0];
if (first.type === "text") {
  console.log(first.text);
}`,
          },
        },
        {
          callout: {
            type: "tip",
            icon: "💡",
            text: "Le paramètre <code>system</code> est séparé du tableau <code>messages</code> — c'est là que vous définissez la personnalité et les contraintes globales de Claude.",
          },
        },
        {
          keypoints: [
            "La clé API se génère sur console.anthropic.com et ne s'affiche qu'une seule fois",
            "L'endpoint principal est POST /v1/messages avec le header anthropic-version",
            "Les SDK Python et TypeScript ont des APIs miroirs et lisent ANTHROPIC_API_KEY automatiquement",
            "Le prompt système se passe via le champ system, pas dans messages",
          ],
        },
      ],
    },
    {
      id: "streaming-and-tools",
      title: "Streaming et tool use",
      duration: "18 min",
      tag: "Technique",
      intro:
        "Une réponse de 2000 tokens peut prendre 10 secondes : sans streaming, l'utilisateur attend devant un écran figé. Et pour qu'un agent agisse vraiment (chercher sur le web, lire un fichier, appeler une API…), Claude doit pouvoir <strong>utiliser des outils</strong>. Cette leçon couvre les deux mécaniques essentielles.",
      sections: [
        {
          heading: "1. Activer le streaming",
          body:
            "Avec <code>stream: true</code>, le SDK renvoie un itérable d'événements (<code>message_start</code>, <code>content_block_delta</code>, <code>message_stop</code>). Vous affichez chaque <em>delta</em> dès qu'il arrive — UX façon ChatGPT.",
          code: {
            lang: "ts",
            label: "streaming.ts",
            code: `const stream = await client.messages.stream({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  messages: [{ role: "user", content: "Raconte-moi une histoire courte." }],
});

for await (const event of stream) {
  if (
    event.type === "content_block_delta" &&
    event.delta.type === "text_delta"
  ) {
    process.stdout.write(event.delta.text);
  }
}

const final = await stream.finalMessage();
console.log("\\nStop reason:", final.stop_reason);`,
          },
        },
        {
          callout: {
            type: "info",
            icon: "📡",
            text: "Côté Next.js, on relaie ce flux dans une <code>Response</code> avec un <code>ReadableStream</code> — c'est exactement ce que fait <code>/api/chat</code> dans ce projet.",
          },
        },
        {
          heading: "2. Déclarer des outils (JSON Schema)",
          body:
            "Un outil = un nom, une description et un <code>input_schema</code> JSON Schema. Claude décide lui-même quand l'appeler en fonction de la question.",
          code: {
            lang: "python",
            label: "tools.py",
            code: `tools = [
    {
        "name": "get_weather",
        "description": "Récupère la météo actuelle pour une ville.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "Ville, ex. 'Paris'"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]},
            },
            "required": ["city"],
        },
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "Quel temps fait-il à Lyon ?"}],
)`,
          },
        },
        {
          heading: "3. Le cycle tool_use → tool_result",
          body:
            "Quand Claude veut un outil, la réponse contient un bloc <code>tool_use</code> avec un <code>id</code>. Vous exécutez l'outil de votre côté, puis renvoyez le résultat dans un message <code>user</code> contenant un bloc <code>tool_result</code> qui référence le même <code>id</code>.",
          bullets: [
            "<strong>Tour 1</strong> : user → Claude répond avec stop_reason = <code>tool_use</code>",
            "<strong>Côté code</strong> : vous exécutez la fonction réelle (API météo, DB, etc.)",
            "<strong>Tour 2</strong> : vous renvoyez tout l'historique + le <code>tool_result</code>",
            "<strong>Tour final</strong> : Claude formule la réponse en langage naturel pour l'utilisateur",
          ],
        },
        {
          code: {
            lang: "python",
            label: "tool_result_loop.py",
            code: `if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    result = run_weather(tool_use.input["city"])  # votre fonction

    follow_up = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "Quel temps fait-il à Lyon ?"},
            {"role": "assistant", "content": response.content},
            {
                "role": "user",
                "content": [
                    {
                        "type": "tool_result",
                        "tool_use_id": tool_use.id,
                        "content": result,
                    }
                ],
            },
        ],
    )
    print(follow_up.content[0].text)`,
          },
        },
        {
          callout: {
            type: "tip",
            icon: "🧰",
            text: "Pensez vos outils comme des fonctions pures : nom verbal explicite, description courte et précise, schema strict. Claude n'invente pas un outil — il choisit dans votre liste.",
          },
        },
        {
          keypoints: [
            "stream: true renvoie des deltas SSE à afficher au fil de l'eau",
            "Un tool = name + description + input_schema (JSON Schema)",
            "Claude répond avec stop_reason = tool_use quand il veut appeler une fonction",
            "Vous renvoyez le résultat dans un message user contenant un bloc tool_result",
            "La boucle continue jusqu'à stop_reason = end_turn",
          ],
        },
      ],
    },
    {
      id: "prompt-caching",
      title: "Prompt caching pour économiser",
      duration: "14 min",
      tag: "Optimisation",
      intro:
        "Si vous renvoyez le même gros system prompt (10k tokens de documentation, par exemple) à chaque requête, vous payez 10k tokens d'entrée à chaque fois. Le <strong>prompt caching</strong> permet à Anthropic de mémoriser la partie statique de votre prompt et de ne facturer que <strong>10%</strong> du prix sur les cache hits.",
      sections: [
        {
          heading: "1. Le principe",
          body:
            "Vous marquez la fin d'un bloc <em>stable</em> de votre prompt avec <code>cache_control: { type: 'ephemeral' }</code>. Anthropic hash le contenu en amont du marker et le stocke. Au prochain appel avec un préfixe identique, vous obtenez un <strong>cache hit</strong>.",
          table: {
            headers: ["Type de token", "Prix relatif", "Quand"],
            rows: [
              ["Input standard", "1x", "Premier appel"],
              ["Cache write", "1.25x", "Création du cache"],
              ["Cache read (hit)", "0.1x (-90%)", "Réutilisation"],
            ],
          },
        },
        {
          heading: "2. Ordre obligatoire : statique → dynamique",
          body:
            "Le cache fonctionne par <strong>préfixe</strong>. Tout ce qui est cacheable doit être au début. L'ordre classique : <code>tools</code> → <code>system</code> → <code>messages</code> anciens → message utilisateur courant.",
          callout: {
            type: "warn",
            icon: "⚠️",
            text: "Si vous changez ne serait-ce qu'un caractère <em>avant</em> le marker, le cache est invalidé. Mettez toujours les variables (timestamp, nom user…) <strong>après</strong> le bloc caché.",
          },
        },
        {
          heading: "3. Exemple : cacher un gros system prompt",
          code: {
            lang: "ts",
            label: "prompt-cache.ts",
            code: `const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 1024,
  system: [
    {
      type: "text",
      text: "Tu es un assistant juridique français.",
    },
    {
      type: "text",
      text: LONG_LEGAL_DOC, // ~20 000 tokens de doc stable
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [
    { role: "user", content: "Résume l'article 1240 du Code civil." },
  ],
});

console.log(response.usage);
// { input_tokens: 18, cache_creation_input_tokens: 20012,
//   cache_read_input_tokens: 0, output_tokens: 312 }`,
          },
        },
        {
          heading: "4. TTL : 5 minutes ou 1 heure",
          body:
            "Par défaut, le cache vit <strong>5 minutes</strong> et se renouvelle à chaque hit. Pour les workloads à faible fréquence, vous pouvez passer en TTL <strong>1 heure</strong> via <code>cache_control: { type: 'ephemeral', ttl: '1h' }</code> — légèrement plus cher à l'écriture, mais survit aux trous d'inactivité.",
          bullets: [
            "<strong>5 min (default)</strong> : idéal pour conversations actives",
            "<strong>1 h</strong> : idéal pour batch jobs périodiques ou agents lents",
            "Jusqu'à 4 markers <code>cache_control</code> par requête (cache hiérarchique)",
          ],
        },
        {
          heading: "5. Vérifier les économies",
          body:
            "Le champ <code>usage</code> de la réponse expose <code>cache_creation_input_tokens</code> et <code>cache_read_input_tokens</code>. Loggez-les pour mesurer votre <em>cache hit rate</em> en production.",
          callout: {
            type: "success",
            icon: "💰",
            text: "Cas typique : un chatbot RAG avec 30k tokens de contexte stable et 200 tokens de question variable passe de ~$0.09 à ~$0.01 par appel sur cache hit.",
          },
        },
        {
          keypoints: [
            "cache_control: { type: 'ephemeral' } marque la fin du préfixe cacheable",
            "Ordre obligatoire : statique → dynamique (sinon invalidation)",
            "TTL par défaut 5 min, option 1 h pour workloads espacés",
            "Cache hit = -90% sur les tokens d'entrée mis en cache",
            "Mesurez via usage.cache_read_input_tokens dans chaque réponse",
          ],
        },
      ],
    },
    {
      id: "production-best-practices",
      title: "Best practices production",
      duration: "16 min",
      tag: "Production",
      intro:
        "Passer du prototype à la prod, c'est gérer les pannes : un <code>529 Overloaded</code>, un rate limit dépassé, un timeout réseau. Voici le kit de survie : <strong>retries exponentiels</strong>, lecture des headers de rate limit, monitoring et fallback intelligent vers Haiku.",
      sections: [
        {
          heading: "1. Retries avec exponential backoff",
          body:
            "Les SDK officiels font déjà 2 retries par défaut sur les erreurs 408/409/429/5xx. Vous pouvez augmenter ce nombre et ajouter votre propre logique pour les cas critiques.",
          code: {
            lang: "ts",
            label: "retry.ts",
            code: `import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ maxRetries: 5 }); // 2 par défaut

async function callWithBackoff<T>(fn: () => Promise<T>, attempts = 5) {
  let delay = 500;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.status;
      const retriable = [408, 409, 429, 500, 502, 503, 504, 529].includes(status);
      if (!retriable || i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, delay + Math.random() * 250));
      delay *= 2; // 500 → 1000 → 2000 → 4000…
    }
  }
  throw new Error("unreachable");
}`,
          },
        },
        {
          heading: "2. Lire les headers de rate limit",
          body:
            "Chaque réponse expose vos quotas restants. Surveillez-les pour throttler proactivement avant de prendre un 429.",
          table: {
            headers: ["Header", "Signification"],
            rows: [
              ["anthropic-ratelimit-requests-remaining", "Requêtes restantes dans la fenêtre"],
              ["anthropic-ratelimit-requests-reset", "Timestamp ISO du reset"],
              ["anthropic-ratelimit-input-tokens-remaining", "Input tokens restants"],
              ["anthropic-ratelimit-output-tokens-remaining", "Output tokens restants"],
              ["retry-after", "Secondes à attendre (sur 429)"],
            ],
          },
        },
        {
          callout: {
            type: "info",
            icon: "📊",
            text: "Si <code>requests-remaining</code> tombe sous 10% de votre quota, ralentissez côté app (queue ou rate limiter type <code>p-limit</code>) plutôt que de prendre un 429.",
          },
        },
        {
          heading: "3. Fallback Sonnet → Haiku",
          body:
            "Quand l'API renvoie <code>529 Overloaded</code> ou que la latence explose, basculez automatiquement vers <code>claude-haiku-4-5-20251001</code>. Plus rapide, moins cher, et largement suffisant pour la majorité des requêtes simples.",
          code: {
            lang: "python",
            label: "fallback.py",
            code: `from anthropic import Anthropic, APIStatusError

client = Anthropic()
MODELS = ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"]

def ask(messages, **kwargs):
    last_err = None
    for model in MODELS:
        try:
            return client.messages.create(
                model=model,
                max_tokens=1024,
                messages=messages,
                **kwargs,
            )
        except APIStatusError as e:
            if e.status_code in (429, 529, 503):
                last_err = e
                continue  # essaie le modèle suivant
            raise
    raise last_err`,
          },
        },
        {
          heading: "4. Monitoring & observabilité",
          bullets: [
            "<strong>Latence</strong> : mesurez p50 / p95 / p99 par modèle",
            "<strong>Coût</strong> : loggez <code>usage.input_tokens</code>, <code>output_tokens</code>, <code>cache_*</code> à chaque appel",
            "<strong>Taux d'erreur</strong> : segmentez par code (429, 529, 500, timeout réseau)",
            "<strong>Cache hit rate</strong> : % de <code>cache_read_input_tokens</code> / total input",
            "<strong>Stop reasons</strong> : surveillez les <code>max_tokens</code> (réponse coupée = mauvaise UX)",
          ],
        },
        {
          callout: {
            type: "tip",
            icon: "🛡️",
            text: "Mettez un <strong>timeout client</strong> (ex. 60s) en plus du retry — un appel zombie qui pend 5 minutes est pire qu'une erreur claire.",
          },
        },
        {
          keypoints: [
            "Activez maxRetries: 5 et un backoff exponentiel + jitter",
            "Surveillez les headers anthropic-ratelimit-* pour throttler en amont",
            "Sur 429/529, fallback Sonnet → Haiku au lieu de planter",
            "Loggez usage (tokens, cache, stop_reason) à chaque appel",
            "Timeout client explicite + idempotency pour les retries sûrs",
          ],
        },
      ],
    },
  ],
};
