-- supabase/migrations/20260809010000_index_refeicoes_itens.sql
--
-- Por que: Postgres não indexa colunas de FK automaticamente. Toda carga
-- diária do app e toda exclusão de refeição consultam mwa_refeicoes_itens
-- por refeicao_id, e essa tabela só cresce — sem índice, essas consultas
-- viram sequential scan à medida que o histórico aumenta.

create index if not exists mwa_refeicoes_itens_refeicao_id_idx
  on public.mwa_refeicoes_itens (refeicao_id);
