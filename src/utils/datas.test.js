import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  diaAnterior,
  diaSeguinte,
  dataDentroDoIntervalo,
  diasDoMes,
  mesAnterior,
  mesSeguinte,
  formatarDataExtenso,
} from './datas.js'

test('diaAnterior recua um dia', () => {
  assert.equal(diaAnterior('2026-08-12'), '2026-08-11')
})

test('diaAnterior cruza o limite do mês', () => {
  assert.equal(diaAnterior('2026-08-01'), '2026-07-31')
})

test('diaSeguinte avança um dia', () => {
  assert.equal(diaSeguinte('2026-08-11'), '2026-08-12')
})

test('diaSeguinte cruza o limite do ano', () => {
  assert.equal(diaSeguinte('2026-12-31'), '2027-01-01')
})

test('dataDentroDoIntervalo aceita datas nos limites (inclusive)', () => {
  assert.equal(dataDentroDoIntervalo('2026-08-01', '2026-08-01', '2026-08-12'), true)
  assert.equal(dataDentroDoIntervalo('2026-08-12', '2026-08-01', '2026-08-12'), true)
})

test('dataDentroDoIntervalo rejeita datas fora dos limites', () => {
  assert.equal(dataDentroDoIntervalo('2026-07-31', '2026-08-01', '2026-08-12'), false)
  assert.equal(dataDentroDoIntervalo('2026-08-13', '2026-08-01', '2026-08-12'), false)
})

test('diasDoMes preenche a grade de agosto de 2026 (começa num sábado)', () => {
  const dias = diasDoMes('2026-08-01')
  // 1º de agosto de 2026 cai num sábado (índice 6) — 6 posições nulas antes do dia 1
  assert.equal(dias.slice(0, 6).every((d) => d === null), true)
  assert.equal(dias[6], '2026-08-01')
  assert.equal(dias[dias.length - 1], '2026-08-31')
  assert.equal(dias.filter(Boolean).length, 31)
})

test('mesAnterior recua um mês, inclusive na virada de ano', () => {
  assert.equal(mesAnterior('2026-08-01'), '2026-07-01')
  assert.equal(mesAnterior('2026-01-01'), '2025-12-01')
})

test('mesSeguinte avança um mês, inclusive na virada de ano', () => {
  assert.equal(mesSeguinte('2026-08-01'), '2026-09-01')
  assert.equal(mesSeguinte('2026-12-01'), '2027-01-01')
})

test('formatarDataExtenso formata em pt-BR', () => {
  const formatado = formatarDataExtenso('2026-08-12', 'pt-BR')
  assert.ok(formatado.includes('agosto'), `esperado conter "agosto", recebido "${formatado}"`)
  assert.ok(formatado.includes('12'), `esperado conter "12", recebido "${formatado}"`)
})
