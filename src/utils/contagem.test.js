import { test } from 'node:test'
import assert from 'node:assert/strict'
import { facilitarSaidaCubica, valorNaContagem } from './contagem.js'

test('facilitarSaidaCubica retorna 0 no início e 1 no final', () => {
  assert.equal(facilitarSaidaCubica(0), 0)
  assert.equal(facilitarSaidaCubica(1), 1)
})

test('facilitarSaidaCubica desacelera perto do final (ease-out)', () => {
  // Em progresso=0.5, o valor suavizado deve ser MAIOR que 0.5 (início rápido, fim lento)
  const suavizado = facilitarSaidaCubica(0.5)
  assert.ok(suavizado > 0.5, `esperado > 0.5, recebido ${suavizado}`)
})

test('facilitarSaidaCubica satura fora do intervalo [0,1]', () => {
  assert.equal(facilitarSaidaCubica(-1), 0)
  assert.equal(facilitarSaidaCubica(2), 1)
})

test('valorNaContagem interpola do início ao fim', () => {
  assert.equal(valorNaContagem(0, 100, 0), 0)
  assert.equal(valorNaContagem(0, 100, 1), 100)
})

test('valorNaContagem funciona com contagem decrescente (fim < início)', () => {
  assert.equal(valorNaContagem(100, 0, 1), 0)
  assert.equal(valorNaContagem(100, 0, 0), 100)
})

test('valorNaContagem no meio do progresso fica entre início e fim', () => {
  const meio = valorNaContagem(0, 100, 0.5)
  assert.ok(meio > 50 && meio < 100, `esperado entre 50 e 100, recebido ${meio}`)
})
