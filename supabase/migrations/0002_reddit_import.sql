-- ─────────────────────────────────────────────────────────────────────
-- Reddit import — store posts fetched from r/ClaudeAI, r/Anthropic, etc.
-- Run this in Supabase SQL Editor (project pylpruhwyunjihutsyom)
-- ─────────────────────────────────────────────────────────────────────

create table if not exists public.reddit_posts (
  id            text primary key,           -- reddit post id (e.g. "abc123")
  subreddit     text not null,
  title         text not null,
  selftext      text,
  author        text not null,
  permalink     text not null,              -- "/r/ClaudeAI/comments/abc/title/"
  url           text not null,
  score         integer not null,
  num_comments  integer not null,
  created_utc   bigint not null,            -- unix timestamp of original post
  fetched_at    timestamptz not null default now(),
  imported      boolean not null default false,
  imported_at   timestamptz,
  flair         text
);

create index if not exists reddit_posts_imported_idx on public.reddit_posts(imported, score desc);
create index if not exists reddit_posts_created_idx on public.reddit_posts(created_utc desc);
create index if not exists reddit_posts_subreddit_idx on public.reddit_posts(subreddit, created_utc desc);

-- Native community threads (for posts written by users on our site)
create table if not exists public.community_threads (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid references auth.users(id) on delete set null,
  author_name  text not null,
  title        text not null,
  body         text not null,
  category     text not null,
  tags         text[] default '{}',
  upvotes      integer not null default 0,
  replies      integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists community_threads_created_idx on public.community_threads(created_at desc);
create index if not exists community_threads_category_idx on public.community_threads(category, created_at desc);

-- RLS — reddit_posts: anyone authenticated can read imported posts
alter table public.reddit_posts enable row level security;
drop policy if exists "read imported reddit posts" on public.reddit_posts;
create policy "read imported reddit posts" on public.reddit_posts
  for select using (imported = true);

-- RLS — community_threads: read public, write authenticated
alter table public.community_threads enable row level security;
drop policy if exists "anyone reads threads" on public.community_threads;
create policy "anyone reads threads" on public.community_threads
  for select using (true);

drop policy if exists "authenticated users create threads" on public.community_threads;
create policy "authenticated users create threads" on public.community_threads
  for insert with check (auth.uid() = author_id);
