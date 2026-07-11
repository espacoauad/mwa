-- C1 — Proteger mwa_cupons (RLS + revogar acesso do frontend)
--
-- Problema: mwa_cupons estava com RLS DESLIGADO e grants totais para anon/
-- authenticated. Qualquer pessoa com a chave pública podia ler, criar, marcar
-- como não-usado ou apagar cupons de acesso.
--
-- Solução: habilitar RLS e revogar grants de anon/authenticated. A tabela passa
-- a ser acessível SOMENTE via service_role (Edge Function mwa-resgatar-cupom),
-- que valida e consome o cupom no backend de forma atômica.
--
-- Esta migration acompanha a Edge Function mwa-resgatar-cupom e a atualização de
-- src/components/vendas/ResgateCupom.jsx — devem ser aplicadas/validadas juntas.

alter table public.mwa_cupons enable row level security;

-- Sem policies: anon/authenticated ficam sem qualquer acesso via PostgREST.
-- service_role ignora RLS (usado pela Edge Function).
revoke all on public.mwa_cupons from anon, authenticated;
