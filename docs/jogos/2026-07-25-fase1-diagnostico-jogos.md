# Fase 1 — Diagnóstico dos Jogos do MWA

Data: 2026-07-25 · Branch: security/correcoes-criticas · Nenhum código foi alterado nesta fase.

## 1. Inventário completo

### Jogos (todos em `src/components/game/`, abertos como modais na aba Ferramentas)

| # | Jogo | Arquivo | Mecânica | Recompensa | Liberação |
|---|------|---------|----------|------------|-----------|
| 1 | Jogo da Colheita | JogoColheita.jsx (269 l.) | Match-3 de frutas (emoji), 20 jogadas, meta 300 pts | +10 🌱/dia | Dia 1 |
| 2 | Jogo das Escolhas | JogoEscolhas.jsx (249 l.) | Avatar apanha comida "saudável" e desvia de "besteiras" caindo | +10 🌱/dia | Dia 4 |
| 3 | Jogo do Treino | JogoTreino.jsx (190 l.) | Whack-a-mole: tocar no exercício que acende (40 s) | +10 🌱/dia | Dia 7 |
| 4 | Jogo da Poda | JogoPoda.jsx (238 l.) | Whack-a-mole: tocar só nos hábitos "ruins" | +10 🌱/dia | Dia 10 |
| 5 | Jogo do Plantio | JogoPlantio.jsx (522 l.) | Quiz fixo: 16 perguntas, 8 pilares, planta cresce a cada acerto | +10 🌱 só com 16/16 | Dia 13 |
| 6 | Restaurante Saudável | JogoRestaurante.jsx (360 l.) | Chef monta prato p/ 5 clientes escolhendo 1 opção "saudável" por etapa | +10 🌱/dia | Dia 16 |
| 7 | Jardim de Afirmações | JogoMente.jsx (147 l.) | Virar 8 cartas e ler afirmações positivas (sem desafio) | +15 🌱/dia | Dia 19 |

### Atividades relacionadas (não são jogos, mas fazem parte do ecossistema)

- **Lente da Consciência** (`LenteConsciencia.jsx`) — ferramenta reflexiva Pausar→Observar→Escolher. Boa qualidade, manter.
- **Reforçando Conceitos** (`ReforcandoConceitos.jsx` + `conceitosNutricionais.js`) — glossário nutricional bem escrito (densidade nutricional, déficit, macros...). Não é interativo.
- **Telas de conclusão** — ConclusaoDia, Conclusao30Dias, Conclusao90Dias, CertificadoConclusao.
- **Loja do Avatar** (`LojaAvatar.jsx` + `skins.js`) — 12 personagens, 10 fundos, 6 molduras compráveis com sementes.

### Infraestrutura de gamificação

- **Economia de Sementes 🌱** (`src/lib/game.js` + tabelas Supabase `mwa_game` e `mwa_game_eventos`): recompensas com deduplicação por `ref` única (impossível ganhar 2× no mesmo dia), bônus de sequência de dias (streak crescente 5→50), tabela de valores em `skins.js`.
- **Liberação gradual** (`jogosLiberacao.js`): 1 jogo novo a cada 3 dias.
- **Padrões técnicos**: React + Vite + Tailwind (paleta custom `verde/sage/creme/ouro`), modais com acessibilidade (Esc, foco, aria-live, progressbar), lazy-loading por jogo, i18n PT/EN via `IdiomaContext`, registro de prêmio via `AppContext.registrarJogo*()`.
- **Base de alimentos** (`src/data/alimentos.js` + extras + EUA, ~130 itens): valores por 100 g (base TACO/TBCA), com kcal, proteína, carboidrato, gordura, fibra e porção sugerida. **Já existe e já alimenta o diário alimentar.**

## 2. Análise jogo a jogo

### 1. Jogo da Colheita — casual, zero aprendizado
- **Funciona bem** tecnicamente (cascatas, gravidade, tabuleiro sem trincas iniciais).
- Não ensina nada de nutrição: frutas são apenas peças de match-3.
- Falha de jogabilidade: não detecta tabuleiro sem jogadas possíveis (pode travar a partida).
- **Veredito: manter como "jogo de pausa/relaxamento" (opcional) ou aposentar. Não conta como jogo educativo.**

### 2. Jogo das Escolhas — contradiz a filosofia do MWA
- Classificação binária: 🍩🍟🍔 = "besteira" (perde vida), 🍎🥦 = "saudável" (+pontos). É exatamente o modelo "bom vs. ruim" que o programa quer evitar.
- Reflexo puro, sem conteúdo. Tick de 50 ms com re-render constante (custo de bateria).
- **Veredito: substituir.**

### 3. Jogo do Treino — sem conteúdo educativo
- Whack-a-mole genérico; os emojis de exercício são decorativos.
- **Veredito: substituir (ou manter como minijogo casual, decisão da proprietária).**

### 4. Jogo da Poda — boa metáfora, execução rasa
- A metáfora "podar hábitos" é alinhada à marca, mas a mecânica é reflexo binário (📱 = ruim, 💧 = bom) sem contexto nem explicação.
- **Veredito: substituir; a metáfora pode ser reaproveitada na progressão visual.**

### 5. Jogo do Plantio — o único educativo, mas com problemas sérios
- **Único jogo com perguntas e respostas.** Estrutura de pilares é boa.
- Problemas:
  - Banco fixo de 16 perguntas — depois de 1 partida, vira memorização.
  - Errou → só "Ops! Tente novamente", sem explicação; o jogador clica por tentativa e erro até acertar. Não há aprendizado real.
  - Recompensa tudo-ou-nada (16/16) — na prática sempre se atinge por repetição forçada.
  - Conteúdo simplista/duvidoso: "2-3 litros de água" como regra, "melhor receita de shake", divisão de macros vaga, respostas "depende" tratadas como erradas (ex.: sono "depende do dia").
  - Texto EN desatualizado: "Grow your habits over 21 days" (o programa é 30+90; PT já diz 30).
- **Veredito: reformular profundamente → vira "Verdadeiro, Falso ou Depende" + banco de perguntas rotativo com explicações.**

### 6. Restaurante Saudável — o embrião do "Monte Seu Prato"
- Estrutura de montagem por categorias (proteína→vegetal→carbo→bebida) é o esqueleto certo.
- Problemas: cada opção é apenas `saudavel: true/false` (camarão empanado e croissant viram vilões absolutos); sem dados nutricionais, porções ou painel de macros; clientes-emoji e falas infantilizadas ("Capriche na saúde, minha filha!"); sem feedback educativo.
- **Veredito: substituir pelo Monte Seu Prato (aproveitando o fluxo de etapas e a tela de reação/estrelas).**

### 7. Jardim de Afirmações — não é um jogo
- Tocar 8 cartas garante +15 🌱 (a maior recompensa do app pelo menor esforço — desequilibra a economia).
- O conteúdo emocional é bom e está na voz da marca.
- **Veredito: reposicionar como "momento de cuidado" (fora da lista de jogos) e rever a recompensa.**

## 3. Problemas transversais

1. **Educativo**: 6 dos 7 jogos não ensinam nutrição. O único que tenta (Plantio) não explica as respostas. Nenhum jogo trabalha calorias, porções, fibras, saciedade, densidade calórica ou contexto — os temas centrais do brief.
2. **Modelo mental errado**: 3 jogos usam classificação binária "saudável vs. besteira", o oposto de "quantidade, frequência, composição e contexto importam".
3. **Visual**: tudo baseado em emoji; tom infantil (unicórnio, clientes-caricatura); inconsistências (fundo `bg-sage/70` no Plantio vs. `bg-verde/70` nos demais). Distante da identidade premium verde+dourado.
4. **Progressão**: sem níveis, sem dificuldade crescente, sem histórico de melhor pontuação, sem missões diárias. A única progressão é a liberação por calendário.
5. **Feedback**: nenhum jogo explica *por quê*. Sem análise final, sem sugestão de melhoria.
6. **Persistência**: só o evento de recompensa é salvo; pontuações, tentativas e evolução se perdem ao fechar o modal.
7. **Robustez**: chamadas `registrarJogo*()` sem tratamento de erro; `useEffect` de premiação com dependências incompletas; Colheita pode ficar sem jogadas válidas.

## 4. O que preservar (patrimônio real)

- Economia de Sementes com deduplicação (sólida) + streak + loja do avatar.
- Padrão de modal acessível, lazy-loading, i18n PT/EN.
- **Base de alimentos TACO/TBCA já existente** — fundação perfeita para o Monte Seu Prato (mesma fonte do diário = consistência entre jogo e vida real).
- Liberação gradual (conceito), metáfora de jardim/crescimento, glossário de conceitos, Lente da Consciência, telas de conclusão.
- Voz da marca dos textos de afirmações e conceitos.

## 5. Proposta inicial de nova arquitetura (para aprovação)

### Coleção "Jogos MWA" (substitui a lista atual)

| Jogo | Origem | Papel |
|------|--------|-------|
| **Monte Seu Prato** ⭐ | novo (aproveita fluxo do Restaurante + dados de `alimentos.js`) | Carro-chefe. Missões, painel nutricional em tempo real, avaliação multicritério, feedback educativo |
| **Verdadeiro, Falso ou Depende** | reformulação do Plantio | Banco rotativo de perguntas com explicação curta após cada resposta; metáfora da planta preservada |
| **Batalha da Saciedade** | novo | Duas refeições com calorias parecidas; qual tende a saciar mais e por quê |
| **Troca Inteligente** | novo | Refeição dada + missão (mais proteína, mais fibra, menos densidade calórica...); explica o impacto da troca |
| **Detetive dos Rótulos** | novo | Rótulos simulados; porção vs. embalagem, açúcar, sódio |
| **Desafio do Dia** | novo | Missão curta ligada ao conteúdo do dia da jornada |
| Jogo da Colheita | mantido (opcional) | "Pausa leve", sem promessa educativa — decisão pendente |
| Jardim de Afirmações | reposicionado | Momento de cuidado, fora da lista de jogos — decisão pendente |

Aposentados: Escolhas, Treino, Poda (mecânicas de reflexo sem aprendizado).

### Dados e pontuação
- `src/data/jogos/`: `ingredientes.js` (deriva de `alimentos.js`, com campo de fonte), `missoes.js`, `perguntas.js` (com explicação e referência).
- Avaliação do prato multicritério (adequação à missão, proteína, fibra, equilíbrio de macros, variedade, porções, saciedade estimada) → 0–3 estrelas, várias combinações válidas, feedback acolhedor com 1 sugestão de troca.
- Recompensa por participação + bônus por desempenho (fim do tudo-ou-nada); repetir sempre permitido.
- Persistência: reutilizar `mwa_game_eventos` com novos tipos. Para melhor pontuação/níveis será proposta 1 tabela nova (`mwa_jogos_progresso`) — detalhada antes de qualquer alteração, na Fase 2.

### Visual
- Cards premium verde+dourado, tipografia serifada dos títulos (padrão atual), microinterações discretas, estados de acerto/tentativa/conclusão, sem estética infantil. Ilustrações consistentes para ingredientes (a definir na Fase 2: emoji refinado vs. ícones SVG próprios).

## 6. Decisões pendentes da proprietária

1. Manter o Jogo da Colheita como "pausa leve" ou aposentar?
2. Jardim de Afirmações: virar momento diário fora dos jogos (com recompensa menor) ou manter como está?
3. Avatar/loja: manter skins atuais (unicórnio, panda...) ou evoluir para estética mais adulta?
4. Ilustrações dos ingredientes: emoji curado (rápido, leve) ou biblioteca de SVG própria (mais premium, mais trabalho)?
5. Aprovação da lista de jogos da nova arquitetura antes da Fase 2 (wireframes + estrutura de dados).
