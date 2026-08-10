# Modo Recomeçar — Design

## Contexto e problema

Hoje, quando a pessoa fica alguns dias sem abrir o MWA, a única coisa que o
app "percebe" é a quebra do streak (`mwa_game.sequencia_dias` volta a 1 na
próxima abertura, via `registrarAcessoDiario` em [game.js](../../../src/lib/game.js)).
Não existe nenhum acolhimento nesse momento — a pessoa só nota que perdeu a
sequência, o que reforça a sensação de fracasso e aumenta o risco de
desistência definitiva.

Esta spec vem de um feedback externo sobre o produto (ver conversa de
2026-08-09): o maior diferencial do MWA não é ter mais funcionalidades, e sim
fazer a cliente sentir que o app "percebe" seu momento. O Modo Recomeçar foi
escolhido como primeira frente por ter o menor custo técnico (reaproveita
dado que já existe) com alto impacto emocional.

## Objetivo

Quando a pessoa volta ao app após 2+ dias sem acesso, mostrar um modal de
acolhimento — sem culpa, sem exibir a sequência perdida — oferecendo 3
caminhos de retomada, antes de seguir para o uso normal do app.

## Modelo de dados

### `mwa_game` (alteração)

Nova coluna:

| coluna | tipo | notas |
|---|---|---|
| `recomecar_pendente` | boolean | default `false`. `true` enquanto o Modo Recomeçar está aguardando resposta da pessoa. |

### `mwa_game_eventos` (uso existente, sem alteração de schema)

Ao escolher uma opção, grava um evento para histórico (sem crédito de
sementes):

- `tipo`: `'modo_recomecar'`
- `ref`: data de hoje (ISO)
- `sementes`: `0`

A opção escolhida (`calma` / `dias_dificeis` / `reorganizar`) fica registrada
em uma coluna adicional simples do mesmo insert, ou embutida no valor de
`tipo` (ex.: `modo_recomecar:calma`) — detalhe de implementação, sem impacto
no restante do design.

## Gatilho

`registrarAcessoDiario` (em `game.js`) já roda uma vez por sessão quando o
app carrega, e atualiza `ultimo_dia_acesso` para hoje. Isso acontece **antes**
de qualquer UI ser decidida — se basearmos o gatilho apenas nesse campo após
a atualização, o gap desaparece na primeira leitura e o modal nunca teria
como reaparecer numa segunda abertura no mesmo dia.

Por isso o fluxo passa a ser:

1. Ao carregar o `game` do usuário (`carregarGame`), **antes** de chamar
   `registrarAcessoDiario`, calcular o gap em dias entre o `ultimo_dia_acesso`
   antigo e hoje.
2. Se gap ≥ 2 **e** `recomecar_pendente` ainda não é `true`: persistir
   `recomecar_pendente = true` em `mwa_game`.
3. Chamar `registrarAcessoDiario` normalmente — streak e bônus de sementes
   continuam funcionando exatamente como hoje, sem nenhuma alteração. Os dois
   fluxos (streak e Modo Recomeçar) são independentes.
4. O modal é exibido sempre que `game.recomecar_pendente === true`, em
   qualquer abertura do app, até a pessoa escolher uma das 3 opções — porque
   o flag está persistido no banco, sobrevive a reload de página.
5. Ao escolher uma opção: grava o evento em `mwa_game_eventos` e atualiza
   `recomecar_pendente = false`.
6. Fechar no X sem escolher: fecha o modal localmente, mas
   `recomecar_pendente` continua `true` no banco → reaparece na próxima
   abertura do app.

## Fluxo e UI

Novo componente `ModoRecomecar.jsx` em `src/components/game/`, seguindo o
mesmo padrão de modal em tela cheia do `ConclusaoDia.jsx` (foco a11y ao
abrir, fecha com Esc ou X, renderizado condicionalmente a partir do
`AppContext`).

Conteúdo:

1. **Tela inicial do modal** — título de acolhimento, sem menção a dias
   perdidos ou sequência quebrada:

   > "Você não perdeu tudo o que construiu. Vamos recomeçar de onde
   > estamos?"

   Três botões, um por opção:
   - "Quero voltar com calma"
   - "Tive dias difíceis"
   - "Preciso reorganizar minha rotina"

2. **Tela de resposta** (troca o conteúdo do mesmo modal, não abre nova
   tela) — mensagem curta específica da escolha + botão único "Ir para o
   Hoje":

   | opção | mensagem |
   |---|---|
   | Quero voltar com calma | "Sem pressa. Vamos retomar no seu tempo — um passo simples hoje já é o suficiente." |
   | Tive dias difíceis | "Dias difíceis acontecem, e isso não apaga o que você já construiu. Hoje, cuide de você primeiro." |
   | Preciso reorganizar minha rotina | "Faz sentido. Que tal começar só registrando uma refeição hoje, sem se cobrar pelo resto?" |

Nenhuma dessas respostas cria uma "missão" nova no banco — é só mensagem +
botão. Os textos ficam em uma constante no próprio componente, fáceis de
editar depois sem tocar em lógica.

Nenhuma tela existente muda (Hoje, Progresso, etc.) além de passar a
renderizar esse modal condicionalmente, no mesmo nível em que `ConclusaoDia`
já é renderizado hoje.

## Fora de escopo

- Qualquer "missão do dia" gerada dinamicamente a partir da escolha (decisão
  explícita: resposta é só acolhimento, não uma nova tarefa rastreada).
- Configurabilidade do limiar de 2 dias via admin/UI — fica como constante no
  código.
- As outras ideias do feedback original (resumo semanal, cápsula do tempo,
  mensagens em vídeo da Wanessa, "me ajude com este alimento") — cada uma
  vira sua própria spec quando for a vez de desenhá-la.

## Testes

- `registrarAcessoDiario` continua coberto pelos testes existentes de
  streak — nenhuma alteração de comportamento ali.
- Novo teste unitário para o cálculo de gap (2+ dias → `recomecar_pendente`
  vira `true`; gap de 0 ou 1 dia → não altera).
- Teste do componente `ModoRecomecar`: renderiza as 3 opções, troca para a
  tela de resposta correta ao clicar em cada uma, chama o callback de
  fechamento/atualização ao clicar em "Ir para o Hoje".
