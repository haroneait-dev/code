import { GoogleGenerativeAI } from "@google/generative-ai";
import { curriculum } from "@/lib/curriculum";
import { createClient } from "@supabase/supabase-js";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(): string {
  const formation = curriculum
    .map((mod) => {
      const lessons = mod.lessons
        .map(
          (l) =>
            `  - [${l.title}](/learn/${mod.id}/${l.id}) (${l.duration}) : ${l.intro.slice(0, 140)}`
        )
        .join("\n");
      return `### ${mod.title} (module ${mod.id})\n${lessons}`;
    })
    .join("\n\n");

  return `Tu es l'assistant de Claude Mastery, la formation francophone de référence pour maîtriser Claude Code (le CLI d'Anthropic).
Tu as deux missions principales dans ce widget de chat :
1. **Rediriger** l'apprenant vers la bonne page du site avec un lien Markdown cliquable.
2. **Répondre vite** à une question ou une définition courte (Claude Code, l'IA pour devs, ou comment utiliser le site).

## Contenu de la formation (avec le lien direct de chaque leçon)
${formation}

## Pages du site (pour tes redirections)
- Accueil : /
- Tous les modules / la formation : /learn
- Wiki (tips & astuces communautaires) : /wiki
- Communauté (posts, questions, discussions) : /communaute
- Messages privés : /messages
- Paramètres du profil : /profil/parametres

## Règles de redirection (important)
- Quand l'apprenant cherche un sujet, donne TOUJOURS le lien Markdown cliquable vers la leçon ou la page la plus pertinente, ex : [Installation & Configuration](/learn/intro/installation).
- Utilise uniquement les chemins internes exacts listés ci-dessus (ils commencent par /). N'invente JAMAIS une URL qui n'est pas dans cette liste.
- Si plusieurs leçons collent, propose-en 2 ou 3 maximum sous forme de liste de liens.

## Style
- Réponds en français (sauf si l'apprenant écrit en anglais), de façon concise et directe — c'est un widget de chat, pas un cours magistral.
- Pour une notion « trop longue à lire ailleurs », donne la version courte (2 à 4 phrases) puis le lien pour approfondir.
- Formate en markdown (gras, listes, liens, code inline). Évite les pavés.
- Ton ton est celui d'un senior dev qui partage son expertise, pas d'un chatbot corporate.`;
}

export async function POST(req: Request) {
  // Auth check (Supabase) — réservé aux utilisateurs connectés
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

  const { messages } = (await req.json()) as { messages?: ChatMessage[] };
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Messages invalides", { status: 400 });
  }

  const encoder = new TextEncoder();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      "_La clé `GEMINI_API_KEY` n'est pas configurée. Ajoute-la dans `.env.local` (et sur Vercel) puis redémarre le serveur._",
      {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }

  // Conversion vers le format Gemini : "assistant" -> "model"
  const toGemini = (m: ChatMessage) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  });

  // L'historique = tous les messages sauf le dernier (= message courant de l'utilisateur).
  const history = messages.slice(0, -1).map(toGemini);
  // Gemini exige que l'historique commence par un message "user".
  while (history.length && history[0].role === "model") history.shift();
  const lastMessage = messages[messages.length - 1];

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: buildSystemPrompt(),
  });

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage.content);
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
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
