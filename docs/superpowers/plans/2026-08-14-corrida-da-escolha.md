# Corrida da Escolha Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new mini-game, "Corrida da Escolha" — a 3-lane runner where the
player dodges unhealthy food and catches healthy food, ending in a summary
that splits calories eaten into healthy vs. unhealthy.

**Architecture:** Pure game-logic functions (timing curves, star/percentage
math) live in `src/utils/jogos/corrida.js`, fully unit-tested. Food content
lives in `src/data/jogos/itensCorrida.js`, referencing `ALIMENTOS` (no
nutrition data duplicated). The game itself is one self-contained React
component (`JogoCorridaEscolha.jsx`) using CSS-transition-driven item falls
(no canvas, no rAF loop — matches this codebase's existing game patterns) and
plugs into the same reward/progress plumbing (`AppContext`, `mwa_jogos_progresso`)
already used by the other 6 games.

**Tech Stack:** React 18, Tailwind CSS, CSS transitions for animation,
`node:test` for pure-logic unit tests, existing Supabase-backed
`mwa_jogos_progresso` table (no migration needed).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-14-corrida-da-escolha-design.md` —
  every requirement in this plan traces back to it.
- Run duration: 35000ms (`DURACAO_PARTIDA_MS`).
- Spawn interval: interpolates 1100ms → 550ms over the run.
- Item fall duration: interpolates 2200ms → 1400ms over the run.
- 3 lanes (`NUM_PISTAS = 3`).
- Colors: saudável = `bg-verde-escuro` (`#052a1f`, existing Tailwind token);
  não saudável = `#B0563C` (existing app alert color, used as arbitrary value
  `bg-[#B0563C]`, same as `InformativoDoDia.jsx`).
- Estrelas: ≥90% saudável → 3, ≥70% → 2, ≥50% → 1, else 0.
- Recompensa: +10 🌱, só quando ≥50% saudável, 1x por dia
  (`PREMIO_MINIMO_PERCENTUAL = 50`).
- Hub id / `JOGO_ID` for progress rows: `'corrida'`.
- Portuguese identifiers/comments, matching the rest of the codebase.
- No component-test harness in this repo (pre-existing convention) — pure
  logic in `.js` files gets `node:test` coverage; components are verified by
  `npm run build` + manual browser check.

---

### Task 1: Pure game-logic utilities

**Files:**
- Create: `src/utils/jogos/corrida.js`
- Test: `src/utils/jogos/corrida.test.js`

**Interfaces:**
- Consumes: `macrosDoAlimento` from `../../data/alimentos.js` (existing,
  signature `macrosDoAlimento(alimento, quantidade, medidaId)` → `{ calorias, ... }`).
- Produces (used by Task 5): `NUM_PISTAS`, `DURACAO_PARTIDA_MS`,
  `intervaloSpawn(decorridoMs)`, `duracaoQueda(decorridoMs)`,
  `pistaAleatoria(anterior)`, `kcalDoItem(item)` (item = `{ alimento, ... }`),
  `percentualSaudavel(kcalSaudavel, kcalNaoSaudavel)`,
  `estrelasCorrida(percentual)`, `mensagemCorrida(percentual)` → `{ pt, en }`,
  `PREMIO_MINIMO_PERCENTUAL`, `mereceRecompensa(percentual)`.

- [ ] **Step 1: Write the failing tests**

```js
// src/utils/jogos/corrida.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DURACAO_PARTIDA_MS,
  NUM_PISTAS,
  intervaloSpawn,
  duracaoQueda,
  pistaAleatoria,
  percentualSaudavel,
  estrelasCorrida,
  mensagemCorrida,
  PREMIO_MINIMO_PERCENTUAL,
  mereceRecompensa,
  kcalDoItem,
} from './corrida.js'

test('intervalo de spawn diminui conforme o tempo passa', () => {
  const inicio = intervaloSpawn(0)
  const meio = intervaloSpawn(DURACAO_PARTIDA_MS / 2)
  const fim = intervaloSpawn(DURACAO_PARTIDA_MS)
  assert.equal(inicio, 1100)
  assert.equal(fim, 550)
  assert.ok(meio < inicio && meio > fim)
})

test('intervalo de spawn não passa dos limites mesmo além da duração', () => {
  assert.equal(intervaloSpawn(DURACAO_PARTIDA_MS * 2), 550)
  assert.equal(intervaloSpawn(-500), 1100)
})

test('duração da queda diminui conforme o tempo passa', () => {
  assert.equal(duracaoQueda(0), 2200)
  assert.equal(duracaoQueda(DURACAO_PARTIDA_MS), 1400)
  assert.ok(duracaoQueda(DURACAO_PARTIDA_MS / 2) < 2200)
})

test('pista aleatória nunca repete a pista anterior', () => {
  for (let i = 0; i < 200; i++) {
    const anterior = i % NUM_PISTAS
    const proxima = pistaAleatoria(anterior)
    assert.notEqual(proxima, anterior)
    assert.ok(proxima >= 0 && proxima < NUM_PISTAS)
  }
})

test('primeira pista aceita qualquer valor (sem anterior)', () => {
  const pista = pistaAleatoria(null)
  assert.ok(pista >= 0 && pista < NUM_PISTAS)
})

test('percentual saudável calcula a proporção correta e trata divisão por zero', () => {
  assert.equal(percentualSaudavel(80, 20), 80)
  assert.equal(percentualSaudavel(0, 0), 0)
  assert.equal(percentualSaudavel(100, 0), 100)
})

test('estrelas seguem os cortes de 90/70/50%', () => {
  assert.equal(estrelasCorrida(95), 3)
  assert.equal(estrelasCorrida(90), 3)
  assert.equal(estrelasCorrida(89), 2)
  assert.equal(estrelasCorrida(70), 2)
  assert.equal(estrelasCorrida(69), 1)
  assert.equal(estrelasCorrida(50), 1)
  assert.equal(estrelasCorrida(49), 0)
})

test('recompensa exige pelo menos 50% saudável', () => {
  assert.equal(PREMIO_MINIMO_PERCENTUAL, 50)
  assert.equal(mereceRecompensa(50), true)
  assert.equal(mereceRecompensa(49), false)
})

test('mensagem final varia com o desempenho, sempre sem punir', () => {
  const otima = mensagemCorrida(95)
  const media = mensagemCorrida(60)
  const baixa = mensagemCorrida(20)
  assert.notEqual(otima.pt, media.pt)
  assert.notEqual(media.pt, baixa.pt)
  for (const m of [otima, media, baixa]) {
    assert.ok(m.pt.length > 0 && m.en.length > 0)
  }
})

test('kcal do item usa a porção de referência do alimento', () => {
  const item = {
    alimento: {
      kcal: 200,
      porcao: 100,
      unidadeBase: 'g',
      medidas: [{ id: 'g', base: 1 }, { id: 'porcao', base: 100 }],
    },
  }
  assert.equal(kcalDoItem(item), 200)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `src/utils/jogos/corrida.js` does not exist yet.

- [ ] **Step 3: Write the implementation**

```js
// src/utils/jogos/corrida.js
// Regras puras da Corrida da Escolha — corredor de 3 pistas onde o jogador
// pega itens saudáveis e desvia dos não saudáveis (sem funções de UI/timer).

import { macrosDoAlimento } from '../../data/alimentos.js'

export const NUM_PISTAS = 3
export const DURACAO_PARTIDA_MS = 35000

const INTERVALO_SPAWN_INICIAL_MS = 1100
const INTERVALO_SPAWN_FINAL_MS = 550
const QUEDA_INICIAL_MS = 2200
const QUEDA_FINAL_MS = 1400

export const PREMIO_MINIMO_PERCENTUAL = 50

function interpolar(decorridoMs, duracaoMs, inicio, fim) {
  const t = Math.min(Math.max(decorridoMs / duracaoMs, 0), 1)
  return inicio + (fim - inicio) * t
}

// Quanto tempo até o próximo item nascer — encolhe conforme a partida avança.
export function intervaloSpawn(decorridoMs, duracaoMs = DURACAO_PARTIDA_MS) {
  return interpolar(decorridoMs, duracaoMs, INTERVALO_SPAWN_INICIAL_MS, INTERVALO_SPAWN_FINAL_MS)
}

// Quanto tempo um item leva para cair até o avatar — encolhe do mesmo jeito.
export function duracaoQueda(decorridoMs, duracaoMs = DURACAO_PARTIDA_MS) {
  return interpolar(decorridoMs, duracaoMs, QUEDA_INICIAL_MS, QUEDA_FINAL_MS)
}

// Sorteia uma pista diferente da anterior, pra manter as 3 pistas ocupadas.
export function pistaAleatoria(anterior = null) {
  if (NUM_PISTAS <= 1) return 0
  let pista
  do {
    pista = Math.floor(Math.random() * NUM_PISTAS)
  } while (pista === anterior)
  return pista
}

// Calorias de "uma mordida" do item = uma porção de referência do alimento.
export function kcalDoItem(item) {
  return macrosDoAlimento(item.alimento, 1, 'porcao').calorias
}

export function percentualSaudavel(kcalSaudavel, kcalNaoSaudavel) {
  const total = kcalSaudavel + kcalNaoSaudavel
  if (total <= 0) return 0
  return Math.round((kcalSaudavel / total) * 100)
}

export function estrelasCorrida(percentual) {
  if (percentual >= 90) return 3
  if (percentual >= 70) return 2
  if (percentual >= 50) return 1
  return 0
}

export function mereceRecompensa(percentual) {
  return percentual >= PREMIO_MINIMO_PERCENTUAL
}

// Lição final — sempre acolhedora, nunca de punição, mesmo no desempenho baixo.
export function mensagemCorrida(percentual) {
  if (percentual >= 90) {
    return {
      pt: 'Desvio quase perfeito! Foi assim, pista a pista, que as calorias saudáveis dominaram o total do dia.',
      en: 'A near-perfect dodge! Lane by lane, that is how the healthy calories took over the total.',
    }
  }
  if (percentual >= 50) {
    return {
      pt: 'Mais da metade das suas calorias vieram de escolhas saudáveis — os itens que passaram batido é que somaram o resto.',
      en: 'More than half your calories came from healthy choices — the items that slipped by are what added the rest.',
    }
  }
  return {
    pt: 'Foi assim que o total de calorias subiu: cada item não saudável que passou pela pista somou junto, sem parecer muito de cada vez.',
    en: 'That is how the calorie total climbed: every unhealthy item that got through added up, without feeling like much at a time.',
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests in `corrida.test.js` green.

- [ ] **Step 5: Commit**

```bash
git add src/utils/jogos/corrida.js src/utils/jogos/corrida.test.js
git commit -m "feat: adiciona regras puras da Corrida da Escolha"
```

---

### Task 2: Item catalog (healthy + unhealthy foods)

**Files:**
- Create: `src/data/jogos/itensCorrida.js`
- Test: `src/data/jogos/itensCorrida.test.js`

**Interfaces:**
- Consumes: `ALIMENTOS` from `../alimentos.js` (existing).
- Produces (used by Task 5): `ITENS_CORRIDA` (array of
  `{ svgId, tipo: 'saudavel' | 'naoSaudavel', alimento }`), `sortearItem()`
  → one random entry from `ITENS_CORRIDA`.

- [ ] **Step 1: Write the failing tests**

```js
// src/data/jogos/itensCorrida.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { ITENS_CORRIDA, sortearItem } from './itensCorrida.js'

test('a lista tem 10 itens saudáveis e 10 não saudáveis, sem svgId repetido', () => {
  const saudaveis = ITENS_CORRIDA.filter((i) => i.tipo === 'saudavel')
  const naoSaudaveis = ITENS_CORRIDA.filter((i) => i.tipo === 'naoSaudavel')
  assert.equal(saudaveis.length, 10)
  assert.equal(naoSaudaveis.length, 10)
  assert.equal(new Set(ITENS_CORRIDA.map((i) => i.svgId)).size, ITENS_CORRIDA.length)
})

test('cada item resolve um alimento real com kcal e porção', () => {
  for (const item of ITENS_CORRIDA) {
    assert.ok(item.alimento, `sem alimento para ${item.svgId}`)
    assert.ok(item.alimento.kcal > 0, `kcal inválida para ${item.svgId}`)
    assert.ok(item.alimento.porcao > 0, `porção inválida para ${item.svgId}`)
  }
})

test('sortearItem sempre devolve um item da lista, com os dois tipos aparecendo', () => {
  const vistos = new Set()
  for (let i = 0; i < 300; i++) {
    const item = sortearItem()
    assert.ok(ITENS_CORRIDA.includes(item))
    vistos.add(item.tipo)
  }
  assert.equal(vistos.size, 2)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `src/data/jogos/itensCorrida.js` does not exist yet.

- [ ] **Step 3: Write the implementation**

```js
// src/data/jogos/itensCorrida.js
// Itens da Corrida da Escolha — apenas METADADOS do jogo (svgId + tipo).
// Nutrição não é duplicada aqui: vem de src/data/alimentos.js (fonte única).

import { ALIMENTOS } from '../alimentos.js'

function porId(alimentoId) {
  const alimento = ALIMENTOS.find((a) => a.id === alimentoId)
  if (!alimento) throw new Error(`[corrida] alimento não encontrado por id: ${alimentoId}`)
  return alimento
}

// alimentosExtras.js gera ids por posição (br-001, br-002…), instáveis se o
// arquivo ganhar novas linhas no meio — por isso resolvemos por nome exato.
function porNome(nome) {
  const alimento = ALIMENTOS.find((a) => a.nome === nome)
  if (!alimento) throw new Error(`[corrida] alimento não encontrado por nome: ${nome}`)
  return alimento
}

const SAUDAVEIS = [
  { svgId: 'banana', alimentoId: 'banana' },
  { svgId: 'maca', alimentoId: 'maca' },
  { svgId: 'morango', alimentoId: 'morango' },
  { svgId: 'brocolis', alimentoId: 'brocolis' },
  { svgId: 'cenoura', alimentoId: 'cenoura' },
  { svgId: 'iogurte-natural', alimentoId: 'iogurte-natural' },
  { svgId: 'ovo', alimentoId: 'ovo' },
  { svgId: 'aveia', alimentoId: 'aveia' },
  { svgId: 'batata-doce', alimentoId: 'batata-doce' },
  { svgId: 'salada-verde', alimentoId: 'salada-verde' },
].map(({ svgId, alimentoId }) => ({ svgId, tipo: 'saudavel', alimento: porId(alimentoId) }))

const NAO_SAUDAVEIS = [
  { svgId: 'hamburguer', nome: 'Hambúrguer completo' },
  { svgId: 'pizza', nome: 'Pizza de muçarela' },
  { svgId: 'batata-frita', nome: 'Batata inglesa frita' },
  { svgId: 'cachorro-quente', nome: 'Cachorro-quente completo' },
  { svgId: 'coxinha', nome: 'Coxinha de frango' },
  { svgId: 'brigadeiro', nome: 'Brigadeiro' },
  { svgId: 'bolo-chocolate', nome: 'Bolo de chocolate' },
  { svgId: 'sorvete', nome: 'Sorvete de creme' },
  { svgId: 'refrigerante', nome: 'Refrigerante comum' },
  { svgId: 'biscoito-recheado', nome: 'Biscoito recheado' },
].map(({ svgId, nome }) => ({ svgId, tipo: 'naoSaudavel', alimento: porNome(nome) }))

export const ITENS_CORRIDA = [...SAUDAVEIS, ...NAO_SAUDAVEIS]

// 50% de chance de cada tipo, depois um item aleatório dentro do tipo sorteado.
export function sortearItem() {
  const lista = Math.random() < 0.5 ? SAUDAVEIS : NAO_SAUDAVEIS
  return lista[Math.floor(Math.random() * lista.length)]
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests in `itensCorrida.test.js` green, and the module
import itself proves every `porId`/`porNome` lookup succeeded (they throw at
import time otherwise).

- [ ] **Step 5: Commit**

```bash
git add src/data/jogos/itensCorrida.js src/data/jogos/itensCorrida.test.js
git commit -m "feat: adiciona catálogo de itens saudáveis e não saudáveis da Corrida da Escolha"
```

---

### Task 3: Illustrations for the unhealthy items

**Files:**
- Create: `src/components/game/svg/ItemNaoSaudavelSvg.jsx`

**Interfaces:**
- Consumes: nothing (pure presentational, no data imports).
- Produces (used by Task 5): default export
  `ItemNaoSaudavelSvg({ id, tamanho = 44, className = '', rotulo })` — same
  API shape as the existing `IngredienteSvg.jsx`. `id` must match one of the
  10 `svgId` values from `NAO_SAUDAVEIS` in Task 2
  (`hamburguer`, `pizza`, `batata-frita`, `cachorro-quente`, `coxinha`,
  `brigadeiro`, `bolo-chocolate`, `sorvete`, `refrigerante`,
  `biscoito-recheado`).

No automated test — this is a pure presentational component with no logic
branches beyond a lookup table, same as `IngredienteSvg.jsx` (which also has
no test file). Verified visually in Task 7.

- [ ] **Step 1: Write the component**

```jsx
// src/components/game/svg/ItemNaoSaudavelSvg.jsx
// Biblioteca de ilustrações dos itens "não saudáveis" da Corrida da Escolha.
// Estilo flat, viewBox 48x48, mesma abordagem de paleta que IngredienteSvg.jsx.
// Uma ilustração por svgId; fallback = prato com "!" neutro.

const C = {
  paoClaro: '#E8C98A',
  paoEscuro: '#C9973F',
  carne: '#7A4B34',
  queijo: '#F0C750',
  alface: '#7A9A5A',
  vermelho: '#C0503F',
  chocolate: '#5A3A22',
  chocolateEscuro: '#3E2814',
  creme: '#F6F0E2',
  branco: '#FFFFFF',
  cinza: '#E9E2D4',
  rosa: '#E8A0A8',
  mostarda: '#E0A62C',
  refriEscuro: '#8A3B2E',
  gelo: '#DCEFF5',
}

const ICONES = {
  hamburguer: (
    <g>
      <path d="M8 20c0-6 7-10 16-10s16 4 16 10H8z" fill={C.paoClaro} />
      <circle cx="14" cy="12" r="1.2" fill={C.creme} />
      <circle cx="24" cy="9" r="1.2" fill={C.creme} />
      <circle cx="32" cy="13" r="1.2" fill={C.creme} />
      <rect x="7" y="20" width="34" height="3" fill={C.alface} />
      <rect x="7" y="23" width="34" height="6" rx="2" fill={C.carne} />
      <rect x="7" y="29" width="34" height="3" fill={C.queijo} />
      <rect x="7" y="32" width="34" height="7" rx="3" fill={C.paoEscuro} />
    </g>
  ),
  pizza: (
    <g>
      <path d="M24 6l17 34H7z" fill={C.paoClaro} stroke={C.paoEscuro} strokeWidth="1.5" />
      <path d="M24 6l14 28a20 20 0 0 1-28 0z" fill={C.queijo} />
      <circle cx="21" cy="24" r="2.6" fill={C.vermelho} />
      <circle cx="27" cy="30" r="2.6" fill={C.vermelho} />
      <circle cx="24" cy="18" r="2.2" fill={C.vermelho} />
    </g>
  ),
  'batata-frita': (
    <g>
      <path d="M12 20h24l-3 20a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z" fill={C.vermelho} />
      <path d="M14 22h20l1-3H13z" fill={C.paoClaro} />
      <rect x="15" y="10" width="3.4" height="16" rx="1.5" fill={C.paoClaro} transform="rotate(-6 17 18)" />
      <rect x="20" y="8" width="3.4" height="18" rx="1.5" fill={C.paoClaro} />
      <rect x="25" y="9" width="3.4" height="17" rx="1.5" fill={C.paoClaro} transform="rotate(6 27 18)" />
      <rect x="29" y="11" width="3.4" height="15" rx="1.5" fill={C.paoClaro} transform="rotate(12 31 18)" />
    </g>
  ),
  'cachorro-quente': (
    <g>
      <path d="M6 22c0-6 6-9 18-9s18 3 18 9-6 9-18 9S6 28 6 22z" fill={C.paoEscuro} />
      <path d="M9 22c0-4 6-6 15-6s15 2 15 6-6 6-15 6-15-2-15-6z" fill={C.vermelho} />
      <path d="M11 20c3-2 20-2 23 0M11 24c3 2 20 2 23 0" stroke={C.mostarda} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  coxinha: (
    <g>
      <path d="M24 8c8 6 12 16 6 26-3 5-9 5-12 0-6-10-2-20 6-26z" fill={C.paoEscuro} />
      <path d="M24 8c6 5 9 12 6 19-2 4-7 4-10 1-4-6-2-14 4-20z" fill={C.paoClaro} opacity="0.6" />
    </g>
  ),
  brigadeiro: (
    <g>
      <circle cx="24" cy="26" r="14" fill={C.chocolate} />
      <circle cx="19" cy="20" r="1.4" fill={C.mostarda} />
      <circle cx="27" cy="17" r="1.4" fill={C.vermelho} />
      <circle cx="31" cy="24" r="1.4" fill={C.alface} />
      <circle cx="17" cy="28" r="1.4" fill={C.mostarda} />
      <circle cx="24" cy="32" r="1.4" fill={C.vermelho} />
      <circle cx="30" cy="33" r="1.4" fill={C.alface} />
    </g>
  ),
  'bolo-chocolate': (
    <g>
      <path d="M8 34L24 10l16 24z" fill={C.chocolate} />
      <path d="M8 34L24 10l16 24-16 6z" fill={C.chocolateEscuro} opacity="0.35" />
      <path d="M24 10c2 3 1 6-1 8s0 5 2 6" stroke={C.creme} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="6" y="34" width="36" height="4" rx="2" fill={C.chocolateEscuro} />
    </g>
  ),
  sorvete: (
    <g>
      <path d="M18 24h12l-4 16a2 2 0 0 1-4 0z" fill={C.paoClaro} />
      <path d="M15 22a9 9 0 0 1 18 0c0 4-4 6-9 6s-9-2-9-6z" fill={C.branco} />
      <circle cx="24" cy="14" r="7" fill={C.rosa} />
    </g>
  ),
  refrigerante: (
    <g>
      <path d="M15 12h18l-2 26a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" fill={C.vermelho} />
      <path d="M14 12h20v3H14z" fill={C.refriEscuro} />
      <path d="M17 20c4 2 10 2 14 0" stroke={C.creme} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="22" y="4" width="3" height="9" rx="1.5" fill={C.gelo} transform="rotate(-10 23 8)" />
    </g>
  ),
  'biscoito-recheado': (
    <g>
      <circle cx="24" cy="17" r="11" fill={C.chocolate} />
      <circle cx="24" cy="31" r="11" fill={C.chocolate} />
      <rect x="13" y="20" width="22" height="8" fill={C.creme} />
      <circle cx="20" cy="17" r="1.2" fill={C.chocolateEscuro} />
      <circle cx="28" cy="14" r="1.2" fill={C.chocolateEscuro} />
      <circle cx="20" cy="31" r="1.2" fill={C.chocolateEscuro} />
      <circle cx="28" cy="34" r="1.2" fill={C.chocolateEscuro} />
    </g>
  ),
}

const FALLBACK = (
  <g>
    <circle cx="24" cy="24" r="16" fill={C.cinza} stroke={C.paoEscuro} strokeWidth="1.5" />
    <text x="24" y="30" fontSize="16" textAnchor="middle" fill={C.paoEscuro}>!</text>
  </g>
)

export default function ItemNaoSaudavelSvg({ id, tamanho = 44, className = '', rotulo }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={tamanho}
      height={tamanho}
      className={className}
      role={rotulo ? 'img' : 'presentation'}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      {ICONES[id] ?? FALLBACK}
    </svg>
  )
}

export const IDS_ILUSTRADOS = Object.keys(ICONES)
```

- [ ] **Step 2: Verify the app builds**

Run: `npm run build`
Expected: build succeeds — this file has no runtime consumers yet, so this
step only proves valid JSX/no syntax errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/game/svg/ItemNaoSaudavelSvg.jsx
git commit -m "feat: adiciona ilustrações dos itens não saudáveis da Corrida da Escolha"
```

---

### Task 4: Reward wiring in AppContext + demo stub

**Files:**
- Modify: `src/context/AppContext.jsx:520-523` (right after `registrarJogoRotulos`)
- Modify: `src/context/AppContext.jsx:937` (export list, right after `registrarJogoRotulos`)
- Modify: `demo/stubs/AppContext.jsx:11-19` (`RECOMPENSAS_SIMULADAS` list)

**Interfaces:**
- Produces (used by Task 5): `registrarJogoCorrida()` — async, exposed via
  `useApp()`, calls `premiar('jogo_corrida', hoje)` (existing `premiar`
  helper, same pattern as every other `registrarJogoX`). Grants +10 🌱, 1x
  per day, deduped server-side exactly like the other 5 games.

- [ ] **Step 1: Add the function in `AppContext.jsx`**

Find this block (around line 520):

```jsx
  async function registrarJogoRotulos() {
    await premiar('jogo_rotulos', hoje)
  }
```

Add right after it:

```jsx
  async function registrarJogoCorrida() {
    await premiar('jogo_corrida', hoje)
  }
```

- [ ] **Step 2: Export it from the provider**

Find this line in the `valor` object (around line 937):

```jsx
    registrarJogoRotulos,
```

Add right after it:

```jsx
    registrarJogoCorrida,
```

- [ ] **Step 3: Add it to the demo stub's simulated-rewards list**

In `demo/stubs/AppContext.jsx`, find:

```js
const RECOMPENSAS_SIMULADAS = [
  'registrarJogoPrato',
  'registrarJogoVerdadeiroFalso',
  'registrarJogoTroca',
  'registrarJogoSaciedade',
  'registrarJogoRotulos',
  'registrarJoguinho',
  'registrarMomentoMwa',
]
```

Add `'registrarJogoCorrida'` to the list:

```js
const RECOMPENSAS_SIMULADAS = [
  'registrarJogoPrato',
  'registrarJogoVerdadeiroFalso',
  'registrarJogoTroca',
  'registrarJogoSaciedade',
  'registrarJogoRotulos',
  'registrarJogoCorrida',
  'registrarJoguinho',
  'registrarMomentoMwa',
]
```

- [ ] **Step 4: Verify the app builds**

Run: `npm run build`
Expected: build succeeds, no new errors or warnings.

- [ ] **Step 5: Commit**

```bash
git add src/context/AppContext.jsx demo/stubs/AppContext.jsx
git commit -m "feat: adiciona recompensa diária da Corrida da Escolha"
```

---

### Task 5: The game component

**Files:**
- Modify: `src/index.css` (add the "belisco" shake keyframe)
- Create: `src/components/game/JogoCorridaEscolha.jsx`

**Interfaces:**
- Consumes: `useApp()` → `{ userId, game, registrarJogoCorrida }` (Task 4);
  `useIdioma()` → `{ ingles }`; `sortearItem` (Task 2); `NUM_PISTAS`,
  `DURACAO_PARTIDA_MS`, `intervaloSpawn`, `duracaoQueda`, `pistaAleatoria`,
  `kcalDoItem`, `percentualSaudavel`, `estrelasCorrida`, `mensagemCorrida`,
  `mereceRecompensa` (Task 1); `IngredienteSvg` (existing), `ItemNaoSaudavelSvg`
  (Task 3); `Avatar` (existing, prop `avatar`); `mesclarProgresso` (existing);
  `tentarRecompensa` (existing); `carregarProgressoJogo`, `salvarResultadoJogo`
  (existing).
- Produces: default export `JogoCorridaEscolha({ onFechar })`, same modal
  contract as every other game component (`role="dialog"`, closes on Esc or
  `onFechar`).

- [ ] **Step 1: Add the shake keyframe to `src/index.css`**

Find the MWA FARM keyframes block (around line 142-153, ending with
`.mwa-farm-bob { ... }`) and add right after it, still before the
`@media (prefers-reduced-motion: reduce)` block:

```css
/* Corrida da Escolha: tremor rápido do avatar ao "comer" algo não saudável */
@keyframes mwa-corrida-belisco {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-8deg);
  }
  75% {
    transform: rotate(8deg);
  }
}

.mwa-corrida-belisco {
  display: inline-block;
  animation: mwa-corrida-belisco 0.3s ease-in-out;
}
```

Then add `.mwa-corrida-belisco` to the existing `@media (prefers-reduced-motion: reduce)` list (around line 155-163):

```css
@media (prefers-reduced-motion: reduce) {
  .mwa-estrela,
  .mwa-estrela-cadente,
  .mwa-medalha,
  .mwa-medalha-raios,
  .mwa-brilho,
  .mwa-farm-balanco,
  .mwa-farm-bob,
  .mwa-corrida-belisco {
    animation: none !important;
  }
```

- [ ] **Step 2: Write the component**

```jsx
// src/components/game/JogoCorridaEscolha.jsx
import { useEffect, useRef, useState } from 'react'
import { X, Play, RotateCcw, Star, Trophy } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { sortearItem } from '../../data/jogos/itensCorrida.js'
import {
  NUM_PISTAS,
  DURACAO_PARTIDA_MS,
  intervaloSpawn,
  duracaoQueda,
  pistaAleatoria,
  kcalDoItem,
  percentualSaudavel,
  estrelasCorrida,
  mensagemCorrida,
  mereceRecompensa,
} from '../../utils/jogos/corrida.js'
import { mesclarProgresso } from '../../utils/jogos/progresso.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'
import { carregarProgressoJogo, salvarResultadoJogo } from '../../lib/jogosProgresso.js'
import IngredienteSvg from './svg/IngredienteSvg.jsx'
import ItemNaoSaudavelSvg from './svg/ItemNaoSaudavelSvg.jsx'
import Avatar from './Avatar.jsx'

const JOGO_ID = 'corrida'
const PISTAS = Array.from({ length: NUM_PISTAS }, (_, i) => i)

// Um item caindo — controla sua própria animação (nasce no topo, anima até a
// altura do avatar) e avisa o componente pai se colidiu ou passou batido.
function ItemQueda({ entrada, pistaRef, onResolver }) {
  const [caindo, setCaindo] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCaindo(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  function aoTerminar() {
    onResolver(entrada, pistaRef.current === entrada.pista)
  }

  const Icone = entrada.item.tipo === 'saudavel' ? IngredienteSvg : ItemNaoSaudavelSvg

  return (
    <div
      className="pointer-events-none absolute flex justify-center"
      style={{
        left: `${entrada.pista * (100 / NUM_PISTAS)}%`,
        width: `${100 / NUM_PISTAS}%`,
        top: caindo ? '82%' : '-14%',
        transition: `top ${entrada.quedaMs}ms linear`,
      }}
      onTransitionEnd={aoTerminar}
    >
      <Icone id={entrada.item.svgId} tamanho={40} />
    </div>
  )
}

export default function JogoCorridaEscolha({ onFechar }) {
  const { ingles } = useIdioma()
  const { userId, game, registrarJogoCorrida } = useApp()

  const [fase, setFase] = useState('intro') // 'intro' | 'rodando' | 'resultado'
  const [pista, setPista] = useState(1)
  const [itensNaTela, setItensNaTela] = useState([])
  const [kcalSaudavel, setKcalSaudavel] = useState(0)
  const [kcalNaoSaudavel, setKcalNaoSaudavel] = useState(0)
  const [itensNaoSaudaveisComidos, setItensNaoSaudaveisComidos] = useState(0)
  const [beliscado, setBeliscado] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [barraAnimando, setBarraAnimando] = useState(false)
  const [premioDado, setPremioDado] = useState(false)
  const [recorde, setRecorde] = useState(null)

  const dialogRef = useRef(null)
  const pistaRef = useRef(1)
  const rodandoRef = useRef(false)
  const spawnTimeoutRef = useRef(null)
  const fimTimeoutRef = useRef(null)
  const inicioRef = useRef(0)
  const proximoIdRef = useRef(0)
  const pistaItemAnteriorRef = useRef(null)
  const toqueInicioRef = useRef(null)
  const feedbackIdRef = useRef(0)

  const kcalTotal = kcalSaudavel + kcalNaoSaudavel
  const percentual = percentualSaudavel(kcalSaudavel, kcalNaoSaudavel)
  const estrelas = estrelasCorrida(percentual)
  const mensagem = mensagemCorrida(percentual)

  function fechar() {
    pararTimers()
    onFechar?.()
  }

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') fechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    pistaRef.current = pista
  }, [pista])

  // Carrega o recorde salvo (melhor % saudável já alcançado)
  useEffect(() => {
    let ativo = true
    carregarProgressoJogo(userId, JOGO_ID).then((linhas) => {
      if (ativo) setRecorde(linhas[0] ?? null)
    })
    return () => {
      ativo = false
    }
  }, [userId])

  // Setas ← → trocam de pista enquanto a corrida está rolando
  useEffect(() => {
    if (fase !== 'rodando') return
    function aoTeclar(e) {
      if (e.key === 'ArrowLeft') irParaPista(pistaRef.current - 1)
      if (e.key === 'ArrowRight') irParaPista(pistaRef.current + 1)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fase])

  // Barra de tempo: nasce cheia e anima até zero ao longo da partida
  useEffect(() => {
    if (fase !== 'rodando') {
      setBarraAnimando(false)
      return
    }
    setBarraAnimando(false)
    const frame = requestAnimationFrame(() => setBarraAnimando(true))
    return () => cancelAnimationFrame(frame)
  }, [fase])

  // Ao terminar: salva recorde e concede a recompensa diária (se elegível)
  useEffect(() => {
    if (fase !== 'resultado') return
    salvarResultadoJogo(userId, JOGO_ID, '', { pontuacao: percentual, estrelas }, recorde).then((salvo) => {
      setRecorde(salvo ?? mesclarProgresso(recorde, { pontuacao: percentual, estrelas }))
    })
    if (mereceRecompensa(percentual) && !premioDado) {
      tentarRecompensa(registrarJogoCorrida).then(setPremioDado)
    }
  }, [fase])

  useEffect(() => () => pararTimers(), [])

  function pararTimers() {
    rodandoRef.current = false
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current)
    if (fimTimeoutRef.current) clearTimeout(fimTimeoutRef.current)
  }

  function criarItem(decorrido) {
    const pistaEscolhida = pistaAleatoria(pistaItemAnteriorRef.current)
    pistaItemAnteriorRef.current = pistaEscolhida
    const entrada = {
      id: ++proximoIdRef.current,
      item: sortearItem(),
      pista: pistaEscolhida,
      quedaMs: duracaoQueda(decorrido),
    }
    setItensNaTela((atuais) => [...atuais, entrada])
  }

  function agendarProximoSpawn() {
    if (!rodandoRef.current) return
    const decorrido = Date.now() - inicioRef.current
    if (decorrido >= DURACAO_PARTIDA_MS) return
    criarItem(decorrido)
    spawnTimeoutRef.current = setTimeout(agendarProximoSpawn, intervaloSpawn(decorrido))
  }

  function terminarPartida() {
    pararTimers()
    setItensNaTela([])
    setFase('resultado')
  }

  function iniciarPartida() {
    pararTimers()
    setPista(1)
    pistaRef.current = 1
    pistaItemAnteriorRef.current = null
    setItensNaTela([])
    setKcalSaudavel(0)
    setKcalNaoSaudavel(0)
    setItensNaoSaudaveisComidos(0)
    setPremioDado(false)
    setFase('rodando')
    inicioRef.current = Date.now()
    rodandoRef.current = true
    agendarProximoSpawn()
    fimTimeoutRef.current = setTimeout(terminarPartida, DURACAO_PARTIDA_MS)
  }

  function mostrarFeedback(texto, tipo) {
    const id = ++feedbackIdRef.current
    setFeedback({ id, texto, tipo })
    setTimeout(() => setFeedback((f) => (f?.id === id ? null : f)), 500)
  }

  function resolverChegada(entrada, colidiu) {
    setItensNaTela((atuais) => atuais.filter((e) => e.id !== entrada.id))
    if (!colidiu) return
    const kcal = kcalDoItem(entrada.item)
    if (entrada.item.tipo === 'saudavel') {
      setKcalSaudavel((v) => v + kcal)
      mostrarFeedback('+', 'saudavel')
    } else {
      setKcalNaoSaudavel((v) => v + kcal)
      setItensNaoSaudaveisComidos((v) => v + 1)
      mostrarFeedback('!', 'naoSaudavel')
      setBeliscado(true)
      setTimeout(() => setBeliscado(false), 300)
    }
  }

  function irParaPista(indice) {
    setPista(Math.min(NUM_PISTAS - 1, Math.max(0, indice)))
  }

  function aoTocarInicio(e) {
    toqueInicioRef.current = e.touches[0].clientX
  }

  function aoTocarFim(e) {
    if (toqueInicioRef.current === null) return
    const deltaX = e.changedTouches[0].clientX - toqueInicioRef.current
    toqueInicioRef.current = null
    if (Math.abs(deltaX) < 40) return
    irParaPista(pistaRef.current + (deltaX > 0 ? 1 : -1))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jogo-corrida-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-3xl bg-creme p-5 outline-none">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="jogo-corrida-titulo" className="font-serif text-lg font-semibold italic text-verde">
            {ingles ? 'The Choice Run' : 'Corrida da Escolha'} 🏃
          </h2>
          <button
            type="button"
            onClick={fechar}
            aria-label={ingles ? 'Close' : 'Fechar'}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-verde/10 text-verde hover:bg-verde/20"
          >
            <X size={18} />
          </button>
        </div>

        {fase === 'intro' && (
          <div className="text-center">
            <p className="text-sm text-verde/80">
              {ingles
                ? 'Dodge the unhealthy foods and catch the healthy ones as you run down the trail.'
                : 'Desvie da comida não saudável e pegue a saudável enquanto corre pela trilha.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <IngredienteSvg id="banana" tamanho={36} />
                <span className="text-[10px] font-semibold text-verde/70">{ingles ? 'catch' : 'pega'}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ItemNaoSaudavelSvg id="hamburguer" tamanho={36} />
                <span className="text-[10px] font-semibold text-verde/70">{ingles ? 'dodge' : 'desvia'}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-verde/60">
              {ingles ? 'Swipe, use ← → or tap a lane to move.' : 'Arraste, use ← → ou toque numa pista para se mover.'}
            </p>
            {recorde && (
              <p className="mt-2 text-xs font-semibold text-ouro">
                {ingles ? `Your record: ${recorde.melhor_pontuacao}% healthy` : `Seu recorde: ${recorde.melhor_pontuacao}% saudável`}
              </p>
            )}
            <button
              type="button"
              onClick={iniciarPartida}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3 font-bold text-white active:scale-95"
            >
              <Play size={18} /> {ingles ? 'Start run' : 'Começar corrida'}
            </button>
          </div>
        )}

        {fase === 'rodando' && (
          <>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full bg-ouro"
                style={{
                  width: barraAnimando ? '0%' : '100%',
                  transition: barraAnimando ? `width ${DURACAO_PARTIDA_MS}ms linear` : 'none',
                }}
              />
            </div>

            <div
              className="relative h-[420px] overflow-hidden rounded-2xl bg-gradient-to-b from-sage-claro/50 to-creme"
              onTouchStart={aoTocarInicio}
              onTouchEnd={aoTocarFim}
            >
              <div className="pointer-events-none absolute inset-0 flex">
                {PISTAS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => irParaPista(i)}
                    aria-label={ingles ? `Lane ${i + 1}` : `Pista ${i + 1}`}
                    className="pointer-events-auto h-full flex-1 border-l border-white/30 first:border-l-0"
                  />
                ))}
              </div>

              {itensNaTela.map((entrada) => (
                <ItemQueda key={entrada.id} entrada={entrada} pistaRef={pistaRef} onResolver={resolverChegada} />
              ))}

              <div
                className="absolute bottom-3 transition-[left] duration-150 ease-out"
                style={{ left: `${(pista + 0.5) * (100 / NUM_PISTAS)}%`, transform: 'translateX(-50%)' }}
              >
                <div className={beliscado ? 'mwa-corrida-belisco' : ''}>
                  <Avatar avatar={game?.avatar} tamanho="md" />
                </div>
                {feedback && (
                  <span
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 text-lg font-bold ${
                      feedback.tipo === 'saudavel' ? 'text-verde-escuro' : 'text-[#B0563C]'
                    }`}
                  >
                    {feedback.texto}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-2 text-center text-[11px] text-verde/60">
              {ingles ? 'Swipe, use ← → or tap a lane.' : 'Arraste, use ← → ou toque numa pista.'}
            </p>
          </>
        )}

        {fase === 'resultado' && (
          <div className="text-center" role="status" aria-live="polite">
            <div className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-sage-claro" aria-hidden="true" />
              <Trophy size={30} className="relative text-verde" strokeWidth={1.5} aria-hidden="true" />
            </div>

            <div
              className="flex justify-center gap-1.5"
              aria-label={`${estrelas} ${ingles ? 'of 3 stars' : 'de 3 estrelas'}`}
            >
              {[0, 1, 2].map((i) => (
                <Star key={i} size={24} className={i < estrelas ? 'fill-ouro text-ouro' : 'text-cinza'} aria-hidden="true" />
              ))}
            </div>

            <div className="mt-4 h-4 overflow-hidden rounded-full bg-cinza">
              {kcalTotal > 0 && (
                <div className="flex h-full">
                  <div className="h-full bg-verde-escuro" style={{ width: `${(kcalSaudavel / kcalTotal) * 100}%` }} />
                  <div className="h-full bg-[#B0563C]" style={{ width: `${(kcalNaoSaudavel / kcalTotal) * 100}%` }} />
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="font-semibold text-verde-escuro">
                {Math.round(kcalSaudavel)} kcal {ingles ? 'healthy' : 'saudável'}
              </span>
              <span className="font-semibold text-[#B0563C]">
                {Math.round(kcalNaoSaudavel)} kcal {ingles ? 'unhealthy' : 'não saudável'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-verde/70">{ingles ? 'You ate' : 'Você comeu'}</p>
                <p className="mt-1 text-xl font-bold text-verde">{Math.round(kcalTotal)} kcal</p>
              </div>
              <div className="rounded-xl bg-sage-claro/50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-verde/70">
                  {ingles ? 'With a perfect dodge' : 'Com desvio perfeito'}
                </p>
                <p className="mt-1 text-xl font-bold text-verde">{Math.round(kcalSaudavel)} kcal</p>
              </div>
            </div>

            {itensNaoSaudaveisComidos > 0 ? (
              <p className="mt-2 text-xs font-semibold text-[#B0563C]">
                {ingles
                  ? `+${Math.round(kcalNaoSaudavel)} kcal for not dodging ${itensNaoSaudaveisComidos} item${itensNaoSaudaveisComidos > 1 ? 's' : ''}`
                  : `+${Math.round(kcalNaoSaudavel)} kcal por não desviar de ${itensNaoSaudaveisComidos} ${itensNaoSaudaveisComidos > 1 ? 'itens' : 'item'}`}
              </p>
            ) : (
              <p className="mt-2 text-xs font-semibold text-verde-escuro">
                {ingles ? 'Perfect dodge — no unhealthy item eaten!' : 'Desvio perfeito — nenhum item não saudável comido!'}
              </p>
            )}

            <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-verde/75">
              {ingles ? mensagem.en : mensagem.pt}
            </p>

            {recorde && (
              <p className="mt-2 text-xs font-semibold text-ouro">
                {ingles ? `Your record: ${recorde.melhor_pontuacao}% healthy` : `Seu recorde: ${recorde.melhor_pontuacao}% saudável`}
              </p>
            )}

            {premioDado && <p className="mt-2 font-bold text-ouro">+10 🌱 {ingles ? 'earned!' : 'ganhas!'}</p>}
            {!premioDado && mereceRecompensa(percentual) && (
              <p className="mt-2 text-xs text-verde/60">{ingles ? '(seeds already claimed today)' : '(sementes já resgatadas hoje)'}</p>
            )}

            <button
              type="button"
              onClick={iniciarPartida}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3 font-bold text-white active:scale-95"
            >
              <RotateCcw size={16} /> {ingles ? 'Play again' : 'Jogar de novo'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify the app builds**

Run: `npm run build`
Expected: build succeeds with no new errors or warnings beyond the
pre-existing chunk-size notice.

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/components/game/JogoCorridaEscolha.jsx
git commit -m "feat: adiciona o jogo Corrida da Escolha"
```

---

### Task 6: Hub integration

**Files:**
- Modify: `src/components/ferramentas/Ferramentas.jsx`
- Modify: `demo/jogos.jsx` (so the new game is reachable in the local demo harness)

**Interfaces:**
- Consumes: `JogoCorridaEscolha` default export (Task 5).
- Produces: nothing new — this is the final wiring task, no other task
  depends on it.

- [ ] **Step 1: Add the lazy import in `Ferramentas.jsx`**

Find (around line 21):

```jsx
const JogoDetetiveRotulos = lazy(() => import('../game/JogoDetetiveRotulos.jsx'))
const JogoColheita = lazy(() => import('../game/JogoColheita.jsx'))
```

Insert `JogoCorridaEscolha` between them:

```jsx
const JogoDetetiveRotulos = lazy(() => import('../game/JogoDetetiveRotulos.jsx'))
const JogoCorridaEscolha = lazy(() => import('../game/JogoCorridaEscolha.jsx'))
const JogoColheita = lazy(() => import('../game/JogoColheita.jsx'))
```

- [ ] **Step 2: Add the card to `JOGOS_NUTRICAO`**

Find the end of the `rotulos` entry (around line 261-262):

```jsx
  {
    id: 'rotulos',
    emoji: '🔍',
    titulo: 'Detetive dos Rótulos',
    desc: 'Aprenda a ler a tabela nutricional e a diferença entre porção e embalagem. Rodada = +10 🌱 por dia',
  },
]
```

Add a new entry before the closing `]`:

```jsx
  {
    id: 'rotulos',
    emoji: '🔍',
    titulo: 'Detetive dos Rótulos',
    desc: 'Aprenda a ler a tabela nutricional e a diferença entre porção e embalagem. Rodada = +10 🌱 por dia',
  },
  {
    id: 'corrida',
    emoji: '🏃',
    titulo: 'Corrida da Escolha',
    desc: 'Desvie das besteiras e pegue o que é saudável nas 3 pistas da trilha. Corrida concluída = +10 🌱 por dia',
  },
]
```

- [ ] **Step 3: Add the translation to `JOGOS_EN`**

Find (around line 274-281):

```jsx
const JOGOS_EN = {
  prato: ['Build Your Plate', 'Complete missions by building real plates and learn from every choice. Mission done = +10 🌱 per day'],
  vf: ['True, False or It Depends', 'Not everything in nutrition is yes or no. Every answer comes with an explanation. Round done = +10 🌱 per day'],
  troca: ['Smart Swap', 'Improve a meal without giving it up and see the impact of each swap. Round done = +10 🌱 per day'],
  saciedade: ['Satiety Battle', 'Same calories, different hunger: find out what makes a meal last longer. Round = +10 🌱 per day'],
  rotulos: ['Label Detective', 'Learn to read the nutrition table and the difference between serving and package. Round = +10 🌱 per day'],
  colheita: ['Harvest Game', 'A breather for your mind: match 3 fruits and relax. 300+ points = +10 🌱 per day'],
}
```

Add the `corrida` key:

```jsx
const JOGOS_EN = {
  prato: ['Build Your Plate', 'Complete missions by building real plates and learn from every choice. Mission done = +10 🌱 per day'],
  vf: ['True, False or It Depends', 'Not everything in nutrition is yes or no. Every answer comes with an explanation. Round done = +10 🌱 per day'],
  troca: ['Smart Swap', 'Improve a meal without giving it up and see the impact of each swap. Round done = +10 🌱 per day'],
  saciedade: ['Satiety Battle', 'Same calories, different hunger: find out what makes a meal last longer. Round = +10 🌱 per day'],
  rotulos: ['Label Detective', 'Learn to read the nutrition table and the difference between serving and package. Round = +10 🌱 per day'],
  corrida: ['The Choice Run', 'Dodge the junk and catch what is healthy across 3 lanes on the trail. Run done = +10 🌱 per day'],
  colheita: ['Harvest Game', 'A breather for your mind: match 3 fruits and relax. 300+ points = +10 🌱 per day'],
}
```

- [ ] **Step 4: Mount the game**

Find (around line 426-427):

```jsx
        {jogoAtivo === 'rotulos' && <JogoDetetiveRotulos onFechar={fecharJogo} />}
        {jogoAtivo === 'colheita' && <JogoColheita onFechar={fecharJogo} />}
```

Insert the new mount line between them:

```jsx
        {jogoAtivo === 'rotulos' && <JogoDetetiveRotulos onFechar={fecharJogo} />}
        {jogoAtivo === 'corrida' && <JogoCorridaEscolha onFechar={fecharJogo} />}
        {jogoAtivo === 'colheita' && <JogoColheita onFechar={fecharJogo} />}
```

- [ ] **Step 5: Add the game to the local demo harness**

In `demo/jogos.jsx`, add the import after `JogoDetetiveRotulos`:

```jsx
import JogoDetetiveRotulos from '../src/components/game/JogoDetetiveRotulos.jsx'
import JogoCorridaEscolha from '../src/components/game/JogoCorridaEscolha.jsx'
import MomentoMwa from '../src/components/hoje/MomentoMwa.jsx'
```

And add it to the `JOGOS` array:

```jsx
const JOGOS = [
  ['prato', 'Monte Seu Prato', MonteSeuPrato],
  ['vf', 'Verdadeiro, Falso ou Depende', JogoVerdadeiroFalso],
  ['troca', 'Troca Inteligente', JogoTrocaInteligente],
  ['saciedade', 'Batalha da Saciedade', JogoBatalhaSaciedade],
  ['rotulos', 'Detetive dos Rótulos', JogoDetetiveRotulos],
  ['corrida', 'Corrida da Escolha', JogoCorridaEscolha],
  ['momento', 'Momento MWA', MomentoMwa],
]
```

- [ ] **Step 6: Verify the app builds**

Run: `npm run build`
Expected: build succeeds with no new errors or warnings.

- [ ] **Step 7: Commit**

```bash
git add src/components/ferramentas/Ferramentas.jsx demo/jogos.jsx
git commit -m "feat: registra a Corrida da Escolha no hub de jogos"
```

---

### Task 7: Full test suite + manual verification

**Files:** none (verification only).

- [ ] **Step 1: Run the full automated test suite**

Run: `npm test`
Expected: PASS — every existing test still green, plus the new
`corrida.test.js` and `itensCorrida.test.js` suites from Tasks 1–2.

- [ ] **Step 2: Run the demo harness**

Run: `npm run demo-prato` (or whatever npm script maps to
`vite --config demo/vite.demo.config.js --port 5199`, per `.claude/launch.json`)
Open: `http://localhost:5199/jogos.html`

- [ ] **Step 3: Manual checks — controls**

- Click "Corrida da Escolha" to open it, click "Começar corrida".
- Confirm the avatar starts in the middle lane.
- Press `←`/`→`: avatar moves one lane at a time, clamped at the edges (no
  wrap-around, no moving past lane 0 or lane 2).
- Click directly on the left/right lane strip: avatar jumps there.
- On a touch device or the browser's mobile emulation, swipe left/right:
  avatar changes lane (swipes shorter than ~40px should do nothing).

- [ ] **Step 4: Manual checks — collisions and totals**

- Let the avatar catch a few healthy items (fruit/veggie icons): each shows
  a brief green "+", no visible penalty.
- Let a few unhealthy items hit the avatar: each shows a brief tremor/shake
  and a red "!", the run does **not** stop or reset.
- Let some items of both kinds pass in lanes the avatar isn't in: confirm
  they simply disappear with no effect.
- Confirm the top progress bar visibly shrinks over the ~35s run, and the
  game gets noticeably busier (more items, faster falls) near the end.

- [ ] **Step 5: Manual checks — result screen**

- After the timer ends, confirm the result screen shows: star rating,
  the two-color kcal bar, "Você comeu X kcal" vs. "Com desvio perfeito Y
  kcal" (Y should exactly equal the healthy-kcal number), the "+N kcal por
  não desviar de M itens" line (or the "desvio perfeito" message if zero
  unhealthy items were eaten), and a lesson sentence that changes with
  performance.
- Click "Jogar de novo": confirm state fully resets (lane back to center,
  totals back to zero, timer restarts).

- [ ] **Step 6: Manual checks — reward and record (demo has `userId: null`)**

- Confirm the console shows `[demo] registrarJogoCorrida chamado (recompensa
  simulada)` when finishing a run with ≥50% healthy kcal, and the "+10 🌱"
  text appears on screen.
- Finishing a run below 50% healthy: confirm no reward message and no
  console log.
- Confirm no crash and no "seu recorde" line appears in this demo mode
  (expected — `carregarProgressoJogo` returns `[]` when `userId` is `null`,
  same as the real app for a logged-out session).

- [ ] **Step 7: Manual checks in the real app (requires a logged-in session)**

- Open Ferramentas → Jogos de Nutrição → "Corrida da Escolha".
- Play once ending with ≥50% healthy kcal: confirm +10 🌱 is added to the
  visible seed count and the "seu recorde" line appears on the next open.
- Play a second time the same day: confirm no second reward is granted
  (dedup via `premiar`, same as every other game) but the recorde can still
  update if you beat the previous best %.

- [ ] **Step 8: Close the loop**

If any manual check fails, fix the underlying code in the relevant task's
file, re-run `npm test` and `npm run build`, and re-verify. No commit is
needed for this task unless a fix was required — in which case commit that
fix on its own with a message describing what was wrong.
