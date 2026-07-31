import test from 'node:test'
import assert from 'node:assert/strict'
import { AFIRMACOES, INTENCOES, afirmacaoDoDia } from './afirmacoes.js'

test('o banco de afirmações é grande o bastante para não repetir por semanas', () => {
  assert.ok(AFIRMACOES.length >= 30, `esperava >=30, veio ${AFIRMACOES.length}`)
  for (const a of AFIRMACOES) {
    assert.ok(a.pt?.length > 10 && a.en?.length > 10, `afirmação incompleta: ${JSON.stringify(a)}`)
  }
})

test('a afirmação é estável no mesmo dia e muda de um dia para o outro', () => {
  assert.equal(afirmacaoDoDia('2026-07-28').pt, afirmacaoDoDia('2026-07-28').pt)
  assert.notEqual(afirmacaoDoDia('2026-07-28').pt, afirmacaoDoDia('2026-07-29').pt)
})

test('datas ausentes ou inválidas não quebram o Momento MWA', () => {
  for (const entrada of [undefined, null, '', 'não-é-data']) {
    const a = afirmacaoDoDia(entrada)
    assert.ok(a?.pt?.length > 10, `quebrou com entrada: ${entrada}`)
  }
})

test('as intenções do dia têm id e texto bilíngue', () => {
  assert.ok(INTENCOES.length >= 3)
  for (const i of INTENCOES) {
    assert.ok(i.id && i.pt && i.en)
  }
})
