# Minha Evolução — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new "Minha Evolução" full-screen page, opened from Perfil, showing current weight/measurements, evolution charts (weight, measurements), and a milestone timeline pairing a simplified body-shape avatar with the real weigh-in photos already captured in `ModalPesagem.jsx`.

**Architecture:** Pure-logic helpers (sortable/derivable from `pesagens`) live in a new `src/utils/evolucao.js`, unit-tested with the project's existing `node --test` runner. Two small presentational components (`GraficoLinha.jsx` — hand-rolled SVG line chart, `AvatarManequim.jsx` — hand-rolled SVG mannequin figure) are assembled into one page component (`MinhaEvolucao.jsx`), which follows the exact full-screen dialog pattern already established and audited in `src/components/game/LojaAvatar.jsx` (dialog role, Escape-to-close, focus-on-open, `min-h-11`/`min-w-11` close button). The page is opened from `Perfil.jsx` via `React.lazy` + `Suspense`, matching the code-splitting pattern from the just-completed app audit (Task 8, commit `2e8e3cb`). A prerequisite bug fix (Task 1) makes weigh-in photos actually persist — they currently don't.

**Tech Stack:** React 18, Vite 6, Tailwind v4, Supabase (Postgres + Auth, no Storage bucket used or added). No new npm dependencies — charts and the avatar figure are hand-drawn SVG, per the project's own decision given the existing bundle-size warning.

## Global Constraints

- No new npm dependencies (no charting library, no image-upload library).
- No percentual de gordura (body fat %) anywhere in this feature — explicitly out of scope per the design spec (`docs/superpowers/specs/2026-07-21-app-audit-e-minha-evolucao-design.md`), for CRN-compliance reasons.
- The avatar is a simplified realistic mannequin figure (SVG), not a cartoon character, and is unrelated to the `src/data/skins.js` gamification avatar system — do not import from or couple to `skins.js`.
- The mannequin coexists with real weigh-in photos — it does not replace them.
- Data source: the existing `pesagens` array from `AppContext` (via `useApp()`) and `usuario.peso`/`usuario.medidas` (onboarding baseline) as a fallback when no pesagem exists yet. No new Supabase tables or columns.
- Follow the established a11y pattern from the just-completed audit: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, a `dialogRef` that receives focus on open, an `Escape`-key listener, and a close button with `min-h-11 min-w-11` sizing (see `src/components/game/LojaAvatar.jsx` for the reference implementation).
- Use only the existing Tailwind color tokens already defined in `src/index.css`'s `@theme` block: `verde`, `verde-escuro`, `sage`, `sage-claro`, `ouro`, `ouro-claro`, `creme`, `cinza`. Do not invent new colors.
- PT-BR is the primary/only language for this new feature's copy for now — the existing `ingles`/`useIdioma()` toggle is used elsewhere in the app, but per the project's own precedent (e.g. `LenteConsciencia.jsx`, `ReforcandoConceitos.jsx` were shipped PT-BR-only and flagged as a follow-up, not blocked on), this plan does NOT require full bilingual strings — use plain PT-BR text throughout. (If the user wants bilingual support later, that's a follow-up task.)
- No component test framework exists (only `node --test` for plain `.js` files with no DOM). Pure-logic modules (Task 2) get real unit tests. UI components (Tasks 3-6) are verified manually via the Vite dev server in the browser — this is consistent with how the rest of this app is tested.

---

### Task 1: Fix weigh-in photo persistence (prerequisite bug fix)

**Why this is first:** `ModalPesagem.jsx` currently stores photos as `URL.createObjectURL(arquivo)` — a browser blob URL that stops working after a page reload or in a different session. `mwa_pesagens.fotos` in the database ends up holding dead blob URLs for every historical weigh-in. Task 5's photo timeline reads directly from this field, so it would show broken images for anything but the current session's most recent weigh-in if this isn't fixed first.

**Approach (per user decision):** reuse the app's own existing pattern for photo persistence — client-side resize + compress to a base64 JPEG data URL, saved directly in the database column — the same approach already used for the profile photo in `AppContext.jsx`'s `atualizarFotoPerfil`. The existing `redimensionarImagem()` in `src/lib/imagem.js` crops to a square (correct for a round profile-avatar thumbnail), which is wrong for a body progress photo (would crop off the top/bottom of a portrait shot). This task adds a second, aspect-ratio-preserving resize function instead of reusing the square-crop one.

**Files:**
- Modify: `src/lib/imagem.js` (add a new export, don't change the existing `redimensionarImagem`)
- Modify: `src/components/progresso/ModalPesagem.jsx:30-33` (the `escolherFoto` function)

**Interfaces:**
- Produces: `redimensionarImagemProporcional(arquivo, ladoMaximo = 480, qualidade = 0.82): Promise<string>` — resolves to a `data:image/jpeg;base64,...` string, preserving the original aspect ratio, capping the longest side at `ladoMaximo` pixels. Later tasks don't consume this directly, but the shape of `pesagem.fotos.<slot>` values (data URL strings instead of blob URLs) is relied on by Task 5's photo timeline.

- [ ] **Step 1: Add the aspect-ratio-preserving resize function**

Add this to `src/lib/imagem.js`, below the existing `redimensionarImagem` function (don't modify the existing one):

```js
// Redimensiona preservando a proporção original (para fotos de corpo inteiro,
// onde recortar em quadrado cortaria a pessoa) — usado nas fotos de pesagem.
export function redimensionarImagemProporcional(arquivo, ladoMaximo = 480, qualidade = 0.82) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem'))
    leitor.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Arquivo inválido'))
      img.onload = () => {
        const escala = Math.min(1, ladoMaximo / Math.max(img.width, img.height))
        const largura = Math.round(img.width * escala)
        const altura = Math.round(img.height * escala)

        const canvas = document.createElement('canvas')
        canvas.width = largura
        canvas.height = altura
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, largura, altura)

        resolve(canvas.toDataURL('image/jpeg', qualidade))
      }
      img.src = leitor.result
    }
    leitor.readAsDataURL(arquivo)
  })
}
```

- [ ] **Step 2: Use it in ModalPesagem.jsx's photo picker**

Read the current `escolherFoto` function in `src/components/progresso/ModalPesagem.jsx` (around line 30):

```js
function escolherFoto(id, e) {
  const arquivo = e.target.files?.[0]
  if (arquivo) setFotos((f) => ({ ...f, [id]: URL.createObjectURL(arquivo) }))
}
```

Replace it with:

```js
async function escolherFoto(id, e) {
  const arquivo = e.target.files?.[0]
  if (!arquivo) return
  const dataUrl = await redimensionarImagemProporcional(arquivo)
  setFotos((f) => ({ ...f, [id]: dataUrl }))
}
```

Add the import at the top of the file (alongside the existing imports):

```js
import { redimensionarImagemProporcional } from '../../lib/imagem.js'
```

- [ ] **Step 3: Verify in the browser**

Start the dev server, open the weigh-in modal (`ModalPesagem`), pick a photo for one of the 4 slots, and confirm:
- The image preview renders immediately (same as before).
- Open browser devtools → Elements, inspect the `<img>` `src` attribute for that slot — it must start with `data:image/jpeg;base64,` (not `blob:`).
- Reload the page (without submitting the weigh-in) — the preview will reset since it's local component state, that's expected and unrelated to this fix; the point of this check is only to confirm the *type* of URL being generated, not to test persistence across reload at this step (that's implicitly covered by the fact that a `data:` URL is a self-contained string, unlike a `blob:` URL which is tied to the page's lifetime).

- [ ] **Step 4: Commit**

```bash
git add src/lib/imagem.js src/components/progresso/ModalPesagem.jsx
git commit -m "fix(pesagem): persiste fotos como data URL em vez de blob URL efêmero"
```

---

### Task 2: `src/utils/evolucao.js` — pure logic helpers (unit tested)

**Files:**
- Create: `src/utils/evolucao.js`
- Test: `src/utils/evolucao.test.js`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces (used by Tasks 3, 4, 5):
  - `pesagensOrdenadas(pesagens: Array<{data: string, ...}>): Array<pesagem>` — copy sorted by `data` ascending.
  - `pesagensComRotulo(pesagens, totalDias: number): Array<{pesagem, rotulo: string}>` — pairs each sorted pesagem with a milestone label ("Dia 15", "Dia 30", ...) from `getDiasPesagem(totalDias)` by position; if there are more pesagens than milestones, extra ones get `"Pesagem N"` (1-indexed) instead.
  - `proporcaoCinturaQuadril(medidas: {cintura?: number, quadril?: number}): number | null` — `cintura / quadril` rounded to 2 decimals, or `null` if either is missing/falsy/zero.
  - `estagioPostura(indice: number, total: number): number` — returns an integer 0-3 representing how far through the timeline this entry is (0 = first entry, 3 = last entry or beyond), linearly mapped.
  - `CORES_CONQUISTA: string[]` — a fixed array of 3 Tailwind color-token names cycling for milestone accents: `['sage', 'ouro', 'verde']`.
  - `corConquista(indice: number): string` — `CORES_CONQUISTA[indice % CORES_CONQUISTA.length]`.
  - `pontosGrafico(valores: Array<number | null>, largura: number, altura: number, preenchimento: number): Array<{x: number, y: number} | null>` — maps each non-null value to an `{x, y}` SVG coordinate (evenly spaced on x, scaled on y between the min/max of the non-null values, inset by `preenchimento` px on all sides); `null` values map to `null` (gaps, not zero).

- [ ] **Step 1: Write the failing tests**

Create `src/utils/evolucao.test.js`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  pesagensOrdenadas,
  pesagensComRotulo,
  proporcaoCinturaQuadril,
  estagioPostura,
  corConquista,
  pontosGrafico,
} from './evolucao.js'

test('pesagensOrdenadas ordena por data crescente', () => {
  const pesagens = [
    { id: 2, data: '2026-02-01', peso: 70 },
    { id: 1, data: '2026-01-01', peso: 72 },
    { id: 3, data: '2026-03-01', peso: 68 },
  ]
  const resultado = pesagensOrdenadas(pesagens)
  assert.deepEqual(resultado.map((p) => p.id), [1, 2, 3])
})

test('pesagensOrdenadas não modifica o array original', () => {
  const pesagens = [{ id: 2, data: '2026-02-01' }, { id: 1, data: '2026-01-01' }]
  pesagensOrdenadas(pesagens)
  assert.equal(pesagens[0].id, 2)
})

test('pesagensComRotulo usa os marcos 15/30/45/60/75/90 em ordem', () => {
  const pesagens = [
    { id: 1, data: '2026-01-01' },
    { id: 2, data: '2026-01-16' },
    { id: 3, data: '2026-01-31' },
  ]
  const resultado = pesagensComRotulo(pesagens, 90)
  assert.deepEqual(resultado.map((r) => r.rotulo), ['Dia 15', 'Dia 30', 'Dia 45'])
})

test('pesagensComRotulo cai para "Pesagem N" além dos marcos disponíveis', () => {
  const totalDias = 30 // getDiasPesagem(30) só tem [15, 30] — 2 marcos
  const pesagens = [
    { id: 1, data: '2026-01-01' },
    { id: 2, data: '2026-01-16' },
    { id: 3, data: '2026-01-31' },
  ]
  const resultado = pesagensComRotulo(pesagens, totalDias)
  assert.deepEqual(resultado.map((r) => r.rotulo), ['Dia 15', 'Dia 30', 'Pesagem 3'])
})

test('proporcaoCinturaQuadril calcula a razão arredondada', () => {
  assert.equal(proporcaoCinturaQuadril({ cintura: 70, quadril: 100 }), 0.7)
})

test('proporcaoCinturaQuadril retorna null quando falta medida', () => {
  assert.equal(proporcaoCinturaQuadril({ cintura: 70 }), null)
  assert.equal(proporcaoCinturaQuadril({}), null)
  assert.equal(proporcaoCinturaQuadril({ cintura: 70, quadril: 0 }), null)
})

test('estagioPostura mapeia o primeiro item para 0 e o último para 3', () => {
  assert.equal(estagioPostura(0, 6), 0)
  assert.equal(estagioPostura(5, 6), 3)
})

test('estagioPostura nunca passa de 3', () => {
  assert.equal(estagioPostura(0, 1), 3)
})

test('corConquista cicla pelas 3 cores', () => {
  assert.equal(corConquista(0), 'sage')
  assert.equal(corConquista(1), 'ouro')
  assert.equal(corConquista(2), 'verde')
  assert.equal(corConquista(3), 'sage')
})

test('pontosGrafico mapeia valores para coordenadas dentro da área útil', () => {
  const pontos = pontosGrafico([70, 68, 66], 300, 100, 10)
  assert.equal(pontos.length, 3)
  // primeiro ponto: x no início da área útil
  assert.equal(pontos[0].x, 10)
  // último ponto: x no fim da área útil
  assert.equal(pontos[2].x, 290)
  // maior valor (70) deve ficar mais perto do topo (y menor) que o menor valor (66)
  assert.ok(pontos[0].y < pontos[2].y)
})

test('pontosGrafico preserva gaps para valores null', () => {
  const pontos = pontosGrafico([70, null, 66], 300, 100, 10)
  assert.equal(pontos[1], null)
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test src/utils/evolucao.test.js`
Expected: FAIL — `Cannot find module './evolucao.js'` (the file doesn't exist yet).

- [ ] **Step 3: Implement `src/utils/evolucao.js`**

```js
import { getDiasPesagem } from './pesagensReminder.js'

// Ordena as pesagens por data crescente sem alterar o array original.
export function pesagensOrdenadas(pesagens) {
  return [...(pesagens ?? [])].sort((a, b) => new Date(a.data) - new Date(b.data))
}

// Associa cada pesagem (em ordem cronológica) ao marco de dia correspondente
// (15/30/45/60/75/90, conforme o total de dias do programa da pessoa). Se
// houver mais pesagens do que marcos disponíveis, as excedentes recebem um
// rótulo genérico em vez de estourar o array de marcos.
export function pesagensComRotulo(pesagens, totalDias) {
  const marcos = getDiasPesagem(totalDias)
  return pesagensOrdenadas(pesagens).map((pesagem, indice) => ({
    pesagem,
    rotulo: indice < marcos.length ? `Dia ${marcos[indice]}` : `Pesagem ${indice + 1}`,
  }))
}

// Razão cintura/quadril arredondada, ou null se alguma medida estiver ausente.
export function proporcaoCinturaQuadril(medidas) {
  const cintura = medidas?.cintura
  const quadril = medidas?.quadril
  if (!cintura || !quadril) return null
  return Math.round((cintura / quadril) * 100) / 100
}

// Estágio de postura (0-3) proporcional à posição no histórico — usado pelo
// avatar-manequim para uma progressão visual sutil de postura/energia.
export function estagioPostura(indice, total) {
  if (total <= 1) return 3
  const proporcao = indice / (total - 1)
  return Math.min(3, Math.round(proporcao * 3))
}

// Cores de "conquista" por marco atingido — cicla pelas cores de marca já
// existentes no app (sem inventar cores novas).
export const CORES_CONQUISTA = ['sage', 'ouro', 'verde']

export function corConquista(indice) {
  return CORES_CONQUISTA[indice % CORES_CONQUISTA.length]
}

// Converte uma lista de valores (com possíveis gaps nulos) em coordenadas SVG
// {x, y} dentro de uma área útil de largura x altura, com preenchimento nas
// bordas. Valores null viram gaps (null), não zero.
export function pontosGrafico(valores, largura, altura, preenchimento) {
  const validos = valores.filter((v) => v != null)
  if (validos.length === 0) return valores.map(() => null)

  const minimo = Math.min(...validos)
  const maximo = Math.max(...validos)
  const amplitude = maximo - minimo || 1

  const areaLargura = largura - preenchimento * 2
  const areaAltura = altura - preenchimento * 2

  return valores.map((valor, indice) => {
    if (valor == null) return null
    const x = preenchimento + (valores.length === 1 ? 0 : (indice / (valores.length - 1)) * areaLargura)
    const y = preenchimento + areaAltura - ((valor - minimo) / amplitude) * areaAltura
    return { x, y }
  })
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test src/utils/evolucao.test.js`
Expected: PASS — all 11 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/utils/evolucao.js src/utils/evolucao.test.js
git commit -m "feat(evolucao): adiciona funcoes puras de evolucao (rotulos, proporcao, pontos de grafico)"
```

---

### Task 3: `GraficoLinha.jsx` — reusable SVG line chart

**Files:**
- Create: `src/components/perfil/GraficoLinha.jsx`

**Interfaces:**
- Consumes: `pontosGrafico` from `src/utils/evolucao.js` (Task 2).
- Produces: `<GraficoLinha titulo pontos sufixo />` component, used by Task 5.
  - Props: `{ titulo: string, pontos: Array<{ rotulo: string, valor: number | null }>, sufixo?: string }`
  - `sufixo` is appended to each value in the accessible data table (e.g. `"kg"`, `"cm"`); optional, defaults to `''`.

- [ ] **Step 1: Implement the component**

```jsx
import { pontosGrafico } from '../../utils/evolucao.js'

const LARGURA = 300
const ALTURA = 120
const PREENCHIMENTO = 24

export default function GraficoLinha({ titulo, pontos, sufixo = '' }) {
  const valores = pontos.map((p) => p.valor)
  const coordenadas = pontosGrafico(valores, LARGURA, ALTURA, PREENCHIMENTO)
  const coordenadasValidas = coordenadas.filter(Boolean)

  const caminho = coordenadasValidas.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm shadow-verde/5">
      <p className="text-sm font-semibold text-verde">{titulo}</p>

      {coordenadasValidas.length < 2 ? (
        <p className="mt-3 rounded-lg bg-creme p-3 text-center text-xs text-verde/70">
          Ainda não há dados suficientes para um gráfico — continue registrando suas pesagens.
        </p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${LARGURA} ${ALTURA}`}
            className="mt-2 w-full"
            role="img"
            aria-label={`Gráfico de ${titulo.toLowerCase()} ao longo do tempo`}
          >
            <path d={caminho} fill="none" stroke="var(--color-sage)" strokeWidth="2" />
            {coordenadas.map((c, i) =>
              c ? <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="var(--color-verde)" /> : null,
            )}
          </svg>

          <div className="mt-2 flex justify-between text-[10px] text-verde/60">
            {pontos.map((p, i) => (
              <span key={i}>{p.rotulo}</span>
            ))}
          </div>

          {/* Tabela oculta visualmente, para leitores de tela — um SVG não é lido de forma útil sozinho */}
          <table className="sr-only">
            <caption>{titulo}</caption>
            <thead>
              <tr>
                <th scope="col">Marco</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((p, i) => (
                <tr key={i}>
                  <td>{p.rotulo}</td>
                  <td>{p.valor != null ? `${p.valor}${sufixo}` : 'Sem registro'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify with a throwaway inline test render**

There's no component test framework, and this component has no auth dependency, so verify it directly: temporarily render `<GraficoLinha titulo="Peso" pontos={[{rotulo: 'Dia 15', valor: 72}, {rotulo: 'Dia 30', valor: 70}, {rotulo: 'Dia 45', valor: null}, {rotulo: 'Dia 60', valor: 68}]} sufixo="kg" />` at the bottom of any already-public route (e.g. temporarily add it to `PreviewLanches.jsx`'s render output), start the dev server, navigate to `/preview-lanches`, and confirm: the line renders with a visible gap where the `null` value is, the 4 labels appear below the chart, and the `sr-only` table (inspect via devtools, not visible on screen) has 4 rows. **Revert the temporary addition to `PreviewLanches.jsx` before committing** — it was only for this manual check.

- [ ] **Step 3: Commit**

```bash
git add src/components/perfil/GraficoLinha.jsx
git commit -m "feat(evolucao): adiciona GraficoLinha, grafico SVG reutilizavel sem lib externa"
```

---

### Task 4: `AvatarManequim.jsx` — simplified body-shape SVG figure

**Files:**
- Create: `src/components/perfil/AvatarManequim.jsx`

**Interfaces:**
- Consumes: nothing directly (receives already-computed values as props from Task 5, which uses `proporcaoCinturaQuadril`, `estagioPostura`, `corConquista` from Task 2).
- Produces: `<AvatarManequim proporcao estagioPostura corAcento tamanho />` component, used by Task 5.
  - Props:
    - `proporcao: number | null` — cintura/quadril ratio (typically 0.6-1.0); `null` renders a neutral default shape.
    - `estagioPostura: number` — 0-3, controls a subtle arm/spine posture change.
    - `corAcento: 'sage' | 'ouro' | 'verde'` — one of `CORES_CONQUISTA` from Task 2, used for a sash/accent band, not the body itself.
    - `tamanho?: 'sm' | 'lg'` — defaults to `'lg'`. `'sm'` is used in a compact timeline card, `'lg'` in the "current state" hero section.

- [ ] **Step 1: Implement the component**

This is a simplified, non-literal mannequin silhouette — an oval head, a torso whose width at the waist band scales with `proporcao` (lower ratio = narrower waist relative to hips), and simple limb lines whose angle shifts slightly with `estagioPostura` (more upright/open arms at higher stages). It intentionally does not attempt photorealism — see the design spec's rationale for choosing "realistic simplified mannequin" over a cartoon character.

```jsx
const CORES = {
  sage: 'var(--color-sage)',
  ouro: 'var(--color-ouro)',
  verde: 'var(--color-verde)',
}

const TAMANHOS = {
  sm: 64,
  lg: 140,
}

export default function AvatarManequim({ proporcao, estagioPostura = 0, corAcento = 'sage', tamanho = 'lg' }) {
  const largura = TAMANHOS[tamanho]
  const altura = largura * 1.6

  // proporcao tipica 0.65 (cintura bem mais estreita que quadril) a 1.0
  // (cintura e quadril quase iguais). Sem dado, usa uma silhueta neutra.
  const razao = proporcao ?? 0.8
  const larguraCintura = 34 + razao * 26 // 34px (mais estreita) a 60px (mais reta)
  const larguraQuadril = 60

  // Postura: braços mais afastados do corpo e leve inclinação de coluna nos
  // estagios mais avancados — reforco visual de energia/confianca, não uma
  // tentativa de representar mudanca fisica literal.
  const aberturaBraco = 6 + estagioPostura * 3 // 6 a 15

  const cor = CORES[corAcento] ?? CORES.sage

  return (
    <svg
      viewBox="0 0 100 160"
      width={largura}
      height={altura}
      role="img"
      aria-label="Ilustração simplificada da forma corporal atual"
    >
      {/* Cabeça */}
      <ellipse cx="50" cy="20" rx="14" ry="16" fill="var(--color-creme)" stroke="var(--color-verde)" strokeWidth="2" />

      {/* Torso — largura no busto, afunila até a cintura, alarga até o quadril */}
      <path
        d={`M ${50 - 24} 40
            L ${50 - larguraCintura / 2} 90
            L ${50 - larguraQuadril / 2} 130
            L ${50 + larguraQuadril / 2} 130
            L ${50 + larguraCintura / 2} 90
            L ${50 + 24} 40
            Z`}
        fill="var(--color-creme)"
        stroke="var(--color-verde)"
        strokeWidth="2"
      />

      {/* Faixa de conquista na cintura */}
      <rect x={50 - larguraCintura / 2} y="86" width={larguraCintura} height="8" fill={cor} rx="2" />

      {/* Braços — ângulo varia com o estágio de postura */}
      <line x1={50 - 24} y1="45" x2={50 - 24 - aberturaBraco} y2="95" stroke="var(--color-verde)" strokeWidth="4" strokeLinecap="round" />
      <line x1={50 + 24} y1="45" x2={50 + 24 + aberturaBraco} y2="95" stroke="var(--color-verde)" strokeWidth="4" strokeLinecap="round" />

      {/* Pernas */}
      <line x1={50 - larguraQuadril / 4} y1="130" x2={50 - larguraQuadril / 4} y2="158" stroke="var(--color-verde)" strokeWidth="5" strokeLinecap="round" />
      <line x1={50 + larguraQuadril / 4} y1="130" x2={50 + larguraQuadril / 4} y2="158" stroke="var(--color-verde)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
```

- [ ] **Step 2: Verify with a throwaway inline test render**

Same approach as Task 3: temporarily render 3-4 `<AvatarManequim>` instances with different `proporcao` (e.g. `0.65`, `0.8`, `1.0`, `null`), `estagioPostura` (`0` through `3`), and `corAcento` (`'sage'`, `'ouro'`, `'verde'`) values on a public route like `/preview-lanches`, confirm in the browser that the waist visibly narrows/widens across the `proporcao` range and the accent band color changes, then revert the temporary addition before committing.

- [ ] **Step 3: Commit**

```bash
git add src/components/perfil/AvatarManequim.jsx
git commit -m "feat(evolucao): adiciona AvatarManequim, silhueta SVG simplificada de evolucao corporal"
```

---

### Task 5: `MinhaEvolucao.jsx` — the full page

**Files:**
- Create: `src/components/perfil/MinhaEvolucao.jsx`

**Interfaces:**
- Consumes:
  - `useApp()` from `src/context/AppContext.jsx` — specifically `pesagens`, `usuario`, `totalDias`.
  - `pesagensComRotulo`, `proporcaoCinturaQuadril`, `estagioPostura`, `corConquista` from `src/utils/evolucao.js` (Task 2).
  - `GraficoLinha` (Task 3), `AvatarManequim` (Task 4).
- Produces: `<MinhaEvolucao onFechar={() => void} />` — a full-screen dialog component, consumed by Task 6 (`Perfil.jsx`).

- [ ] **Step 1: Implement the component**

```jsx
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { pesagensComRotulo, proporcaoCinturaQuadril, estagioPostura, corConquista } from '../../utils/evolucao.js'
import GraficoLinha from './GraficoLinha.jsx'
import AvatarManequim from './AvatarManequim.jsx'

const FOTO_LABELS = { frente: 'Frente', costas: 'Costas', latEsq: 'Lateral esq.', latDir: 'Lateral dir.' }

export default function MinhaEvolucao({ onFechar }) {
  const { pesagens, usuario, totalDias } = useApp()
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

  const comRotulo = pesagensComRotulo(pesagens, totalDias)
  const temHistorico = comRotulo.length >= 1
  const temTimelineComparativa = comRotulo.length >= 2

  const ultima = temHistorico ? comRotulo[comRotulo.length - 1].pesagem : null
  const pesoAtual = ultima?.peso ?? usuario?.peso ?? null
  const medidasAtuais = ultima?.medidas ?? usuario?.medidas ?? {}
  const proporcaoAtual = proporcaoCinturaQuadril(medidasAtuais)
  const ultimoIndice = Math.max(0, comRotulo.length - 1)

  const pontosPeso = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.peso ?? null }))
  const pontosCintura = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.medidas?.cintura ?? null }))
  const pontosQuadril = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.medidas?.quadril ?? null }))
  const pontosPeito = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.medidas?.peito ?? null }))

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-creme"
      role="dialog"
      aria-modal="true"
      aria-labelledby="minha-evolucao-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="mx-auto max-w-md px-5 pb-16 pt-10 outline-none">
        <div className="flex items-center justify-between">
          <h1 id="minha-evolucao-titulo" className="font-serif text-2xl font-semibold italic text-verde">
            Minha Evolução
          </h1>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/70 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Estado atual */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
          <p className="text-sm font-semibold text-verde/60">Seu estado atual</p>
          <div className="mt-3 flex items-center gap-4">
            <AvatarManequim
              proporcao={proporcaoAtual}
              estagioPostura={estagioPostura(ultimoIndice, comRotulo.length)}
              corAcento={corConquista(ultimoIndice)}
              tamanho="lg"
            />
            <div className="flex-1">
              <p className="text-3xl font-bold text-verde">{pesoAtual != null ? `${pesoAtual} kg` : '—'}</p>
              <ul className="mt-2 flex flex-col gap-0.5 text-sm text-verde/70">
                <li>Cintura: {medidasAtuais.cintura ?? '—'} cm</li>
                <li>Quadril: {medidasAtuais.quadril ?? '—'} cm</li>
                <li>Peito: {medidasAtuais.peito ?? '—'} cm</li>
              </ul>
            </div>
          </div>
        </section>

        {!temTimelineComparativa && (
          <p className="mt-4 rounded-xl bg-white p-4 text-center text-sm text-verde/70 shadow-sm shadow-verde/5">
            Registre mais uma pesagem para começar a ver sua evolução em gráficos e linha do tempo.
          </p>
        )}

        {temTimelineComparativa && (
          <>
            {/* Gráficos de evolução */}
            <div className="mt-4 flex flex-col gap-3">
              <GraficoLinha titulo="Peso" pontos={pontosPeso} sufixo=" kg" />
              <GraficoLinha titulo="Cintura" pontos={pontosCintura} sufixo=" cm" />
              <GraficoLinha titulo="Quadril" pontos={pontosQuadril} sufixo=" cm" />
              <GraficoLinha titulo="Peito" pontos={pontosPeito} sufixo=" cm" />
            </div>

            {/* Timeline avatar + fotos por marco */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-verde/60">Linha do tempo</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {comRotulo.map(({ pesagem, rotulo }, indice) => (
                  <div key={pesagem.id} className="flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-sm shadow-verde/5">
                    <p className="text-xs font-bold uppercase tracking-wide text-verde/60">{rotulo}</p>
                    <AvatarManequim
                      proporcao={proporcaoCinturaQuadril(pesagem.medidas)}
                      estagioPostura={estagioPostura(indice, comRotulo.length)}
                      corAcento={corConquista(indice)}
                      tamanho="sm"
                    />
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(FOTO_LABELS).map(([id, rotuloFoto]) =>
                        pesagem.fotos?.[id] ? (
                          <img
                            key={id}
                            src={pesagem.fotos[id]}
                            alt={`${rotuloFoto} — ${rotulo}`}
                            className="aspect-[3/4] w-full rounded-lg object-cover"
                          />
                        ) : (
                          <span key={id} className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-creme text-[10px] text-verde/40">
                            Sem foto
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in the browser with real or seeded data**

There's no test-credential login available, so use one of these two approaches (pick whichever is faster given the current environment):
  - **Preferred:** if a review/demo mode already exists in the app (check `src/components/admin/MododeRevisao.jsx`), use it to reach an authenticated session with seeded `pesagens` data.
  - **Fallback:** build a temporary throwaway harness (as prior audit tasks did): mock `useApp()`'s return value or temporarily hardcode a `pesagens` array with 3+ entries (varying weights/measurements, at least one with a `medidas.cintura`/`medidas.quadril` present and one without) directly in this component for local testing, render it via a temporary route, verify visually, then **fully revert the mock before committing** (confirm with `git diff` that only the real component code remains).

Confirm:
- With 0-1 pesagens: only the "estado atual" section and the "registre mais uma pesagem" message show — no charts, no timeline.
- With 2+ pesagens: charts render with visible lines, the timeline shows one card per pesagem with the correct milestone label, the avatar's waist visibly differs between cards when `medidas` differ, and photos render for any slot that has one (using the data-URL fix from Task 1) with "Sem foto" placeholders for missing slots.
- Escape key closes the page; the close button is reachable by keyboard and has a visible focus state.

- [ ] **Step 3: Commit**

```bash
git add src/components/perfil/MinhaEvolucao.jsx
git commit -m "feat(evolucao): adiciona pagina Minha Evolucao com graficos e timeline avatar+fotos"
```

---

### Task 6: Wire up the entry point in Perfil.jsx

**Files:**
- Modify: `src/components/perfil/Perfil.jsx`

**Interfaces:**
- Consumes: `MinhaEvolucao` (Task 5), `CarregandoFallback` (already exists at `src/components/ui/CarregandoFallback.jsx`, created in the prior app-audit's Task 8).

- [ ] **Step 1: Add the lazy import and open/close state**

Near the top of `src/components/perfil/Perfil.jsx`, alongside the existing imports, add:

```js
import { lazy, Suspense } from 'react'
import CarregandoFallback from '../ui/CarregandoFallback.jsx'

const MinhaEvolucao = lazy(() => import('./MinhaEvolucao.jsx'))
```

(If `useState` is already imported from `'react'` at the top of the file, merge it into one import statement, e.g. `import { useState, lazy, Suspense } from 'react'` — don't create a duplicate `react` import line.)

Inside the `Perfil` component function, alongside the existing `useState` calls (e.g. near `enviandoFoto`/`avisoIndicacao`), add:

```js
const [evolucaoAberta, setEvolucaoAberta] = useState(false)
```

- [ ] **Step 2: Add the entry-point button**

Add a button somewhere sensible in the existing Perfil layout — placing it near the "Hall da Fama" section (both are progress/motivation-related) is a reasonable spot. Read the current file to find that section, and add this button immediately after it (adjust surrounding JSX/closing tags as needed to fit the existing structure):

```jsx
<button
  type="button"
  onClick={() => setEvolucaoAberta(true)}
  className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white p-5 text-left shadow-sm shadow-verde/5"
>
  <div>
    <p className="font-semibold text-verde">Minha Evolução</p>
    <p className="mt-0.5 text-xs text-verde/60">Peso, medidas e sua linha do tempo</p>
  </div>
  <span className="text-2xl">📈</span>
</button>
```

- [ ] **Step 3: Render the lazy-loaded page conditionally**

Near the end of the component's returned JSX (as a sibling to the main returned content, following the same pattern used for `DireitosLgpd` further down, or `LojaAvatar` in `Hoje.jsx`), add:

```jsx
{evolucaoAberta && (
  <Suspense fallback={<CarregandoFallback />}>
    <MinhaEvolucao onFechar={() => setEvolucaoAberta(false)} />
  </Suspense>
)}
```

- [ ] **Step 4: Run the build**

Run: `npm run build`
Expected: succeeds, with a new separate chunk for `MinhaEvolucao` (and its two child components) appearing in the output, confirming the lazy-loading actually split it out.

- [ ] **Step 5: Verify in the browser**

Start the dev server, navigate to Perfil (via whatever auth/demo path is available in this environment — see Task 5 Step 2's note on test access), click "Minha Evolução", confirm the page opens, and confirm the close button and Escape key both return you to Perfil.

- [ ] **Step 6: Commit**

```bash
git add src/components/perfil/Perfil.jsx
git commit -m "feat(evolucao): adiciona ponto de entrada 'Minha Evolucao' no Perfil"
```

---

## Completion

After all 6 tasks are done and approved, this feature is complete. No database migration is required (all fields already exist in `mwa_pesagens` and `mwa_perfis`). Ask the user how they want the final batch committed/pushed — do not assume, consistent with how Part 1 was handled.
