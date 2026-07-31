import test from 'node:test'
import assert from 'node:assert/strict'
import { INGREDIENTES, GRUPOS, ingredientesDoGrupo } from './ingredientes.js'
import { MISSOES } from './missoes.js'

test('todo ingrediente resolve para um alimento real da base TACO/TBCA', () => {
  assert.ok(INGREDIENTES.length >= 30, `esperava >=30 ingredientes, veio ${INGREDIENTES.length}`)
  for (const ing of INGREDIENTES) {
    assert.ok(ing.alimento?.kcal >= 0, `${ing.alimentoId} sem alimento na base`)
    assert.ok(ing.porcao.g > 0, `${ing.alimentoId} sem porção`)
    assert.ok(GRUPOS.some((g) => g.id === ing.grupo), `${ing.alimentoId} com grupo inválido: ${ing.grupo}`)
  }
})

test('não há ingredientes duplicados e todo grupo tem opções', () => {
  const ids = INGREDIENTES.map((i) => i.alimentoId)
  assert.equal(new Set(ids).size, ids.length)
  for (const grupo of GRUPOS) {
    assert.ok(ingredientesDoGrupo(grupo.id).length >= 3, `grupo ${grupo.id} com menos de 3 opções`)
  }
})

test('missões têm critérios coerentes e textos bilíngues', () => {
  for (const m of MISSOES) {
    assert.ok(m.criterios.kcal.min < m.criterios.kcal.max, m.id)
    assert.ok(m.titulo && m.tituloEN && m.ensinamento && m.ensinamentoEN, m.id)
  }
})
