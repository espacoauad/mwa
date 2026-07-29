import test from 'node:test'
import assert from 'node:assert/strict'
import { diaLiberacaoPilar, pilarLiberado } from './crescimento.js'
import { PILARES } from '../../data/farm/pilares.js'

test('os 8 pilares liberam a cada 4 dias, começando no dia 1', () => {
  const dias = PILARES.map((p) => diaLiberacaoPilar(p.id))
  assert.deepEqual(dias, [1, 5, 9, 13, 17, 21, 25, 29])
})

test('pilarLiberado respeita o dia exato de liberação (nem antes, nem depois)', () => {
  const segundoPilar = PILARES[1].id // libera no dia 5
  assert.equal(pilarLiberado(segundoPilar, 4), false)
  assert.equal(pilarLiberado(segundoPilar, 5), true)
  assert.equal(pilarLiberado(segundoPilar, 6), true)
})

test('id desconhecido não quebra: cai no dia 1', () => {
  assert.equal(diaLiberacaoPilar('inexistente'), 1)
})
