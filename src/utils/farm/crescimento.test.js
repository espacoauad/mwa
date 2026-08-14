import test from 'node:test'
import assert from 'node:assert/strict'
import { estagioDoPilar, decoracoesLiberadas, resumoFazenda } from './crescimento.js'
import { PILARES } from '../../data/farm/pilares.js'
import { DECORACOES } from '../../data/farm/decoracoes.js'

test('estagioDoPilar começa em semente (0) sem nenhum cuidado', () => {
  const pilar = PILARES[0].id
  assert.equal(estagioDoPilar(pilar, {}), 0)
  assert.equal(estagioDoPilar(pilar, { [pilar]: 0 }), 0)
})

test('estagioDoPilar avança 1 estágio a cada 10 cuidados e satura em 3 (plena)', () => {
  const pilar = PILARES[0].id
  assert.equal(estagioDoPilar(pilar, { [pilar]: 9 }), 0) // ainda semente
  assert.equal(estagioDoPilar(pilar, { [pilar]: 10 }), 1) // broto
  assert.equal(estagioDoPilar(pilar, { [pilar]: 20 }), 2) // floração
  assert.equal(estagioDoPilar(pilar, { [pilar]: 30 }), 3) // plena
  assert.equal(estagioDoPilar(pilar, { [pilar]: 500 }), 3) // satura, nunca passa de 3
})

test('estagioDoPilar tolera contagens ausentes, undefined ou id desconhecido sem quebrar', () => {
  const pilar = PILARES[0].id
  assert.equal(estagioDoPilar(pilar, undefined), 0)
  assert.equal(estagioDoPilar(pilar, {}), 0)
  assert.equal(estagioDoPilar('inexistente', { [pilar]: 50 }), 0)
})

test('decoracoesLiberadas cresce exatamente nos limites dos marcos', () => {
  assert.equal(decoracoesLiberadas(10).length, 0)
  assert.equal(decoracoesLiberadas(11).length, 1) // galinha
  assert.equal(decoracoesLiberadas(14).length, 1)
  assert.equal(decoracoesLiberadas(15).length, 2) // + cerca
  assert.equal(decoracoesLiberadas(90).length, DECORACOES.length) // tudo liberado
})

test('resumoFazenda agrega os 8 pilares (com estagio) e as decorações', () => {
  const contagens = { [PILARES[0].id]: 15, [PILARES[7].id]: 5 }
  const resumo = resumoFazenda(contagens, 30)
  assert.equal(resumo.pilares.length, 8)
  assert.ok(resumo.pilares.every((p) => 'estagio' in p))
  assert.equal(resumo.pilares.find((p) => p.id === PILARES[0].id).estagio, 1) // 15 cuidados = broto
  assert.equal(resumo.pilares.find((p) => p.id === PILARES[7].id).estagio, 0) // 5 cuidados = semente
  assert.ok(Array.isArray(resumo.decoracoes))
  assert.equal(resumo.decoracoes.length, decoracoesLiberadas(30).length)
})

test('resumoFazenda com contagens e diaAtual ausentes não quebra', () => {
  const resumo = resumoFazenda(undefined, undefined)
  assert.equal(resumo.pilares.length, 8)
  assert.ok(resumo.pilares.every((p) => p.estagio === 0))
  assert.equal(resumo.decoracoes.length, decoracoesLiberadas(1).length)
})
