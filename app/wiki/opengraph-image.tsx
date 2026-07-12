import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { articleCount } from "@/lib/wiki-manifest";

export const alt = "Wiki — Claude Mastery";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    badge: `Wiki · ${articleCount()} articles`,
    title: "La référence francophone sur Claude Code",
    subtitle:
      "Claude Code, l'API Anthropic, MCP, les hooks, les skills et tout l'écosystème — organisé par thèmes.",
    kind: "wiki",
  });
}
