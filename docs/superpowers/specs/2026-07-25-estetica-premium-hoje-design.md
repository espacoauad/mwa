# Estética Premium — Tela "Hoje" (Design)

Data: 2026-07-25
Status: Aprovado pela Wanessa

## Contexto

Fase 2 do projeto MWA (após conclusão da revisão de conteúdo dos 90 dias, ver
`docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`): elevar a
estética do app para transmitir mais qualidade premium. Como "melhorar a
estética" toca o app inteiro (onboarding, Hoje, dicas, informativos, progresso,
perfil, jogos, upgrade...), isso foi decomposto em sub-projetos — este é o
primeiro, focado na tela **Hoje** (`src/components/hoje/Hoje.jsx` e
subcomponentes), por ser a tela que a usuária vê todo dia.

## Direção visual escolhida: "Boutique Elevado"

De 3 direções apresentadas (mockups no companion visual), a Wanessa escolheu
uma evolução refinada da identidade visual atual — não uma ruptura. Mantém a
paleta (`verde` #344528, `sage` #879b55, `ouro` #d4af7a, `creme` #f5f1e8) e as
fontes (Poppins sans + Lora serif) já definidas em `src/index.css`. O ganho de
percepção premium vem de: mais respiro, glow dourado sutil, hierarquia
tipográfica mais clara, sombras em camadas — não de trocar cores ou layout.

## Escopo

**Dentro do escopo:**
- `src/components/hoje/Hoje.jsx` (header, banner de dia concluído, cards de
  dica/informativo/compartilhar, botão flutuante)
- `src/components/hoje/GraficoMacros.jsx` (anéis de macro)
- `src/components/hoje/AnelHidratacao.jsx` (anel de hidratação)
- `src/components/hoje/AnelMeta.jsx` e `SeuProgresso.jsx` (tratamento visual
  consistente com o resto)
- `src/index.css` (novos tokens de suporte visual)
- Nova dependência: `framer-motion`

**Fora do escopo (explicitamente):**
- Mudança de estrutura, ordem de seções ou conteúdo da tela Hoje — a Wanessa
  confirmou manter a mesma organização atual
- Qualquer outra tela do app (onboarding, dicas, informativos, progresso,
  perfil, jogos, upgrade) — ficam para sub-projetos futuros, com seu próprio
  spec
- Mudança de paleta de cores ou fontes
- Lógica de dados/cálculos (metas, totais, gamificação) — só JSX, classes e
  wrappers de animação

## 1. Fundação visual

- Novo token CSS `--color-ouro-glow` em `src/index.css` (dourado translúcido,
  ex. `rgba(212, 175, 122, 0.35)`) usado em `radial-gradient` atrás do header
  e de cards de destaque
- Sombras em duas camadas nos cards principais: a sombra difusa colorida já
  existente (`shadow-lg shadow-verde/10`) + uma sombra mais próxima/nítida
  por cima, para dar profundidade real
- Aumentar padding interno dos cards principais (`p-6`→`p-7`/`p-8`)
- Divisores finos dourados (`border-t border-ouro/20` ou equivalente,
  opacidade baixa) substituindo `border-cinza` retos em pontos-chave (ex:
  dentro do card de macros, separando calorias dos anéis)
- Barra de progresso do header passa de cor sólida (`bg-ouro`) para gradiente
  dourado (`from-ouro to-ouro-claro` ou similar)

## 2. Sistema de movimento

Instala `framer-motion`. Todas as animações respeitam
`prefers-reduced-motion` via hook `useReducedMotion()` do framer-motion — se
reduzido, os componentes montam direto no estado final (sem stagger, sem
draw-in, sem contagem), mantendo o padrão já usado no CSS puro do projeto
(`@media (prefers-reduced-motion: reduce)` em `src/index.css`).

- **Entrada da tela**: cards principais (macros, progresso, hidratação,
  resumo, dica/informativo) entram com fade + leve `translateY`, stagger de
  ~60-80ms entre eles (`staggerChildren` em um `motion.div` container)
- **Anéis de macro e hidratação**: o traço do anel (`stroke-dashoffset` ou
  `path`) anima do zero até o valor atual ao montar, e anima a diferença
  quando o valor muda (nova refeição/água registrada) — usar
  `animate` do framer-motion no atributo do SVG, ou `motion.circle`/
  `motion.path`
- **Números**: contagem numérica sobe suavemente até o valor real (ex.
  proteína 0→92g) — usar `useSpring`/`useTransform` do framer-motion sobre um
  `motion.span` de texto, ou um hook simples de contagem com
  `requestAnimationFrame`
- **Toque em cards/botões**: uniformizar a curva de easing dos
  `active:scale-95` já existentes via `whileTap={{ scale: 0.96 }}` do
  framer-motion, easing `ease-out`
- Durações curtas: 200-400ms para a maioria, `ease-out` em entradas,
  `ease-in-out` em mudanças de valor. Nada acima de 500ms.

## 3. Tratamento por componente

- **Header**: mantém fundo `bg-verde`; adiciona glow dourado radial sutil no
  canto superior direito (mockup A); número do dia (`Dia X de 90`) em serifa
  maior para reforçar hierarquia; barra de progresso com gradiente dourado
- **`GraficoMacros`**: mais respiro vertical; divisor dourado fino separando
  o bloco de calorias do bloco de anéis; anéis com draw-in animado; números
  de proteína/carboidrato/gordura com contagem animada
- **`SeuProgresso` / Resumo do dia**: mesma estrutura e dados, só tipografia e
  espaçamento refinados; itens da lista de resumo entram em stagger
- **`AnelHidratacao`**: anel ganha o mesmo tratamento de draw-in animado
  (hoje só tem `transition-all` CSS ao mudar valor, sem animação de entrada);
  botões +/-250ml com easing mais suave via `whileTap`
- **Cards de dica/informativo/compartilhar**: mantém o formato "banner
  clicável" atual; refina sombra (duas camadas); adiciona halo dourado sutil
  atrás do emoji/ícone; entrada em stagger junto com os outros cards
- **Botão flutuante ("+ Adicionar refeição")**: sombra mais rica em camadas;
  pequena animação de entrada (pop suave, `scale` de 0.8→1 com spring) na
  primeira renderização da tela

Nenhuma mudança de lógica, dados ou cálculos — apenas JSX, classes Tailwind e
wrappers `motion.*`.

## 4. Verificação

- `npm run build` deve passar sem erros
- Verificação visual no preview do navegador (login como usuária de teste):
  conferir entrada da tela, draw-in dos anéis, contagem de números, resposta
  ao toque nos cards
- Testar com `prefers-reduced-motion: reduce` ativado (DevTools) — confirmar
  que as animações são puladas mas o conteúdo final aparece correto e
  completo
- Testar em largura mobile (375px), já que o app é mobile-first (PWA)

## Decisões da Wanessa

1. Direção visual: **Boutique Elevado** (evolução refinada da identidade
   atual), entre 3 opções apresentadas via mockup
2. Nível de movimento: **mais expressivo** — vale instalar `framer-motion`
   (anéis animando, números contando, cards entrando em sequência)
3. Escopo estrutural: **não mexer na ordem/conteúdo** da tela Hoje — só
   elevar o visual
4. Design completo (fundação visual, sistema de movimento, tratamento por
   componente, verificação) aprovado seção por seção
