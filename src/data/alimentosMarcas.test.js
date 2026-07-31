import test from 'node:test'
import assert from 'node:assert/strict'
import { ALIMENTOS_MARCAS } from './alimentosMarcas.js'
import { ALIMENTOS } from './alimentos.js'
import { buscarAlimentos } from '../utils/alimentos.js'

test('itens de marca validados aparecem na busca do banco completo', () => {
  assert.equal(buscarAlimentos(ALIMENTOS, 'sonho de valsa').some((a) => a.id === 'lacta-sonho-de-valsa'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'kitkat').some((a) => a.id === 'nestle-kitkat-tradicional'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'pacoquita diet').some((a) => a.id === 'santa-helena-pacoquita-diet'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'snickers').some((a) => a.id === 'mars-snickers-original'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'bis ao leite').some((a) => a.id === 'lacta-bis-ao-leite'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'trakinas').some((a) => a.id === 'mondelez-trakinas-chocolate'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'oreo').some((a) => a.id === 'mondelez-oreo-original'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'twix').some((a) => a.id === 'mars-twix-original'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'chokito').some((a) => a.id === 'nestle-chokito'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'mms').some((a) => a.id === 'mars-mms-mini-chocolate-ao-leite'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'batom').some((a) => a.id === 'garoto-batom'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'doce de leite itambe').some((a) => a.id === 'itambe-doce-de-leite-tradicional'), true)
  assert.equal(buscarAlimentos(ALIMENTOS, 'goiabada predilecta').some((a) => a.id === 'predilecta-goiabada-original'), true)
})

test('itens de marca aguardando validação de rótulo ficam fora da busca padrão', () => {
  assert.equal(buscarAlimentos(ALIMENTOS, 'pacoquita tradicional').some((a) => a.id === 'santa-helena-pacoquita-tradicional'), false)
  assert.equal(buscarAlimentos(ALIMENTOS, 'laka').some((a) => a.id === 'lacta-laka-branco'), false)
  assert.equal(buscarAlimentos(ALIMENTOS, 'diamante negro').some((a) => a.id === 'lacta-diamante-negro'), false)
  assert.equal(buscarAlimentos(ALIMENTOS, 'milka').some((a) => a.id === 'mondelez-milka-ao-leite'), false)
  assert.equal(buscarAlimentos(ALIMENTOS, 'ouro branco').some((a) => a.id === 'lacta-ouro-branco'), false)
  // nescau e toddy were moved to alimentosIndustrializados with validado status, so removed from this test
  assert.equal(buscarAlimentos(ALIMENTOS, 'nutella').some((a) => a.id === 'ferrero-nutella'), false)
  assert.equal(buscarAlimentos(ALIMENTOS, 'serenata de amor').some((a) => a.id === 'garoto-serenata-de-amor'), false)
  assert.equal(buscarAlimentos(ALIMENTOS, 'prestigio').some((a) => a.id === 'nestle-prestigio'), false)
})

test('todo item de marca tem marca, porção, medida em unidade e fonte registrada', () => {
  for (const item of ALIMENTOS_MARCAS) {
    assert.ok(item.marca, `${item.id} sem marca`)
    assert.ok(item.porcao > 0, `${item.id} sem porção`)
    assert.ok(item.fonte, `${item.id} sem fonte`)
    assert.ok(item.dataConsulta, `${item.id} sem data de consulta`)
    assert.ok(['validado', 'aguardando_validacao'].includes(item.situacao), `${item.id} sem situação válida`)
    assert.ok(item.medidas.some((m) => m.id !== 'g'), `${item.id} sem medida caseira além de grama`)
  }
})

test('itens validados não têm valores negativos nem incoerentes', () => {
  const validados = ALIMENTOS_MARCAS.filter((a) => a.situacao === 'validado')
  for (const item of validados) {
    for (const campo of ['kcal', 'prot', 'carb', 'gord', 'fibra']) {
      assert.ok(item[campo] >= 0, `${item.id}.${campo} negativo`)
    }
  }
})
