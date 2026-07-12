import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { ficheCount } from "@/lib/fiches";

export const alt = "Fiches — Claude Mastery";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    badge: `Fiches · ${ficheCount()} entrées`,
    title: "Les fiches essentielles de l'écosystème Claude",
    subtitle:
      "Claude Code, MCP, prompt engineering, entreprise, recherche et sécurité — filtrable et actionnable.",
    kind: "fiches",
  });
}
