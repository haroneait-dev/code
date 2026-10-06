-- Inscriptions à la newsletter « Nouveautés Claude ».
-- Écriture uniquement via l'API du site (clé service), aucune lecture publique.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

alter table public.newsletter_subscribers enable row level security;
-- Aucune policy : seuls le rôle service (API) et l'administrateur y accèdent.
