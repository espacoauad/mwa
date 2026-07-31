import test from 'node:test'
import assert from 'node:assert/strict'
import { ALIMENTOS_HERBALIFE } from './alimentosHerbalife.js'
import { ALIMENTOS } from './alimentos.js'
import { buscarAlimentos } from '../utils/alimentos.js'

test('produtos Herbalife validados aparecem na busca do banco completo', () => {
  assert.equal(buscarAlimentos(ALIMENTOS, 'whey 3w').some((a) => a.id === 'herbalife-whey-protein-3w-chocolate'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'beauty booster').some((a) => a.id === 'herbalife-skin-beauty-booster-frutas-vermelhas'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'formula 1').some((a) => a.id === 'herbalife-formula-1-shake-baunilha-cremoso'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'protein powder').some((a) => a.id === 'herbalife-formula-3-protein-powder'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'fiber concentrate').some((a) => a.id === 'herbalife-fiber-concentrate-uva'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'sopa instantanea').some((a) => a.id === 'herbalife-sopa-proteica-frango-legumes'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'barra de proteina herbalife').some((a) => a.id === 'herbalife-barra-de-proteina-citrus-lemon'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'herbal concentrate').some((a) => a.id === 'herbalife-herbal-concentrate-original'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'nutri soup').some((a) => a.id === 'herbalife-nutri-soup-frango-legumes'), true)
})

test('todo item Herbalife validado tem marca, porção, medida e fonte registrada', () => {
  for (const item of ALIMENTOS_HERBALIFE.filter((a) => a.situacao === 'validado')) {
    assert.equal(item.marca, 'Herbalife', `${item.id} sem marca Herbalife`)
    assert.ok(item.porcao > 0, `${item.id} sem porção`)
    assert.ok(item.fonte, `${item.id} sem fonte`)
    assert.ok(item.fonteUrl || item.fonte.includes('foto do rótulo físico'), `${item.id} sem URL de fonte nem foto de rótulo`)
    assert.ok(item.dataConsulta, `${item.id} sem data de consulta`)
    assert.ok(item.medidas.some((m) => m.id !== 'g' && m.id !== 'ml'), `${item.id} sem medida caseira própria`)
  }
})

test('itens Herbalife não têm valores negativos', () => {
  for (const item of ALIMENTOS_HERBALIFE) {
    for (const campo of ['kcal', 'prot', 'carb', 'gord', 'fibra']) {
      assert.ok(item[campo] >= 0, `${item.id}.${campo} negativo`)
    }
  }
})
