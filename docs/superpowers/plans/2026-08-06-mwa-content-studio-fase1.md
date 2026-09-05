# MWA Content Studio — Fase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working, testable web app (`content-studio/`) that lets Wanessa create, edit, review, and organize MWA content through a form-driven "prompt builder" flow (no live AI API), backed entirely by browser localStorage, with a real brand guide and 20 real starter templates.

**Architecture:** React 18 + Vite SPA, `react-router-dom` for navigation, Tailwind CSS v4 for styling (matches `landingpage/`), no backend. All persistence goes through a small namespaced localStorage layer (`lib/storage.js`). Pure logic (storage, prompt builder, content review, export/backup) is unit-tested with Vitest; screens are verified manually in the browser per task.

**Tech Stack:** React 18, Vite 6, `@vitejs/plugin-react`, `@tailwindcss/vite` + Tailwind v4, `react-router-dom` v6, `lucide-react` (icons), Vitest + `@testing-library/jsdom` environment for logic tests. No other runtime dependencies — PDF export uses the browser's native print dialog, no PDF library.

## Global Constraints

- Namespace every localStorage key under `mwa-content-studio:` (spec §5) — never write bare keys.
- Brand rules from the spec apply to all seed content: never use "projeto verão", "corpo perfeito", "transformação garantida", or "Não é uma dieta. É uma nova forma de viver." Never invent statistics, studies, or guaranteed results.
- No content is ever auto-approved. `status` only becomes `'aprovado'` via an explicit user click (spec §6.4).
- No AI API calls anywhere in Fase 1. "Modo sem API" only assembles prompt text for the user to copy elsewhere (spec §6.3).
- Demo content must be flagged `isDemo: true` and only removable via the explicit "apagar dados de demonstração" action, which must never remove templates or real content (spec §7).
- Brand colors (from `landingpage/src/index.css`, reused verbatim for visual consistency): `--color-forest:#08402f`, `--color-forest-deep:#052a1f`, `--color-sage:#879b55`, `--color-gold:#c59f4f`, `--color-gold-soft:#d9c18d`, `--color-cream:#f5f1e8`, `--color-offwhite:#faf7f0`, `--color-sand:#e8e4dc`, `--color-mist:#6f7a66`.
- All screens must be usable at mobile width (per spec's responsiveness requirement) — buttons min-height 44px.

---

### Task 1: Project scaffold

**Files:**
- Create: `content-studio/package.json`
- Create: `content-studio/vite.config.js`
- Create: `content-studio/index.html`
- Create: `content-studio/netlify.toml`
- Create: `content-studio/.gitignore`
- Create: `content-studio/src/main.jsx`
- Create: `content-studio/src/App.jsx`
- Create: `content-studio/src/index.css`

**Interfaces:**
- Produces: a running Vite dev server at `content-studio/`, `npm run dev` / `npm run build` scripts, `npm test` script (wired in Task 3).

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "mwa-content-studio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "lucide-react": "^1.23.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.4",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "tailwindcss": "^4.1.4",
    "vite": "^6.3.5",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

- [ ] **Step 3: Create `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MWA Content Studio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 5: Create `.gitignore`**

```
node_modules
dist
.vite
```

- [ ] **Step 6: Create `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-forest: #08402f;
  --color-forest-deep: #052a1f;
  --color-sage: #879b55;
  --color-gold: #c59f4f;
  --color-gold-soft: #d9c18d;
  --color-cream: #f5f1e8;
  --color-offwhite: #faf7f0;
  --color-sand: #e8e4dc;
  --color-mist: #6f7a66;
}

body {
  background-color: var(--color-offwhite);
  color: var(--color-forest-deep);
  font-family: Georgia, 'Times New Roman', serif;
}

.font-ui {
  font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
}
```

- [ ] **Step 7: Create `src/App.jsx` (placeholder, wired fully in Task 11)**

```jsx
export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center font-ui">
      <p>MWA Content Studio — em construção.</p>
    </div>
  )
}
```

- [ ] **Step 8: Create `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 9: Install and verify dev server**

Run: `cd content-studio && npm install && npm run dev`
Expected: Vite prints a local URL; open it in the browser preview and confirm "MWA Content Studio — em construção." renders on a cream background.

- [ ] **Step 10: Commit**

```bash
git add content-studio/package.json content-studio/vite.config.js content-studio/index.html content-studio/netlify.toml content-studio/.gitignore content-studio/src/main.jsx content-studio/src/App.jsx content-studio/src/index.css content-studio/package-lock.json
git commit -m "chore: scaffold MWA Content Studio project"
```

---

### Task 2: Storage layer

**Files:**
- Create: `content-studio/src/lib/storage.js`
- Test: `content-studio/src/lib/storage.test.js`

**Interfaces:**
- Produces: `readCollection(name, fallback)`, `writeCollection(name, value)`, `readItem(name, fallback)`, `writeItem(name, value)`, `allKeys()`, `NAMESPACE` constant. Every later data hook imports from this module — no direct `localStorage.*` calls anywhere else in the app.

- [ ] **Step 1: Write the failing test**

```js
// content-studio/src/lib/storage.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { readCollection, writeCollection, readItem, writeItem, allKeys, NAMESPACE } from './storage'

beforeEach(() => localStorage.clear())

describe('storage', () => {
  it('returns fallback when a collection does not exist yet', () => {
    expect(readCollection('contentItems', [])).toEqual([])
  })

  it('round-trips a collection', () => {
    writeCollection('contentItems', [{ id: '1' }])
    expect(readCollection('contentItems', [])).toEqual([{ id: '1' }])
  })

  it('round-trips a single item', () => {
    writeItem('brandGuide', { nome: 'MWA' })
    expect(readItem('brandGuide', null)).toEqual({ nome: 'MWA' })
  })

  it('namespaces every key it writes', () => {
    writeItem('settings', { schemaVersion: 1 })
    expect(localStorage.getItem(`${NAMESPACE}:settings`)).not.toBeNull()
  })

  it('lists only namespaced keys', () => {
    localStorage.setItem('outroApp:qualquerCoisa', '1')
    writeItem('settings', { schemaVersion: 1 })
    expect(allKeys()).toEqual([`${NAMESPACE}:settings`])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/lib/storage.test.js`
Expected: FAIL — `storage.js` does not exist yet.

- [ ] **Step 3: Write implementation**

```js
// content-studio/src/lib/storage.js
export const NAMESPACE = 'mwa-content-studio'

function fullKey(name) {
  return `${NAMESPACE}:${name}`
}

export function readCollection(name, fallback = []) {
  return readItem(name, fallback)
}

export function writeCollection(name, value) {
  writeItem(name, value)
}

export function readItem(name, fallback = null) {
  try {
    const raw = localStorage.getItem(fullKey(name))
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeItem(name, value) {
  localStorage.setItem(fullKey(name), JSON.stringify(value))
}

export function allKeys() {
  return Object.keys(localStorage).filter((key) => key.startsWith(`${NAMESPACE}:`))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/lib/storage.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add content-studio/src/lib/storage.js content-studio/src/lib/storage.test.js
git commit -m "feat: add namespaced localStorage layer"
```

---

### Task 3: Dropdown options + brand guide seed + useBrandGuide hook

**Files:**
- Create: `content-studio/src/data/options.js`
- Create: `content-studio/src/data/brandGuideSeed.js`
- Create: `content-studio/src/hooks/useBrandGuide.js`
- Test: `content-studio/src/hooks/useBrandGuide.test.js`

**Interfaces:**
- Consumes: `readItem`, `writeItem` from `../lib/storage` (Task 2).
- Produces: `FINALIDADES`, `FORMATOS`, `TEMAS`, `PROFUNDIDADES`, `TONS`, `TAMANHOS`, `STATUS_CONTEUDO`, `STATUS_LABELS` (options.js); `brandGuideSeed` object shaped `{ nome, nomeCompleto, assinatura, slogan, posicionamento, publico, tomDeVoz: string[], palavrasRecomendadas: string[], palavrasProibidas: string[], regrasSaude, diretrizesVisuais, exemplosAprovados: string[] }`; `useBrandGuide()` hook returning `{ guia, salvar(alteracoes) }`.

- [ ] **Step 1: Create `src/data/options.js`**

```js
export const FINALIDADES = ['Conteúdo interno do MWA', 'Instagram', 'WhatsApp', 'E-mail', 'Material de lançamento', 'Material para usuários piloto', 'Outro']

export const FORMATOS = ['Lição', 'Dica diária', 'Desafio', 'Reflexão', 'Notificação', 'Roteiro de vídeo', 'Roteiro de aula', 'Post', 'Legenda', 'Reels', 'Carrossel', 'Stories', 'Enquete', 'Caixa de perguntas', 'Mensagem', 'E-mail', 'Prompt para imagem']

export const TEMAS = ['Alimentação consciente', 'Proteínas', 'Carboidratos', 'Gorduras', 'Fibras', 'Hidratação', 'Sono', 'Movimento', 'Exercícios', 'Planejamento', 'Organização da rotina', 'Consistência', 'Autoconhecimento', 'Comportamento alimentar', 'Leitura de rótulos', 'Fome e saciedade', 'Metas', 'Progresso', 'Motivação', 'Fé e propósito', 'Tema personalizado']

export const PROFUNDIDADES = ['Rápido', 'Intermediário', 'Completo']

export const TONS = ['Educativo', 'Acolhedor', 'Inspirador', 'Prático', 'Comercial', 'Institucional', 'Com fé']

export const TAMANHOS = ['Curto', 'Médio', 'Longo']

export const STATUS_CONTEUDO = ['ideia', 'rascunho', 'em_revisao', 'aprovado', 'arquivado', 'programado']

export const STATUS_LABELS = {
  ideia: 'Ideia',
  rascunho: 'Rascunho',
  em_revisao: 'Em revisão',
  aprovado: 'Aprovado',
  arquivado: 'Arquivado',
  programado: 'Programado',
}
```

- [ ] **Step 2: Create `src/data/brandGuideSeed.js`**

```js
export const brandGuideSeed = {
  nome: 'MWA',
  nomeCompleto: 'My Wellness App',
  assinatura: 'Aprenda. Pratique. Evolua.',
  slogan: 'Conhecimento para escolher. Constância para evoluir.',
  posicionamento:
    'O MWA é um programa digital de educação em bem-estar e mudança de hábitos, com duração de 90 dias. Ensina de forma prática e acessível alimentação consciente, macronutrientes, organização da rotina, construção de hábitos, movimento, hidratação, sono, consistência, autoconhecimento, planejamento e acompanhamento do progresso — sempre com escolhas possíveis para a vida real. O MWA não é uma dieta restritiva, não promete emagrecimento rápido, não é tratamento médico e não é solução milagrosa.',
  publico:
    'Mulheres que querem melhorar hábitos, aprender sobre alimentação e construir uma rotina mais saudável de forma possível e duradoura — incluindo quem está começando agora, quem já tentou várias vezes, público cristão, participantes dos 90 dias, usuários piloto, ex-participantes e pessoas conhecendo o programa pela primeira vez.',
  tomDeVoz: [
    'Acolhedor', 'Elegante', 'Feminino sem ser infantil', 'Confiável', 'Humano', 'Motivador',
    'Educativo', 'Claro', 'Moderno', 'Inteligente', 'Prático', 'Inspirador sem frases vazias',
    'Adequado à vida real', 'Sem julgamento, culpa ou cobrança excessiva',
  ],
  palavrasRecomendadas: ['constância', 'progresso possível', 'escolha consciente', 'hábito', 'jornada', 'cuidado', 'ritmo', 'evolução', 'prática', 'equilíbrio'],
  palavrasProibidas: [
    'projeto verão', 'corpo perfeito', 'transformação garantida',
    'não é uma dieta. é uma nova forma de viver', 'dieta milagrosa', 'emagreça rápido',
    'perca peso em dias', 'garantido', 'sem esforço',
  ],
  regrasSaude:
    'Quando o conteúdo tocar em alimentação, nutrição ou peso corporal, nunca apresente números, benefícios ou promessas como fato definitivo — trate como orientação educativa geral, sem substituir avaliação profissional individual. Nunca invente estatísticas, estudos ou referências científicas.',
  diretrizesVisuais:
    'Paleta: verde floresta (#08402f), dourado (#c59f4f), bege claro e branco. Sem rosa infantil, sem excesso de ornamentos. Tipografia elegante em títulos, alta legibilidade em corpo de texto e botões.',
  exemplosAprovados: [
    'Hoje o convite é simples: beba um copo de água antes do café da manhã. Pequenos gestos, repetidos com constância, é o que muda a rotina de verdade.',
    'Você não precisa acertar todos os dias. Precisa continuar aparecendo. Isso já é progresso.',
    'Ler o rótulo antes de decidir não é radicalismo — é informação a seu favor.',
  ],
}
```

- [ ] **Step 3: Write the failing test for the hook**

```js
// content-studio/src/hooks/useBrandGuide.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBrandGuide } from './useBrandGuide'
import { readItem } from '../lib/storage'
import { brandGuideSeed } from '../data/brandGuideSeed'

beforeEach(() => localStorage.clear())

describe('useBrandGuide', () => {
  it('falls back to the seed when nothing is stored', () => {
    const { result } = renderHook(() => useBrandGuide())
    expect(result.current.guia.nome).toBe('MWA')
  })

  it('persists edits to storage', () => {
    const { result } = renderHook(() => useBrandGuide())
    act(() => result.current.salvar({ slogan: 'Novo slogan' }))
    expect(result.current.guia.slogan).toBe('Novo slogan')
    expect(readItem('brandGuide', null).slogan).toBe('Novo slogan')
  })

  it('keeps unrelated fields when saving a partial edit', () => {
    const { result } = renderHook(() => useBrandGuide())
    act(() => result.current.salvar({ slogan: 'Novo slogan' }))
    expect(result.current.guia.nomeCompleto).toBe(brandGuideSeed.nomeCompleto)
  })
})
```

- [ ] **Step 4: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/hooks/useBrandGuide.test.js`
Expected: FAIL — `useBrandGuide.js` does not exist yet.

- [ ] **Step 5: Create `src/hooks/useBrandGuide.js`**

```jsx
import { useCallback, useState } from 'react'
import { readItem, writeItem } from '../lib/storage'
import { brandGuideSeed } from '../data/brandGuideSeed'

export function useBrandGuide() {
  const [guia, setGuia] = useState(() => readItem('brandGuide', brandGuideSeed))

  const salvar = useCallback((alteracoes) => {
    setGuia((atual) => {
      const proximo = { ...atual, ...alteracoes }
      writeItem('brandGuide', proximo)
      return proximo
    })
  }, [])

  return { guia, salvar }
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/hooks/useBrandGuide.test.js`
Expected: PASS (3 tests)

- [ ] **Step 7: Commit**

```bash
git add content-studio/src/data/options.js content-studio/src/data/brandGuideSeed.js content-studio/src/hooks/useBrandGuide.js content-studio/src/hooks/useBrandGuide.test.js
git commit -m "feat: add dropdown options, brand guide seed, useBrandGuide hook"
```

---

### Task 4: Templates seed + useTemplates hook

**Files:**
- Create: `content-studio/src/data/templatesSeed.js`
- Create: `content-studio/src/hooks/useTemplates.js`
- Test: `content-studio/src/hooks/useTemplates.test.js`

**Interfaces:**
- Consumes: `readCollection`, `writeCollection` from `../lib/storage` (Task 2).
- Produces: `templatesSeed` array of 20 objects shaped `{ id, nome, formato, categoria, conteudoModelo, origem: 'sistema' }`; `useTemplates()` hook returning `{ templates, criar(dados), atualizar(id, alteracoes), remover(id), duplicar(id), obter(id) }`.

- [ ] **Step 1: Create `src/data/templatesSeed.js`**

```js
function modelo(id, nome, formato, categoria, conteudoModelo) {
  return { id, nome, formato, categoria, conteudoModelo, origem: 'sistema' }
}

export const templatesSeed = [
  modelo('tpl-educativo-diario', 'Conteúdo educativo diário', 'Lição', 'Interno 90 dias',
    '📚 Hoje vamos falar sobre [TEMA].\n\nMuita gente pensa que [mito comum sobre o tema]. Mas a verdade é mais simples do que parece: [explicação breve e prática].\n\nNa prática, você pode começar hoje mesmo: [ação pequena e possível].\n\nLembre-se: constância vale mais que perfeição.'),
  modelo('tpl-licao-90-dias', 'Lição dos 90 dias', 'Lição', 'Interno 90 dias',
    '🌿 Dia [X] — [Título da lição]\n\nO que você vai aprender hoje: [objetivo da lição em uma frase].\n\n[Explicação principal, em linguagem simples, com um exemplo da vida real].\n\nPara praticar: [tarefa prática do dia].\n\nUma pergunta para refletir: [pergunta de autoconhecimento].'),
  modelo('tpl-dica-rapida', 'Dica rápida', 'Dica diária', 'Interno 90 dias',
    '💡 Dica do dia: [dica objetiva em uma frase].\n\nPor quê: [uma frase explicando o benefício, sem prometer resultado numérico].'),
  modelo('tpl-desafio-do-dia', 'Desafio do dia', 'Desafio', 'Interno 90 dias',
    '🎯 Desafio de hoje: [ação clara e possível de cumprir em um dia].\n\nNão precisa ser perfeito — precisa ser feito. Quando terminar, marque como concluído e sinta o progresso.'),
  modelo('tpl-reflexao-encerramento', 'Reflexão de encerramento', 'Reflexão', 'Interno 90 dias',
    '🕯️ Fechando o dia...\n\nHoje você [reconhecimento do esforço/ação do dia]. Isso conta — mesmo nos dias em que pareceu pouco.\n\nAntes de dormir, pergunte-se: o que funcionou bem hoje? O que posso ajustar amanhã, com leveza?'),
  modelo('tpl-notificacao-manha', 'Notificação da manhã', 'Notificação', 'Interno 90 dias',
    '☀️ Bom dia! Hoje é um novo dia para praticar o que você já aprendeu. Um passo de cada vez.'),
  modelo('tpl-notificacao-noite', 'Notificação da noite', 'Notificação', 'Interno 90 dias',
    '🌙 Antes de encerrar o dia: como foi sua constância hoje? Registre e descanse — amanhã seguimos juntas.'),
  modelo('tpl-carrossel-educativo', 'Carrossel educativo', 'Carrossel', 'Instagram',
    'Slide 1 (capa): [Título chamativo sobre o tema]\nSlide 2: O que é [tema], em 1 frase simples\nSlide 3: Mito comum sobre o tema\nSlide 4: A verdade, explicada de forma prática\nSlide 5: Como aplicar isso hoje (passo a passo)\nSlide 6: Resumo + chamada para ação (ex.: salvar o post, comentar sua experiência)'),
  modelo('tpl-sequencia-stories', 'Sequência de cinco Stories', 'Stories', 'Instagram',
    'Story 1: Pergunta ou provocação sobre o tema (use enquete/caixa de pergunta)\nStory 2: Explicação rápida do tema\nStory 3: Erro comum que as pessoas cometem\nStory 4: Dica prática de aplicação imediata\nStory 5: Chamada para ação (arraste para cima / comente / compartilhe)'),
  modelo('tpl-roteiro-reels', 'Roteiro de Reels', 'Reels', 'Instagram',
    'Gancho (0-3s): [frase de impacto ou pergunta que prende atenção]\nDesenvolvimento (3-20s): [explicação rápida do tema, 2-3 pontos]\nAplicação prática (20-40s): [como fazer isso hoje]\nFechamento (40-50s): [chamada para ação + assinatura MWA]'),
  modelo('tpl-legenda-instagram', 'Legenda para Instagram', 'Legenda', 'Instagram',
    '[Frase de abertura que conecta com a dor/desejo do público]\n\n[Desenvolvimento breve do tema, em 2-3 frases]\n\n[Chamada para ação: comentar, salvar, compartilhar]\n\n#MWA #MyWellnessApp #BemEstar'),
  modelo('tpl-post-lancamento', 'Post de lançamento', 'Post', 'Lançamento',
    '🌱 O MWA está de portas abertas!\n\nUm programa de 90 dias para aprender, praticar e evoluir sua relação com alimentação, rotina e hábitos — no seu ritmo, sem promessas vazias.\n\n[Detalhe da oferta/condição de lançamento]\n\nConhecimento para escolher. Constância para evoluir.\n\n[Chamada para ação: link na bio / inscreva-se]'),
  modelo('tpl-depoimento', 'Depoimento de participante', 'Post', 'Comunidade',
    '"[Trecho real do depoimento da participante — usar apenas depoimento verdadeiro e autorizado, nunca inventado]"\n\n— [Nome ou iniciais, com autorização]\n\n[Frase de fechamento conectando o depoimento ao propósito do MWA]'),
  modelo('tpl-boas-vindas', 'Boas-vindas', 'Mensagem', 'Comunidade',
    '🌿 Seja bem-vinda ao MWA!\n\nVocê está começando uma jornada de 90 dias para aprender, praticar e evoluir — no seu tempo, com constância possível para a sua vida real.\n\nNos próximos dias você vai receber lições, dicas e desafios simples. Não precisa ser perfeita, precisa continuar aparecendo.\n\nVamos juntas.'),
  modelo('tpl-recuperacao-desmotivada', 'Recuperação de participante desmotivado', 'Mensagem', 'Comunidade',
    'Sentimos sua falta por aqui. 💚\n\nSe os últimos dias foram difíceis, tudo bem — isso também faz parte da jornada. Constância não é sobre nunca parar, é sobre voltar.\n\nQue tal retomar hoje com um passo pequeno? [sugestão de retomada simples].'),
  modelo('tpl-celebracao-progresso', 'Celebração de progresso', 'Mensagem', 'Comunidade',
    '🎉 Olha até onde você chegou!\n\nVocê já [marco de progresso, ex.: completou X dias / X hábitos]. Isso é resultado de constância, não de sorte.\n\nContinue no seu ritmo — cada etapa conta.'),
  modelo('tpl-conteudo-com-fe', 'Conteúdo com fé', 'Reflexão', 'Fé',
    '🙏 [Tema do dia] também é sobre cuidar do corpo que Deus te confiou.\n\n[Reflexão breve conectando o tema prático com propósito, gratidão ou disciplina, sem tom de cobrança].\n\nHoje, pratique com leveza: [ação prática do dia].'),
  modelo('tpl-convite-conhecer-mwa', 'Convite para conhecer o MWA', 'Post', 'Lançamento',
    'Você já pensou em ter 90 dias guiados para organizar sua alimentação e seus hábitos, sem dietas restritivas? O MWA existe para isso.\n\n[Breve descrição do programa]\n\nQuer conhecer? [chamada para ação]'),
  modelo('tpl-mensagem-piloto', 'Mensagem para usuário piloto', 'Mensagem', 'Comunidade',
    'Oi! Você foi convidada para testar o MWA antes de todo mundo. 💚\n\nSua opinião vai ajudar a moldar o programa para outras mulheres. Ao longo dos próximos dias, você vai receber conteúdos e queremos muito ouvir o que achou — o que funcionou, o que pode melhorar.\n\nObrigada por fazer parte dessa fase com a gente.'),
  modelo('tpl-pesquisa-satisfacao', 'Pesquisa de satisfação', 'Enquete', 'Comunidade',
    'Queremos ouvir você! 📝\n\nEm poucos minutos, responda: o que mais te ajudou no MWA até agora? O que podemos melhorar? Sua resposta é sincera e sem julgamento — é assim que evoluímos juntas.\n\n[Link da pesquisa]'),
]
```

- [ ] **Step 2: Write the failing test for the hook**

```js
// content-studio/src/hooks/useTemplates.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTemplates } from './useTemplates'

beforeEach(() => localStorage.clear())

describe('useTemplates', () => {
  it('loads the 20 seed templates when storage is empty', () => {
    const { result } = renderHook(() => useTemplates())
    expect(result.current.templates).toHaveLength(20)
  })

  it('creates a user template with origem "usuario"', () => {
    const { result } = renderHook(() => useTemplates())
    act(() => result.current.criar({ nome: 'Meu modelo', formato: 'Post', categoria: 'Instagram', conteudoModelo: 'Texto' }))
    const criado = result.current.templates.find((t) => t.nome === 'Meu modelo')
    expect(criado.origem).toBe('usuario')
  })

  it('duplicates a template with a new id and "(cópia)" suffix', () => {
    const { result } = renderHook(() => useTemplates())
    const original = result.current.templates[0]
    act(() => result.current.duplicar(original.id))
    const copia = result.current.templates.find((t) => t.nome === `${original.nome} (cópia)`)
    expect(copia).toBeDefined()
    expect(copia.id).not.toBe(original.id)
  })

  it('removes a template by id', () => {
    const { result } = renderHook(() => useTemplates())
    const alvo = result.current.templates[0]
    act(() => result.current.remover(alvo.id))
    expect(result.current.templates.find((t) => t.id === alvo.id)).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/hooks/useTemplates.test.js`
Expected: FAIL — `useTemplates.js` does not exist yet.

- [ ] **Step 4: Create `src/hooks/useTemplates.js`**

```jsx
import { useCallback, useState } from 'react'
import { readCollection, writeCollection } from '../lib/storage'
import { templatesSeed } from '../data/templatesSeed'

function carregarInicial() {
  const existentes = readCollection('templates', [])
  if (existentes.length > 0) return existentes
  writeCollection('templates', templatesSeed)
  return templatesSeed
}

export function useTemplates() {
  const [templates, setTemplates] = useState(carregarInicial)

  const persist = useCallback((proximos) => {
    writeCollection('templates', proximos)
    setTemplates(proximos)
  }, [])

  const criar = useCallback((dados) => {
    const novo = { id: crypto.randomUUID(), origem: 'usuario', ...dados }
    setTemplates((atuais) => {
      const proximos = [novo, ...atuais]
      writeCollection('templates', proximos)
      return proximos
    })
    return novo
  }, [])

  const atualizar = useCallback((id, alteracoes) => {
    setTemplates((atuais) => {
      const proximos = atuais.map((t) => (t.id === id ? { ...t, ...alteracoes } : t))
      writeCollection('templates', proximos)
      return proximos
    })
  }, [])

  const remover = useCallback((id) => {
    setTemplates((atuais) => {
      const proximos = atuais.filter((t) => t.id !== id)
      writeCollection('templates', proximos)
      return proximos
    })
  }, [])

  const duplicar = useCallback((id) => {
    setTemplates((atuais) => {
      const original = atuais.find((t) => t.id === id)
      if (!original) return atuais
      const copia = { ...original, id: crypto.randomUUID(), nome: `${original.nome} (cópia)`, origem: 'usuario' }
      const proximos = [copia, ...atuais]
      writeCollection('templates', proximos)
      return proximos
    })
  }, [])

  const obter = useCallback((id) => templates.find((t) => t.id === id), [templates])

  return { templates, criar, atualizar, remover, duplicar, obter, persist }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/hooks/useTemplates.test.js`
Expected: PASS (4 tests)

- [ ] **Step 6: Commit**

```bash
git add content-studio/src/data/templatesSeed.js content-studio/src/hooks/useTemplates.js content-studio/src/hooks/useTemplates.test.js
git commit -m "feat: add 20 real starter templates and useTemplates hook"
```

---

### Task 5: Demo content seed + useContentItems hook

**Files:**
- Create: `content-studio/src/data/demoContentSeed.js`
- Create: `content-studio/src/hooks/useContentItems.js`
- Test: `content-studio/src/hooks/useContentItems.test.js`

**Interfaces:**
- Consumes: `readCollection`, `writeCollection`, `readItem`, `writeItem` from `../lib/storage` (Task 2); `STATUS_CONTEUDO` from `../data/options` (Task 3, for reference only).
- Produces: `demoContentSeed` array of 9 `contentItem` objects (shape below, all `isDemo: true`); `useContentItems()` hook returning `{ items, criar(dados), atualizar(id, alteracoes), remover(id), obter(id), apagarDemo(), contagemPorStatus }`. `contentItem` shape: `{ id, createdAt, updatedAt, finalidade, formato, tema, publico, diaPrograma, objetivo, profundidade, tom, tamanho, camposObrigatorios, palavrasIncluir, palavrasEvitar, chamadaAcao, observacoes, produtoRelacionado, promptGerado, historicoPrompts: [], textoConteudo, status, isDemo, tituloInterno }`.

- [ ] **Step 1: Create `src/data/demoContentSeed.js`**

```js
function item(overrides) {
  const agora = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: agora,
    updatedAt: agora,
    finalidade: 'Conteúdo interno do MWA',
    formato: 'Dica diária',
    tema: 'Hidratação',
    publico: 'Participantes dos 90 dias',
    diaPrograma: null,
    objetivo: '',
    profundidade: 'Rápido',
    tom: 'Acolhedor',
    tamanho: 'Curto',
    camposObrigatorios: '',
    palavrasIncluir: '',
    palavrasEvitar: '',
    chamadaAcao: '',
    observacoes: '',
    produtoRelacionado: '',
    promptGerado: '',
    historicoPrompts: [],
    textoConteudo: '',
    status: 'ideia',
    isDemo: true,
    tituloInterno: 'Conteúdo de demonstração',
    ...overrides,
  }
}

export const demoContentSeed = [
  item({ tituloInterno: 'Dica de hidratação (exemplo)', formato: 'Dica diária', tema: 'Hidratação', status: 'aprovado', textoConteudo: '💡 Dica do dia: comece a manhã com um copo de água antes do café.\n\nPor quê: ajuda o corpo a despertar antes mesmo da primeira refeição.' }),
  item({ tituloInterno: 'Lição dia 12 (exemplo)', formato: 'Lição', tema: 'Planejamento', diaPrograma: 12, status: 'em_revisao', textoConteudo: '🌿 Dia 12 — Planejando a semana\n\nHoje vamos organizar as refeições da semana em 10 minutos, sem complicação.' }),
  item({ tituloInterno: 'Desafio do fim de semana (exemplo)', formato: 'Desafio', tema: 'Movimento', status: 'rascunho' }),
  item({ tituloInterno: 'Carrossel leitura de rótulos (exemplo)', formato: 'Carrossel', tema: 'Leitura de rótulos', finalidade: 'Instagram', status: 'ideia' }),
  item({ tituloInterno: 'Legenda motivacional (exemplo)', formato: 'Legenda', tema: 'Motivação', finalidade: 'Instagram', status: 'aprovado', textoConteudo: 'Constância não é sobre ser perfeita todos os dias. É sobre voltar sempre que sair do caminho. 🌱' }),
  item({ tituloInterno: 'E-mail de boas-vindas (exemplo)', formato: 'E-mail', tema: 'Autoconhecimento', finalidade: 'E-mail', status: 'programado' }),
  item({ tituloInterno: 'Reflexão de encerramento (exemplo)', formato: 'Reflexão', tema: 'Progresso', status: 'arquivado', textoConteudo: '🕯️ Hoje você apareceu. Isso já conta.' }),
  item({ tituloInterno: 'Roteiro de Reels sono (exemplo)', formato: 'Reels', tema: 'Sono', finalidade: 'Instagram', status: 'ideia' }),
  item({ tituloInterno: 'Notificação da manhã (exemplo)', formato: 'Notificação', tema: 'Consistência', status: 'em_revisao' }),
]
```

- [ ] **Step 2: Write the failing test for the hook**

```js
// content-studio/src/hooks/useContentItems.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContentItems } from './useContentItems'

beforeEach(() => localStorage.clear())

describe('useContentItems', () => {
  it('loads the 9 demo items on first run', () => {
    const { result } = renderHook(() => useContentItems())
    expect(result.current.items).toHaveLength(9)
  })

  it('creates a new item with status "ideia" by default', () => {
    const { result } = renderHook(() => useContentItems())
    act(() => result.current.criar({ finalidade: 'Instagram', formato: 'Post', tema: 'Metas' }))
    const criado = result.current.items.find((i) => i.tema === 'Metas')
    expect(criado.status).toBe('ideia')
    expect(criado.isDemo).toBe(false)
  })

  it('updates an item and bumps updatedAt', () => {
    const { result } = renderHook(() => useContentItems())
    const alvo = result.current.items[0]
    act(() => result.current.atualizar(alvo.id, { status: 'aprovado' }))
    const atualizado = result.current.obter(alvo.id)
    expect(atualizado.status).toBe('aprovado')
  })

  it('apagarDemo removes only demo items', () => {
    const { result } = renderHook(() => useContentItems())
    act(() => result.current.criar({ finalidade: 'Instagram', formato: 'Post', tema: 'Metas' }))
    act(() => result.current.apagarDemo())
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].tema).toBe('Metas')
  })

  it('contagemPorStatus counts items by status', () => {
    const { result } = renderHook(() => useContentItems())
    expect(result.current.contagemPorStatus.aprovado).toBe(2)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/hooks/useContentItems.test.js`
Expected: FAIL — `useContentItems.js` does not exist yet.

- [ ] **Step 4: Create `src/hooks/useContentItems.js`**

```jsx
import { useCallback, useMemo, useState } from 'react'
import { readCollection, writeCollection } from '../lib/storage'
import { demoContentSeed } from '../data/demoContentSeed'

function carregarInicial() {
  const existentes = readCollection('contentItems', null)
  if (existentes !== null) return existentes
  writeCollection('contentItems', demoContentSeed)
  return demoContentSeed
}

export function useContentItems() {
  const [items, setItems] = useState(carregarInicial)

  const persist = useCallback((proximos) => {
    writeCollection('contentItems', proximos)
    setItems(proximos)
  }, [])

  const criar = useCallback((dados) => {
    const agora = new Date().toISOString()
    const novo = {
      id: crypto.randomUUID(),
      createdAt: agora,
      updatedAt: agora,
      status: 'ideia',
      isDemo: false,
      historicoPrompts: [],
      textoConteudo: '',
      promptGerado: '',
      diaPrograma: null,
      ...dados,
    }
    setItems((atuais) => {
      const proximos = [novo, ...atuais]
      writeCollection('contentItems', proximos)
      return proximos
    })
    return novo
  }, [])

  const atualizar = useCallback((id, alteracoes) => {
    setItems((atuais) => {
      const proximos = atuais.map((i) => (i.id === id ? { ...i, ...alteracoes, updatedAt: new Date().toISOString() } : i))
      writeCollection('contentItems', proximos)
      return proximos
    })
  }, [])

  const remover = useCallback((id) => {
    setItems((atuais) => {
      const proximos = atuais.filter((i) => i.id !== id)
      writeCollection('contentItems', proximos)
      return proximos
    })
  }, [])

  const apagarDemo = useCallback(() => {
    setItems((atuais) => {
      const proximos = atuais.filter((i) => !i.isDemo)
      writeCollection('contentItems', proximos)
      return proximos
    })
  }, [])

  const obter = useCallback((id) => items.find((i) => i.id === id), [items])

  const contagemPorStatus = useMemo(
    () => items.reduce((acc, i) => ({ ...acc, [i.status]: (acc[i.status] || 0) + 1 }), {}),
    [items],
  )

  return { items, criar, atualizar, remover, apagarDemo, obter, contagemPorStatus }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/hooks/useContentItems.test.js`
Expected: PASS (5 tests)

- [ ] **Step 6: Commit**

```bash
git add content-studio/src/data/demoContentSeed.js content-studio/src/hooks/useContentItems.js content-studio/src/hooks/useContentItems.test.js
git commit -m "feat: add demo content seed and useContentItems hook"
```

---

### Task 6: Prompt builder

**Files:**
- Create: `content-studio/src/lib/promptBuilder.js`
- Test: `content-studio/src/lib/promptBuilder.test.js`

**Interfaces:**
- Consumes: `brandGuide` shape from Task 3, `escolhas` shape matching the relevant fields of `contentItem` from Task 5.
- Produces: `montarPrompt({ brandGuide, escolhas, instrucaoExtra })` returning a string; `INSTRUCOES_AJUSTE` object mapping button keys (`regenerar`, `mais_curto`, `mais_humano`, `mais_educativo`, `mais_acolhedor`, `mais_elegante`, `simplificar`, `corrigir_portugues`) to instruction strings — consumed by `ContentEditor.jsx` in Task 15.

- [ ] **Step 1: Write the failing test**

```js
// content-studio/src/lib/promptBuilder.test.js
import { describe, expect, it } from 'vitest'
import { montarPrompt, INSTRUCOES_AJUSTE } from './promptBuilder'
import { brandGuideSeed } from '../data/brandGuideSeed'

const escolhasBase = {
  finalidade: 'Instagram',
  formato: 'Legenda',
  tema: 'Hidratação',
  publico: 'Participantes dos 90 dias',
  profundidade: 'Rápido',
  tom: 'Acolhedor',
  tamanho: 'Curto',
}

describe('montarPrompt', () => {
  it('includes the brand tone and forbidden words', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(prompt).toContain('Acolhedor')
    expect(prompt).toContain('projeto verão')
  })

  it('includes every selected field', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(prompt).toContain('Formato: Legenda')
    expect(prompt).toContain('Tema: Hidratação')
  })

  it('appends the extra instruction when provided', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase, instrucaoExtra: INSTRUCOES_AJUSTE.mais_curto })
    expect(prompt).toContain('Ajuste solicitado nesta versão')
    expect(prompt).toContain(INSTRUCOES_AJUSTE.mais_curto)
  })

  it('adds the faith-content instruction only when tom is "Com fé"', () => {
    const comFe = montarPrompt({ brandGuide: brandGuideSeed, escolhas: { ...escolhasBase, tom: 'Com fé' } })
    const semFe = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(comFe).toContain('fé cristã')
    expect(semFe).not.toContain('fé cristã')
  })

  it('never fabricates a claim that stats are allowed', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(prompt).toContain('Nunca invente estatísticas')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/lib/promptBuilder.test.js`
Expected: FAIL — `promptBuilder.js` does not exist yet.

- [ ] **Step 3: Create `src/lib/promptBuilder.js`**

```js
export const INSTRUCOES_AJUSTE = {
  regenerar: 'Gere uma nova versão completa, diferente da anterior, mantendo o mesmo pedido.',
  mais_curto: 'Deixe o texto mais curto e direto, cortando o que não for essencial.',
  mais_humano: 'Deixe o texto mais humano e conversacional, como se estivesse falando pessoalmente.',
  mais_educativo: 'Reforce o caráter educativo, explicando o "porquê" por trás da orientação.',
  mais_acolhedor: 'Deixe o tom mais acolhedor e gentil, sem soar exigente.',
  mais_elegante: 'Deixe a escrita mais elegante e refinada, sem perder clareza.',
  simplificar: 'Simplifique a linguagem, evitando termos técnicos.',
  corrigir_portugues: 'Revise e corrija a ortografia e a gramática do texto, mantendo o conteúdo.',
}

export function montarPrompt({ brandGuide, escolhas, instrucaoExtra }) {
  const linhas = []

  linhas.push(`Você é a redatora oficial do ${brandGuide.nomeCompleto} (${brandGuide.nome}).`)
  linhas.push(`Assinatura da marca: "${brandGuide.assinatura}". Slogan institucional: "${brandGuide.slogan}".`)
  linhas.push(`Posicionamento: ${brandGuide.posicionamento}`)
  linhas.push(`Tom de voz obrigatório: ${brandGuide.tomDeVoz.join(', ')}.`)
  if (brandGuide.palavrasProibidas?.length) {
    linhas.push(`Nunca use estas palavras/expressões: ${brandGuide.palavrasProibidas.join(', ')}.`)
  }
  if (brandGuide.regrasSaude) linhas.push(brandGuide.regrasSaude)
  linhas.push('Nunca invente estatísticas, pesquisas, referências científicas ou benefícios não comprovados.')

  if (escolhas.tom === 'Com fé') {
    linhas.push('Este conteúdo deve trazer fé cristã de forma natural: esperança, propósito, cuidado, gratidão, disciplina e respeito ao corpo — sem tom religioso forçado ou julgador.')
  }

  linhas.push('')
  linhas.push('--- Pedido de conteúdo ---')
  linhas.push(`Finalidade: ${escolhas.finalidade}`)
  linhas.push(`Formato: ${escolhas.formato}`)
  linhas.push(`Tema: ${escolhas.tema}`)
  if (escolhas.publico) linhas.push(`Público: ${escolhas.publico}`)
  if (escolhas.diaPrograma) linhas.push(`Dia do programa (90 dias): ${escolhas.diaPrograma}`)
  if (escolhas.objetivo) linhas.push(`Objetivo do conteúdo: ${escolhas.objetivo}`)
  linhas.push(`Nível de profundidade: ${escolhas.profundidade}`)
  linhas.push(`Tom: ${escolhas.tom}`)
  linhas.push(`Tamanho: ${escolhas.tamanho}`)
  if (escolhas.camposObrigatorios) linhas.push(`Informações obrigatórias que precisam aparecer: ${escolhas.camposObrigatorios}`)
  if (escolhas.palavrasIncluir) linhas.push(`Palavras ou ideias que devem aparecer: ${escolhas.palavrasIncluir}`)
  if (escolhas.palavrasEvitar) linhas.push(`Palavras que devem ser evitadas: ${escolhas.palavrasEvitar}`)
  if (escolhas.chamadaAcao) linhas.push(`Chamada para ação desejada: ${escolhas.chamadaAcao}`)
  if (escolhas.produtoRelacionado) linhas.push(`Produto/recurso do MWA relacionado: ${escolhas.produtoRelacionado}`)
  if (escolhas.observacoes) linhas.push(`Observações pessoais da Wanessa: ${escolhas.observacoes}`)

  if (instrucaoExtra) {
    linhas.push('')
    linhas.push('--- Ajuste solicitado nesta versão ---')
    linhas.push(instrucaoExtra)
  }

  linhas.push('')
  linhas.push('Entregue apenas o texto final do conteúdo, pronto para revisão — sem explicações extras antes ou depois.')

  return linhas.join('\n')
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/lib/promptBuilder.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add content-studio/src/lib/promptBuilder.js content-studio/src/lib/promptBuilder.test.js
git commit -m "feat: add prompt builder for Modo sem API"
```

---

### Task 7: Content review (banned words + health disclaimer)

**Files:**
- Create: `content-studio/src/lib/contentReview.js`
- Test: `content-studio/src/lib/contentReview.test.js`

**Interfaces:**
- Produces: `detectarAvisoSaude(texto)` returning boolean; `encontrarPalavrasProibidas(texto, palavrasProibidas)` returning `string[]` of matches — both consumed by `ContentEditor.jsx` in Task 15.

- [ ] **Step 1: Write the failing test**

```js
// content-studio/src/lib/contentReview.test.js
import { describe, expect, it } from 'vitest'
import { detectarAvisoSaude, encontrarPalavrasProibidas } from './contentReview'

describe('detectarAvisoSaude', () => {
  it('flags text mentioning weight loss', () => {
    expect(detectarAvisoSaude('Esse hábito ajuda a emagrecer com saúde.')).toBe(true)
  })

  it('does not flag unrelated text', () => {
    expect(detectarAvisoSaude('Hoje o desafio é organizar sua semana.')).toBe(false)
  })
})

describe('encontrarPalavrasProibidas', () => {
  it('finds a case-insensitive match', () => {
    const achadas = encontrarPalavrasProibidas('Este é o Projeto Verão da sua vida!', ['projeto verão'])
    expect(achadas).toEqual(['projeto verão'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(encontrarPalavrasProibidas('Texto limpo e acolhedor.', ['projeto verão'])).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/lib/contentReview.test.js`
Expected: FAIL — `contentReview.js` does not exist yet.

- [ ] **Step 3: Create `src/lib/contentReview.js`**

```js
const TERMOS_SAUDE = ['emagrec', 'dieta', 'caloria', 'perda de peso', 'peso corporal', 'gordura corporal', 'ganho de massa', 'nutricional', 'restrição alimentar']

export function detectarAvisoSaude(texto = '') {
  const alvo = texto.toLowerCase()
  return TERMOS_SAUDE.some((termo) => alvo.includes(termo))
}

export function encontrarPalavrasProibidas(texto = '', palavrasProibidas = []) {
  const alvo = texto.toLowerCase()
  return palavrasProibidas.filter((palavra) => alvo.includes(palavra.toLowerCase()))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/lib/contentReview.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add content-studio/src/lib/contentReview.js content-studio/src/lib/contentReview.test.js
git commit -m "feat: add lightweight content review (banned words, health flag)"
```

---

### Task 8: Export and backup utilities

**Files:**
- Create: `content-studio/src/lib/exportUtils.js`
- Create: `content-studio/src/lib/backup.js`
- Test: `content-studio/src/lib/backup.test.js`

**Interfaces:**
- Consumes: `NAMESPACE`, `allKeys` from `../lib/storage` (Task 2).
- Produces: `copiarTexto(texto)`, `baixarTxt(nomeArquivo, texto)`, `baixarJson(nomeArquivo, objeto)`, `abrirJanelaImpressao(titulo, texto)` (exportUtils.js); `exportarBackup()` returning `{ exportadoEm, namespace, dados }`, `restaurarBackup(arquivoJson)` (backup.js) — consumed by `ContentEditor.jsx` (Task 15), `GuiaDaMarca.jsx` (Task 17), `Configuracoes.jsx` (Task 18).

- [ ] **Step 1: Create `src/lib/exportUtils.js`**

```js
function dispararDownload(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escaparHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function copiarTexto(texto) {
  return navigator.clipboard.writeText(texto)
}

export function baixarTxt(nomeArquivo, texto) {
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
  dispararDownload(blob, nomeArquivo.endsWith('.txt') ? nomeArquivo : `${nomeArquivo}.txt`)
}

export function baixarJson(nomeArquivo, objeto) {
  const blob = new Blob([JSON.stringify(objeto, null, 2)], { type: 'application/json' })
  dispararDownload(blob, nomeArquivo.endsWith('.json') ? nomeArquivo : `${nomeArquivo}.json`)
}

export function abrirJanelaImpressao(titulo, texto) {
  const janela = window.open('', '_blank', 'width=800,height=900')
  if (!janela) return
  janela.document.write(`<!doctype html><html><head><title>${escaparHtml(titulo)}</title>
    <style>
      body { font-family: Georgia, serif; padding: 40px; color: #052a1f; line-height: 1.6; white-space: pre-wrap; }
      h1 { font-family: Georgia, serif; color: #08402f; }
    </style>
  </head><body><h1>${escaparHtml(titulo)}</h1><div>${escaparHtml(texto)}</div></body></html>`)
  janela.document.close()
  janela.focus()
  janela.print()
}
```

- [ ] **Step 2: Write the failing test for backup**

```js
// content-studio/src/lib/backup.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { exportarBackup, restaurarBackup } from './backup'
import { writeItem, readItem } from './storage'

beforeEach(() => localStorage.clear())

describe('backup', () => {
  it('exports every namespaced key without the namespace prefix', () => {
    writeItem('brandGuide', { nome: 'MWA' })
    const backup = exportarBackup()
    expect(backup.dados.brandGuide).toEqual({ nome: 'MWA' })
  })

  it('restores a backup back into storage', () => {
    const backup = { exportadoEm: '2026-01-01', namespace: 'mwa-content-studio', dados: { brandGuide: { nome: 'Restaurado' } } }
    restaurarBackup(backup)
    expect(readItem('brandGuide', null)).toEqual({ nome: 'Restaurado' })
  })

  it('throws on a file without a dados field', () => {
    expect(() => restaurarBackup({})).toThrow()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/lib/backup.test.js`
Expected: FAIL — `backup.js` does not exist yet.

- [ ] **Step 4: Create `src/lib/backup.js`**

```js
import { NAMESPACE, allKeys } from './storage'

export function exportarBackup() {
  const dados = {}
  allKeys().forEach((chaveCompleta) => {
    const nomeCurto = chaveCompleta.replace(`${NAMESPACE}:`, '')
    dados[nomeCurto] = JSON.parse(localStorage.getItem(chaveCompleta))
  })
  return { exportadoEm: new Date().toISOString(), namespace: NAMESPACE, dados }
}

export function restaurarBackup(arquivoJson) {
  if (!arquivoJson?.dados) throw new Error('Arquivo de backup inválido.')
  Object.entries(arquivoJson.dados).forEach(([nomeCurto, valor]) => {
    localStorage.setItem(`${NAMESPACE}:${nomeCurto}`, JSON.stringify(valor))
  })
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/lib/backup.test.js`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add content-studio/src/lib/exportUtils.js content-studio/src/lib/backup.js content-studio/src/lib/backup.test.js
git commit -m "feat: add export (txt/pdf/print) and backup/restore utilities"
```

---

### Task 9: UI primitives

**Files:**
- Create: `content-studio/src/components/ui/Button.jsx`
- Create: `content-studio/src/components/ui/Card.jsx`
- Create: `content-studio/src/components/ui/StatusBadge.jsx`
- Create: `content-studio/src/components/ui/EmptyState.jsx`
- Create: `content-studio/src/components/ui/ConfirmDialog.jsx`

**Interfaces:**
- Consumes: `STATUS_LABELS` from `../../data/options` (Task 3).
- Produces: `<Button variant="primary|secondary|ghost|danger" />`, `<Card />`, `<StatusBadge status="..." />`, `<EmptyState title icon description action />`, `<ConfirmDialog open title description onConfirm onCancel />` — used by every page component from Task 12 onward.

- [ ] **Step 1: Create `src/components/ui/Button.jsx`**

```jsx
const VARIANTES = {
  primary: 'bg-forest text-offwhite hover:bg-forest-deep',
  secondary: 'bg-white text-forest border border-forest/30 hover:bg-forest/5',
  ghost: 'text-forest hover:bg-forest/5',
  danger: 'bg-red-700 text-white hover:bg-red-800',
}

export function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`font-ui inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create `src/components/ui/Card.jsx`**

```jsx
export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-sand bg-white/70 p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/ui/StatusBadge.jsx`**

```jsx
import { STATUS_LABELS } from '../../data/options'

const CORES = {
  ideia: 'bg-sand text-forest-deep',
  rascunho: 'bg-gold-soft/60 text-forest-deep',
  em_revisao: 'bg-gold text-forest-deep',
  aprovado: 'bg-sage text-white',
  arquivado: 'bg-mist/30 text-forest-deep',
  programado: 'bg-forest text-offwhite',
}

export function StatusBadge({ status }) {
  return (
    <span className={`font-ui inline-block rounded-full px-3 py-1 text-xs font-semibold ${CORES[status] || CORES.ideia}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
```

- [ ] **Step 4: Create `src/components/ui/EmptyState.jsx`**

```jsx
export function EmptyState({ title, description, action }) {
  return (
    <div className="font-ui flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sand bg-white/50 p-10 text-center">
      <p className="text-lg font-semibold text-forest-deep">{title}</p>
      {description && <p className="max-w-md text-sm text-mist">{description}</p>}
      {action}
    </div>
  )
}
```

- [ ] **Step 5: Create `src/components/ui/ConfirmDialog.jsx`**

```jsx
import { Button } from './Button'

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="font-ui fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <p className="text-lg font-semibold text-forest-deep">{title}</p>
        {description && <p className="mt-2 text-sm text-mist">{description}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add content-studio/src/components/ui
git commit -m "feat: add UI primitives (Button, Card, StatusBadge, EmptyState, ConfirmDialog)"
```

---

### Task 10: App shell, navigation, and routing

**Files:**
- Create: `content-studio/src/components/layout/AppShell.jsx`
- Create: `content-studio/src/components/layout/NavMenu.jsx`
- Create: `content-studio/src/pages/EmBreve.jsx`
- Modify: `content-studio/src/App.jsx`
- Modify: `content-studio/src/main.jsx`

**Interfaces:**
- Consumes: `lucide-react` icons, `react-router-dom` (`NavLink`, `Outlet`, `createBrowserRouter`/`RouterProvider`).
- Produces: routes `/`, `/conteudos`, `/conteudos/:id`, `/criar`, `/modelos`, `/modelos/:id`, `/marca`, `/configuracoes`, plus stub routes `/planejador`, `/calendario`, `/ideias`, `/biblioteca`, `/campanhas` rendering `<EmBreve titulo="..." />`. Page components referenced here (`Painel`, `TodosConteudos`, `CriarConteudo`, `ContentEditor`, `ModelosProntos`, `ModeloDetalhe`, `GuiaDaMarca`, `Configuracoes`) are created in Tasks 12–18 — this task wires their routes with lazy-safe imports that will exist by the end of the plan.

- [ ] **Step 1: Create `src/pages/EmBreve.jsx`**

```jsx
import { EmptyState } from '../components/ui/EmptyState'

export default function EmBreve({ titulo, fase }) {
  return (
    <div className="p-6">
      <EmptyState
        title={`${titulo} — em breve`}
        description={`Esta área chega na ${fase} do MWA Content Studio. Por enquanto, use Criar Conteúdo e Modelos Prontos.`}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/NavMenu.jsx`**

```jsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PenSquare, LibraryBig, BookOpen, Settings, CalendarDays, CalendarRange, Lightbulb, FolderOpen, Megaphone } from 'lucide-react'

const ITENS = [
  { to: '/', label: 'Painel', icon: LayoutDashboard, fim: true },
  { to: '/criar', label: 'Criar Conteúdo', icon: PenSquare },
  { to: '/modelos', label: 'Modelos Prontos', icon: LibraryBig },
  { to: '/marca', label: 'Guia da Marca', icon: BookOpen },
  { to: '/planejador', label: 'Planejador 90 Dias', icon: CalendarDays, emBreve: true },
  { to: '/calendario', label: 'Calendário Editorial', icon: CalendarRange, emBreve: true },
  { to: '/ideias', label: 'Banco de Ideias', icon: Lightbulb, emBreve: true },
  { to: '/biblioteca', label: 'Biblioteca de Conteúdos', icon: FolderOpen, emBreve: true },
  { to: '/campanhas', label: 'Campanhas', icon: Megaphone, emBreve: true },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function NavMenu({ orientation = 'vertical' }) {
  const container = orientation === 'vertical'
    ? 'flex flex-col gap-1'
    : 'flex flex-row justify-around'

  return (
    <nav className={`font-ui ${container}`}>
      {ITENS.map(({ to, label, icon: Icon, fim, emBreve }) => (
        <NavLink
          key={to}
          to={to}
          end={fim}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
              isActive ? 'bg-forest text-offwhite' : 'text-forest-deep hover:bg-forest/10'
            } ${emBreve ? 'opacity-60' : ''}`
          }
        >
          <Icon size={18} />
          <span className={orientation === 'horizontal' ? 'hidden sm:inline' : ''}>{label}</span>
          {emBreve && <span className="ml-auto text-[10px] uppercase tracking-wide">em breve</span>}
        </NavLink>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Create `src/components/layout/AppShell.jsx`**

```jsx
import { Outlet } from 'react-router-dom'
import { NavMenu } from './NavMenu'

export function AppShell() {
  return (
    <div className="min-h-screen bg-offwhite font-ui">
      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sand p-4 md:block">
          <p className="mb-6 px-2 text-lg font-semibold text-forest" style={{ fontFamily: 'Georgia, serif' }}>MWA Content Studio</p>
          <NavMenu orientation="vertical" />
        </aside>
        <main className="min-h-screen w-full pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-sand bg-white/95 p-2 md:hidden">
        <NavMenu orientation="horizontal" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Rewrite `src/App.jsx`**

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import EmBreve from './pages/EmBreve'
import Painel from './pages/Painel'
import TodosConteudos from './pages/TodosConteudos'
import CriarConteudo from './pages/CriarConteudo'
import ContentEditor from './pages/ContentEditor'
import ModelosProntos from './pages/ModelosProntos'
import ModeloDetalhe from './pages/ModeloDetalhe'
import GuiaDaMarca from './pages/GuiaDaMarca'
import Configuracoes from './pages/Configuracoes'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Painel /> },
      { path: '/conteudos', element: <TodosConteudos /> },
      { path: '/conteudos/:id', element: <ContentEditor /> },
      { path: '/criar', element: <CriarConteudo /> },
      { path: '/modelos', element: <ModelosProntos /> },
      { path: '/modelos/:id', element: <ModeloDetalhe /> },
      { path: '/marca', element: <GuiaDaMarca /> },
      { path: '/configuracoes', element: <Configuracoes /> },
      { path: '/planejador', element: <EmBreve titulo="Planejador dos 90 Dias" fase="Fase 2" /> },
      { path: '/calendario', element: <EmBreve titulo="Calendário Editorial" fase="Fase 2" /> },
      { path: '/ideias', element: <EmBreve titulo="Banco de Ideias" fase="Fase 3" /> },
      { path: '/biblioteca', element: <EmBreve titulo="Biblioteca de Conteúdos" fase="Fase 3" /> },
      { path: '/campanhas', element: <EmBreve titulo="Assistente de Campanhas" fase="Fase 4" /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
```

- [ ] **Step 5: Update `src/main.jsx` — this task creates placeholder page files so the app boots**

Create minimal placeholder content for each page file so `App.jsx` imports resolve (each is fully implemented in its own later task — Task 12 for `Painel`, Task 13 for `TodosConteudos`, Task 14 for `CriarConteudo`, Task 15 for `ContentEditor`, Task 16 for `ModelosProntos`/`ModeloDetalhe`, Task 17 for `GuiaDaMarca`, Task 18 for `Configuracoes`). Create each as:

```jsx
// content-studio/src/pages/Painel.jsx (placeholder — replaced in Task 12)
export default function Painel() { return <div className="p-6">Painel</div> }
```

Repeat the same one-line pattern for `TodosConteudos.jsx`, `CriarConteudo.jsx`, `ContentEditor.jsx`, `ModelosProntos.jsx`, `ModeloDetalhe.jsx`, `GuiaDaMarca.jsx`, `Configuracoes.jsx`, each exporting a default function returning `<div className="p-6">{Nome da página}</div>`.

`main.jsx` itself does not need edits beyond what Task 1 already wrote.

- [ ] **Step 6: Verify navigation in the browser**

Run: `cd content-studio && npm run dev`
Expected: sidebar shows all 10 menu items; clicking each functional item (Painel, Criar Conteúdo, Modelos Prontos, Guia da Marca, Configurações) navigates and shows its placeholder text; clicking an "em breve" item shows the `EmBreve` message; resize to mobile width and confirm the bottom nav bar appears instead of the sidebar.

- [ ] **Step 7: Commit**

```bash
git add content-studio/src/App.jsx content-studio/src/components/layout content-studio/src/pages
git commit -m "feat: wire app shell, navigation, and routes with placeholder pages"
```

---

### Task 11: Startup data seeding

**Files:**
- Create: `content-studio/src/lib/seedData.js`
- Test: `content-studio/src/lib/seedData.test.js`
- Modify: `content-studio/src/main.jsx`

**Interfaces:**
- Consumes: `readItem`, `writeItem` from `../lib/storage`; `useContentItems` and `useTemplates` already self-seed on first read (Tasks 4–5) — this task only needs to guarantee `brandGuide` exists before any page reads it directly outside a hook, and to expose one idempotent boot function.
- Produces: `garantirDadosIniciais()` — called once in `main.jsx` before `ReactDOM.render`.

- [ ] **Step 1: Write the failing test**

```js
// content-studio/src/lib/seedData.test.js
import { beforeEach, describe, expect, it } from 'vitest'
import { garantirDadosIniciais } from './seedData'
import { readItem, writeItem, readCollection } from './storage'

beforeEach(() => localStorage.clear())

describe('garantirDadosIniciais', () => {
  it('seeds the brand guide when missing', () => {
    garantirDadosIniciais()
    expect(readItem('brandGuide', null).nome).toBe('MWA')
  })

  it('does not overwrite an already-edited brand guide', () => {
    garantirDadosIniciais()
    writeItem('brandGuide', { nome: 'Editado' })
    garantirDadosIniciais()
    expect(readItem('brandGuide', null).nome).toBe('Editado')
  })

  it('is safe to call twice without duplicating templates', () => {
    garantirDadosIniciais()
    garantirDadosIniciais()
    expect(readCollection('templates', [])).toHaveLength(0)
  })
})
```

Note: the third test expects `0` because `garantirDadosIniciais` only seeds `brandGuide` — templates and content items self-seed lazily inside their own hooks (Tasks 4–5) the first time those hooks run, not at boot. This keeps seeding logic co-located with the data it seeds.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd content-studio && npx vitest run src/lib/seedData.test.js`
Expected: FAIL — `seedData.js` does not exist yet.

- [ ] **Step 3: Create `src/lib/seedData.js`**

```js
import { readItem, writeItem } from './storage'
import { brandGuideSeed } from '../data/brandGuideSeed'

export function garantirDadosIniciais() {
  if (readItem('brandGuide', null) === null) {
    writeItem('brandGuide', brandGuideSeed)
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd content-studio && npx vitest run src/lib/seedData.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Call it once at boot — modify `src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { garantirDadosIniciais } from './lib/seedData'
import './index.css'

garantirDadosIniciais()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Commit**

```bash
git add content-studio/src/lib/seedData.js content-studio/src/lib/seedData.test.js content-studio/src/main.jsx
git commit -m "feat: seed brand guide once at app boot"
```

---

### Task 12: Painel Inicial (dashboard)

**Files:**
- Modify: `content-studio/src/pages/Painel.jsx` (replaces Task 10 placeholder)

**Interfaces:**
- Consumes: `useContentItems()` (Task 5), `STATUS_LABELS` (Task 3), `Card`/`Button`/`StatusBadge`/`EmptyState` (Task 9), `Link` from `react-router-dom`.

- [ ] **Step 1: Write `src/pages/Painel.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useContentItems } from '../hooks/useContentItems'
import { STATUS_LABELS } from '../data/options'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'

export default function Painel() {
  const { items, contagemPorStatus } = useContentItems()

  const recentes = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  const aguardandoRevisao = items.filter((i) => i.status === 'em_revisao').slice(0, 5)

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Painel Inicial</h1>
        <Link to="/criar">
          <Button><Plus size={18} /> Criar novo conteúdo</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <Card key={status} className="text-center">
            <p className="text-2xl font-semibold text-forest">{contagemPorStatus[status] || 0}</p>
            <p className="mt-1 text-xs text-mist">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-forest-deep">Criados recentemente</h2>
          {recentes.length === 0 ? (
            <EmptyState title="Nada por aqui ainda" description="Crie seu primeiro conteúdo para começar." />
          ) : (
            <ul className="space-y-3">
              {recentes.map((item) => (
                <li key={item.id}>
                  <Link to={`/conteudos/${item.id}`} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-forest/5">
                    <span className="truncate">{item.tituloInterno || item.tema}</span>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-forest-deep">Aguardando revisão</h2>
          {aguardandoRevisao.length === 0 ? (
            <EmptyState title="Nada aguardando revisão" description="Tudo em dia por aqui." />
          ) : (
            <ul className="space-y-3">
              {aguardandoRevisao.map((item) => (
                <li key={item.id}>
                  <Link to={`/conteudos/${item.id}`} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-forest/5">
                    <span className="truncate">{item.tituloInterno || item.tema}</span>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Link to="/conteudos" className="inline-block text-sm font-medium text-forest underline">Ver todos os conteúdos</Link>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run: `cd content-studio && npm run dev`, open `/`.
Expected: status cards show non-zero counts (from the 9 demo items), "Criados recentemente" and "Aguardando revisão" lists populate, clicking an item navigates to `/conteudos/:id` (shows the Task 10 placeholder until Task 15).

- [ ] **Step 3: Commit**

```bash
git add content-studio/src/pages/Painel.jsx
git commit -m "feat: build Painel Inicial dashboard"
```

---

### Task 13: Todos os Conteúdos (simple filtered list)

**Files:**
- Modify: `content-studio/src/pages/TodosConteudos.jsx` (replaces Task 10 placeholder)

**Interfaces:**
- Consumes: `useContentItems()` (Task 5), `STATUS_CONTEUDO`/`STATUS_LABELS` (Task 3), `Card`/`StatusBadge`/`EmptyState` (Task 9).

- [ ] **Step 1: Write `src/pages/TodosConteudos.jsx`**

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContentItems } from '../hooks/useContentItems'
import { STATUS_CONTEUDO, STATUS_LABELS } from '../data/options'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'

export default function TodosConteudos() {
  const { items } = useContentItems()
  const [filtro, setFiltro] = useState('todos')

  const filtrados = filtro === 'todos' ? items : items.filter((i) => i.status === filtro)
  const ordenados = [...filtrados].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Todos os conteúdos</h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro('todos')}
          className={`font-ui rounded-full px-4 py-2 text-sm ${filtro === 'todos' ? 'bg-forest text-offwhite' : 'bg-white text-forest-deep border border-sand'}`}
        >
          Todos ({items.length})
        </button>
        {STATUS_CONTEUDO.map((status) => (
          <button
            key={status}
            onClick={() => setFiltro(status)}
            className={`font-ui rounded-full px-4 py-2 text-sm ${filtro === status ? 'bg-forest text-offwhite' : 'bg-white text-forest-deep border border-sand'}`}
          >
            {STATUS_LABELS[status]} ({items.filter((i) => i.status === status).length})
          </button>
        ))}
      </div>

      {ordenados.length === 0 ? (
        <EmptyState title="Nenhum conteúdo neste filtro" />
      ) : (
        <div className="space-y-3">
          {ordenados.map((item) => (
            <Link key={item.id} to={`/conteudos/${item.id}`}>
              <Card className="flex items-center justify-between hover:border-forest/40">
                <div>
                  <p className="font-medium text-forest-deep">{item.tituloInterno || item.tema}</p>
                  <p className="text-xs text-mist">{item.formato} · {item.finalidade}</p>
                </div>
                <StatusBadge status={item.status} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/conteudos`, confirm filter chips show correct counts and clicking each filters the list.

- [ ] **Step 3: Commit**

```bash
git add content-studio/src/pages/TodosConteudos.jsx
git commit -m "feat: build Todos os Conteúdos list with status filter"
```

---

### Task 14: Criar Conteúdo (wizard)

**Files:**
- Modify: `content-studio/src/pages/CriarConteudo.jsx` (replaces Task 10 placeholder)

**Interfaces:**
- Consumes: `useContentItems().criar` (Task 5), `useBrandGuide()` (Task 3), `montarPrompt` (Task 6), all option lists (Task 3), `useNavigate` from `react-router-dom`.
- Produces: on submit, creates a `contentItem` with `promptGerado` already filled and navigates to `/conteudos/:id`.

- [ ] **Step 1: Write `src/pages/CriarConteudo.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContentItems } from '../hooks/useContentItems'
import { useBrandGuide } from '../hooks/useBrandGuide'
import { montarPrompt } from '../lib/promptBuilder'
import { FINALIDADES, FORMATOS, TEMAS, PROFUNDIDADES, TONS, TAMANHOS } from '../data/options'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const CAMPO_BASE = 'w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm font-ui focus:border-forest focus:outline-none'
const LABEL_BASE = 'block text-sm font-medium text-forest-deep mb-1'

const ESTADO_INICIAL = {
  finalidade: FINALIDADES[0],
  formato: FORMATOS[0],
  tema: TEMAS[0],
  publico: '',
  diaPrograma: '',
  objetivo: '',
  profundidade: PROFUNDIDADES[0],
  tom: TONS[0],
  tamanho: TAMANHOS[0],
  camposObrigatorios: '',
  palavrasIncluir: '',
  palavrasEvitar: '',
  chamadaAcao: '',
  observacoes: '',
  produtoRelacionado: '',
}

export default function CriarConteudo() {
  const [passo, setPasso] = useState('formulario')
  const [dados, setDados] = useState(ESTADO_INICIAL)
  const { criar } = useContentItems()
  const { guia } = useBrandGuide()
  const navigate = useNavigate()

  function atualizarCampo(campo, valor) {
    setDados((atual) => ({ ...atual, [campo]: valor }))
  }

  function confirmarECriar() {
    const escolhas = { ...dados, diaPrograma: dados.diaPrograma ? Number(dados.diaPrograma) : null }
    const promptGerado = montarPrompt({ brandGuide: guia, escolhas })
    const novo = criar({ ...escolhas, tituloInterno: `${dados.formato} · ${dados.tema}`, promptGerado })
    navigate(`/conteudos/${novo.id}`)
  }

  if (passo === 'resumo') {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Confira antes de gerar</h1>
        <Card className="space-y-2 text-sm">
          <p><strong>Finalidade:</strong> {dados.finalidade}</p>
          <p><strong>Formato:</strong> {dados.formato}</p>
          <p><strong>Tema:</strong> {dados.tema}</p>
          <p><strong>Público:</strong> {dados.publico || '—'}</p>
          <p><strong>Dia do programa:</strong> {dados.diaPrograma || '—'}</p>
          <p><strong>Objetivo:</strong> {dados.objetivo || '—'}</p>
          <p><strong>Profundidade:</strong> {dados.profundidade}</p>
          <p><strong>Tom:</strong> {dados.tom}</p>
          <p><strong>Tamanho:</strong> {dados.tamanho}</p>
          <p><strong>Chamada para ação:</strong> {dados.chamadaAcao || '—'}</p>
        </Card>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setPasso('formulario')}>Editar</Button>
          <Button onClick={confirmarECriar}>Gerar prompt</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Criar Conteúdo</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL_BASE}>Finalidade</label>
          <select className={CAMPO_BASE} value={dados.finalidade} onChange={(e) => atualizarCampo('finalidade', e.target.value)}>
            {FINALIDADES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Formato</label>
          <select className={CAMPO_BASE} value={dados.formato} onChange={(e) => atualizarCampo('formato', e.target.value)}>
            {FORMATOS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Tema</label>
          <select className={CAMPO_BASE} value={dados.tema} onChange={(e) => atualizarCampo('tema', e.target.value)}>
            {TEMAS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Público</label>
          <input className={CAMPO_BASE} value={dados.publico} onChange={(e) => atualizarCampo('publico', e.target.value)} placeholder="Ex.: participantes dos 90 dias" />
        </div>
        <div>
          <label className={LABEL_BASE}>Dia do programa (1–90, opcional)</label>
          <input type="number" min="1" max="90" className={CAMPO_BASE} value={dados.diaPrograma} onChange={(e) => atualizarCampo('diaPrograma', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Objetivo do conteúdo</label>
          <input className={CAMPO_BASE} value={dados.objetivo} onChange={(e) => atualizarCampo('objetivo', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Profundidade</label>
          <select className={CAMPO_BASE} value={dados.profundidade} onChange={(e) => atualizarCampo('profundidade', e.target.value)}>
            {PROFUNDIDADES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Tom</label>
          <select className={CAMPO_BASE} value={dados.tom} onChange={(e) => atualizarCampo('tom', e.target.value)}>
            {TONS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Tamanho</label>
          <select className={CAMPO_BASE} value={dados.tamanho} onChange={(e) => atualizarCampo('tamanho', e.target.value)}>
            {TAMANHOS.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL_BASE}>Produto/recurso do MWA relacionado</label>
          <input className={CAMPO_BASE} value={dados.produtoRelacionado} onChange={(e) => atualizarCampo('produtoRelacionado', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={LABEL_BASE}>Informações obrigatórias</label>
        <textarea className={CAMPO_BASE} rows={2} value={dados.camposObrigatorios} onChange={(e) => atualizarCampo('camposObrigatorios', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Palavras ou ideias que devem aparecer</label>
        <textarea className={CAMPO_BASE} rows={2} value={dados.palavrasIncluir} onChange={(e) => atualizarCampo('palavrasIncluir', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Palavras que devem ser evitadas</label>
        <textarea className={CAMPO_BASE} rows={2} value={dados.palavrasEvitar} onChange={(e) => atualizarCampo('palavrasEvitar', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Chamada para ação</label>
        <input className={CAMPO_BASE} value={dados.chamadaAcao} onChange={(e) => atualizarCampo('chamadaAcao', e.target.value)} />
      </div>
      <div>
        <label className={LABEL_BASE}>Observações pessoais</label>
        <textarea className={CAMPO_BASE} rows={3} value={dados.observacoes} onChange={(e) => atualizarCampo('observacoes', e.target.value)} />
      </div>

      <Button onClick={() => setPasso('resumo')}>Ver resumo</Button>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/criar`, fill the form, click "Ver resumo", confirm the summary reflects the choices, click "Gerar prompt", confirm it navigates to `/conteudos/:id` (Task 10 placeholder for now — Task 15 makes it functional).

- [ ] **Step 3: Commit**

```bash
git add content-studio/src/pages/CriarConteudo.jsx
git commit -m "feat: build Criar Conteudo wizard with summary step"
```

---

### Task 15: ContentEditor (Geração sem API + Resultado)

**Files:**
- Modify: `content-studio/src/pages/ContentEditor.jsx` (replaces Task 10 placeholder)

**Interfaces:**
- Consumes: `useContentItems()` (Task 5), `useBrandGuide()` (Task 3), `montarPrompt`/`INSTRUCOES_AJUSTE` (Task 6), `detectarAvisoSaude`/`encontrarPalavrasProibidas` (Task 7), `copiarTexto`/`baixarTxt`/`abrirJanelaImpressao` (Task 8), `useParams`/`useNavigate` from `react-router-dom`.

- [ ] **Step 1: Write `src/pages/ContentEditor.jsx`**

```jsx
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Copy, Download, Printer, Check, Archive, ClipboardPaste } from 'lucide-react'
import { useContentItems } from '../hooks/useContentItems'
import { useBrandGuide } from '../hooks/useBrandGuide'
import { montarPrompt, INSTRUCOES_AJUSTE } from '../lib/promptBuilder'
import { detectarAvisoSaude, encontrarPalavrasProibidas } from '../lib/contentReview'
import { copiarTexto, baixarTxt, abrirJanelaImpressao } from '../lib/exportUtils'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'

const BOTOES_AJUSTE = [
  ['regenerar', 'Regenerar'],
  ['mais_curto', 'Mais curto'],
  ['mais_humano', 'Mais humano'],
  ['mais_educativo', 'Mais educativo'],
  ['mais_acolhedor', 'Mais acolhedor'],
  ['mais_elegante', 'Mais elegante'],
  ['simplificar', 'Simplificar'],
  ['corrigir_portugues', 'Corrigir português'],
]

export default function ContentEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { obter, atualizar, remover } = useContentItems()
  const { guia } = useBrandGuide()
  const item = obter(id)
  const [rascunhoColado, setRascunhoColado] = useState('')

  const avisoSaude = useMemo(() => item && detectarAvisoSaude(item.textoConteudo), [item])
  const palavrasProibidasEncontradas = useMemo(
    () => (item ? encontrarPalavrasProibidas(item.textoConteudo, guia.palavrasProibidas) : []),
    [item, guia],
  )

  if (!item) {
    return (
      <div className="p-6">
        <p>Conteúdo não encontrado.</p>
        <Button variant="secondary" onClick={() => navigate('/conteudos')}>Voltar</Button>
      </div>
    )
  }

  function gerarNovoPrompt(chaveInstrucao) {
    const instrucaoExtra = INSTRUCOES_AJUSTE[chaveInstrucao]
    const prompt = montarPrompt({ brandGuide: guia, escolhas: item, instrucaoExtra })
    atualizar(item.id, {
      promptGerado: prompt,
      textoConteudo: '',
      historicoPrompts: [...item.historicoPrompts, { prompt, instrucaoExtra, criadoEm: new Date().toISOString() }],
    })
  }

  function salvarRespostaColada() {
    atualizar(item.id, { textoConteudo: rascunhoColado, status: item.status === 'ideia' ? 'rascunho' : item.status })
    setRascunhoColado('')
  }

  const precisaColarResposta = !item.textoConteudo

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>{item.tituloInterno}</h1>
        <StatusBadge status={item.status} />
      </div>

      {precisaColarResposta ? (
        <Card className="space-y-4">
          <p className="text-sm text-mist">1. Copie o prompt abaixo e cole no Claude.ai (ou outra IA). 2. Cole a resposta na caixa e clique em salvar.</p>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-forest-deep/5 p-4 text-xs">{item.promptGerado}</pre>
          <Button variant="secondary" onClick={() => copiarTexto(item.promptGerado)}><Copy size={16} /> Copiar prompt</Button>
          <textarea
            className="w-full rounded-xl border border-sand p-4 text-sm"
            rows={8}
            placeholder="Cole aqui a resposta gerada pela IA..."
            value={rascunhoColado}
            onChange={(e) => setRascunhoColado(e.target.value)}
          />
          <Button onClick={salvarRespostaColada} disabled={!rascunhoColado.trim()}><ClipboardPaste size={16} /> Salvar resposta</Button>
        </Card>
      ) : (
        <Card className="space-y-4">
          {avisoSaude && (
            <p className="rounded-xl bg-gold-soft/50 p-3 text-sm text-forest-deep">
              ⚠️ Este conteúdo contém informações relacionadas à saúde ou nutrição. Revise os dados antes da publicação.
            </p>
          )}
          {palavrasProibidasEncontradas.length > 0 && (
            <p className="rounded-xl bg-red-100 p-3 text-sm text-red-800">
              Palavras a revisar: {palavrasProibidasEncontradas.join(', ')}
            </p>
          )}
          <textarea
            className="w-full rounded-xl border border-sand p-4 text-sm"
            rows={10}
            value={item.textoConteudo}
            onChange={(e) => atualizar(item.id, { textoConteudo: e.target.value })}
          />

          <div className="flex flex-wrap gap-2">
            {BOTOES_AJUSTE.map(([chave, rotulo]) => (
              <Button key={chave} variant="secondary" onClick={() => gerarNovoPrompt(chave)}>{rotulo}</Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-sand pt-4">
            <Button variant="secondary" onClick={() => copiarTexto(item.textoConteudo)}><Copy size={16} /> Copiar</Button>
            <Button variant="secondary" onClick={() => baixarTxt(item.tituloInterno, item.textoConteudo)}><Download size={16} /> Exportar TXT</Button>
            <Button variant="secondary" onClick={() => abrirJanelaImpressao(item.tituloInterno, item.textoConteudo)}><Printer size={16} /> Exportar PDF / Imprimir</Button>
            <Button variant="secondary" onClick={() => atualizar(item.id, { status: 'rascunho' })}>Salvar como rascunho</Button>
            <Button onClick={() => atualizar(item.id, { status: 'aprovado' })}><Check size={16} /> Aprovar</Button>
            <Button variant="secondary" onClick={() => atualizar(item.id, { status: 'arquivado' })}><Archive size={16} /> Arquivar</Button>
            <Button variant="danger" onClick={() => { remover(item.id); navigate('/conteudos') }}>Excluir</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open a demo item with existing `textoConteudo` (e.g. "Dica de hidratação (exemplo)") from `/conteudos` — confirm the editor view shows directly with action buttons. Open a demo item without `textoConteudo` (e.g. "Desafio do fim de semana (exemplo)") — confirm the prompt/paste view shows instead. Click "Copiar prompt", "Mais curto" (confirm it regenerates the prompt and returns to the paste view), paste text and save, click "Aprovar" and confirm the badge updates. Test on a real health-related demo item (hidratação) and confirm the health-disclaimer banner appears.

- [ ] **Step 3: Commit**

```bash
git add content-studio/src/pages/ContentEditor.jsx
git commit -m "feat: build ContentEditor with Modo sem API flow and review banners"
```

---

### Task 16: Modelos Prontos (library + detail)

**Files:**
- Modify: `content-studio/src/pages/ModelosProntos.jsx` (replaces Task 10 placeholder)
- Modify: `content-studio/src/pages/ModeloDetalhe.jsx` (replaces Task 10 placeholder)

**Interfaces:**
- Consumes: `useTemplates()` (Task 4), `useContentItems().criar` (Task 5), `Card`/`Button`/`ConfirmDialog` (Task 9).
- Produces: "Usar este modelo" on `ModeloDetalhe` creates a `contentItem` pre-filled with `formato: template.formato`, `tema: template.categoria`, `textoConteudo: template.conteudoModelo`, `status: 'rascunho'`, and navigates to `/conteudos/:id`.

- [ ] **Step 1: Write `src/pages/ModelosProntos.jsx`**

```jsx
import { Link } from 'react-router-dom'
import { useTemplates } from '../hooks/useTemplates'
import { Card } from '../components/ui/Card'

export default function ModelosProntos() {
  const { templates } = useTemplates()
  const categorias = [...new Set(templates.map((t) => t.categoria))]

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Modelos Prontos</h1>
      {categorias.map((categoria) => (
        <div key={categoria} className="space-y-3">
          <h2 className="font-semibold text-forest-deep">{categoria}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.filter((t) => t.categoria === categoria).map((t) => (
              <Link key={t.id} to={`/modelos/${t.id}`}>
                <Card className="h-full hover:border-forest/40">
                  <p className="font-medium text-forest-deep">{t.nome}</p>
                  <p className="mt-1 text-xs text-mist">{t.formato}</p>
                  <p className="mt-3 line-clamp-3 text-sm text-forest-deep/80">{t.conteudoModelo}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Write `src/pages/ModeloDetalhe.jsx`**

```jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTemplates } from '../hooks/useTemplates'
import { useContentItems } from '../hooks/useContentItems'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

export default function ModeloDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { obter, atualizar, remover, duplicar } = useTemplates()
  const { criar } = useContentItems()
  const template = obter(id)
  const [editando, setEditando] = useState(false)
  const [texto, setTexto] = useState(template?.conteudoModelo || '')
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  if (!template) return <div className="p-6">Modelo não encontrado.</div>

  function usarModelo() {
    const novo = criar({
      finalidade: 'Conteúdo interno do MWA',
      formato: template.formato,
      tema: template.categoria,
      profundidade: 'Intermediário',
      tom: 'Acolhedor',
      tamanho: 'Médio',
      textoConteudo: template.conteudoModelo,
      status: 'rascunho',
      tituloInterno: `${template.nome} (a partir de modelo)`,
    })
    navigate(`/conteudos/${novo.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>{template.nome}</h1>
      <Card className="space-y-4">
        {editando ? (
          <textarea className="w-full rounded-xl border border-sand p-4 text-sm" rows={8} value={texto} onChange={(e) => setTexto(e.target.value)} />
        ) : (
          <pre className="whitespace-pre-wrap text-sm text-forest-deep">{template.conteudoModelo}</pre>
        )}
        <div className="flex flex-wrap gap-2">
          <Button onClick={usarModelo}>Usar este modelo</Button>
          {editando ? (
            <Button variant="secondary" onClick={() => { atualizar(template.id, { conteudoModelo: texto }); setEditando(false) }}>Salvar edição</Button>
          ) : (
            <Button variant="secondary" onClick={() => setEditando(true)}>Editar</Button>
          )}
          <Button variant="secondary" onClick={() => duplicar(template.id)}>Duplicar</Button>
          <Button variant="danger" onClick={() => setConfirmandoExclusao(true)}>Excluir</Button>
        </div>
      </Card>
      <ConfirmDialog
        open={confirmandoExclusao}
        title="Excluir este modelo?"
        description="Essa ação não pode ser desfeita."
        onCancel={() => setConfirmandoExclusao(false)}
        onConfirm={() => { remover(template.id); navigate('/modelos') }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open `/modelos`, confirm templates are grouped by category with real (non-placeholder) copy visible. Open one, click "Usar este modelo", confirm it navigates to a new `/conteudos/:id` in the editor view (not the paste-prompt view, since `textoConteudo` is pre-filled). Test "Duplicar" and "Excluir" (with confirm dialog).

- [ ] **Step 4: Commit**

```bash
git add content-studio/src/pages/ModelosProntos.jsx content-studio/src/pages/ModeloDetalhe.jsx
git commit -m "feat: build Modelos Prontos library and detail/use flow"
```

---

### Task 17: Guia da Marca

**Files:**
- Modify: `content-studio/src/pages/GuiaDaMarca.jsx` (replaces Task 10 placeholder)

**Interfaces:**
- Consumes: `useBrandGuide()` (Task 3), `baixarJson`/`abrirJanelaImpressao` (Task 8).

- [ ] **Step 1: Write `src/pages/GuiaDaMarca.jsx`**

```jsx
import { useState } from 'react'
import { Download, Printer, Save } from 'lucide-react'
import { useBrandGuide } from '../hooks/useBrandGuide'
import { baixarJson, abrirJanelaImpressao } from '../lib/exportUtils'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

const CAMPO_BASE = 'w-full rounded-xl border border-sand bg-white px-4 py-3 text-sm font-ui focus:border-forest focus:outline-none'
const LABEL_BASE = 'block text-sm font-medium text-forest-deep mb-1'

function listaParaTexto(lista) {
  return lista.join('\n')
}

function textoParaLista(texto) {
  return texto.split('\n').map((l) => l.trim()).filter(Boolean)
}

export default function GuiaDaMarca() {
  const { guia, salvar } = useBrandGuide()
  const [form, setForm] = useState(guia)

  function campo(chave, valor) {
    setForm((atual) => ({ ...atual, [chave]: valor }))
  }

  function salvarTudo() {
    salvar(form)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Guia da Marca</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => baixarJson('guia-da-marca-mwa', guia)}><Download size={16} /> Exportar</Button>
          <Button variant="secondary" onClick={() => abrirJanelaImpressao('Guia da Marca MWA', JSON.stringify(guia, null, 2))}><Printer size={16} /> Imprimir</Button>
        </div>
      </div>

      <Card className="space-y-4">
        <div>
          <label className={LABEL_BASE}>Nome</label>
          <input className={CAMPO_BASE} value={form.nome} onChange={(e) => campo('nome', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Nome completo</label>
          <input className={CAMPO_BASE} value={form.nomeCompleto} onChange={(e) => campo('nomeCompleto', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Assinatura</label>
          <input className={CAMPO_BASE} value={form.assinatura} onChange={(e) => campo('assinatura', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Slogan institucional</label>
          <input className={CAMPO_BASE} value={form.slogan} onChange={(e) => campo('slogan', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Posicionamento</label>
          <textarea className={CAMPO_BASE} rows={4} value={form.posicionamento} onChange={(e) => campo('posicionamento', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Público</label>
          <textarea className={CAMPO_BASE} rows={3} value={form.publico} onChange={(e) => campo('publico', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Tom de voz (um por linha)</label>
          <textarea className={CAMPO_BASE} rows={4} value={listaParaTexto(form.tomDeVoz)} onChange={(e) => campo('tomDeVoz', textoParaLista(e.target.value))} />
        </div>
        <div>
          <label className={LABEL_BASE}>Palavras recomendadas (uma por linha)</label>
          <textarea className={CAMPO_BASE} rows={3} value={listaParaTexto(form.palavrasRecomendadas)} onChange={(e) => campo('palavrasRecomendadas', textoParaLista(e.target.value))} />
        </div>
        <div>
          <label className={LABEL_BASE}>Palavras proibidas (uma por linha)</label>
          <textarea className={CAMPO_BASE} rows={4} value={listaParaTexto(form.palavrasProibidas)} onChange={(e) => campo('palavrasProibidas', textoParaLista(e.target.value))} />
        </div>
        <div>
          <label className={LABEL_BASE}>Regras de saúde</label>
          <textarea className={CAMPO_BASE} rows={3} value={form.regrasSaude} onChange={(e) => campo('regrasSaude', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Diretrizes visuais</label>
          <textarea className={CAMPO_BASE} rows={3} value={form.diretrizesVisuais} onChange={(e) => campo('diretrizesVisuais', e.target.value)} />
        </div>
        <div>
          <label className={LABEL_BASE}>Exemplos aprovados (um por linha)</label>
          <textarea className={CAMPO_BASE} rows={4} value={listaParaTexto(form.exemplosAprovados)} onChange={(e) => campo('exemplosAprovados', textoParaLista(e.target.value))} />
        </div>

        <Button onClick={salvarTudo}><Save size={16} /> Salvar Guia da Marca</Button>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/marca`, confirm every field is pre-filled with the seed content from Task 3. Edit the slogan, click "Salvar Guia da Marca", reload the page, confirm the edit persisted. Go to `/criar`, create a content item, and confirm (by inspecting `promptGerado` on `/conteudos/:id`) that the new slogan appears in the generated prompt.

- [ ] **Step 3: Commit**

```bash
git add content-studio/src/pages/GuiaDaMarca.jsx
git commit -m "feat: build editable Guia da Marca screen"
```

---

### Task 18: Configurações (backup, restore, apagar dados de demonstração)

**Files:**
- Modify: `content-studio/src/pages/Configuracoes.jsx` (replaces Task 10 placeholder)

**Interfaces:**
- Consumes: `exportarBackup`/`restaurarBackup` (Task 8), `baixarJson` (Task 8), `useContentItems().apagarDemo` (Task 5), `ConfirmDialog` (Task 9).

- [ ] **Step 1: Write `src/pages/Configuracoes.jsx`**

```jsx
import { useRef, useState } from 'react'
import { Download, Upload, Trash2 } from 'lucide-react'
import { exportarBackup, restaurarBackup } from '../lib/backup'
import { baixarJson } from '../lib/exportUtils'
import { useContentItems } from '../hooks/useContentItems'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

export default function Configuracoes() {
  const { apagarDemo } = useContentItems()
  const [confirmandoApagarDemo, setConfirmandoApagarDemo] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const inputArquivoRef = useRef(null)

  function baixarBackup() {
    baixarJson(`mwa-content-studio-backup-${new Date().toISOString().slice(0, 10)}`, exportarBackup())
  }

  async function restaurarArquivo(evento) {
    const arquivo = evento.target.files?.[0]
    if (!arquivo) return
    try {
      const texto = await arquivo.text()
      restaurarBackup(JSON.parse(texto))
      setMensagem('Backup restaurado. Recarregando...')
      setTimeout(() => window.location.reload(), 1200)
    } catch {
      setMensagem('Não foi possível ler esse arquivo de backup.')
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Configurações</h1>

      <Card className="space-y-3">
        <h2 className="font-semibold text-forest-deep">Backup</h2>
        <p className="text-sm text-mist">Seus dados ficam salvos apenas neste navegador. Baixe um backup de tempos em tempos para não perder nada.</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={baixarBackup}><Download size={16} /> Baixar backup</Button>
          <Button variant="secondary" onClick={() => inputArquivoRef.current?.click()}><Upload size={16} /> Restaurar backup</Button>
          <input ref={inputArquivoRef} type="file" accept="application/json" className="hidden" onChange={restaurarArquivo} />
        </div>
        {mensagem && <p className="text-sm text-forest">{mensagem}</p>}
      </Card>

      <Card className="space-y-3">
        <h2 className="font-semibold text-forest-deep">Dados de demonstração</h2>
        <p className="text-sm text-mist">Remove apenas os conteúdos de exemplo marcados como demonstração — seus conteúdos reais não são afetados.</p>
        <Button variant="danger" onClick={() => setConfirmandoApagarDemo(true)}><Trash2 size={16} /> Apagar dados de demonstração</Button>
      </Card>

      <ConfirmDialog
        open={confirmandoApagarDemo}
        title="Apagar dados de demonstração?"
        description="Os conteúdos de exemplo serão removidos. Seus conteúdos reais permanecem."
        onCancel={() => setConfirmandoApagarDemo(false)}
        onConfirm={() => { apagarDemo(); setConfirmandoApagarDemo(false) }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `/configuracoes`, click "Baixar backup" (confirm a `.json` file downloads), click "Apagar dados de demonstração", confirm the dialog, confirm demo items disappear from `/conteudos` while any real item you created earlier remains. Use "Restaurar backup" with the previously downloaded file and confirm the page reloads with the demo items back.

- [ ] **Step 3: Commit**

```bash
git add content-studio/src/pages/Configuracoes.jsx
git commit -m "feat: build Configuracoes screen with backup, restore, and demo wipe"
```

---

### Task 19: README and full manual walkthrough

**Files:**
- Create: `content-studio/README.md`

**Interfaces:**
- None — this task is documentation plus an end-to-end manual verification pass covering spec §9.

- [ ] **Step 1: Write `content-studio/README.md`**

```markdown
# MWA Content Studio

Central de conteúdo interna do MWA — não é acessada pelas participantes do programa.

## Rodar localmente

1. Abra uma pasta de terminal dentro de `content-studio/`.
2. Rode `npm install` (só na primeira vez).
3. Rode `npm run dev`.
4. Abra o endereço que aparecer no terminal (algo como `http://localhost:5173`).

Todos os dados ficam salvos no seu navegador (localStorage) — nada é enviado para a internet.

## Publicar no Netlify

1. Rode `npm run build` dentro de `content-studio/` — isso cria a pasta `dist/`.
2. No painel do Netlify, crie um novo site apontando para a pasta `content-studio/`.
3. Configuração de build: comando `npm run build`, pasta de publicação `dist`.
4. Cada vez que quiser atualizar o site publicado, rode o build de novo e publique a nova pasta `dist/` (ou conecte ao GitHub para publicar automaticamente a cada alteração).

## O que funciona sem inteligência artificial

Tudo: planejar o conteúdo, preencher o formulário, gerar o prompt para copiar, guardar rascunhos, aprovar, organizar por status, usar e editar modelos prontos, editar o Guia da Marca, exportar em TXT/PDF, fazer backup e restaurar.

## O que depende de colar em uma IA (Claude, por exemplo)

Somente a redação do texto final. O app nunca chama nenhuma IA sozinho — ele monta o prompt, você copia, cola no Claude.ai (ou outra ferramenta), e cola a resposta de volta no app.

## Apagar apenas os dados de demonstração

Vá em Configurações → "Apagar dados de demonstração". Seus conteúdos reais nunca são apagados por esse botão.
```

- [ ] **Step 2: Full manual walkthrough**

With `npm run dev` running, verify end to end: create a content item from scratch via the wizard → generate prompt → copy it → paste a simulated response → edit → approve → confirm it shows as "Aprovado" on the Painel; open a Modelo Pronto and use it as a starting point; edit the Guia da Marca and confirm a newly generated prompt reflects the change; download a backup, apagar dados de demonstração, restore the backup and confirm demo items return; resize the browser to mobile width and confirm the bottom nav and forms remain usable; export a content item as TXT and as PDF/print.

- [ ] **Step 3: Commit**

```bash
git add content-studio/README.md
git commit -m "docs: add README with local run and Netlify publish instructions"
```
