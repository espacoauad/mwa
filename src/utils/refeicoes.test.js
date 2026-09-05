import test from 'node:test'
import assert from 'node:assert/strict'
import { itemDoBanco, itemParaBanco, refeicaoDoBanco, totaisDaRefeicao } from './refeicoes.js'

test('itemDoBanco converte linha do banco pro formato do app', () => {
  const linha = {
    id: 'item-1', alimento_id: 'arroz-cozido', nome: 'Arroz cozido', marca: null,
    quantidade: 100, quantidade_base: 100, medida_id: 'g', medida_nome: '100 g',
    manual: false, calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6,
  }
  assert.deepEqual(itemDoBanco(linha), {
    id: 'item-1', alimentoId: 'arroz-cozido', nome: 'Arroz cozido', marca: null,
    quantidade: 100, quantidadeBase: 100, medidaId: 'g', medidaNome: '100 g',
    manual: false, calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6,
  })
})

test('itemParaBanco converte item do app pro formato do banco, sem id', () => {
  const item = {
    alimentoId: 'feijao-cozido', nome: 'Feijão cozido', marca: null,
    quantidade: 80, quantidadeBase: 80, medidaId: 'g', medidaNome: '80 g',
    manual: false, calorias: 55, proteina: 3.6, carbos: 10, gordura: 0.3, fibras: 3.5,
  }
  assert.deepEqual(itemParaBanco(item), {
    alimento_id: 'feijao-cozido', nome: 'Feijão cozido', marca: null,
    quantidade: 80, quantidade_base: 80, medida_id: 'g', medida_nome: '80 g',
    manual: false, calorias: 55, proteina: 3.6, carbos: 10, gordura: 0.3, fibras: 3.5,
  })
})

test('refeicaoDoBanco agrupa a refeicao com seus itens', () => {
  const linha = { id: 'ref-1', data: '2026-08-09', tipo: 'Almoço', horario: '12:30', foto_url: null }
  const itensBanco = [
    { id: 'item-1', alimento_id: 'arroz-cozido', nome: 'Arroz cozido', marca: null, quantidade: 100, quantidade_base: 100, medida_id: 'g', medida_nome: '100 g', manual: false, calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6 },
  ]
  const refeicao = refeicaoDoBanco(linha, itensBanco)
  assert.equal(refeicao.id, 'ref-1')
  assert.equal(refeicao.tipo, 'Almoço')
  assert.equal(refeicao.fotoUrl, null)
  assert.equal(refeicao.itens.length, 1)
  assert.equal(refeicao.itens[0].nome, 'Arroz cozido')
})

test('totaisDaRefeicao soma os macros de todos os itens', () => {
  const refeicao = {
    itens: [
      { calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6 },
      { calorias: 55, proteina: 3.6, carbos: 10, gordura: 0.3, fibras: 3.5 },
    ],
  }
  assert.deepEqual(totaisDaRefeicao(refeicao), {
    calorias: 185, proteina: 6.3, carbos: 38, gordura: 0.6, fibras: 5.1,
  })
})

test('totaisDaRefeicao com refeicao vazia retorna zeros', () => {
  assert.deepEqual(totaisDaRefeicao({ itens: [] }), {
    calorias: 0, proteina: 0, carbos: 0, gordura: 0, fibras: 0,
  })
})
