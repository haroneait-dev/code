import type { MetadataRoute } from "next";
import { curriculum } from "@/lib/curriculum";
import { CATEGORIES } from "@/lib/wiki-manifest";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://claude-code-harone1.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, priority: 1.0 },
    { url: `${siteUrl}/learn`, lastModified: now, priority: 0.9 },
    { url: `${siteUrl}/wiki`, lastModified: now, priority: 0.8 },
    { url: `${siteUrl}/communaute`, lastModified: now, priority: 0.7 },
    { url: `${siteUrl}/experience`, lastModified: now, priority: 0.5 },
  ];

  const lessonPages: MetadataRoute.Sitemap = curriculum.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      url: `${siteUrl}/learn/${mod.id}/${lesson.id}`,
      lastModified: now,
      priority: 0.7,
    }))
  );

  const wikiPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/wiki/${cat.id}`,
    lastModified: now,
    priority: 0.6,
  }));

  return [...staticPages, ...lessonPages, ...wikiPages];
}
