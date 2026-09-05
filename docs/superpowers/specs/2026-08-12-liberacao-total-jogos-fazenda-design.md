# Liberação total: jogos e fazenda desde o dia 1

## Contexto

Hoje o MWA libera jogos e canteiros da fazenda de forma gradual, por dia do
programa:

- **Jogos** (`src/utils/jogosLiberacao.js`): 6 jogos liberam em dias
  diferentes (colheita dia 1, prato dia 2, vf dia 5, troca dia 8, saciedade
  dia 11, rótulos dia 14). Antes do dia, o card aparece com cadeado e
  `disabled`.
- **Fazenda** (`src/utils/farm/crescimento.js`): 8 canteiros (um por pilar do
  método MWA — alimentação, hidratação, movimento, sono, planejamento,
  macros, digestão, calorias) liberam a cada 4 dias
  (`INTERVALO_LIBERACAO_DIAS`). Antes do dia de liberação, o canteiro aparece
  com cadeado e não pode ser "cuidado". Depois de liberado, o canteiro cresce
  em 4 estágios (semente → broto → floração → plena) automaticamente com a
  passagem dos dias — a cada 20 dias avança um estágio, **sem depender de a
  pessoa interagir com ele**.

A proprietária quer duas mudanças:

1. Jogos e canteiros acessíveis desde o primeiro dia — sem espera, sem
   cadeado.
2. O crescimento de cada canteiro deixa de ser automático por dia e passa a
   depender de a pessoa efetivamente cuidar dele.

Fica de fora desta mudança a trava de desempenho dentro do Monte Seu Prato
(`src/utils/jogos/progresso.js`, `nivelLiberado`): um nível de missão só abre
depois de 2+ estrelas numa missão do nível anterior. Essa trava recompensa
desempenho dentro do jogo, não é uma espera por dias — decisão explícita da
proprietária de mantê-la como está.

Também fica de fora `decoracoesLiberadas` (marcos de decoração da fazenda por
dia, em `src/data/farm/decoracoes.js`): hoje esse cálculo já existe em
`resumoFazenda`, mas **nenhum componente renderiza `resumo.decoracoes`** — é
código morto pré-existente, não relacionado ao pedido. Não será tocado.

## O que muda

### 1. Jogos — `src/utils/jogosLiberacao.js`

`jogoLiberado` passa a sempre retornar `true`. `DIAS_LIBERACAO` e
`diaLiberacaoJogo` são removidos — não sobra nenhum uso depois que o gate cai.
`ORDEM_JOGOS` continua (define a ordem de exibição dos cards, não a
liberação).

### 2. Jogos — `src/components/ferramentas/Ferramentas.jsx`

`CardJogo` perde o ramo "bloqueado": sem cadeado 🔒, sem `disabled`, sem o
texto "Libera no dia X do seu programa". O card sempre renderiza no estado
liberado (emoji do jogo, título, descrição, `onClick` sempre ativo). O import
de `diaLiberacaoJogo`/`jogoLiberado` sai junto.

### 3. Fazenda — acesso sempre liberado

Os 8 canteiros ficam acessíveis (sem cadeado, sem `disabled`) desde o dia 1.
Isso torna obsoleto todo o conceito de "dia de liberação por canteiro"
(`INTERVALO_LIBERACAO_DIAS`, `diaLiberacaoPilar`, `pilarLiberado`,
`indiceDoPilar`) — removido inteiramente de `crescimento.js`, não só
desativado. O campo `liberado` some de `resumoFazenda`.

### 4. Fazenda — crescimento passa a depender de cuidar

Novo mecanismo, substituindo o crescimento automático por dia:

- Cada vez que a pessoa cuida de um canteiro (uma vez por dia, por canteiro —
  a trava de "já cuidou hoje" que já existe continua valendo), o app soma 1
  a um **contador cumulativo de cuidados daquele canteiro**, persistido em
  `localStorage` sob a chave `mwa-farm-contagens` (objeto `{ pilarId:
  contagem }`, lido uma vez no mount de `MwaFarm.jsx`).
- O estágio do canteiro passa a ser `Math.min(3, Math.floor(contagem / 10))`:
  semente em 0 cuidados, broto em 10, floração em 20, plena floração em 30.
  `estagioDoPilar(pilarId, contagens)` recebe o mapa de contagens em vez de
  `diaAtual` — continua uma função pura (quem lê/persiste o `localStorage` é
  `MwaFarm.jsx`, como já acontece hoje com o registro de cuidados do dia).
- Dias sem cuidar não penalizam: o contador nunca diminui, o canteiro só fica
  parado no estágio atual até a próxima vez que a pessoa cuidar dele. Não há
  murcha nem regressão.
- `resumoFazenda` passa a receber `(contagens, diaAtual)` — `diaAtual`
  continua necessário só para `decoracoesLiberadas` (fora de escopo, mantido
  como está).

```js
// crescimento.js — depois
const CUIDADOS_POR_ESTAGIO = 10
const ESTAGIO_MAXIMO = 3 // 0=semente, 1=broto, 2=floração, 3=plena

export function estagioDoPilar(pilarId, contagens) {
  const contagem = contagens?.[pilarId] ?? 0
  return Math.min(ESTAGIO_MAXIMO, Math.floor(contagem / CUIDADOS_POR_ESTAGIO))
}

export function resumoFazenda(contagens, diaAtual) {
  return {
    pilares: PILARES.map((pilar) => ({
      ...pilar,
      estagio: estagioDoPilar(pilar.id, contagens),
    })),
    decoracoes: decoracoesLiberadas(diaAtual),
  }
}
```

### 5. Fazenda — UI (`src/components/game/MwaFarm.jsx`)

- Novo estado `contagens` (lido de `localStorage['mwa-farm-contagens']` no
  mount, igual ao padrão já usado para `cuidados`).
- `abrirPilar`: remove o ramo `if (!pilar.liberado)` inteiro (cadeado +
  "Este canteiro desperta no dia X") — sempre abre direto o estado liberado.
- `cuidar`: remove a checagem `!pilar?.liberado` (não existe mais). Ao
  confirmar o cuidado, incrementa `contagens[pilar.id]` em 1, salva no
  `localStorage`, e recalcula o estágio do canteiro selecionado.
- Ícone do canteiro selecionado: remove o ramo `selecionado.bloqueado ?
  <LockKeyhole /> : ...` — vira só `selecionado.animal ? <Sparkles /> :
  <PlantaFazenda estagio={...} .../>`. Import de `LockKeyhole` sai (não
  sobra outro uso).
- `aria-label` do canteiro: remove a variação "bloqueado" — sempre usa o
  título do hábito.
- `todosCuidados`: hoje só exige cuidar dos canteiros já liberados; passa a
  exigir cuidar dos 8 canteiros (todos sempre disponíveis) —
  `resumo.pilares.length > 0 && resumo.pilares.every((p) =>
  cuidados.includes(p.id))`.
- **Lembrete de cuidado**: quando `!todosCuidados` (ainda falta cuidar de
  algum canteiro hoje), mostra uma linha curta abaixo da mensagem do dia:
  "Cuide dos canteiros para vê-los florescer." (EN: "Care for your plots to
  watch them bloom."). Some assim que `todosCuidados` vira `true` — a
  mensagem "toda a sua fazenda foi cuidada hoje" já cobre esse caso, sem
  repetir o lembrete.

O restante da tela (barra de progresso do programa, fases do cenário de
fundo `FASES_FARM`/`indiceFase`, mensagens motivacionais por marco de dia em
`mensagemDoDia`) não muda — são baseadas no dia do programa como um sistema
visual à parte do crescimento por canteiro, e continuam como estão.

### 6. Monte Seu Prato

Nenhuma mudança. `nivelLiberado` continua gateando níveis de missão por
desempenho (2+ estrelas), por decisão explícita da proprietária.

## Testes

`src/utils/farm/crescimento.test.js` precisa ser reescrito quase por
completo, já que a API muda de assinatura:

- Testes de `pilarLiberado`/`diaLiberacaoPilar` são removidos (funções não
  existem mais).
- Novos testes para `estagioDoPilar(pilarId, contagens)`: semente com 0 ou
  poucos cuidados, broto aos 10, floração aos 20, plena aos 30, satura em 3
  mesmo com contagens muito altas, contagem ausente/`undefined` cai em
  semente (0) sem quebrar.
- `resumoFazenda(contagens, diaAtual)`: agrega os 8 pilares com `estagio`
  (sem mais `liberado`/`diaLiberacao`), decorações continuam vindo de
  `decoracoesLiberadas(diaAtual)`.
- Testes de `decoracoesLiberadas` continuam válidos sem mudança (função não
  muda).

Não existe suíte de testes dedicada para `jogosLiberacao.js` — nenhum teste
para atualizar ali.

## Fora de escopo

- Trava de desempenho do Monte Seu Prato (`nivelLiberado`) — mantida.
- `decoracoesLiberadas`/`resumo.decoracoes` — código morto pré-existente, não
  renderizado em lugar nenhum; não tocado.
- Fases do cenário de fundo da fazenda (`FASES_FARM`) e mensagens
  motivacionais por dia (`mensagemDoDia`) — sistema visual à parte, baseado
  no dia do programa; não tocado.
- Qualquer outro uso da palavra "liberado" no código (ex.: texto legal sobre
  liberação de acesso após pagamento em `src/data/legal.js`) — não
  relacionado, não tocado.
