# MWA Landing Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir a landing standalone (`landingpage/`) como página premium "editorial wellness" da marca MWA (Jornada de **30 Dias**, R$ 97), com motion e showcase interativo, e depois alinhar a página `/vendas` do app à mesma mensagem e visual.

**Architecture:** SPA estática React 18 + Vite 6 + Tailwind CSS v4 (tokens via `@theme` em CSS). Motion 100% CSS + `IntersectionObserver` (sem bibliotecas de animação). Seções como componentes isolados em `src/sections/`, primitivos em `src/components/`. A `/vendas` do app (projeto raiz) é reescrita duplicando copy/visual com os tokens do app.

**Tech Stack:** React 18, Vite 6, Tailwind CSS v4, lucide-react, Google Fonts (Fraunces + Inter), sharp (dev-only, conversão WebP).

**Spec:** `docs/MWA-BrandBook-LandingPage-Copy.md` (matéria-prima de copy) + `docs/superpowers/specs/2026-07-16-mwa-landing-redesign-design.md` (decisões aprovadas — fonte de verdade).

## Global Constraints

- Produto de entrada: **"MWA | Jornada de 30 Dias" — "R$ 97"**. NENHUMA ocorrência de "21 dias" pode sobrar em copy visível (landing e `/vendas`).
- CRN obrigatório: **"Wanessa Auad — Nutricionista — CRN-1/27939"** presente no selo do hero/autoridade e no footer (exigência do Código de Ética CFN).
- PROIBIDO: countdown, urgência apelativa, promessas milagrosas ("emagreça rápido"), estética de infoproduto. Continuidade de 90 dias = "condição especial para alunas", sem prazo agressivo.
- Tipografia: display `Fraunces`, corpo `Inter` (Google Fonts, `display=swap`). Poppins/Lora saem da landing.
- Paleta (tokens Tailwind v4 `@theme`): forest `#2A3B1F`, forest-deep `#1C2614`, sage `#879B55`, gold `#C9A55C`, gold-soft `#DDBE85`, cream `#F5F1E8`, offwhite `#FAF7F0`, sand `#E8E4DC`, mist `#6F7A66`.
- Motion: só `transform`/`opacity`; zero biblioteca de animação; `prefers-reduced-motion` respeitado em TODA animação.
- CTAs: links para `CHECKOUT_URL` de `src/config.js` (placeholder Hotmart), `target="_blank" rel="noopener noreferrer"`.
- Sem framework de testes no projeto: o ciclo de verificação de cada task é `npm run build` (deve passar sem erros) + verificação visual/funcional no browser preview (dev server na porta 5173). Commits frequentes, um por task.
- Diretório de trabalho das tasks 1–10: `C:\Users\wanes\OneDrive\Desktop\MWA\landingpage`. Tasks 11–12: raiz do repo.

---

### Task 1: Fundação — tokens, fontes, meta e config

**Files:**
- Modify: `landingpage/index.html`
- Modify: `landingpage/src/index.css`
- Modify: `landingpage/src/config.js`

**Interfaces:**
- Produces: tokens de cor (`forest`, `forest-deep`, `sage`, `gold`, `gold-soft`, `cream`, `offwhite`, `sand`, `mist`), fontes (`font-display`, `font-sans`), classes de motion (`.reveal`, `.is-visible`, `.hero-enter`, `.hero-enter-delay-1..4`), e `BRAND`/`CHECKOUT_URL` de `config.js` — usados por todas as tasks seguintes.

- [ ] **Step 1: Substituir fontes e meta em `index.html`**

Conteúdo completo do `<head>` (substituir o atual):

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MWA | My Wellness App — Jornada de 30 Dias</title>
    <meta
      name="description"
      content="Não é uma dieta. É uma nova forma de viver. Em 30 dias, aprenda a metodologia MWA e aplique no dia a dia com acompanhamento diário pelo app — criado pela nutricionista Wanessa Auad (CRN-1/27939)."
    />
    <meta property="og:title" content="MWA — My Wellness App | Jornada de 30 Dias" />
    <meta property="og:description" content="Não é uma dieta. É uma nova forma de viver. 30 dias para aprender e aplicar uma nova forma de cuidar de você." />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 1b: Gerar o favicon a partir do logo novo**

Copiar o símbolo da marca para `landingpage/public/favicon.png` — usar `public/favicon.png` do app raiz (já é o símbolo MWA atualizado):

```bash
cp public/favicon.png landingpage/public/favicon.png
```

- [ ] **Step 2: Reescrever `src/index.css` com tokens novos + motion**

Conteúdo completo:

```css
@import "tailwindcss";

@theme {
  /* Paleta MWA — editorial wellness */
  --color-forest: #2a3b1f;
  --color-forest-deep: #1c2614;
  --color-sage: #879b55;
  --color-gold: #c9a55c;
  --color-gold-soft: #ddbe85;
  --color-cream: #f5f1e8;
  --color-offwhite: #faf7f0;
  --color-sand: #e8e4dc;
  --color-ink: #2a3b1f;
  --color-mist: #6f7a66;

  --font-display: "Fraunces", Georgia, serif;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: var(--color-ink);
  background-color: var(--color-offwhite);
  -webkit-font-smoothing: antialiased;
}

::selection {
  background-color: var(--color-gold);
  color: white;
}

/* ---------- Motion: scroll reveal ---------- */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}

/* ---------- Motion: entrada orquestrada do hero ---------- */
@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.hero-enter {
  opacity: 0;
  animation: hero-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
.hero-enter-delay-1 { animation-delay: 0.12s; }
.hero-enter-delay-2 { animation-delay: 0.24s; }
.hero-enter-delay-3 { animation-delay: 0.38s; }
.hero-enter-delay-4 { animation-delay: 0.52s; }

/* ---------- Motion: showcase do app (troca de tela) ---------- */
@keyframes screen-in {
  from {
    opacity: 0;
    transform: translateX(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.screen-in {
  animation: screen-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* ---------- Acessibilidade: reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  .reveal,
  .hero-enter,
  .screen-in {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 3: Atualizar `src/config.js`**

Conteúdo completo:

```js
/**
 * Configuração central da landing page MWA.
 * Altere aqui o link de checkout da Hotmart — todos os botões usam este valor.
 */
export const CHECKOUT_URL = 'https://pay.hotmart.com/SEU_CODIGO_AQUI'

export const BRAND = {
  name: 'MWA',
  method: 'My Wellness App',
  concept: 'My Wellness Approach',
  tagline: 'Não é uma dieta. É uma nova forma de viver.',
  product: 'MWA | Jornada de 30 Dias',
  days: 30,
  price: 'R$ 97',
  crn: 'CRN-1/27939',
  author: 'Wanessa Auad',
  year: new Date().getFullYear(),
}
```

- [ ] **Step 4: Verificar build**

Run: `cd "C:\Users\wanes\OneDrive\Desktop\MWA\landingpage" && npm run build`
Expected: build passa. (As seções antigas ainda referenciam tokens antigos como `text-mist`, `bg-sand` — esses continuam existindo; `gold-soft` também foi mantido. O token antigo `--color-forest` mudou só de valor, então nada quebra.)

- [ ] **Step 5: Commit**

```bash
git add landingpage/index.html landingpage/public/favicon.png landingpage/src/index.css landingpage/src/config.js
git commit -m "feat(landing): fundacao do redesign - tokens editorial wellness, Fraunces+Inter, Jornada de 30 Dias"
```

---

### Task 2: Primitivos de UI e motion — `ui.jsx`, `Reveal`, `CountUp`

**Files:**
- Modify: `landingpage/src/components/ui.jsx`
- Create: `landingpage/src/components/Reveal.jsx`
- Create: `landingpage/src/components/CountUp.jsx`

**Interfaces:**
- Consumes: tokens da Task 1; `CHECKOUT_URL` de `config.js`.
- Produces:
  - `CtaButton({ children, variant: 'primary'|'gold'|'outline'|'light', href?, className? })` — âncora pill com seta `ArrowRight` que desliza no hover.
  - `Section({ children, className?, id?, wide? })` — `wide` usa `max-w-6xl`, padrão `max-w-5xl`.
  - `Eyebrow({ children, light? })` — kicker caps dourado.
  - `Title({ children, light?, className? })` — h2 Fraunces.
  - `GoldRule({ className? })`.
  - `Reveal({ children, delay?, className?, as? })` — default export de `Reveal.jsx`.
  - `CountUp({ value, suffix?, prefix?, duration?, className? })` — default export de `CountUp.jsx`; anima de 0 até `value` (número) quando entra na viewport; respeita reduced-motion (mostra valor final direto).

- [ ] **Step 1: Reescrever `src/components/ui.jsx`**

Conteúdo completo:

```jsx
import { ArrowRight } from 'lucide-react'
import { CHECKOUT_URL } from '../config.js'

/* ---------- Botão CTA (link para checkout Hotmart) ---------- */
export function CtaButton({ children, variant = 'primary', href = CHECKOUT_URL, className = '' }) {
  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full px-9 py-4 text-sm md:text-base font-semibold tracking-wide transition-all duration-300'
  const variants = {
    primary:
      'bg-forest text-cream hover:bg-forest-deep hover:shadow-xl hover:shadow-forest/25 hover:-translate-y-0.5',
    gold:
      'bg-gold text-forest-deep hover:bg-gold-soft hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5',
    outline:
      'border border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-cream',
    light:
      'bg-cream text-forest hover:bg-white hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5',
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${variants[variant]} ${className}`}>
      {children}
      <ArrowRight
        size={18}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  )
}

/* ---------- Seção com respiro padrão ---------- */
export function Section({ children, className = '', id, wide = false }) {
  return (
    <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-5xl'}`}>{children}</div>
    </section>
  )
}

/* ---------- Kicker: rótulo pequeno acima do título ---------- */
export function Eyebrow({ children, light = false }) {
  return (
    <p
      className={`mb-4 text-xs font-semibold uppercase tracking-[0.3em] ${
        light ? 'text-gold-soft' : 'text-gold'
      }`}
    >
      {children}
    </p>
  )
}

/* ---------- Título de seção (Fraunces) ---------- */
export function Title({ children, light = false, className = '' }) {
  return (
    <h2
      className={`font-display text-3xl leading-snug md:text-[2.6rem] md:leading-tight ${
        light ? 'text-cream' : 'text-forest-deep'
      } ${className}`}
    >
      {children}
    </h2>
  )
}

/* ---------- Divisor dourado sutil ---------- */
export function GoldRule({ className = '' }) {
  return <div className={`h-px w-16 bg-gold ${className}`} />
}
```

- [ ] **Step 2: Criar `src/components/Reveal.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal: fade + rise quando o elemento entra na viewport (uma vez só).
 * CSS em index.css (.reveal / .is-visible) — reduced-motion tratado lá.
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 3: Criar `src/components/CountUp.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Número que conta de 0 até `value` quando entra na tela. */
export default function CountUp({ value, prefix = '', suffix = '', duration = 1200, className = '' }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(reducedMotion() ? value : 0)

  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let raf
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setDisplay(Math.round(eased * value))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
```

- [ ] **Step 4: Verificar build**

Run: `npm run build` (em `landingpage/`)
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add landingpage/src/components/
git commit -m "feat(landing): primitivos de UI e motion - CtaButton com seta, Reveal, CountUp"
```

---

### Task 3: Header fixo com blur ao scroll

**Files:**
- Create: `landingpage/src/components/Header.jsx`

**Interfaces:**
- Consumes: `CtaButton` da Task 2, logo `src/assets/logo-mwa.png`.
- Produces: `Header` (default export) — montado no topo do `App.jsx` na Task 10.

- [ ] **Step 1: Criar `src/components/Header.jsx`**

```jsx
import { useEffect, useState } from 'react'
import { CHECKOUT_URL } from '../config.js'
import logoMWA from '../assets/logo-mwa.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Principal"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-forest/10 bg-offwhite/85 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#" aria-label="MWA — voltar ao topo" className="flex items-center gap-2">
          <img src={logoMWA} alt="MWA" className="h-9 w-auto" />
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#app"
            className="hidden text-sm font-medium text-forest/80 transition-colors hover:text-forest sm:block"
          >
            Como funciona
          </a>
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-cream transition-all duration-300 hover:bg-forest-deep hover:shadow-lg hover:shadow-forest/20"
          >
            Começar agora
          </a>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Verificar build + commit**

Run: `npm run build` → PASS.

```bash
git add landingpage/src/components/Header.jsx
git commit -m "feat(landing): header fixo com blur ao scroll"
```

---

### Task 4: Hero orquestrado

**Files:**
- Modify: `landingpage/src/sections/Hero.jsx` (reescrita completa)

**Interfaces:**
- Consumes: `CtaButton`, `GoldRule` (Task 2), classes `hero-enter*` (Task 1), `BRAND` de `config.js`, `src/assets/logo-mwa.png`.

- [ ] **Step 1: Reescrever `Hero.jsx`**

Copy oficial do hero (não alterar sem aprovação):
- Kicker: `MWA · My Wellness App`
- H1: **"Não é uma dieta. É uma nova forma de viver."** (segunda frase em itálico Fraunces)
- Sub: "Em 30 dias, você aprende a metodologia MWA e aplica no seu dia a dia: alimentação organizada, hidratação, movimento e evolução acompanhados diariamente pelo aplicativo."
- Apoio: "Criado a partir da abordagem que permitiu a Wanessa Auad eliminar 26 kg e manter sua transformação por 14 anos — agora no seu bolso."
- CTA: `Quero começar meus 30 dias`
- Selo: "Desenvolvido por Wanessa Auad — Nutricionista · CRN-1/27939 · 20+ anos de experiência"

```jsx
import { CtaButton, GoldRule } from '../components/ui.jsx'
import logoMWA from '../assets/logo-mwa.png'

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-offwhite px-6 pb-16 pt-28 md:pb-24 md:pt-36">
      {/* Órbitas decorativas */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-gold/10" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 h-96 w-96 rounded-full bg-sage/5" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div className="text-center md:text-left">
          <p className="hero-enter text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            MWA · My Wellness App
          </p>

          <h1 className="hero-enter hero-enter-delay-1 mt-6 font-display text-4xl leading-[1.15] text-forest-deep md:text-6xl">
            Não é uma dieta.
            <br />
            <em className="italic text-forest">É uma nova forma de viver.</em>
          </h1>

          <GoldRule className="hero-enter hero-enter-delay-2 mx-auto my-8 md:mx-0" />

          <p className="hero-enter hero-enter-delay-2 mx-auto max-w-xl text-base leading-relaxed text-ink/80 md:mx-0 md:text-lg">
            Em <strong className="font-semibold text-forest">30 dias</strong>, você aprende a
            metodologia MWA e aplica no seu dia a dia: alimentação organizada, hidratação,
            movimento e evolução acompanhados diariamente pelo aplicativo.
          </p>

          <p className="hero-enter hero-enter-delay-3 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mist md:mx-0">
            Criado a partir da abordagem que permitiu a Wanessa Auad eliminar 26 kg e manter sua
            transformação por 14 anos — agora no seu bolso.
          </p>

          <div className="hero-enter hero-enter-delay-4 mt-10">
            <CtaButton>Quero começar meus 30 dias</CtaButton>
            <p className="mt-6 text-xs leading-relaxed text-mist md:text-sm">
              Desenvolvido por Wanessa Auad — Nutricionista · CRN-1/27939 · 20+ anos de experiência
            </p>
          </div>
        </div>

        <div className="hero-enter hero-enter-delay-3 flex justify-center md:justify-end">
          <img
            src={logoMWA}
            alt="MWA — My Wellness Approach"
            className="w-64 max-w-full drop-shadow-[0_18px_28px_rgba(42,59,31,0.12)] sm:w-72 md:w-full md:max-w-[26rem]"
          />
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verificação visual**

Iniciar o dev server via preview (`.claude/launch.json` com `npm run dev` na pasta `landingpage`, porta 5173). Verificar: entrada em sequência (kicker → headline → régua/sub → apoio → CTA), headline Fraunces com itálico, selo CRN visível, sem "21 dias".

- [ ] **Step 3: Commit**

```bash
git add landingpage/src/sections/Hero.jsx
git commit -m "feat(landing): hero orquestrado - 'Nao e uma dieta' com entrada em sequencia e selo CRN"
```

---

### Task 5: TrustBar + Problem

**Files:**
- Modify: `landingpage/src/sections/TrustBar.jsx` (reescrita)
- Modify: `landingpage/src/sections/Problem.jsx` (reescrita)

**Interfaces:**
- Consumes: `Section`, `Eyebrow`, `Title` (Task 2), `Reveal` (Task 2), ícones lucide.

- [ ] **Step 1: Reescrever `TrustBar.jsx`**

```jsx
import { Award, BadgeCheck, ShieldCheck, CreditCard } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'

const items = [
  { icon: Award, label: '20+ anos de experiência' },
  { icon: BadgeCheck, label: 'Nutricionista · CRN-1/27939' },
  { icon: ShieldCheck, label: 'Garantia incondicional de 7 dias' },
  { icon: CreditCard, label: 'Pagamento único, sem mensalidade' },
]

export default function TrustBar() {
  return (
    <div className="border-y border-forest/10 bg-cream px-6 py-8">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
        {items.map(({ icon: Icon, label }, i) => (
          <Reveal key={label} delay={i * 90} className="flex items-center justify-center gap-2.5 text-center md:text-left">
            <Icon size={20} aria-hidden="true" className="shrink-0 text-gold" strokeWidth={1.8} />
            <p className="text-xs font-medium leading-snug text-forest md:text-sm">{label}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Reescrever `Problem.jsx`**

```jsx
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Problem() {
  return (
    <Section className="bg-offwhite">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>O problema</Eyebrow>
          <Title>Pare de recomeçar toda segunda-feira.</Title>
        </Reveal>
        <Reveal delay={120} className="mt-8 space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
          <p>
            Você não precisa contar calorias sem entender o que está fazendo. Não precisa de
            restrições impossíveis. E não precisa carregar culpa por não sustentar uma rotina que
            nunca foi pensada para a sua vida real.
          </p>
          <p className="font-display text-xl italic text-forest md:text-2xl">
            O problema não é a sua força de vontade. É tentar mudar sem método.
          </p>
          <p>
            O MWA existe para ensinar você a entender seu corpo, organizar sua alimentação e
            construir hábitos que continuam — muito depois do programa.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
```

- [ ] **Step 3: Build + verificação visual + commit**

Run: `npm run build` → PASS. No browser: barra com 4 provas revela em stagger; seção do problema centrada com frase itálica.

```bash
git add landingpage/src/sections/TrustBar.jsx landingpage/src/sections/Problem.jsx
git commit -m "feat(landing): trust bar com CRN e secao do problema reescrita"
```

---

### Task 6: Story — história com números animados

**Files:**
- Modify: `landingpage/src/sections/Story.jsx` (reescrita)

**Interfaces:**
- Consumes: `Section`, `Eyebrow`, `Title`, `GoldRule`, `Reveal`, `CountUp`; foto `src/assets/foto-wanessa-story-final.jpg`.

- [ ] **Step 1: Reescrever `Story.jsx`**

Copy oficial:
- Kicker: `A história`
- Título: "Antes de ser um método, foi uma vida transformada."
- Destaque: **"O maior resultado não foi perder 26 kg. Foi aprender a permanecer."**
- Números: 26 (kg eliminados) · 14 (anos de manutenção) · 20+ (anos de profissão)

```jsx
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import CountUp from '../components/CountUp.jsx'
import fotoWanessaStory from '../assets/foto-wanessa-story-final.jpg'

const stats = [
  { value: 26, suffix: ' kg', label: 'eliminados após a gestação' },
  { value: 14, suffix: ' anos', label: 'mantendo a transformação' },
  { value: 20, suffix: '+', label: 'anos como nutricionista' },
]

export default function Story() {
  return (
    <Section className="bg-forest-deep" wide>
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="order-2 md:order-1">
          <div className="overflow-hidden rounded-3xl border border-gold/25 shadow-2xl shadow-black/30">
            <img
              src={fotoWanessaStory}
              alt="Wanessa Auad, nutricionista e criadora do MWA"
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <div className="order-1 md:order-2">
          <Reveal>
            <Eyebrow light>A história</Eyebrow>
            <Title light>Antes de ser um método, foi uma vida transformada.</Title>
          </Reveal>

          <Reveal delay={120} className="mt-8 space-y-5 text-base leading-relaxed text-cream/85">
            <p>
              Após a gestação do meu filho, eliminei 26 kg. Mas o maior desafio não era emagrecer —
              era nunca mais precisar recomeçar.
            </p>
            <p>
              Foi nesse processo que entendi: dietas até geram resultados rápidos, mas são os
              hábitos que os mantêm ao longo dos anos. Há 14 anos vivo essa transformação, com
              alimentação inteligente, mentalidade e escolhas consistentes.
            </p>
            <p>
              Como nutricionista, transformei essa vivência em método — o mesmo que agora acompanha
              você todos os dias pelo aplicativo.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 border-l-2 border-gold pl-5 font-display text-xl italic leading-snug text-gold-soft md:text-2xl">
              "O maior resultado não foi perder 26 kg. Foi aprender a permanecer."
            </p>
          </Reveal>

          <Reveal delay={260} className="mt-10 grid grid-cols-3 gap-4">
            {stats.map(({ value, suffix, label }) => (
              <div key={label}>
                <p className="font-display text-3xl text-gold md:text-4xl">
                  <CountUp value={value} suffix={suffix} />
                </p>
                <p className="mt-1 text-xs leading-snug text-cream/60">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Build + verificação (números contam ao entrar na tela) + commit**

```bash
git add landingpage/src/sections/Story.jsx
git commit -m "feat(landing): secao da historia com foto real e numeros animados (26kg/14anos/20+)"
```

---

### Task 7: Method — os 4 pilares

**Files:**
- Modify: `landingpage/src/sections/Method.jsx` (reescrita)

**Interfaces:**
- Consumes: `Section`, `Eyebrow`, `Title`, `Reveal`, ícones lucide.

- [ ] **Step 1: Reescrever `Method.jsx`**

```jsx
import { Brain, Salad, CalendarCheck, HeartHandshake } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

const pillars = [
  {
    icon: Brain,
    title: 'Mentalidade',
    text: 'Nenhuma transformação começa no prato. Começa na forma como você pensa, decide e se compromete com a própria saúde — fora do ciclo da culpa.',
  },
  {
    icon: Salad,
    title: 'Nutrição Inteligente',
    text: 'Refeições equilibradas, calorias sob controle e proteína na medida certa. Sem modismos, sem extremos, sem terrorismo alimentar.',
  },
  {
    icon: CalendarCheck,
    title: 'Rotina Sustentável',
    text: 'São os hábitos diários que sustentam resultados. Alimentação, água, metas e movimento organizados em uma rotina possível.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompanhamento',
    text: 'Informação sem prática não transforma. Durante os 30 dias, o app guia, registra e mostra sua evolução — todos os dias.',
  },
]

export default function Method() {
  return (
    <Section className="bg-cream" wide>
      <div className="text-center">
        <Reveal>
          <Eyebrow>O método</Eyebrow>
          <Title>Os 4 pilares do My Wellness Approach</Title>
        </Reveal>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, text }, i) => (
          <Reveal
            key={title}
            delay={i * 100}
            className="group rounded-3xl border border-forest/10 bg-offwhite p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-forest/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-forest transition-colors duration-300 group-hover:bg-gold/20">
              <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-display text-xl text-forest-deep">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Build + verificação (cards com lift no hover, stagger no reveal) + commit**

```bash
git add landingpage/src/sections/Method.jsx
git commit -m "feat(landing): 4 pilares com cards interativos"
```

---

### Task 8: AppShowcase — showcase interativo (seção dark)

**Files:**
- Create: `landingpage/src/components/PhoneScreens.jsx`
- Create: `landingpage/src/sections/AppShowcase.jsx`
- Delete: `landingpage/src/sections/AppScreens.jsx`, `landingpage/src/sections/Journey.jsx`, `landingpage/src/sections/Ecosystem.jsx` (na Task 10, junto da montagem)

**Interfaces:**
- Consumes: `Section`, `Eyebrow`, `Title`, `CtaButton`, `Reveal`; classe `.screen-in` (Task 1).
- Produces: `AppShowcase` (default export), com `id="app"` (âncora usada pelo Header).

- [ ] **Step 1: Criar `PhoneScreens.jsx` — as 7 telas desenhadas em código**

Portar os 7 mockups de tela que já existem em `src/components/vendas/LandingVendas.jsx` (projeto raiz, linhas 279–529: Hoje, Refeições, Progresso, Dica do dia, Calculadora de macros, Exercício, Jogos), cada um virando um componente exportado (`ScreenHoje`, `ScreenRefeicoes`, `ScreenProgresso`, `ScreenDica`, `ScreenMacros`, `ScreenExercicio`, `ScreenJogos`). Ajustes obrigatórios no port:
- Mapeamento de tokens do app → landing: `bg-creme`→`bg-cream`, `text-verde`→`text-forest`, `text-verde/60`→`text-forest/60`, `bg-sage`→`bg-sage`, `bg-cinza`→`bg-sand`, `text-ouro`/`bg-ouro-claro`→`text-gold`/`bg-gold/15`, `font-serif`→`font-display`.
- Trocar "Dia 7 de 21" → "Dia 7 de 30"; "Dia 4 de 21" → "Dia 4 de 30".
- Remover o wrapper externo `<div className="mx-auto w-56 rounded-[2rem] border-4 ...">` de cada tela — a moldura passa a ser única, no `AppShowcase`. Cada `Screen*` retorna apenas o conteúdo interno.
- Remover classes `blur-[3px]`/`select-none` dos textos (na landing nova o conteúdo aparece nítido).

Estrutura do arquivo:

```jsx
/* Telas do app desenhadas em código — conteúdo interno do telefone do showcase. */

export function ScreenHoje() {
  return (
    <div className="p-4">
      <p className="mb-1 text-left font-display text-sm font-bold italic text-forest">Olá, Maria 🌿</p>
      <p className="mb-3 text-left text-[10px] text-forest/60">Dia 7 de 30 — você está indo bem!</p>
      {/* anel de calorias, água, macros — portado de LandingVendas.jsx:282-310 com o mapeamento acima */}
    </div>
  )
}
/* ...ScreenRefeicoes, ScreenProgresso, ScreenDica, ScreenMacros, ScreenExercicio, ScreenJogos
   seguem o mesmo padrão, portados de LandingVendas.jsx:318-528 */
```

(O conteúdo interno completo de cada tela está em `src/components/vendas/LandingVendas.jsx` nas linhas indicadas — porte fiel, só com o mapeamento de tokens e as trocas de texto listadas.)

- [ ] **Step 2: Criar `AppShowcase.jsx`**

Copy oficial:
- Kicker: `O aplicativo`
- Título: "Mais do que um app. Um método que acompanha você todos os dias."
- Sub: "Uma nutricionista no seu bolso: registre, aprenda e veja sua evolução em tempo real."

```jsx
import { useEffect, useRef, useState } from 'react'
import { Section, Eyebrow, Title, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  ScreenHoje, ScreenRefeicoes, ScreenProgresso, ScreenDica,
  ScreenMacros, ScreenExercicio, ScreenJogos,
} from '../components/PhoneScreens.jsx'

const features = [
  { id: 'hoje', label: 'Acompanhe seu dia', desc: 'Calorias, água e macros calculados automaticamente para o seu corpo e objetivo.', Screen: ScreenHoje },
  { id: 'refeicoes', label: 'Registre refeições', desc: 'Banco de alimentos pronto: escolha, toque e os nutrientes são somados na hora.', Screen: ScreenRefeicoes },
  { id: 'progresso', label: 'Veja sua evolução', desc: 'Pesagens, medidas e fotos de antes e depois — sua transformação registrada.', Screen: ScreenProgresso },
  { id: 'dicas', label: 'Aprenda todos os dias', desc: 'Uma orientação exclusiva da nutricionista por dia, durante os 30 dias.', Screen: ScreenDica },
  { id: 'macros', label: 'Calculadora de macros', desc: 'Consulte qualquer alimento em segundos, sem decorar tabela nutricional.', Screen: ScreenMacros },
  { id: 'exercicio', label: 'Atividade física', desc: 'Registre treinos e veja as calorias gastas somadas às metas do dia.', Screen: ScreenExercicio },
  { id: 'jogos', label: 'Jogos que motivam', desc: 'Cumpra metas, jogue e personalize seu avatar. Leveza para sustentar o processo.', Screen: ScreenJogos },
]

const AUTO_MS = 5000

export default function AppShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)

  // Auto-avanço lento; pausa no hover/interação; desliga com reduced-motion.
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((a) => (a + 1) % features.length), AUTO_MS)
    return () => clearInterval(t)
  }, [paused])

  const { Screen, label, desc } = features[active]

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) {
      setPaused(true)
      setActive((a) => (a + (dx < 0 ? 1 : -1) + features.length) % features.length)
    }
    touchX.current = null
  }

  return (
    <Section id="app" className="bg-forest-deep" wide>
      <div className="text-center">
        <Reveal>
          <Eyebrow light>O aplicativo</Eyebrow>
          <Title light>Mais do que um app. Um método que acompanha você todos os dias.</Title>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/70 md:text-base">
            Uma nutricionista no seu bolso: registre, aprenda e veja sua evolução em tempo real.
          </p>
        </Reveal>
      </div>

      <div
        className="mt-14 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Navegação de recursos (desktop: coluna esquerda) */}
        <div role="tablist" aria-label="Recursos do aplicativo" className="order-2 flex flex-wrap justify-center gap-2 md:order-1 md:flex-col md:justify-start">
          {features.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => { setPaused(true); setActive(i) }}
              className={`rounded-full px-4 py-2.5 text-left text-xs font-semibold transition-all duration-300 md:text-sm ${
                i === active
                  ? 'bg-gold text-forest-deep shadow-lg shadow-gold/20'
                  : 'bg-white/5 text-cream/70 hover:bg-white/10 hover:text-cream'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Telefone central */}
        <Reveal className="order-1 md:order-2" >
          <div
            className="mx-auto w-64 rounded-[2.4rem] border-[5px] border-white/15 bg-cream p-1.5 shadow-2xl shadow-black/40"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="overflow-hidden rounded-[1.9rem] bg-cream">
              <div key={active} className="screen-in">
                <Screen />
              </div>
            </div>
          </div>
          {/* Dots (mobile) */}
          <div className="mt-5 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
            {features.map((f, i) => (
              <span key={f.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-gold' : 'w-1.5 bg-white/25'}`} />
            ))}
          </div>
        </Reveal>

        {/* Descrição do recurso ativo */}
        <div className="order-3 text-center md:text-left">
          <div key={active} className="screen-in">
            <h3 className="font-display text-2xl text-gold-soft">{label}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/75 md:text-base">{desc}</p>
          </div>
        </div>
      </div>

      <div className="mt-14 text-center">
        <CtaButton variant="gold">Quero começar meus 30 dias</CtaButton>
      </div>
    </Section>
  )
}
```

- [ ] **Step 3: Verificação funcional no browser**

Dev server: clicar em cada recurso troca a tela com transição; auto-avanço a cada 5s quando sem interação; hover pausa; em viewport mobile (resize 375px), swipe troca tela e dots refletem a ativa; navegação por Tab alcança os botões.

- [ ] **Step 4: Commit**

```bash
git add landingpage/src/components/PhoneScreens.jsx landingpage/src/sections/AppShowcase.jsx
git commit -m "feat(landing): showcase interativo do app - telefone com 7 telas navegaveis e auto-avanco"
```

---

### Task 9: Imagine + About + Offer + FinalCta + Faq + Footer

**Files:**
- Modify: `landingpage/src/sections/Benefits.jsx` (vira "Imagine daqui a 30 dias")
- Modify: `landingpage/src/sections/About.jsx`
- Modify: `landingpage/src/sections/Offer.jsx`
- Modify: `landingpage/src/sections/FinalCta.jsx`
- Modify: `landingpage/src/sections/Faq.jsx`
- Modify: `landingpage/src/sections/Footer.jsx`

**Interfaces:**
- Consumes: primitivos das Tasks 1–2; fotos `src/assets/foto-wanessa-final.jpg`.

- [ ] **Step 1: Reescrever `Benefits.jsx`**

```jsx
import { Check } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

const imagine = [
  'Acordar se sentindo mais leve e com mais energia.',
  'Vestir aquela roupa que hoje está apertada.',
  'Saber exatamente o que comer e por quê — sem depender de modismos.',
  'Olhar para a balança e perceber que finalmente está no caminho.',
  'Sentir orgulho de ter sustentado uma rotina saudável por 30 dias.',
  'Entender que você não precisa recomeçar do zero nunca mais.',
]

const chips = ['Mais leveza', 'Menos culpa', 'Mais clareza', 'Mais consistência']

export default function Benefits() {
  return (
    <Section className="bg-offwhite">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>A transformação</Eyebrow>
          <Title>Imagine como será daqui a 30 dias.</Title>
        </Reveal>
        <div className="mt-10 space-y-3">
          {imagine.map((item, i) => (
            <Reveal key={item} delay={i * 70} className="flex items-start gap-3 rounded-2xl border border-forest/10 bg-cream/60 p-5">
              <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-sage" strokeWidth={2.2} />
              <p className="text-sm leading-relaxed text-ink/85 md:text-base">{item}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-8 flex flex-wrap justify-center gap-2.5">
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-sage/40 bg-sage/10 px-4 py-2 text-xs font-semibold text-forest md:text-sm">
              {c}
            </span>
          ))}
        </Reveal>
        <Reveal delay={260} className="mt-10 text-center">
          <p className="text-base leading-relaxed text-ink/75">
            Essa transformação começa com pequenas decisões feitas todos os dias.
          </p>
          <p className="mt-1 font-display text-lg italic text-forest">E você não estará sozinha.</p>
        </Reveal>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Reescrever `About.jsx`**

```jsx
import { GraduationCap } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import fotoWanessa from '../assets/foto-wanessa-final.jpg'

const learnings = [
  'Montar refeições equilibradas',
  'Controlar calorias sem sofrimento',
  'Consumir proteínas corretamente',
  'Manter o metabolismo ativo',
  'Lidar com a fome',
  'Evitar o efeito sanfona',
  'Criar hábitos que permanecem',
]

export default function About() {
  return (
    <Section className="bg-cream" wide>
      <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <Reveal className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-3xl border border-gold/30 shadow-xl shadow-forest/10">
            <img src={fotoWanessa} alt="Wanessa Auad" loading="lazy" className="h-auto w-full" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow>Quem guia você</Eyebrow>
            <Title>Criado por Wanessa Auad</Title>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Nutricionista · CRN-1/27939 · 20+ anos de experiência
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-6 space-y-4 text-base leading-relaxed text-ink/80">
            <p>
              Há mais de 20 anos ajudo pessoas a conquistarem saúde, autoestima e qualidade de vida
              através da educação alimentar. Antes de virar método, essa abordagem foi a minha
              própria jornada.
            </p>
            <p>Durante os 30 dias, você aprende comigo a:</p>
          </Reveal>
          <Reveal delay={180} className="mt-4 grid gap-2 sm:grid-cols-2">
            {learnings.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <GraduationCap size={16} aria-hidden="true" className="shrink-0 text-sage" />
                <p className="text-sm text-ink/80">{item}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 3: Reescrever `Offer.jsx`**

Copy oficial: card `MWA | Jornada de 30 Dias` — `R$ 97` — "Pagamento único. Sem mensalidade." Lista de inclusos (adaptar 21→30). Selo de garantia. Continuidade: "No checkout, você pode adicionar o **MWA | Programa de 90 Dias** em condição especial para alunas — e a continuidade também fica disponível dentro do aplicativo."

```jsx
import { Check, ShieldCheck, Sparkles } from 'lucide-react'
import { Section, Eyebrow, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import { BRAND } from '../config.js'

const included = [
  'Acesso completo ao aplicativo durante 30 dias',
  'Acompanhamento diário da alimentação',
  'Controle de água, peso, evolução e metas',
  'Cálculo personalizado de calorias e macronutrientes',
  'Conteúdos, dicas e informativos liberados diariamente',
  'Registro de exercícios com calorias gastas',
  'Jogos, recompensas e personalização do avatar',
  'Acesso imediato após a compra',
]

export default function Offer() {
  return (
    <Section id="oferta" className="bg-offwhite">
      <Reveal className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
        <p className="font-display text-xl italic text-forest md:text-2xl">
          Quanto vale parar de recomeçar toda segunda-feira?
        </p>
        <p className="text-sm text-mist md:text-base">
          Você pode investir centenas de reais em tentativas isoladas — ou começar hoje com um método completo.
        </p>
      </Reveal>

      <Reveal delay={100} className="mx-auto max-w-lg">
        <div className="rounded-[2rem] border border-gold/40 bg-white p-8 text-center shadow-2xl shadow-forest/10 md:p-12">
          <Eyebrow>Comece hoje</Eyebrow>
          <h3 className="font-display text-2xl text-forest-deep md:text-3xl">{BRAND.product}</h3>
          <div className="mt-8">
            <p className="font-display text-6xl text-forest md:text-7xl">{BRAND.price}</p>
            <p className="mt-2 text-sm text-mist">Pagamento único. Sem mensalidade.</p>
          </div>
          <ul className="mt-10 space-y-3 text-left">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" strokeWidth={2.2} />
                <p className="text-sm leading-relaxed text-ink/80">{item}</p>
              </li>
            ))}
          </ul>
          <CtaButton className="mt-10 w-full">Quero começar meus 30 dias</CtaButton>

          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-sage/10 p-4 text-left">
            <ShieldCheck size={24} aria-hidden="true" className="shrink-0 text-sage" />
            <p className="text-xs leading-relaxed text-ink/80 md:text-sm">
              <strong className="text-forest">Garantia incondicional de 7 dias.</strong> Se sentir
              que não é para você, devolvemos 100% do valor. Sem burocracia, sem perguntas.
            </p>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-2xl bg-gold/10 p-4 text-left">
            <Sparkles size={24} aria-hidden="true" className="shrink-0 text-gold" />
            <p className="text-xs leading-relaxed text-ink/80 md:text-sm">
              <strong className="text-forest">Sua evolução pode continuar:</strong> no checkout,
              você pode adicionar o <strong>MWA | Programa de 90 Dias</strong> em condição especial
              para alunas — e a continuidade também fica disponível dentro do aplicativo.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
```

- [ ] **Step 4: Reescrever `FinalCta.jsx`**

```jsx
import { Section, Title, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

export default function FinalCta() {
  return (
    <Section className="bg-forest-deep">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Title light>
          Daqui a 30 dias, você estará 30 dias mais velha.
          <br />
          <em className="italic text-gold-soft">A diferença será a decisão que você toma hoje.</em>
        </Title>
        <p className="mt-6 text-base leading-relaxed text-cream/75">
          Você pode continuar tentando sozinha — ou dar o primeiro passo em uma abordagem criada
          para ensinar você a cuidar da sua saúde de forma inteligente, prática e sustentável.
        </p>
        <div className="mt-10">
          <CtaButton variant="gold">Quero começar agora</CtaButton>
        </div>
      </Reveal>
    </Section>
  )
}
```

- [ ] **Step 5: Reescrever `Faq.jsx`** (accordion `<details>` animado, 8 perguntas)

```jsx
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

const faqs = [
  ['Como acesso o app?', 'Após a compra pela Hotmart, você recebe por email as instruções e seu código de acesso. É só resgatar e criar sua conta.'],
  ['Preciso baixar na loja de aplicativos?', 'Não. O app funciona direto no navegador do celular e pode ser adicionado à tela inicial em um toque, sem ocupar memória.'],
  ['É um PDF ou e-book?', 'Não. O MWA é uma experiência guiada pelo aplicativo, com registros, conteúdos, metas e acompanhamento diário.'],
  ['Por quanto tempo terei acesso?', 'O acesso da Jornada é de 30 dias, começando quando você criar sua conta.'],
  ['Posso continuar depois dos 30 dias?', 'Sim. Você pode adicionar o MWA | Programa de 90 Dias já no checkout, em condição especial para alunas, ou contratar a continuidade dentro do aplicativo.'],
  ['Existe mensalidade?', 'Não. A Jornada de 30 Dias é pagamento único de R$ 97.'],
  ['E se eu não gostar?', 'Você tem 7 dias de garantia incondicional. Basta pedir reembolso e devolvemos 100% do valor, sem perguntas.'],
  ['Posso compartilhar meu acesso?', 'Não. O acesso é individual e pessoal.'],
]

export default function Faq() {
  return (
    <Section className="bg-cream">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>Dúvidas frequentes</Eyebrow>
          <Title>O que você precisa saber</Title>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map(([q, a], i) => (
            <Reveal key={q} delay={i * 50}>
              <details className="group rounded-2xl border border-forest/10 bg-offwhite px-6 py-4 transition-colors open:border-gold/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-forest md:text-base">
                  {q}
                  <span aria-hidden="true" className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 6: Reescrever `Footer.jsx`**

```jsx
import { BRAND } from '../config.js'
import logoMWA from '../assets/logo-mwa.png'

export default function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-offwhite px-6 py-12 text-center">
      <img src={logoMWA} alt="MWA" className="mx-auto h-12 w-auto" loading="lazy" />
      <p className="mt-4 font-display text-lg italic text-forest">{BRAND.tagline}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-mist">{BRAND.concept}</p>
      <p className="mt-6 text-xs text-mist">
        {BRAND.author} — Nutricionista — {BRAND.crn}
      </p>
      <p className="mt-1 text-xs text-mist/70">© {BRAND.year} {BRAND.name}. Todos os direitos reservados.</p>
    </footer>
  )
}
```

- [ ] **Step 7: Build + commit**

Run: `npm run build` → PASS (App.jsx ainda importa seções antigas — só quebrará se algum arquivo deletado; nada foi deletado ainda).

```bash
git add landingpage/src/sections/
git commit -m "feat(landing): imagine 30 dias, autoridade, oferta com upsell 90d, cta final, faq e footer"
```

---

### Task 10: Montagem final — `App.jsx`, remoção das seções antigas, passada completa

**Files:**
- Modify: `landingpage/src/App.jsx`
- Delete: `landingpage/src/sections/AppScreens.jsx`, `landingpage/src/sections/Journey.jsx`, `landingpage/src/sections/Ecosystem.jsx`

**Interfaces:**
- Consumes: todas as seções das Tasks 3–9.

- [ ] **Step 1: Reescrever `App.jsx`**

```jsx
import Header from './components/Header.jsx'
import Hero from './sections/Hero.jsx'
import TrustBar from './sections/TrustBar.jsx'
import Problem from './sections/Problem.jsx'
import Story from './sections/Story.jsx'
import Method from './sections/Method.jsx'
import AppShowcase from './sections/AppShowcase.jsx'
import Benefits from './sections/Benefits.jsx'
import About from './sections/About.jsx'
import Offer from './sections/Offer.jsx'
import FinalCta from './sections/FinalCta.jsx'
import Faq from './sections/Faq.jsx'
import Footer from './sections/Footer.jsx'

export default function App() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustBar />
      <Problem />
      <Story />
      <Method />
      <AppShowcase />
      <Benefits />
      <About />
      <Offer />
      <FinalCta />
      <Faq />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Deletar seções antigas**

```bash
git rm landingpage/src/sections/AppScreens.jsx landingpage/src/sections/Journey.jsx landingpage/src/sections/Ecosystem.jsx
```

- [ ] **Step 3: Varredura "21 dias"**

Run: `grep -rn "21 dias\|21 Dias" landingpage/src landingpage/index.html`
Expected: NENHUM resultado.

- [ ] **Step 4: Verificação completa no browser**

Dev server: página inteira renderiza na ordem correta; header ganha blur ao scrollar; reveals disparam uma vez; showcase interativo ok; todos os CTAs apontam para `CHECKOUT_URL`; visual mobile (375px) sem overflow horizontal; teclado percorre header → CTAs → tabs do showcase → accordion.

- [ ] **Step 5: Commit**

```bash
git add landingpage/src/App.jsx
git commit -m "feat(landing): montagem final do redesign - 12 secoes, remocao das antigas"
```

---

### Task 11: Assets — fotos WebP com srcset + verificação de performance

**Files:**
- Create: `landingpage/scripts/otimizar-imagens.mjs`
- Modify: `landingpage/package.json` (devDependency `sharp` + script)
- Modify: `landingpage/src/sections/Story.jsx`, `landingpage/src/sections/About.jsx` (usar WebP)

- [ ] **Step 1: Instalar sharp e criar o script**

Run: `cd landingpage && npm install --save-dev sharp`

`scripts/otimizar-imagens.mjs`:

```js
import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import path from 'node:path'

const dir = path.resolve('src/assets')
const targets = ['foto-wanessa-story-final.jpg', 'foto-wanessa-final.jpg']
const widths = [480, 800, 1200]

for (const file of targets) {
  const base = path.parse(file).name
  for (const w of widths) {
    await sharp(path.join(dir, file))
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(path.join(dir, `${base}-${w}.webp`))
    console.log(`${base}-${w}.webp ok`)
  }
}
```

Adicionar em `package.json` scripts: `"otimizar-imagens": "node scripts/otimizar-imagens.mjs"`.

Run: `npm run otimizar-imagens` → gera 6 arquivos `.webp` em `src/assets/`.

- [ ] **Step 2: Trocar `<img>` das fotos por WebP com srcset**

Em `Story.jsx`:

```jsx
import fotoStory480 from '../assets/foto-wanessa-story-final-480.webp'
import fotoStory800 from '../assets/foto-wanessa-story-final-800.webp'
import fotoStory1200 from '../assets/foto-wanessa-story-final-1200.webp'
```

```jsx
<img
  src={fotoStory800}
  srcSet={`${fotoStory480} 480w, ${fotoStory800} 800w, ${fotoStory1200} 1200w`}
  sizes="(min-width: 768px) 45vw, 90vw"
  alt="Wanessa Auad, nutricionista e criadora do MWA"
  loading="lazy"
  className="h-auto w-full"
/>
```

Mesmo padrão em `About.jsx` com `foto-wanessa-final-*.webp` e `sizes="(min-width: 768px) 35vw, 90vw"`.

- [ ] **Step 3: Build + Lighthouse**

Run: `npm run build && npm run preview` e rodar `npx lighthouse http://localhost:4173 --preset=perf --form-factor=mobile --screenEmulation.mobile --quiet --chrome-flags="--headless"` (ou auditoria manual no browser preview).
Expected: Performance ≥ 90, Accessibility ≥ 90. Se abaixo, investigar (fontes, imagens, JS) antes de seguir.

- [ ] **Step 4: Commit**

```bash
git add landingpage/scripts/ landingpage/package.json landingpage/package-lock.json landingpage/src/assets/*.webp landingpage/src/sections/Story.jsx landingpage/src/sections/About.jsx
git commit -m "perf(landing): fotos em webp com srcset + script de otimizacao"
```

---

### Task 12: Unificar `/vendas` do app com a nova mensagem

**Files:**
- Modify: `src/components/vendas/LandingVendas.jsx` (projeto raiz)

**Interfaces:**
- Consumes: tokens do app em `src/index.css` (`verde`, `verde-escuro`, `sage`, `sage-claro`, `ouro`, `ouro-claro`, `creme`, `cinza`; fontes Poppins/Lora — o app NÃO troca de fonte).

Regras da reescrita (a estrutura de seções segue a landing nova; os mockups de telefone existentes são mantidos, só com textos ajustados):

- [ ] **Step 1: Aplicar a nova copy em `LandingVendas.jsx`**

Mudanças obrigatórias, seção por seção:
1. Header: manter; CTA "Começar agora".
2. Hero: headline vira **"Não é uma dieta. É uma nova forma de viver."**; sub com a promessa dos 30 dias (mesma copy do Hero da landing, Task 4); selo com "Desenvolvido por Wanessa Auad — Nutricionista · CRN-1/27939 · 20+ anos de experiência". Gatilhos: substituir o item "20+ anos..." por "Nutricionista · CRN-1/27939" no segundo item (CRN precisa aparecer).
3. Seção problema: copy da Task 5 ("Pare de recomeçar toda segunda-feira.").
4. NOVA seção história (antes das objeções): texto da Task 6 (26 kg / 14 anos / frase "O maior resultado não foi perder 26 kg. Foi aprender a permanecer."), sem CountUp (app não tem os primitivos — usar texto estático).
5. Telas do app: trocar "Dia 7 de 21" → "Dia 7 de 30", "Dia 4 de 21" → "Dia 4 de 30"; descrição das dicas "durante os 21 dias" → "durante os 30 dias".
6. "Imagine daqui a 21 dias..." → "Imagine como será daqui a 30 dias."
7. Autoridade Wanessa: adicionar linha "Nutricionista · CRN-1/27939" sob o nome.
8. Oferta: "MWA | Jornada de 30 Dias" — R$ 97; incluso "App completo com acompanhamento diário por 30 dias"; bônus 90 dias com a linguagem da Task 9 Step 3 (checkout + app). Botão permanece `disabled` até o lançamento (estado atual preservado).
9. Decisão final: "Daqui a 30 dias você estará exatamente 30 dias mais velha."
10. FAQ: respostas das 8 perguntas da Task 9 Step 5 (adaptar as 4 existentes + adicionar "Por quanto tempo terei acesso?" e "Posso continuar depois dos 30 dias?").
11. Footer: acrescentar "Wanessa Auad — Nutricionista — CRN-1/27939".

- [ ] **Step 2: Varredura "21" no arquivo**

Run: `grep -n "21" src/components/vendas/LandingVendas.jsx`
Expected: nenhuma ocorrência de "21 dias"/"de 21".

- [ ] **Step 3: Verificação no browser**

Dev server do app raiz (porta do Vite raiz), rota `/vendas`: página renderiza com a nova copy, mockups intactos, sem regressão visual.

- [ ] **Step 4: Commit**

```bash
git add src/components/vendas/LandingVendas.jsx
git commit -m "feat(vendas): alinha /vendas a nova mensagem - Jornada de 30 Dias, CRN, historia da Wanessa"
```

---

### Task 13: Documentação — mapa de mudanças do app (21→30) e nota Hotmart

**Files:**
- Create: `docs/MUDANCAS-APP-30-DIAS.md`
- Modify: `ARQUITETURA-HOTMART-MWA.md` (adicionar nota sobre upsell no checkout)

- [ ] **Step 1: Criar `docs/MUDANCAS-APP-30-DIAS.md`**

Documento listando tudo que o app precisará mudar quando a Jornada passar a 30 dias (fora do escopo desta entrega): duração da jornada e textos diários (dias 1–30), janela da oferta de 90 dias (hoje dia 3–7), tela de conclusão (hoje dia 21), bloqueio de acesso (hoje dia 111 — recalcular para 30+90), conteúdos `src/data/dicas.js`/`dicas90.js`/`informativos.js`, e copy do produto na Hotmart. Investigar com `grep -rn "21" src/` os pontos exatos ao executar.

- [ ] **Step 2: Nota no `ARQUITETURA-HOTMART-MWA.md`**

Adicionar seção curta: o funil Hotmart passa a ter upsell/order bump do "MWA | Programa de 90 Dias" no checkout da Jornada de 30 Dias (condição especial para alunas), além do upgrade in-app já documentado. Configuração feita no painel Hotmart.

- [ ] **Step 3: Commit**

```bash
git add docs/MUDANCAS-APP-30-DIAS.md ARQUITETURA-HOTMART-MWA.md
git commit -m "docs: mapa de mudancas do app para 30 dias e nota do upsell 90d no checkout Hotmart"
```

---

## Verificação final (após todas as tasks)

1. `cd landingpage && npm run build` → PASS.
2. Dev server: passada visual completa desktop (1280px) e mobile (375px), dark mode não se aplica (página tem tema próprio).
3. `grep -rn "21 dias\|21 Dias" landingpage/src src/components/vendas/` → vazio.
4. CRN aparece em: hero (selo), TrustBar, About e Footer da landing; hero, autoridade e footer da `/vendas`.
5. Lighthouse mobile ≥ 90 em Performance e Accessibility.
6. Nenhuma linguagem de urgência/promoção apelativa em página alguma.
