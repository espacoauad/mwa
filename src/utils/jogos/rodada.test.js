import test from 'node:test'
import assert from 'node:assert/strict'
import { sortearRodada, pontuarRodada, mensagemFinal } from './rodada.js'

const banco = Array.from({ length: 20 }, (_, i) => ({ id: `q${i}`, nivel: i < 10 ? 1 : 2 }))

test('a rodada tem o tamanho pedido e não repete itens', () => {
  const rodada = sortearRodada(banco, 6)
  assert.equal(rodada.length, 6)
  assert.equal(new Set(rodada.map((q) => q.id)).size, 6)
})

test('itens vistos recentemente ficam no fim da fila', () => {
  const vistos = banco.slice(0, 14).map((q) => q.id)
  const rodada = sortearRodada(banco, 6, vistos)
  // Sobraram 6 inéditos: a rodada deve ser exatamente eles
  assert.deepEqual(
    rodada.map((q) => q.id).sort(),
    banco.slice(14).map((q) => q.id).sort(),
  )
})

test('quando tudo já foi visto, a rodada recomeça sem quebrar', () => {
  const vistos = banco.map((q) => q.id)
  const rodada = sortearRodada(banco, 5, vistos)
  assert.equal(rodada.length, 5)
  assert.equal(new Set(rodada.map((q) => q.id)).size, 5)
})

test('pedir mais itens do que existem devolve o banco inteiro', () => {
  const rodada = sortearRodada(banco.slice(0, 3), 8)
  assert.equal(rodada.length, 3)
})

test('a pontuação premia acerto de primeira e ainda conta o acerto após tentativa', () => {
  assert.equal(pontuarRodada([{ acertou: true, tentativas: 1 }]), 10)
  assert.equal(pontuarRodada([{ acertou: true, tentativas: 2 }]), 5)
  assert.equal(pontuarRodada([{ acertou: false, tentativas: 2 }]), 2)
  assert.equal(pontuarRodada([]), 0)
})

test('mensagem final varia com o aproveitamento, sempre sem punir', () => {
  const otima = mensagemFinal(8, 8)
  const media = mensagemFinal(4, 8)
  const baixa = mensagemFinal(1, 8)
  assert.notEqual(otima.pt, media.pt)
  assert.notEqual(media.pt, baixa.pt)
  for (const m of [otima, media, baixa]) {
    assert.ok(m.pt.length > 0 && m.en.length > 0)
    assert.doesNotMatch(m.pt, /errou|falhou|ruim|fracasso/i)
  }
})
