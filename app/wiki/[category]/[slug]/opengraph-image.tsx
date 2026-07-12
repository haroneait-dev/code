import { ogImage, ogSize, ogContentType } from "@/lib/og";
import {
  ARTICLE_STUBS,
  getCategory,
  type CategoryId,
} from "@/lib/wiki-manifest";

export const alt = "Article — Claude Mastery";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return ARTICLE_STUBS.map((a) => ({ category: a.category, slug: a.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const stub = ARTICLE_STUBS.find(
    (a) => a.category === category && a.slug === slug
  );
  const cat = getCategory(category as CategoryId);

  return ogImage({
    badge: cat?.name ?? "Wiki",
    title: stub?.title ?? "Wiki Claude Mastery",
    subtitle: stub?.description,
    kind: "wiki",
  });
}
