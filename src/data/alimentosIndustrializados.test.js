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

test('nescau appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'nescau').some((a) => a.id === 'nestle-nescau'),
    true
  )
})

test('toddy appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'toddy').some((a) => a.id === 'pepsico-toddy-original'),
    true
  )
})

test('achocolatado integral appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'achocolatado integral').some((a) => a.id === 'itambe-achocolatado-integral'),
    true
  )
})

test('chocomel appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'chocomel').some((a) => a.id === 'nestle-chocomel-250ml'),
    true
  )
})

test('cheetos appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'cheetos').some((a) => a.id === 'mondelez-cheetos-original'),
    true
  )
})

test('doritos appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'doritos').some((a) => a.id === 'mondelez-doritos-nacho-cheese'),
    true
  )
})

test('elma chips appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'elma chips').some((a) => a.id === 'elma-chips-batata-frita'),
    true
  )
})

test('amendoim yoki appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'amendoim yoki').some((a) => a.id === 'yoki-amendoim-salgado'),
    true
  )
})

test('amendoim de horta appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'amendoim de horta').some((a) => a.id === 'de-horta-amendoim-salgado'),
    true
  )
})

test('coca-cola 250ml appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'coca cola 250').some((a) => a.id === 'coca-cola-250ml'),
    true
  )
})

test('sukita laranja appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'sukita').some((a) => a.id === 'coca-cola-sukita-laranja'),
    true
  )
})

test('gatorade appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'gatorade').some((a) => a.id === 'pepsico-gatorade-limao'),
    true
  )
})

test('suco integral appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'suco integral').some((a) => a.id === 'del-vale-suco-integral-laranja'),
    true
  )
})

test('agua mineral appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'agua mineral').some((a) => a.id === 'minerao-agua-mineral'),
    true
  )
})

test('iogurte natural appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'iogurte natural').some((a) => a.id === 'isis-iogurte-natural'),
    true
  )
})

test('queijo meia cura appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'queijo meia cura').some((a) => a.id === 'queijaria-meia-cura'),
    true
  )
})

test('requeijao vigor appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'requeijao').some((a) => a.id === 'vigor-requeijao-cremoso'),
    true
  )
})

test('leite integral parmalat appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'leite integral').some((a) => a.id === 'parmalat-leite-integral-1l'),
    true
  )
})

test('bebida lactea chamyto appears in search', () => {
  assert.equal(
    buscarAlimentos(ALIMENTOS, 'chamyto').some((a) => a.id === 'danone-chamyto-morango'),
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
