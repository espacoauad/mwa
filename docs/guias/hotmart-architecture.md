# MWA × Hotmart — Arquitetura e Plano (para aprovação)

Documento de proposta. **Nada foi implementado ainda.** Depois que você aprovar (e me passar os dados pendentes), eu implemento na ordem combinada.
Projeto Supabase: `MWA` · ref `kfavxgrvikflzyzvcoyb` · São Paulo. Atualizado 11/07/2026.

---

## 0. Princípio central de segurança

**Acesso nunca é liberado pelo redirecionamento do navegador.** O único que libera acesso é o **webhook da Hotmart**, validado no servidor. O retorno do checkout no navegador só serve para mostrar a tela "Confirmando pagamento" — ele não escreve nada no banco.

---

## 1. Os três produtos

| # | Produto | Onde é vendido | Quem compra | Entrega |
|---|---------|----------------|-------------|---------|
| 1 | **Programa 21 dias** (entrada) | Landing page na Hotmart | Cliente **nova**, ainda sem conta MWA | Cupom por e-mail → resgata no MWA e cria a conta |
| 2 | **Programa 90 dias** (completo) | Botão **dentro do MWA** → checkout Hotmart | Cliente **já logada** no MWA | Webhook libera o programa **na mesma conta** |
| 3 | **Sessão individual online** | Botão **dentro do MWA** → checkout Hotmart | Cliente **já logada** no MWA | Webhook marca "Sessão adquirida" + instruções de agendamento |

O app diferencia os três pelo **identificador oficial da Hotmart** (`product.id` e, quando houver, o `offer.code`), mapeado por configuração — nunca pelo preço nem pelo nome.

### Por que 21d usa cupom e 90d/sessão usam vínculo automático
A cliente do 21d ainda **não tem conta** — o cupom é o que permite criar a conta. Já quem compra 90d ou sessão **já está logada no MWA**, então dá para vincular a compra à conta pelo e-mail automaticamente (com tratamento para e-mail diferente, item 6).

---

## 2. Arquitetura final (visão de alto nível)

```
LANDING (Hotmart)            APP MWA (React)                SUPABASE
─────────────────            ──────────────                ─────────
 Checkout 21d ─┐             Botão "90 dias" ─┐            Edge Function
 Checkout 90d ─┼─ compra ──► Botão "Sessão" ──┼─ redirect  hotmart-webhook  (público, valida HOTTOK)
 Checkout Sessão┘            (só abre checkout)│              │  idempotente
                                               │              ├─► mwa_compras      (registro de toda compra)
       Hotmart ──── webhook (servidor) ────────┼──────────►   ├─► mwa_programas    (libera 21d/90d)
       (POST + X-HOTMART-HOTTOK)               │              ├─► mwa_hotmart_eventos (log/idempotência)
                                               │              └─► dispara e-mails/notificação
                          Tela "Confirmando pagamento" ◄─ consulta ─ hotmart-verificar (autenticada)
                          Botão "Já paguei — verificar"  ─ vincular ─ hotmart-vincular  (autenticada)
```

Três Edge Functions novas: `hotmart-webhook` (recebe da Hotmart), `hotmart-verificar` (o app pergunta "já liberou?"), `hotmart-vincular` (vincula compra feita com e-mail diferente). Mais um serviço de e-mail para as notificações.

---

## 3. Produtos que você precisa cadastrar na Hotmart

Recomendo **3 produtos separados** (não 3 ofertas do mesmo produto). Fica mais limpo para o webhook diferenciar, para relatórios e para o agendamento da sessão.

| Produto | Formato recomendado na Hotmart | Cobrança | Observação de entrega |
|---------|-------------------------------|----------|-----------------------|
| **21 dias** | "Software / Área de membros externa" (entrega fora da Hotmart) | Pagamento único | Conteúdo NÃO é entregue pela Hotmart — desligar área de membros/Club |
| **90 dias** | "Software / Área de membros externa" | Pagamento único | Idem — entrega 100% no MWA |
| **Sessão individual** | **"Serviço Online / Consultoria"** | Pagamento único | Esse formato tem **agenda nativa** da Hotmart (ver item 8) |

Para os três: ativar o **Webhook (Postback) 2.0** apontando para a URL da Edge Function, e desligar qualquer entrega de conteúdo pela Hotmart, porque o conteúdo vive só no MWA.

---

## 4. Dados e identificadores que eu preciso de você

Para cada um dos 3 produtos:
- **`product.id`** (o identificador numérico oficial da Hotmart) — é o que o app usa para diferenciar.
- **`offer.code`** de cada oferta/checkout (se você criar ofertas específicas).
- **Link do checkout** de cada produto (vai nos botões do 90d e da sessão).

Globais (uma vez):
- **HOTTOK** do webhook (token que a Hotmart envia no header `X-HOTMART-HOTTOK`).
- **Chave do serviço de e-mail** (recomendo Resend ou SendGrid) — para o e-mail do cupom, confirmação da cliente e sua notificação.
- **WhatsApp e e-mail de suporte** que aparecem na tela da sessão.
- **Seu e-mail/WhatsApp de admin** para receber a notificação de venda de sessão.

Tudo isso fica em **Secrets** da Edge Function, nunca no código do app.

---

## 5. Fluxo de associação entre compra e conta

### 5.1 Idempotência e segurança (vale para todos os eventos)
1. Hotmart faz `POST` no `hotmart-webhook`.
2. A função valida o header `X-HOTMART-HOTTOK` com comparação de tempo constante. Se não bater → `401`, nada é processado.
3. Grava o evento cru em `mwa_hotmart_eventos`. Há um **índice único** pelo id do evento/transação: se o mesmo evento chegar 2x, é ignorado (idempotente).
4. Só então roteia por tipo de evento (item 7).

### 5.2 Programa 21 dias (cliente nova)
Compra aprovada → webhook gera **cupom** em `mwa_cupons` (origem `hotmart`, com `product_id`) → envia e-mail com o código → cliente resgata no MWA (fluxo `ResgateCupom` que já existe) → cria conta + programa 21d.

### 5.3 Programa 90 dias (cliente logada)
Compra aprovada → webhook procura `mwa_perfis` pelo **e-mail do comprador**:
- **Achou** → cria `mwa_programas` (tipo `90d`, `data_fim = agora + 90 dias`, origem `hotmart`, status `ativo`) → e-mail de confirmação. A tela "Confirmando pagamento" no app detecta e libera.
- **Não achou** (e-mail diferente) → grava a compra em `mwa_compras` com `user_id = null` e `liberado = false`, e guarda para o fluxo de vínculo (item 6).

### 5.4 Sessão individual (cliente logada)
Compra aprovada → webhook:
1. registra a compra (`mwa_compras`, produto `sessao`);
2. **te notifica** (e-mail/WhatsApp de admin);
3. envia **confirmação para a cliente**;
4. marca status **"Sessão adquirida"** (visível no MWA);
5. o app mostra as **instruções de agendamento** + **WhatsApp e e-mail de suporte**.

---

## 6. Tratamento de e-mail diferente da conta (90 dias)

Cenário: a cliente comprou na Hotmart com um e-mail diferente do e-mail da conta MWA dela.

Na tela "Confirmando pagamento", se depois de alguns segundos não liberou, aparece o botão **"Já paguei — verificar liberação"**. Ao clicar:
1. O app chama `hotmart-verificar` (autenticada). Ela procura uma compra 90d **aprovada e ainda não vinculada** para o e-mail da conta.
2. Se não achar, o app oferece: **"Comprei com outro e-mail"** → a cliente digita o e-mail usado na Hotmart.
3. `hotmart-vincular` confere se existe em `mwa_compras` uma compra 90d aprovada, não usada, para aquele e-mail → vincula à conta logada (`user_id = auth.uid()`), cria o `mwa_programas` e marca a compra como usada.
4. **Trava anti-fraude:** cada compra só pode ser vinculada uma vez; e (opcional, recomendado) exigir um código de confirmação enviado ao e-mail da compra antes de vincular, para provar que a cliente é dona daquele e-mail.

---

## 7. Regras de reembolso e bloqueio (eventos do webhook)

Um **único** webhook trata todos estes eventos:

| Evento Hotmart | Ação no MWA |
|----------------|-------------|
| `PURCHASE_APPROVED` (aprovada) | Libera acesso (cupom 21d / programa 90d / registra sessão) |
| `PURCHASE_COMPLETE` (completa, pós-garantia) | Confirma/mantém acesso |
| `PURCHASE_PENDING` / aguardando pagamento | Marca **pendente** → app mostra "Confirmando pagamento". **Não libera.** |
| `PURCHASE_CANCELED` (cancelada) | Não libera; se pendente, encerra a pendência |
| `PURCHASE_EXPIRED` (expirada) | Encerra a pendência; sem acesso |
| `PURCHASE_REFUNDED` (reembolso) | **Bloqueia** o acesso: `mwa_programas.status = 'cancelado'`; sessão vira "reembolsada" |
| `PURCHASE_PROTEST` / pedido de reembolso | Marca em análise (opcional: bloqueia preventivamente — você decide) |
| `PURCHASE_CHARGEBACK` (chargeback) | **Bloqueia** o acesso imediatamente |

Regra geral: **aprovação libera, reembolso/chargeback bloqueia**, tudo pelo webhook, sempre idempotente.

---

## 8. Funcionamento do agendamento (sessão)

Duas opções — recomendo decidir agora:

**Opção A — Agenda nativa da Hotmart ("Serviço Online / Consultoria").** A própria Hotmart oferece a tela de marcação de horário após a compra. O MWA só mostra "Sessão adquirida" + link/instrução para agendar na Hotmart + suporte. **Menos código, menos manutenção.** Recomendada para começar.

**Opção B — Agendamento manual via suporte.** O MWA mostra "Sessão adquirida" + instruções para agendar direto com você por **WhatsApp/e-mail**. Simples, total controle, zero integração extra.

Nos dois casos o MWA exibe status, instruções e os contatos de suporte. Um agendamento próprio dentro do app (calendário nativo do MWA) seria um projeto à parte — não recomendo agora.

---

## 9. Mudanças no banco (o que vou criar quando aprovado)

- **`mwa_hotmart_eventos`** — log de todo webhook recebido, com índice único por evento (idempotência) e o payload cru para auditoria.
- **`mwa_compras`** — registro unificado de cada compra Hotmart: produto (`21d`/`90d`/`sessao`), `hotmart_transaction` (único), `product_id`, `offer_code`, `buyer_email`, valor, status, `user_id` (pode ficar nulo até vincular), `liberado`, datas, `detalhes`. É a fonte da verdade das vendas Hotmart.
- **Acesso** continua saindo por **`mwa_programas`** (21d/90d) e pelo status de sessão. RLS: cliente só enxerga o que é dela; escrita só pela função (service_role).
- `mwa_cupons` e `ResgateCupom` continuam como estão (fluxo 21d).

Não mexo em nada de Mercado Pago nesta fase.

---

## 10. Testes que serão realizados

1. **HOTTOK inválido** → webhook responde 401 e não grava nada.
2. **Idempotência** → mesmo evento enviado 2x cria só 1 registro / 1 liberação.
3. **Cada evento** (aprovada, completa, pendente, cancelada, expirada, reembolso, chargeback) → efeito correto na tabela certa.
4. **21d** → compra aprovada gera cupom, e-mail chega, resgate cria conta + programa.
5. **90d com e-mail igual** → libera sozinho; tela "Confirmando pagamento" vira "acesso ativo".
6. **90d com e-mail diferente** → botão "Já paguei", fluxo de vínculo por outro e-mail funciona e não deixa vincular 2x.
7. **Sessão** → registra, te notifica, confirma para a cliente, mostra "Sessão adquirida" + instruções + suporte.
8. **Reembolso/chargeback** → acesso é bloqueado.
9. Tudo primeiro com o **webhook de teste da Hotmart** (sandbox), antes de ligar em produção.

---

## 11. Ações que dependem de você

**Decisões (me confirmar):**
- [ ] 3 produtos separados na Hotmart? (recomendo sim)
- [ ] Agendamento da sessão: **Opção A (agenda nativa Hotmart)** ou **B (manual via suporte)**?
- [ ] Reembolso em análise (`PURCHASE_PROTEST`): bloquear na hora ou só marcar? (recomendo só marcar)
- [ ] Exigir código de confirmação por e-mail no vínculo de e-mail diferente? (recomendo sim)

**Dados para me enviar:**
- [ ] `product.id` e `offer.code` dos 3 produtos + links de checkout
- [ ] HOTTOK do webhook
- [ ] Chave do serviço de e-mail (Resend/SendGrid)
- [ ] WhatsApp e e-mail de suporte
- [ ] Seu e-mail/WhatsApp de admin (notificação de venda)

**No painel (você faz):**
- [ ] Cadastrar os 3 produtos e configurar o Webhook 2.0 apontando para a Edge Function
- [ ] Desligar entrega de conteúdo pela Hotmart nos 3 produtos

---

## 12. Mercado Pago — plano de desativação (só depois da sua autorização)

Seguindo sua instrução, **nada de MP é removido agora**. Ordem:
1. **Documentar o que existe** (feito abaixo).
2. **Confirmar que nada depende do MP** no fluxo Hotmart (o fluxo novo não usa MP).
3. **Implementar e testar o Hotmart completo.**
4. **Preparar plano de remoção** (arquivos e função a apagar).
5. **Pedir sua autorização** antes de remover qualquer coisa.

### O que existe hoje de Mercado Pago
- `src/components/upgrade/BotaoPagamento.jsx` e `CardUpgrade.jsx` — botão que abre o Checkout Pro do MP.
- `App.jsx` — lê `?pagamento=` da URL ao voltar do checkout (⚠️ é exatamente o padrão "liberar pelo redirect" que vamos abandonar).
- Edge Function `mwa-mp-preferencia` (cria a preferência de pagamento) — **ainda não existe no projeto novo**.
- Tabela `mwa_pagamentos` com colunas `mp_*`.
- `src/lib/hotmart-webhook.js` — código antigo, roda no navegador, usa colunas inexistentes (`user_email`, `programa_tipo`). **Está quebrado e inseguro; será substituído pela Edge Function** e removido no plano.

Na migração, os botões de 90d e sessão passam a apontar para o **checkout da Hotmart** em vez do MP.

---

## 13. Upsell/order bump do Programa de 90 Dias no checkout da Jornada de 30 Dias

Além do upgrade in-app já documentado nas seções 1 e 5.3 (botão dentro do MWA, cliente já
logada, checkout separado), o funil Hotmart passa a oferecer também um **upsell/order
bump do "MWA | Programa de 90 Dias" diretamente no checkout da Jornada de 30 Dias** —
ainda no momento da compra de entrada, antes de a cliente criar conta no MWA.

- **Condição:** oferta especial exclusiva para quem está comprando a Jornada de 30 Dias
  naquele momento ("condição especial para alunas"), sem linguagem de urgência ou
  promoção apelativa (sem contagem regressiva, sem "últimas vagas", sem pressão de tempo).
- **Onde é configurado:** inteiramente no **painel da Hotmart** (recurso nativo de
  order bump / upsell de checkout da própria Hotmart), associado ao produto "21 dias"
  (produto de entrada, ver seção 1 e 3 — nome comercial atual "Jornada de 30 Dias").
  Não requer código novo no MWA nem mudança nas Edge Functions descritas nas seções 2–7.
- **Fluxo de liberação:** segue exatamente o mesmo caminho já documentado para o Programa
  de 90 Dias comprado depois (seção 5.3) — webhook `PURCHASE_APPROVED` cria o registro em
  `mwa_programas` (tipo `90d`) assim que a conta é criada/vinculada via cupom do 21d
  (seção 5.2). Se a compra do bump vier no mesmo pedido do produto de entrada, o webhook
  pode receber os dois eventos (produto principal + order bump) e deve processar cada um
  pelo seu próprio `product.id`, mantendo a idempotência já descrita na seção 5.1.
- **O que não muda:** o upgrade in-app do Programa de 90 Dias (botão dentro do MWA para
  quem já está logada, seção 1 item 2 e seção 5.3) continua existindo em paralelo — o
  order bump é uma **oportunidade adicional** de venda no momento do checkout de entrada,
  não uma substituição do upgrade in-app.
