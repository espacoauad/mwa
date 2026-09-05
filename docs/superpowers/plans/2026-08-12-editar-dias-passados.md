# Editar Dias Passados — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the person navigate to any day between the program's start date and today, see everything logged that day (meals, water, exercise, weigh-in), and log or edit it using the exact same forms already used for "today".

**Architecture:** A single `diaVisualizado` date lives in `AppContext`, shared by the 4 screens that log data (Hoje, Alimentação, Ferramentas, Progresso). Meals/exercise/water fetches and writes switch from a hardcoded `hoje` to `diaVisualizado`. A new shared `SeletorDeDia` component (tappable date header + ‹ › arrows + calendar popover) is dropped into each screen's existing header. Weigh-ins gain an edit path via a new `atualizarPesagem` context function. Game rewards (sementes) only fire when `diaVisualizado === hoje`, to avoid rewarding retroactive edits and to avoid a real bug where editing a past day would incorrectly flip today's "task completed" flags.

**Tech Stack:** React 18 (function components, hooks), Vite, Supabase JS client, Tailwind CSS, lucide-react icons, `node:test` + `node:assert/strict` for pure-function unit tests (this repo has no component-test harness — component changes are verified manually in the browser, per existing project convention).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-12-editar-dias-passados-design.md` — every requirement in this plan traces back to it.
- Date range: navigation is bounded to `[dataInicioPrograma, hoje]` inclusive; no future dates.
- `diaAtual` (program-day counter that unlocks games/tips/content) must never be affected by `diaVisualizado`.
- Game rewards (`premiar(...)` calls triggered by logging food/exercise/water) only fire when `diaVisualizado === hoje`.
- No new routing/screens — the feature lives entirely inside the 4 existing tab screens (Hoje, Alimentação, Ferramentas, Progresso).
- Keep existing variable names (`refeicoesHoje`, `exerciciosHoje`, `totaisHoje`, `aguaMl`) even though they now reflect `diaVisualizado` rather than literally "hoje" — renaming across 4 files is pure churn with no functional benefit here.
- Portuguese identifiers/comments, matching the rest of the codebase.

---

### Task 1: Date utilities (`src/utils/datas.js`)

**Files:**
- Create: `src/utils/datas.js`
- Test: `src/utils/datas.test.js`

**Interfaces:**
- Consumes: nothing (pure functions, string dates in `AAAA-MM-DD` format).
- Produces (used by Tasks 2, 3, 4):
  - `diaAnterior(dataISO: string): string`
  - `diaSeguinte(dataISO: string): string`
  - `dataDentroDoIntervalo(dataISO: string, minISO: string, maxISO: string): boolean`
  - `diasDoMes(referenciaISO: string): (string|null)[]` — `referenciaISO` is `AAAA-MM-01`; returns a flat array padded with `null` before day 1 so it aligns to a 7-column grid starting Sunday.
  - `mesAnterior(referenciaISO: string): string`
  - `mesSeguinte(referenciaISO: string): string`
  - `formatarDataExtenso(dataISO: string, locale: string): string`

- [ ] **Step 1: Write the failing tests**

```js
// src/utils/datas.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  diaAnterior,
  diaSeguinte,
  dataDentroDoIntervalo,
  diasDoMes,
  mesAnterior,
  mesSeguinte,
  formatarDataExtenso,
} from './datas.js'

test('diaAnterior recua um dia', () => {
  assert.equal(diaAnterior('2026-08-12'), '2026-08-11')
})

test('diaAnterior cruza o limite do mês', () => {
  assert.equal(diaAnterior('2026-08-01'), '2026-07-31')
})

test('diaSeguinte avança um dia', () => {
  assert.equal(diaSeguinte('2026-08-11'), '2026-08-12')
})

test('diaSeguinte cruza o limite do ano', () => {
  assert.equal(diaSeguinte('2026-12-31'), '2027-01-01')
})

test('dataDentroDoIntervalo aceita datas nos limites (inclusive)', () => {
  assert.equal(dataDentroDoIntervalo('2026-08-01', '2026-08-01', '2026-08-12'), true)
  assert.equal(dataDentroDoIntervalo('2026-08-12', '2026-08-01', '2026-08-12'), true)
})

test('dataDentroDoIntervalo rejeita datas fora dos limites', () => {
  assert.equal(dataDentroDoIntervalo('2026-07-31', '2026-08-01', '2026-08-12'), false)
  assert.equal(dataDentroDoIntervalo('2026-08-13', '2026-08-01', '2026-08-12'), false)
})

test('diasDoMes preenche a grade de agosto de 2026 (começa num sábado)', () => {
  const dias = diasDoMes('2026-08-01')
  // 1º de agosto de 2026 cai num sábado (índice 6) — 6 posições nulas antes do dia 1
  assert.equal(dias.slice(0, 6).every((d) => d === null), true)
  assert.equal(dias[6], '2026-08-01')
  assert.equal(dias[dias.length - 1], '2026-08-31')
  assert.equal(dias.filter(Boolean).length, 31)
})

test('mesAnterior recua um mês, inclusive na virada de ano', () => {
  assert.equal(mesAnterior('2026-08-01'), '2026-07-01')
  assert.equal(mesAnterior('2026-01-01'), '2025-12-01')
})

test('mesSeguinte avança um mês, inclusive na virada de ano', () => {
  assert.equal(mesSeguinte('2026-08-01'), '2026-09-01')
  assert.equal(mesSeguinte('2026-12-01'), '2027-01-01')
})

test('formatarDataExtenso formata em pt-BR', () => {
  const formatado = formatarDataExtenso('2026-08-12', 'pt-BR')
  assert.ok(formatado.includes('agosto'), `esperado conter "agosto", recebido "${formatado}"`)
  assert.ok(formatado.includes('12'), `esperado conter "12", recebido "${formatado}"`)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/utils/datas.test.js`
Expected: FAIL — `datas.js` does not exist yet (`Cannot find module`).

- [ ] **Step 3: Write the implementation**

```js
// src/utils/datas.js
// Utilitários de data para a navegação entre dias (edição de dias passados).
// Todas as datas são strings AAAA-MM-DD, mesmo formato usado pela coluna
// `data` das tabelas mwa_refeicoes/mwa_exercicios/mwa_agua/mwa_pesagens.

function formatarISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function diaAnterior(dataISO) {
  const d = new Date(`${dataISO}T00:00:00`)
  d.setDate(d.getDate() - 1)
  return formatarISO(d)
}

export function diaSeguinte(dataISO) {
  const d = new Date(`${dataISO}T00:00:00`)
  d.setDate(d.getDate() + 1)
  return formatarISO(d)
}

export function dataDentroDoIntervalo(dataISO, minISO, maxISO) {
  return dataISO >= minISO && dataISO <= maxISO
}

// Grade de dias do mês de `referenciaISO` (AAAA-MM-01), preenchida com
// `null` nas posições antes do dia 1 para alinhar num grid de 7 colunas
// (domingo primeiro).
export function diasDoMes(referenciaISO) {
  const [ano, mes] = referenciaISO.split('-').map(Number)
  const primeiroDia = new Date(ano, mes - 1, 1)
  const ultimoDia = new Date(ano, mes, 0).getDate()
  const diaSemanaInicio = primeiroDia.getDay()
  const dias = Array.from({ length: diaSemanaInicio }, () => null)
  for (let dia = 1; dia <= ultimoDia; dia++) {
    dias.push(`${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`)
  }
  return dias
}

export function mesAnterior(referenciaISO) {
  const [ano, mes] = referenciaISO.split('-').map(Number)
  const d = new Date(ano, mes - 2, 1)
  return formatarISO(d)
}

export function mesSeguinte(referenciaISO) {
  const [ano, mes] = referenciaISO.split('-').map(Number)
  const d = new Date(ano, mes, 1)
  return formatarISO(d)
}

export function formatarDataExtenso(dataISO, locale) {
  return new Date(`${dataISO}T00:00:00`).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/utils/datas.test.js`
Expected: PASS — all 9 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/utils/datas.js src/utils/datas.test.js
git commit -m "feat: adiciona utilitários de data para navegação entre dias"
```

---

### Task 2: `dataInicioDoPrograma` helper in `calculos.js`

**Files:**
- Modify: `src/utils/calculos.js`
- Test: `src/utils/calculos.test.js` (create — this file doesn't exist yet; `calculos.js` currently has no dedicated test file)

**Interfaces:**
- Consumes: nothing beyond existing `programas`/`dataInicioFallback` shapes already used by `diaDoPrograma` in the same file.
- Produces (used by Task 3): `dataInicioDoPrograma(programas: Array<{tipo, dataInicio}>, dataInicioFallback: string): string` — returns `AAAA-MM-DD`, using the exact same anchor logic as `diaDoPrograma` (the `'21d'` program's `dataInicio`, or the profile's `dataInicio` as fallback), but without the `modoRevisao` override (that override is for simulating content day, unrelated to date navigation).

- [ ] **Step 1: Write the failing test**

```js
// src/utils/calculos.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dataInicioDoPrograma } from './calculos.js'

test('dataInicioDoPrograma usa a data do programa 21d quando existe', () => {
  const programas = [{ tipo: '21d', dataInicio: '2026-05-01T12:00:00.000Z' }]
  assert.equal(dataInicioDoPrograma(programas, '2026-01-01T00:00:00.000Z'), '2026-05-01')
})

test('dataInicioDoPrograma cai para o fallback do perfil sem programa 21d', () => {
  assert.equal(dataInicioDoPrograma([], '2026-01-15T00:00:00.000Z'), '2026-01-15')
})

test('dataInicioDoPrograma ignora programas de outro tipo', () => {
  const programas = [{ tipo: '90d', dataInicio: '2026-06-01T00:00:00.000Z' }]
  assert.equal(dataInicioDoPrograma(programas, '2026-01-15T00:00:00.000Z'), '2026-01-15')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test src/utils/calculos.test.js`
Expected: FAIL — `dataInicioDoPrograma` is not exported yet.

- [ ] **Step 3: Add the implementation**

In `src/utils/calculos.js`, add this function right after `diaDoPrograma` (after line 126):

```js
// Mesma data-âncora usada por diaDoPrograma, em formato AAAA-MM-DD — usada
// para limitar até onde a navegação de dias passados pode retroceder.
export function dataInicioDoPrograma(programas, dataInicioFallback) {
  const p21 = (programas ?? []).find((p) => p.tipo === '21d')
  const inicio = p21?.dataInicio ?? dataInicioFallback
  return inicio.slice(0, 10)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test src/utils/calculos.test.js`
Expected: PASS — all 3 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/utils/calculos.js src/utils/calculos.test.js
git commit -m "feat: adiciona dataInicioDoPrograma para limitar navegação de dias passados"
```

---

### Task 3: `AppContext` — `diaVisualizado` state, day-scoped fetch, gated rewards

**Files:**
- Modify: `src/context/AppContext.jsx`

**Interfaces:**
- Consumes: `dataInicioDoPrograma` from `../utils/calculos.js` (Task 2).
- Produces (used by Tasks 4, 5, 6, 7 via `useApp()`):
  - `diaVisualizado: string` (AAAA-MM-DD)
  - `estaVendoHoje: boolean`
  - `dataInicioPrograma: string` (AAAA-MM-DD)
  - `mudarDiaVisualizado(data: string): void`
  - `voltarParaHoje(): void`
  - `atualizarPesagem(pesagemId: string, dados: { peso, medidas, fotos, bioimpedancia }): Promise<object>`
  - Existing `refeicoesHoje`, `exerciciosHoje`, `totaisHoje`, `aguaMl`, `obterOuCriarRefeicao`, `adicionarItemRefeicao`, `adicionarExercicio`, `adicionarAgua` keep their names/signatures but now reflect/write `diaVisualizado` instead of a hardcoded `hoje`.

This task has no isolated unit test — `AppContext` has no existing test file and is deeply wired to Supabase/React state (this matches the project's existing pattern: `AppContext.jsx` today has zero direct unit tests; behavior is verified through the pure utils it calls and through manual browser testing). Verification for this task is Step 3 (build) plus the manual browser check at the end of Task 7.

- [ ] **Step 1: Import `dataInicioDoPrograma`**

In `src/context/AppContext.jsx`, update the import on line 3:

```js
import { calcularMetas, dataHojeISO, diaDoPrograma, totalDiasPrograma, dataInicioDoPrograma, programa90Ativo as calcularPrograma90Ativo } from '../utils/calculos.js'
```

- [ ] **Step 2: Add `diaVisualizado` state**

Add this alongside the other `useState` declarations, right after the `aguaMl` state (after line 102):

```js
  const [aguaMl, setAguaMl] = useState(0)
  const [diaVisualizado, setDiaVisualizado] = useState(() => dataHojeISO())
```

- [ ] **Step 3: Add derived values**

Right after the existing `const programa90Ativo = ...` line (line 130), add:

```js
  const estaVendoHoje = diaVisualizado === hoje
  const dataInicioPrograma = usuario ? dataInicioDoPrograma(programas, usuario.dataInicio) : hoje
```

- [ ] **Step 4: Split the initial-load effect — remove refeições/exercícios/água from it**

Replace the existing combined fetch (lines 200-214) — remove the `mwa_refeicoes`/`mwa_exercicios`/`mwa_agua` queries and their `setRefeicoes`/`setExercicios`/`setAguaMl` calls, keeping only profile/programs/pesagens:

```js
    async function carregar() {
      setCarregando(true)
      const [perfil, progs, pesos] = await Promise.all([
        supabase.from('mwa_perfis').select('*').eq('id', userId).maybeSingle(),
        supabase.from('mwa_programas').select('*').eq('user_id', userId),
        supabase.from('mwa_pesagens').select('*').eq('user_id', userId).order('data'),
      ])
      if (cancelado) return
      setUsuario(perfil.data ? perfilParaUsuario(perfil.data) : null)
      setProgramas((progs.data ?? []).map(programaDoBanco))
      setPesagens((pesos.data ?? []).map(pesagemDoBanco))
      setCarregando(false)
```

The rest of that function (gamification chain starting at `carregarGame(userId).then(...)`) stays exactly as-is.

- [ ] **Step 5: Add the day-scoped fetch effect**

Add this new effect right after the effect from Step 4 ends (after its closing `}, [userId, hoje])`):

```js
  // Busca refeições, exercícios e água do dia visualizado — reexecuta toda
  // vez que a pessoa navega para outro dia. Efeito separado do carregamento
  // de perfil/programas/pesagens para não reexecutar gamificação (sementes,
  // streaks, Modo Recomeçar) a cada troca de dia.
  useEffect(() => {
    if (!userId) return
    let cancelado = false

    async function carregarDadosDoDia() {
      const [refs, exs, agua] = await Promise.all([
        supabase.from('mwa_refeicoes').select('*, mwa_refeicoes_itens(*)').eq('user_id', userId).eq('data', diaVisualizado),
        supabase.from('mwa_exercicios').select('*').eq('user_id', userId).eq('data', diaVisualizado),
        supabase.from('mwa_agua').select('ml').eq('user_id', userId).eq('data', diaVisualizado).maybeSingle(),
      ])
      // Guard: se diaVisualizado mudou de novo antes desta resposta chegar,
      // descarta — evita sobrescrever a tela com dados do dia errado.
      if (cancelado) return
      setRefeicoes((refs.data ?? []).map((r) => refeicaoDoBanco(r, r.mwa_refeicoes_itens)))
      setExercicios((exs.data ?? []).map(exercicioDoBanco))
      setAguaMl(agua.data?.ml ?? 0)
    }

    carregarDadosDoDia()
    return () => {
      cancelado = true
    }
  }, [userId, diaVisualizado])
```

- [ ] **Step 6: Reset `diaVisualizado` on sign-out**

In the `SIGNED_OUT` branch inside the auth-state-change handler (around line 180-188), add `setDiaVisualizado(dataHojeISO())` alongside the other resets:

```js
      if (!novaSessao) {
        setUsuario(null)
        setProgramas([])
        setRefeicoes([])
        setExercicios([])
        setPesagens([])
        setAguaMl(0)
        setDiaVisualizado(dataHojeISO())
        setCarregando(false)
      }
```

- [ ] **Step 7: Add `mudarDiaVisualizado` / `voltarParaHoje` functions**

Add these near the other simple setter-wrapping functions (e.g. right after `fecharResumoSemanal`, around line 439):

```js
  function mudarDiaVisualizado(data) {
    setDiaVisualizado(data)
  }

  function voltarParaHoje() {
    setDiaVisualizado(hoje)
  }
```

- [ ] **Step 8: Write `diaVisualizado` instead of `hoje` in the write functions, gate rewards**

In `obterOuCriarRefeicao` (line 617-632), change the insert:

```js
    const { data, error } = await supabase
      .from('mwa_refeicoes')
      .insert({ user_id: userId, data: diaVisualizado, tipo, horario: horarioAgora() })
      .select()
      .single()
```

In `adicionarItemRefeicao` (line 634-648), gate the `premiar` call by `estaVendoHoje`:

```js
    const refeicao = refeicoesHoje.find((r) => r.id === refeicaoId)
    if (estaVendoHoje && refeicao) await premiar('refeicao', `${hoje}:${refeicao.tipo}`)
```

In `adicionarExercicio` (line 692-712), write `diaVisualizado` and gate the reward:

```js
  async function adicionarExercicio(exercicio) {
    const { data, error } = await supabase
      .from('mwa_exercicios')
      .insert({
        user_id: userId,
        data: diaVisualizado,
        tipo: exercicio.tipo,
        emoji: exercicio.emoji,
        intensidade: exercicio.intensidade,
        duracao_min: exercicio.duracaoMin,
        gasto_calorico: exercicio.gastoCalorico,
      })
      .select()
      .single()
    if (!error) {
      setExercicios((es) => [...es, exercicioDoBanco(data)])
      await registrarSessao(userId, 'atividade', { acao: 'exercicio_adicionado', tipo: exercicio.tipo })
      if (estaVendoHoje) await premiar('exercicio', hoje)
    }
  }
```

In `adicionarAgua` (line 766-774), write `diaVisualizado` and gate the reward:

```js
  async function adicionarAgua(ml) {
    const novo = Math.max(0, aguaMl + ml)
    setAguaMl(novo)
    await supabase.from('mwa_agua').upsert({ user_id: userId, data: diaVisualizado, ml: novo })
    if (estaVendoHoje && metas && novo >= metas.aguaL * 1000) {
      await premiar('agua', hoje)
    }
  }
```

- [ ] **Step 9: Add `atualizarPesagem`**

Add this function right after `adicionarPesagem` (after line 748):

```js
  async function atualizarPesagem(pesagemId, dados) {
    const { data, error } = await supabase
      .from('mwa_pesagens')
      .update({
        peso: dados.peso,
        medidas: dados.medidas ?? {},
        fotos: dados.fotos ?? {},
        bioimpedancia: dados.bioimpedancia ?? null,
      })
      .eq('id', pesagemId)
      .select()
      .single()
    if (error) throw error
    const atualizada = pesagemDoBanco(data)
    setPesagens((ps) => ps.map((p) => (p.id === pesagemId ? atualizada : p)))
    return atualizada
  }
```

- [ ] **Step 10: Expose the new values in the context**

In the `valor` object (around line 797-870), add the new fields — e.g. right after `hoje,` (line 806) add `diaVisualizado, estaVendoHoje, dataInicioPrograma, mudarDiaVisualizado, voltarParaHoje,` and right after `adicionarPesagem,` (line 829) add `atualizarPesagem,`:

```js
    hoje,
    diaVisualizado,
    estaVendoHoje,
    dataInicioPrograma,
    mudarDiaVisualizado,
    voltarParaHoje,
    refeicoesHoje,
    exerciciosHoje,
    totaisHoje,
    gastoExercicios,
    pesagens,
    aguaMl,
    modalRefeicao,
```

and:

```js
    adicionarPesagem,
    atualizarPesagem,
    adicionarAgua,
```

- [ ] **Step 11: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds with no errors (no unused-variable/import warnings introduced).

- [ ] **Step 12: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: adiciona diaVisualizado ao AppContext (fetch e escrita por dia, sem premiar em dias passados)"
```

---

### Task 4: `ModalCalendario` — month-grid date picker

**Files:**
- Create: `src/components/ui/ModalCalendario.jsx`

**Interfaces:**
- Consumes: `diasDoMes`, `mesAnterior`, `mesSeguinte`, `dataDentroDoIntervalo` from `src/utils/datas.js` (Task 1); `useIdioma()` for `ingles`/`locale`.
- Produces (used by Task 5): `<ModalCalendario diaSelecionado maxData... />` — props: `diaSelecionado: string`, `dataMin: string`, `dataMax: string`, `onEscolher: (data: string) => void`, `onFechar: () => void`.

No pure-logic to unit test here (it's a presentational component composing already-tested date utilities); verified manually in Task 7's browser pass.

- [ ] **Step 1: Create the component**

```jsx
// src/components/ui/ModalCalendario.jsx
import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { diasDoMes, mesAnterior, mesSeguinte, dataDentroDoIntervalo } from '../../utils/datas.js'

const DIAS_SEMANA_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const DIAS_SEMANA_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function ModalCalendario({ diaSelecionado, dataMin, dataMax, onEscolher, onFechar }) {
  const { ingles, locale } = useIdioma()
  const [mesReferencia, setMesReferencia] = useState(`${diaSelecionado.slice(0, 7)}-01`)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const dias = diasDoMes(mesReferencia)
  const nomeMes = new Date(`${mesReferencia}T00:00:00`).toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={onFechar}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-calendario-titulo"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-calendario-titulo" className="font-serif text-lg font-semibold italic capitalize text-verde">
            {nomeMes}
          </h2>
          <button
            type="button"
            aria-label={ingles ? 'Close' : 'Fechar'}
            onClick={onFechar}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMesReferencia(mesAnterior(mesReferencia))}
            aria-label={ingles ? 'Previous month' : 'Mês anterior'}
            className="flex min-h-11 min-w-11 items-center justify-center text-verde/60"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setMesReferencia(mesSeguinte(mesReferencia))}
            aria-label={ingles ? 'Next month' : 'Próximo mês'}
            className="flex min-h-11 min-w-11 items-center justify-center text-verde/60"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-verde/50">
          {(ingles ? DIAS_SEMANA_EN : DIAS_SEMANA_PT).map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {dias.map((data, i) => {
            if (!data) return <span key={`vazio-${i}`} />
            const desabilitado = !dataDentroDoIntervalo(data, dataMin, dataMax)
            const selecionado = data === diaSelecionado
            return (
              <button
                key={data}
                type="button"
                disabled={desabilitado}
                onClick={() => onEscolher(data)}
                className={`flex aspect-square items-center justify-center rounded-full text-sm font-medium ${
                  selecionado
                    ? 'bg-verde text-white'
                    : desabilitado
                      ? 'cursor-not-allowed text-verde/20'
                      : 'text-verde hover:bg-sage-claro'
                }`}
              >
                {Number(data.slice(8, 10))}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds (component isn't wired up anywhere yet, but must compile standalone with no syntax/import errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ModalCalendario.jsx
git commit -m "feat: adiciona ModalCalendario (seletor de data em grade mensal)"
```

---

### Task 5: `SeletorDeDia` — shared date header + banner

**Files:**
- Create: `src/components/ui/SeletorDeDia.jsx`

**Interfaces:**
- Consumes: `useApp()` for `diaVisualizado, estaVendoHoje, dataInicioPrograma, hoje, mudarDiaVisualizado, voltarParaHoje` (Task 3); `useIdioma()`; `diaAnterior, diaSeguinte, dataDentroDoIntervalo, formatarDataExtenso` from `src/utils/datas.js` (Task 1); `ModalCalendario` (Task 4).
- Produces (used by Tasks 6, 7): `<SeletorDeDia tema="escuro" | "claro" />` — no other props; renders the tappable date row, ‹ › arrows, and (when `!estaVendoHoje`) the "voltar para hoje" banner.

- [ ] **Step 1: Create the component**

```jsx
// src/components/ui/SeletorDeDia.jsx
import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { diaAnterior, diaSeguinte, dataDentroDoIntervalo, formatarDataExtenso } from '../../utils/datas.js'
import ModalCalendario from './ModalCalendario.jsx'

export default function SeletorDeDia({ tema = 'claro' }) {
  const { ingles, locale } = useIdioma()
  const { diaVisualizado, estaVendoHoje, dataInicioPrograma, hoje, mudarDiaVisualizado, voltarParaHoje } = useApp()
  const [calendarioAberto, setCalendarioAberto] = useState(false)

  const anterior = diaAnterior(diaVisualizado)
  const seguinte = diaSeguinte(diaVisualizado)
  const podeVoltar = dataDentroDoIntervalo(anterior, dataInicioPrograma, hoje)
  const podeAvancar = dataDentroDoIntervalo(seguinte, dataInicioPrograma, hoje)

  const corTexto = tema === 'escuro' ? 'text-white/60' : 'text-verde/60'
  const corIcone = tema === 'escuro' ? 'text-white/50' : 'text-verde/50'
  const corIconeDesabilitado = tema === 'escuro' ? 'text-white/15' : 'text-verde/15'

  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => mudarDiaVisualizado(anterior)}
          disabled={!podeVoltar}
          aria-label={ingles ? 'Previous day' : 'Dia anterior'}
          className="flex min-h-11 min-w-11 items-center justify-center disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className={podeVoltar ? corIcone : corIconeDesabilitado} />
        </button>
        <button
          type="button"
          onClick={() => setCalendarioAberto(true)}
          className={`flex-1 truncate text-center text-sm capitalize ${corTexto}`}
        >
          {formatarDataExtenso(diaVisualizado, locale)}
        </button>
        <button
          type="button"
          onClick={() => mudarDiaVisualizado(seguinte)}
          disabled={!podeAvancar}
          aria-label={ingles ? 'Next day' : 'Próximo dia'}
          className="flex min-h-11 min-w-11 items-center justify-center disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} className={podeAvancar ? corIcone : corIconeDesabilitado} />
        </button>
      </div>

      {!estaVendoHoje && (
        <div className="mt-1 flex items-center gap-2 rounded-full bg-ouro-claro px-3 py-1.5 text-xs font-semibold text-verde">
          <CalendarDays size={12} className="shrink-0" />
          <span className="truncate">
            {ingles ? 'Viewing a past day' : 'Vendo um dia passado'}
          </span>
          <button type="button" onClick={voltarParaHoje} className="ml-auto shrink-0 underline">
            {ingles ? 'Back to today' : 'Voltar para hoje'}
          </button>
        </div>
      )}

      {calendarioAberto && (
        <ModalCalendario
          diaSelecionado={diaVisualizado}
          dataMin={dataInicioPrograma}
          dataMax={hoje}
          onEscolher={(data) => {
            mudarDiaVisualizado(data)
            setCalendarioAberto(false)
          }}
          onFechar={() => setCalendarioAberto(false)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/SeletorDeDia.jsx
git commit -m "feat: adiciona SeletorDeDia (cabeçalho de data com navegação e calendário)"
```

---

### Task 6: Wire `SeletorDeDia` into the 4 screens

**Files:**
- Modify: `src/components/hoje/Hoje.jsx`
- Modify: `src/components/alimentacao/Alimentacao.jsx`
- Modify: `src/components/ferramentas/Ferramentas.jsx`
- Modify: `src/components/progresso/Progresso.jsx`

**Interfaces:**
- Consumes: `SeletorDeDia` from `src/components/ui/SeletorDeDia.jsx` (Task 5).
- Produces: nothing new — this task only wires the header into each screen.

- [ ] **Step 1: `Hoje.jsx` — replace the static date line**

In `src/components/hoje/Hoje.jsx`, add the import near the other component imports (after line 19):

```js
import SeletorDeDia from '../ui/SeletorDeDia.jsx'
```

Remove the now-unused `dataFormatada` computation (lines 98-102):

```js
  const dica = diaAtual <= 30 ? dicaDoDia(diaAtual) : dicaDoDia90(diaAtual)
  const informativo = informativoDoDia(diaAtual)
```

Replace the date paragraph (line 126) inside the header:

```jsx
          <div>
            <SeletorDeDia tema="escuro" />
            <h1 className="mt-1 font-serif text-2xl font-semibold italic">{ingles ? 'Hello' : 'Olá'}, {primeiroNome} 🌿</h1>
          </div>
```

- [ ] **Step 2: `Alimentacao.jsx` — add the date header**

In `src/components/alimentacao/Alimentacao.jsx`, add the import (after line 6):

```js
import SeletorDeDia from '../ui/SeletorDeDia.jsx'
```

Add `<SeletorDeDia />` right before the `<h1>` (before line 20):

```jsx
    <div className="px-5 pt-10">
      <SeletorDeDia />
      <h1 className="mt-3 font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Today’s nutrition' : 'Alimentação de hoje'}</h1>
```

(note the added `mt-3` on the `<h1>` for spacing below the new header row)

- [ ] **Step 3: `Ferramentas.jsx` — add the date header**

In `src/components/ferramentas/Ferramentas.jsx`, add the import (after line 13):

```js
import SeletorDeDia from '../ui/SeletorDeDia.jsx'
```

Add `<SeletorDeDia />` right before the `<h1>` (before line 326):

```jsx
    <div className="px-5 pt-10">
      <SeletorDeDia />
      <h1 className="mt-3 font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Tools' : 'Ferramentas'}</h1>
```

- [ ] **Step 4: `Progresso.jsx` — add the date header**

In `src/components/progresso/Progresso.jsx`, add the import (after line 7):

```js
import SeletorDeDia from '../ui/SeletorDeDia.jsx'
```

Add `<SeletorDeDia />` right before the `<h1>` (before line 29):

```jsx
    <div className="px-5 pt-10">
      <SeletorDeDia />
      <h1 className="mt-3 font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Your progress' : 'Seu progresso'}</h1>
```

- [ ] **Step 5: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds, no unused-import warnings (confirm `dataFormatada` was fully removed from `Hoje.jsx` and nothing else referenced it).

- [ ] **Step 6: Commit**

```bash
git add src/components/hoje/Hoje.jsx src/components/alimentacao/Alimentacao.jsx src/components/ferramentas/Ferramentas.jsx src/components/progresso/Progresso.jsx
git commit -m "feat: adiciona SeletorDeDia às 4 telas de lançamento"
```

---

### Task 7: Editable weigh-ins (`ModalPesagem` edit mode + clickable history)

**Files:**
- Modify: `src/components/progresso/ModalPesagem.jsx`
- Modify: `src/components/progresso/Progresso.jsx`

**Interfaces:**
- Consumes: `atualizarPesagem` from `AppContext` (Task 3, Step 9); existing `adicionarPesagem`.
- Produces: `<ModalPesagem semana? pesagemExistente? onFechar />` — when `pesagemExistente` is passed, the modal opens pre-filled in edit mode and calls `atualizarPesagem` instead of `adicionarPesagem` on save; the header/title switches accordingly. `semana` stays required for the create path (unchanged), `pesagemExistente` is the new optional prop for the edit path.

- [ ] **Step 1: Add edit-mode support to `ModalPesagem`**

In `src/components/progresso/ModalPesagem.jsx`, change the function signature and imports (line 25):

```jsx
export default function ModalPesagem({ semana, pesagemExistente, onFechar }) {
  const { ingles } = useIdioma()
  const { adicionarPesagem, atualizarPesagem } = useApp()
  const { celebrarGrande } = useConfeti()
  const editando = Boolean(pesagemExistente)
  const [peso, setPeso] = useState(pesagemExistente ? String(pesagemExistente.peso) : '')
  const [fotos, setFotos] = useState(pesagemExistente?.fotos ?? {})
  const [medidas, setMedidas] = useState({
    cintura: pesagemExistente?.medidas?.cintura ? String(pesagemExistente.medidas.cintura) : '',
    quadril: pesagemExistente?.medidas?.quadril ? String(pesagemExistente.medidas.quadril) : '',
    peito: pesagemExistente?.medidas?.peito ? String(pesagemExistente.medidas.peito) : '',
  })
```

Keep the `bioimpedanciaToggles`/`bioimpedanciaValues` initial state as-is for now (bioimpedância pré-preenchida em modo edição está fora do escopo desta spec — a pessoa pode reinformar se quiser alterar).

Replace the `salvar` function (lines 94-128) to branch on `editando`:

```jsx
  function salvar() {
    const bioDataAtivos = Object.entries(bioimpedanciaValues)
      .filter(([key]) => bioimpedanciaToggles[key])
      .reduce((acc, [key, val]) => {
        acc[key] = val
        return acc
      }, {})

    const validacao = validarBioimpedancia(bioDataAtivos)
    if (!validacao.valid) {
      setBioimpedanciaErros(validacao.erros)
      return
    }

    const bioimpedanciaFiltrada = filterBioimpedanciaData(bioDataAtivos)
    const dados = {
      peso: Number(peso),
      fotos,
      medidas: {
        cintura: Number(medidas.cintura) || null,
        quadril: Number(medidas.quadril) || null,
        peito: Number(medidas.peito) || null,
      },
      bioimpedancia: bioimpedanciaFiltrada,
    }

    if (editando) {
      atualizarPesagem(pesagemExistente.id, dados)
      onFechar()
      return
    }

    adicionarPesagem({ semana, ...dados })
    const prefereMenosMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefereMenosMovimento) {
      onFechar()
    } else {
      celebrarGrande()
      setTimeout(() => onFechar(), 600)
    }
  }
```

Update the title (line 142) to reflect edit mode:

```jsx
          <h2 id="modal-pesagem-titulo" className="font-serif text-xl font-semibold italic text-verde">
            {editando
              ? (ingles ? 'Edit weigh-in' : 'Editar pesagem')
              : `${ingles ? 'Weigh-in — week' : 'Pesagem — semana'} ${semana}`}
          </h2>
```

Update the save button label (line 206-208):

```jsx
          <Botao onClick={salvar} disabled={!valido}>
            {editando ? (ingles ? 'Save changes' : 'Salvar alterações') : (ingles ? 'Save weigh-in' : 'Salvar pesagem')}
          </Botao>
```

- [ ] **Step 2: Make history entries clickable in `Progresso.jsx`**

In `src/components/progresso/Progresso.jsx`, add state for the pesagem being edited (near line 12):

```jsx
  const [modalAberto, setModalAberto] = useState(false)
  const [pesagemEmEdicao, setPesagemEmEdicao] = useState(null)
```

Wrap each history entry (lines 88-111) in a clickable button. Replace the opening `<div key={p.id} ...>` with a `<button>`:

```jsx
              <button
                key={p.id}
                type="button"
                onClick={() => setPesagemEmEdicao(p)}
                className="w-full rounded-2xl bg-white p-4 text-left shadow-sm shadow-verde/5 transition-transform active:scale-[0.99]"
              >
```

(change the closing `</div>` for that entry to `</button>`)

Render the edit modal at the bottom (near line 126), alongside the existing create-modal render:

```jsx
      {modalAberto && <ModalPesagem semana={proximaSemana} onFechar={() => setModalAberto(false)} />}
      {pesagemEmEdicao && (
        <ModalPesagem pesagemExistente={pesagemEmEdicao} onFechar={() => setPesagemEmEdicao(null)} />
      )}
```

- [ ] **Step 3: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/progresso/ModalPesagem.jsx src/components/progresso/Progresso.jsx
git commit -m "feat: permite editar pesagens do histórico"
```

- [ ] **Step 5: Manual verification in the browser**

Run: `npm run dev`, open the app, log in with a test account that has an active program (or use an existing dev account).

Check each of these end to end:
1. On the Hoje screen, tap the date text in the header — the calendar opens, days before the program's start date and after today are greyed out/disabled.
2. Tap ‹ to go back one day — the "Vendo um dia passado" banner appears on Hoje, and switching to Alimentação/Ferramentas/Progresso shows the same date (global sync).
3. On Alimentação, while viewing that past day, add a new meal + food item — it saves and appears only under that past day (switch back to today to confirm it does *not* show up there).
4. Confirm no "+🌱" reward toast and no seed count change appear when logging on a past day; confirm rewards still fire normally after tapping "Voltar para hoje" and logging something for today.
5. On Ferramentas, log an exercise for the past day; confirm it appears in that day's list and not today's.
6. On Hoje, add water while viewing the past day; confirm the hydration ring for that day updates and today's water total (after "Voltar para hoje") is unaffected.
7. On Progresso, tap an existing weigh-in in "Histórico" — the modal opens pre-filled with "Editar pesagem", change the weight, save, and confirm the history list and the weight chart both reflect the new value.
8. Confirm `diaAtual` ("Dia X de 90" on Hoje) never changes while browsing past days.

---

## Self-Review Notes

- **Spec coverage:** every section of the spec (`diaVisualizado` state/fetch, entry point via tappable date, arrows + calendar navigation, date-range limits, global sync, past-day indicator, editable pesagem, reward gating) maps to a task above.
- **Type/name consistency checked:** `estaVendoHoje`, `diaVisualizado`, `mudarDiaVisualizado`, `voltarParaHoje`, `dataInicioPrograma`, `atualizarPesagem` are spelled identically everywhere they're produced (Task 3) and consumed (Tasks 5, 7).
- **No placeholders:** every step has real code; the one place without a runnable automated test (Task 3, `AppContext.jsx`) is explicitly called out as matching this file's existing untested status, with manual verification deferred to Task 7 Step 5 where it can be checked end-to-end.
