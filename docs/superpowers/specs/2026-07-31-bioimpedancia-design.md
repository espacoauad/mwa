# Bioimpedância na Pesagem & Evolução — Design Spec

**Date:** 2026-07-31  
**Status:** APPROVED  
**Scope:** Add optional bioimpedance data (% gordura, % músculo, gordura visceral, idade metabólica, tórax, circ. abdominal) to weighing modal and evolution tracking

---

## 1. Overview

### Goal
Allow clients to optionally register bioimpedance data during weekly weighing sessions, with intelligent toggle-based UI that remembers their previous selections and displays evolution metrics in the "Minha Evolução" screen.

### Why
- Clients with bioimpedance scales want to track composition (not just weight)
- Different scales measure different metrics → need flexible capture
- Visual feedback (% muscle gain, fat loss) is motivating beyond weight alone
- Data is already collected by clients offline; we're just capturing it

### Success Criteria
- ✅ Client can toggle bioimpedance fields on/off during weighing
- ✅ System remembers which fields were active in previous weighing
- ✅ Bioimpedance data persists in database and displays in evolution screen
- ✅ Only registered metrics appear in evolution (no empty fields)
- ✅ Week-to-week variation calculated and displayed for each metric

---

## 2. Data Model

### Database Schema (mwa_pesagens)

**New column:** `bioimpedancia` (JSONB)

```sql
ALTER TABLE mwa_pesagens ADD COLUMN bioimpedancia JSONB DEFAULT NULL;

-- Example entry:
{
  "percentualGordura": 23.5,
  "percentualMusculo": 44.6,
  "gorduraVisceral": 4,
  "idadeMetabolica": 42,
  "toraxCm": 88,
  "circAbdominalCm": 81
}
```

**Constraints:**
- All fields optional (any subset can be NULL)
- Numeric fields only (no validation in DB — app enforces ranges)
- No required fields (client chooses what to register)

### TypeScript Types

```typescript
interface BioimpedanciaData {
  percentualGordura?: number       // 0-100, unit: %
  percentualMusculo?: number       // 0-100, unit: %
  gorduraVisceral?: number         // 0-200, unit: visceral fat rating
  idadeMetabolica?: number         // 0-150, unit: years
  toraxCm?: number                 // 0-999, unit: cm
  circAbdominalCm?: number         // 0-999, unit: cm
}

interface Pesagem {
  id: string
  user_id: string
  data: string                    // ISO date
  semana: number
  peso: number
  medidas?: {
    cintura?: number
    quadril?: number
    peito?: number
  }
  bioimpedancia?: BioimpedanciaData  // ← NEW
  criado_em: string
  atualizado_em: string
}
```

---

## 3. UI & Components

### 3.1 Modal de Pesagem (Updated)

**File:** `src/components/pesagem/ModalPesagem.jsx` (existing, will be updated)

**New section: Bioimpedância toggles**

```jsx
// Inside ModalPesagem component

const [bioimpedanciaToggles, setBioimpedanciaToggles] = useState({
  percentualGordura: false,
  percentualMusculo: false,
  gorduraVisceral: false,
  idadeMetabolica: false,
  toraxCm: false,
  circAbdominalCm: false,
})

const [bioimpedanciaValues, setBioimpedanciaValues] = useState({
  percentualGordura: '',
  percentualMusculo: '',
  gorduraVisceral: '',
  idadeMetabolica: '',
  toraxCm: '',
  circAbdominalCm: '',
})

// On mount: if editing existing pesagem, pre-populate toggles & values
useEffect(() => {
  if (pesagemParaEditar?.bioimpedancia) {
    const toggles = {}
    const valores = {}
    
    Object.entries(pesagemParaEditar.bioimpedancia).forEach(([key, val]) => {
      toggles[key] = val !== null && val !== undefined
      valores[key] = val || ''
    })
    
    setBioimpedanciaToggles(toggles)
    setBioimpedanciaValues(valores)
  } else if (ultimaPesagem?.bioimpedancia) {
    // Pre-mark toggles from last weighing
    const toggles = {}
    Object.keys(ultimaPesagem.bioimpedancia).forEach(key => {
      toggles[key] = ultimaPesagem.bioimpedancia[key] !== null
    })
    setBioimpedanciaToggles(toggles)
  }
}, [pesagemParaEditar, ultimaPesagem])

// Render: only show input field if toggle is ON
return (
  <div className="mt-6 space-y-4 border-t border-verde/20 pt-6">
    <div className="space-y-1">
      <h3 className="text-sm font-semibold text-verde/70">
        📊 Dados de Bioimpedância <span className="text-xs text-verde/50">(opcional)</span>
      </h3>
      <p className="text-xs text-verde/60">Ative conforme seu equipamento</p>
    </div>

    <div className="space-y-3">
      {/* % Gordura */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="percentualGordura"
          checked={bioimpedanciaToggles.percentualGordura}
          onChange={(e) => setBioimpedanciaToggles({
            ...bioimpedanciaToggles,
            percentualGordura: e.target.checked
          })}
          className="h-4 w-4 cursor-pointer"
        />
        <label htmlFor="percentualGordura" className="text-sm font-medium text-verde">
          % Gordura Corporal
        </label>
        {bioimpedanciaToggles.percentualGordura && (
          <input
            type="number"
            placeholder="0-100"
            min="0"
            max="100"
            step="0.1"
            value={bioimpedanciaValues.percentualGordura}
            onChange={(e) => setBioimpedanciaValues({
              ...bioimpedanciaValues,
              percentualGordura: e.target.value
            })}
            className="ml-auto w-20 rounded border border-verde/20 px-2 py-1 text-sm text-verde"
          />
        )}
        {bioimpedanciaToggles.percentualGordura && (
          <span className="text-xs text-verde/60">%</span>
        )}
      </div>

      {/* Repeat for other metrics: percentualMusculo, gorduraVisceral, etc. */}
    </div>
  </div>
)
```

**Behavior:**
- Toggle checkbox appears first, label next
- When toggle ON → input field appears to the right
- Placeholder shows expected range/unit
- Client can turn ON/OFF at any time
- Empty fields with toggle OFF are ignored when saving

---

### 3.2 Tela "Minha Evolução" (New Bioimpedância Section)

**File:** `src/components/hoje/SeuProgresso.jsx` (existing, will be updated)

**New section after weight/measurements cards:**

```jsx
// Inside SeuProgresso component

function renderBioimpedanciaEvolution() {
  // Collect all bioimpedancia data across pesagens
  const metricas = {
    percentualGordura: [],
    percentualMusculo: [],
    gorduraVisceral: [],
    idadeMetabolica: [],
    toraxCm: [],
    circAbdominalCm: [],
  }

  pesagens.forEach((p, idx) => {
    if (!p.bioimpedancia) return

    Object.entries(p.bioimpedancia).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        metricas[key].push({
          semana: p.semana,
          valor: val,
          pesagemIdx: idx,
        })
      }
    })
  })

  // Filter: only show metrics that have at least 1 entry
  const metricsComDados = Object.entries(metricas)
    .filter(([_, values]) => values.length > 0)
    .map(([key, values]) => ({ key, values }))

  // If no bioimpedancia data at all
  if (metricsComDados.length === 0) {
    return (
      <section className="mwa-sombra-premium mt-4 rounded-2xl bg-white p-8">
        <h2 className="mb-1 text-sm font-semibold text-verde/60">📊 Dados de Bioimpedância</h2>
        <p className="text-xs text-verde/80">
          Nenhum dado de bioimpedância registrado ainda. Adicione na próxima pesagem!
        </p>
      </section>
    )
  }

  // Render each metric that has data
  return (
    <section className="mwa-sombra-premium mt-4 rounded-2xl bg-white p-8">
      <h2 className="mb-1 text-sm font-semibold text-verde/60">📊 Dados de Bioimpedância</h2>
      <p className="mb-6 text-xs text-verde/80">
        Evolução dos dados registrados via bioimpedância.
      </p>

      <div className="space-y-6">
        {metricsComDados.map(({ key, values }) => {
          const labels = {
            percentualGordura: '% Gordura Corporal',
            percentualMusculo: '% Músculo',
            gorduraVisceral: 'Gordura Visceral',
            idadeMetabolica: 'Idade Metabólica',
            toraxCm: 'Tórax',
            circAbdominalCm: 'Circ. Abdominal',
          }

          const units = {
            percentualGordura: '%',
            percentualMusculo: '%',
            gorduraVisceral: '',
            idadeMetabolica: ' anos',
            toraxCm: ' cm',
            circAbdominalCm: ' cm',
          }

          return (
            <div key={key} className="rounded-lg border border-verde/10 bg-gradient-to-br from-verde/5 to-sage-claro p-4">
              <h3 className="mb-3 text-sm font-semibold text-verde">{labels[key]}</h3>
              
              <div className="space-y-2">
                {values.map((entry, idx) => {
                  const valorAnterior = idx > 0 ? values[idx - 1].valor : null
                  const variacao = valorAnterior ? entry.valor - valorAnterior : null
                  const corVariacao = 
                    variacao === null ? '' :
                    (key.includes('Gordura') || key === 'idadeMetabolica')
                      ? (variacao < 0 ? 'text-sage' : variacao > 0 ? 'text-ouro' : 'text-verde/60')
                      : (variacao > 0 ? 'text-sage' : variacao < 0 ? 'text-ouro' : 'text-verde/60')
                  
                  return (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-verde/70">Semana {entry.semana}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-verde">
                          {entry.valor}{units[key]}
                        </span>
                        {variacao !== null && (
                          <span className={`text-xs font-medium ${corVariacao}`}>
                            {variacao > 0 ? '+' : ''}{variacao.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// Add to render output:
{renderBioimpedanciaEvolution()}
```

---

## 4. Logic & Behavior

### 4.1 Save Pesagem (Updated)

**Function:** `adicionarPesagem()` in AppContext.jsx

```javascript
async function adicionarPesagem(pesagem, bioimpedancia) {
  // Filter: only include bioimpedancia fields with toggle ON
  const bioimpedanciaFiltrada = Object.entries(bioimpedancia).reduce((acc, [key, value]) => {
    if (value.ativado && value.valor !== '') {
      acc[key] = parseFloat(value.valor)
    }
    return acc
  }, {})

  const pesagemCompleta = {
    user_id: userId,
    data: hoje,
    semana: pesagem.semana,
    peso: pesagem.peso,
    medidas: pesagem.medidas || null,
    bioimpedancia: Object.keys(bioimpedanciaFiltrada).length > 0 ? bioimpedanciaFiltrada : null,
  }

  const { data, error } = await supabase
    .from('mwa_pesagens')
    .insert(pesagemCompleta)

  if (error) throw error
  
  // Refresh pesagens
  carregarPesagens()
}
```

### 4.2 Load Last Pesagem (Updated)

When opening modal, fetch last pesagem and pre-populate toggles:

```javascript
const ultimaPesagem = pesagens[pesagens.length - 1]

if (ultimaPesagem?.bioimpedancia) {
  // Pre-mark toggles from last entry
  const togglesDefault = {}
  Object.keys(ultimaPesagem.bioimpedancia).forEach(key => {
    togglesDefault[key] = true
  })
  setBioimpedanciaToggles(togglesDefault)
}
```

### 4.3 Edit Pesagem (Updated)

When user clicks edit on existing pesagem:
- Load all current bioimpedancia values
- Pre-populate both toggles AND input fields
- Allow user to add/remove/change values

---

## 5. Validation & Error Handling

### Input Validation

```javascript
const validacaoBioimpedancia = {
  percentualGordura: (val) => val >= 0 && val <= 100,
  percentualMusculo: (val) => val >= 0 && val <= 100,
  gorduraVisceral: (val) => val >= 0 && val <= 200,
  idadeMetabolica: (val) => val >= 0 && val <= 150,
  toraxCm: (val) => val >= 0 && val <= 999,
  circAbdominalCm: (val) => val >= 0 && val <= 999,
}

function validarBioimpedancia(bioimpedancia) {
  return Object.entries(bioimpedancia).every(([key, val]) => {
    if (val === null || val === undefined) return true // Optional
    return validacaoBioimpedancia[key]?.(val) ?? true
  })
}
```

### UI Feedback

- **Red border** on invalid input (out of range)
- **Tooltip on hover:** "Range: 0-100" or similar
- **Disable save button** if any active field is invalid
- **Clear error** when user corrects value

---

## 6. Testing Checklist

### Unit Tests

- [ ] `validarBioimpedancia()` accepts all valid ranges
- [ ] `validarBioimpedancia()` rejects values outside ranges
- [ ] Null/undefined fields are treated as inactive
- [ ] Toggle state correctly filters which fields are saved

### Integration Tests

- [ ] **First weighing:** Client activates 2 bioimpedancia fields → saved to DB
- [ ] **Second weighing:** Same 2 fields pre-marked → client can toggle more on
- [ ] **Third weighing:** Verify only marked fields saved (empty fields ignored)
- [ ] **Edit:** Client edits week 2 weighing, changes selection → DB updates

### E2E Tests (Manual)

- [ ] Open weighing modal → bioimpedancia section visible
- [ ] Click toggle → input field appears/disappears
- [ ] Fill value → type is accepted (numeric only)
- [ ] Save pesagem → data persists
- [ ] Open evolution screen → metrics show with week-to-week variation
- [ ] Variation color correct: red for bad, green for good (based on metric)

---

## 7. Migration Strategy

### Step 1: Add DB Column
```sql
ALTER TABLE mwa_pesagens ADD COLUMN bioimpedancia JSONB DEFAULT NULL;
```

### Step 2: Update Components
- Update `ModalPesagem.jsx` with bioimpedancia section
- Update `SeuProgresso.jsx` with bioimpedancia evolution display
- Update `AppContext.jsx` load/save functions

### Step 3: Deploy & Test
- Deploy to staging
- Test: create new weighing with bioimpedancia data
- Test: edit existing weighing to add bioimpedancia
- Verify evolution screen displays data

### Step 4: Rollout
- Push to production
- Monitor for errors (Sentry)
- Announce feature to clients

---

## 8. Future Enhancements

- [ ] Graph visualization of bioimpedancia metrics over time (Recharts)
- [ ] Export bioimpedancia data as CSV/PDF
- [ ] Bioimpedancia calculator (reverse-engineer from weight + measurements)
- [ ] API to sync with Fitbit/Apple Health bioimpedancia data
- [ ] Recommendations based on fat% vs. muscle% trends

---

## 9. Acceptance Criteria

✅ **Implemented & Tested:**
- [ ] Bioimpedancia JSONB column added to mwa_pesagens
- [ ] Modal allows toggle + input for each metric
- [ ] Last pesagem's toggles auto-populated (client can change)
- [ ] Only active fields saved to database (null values ignored)
- [ ] Evolution screen shows only metrics with data (no empty sections)
- [ ] Week-to-week variation calculated and displayed
- [ ] All input validation working (ranges enforced)
- [ ] Test suite passes (unit + integration + manual E2E)
- [ ] No regressions in existing weighing/evolution functionality

---

**End of Spec**
