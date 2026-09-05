import test from 'node:test'
import assert from 'node:assert/strict'
import { diasSemAcessar } from './game.js'

test('retorna null quando nunca acessou (ultimo_dia_acesso ausente)', () => {
  assert.equal(diasSemAcessar(null, '2026-08-09'), null)
})

test('retorna 0 no mesmo dia', () => {
  assert.equal(diasSemAcessar('2026-08-09', '2026-08-09'), 0)
})

test('retorna 1 no dia seguinte', () => {
  assert.equal(diasSemAcessar('2026-08-08', '2026-08-09'), 1)
})

test('retorna 2 depois de dois dias sem acessar', () => {
  assert.equal(diasSemAcessar('2026-08-07', '2026-08-09'), 2)
})

test('retorna corretamente atravessando troca de mês', () => {
  assert.equal(diasSemAcessar('2026-07-30', '2026-08-02'), 3)
})
