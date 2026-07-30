import test from 'node:test'
import assert from 'node:assert/strict'
import { ALIMENTOS_INDUSTRIALIZADOS } from './alimentosIndustrializados.js'
import { ALIMENTOS } from './alimentos.js'
import { buscarAlimentos } from '../utils/alimentos.js'

test('bolachas agua e sal appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'agua sal').some((a) => a.id === 'vitarela-agua-sal'),
    true
  )
})

test('trakinas baunilha appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'trakinas baunilha').some((a) => a.id === 'trakinas-baunilha'),
    true
  )
})

test('piraque doce appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'piraque doce').some((a) => a.id === 'piraques-doce'),
    true
  )
})

test('coral wafer chocolate appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'coral wafer').some((a) => a.id === 'coral-wafer-chocolate'),
    true
  )
})

test('adria integral appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'adria integral').some((a) => a.id === 'adria-integral'),
    true
  )
})

test('todos industrializados tem marca, porcao, medida, fonte e situacao validado', () => {
  for (const item of ALIMENTOS_INDUSTRIALIZADOS) {
    assert.ok(item.marca, `${item.id} sem marca`)
    assert.ok(item.porcao > 0, `${item.id} sem porcao`)
    assert.ok(item.fonte, `${item.id} sem fonte`)
    assert.ok(item.fonteUrl || item.fonte.includes('fotografado'), `${item.id} sem URL ou foto confirmada`)
    assert.equal(item.situacao, 'validado', `${item.id} deveria estar validado`)
    assert.ok(item.medidas.some((m) => m.id !== 'g'), `${item.id} sem medida caseira`)
  }
})
