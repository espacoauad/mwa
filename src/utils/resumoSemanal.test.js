import test from 'node:test'
import assert from 'node:assert/strict'
import { calcularResumoSemanal } from './resumoSemanal.js'

const DIAS = ['2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08', '2026-08-09']

function mapaDe(dias, valores) {
  const mapa = new Map()
  dias.forEach((d, i) => {
    if (valores[i] !== undefined) mapa.set(d, valores[i])
  })
  return mapa
}

test('semana com 2 metricas fortes (>=3 dias) mostra as 2 mais altas e a mais fraca como ponto de atencao', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, true, true, true, false, false]) // 5
  const aguaPorDia = mapaDe(DIAS, [2000, 2000, 2000, 2000, 1000, 1000, 1000]) // 4 dias >= meta
  const proteinaPorDia = mapaDe(DIAS, [50, 50, 0, 0, 0, 0, 0]) // 2 dias >= meta
  const exercicioPorDia = mapaDe(DIAS, [true, false, false, false, false, false, false]) // 1

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.contadores, { refeicao: 5, agua: 4, proteina: 2, exercicio: 1 })
  assert.deepEqual(resultado.pontosFortes, [{ chave: 'refeicao', n: 5 }, { chave: 'agua', n: 4 }])
  assert.deepEqual(resultado.pontoAtencao, { chave: 'exercicio', n: 1 })
  assert.equal(resultado.semanaParada, false)
})

test('semana com só 1 métrica forte não força uma segunda', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, true, true, false, false, false]) // 4
  const aguaPorDia = mapaDe(DIAS, [2000, 2000, 1000, 1000, 1000, 1000, 1000]) // 2
  const proteinaPorDia = mapaDe(DIAS, [50, 50, 0, 0, 0, 0, 0]) // 2
  const exercicioPorDia = mapaDe(DIAS, [true, false, false, false, false, false, false]) // 1

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.pontosFortes, [{ chave: 'refeicao', n: 4 }])
  assert.deepEqual(resultado.pontoAtencao, { chave: 'exercicio', n: 1 })
})

test('semana parada (nenhuma métrica com 3+ dias) não mostra pontos fortes nem ponto de atenção', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, false, false, false, false, false]) // 2
  const aguaPorDia = mapaDe(DIAS, [2000, 1000, 1000, 1000, 1000, 1000, 1000]) // 1
  const proteinaPorDia = mapaDe(DIAS, []) // 0
  const exercicioPorDia = mapaDe(DIAS, [true, true, false, false, false, false, false]) // 2

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.pontosFortes, [])
  assert.equal(resultado.pontoAtencao, null)
  assert.equal(resultado.semanaParada, true)
})

test('empate total entre as 4 métricas não gera ponto de atenção', () => {
  const refeicoesPorDia = mapaDe(DIAS, [true, true, true, true, false, false, false]) // 4
  const aguaPorDia = mapaDe(DIAS, [2000, 2000, 2000, 2000, 1000, 1000, 1000]) // 4
  const proteinaPorDia = mapaDe(DIAS, [50, 50, 50, 50, 0, 0, 0]) // 4
  const exercicioPorDia = mapaDe(DIAS, [true, true, true, true, false, false, false]) // 4

  const resultado = calcularResumoSemanal({
    dias: DIAS, refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia,
    metaProteina: 50, metaAguaMl: 2000,
  })

  assert.deepEqual(resultado.contadores, { refeicao: 4, agua: 4, proteina: 4, exercicio: 4 })
  assert.deepEqual(resultado.pontosFortes, [{ chave: 'refeicao', n: 4 }, { chave: 'agua', n: 4 }])
  assert.equal(resultado.pontoAtencao, null)
})
