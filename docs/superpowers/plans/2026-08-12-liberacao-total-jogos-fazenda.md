# Liberação Total: Jogos e Fazenda desde o Dia 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the day-based unlock gates from the 6 games and the 8 farm plots (canteiros) so everything is accessible from day 1, and change plot growth from automatic (by calendar day) to earned (by number of times the person cares for that specific plot).

**Architecture:** Three independent-but-sequential changes. (1) `jogosLiberacao.js` + `Ferramentas.jsx`: delete the game unlock gate entirely — no replacement mechanic needed, games are just always open. (2) `crescimento.js`: the farm's pure growth engine changes its input from `diaAtual` to a `contagens` map (`{ pilarId: totalTimesCaredFor }`) — `pilarLiberado`/`diaLiberacaoPilar` are deleted (access is no longer gated), `estagioDoPilar` is recomputed from the count instead of elapsed days. (3) `MwaFarm.jsx`: adds a `contagens` state persisted in `localStorage`, increments it on `cuidar()`, removes every UI branch that referenced the old `liberado`/`bloqueado` state, and adds a short reminder line when today's care isn't finished yet.

**Tech Stack:** React (JSX, hooks), plain `localStorage` for persistence (no Supabase table involved — this feature never had one), `node:test` + `node:assert/strict` for the pure-logic tests in `crescimento.test.js`, Vite build for production verification.

## Global Constraints

- Full spec: `docs/superpowers/specs/2026-08-12-liberacao-total-jogos-fazenda-design.md`.
- Every user-facing string needs both a PT-BR and an EN string (the app has an `ingles` toggle via `useIdioma()`) — copy every new/changed line in both languages exactly as given in this plan.
- No punitive framing: missed days must never regress or "wilt" a plot — only pause its growth.
- Do not touch: `nivelLiberado` (Monte Seu Prato mission-star gate), `decoracoesLiberadas`/`resumo.decoracoes` (unused elsewhere, out of scope), `FASES_FARM`/`indiceFase`/`mensagemDoDia` (day-based background scenery, a separate system from per-plot growth).
- No new Supabase table or migration — this feature is 100% local (`localStorage`), matching how it already works today.

---

### Task 1: Jogos sempre liberados (remove day gate from the 6 games)

**Files:**
- Modify: `src/utils/jogosLiberacao.js`
- Modify: `src/components/ferramentas/Ferramentas.jsx:12` (import), `:283-311` (`CardJogo`), `:315` (`useApp()` destructure), `:379` and `:390` (`<CardJogo>` call sites)

**Interfaces:**
- Produces: `ORDEM_JOGOS` (unchanged export, still an array of 6 game id strings) — no other file in the codebase currently imports `jogoLiberado`/`diaLiberacaoJogo`, confirmed by grep; this task removes both with no other caller to update.

- [ ] **Step 1: Rewrite `src/utils/jogosLiberacao.js`**

Replace the entire file content with:

```js
// Todos os jogos ficam disponíveis desde o primeiro dia do programa.
export const ORDEM_JOGOS = ['colheita', 'prato', 'vf', 'troca', 'saciedade', 'rotulos']
```

This deletes `DIAS_LIBERACAO`, `diaLiberacaoJogo`, and `jogoLiberado` — nothing else in the codebase imports them (verified: `grep -rn "jogoLiberado\|diaLiberacaoJogo" src` only matches this file and `Ferramentas.jsx`, which Step 2 fixes).

- [ ] **Step 2: Remove the gate from `CardJogo` in `Ferramentas.jsx`**

Remove the import at line 12:

```js
// delete this line
import { diaLiberacaoJogo, jogoLiberado } from '../../utils/jogosLiberacao.js'
```

Replace the `CardJogo` function (current lines 283-311):

```jsx
function CardJogo({ jogo, diaAtual, ingles, onAbrir }) {
  const liberado = jogoLiberado(jogo.id, diaAtual)
  return (
    <button
      type="button"
      onClick={liberado ? () => onAbrir(jogo.id) : undefined}
      disabled={!liberado}
      className={`mt-3 flex w-full items-center gap-4 rounded-2xl p-5 text-left transition-transform ${
        liberado
          ? 'bg-gradient-to-r from-sage-claro to-ouro-claro active:scale-[0.99]'
          : 'cursor-not-allowed bg-cinza/50 opacity-70'
      }`}
    >
      <span className="text-3xl">{liberado ? jogo.emoji : '🔒'}</span>
      <span className="flex-1">
        <span className="block font-serif text-lg font-semibold italic text-verde">
          {ingles ? JOGOS_EN[jogo.id][0] : jogo.titulo}
        </span>
        <span className="text-sm text-verde/80">
          {liberado
            ? ingles ? JOGOS_EN[jogo.id][1] : jogo.desc
            : ingles
              ? `Unlocks on day ${diaLiberacaoJogo(jogo.id)} of your program`
              : `Libera no dia ${diaLiberacaoJogo(jogo.id)} do seu programa`}
        </span>
      </span>
    </button>
  )
}
```

with:

```jsx
function CardJogo({ jogo, ingles, onAbrir }) {
  return (
    <button
      type="button"
      onClick={() => onAbrir(jogo.id)}
      className="mt-3 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
    >
      <span className="text-3xl">{jogo.emoji}</span>
      <span className="flex-1">
        <span className="block font-serif text-lg font-semibold italic text-verde">
          {ingles ? JOGOS_EN[jogo.id][0] : jogo.titulo}
        </span>
        <span className="text-sm text-verde/80">
          {ingles ? JOGOS_EN[jogo.id][1] : jogo.desc}
        </span>
      </span>
    </button>
  )
}
```

- [ ] **Step 3: Update the two `<CardJogo>` call sites (lines 379 and 390) to drop `diaAtual`**

Both lines currently read:

```jsx
<CardJogo key={jogo.id} jogo={jogo} diaAtual={diaAtual} ingles={ingles} onAbrir={setJogoAtivo} />
```

Change both to:

```jsx
<CardJogo key={jogo.id} jogo={jogo} ingles={ingles} onAbrir={setJogoAtivo} />
```

- [ ] **Step 4: Remove the now-unused `diaAtual` destructure (line 315)**

`diaAtual` was only ever used to pass into `CardJogo` (games are the only day-gated thing `Ferramentas.jsx` reads `diaAtual` for). After Step 3, it's dead. Change:

```js
  const { ingles } = useIdioma()
  const { diaAtual } = useApp()
```

to:

```js
  const { ingles } = useIdioma()
```

Verify first with `grep -n "diaAtual" src/components/ferramentas/Ferramentas.jsx` that no other line in the file references it before deleting — if a later step in this plan or a review turns one up, keep the destructure and only drop the prop-passing.

- [ ] **Step 5: Run the full test suite and production build**

```bash
npm test
npm run build
```

Expected: all existing tests still pass (none reference `jogosLiberacao.js`), build succeeds with no unused-import errors.

- [ ] **Step 6: Commit**

```bash
git add src/utils/jogosLiberacao.js src/components/ferramentas/Ferramentas.jsx
git commit -m "feat: libera todos os jogos desde o dia 1"
```

---

### Task 2: Motor de crescimento passa a depender de cuidados (TDD)

**Files:**
- Modify: `src/utils/farm/crescimento.js` (full rewrite)
- Modify: `src/utils/farm/crescimento.test.js` (full rewrite)

**Interfaces:**
- Consumes: `PILARES` from `src/data/farm/pilares.js` (array of 8 objects, each with `.id`; unchanged), `DECORACOES` from `src/data/farm/decoracoes.js` (unchanged).
- Produces (used by Task 3 / `MwaFarm.jsx`):
  - `estagioDoPilar(pilarId: string, contagens: Record<string, number> | undefined) => 0 | 1 | 2 | 3`
  - `decoracoesLiberadas(diaAtual: number | undefined) => Decoracao[]` (unchanged signature/behavior)
  - `resumoFazenda(contagens: Record<string, number> | undefined, diaAtual: number | undefined) => { pilares: Array<Pilar & { estagio: 0|1|2|3 }>, decoracoes: Decoracao[] }` — note the parameter order: `contagens` first, `diaAtual` second. Task 3 must call it as `resumoFazenda(contagens, dia)`.
  - `pilarLiberado` and `diaLiberacaoPilar` **no longer exist** — Task 3 must not import them.

- [ ] **Step 1: Write the new failing test file**

Replace the entire content of `src/utils/farm/crescimento.test.js` with:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { estagioDoPilar, decoracoesLiberadas, resumoFazenda } from './crescimento.js'
import { PILARES } from '../../data/farm/pilares.js'
import { DECORACOES } from '../../data/farm/decoracoes.js'

test('estagioDoPilar começa em semente (0) sem nenhum cuidado', () => {
  const pilar = PILARES[0].id
  assert.equal(estagioDoPilar(pilar, {}), 0)
  assert.equal(estagioDoPilar(pilar, { [pilar]: 0 }), 0)
})

test('estagioDoPilar avança 1 estágio a cada 10 cuidados e satura em 3 (plena)', () => {
  const pilar = PILARES[0].id
  assert.equal(estagioDoPilar(pilar, { [pilar]: 9 }), 0) // ainda semente
  assert.equal(estagioDoPilar(pilar, { [pilar]: 10 }), 1) // broto
  assert.equal(estagioDoPilar(pilar, { [pilar]: 20 }), 2) // floração
  assert.equal(estagioDoPilar(pilar, { [pilar]: 30 }), 3) // plena
  assert.equal(estagioDoPilar(pilar, { [pilar]: 500 }), 3) // satura, nunca passa de 3
})

test('estagioDoPilar tolera contagens ausentes, undefined ou id desconhecido sem quebrar', () => {
  const pilar = PILARES[0].id
  assert.equal(estagioDoPilar(pilar, undefined), 0)
  assert.equal(estagioDoPilar(pilar, {}), 0)
  assert.equal(estagioDoPilar('inexistente', { [pilar]: 50 }), 0)
})

test('decoracoesLiberadas cresce exatamente nos limites dos marcos', () => {
  assert.equal(decoracoesLiberadas(10).length, 0)
  assert.equal(decoracoesLiberadas(11).length, 1) // galinha
  assert.equal(decoracoesLiberadas(14).length, 1)
  assert.equal(decoracoesLiberadas(15).length, 2) // + cerca
  assert.equal(decoracoesLiberadas(90).length, DECORACOES.length) // tudo liberado
})

test('resumoFazenda agrega os 8 pilares (com estagio) e as decorações', () => {
  const contagens = { [PILARES[0].id]: 15, [PILARES[7].id]: 5 }
  const resumo = resumoFazenda(contagens, 30)
  assert.equal(resumo.pilares.length, 8)
  assert.ok(resumo.pilares.every((p) => 'estagio' in p))
  assert.equal(resumo.pilares.find((p) => p.id === PILARES[0].id).estagio, 1) // 15 cuidados = broto
  assert.equal(resumo.pilares.find((p) => p.id === PILARES[7].id).estagio, 0) // 5 cuidados = semente
  assert.ok(Array.isArray(resumo.decoracoes))
  assert.equal(resumo.decoracoes.length, decoracoesLiberadas(30).length)
})

test('resumoFazenda com contagens e diaAtual ausentes não quebra', () => {
  const resumo = resumoFazenda(undefined, undefined)
  assert.equal(resumo.pilares.length, 8)
  assert.ok(resumo.pilares.every((p) => p.estagio === 0))
  assert.equal(resumo.decoracoes.length, decoracoesLiberadas(1).length)
})
```

- [ ] **Step 2: Run the test file to confirm it fails**

```bash
node --test src/utils/farm/crescimento.test.js
```

Expected: FAIL — `estagioDoPilar` still expects `(pilarId, diaAtual)` and `resumoFazenda` still expects `(diaAtual)` only, so the new call shapes produce wrong values (old `estagioDoPilar` will treat the `contagens` object as `diaAtual`, `diaSeguro` coerces it to `1`, and every assertion about stage-by-count will fail).

- [ ] **Step 3: Rewrite the implementation**

Replace the entire content of `src/utils/farm/crescimento.js` with:

```js
// Motor de crescimento da MWA FARM — funções puras, sem UI, sem banco.
// O crescimento de cada canteiro depende de quantas vezes a pessoa cuidou
// dele (contagens), não do dia do programa. A leitura/persistência dessas
// contagens é responsabilidade de quem chama (MwaFarm.jsx), do mesmo jeito
// que MwaFarm.jsx já lê/persiste o registro de cuidados do dia.

import { PILARES } from '../../data/farm/pilares.js'
import { DECORACOES } from '../../data/farm/decoracoes.js'

const CUIDADOS_POR_ESTAGIO = 10
const ESTAGIO_MAXIMO = 3 // 0=semente, 1=broto, 2=floração, 3=plena

export function estagioDoPilar(pilarId, contagens) {
  const contagem = contagens?.[pilarId] ?? 0
  return Math.min(ESTAGIO_MAXIMO, Math.floor(contagem / CUIDADOS_POR_ESTAGIO))
}

function diaSeguro(diaAtual) {
  return diaAtual ?? 1
}

export function decoracoesLiberadas(diaAtual) {
  const dia = diaSeguro(diaAtual)
  return DECORACOES.filter((d) => dia >= d.dia)
}

// Único ponto de entrada que a tela (MwaFarm.jsx) precisa chamar.
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

- [ ] **Step 4: Run the test file to confirm it passes**

```bash
node --test src/utils/farm/crescimento.test.js
```

Expected: PASS, all 6 tests green.

- [ ] **Step 5: Run the full suite and build**

```bash
npm test
npm run build
```

Expected: everything passes — no other file imports `pilarLiberado`/`diaLiberacaoPilar` yet at this point in the plan (Task 3 removes the only caller in the same PR sequence), but `MwaFarm.jsx` still calls `resumoFazenda(dia)` with the old single-argument shape until Task 3 lands. **This is expected to leave the app in a temporarily broken runtime state between Task 2 and Task 3** (the build itself will still succeed — it's a JS runtime behavior break, not a syntax error — but don't deploy/preview between these two tasks). If you need a working checkpoint at every task boundary, do Task 3 in the same sitting immediately after Task 2.

- [ ] **Step 6: Commit**

```bash
git add src/utils/farm/crescimento.js src/utils/farm/crescimento.test.js
git commit -m "feat: crescimento da fazenda passa a depender de cuidados, nao do dia"
```

---

### Task 3: MwaFarm.jsx — acesso sempre liberado, contagens, lembrete

**Files:**
- Modify: `src/components/game/MwaFarm.jsx`

**Interfaces:**
- Consumes: `resumoFazenda(contagens, diaAtual)` and `estagioDoPilar(pilarId, contagens)` from Task 2's `crescimento.js`.
- No exports — this is a leaf UI component (default export `MwaFarm({ onFechar })`, unchanged signature).

- [ ] **Step 1: Update imports (lines 1-10)**

Change:

```js
import { Droplets, Hand, LockKeyhole, Sparkles, Sprout, X } from 'lucide-react'
```

to:

```js
import { Droplets, Hand, Sparkles, Sprout, X } from 'lucide-react'
```

Change:

```js
import { resumoFazenda } from '../../utils/farm/crescimento.js'
```

to:

```js
import { resumoFazenda, estagioDoPilar } from '../../utils/farm/crescimento.js'
```

- [ ] **Step 2: Add contagens persistence helpers, right after `lerCuidados` (after line 58, before `export default function MwaFarm`)**

Insert:

```js
const CHAVE_CONTAGENS = 'mwa-farm-contagens'

function lerContagens() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CONTAGENS) || '{}')
  } catch {
    return {}
  }
}
```

- [ ] **Step 3: Add `contagens` state and fix `resumo` (lines 63-67)**

Change:

```js
  const [selecionado, setSelecionado] = useState(null)
  const [cuidados, setCuidados] = useState([])
  const dialogRef = useRef(null)
  const dia = Math.min(90, Math.max(1, diaAtual ?? 1))
  const resumo = useMemo(() => resumoFazenda(dia), [dia])
```

to:

```js
  const [selecionado, setSelecionado] = useState(null)
  const [cuidados, setCuidados] = useState([])
  const [contagens, setContagens] = useState(lerContagens)
  const dialogRef = useRef(null)
  const dia = Math.min(90, Math.max(1, diaAtual ?? 1))
  const resumo = useMemo(() => resumoFazenda(contagens, dia), [contagens, dia])
```

- [ ] **Step 4: Simplify `abrirPilar` (lines 88-105) — no more locked branch**

Change:

```js
  function abrirPilar(pilar) {
    if (!pilar.liberado) {
      setSelecionado({
        ...pilar,
        bloqueado: true,
        titulo: ingles ? `This garden awakens on day ${pilar.diaLiberacao}` : `Este canteiro desperta no dia ${pilar.diaLiberacao}`,
        texto: ingles ? 'Keep caring for what is already growing.' : 'Continue cuidando do que já está crescendo.',
      })
      return
    }
    setSelecionado({
      ...pilar,
      titulo: ingles ? pilar.tituloHabitoEN : pilar.tituloHabito,
      nome: ingles ? pilar.nomeEN : pilar.nome,
      texto: ingles ? pilar.textoEducativoEN : pilar.textoEducativo,
      estagioTexto: (ingles ? ESTAGIOS_EN : ESTAGIOS)[pilar.estagio],
    })
  }
```

to:

```js
  function abrirPilar(pilar) {
    setSelecionado({
      ...pilar,
      titulo: ingles ? pilar.tituloHabitoEN : pilar.tituloHabito,
      nome: ingles ? pilar.nomeEN : pilar.nome,
      texto: ingles ? pilar.textoEducativoEN : pilar.textoEducativo,
      estagioTexto: (ingles ? ESTAGIOS_EN : ESTAGIOS)[pilar.estagio],
    })
  }
```

- [ ] **Step 5: Update `cuidar` to increment and persist `contagens` (lines 107-113)**

Change:

```js
  function cuidar(pilar) {
    if (!pilar?.liberado || cuidados.includes(pilar.id)) return
    const novos = [...cuidados, pilar.id]
    setCuidados(novos)
    localStorage.setItem(chaveCuidado(dia), JSON.stringify(novos))
    setSelecionado({ ...pilar, concluidoAgora: true })
  }
```

to:

```js
  function cuidar(pilar) {
    if (!pilar || cuidados.includes(pilar.id)) return
    const novos = [...cuidados, pilar.id]
    setCuidados(novos)
    localStorage.setItem(chaveCuidado(dia), JSON.stringify(novos))
    const novasContagens = { ...contagens, [pilar.id]: (contagens[pilar.id] ?? 0) + 1 }
    setContagens(novasContagens)
    localStorage.setItem(CHAVE_CONTAGENS, JSON.stringify(novasContagens))
    setSelecionado({ ...pilar, estagio: estagioDoPilar(pilar.id, novasContagens), concluidoAgora: true })
  }
```

The `estagio: estagioDoPilar(...)` in the new `selecionado` matters: it makes the confirmation screen's plant icon reflect the *just-earned* stage immediately (e.g. if this care action was the 10th and pushed the plot from semente to broto, the icon updates right away instead of waiting for the next render of `resumo`).

- [ ] **Step 6: Replace `liberados`/`todosCuidados` (lines 115-116)**

Change:

```js
  const liberados = resumo.pilares.filter((p) => p.liberado)
  const todosCuidados = liberados.length > 0 && liberados.every((p) => cuidados.includes(p.id))
```

to:

```js
  const todosCuidados = resumo.pilares.length > 0 && resumo.pilares.every((p) => cuidados.includes(p.id))
```

- [ ] **Step 7: Simplify the hotspot buttons (lines 161-181) — no locked variant**

Change:

```jsx
          {resumo.pilares.map((pilar) => {
            const area = AREAS_POR_ID[pilar.id]
            if (!area) return null
            return (
              <div key={pilar.id}>
                <button
                  type="button"
                  onClick={() => abrirPilar(pilar)}
                  style={{ left: area.left, top: area.top, width: area.width, height: area.height }}
                  className={`mwa-farm-hotspot absolute z-10 rounded-[35%] transition ${pilar.liberado ? 'hover:bg-white/10 focus:bg-white/10' : 'bg-[#24352b]/20'}`}
                  aria-label={pilar.liberado ? (ingles ? pilar.tituloHabitoEN : pilar.tituloHabito) : `${pilar.nome}, ${ingles ? 'locked' : 'bloqueado'}`}
                >
                  <span className="sr-only">
                    {pilar.liberado
                      ? (ingles ? 'Open habit garden' : 'Abrir canteiro do hábito')
                      : (ingles ? `Unlocks on day ${pilar.diaLiberacao}` : `Libera no dia ${pilar.diaLiberacao}`)}
                  </span>
                </button>
              </div>
            )
          })}
```

to:

```jsx
          {resumo.pilares.map((pilar) => {
            const area = AREAS_POR_ID[pilar.id]
            if (!area) return null
            return (
              <div key={pilar.id}>
                <button
                  type="button"
                  onClick={() => abrirPilar(pilar)}
                  style={{ left: area.left, top: area.top, width: area.width, height: area.height }}
                  className="mwa-farm-hotspot absolute z-10 rounded-[35%] transition hover:bg-white/10 focus:bg-white/10"
                  aria-label={ingles ? pilar.tituloHabitoEN : pilar.tituloHabito}
                >
                  <span className="sr-only">{ingles ? 'Open habit garden' : 'Abrir canteiro do hábito'}</span>
                </button>
              </div>
            )
          })}
```

- [ ] **Step 8: Add the care reminder and fix the counts line (lines 185-193)**

Change:

```jsx
        <section className="relative z-30 border-t-2 border-[#f4d992] bg-[#fff8e8] px-5 py-4 text-center shadow-[0_-8px_24px_rgba(35,75,43,.14)]">
          <Sparkles className="mx-auto mb-1 text-[#d4a538]" size={19} />
          <p className="font-serif text-base font-black italic leading-snug text-[#315c3a]">
            {todosCuidados ? (ingles ? 'Your whole farm was cared for today. Come back tomorrow to keep growing!' : 'Toda a sua fazenda foi cuidada hoje. Volte amanhã para continuar florescendo!') : mensagemDoDia(dia, ingles)}
          </p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#8e7443]">
            {ingles ? `${cuidados.length} of ${liberados.length} gardens cared for today` : `${cuidados.length} de ${liberados.length} canteiros cuidados hoje`}
          </p>
        </section>
```

to:

```jsx
        <section className="relative z-30 border-t-2 border-[#f4d992] bg-[#fff8e8] px-5 py-4 text-center shadow-[0_-8px_24px_rgba(35,75,43,.14)]">
          <Sparkles className="mx-auto mb-1 text-[#d4a538]" size={19} />
          <p className="font-serif text-base font-black italic leading-snug text-[#315c3a]">
            {todosCuidados ? (ingles ? 'Your whole farm was cared for today. Come back tomorrow to keep growing!' : 'Toda a sua fazenda foi cuidada hoje. Volte amanhã para continuar florescendo!') : mensagemDoDia(dia, ingles)}
          </p>
          {!todosCuidados && (
            <p className="mt-1 text-xs font-bold text-[#5c8a4a]">
              {ingles ? 'Care for your plots to watch them bloom.' : 'Cuide dos canteiros para vê-los florescer.'}
            </p>
          )}
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#8e7443]">
            {ingles ? `${cuidados.length} of ${resumo.pilares.length} gardens cared for today` : `${cuidados.length} de ${resumo.pilares.length} canteiros cuidados hoje`}
          </p>
        </section>
```

- [ ] **Step 9: Drop the lock icon branch in the detail modal (line 200)**

Change:

```jsx
                  {selecionado.bloqueado ? <LockKeyhole className="text-[#6a7957]" /> : selecionado.animal ? <Sparkles className="text-[#c08e2f]" /> : <PlantaFazenda estagio={selecionado.estagio} cor={selecionado.cor} coroaId={selecionado.coroaId} tamanho={52} />}
```

to:

```jsx
                  {selecionado.animal ? <Sparkles className="text-[#c08e2f]" /> : <PlantaFazenda estagio={selecionado.estagio} cor={selecionado.cor} coroaId={selecionado.coroaId} tamanho={52} />}
```

- [ ] **Step 10: Always show the "cuidar" button (line 212)**

Change:

```jsx
              {selecionado.liberado && !selecionado.concluidoAgora && (
```

to:

```jsx
              {!selecionado.concluidoAgora && (
```

- [ ] **Step 11: Run the full test suite and production build**

```bash
npm test
npm run build
```

Expected: all tests pass (Task 2's rewritten `crescimento.test.js` plus everything else untouched), build succeeds with no unused-import errors (`LockKeyhole` must be gone from the `lucide-react` import — a leftover unused import will not fail the Vite build but will fail a lint pass if one runs in CI; double-check by grepping `LockKeyhole` in the file and confirming zero matches).

- [ ] **Step 12: Manual verification in the browser**

Start the dev server and open the app to the Ferramentas tab.

1. Confirm all 6 game cards are clickable immediately (no lock icon, no "Libera no dia X" text) regardless of what day the test account is on.
2. Open MWA FARM. Confirm all 8 plots are clickable (no lock icon on any hotspot) and each opens its detail sheet with a "Plantar hoje" / "Regar hoje" button enabled.
3. Click "cuidar" on one plot. Confirm the confirmation screen shows "Cuidado concluído!" and the button becomes disabled/"Cuidado hoje" if you reopen that same plot the same day.
4. Confirm the reminder line "Cuide dos canteiros para vê-los florescer." shows below the daily message while at least one plot is still uncared-for today, and disappears once all 8 are cared for today (use the browser devtools console to pre-seed `localStorage.setItem('mwa-farm-cuidado-dia-<dia>', JSON.stringify([...8 plot ids]))` to simulate "all cared for" without waiting 8 real interactions, where `<dia>` is whatever `diaAtual` the test account currently has).
5. Confirm growth actually happens: in devtools console, run `localStorage.setItem('mwa-farm-contagens', JSON.stringify({ alimentacao: 10 }))`, reload, open the "Alimentação" plot, and confirm it now shows the "broto" stage art/text instead of "semente".

- [ ] **Step 13: Commit**

```bash
git add src/components/game/MwaFarm.jsx
git commit -m "feat: fazenda sempre acessivel, crescimento por cuidado e lembrete diario"
```

---

## Post-plan check

After Task 3 lands, grep the whole `src/` tree for the deleted symbols to confirm nothing was missed:

```bash
grep -rn "pilarLiberado\|diaLiberacaoPilar\|jogoLiberado\|diaLiberacaoJogo\|LockKeyhole" src
```

Expected: no matches.
