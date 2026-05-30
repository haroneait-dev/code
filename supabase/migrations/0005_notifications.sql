-- ─────────────────────────────────────────────────────────────────────
-- In-app notifications: table, RLS, triggers (comment replies + DMs)
-- Idempotent: safe to re-run
-- ─────────────────────────────────────────────────────────────────────

-- =====================================================================
-- 1) notifications table
-- =====================================================================

create table if not exists public.notifications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(user_id) on delete cascade,
  kind            text not null check (kind in ('comment_reply','post_reply','dm','mention')),
  actor_id        uuid references public.profiles(user_id) on delete set null,
  post_id         uuid references public.community_posts(id) on delete cascade,
  comment_id      uuid references public.community_comments(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete cascade,
  body_preview    text,
  read_at         timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists notifications_inbox_idx
  on public.notifications(user_id, read_at, created_at desc);

create index if not exists notifications_unread_idx
  on public.notifications(user_id, created_at desc)
  where read_at is null;

-- =====================================================================
-- 2) RLS — recipient-only read + update (no public insert)
-- =====================================================================

alter table public.notifications enable row level security;

drop policy if exists "notifications: recipient read" on public.notifications;
create policy "notifications: recipient read" on public.notifications
  for select using (user_id = auth.uid());

drop policy if exists "notifications: recipient update" on public.notifications;
create policy "notifications: recipient update" on public.notifications
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- =====================================================================
-- 3) Trigger: comment INSERT → comment_reply or post_reply
-- =====================================================================

create or replace function public.notify_on_comment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_recipient uuid;
  v_kind      text;
begin
  if new.parent_id is not null then
    select author_id into v_recipient
      from public.community_comments
      where id = new.parent_id;
    v_kind := 'comment_reply';
  else
    select author_id into v_recipient
      from public.community_posts
      where id = new.post_id;
    v_kind := 'post_reply';
  end if;

  if v_recipient is null or v_recipient = new.author_id then
    return null;
  end if;

  insert into public.notifications
    (user_id, kind, actor_id, post_id, comment_id, body_preview)
  values
    (v_recipient, v_kind, new.author_id, new.post_id, new.id, left(new.body, 200));

  return null;
end;
$$;

drop trigger if exists community_comments_notify_trg on public.community_comments;
create trigger community_comments_notify_trg
  after insert on public.community_comments
  for each row execute function public.notify_on_comment();

-- =====================================================================
-- 4) Trigger: message INSERT → notify each other participant
-- =====================================================================

create or replace function public.notify_on_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.notifications
    (user_id, kind, actor_id, conversation_id, body_preview)
  select
    cp.user_id,
    'dm',
    new.sender_id,
    new.conversation_id,
    left(new.body, 200)
  from public.conversation_participants cp
  where cp.conversation_id = new.conversation_id
    and cp.user_id <> new.sender_id;

  return null;
end;
$$;

drop trigger if exists messages_notify_trg on public.messages;
create trigger messages_notify_trg
  after insert on public.messages
  for each row execute function public.notify_on_message();
