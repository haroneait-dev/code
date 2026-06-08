// ─── Wiki MDX loader ──────────────────────────────────────────────────
// Reads .mdx files from content/wiki/<category>/<slug>.mdx
// Returns frontmatter + raw markdown body. Renderer is a client component.

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  ARTICLE_STUBS,
  CATEGORIES,
  type ArticleStub,
  type CategoryId,
} from "./wiki-manifest";

const CONTENT_ROOT = path.join(process.cwd(), "content", "wiki");

export type WikiArticle = {
  category: CategoryId;
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  readingMinutes: number;
  body: string;
};

async function tryReadMdx(
  category: CategoryId,
  slug: string
): Promise<WikiArticle | null> {
  const file = path.join(CONTENT_ROOT, category, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(file, "utf-8");
    const { data, content } = matter(raw);
    return {
      category,
      slug,
      title: (data.title as string) ?? slug,
      description: (data.description as string) ?? "",
      updatedAt: (data.updatedAt as string) ?? new Date().toISOString().slice(0, 10),
      readingMinutes:
        (data.readingMinutes as number) ?? estimateReading(content),
      body: content.trim(),
    };
  } catch (err) {
    console.log(
      `[wiki-diag] tryReadMdx ECHEC cwd=${process.cwd()} file=${file} code=${
        (err as NodeJS.ErrnoException)?.code ?? "?"
      }`,
    );
    return null;
  }
}

function estimateReading(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

// ─── Public API ──────────────────────────────────────────────────────

export async function loadArticle(
  category: CategoryId,
  slug: string
): Promise<WikiArticle | null> {
  // 1) Try real MDX file
  const file = await tryReadMdx(category, slug);
  if (file) return file;

  // 2) Fallback: stub-only article (still renders an empty page so links don't 404)
  const stub = ARTICLE_STUBS.find(
    (a) => a.category === category && a.slug === slug
  );
  console.log(
    `[wiki-diag] loadArticle ${category}/${slug} mdx=${!!file} stub=${!!stub} stubsTotal=${ARTICLE_STUBS.length}`,
  );
  if (!stub) return null;

  return {
    category,
    slug,
    title: stub.title,
    description: stub.description,
    updatedAt: "—",
    readingMinutes: 1,
    body: `> Cet article est en cours de rédaction.\n\n${stub.description}`,
  };
}

export async function listArticlesByCategory(
  category: CategoryId
): Promise<ArticleStub[]> {
  // Manifest is the source of truth — order from the manifest
  return ARTICLE_STUBS.filter((a) => a.category === category);
}

export async function listAllArticles(): Promise<ArticleStub[]> {
  return ARTICLE_STUBS;
}

export { CATEGORIES, ARTICLE_STUBS };
export type { CategoryId, ArticleStub };
