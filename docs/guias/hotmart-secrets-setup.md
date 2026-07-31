# Hotmart — Secrets e próximos passos

## O que já está no ar (projeto novo, ref kfavxgrvikflzyzvcoyb)
- Tabelas `mwa_compras` e `mwa_hotmart_eventos` (com RLS e idempotência).
- Coluna `compra_id` em `mwa_programas` (liga acesso à compra, p/ bloqueio por reembolso).
- Edge Function **`hotmart-webhook`** (pública, protegida por HOTTOK, idempotente, 8 eventos).
- Edge Function **`hotmart-vincular`** (autenticada, compra 90d com e-mail diferente).
- Arquivo `src/lib/hotmart.js` (links de checkout + suporte — preencher).

> Enquanto o HOTTOK não estiver configurado, o webhook **rejeita tudo** (seguro por padrão).

## URL do webhook (cole na Hotmart)
`https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/hotmart-webhook`

## Secrets a cadastrar (Supabase → Edge Functions → Secrets)
| Secret | O que é |
|--------|---------|
| `HOTMART_HOTTOK` | token do webhook (Hotmart → Ferramentas → Webhook) — **obrigatório** |
| `HOTMART_PROD_21D` | product.id do Programa 21 dias |
| `HOTMART_PROD_90D` | product.id do Programa 90 dias |
| `HOTMART_PROD_SESSAO` | product.id da Sessão individual |
| `SITE_URL` | ex.: `https://metodomwa.com.br` |
| `RESEND_API_KEY` | (opcional) chave do serviço de e-mail Resend |
| `EMAIL_FROM` | remetente, ex.: `MWA <no-reply@metodomwa.com.br>` |
| `ADMIN_EMAIL` | seu e-mail p/ notificação de venda de sessão |
| `SUPPORT_EMAIL` | e-mail de suporte mostrado à cliente |
| `SUPPORT_WHATSAPP` | whatsapp de suporte |

## No arquivo src/lib/hotmart.js (front-end)
- `checkout.programa90d` e `checkout.sessao` → links de checkout da Hotmart
- `suporte.whatsapp` / `suporte.email` → contatos mostrados na tela da sessão

## Ainda falta (próxima etapa de implementação)
- Front-end: tela "Confirmando pagamento" (com polling + botão "Já paguei — verificar liberação"),
  trocar botões de 90d/sessão para abrir o checkout Hotmart, tela "Sessão adquirida" com suporte.
- Testar tudo com o webhook de teste da Hotmart (sandbox) antes de produção.
- (Recomendado antes do go-live) ligar confirmação por e-mail no vínculo de e-mail diferente.

## Mercado Pago
Intacto. Só será removido depois de testar o Hotmart e com sua autorização.
