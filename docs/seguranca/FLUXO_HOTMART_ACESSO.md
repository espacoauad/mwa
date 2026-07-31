# Desenho: Hotmart → cliente → acesso aos 21 dias

> **Status: aguardando aprovação.** Nada deste documento foi implementado.
> Cobre C1 (proteger cupom/ativação) e C5 (bloqueio de acesso). Após aprovação,
> implemento C1 e a base de C5 como mudanças pequenas e testadas.

## Princípios

1. O direito de acesso vive em **`mwa_programas`** (`tipo='21d'`, `status='ativo'`, `data_fim`), nunca no frontend.
2. O frontend **nunca** lê/escreve cupons ou concede acesso. Tudo passa por **Edge Function** com `service_role`.
3. O código de ativação é **aleatório, único, de uso único**, validado só no backend.
4. Cadastrar-se **não** dá acesso. Acesso = ter `mwa_programas` ativo.

## Peças

- **Tabela `mwa_cupons`** (já existe) — passa a funcionar como "código de ativação".
  Campos usados: `codigo`, `ativo`, `usado`, `usado_por`, `usado_em`, `origem`, `detalhes`.
  Sugestão de novas colunas (migration): `buyer_email text`, `transacao_hotmart text unique`,
  `status text` (`emitido|resgatado|reembolsado`).
- **Edge Function `hotmart-webhook`** (nova, `verify_jwt=false`, valida assinatura Hotmart) —
  recebe a confirmação de compra e **emite** o código.
- **Edge Function `mwa-resgatar-cupom`** (nova, pública controlada) — o cliente informa
  código + e-mail + senha; a função valida e **cria o vínculo** (conta + `mwa_programas`).
- **`mwa_pagamentos`** — registra a compra (auditoria + painel admin).

## Fluxo feliz

```
Hotmart (compra aprovada)
      │  POST assinado
      ▼
[hotmart-webhook]  ── valida assinatura (HOTMART_HOTTOK)
      │             ── idempotência: transacao_hotmart única
      │             ── registra mwa_pagamentos (tipo=21d, metodo=hotmart)
      │             ── gera codigo aleatório (crypto) em mwa_cupons (status=emitido)
      │             ── envia e-mail ao cliente com o código + link /resgate
      │             ── notifica a admin (compra 21d)
      ▼
Cliente abre /resgate  →  informa codigo + e-mail + senha
      │  POST
      ▼
[mwa-resgatar-cupom]  ── consome o codigo (UPDATE ... WHERE usado=false, atômico)
      │               ── cria/associa a conta (ver cenários abaixo)
      │               ── insere mwa_programas (tipo=21d, data_fim = +21 dias)
      │               ── marca cupom usado_por/usado_em
      ▼
App: usuário loga → tem programa 21d ativo → acesso liberado
```

## Vínculo compra → conta (cenários pedidos)

| Cenário | Comportamento proposto |
|--------|------------------------|
| **Não tem conta** | `mwa-resgatar-cupom` cria a conta (admin API, e-mail já confirmado) com o e-mail informado e concede `mwa_programas`. |
| **Já tem conta com o mesmo e-mail** | Não recria. Vincula o `mwa_programas` ao `user_id` existente. No resgate, se o e-mail já existe, pedimos a senha atual (login) em vez de criar. |
| **Usa e-mail diferente do da compra** | O código é o elo (não o e-mail). Resgate exige o **código**; o e-mail da conta pode diferir do `buyer_email`. Guardamos ambos em `mwa_cupons.detalhes` para auditoria. |
| **Webhook chega mais de uma vez** | Idempotência por `transacao_hotmart` única: o 2º webhook não emite novo código nem novo pagamento. |
| **Pagamento pendente** | Não emite código. Só emitimos em status aprovado/completo. Pendente é só registrado (opcional) para acompanhamento. |
| **Reembolso / chargeback** | Webhook de refund/chargeback → marca `mwa_cupons.status='reembolsado'`; se já resgatado, `mwa_programas.status='revogado'` (perde acesso); registra em `mwa_pagamentos`; notifica a admin. |

## Controle de acesso (C5) — backend + frontend

- **Backend (verdade):** RLS de `mwa_programas` só deixa o dono ler o próprio. A concessão só
  acontece via Edge Function (`service_role`). Conteúdo sensível servido/validado checa programa ativo.
- **Frontend (experiência):** ao logar, o app consulta `mwa_programas`. Sem `21d` ativo →
  tela de "acesso pendente" com resgate/instruções. Com `21d` → app dos 21 dias. Com `90d` →
  libera o conteúdo dos 90 dias na mesma conta.
- **Rotas públicas mantidas:** landing, login, recuperação de senha, `/resgate`, páginas legais,
  retorno do checkout.

## Notificações (centralizar em config)

Eventos que geram aviso para a admin: compra 21d, compra 90d, compra sessão, reembolso,
chargeback, falha de liberação. Canal a definir (e-mail admin / WhatsApp) — **aguardando
seus dados** (WhatsApp oficial, e-mail suporte, e-mail admin, prazos).

## O que aprovar

1. Usar `mwa_cupons` como "código de ativação" (com as colunas novas sugeridas)?
2. `mwa-resgatar-cupom` pode **criar conta** server-side (e-mail auto-confirmado) quando não existir?
3. Em reembolso/chargeback, **revogar** `mwa_programas` (perder acesso) é o comportamento desejado?
4. Duração do acesso 21d = 21 dias corridos a partir do resgate (ou da compra)?
```
```
