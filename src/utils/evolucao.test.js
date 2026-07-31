import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  pesagensOrdenadas,
  pesagensComRotulo,
  proporcaoCinturaQuadril,
  estagioPostura,
  corConquista,
  pontosGrafico,
} from './evolucao.js'

test('pesagensOrdenadas ordena por data crescente', () => {
  const pesagens = [
    { id: 2, data: '2026-02-01', peso: 70 },
    { id: 1, data: '2026-01-01', peso: 72 },
    { id: 3, data: '2026-03-01', peso: 68 },
  ]
  const resultado = pesagensOrdenadas(pesagens)
  assert.deepEqual(resultado.map((p) => p.id), [1, 2, 3])
})

test('pesagensOrdenadas não modifica o array original', () => {
  const pesagens = [{ id: 2, data: '2026-02-01' }, { id: 1, data: '2026-01-01' }]
  pesagensOrdenadas(pesagens)
  assert.equal(pesagens[0].id, 2)
})

test('pesagensComRotulo usa os marcos 15/30/45/60/75/90 em ordem', () => {
  const pesagens = [
    { id: 1, data: '2026-01-01' },
    { id: 2, data: '2026-01-16' },
    { id: 3, data: '2026-01-31' },
  ]
  const resultado = pesagensComRotulo(pesagens, 90)
  assert.deepEqual(resultado.map((r) => r.rotulo), ['Dia 15', 'Dia 30', 'Dia 45'])
})

test('pesagensComRotulo cai para "Pesagem N" além dos marcos disponíveis', () => {
  const totalDias = 30 // getDiasPesagem(30) só tem [15, 30] — 2 marcos
  const pesagens = [
    { id: 1, data: '2026-01-01' },
    { id: 2, data: '2026-01-16' },
    { id: 3, data: '2026-01-31' },
  ]
  const resultado = pesagensComRotulo(pesagens, totalDias)
  assert.deepEqual(resultado.map((r) => r.rotulo), ['Dia 15', 'Dia 30', 'Pesagem 3'])
})

test('proporcaoCinturaQuadril calcula a razão arredondada', () => {
  assert.equal(proporcaoCinturaQuadril({ cintura: 70, quadril: 100 }), 0.7)
})

test('proporcaoCinturaQuadril retorna null quando falta medida', () => {
  assert.equal(proporcaoCinturaQuadril({ cintura: 70 }), null)
  assert.equal(proporcaoCinturaQuadril({}), null)
  assert.equal(proporcaoCinturaQuadril({ cintura: 70, quadril: 0 }), null)
})

test('estagioPostura mapeia o primeiro item para 0 e o último para 3', () => {
  assert.equal(estagioPostura(0, 6), 0)
  assert.equal(estagioPostura(5, 6), 3)
})

test('estagioPostura nunca passa de 3', () => {
  assert.equal(estagioPostura(0, 1), 3)
})

test('corConquista cicla pelas 3 cores', () => {
  assert.equal(corConquista(0), 'sage')
  assert.equal(corConquista(1), 'ouro')
  assert.equal(corConquista(2), 'verde')
  assert.equal(corConquista(3), 'sage')
})

test('pontosGrafico mapeia valores para coordenadas dentro da área útil', () => {
  const pontos = pontosGrafico([70, 68, 66], 300, 100, 10)
  assert.equal(pontos.length, 3)
  // primeiro ponto: x no início da área útil
  assert.equal(pontos[0].x, 10)
  // último ponto: x no fim da área útil
  assert.equal(pontos[2].x, 290)
  // maior valor (70) deve ficar mais perto do topo (y menor) que o menor valor (66)
  assert.ok(pontos[0].y < pontos[2].y)
})

test('pontosGrafico preserva gaps para valores null', () => {
  const pontos = pontosGrafico([70, null, 66], 300, 100, 10)
  assert.equal(pontos[1], null)
})
