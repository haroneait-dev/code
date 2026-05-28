import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchAllSubreddits, shouldAutoImport } from "@/lib/reddit";

// Vercel cron route — fires hourly (see vercel.json)
export const maxDuration = 60;

export async function GET(req: Request) {
  // Auth: require either Vercel cron header OR our secret
  const auth = req.headers.get("authorization");
  const isVercelCron = req.headers.get("user-agent")?.includes("vercel-cron");
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!isVercelCron && auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { posts } = await fetchAllSubreddits({ period: "week", limit: 25 });

    const rows = posts.map((p) => ({
      id: p.id,
      subreddit: p.subreddit,
      title: p.title,
      selftext: p.selftext,
      author: p.author,
      permalink: p.permalink,
      url: p.url,
      score: p.score,
      num_comments: p.num_comments,
      created_utc: p.created_utc,
      flair: p.flair,
      // Auto-import if quality threshold met
      imported: shouldAutoImport(p),
      imported_at: shouldAutoImport(p) ? new Date().toISOString() : null,
    }));

    // Upsert — keeps existing rows, updates score/comments/flair if changed
    const { error } = await (supabase.from("reddit_posts") as any).upsert(
      rows,
      { onConflict: "id", ignoreDuplicates: false }
    );

    if (error) {
      return NextResponse.json(
        { error: error.message, fetched: rows.length },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      fetched: rows.length,
      auto_imported: rows.filter((r) => r.imported).length,
      timestamp: new Date().toISOString(),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
