// ─── Reddit fetcher ──────────────────────────────────────────────────
// Fetch top posts from selected subreddits using public JSON API.
// No auth required, just a sensible User-Agent header.

export const SUBREDDITS = [
  "ClaudeAI",
  "Anthropic",
  "ChatGPTCoding",
  "LocalLLaMA",
] as const;

export type RedditPost = {
  id: string;
  subreddit: string;
  title: string;
  selftext: string | null;
  author: string;
  permalink: string;
  url: string;
  score: number;
  num_comments: number;
  created_utc: number;
  flair: string | null;
};

type RedditApiChild = {
  kind: string;
  data: {
    id: string;
    subreddit: string;
    title: string;
    selftext: string;
    author: string;
    permalink: string;
    url: string;
    score: number;
    num_comments: number;
    created_utc: number;
    over_18: boolean;
    stickied: boolean;
    link_flair_text: string | null;
    removed_by_category: string | null;
  };
};

type RedditApiResponse = {
  data: { children: RedditApiChild[] };
};

const UA =
  process.env.REDDIT_USER_AGENT ??
  "web:com.claude-mastery.app:v0.1.0 (by /u/claude-mastery-bot)";

// ─── OAuth token cache ──────────────────────────────────────────────
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getRedditToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const id = process.env.REDDIT_CLIENT_ID;
  const secret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;

  if (!id || !secret) {
    throw new Error(
      "REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET manquants. Crée une app 'script' sur reddit.com/prefs/apps."
    );
  }

  const auth = Buffer.from(`${id}:${secret}`).toString("base64");

  // Use password grant if username+password set (script app), else client_credentials.
  const body = username && password
    ? new URLSearchParams({
        grant_type: "password",
        username,
        password,
      })
    : new URLSearchParams({ grant_type: "client_credentials" });

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": UA,
    },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Reddit OAuth token failed: HTTP ${res.status} — ${text.slice(0, 200)}`
    );
  }

  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
    token_type: string;
  };

  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return json.access_token;
}

export async function fetchSubreddit(
  subreddit: string,
  opts: { period?: "day" | "week" | "month"; limit?: number } = {}
): Promise<RedditPost[]> {
  const period = opts.period ?? "week";
  const limit = opts.limit ?? 25;
  const token = await getRedditToken();

  // Authenticated endpoint — bypasses Reddit's anti-bot wall
  const url = `https://oauth.reddit.com/r/${subreddit}/top?t=${period}&limit=${limit}&raw_json=1`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": UA,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Reddit ${subreddit}: HTTP ${res.status} ${res.statusText} — ${body.slice(0, 120)}`
    );
  }
  const json = (await res.json()) as RedditApiResponse;

  return json.data.children
    .map((c) => c.data)
    .filter((d) => !d.over_18 && !d.stickied && !d.removed_by_category)
    .map((d) => ({
      id: d.id,
      subreddit: d.subreddit,
      title: d.title,
      selftext: d.selftext || null,
      author: d.author,
      permalink: `https://www.reddit.com${d.permalink}`,
      url: d.url,
      score: d.score,
      num_comments: d.num_comments,
      created_utc: d.created_utc,
      flair: d.link_flair_text,
    }));
}

export type SubredditFetchResult =
  | { subreddit: string; ok: true; posts: RedditPost[] }
  | { subreddit: string; ok: false; error: string };

export async function fetchAllSubreddits(
  opts: { period?: "day" | "week" | "month"; limit?: number } = {}
): Promise<{ posts: RedditPost[]; perSub: SubredditFetchResult[] }> {
  const results = await Promise.allSettled(
    SUBREDDITS.map((s) => fetchSubreddit(s, opts))
  );
  const perSub: SubredditFetchResult[] = results.map((r, i) =>
    r.status === "fulfilled"
      ? { subreddit: SUBREDDITS[i], ok: true, posts: r.value }
      : { subreddit: SUBREDDITS[i], ok: false, error: String(r.reason).slice(0, 200) }
  );
  const posts = perSub.flatMap((s) => (s.ok ? s.posts : []));
  return { posts, perSub };
}

// Quality filter — auto-import threshold
export function shouldAutoImport(post: RedditPost): boolean {
  // Only import posts with decent engagement AND substantive body
  return (
    post.score >= 30 &&
    post.num_comments >= 5 &&
    (post.selftext?.length ?? 0) >= 100
  );
}
