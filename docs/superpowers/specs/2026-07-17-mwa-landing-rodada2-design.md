# MWA Landing — Rodada 2: Conversão e Medição (Design Doc)

**Data:** 2026-07-17
**Origem:** itens da auditoria de negócio (`Downloads/auditoria-mwa-banca-completa.md`) que cabem na landing, aprovados pela Wanessa. Complementa o redesign concluído em 2026-07-16 (spec `2026-07-16-mwa-landing-redesign-design.md`).

## Decisões aprovadas

| Área | Decisão |
|---|---|
| Captura de leads | **Quiz mini-diagnóstico** "Qual hábito está sabotando você?" — 5 perguntas, e-mail para ver o resultado (auditoria #5) |
| Analytics | **Meta Pixel + GA4** via variáveis de ambiente; eventos PageView, ViewContent, InitiateCheckout (clique no CTA), Lead (quiz) (auditoria 2.10) |
| Suporte visível | **WhatsApp, mesmo número do app** (reusar o de `src/components/layout/BotaoWhatsApp.jsx`) na seção da oferta e no FAQ (auditoria Parte 4, objeção 8) |
| Performance | **Code-splitting** (React.lazy) das seções abaixo da dobra para atacar o custo de hidratação — meta Lighthouse mobile ≥ 90 (pendência da rodada 1) |
| Tagline | Hero novo já no ar ("Transforme hábitos..."); entregar doc com as 3 variações prontas para enquete no Instagram (auditoria 2.3) |

## 1. Quiz mini-diagnóstico

- Nova seção na landing (entre Problema e História) + entrada pelo header ("Descubra seu perfil" discreto) — sem pop-up nem exit-intent agressivo (tom da marca).
- 5 perguntas de múltipla escolha sobre hábitos (beliscar, pular refeições, água, culpa/recomeço, rotina), escritas no tom MWA — sem terrorismo alimentar.
- Resultado: 1 de 3 perfis ("Sabotadora silenciosa" etc. — nomes a refinar na implementação com aprovação da Wanessa), com devolutiva acolhedora + ponte para a Jornada de 30 Dias.
- Captura: nome + e-mail antes de mostrar o resultado. Backend: **Netlify Forms** (zero dependência, já que o deploy é Netlify); respostas do quiz vão como campos ocultos (segmentação). Exportação/automação de e-mail (Brevo/MailerLite) fica para rodada futura — documentar o caminho.
- LGPD: checkbox de consentimento explícito no formulário + link para política de privacidade (nota: a política em si é item jurídico fora deste escopo — usar link placeholder documentado).

## 2. Meta Pixel + GA4

- IDs via `VITE_META_PIXEL_ID` e `VITE_GA4_ID` (arquivo `.env` + documentação de onde obter cada um); scripts só carregam se o ID existir.
- Eventos: `PageView` (load), `ViewContent` (seção oferta visível), `InitiateCheckout` (clique em qualquer CTA de compra), `Lead` (envio do quiz).
- `Purchase` depende do webhook Hotmart (server-side) — fica documentado como fora do escopo, com nota no `ARQUITETURA-HOTMART-MWA.md`.
- Carregamento não pode degradar o LCP (defer/async, após interação ou idle).

## 3. Suporte visível

- Linha na seção da oferta ("Dúvidas? Fale com a gente no WhatsApp") + item no FAQ com link direto `wa.me` — número reaproveitado do app.
- Sem widget flutuante na landing (polui a experiência premium).

## 4. Code-splitting

- `React.lazy` + `Suspense` para seções abaixo da dobra (Story, Method, AppShowcase, Benefits, About, Offer, FinalCta, Faq), mantendo Hero/TrustBar/Problem no bundle inicial.
- Fallback de altura reservada para não causar CLS.
- Meta: Lighthouse mobile Performance ≥ 90 e Accessibility ≥ 96 (não regredir). Se ainda < 90, reportar o platô com diagnóstico.

## 5. Doc de teste da tagline

- `docs/TESTE-TAGLINE-INSTAGRAM.md` com as 3 variações (A: original da Wanessa; B: frase + mecanismo — a que está no ar; C: negação aterrissada), roteiro de enquete de stories (2 rodadas A/B) e critério de decisão (CTR/respostas).

## Restrições (herdadas da rodada 1)

- Zero promessa de emagrecimento como resultado garantido; sem urgência apelativa; CRN presente; "Nutricionista" nunca adjacente a "20+ anos"; **nenhuma menção a Herbalife**; tokens/design system atuais; motion só transform/opacity; `prefers-reduced-motion`.

## Critérios de sucesso

- Quiz funcional capturando em Netlify Forms (testado com submissão real em deploy preview) e taxa de captura mensurável via evento `Lead`.
- Pixel/GA4 disparando os 4 eventos (verificável no debugger da Meta e DebugView do GA4) quando os IDs forem configurados.
- WhatsApp visível na oferta e FAQ.
- Lighthouse Performance ≥ 90 mobile (ou platô documentado), Accessibility ≥ 96.
- Build limpo; nenhuma regressão visual nas seções existentes.

## Fora do escopo

- Política de privacidade/termos (jurídico), sequência de e-mails, webhook Purchase, mudanças no app, campanhas pagas.
