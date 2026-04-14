import Anthropic from "@anthropic-ai/sdk";
import { curriculum } from "@/lib/curriculum";
import { createClient } from "@supabase/supabase-js";

function buildSystemPrompt(): string {
  const formation = curriculum
    .map((mod) => {
      const lessons = mod.lessons
        .map((l) => `  - **${l.title}** (${l.duration}) : ${l.intro.slice(0, 180)}`)
        .join("\n");
      return `### ${mod.title}\n${lessons}`;
    })
    .join("\n\n");

  return `Tu es un assistant pédagogique expert en Claude Code, l'outil CLI d'Anthropic pour les développeurs.
Tu aides les apprenants d'une formation en ligne dédiée à maîtriser Claude Code.

## Contenu de la formation
${formation}

## Ton rôle
- Réponds toujours en français (sauf si l'apprenant écrit en anglais)
- Utilise la recherche web quand tu as besoin d'infos récentes ou de détails non couverts par la formation
- Sois concis, précis et orienté pratique — donne des exemples concrets et du code quand c'est utile
- Quand un sujet est couvert dans la formation, enrichis ta réponse avec des exemples supplémentaires
- Si la question touche à l'IA pour les développeurs en général, tu peux répondre même si c'est hors formation
- Formate tes réponses en markdown (blocs de code, listes, gras)
- Ton ton est celui d'un senior dev qui partage son expertise, pas d'un chatbot corporate`;
}

export async function POST(req: Request) {
  // Auth check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Non autorisé", { status: 401 });
  }

  const token = authHeader.slice(7);
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const {
    data: { user },
    error: authError,
  } = await anonClient.auth.getUser(token);
  if (authError || !user) {
    return new Response("Non autorisé", { status: 401 });
  }

  const { messages } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Messages invalides", { status: 400 });
  }

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultHeaders: { "anthropic-beta": "web-search-2025-03-05" },
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 1500,
          system: buildSystemPrompt(),
          tools: [{ type: "web_search_20250305" as const, name: "web_search" }],
          messages,
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Erreur inconnue";
        controller.enqueue(encoder.encode(`\n\n_Erreur : ${msg}_`));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
