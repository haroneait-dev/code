-- ─────────────────────────────────────────────────────────────────────
-- FIX messages privés (404 sur "Message privé")
-- Ré-applique le schéma des DM (tables + RLS + RPC) de façon idempotente.
-- Cause du bug : la section DM de 0003 n'avait pas été appliquée en prod,
-- donc la RPC get_or_create_dm était absente → la page /messages/nouveau
-- échouait et la redirection menait à un 404.
--
-- Sûr à exécuter plusieurs fois (if not exists / drop+create / create or replace).
-- À coller dans : Supabase → SQL Editor → Run.
-- ─────────────────────────────────────────────────────────────────────

-- DIAGNOSTIC (optionnel) : exécute d'abord ces 2 lignes pour confirmer.
-- Si une valeur est NULL / vide, le schéma manque bien :
--   select to_regclass('public.conversations'),
--          to_regclass('public.conversation_participants'),
--          to_regclass('public.messages');
--   select proname from pg_proc where proname = 'get_or_create_dm';

-- =====================================================================
-- Tables : conversations + participants + messages
-- =====================================================================

create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
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

-- =====================================================================
-- RLS
-- =====================================================================

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

-- =====================================================================
-- Trigger : bump last_message_at + RPC get_or_create_dm
-- =====================================================================

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

-- =====================================================================
-- Trigger notif sur nouveau message (dépend de la table notifications de 0005).
-- Conditionnel : ne s'exécute que si 0005 a déjà créé public.notifications,
-- pour que ce script ne puisse jamais échouer.
-- =====================================================================

do $do$
begin
  if to_regclass('public.notifications') is not null then
    create or replace function public.notify_on_message()
    returns trigger
    language plpgsql
    security definer set search_path = public
    as $fn$
    begin
      insert into public.notifications
        (user_id, kind, actor_id, conversation_id, body_preview)
      select
        cp.user_id, 'dm', new.sender_id, new.conversation_id, left(new.body, 200)
      from public.conversation_participants cp
      where cp.conversation_id = new.conversation_id
        and cp.user_id <> new.sender_id;
      return null;
    end;
    $fn$;

    drop trigger if exists messages_notify_trg on public.messages;
    create trigger messages_notify_trg
      after insert on public.messages
      for each row execute function public.notify_on_message();
  end if;
end
$do$;
