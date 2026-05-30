-- ─────────────────────────────────────────────────────────────────────
-- Moderation: community_reports
-- Run in Supabase SQL Editor (idempotent — safe to re-run)
-- ─────────────────────────────────────────────────────────────────────

create table if not exists public.community_reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references public.profiles(user_id) on delete cascade,
  target_kind  text not null check (target_kind in ('post', 'comment', 'user', 'message')),
  target_id    uuid not null,
  reason       text not null check (char_length(reason) between 4 and 500),
  status       text not null default 'pending'
               check (status in ('pending', 'reviewed', 'dismissed', 'actioned')),
  reviewed_by  uuid references public.profiles(user_id) on delete set null,
  reviewed_at  timestamptz,
  admin_note   text,
  created_at   timestamptz not null default now()
);

create index if not exists community_reports_status_idx
  on public.community_reports(status, created_at desc);

create index if not exists community_reports_reporter_idx
  on public.community_reports(reporter_id);

alter table public.community_reports enable row level security;

drop policy if exists "reports: reporter insert" on public.community_reports;
create policy "reports: reporter insert" on public.community_reports
  for insert with check (
    auth.uid() = reporter_id
    and exists (
      select 1 from public.profiles
      where user_id = auth.uid()
        and status = 'approved'
        and username is not null
    )
  );

drop policy if exists "reports: reporter read own" on public.community_reports;
create policy "reports: reporter read own" on public.community_reports
  for select using (auth.uid() = reporter_id);
