import test from 'node:test'
import assert from 'node:assert/strict'
import { ITENS_CORRIDA, sortearItem } from './itensCorrida.js'

test('a lista tem 10 itens saudáveis e 10 não saudáveis, sem svgId repetido', () => {
  const saudaveis = ITENS_CORRIDA.filter((i) => i.tipo === 'saudavel')
  const naoSaudaveis = ITENS_CORRIDA.filter((i) => i.tipo === 'naoSaudavel')
  assert.equal(saudaveis.length, 10)
  assert.equal(naoSaudaveis.length, 10)
  assert.equal(new Set(ITENS_CORRIDA.map((i) => i.svgId)).size, ITENS_CORRIDA.length)
})

test('cada item resolve um alimento real com kcal e porção', () => {
  for (const item of ITENS_CORRIDA) {
    assert.ok(item.alimento, `sem alimento para ${item.svgId}`)
    assert.ok(item.alimento.kcal > 0, `kcal inválida para ${item.svgId}`)
    assert.ok(item.alimento.porcao > 0, `porção inválida para ${item.svgId}`)
  }
})

test('sortearItem sempre devolve um item da lista, com os dois tipos aparecendo', () => {
  const vistos = new Set()
  for (let i = 0; i < 300; i++) {
    const item = sortearItem()
    assert.ok(ITENS_CORRIDA.includes(item))
    vistos.add(item.tipo)
  }
  assert.equal(vistos.size, 2)
})
