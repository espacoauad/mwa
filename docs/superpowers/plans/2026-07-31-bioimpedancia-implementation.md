# Bioimpedância na Pesagem & Evolução — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add optional bioimpedance data capture (% gordura, % músculo, gordura visceral, idade metabólica, tórax, circ. abdominal) to weekly weighing modal with intelligent toggle-based UI that remembers previous selections, and display evolution metrics in the "Minha Evolução" screen.

**Architecture:** 
- Phase 1: Database schema (add JSONB column)
- Phase 2: TypeScript types & validation functions
- Phase 3: Modal UI with toggles + pre-population logic
- Phase 4: AppContext save/load functions
- Phase 5: Evolution screen with metrics display & variation calculation
- Phase 6: E2E testing

**Tech Stack:** React, TypeScript, Supabase (PostgreSQL + JSONB), Vitest/Jest

## Global Constraints

- Branch: `security/correcoes-criticas`
- Database: Supabase (kfavxgrvikflzyzvcoyb)
- File naming: camelCase for functions, PascalCase for components
- Bioimpedancia data stored as optional JSONB (null if not registered)
- Input validation: ranges enforced UI-side (no DB constraints)
- Only active toggles (checked) are saved; empty fields ignored

---

## File Structure

**Files to Create:**
- `src/utils/bioimpedancia.ts` — Validation & type definitions
- `src/components/pesagem/BioimpedanciaToggleSection.jsx` — Reusable toggle UI

**Files to Modify:**
- `src/context/AppContext.jsx` — Update load/save pesagem functions
- `src/components/pesagem/ModalPesagem.jsx` — Add bioimpedancia section
- `src/components/hoje/SeuProgresso.jsx` — Add evolution display
- `src/lib/supabase.js` — No changes (schema already supports JSONB)

**Database:**
- Add column `bioimpedancia JSONB DEFAULT NULL` to `mwa_pesagens`

---

## Phase 1: Database Setup

### Task 1: Add Bioimpedancia Column to mwa_pesagens

**Files:**
- Database: `mwa_pesagens` table
- Documentation: Add migration note to project

**Why:** JSONB column to store variable bioimpedance data per weighing

- [ ] **Step 1: Create migration file**

```bash
# Note: If using Supabase migrations, create this manually in SQL Editor
# Or document the manual SQL run

# SQL to execute in Supabase Dashboard → SQL Editor:
ALTER TABLE mwa_pesagens ADD COLUMN IF NOT EXISTS bioimpedancia JSONB DEFAULT NULL;

-- Verify column exists:
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'mwa_pesagens' AND column_name = 'bioimpedancia';
```

- [ ] **Step 2: Run migration in Supabase**

Navigate to: `https://supabase.com/dashboard/project/kfavxgrvikflzyzvcoyb/sql`

Copy the ALTER TABLE statement above and execute it.

Expected output: "Query successful" + column appears in Table Editor

- [ ] **Step 3: Verify in Table Editor**

Supabase Dashboard → Table Editor → `mwa_pesagens` → scroll right → verify `bioimpedancia JSONB` column exists

- [ ] **Step 4: Commit note**

```bash
cd "C:\Users\wanes\OneDrive\Desktop\MWA"
git add -A
git commit -m "db: add bioimpedancia JSONB column to mwa_pesagens

- Stores optional bioimpedance metrics per weighing
- Fields: percentualGordura, percentualMusculo, gorduraVisceral, 
          idadeMetabolica, toraxCm, circAbdominalCm
- NULL if no bioimpedance data for that weighing"
```

---

## Phase 2: Types & Validation

### Task 2: Create Bioimpedancia Types & Constants

**Files:**
- Create: `src/utils/bioimpedancia.ts`

**Interfaces:**
- Produces: `BioimpedanciaData`, `BioimpedanciaMetrica`, `BIOIMPEDANCIA_METRICAS` constant

- [ ] **Step 1: Create file with TypeScript types**

Create file `src/utils/bioimpedancia.ts`:

```typescript
// Tipos de dados de bioimpedância
export interface BioimpedanciaData {
  percentualGordura?: number       // 0-100, unit: %
  percentualMusculo?: number       // 0-100, unit: %
  gorduraVisceral?: number         // 0-200, unit: visceral fat rating
  idadeMetabolica?: number         // 0-150, unit: years
  toraxCm?: number                 // 0-999, unit: cm
  circAbdominalCm?: number         // 0-999, unit: cm
}

// Metadados de cada métrica (para UI e validação)
export interface BioimpedanciaMetrica {
  key: keyof BioimpedanciaData
  label: string
  unidade: string
  minVal: number
  maxVal: number
  dica: string
  melhorEhMenor: boolean  // true = gordura (menor é melhor), false = músculo (maior é melhor)
}

// Constantes de métricas
export const BIOIMPEDANCIA_METRICAS: BioimpedanciaMetrica[] = [
  {
    key: 'percentualGordura',
    label: '% Gordura Corporal',
    unidade: '%',
    minVal: 0,
    maxVal: 100,
    dica: 'Percentual de gordura no corpo',
    melhorEhMenor: true,
  },
  {
    key: 'percentualMusculo',
    label: '% Músculo',
    unidade: '%',
    minVal: 0,
    maxVal: 100,
    dica: 'Percentual de massa magra/muscular',
    melhorEhMenor: false,
  },
  {
    key: 'gorduraVisceral',
    label: 'Gordura Visceral',
    unidade: '',
    minVal: 0,
    maxVal: 200,
    dica: 'Gordura interna ao redor dos órgãos (0-200)',
    melhorEhMenor: true,
  },
  {
    key: 'idadeMetabolica',
    label: 'Idade Metabólica',
    unidade: ' anos',
    minVal: 0,
    maxVal: 150,
    dica: 'Idade biológica estimada do seu metabolismo',
    melhorEhMenor: true,
  },
  {
    key: 'toraxCm',
    label: 'Tórax',
    unidade: ' cm',
    minVal: 0,
    maxVal: 999,
    dica: 'Medida da circunferência do tórax',
    melhorEhMenor: false,
  },
  {
    key: 'circAbdominalCm',
    label: 'Circ. Abdominal',
    unidade: ' cm',
    minVal: 0,
    maxVal: 999,
    dica: 'Medida da circunferência abdominal',
    melhorEhMenor: true,
  },
]

// Mapa para acesso rápido
export const BIOIMPEDANCIA_MAP = new Map(
  BIOIMPEDANCIA_METRICAS.map((m) => [m.key, m])
)
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/bioimpedancia.ts
git commit -m "types: add BioimpedanciaData types and BIOIMPEDANCIA_METRICAS constants"
```

---

## Phase 2 (cont): Validation

### Task 3: Create Validation Function

**Files:**
- Modify: `src/utils/bioimpedancia.ts` (append)

**Interfaces:**
- Consumes: `BioimpedanciaData`, `BIOIMPEDANCIA_MAP` (from Task 2)
- Produces: `validarBioimpedancia(data: BioimpedanciaData): { valid: boolean; erros: Record<string, string> }`

- [ ] **Step 1: Add validation function to bioimpedancia.ts**

Append to `src/utils/bioimpedancia.ts`:

```typescript
// Validação de dados
export interface ValidationResult {
  valid: boolean
  erros: Record<string, string>
}

export function validarBioimpedancia(data: BioimpedanciaData): ValidationResult {
  const erros: Record<string, string> = {}

  for (const [key, valor] of Object.entries(data)) {
    if (valor === null || valor === undefined) continue // Optional fields

    const metrica = BIOIMPEDANCIA_MAP.get(key as keyof BioimpedanciaData)
    if (!metrica) continue

    const numVal = Number(valor)

    if (isNaN(numVal)) {
      erros[key] = `${metrica.label} deve ser um número`
      continue
    }

    if (numVal < metrica.minVal || numVal > metrica.maxVal) {
      erros[key] = `${metrica.label} deve estar entre ${metrica.minVal} e ${metrica.maxVal}${metrica.unidade}`
    }
  }

  return {
    valid: Object.keys(erros).length === 0,
    erros,
  }
}

// Helper: build apenas os campos com valores (ignora nulls)
export function filterBioimpedanciaData(data: Partial<BioimpedanciaData>): BioimpedanciaData | null {
  const filtered: BioimpedanciaData = {}

  for (const [key, valor] of Object.entries(data)) {
    if (valor !== null && valor !== undefined && valor !== '') {
      filtered[key as keyof BioimpedanciaData] = Number(valor)
    }
  }

  return Object.keys(filtered).length > 0 ? filtered : null
}
```

- [ ] **Step 2: Write unit tests**

Create file `src/utils/bioimpedancia.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  validarBioimpedancia,
  filterBioimpedanciaData,
  BioimpedanciaData,
} from './bioimpedancia'

describe('validarBioimpedancia', () => {
  it('should accept valid data', () => {
    const data: BioimpedanciaData = {
      percentualGordura: 23.5,
      percentualMusculo: 44.6,
    }
    const result = validarBioimpedancia(data)
    expect(result.valid).toBe(true)
    expect(result.erros).toEqual({})
  })

  it('should reject percentualGordura > 100', () => {
    const data: BioimpedanciaData = { percentualGordura: 150 }
    const result = validarBioimpedancia(data)
    expect(result.valid).toBe(false)
    expect(result.erros.percentualGordura).toContain('entre 0 e 100')
  })

  it('should reject percentualGordura < 0', () => {
    const data: BioimpedanciaData = { percentualGordura: -5 }
    const result = validarBioimpedancia(data)
    expect(result.valid).toBe(false)
  })

  it('should ignore null/undefined fields', () => {
    const data = {
      percentualGordura: 25,
      percentualMusculo: undefined,
    }
    const result = validarBioimpedancia(data)
    expect(result.valid).toBe(true)
  })

  it('should reject non-numeric values', () => {
    const data = {
      percentualGordura: 'abc' as any,
    }
    const result = validarBioimpedancia(data)
    expect(result.valid).toBe(false)
    expect(result.erros.percentualGordura).toContain('número')
  })
})

describe('filterBioimpedanciaData', () => {
  it('should return only non-null values', () => {
    const data = {
      percentualGordura: 23.5,
      percentualMusculo: null,
      gorduraVisceral: 4,
    }
    const filtered = filterBioimpedanciaData(data)
    expect(filtered).toEqual({
      percentualGordura: 23.5,
      gorduraVisceral: 4,
    })
  })

  it('should return null if all fields are empty', () => {
    const data = {
      percentualGordura: null,
      percentualMusculo: undefined,
    }
    const filtered = filterBioimpedanciaData(data)
    expect(filtered).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests**

```bash
cd "C:\Users\wanes\OneDrive\Desktop\MWA"
npm test -- src/utils/bioimpedancia.test.ts
```

Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/utils/bioimpedancia.ts src/utils/bioimpedancia.test.ts
git commit -m "feat: add bioimpedancia validation and filtering functions

- validarBioimpedancia: validates ranges and data types
- filterBioimpedanciaData: removes null/empty fields before saving
- Full test coverage for edge cases"
```

---

## Checkpoint 1: Database + Types Complete ✓

**Completed:**
- ✅ Task 1: Database column added
- ✅ Task 2: Types created
- ✅ Task 3: Validation functions + tests

**Ready to proceed?** Y/N

---

## Phase 3: Modal UI

### Task 4: Create Bioimpedancia Toggle Section Component

**Files:**
- Create: `src/components/pesagem/BioimpedanciaToggleSection.jsx`

**Interfaces:**
- Consumes: `BioimpedanciaData`, `BIOIMPEDANCIA_METRICAS` (from Task 2)
- Produces: Component `<BioimpedanciaToggleSection toggles={} values={} onToggleChange={} onValueChange={} validacoes={} />`

- [ ] **Step 1: Create reusable toggle component**

Create file `src/components/pesagem/BioimpedanciaToggleSection.jsx`:

```jsx
import { BIOIMPEDANCIA_METRICAS } from '../../utils/bioimpedancia'

export default function BioimpedanciaToggleSection({
  toggles,
  values,
  onToggleChange,
  onValueChange,
  validacoes = {},
}) {
  return (
    <div className="mt-6 space-y-4 border-t border-verde/20 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-verde/70">
          📊 Dados de Bioimpedância <span className="text-xs text-verde/50">(opcional)</span>
        </h3>
        <p className="text-xs text-verde/60">Ative conforme seu equipamento</p>
      </div>

      {/* Toggle list */}
      <div className="space-y-3">
        {BIOIMPEDANCIA_METRICAS.map((metrica) => {
          const isActive = toggles?.[metrica.key]
          const value = values?.[metrica.key] ?? ''
          const erro = validacoes?.[metrica.key]
          const temErro = !!erro

          return (
            <div
              key={metrica.key}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                temErro
                  ? 'border-ouro/50 bg-ouro/5'
                  : isActive
                    ? 'border-verde/20 bg-verde/5'
                    : 'border-verde/10 bg-transparent'
              }`}
            >
              {/* Toggle checkbox */}
              <input
                type="checkbox"
                id={`bio-${metrica.key}`}
                checked={isActive ?? false}
                onChange={(e) => onToggleChange(metrica.key, e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-verde"
              />

              {/* Label */}
              <label
                htmlFor={`bio-${metrica.key}`}
                className="cursor-pointer text-sm font-medium text-verde"
                title={metrica.dica}
              >
                {metrica.label}
              </label>

              {/* Input field (only if active) */}
              {isActive && (
                <input
                  type="number"
                  placeholder={`${metrica.minVal}-${metrica.maxVal}`}
                  min={metrica.minVal}
                  max={metrica.maxVal}
                  step={metrica.key.includes('percentual') ? '0.1' : '0.5'}
                  value={value}
                  onChange={(e) => onValueChange(metrica.key, e.target.value)}
                  className={`ml-auto w-24 rounded border px-2 py-1 text-sm text-verde transition-colors ${
                    temErro
                      ? 'border-ouro/50 bg-ouro/5 focus:border-ouro'
                      : 'border-verde/20 focus:border-verde'
                  }`}
                />
              )}

              {/* Unit label (only if active) */}
              {isActive && (
                <span className="text-xs text-verde/60">{metrica.unidade}</span>
              )}

              {/* Error message */}
              {temErro && (
                <div className="absolute mt-1 text-xs text-ouro">{erro}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/pesagem/BioimpedanciaToggleSection.jsx
git commit -m "feat: create BioimpedanciaToggleSection reusable component

- Displays all 6 bioimpedancia metrics with toggles
- Shows input field only when toggle is active
- Real-time validation feedback with error display
- Follows MWA design system"
```

---

## Continue? (Y to proceed with Task 5, checkpoint after each task)

