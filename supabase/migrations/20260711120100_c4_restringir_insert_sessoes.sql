-- C4 — Restringir INSERT em mwa_sessoes
--
-- Problema: a policy "system_insert_sessions" usava WITH CHECK (true), permitindo
-- que qualquer role (inclusive anon) inserisse registros com qualquer user_id.
-- A tabela alimenta o painel admin (auditoria de sessões).
--
-- Solução: exigir que o registro seja da própria sessão autenticada.
-- Observação: o registro de "logout" client-side já não funcionava (feito após
-- signOut, sem auth) — será corrigido no código na etapa de logout/recuperação.

drop policy if exists "system_insert_sessions" on public.mwa_sessoes;

create policy "usuario_insere_propria_sessao"
  on public.mwa_sessoes
  for insert
  to authenticated
  with check (user_id = auth.uid());
