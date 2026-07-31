import test from 'node:test'
import assert from 'node:assert/strict'
import { mesclarProgresso, nivelLiberado, progressoPorMissao } from './progresso.js'

test('primeira partida cria o registro com o resultado atual', () => {
  const r = mesclarProgresso(null, { pontuacao: 72, estrelas: 2 })
  assert.deepEqual(r, { melhor_pontuacao: 72, estrelas: 2, partidas: 1 })
})

test('pontuação melhor substitui a anterior', () => {
  const anterior = { melhor_pontuacao: 72, estrelas: 2, partidas: 3 }
  const r = mesclarProgresso(anterior, { pontuacao: 91, estrelas: 3 })
  assert.deepEqual(r, { melhor_pontuacao: 91, estrelas: 3, partidas: 4 })
})

test('pontuação pior preserva o recorde mas conta a partida', () => {
  const anterior = { melhor_pontuacao: 91, estrelas: 3, partidas: 4 }
  const r = mesclarProgresso(anterior, { pontuacao: 40, estrelas: 0 })
  assert.deepEqual(r, { melhor_pontuacao: 91, estrelas: 3, partidas: 5 })
})

test('estrelas nunca regridem, mesmo com pontuação menor em outra tentativa', () => {
  const anterior = { melhor_pontuacao: 88, estrelas: 3, partidas: 2 }
  const r = mesclarProgresso(anterior, { pontuacao: 89, estrelas: 2 })
  assert.equal(r.estrelas, 3)
  assert.equal(r.melhor_pontuacao, 89)
})

test('nível 2 libera com 2+ estrelas em qualquer missão do nível 1', () => {
  const missoes = [
    { id: 'a', nivel: 1 },
    { id: 'b', nivel: 1 },
    { id: 'c', nivel: 2 },
  ]
  assert.equal(nivelLiberado(2, missoes, { a: { estrelas: 1 }, b: { estrelas: 0 } }), false)
  assert.equal(nivelLiberado(2, missoes, { a: { estrelas: 1 }, b: { estrelas: 2 } }), true)
  assert.equal(nivelLiberado(1, missoes, {}), true)
})

test('progressoPorMissao indexa as linhas do banco por missao_id', () => {
  const linhas = [
    { jogo_id: 'prato', missao_id: 'lanche', melhor_pontuacao: 91, estrelas: 3, partidas: 4 },
    { jogo_id: 'prato', missao_id: 'jantar', melhor_pontuacao: 60, estrelas: 1, partidas: 1 },
  ]
  const mapa = progressoPorMissao(linhas)
  assert.equal(mapa.lanche.estrelas, 3)
  assert.equal(mapa.jantar.melhor_pontuacao, 60)
  assert.deepEqual(progressoPorMissao(null), {})
})
