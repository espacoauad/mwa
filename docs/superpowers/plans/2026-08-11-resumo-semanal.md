# Resumo Semanal Inteligente Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every Sunday, open a modal showing a "Retrato da Semana" — the person's 2 strongest habits (of 4 tracked: meal logging, water goal, protein goal, exercise logging), the weakest one with a matching suggestion, or a gentle catch-all message for a quiet week.

**Architecture:** Pure selection logic (which metrics count as "strong"/"weak", and all copy) lives in a new `.js` util, testable with `node --test`. A new modal component fetches its own week of data on mount (same self-contained pattern `Conclusao90Dias.jsx` already uses) and calls the pure function to decide what to render. `AppContext` gains a Sunday-triggered, once-per-week open condition using the same `localStorage`-flag pattern as `ConclusaoDia`/`Conclusao30Dias`/`Conclusao90Dias`.

**Tech Stack:** React 18 (Vite), Tailwind, Supabase (Postgres + JS client), `node --test` for pure-function unit tests.

## Global Constraints

- No new database tables, columns, or migrations — everything is computed live from `mwa_refeicoes` + `mwa_refeicoes_itens`, `mwa_agua`, `mwa_exercicios`, plus a `localStorage` flag for "already shown this week" (no DB write for that either).
- The week is Monday-Sunday, using the existing `diasDaSemana(hojeISO)` from `src/utils/jogos/estrelas.js` — do not reimplement week-boundary math.
- A metric only counts as a "ponto forte" if its weekly count is ≥ 3 days. If fewer than 1 metric qualifies, show the "semana parada" message instead of forcing a strength/weakness split.
- "Ponto de atenção" is the single weakest metric, UNLESS its count equals the strongest metric's count (all 4 tied) — in that case show no ponto de atenção. Compare against the strongest metric's count, not against membership in the `pontosFortes` array (a metric tied with the top 2 is never literally *in* that array because it's capped at 2 entries, even in a 4-way tie — comparing counts is the correct check, comparing array membership is not).
- Every piece of user-facing copy (the "forte" fragments, the 4 "ponto de atenção" sentences, the "semana parada" message) is fixed, copied verbatim below — do not paraphrase.
- No React component-testing harness exists in this repo (`node --test` runs plain `.js` files only, cannot import `.jsx`) — `ResumoSemanal.jsx` is verified manually in a browser (last task), not via automated component tests.

---

### Task 1: Pure selection logic and copy in `src/utils/resumoSemanal.js`

**Files:**
- Create: `src/utils/resumoSemanal.js`
- Test: `src/utils/resumoSemanal.test.js`

**Interfaces:**
- Produces (all named exports):
  - `FORTE_FRAGMENTO` — `Record<'refeicao'|'agua'|'proteina'|'exercicio', string>`.
  - `ATENCAO_FRASE` — `Record<'refeicao'|'agua'|'proteina'|'exercicio', (n: number) => string>`.
  - `MENSAGEM_SEMANA_PARADA` — `string`.
  - `calcularResumoSemanal({ dias, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia, metaProteina, metaAguaMl }) => { contadores: {refeicao,agua,proteina,exercicio}, pontosFortes: Array<{chave,n}>, pontoAtencao: {chave,n}|null, semanaParada: boolean }` — consumed by Task 2.
- Consumes: nothing external (pure function + data).

- [ ] **Step 1: Write the failing tests**

Create `src/utils/resumoSemanal.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularResumoSemanal } from './resumoSemanal.js'

const DIAS = ['2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09']

function mapaDe(dias, valores) {
  const mapa = new Map()
  dias.forEach((d, i) => {
    if (valores[i] !== undefined) mapa.set(d, valores[i])
  })
  return mapa
}

test('semana com 2 metricas fortes (>=3 dias) mostra as 2 mais altas e a mais fraca como ponto de atencao', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, true, true, true, false, false]) // 5
  const aguaPorDia = mapaDe(DIAS, [2000, 2000, 2000, 2000, 1000, 1000, 1000]) // 4 dias >= meta
  const proteinaPorDia = mapaDe(DIAS, [50, 50, 0, 0, 0, 0, 0]) // 2 dias >= meta
  const exercicioPorDia = mapaDe(DIAS, [true, false, false, false, false, false, false]) // 1

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.contadores, { refeicao: 5, agua: 4, proteina: 2, exercicio: 1 })
  assert.deepEqual(resultado.pontosFortes, [{ chave: 'refeicao', n: 5 }, { chave: 'agua', n: 4 }])
  assert.deepEqual(resultado.pontoAtencao, { chave: 'exercicio', n: 1 })
  assert.equal(resultado.semanaParada, false)
})

test('semana com só 1 métrica forte não força uma segunda', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, true, true, false, false, false]) // 4
  const aguaPorDia = mapaDe(DIAS, [2000, 2000, 1000, 1000, 1000, 1000, 1000]) // 2
  const proteinaPorDia = mapaDe(DIAS, [50, 50, 0, 0, 0, 0, 0]) // 2
  const exercicioPorDia = mapaDe(DIAS, [true, false, false, false, false, false, false]) // 1

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.pontosFortes, [{ chave: 'refeicao', n: 4 }])
  assert.deepEqual(resultado.pontoAtencao, { chave: 'exercicio', n: 1 })
})

test('semana parada (nenhuma métrica com 3+ dias) não mostra pontos fortes nem ponto de atenção', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, false, false, false, false, false]) // 2
  const aguaPorDia = mapaDe(DIAS, [2000, 1000, 1000, 1000, 1000, 1000, 1000]) // 1
  const proteinaPorDia = mapaDe(DIAS, []) // 0
  const exercicioPorDia = mapaDe(DIAS, [true, true, false, false, false, false, false]) // 2

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.pontosFortes, [])
  assert.equal(resultado.pontoAtencao, null)
  assert.equal(resultado.semanaParada, true)
})

test('empate total entre as 4 métricas não gera ponto de atenção', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, true, true, false, false, false]) // 4
  const aguaPorDia = mapaDe(DIAS, [2000, 2000, 2000, 2000, 1000, 1000, 1000]) // 4
  const proteinaPorDia = mapaDe(DIAS, [50, 50, 50, 50, 0, 0, 0]) // 4
  const exercicioPorDia = mapaDe(DIAS, [true, true, true, true, false, false, false]) // 4

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.contadores, { refeicao: 4, agua: 4, proteina: 4, exercicio: 4 })
  assert.deepEqual(resultado.pontosFortes, [{ chave: 'refeicao', n: 4 }, { chave: 'agua', n: 4 }])
  assert.equal(resultado.pontoAtencao, null)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/utils/resumoSemanal.test.js`
Expected: FAIL — `resumoSemanal.js` doesn't exist yet.

- [ ] **Step 3: Create `src/utils/resumoSemanal.js`**

```js
// Retrato da Semana: seleção de pontos fortes/ponto de atenção e copy fixa,
// sem IA — tudo derivado de 4 contadores (0-7) já rastreados pelo app.

export const FORTE_FRAGMENTO = {
  refeicao: 'registrou suas refeições',
  agua: 'bateu sua meta de água',
  proteina: 'bateu sua meta de proteína',
  exercicio: 'registrou exercícios',
}

export const ATENCAO_FRASE = {
  refeicao: (n) =>
    `O registro das refeições foi o que mais ficou de lado essa semana — só ${n} dos 7 dias. Que tal focar só em registrar o café da manhã na próxima semana? Não precisa ser tudo de uma vez.`,
  agua: (n) =>
    `A água foi o que mais escapou essa semana — a meta só foi batida em ${n} dos 7 dias. Uma sugestão simples: deixe uma garrafa cheia visível na mesa, ela lembra por você.`,
  proteina: (n) =>
    `A meta de proteína só foi batida em ${n} dos 7 dias essa semana. Vale reforçar uma fonte de proteína em cada refeição principal — não precisa ser perfeito, só mais presente.`,
  exercicio: (n) =>
    `O exercício foi o que mais ficou pra trás essa semana — só ${n} dos 7 dias. Comece pequeno: 15 minutos já contam.`,
}

export const MENSAGEM_SEMANA_PARADA =
  'Essa foi uma semana mais parada, e tudo bem — cada semana é diferente. Que tal escolher só uma coisa pequena pra focar na próxima?'

const ORDEM_METRICAS = ['refeicao', 'agua', 'proteina', 'exercicio']
const PISO_PONTO_FORTE = 3

// dias: as 7 datas ISO da semana (diasDaSemana). Os mapas *PorDia usam
// essas mesmas datas como chave — valor truthy (refeicao/exercicio) ou
// numérico (agua/proteina) para o dia em questão.
export function calcularResumoSemanal({
  dias,
  refeicoesPorDia,
  proteinaPorDia,
  aguaPorDia,
  exercicioPorDia,
  metaProteina,
  metaAguaMl,
}) {
  const contadores = {
    refeicao: dias.filter((d) => refeicoesPorDia.get(d)).length,
    agua: dias.filter((d) => (aguaPorDia.get(d) ?? 0) >= metaAguaMl).length,
    proteina: dias.filter((d) => (proteinaPorDia.get(d) ?? 0) >= metaProteina).length,
    exercicio: dias.filter((d) => exercicioPorDia.get(d)).length,
  }

  const ordenado = [...ORDEM_METRICAS].sort((a, b) => contadores[b] - contadores[a])

  const elegiveis = ordenado.filter((chave) => contadores[chave] >= PISO_PONTO_FORTE)
  const pontosFortes = elegiveis.slice(0, 2).map((chave) => ({ chave, n: contadores[chave] }))
  const semanaParada = pontosFortes.length === 0

  let pontoAtencao = null
  if (!semanaParada) {
    const maisFraca = ordenado[ordenado.length - 1]
    const maisForte = ordenado[0]
    if (contadores[maisFraca] !== contadores[maisForte]) {
      pontoAtencao = { chave: maisFraca, n: contadores[maisFraca] }
    }
  }

  return { contadores, pontosFortes, pontoAtencao, semanaParada }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/utils/resumoSemanal.test.js`
Expected: PASS, all 4 tests green.

- [ ] **Step 5: Run the full test suite to check for regressions**

Run: `npm test`
Expected: PASS (one pre-existing unrelated failure in `src/data/farm/integridade.test.js` is expected).

- [ ] **Step 6: Commit**

```bash
git add src/utils/resumoSemanal.js src/utils/resumoSemanal.test.js
git commit -m "feat: adiciona logica pura e copy do resumo semanal"
```

---

### Task 2: `ResumoSemanal` modal component

**Files:**
- Create: `src/components/game/ResumoSemanal.jsx`

**Interfaces:**
- Consumes: `useApp()` → `sessao`, `metas`, `hoje`, `fecharResumoSemanal` (the last one is produced by Task 3, not yet implemented — this task creates the component in isolation; it won't be reachable in the running app until Task 3 wires the trigger and Task 4 mounts it). `diasDaSemana` from `src/utils/jogos/estrelas.js` (already exists). `calcularResumoSemanal`, `FORTE_FRAGMENTO`, `ATENCAO_FRASE`, `MENSAGEM_SEMANA_PARADA` from Task 1.
- Produces: default export `ResumoSemanal` (React component, no props) — consumed by Task 4.

- [ ] **Step 1: Create the component**

```jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { diasDaSemana } from '../../utils/jogos/estrelas.js'
import {
  calcularResumoSemanal,
  FORTE_FRAGMENTO,
  ATENCAO_FRASE,
  MENSAGEM_SEMANA_PARADA,
} from '../../utils/resumoSemanal.js'

export default function ResumoSemanal() {
  const { sessao, metas, hoje, fecharResumoSemanal } = useApp()
  const [resumo, setResumo] = useState(null)
  const dialogRef = useRef(null)

  const dias = useMemo(() => diasDaSemana(hoje), [hoje])

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') fecharResumoSemanal()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fecharResumoSemanal])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    const userId = sessao?.user?.id
    if (!userId || !metas) return
    let cancelado = false
    const primeiroDia = dias[0]
    const ultimoDia = dias[dias.length - 1]

    Promise.all([
      supabase
        .from('mwa_refeicoes')
        .select('data, mwa_refeicoes_itens(proteina)')
        .eq('user_id', userId)
        .gte('data', primeiroDia)
        .lte('data', ultimoDia),
      supabase
        .from('mwa_agua')
        .select('data, ml')
        .eq('user_id', userId)
        .gte('data', primeiroDia)
        .lte('data', ultimoDia),
      supabase
        .from('mwa_exercicios')
        .select('data')
        .eq('user_id', userId)
        .gte('data', primeiroDia)
        .lte('data', ultimoDia),
    ]).then(([refeicoesRes, aguaRes, exerciciosRes]) => {
      if (cancelado) return

      const refeicoesPorDia = new Map()
      const proteinaPorDia = new Map()
      for (const r of refeicoesRes.data ?? []) {
        refeicoesPorDia.set(r.data, true)
        const proteinaRefeicao = (r.mwa_refeicoes_itens ?? []).reduce(
          (soma, item) => soma + Number(item.proteina),
          0,
        )
        proteinaPorDia.set(r.data, (proteinaPorDia.get(r.data) ?? 0) + proteinaRefeicao)
      }

      const aguaPorDia = new Map()
      for (const a of aguaRes.data ?? []) {
        aguaPorDia.set(a.data, a.ml)
      }

      const exercicioPorDia = new Map()
      for (const e of exerciciosRes.data ?? []) {
        exercicioPorDia.set(e.data, true)
      }

      setResumo(
        calcularResumoSemanal({
          dias,
          refeicoesPorDia,
          proteinaPorDia,
          aguaPorDia,
          exercicioPorDia,
          metaProteina: metas.proteina,
          metaAguaMl: metas.aguaL * 1000,
        }),
      )
    })

    return () => {
      cancelado = true
    }
  }, [sessao, metas, dias])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-verde-escuro/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resumo-semanal-titulo"
    >
      <button
        type="button"
        onClick={fecharResumoSemanal}
        aria-label="Fechar"
        className="absolute right-4 top-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <X size={20} />
      </button>

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-sm shrink-0 rounded-[2.5rem] px-6 pb-8 pt-8 text-center outline-none"
        style={{ background: 'linear-gradient(135deg, #5a8a50 0%, #6d9a5f 40%, #7db567 100%)' }}
      >
        <p id="resumo-semanal-titulo" className="font-serif text-xl font-bold italic text-white">
          Retrato da sua semana
        </p>

        {!resumo ? (
          <p className="mt-6 text-sm text-white/70">Calculando...</p>
        ) : resumo.semanaParada ? (
          <p className="mt-6 text-base leading-relaxed text-white">{MENSAGEM_SEMANA_PARADA}</p>
        ) : (
          <div className="mt-6 space-y-4 text-left">
            <p className="text-sm leading-relaxed text-white">
              {resumo.pontosFortes.length === 2 ? (
                <>
                  Você {FORTE_FRAGMENTO[resumo.pontosFortes[0].chave]} em {resumo.pontosFortes[0].n} dos 7 dias e{' '}
                  {FORTE_FRAGMENTO[resumo.pontosFortes[1].chave]} em {resumo.pontosFortes[1].n} dos 7 dias. Esses
                  foram seus pontos fortes nessa semana. 💪
                </>
              ) : (
                <>
                  Você {FORTE_FRAGMENTO[resumo.pontosFortes[0].chave]} em {resumo.pontosFortes[0].n} dos 7 dias —
                  isso foi seu ponto forte na semana.
                </>
              )}
            </p>
            {resumo.pontoAtencao && (
              <p className="text-sm leading-relaxed text-white/90">
                {ATENCAO_FRASE[resumo.pontoAtencao.chave](resumo.pontoAtencao.n)}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={fecharResumoSemanal}
          className="mt-6 w-full rounded-2xl bg-ouro px-4 py-3 text-sm font-bold text-verde-escuro hover:brightness-105"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run the production build to check for errors**

Run: `npm run build`
Expected: succeeds (this file isn't imported anywhere yet, so this only checks syntax/imports resolve).

- [ ] **Step 3: Commit**

```bash
git add src/components/game/ResumoSemanal.jsx
git commit -m "feat: cria o modal do Retrato da Semana"
```

---

### Task 3: Sunday trigger in `AppContext`

**Files:**
- Modify: `src/context/AppContext.jsx`

**Interfaces:**
- Consumes: `diasDaSemana` (already imported in this file from `../utils/jogos/estrelas.js`).
- Produces (added to the context value consumed by Task 4):
  - `resumoSemanalAberto: boolean`
  - `fecharResumoSemanal() => void`

- [ ] **Step 1: Add the `resumoSemanalAberto` state**

In `src/context/AppContext.jsx`, right after the existing `modoRecomecarAberto` state declaration (currently line 121):

```js
  // Modo Recomeçar: acolhimento ao voltar após dias sem abrir o app
  const [modoRecomecarAberto, setModoRecomecarAberto] = useState(false)
  // Retrato da Semana: resumo semanal aberto aos domingos
  const [resumoSemanalAberto, setResumoSemanalAberto] = useState(false)
```

- [ ] **Step 2: Add the Sunday-trigger effect**

Right after the existing "Ao chegar no dia 90..." effect block (currently ending at line 345, right before `const refeicoesHoje = useMemo(...)`), add:

```js
  // Aos domingos, mostra o "Retrato da Semana" — 1x por semana.
  useEffect(() => {
    if (!userId) return
    const diaSemana = new Date(`${hoje}T00:00:00`).getDay()
    if (diaSemana !== 0) return
    const segundaDaSemana = diasDaSemana(hoje)[0]
    const chave = `mwa_resumo_semanal_${userId}_${segundaDaSemana}`
    if (localStorage.getItem(chave)) return
    localStorage.setItem(chave, '1')
    setResumoSemanalAberto(true)
  }, [hoje, userId])
```

- [ ] **Step 3: Add the close function**

Near the other `fecharConclusaoX`/`fecharModoRecomecar` functions (after `fecharModoRecomecar`, currently ending at line 421):

```js
  function fecharResumoSemanal() {
    setResumoSemanalAberto(false)
  }
```

- [ ] **Step 4: Expose the new state and function in the context value**

In the `valor` object, next to `conclusao90Aberta`/`fecharConclusao90` (currently lines 835-836):

```js
    conclusao90Aberta,
    fecharConclusao90,
    resumoSemanalAberto,
    fecharResumoSemanal,
```

- [ ] **Step 5: Run the full test suite and production build**

Run: `npm test`
Expected: PASS — this task only adds wiring, no new pure logic (covered by Task 1's tests).

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: adiciona gatilho de domingo do resumo semanal no AppContext"
```

---

### Task 4: Mount the modal in `Hoje.jsx`

**Files:**
- Modify: `src/components/hoje/Hoje.jsx`

**Interfaces:**
- Consumes: `ResumoSemanal` default export (Task 2), `resumoSemanalAberto` from `useApp()` (Task 3).

- [ ] **Step 1: Add the lazy import**

Next to the other game-modal lazy imports (currently lines 24-28):

```js
const LojaAvatar = lazy(() => import('../game/LojaAvatar.jsx'))
const ConclusaoDia = lazy(() => import('../game/ConclusaoDia.jsx'))
const Conclusao30Dias = lazy(() => import('../game/Conclusao30Dias.jsx'))
const Conclusao90Dias = lazy(() => import('../game/Conclusao90Dias.jsx'))
const ModoRecomecar = lazy(() => import('../game/ModoRecomecar.jsx'))
const ResumoSemanal = lazy(() => import('../game/ResumoSemanal.jsx'))
```

- [ ] **Step 2: Destructure `resumoSemanalAberto` from `useApp()`**

In the existing `useApp()` destructure block (currently lines 32-53), add it next to `modoRecomecarAberto`:

```js
    conclusao30Aberta,
    fecharConclusao30,
    conclusao90Aberta,
    modoRecomecarAberto,
    resumoSemanalAberto,
    atualizarFotoPerfil,
  } = useApp()
```

- [ ] **Step 3: Render the modal**

Right after the `modoRecomecarAberto` block (currently lines 412-417):

```jsx
      {/* Modo Recomeçar: acolhimento sem culpa ao voltar após dias sem abrir o app */}
      {modoRecomecarAberto && (
        <Suspense fallback={<CarregandoFallback />}>
          <ModoRecomecar />
        </Suspense>
      )}

      {/* Retrato da Semana: resumo inteligente aberto aos domingos */}
      {resumoSemanalAberto && (
        <Suspense fallback={<CarregandoFallback />}>
          <ResumoSemanal />
        </Suspense>
      )}
```

- [ ] **Step 4: Run the full test suite and production build**

Run: `npm test`
Expected: PASS

Run: `npm run build`
Expected: builds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/hoje/Hoje.jsx
git commit -m "feat: monta o Retrato da Semana na tela Hoje"
```

---

### Task 5: Manual verification in the browser

No React component-testing harness exists in this repo (see Global Constraints), so this feature's UI must be verified manually against a running dev server.

- [ ] **Step 1: Start the dev server and prepare a test account**

Use the project's normal dev workflow (`npm run dev`). Create (or reuse) a disposable test account, confirmed via Supabase and with onboarding completed.

- [ ] **Step 2: Seed a week of data for the "2 pontos fortes" scenario**

Via the Supabase MCP `execute_sql` tool (`project_id: kfavxgrvikflzyzvcoyb`), for the current Monday-Sunday week (use the actual current dates), insert rows so that:
- `mwa_refeicoes` (+ at least one `mwa_refeicoes_itens` row per meal with a `proteina` value) exist on 5 of the 7 days.
- `mwa_agua` rows exist on 4 of the 7 days with `ml` at or above the test account's water goal (check `mwa_perfis`/the app's own "Estratégia de Hidratação" card, or compute via the same formula as `calcularMetas`).
- `mwa_exercicios` rows exist on only 1 of the 7 days.
- No day has enough logged protein to hit the protein goal on more than 2 days (so `proteina` stays the lowest-eligible or below-threshold metric, matching Task 1's Step 1 hand-verified scenario).

- [ ] **Step 3: Force "today" to a Sunday within that week and clear the weekly flag**

In the browser, run (via the browser tooling's JS-execution capability):

```js
sessionStorage.setItem('mwaModorevisao', JSON.stringify({ ativo: true, diaVisualizacao: <dia do programa correspondente ao domingo da semana semeada> }))
```

(Use the same "Modo de Revisão" mechanism already used for day-90 testing elsewhere in this session — it overrides `diaAtual`, not the calendar date `hoje` used by this feature's Sunday check, so confirm separately that the real wall-clock date for the test falls on a Sunday, or adjust the seeded week in Step 2 to match whatever the next real Sunday is.)

Also clear any pre-existing weekly flag for this test account: remove any `localStorage` key starting with `mwa_resumo_semanal_` before reloading.

- [ ] **Step 4: Confirm the "2 pontos fortes" scenario renders correctly**

Reload. Confirm:
- The modal opens automatically.
- The pontos-fortes sentence names the 2 highest-count metrics from Step 2, with the correct day counts.
- The ponto-de-atenção sentence matches the weakest metric's fixed text from `ATENCAO_FRASE`, with the correct count substituted.
- Closing (via X or "Entendi") and reloading again does NOT reopen the modal (the `localStorage` flag persists).

- [ ] **Step 5: Confirm the "semana parada" scenario**

Clear the seeded week's data (or point at a different test account/week with all 4 metrics below 3 days) and clear the weekly `localStorage` flag again. Reload and confirm the modal shows only `MENSAGEM_SEMANA_PARADA`, with no pontos-fortes or ponto-de-atenção text.

- [ ] **Step 6: Clean up the test data**

Delete any seeded `mwa_refeicoes`/`mwa_refeicoes_itens`/`mwa_agua`/`mwa_exercicios` rows created for this test, and the disposable test account itself if one was created solely for this task, matching how test accounts were cleaned up in prior testing sessions in this repo.
