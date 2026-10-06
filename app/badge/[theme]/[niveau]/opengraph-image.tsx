import { ogBadge, ogSize, ogContentType } from "@/lib/og";
import { decodeShare, shareParams } from "@/lib/share";

export const alt = "Niveau validé sur Claude Mastery";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return shareParams();
}

export default async function Image({ params }: { params: Promise<{ theme: string; niveau: string }> }) {
  const { theme, niveau } = await params;
  const d = decodeShare(niveau, theme);
  return ogBadge({ level: d.level ?? "?", theme: d.theme?.name ?? "" });
}
