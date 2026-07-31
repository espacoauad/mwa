import test from 'node:test'
import assert from 'node:assert/strict'
import {
  METAS_ESTRELA,
  metasCumpridas,
  ganhouEstrelaHoje,
  diasDaSemana,
  estrelasDaSemana,
  constelacaoCompleta,
  mensagemLembrete,
} from './estrelas.js'

const SEG = '2026-07-20' // segunda-feira
const TER = '2026-07-21'
const DOM = '2026-07-26' // domingo da mesma semana

test('a estrela do dia exige 2 das 3 micro-metas', () => {
  assert.equal(ganhouEstrelaHoje({ registro: true, conteudo: false, desafio: false }), false)
  assert.equal(ganhouEstrelaHoje({ registro: true, conteudo: true, desafio: false }), true)
  assert.equal(ganhouEstrelaHoje({ registro: false, conteudo: true, desafio: true }), true)
  assert.equal(ganhouEstrelaHoje({ registro: true, conteudo: true, desafio: true }), true)
})

test('metasCumpridas traduz as tarefas do dia nas 3 micro-metas', () => {
  const tarefas = { refeicao: true, agua: false, dica: true, exercicio: false }
  const metas = metasCumpridas(tarefas, { jogouHoje: false })
  assert.equal(metas.registro, true)
  assert.equal(metas.conteudo, true)
  assert.equal(metas.desafio, false)
  assert.equal(METAS_ESTRELA.length, 3)
})

test('água sozinha também cumpre a meta de registro', () => {
  const metas = metasCumpridas({ refeicao: false, agua: true, dica: false }, { jogouHoje: false })
  assert.equal(metas.registro, true)
})

test('jogar um desafio cumpre a terceira meta', () => {
  const metas = metasCumpridas({}, { jogouHoje: true })
  assert.equal(metas.desafio, true)
})

test('a semana vai de segunda a domingo', () => {
  const dias = diasDaSemana(TER)
  assert.equal(dias.length, 7)
  assert.equal(dias[0], SEG)
  assert.equal(dias[6], DOM)
  assert.deepEqual(diasDaSemana(DOM), dias)
})

test('estrelasDaSemana marca só os dias com evento de estrela', () => {
  const eventos = [{ ref: SEG }, { ref: TER }]
  const semana = estrelasDaSemana(TER, eventos)
  assert.equal(semana.filter((d) => d.acesa).length, 2)
  assert.equal(semana[0].acesa, true)
  assert.equal(semana[2].acesa, false)
  assert.equal(semana[1].hoje, true)
})

test('a constelação fecha com as 7 estrelas da semana', () => {
  const seteDias = diasDaSemana(TER).map((ref) => ({ ref }))
  assert.equal(constelacaoCompleta(estrelasDaSemana(TER, seteDias)), true)
  assert.equal(constelacaoCompleta(estrelasDaSemana(TER, [{ ref: SEG }])), false)
})

test('o lembrete muda conforme o que falta, sempre sem culpa', () => {
  const cheio = mensagemLembrete({ registro: true, conteudo: true, desafio: true }, false)
  assert.match(cheio.pt, /acesa|conquistou/i)

  const vazio = mensagemLembrete({ registro: false, conteudo: false, desafio: false }, false)
  assert.ok(vazio.pt.length > 0)
  assert.doesNotMatch(vazio.pt, /falhou|perdeu|culpa/i)
})
