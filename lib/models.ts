// Modèles Claude et tarifs API (dollars par million de tokens), repris de
// wiki/modeles/comparatif-modeles, déjà vérifié.
export type Model = {
  id: string;
  name: string;
  input: number;
  output: number;
  context: number; // en milliers de tokens
  pitch: string;
  href: string;
};

export const MODELS: Model[] = [
  { id: "haiku", name: "Haiku 4.5", input: 1, output: 5, context: 200, pitch: "Le plus rapide et le moins cher : tri, résumés, extraction, réponses courtes en grand volume.", href: "/wiki/modeles/haiku-4-5" },
  { id: "sonnet", name: "Sonnet 5.5", input: 2, output: 10, context: 1000, pitch: "Le bon choix par défaut : rédaction, code courant, analyse de documents, bon équilibre prix et qualité.", href: "/wiki/modeles/opus-sonnet-5-5" },
  { id: "opus", name: "Opus 5.5", input: 4, output: 20, context: 1000, pitch: "Pour le code complexe et les agents qui travaillent longtemps. Le modèle par défaut de Claude Code.", href: "/wiki/modeles/opus-sonnet-5-5" },
  { id: "fable", name: "Fable 5.1", input: 10, output: 50, context: 1000, pitch: "Pour les problèmes où Opus 5.5 bute vraiment : recherche, preuves, chantiers très longs.", href: "/wiki/modeles/fable-5-mythos-5" },
];
