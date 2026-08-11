# Início Personalizado (Onboarding) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new onboarding screens (motivational personalization + optional habits check-in) that feed a personalized reception sentence shown on the existing final onboarding screen, with all answers persisted to `mwa_perfis`.

**Architecture:** Pure data (option lists + sentence-building/normalization functions) lives in a new `.js` util file, testable with `node --test`. Two new screen components reuse a small shared chip-selector component and plug into the existing `OnboardingFlow.jsx` state machine exactly like the current 5 screens do. `TelaMetas.jsx` (already the final screen) grows one new paragraph. `concluirOnboarding` in `AppContext.jsx` grows one new field in its insert.

**Tech Stack:** React 18 (Vite), Tailwind, Supabase (Postgres + JS client), `node --test` for pure-function unit tests.

## Global Constraints

- No AI/LLM integration — the reception sentence is built entirely from a lookup table + template, matching the existing pattern in `TelaMetas.jsx` for the `objetivo` field. Do not add any external API call.
- `foco` and `sentimentoEsperado` are the only two required answers in the new Personalização screen (they feed the reception sentence) — `obstaculo` and `rotina` stay optional. The Hábitos screen is 100% optional end-to-end.
- Habit fields (`sono`, `hidratacao`, `habitosAlimentares`, `intestino`, `disposicao`) normalize to `null` in the database both when the whole Hábitos screen is skipped AND when a specific question is answered "Prefiro não responder" — the two cases must be indistinguishable in storage.
- No React component-testing harness exists in this repo (`node --test` runs plain `.js` files only, no jsdom/testing-library, and cannot import `.jsx` files at all). Any function that needs a unit test MUST live in a plain `.js` file. Component-level correctness is verified manually in the browser (last task).
- Every new question and label needs a Portuguese string and an English string (`useIdioma()`'s `ingles` flag), matching the bilingual convention already used in every existing onboarding screen (see `TelaBiometria.jsx`'s `_EN` object pattern).
- Bilingual English copy for this plan's new question titles and every option label is given in each task's code block — use it verbatim, do not invent alternate phrasing.

---

### Task 1: Add `personalizacao` column to `mwa_perfis`

**Files:**
- No local file changes — this project's Supabase schema changes are applied directly via the Supabase MCP `apply_migration` tool (established pattern in this repo — confirmed by the equivalent DB task in the Modo Recomeçar plan).

**Interfaces:**
- Produces: column `public.mwa_perfis.personalizacao jsonb not null default '{}'::jsonb`, consumed by Task 6's `concluirOnboarding` insert.

- [ ] **Step 1: Apply the migration**

Call the Supabase MCP tool `mcp__6a44cad9-913e-461b-856a-59f5f5d07b69__apply_migration` with:
- `project_id`: `kfavxgrvikflzyzvcoyb`
- `name`: `adicionar_personalizacao_mwa_perfis`
- `query`:

```sql
alter table public.mwa_perfis
  add column if not exists personalizacao jsonb not null default '{}'::jsonb;
```

- [ ] **Step 2: Verify the column exists**

Call `mcp__6a44cad9-913e-461b-856a-59f5f5d07b69__execute_sql` with `project_id: kfavxgrvikflzyzvcoyb` and query:

```sql
select column_name, data_type, column_default, is_nullable
from information_schema.columns
where table_name = 'mwa_perfis' and column_name = 'personalizacao';
```

Confirm it returns `data_type: jsonb`, `is_nullable: NO`, `column_default` containing `'{}'::jsonb`.

No commit needed for this task (no local files changed).

---

### Task 2: Option data + pure functions in `src/utils/personalizacao.js`

**Files:**
- Create: `src/utils/personalizacao.js`
- Test: `src/utils/personalizacao.test.js`

**Interfaces:**
- Produces (all named exports):
  - `OPCOES_FOCO`, `OPCOES_OBSTACULO`, `OPCOES_ROTINA`, `OPCOES_SENTIMENTO_ESPERADO` — arrays of `{ id: string, label: string, fragmento?: string }` (only `OPCOES_FOCO` and `OPCOES_SENTIMENTO_ESPERADO` entries carry `fragmento`).
  - `OPCOES_SONO`, `OPCOES_HIDRATACAO`, `OPCOES_HABITOS_ALIMENTARES`, `OPCOES_INTESTINO`, `OPCOES_DISPOSICAO` — arrays of `{ id: string, label: string }`.
  - `montarFraseRecepcao(dados) => { foco: string|null, sentimento: string|null }` — consumed by Task 6's `TelaMetas.jsx`.
  - `montarPersonalizacaoParaSalvar(dados) => object` — the exact shape to persist in `mwa_perfis.personalizacao`, consumed by Task 6's `AppContext.jsx`.
- Consumes: nothing external.

- [ ] **Step 1: Write the failing tests**

Create `src/utils/personalizacao.test.js`:

```js
import test from 'node:test'
import assert from 'node:assert/strict'
import { montarFraseRecepcao, montarPersonalizacaoParaSalvar, OPCOES_FOCO, OPCOES_SENTIMENTO_ESPERADO } from './personalizacao.js'

test('OPCOES_FOCO e OPCOES_SENTIMENTO_ESPERADO tem 4 opcoes cada, todas com fragmento', () => {
  assert.equal(OPCOES_FOCO.length, 4)
  assert.equal(OPCOES_SENTIMENTO_ESPERADO.length, 4)
  assert.ok(OPCOES_FOCO.every((o) => typeof o.fragmento === 'string' && o.fragmento.length > 0))
  assert.ok(OPCOES_SENTIMENTO_ESPERADO.every((o) => typeof o.fragmento === 'string' && o.fragmento.length > 0))
})

test('montarFraseRecepcao usa o fragmento da opcao escolhida', () => {
  const { foco, sentimento } = montarFraseRecepcao({
    foco: 'rotina',
    focoOutro: '',
    sentimentoEsperado: 'orgulhosa',
    sentimentoEsperadoOutro: '',
  })
  assert.equal(foco, 'sua rotina e constância')
  assert.equal(sentimento, 'orgulhosa de ter sido constante')
})

test('montarFraseRecepcao usa o texto livre quando a opcao e "outro"', () => {
  const { foco, sentimento } = montarFraseRecepcao({
    foco: 'outro',
    focoOutro: 'comer sem culpa nos fins de semana',
    sentimentoEsperado: 'outro',
    sentimentoEsperadoOutro: 'orgulhosa das minhas escolhas',
  })
  assert.equal(foco, 'comer sem culpa nos fins de semana')
  assert.equal(sentimento, 'orgulhosa das minhas escolhas')
})

test('montarFraseRecepcao retorna null quando a resposta esta vazia', () => {
  const { foco, sentimento } = montarFraseRecepcao({ foco: '', focoOutro: '', sentimentoEsperado: '', sentimentoEsperadoOutro: '' })
  assert.equal(foco, null)
  assert.equal(sentimento, null)
})

test('montarPersonalizacaoParaSalvar normaliza habitos pulados para null', () => {
  const dados = {
    foco: 'rotina', focoOutro: '',
    obstaculo: '', obstaculoOutro: '',
    rotina: '', rotinaOutro: '',
    sentimentoEsperado: 'orgulhosa', sentimentoEsperadoOutro: '',
    sono: '', hidratacao: '', habitosAlimentares: '', intestino: '', disposicao: '',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.sono, null)
  assert.equal(salvo.hidratacao, null)
  assert.equal(salvo.habitosAlimentares, null)
  assert.equal(salvo.intestino, null)
  assert.equal(salvo.disposicao, null)
  assert.equal(salvo.obstaculo, null)
  assert.equal(salvo.rotina, null)
})

test('montarPersonalizacaoParaSalvar preserva o texto livre de "outro" em obstaculo e rotina', () => {
  const dados = {
    foco: 'rotina', focoOutro: '',
    obstaculo: 'outro', obstaculoOutro: 'quando viajo',
    rotina: 'outro', rotinaOutro: 'muda toda semana',
    sentimentoEsperado: 'orgulhosa', sentimentoEsperadoOutro: '',
    sono: '', hidratacao: '', habitosAlimentares: '', intestino: '', disposicao: '',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.obstaculo, 'outro')
  assert.equal(salvo.obstaculoOutro, 'quando viajo')
  assert.equal(salvo.rotina, 'outro')
  assert.equal(salvo.rotinaOutro, 'muda toda semana')
})

test('montarPersonalizacaoParaSalvar normaliza "prefiro_nao_responder" para null, igual a pular', () => {
  const dados = {
    foco: 'rotina', focoOutro: '',
    obstaculo: '', obstaculoOutro: '',
    rotina: '', rotinaOutro: '',
    sentimentoEsperado: 'orgulhosa', sentimentoEsperadoOutro: '',
    sono: 'prefiro_nao_responder', hidratacao: '', habitosAlimentares: '', intestino: 'prefiro_nao_responder', disposicao: '',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.sono, null)
  assert.equal(salvo.intestino, null)
})

test('montarPersonalizacaoParaSalvar preserva respostas reais e o texto livre de "outro"', () => {
  const dados = {
    foco: 'outro', focoOutro: 'comer sem culpa',
    obstaculo: 'cobranca', obstaculoOutro: '',
    rotina: 'corrida', rotinaOutro: '',
    sentimentoEsperado: 'leve', sentimentoEsperadoOutro: '',
    sono: 'cansada', hidratacao: 'bastante', habitosAlimentares: 'equilibrados', intestino: 'regular', disposicao: 'alta',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.foco, 'outro')
  assert.equal(salvo.focoOutro, 'comer sem culpa')
  assert.equal(salvo.obstaculo, 'cobranca')
  assert.equal(salvo.rotina, 'corrida')
  assert.equal(salvo.sono, 'cansada')
  assert.equal(salvo.hidratacao, 'bastante')
  assert.equal(salvo.habitosAlimentares, 'equilibrados')
  assert.equal(salvo.intestino, 'regular')
  assert.equal(salvo.disposicao, 'alta')
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/utils/personalizacao.test.js`
Expected: FAIL — `personalizacao.js` doesn't exist yet.

- [ ] **Step 3: Create `src/utils/personalizacao.js`**

```js
// Opcoes e logica pura de personalizacao do onboarding (perguntas de
// motivacao e habitos). Nenhuma chamada externa/IA — a frase de recepcao e
// montada por lookup de fragmento, mesmo padrao usado para "objetivo" em
// calculos.js/TelaMetas.jsx.

export const OPCOES_FOCO = [
  { id: 'alimentacao', label: 'Sua relação com a alimentação', fragmento: 'sua relação com a alimentação' },
  { id: 'corpo', label: 'Seu corpo e disposição', fragmento: 'seu corpo e disposição' },
  { id: 'rotina', label: 'Sua rotina e constância', fragmento: 'sua rotina e constância' },
  { id: 'emocional', label: 'Sua relação emocional com a comida', fragmento: 'sua relação emocional com a comida' },
]

export const OPCOES_OBSTACULO = [
  { id: 'falta_tempo', label: 'Quando a rotina fica corrida' },
  { id: 'perde_motivacao', label: 'Depois que a motivação inicial passa' },
  { id: 'cobranca', label: 'Quando me cobro demais e desanimo' },
  { id: 'fora_da_dieta', label: 'Depois de escapar da dieta uma vez' },
]

export const OPCOES_ROTINA = [
  { id: 'corrida', label: 'Corrida, sem tempo pra mim' },
  { id: 'organizada_sem_foco', label: 'Organizada, mas sem espaço pra me cuidar' },
  { id: 'tranquila_sem_constancia', label: 'Tranquila, mas sem constância' },
  { id: 'bagunçada', label: 'Bagunçada, quero recomeçar' },
]

export const OPCOES_SENTIMENTO_ESPERADO = [
  { id: 'leve', label: 'Mais leve e disposta', fragmento: 'mais leve e disposta' },
  { id: 'orgulhosa', label: 'Orgulhosa de ter sido constante', fragmento: 'orgulhosa de ter sido constante' },
  { id: 'tranquila', label: 'Com uma relação mais tranquila com a comida', fragmento: 'com uma relação mais tranquila com a comida' },
  { id: 'confiante', label: 'Mais confiante com meu corpo', fragmento: 'mais confiante com meu corpo' },
]

export const OPCOES_SONO = [
  { id: 'bem_disposta', label: 'Durmo bem e acordo disposta' },
  { id: 'cansada', label: 'Durmo, mas acordo cansada' },
  { id: 'pouco', label: 'Durmo pouco (menos de 6h)' },
  { id: 'irregular', label: 'Sono irregular, varia muito' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_HIDRATACAO = [
  { id: 'bastante', label: 'Bebo bastante água todo dia' },
  { id: 'pouca', label: 'Bebo pouca água, esqueço' },
  { id: 'so_com_sede', label: 'Só bebo quando sinto muita sede' },
  { id: 'troca_por_outras', label: 'Troco água por outras bebidas (café, suco, refrigerante)' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_HABITOS_ALIMENTARES = [
  { id: 'equilibrados', label: 'Equilibrados, mas quero evoluir' },
  { id: 'desorganizados', label: 'Desorganizados, como o que der' },
  { id: 'restritivos', label: 'Muito restritivos, vivo de dieta em dieta' },
  { id: 'exagero_fds', label: 'Bons, mas com exageros no fim de semana' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_INTESTINO = [
  { id: 'regular', label: 'Funciona bem, regular' },
  { id: 'preso', label: 'Preso, com frequência' },
  { id: 'irregular', label: 'Muito irregular, varia bastante' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_DISPOSICAO = [
  { id: 'alta', label: 'Alta, me sinto com energia' },
  { id: 'cansaco_maior_parte', label: 'Cansaço na maior parte do tempo' },
  { id: 'so_manha', label: 'Só de manhã, canso ao longo do dia' },
  { id: 'vai_e_volta', label: 'Vai e volta, depende do dia' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

// Monta os dois fragmentos usados na frase de recepção da tela final do
// onboarding (TelaMetas.jsx). Retorna null para um fragmento se a
// resposta correspondente ainda não foi preenchida.
export function montarFraseRecepcao(dados) {
  const foco = dados.foco === 'outro'
    ? (dados.focoOutro || null)
    : (OPCOES_FOCO.find((o) => o.id === dados.foco)?.fragmento ?? null)
  const sentimento = dados.sentimentoEsperado === 'outro'
    ? (dados.sentimentoEsperadoOutro || null)
    : (OPCOES_SENTIMENTO_ESPERADO.find((o) => o.id === dados.sentimentoEsperado)?.fragmento ?? null)
  return { foco, sentimento }
}

// "Prefiro não responder" e "nunca respondeu" devem ser indistinguíveis no
// banco — ambos viram null.
function normalizarHabito(valor) {
  if (!valor || valor === 'prefiro_nao_responder') return null
  return valor
}

// Monta o objeto exato a ser salvo em mwa_perfis.personalizacao a partir
// do estado bruto do formulário de onboarding.
export function montarPersonalizacaoParaSalvar(dados) {
  return {
    foco: dados.foco || null,
    focoOutro: dados.foco === 'outro' ? (dados.focoOutro || null) : null,
    obstaculo: normalizarHabito(dados.obstaculo),
    obstaculoOutro: dados.obstaculo === 'outro' ? (dados.obstaculoOutro || null) : null,
    rotina: normalizarHabito(dados.rotina),
    rotinaOutro: dados.rotina === 'outro' ? (dados.rotinaOutro || null) : null,
    sentimentoEsperado: dados.sentimentoEsperado || null,
    sentimentoEsperadoOutro: dados.sentimentoEsperado === 'outro' ? (dados.sentimentoEsperadoOutro || null) : null,
    sono: normalizarHabito(dados.sono),
    hidratacao: normalizarHabito(dados.hidratacao),
    habitosAlimentares: normalizarHabito(dados.habitosAlimentares),
    intestino: normalizarHabito(dados.intestino),
    disposicao: normalizarHabito(dados.disposicao),
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/utils/personalizacao.test.js`
Expected: PASS, all 7 tests green.

- [ ] **Step 5: Run the full test suite to check for regressions**

Run: `npm test`
Expected: PASS (one pre-existing unrelated failure in `src/data/farm/integridade.test.js` — a known JSX-resolution issue in the test runner, not caused by this change).

- [ ] **Step 6: Commit**

```bash
git add src/utils/personalizacao.js src/utils/personalizacao.test.js
git commit -m "feat: adiciona dados e logica pura de personalizacao do onboarding"
```

---

### Task 3: `SeletorPergunta` reusable chip-question component

**Files:**
- Create: `src/components/onboarding/SeletorPergunta.jsx`

**Interfaces:**
- Produces: default export `SeletorPergunta`, props: `{ idGrupo: string, titulo: string, opcoes: Array<{id, label}>, labelsEn: Record<string,string>, ingles: boolean, valor: string, aoEscolher: (id: string) => void, permiteOutro?: boolean, valorOutro?: string, aoMudarOutro?: (texto: string) => void, placeholderOutro?: string }`. Consumed by Tasks 4 and 5.
- Consumes: nothing beyond its props (no context, no data imports — purely presentational).

- [ ] **Step 1: Create the component**

```jsx
export default function SeletorPergunta({
  idGrupo,
  titulo,
  opcoes,
  labelsEn,
  ingles,
  valor,
  aoEscolher,
  permiteOutro = false,
  valorOutro = '',
  aoMudarOutro,
  placeholderOutro,
}) {
  const chipClasse = (selecionado) =>
    `rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
      selecionado
        ? 'border-sage bg-sage-claro text-verde'
        : 'border-sage/25 bg-white text-verde/60 hover:border-sage/50'
    }`

  return (
    <div>
      <span id={idGrupo} className="mb-2 block text-sm font-semibold text-verde">{titulo}</span>
      <div role="group" aria-labelledby={idGrupo} className="flex flex-wrap gap-2">
        {opcoes.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => aoEscolher(op.id)}
            aria-pressed={valor === op.id}
            className={chipClasse(valor === op.id)}
          >
            {ingles ? (labelsEn[op.id] ?? op.label) : op.label}
          </button>
        ))}
        {permiteOutro && (
          <button
            type="button"
            onClick={() => aoEscolher('outro')}
            aria-pressed={valor === 'outro'}
            className={chipClasse(valor === 'outro')}
          >
            {ingles ? 'Other' : 'Outro'}
          </button>
        )}
      </div>
      {permiteOutro && valor === 'outro' && (
        <input
          type="text"
          value={valorOutro}
          onChange={(e) => aoMudarOutro(e.target.value)}
          placeholder={placeholderOutro}
          className="mt-2 w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-3 text-sm font-medium text-verde outline-none transition-colors focus:border-sage"
        />
      )}
    </div>
  )
}
```

- [ ] **Step 2: Run the production build to check for JSX/syntax errors**

Run: `npm run build`
Expected: succeeds (this file isn't imported anywhere yet, so this mainly checks for syntax errors via Vite's parse).

- [ ] **Step 3: Commit**

```bash
git add src/components/onboarding/SeletorPergunta.jsx
git commit -m "feat: cria o seletor de pergunta reutilizavel do onboarding"
```

---

### Task 4: `TelaPersonalizacao.jsx` (motivation screen)

**Files:**
- Create: `src/components/onboarding/TelaPersonalizacao.jsx`

**Interfaces:**
- Consumes: `SeletorPergunta` (Task 3, default export), `OPCOES_FOCO`, `OPCOES_OBSTACULO`, `OPCOES_ROTINA`, `OPCOES_SENTIMENTO_ESPERADO` (Task 2), `useIdioma()` from `../../context/IdiomaContext.jsx` (existing, returns `{ ingles, locale }`), `Botao` from `../ui/Botao.jsx` (existing).
- Produces: default export `TelaPersonalizacao`, props: `{ dados, atualizar, avancar, voltar }` — same prop shape as the existing `TelaBiometria`/`TelaCorporais` screens. Consumed by Task 6's `OnboardingFlow.jsx`. Expects `dados` to already contain the 8 motivation-screen fields (`foco`, `focoOutro`, `obstaculo`, `obstaculoOutro`, `rotina`, `rotinaOutro`, `sentimentoEsperado`, `sentimentoEsperadoOutro`) as strings — Task 6 adds them to `OnboardingFlow.jsx`'s initial state.

- [ ] **Step 1: Create the component**

```jsx
import Botao from '../ui/Botao.jsx'
import SeletorPergunta from './SeletorPergunta.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { OPCOES_FOCO, OPCOES_OBSTACULO, OPCOES_ROTINA, OPCOES_SENTIMENTO_ESPERADO } from '../../utils/personalizacao.js'

const FOCO_EN = {
  alimentacao: 'Your relationship with food',
  corpo: 'Your body and energy',
  rotina: 'Your routine and consistency',
  emocional: 'Your emotional relationship with food',
}

const OBSTACULO_EN = {
  falta_tempo: 'When my routine gets busy',
  perde_motivacao: 'After the initial motivation fades',
  cobranca: "When I'm too hard on myself and give up",
  fora_da_dieta: 'After slipping off my diet once',
}

const ROTINA_EN = {
  corrida: 'Busy, no time for myself',
  organizada_sem_foco: 'Organized, but no room to take care of myself',
  tranquila_sem_constancia: 'Calm, but not consistent',
  bagunçada: 'Messy, I want a fresh start',
}

const SENTIMENTO_EN = {
  leve: 'Lighter and more energetic',
  orgulhosa: 'Proud of staying consistent',
  tranquila: 'With a calmer relationship with food',
  confiante: 'More confident in my body',
}

export default function TelaPersonalizacao({ dados, atualizar, avancar, voltar }) {
  const { ingles } = useIdioma()

  function escolher(campo, valor) {
    atualizar(campo, valor)
    if (valor !== 'outro') atualizar(`${campo}Outro`, '')
  }

  const valido =
    dados.foco &&
    (dados.foco !== 'outro' || dados.focoOutro.trim().length > 0) &&
    dados.sentimentoEsperado &&
    (dados.sentimentoEsperado !== 'outro' || dados.sentimentoEsperadoOutro.trim().length > 0)

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {ingles ? "Let's get to know you better" : 'Vamos te conhecer melhor'}
        </h1>
        <p className="mt-3 text-verde/70">
          {ingles
            ? 'Your answers help us personalize your journey from day one.'
            : 'Suas respostas ajudam a gente a personalizar sua jornada desde o primeiro dia.'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <SeletorPergunta
          idGrupo="grupo-foco"
          titulo={ingles ? 'What do you most want to transform?' : 'O que mais deseja transformar?'}
          opcoes={OPCOES_FOCO}
          labelsEn={FOCO_EN}
          ingles={ingles}
          valor={dados.foco}
          aoEscolher={(v) => escolher('foco', v)}
          permiteOutro
          valorOutro={dados.focoOutro}
          aoMudarOutro={(v) => atualizar('focoOutro', v)}
          placeholderOutro={ingles ? 'e.g. eating without guilt on weekends' : 'ex: comer sem culpa nos fins de semana'}
        />
        <SeletorPergunta
          idGrupo="grupo-obstaculo"
          titulo={ingles ? 'When do you usually give up?' : 'Em que momento costuma desistir?'}
          opcoes={OPCOES_OBSTACULO}
          labelsEn={OBSTACULO_EN}
          ingles={ingles}
          valor={dados.obstaculo}
          aoEscolher={(v) => escolher('obstaculo', v)}
          permiteOutro
          valorOutro={dados.obstaculoOutro}
          aoMudarOutro={(v) => atualizar('obstaculoOutro', v)}
          placeholderOutro={ingles ? 'e.g. when I travel' : 'ex: quando viajo'}
        />
        <SeletorPergunta
          idGrupo="grupo-rotina"
          titulo={ingles ? 'How is your routine today?' : 'Como está sua rotina hoje?'}
          opcoes={OPCOES_ROTINA}
          labelsEn={ROTINA_EN}
          ingles={ingles}
          valor={dados.rotina}
          aoEscolher={(v) => escolher('rotina', v)}
          permiteOutro
          valorOutro={dados.rotinaOutro}
          aoMudarOutro={(v) => atualizar('rotinaOutro', v)}
          placeholderOutro={ingles ? 'e.g. changes every week' : 'ex: muda toda semana'}
        />
        <SeletorPergunta
          idGrupo="grupo-sentimento"
          titulo={ingles ? 'What do you hope to feel at the end of the 90 days?' : 'O que espera sentir ao final dos 90 dias?'}
          opcoes={OPCOES_SENTIMENTO_ESPERADO}
          labelsEn={SENTIMENTO_EN}
          ingles={ingles}
          valor={dados.sentimentoEsperado}
          aoEscolher={(v) => escolher('sentimentoEsperado', v)}
          permiteOutro
          valorOutro={dados.sentimentoEsperadoOutro}
          aoMudarOutro={(v) => atualizar('sentimentoEsperadoOutro', v)}
          placeholderOutro={ingles ? 'e.g. proud of my choices' : 'ex: orgulhosa das minhas escolhas'}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar} disabled={!valido}>
          {ingles ? 'Continue' : 'Continuar'}
        </Botao>
        <Botao variante="secundario" onClick={voltar}>
          {ingles ? 'Back' : 'Voltar'}
        </Botao>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Run the production build to check for errors**

Run: `npm run build`
Expected: succeeds (still not wired into `OnboardingFlow.jsx` yet, so this only checks syntax/imports resolve).

- [ ] **Step 3: Commit**

```bash
git add src/components/onboarding/TelaPersonalizacao.jsx
git commit -m "feat: cria a tela de personalizacao motivacional do onboarding"
```

---

### Task 5: `TelaHabitos.jsx` (optional habits screen)

**Files:**
- Create: `src/components/onboarding/TelaHabitos.jsx`

**Interfaces:**
- Consumes: `SeletorPergunta` (Task 3), `OPCOES_SONO`, `OPCOES_HIDRATACAO`, `OPCOES_HABITOS_ALIMENTARES`, `OPCOES_INTESTINO`, `OPCOES_DISPOSICAO` (Task 2), `useIdioma()`, `Botao`.
- Produces: default export `TelaHabitos`, props `{ dados, atualizar, avancar, voltar }` — same shape as Task 4. Consumed by Task 6's `OnboardingFlow.jsx`. Expects `dados.sono`, `dados.hidratacao`, `dados.habitosAlimentares`, `dados.intestino`, `dados.disposicao` as strings (Task 6 adds them to initial state).

- [ ] **Step 1: Create the component**

```jsx
import Botao from '../ui/Botao.jsx'
import SeletorPergunta from './SeletorPergunta.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import {
  OPCOES_SONO,
  OPCOES_HIDRATACAO,
  OPCOES_HABITOS_ALIMENTARES,
  OPCOES_INTESTINO,
  OPCOES_DISPOSICAO,
} from '../../utils/personalizacao.js'

const SONO_EN = {
  bem_disposta: 'I sleep well and wake up rested',
  cansada: 'I sleep, but wake up tired',
  pouco: 'I sleep little (less than 6h)',
  irregular: 'Irregular sleep, varies a lot',
  prefiro_nao_responder: 'Prefer not to say',
}

const HIDRATACAO_EN = {
  bastante: 'I drink plenty of water every day',
  pouca: 'I drink little water, I forget',
  so_com_sede: 'I only drink when very thirsty',
  troca_por_outras: 'I swap water for other drinks (coffee, juice, soda)',
  prefiro_nao_responder: 'Prefer not to say',
}

const HABITOS_ALIMENTARES_EN = {
  equilibrados: 'Balanced, but I want to improve',
  desorganizados: 'Disorganized, I eat whatever',
  restritivos: 'Very restrictive, diet after diet',
  exagero_fds: 'Good, but I overdo it on weekends',
  prefiro_nao_responder: 'Prefer not to say',
}

const INTESTINO_EN = {
  regular: 'Works well, regular',
  preso: 'Constipated, frequently',
  irregular: 'Very irregular, varies a lot',
  prefiro_nao_responder: 'Prefer not to say',
}

const DISPOSICAO_EN = {
  alta: 'High, I feel energetic',
  cansaco_maior_parte: 'Tired most of the time',
  so_manha: 'Only in the morning, I tire throughout the day',
  vai_e_volta: 'Comes and goes, depends on the day',
  prefiro_nao_responder: 'Prefer not to say',
}

export default function TelaHabitos({ dados, atualizar, avancar, voltar }) {
  const { ingles } = useIdioma()

  return (
    <>
      <div className="mb-6">
        <span className="mb-3 inline-block rounded-full bg-sage-claro px-3 py-1 text-xs font-semibold text-verde">
          {ingles ? 'Optional, but recommended' : 'Opcional, mas recomendado'}
        </span>
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {ingles ? 'Your habits today' : 'Seus hábitos hoje'}
        </h1>
        <p className="mt-3 text-verde/70">
          {ingles
            ? 'This helps us give you more accurate tips throughout the journey.'
            : 'Isso nos ajuda a te dar dicas mais certeiras ao longo da jornada.'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <SeletorPergunta
          idGrupo="grupo-sono"
          titulo={ingles ? 'How is your sleep?' : 'Como está seu sono?'}
          opcoes={OPCOES_SONO}
          labelsEn={SONO_EN}
          ingles={ingles}
          valor={dados.sono}
          aoEscolher={(v) => atualizar('sono', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-hidratacao"
          titulo={ingles ? 'How is your hydration?' : 'Como está sua hidratação?'}
          opcoes={OPCOES_HIDRATACAO}
          labelsEn={HIDRATACAO_EN}
          ingles={ingles}
          valor={dados.hidratacao}
          aoEscolher={(v) => atualizar('hidratacao', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-habitos-alimentares"
          titulo={ingles ? 'How do you rate your eating habits today?' : 'Como você considera seus hábitos alimentares hoje?'}
          opcoes={OPCOES_HABITOS_ALIMENTARES}
          labelsEn={HABITOS_ALIMENTARES_EN}
          ingles={ingles}
          valor={dados.habitosAlimentares}
          aoEscolher={(v) => atualizar('habitosAlimentares', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-intestino"
          titulo={ingles ? 'How is your digestion?' : 'Como está seu intestino?'}
          opcoes={OPCOES_INTESTINO}
          labelsEn={INTESTINO_EN}
          ingles={ingles}
          valor={dados.intestino}
          aoEscolher={(v) => atualizar('intestino', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-disposicao"
          titulo={ingles ? 'How is your energy day-to-day?' : 'Como está sua disposição no dia a dia?'}
          opcoes={OPCOES_DISPOSICAO}
          labelsEn={DISPOSICAO_EN}
          ingles={ingles}
          valor={dados.disposicao}
          aoEscolher={(v) => atualizar('disposicao', v)}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar}>{ingles ? 'Continue' : 'Continuar'}</Botao>
        <button type="button" onClick={avancar} className="flex min-h-11 items-center justify-center py-1 text-sm font-medium text-verde/70 underline">
          {ingles ? 'Skip this step' : 'Pular esta etapa'}
        </button>
        <Botao variante="secundario" onClick={voltar}>
          {ingles ? 'Back' : 'Voltar'}
        </Botao>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Run the production build to check for errors**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/onboarding/TelaHabitos.jsx
git commit -m "feat: cria a tela opcional de habitos do onboarding"
```

---

### Task 6: Wire the two screens into the onboarding flow, save data, show the reception sentence

**Files:**
- Modify: `src/components/onboarding/OnboardingFlow.jsx`
- Modify: `src/components/onboarding/TelaMetas.jsx`
- Modify: `src/context/AppContext.jsx`

**Interfaces:**
- Consumes: `TelaPersonalizacao` (Task 4), `TelaHabitos` (Task 5), `montarFraseRecepcao`, `montarPersonalizacaoParaSalvar` (Task 2).

- [ ] **Step 1: Add the 13 new fields to `OnboardingFlow.jsx`'s initial state**

In `src/components/onboarding/OnboardingFlow.jsx`, the `dados` initial state currently ends with `medidas: { cintura: '', quadril: '', peito: '', braco: '', coxa: '' },` (line 30). Add these fields right after it, before the closing `})`:

```js
    foco: '',
    focoOutro: '',
    obstaculo: '',
    obstaculoOutro: '',
    rotina: '',
    rotinaOutro: '',
    sentimentoEsperado: '',
    sentimentoEsperadoOutro: '',
    sono: '',
    hidratacao: '',
    habitosAlimentares: '',
    intestino: '',
    disposicao: '',
```

- [ ] **Step 2: Add the imports and grow `TOTAL_TELAS` to 7**

At the top of the same file, add two imports next to the existing screen imports (after the `TelaCorporais` import, before `TelaMetas`):

```js
import TelaPersonalizacao from './TelaPersonalizacao.jsx'
import TelaHabitos from './TelaHabitos.jsx'
```

Change `const TOTAL_TELAS = 5` to `const TOTAL_TELAS = 7`.

- [ ] **Step 3: Insert the two screens into the `telas` array**

The current `telas` array is:

```js
  const telas = [
    <TelaConsentimento key="0" dados={dados} atualizar={atualizar} avancar={avancar} />,
    <TelaContato key="1" dados={dados} atualizar={atualizar} avancar={avancar} />,
    <TelaBiometria key="2" dados={dados} atualizar={atualizar} avancar={avancar} voltar={voltar} />,
    <TelaCorporais key="3" dados={dados} atualizarMedida={atualizarMedida} avancar={avancar} voltar={voltar} />,
    <TelaMetas key="4" dados={dados} finalizar={finalizar} voltar={voltar} />,
  ]
```

Replace it with (two new screens inserted at keys 4 and 5, `TelaMetas` moves to key 6):

```js
  const telas = [
    <TelaConsentimento key="0" dados={dados} atualizar={atualizar} avancar={avancar} />,
    <TelaContato key="1" dados={dados} atualizar={atualizar} avancar={avancar} />,
    <TelaBiometria key="2" dados={dados} atualizar={atualizar} avancar={avancar} voltar={voltar} />,
    <TelaCorporais key="3" dados={dados} atualizarMedida={atualizarMedida} avancar={avancar} voltar={voltar} />,
    <TelaPersonalizacao key="4" dados={dados} atualizar={atualizar} avancar={avancar} voltar={voltar} />,
    <TelaHabitos key="5" dados={dados} atualizar={atualizar} avancar={avancar} voltar={voltar} />,
    <TelaMetas key="6" dados={dados} finalizar={finalizar} voltar={voltar} />,
  ]
```

- [ ] **Step 4: Show the reception sentence in `TelaMetas.jsx`**

In `src/components/onboarding/TelaMetas.jsx`, add the import at the top (next to the existing `calcularMetas, OBJETIVOS` import):

```js
import { montarFraseRecepcao } from '../../utils/personalizacao.js'
```

Inside the component, right after the existing `const primeiroNome = ...` line, add:

```js
  const { foco, sentimento } = montarFraseRecepcao(dados)
```

Then, right after the existing subtitle paragraph (`<p className="mt-3 text-verde/70">...</p>`, still inside the same `<div className="mb-6">`, before its closing `</div>`), add:

```jsx
        {foco && sentimento && (
          <p className="mt-4 text-verde/80">
            {ingles ? (
              <>{primeiroNome}, over the next 90 days, your focus will be <strong>{foco}</strong>, so you can end up feeling <strong>{sentimento}</strong>.</>
            ) : (
              <>{primeiroNome}, nos próximos 90 dias, seu foco será <strong>{foco}</strong>, para você terminar se sentindo <strong>{sentimento}</strong>.</>
            )}
          </p>
        )}
```

- [ ] **Step 5: Persist `personalizacao` in `concluirOnboarding`**

In `src/context/AppContext.jsx`, add the import next to the other `../lib/` and `../utils/` imports:

```js
import { montarPersonalizacaoParaSalvar } from '../utils/personalizacao.js'
```

In `concluirOnboarding` (around line 502), the `.insert({...})` call currently ends with `idioma,` before the closing `})`. Add one field:

```js
        idioma,
        personalizacao: montarPersonalizacaoParaSalvar(dados),
```

- [ ] **Step 6: Run the full test suite and production build**

Run: `npm test`
Expected: PASS (same pre-existing unrelated failure as every prior task in this plan, nothing new).

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/onboarding/OnboardingFlow.jsx src/components/onboarding/TelaMetas.jsx src/context/AppContext.jsx
git commit -m "feat: liga as telas de personalizacao ao fluxo de onboarding"
```

---

### Task 7: Manual verification in the browser

No React component-testing harness exists in this repo (see Global Constraints), so this feature's UI and the full onboarding flow must be verified manually against a running dev server.

- [ ] **Step 1: Start the dev server**

Use the project's normal dev workflow (`npm run dev`).

- [ ] **Step 2: Create a disposable test account and go through the full onboarding flow, answering everything**

Sign up with a throwaway email. Go through Consentimento → Contato → Biometria → Corporais (fill or skip) → **Personalização**: answer all 4 questions, including picking "Outro" on at least one and typing free text → **Hábitos**: answer all 5 questions, including "Prefiro não responder" on at least one → **Metas**: confirm the reception sentence renders correctly, combining the chosen `foco` and `sentimentoEsperado` fragments (or the typed "Outro" text if that was chosen) into the expected sentence shape, with the person's first name.

- [ ] **Step 3: Confirm the data was saved correctly**

Via the Supabase MCP `execute_sql` tool (`project_id: kfavxgrvikflzyzvcoyb`):

```sql
select personalizacao from public.mwa_perfis where email = '<test-account-email>';
```

Confirm the jsonb has all 13 keys, with the values matching what was picked in Step 2 (including the "Outro" free text and the null normalization not applying here since nothing was skipped).

- [ ] **Step 4: Repeat with the Hábitos screen skipped entirely**

Create a second disposable test account, this time clicking "Pular esta etapa" on the Hábitos screen without answering anything. Confirm in `TelaMetas.jsx` that the reception sentence still renders correctly (it only depends on the Personalização screen, not Hábitos). Then confirm via `execute_sql` that `sono`, `hidratacao`, `habitosAlimentares`, `intestino`, and `disposicao` are all `null` in the saved `personalizacao` jsonb, while `foco`/`sentimentoEsperado`/etc. from the Personalização screen are still populated.

- [ ] **Step 5: Clean up the test accounts**

Delete both disposable test accounts (auth user + `mwa_perfis` row) via the Supabase MCP tools or the app's own account-deletion flow, matching how test accounts were cleaned up in prior testing sessions in this repo.

- [ ] **Step 6: Confirm the "Continuar" gate on the Personalização screen**

On the Personalização screen, confirm "Continuar" stays disabled until both `foco` and `sentimentoEsperado` are answered (chip or "Outro" with non-empty text), and that `obstaculo`/`rotina` being left unanswered does NOT block "Continuar".
