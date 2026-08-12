# Liberação total: jogos e fazenda desde o dia 1

## Contexto

Hoje o MWA libera jogos e canteiros da fazenda de forma gradual, por dia do
programa:

- **Jogos** (`src/utils/jogosLiberacao.js`): 6 jogos liberam em dias
  diferentes (colheita dia 1, prato dia 2, vf dia 5, troca dia 8, saciedade
  dia 11, rótulos dia 14). Antes do dia, o card aparece com cadeado e
  `disabled`.
- **Fazenda** (`src/utils/farm/crescimento.js`): 6 canteiros liberam a cada 4
  dias (`INTERVALO_LIBERACAO_DIAS`). Antes do dia de liberação, o canteiro
  aparece com cadeado e não pode ser "cuidado".

A proprietária quer que tudo isso fique acessível desde o primeiro dia — sem
espera, sem cadeado.

Fica de fora desta mudança a trava de desempenho dentro do Monte Seu Prato
(`src/utils/jogos/progresso.js`, `nivelLiberado`): um nível de missão só abre
depois de 2+ estrelas numa missão do nível anterior. Essa trava recompensa
desempenho dentro do jogo, não é uma espera por dias — decisão explícita da
proprietária de mantê-la como está.

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

### 3. Fazenda — acesso (`src/utils/farm/crescimento.js`)

`pilarLiberado` passa a sempre retornar `true`. `diaLiberacaoPilar` continua
existindo — ainda é usado para calcular o ritmo de crescimento (ver item 4) —
mas deixa de gatear acesso.

### 4. Fazenda — crescimento visual (`src/utils/farm/crescimento.js`)

Hoje, antes do dia de liberação de um canteiro, `estagioDoPilar` retorna `-1`
(usado só para acionar o cadeado). Como o cadeado cai, um canteiro em `-1`
quebraria a renderização (`PlantaFazenda` não tem arte para estágio -1).

Fix: substituir o retorno antecipado `-1` por um `Math.max(0, ...)` no
cálculo do estágio. Isso faz o canteiro nascer como semente (estágio 0) desde
o dia 1, mas mantém o relógio de crescimento de cada canteiro idêntico ao de
hoje — canteiro 2 ainda vira broto por volta do dia 25, canteiro 6 continua
florescendo depois do canteiro 1, etc. Só a barreira de acesso cai; o ritmo
de floração escalonado continua.

```js
// antes
export function estagioDoPilar(pilarId, diaAtual) {
  const dia = diaSeguro(diaAtual)
  const diaLiberacao = diaLiberacaoPilar(pilarId)
  if (dia < diaLiberacao) return -1
  return Math.min(ESTAGIO_MAXIMO, Math.floor((dia - diaLiberacao) / DIAS_POR_ESTAGIO))
}

// depois
export function estagioDoPilar(pilarId, diaAtual) {
  const dia = diaSeguro(diaAtual)
  const diaLiberacao = diaLiberacaoPilar(pilarId)
  return Math.max(0, Math.min(ESTAGIO_MAXIMO, Math.floor((dia - diaLiberacao) / DIAS_POR_ESTAGIO)))
}
```

### 5. Fazenda — UI (`src/components/game/MwaFarm.jsx`)

- `abrirPilar`: remove o ramo `if (!pilar.liberado)` (cadeado + "Este
  canteiro desperta no dia X") — sempre abre o estado liberado (título,
  texto educativo, estágio).
- `cuidar`: remove a checagem `!pilar?.liberado` da guarda — passa a checar
  só `cuidados.includes(pilar.id)`.
- Renderização do canteiro selecionado (ícone `LockKeyhole` vs planta): o
  ramo de cadeado sai, porque `selecionado.bloqueado` nunca mais é setado.
- `resumo.pilares` continua expondo `liberado` (sempre `true` agora) e
  `diaLiberacao` (usado só internamente pelo cálculo de estágio) — nenhum
  outro consumidor depende desses campos além do que já foi listado.

### 6. Monte Seu Prato

Nenhuma mudança. `nivelLiberado` continua gateando níveis de missão por
desempenho (2+ estrelas), por decisão explícita da proprietária.

## Testes

`src/utils/farm/crescimento.test.js` tem casos que testam o comportamento
antigo e precisam ser reescritos:

- Testes que esperam `pilarLiberado(..., diaAntesDoLimite) === false` →
  passam a esperar `true` (sempre liberado).
- Teste que espera `estagioDoPilar(...) === -1` antes da liberação → passa a
  esperar `0` (semente).
- Os testes que verificam o ritmo de crescimento *depois* da liberação
  (transições semente → broto → floração → plena) continuam válidos sem
  mudança, já que o relógio de crescimento não muda.

Não existe suíte de testes dedicada para `jogosLiberacao.js` — nenhum teste
para atualizar ali.

## Fora de escopo

- Trava de desempenho do Monte Seu Prato (`nivelLiberado`) — mantida.
- Qualquer outro uso da palavra "liberado" no código (ex.: texto legal sobre
  liberação de acesso após pagamento em `src/data/legal.js`) — não relacionado,
  não tocado.
