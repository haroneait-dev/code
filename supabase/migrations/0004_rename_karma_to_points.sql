-- ─────────────────────────────────────────────────────────────────────
-- Rename "karma_*" columns to "points_*" and update dependent objects
-- Run in Supabase SQL Editor after 0003.
-- ─────────────────────────────────────────────────────────────────────

-- The community_profiles view selects karma_* columns, so drop it first.
drop view if exists public.community_profiles;

-- Rename columns on profiles
alter table public.profiles
  rename column karma_post to points_post;

alter table public.profiles
  rename column karma_comment to points_comment;

-- Recreate the index with the new name
drop index if exists public.profiles_karma_post_idx;
create index if not exists profiles_points_post_idx
  on public.profiles(points_post desc);

-- Recreate the public view with the new column names
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

-- Update the vote-delta function to write to the renamed columns
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
