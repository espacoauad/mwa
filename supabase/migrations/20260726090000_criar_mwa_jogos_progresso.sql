-- Progresso dos jogos educativos (Monte Seu Prato e os demais da coleção).
--
-- Por que: hoje só o evento de recompensa é salvo (mwa_game_eventos), então
-- melhor pontuação, estrelas e desbloqueio de nível se perdem ao fechar o jogo.
--
-- Impacto: tabela nova e aditiva. Nenhuma tabela existente é alterada e
-- nenhum dado atual é tocado. Quem já usa o app simplesmente começa a acumular
-- progresso a partir daqui.
--
-- Chave: (user_id, jogo_id, missao_id) — uma linha por missão de cada jogo.
-- Jogos sem missões usam missao_id = '' (string vazia).

create table if not exists public.mwa_jogos_progresso (
  user_id uuid not null references auth.users (id) on delete cascade,
  jogo_id text not null,
  missao_id text not null default '',
  nivel integer not null default 1,
  melhor_pontuacao integer not null default 0,
  estrelas integer not null default 0,
  partidas integer not null default 0,
  atualizado_em timestamptz not null default now(),
  primary key (user_id, jogo_id, missao_id),
  constraint mwa_jogos_progresso_estrelas_check check (estrelas between 0 and 3),
  constraint mwa_jogos_progresso_pontuacao_check check (melhor_pontuacao between 0 and 100)
);

create index if not exists mwa_jogos_progresso_user_idx
  on public.mwa_jogos_progresso (user_id);

alter table public.mwa_jogos_progresso enable row level security;

-- Cada pessoa enxerga e escreve apenas o próprio progresso (mesmo padrão de mwa_game).
drop policy if exists "usuario_le_proprio_progresso" on public.mwa_jogos_progresso;
create policy "usuario_le_proprio_progresso"
  on public.mwa_jogos_progresso
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "usuario_insere_proprio_progresso" on public.mwa_jogos_progresso;
create policy "usuario_insere_proprio_progresso"
  on public.mwa_jogos_progresso
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "usuario_atualiza_proprio_progresso" on public.mwa_jogos_progresso;
create policy "usuario_atualiza_proprio_progresso"
  on public.mwa_jogos_progresso
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
