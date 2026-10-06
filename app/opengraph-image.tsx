import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Claude Mastery : apprendre Claude et Claude Code en français";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return ogImage({
    badge: "Gratuit, sans inscription",
    title: "Apprendre Claude et Claude Code, en français.",
    subtitle: "Formation, wiki, parcours par thème et test de niveau en 10 questions.",
    kind: "claude-code-harone1.vercel.app",
  });
}
