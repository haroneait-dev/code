-- ─────────────────────────────────────────────────────────────────────
-- Profiles table + admin gate
-- Run this in Supabase SQL Editor (project pylpruhwyunjihutsyom)
-- ─────────────────────────────────────────────────────────────────────

-- 1) Admin allowlist (DB-driven, no superuser needed)
create table if not exists public.admin_emails (
  email text primary key
);

insert into public.admin_emails (email) values ('haroneait@gmail.com')
on conflict (email) do nothing;

alter table public.admin_emails enable row level security;
-- No public policies → table only accessible via service_role (admin pages)

-- 2) Profiles table
create table if not exists public.profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  status       text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at   timestamptz not null default now(),
  approved_at  timestamptz,
  approved_by  uuid references auth.users(id)
);

create index if not exists profiles_status_idx on public.profiles(status);

-- 3) Auto-create profile on signup (auto-approve if email in admin_emails)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  is_admin boolean;
begin
  select exists (select 1 from public.admin_emails where email = new.email) into is_admin;

  insert into public.profiles (user_id, email, status, approved_at)
  values (
    new.id,
    new.email,
    case when is_admin then 'approved' else 'pending' end,
    case when is_admin then now() else null end
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4) Backfill — create profiles for users that already exist
insert into public.profiles (user_id, email, status, approved_at)
select
  u.id,
  u.email,
  case when exists (select 1 from public.admin_emails a where a.email = u.email)
       then 'approved' else 'pending' end,
  case when exists (select 1 from public.admin_emails a where a.email = u.email)
       then now() else null end
from auth.users u
where not exists (select 1 from public.profiles p where p.user_id = u.id);

-- 5) Row Level Security on profiles
alter table public.profiles enable row level security;

drop policy if exists "users read own profile" on public.profiles;

-- Each user can read their own profile (used by middleware/proxy)
create policy "users read own profile" on public.profiles
  for select using (auth.uid() = user_id);

-- All writes go through service_role (API routes), no public write policies.
