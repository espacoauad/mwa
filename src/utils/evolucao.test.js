import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  pesagensOrdenadas,
  pesagensComRotulo,
  historicoSemanal,
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

test('historicoSemanal com 1 pesagem usa o peso inicial como base', () => {
  const pesagens = [{ semana: 15, peso: 70, medidas: {} }]
  const resultado = historicoSemanal(pesagens, 75)
  assert.deepEqual(resultado, [{ semana: 15, peso: 70, delta: -5, medidas: '—' }])
})

test('historicoSemanal com exatamente 2 pesagens não quebra e encadeia os deltas corretamente', () => {
  // Bug original: pesagens[pesagens.length - 3 + i - 1] dava pesagens[-1] (undefined) para i=1 quando length=2
  const pesagens = [
    { semana: 15, peso: 74, medidas: {} },
    { semana: 30, peso: 70, medidas: {} },
  ]
  const resultado = historicoSemanal(pesagens, 75)
  assert.deepEqual(resultado, [
    { semana: 15, peso: 74, delta: -1, medidas: '—' },
    { semana: 30, peso: 70, delta: -4, medidas: '—' },
  ])
})

test('historicoSemanal com 3 pesagens usa o peso inicial como base da primeira e encadeia as demais', () => {
  const pesagens = [
    { semana: 15, peso: 74, medidas: {} },
    { semana: 30, peso: 70, medidas: {} },
    { semana: 45, peso: 68, medidas: {} },
  ]
  const resultado = historicoSemanal(pesagens, 75)
  assert.deepEqual(resultado.map((r) => r.delta), [-1, -4, -2])
})

test('historicoSemanal com mais de 3 pesagens usa só as últimas 3, encadeadas a partir da pesagem anterior à janela', () => {
  const pesagens = [
    { semana: 15, peso: 74, medidas: {} },
    { semana: 30, peso: 70, medidas: {} },
    { semana: 45, peso: 68, medidas: {} },
    { semana: 60, peso: 65, medidas: {} },
  ]
  const resultado = historicoSemanal(pesagens, 75)
  // janela = semanas 30/45/60; base da semana 30 é a pesagem da semana 15 (70 -> 74 = -4), não o peso inicial
  assert.deepEqual(resultado.map((r) => ({ semana: r.semana, delta: r.delta })), [
    { semana: 30, delta: -4 },
    { semana: 45, delta: -2 },
    { semana: 60, delta: -3 },
  ])
})

test('historicoSemanal usa a medida de cintura da pesagem quando disponível', () => {
  const pesagens = [{ semana: 15, peso: 70, medidas: { cintura: 80 } }]
  const resultado = historicoSemanal(pesagens, 75)
  assert.equal(resultado[0].medidas, '80 cm')
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
