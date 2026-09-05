# Corrida da Escolha — Design

## Contexto e problema

O app já tem uma coleção de jogos educativos em `src/components/game/`
(Monte Seu Prato, Verdadeiro/Falso/Depende, Troca Inteligente, Batalha da
Saciedade, Detetive dos Rótulos, Jogo da Colheita), registrados no hub
`Ferramentas.jsx`. Nenhum deles é um jogo de reflexo/ação — todos são
baseados em pergunta-resposta ou montagem estática.

Pedido: um jogo bonito e divertido em que o jogador "come" itens saudáveis
em tempo real, e no final vê quantas calorias veio de itens saudáveis vs.
não saudáveis — pra entender concretamente por que o total de calorias
subiu quando não desviou dos itens que não devia comer.

## Objetivo

Um corredor de 3 pistas (estilo lane-runner) ambientado numa trilha de
jardim/horta, onde o jogador desvia dos itens não saudáveis e pega os
saudáveis. Comer um item não saudável não acaba a partida — soma na
contagem de calorias "erradas", pra virar a lição do resumo final.

## Mecânica de jogo

- **Pistas:** 3 pistas paralelas, avatar do jogador (reaproveita
  `Avatar.jsx`/skins existentes de `LojaAvatar.jsx`) fixo perto da base da
  área de jogo.
- **Controles:** swipe esquerda/direita (touch), setas ←/→ (teclado), ou
  clique direto numa pista (mouse) — qualquer um muda o avatar pra aquela
  pista, com uma transição curta (CSS transform, sem física).
- **Itens:** aparecem no topo de uma pista aleatória e descem até a altura
  do avatar. Se colidem com o avatar na mesma pista:
  - **Saudável:** pequena animação de "+", soma `kcalSaudavel`.
  - **Não saudável:** leve flash/tremor no avatar (sem parar a corrida,
    sem perder vida), soma `kcalNaoSaudavel`.
  - Item que passa sem colisão: some sem penalidade.
- **Duração:** 35 segundos por partida.
- **Progressão de dificuldade:** intervalo entre spawns cai linearmente de
  ~1100ms (início) para ~550ms (fim); tempo de queda de cada item cai de
  ~2200ms para ~1400ms no mesmo intervalo — o jogo fica mais rápido e mais
  cheio de itens conforme os 35s avançam.
- **Sorteio de item:** 50% de chance saudável / 50% não saudável a cada
  spawn, evitando repetir a mesma pista duas vezes seguidas (mantém as 3
  pistas visualmente ocupadas).

## Conteúdo — itens do jogo

Novo arquivo `src/data/jogos/itensCorrida.js`, seguindo o padrão de
`ingredientes.js`: não duplica valores nutricionais, só referencia
`ALIMENTOS` (fonte única de verdade).

**Saudáveis** (por `alimentoId`, todos já ilustrados em
`IngredienteSvg.jsx` — reaproveitados sem custo de asset novo):
`banana`, `maca`, `morango`, `brocolis`, `cenoura`, `iogurte-natural`,
`ovo`, `aveia`, `batata-doce`, `salada-verde`.

**Não saudáveis** (resolvidos por `nome` exato dentro de `ALIMENTOS`, já
que vêm de `alimentosExtras.js` e não têm id estável entre edições do
arquivo): "Hambúrguer completo", "Pizza de muçarela", "Batata inglesa
frita", "Cachorro-quente completo", "Coxinha de frango", "Brigadeiro",
"Bolo de chocolate", "Sorvete de creme", "Refrigerante comum", "Biscoito
recheado".

Resolução por nome (não por índice) para não quebrar se alguém inserir uma
linha no meio de `alimentosExtras.js` no futuro:

```js
function porNome(nome) {
  const alimento = ALIMENTOS.find((a) => a.nome === nome)
  if (!alimento) throw new Error(`[corrida] alimento não encontrado: ${nome}`)
  return alimento
}
```

**Ilustrações novas:** `src/components/game/svg/ItemNaoSaudavelSvg.jsx` —
10 ícones flat, viewBox 48x48, mesma paleta MWA (`C.terracota`,
`C.vermelho`, `C.ouro`, `C.marrom` etc., já usados em `IngredienteSvg.jsx`)
— visualmente reconhecíveis como "besteira" (cores mais saturadas/quentes
que o padrão verde/creme dos itens saudáveis).

## Tela de resultado

Ao fim dos 35s (ou ao fechar a partida antes, se o jogador sair):

1. **Total de calorias** comido, com uma barra dividida em duas cores —
   verde-escuro `#052A1F` (saudável) e terracota `#B0563C` (não saudável),
   mesma linguagem de cor já definida no anel de calorias
   (`docs/superpowers/specs/2026-08-14-anel-calorias-design.md`).
2. **Comparação "com desvio perfeito vs. resultado real":**
   - `kcalReal = kcalSaudavel + kcalNaoSaudavel`
   - `kcalIdeal = kcalSaudavel` (o que teria comido se tivesse desviado de
     tudo que não era saudável)
   - Exibe os dois números lado a lado, com o excedente (`kcalReal -
     kcalIdeal`) destacado, ex.: "+280 kcal por não desviar de 3 itens"
     (a contagem de itens não saudáveis colididos).
3. **Lição curta** (estilo `ensinamento` de `missoes.js`), 2–3 variações
   por faixa de desempenho — reforça o hábito quando foi bem, explica sem
   culpa (no mesmo tom acolhedor do resto do app) que é assim que o
   excedente calórico se acumula sem perceber, quando foi mal.
4. **Estrelas (0–3)**, por % de calorias vindas de itens saudáveis:
   - ≥90% → 3 estrelas
   - ≥70% → 2 estrelas
   - ≥50% → 1 estrela
   - <50% → 0 estrelas
5. **"Seu recorde: X%"** (ver seção de progresso abaixo), mostrado tanto
   na tela inicial (antes de começar) quanto atualizado no resumo final.
6. Botão "Jogar de novo".

## Integração técnica

- **Componente:** `src/components/game/JogoCorridaEscolha.jsx` — shell
  próprio (`role="dialog"`, `aria-modal="true"`, fecha com Esc, foco ao
  abrir), no mesmo padrão de `JogoColheita.jsx`. Não usa `MolduraJogo`
  (feito para jogos de pergunta/resposta em rodada, não se aplica aqui).
- **Hub:** nova entrada em `JOGOS_NUTRICAO` (e traduções em `JOGOS_EN`) em
  `Ferramentas.jsx`, import lazy + bloco de montagem
  `{jogoAtivo === 'corrida-escolha' && <JogoCorridaEscolha onFechar={fecharJogo} />}`
  — mesmo padrão dos outros 4 jogos de rodada.
- **Recompensa diária:** nova função `registrarJogoCorrida()` em
  `AppContext.jsx`, no padrão exato dos outros jogos —
  `await premiar('jogo_corrida', hoje)`, +10 🌱 por partida concluída com
  50%+ das calorias vindas de itens saudáveis (mesmo corte da 1ª estrela),
  1x por dia. Chamada via `tentarRecompensa()` já existente — sem tabela
  nova.
- **Recorde (novo para este jogo):** ao contrário dos outros 4 jogos de
  rodada (que não persistem recorde), este jogo segue o padrão do Monte
  Seu Prato e usa `carregarProgressoJogo`/`salvarResultadoJogo`
  (`src/lib/jogosProgresso.js`, tabela `mwa_jogos_progresso` já existente,
  sem migração nova) com `jogoId = 'corrida-escolha'`, `missaoId = ''`
  (jogo único, sem sub-missões) e
  `resultado = { pontuacao: percentualSaudavel, estrelas }`. Carregado ao
  montar o componente pra mostrar "seu recorde" na tela inicial; salvo ao
  final de cada partida via `mesclarProgresso` (que já garante que o
  recorde nunca regride).

## Fora de escopo

- Qualquer mudança nos jogos existentes ou no `MolduraJogo`.
- Sistema de vidas/game over — não existe neste jogo por design.
- Ranking entre jogadores — só recorde pessoal.
- Web Push ou notificações — fora do pedido original.
- Novas categorias de alimento no banco — todos os itens usados já existem
  em `ALIMENTOS`.

## Testes

Sem harness de teste de componente React neste repositório (mesmo padrão
do resto do projeto) — verificação é `npm run build` limpo mais checagem
manual no navegador (demo `demo-prato`, porta 5199, e/ou app real):

- Trocar de pista via swipe, seta e clique — avatar responde nas 3 formas.
- Colidir com item saudável: soma em `kcalSaudavel`, sem interromper a
  corrida.
- Colidir com item não saudável: soma em `kcalNaoSaudavel`, avatar mostra
  feedback visual, corrida continua normalmente.
- Item sem colisão: some sem alterar nenhum total.
- Dificuldade aumenta perceptivelmente entre o início e o fim dos 35s.
- Resumo final: barra dividida corretamente, comparação `kcalIdeal` vs.
  `kcalReal` com o excedente certo, estrelas de acordo com o % saudável,
  recorde carregado/atualizado corretamente.
- Recompensa: +10 🌱 só na primeira partida do dia com 50%+ saudável;
  segunda partida no mesmo dia não duplica a recompensa (mesmo
  comportamento de `premiar` nos outros jogos).
- Fechar com Esc ou botão de fechar interrompe a partida sem travar o
  resto do app.
