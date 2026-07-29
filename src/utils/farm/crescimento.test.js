import test from 'node:test'
import assert from 'node:assert/strict'
import { diaLiberacaoPilar, pilarLiberado, estagioDoPilar } from './crescimento.js'
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

test('estagioDoPilar retorna -1 antes da liberação', () => {
  const ultimoPilar = PILARES[7].id // libera no dia 29
  assert.equal(estagioDoPilar(ultimoPilar, 28), -1)
})

test('estagioDoPilar começa em semente (0) no próprio dia da liberação', () => {
  const primeiroPilar = PILARES[0].id // libera no dia 1
  assert.equal(estagioDoPilar(primeiroPilar, 1), 0)
})

test('estagioDoPilar avança 1 estágio a cada 20 dias e satura em 3 (plena)', () => {
  const primeiroPilar = PILARES[0].id // libera no dia 1
  assert.equal(estagioDoPilar(primeiroPilar, 20), 0) // 19 dias depois, ainda semente
  assert.equal(estagioDoPilar(primeiroPilar, 21), 1) // 20 dias depois, vira broto
  assert.equal(estagioDoPilar(primeiroPilar, 41), 2) // floração
  assert.equal(estagioDoPilar(primeiroPilar, 61), 3) // plena
  assert.equal(estagioDoPilar(primeiroPilar, 90), 3) // satura, nunca regride
})

test('o último pilar (liberado no dia 29) atinge a fase plena por volta do dia 89', () => {
  const ultimoPilar = PILARES[7].id
  assert.equal(estagioDoPilar(ultimoPilar, 88), 2)
  assert.equal(estagioDoPilar(ultimoPilar, 89), 3)
})
