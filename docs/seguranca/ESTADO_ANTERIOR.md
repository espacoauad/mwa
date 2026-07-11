# Estado do banco antes das correções de segurança

Capturado em 2026-07-11, projeto Supabase **Espaço Auad** (`kamnttliodtbovuaujsi`, `sa-east-1`).
Branch de trabalho: `security/correcoes-criticas`. Tag de restauração: `pre-auditoria-seguranca`.

> O banco é **compartilhado** com outro sistema. As correções tocam **apenas** objetos com prefixo `mwa_*`. Tabelas de terceiros (`contatos`, `clientes`, `pedidos`, `debug_pagamentos`, `crm_envios`) **não** foram alteradas.

## RLS por tabela (mwa_*) — ANTES

| Tabela | RLS | Observação |
|--------|-----|-----------|
| mwa_cupons | **OFF** | ⚠️ C1 — totalmente exposta a anon/authenticated |
| mwa_perfis | ON | policy `proprio perfil` (ALL, own row) sem proteção de `role` ⚠️ C2 |
| mwa_sessoes | ON | policy `system_insert_sessions` (INSERT, WITH CHECK true) ⚠️ C4 |
| mwa_pagamentos | ON | `proprios pagamentos` (SELECT own) |
| mwa_programas | ON | `proprios programas` (SELECT own) |
| mwa_agua, mwa_exercicios, mwa_pesagens, mwa_refeicoes | ON | ALL own row |
| mwa_game | ON | `game_proprio` (ALL own) + `admin_le_game` (SELECT admin) |
| mwa_game_eventos | ON | `eventos_proprios` (ALL own) |
| mwa_lgpd_auditoria | ON | INSERT/SELECT own |

## Policies relevantes — ANTES (para rollback)

`mwa_sessoes` tinha exatamente estas 3 policies:

- `system_insert_sessions` — INSERT, roles {public}, `WITH CHECK (true)`  ← **substituída** por C4
- `admin_read_all_sessions` — SELECT, `EXISTS (... role='admin')`  ← mantida
- `user_read_own_sessions` — SELECT, `user_id = auth.uid()`  ← mantida

`mwa_perfis` tinha:

- `proprio perfil` — ALL, `USING (id = auth.uid())` `WITH CHECK (id = auth.uid())`  ← mantida; C2 adiciona trigger, não altera a policy

`mwa_cupons`:

- Sem policies. RLS OFF. Grants: anon e authenticated com INSERT/SELECT/UPDATE/DELETE/TRUNCATE.  ← C1 liga RLS e revoga grants

## Colunas de referência

- `mwa_perfis.role` — text, default `'user'`, nullable.
- `mwa_programas` — já existe: `user_id, tipo, data_inicio, data_fim, origem (default 'mercado_pago'), pagamento_id, status (default 'ativo')`. Será a base do controle de acesso (C5).
- `mwa_cupons` — `codigo, ativo (def true), usado (def false), usado_por, usado_em, origem (def 'hotmart'), detalhes jsonb`.

## Advisors de segurança — ANTES

- ERROR `rls_disabled_in_public`: `mwa_cupons` (C1).
- WARN `rls_policy_always_true`: `mwa_sessoes.system_insert_sessions` (C4). *(Também `contatos` e `pedidos`, de outro sistema — fora do escopo.)*
- WARN `auth_leaked_password_protection` desativado (D5).
- INFO `rls_enabled_no_policy`: `clientes`, `crm_envios`, `debug_pagamentos` — **de outro sistema, não tocar**.
