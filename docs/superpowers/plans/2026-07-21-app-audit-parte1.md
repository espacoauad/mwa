# Auditoria do App MWA (Parte 1) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring every screen in `src/components/` up to the same accessibility/motion/writing bar the landing page already meets (ref. commit `5ca2f3f`), and break up the ~998KB main JS chunk via route-level code-splitting.

**Architecture:** This is an audit-and-fix task, not new feature work — there is no TDD cycle because the "test" is the audit itself (Web Interface Guidelines, 3-lens motion audit, PT-BR writing guidelines) run against real rendered UI in the browser, not a unit test. Each task audits one screen group, fixes critical/important findings inline, and verifies visually in the dev server. The final task applies `React.lazy` + `Suspense` for code-splitting.

**Tech Stack:** React 18, Vite 6, Tailwind v4. No component test framework installed (only `node --test` for plain JS). Verification is manual-in-browser via the Browser pane tools, not automated tests.

## Global Constraints

- Do not introduce new npm dependencies.
- Do not change business logic (pesagem cadence, day-count math, payment flow) — this is a UI/content/perf pass only.
- Fix critical and important findings inline; list (don't necessarily fix) minor/cosmetic findings.
- Respect `prefers-reduced-motion` for any motion touched.
- Keep PT-BR as primary copy language; `ingles` toggle strings (where present, e.g. `ModalPesagem.jsx`) must stay in sync for both languages.
- **Do not commit any task without telling the user first and getting a go-ahead**, per explicit instruction from the spec.

---

### Task 1: Audit `hoje/` (today screen — the app's most-visited surface)

**Files:**
- Audit: `src/components/hoje/Hoje.jsx`, `src/components/hoje/AnelHidratacao.jsx`, `src/components/hoje/AnelMeta.jsx`, `src/components/hoje/GraficoMacros.jsx`, `src/components/hoje/SeuProgresso.jsx`
- Modify: whichever of the above have critical/important findings
- Skip: `AnelHidratacao.demo.jsx` (dev-only demo harness, not shipped UI)

- [ ] **Step 1: Run the accessibility audit**

Invoke `Skill web-design-guidelines` scoped to the files above. Capture findings (contrast, focus states, aria-labels on icon-only buttons, touch target size ≥44px, semantic headings).

- [ ] **Step 2: Run the motion audit**

Invoke `Skill design-motion-principles` in audit mode scoped to the same files. Capture findings on the 3 lenses: `prefers-reduced-motion` handling, purposeful vs. decorative animation, timing/easing consistency with the landing page's established motion language.

- [ ] **Step 3: Run the writing audit**

Invoke `Skill writing-guidelines` scoped to the same files (labels, empty states, error copy, tooltips). Capture clarity/tone/consistency findings in PT-BR.

- [ ] **Step 4: Fix critical and important findings inline**

Edit the flagged files directly. For each fix, keep the change scoped to what the finding requires — no unrelated refactors.

- [ ] **Step 5: Verify in the browser**

Start the dev server (`preview_start` with the project's dev config), navigate to the Hoje screen, and confirm: keyboard focus is visible and reaches all interactive elements, `prefers-reduced-motion: reduce` (via `resize_window` colorScheme or OS emulation) suppresses non-essential animation, and copy reads correctly in both PT-BR and the `ingles` toggle if present.

- [ ] **Step 6: Report findings and pause for commit approval**

Summarize what was found and fixed for `hoje/`. Do not commit yet — batch with remaining tasks or ask the user per their stated preference.

---

### Task 2: Audit `perfil/`

**Files:**
- Audit: `src/components/perfil/Perfil.jsx`, `src/components/perfil/DireitosLgpd.jsx`
- Modify: whichever have critical/important findings

- [ ] **Step 1: Run accessibility, motion, and writing audits** (same three skills as Task 1, scoped to these files)
- [ ] **Step 2: Fix critical/important findings inline**
- [ ] **Step 3: Verify in browser** — pay particular attention to the LGPD rights screen (`DireitosLgpd.jsx`), since it's a compliance-sensitive legal-copy surface: verify no wording changes alter its legal meaning, only clarity/accessibility.
- [ ] **Step 4: Report findings, pause for commit approval**

---

### Task 3: Audit `progresso/`

**Files:**
- Audit: `src/components/progresso/Progresso.jsx`, `src/components/progresso/GraficoPeso.jsx`, `src/components/progresso/LembretePesagem.jsx`, `src/components/progresso/ModalPesagem.jsx`
- Modify: whichever have critical/important findings

- [ ] **Step 1: Run accessibility, motion, and writing audits**
- [ ] **Step 2: Fix critical/important findings inline** — note `ModalPesagem.jsx` has photo-upload inputs (`<input type="file">` hidden behind `<label>`); verify these remain keyboard-reachable and screen-reader-labeled after any fix.
- [ ] **Step 3: Verify in browser** — open the weigh-in modal, tab through all fields (peso, 4 photo slots, 3 measurement fields, save button), confirm focus order and visible focus rings.
- [ ] **Step 4: Report findings, pause for commit approval**

---

### Task 4: Audit `alimentacao/` and `dicas/`

**Files:**
- Audit: `src/components/alimentacao/Alimentacao.jsx`, `src/components/alimentacao/ModalRefeicao.jsx`, `src/components/dicas/Dicas.jsx`, `src/components/dicas/LancheProteico.jsx`, `src/components/dicas/PreviewLanches.jsx`
- Modify: whichever have critical/important findings

- [ ] **Step 1: Run accessibility, motion, and writing audits**
- [ ] **Step 2: Fix critical/important findings inline**
- [ ] **Step 3: Verify in browser** — log a meal via `ModalRefeicao.jsx`, browse a snack tip, confirm no regressions in the flow.
- [ ] **Step 4: Report findings, pause for commit approval**

---

### Task 5: Audit `ferramentas/`

**Files:**
- Audit: `src/components/ferramentas/Ferramentas.jsx`, `src/components/ferramentas/LenteConsciencia.jsx`, `src/components/ferramentas/ReforcandoConceitos.jsx`, `src/components/ferramentas/VersiculoDoDia.jsx`, `src/components/ferramentas/VersiculoDoDiaModal.jsx`
- Modify: whichever have critical/important findings

- [ ] **Step 1: Run accessibility, motion, and writing audits**
- [ ] **Step 2: Fix critical/important findings inline**
- [ ] **Step 3: Verify in browser** — open each tool modal, confirm dismissible via keyboard (Escape) and click-outside, confirm verse-of-the-day copy reads naturally.
- [ ] **Step 4: Report findings, pause for commit approval**

---

### Task 6: Audit `onboarding/`

**Files:**
- Audit: `src/components/onboarding/OnboardingFlow.jsx`, `TelaBiometria.jsx`, `TelaConsentimento.jsx`, `TelaContato.jsx`, `TelaCorporais.jsx`, `TelaMetas.jsx`
- Modify: whichever have critical/important findings

- [ ] **Step 1: Run accessibility, motion, and writing audits** — this is the first-run experience; prioritize form-field labeling, error states, and step-progress indication (screen-reader announceable step count).
- [ ] **Step 2: Fix critical/important findings inline**
- [ ] **Step 3: Verify in browser** — walk through the full onboarding flow from a fresh account state, confirm each step is keyboard-navigable and validation errors are announced (not color-only).
- [ ] **Step 4: Report findings, pause for commit approval**

---

### Task 7: Audit `game/` (gamification screens)

**Files:**
- Audit: `src/components/game/Avatar.jsx`, `CertificadoConclusao.jsx`, `Conclusao30Dias.jsx`, `Conclusao90Dias.jsx`, `ConclusaoDia.jsx`, `JogoColheita.jsx`, `JogoEscolhas.jsx`, `JogoMente.jsx`, `JogoPlantio.jsx`, `JogoPoda.jsx`, `JogoRestaurante.jsx`, `JogoTreino.jsx`, `LojaAvatar.jsx`
- Modify: whichever have critical/important findings

- [ ] **Step 1: Run accessibility, motion, and writing audits** — these are the heaviest-animation screens in the app; the motion audit's `prefers-reduced-motion` lens matters most here (confetti, drag/drop in `JogoPoda`/`JogoColheita`, timed game loops).
- [ ] **Step 2: Fix critical/important findings inline** — for any game with a timer or fast-paced interaction, confirm there's a non-time-pressured way to complete it or that the time limit is generous enough not to be an accessibility barrier.
- [ ] **Step 3: Verify in browser** — play through each game once, confirm confetti/celebratory animation respects reduced-motion, confirm the seed-reward feedback (`RECOMPENSAS` in `src/data/skins.js`) is announced to screen readers, not just visual.
- [ ] **Step 4: Report findings, pause for commit approval**

---

### Task 8: Code-split heavy routes via `React.lazy` + `Suspense`

**Files:**
- Modify: `src/App.jsx` (imports for `game/` screens and `OnboardingFlow.jsx`)
- Test: manual — `npm run build` output chunk sizes

**Interfaces:**
- Produces: lazy-loaded chunks for the gamification screens and onboarding flow, each wrapped in a shared `<Suspense>` fallback already used elsewhere in the app (check `src/components/ui/` for an existing loading/spinner component before creating a new one).

- [ ] **Step 1: Identify the existing loading UI convention**

Grep `src/components/ui/` for any existing spinner/skeleton component. If one exists, reuse it as the `Suspense` fallback. If none exists, use a minimal centered spinner consistent with the app's Tailwind theme (`verde`/`creme` palette) — no new dependency.

- [ ] **Step 2: Convert heavy imports in `App.jsx` to `React.lazy`**

```jsx
// Before (top of App.jsx):
import OnboardingFlow from './components/onboarding/OnboardingFlow.jsx'
// ...and each game/conclusion screen import

// After:
import { lazy, Suspense } from 'react'
const OnboardingFlow = lazy(() => import('./components/onboarding/OnboardingFlow.jsx'))
// repeat for each game/conclusion screen imported in App.jsx
```

Wrap each lazy-loaded render site in `<Suspense fallback={<CarregandoFallback />}>...</Suspense>` (using whichever fallback component Step 1 identified/created).

- [ ] **Step 3: Run the build and confirm chunk size drops**

Run: `npm run build`
Expected: the main chunk size warning (currently ~998KB) either disappears or the reported main chunk shrinks significantly, with new separate chunks for the lazy-loaded screens.

- [ ] **Step 4: Verify in browser that lazy routes still work**

Start the dev server, navigate through onboarding and open at least 2 game screens, confirm they render (briefly showing the `Suspense` fallback on slow network throttling) with no console errors.

- [ ] **Step 5: Report findings, pause for commit approval**

---

## Completion

After all 8 tasks are done and approved, ask the user how they want the changes committed (one commit per task vs. one batched commit) — do not assume, since the spec explicitly requires sign-off before any commit in this part.
