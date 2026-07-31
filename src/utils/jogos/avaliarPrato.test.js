import test from 'node:test'
import assert from 'node:assert/strict'
import { totaisDoPrato, avaliarPrato, estrelasDaPontuacao } from './avaliarPrato.js'

// Alimentos sintéticos (valores por 100 g, mesmo formato de src/data/alimentos.js)
const iogurteGrego = { kcal: 59, prot: 10, carb: 3.6, gord: 0.4, fibra: 0 }
const aveia = { kcal: 394, prot: 13.9, carb: 66.6, gord: 8.5, fibra: 9.1 }
const banana = { kcal: 89, prot: 1.1, carb: 22.8, gord: 0.3, fibra: 2.6 }
const frango = { kcal: 165, prot: 31, carb: 0, gord: 3.6, fibra: 0 }
const arrozIntegral = { kcal: 124, prot: 2.6, carb: 25.8, gord: 1, fibra: 2.7 }
const feijao = { kcal: 76, prot: 4.8, carb: 13.6, gord: 0.5, fibra: 8.5 }
const brocolis = { kcal: 35, prot: 2.4, carb: 7, gord: 0.4, fibra: 3.4 }
const sorvete = { kcal: 207, prot: 3.5, carb: 24, gord: 11, fibra: 0.7 }

const MISSAO_LANCHE = {
  id: 'lanche-equilibrado',
  tipoRefeicao: 'lanche',
  criterios: {
    kcal: { min: 150, max: 400 },
    prot: { min: 10 },
    fibra: { min: 4 },
    gruposMin: { 'vegetal|fruta': 1 },
  },
}

const MISSAO_JANTAR = {
  id: 'jantar-equilibrado',
  tipoRefeicao: 'refeicao',
  criterios: {
    kcal: { min: 350, max: 700 },
    prot: { min: 25 },
    fibra: { min: 6 },
    gruposMin: { vegetal: 1 },
  },
}

const lancheBom = [
  { alimento: iogurteGrego, gramas: 130, grupo: 'proteina' },
  { alimento: aveia, gramas: 30, grupo: 'carbo' },
  { alimento: banana, gramas: 100, grupo: 'fruta' },
]

test('totaisDoPrato soma macros proporcionais às gramas', () => {
  const t = totaisDoPrato([{ alimento: frango, gramas: 120, grupo: 'proteina' }])
  assert.equal(t.kcal, 198)
  assert.equal(t.prot, 37.2)
  assert.equal(t.fibra, 0)
})

test('prato vazio vale 0 pontos e 0 estrelas', () => {
  const r = avaliarPrato([], MISSAO_LANCHE)
  assert.equal(r.pontuacao, 0)
  assert.equal(r.estrelas, 0)
})

test('lanche que cumpre todos os critérios ganha 3 estrelas', () => {
  const r = avaliarPrato(lancheBom, MISSAO_LANCHE)
  assert.ok(r.pontuacao >= 85, `esperava >=85, veio ${r.pontuacao}`)
  assert.equal(r.estrelas, 3)
  assert.ok(r.criterios.every((c) => c.ok))
})

test('não existe resposta única: outra combinação também alcança 3 estrelas', () => {
  const jantarA = [
    { alimento: frango, gramas: 120, grupo: 'proteina' },
    { alimento: arrozIntegral, gramas: 120, grupo: 'carbo' },
    { alimento: feijao, gramas: 80, grupo: 'carbo' },
    { alimento: brocolis, gramas: 80, grupo: 'vegetal' },
  ]
  const r = avaliarPrato(jantarA, MISSAO_JANTAR)
  assert.equal(r.estrelas, 3)
})

test('critério não cumprido aparece como ok:false e derruba a pontuação', () => {
  const semFibra = [
    { alimento: iogurteGrego, gramas: 170, grupo: 'proteina' },
    { alimento: banana, gramas: 100, grupo: 'fruta' },
  ]
  const r = avaliarPrato(semFibra, MISSAO_LANCHE)
  const fibra = r.criterios.find((c) => c.id === 'fibra')
  assert.equal(fibra.ok, false)
  assert.ok(r.pontuacao < avaliarPrato(lancheBom, MISSAO_LANCHE).pontuacao)
})

test('excesso grande de calorias reduz a nota', () => {
  const exagerado = lancheBom.concat([{ alimento: sorvete, gramas: 300, grupo: 'extra' }])
  const r = avaliarPrato(exagerado, MISSAO_LANCHE)
  assert.ok(r.pontuacao < 65, `esperava <65, veio ${r.pontuacao}`)
})

test('com calorias parecidas, mais proteína e fibra = maior saciedade estimada', () => {
  const rico = avaliarPrato(lancheBom, MISSAO_LANCHE)
  const pobre = avaliarPrato([{ alimento: sorvete, gramas: 140, grupo: 'extra' }], MISSAO_LANCHE)
  assert.ok(rico.detalhes.saciedade > pobre.detalhes.saciedade)
})

test('sugestão aponta a principal lacuna da missão', () => {
  const semFibra = [
    { alimento: iogurteGrego, gramas: 170, grupo: 'proteina' },
    { alimento: banana, gramas: 100, grupo: 'fruta' },
  ]
  const r = avaliarPrato(semFibra, MISSAO_LANCHE)
  assert.equal(r.sugestao, 'mais-fibra')
})

test('estourar calorias vira a sugestão principal, mesmo com outra lacuna', () => {
  const acimaESemFibra = [
    { alimento: iogurteGrego, gramas: 170, grupo: 'proteina' },
    { alimento: sorvete, gramas: 250, grupo: 'extra' },
  ]
  const r = avaliarPrato(acimaESemFibra, MISSAO_LANCHE)
  assert.ok(r.totais.kcal > MISSAO_LANCHE.criterios.kcal.max)
  assert.equal(r.excedeuCalorias, true)
  assert.equal(r.sugestao, 'menos-calorias')
})

test('prato dentro da faixa de calorias não marca excedeuCalorias', () => {
  const r = avaliarPrato(lancheBom, MISSAO_LANCHE)
  assert.equal(r.excedeuCalorias, false)
})

test('estourar calorias impede 3 estrelas mesmo com prato nutritivo', () => {
  const nutritivoPorem = [
    { alimento: frango, gramas: 200, grupo: 'proteina' },
    { alimento: arrozIntegral, gramas: 200, grupo: 'carbo' },
    { alimento: feijao, gramas: 150, grupo: 'carbo' },
    { alimento: brocolis, gramas: 100, grupo: 'vegetal' },
    { alimento: aveia, gramas: 60, grupo: 'carbo' },
  ]
  const r = avaliarPrato(nutritivoPorem, MISSAO_JANTAR)
  assert.ok(r.totais.kcal > MISSAO_JANTAR.criterios.kcal.max)
  assert.ok(r.estrelas <= 2)
})

test('missaoCumprida só é true quando todos os critérios são atendidos', () => {
  assert.equal(avaliarPrato(lancheBom, MISSAO_LANCHE).missaoCumprida, true)

  const semFibra = [
    { alimento: iogurteGrego, gramas: 170, grupo: 'proteina' },
    { alimento: banana, gramas: 100, grupo: 'fruta' },
  ]
  assert.equal(avaliarPrato(semFibra, MISSAO_LANCHE).missaoCumprida, false)
  assert.equal(avaliarPrato([], MISSAO_LANCHE).missaoCumprida, false)
})

test('prato nutritivo acima da faixa calórica não cumpre a missão', () => {
  const acima = [
    { alimento: frango, gramas: 150, grupo: 'proteina' },
    { alimento: aveia, gramas: 60, grupo: 'carbo' },
    { alimento: banana, gramas: 100, grupo: 'fruta' },
  ]
  const r = avaliarPrato(acima, MISSAO_LANCHE)
  assert.ok(r.totais.kcal > MISSAO_LANCHE.criterios.kcal.max)
  assert.equal(r.missaoCumprida, false)
})

test('faixas de estrelas: 85/65/45', () => {
  assert.equal(estrelasDaPontuacao(85), 3)
  assert.equal(estrelasDaPontuacao(84), 2)
  assert.equal(estrelasDaPontuacao(65), 2)
  assert.equal(estrelasDaPontuacao(64), 1)
  assert.equal(estrelasDaPontuacao(45), 1)
  assert.equal(estrelasDaPontuacao(44), 0)
})
