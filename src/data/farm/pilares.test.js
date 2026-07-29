import test from 'node:test'
import assert from 'node:assert/strict'
import { PILARES } from './pilares.js'

test('existem exatamente 8 pilares, com ids únicos', () => {
  assert.equal(PILARES.length, 8)
  const ids = PILARES.map((p) => p.id)
  assert.equal(new Set(ids).size, 8)
})

test('cada pilar tem nome, título, cor e texto educativo bilíngues', () => {
  for (const p of PILARES) {
    assert.ok(p.nome && p.nomeEN, `${p.id}: falta nome bilíngue`)
    assert.ok(p.tituloHabito && p.tituloHabitoEN, `${p.id}: falta título do hábito`)
    assert.ok(p.textoEducativo?.length > 20, `${p.id}: texto educativo curto demais`)
    assert.ok(p.textoEducativoEN?.length > 20, `${p.id}: falta texto em inglês`)
    assert.ok(/^#[0-9a-f]{6}$/i.test(p.cor), `${p.id}: cor inválida (esperado hex de 6 dígitos)`)
    assert.ok(p.coroaId, `${p.id}: falta coroaId`)
  }
})

test('cada pilar tem uma cor e uma coroa exclusivas (sem repetição)', () => {
  assert.equal(new Set(PILARES.map((p) => p.cor)).size, PILARES.length)
  assert.equal(new Set(PILARES.map((p) => p.coroaId)).size, PILARES.length)
})
