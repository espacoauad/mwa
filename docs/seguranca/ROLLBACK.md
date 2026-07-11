# Plano de rollback — correções de segurança MWA

Cada correção é revertível de forma isolada. Rode o SQL correspondente no SQL Editor do Supabase (projeto `kamnttliodtbovuaujsi`) para desfazer.

## Git

Restaurar todo o código anterior:

```bash
git checkout pre-auditoria-seguranca   # tag criada antes das mudanças
```

## C2 — Proteção de role (`20260711120000_c2_proteger_role_perfis.sql`)

```sql
drop trigger if exists trg_mwa_proteger_role on public.mwa_perfis;
drop function if exists public.mwa_proteger_role();
drop function if exists public.mwa_is_admin(uuid);
```

Risco de reverter: volta a permitir escalação de privilégio. Só reverter se o trigger
bloquear indevidamente um fluxo legítimo (não previsto: onboarding e edição de perfil
não alteram `role`).

## C4 — INSERT em mwa_sessoes (`20260711120100_c4_restringir_insert_sessoes.sql`)

```sql
drop policy if exists "usuario_insere_propria_sessao" on public.mwa_sessoes;
create policy "system_insert_sessions" on public.mwa_sessoes
  for insert with check (true);
```

## C1 — RLS de mwa_cupons (`20260711120200_c1_rls_cupons.sql`)

```sql
alter table public.mwa_cupons disable row level security;
grant select, insert, update, delete on public.mwa_cupons to anon, authenticated;
```

Risco de reverter: reabre a exposição total da tabela. Só reverter em emergência,
e nesse caso desative também a Edge Function `mwa-resgatar-cupom`.

## Notas de segurança do rollback

- Reverter C1/C2/C4 **reintroduz** as vulnerabilidades correspondentes. Fazer apenas
  como medida temporária e reaplicar a correção assim que possível.
- Nenhum rollback aqui afeta tabelas de outros sistemas.
