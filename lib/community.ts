// ── Community: catégories, threads, contributeurs (seed data) ───────────────
// Static seed for now. Migrate to Supabase when interactivité needed.

export type ThreadCategory =
  | "prompt-engineering"
  | "developpement-web"
  | "automatisation"
  | "bugs"
  | "idees"
  | "questions";

export type Thread = {
  id: string;
  title: string;
  excerpt: string;
  category: ThreadCategory;
  tags: string[];
  author: { name: string; initial: string };
  createdAgo: string;
  upvotes: number;
  replies: number;
  hot?: boolean;
};

export type Contributor = {
  name: string;
  initial: string;
  points: number;
};

export const THREAD_CATEGORIES: { id: ThreadCategory; label: string; count: number }[] = [
  { id: "prompt-engineering", label: "Prompt Engineering", count: 86 },
  { id: "developpement-web", label: "Développement Web", count: 112 },
  { id: "automatisation", label: "Automatisation", count: 50 },
  { id: "bugs", label: "Bugs & Erreurs", count: 34 },
  { id: "idees", label: "Idées & Features", count: 28 },
  { id: "questions", label: "Questions générales", count: 92 },
];

export const POPULAR_TAGS = [
  "Claude3",
  "API",
  "Python",
  "RAG",
  "Débutant",
  "React",
  "Hooks",
  "MCP",
];

export const THREADS: Thread[] = [
  {
    id: "optimisation-prompts-raisonnement",
    title:
      "Optimisation des prompts pour le raisonnement complexe avec Claude Sonnet 4.6",
    excerpt:
      "Bonjour à tous, j'ai remarqué que l'utilisation de balises XML strictes combinée à une technique de \"Chain of Thought\" guidée améliore considérablement les résultats sur des tâches de logique ardue. Voici un exemple de structure que j'utilise actuellement, j'aimerais avoir vos retours et vos propres astuces…",
    category: "prompt-engineering",
    tags: ["Claude3", "ChainOfThought"],
    author: { name: "Thomas L.", initial: "T" },
    createdAgo: "Il y a 2 heures",
    upvotes: 42,
    replies: 18,
  },
  {
    id: "generer-interface-react-complete",
    title: "Générer une interface React complète : limites et solutions",
    excerpt:
      "J'essaie de faire générer à Claude un dashboard complet en React + Tailwind. Il s'arrête souvent en plein milieu du code. Avez-vous des stratégies pour le forcer à continuer proprement sans casser la structure ?",
    category: "developpement-web",
    tags: ["React", "Tailwind"],
    author: { name: "Sophie M.", initial: "S" },
    createdAgo: "Hier",
    upvotes: 24,
    replies: 32,
  },
  {
    id: "hooks-pre-commit-bypass",
    title: "Bug : les hooks PreToolUse ne se déclenchent pas avec Bash en background",
    excerpt:
      "Quand je lance une commande Bash avec run_in_background: true, mon hook PreToolUse n'est pas appelé. Reproductible sur macOS et Linux. Quelqu'un confirme ?",
    category: "bugs",
    tags: ["Hooks", "Bash"],
    author: { name: "Alex D.", initial: "A" },
    createdAgo: "Il y a 4 heures",
    upvotes: 17,
    replies: 6,
  },
  {
    id: "mcp-server-multi-provider",
    title: "Idée : un MCP server unifié pour basculer entre Anthropic, OpenAI et Gemini",
    excerpt:
      "Je travaille sur un MCP qui expose une interface unique pour appeler n'importe quel modèle. L'objectif : tester rapidement le même prompt sur 3 providers depuis Claude Code. Intéressés pour contribuer ?",
    category: "idees",
    tags: ["MCP", "API"],
    author: { name: "Camille R.", initial: "C" },
    createdAgo: "Il y a 1 jour",
    upvotes: 56,
    replies: 21,
  },
];

export const HOT_THREADS = [
  {
    id: "api-anthropic-production",
    title: "Meilleures pratiques pour l'API Anthropic en production",
    replies: 56,
    activeAgo: "Actif il y a 5 min",
  },
  {
    id: "pires-hallucinations",
    title: "Partagez vos pires hallucinations d'IA",
    replies: 124,
    activeAgo: "Actif il y a 12 min",
  },
  {
    id: "review-script-rag",
    title: "Review de code : mon script Python RAG",
    replies: 22,
    activeAgo: "Actif il y a 1h",
  },
];

export const TOP_CONTRIBUTORS: Contributor[] = [
  { name: "AlexD_Dev", initial: "A", points: 1240 },
  { name: "Marie_Prompt", initial: "M", points: 980 },
  { name: "CodeMaster", initial: "C", points: 845 },
  { name: "ClaudeFan", initial: "F", points: 612 },
];

export function getThread(id: string): Thread | undefined {
  return THREADS.find((t) => t.id === id);
}

export function categoryLabel(id: ThreadCategory): string {
  return THREAD_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
