# Auditoria do app MWA + página "Minha Evolução"

Data: 2026-07-21
Branch: security/correcoes-criticas

## Contexto

A landing page (`landingpage/`) já passou por auditoria de acessibilidade, motion
e escrita (ver commit `5ca2f3f` como referência de padrão de qualidade). O app
em si (`src/components/`) ainda não recebeu esse tratamento. Este spec cobre
duas frentes: (1) auditoria e upgrade do app existente, e (2) uma página nova,
"Minha Evolução", dentro do Perfil.

Regras de negócio relevantes:
- Jornada de 30 Dias (R$97, Hotmart) com upsell para 90 Dias.
- Pesagem a cada 15 dias (dias 15/30/45/60/75/90), com peso, fotos (frente,
  costas, lateral esq., lateral dir.) e medidas (cintura, quadril, peito),
  salvos em `mwa_pesagens` via `AppContext` (`adicionarPesagem`).
- Wanessa é nutricionista (CRN) — o app evita afirmações de saúde sem base
  (ver `docs/PACOTE-JURIDICO-MWA.md`).

## Parte 1 — Auditoria e upgrade do app existente

**Escopo:** todas as telas principais em `src/components/`: `hoje/`, `perfil/`,
`progresso/`, `comunidade/`, `ferramentas/`, onboarding, e os jogos de
gamificação em `game/`.

**Frameworks de auditoria** (mesmos da landing):
1. Acessibilidade — Web Interface Guidelines da Vercel (contraste, foco,
   labels, semântica, tamanho de alvo de toque).
2. Motion — framework de 3 lentes (respeito a `prefers-reduced-motion`,
   propósito da animação, timing/easing).
3. Escrita — clareza, tom e consistência em PT-BR, adaptando as diretrizes de
   escrita da Vercel.

**Ação:** corrigir achados críticos e importantes inline, seguindo o mesmo
padrão de rigor do commit `5ca2f3f`. Achados menores/cosméticos podem ser
listados mas não necessariamente corrigidos nesta rodada.

**Performance:** o build atual gera um chunk principal de ~998KB minificado
(aviso do Vite). Aplicar `React.lazy` + `Suspense` para:
- Telas de jogos de gamificação (`src/components/game/`)
- Telas de onboarding

Avaliar otimização de imagens onde fizer sentido (ex.: fotos de exemplo,
ilustrações estáticas), sem introduzir nova infraestrutura de build.

**Verificação:** subir o dev server e testar cada tela alterada no navegador
(não apenas `npm run build`), incluindo teste de `prefers-reduced-motion` e
navegação por teclado nos pontos críticos.

**Commits:** avisar antes de qualquer commit desta parte.

## Parte 2 — Página "Minha Evolução"

Acessível a partir do Perfil (`src/components/perfil/`).

### Decisões já tomadas (não re-abrir)

- **Percentual de gordura:** fora de escopo. Não implementar cálculo/estimativa
  agora (risco de compliance com o CRN, dado insuficiente para precisão
  aceitável). Página mostra apenas peso e medidas.
- **Avatar:** figura tipo manequim simplificado e realista (SVG desenhado à
  mão), não personagem cartoon e não silhueta abstrata. Convive com as fotos
  reais de pesagem — não as substitui.
- **Biblioteca de gráficos:** nenhuma nova dependência. Gráficos em SVG feito
  à mão, dado o aviso já existente de chunk grande no build.

### Estrutura da página

1. **Estado atual** (topo): peso mais recente, medidas mais recentes
   (cintura/quadril/peito), e o avatar-manequim no seu estado atual.
2. **Gráficos de evolução**: componente `GraficoLinha.jsx` reutilizável (SVG),
   usado para:
   - Peso ao longo dos marcos (dias 15/30/45/60/75/90, conforme dados reais
     existentes em `pesagens`)
   - Medidas ao longo dos marcos (cintura, quadril, peito — pode ser 3 linhas
     no mesmo gráfico ou 3 gráficos pequenos, decidir na implementação
     conforme legibilidade)
3. **Timeline avatar + fotos**: por marco atingido, mostra o avatar-manequim
   daquele momento lado a lado com as fotos reais de pesagem daquele marco
   (comparação ou timeline deslizável).

### Avatar-manequim — comportamento

- **Proporção cintura/quadril**: recalculada a cada marco a partir das
  medidas reais registradas naquela pesagem (`medidas.cintura`,
  `medidas.quadril`). Sem medida registrada → usa o valor do marco anterior
  disponível (não quebra o gráfico/avatar por dado faltante).
- **Postura/energia**: pequena progressão visual (mais ereta, braços mais
  abertos) conforme os marcos avançam — reforço motivacional, não literal.
- **Cor/acessório de conquista**: cada marco atingido desbloqueia uma
  variação de cor ou pequeno acessório visual no avatar, como reforço
  positivo (independente do sistema de skins de `LojaAvatar.jsx` — sistemas
  não se misturam).
- Sem dados suficientes (ex.: só uma pesagem registrada), mostra o estado
  atual sem timeline comparativa (não força uma "evolução" de um ponto só).

### Dados e integração

- Fonte: array `pesagens` do `AppContext` (já populado via
  `adicionarPesagem` → tabela `mwa_pesagens`).
- Nenhuma migração de banco necessária — os campos já existem
  (peso, fotos, medidas).
- Nova rota/tela: componente novo em `src/components/perfil/` (nome sugerido:
  `MinhaEvolucao.jsx`), navegável a partir da tela de Perfil.

### Verificação

Testar no navegador com dados reais de `mwa_pesagens` (ou dados de teste
equivalentes cobrindo pelo menos 3 marcos), incluindo o caso de dado faltante
(medida não preenchida em um marco) e o caso de uma única pesagem (sem
timeline comparativa ainda).

## Fora de escopo (explícito)

- Percentual de gordura (calculado ou manual) — não implementar nesta rodada.
- Qualquer mudança na cadência de pesagem (já fixada em 15 dias em trabalho
  anterior).
- Novas dependências de terceiros (gráficos, animação) além do que já está
  instalado.
