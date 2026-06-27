-- ─────────────────────────────────────────────────────────────────────
-- Auto-approve everyone (retire l'approbation manuelle par l'admin)
-- Run this in Supabase SQL Editor (project pylpruhwyunjihutsyom)
-- ─────────────────────────────────────────────────────────────────────
-- Le site est public : plus besoin de valider chaque inscription à la main.
-- Les nouveaux comptes sont approuvés automatiquement, et tous les comptes
-- existants (pending / rejected) passent en 'approved'.

-- 1) Nouveau défaut : approuvé dès la création
alter table public.profiles alter column status set default 'approved';

-- 2) Trigger : crée le profil déjà approuvé pour tout le monde
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, status, approved_at)
  values (new.id, new.email, 'approved', now())
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- 3) Backfill : tout le monde passe en approuvé
update public.profiles
set status = 'approved',
    approved_at = coalesce(approved_at, now())
where status <> 'approved';
