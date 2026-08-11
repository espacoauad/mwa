alter table public.mwa_game
  add column if not exists recomecar_pendente boolean not null default false;
