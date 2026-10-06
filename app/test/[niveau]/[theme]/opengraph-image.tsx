import { ogResult, ogSize, ogContentType } from "@/lib/og";
import { decodeShare, shareParams } from "@/lib/share";

export const alt = "Mon niveau sur Claude";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return shareParams();
}

export default async function Image({ params }: { params: Promise<{ niveau: string; theme: string }> }) {
  const { niveau, theme } = await params;
  const d = decodeShare(niveau, theme);
  return ogResult({ level: d.level ?? "?", theme: d.theme?.name });
}
