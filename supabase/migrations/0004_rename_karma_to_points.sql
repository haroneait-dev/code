-- ─────────────────────────────────────────────────────────────────────
-- Idempotent rename: karma_* columns → points_*, refresh dependent objects
-- Safe to re-run (handles partial state and missing columns)
-- ─────────────────────────────────────────────────────────────────────

-- 1) Drop view (it depends on the columns and will be recreated)
drop view if exists public.community_profiles;

-- 2) Rename only when the old column still exists
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'karma_post'
  ) then
    alter table public.profiles rename column karma_post to points_post;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'karma_comment'
  ) then
    alter table public.profiles rename column karma_comment to points_comment;
  end if;
end$$;

-- 3) Ensure points_* exist (covers fresh installs and any prior partial run)
alter table public.profiles
  add column if not exists points_post integer not null default 0,
  add column if not exists points_comment integer not null default 0;

-- 4) Refresh index
drop index if exists public.profiles_karma_post_idx;
create index if not exists profiles_points_post_idx
  on public.profiles(points_post desc);

-- 5) Recreate the public view with the new column names
create view public.community_profiles
with (security_invoker = false) as
  select
    user_id,
    username,
    display_name,
    bio,
    avatar_url,
    points_post,
    points_comment,
    created_at
  from public.profiles
  where status = 'approved' and username is not null;

grant select on public.community_profiles to anon, authenticated;

-- 6) Update the vote-delta function to write to the renamed columns
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
        set points_post = points_post + p_delta
        where user_id = v_author_id;
    end if;
  elsif p_target_kind = 'comment' then
    update public.community_comments
      set score = score + p_delta
      where id = p_target_id
      returning author_id into v_author_id;
    if v_author_id is not null then
      update public.profiles
        set points_comment = points_comment + p_delta
        where user_id = v_author_id;
    end if;
  end if;
end;
$$;
