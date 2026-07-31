# Guia — Cadastrar os 3 produtos do MWA na Hotmart

Objetivo: criar os 3 produtos, configurar o webhook e coletar os dados que faltam
(3 `product.id`, 2 links de checkout e o HOTTOK). Conteúdo NÃO é entregue pela Hotmart.

---

## Parte 1 — Criar os 3 produtos

Faça 3 vezes (um para cada produto): **Produtos → Criar produto**.

| Produto | Nome sugerido | Formato | Tipo de cobrança | Preço |
|---------|---------------|---------|------------------|-------|
| 1 | MWA — Programa 21 dias | Cursos Online / Site de Membros | Pagamento único | (o seu) |
| 2 | MWA — Programa 90 dias | Cursos Online / Site de Membros | Pagamento único | (o seu) |
| 3 | MWA — Sessão individual online | Cursos Online / Site de Membros (ou Serviço) | Pagamento único | (o seu) |

> Na Hotmart todos entram pelo formato "Cursos Online, Site de Membros, Serviços de Assinatura".
> Como o agendamento da sessão será **manual pelo suporte**, não precisamos da agenda nativa — pode usar o mesmo formato dos outros.

Em cada produto, preencha o mínimo para publicar: nome, descrição curta, imagem e preço.

---

## Parte 2 — Desligar a entrega de conteúdo pela Hotmart

Como o conteúdo vive só no MWA, em cada produto:
1. Abra o produto → **Área de membros**.
2. No menu de três pontinhos, escolha **Trocar para área de membros externa**.
3. Não precisa preencher URL de integração — a liberação é feita pelo nosso webhook. (Se a Hotmart exigir uma URL, pode usar a do app; o que libera o acesso é o webhook, não essa tela.)

Isso evita que a Hotmart tente entregar conteúdo ou pedir login em outro lugar.

---

## Parte 3 — Pegar o `product.id` de cada produto

O `product.id` é o **número oficial** do produto. Você encontra:
- Na **URL** quando abre o produto no painel (aparece um número no endereço), ou
- Em **Dados gerais / Configurações** do produto.

Anote os 3 (vão nos secrets `HOTMART_PROD_21D`, `HOTMART_PROD_90D`, `HOTMART_PROD_SESSAO`).

---

## Parte 4 — Pegar os links de checkout (90d e sessão)

Para o **90 dias** e a **sessão** (que têm botão dentro do app):
1. No produto → **Checkout / Ofertas**.
2. Copie o **link de checkout** da oferta.

Anote os 2 links (vão no arquivo `src/lib/hotmart.js`).
O 21 dias é vendido pela landing page, então não precisa de link no app.

---

## Parte 5 — Configurar o Webhook (o mesmo para os 3 produtos)

1. Menu lateral → **Ferramentas → Ver todas → Webhook**.
2. **Criar/adicionar webhook.**
3. **URL:** `https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/hotmart-webhook`
4. **Versão:** 2.0.
5. **Eventos:** marque todos os de compra — aprovada, completa, pendente/aguardando, cancelada, expirada, reembolso, chargeback, e (se houver) protesto/disputa.
6. **Produtos:** associe os 3 produtos a este mesmo webhook.
7. Salve. Na tela do webhook aparece um **token de segurança (HOTTOK)** — copie. É o secret `HOTMART_HOTTOK`.

---

## Parte 6 — Me mandar os dados

Quando terminar, me manda:
- [ ] `product.id` do 21d, 90d e sessão
- [ ] link de checkout do 90d e da sessão
- [ ] HOTTOK do webhook

Com isso a gente cadastra os secrets, faz o teste pelo modo de teste da Hotmart e eu construo o front-end.

---

### Dica de teste (depois)
Na tela do Webhook a Hotmart tem um botão de **enviar evento de teste** — é o que usaremos para validar tudo antes de vender de verdade.
