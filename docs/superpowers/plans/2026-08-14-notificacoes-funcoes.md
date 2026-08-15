# Notificações de Funções do App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A daily rotating reminder notification (Reforçando Conceitos, exercício, MWA Farm, Lente da Consciência, a different game each Friday, Versículo do Dia on Sunday, none on Saturday), firing on the first app open of the day, reusing the notification permission the app already requests.

**Architecture:** One new pure-logic-plus-orchestration file, `src/utils/notificacaoFuncoes.js`, following the exact same shape as the existing `src/utils/notificacaoEstrela.js`. Wired into the `useEffect` that already exists in `App.jsx` (the same one that fires the weigh-in reminder today), since that's where `setAba` — needed so tapping the notification jumps to the Ferramentas tab — is directly available.

**Tech Stack:** Plain JS (no new dependencies), browser `Notification` API (already in use elsewhere in this codebase — no service worker, no real push; only fires while/when the app is open), `node:test` for the pure functions.

## Global Constraints

- Do NOT request notification permission — it's already requested automatically today by `configurarNotificacoesPesagem` (`src/utils/notificacoesReminder.js`), called from `App.jsx`'s login effect. This feature only checks `Notification.permission === 'granted'`.
- Fires on the **first app open of the day** — no hour gate (unlike the existing star reminder, which waits until 18h). At most 1 notification from this feature per person per day, deduped via `localStorage`.
- Day → feature mapping (0=Sunday..6=Saturday from `Date.getDay()`): Sunday=Versículo do Dia (fixed), Monday=Reforçando Conceitos, Tuesday=Exercício, Wednesday=MWA Farm, Thursday=Lente da Consciência, Friday=a different game each week (rotating through all 6), Saturday=no reminder.
- This new util file must NOT import anything from a `.jsx` file — this repo's `node --test` runner has no JSX loader, and a prior bug (fixed in an earlier commit) was exactly a `.js` test file transitively importing a `.jsx` file and crashing with `ERR_UNKNOWN_FILE_EXTENSION`. The 6 games' notification copy must be written directly as plain data in the new `.js` file, not imported from `src/components/ferramentas/Ferramentas.jsx`.
- Tapping the notification navigates to the Ferramentas tab (`setAba('ferramentas')`) — it does not open any specific modal/game.
- Independent from the existing star reminder (`notificacaoEstrela.js`) — no changes to that file, and both can notify on the same day.
- Portuguese identifiers/comments, matching the rest of the codebase. All user-facing notification text is bilingual (pt/en), matching the existing `ingles` pattern used throughout.

---

### Task 1: `notificacaoFuncoes.js` — day/game rotation logic, messages, and the notification trigger, wired into `App.jsx`

**Files:**
- Create: `src/utils/notificacaoFuncoes.js`
- Test: `src/utils/notificacaoFuncoes.test.js`
- Modify: `src/App.jsx:38` (add `hoje` to the existing `useApp()` destructure)
- Modify: `src/App.jsx:25` (add one import)
- Modify: `src/App.jsx:67-73` (add one new `useEffect`, right after the existing weigh-in-notification `useEffect`)

**Interfaces:**
- Consumes: nothing from other tasks (this is the only task). Consumes from the existing codebase: `useApp()`'s `hoje` field (already exposed by `AppContext.jsx`, just not currently destructured in `App.jsx`), and the existing `sessao`, `usuario`, `diaAtual`, `totalDias`, `setAba` already present in `App.jsx`'s `AppInner` function.
- Produces: `funcaoDoDia(dataISO)`, `jogoDaSemana(diaAtual)`, `lembrarFuncaoDoDia({ userId, hoje, diaAtual, ingles, onAbrir })` — no other task depends on these (this plan has one task).

- [ ] **Step 1: Write the failing tests**

```js
// src/utils/notificacaoFuncoes.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { funcaoDoDia, jogoDaSemana } from './notificacaoFuncoes.js'

test('funcaoDoDia mapeia cada dia da semana pra função certa', () => {
  assert.equal(funcaoDoDia('2026-08-16'), 'versiculo') // domingo
  assert.equal(funcaoDoDia('2026-08-17'), 'conceitos') // segunda
  assert.equal(funcaoDoDia('2026-08-18'), 'exercicio') // terça
  assert.equal(funcaoDoDia('2026-08-19'), 'fazenda') // quarta
  assert.equal(funcaoDoDia('2026-08-20'), 'lente') // quinta
  assert.equal(funcaoDoDia('2026-08-21'), 'jogo') // sexta
  assert.equal(funcaoDoDia('2026-08-22'), null) // sábado
})

test('jogoDaSemana revezia entre os 6 jogos a cada 7 dias de diaAtual', () => {
  const jogo1 = jogoDaSemana(1)
  const jogo7 = jogoDaSemana(7)
  const jogo8 = jogoDaSemana(8)
  assert.equal(jogo1.id, jogo7.id) // mesma semana (dias 1-7)
  assert.notEqual(jogo1.id, jogo8.id) // semana seguinte (dia 8) já mudou
})

test('jogoDaSemana reinicia o ciclo depois de 6 semanas (42 dias)', () => {
  const jogo1 = jogoDaSemana(1)
  const jogo43 = jogoDaSemana(43) // 6 semanas depois (dia 1 + 6*7)
  assert.equal(jogo1.id, jogo43.id)
})

test('jogoDaSemana cobre os 6 jogos ao longo de 6 semanas seguidas', () => {
  const ids = [1, 8, 15, 22, 29, 36].map((dia) => jogoDaSemana(dia).id)
  const idsUnicos = new Set(ids)
  assert.equal(idsUnicos.size, 6)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/utils/notificacaoFuncoes.test.js`
Expected: FAIL — `notificacaoFuncoes.js` does not exist yet (`Cannot find module`).

- [ ] **Step 3: Write the implementation**

```js
// src/utils/notificacaoFuncoes.js
// Lembrete diário rotativo das funções do app (Reforçando Conceitos,
// exercício, MWA Farm, Lente da Consciência, um jogo diferente cada
// sexta, Versículo do Dia aos domingos) — dispara na primeira abertura
// do app do dia, sem esperar horário (diferente do lembrete da Estrela
// do Dia, que espera até 18h). Reaproveita a permissão de notificação já
// pedida por src/utils/notificacoesReminder.js — não pede de novo aqui.
//
// Os 6 jogos abaixo são copiados de src/components/ferramentas/Ferramentas.jsx
// (JOGOS_NUTRICAO + JOGOS_PAUSA) em vez de importados de lá: este arquivo
// é carregado por `node --test`, que não interpreta .jsx — importar um
// .jsx direto quebra com ERR_UNKNOWN_FILE_EXTENSION (mesmo problema já
// corrigido antes para src/data/farm/integridade.test.js).
const JOGOS_SEXTA = [
  {
    id: 'prato',
    titulo: '🍽️ Bora montar seu prato?',
    corpo: 'Cumpra missões montando pratos de verdade e aprenda com cada escolha.',
    tituloEn: '🍽️ Ready to build your plate?',
    corpoEn: 'Complete missions by building real plates and learn from every choice.',
  },
  {
    id: 'vf',
    titulo: '🤔 Verdadeiro, falso ou depende?',
    corpo: 'Nem tudo em nutrição é preto no branco — teste o que você sabe.',
    tituloEn: '🤔 True, false, or it depends?',
    corpoEn: 'Not everything in nutrition is black and white — test what you know.',
  },
  {
    id: 'troca',
    titulo: '🔄 Que tal uma Troca Inteligente?',
    corpo: 'Melhore uma refeição sem abrir mão dela e veja o impacto de cada troca.',
    tituloEn: '🔄 How about a Smart Swap?',
    corpoEn: 'Improve a meal without giving it up and see the impact of each swap.',
  },
  {
    id: 'saciedade',
    titulo: '⚖️ Qual sustenta mais?',
    corpo: 'Mesmas calorias, fomes diferentes — descubra na Batalha da Saciedade.',
    tituloEn: '⚖️ Which one keeps you full longer?',
    corpoEn: 'Same calories, different hunger — find out in the Satiety Battle.',
  },
  {
    id: 'rotulos',
    titulo: '🔍 Vire um Detetive dos Rótulos',
    corpo: 'Aprenda a ler a tabela nutricional e a diferença entre porção e embalagem.',
    tituloEn: '🔍 Become a Label Detective',
    corpoEn: 'Learn to read the nutrition table and the difference between serving and package.',
  },
  {
    id: 'colheita',
    titulo: '🍓 Um respiro pra mente',
    corpo: 'Combine 3 frutas e relaxe um pouco no Jogo da Colheita.',
    tituloEn: '🍓 A breather for your mind',
    corpoEn: 'Match 3 fruits and relax a little in the Harvest Game.',
  },
]

export function podeNotificar() {
  return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
}

// Decide qual função lembrar hoje, a partir do dia da semana real
// (calendário, não dia do programa). Retorna um id fixo, ou null nos
// dias sem lembrete (sábado).
export function funcaoDoDia(dataISO) {
  const diaSemana = new Date(`${dataISO}T00:00:00`).getDay() // 0=domingo .. 6=sábado
  const mapa = { 0: 'versiculo', 1: 'conceitos', 2: 'exercicio', 3: 'fazenda', 4: 'lente', 5: 'jogo', 6: null }
  return mapa[diaSemana]
}

// Escolhe qual dos 6 jogos é o "jogo da semana" — revezando pela lista a
// cada 7 dias de diaAtual (dia do programa, sempre >= 1), ciclo completo
// de 6 semanas (42 dias).
export function jogoDaSemana(diaAtual) {
  const indice = Math.floor((diaAtual - 1) / 7) % JOGOS_SEXTA.length
  return JOGOS_SEXTA[indice]
}

function mensagemFuncao(tipo, diaAtual, ingles) {
  if (tipo === 'conceitos') {
    return ingles
      ? { titulo: '📖 Have you checked out Reinforcing Concepts today?', corpo: 'Nutritional density, caloric deficit and more, in just a few minutes.' }
      : { titulo: '📖 Já deu uma olhada no Reforçando Conceitos hoje?', corpo: 'Densidade nutricional, déficit calórico e mais, em poucos minutos.' }
  }
  if (tipo === 'exercicio') {
    return ingles
      ? { titulo: '🔥 Have you exercised today?', corpo: 'Log it and see how it helps your calorie goal.' }
      : { titulo: '🔥 Já fez exercício hoje?', corpo: 'Registre e veja quanto isso ajuda na sua meta de calorias.' }
  }
  if (tipo === 'fazenda') {
    return ingles
      ? { titulo: '🌻 Your farm is growing', corpo: 'Are you planting habits to watch your results bloom?' }
      : { titulo: '🌻 Sua fazenda está crescendo', corpo: 'Está plantando hábitos pra ver seu resultado florescer?' }
  }
  if (tipo === 'lente') {
    return ingles
      ? { titulo: '🔍 Before acting on autopilot...', corpo: 'A guided pause under a minute is waiting in the Awareness Lens.' }
      : { titulo: '🔍 Antes de agir no automático...', corpo: 'Uma pausa guiada de menos de um minuto te espera na Lente da Consciência.' }
  }
  if (tipo === 'jogo') {
    const jogo = jogoDaSemana(diaAtual)
    return ingles ? { titulo: jogo.tituloEn, corpo: jogo.corpoEn } : { titulo: jogo.titulo, corpo: jogo.corpo }
  }
  if (tipo === 'versiculo') {
    return ingles
      ? { titulo: '✨ A reflection for today', corpo: 'The Verse of the Day is waiting for you.' }
      : { titulo: '✨ Uma reflexão pra hoje', corpo: 'O Versículo do Dia está te esperando.' }
  }
  return null
}

// Dispara o lembrete de função do dia — no máximo 1x por pessoa por dia,
// na primeira abertura do app (sem esperar horário). `onAbrir` (se
// passado) é chamado com 'ferramentas' quando a pessoa toca na
// notificação.
export function lembrarFuncaoDoDia({ userId, hoje, diaAtual, ingles = false, onAbrir }) {
  if (!userId || !hoje || !diaAtual || !podeNotificar()) return false

  const tipo = funcaoDoDia(hoje)
  if (!tipo) return false // sábado

  const chave = `mwa_lembrete_funcao_${userId}_${hoje}`
  if (localStorage.getItem(chave)) return false

  const mensagem = mensagemFuncao(tipo, diaAtual, ingles)
  if (!mensagem) return false

  const notificacao = new Notification(mensagem.titulo, {
    body: mensagem.corpo,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: `funcao_${hoje}`,
    requireInteraction: false,
  })
  if (onAbrir) {
    notificacao.onclick = () => {
      window.focus()
      onAbrir('ferramentas')
    }
  }
  localStorage.setItem(chave, '1')
  return true
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/utils/notificacaoFuncoes.test.js`
Expected: PASS — all 4 tests green.

- [ ] **Step 5: Wire into `App.jsx`**

Add the import, right after the existing `notificacoesReminder.js` import (`App.jsx:25`):

```js
import { configurarNotificacoesPesagem } from './utils/notificacoesReminder.js'
import { lembrarFuncaoDoDia } from './utils/notificacaoFuncoes.js'
```

Add `hoje` to the existing `useApp()` destructure (`App.jsx:38`):

```js
const { sessao, carregando, usuario, modalRefeicao, ganhoSementes, diaAtual, totalDias, programa90Ativo, hoje } = useApp()
```

Add `ingles` is already destructured from `useIdioma()` on the next line — no change needed there. Add a new `useEffect` right after the existing weigh-in-notification one (`App.jsx:67-73`):

```js
  // Configura notificações push 24h antes da pesagem
  useEffect(() => {
    const userId = sessao?.user?.id
    if (usuario && diaAtual && totalDias && userId) {
      configurarNotificacoesPesagem(diaAtual, totalDias, userId)
    }
  }, [sessao, usuario, diaAtual, totalDias])

  // Lembrete diário rotativo das funções do app (Reforçando Conceitos,
  // exercício, Fazenda, Lente da Consciência, jogo da semana, Versículo)
  useEffect(() => {
    const userId = sessao?.user?.id
    if (usuario && diaAtual && hoje && userId) {
      lembrarFuncaoDoDia({ userId, hoje, diaAtual, ingles, onAbrir: setAba })
    }
  }, [sessao, usuario, diaAtual, hoje, ingles])
```

- [ ] **Step 6: Run the full test suite and build to verify nothing broke**

Run: `npm test`
Expected: all tests pass, including the 4 new ones.

Run: `npm run build`
Expected: build succeeds with no new errors/warnings.

- [ ] **Step 7: Commit**

```bash
git add src/utils/notificacaoFuncoes.js src/utils/notificacaoFuncoes.test.js src/App.jsx
git commit -m "feat: adiciona lembrete diario rotativo das funcoes do app"
```

- [ ] **Step 8: Manual verification in the browser**

Run: `npm run dev`, open the app, log in with a test account, grant notification permission if prompted.

Since this fires once per real day (deduped via `localStorage`), the easiest way to check different days is to open the browser console and manually clear the dedupe key and/or fake `Date` — or simply verify by reading the code path: confirm in DevTools → Application → Local Storage that `mwa_lembrete_funcao_<userId>_<today>` appears after reload, and that no second notification fires on a further reload the same day. Confirm the notification's title/body match today's real weekday per the table in the spec, and that clicking it switches to the Ferramentas tab.

---

## Self-Review Notes

- **Spec coverage:** day→feature mapping, the "first open, no hour gate" timing, the Friday game rotation (6 games, weekly), reused-not-imported game copy (JSX-import pitfall avoided), independence from the star reminder (no changes to `notificacaoEstrela.js`), and the tap → Ferramentas tab behavior are all implemented in Step 3/5 and covered by the spec-aligned edge cases.
- **No placeholders:** full file content given verbatim for both the new util and the `App.jsx` edits.
- **Type/name consistency:** `funcaoDoDia`, `jogoDaSemana`, `lembrarFuncaoDoDia` are spelled identically in the test file, the implementation, and the wiring step.
- **JSX-import guard:** explicitly called out in Global Constraints and re-stated in the implementation's own comment, since this is a real, previously-hit bug in this exact codebase.
