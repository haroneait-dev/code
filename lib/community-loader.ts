// ─── Server-side loader that mixes native threads + Reddit imports ───
// Reddit import is currently DISABLED.
// To re-enable: restore the supabase fetch block (see git history) and
// uncomment the cron entry in vercel.json.

import { THREADS, type Thread, type ThreadCategory } from "./community";

export type FeedItem =
  | (Thread & { source: "native" })
  | {
      source: "reddit";
      id: string;
      title: string;
      excerpt: string;
      category: ThreadCategory;
      tags: string[];
      author: { name: string; initial: string };
      createdAgo: string;
      upvotes: number;
      replies: number;
      subreddit: string;
      permalink: string;
    };

export async function loadFeed(): Promise<FeedItem[]> {
  // Native threads only — Reddit import désactivé pour l'instant
  return THREADS.map((t) => ({ ...t, source: "native" as const }));
}
