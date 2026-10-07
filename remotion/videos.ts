// Vidéos TikTok prêtes à poster (1080x1920, 21 s, sans son : ajoutez un son
// tendance dans TikTok). Une entrée = une composition « TikTok-<id> ».
export type Point = { title: string; text: string; code?: string };
export type Video = { id: string; kicker: string; hook: [string, string, string]; points: [Point, Point, Point]; outro: string };

export const VIDEOS: Video[] = [
  {
    id: "modeles",
    kicker: "CLAUDE",
    hook: ["Quel modèle Claude ", "choisir", " ?"],
    points: [
      { title: "Haiku 4.5", text: "Le plus rapide et le moins cher. Pour trier, résumer, extraire en masse.", code: "1 $ / 5 $ par million" },
      { title: "Sonnet 5.5", text: "Le bon choix par défaut : rédaction, code courant, documents.", code: "2 $ / 10 $ par million" },
      { title: "Opus 5.5", text: "Code complexe et agents. Le modèle par défaut de Claude Code.", code: "4 $ / 20 $ par million" },
    ],
    outro: "Le comparateur gratuit est sur le site",
  },
  {
    id: "commandes",
    kicker: "CLAUDE CODE",
    hook: ["3 réflexes qui changent ", "tout", ""],
    points: [
      { title: "/init au départ", text: "Claude lit le projet et écrit un CLAUDE.md avec vos commandes et conventions.", code: "/init" },
      { title: "Le plan d'abord", text: "Il explore et propose un plan sans rien toucher. Vous validez, il exécute.", code: "Shift + Tab" },
      { title: "Revenir en arrière", text: "Une modification vous déplaît ? Rembobinez la conversation et le code.", code: "Échap Échap" },
    ],
    outro: "La formation complète est gratuite sur le site",
  },
  {
    id: "erreurs",
    kicker: "CLAUDE",
    hook: ["3 erreurs de ", "débutant", " avec Claude"],
    points: [
      { title: "Une demande floue", text: "Dites le but, le public, le format et un exemple. La réponse change du tout au tout." },
      { title: "Pas de contexte", text: "Joignez le fichier, collez le mail, montrez la capture. Claude ne devine pas." },
      { title: "Une conversation sans fin", text: "Nouveau sujet, nouvelle conversation. Les vieux échanges brouillent les réponses." },
    ],
    outro: "Les 12 erreurs expliquées sur le site",
  },
  {
    id: "mcp",
    kicker: "CLAUDE CODE",
    hook: ["MCP expliqué en ", "20 secondes", ""],
    points: [
      { title: "Une prise universelle", text: "MCP branche Claude sur vos outils : base de données, Notion, GitHub, votre boutique…" },
      { title: "Une commande", text: "Vous ajoutez un serveur MCP, Claude voit ses outils tout de suite.", code: "claude mcp add" },
      { title: "Il agit pour vous", text: "« Liste les commandes en retard et prépare les relances » : il lit et agit." },
    ],
    outro: "Le guide MCP est sur le site",
  },
  {
    id: "evolution",
    kicker: "CLAUDE",
    hook: ["Claude en 2 ans : les ", "chiffres", ""],
    points: [
      { title: "Prix divisé par près de 4", text: "Le haut de gamme sortait à 75 $ le million de tokens. Opus 5.5 : 20 $.", code: "75 $ → 20 $" },
      { title: "5 fois plus de contexte", text: "De 200 000 à 1 million de tokens : environ 2 500 pages lues d'un coup.", code: "200K → 1M" },
      { title: "Des sorties en rafale", text: "6 modèles en 2024, 7 en 2025, déjà 12 en 2026.", code: "12 modèles en 2026" },
    ],
    outro: "Tous les graphiques sur le site",
  },
];
