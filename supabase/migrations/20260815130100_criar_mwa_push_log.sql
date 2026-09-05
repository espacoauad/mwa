create table public.mwa_push_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null,
  data date not null,
  enviado_em timestamptz not null default now(),
  unique (user_id, tipo, data)
);

alter table public.mwa_push_log enable row level security;
-- Tabela operacional interna (log de envio) — sem policy de leitura/escrita
-- pro usuário final. Só a service role (usada pela Edge Function) acessa;
-- a service role ignora RLS por padrão no Supabase.
