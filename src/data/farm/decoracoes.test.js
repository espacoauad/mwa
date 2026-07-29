import test from 'node:test'
import assert from 'node:assert/strict'
import { DECORACOES } from './decoracoes.js'

test('decorações têm id único, dia dentro do programa (1-90) e nome bilíngue', () => {
  const ids = DECORACOES.map((d) => d.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const d of DECORACOES) {
    assert.ok(d.dia > 0 && d.dia <= 90, `${d.id}: dia fora do intervalo do programa`)
    assert.ok(['decoracao', 'animal'].includes(d.tipo), `${d.id}: tipo inválido`)
    assert.ok(d.nome && d.nomeEN, `${d.id}: falta nome bilíngue`)
  }
})

test('decorações estão em ordem crescente de dia', () => {
  const dias = DECORACOES.map((d) => d.dia)
  const ordenado = [...dias].sort((a, b) => a - b)
  assert.deepEqual(dias, ordenado)
})

test('tem exatamente 5 bichinhos e 6 decorações ambientais', () => {
  assert.equal(DECORACOES.filter((d) => d.tipo === 'animal').length, 5)
  assert.equal(DECORACOES.filter((d) => d.tipo === 'decoracao').length, 6)
})
