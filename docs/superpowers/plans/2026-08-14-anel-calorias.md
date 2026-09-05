# Anel de Calorias Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 4th, outer ring to `GraficoMacros` showing calories consumed vs. goal, with a gold segment showing extra room earned from logged exercise, and a red/terracota alert color when food alone exceeds the goal.

**Architecture:** `GraficoMacros.jsx` gains a `caloriasQueimadas` prop and a new ring-drawing function; the 3 existing macro rings shrink their radii to make room. `Hoje.jsx` passes its existing `gastoExercicios` value into the new prop — no other file changes.

**Tech Stack:** React 18, inline SVG (hand-rolled arc math, no charting library), Tailwind CSS, `useContagem` hook (existing count-up animation hook) for animated values.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-14-anel-calorias-design.md` — every requirement in this plan traces back to it.
- Ring radii: calorias=84 (espessura 14), proteína=64, carboidratos=44, gordura=24 (espessura 9, unchanged from today) — all inside the existing `viewBox="0 0 200 200"`, centro=100.
- Colors: comida dentro da meta `#052A1F`; comida acima da meta (sozinha, sem contar exercício) `#B0563C`; segmento de exercício `#C59F4F`.
- No automated test harness for React components in this repo (pre-existing convention) — verification is `npm run build` succeeding, plus manual browser check.
- Portuguese identifiers/comments, matching the rest of the codebase.

---

### Task 1: Calorie ring in `GraficoMacros`, wired from `Hoje.jsx`

**Files:**
- Modify: `src/components/hoje/GraficoMacros.jsx` (full rewrite — the file is small, ~130 lines, and nearly every section changes)
- Modify: `src/components/hoje/Hoje.jsx:249-258` (add one prop to the existing `<GraficoMacros ... />` call)

**Interfaces:**
- Consumes: `gastoExercicios` — already computed in `AppContext.jsx` and already destructured in `Hoje.jsx` from `useApp()` (used today in a text line "Gasto com exercícios"). No AppContext changes needed.
- Produces: `GraficoMacros` gains a new prop `caloriasQueimadas` (number, default `0`) — no other component depends on `GraficoMacros`'s internals, so no other file needs updating beyond the two above.

- [ ] **Step 1: Replace `src/components/hoje/GraficoMacros.jsx` with the new version**

```jsx
import { useReducedMotion } from 'framer-motion'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { useContagem } from '../../hooks/useContagem.js'

// Gráfico de macronutrientes em anéis concêntricos, com o anel de calorias
// por fora dos 3 anéis de macro (proteína/carboidrato/gordura).
// Design premium MWA: minimalismo + hierarquia visual + respiro

export default function GraficoMacros({ proteina = 0, carbos = 0, gordura = 0, metaProteina = 100, metaCarbos = 100, metaGordura = 40, calorias = 0, metaCalorias = 1800, caloriasQueimadas = 0 }) {
  const { ingles } = useIdioma()
  const reduzido = useReducedMotion()
  const ativo = !reduzido
  const proteinaAnimada = useContagem(proteina, { ativo })
  const carbosAnimados = useContagem(carbos, { ativo })
  const gorduraAnimada = useContagem(gordura, { ativo })
  const caloriasAnimadas = useContagem(calorias, { ativo })
  const caloriasQueimadasAnimadas = useContagem(caloriasQueimadas, { ativo })
  const centro = 100 // Centro do SVG (viewBox = 200x200)
  const espessuraAnel = 9
  const espessuraCalorias = 14

  // Raios para cada anel (do externo para interno) — anel de calorias por
  // fora dos 3 de macro, mais grosso, pra se destacar como indicador principal
  const raios = {
    calorias: 84, // anel mais externo, mais grosso
    proteina: 64,
    carbos: 44,
    gordura: 24,
  }

  // Função: Converte porcentagem em ângulo (0 a 360), sem ultrapassar 360
  function percentualParaAngulo(atual, meta) {
    if (!meta) return 0
    return Math.min(360 * (atual / meta), 360)
  }

  // Função: Calcula coordenadas do ponto final do arco
  function calcularPontoFinal(raio, anguloGraus) {
    const angulo = (anguloGraus - 90) * (Math.PI / 180)
    return {
      x: centro + raio * Math.cos(angulo),
      y: centro + raio * Math.sin(angulo),
    }
  }

  // Função: Desenha um arco entre dois ângulos (0–360) numa cor. Usada tanto
  // pelos anéis de macro (sempre de 0 até o ângulo atual) quanto pelo anel de
  // calorias (que precisa de um segundo segmento começando onde o primeiro termina).
  function desenharArco(raio, espessura, anguloInicio, anguloFim, cor) {
    if (anguloFim <= anguloInicio) return null
    const pontoInicio = calcularPontoFinal(raio, anguloInicio)
    const pontoFim = calcularPontoFinal(raio, anguloFim)
    const largoArco = anguloFim - anguloInicio > 180 ? 1 : 0
    return (
      <path
        d={`M ${pontoInicio.x} ${pontoInicio.y} A ${raio} ${raio} 0 ${largoArco} 1 ${pontoFim.x} ${pontoFim.y}`}
        fill="none"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinecap="round"
      />
    )
  }

  // Função: Desenha um anel de progresso de macro (fundo + 1 arco de 0 até o atual)
  function desenharAnel(raio, atual, meta, cor, opacidade = 1) {
    const angulo = percentualParaAngulo(atual, meta)
    return (
      <g key={`anel-${cor}`}>
        {/* Anel de fundo (meta) */}
        <circle cx={centro} cy={centro} r={raio} fill="none" stroke="#E8E4DC" strokeWidth={espessuraAnel} opacity="0.4" />
        {/* Anel de progresso */}
        <g opacity={opacidade}>{desenharArco(raio, espessuraAnel, 0, angulo, cor)}</g>
      </g>
    )
  }

  // Anel de calorias: segmento "comida" (verde-escuro, ou terracota de alerta
  // se a comida sozinha já ultrapassar a meta) + segmento "ganho pelo
  // exercício" (dourado), emendado logo depois, até fechar em no máximo 360°.
  function desenharAnelCalorias() {
    const anguloComida = percentualParaAngulo(caloriasAnimadas, metaCalorias)
    const anguloTotal = percentualParaAngulo(caloriasAnimadas + caloriasQueimadasAnimadas, metaCalorias)
    const acimaDaMeta = metaCalorias > 0 && caloriasAnimadas > metaCalorias
    const corComida = acimaDaMeta ? '#B0563C' : '#052A1F'

    return (
      <g key="anel-calorias">
        <circle cx={centro} cy={centro} r={raios.calorias} fill="none" stroke="#E8E4DC" strokeWidth={espessuraCalorias} opacity="0.4" />
        {desenharArco(raios.calorias, espessuraCalorias, 0, anguloComida, corComida)}
        {desenharArco(raios.calorias, espessuraCalorias, anguloComida, anguloTotal, '#C59F4F')}
      </g>
    )
  }

  // Controle de opacidade se ultrapassou meta (anéis de macro apenas)
  const opacidadeProteina = proteina > metaProteina ? 0.7 : 1
  const opacidadeCarbos = carbos > metaCarbos ? 0.7 : 1
  const opacidadeGordura = gordura > metaGordura ? 0.7 : 1

  // Calorie display (usa os valores já animados)
  const caloriasInteiro = Math.round(caloriasAnimadas)
  const metaCaloriasInteiro = Math.round(metaCalorias)
  const caloriasQueimadasInteiro = Math.round(caloriasQueimadasAnimadas)

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Calorias em cima */}
      <div className="text-center">
        <p className="font-serif text-3xl font-bold text-verde">{caloriasInteiro}</p>
        <p className="mt-0.5 text-xs text-verde/80 tracking-wide">de {metaCaloriasInteiro} kcal</p>
        {caloriasQueimadasInteiro > 0 && (
          <p className="mt-0.5 text-xs font-semibold text-ouro">+{caloriasQueimadasInteiro} kcal do exercício</p>
        )}
      </div>

      <div className="h-px w-16 bg-ouro/30" />

      {/* SVG do gráfico */}
      <svg viewBox="0 0 200 200" className="h-48 w-48 md:h-56 md:w-56">
        {/* Anel de Calorias (mais externo, mais grosso) */}
        {desenharAnelCalorias()}

        {/* Anel de Proteína (Verde Profundo) */}
        {desenharAnel(raios.proteina, proteinaAnimada, metaProteina, '#08402F', opacidadeProteina)}

        {/* Anel de Carboidratos (Sage) */}
        {desenharAnel(raios.carbos, carbosAnimados, metaCarbos, '#879B55', opacidadeCarbos)}

        {/* Anel de Gordura (Dourado) */}
        {desenharAnel(raios.gordura, gorduraAnimada, metaGordura, '#C59F4F', opacidadeGordura)}
      </svg>

      {/* Rótulos dos macros */}
      <div className="grid grid-cols-3 gap-6 text-center">
        {/* Proteína */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Protein' : 'Proteína'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-verde">
            {Math.round(proteinaAnimada)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/80">de {Math.round(metaProteina)}g</p>
        </div>

        {/* Carboidratos */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Carbs' : 'Carboidratos'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-sage">
            {Math.round(carbosAnimados)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/80">de {Math.round(metaCarbos)}g</p>
        </div>

        {/* Gordura */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Fat' : 'Gordura'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-ouro">
            {Math.round(gorduraAnimada)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/80">de {Math.round(metaGordura)}g</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire `caloriasQueimadas` in `Hoje.jsx`**

`Hoje.jsx` already destructures `gastoExercicios` from `useApp()` (used in the "Resumo do dia" list further down). Find the existing `<GraficoMacros ... />` call (currently around line 252-261) and add the new prop:

```jsx
          <GraficoMacros
            proteina={totaisHoje.proteina}
            carbos={totaisHoje.carbos}
            gordura={totaisHoje.gordura}
            metaProteina={metas.proteina}
            metaCarbos={metas.carboidrato}
            metaGordura={metas.gordura}
            calorias={totaisHoje.calorias}
            metaCalorias={metas.calorias}
            caloriasQueimadas={gastoExercicios}
          />
```

(Only the new `caloriasQueimadas={gastoExercicios}` line is added — every other prop and every other part of `Hoje.jsx` stays exactly as it is today.)

- [ ] **Step 3: Verify the app builds**

Run: `npm run build`
Expected: build succeeds with no new errors or warnings beyond the pre-existing chunk-size notice.

- [ ] **Step 4: Commit**

```bash
git add src/components/hoje/GraficoMacros.jsx src/components/hoje/Hoje.jsx
git commit -m "feat: adiciona anel de calorias com bônus de exercício em GraficoMacros"
```

- [ ] **Step 5: Manual verification in the browser**

Run: `npm run dev`, open the app, log in with a test account.

Check on the Hoje screen:
1. With no exercise logged today: the outer calorie ring shows only the dark-green segment, sized to `calorias/metaCalorias`; no "+N kcal do exercício" line appears.
2. Log an exercise (Ferramentas tab → "Registrar no meu dia"), return to Hoje: a gold segment appears right after the dark-green one, and "+N kcal do exercício" appears under the calorie number.
3. Log enough food to exceed the calorie goal by itself: the outer ring closes fully (360°) in terracota/alert color, at full opacity — even with exercise also logged that day (no gold segment should appear in this case).
4. Log food below the goal, then enough exercise that food+exercise exceeds the goal: dark-green up to the food's share, gold filling the rest up to 360°.
5. Confirm the 3 inner rings (protein/carbs/fat) still render at their new smaller radii, correctly proportioned, with labels underneath unchanged.

---

## Self-Review Notes

- **Spec coverage:** ring radii/thickness table, all 3 colors (comida, exercício, alerta), the two-angle fill formula, the "+N kcal do exercício" text line, and all 4 documented edge cases (no exercise, over-goal-by-food-alone, over-goal-combined, `metaCalorias=0` defensive guard) are all implemented in Step 1 and checked in Step 5.
- **No placeholders:** the full file content is given verbatim; nothing is left as "similar to" or described-but-not-shown.
- **Type/name consistency:** `caloriasQueimadas` is the exact prop name used both where it's defined (Step 1) and where it's passed in (Step 2) — matches the spec's own naming.
- **Scope:** touches exactly the 2 files the spec calls for; no AppContext or other component changes needed since `gastoExercicios` was already available.
