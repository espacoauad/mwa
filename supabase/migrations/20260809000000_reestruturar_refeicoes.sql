-- supabase/migrations/20260809000000_reestruturar_refeicoes.sql
-- Reestrutura mwa_refeicoes: cada linha passa a ser uma REFEIÇÃO
-- (café/almoço/etc), e os alimentos ficam em mwa_refeicoes_itens.
--
-- Nota: a tabela antiga guardava marca/alimentoId/quantidade/medidaId/
-- fotoUrl/manual dentro da coluna jsonb "detalhes" (não como colunas
-- separadas) — a migração dos dados abaixo extrai esses campos de lá.

-- 1) tabela temporária com o agrupamento (lê a tabela antiga antes de renomear)
create temporary table _grupos as
select
  user_id, data, tipo,
  min(horario) as horario,
  gen_random_uuid() as nova_refeicao_id
from public.mwa_refeicoes
group by user_id, data, tipo;

-- 2) guarda a tabela antiga de lado
alter table public.mwa_refeicoes rename to _mwa_refeicoes_antiga;

-- 3) cria a mwa_refeicoes nova (uma linha por refeição) e já popula com os grupos
create table public.mwa_refeicoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null,
  tipo text not null,
  horario time not null,
  foto_url text,
  criado_em timestamptz not null default now(),
  unique (user_id, data, tipo)
);

insert into public.mwa_refeicoes (id, user_id, data, tipo, horario, criado_em)
select nova_refeicao_id, user_id, data, tipo, horario::time, now()
from _grupos;

alter table public.mwa_refeicoes enable row level security;

create policy "refeicoes da propria usuaria"
  on public.mwa_refeicoes
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 4) agora que as refeições novas existem de verdade, cria mwa_refeicoes_itens
--    (a FK já aponta pra tabela nova, que é a que se chama mwa_refeicoes agora)
create table public.mwa_refeicoes_itens (
  id uuid primary key default gen_random_uuid(),
  refeicao_id uuid not null references public.mwa_refeicoes(id) on delete cascade,
  nome text not null,
  marca text,
  alimento_id text,
  quantidade numeric not null,
  quantidade_base numeric not null,
  medida_id text not null,
  medida_nome text not null,
  manual boolean not null default false,
  calorias integer not null default 0,
  proteina numeric not null default 0,
  carbos numeric not null default 0,
  gordura numeric not null default 0,
  fibras numeric not null default 0,
  criado_em timestamptz not null default now()
);

insert into public.mwa_refeicoes_itens
  (refeicao_id, nome, marca, alimento_id, quantidade, quantidade_base,
   medida_id, medida_nome, manual, calorias, proteina, carbos, gordura, fibras, criado_em)
select
  g.nova_refeicao_id,
  r.nome,
  r.detalhes->>'marca',
  r.detalhes->>'alimentoId',
  coalesce((r.detalhes->>'quantidade')::numeric, 1),
  coalesce((r.detalhes->>'quantidadeBase')::numeric, 100),
  coalesce(r.detalhes->>'medidaId', 'g'),
  coalesce(r.detalhes->>'medidaNome', 'g'),
  coalesce((r.detalhes->>'manual')::boolean, false),
  round(r.calorias)::integer, r.proteina, r.carbos, r.gordura, r.fibras, r.criado_em
from public._mwa_refeicoes_antiga r
join _grupos g on g.user_id = r.user_id and g.data = r.data and g.tipo = r.tipo;

alter table public.mwa_refeicoes_itens enable row level security;

create policy "itens da propria refeicao"
  on public.mwa_refeicoes_itens
  for all
  using (
    exists (
      select 1 from public.mwa_refeicoes r
      where r.id = refeicao_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.mwa_refeicoes r
      where r.id = refeicao_id and r.user_id = auth.uid()
    )
  );

-- 5) limpeza
drop table public._mwa_refeicoes_antiga;
drop table _grupos;

-- 6) Bucket de Storage pras fotos de refeição
insert into storage.buckets (id, name, public)
values ('fotos-refeicoes', 'fotos-refeicoes', true)
on conflict (id) do nothing;

create policy "le fotos de refeicao publicamente"
  on storage.objects for select
  using (bucket_id = 'fotos-refeicoes');

create policy "sobe foto na propria pasta"
  on storage.objects for insert
  with check (bucket_id = 'fotos-refeicoes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "atualiza foto na propria pasta"
  on storage.objects for update
  using (bucket_id = 'fotos-refeicoes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "apaga foto na propria pasta"
  on storage.objects for delete
  using (bucket_id = 'fotos-refeicoes' and (storage.foldername(name))[1] = auth.uid()::text);
