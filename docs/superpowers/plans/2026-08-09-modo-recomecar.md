# Modo Recomeçar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a full-screen, guilt-free "Modo Recomeçar" modal when a user returns to the MWA app after 2+ days without opening it, offering 3 acolhimento paths back into the app.

**Architecture:** A new `recomecar_pendente` boolean on `mwa_game` is set server-side the moment a returning user's session loads (before the existing streak logic overwrites `ultimo_dia_acesso`). `AppContext` opens a modal whenever that flag is true; picking one of the 3 options clears the flag in the database but keeps the modal open locally to show an acolhimento message, closed only by the user tapping "Ir para o Hoje". The streak/sementes system (`registrarAcessoDiario`) is untouched.

**Tech Stack:** React 18 (Vite), Supabase (Postgres + JS client), Tailwind, `node --test` for pure-function unit tests.

## Global Constraints

- Gap threshold is 2 days, expressed as a constant (`LIMIAR_RECOMECAR = 2`) in `src/lib/game.js` — not configurable via UI/admin (spec: "Fora de escopo").
- No new "missão do dia" record is created when an option is picked — only an acolhimento message (spec: "Fora de escopo").
- The modal must reappear on every app load while `recomecar_pendente` is `true`, surviving a full page reload — this is why the flag is persisted in `mwa_game`, not component state.
- `registrarAcessoDiario`'s existing behavior (streak, sementes bonus) must not change.
- Acolhimento copy is fixed exactly as specified below — do not paraphrase.
- No React component-testing harness exists in this repo (`node --test` runs plain `.js` files only, no jsdom/testing-library). Component verification is manual, via the dev server in a browser — do not add a testing library as a side effect of this plan.

---

### Task 1: Add `recomecar_pendente` column to `mwa_game`

**Files:**
- No local file changes — this project's Supabase schema changes are applied directly via the Supabase MCP `apply_migration` tool (see `supabase/migrations/` — recent schema changes like `reestruturar_refeicoes` have no matching local `.sql` file, confirming this is the established workflow for this repo).

**Interfaces:**
- Produces: column `public.mwa_game.recomecar_pendente boolean not null default false`, consumed by Task 2's `avaliarModoRecomecar`/`resolverModoRecomecar`.

- [ ] **Step 1: Apply the migration**

Call the Supabase MCP tool `mcp__6a44cad9-913e-461b-856a-59f5f5d07b69__apply_migration` with:
- `project_id`: `kfavxgrvikflzyzvcoyb`
- `name`: `adicionar_recomecar_pendente_mwa_game`
- `query`:

```sql
alter table public.mwa_game
  add column if not exists recomecar_pendente boolean not null default false;
```

- [ ] **Step 2: Verify the column exists**

Call `mcp__6a44cad9-913e-461b-856a-59f5f5d07b69__list_tables` (or `execute_sql` with `select column_name, data_type, column_default from information_schema.columns where table_name = 'mwa_game';`) with `project_id: kfavxgrvikflzyzvcoyb` and confirm `recomecar_pendente` appears as `boolean`, default `false`.

No commit needed for this task (no local files changed).

---

### Task 2: Gap calculation and DB helper functions in `game.js`

**Files:**
- Modify: `src/lib/game.js`
- Test: `src/lib/game.test.js` (new file)

**Interfaces:**
- Produces:
  - `diasSemAcessar(ultimoDiaAcesso: string|null, hojeISO: string) => number|null` — pure function, exported.
  - `avaliarModoRecomecar(userId: string, game: object, hojeISO: string) => Promise<object>` — returns the (possibly updated) `game` row.
  - `resolverModoRecomecar(userId: string, opcao: 'calma'|'dias_dificeis'|'reorganizar', hojeISO: string) => Promise<object|null>` — returns the updated `game` row, or `null` on failure.
- Consumes: existing `supabase` client from `./supabase.js` (same import already used in this file).

- [ ] **Step 1: Write the failing tests for `diasSemAcessar`**

Create `src/lib/game.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { diasSemAcessar } from './game.js'

test('retorna null quando nunca acessou (ultimo_dia_acesso ausente)', () => {
  assert.equal(diasSemAcessar(null, '2026-08-09'), null)
})

test('retorna 0 no mesmo dia', () => {
  assert.equal(diasSemAcessar('2026-08-09', '2026-08-09'), 0)
})

test('retorna 1 no dia seguinte', () => {
  assert.equal(diasSemAcessar('2026-08-08', '2026-08-09'), 1)
})

test('retorna 2 depois de dois dias sem acessar', () => {
  assert.equal(diasSemAcessar('2026-08-07', '2026-08-09'), 2)
})

test('retorna corretamente atravessando troca de mês', () => {
  assert.equal(diasSemAcessar('2026-07-30', '2026-08-02'), 3)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/lib/game.test.js`
Expected: FAIL — `diasSemAcessar is not a function` (or similar), since it doesn't exist in `game.js` yet.

- [ ] **Step 3: Implement `diasSemAcessar` and the two DB helpers in `game.js`**

Add near the top of `src/lib/game.js`, after the existing `ontemISO` helper (around line 73):

```js
// Quantos dias inteiros se passaram desde o último acesso registrado.
// Retorna null se a pessoa nunca acessou (ultimo_dia_acesso ainda não definido).
export function diasSemAcessar(ultimoDiaAcesso, hojeISO) {
  if (!ultimoDiaAcesso) return null
  const umDiaMs = 24 * 60 * 60 * 1000
  const ultimo = new Date(`${ultimoDiaAcesso}T00:00:00`)
  const hoje = new Date(`${hojeISO}T00:00:00`)
  return Math.round((hoje - ultimo) / umDiaMs)
}

// ── Modo Recomeçar: acolhimento sem culpa quando a pessoa some do app ──
const LIMIAR_RECOMECAR = 2

// Chamado com o `game` ainda não atualizado por registrarAcessoDiario nesta sessão
// (ou seja, antes de ultimo_dia_acesso virar hoje) — é essa a janela em que o gap
// real ainda é visível. Marca recomecar_pendente=true se o gap é grande o bastante.
export async function avaliarModoRecomecar(userId, game, hojeISO) {
  if (game.recomecar_pendente) return game
  const gap = diasSemAcessar(game.ultimo_dia_acesso, hojeISO)
  if (gap === null || gap < LIMIAR_RECOMECAR) return game

  const { data } = await supabase
    .from('mwa_game')
    .update({ recomecar_pendente: true })
    .eq('user_id', userId)
    .select()
    .single()
  return data ?? game
}

// Registra a escolha da pessoa no Modo Recomeçar (só para histórico, sem sementes)
// e limpa o flag pendente.
export async function resolverModoRecomecar(userId, opcao, hojeISO) {
  await supabase
    .from('mwa_game_eventos')
    .insert({ user_id: userId, tipo: `modo_recomecar_${opcao}`, ref: hojeISO, sementes: 0 })

  const { data } = await supabase
    .from('mwa_game')
    .update({ recomecar_pendente: false })
    .eq('user_id', userId)
    .select()
    .single()
  return data ?? null
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/lib/game.test.js`
Expected: PASS, all 5 tests green.

- [ ] **Step 5: Run the full test suite to check for regressions**

Run: `npm test`
Expected: PASS (no existing test touches `game.js`, so this should be a clean addition).

- [ ] **Step 6: Commit**

```bash
git add src/lib/game.js src/lib/game.test.js
git commit -m "feat: adiciona logica de dados do Modo Recomecar em game.js"
```

---

### Task 3: Wire the trigger and actions into `AppContext`

**Files:**
- Modify: `src/context/AppContext.jsx`

**Interfaces:**
- Consumes: `diasSemAcessar` (not called directly here — used inside `avaliarModoRecomecar`), `avaliarModoRecomecar(userId, game, hojeISO)`, `resolverModoRecomecar(userId, opcao, hojeISO)` from Task 2.
- Produces (added to the context value consumed by Task 5):
  - `modoRecomecarAberto: boolean`
  - `escolherOpcaoRecomecar(opcao: 'calma'|'dias_dificeis'|'reorganizar') => Promise<void>`
  - `fecharModoRecomecar() => void`

- [ ] **Step 1: Import the new helpers**

In `src/context/AppContext.jsx`, extend the existing import from `../lib/game.js` (currently at lines 7-15):

```js
import {
  carregarGame,
  concederSementes,
  comprarSkinDb,
  equiparSkinDb,
  registrarAcessoDiario,
  carregarTarefasHoje,
  carregarEstrelas,
  avaliarModoRecomecar,
  resolverModoRecomecar,
} from '../lib/game.js'
```

- [ ] **Step 2: Add the `modoRecomecarAberto` state**

Right after the existing `conclusao90Aberta` state declaration (line 143):

```js
  // Modo Recomeçar: acolhimento ao voltar após dias sem abrir o app
  const [modoRecomecarAberto, setModoRecomecarAberto] = useState(false)
```

- [ ] **Step 3: Evaluate the gap before `registrarAcessoDiario` runs**

In the `carregar()` function's game-loading block (currently lines 237-251), insert the `avaliarModoRecomecar` call between loading `g` and calling `registrarAcessoDiario`:

```js
      // Gamificação carrega depois, sem segurar a tela
      carregarGame(userId).then(async (g) => {
        if (cancelado || !g) return
        // Modo Recomeçar: precisa avaliar o gap ANTES de registrarAcessoDiario,
        // porque essa função sobrescreve ultimo_dia_acesso para hoje.
        const gAvaliado = await avaliarModoRecomecar(userId, g, hoje)
        if (cancelado) return
        // Acelerador de sementes: bônus por acessar em dias seguidos, sem falhar
        const { game: gAtualizado, bonus } = await registrarAcessoDiario(userId, gAvaliado, hoje)
        if (cancelado) return
        setGame(gAtualizado)
        if (bonus > 0) {
          setGanhoSementes({ qtd: bonus, tipo: 'streak' })
          setTimeout(() => setGanhoSementes(null), 3000)
        }
        const tarefas = await carregarTarefasHoje(userId, hoje)
        if (!cancelado) setTarefasHoje(tarefas)
        const eventosEstrela = await carregarEstrelas(userId, diasDaSemana(hoje))
        if (!cancelado) setEstrelasSemana(eventosEstrela)
      })
```

- [ ] **Step 4: Open the modal whenever the flag turns true**

Add a new `useEffect`, right after the "Acende a estrela..." effect block (after line 319, before the "Lembrete local da estrela" effect):

```js
  // Modo Recomeçar: abre sempre que o banco marcar o flag como pendente
  useEffect(() => {
    if (game?.recomecar_pendente) setModoRecomecarAberto(true)
  }, [game?.recomecar_pendente])
```

- [ ] **Step 5: Add the action functions**

Near the other `fecharConclusaoX` functions (after `fecharConclusaoDia`, around line 423):

```js
  async function escolherOpcaoRecomecar(opcao) {
    if (!userId) return
    const atualizado = await resolverModoRecomecar(userId, opcao, hoje)
    if (atualizado) setGame(atualizado)
  }

  function fecharModoRecomecar() {
    setModoRecomecarAberto(false)
  }
```

- [ ] **Step 6: Expose the new state and functions in the context value**

In the `valor` object (around line 752, next to `conclusaoDiaAberta`):

```js
    conclusaoDiaAberta,
    abrirConclusaoDia,
    fecharConclusaoDia,
    modoRecomecarAberto,
    escolherOpcaoRecomecar,
    fecharModoRecomecar,
```

- [ ] **Step 7: Run the full test suite**

Run: `npm test`
Expected: PASS — this task only adds wiring, no new pure logic to unit test directly (covered by Task 2's tests).

- [ ] **Step 8: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: liga o Modo Recomecar ao carregamento de sessao no AppContext"
```

---

### Task 4: `ModoRecomecar` modal component

**Files:**
- Create: `src/components/game/ModoRecomecar.jsx`

**Interfaces:**
- Consumes: `useApp()` → `escolherOpcaoRecomecar`, `fecharModoRecomecar` (from Task 3).
- Produces: default export `ModoRecomecar` (React component, no props) — consumed by Task 5.

- [ ] **Step 1: Create the component**

```jsx
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

const OPCOES = [
  {
    chave: 'calma',
    label: 'Quero voltar com calma',
    mensagem: 'Sem pressa. Vamos retomar no seu tempo — um passo simples hoje já é o suficiente.',
  },
  {
    chave: 'dias_dificeis',
    label: 'Tive dias difíceis',
    mensagem: 'Dias difíceis acontecem, e isso não apaga o que você já construiu. Hoje, cuide de você primeiro.',
  },
  {
    chave: 'reorganizar',
    label: 'Preciso reorganizar minha rotina',
    mensagem: 'Faz sentido. Que tal começar só registrando uma refeição hoje, sem se cobrar pelo resto?',
  },
]

export default function ModoRecomecar() {
  const { escolherOpcaoRecomecar, fecharModoRecomecar } = useApp()
  const [opcaoEscolhida, setOpcaoEscolhida] = useState(null)
  const dialogRef = useRef(null)

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') fecharModoRecomecar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fecharModoRecomecar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  async function escolher(chave) {
    setOpcaoEscolhida(chave)
    await escolherOpcaoRecomecar(chave)
  }

  const resposta = OPCOES.find((o) => o.chave === opcaoEscolhida)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-verde-escuro/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modo-recomecar-titulo"
    >
      <button
        type="button"
        onClick={fecharModoRecomecar}
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
        {!resposta ? (
          <>
            <p id="modo-recomecar-titulo" className="font-serif text-xl font-bold italic text-white">
              Você não perdeu tudo o que construiu.
            </p>
            <p className="mt-2 text-sm text-white/85">Vamos recomeçar de onde estamos?</p>
            <div className="mt-6 space-y-3">
              {OPCOES.map((o) => (
                <button
                  key={o.chave}
                  type="button"
                  onClick={() => escolher(o.chave)}
                  className="w-full rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p id="modo-recomecar-titulo" className="text-base leading-relaxed text-white">
              {resposta.mensagem}
            </p>
            <button
              type="button"
              onClick={fecharModoRecomecar}
              className="mt-6 w-full rounded-2xl bg-ouro px-4 py-3 text-sm font-bold text-verde-escuro hover:brightness-105"
            >
              Ir para o Hoje
            </button>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/game/ModoRecomecar.jsx
git commit -m "feat: cria o modal do Modo Recomecar"
```

---

### Task 5: Mount the modal in `Hoje.jsx`

**Files:**
- Modify: `src/components/hoje/Hoje.jsx`

**Interfaces:**
- Consumes: `ModoRecomecar` default export (Task 4), `modoRecomecarAberto` from `useApp()` (Task 3).

- [ ] **Step 1: Add the lazy import**

Next to the other game-modal lazy imports (currently lines 25-27):

```js
const ConclusaoDia = lazy(() => import('../game/ConclusaoDia.jsx'))
const Conclusao30Dias = lazy(() => import('../game/Conclusao30Dias.jsx'))
const Conclusao90Dias = lazy(() => import('../game/Conclusao90Dias.jsx'))
const ModoRecomecar = lazy(() => import('../game/ModoRecomecar.jsx'))
```

- [ ] **Step 2: Destructure `modoRecomecarAberto` from `useApp()`**

In the existing `useApp()` destructure block (currently lines ~30-51), add it next to `conclusaoDiaAberta`:

```js
    conclusaoDiaAberta,
    abrirConclusaoDia,
    conclusao30Aberta,
    conclusao90Aberta,
    modoRecomecarAberto,
    atualizarFotoPerfil,
  } = useApp()
```

- [ ] **Step 3: Render the modal**

Right after the `conclusaoDiaAberta` block (currently lines 403-408):

```jsx
      {/* Tela de conclusão do dia (compartilhável) */}
      {conclusaoDiaAberta && (
        <Suspense fallback={<CarregandoFallback />}>
          <ConclusaoDia />
        </Suspense>
      )}

      {/* Modo Recomeçar: acolhimento sem culpa ao voltar após dias sem abrir o app */}
      {modoRecomecarAberto && (
        <Suspense fallback={<CarregandoFallback />}>
          <ModoRecomecar />
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
git commit -m "feat: monta o Modo Recomecar na tela Hoje"
```

---

### Task 6: Manual verification in the browser

No React component-testing harness exists in this repo (see Global Constraints), so this feature's UI must be verified manually against a running dev server rather than with an automated component test.

- [ ] **Step 1: Start the dev server and log in as a test user**

Use the project's normal dev workflow (`npm run dev`) and sign in with a test account that already has a `mwa_game` row.

- [ ] **Step 2: Force a gap in the database to trigger the modal**

Via the Supabase MCP `execute_sql` tool (`project_id: kfavxgrvikflzyzvcoyb`):

```sql
update public.mwa_game
set ultimo_dia_acesso = current_date - interval '3 days',
    recomecar_pendente = false
where user_id = '<test-user-id>';
```

- [ ] **Step 3: Reload the app and confirm the modal appears**

Reload the page in the browser. Confirm:
- The Modo Recomeçar modal opens automatically over the Hoje screen.
- The 3 options render with the exact labels from the spec.
- Clicking each option (in separate test passes) shows the matching acolhimento message and an "Ir para o Hoje" button.
- Clicking "Ir para o Hoje" closes the modal and returns to the normal Hoje screen.

- [ ] **Step 4: Confirm reappearance behavior**

Repeat Step 2 to reset the gap, reload, and this time close the modal with the X **without** picking an option. Reload the page again and confirm the modal reappears (because `recomecar_pendente` is still `true` in the database).

- [ ] **Step 5: Confirm resolution persists**

Pick an option and click "Ir para o Hoje". Reload the page again and confirm the modal does **not** reappear (because `recomecar_pendente` was cleared).

- [ ] **Step 6: Confirm the streak system is unaffected**

Check (via `execute_sql` or the Progresso/Hoje screen) that `sequencia_dias` and `sementes` on `mwa_game` updated normally during this flow, exactly as they did before this feature existed.
