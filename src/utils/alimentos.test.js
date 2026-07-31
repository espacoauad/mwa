import test from 'node:test'
import assert from 'node:assert/strict'
import { buscarAlimentos, normalizarTexto, quantidadeNaBase } from './alimentos.js'
import { ALIMENTOS, macrosDoAlimento } from '../data/alimentos.js'

const maca = { nome: 'Maçã', categoria: 'Frutas', aliases: ['maçã gala'], medidas: [{ id: 'un', nome: 'unidade', base: 130 }] }
const mandioca = { nome: 'Mandioca cozida', categoria: 'Carboidratos', aliases: ['aipim', 'macaxeira'] }

test('normaliza acentos e pontuação', () => assert.equal(normalizarTexto('PÃO-de-Queijo'), 'pao de queijo'))
test('busca sem acento e por sinônimo regional', () => {
  assert.deepEqual(buscarAlimentos([maca], 'maca'), [maca])
  assert.deepEqual(buscarAlimentos([mandioca], 'aipim'), [mandioca])
})
test('converte medida caseira para a unidade-base', () => {
  assert.equal(quantidadeNaBase(maca, 2, 'un'), 260)
  assert.equal(quantidadeNaBase(maca, 50, 'g'), 50)
})

test('calcula macros por porção e por gramas', () => {
  const alimento = { kcal: 200, prot: 10, carb: 20, gord: 5, fibra: 4, unidadeBase: 'g', medidas: [{ id: 'fatia', nome: 'fatia', base: 50 }] }
  assert.deepEqual(macrosDoAlimento(alimento, 1, 'fatia'), { calorias: 100, proteina: 5, carbos: 10, gordura: 2.5, fibras: 2 })
})

test('base não tem ids duplicados nem valores negativos', () => {
  assert.equal(new Set(ALIMENTOS.map((a) => a.id)).size, ALIMENTOS.length)
  assert.equal(ALIMENTOS.some((a) => [a.kcal, a.prot, a.carb, a.gord, a.fibra, a.porcao].some((v) => !Number.isFinite(v) || v < 0)), false)
})

test('encontra suplementos por termos genéricos', () => {
  assert.equal(buscarAlimentos(ALIMENTOS, 'shake proteico')[0]?.id, 'hbl-shake')
  assert.equal(buscarAlimentos(ALIMENTOS, 'bebida proteica em po')[0]?.id, 'hbl-pdm')
  assert.equal(buscarAlimentos(ALIMENTOS, 'cha de ervas').some((a) => a.id === 'hbl-cha'), true)
})

test('encontra alimentos dos EUA em inglês e português', () => {
  assert.equal(buscarAlimentos(ALIMENTOS, 'mac and cheese')[0]?.nome, 'Macaroni and cheese')
  assert.equal(buscarAlimentos(ALIMENTOS, 'torta de maca')[0]?.nome, 'Apple pie')
  assert.equal(buscarAlimentos(ALIMENTOS, 'pbj')[0]?.nome, 'Peanut butter and jelly sandwich')
})

test('busca encontra por plural e singular', () => {
  const sonho = { nome: 'Sonho de Valsa', marca: 'Lacta', categoria: 'Doces e sobremesas', aliases: ['bombom'] }
  const pacoca = { nome: 'Paçoca rolha', categoria: 'Doces e sobremesas', aliases: [] }
  assert.deepEqual(buscarAlimentos([sonho], 'bombons'), [sonho])
  assert.deepEqual(buscarAlimentos([pacoca], 'pacocas'), [pacoca])
  assert.deepEqual(buscarAlimentos([sonho], 'sonhos de valsa'), [sonho])
})

test('busca tolera uma palavra extra (ex.: "chocolate Bis")', () => {
  const bis = { nome: 'Bis ao leite', marca: 'Lacta', categoria: 'Doces e sobremesas', aliases: [] }
  assert.deepEqual(buscarAlimentos([bis], 'chocolate bis'), [bis])
  assert.deepEqual(buscarAlimentos([bis], 'bis lacta'), [bis])
})

test('itens aguardando validação de rótulo não aparecem na busca padrão', () => {
  const pendente = { nome: 'Produto de marca sem rótulo confirmado', categoria: 'Doces e sobremesas', situacao: 'aguardando_validacao', aliases: [] }
  const validado = { nome: 'Produto de marca com rótulo confirmado', categoria: 'Doces e sobremesas', situacao: 'validado', aliases: [] }
  assert.deepEqual(buscarAlimentos([pendente, validado], 'produto de marca'), [validado])
  assert.deepEqual(buscarAlimentos([pendente], ''), [])
})

test('converte cup, fl oz e oz', () => {
  const bebida = ALIMENTOS.find((a) => a.id === 'us-057')
  const solido = ALIMENTOS.find((a) => a.id === 'us-003')
  assert.equal(Math.round(quantidadeNaBase(bebida, 1, 'cup')), 240)
  assert.equal(Math.round(quantidadeNaBase(bebida, 8, 'floz')), 237)
  assert.equal(Math.round(quantidadeNaBase(solido, 1, 'oz')), 28)
})
