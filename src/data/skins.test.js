import test from 'node:test'
import assert from 'node:assert/strict'
import { CATALOGO, PERSONAGENS, FUNDOS, MOLDURAS, RECOMPENSAS, itemPorId } from './skins.js'

// O avatar padrão do banco é borboleta/creme/nenhuma. O primeiro item de cada
// lista é o fallback de itemPorId(), então precisa ser sempre o gratuito.
test('o primeiro item de cada categoria é gratuito e é o padrão do banco', () => {
  assert.equal(PERSONAGENS[0].id, 'borboleta')
  assert.equal(FUNDOS[0].id, 'creme')
  assert.equal(MOLDURAS[0].id, 'nenhuma')
  for (const lista of Object.values(CATALOGO)) {
    assert.equal(lista[0].preco, 0, `${lista[0].id} deveria ser gratuito`)
  }
})

test('não há ids duplicados dentro de cada categoria', () => {
  for (const [categoria, lista] of Object.entries(CATALOGO)) {
    const ids = lista.map((i) => i.id)
    assert.equal(new Set(ids).size, ids.length, `ids duplicados em ${categoria}`)
  }
})

test('a Coleção Elegante existe e custa mais que as skins originais', () => {
  for (const [categoria, lista] of Object.entries(CATALOGO)) {
    const elegantes = lista.filter((i) => i.elegante)
    const originais = lista.filter((i) => !i.elegante)
    assert.ok(elegantes.length >= 2, `${categoria} sem itens da Coleção Elegante`)
    const maisCaroOriginal = Math.max(...originais.map((i) => i.preco))
    for (const item of elegantes) {
      assert.ok(item.preco > maisCaroOriginal, `${item.id} não é objetivo de longo prazo`)
    }
  }
})

test('itemPorId encontra o item e cai no gratuito quando o id não existe', () => {
  assert.equal(itemPorId('personagem', 'fenix').nome, 'Fênix')
  assert.equal(itemPorId('personagem', 'inexistente').id, 'borboleta')
  assert.equal(itemPorId('fundo', 'inexistente').id, 'creme')
})

test('toda recompensa tem valor positivo e rótulo', () => {
  for (const [tipo, r] of Object.entries(RECOMPENSAS)) {
    assert.ok(r.sementes > 0, `${tipo} sem sementes`)
    assert.ok(r.label?.length > 0, `${tipo} sem rótulo`)
  }
})
