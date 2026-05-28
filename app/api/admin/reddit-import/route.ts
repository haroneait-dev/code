import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/admin";
import { fetchAllSubreddits, shouldAutoImport } from "@/lib/reddit";

export const maxDuration = 60;

export async function POST() {
  const cookieStore = await cookies();

  // 1) Verify caller is admin
  const userClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user: caller },
  } = await userClient.auth.getUser();

  if (!caller || !isAdminEmail(caller.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2) Fetch + upsert with service role
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { posts, perSub } = await fetchAllSubreddits({ period: "week", limit: 25 });

    if (posts.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          fetched: 0,
          auto_imported: 0,
          error: "Reddit a renvoyé 0 posts pour tous les subreddits.",
          perSub,
        },
        { status: 502 }
      );
    }

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
      imported: shouldAutoImport(p),
      imported_at: shouldAutoImport(p) ? new Date().toISOString() : null,
    }));

    const { error } = await (admin.from("reddit_posts") as any).upsert(rows, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

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
      perSub,
      timestamp: new Date().toISOString(),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
