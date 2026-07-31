# MWA — Redesign Premium da Landing Page (Design Doc)

**Data:** 2026-07-16
**Escopo:** Reconstrução da landing standalone (`landingpage/`) como fonte oficial da marca, seguida do alinhamento da página `/vendas` do app (`src/components/vendas/LandingVendas.jsx`). Copy, sistema visual, motion, assets, performance e acessibilidade.

---

## 1. Decisões de escopo (aprovadas pela Wanessa)

| Decisão | Escolha |
|---|---|
| Alvo | Ambas as landings, unificando — standalone é a fonte oficial |
| Posicionamento | **Híbrido**: marca = My Wellness App (app/ecossistema como herói no hero); história da Wanessa (26 kg, 14 anos, 20+ anos, CRN) como autoridade forte |
| Imagens | Fotos reais da Wanessa (`branding/`) + mockups das telas desenhados em código |
| CTA | Botões ativos apontando para `CHECKOUT_URL` em `config.js` (placeholder configurável Hotmart) |
| Abordagem | Reconstrução sobre a estrutura validada + showcase interativo do app |
| **Produto de entrada** | **MWA \| Jornada de 30 Dias — R$ 97** (substitui a Jornada de 21 Dias em TODA a copy) |
| Upsell 90 dias | Além do upgrade in-app, passa a existir upsell/order bump no checkout Hotmart; a landing menciona a continuidade disponível já na compra |
| Lógica do app (21→30 dias) | **Fora do escopo.** Documentar o que o app precisará mudar (ofertas dia 3–7, conclusão dia 21, bloqueio dia 111 etc.) para tratativa futura |

### Conformidade regulatória (CFN)

- **CRN é obrigatório** na divulgação: Código de Ética do nutricionista (Res. CFN 599/2018, atualizada pela Res. CFN 856/2026) exige identificação com nome + número CRN em qualquer divulgação profissional. Manter "Wanessa Auad — Nutricionista — CRN-1/27939" no selo de autoridade e no footer.
- O código **veda ofertas/promoções como publicidade** do profissional: a condição especial dos 90 dias usa linguagem de "condição para alunas", sem countdown, sem urgência apelativa (alinhado ao Brand Book).

---

## 2. Sistema visual — "Editorial Wellness"

Sensação: revista premium de bem-estar que virou produto digital. Calmo, orgânico, caro. Nunca infoproduto.

### Cores

| Token | Valor | Uso |
|---|---|---|
| `verde` | `#2A3B1F` | Texto dominante, seções âncora (contraste AAA) |
| `verde-dark` | `#1C2614` | Seção dark (showcase do app, CTA final) |
| `sage` | `#879B55` | Progresso, checks, detalhes orgânicos |
| `ouro` | `#C9A55C` | Parcimônia: linhas, kickers, preço. Nunca blocos grandes |
| `off-white` | `#FAF7F0` | Fundo de seção (alterna com creme) |
| `creme` | `#F5F1E8` | Fundo de seção |

Ritmo da página = alternância clara/escura das seções, não cores gritantes. Uma seção dark onde o dourado brilha.

### Tipografia

- **Display serif: Fraunces** (Google Fonts) — headlines e frases-assinatura (itálico). Substitui Lora na landing.
- **Sans: Inter** — corpo de texto. Substitui Poppins na landing (Poppins permanece no app).
- Headlines `clamp(2.5rem → 4.5rem)`; kickers caps + letter-spacing dourados; corpo 16–18px, line-height generoso.
- `font-display: swap` + subset.

### Componentes

- Botões pill com sombra colorida verde suave; seta desliza no hover.
- Cards com borda 1px + fundo sutil (sem sombras pesadas).
- Divisores orgânicos entre seções (curvas suaves).
- Garantia como selo visual.

---

## 3. Estrutura e copy (12 seções)

Princípios: frases curtas; um kicker + uma ideia por seção; zero promessa milagrosa; "você" sempre; emagrecimento como consequência; os números reais (26 kg, 14 anos, 20+ anos, CRN) fazem o convencimento. Base textual: Brand Book (`docs/MWA-BrandBook-LandingPage-Copy.md`), adaptada para 30 dias e posicionamento híbrido.

1. **Header fixo** — logo + "Como funciona" + CTA compacto. Fundo blur ao scrollar.
2. **Hero** — kicker "MWA · My Wellness App"; headline **"Não é uma dieta. É uma nova forma de viver."**; sub com promessa concreta dos 30 dias com acompanhamento diário; CTA "Quero começar meus 30 dias"; selo CRN. Mockup do app + foto da Wanessa sutil.
3. **Barra de confiança** — 20+ anos · CRN-1/27939 · Garantia 7 dias · Pagamento único.
4. **O problema** — "Pare de recomeçar toda segunda-feira." Culpa não é força de vontade; é falta de método. Vira a chave para a solução.
5. **A história** — foto real + narrativa 26 kg / 14 anos. Destaque: **"O maior resultado não foi perder 26 kg. Foi aprender a permanecer."**
6. **O método (4 pilares)** — Mentalidade · Nutrição Inteligente · Rotina Sustentável · Acompanhamento.
7. **Showcase do app** (dark, interativo — ver §4).
8. **Imagine daqui a 30 dias** — benefícios emocionais + chips de resultado concreto.
9. **Wanessa (autoridade profissional)** — foto + credenciais + as 7 competências que a aluna aprende.
10. **Oferta** — ancoragem de valor → **R$ 97** → CTA → selo de garantia → continuidade de 90 dias disponível já no checkout (linguagem elegante) e depois no app.
11. **Decisão final + FAQ** — "Daqui a 30 dias você estará 30 dias mais velha. A diferença é a decisão de hoje." + accordion (8 perguntas, adaptadas para 30 dias).
12. **Footer** — marca, My Wellness Approach, CRN, copyright.

---

## 4. Motion e showcase interativo

### Princípios de motion

- **Hero orquestrado**: kicker → headline (stagger por palavra) → sub → CTA → mockup em ~1s.
- **Scroll-reveals**: fade + translate 16–24px, uma vez só, `IntersectionObserver` + CSS. Zero biblioteca de animação.
- **Números que contam**: 26 kg, 14 anos, 20+ anos animam ao entrar na tela.
- **Micro-interações**: CTA (seta desliza, sombra respira), cards com lift sutil, accordion animado.
- **`prefers-reduced-motion`** respeitado em tudo.
- Só `transform`/`opacity` (GPU).

### Showcase interativo (seção 7)

- Telefone central grande com moldura realista; navegação lateral de recursos (Acompanhe seu dia · Refeições · Progresso · Dica do dia · Macros · Exercícios · Jogos).
- Clique/toque troca a tela no telefone (fade + slide) e o texto descritivo acompanha.
- Mobile: carrossel com swipe + dots.
- Telas desenhadas em código (refinadas a partir dos mockups existentes na `/vendas`).
- Auto-avanço lento, pausa no hover/interação.
- Navegável por teclado, `aria` correto.

---

## 5. Assets

- Fotos: `branding/foto-wanessa-*.png` → WebP com `srcset`, tratamento premium (fundos orgânicos, molduras editoriais), lazy abaixo da dobra, alt reais.
- Logos: vetores de `branding/` (`mwa-nova-identidade.svg`, `mwa-simbolo-vetorial.svg`).
- Ícones: lucide-react, consistentes (sem mistura com emojis nas seções nobres).
- SEO/social: title/description, Open Graph com imagem de marca, favicon com logo novo.

---

## 6. Performance e acessibilidade

- Meta: LCP < 2,5s mobile.
- Fontes subset + swap; imagens WebP/srcset/lazy; animações GPU-only; sem libs de animação.
- Contraste AA/AAA; navegação por teclado completa; foco visível; `aria` em accordion e carrossel; `prefers-reduced-motion`.

---

## 7. Unificação da `/vendas` do app

Após a standalone pronta: reescrever `src/components/vendas/LandingVendas.jsx` com a mesma copy e sistema visual (adaptado aos tokens Tailwind do app em `src/index.css`). Uma mensagem, duas superfícies. Botões seguem a mesma regra de checkout.

---

## 8. Fora do escopo (documentar para depois)

- Alteração da lógica interna do app de 21 → 30 dias: janelas de oferta (dia 3–7), tela de conclusão (dia 21), textos diários, bloqueio dia 111, e docs relacionados (`ARQUITETURA-HOTMART-MWA.md`, `BLOQUEIO_ACESSO_DIA_111.md` etc.).
- Configuração do funil de upsell no painel Hotmart (plataforma externa).

---

## 9. Critérios de sucesso

- Página não parece template nem infoproduto; identidade própria perceptível.
- Toda a copy fala em 30 dias; nenhum resíduo de "21 dias".
- CRN presente (selo + footer); nenhuma linguagem de urgência apelativa.
- Showcase interativo funcional em desktop (clique) e mobile (swipe).
- Lighthouse: Performance e Acessibilidade ≥ 90 no mobile.
- `/vendas` do app com a mesma mensagem e visual da standalone.
