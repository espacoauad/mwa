# Editar Dias Passados — Design

## Contexto e problema

Hoje o app só permite ver e lançar refeições, água, exercícios e pesagens
do dia atual. Todas as buscas ao Supabase (`mwa_refeicoes`, `mwa_exercicios`,
`mwa_agua`) filtram por `.eq('data', hoje)`, onde `hoje` é a data real
calculada por `dataHojeISO()` (`AppContext.jsx:125`). As funções de escrita
(`obterOuCriarRefeicao`, `adicionarExercicio`, `adicionarAgua`) também
gravam `data: hoje` fixo. Não existe seletor de data em lugar nenhum do
app.

Na prática, se a pessoa esquece de lançar o almoço de ontem, ou quer
corrigir um exercício registrado errado num dia anterior, não há como —
mesmo os dados existindo no banco (as tabelas já são organizadas por
coluna `data`), o app nunca busca nem edita nada fora de "hoje".

O único ponto do app que já mostra histórico é `Progresso.jsx`, que lista
todas as pesagens passadas (`mwa_pesagens`, sem filtro de data) — mas
apenas como leitura, sem edição.

## Objetivo

Permitir que a pessoa navegue para qualquer dia entre o início do
programa e hoje, veja tudo que foi lançado naquele dia (refeições, água,
exercícios, pesagem) e edite ou lance retroativamente usando exatamente
os mesmos formulários que já existem para "hoje".

## Escopo

Refeições, água, exercícios e pesagens — as 4 telas onde há lançamento:
Hoje (água), Alimentação (refeições), Ferramentas (exercícios) e
Progresso (pesagens).

Fora de escopo: o anel de calorias com déficit de exercício (feature
relacionada, mas com spec própria).

## Arquitetura e estado

Novo estado em `AppContext`:

- `diaVisualizado` (string ISO, `data`) — inicializado com `hoje`.
- `estaVendoHoje` (derivado: `diaVisualizado === hoje`).
- `mudarDiaVisualizado(data)` — troca o dia visualizado.
- `voltarParaHoje()` — atalho para `mudarDiaVisualizado(hoje)`.

**Busca de dados:** hoje o carregamento inicial busca `mwa_refeicoes`,
`mwa_exercicios` e `mwa_agua` uma vez, filtrando por `hoje`. Passa a
existir um `useEffect` que reexecuta essas buscas (filtrando por
`diaVisualizado`) toda vez que `diaVisualizado` mudar. `mwa_pesagens`
continua sendo buscada por completo, sem filtro — nenhuma mudança de
fetch necessária ali, só passa a ser editável.

Os agregados hoje chamados `refeicoesHoje`/`exerciciosHoje`/`totaisHoje`
passam a refletir `diaVisualizado` em vez de `hoje` fixo (renomear ou não
é decisão de implementação).

**Funções de escrita** (`obterOuCriarRefeicao`, `adicionarExercicio`,
`adicionarAgua`) trocam `data: hoje` por `data: diaVisualizado`. Nenhum
formulário novo — os modais/telas de lançamento existentes passam a
gravar no dia selecionado.

**`diaAtual` não muda.** O número do dia do programa (que libera
jogos/dicas/conteúdo, calculado a partir da data real de hoje) continua
inteiramente independente de `diaVisualizado`. Esta feature não afeta
liberação de conteúdo.

**Guard contra fetch desatualizado:** ao trocar `diaVisualizado`
rapidamente (ex: tocar ‹ › várias vezes seguidas), respostas de fetches
antigos precisam ser ignoradas se a data já mudou de novo antes delas
chegarem — guard simples comparando a data solicitada no momento do fetch
com o `diaVisualizado` atual quando a resposta chega.

## Ponto de entrada

A tela Hoje já mostra a data por extenso no cabeçalho ("Quarta-feira, 12
de agosto"). Esse texto passa a ser tocável, abrindo o seletor de data.

As outras 3 telas (Alimentação, Ferramentas, Progresso) ganham o mesmo
cabeçalho de data tocável no topo, para manter consistência visual — hoje
elas não têm nenhum texto de data.

## Navegação de datas

Ao lado da data tocável, duas setas ‹ › avançam/retrocedem um dia por
vez. Tocar na própria data abre um calendário em grade (mês), para pular
direto a uma data distante.

**Limites:** navegação vai da `dataInicio` do programa até hoje,
inclusive. Dias fora desse intervalo ficam desabilitados no calendário e
as setas param de avançar/retroceder nesses limites (não é possível
lançar para o futuro).

**Sincronização global:** `diaVisualizado` é um único estado no
`AppContext`, compartilhado pelas 4 telas — escolher uma data em qualquer
uma delas atualiza as outras 3. Trocar de aba mantém a data selecionada.

**Indicador de dia passado:** quando `!estaVendoHoje`, uma faixa fixa no
topo das 4 telas mostra "Vendo: sáb, 8 de agosto" com um botão "Voltar
para hoje", para não haver confusão sobre qual dia está sendo editado.

## Pesagem editável

Em `Progresso.jsx`, cada item da lista de histórico (hoje somente
leitura, `Progresso.jsx:79-114`) passa a ser tocável, abrindo o
`ModalPesagem` já existente em modo edição: pré-preenchido com peso/foto
daquele registro, salvando `UPDATE` na linha existente em vez de
`INSERT`. Gráficos de progresso e Resumo Semanal, que já leem
reativamente de `mwa_pesagens`, refletem a edição automaticamente sem
lógica extra.

## Recompensas do jogo (sementes, estrela do dia)

As funções de escrita (`obterOuCriarRefeicao`/`adicionarItemRefeicao`,
`adicionarExercicio`, `adicionarAgua`, `adicionarPesagem`) chamam
`premiar(tipo, ref)` internamente, e `premiar` sempre marca
`tarefasHoje[tipo] = true` — mesmo que o lançamento seja de um dia
passado. Sem tratamento, editar um dia antigo marcaria a tarefa de
**hoje** como concluída por engano (possível disparo indevido da tela de
"dia concluído").

**Decisão:** lançamentos feitos com `diaVisualizado !== hoje` não geram
nenhuma recompensa — sem sementes, sem marcar tarefa, sem estrela do dia.
O sistema de recompensas continua se comportando exatamente como hoje
quando `diaVisualizado === hoje`; ao editar um dia passado, essas
chamadas de `premiar(...)` são simplesmente puladas.

## Casos extremos

- **Dia sem lançamentos:** ao visualizar um dia passado vazio, as telas
  mostram o estado vazio normal ("Nenhuma refeição registrada" etc.), mas
  os botões de adicionar continuam ativos — é possível lançar
  retroativamente, não é somente leitura.
- **Troca rápida de dia:** coberta pelo guard contra fetch desatualizado
  descrito acima.
- **Limites do calendário:** dias antes de `dataInicio` ou depois de hoje
  ficam desabilitados/acinzentados; sem estado de erro, apenas
  desabilitado.

## Fora de escopo

- Anel de calorias com déficit de exercício em cor diferente — feature
  relacionada, spec separada.
- Qualquer mudança em `diaAtual` ou nas regras de liberação de
  jogos/dicas/conteúdo.
- Histórico de água com múltiplos registros por dia — `mwa_agua` segue
  como um único total por dia (upsert), só passa a ser upsert por
  `diaVisualizado` em vez de `hoje` fixo.
- Tela ou rota nova — a feature usa os cabeçalhos das 4 telas existentes,
  sem navegação/roteamento novo.

## Testes

- `mudarDiaVisualizado`/`voltarParaHoje` e o guard contra fetch
  desatualizado (fetch com data B chega depois de já ter voltado para
  data A → resultado de B é descartado).
- Calendário desabilita corretamente datas antes de `dataInicio` e depois
  de hoje.
- `ModalPesagem` em modo edição faz `UPDATE` (não `INSERT`) e pré-popula
  os campos corretamente.
- `obterOuCriarRefeicao`, `adicionarExercicio`, `adicionarAgua` gravam
  com `data: diaVisualizado` (não mais `hoje` fixo) — ajustar
  testes existentes que assumiam `hoje` implícito, se houver.
- Verificação manual no navegador: navegar para um dia passado, lançar
  uma refeição nova nele, confirmar que ela aparece só naquele dia e não
  em "hoje"; editar uma pesagem antiga e confirmar que o gráfico de
  progresso atualiza.
