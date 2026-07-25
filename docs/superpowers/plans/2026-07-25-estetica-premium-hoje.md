# Estética Premium — Tela "Hoje" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevar a estética da tela "Hoje" (`src/components/hoje/`) para uma direção "Boutique Elevado" — mais respiro, glow dourado sutil, sombras em camadas, e animações discretas (framer-motion) — sem mudar estrutura, ordem de seções ou lógica de dados.

**Architecture:** Camada de fundação visual (token CSS + classe de sombra + variantes de movimento compartilhadas) + um utilitário puro de interpolação testável (`src/utils/contagem.js`) + um hook fino que o consome (`src/hooks/useContagem.js`), aplicados nos componentes de `src/components/hoje/` sem alterar props/contratos entre eles.

**Tech Stack:** React 18, Tailwind CSS v4 (`@theme` em `src/index.css`), framer-motion (nova dependência), `node:test` para testes de unidade.

## Global Constraints

- Não mudar paleta de cores nem fontes (`verde` #344528, `sage` #879b55, `ouro` #d4af7a, `creme` #f5f1e8; Poppins + Lora)
- Não mudar estrutura, ordem de seções ou conteúdo/dados da tela Hoje
- Toda animação deve respeitar `prefers-reduced-motion` (via `useReducedMotion()` do framer-motion)
- `npm run build` deve passar sem erros ao final de cada task
- Nomes de funções/variáveis em português, seguindo o padrão já usado no projeto (ex.: `desenharAnel`, `percentualParaAngulo`)

---

### Task 1: Fundação visual e de movimento

**Files:**
- Modify: `package.json` (via `npm install`)
- Modify: `src/index.css`
- Create: `src/lib/motion.js`

**Interfaces:**
- Produces: CSS custom property `--color-ouro-glow`; CSS class `.mwa-sombra-premium`; CSS class `.mwa-halo-ouro`; named exports `containerEntrada`, `itemEntrada` de `src/lib/motion.js` (objetos de variantes do framer-motion, usados pelas Tasks 6 e 7)

- [ ] **Step 1: Instalar framer-motion**

Run: `npm install framer-motion`
Expected: `framer-motion` aparece em `dependencies` no `package.json`

- [ ] **Step 2: Adicionar tokens visuais ao `src/index.css`**

Em `src/index.css`, dentro do bloco `@theme` (depois da linha `--font-serif: "Lora", Georgia, serif;`), adicionar:

```css
  --color-ouro-glow: rgba(212, 175, 122, 0.35);
```

Depois do bloco `body { ... }` (antes do comentário `/* Tela de encerramento do programa (dia 90)... */`), adicionar:

```css
/* Sombra em duas camadas: difusa + próxima, para dar profundidade real aos
   cards de destaque (visual "Boutique Elevado") */
.mwa-sombra-premium {
  box-shadow:
    0 2px 6px rgba(52, 69, 40, 0.08),
    0 20px 40px -12px rgba(52, 69, 40, 0.16);
}

/* Halo dourado sutil atrás de ícones/emojis em destaque */
.mwa-halo-ouro {
  background: radial-gradient(circle, var(--color-ouro-glow) 0%, transparent 70%);
}
```

- [ ] **Step 3: Criar `src/lib/motion.js`**

```js
// Variantes de movimento compartilhadas (framer-motion) para entradas em stagger.
//
// Uso:
//   <motion.div variants={containerEntrada} initial={reduzido ? false : 'oculto'} animate="visivel">
//     <motion.div variants={itemEntrada}>...</motion.div>
//   </motion.div>
//
// `reduzido` deve vir de `useReducedMotion()` (framer-motion) — passar
// `initial={false}` no container faz os filhos montarem direto no estado
// "visivel", sem animação de entrada.

export const containerEntrada = {
  oculto: {},
  visivel: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

export const itemEntrada = {
  oculto: { opacity: 0, y: 16 },
  visivel: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
  },
}
```

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros (o novo arquivo `src/lib/motion.js` ainda não é importado por ninguém, então isso só confirma que a sintaxe e o CSS são válidos)

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/index.css src/lib/motion.js
git commit -m "feat(estetica): instala framer-motion e cria fundacao visual/movimento"
```

---

### Task 2: Utilitário de contagem animada (TDD)

**Files:**
- Create: `src/utils/contagem.js`
- Test: `src/utils/contagem.test.js`
- Create: `src/hooks/useContagem.js`

**Interfaces:**
- Consumes: nada (utilitário independente)
- Produces: `facilitarSaidaCubica(progresso)`, `valorNaContagem(inicio, fim, progresso)` de `src/utils/contagem.js`; hook `useContagem(valorAlvo, { duracaoMs, ativo })` de `src/hooks/useContagem.js`, usado pelas Tasks 3, 4 e 5

- [ ] **Step 1: Escrever o teste (falhando)**

Criar `src/utils/contagem.test.js`:

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { facilitarSaidaCubica, valorNaContagem } from './contagem.js'

test('facilitarSaidaCubica retorna 0 no início e 1 no final', () => {
  assert.equal(facilitarSaidaCubica(0), 0)
  assert.equal(facilitarSaidaCubica(1), 1)
})

test('facilitarSaidaCubica desacelera perto do final (ease-out)', () => {
  // Em progresso=0.5, o valor suavizado deve ser MAIOR que 0.5 (início rápido, fim lento)
  const suavizado = facilitarSaidaCubica(0.5)
  assert.ok(suavizado > 0.5, `esperado > 0.5, recebido ${suavizado}`)
})

test('facilitarSaidaCubica satura fora do intervalo [0,1]', () => {
  assert.equal(facilitarSaidaCubica(-1), 0)
  assert.equal(facilitarSaidaCubica(2), 1)
})

test('valorNaContagem interpola do início ao fim', () => {
  assert.equal(valorNaContagem(0, 100, 0), 0)
  assert.equal(valorNaContagem(0, 100, 1), 100)
})

test('valorNaContagem funciona com contagem decrescente (fim < início)', () => {
  assert.equal(valorNaContagem(100, 0, 1), 0)
  assert.equal(valorNaContagem(100, 0, 0), 100)
})

test('valorNaContagem no meio do progresso fica entre início e fim', () => {
  const meio = valorNaContagem(0, 100, 0.5)
  assert.ok(meio > 50 && meio < 100, `esperado entre 50 e 100, recebido ${meio}`)
})
```

- [ ] **Step 2: Rodar o teste e confirmar falha**

Run: `node --test src/utils/contagem.test.js`
Expected: FAIL — `Cannot find module './contagem.js'`

- [ ] **Step 3: Implementar `src/utils/contagem.js`**

```js
/**
 * Easing ease-out cúbico: início rápido, desaceleração suave no final.
 * Usado para dar sensação de "assentamento" às contagens numéricas e
 * aos anéis de progresso animados.
 */
export function facilitarSaidaCubica(progresso) {
  const p = Math.min(Math.max(progresso, 0), 1)
  return 1 - Math.pow(1 - p, 3)
}

/**
 * Calcula o valor intermediário de uma contagem animada entre `inicio` e
 * `fim`, dado um progresso de 0 a 1 (com easing ease-out aplicado).
 */
export function valorNaContagem(inicio, fim, progresso) {
  const suavizado = facilitarSaidaCubica(progresso)
  return inicio + (fim - inicio) * suavizado
}
```

- [ ] **Step 4: Rodar o teste e confirmar sucesso**

Run: `node --test src/utils/contagem.test.js`
Expected: PASS — 6 testes passando

- [ ] **Step 5: Criar o hook `src/hooks/useContagem.js`**

> Nota: este hook depende de `requestAnimationFrame`/DOM e não tem teste de
> unidade próprio (o projeto não tem ambiente de DOM configurado para
> `node:test`) — a lógica matemática que ele usa já está coberta pelos testes
> do Step 1-4. A verificação deste hook é visual, feita na Task 8.

```js
import { useEffect, useRef, useState } from 'react'
import { valorNaContagem } from '../utils/contagem.js'

/**
 * Anima um número do seu valor anterior até `valorAlvo`, quadro a quadro.
 * Quando `ativo` é falso (ex.: prefers-reduced-motion), retorna `valorAlvo`
 * direto, sem animação.
 */
export function useContagem(valorAlvo, { duracaoMs = 600, ativo = true } = {}) {
  const [valorExibido, setValorExibido] = useState(ativo ? 0 : valorAlvo)
  const valorAnteriorRef = useRef(ativo ? 0 : valorAlvo)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!ativo) {
      setValorExibido(valorAlvo)
      valorAnteriorRef.current = valorAlvo
      return
    }

    const valorInicial = valorAnteriorRef.current
    if (valorInicial === valorAlvo) return

    const inicio = performance.now()

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracaoMs, 1)
      setValorExibido(valorNaContagem(valorInicial, valorAlvo, progresso))
      if (progresso < 1) {
        frameRef.current = requestAnimationFrame(passo)
      } else {
        valorAnteriorRef.current = valorAlvo
      }
    }

    frameRef.current = requestAnimationFrame(passo)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [valorAlvo, ativo, duracaoMs])

  return valorExibido
}
```

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros

- [ ] **Step 7: Commit**

```bash
git add src/utils/contagem.js src/utils/contagem.test.js src/hooks/useContagem.js
git commit -m "feat(estetica): utilitario e hook de contagem numerica animada"
```

---

### Task 3: `GraficoMacros.jsx` — anéis com draw-in e números contando

**Files:**
- Modify: `src/components/hoje/GraficoMacros.jsx`

**Interfaces:**
- Consumes: `useContagem` de `../../hooks/useContagem.js`
- Produces: nenhuma mudança de props — mesmo contrato (`proteina`, `carbos`, `gordura`, `metaProteina`, `metaCarbos`, `metaGordura`, `calorias`, `metaCalorias`)

- [ ] **Step 1: Importar `useReducedMotion` e `useContagem`**

Em `src/components/hoje/GraficoMacros.jsx`, no topo do arquivo, substituir:

```js
import { useIdioma } from '../../context/IdiomaContext.jsx'
```

por:

```js
import { useReducedMotion } from 'framer-motion'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { useContagem } from '../../hooks/useContagem.js'
```

- [ ] **Step 2: Animar os valores recebidos**

Logo após a linha `const { ingles } = useIdioma()`, adicionar:

```js
  const reduzido = useReducedMotion()
  const ativo = !reduzido
  const proteinaAnimada = useContagem(proteina, { ativo })
  const carbosAnimados = useContagem(carbos, { ativo })
  const gorduraAnimada = useContagem(gordura, { ativo })
  const caloriasAnimadas = useContagem(calorias, { ativo })
```

- [ ] **Step 3: Usar os valores animados no desenho dos anéis**

Substituir:

```js
        {desenharAnel(raios.proteina, proteina, metaProteina, '#344528', opacidadeProteina)}

        {/* Anel de Carboidratos (meio, Sage) */}
        {desenharAnel(raios.carbos, carbos, metaCarbos, '#879B55', opacidadeCarbos)}

        {/* Anel de Gordura (interno, Dourado) */}
        {desenharAnel(raios.gordura, gordura, metaGordura, '#D4AF7A', opacidadeGordura)}
```

por:

```js
        {desenharAnel(raios.proteina, proteinaAnimada, metaProteina, '#344528', opacidadeProteina)}

        {/* Anel de Carboidratos (meio, Sage) */}
        {desenharAnel(raios.carbos, carbosAnimados, metaCarbos, '#879B55', opacidadeCarbos)}

        {/* Anel de Gordura (interno, Dourado) */}
        {desenharAnel(raios.gordura, gorduraAnimada, metaGordura, '#D4AF7A', opacidadeGordura)}
```

- [ ] **Step 4: Contar calorias e macros nos números exibidos**

Substituir `caloriasInteiro`/`metaCaloriasInteiro`:

```js
  // Calorie display
  const caloriasInteiro = Math.round(calorias)
  const metaCaloriasInteiro = Math.round(metaCalorias)
```

por:

```js
  // Calorie display (usa o valor já animado)
  const caloriasInteiro = Math.round(caloriasAnimadas)
  const metaCaloriasInteiro = Math.round(metaCalorias)
```

E nos três blocos de rótulo (Proteína, Carboidratos, Gordura), substituir `{Math.round(proteina)}`, `{Math.round(carbos)}`, `{Math.round(gordura)}` por `{Math.round(proteinaAnimada)}`, `{Math.round(carbosAnimados)}`, `{Math.round(gorduraAnimada)}` respectivamente (mantendo todo o resto do JSX de cada bloco idêntico).

- [ ] **Step 5: Adicionar divisor dourado entre calorias e anéis**

Substituir:

```js
      {/* Calorias em cima */}
      <div className="text-center">
        <p className="font-serif text-3xl font-bold text-verde">{caloriasInteiro}</p>
        <p className="mt-0.5 text-xs text-verde/80 tracking-wide">de {metaCaloriasInteiro} kcal</p>
      </div>

      {/* SVG do gráfico */}
```

por:

```js
      {/* Calorias em cima */}
      <div className="text-center">
        <p className="font-serif text-3xl font-bold text-verde">{caloriasInteiro}</p>
        <p className="mt-0.5 text-xs text-verde/80 tracking-wide">de {metaCaloriasInteiro} kcal</p>
      </div>

      <div className="h-px w-16 bg-ouro/30" />

      {/* SVG do gráfico */}
```

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros

- [ ] **Step 7: Commit**

```bash
git add src/components/hoje/GraficoMacros.jsx
git commit -m "feat(estetica): anima aneis e numeros do GraficoMacros"
```

---

### Task 4: `AnelHidratacao.jsx` — anel animado e toques mais suaves

**Files:**
- Modify: `src/components/hoje/AnelHidratacao.jsx`

**Interfaces:**
- Consumes: `useContagem` de `../../hooks/useContagem.js`
- Produces: nenhuma mudança de props (`consumidoMl`, `metaMl`, `onClickAdicionar`)

- [ ] **Step 1: Importar `motion`, `useReducedMotion` e `useContagem`**

Substituir:

```js
import { useIdioma } from '../../context/IdiomaContext.jsx'
```

por:

```js
import { motion, useReducedMotion } from 'framer-motion'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { useContagem } from '../../hooks/useContagem.js'
```

- [ ] **Step 2: Animar `pct` e `consumidoMl`**

Substituir:

```js
  const { ingles } = useIdioma()
  const raio = 50
  const circ = 2 * Math.PI * raio
  const pct = Math.min(Math.round((consumidoMl / metaMl) * 100), 100)
  const preenchido = (Math.min(pct, 100) / 100) * circ
```

por:

```js
  const { ingles } = useIdioma()
  const reduzido = useReducedMotion()
  const ativo = !reduzido
  const raio = 50
  const circ = 2 * Math.PI * raio
  const pct = Math.min(Math.round((consumidoMl / metaMl) * 100), 100)
  const pctAnimado = useContagem(pct, { ativo, duracaoMs: 700 })
  const consumidoAnimado = useContagem(consumidoMl, { ativo, duracaoMs: 700 })
  const preenchido = (Math.min(pctAnimado, 100) / 100) * circ
```

Nota: as regras de `estado` (frase/cor por faixa de `pct`) continuam usando o `pct` real (não o animado), para o texto motivacional não "piscar" entre faixas durante a animação.

- [ ] **Step 3: Remover a transição CSS redundante do anel (agora animado via JS)**

Substituir:

```js
              strokeDasharray={`${preenchido} ${circ}`}
              className="transition-all duration-700 ease-out motion-reduce:transition-none"
            />
```

por:

```js
              strokeDasharray={`${preenchido} ${circ}`}
            />
```

- [ ] **Step 4: Exibir o percentual e o volume animados**

Substituir:

```js
            <span className="text-3xl font-bold" style={{ color: estado.cor }}>
              {pct}
            </span>
```

por:

```js
            <span className="text-3xl font-bold" style={{ color: estado.cor }}>
              {Math.round(pctAnimado)}
            </span>
```

Substituir:

```js
          <span className="text-2xl font-semibold text-verde">
            {(consumidoMl / 1000).toFixed(1).replace('.', ',')}
          </span>
```

por:

```js
          <span className="text-2xl font-semibold text-verde">
            {(consumidoAnimado / 1000).toFixed(1).replace('.', ',')}
          </span>
```

- [ ] **Step 5: Suavizar o toque dos botões +/-250ml**

Substituir:

```js
        <button
          type="button"
          onClick={() => onClickAdicionar && onClickAdicionar(-250)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-sage/30 font-bold text-verde/60 transition-colors hover:border-sage/60 active:scale-95"
          aria-label={ingles ? 'Remove 250 ml of water' : 'Remover 250 ml de água'}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => onClickAdicionar && onClickAdicionar(250)}
          className="min-h-11 rounded-lg bg-sage px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 hover:bg-sage/90"
          aria-label={ingles ? 'Add 250 ml of water' : 'Adicionar 250 ml de água'}
        >
          +250 ml
        </button>
```

por:

```js
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={() => onClickAdicionar && onClickAdicionar(-250)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-sage/30 font-bold text-verde/60 transition-colors hover:border-sage/60"
          aria-label={ingles ? 'Remove 250 ml of water' : 'Remover 250 ml de água'}
        >
          −
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={() => onClickAdicionar && onClickAdicionar(250)}
          className="min-h-11 rounded-lg bg-sage px-4 py-2.5 text-sm font-semibold text-white hover:bg-sage/90"
          aria-label={ingles ? 'Add 250 ml of water' : 'Adicionar 250 ml de água'}
        >
          +250 ml
        </motion.button>
```

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros

- [ ] **Step 7: Commit**

```bash
git add src/components/hoje/AnelHidratacao.jsx
git commit -m "feat(estetica): anima anel de hidratacao e suaviza toque dos botoes"
```

---

### Task 5: `AnelMeta.jsx` — percentual animado (consistente com os outros anéis)

**Files:**
- Modify: `src/components/hoje/AnelMeta.jsx`

**Interfaces:**
- Consumes: `useContagem` de `../../hooks/useContagem.js`
- Produces: nenhuma mudança de props (`label`, `consumido`, `meta`, `unidade`)

- [ ] **Step 1: Importar `useReducedMotion` e `useContagem`**

Substituir:

```js
import { percentualMeta, statusMeta } from '../../utils/calculos.js'
```

por:

```js
import { useReducedMotion } from 'framer-motion'
import { percentualMeta, statusMeta } from '../../utils/calculos.js'
import { useContagem } from '../../hooks/useContagem.js'
```

- [ ] **Step 2: Animar o percentual**

Substituir:

```js
export default function AnelMeta({ label, consumido, meta, unidade }) {
  const pct = percentualMeta(consumido, meta)
  const { cor } = statusMeta(pct)
  const raio = 26
  const circ = 2 * Math.PI * raio
  const preenchido = (Math.min(pct, 100) / 100) * circ
```

por:

```js
export default function AnelMeta({ label, consumido, meta, unidade }) {
  const pct = percentualMeta(consumido, meta)
  const { cor } = statusMeta(pct)
  const reduzido = useReducedMotion()
  const pctAnimado = useContagem(pct, { ativo: !reduzido })
  const raio = 26
  const circ = 2 * Math.PI * raio
  const preenchido = (Math.min(pctAnimado, 100) / 100) * circ
```

- [ ] **Step 3: Remover a transição CSS redundante e exibir o percentual animado**

Substituir:

```js
            strokeDasharray={`${preenchido} ${circ}`}
            className="transition-all duration-500 motion-reduce:transition-none"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-verde">
          {pct}%
        </span>
```

por:

```js
            strokeDasharray={`${preenchido} ${circ}`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-verde">
          {Math.round(pctAnimado)}%
        </span>
```

- [ ] **Step 4: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros

- [ ] **Step 5: Commit**

```bash
git add src/components/hoje/AnelMeta.jsx
git commit -m "feat(estetica): anima percentual do AnelMeta"
```

---

### Task 6: `SeuProgresso.jsx` — refinamento visual (sombra e divisor)

**Files:**
- Modify: `src/components/hoje/SeuProgresso.jsx`

**Interfaces:**
- Consumes: nenhuma nova
- Produces: nenhuma mudança de props (`usuario`, `pesagens`)

- [ ] **Step 1: Aplicar a sombra em camadas nos dois `<section>`**

Substituir (bloco do placeholder, sem pesagens):

```js
      <section className="mt-4 rounded-2xl bg-white p-8 shadow-lg shadow-verde/10">
        <h2 className="mb-1 text-sm font-semibold text-verde/60">Seu progresso</h2>
        <p className="mb-6 text-xs text-verde/80">
          Registre sua primeira pesagem para acompanhar o progresso — peso, medidas e fotos.
        </p>
```

por:

```js
      <section className="mwa-sombra-premium mt-4 rounded-2xl bg-white p-8">
        <h2 className="mb-1 text-sm font-semibold text-verde/60">Seu progresso</h2>
        <p className="mb-6 text-xs text-verde/80">
          Registre sua primeira pesagem para acompanhar o progresso — peso, medidas e fotos.
        </p>
```

Substituir (bloco principal, com pesagens):

```js
    <section className="mt-4 rounded-2xl bg-white p-8 shadow-lg shadow-verde/10">
      {/* Header */}
      <h2 className="mb-1 text-sm font-semibold text-verde/60">Seu progresso</h2>
```

por:

```js
    <section className="mwa-sombra-premium mt-4 rounded-2xl bg-white p-8">
      {/* Header */}
      <h2 className="mb-1 text-sm font-semibold text-verde/60">Seu progresso</h2>
```

- [ ] **Step 2: Trocar o divisor cinza pelo divisor dourado no histórico resumido**

Substituir:

```js
        <div className="mt-6 border-t border-cinza pt-4">
          <h3 className="mb-3 text-xs font-semibold text-verde/70">Histórico resumido</h3>
```

por:

```js
        <div className="mt-6 border-t border-ouro/20 pt-4">
          <h3 className="mb-3 text-xs font-semibold text-verde/70">Histórico resumido</h3>
```

- [ ] **Step 3: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros

- [ ] **Step 4: Commit**

```bash
git add src/components/hoje/SeuProgresso.jsx
git commit -m "feat(estetica): sombra em camadas e divisor dourado em SeuProgresso"
```

---

### Task 7: `Hoje.jsx` — header, entrada em stagger e botão flutuante

**Files:**
- Modify: `src/components/hoje/Hoje.jsx`

**Interfaces:**
- Consumes: `containerEntrada`, `itemEntrada` de `../../lib/motion.js`; `motion`, `useReducedMotion` de `framer-motion`
- Produces: nenhuma mudança de props (`irParaDicas`)

- [ ] **Step 1: Importar `motion`, `useReducedMotion` e as variantes**

Substituir:

```js
import { lazy, Suspense, useState } from 'react'
import { Plus, GlassWater, Flame, Lightbulb, ChevronRight, Newspaper, Share2, PartyPopper, Camera } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
```

por:

```js
import { lazy, Suspense, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plus, GlassWater, Flame, Lightbulb, ChevronRight, Newspaper, Share2, PartyPopper, Camera } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { containerEntrada, itemEntrada } from '../../lib/motion.js'
```

- [ ] **Step 2: Obter o estado de movimento reduzido**

Logo após a linha `const [enviandoFoto, setEnviandoFoto] = useState(false)`, adicionar:

```js
  const reduzido = useReducedMotion()
```

- [ ] **Step 3: Adicionar o glow dourado no header**

Substituir:

```js
      {/* Cabeçalho */}
      <header className="bg-verde px-6 pb-14 pt-10 text-white">
        <div className="flex items-center gap-2">
```

por:

```js
      {/* Cabeçalho */}
      <header className="relative overflow-hidden bg-verde px-6 pb-14 pt-10 text-white">
        <div
          aria-hidden="true"
          className="mwa-halo-ouro pointer-events-none absolute -right-10 -top-10 z-0 h-48 w-48 rounded-full"
        />
        <div className="relative z-10 flex items-center gap-2">
```

Nota: o `z-0` no glow e o `z-10` nos três `<div>` de conteúdo do header
garantem que o glow fique atrás do conteúdo de forma explícita — não
dependendo da ordem de empilhamento padrão do CSS (elementos posicionados
sem `z-index` explícito empilham por ordem no DOM, o que seria frágil aqui).
Os outros dois `<div>` diretos do header (`mt-2 flex items-start...` e
`mt-5 rounded-2xl bg-white/10...`) também precisam de `relative z-10`:

Substituir:

```js
        <div className="mt-2 flex items-start justify-between gap-3">
```

por:

```js
        <div className="relative z-10 mt-2 flex items-start justify-between gap-3">
```

Substituir:

```js
        <div className="mt-5 rounded-2xl bg-white/10 p-4">
```

por:

```js
        <div className="relative z-10 mt-5 rounded-2xl bg-white/10 p-4">
```

- [ ] **Step 4: Trocar a barra de progresso sólida por gradiente dourado**

Substituir:

```js
            <div
              className="h-full rounded-full bg-ouro transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progresso}%` }}
            />
```

por:

```js
            <div
              className="h-full rounded-full bg-gradient-to-r from-ouro to-ouro-claro transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progresso}%` }}
            />
```

- [ ] **Step 5: Envolver o conteúdo principal em um container de entrada em stagger**

Substituir a abertura do `<main>` e o início do painel de macros:

```js
      <main className="-mt-8 px-5">
        {/* Banner: dia concluído */}
        {diaCompleto && (
          <button
            type="button"
            onClick={abrirConclusaoDia}
            className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-verde to-sage p-4 text-left text-white shadow-lg shadow-verde/20 transition-transform active:scale-[0.99]"
          >
            <PartyPopper size={22} className="shrink-0 text-ouro" />
            <span className="flex-1">
              <span className="block text-sm font-bold">{ingles ? `Day ${diaAtual} completed!` : `Dia ${diaAtual} concluído!`} 🎉</span>
              <span className="text-xs text-white/80">{ingles ? 'Tap to view and share your achievement' : 'Toque para ver e compartilhar sua conquista'}</span>
            </span>
            <ChevronRight size={18} className="text-white/60" />
          </button>
        )}

        {/* Painel Premium: Macronutrientes em Anéis Concêntricos */}
        <section className="rounded-2xl bg-white p-6 shadow-lg shadow-verde/10">
```

por:

```js
      <main className="-mt-8 px-5">
        {/* Banner: dia concluído */}
        {diaCompleto && (
          <button
            type="button"
            onClick={abrirConclusaoDia}
            className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-verde to-sage p-4 text-left text-white shadow-lg shadow-verde/20 transition-transform active:scale-[0.99]"
          >
            <PartyPopper size={22} className="shrink-0 text-ouro" />
            <span className="flex-1">
              <span className="block text-sm font-bold">{ingles ? `Day ${diaAtual} completed!` : `Dia ${diaAtual} concluído!`} 🎉</span>
              <span className="text-xs text-white/80">{ingles ? 'Tap to view and share your achievement' : 'Toque para ver e compartilhar sua conquista'}</span>
            </span>
            <ChevronRight size={18} className="text-white/60" />
          </button>
        )}

        <motion.div
          variants={containerEntrada}
          initial={reduzido ? false : 'oculto'}
          animate="visivel"
        >
        {/* Painel Premium: Macronutrientes em Anéis Concêntricos */}
        <motion.section variants={itemEntrada} className="mwa-sombra-premium rounded-2xl bg-white p-7">
```

- [ ] **Step 6: Fechar a `<section>` de macros como `motion.section` e envolver `SeuProgresso`**

Substituir:

```js
          {/* Metas complementares embaixo */}
          <div className="mt-6 border-t border-cinza pt-4">
            <AnelMeta label={ingles ? 'Fiber' : 'Fibras'} consumido={totaisHoje.fibras} meta={metas.fibras} unidade="g" />
          </div>
        </section>

        {/* Seção: Seu Progresso */}
        <SeuProgresso usuario={usuario} pesagens={pesagens} />

        {/* Resumo do dia */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
```

por:

```js
          {/* Metas complementares embaixo */}
          <div className="mt-6 border-t border-ouro/20 pt-4">
            <AnelMeta label={ingles ? 'Fiber' : 'Fibras'} consumido={totaisHoje.fibras} meta={metas.fibras} unidade="g" />
          </div>
        </motion.section>

        {/* Seção: Seu Progresso */}
        <motion.div variants={itemEntrada}>
          <SeuProgresso usuario={usuario} pesagens={pesagens} />
        </motion.div>

        {/* Resumo do dia */}
        <motion.section variants={itemEntrada} className="mwa-sombra-premium mt-4 rounded-2xl bg-white p-6">
```

- [ ] **Step 7: Fechar a seção de resumo e envolver a de hidratação**

Substituir:

```js
            <li className="flex items-center justify-between py-2.5 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-verde/80">
                <Flame size={15} className="text-ouro" /> {ingles ? 'Exercise calories' : 'Gasto com exercícios'}
              </span>
              <strong className="text-verde">{gastoExercicios.toLocaleString(locale)} kcal</strong>
            </li>
          </ul>
        </section>

        {/* Seção de Hidratação: Anel Premium */}
        <section className="mt-6 rounded-2xl bg-white p-8 shadow-lg shadow-verde/10">
```

por:

```js
            <li className="flex items-center justify-between py-2.5 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-verde/80">
                <Flame size={15} className="text-ouro" /> {ingles ? 'Exercise calories' : 'Gasto com exercícios'}
              </span>
              <strong className="text-verde">{gastoExercicios.toLocaleString(locale)} kcal</strong>
            </li>
          </ul>
        </motion.section>

        {/* Seção de Hidratação: Anel Premium */}
        <motion.section variants={itemEntrada} className="mwa-sombra-premium mt-6 rounded-2xl bg-white p-8">
```

- [ ] **Step 8: Fechar a seção de hidratação e converter os cards de informativo/dica/compartilhar**

Substituir:

```js
          <AnelHidratacao consumidoMl={aguaMl} metaMl={metas.aguaMl} onClickAdicionar={adicionarAgua} />
        </section>

        {/* Informativo do dia */}
        {informativo && (
          <button
            type="button"
            onClick={irParaDicas}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-verde p-5 text-left text-white transition-transform active:scale-[0.99]"
          >
            <span className="text-2xl">{informativo.emoji}</span>
            <span className="flex-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-white/60">
                <Newspaper size={12} /> {ingles ? `Day ${diaAtual} guide` : `Informativo do dia ${diaAtual}`}
              </span>
              <span className="block font-serif text-base font-semibold italic text-ouro">
                {informativo.titulo}
              </span>
            </span>
            <ChevronRight size={18} className="text-white/40" />
          </button>
        )}

        {/* Dica do dia */}
        {dica && (
          <button
            type="button"
            onClick={irParaDicas}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
          >
            <span className="text-2xl">{dica.icone}</span>
            <span className="flex-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-verde/60">
                <Lightbulb size={12} /> {ingles ? `Tip for day ${diaAtual}` : `Dica do dia ${diaAtual}`}
              </span>
              <span className="block font-serif text-base font-semibold italic text-verde">{dica.titulo}</span>
            </span>
            <ChevronRight size={18} className="text-verde/40" />
          </button>
        )}

        {/* Compartilhar no Instagram: +15 🌱 por dia */}
        <button
          type="button"
          onClick={compartilhar}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sage">
            <Share2 size={20} />
          </span>
          <span className="flex-1">
            <span className="block font-serif text-base font-semibold italic text-verde">
              {ingles ? 'Share your journey' : 'Compartilhe sua jornada'}
            </span>
            <span className="text-xs text-verde/60">
              {ingles ? <>Post to your story and earn <strong className="text-verde">+15 🌱</strong> per day</> : <>Poste nos stories e ganhe <strong className="text-verde">+15 🌱</strong> por dia</>}
            </span>
          </span>
          <ChevronRight size={18} className="text-verde/40" />
        </button>
        {avisoCompartilhar && (
          <p className="mt-2 rounded-lg bg-sage-claro p-3 text-center text-sm font-semibold text-verde">
            {avisoCompartilhar}
          </p>
        )}

        {/* Oferta de upgrade conforme o cronograma (some quando o Programa de 90 Dias já está ativo) */}
        {!programa90Ativo && <CardUpgrade dia={diaAtual} />}
      </main>
```

por:

```js
          <AnelHidratacao consumidoMl={aguaMl} metaMl={metas.aguaMl} onClickAdicionar={adicionarAgua} />
        </motion.section>

        {/* Informativo do dia */}
        {informativo && (
          <motion.button
            variants={itemEntrada}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={irParaDicas}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-verde p-5 text-left text-white"
          >
            <span className="mwa-halo-ouro flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl">{informativo.emoji}</span>
            <span className="flex-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-white/60">
                <Newspaper size={12} /> {ingles ? `Day ${diaAtual} guide` : `Informativo do dia ${diaAtual}`}
              </span>
              <span className="block font-serif text-base font-semibold italic text-ouro">
                {informativo.titulo}
              </span>
            </span>
            <ChevronRight size={18} className="text-white/40" />
          </motion.button>
        )}

        {/* Dica do dia */}
        {dica && (
          <motion.button
            variants={itemEntrada}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={irParaDicas}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-ouro-claro p-5 text-left"
          >
            <span className="mwa-halo-ouro flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl">{dica.icone}</span>
            <span className="flex-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-verde/60">
                <Lightbulb size={12} /> {ingles ? `Tip for day ${diaAtual}` : `Dica do dia ${diaAtual}`}
              </span>
              <span className="block font-serif text-base font-semibold italic text-verde">{dica.titulo}</span>
            </span>
            <ChevronRight size={18} className="text-verde/40" />
          </motion.button>
        )}

        {/* Compartilhar no Instagram: +15 🌱 por dia */}
        <motion.button
          variants={itemEntrada}
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={compartilhar}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sage">
            <Share2 size={20} />
          </span>
          <span className="flex-1">
            <span className="block font-serif text-base font-semibold italic text-verde">
              {ingles ? 'Share your journey' : 'Compartilhe sua jornada'}
            </span>
            <span className="text-xs text-verde/60">
              {ingles ? <>Post to your story and earn <strong className="text-verde">+15 🌱</strong> per day</> : <>Poste nos stories e ganhe <strong className="text-verde">+15 🌱</strong> por dia</>}
            </span>
          </span>
          <ChevronRight size={18} className="text-verde/40" />
        </motion.button>
        </motion.div>

        {avisoCompartilhar && (
          <p className="mt-2 rounded-lg bg-sage-claro p-3 text-center text-sm font-semibold text-verde">
            {avisoCompartilhar}
          </p>
        )}

        {/* Oferta de upgrade conforme o cronograma (some quando o Programa de 90 Dias já está ativo) */}
        {!programa90Ativo && <CardUpgrade dia={diaAtual} />}
      </main>
```

- [ ] **Step 9: Animar a entrada do botão flutuante e suavizar hover/tap**

Substituir:

```js
      {/* Botão flutuante: adicionar refeição */}
      <button
        type="button"
        onClick={() => abrirModalRefeicao()}
        className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ouro px-5 py-3.5 font-semibold text-verde-escuro shadow-lg shadow-ouro/40 transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={20} strokeWidth={2.5} /> {ingles ? 'Add meal' : 'Adicionar refeição'}
      </button>
```

por:

```js
      {/* Botão flutuante: adicionar refeição */}
      <motion.button
        type="button"
        initial={reduzido ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduzido ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => abrirModalRefeicao()}
        className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ouro px-5 py-3.5 font-semibold text-verde-escuro shadow-lg shadow-ouro/40"
      >
        <Plus size={20} strokeWidth={2.5} /> {ingles ? 'Add meal' : 'Adicionar refeição'}
      </motion.button>
```

- [ ] **Step 10: Verificar build**

Run: `npm run build`
Expected: build conclui sem erros

- [ ] **Step 11: Commit**

```bash
git add src/components/hoje/Hoje.jsx
git commit -m "feat(estetica): glow no header, entrada em stagger e botao flutuante animado"
```

---

### Task 8: Verificação final na tela real

**Files:** nenhum (apenas verificação manual)

- [ ] **Step 1: Build de produção**

Run: `npm run build`
Expected: build conclui sem erros

- [ ] **Step 2: Rodar o app em dev e abrir a tela Hoje no navegador**

Run: `npm run dev` (ou usar o preview do navegador já configurado)
Logar como usuária de teste, navegar até a tela "Hoje"

- [ ] **Step 3: Conferir visualmente**

- Glow dourado sutil no canto superior direito do header
- Barra de progresso com gradiente dourado
- Cards entram em sequência (fade + leve deslocamento) ao carregar a tela
- Anéis de macro e de hidratação desenham do zero até o valor atual
- Números de calorias/proteína/carboidratos/gordura/hidratação contam suavemente
- Toque nos cards de dica/informativo/compartilhar e no botão flutuante responde com leve `scale`
- Divisores dourados visíveis (card de macros, card de progresso)
- Halo dourado sutil atrás dos emojis de dica/informativo

- [ ] **Step 4: Testar `prefers-reduced-motion: reduce`**

Ativar nas DevTools do navegador (Rendering → Emulate CSS media feature
`prefers-reduced-motion` → `reduce`), recarregar a tela Hoje
Expected: cards aparecem direto no estado final (sem stagger/fade), anéis e
números já aparecem no valor final (sem draw-in/contagem), botão flutuante
aparece sem o "pop" de entrada — mas continua respondendo a hover/tap

- [ ] **Step 5: Testar em largura mobile**

Redimensionar o navegador (ou usar modo responsivo) para 375px de largura
Expected: layout permanece correto, sem overflow horizontal, textos legíveis

- [ ] **Step 6: Screenshot final para registro**

Tirar um screenshot da tela Hoje renderizada e compartilhar com a Wanessa
como confirmação visual do resultado

- [ ] **Step 7: Commit final (se houver ajustes)**

Se algum ajuste visual for necessário após a verificação, aplicar, rodar
`npm run build` novamente e commitar separadamente com mensagem descrevendo
o ajuste.
