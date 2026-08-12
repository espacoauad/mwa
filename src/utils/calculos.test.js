import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dataInicioDoPrograma } from './calculos.js'

test('dataInicioDoPrograma usa a data do programa 21d quando existe', () => {
  const programas = [{ tipo: '21d', dataInicio: '2026-05-01T12:00:00.000Z' }]
  assert.equal(dataInicioDoPrograma(programas, '2026-01-01T00:00:00.000Z'), '2026-05-01')
})

test('dataInicioDoPrograma cai para o fallback do perfil sem programa 21d', () => {
  assert.equal(dataInicioDoPrograma([], '2026-01-15T00:00:00.000Z'), '2026-01-15')
})

test('dataInicioDoPrograma ignora programas de outro tipo', () => {
  const programas = [{ tipo: '90d', dataInicio: '2026-06-01T00:00:00.000Z' }]
  assert.equal(dataInicioDoPrograma(programas, '2026-01-15T00:00:00.000Z'), '2026-01-15')
})
