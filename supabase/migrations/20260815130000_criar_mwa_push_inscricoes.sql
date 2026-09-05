create table public.mwa_push_inscricoes (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index mwa_push_inscricoes_user_id_idx on public.mwa_push_inscricoes(user_id);

alter table public.mwa_push_inscricoes enable row level security;

create policy "usuario gerencia as proprias inscricoes push"
  on public.mwa_push_inscricoes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
