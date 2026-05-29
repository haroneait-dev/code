-- ─────────────────────────────────────────────────────────────────────
-- Community Reddit-style: profiles extension, posts, comments, votes, DMs
-- Run in Supabase SQL Editor (project pylpruhwyunjihutsyom)
-- ─────────────────────────────────────────────────────────────────────

-- =====================================================================
-- 1) Extend profiles with public-facing fields
-- =====================================================================

alter table public.profiles
  add column if not exists username text,
  add column if not exists display_name text,
  add column if not exists bio text,
  add column if not exists avatar_url text,
  add column if not exists karma_post integer not null default 0,
  add column if not exists karma_comment integer not null default 0,
  add column if not exists onboarded boolean not null default false;

-- Lowercase + uniqueness + format
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_username_format'
  ) then
    alter table public.profiles
      add constraint profiles_username_format
      check (
        username is null
        or (username = lower(username) and username ~ '^[a-z0-9_]{3,20}$')
      );
  end if;
end$$;

create unique index if not exists profiles_username_unique
  on public.profiles(username)
  where username is not null;

create index if not exists profiles_karma_post_idx
  on public.profiles(karma_post desc);

-- =====================================================================
-- 2) Public profiles view (safe to expose to anon)
-- =====================================================================

drop view if exists public.community_profiles;
create view public.community_profiles
with (security_invoker = false) as
  select
    user_id,
    username,
    display_name,
    bio,
    avatar_url,
    karma_post,
    karma_comment,
    created_at
  from public.profiles
  where status = 'approved' and username is not null;

grant select on public.community_profiles to anon, authenticated;

-- =====================================================================
-- 3) community_posts
-- =====================================================================

create table if not exists public.community_posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(user_id) on delete cascade,
  slug          text not null,
  title         text not null check (char_length(title) between 4 and 200),
  body          text not null default '',
  category      text not null default 'general',
  tags          text[] not null default '{}',
  score         integer not null default 0,
  comment_count integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create unique index if not exists community_posts_slug_unique
  on public.community_posts(slug)
  where deleted_at is null;

create index if not exists community_posts_created_idx
  on public.community_posts(created_at desc) where deleted_at is null;

create index if not exists community_posts_score_idx
  on public.community_posts(score desc) where deleted_at is null;

create index if not exists community_posts_author_idx
  on public.community_posts(author_id) where deleted_at is null;

create index if not exists community_posts_category_idx
  on public.community_posts(category) where deleted_at is null;

alter table public.community_posts enable row level security;

drop policy if exists "posts: public read" on public.community_posts;
create policy "posts: public read" on public.community_posts
  for select using (deleted_at is null);

drop policy if exists "posts: approved users insert" on public.community_posts;
create policy "posts: approved users insert" on public.community_posts
  for insert with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid()
        and status = 'approved'
        and username is not null
    )
  );

drop policy if exists "posts: author update" on public.community_posts;
create policy "posts: author update" on public.community_posts
  for update using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "posts: author soft delete" on public.community_posts;
create policy "posts: author soft delete" on public.community_posts
  for delete using (auth.uid() = author_id);

-- =====================================================================
-- 4) community_comments (threaded)
-- =====================================================================

create table if not exists public.community_comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.community_posts(id) on delete cascade,
  parent_id   uuid references public.community_comments(id) on delete cascade,
  author_id   uuid not null references public.profiles(user_id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 10000),
  score       integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

create index if not exists community_comments_post_idx
  on public.community_comments(post_id, created_at);

create index if not exists community_comments_parent_idx
  on public.community_comments(parent_id) where parent_id is not null;

create index if not exists community_comments_author_idx
  on public.community_comments(author_id);

alter table public.community_comments enable row level security;

drop policy if exists "comments: public read" on public.community_comments;
create policy "comments: public read" on public.community_comments
  for select using (true);

drop policy if exists "comments: approved users insert" on public.community_comments;
create policy "comments: approved users insert" on public.community_comments
  for insert with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid()
        and status = 'approved'
        and username is not null
    )
  );

drop policy if exists "comments: author update" on public.community_comments;
create policy "comments: author update" on public.community_comments
  for update using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "comments: author delete" on public.community_comments;
create policy "comments: author delete" on public.community_comments
  for delete using (auth.uid() = author_id);

-- Denormalize comment_count on community_posts
create or replace function public.update_post_comment_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.community_posts
      set comment_count = comment_count + 1
      where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.community_posts
      set comment_count = greatest(comment_count - 1, 0)
      where id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists community_comments_count_trg on public.community_comments;
create trigger community_comments_count_trg
  after insert or delete on public.community_comments
  for each row execute function public.update_post_comment_count();

-- =====================================================================
-- 5) community_votes (polymorphic on post/comment)
-- =====================================================================

create table if not exists public.community_votes (
  voter_id    uuid not null references public.profiles(user_id) on delete cascade,
  target_kind text not null check (target_kind in ('post','comment')),
  target_id   uuid not null,
  value       smallint not null check (value in (-1, 1)),
  created_at  timestamptz not null default now(),
  primary key (voter_id, target_kind, target_id)
);

create index if not exists community_votes_target_idx
  on public.community_votes(target_kind, target_id);

alter table public.community_votes enable row level security;

drop policy if exists "votes: voter read own" on public.community_votes;
create policy "votes: voter read own" on public.community_votes
  for select using (auth.uid() = voter_id);

drop policy if exists "votes: voter insert own" on public.community_votes;
create policy "votes: voter insert own" on public.community_votes
  for insert with check (
    auth.uid() = voter_id
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid() and status = 'approved'
    )
  );

drop policy if exists "votes: voter update own" on public.community_votes;
create policy "votes: voter update own" on public.community_votes
  for update using (auth.uid() = voter_id)
  with check (auth.uid() = voter_id);

drop policy if exists "votes: voter delete own" on public.community_votes;
create policy "votes: voter delete own" on public.community_votes
  for delete using (auth.uid() = voter_id);

-- Denormalize score on posts/comments + karma on profiles
create or replace function public.apply_vote_delta(
  p_target_kind text,
  p_target_id   uuid,
  p_delta       integer
) returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_author_id uuid;
begin
  if p_delta = 0 then return; end if;

  if p_target_kind = 'post' then
    update public.community_posts
      set score = score + p_delta
      where id = p_target_id
      returning author_id into v_author_id;
    if v_author_id is not null then
      update public.profiles
        set karma_post = karma_post + p_delta
        where user_id = v_author_id;
    end if;
  elsif p_target_kind = 'comment' then
    update public.community_comments
      set score = score + p_delta
      where id = p_target_id
      returning author_id into v_author_id;
    if v_author_id is not null then
      update public.profiles
        set karma_comment = karma_comment + p_delta
        where user_id = v_author_id;
    end if;
  end if;
end;
$$;

create or replace function public.community_votes_after()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    perform public.apply_vote_delta(new.target_kind, new.target_id, new.value);
  elsif tg_op = 'UPDATE' then
    perform public.apply_vote_delta(new.target_kind, new.target_id, new.value - old.value);
  elsif tg_op = 'DELETE' then
    perform public.apply_vote_delta(old.target_kind, old.target_id, -old.value);
  end if;
  return null;
end;
$$;

drop trigger if exists community_votes_after_trg on public.community_votes;
create trigger community_votes_after_trg
  after insert or update or delete on public.community_votes
  for each row execute function public.community_votes_after();

-- =====================================================================
-- 6) Direct Messages: conversations + participants + messages
-- =====================================================================

create table if not exists public.conversations (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id         uuid not null references public.profiles(user_id) on delete cascade,
  joined_at       timestamptz not null default now(),
  last_read_at    timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create index if not exists conversation_participants_user_idx
  on public.conversation_participants(user_id);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(user_id) on delete cascade,
  body            text not null check (char_length(body) between 1 and 5000),
  created_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

create index if not exists messages_conversation_idx
  on public.messages(conversation_id, created_at desc);

-- RLS conversations: visible only if user is a participant
alter table public.conversations enable row level security;

drop policy if exists "conversations: participant read" on public.conversations;
create policy "conversations: participant read" on public.conversations
  for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = conversations.id and user_id = auth.uid()
    )
  );

drop policy if exists "conversations: authenticated create" on public.conversations;
create policy "conversations: authenticated create" on public.conversations
  for insert with check (auth.uid() is not null);

-- RLS participants
alter table public.conversation_participants enable row level security;

drop policy if exists "participants: own rows read" on public.conversation_participants;
create policy "participants: own rows read" on public.conversation_participants
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from public.conversation_participants p2
      where p2.conversation_id = conversation_participants.conversation_id
        and p2.user_id = auth.uid()
    )
  );

drop policy if exists "participants: insert self" on public.conversation_participants;
create policy "participants: insert self" on public.conversation_participants
  for insert with check (user_id = auth.uid());

drop policy if exists "participants: update own last_read" on public.conversation_participants;
create policy "participants: update own last_read" on public.conversation_participants
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- RLS messages
alter table public.messages enable row level security;

drop policy if exists "messages: participant read" on public.messages;
create policy "messages: participant read" on public.messages
  for select using (
    exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
  );

drop policy if exists "messages: participant send" on public.messages;
create policy "messages: participant send" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversation_participants
      where conversation_id = messages.conversation_id and user_id = auth.uid()
    )
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid() and status = 'approved' and username is not null
    )
  );

drop policy if exists "messages: sender delete" on public.messages;
create policy "messages: sender delete" on public.messages
  for update using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- Bump conversations.last_message_at when a message is inserted
create or replace function public.bump_conversation_last_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.conversations
    set last_message_at = new.created_at
    where id = new.conversation_id;
  return null;
end;
$$;

drop trigger if exists messages_bump_conv_trg on public.messages;
create trigger messages_bump_conv_trg
  after insert on public.messages
  for each row execute function public.bump_conversation_last_message();

-- =====================================================================
-- 7) Helper RPC: get or create 1-on-1 conversation between two users
-- =====================================================================

create or replace function public.get_or_create_dm(target_user_id uuid)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_me uuid := auth.uid();
  v_conv uuid;
begin
  if v_me is null then
    raise exception 'auth required';
  end if;
  if target_user_id = v_me then
    raise exception 'cannot DM self';
  end if;

  -- Find existing 1-on-1 conversation with exactly these 2 participants
  select cp1.conversation_id into v_conv
  from public.conversation_participants cp1
  join public.conversation_participants cp2
    on cp1.conversation_id = cp2.conversation_id
  where cp1.user_id = v_me
    and cp2.user_id = target_user_id
    and (
      select count(*) from public.conversation_participants cp3
      where cp3.conversation_id = cp1.conversation_id
    ) = 2
  limit 1;

  if v_conv is not null then
    return v_conv;
  end if;

  insert into public.conversations default values
    returning id into v_conv;

  insert into public.conversation_participants (conversation_id, user_id)
  values (v_conv, v_me), (v_conv, target_user_id);

  return v_conv;
end;
$$;

grant execute on function public.get_or_create_dm(uuid) to authenticated;
