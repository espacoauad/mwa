import { test } from 'node:test'
import assert from 'node:assert/strict'
import { funcaoDoDia, jogoDaSemana } from './notificacaoFuncoes.js'

test('funcaoDoDia mapeia cada dia da semana pra função certa', () => {
  assert.equal(funcaoDoDia('2026-08-16'), 'versiculo') // domingo
  assert.equal(funcaoDoDia('2026-08-17'), 'conceitos') // segunda
  assert.equal(funcaoDoDia('2026-08-18'), 'exercicio') // terça
  assert.equal(funcaoDoDia('2026-08-19'), null) // quarta
  assert.equal(funcaoDoDia('2026-08-20'), 'lente') // quinta
  assert.equal(funcaoDoDia('2026-08-21'), 'jogo') // sexta
  assert.equal(funcaoDoDia('2026-08-22'), null) // sábado
})

test('jogoDaSemana revezia entre os 6 jogos a cada 7 dias de diaAtual', () => {
  const jogo1 = jogoDaSemana(1)
  const jogo7 = jogoDaSemana(7)
  const jogo8 = jogoDaSemana(8)
  assert.equal(jogo1.id, jogo7.id) // mesma semana (dias 1-7)
  assert.notEqual(jogo1.id, jogo8.id) // semana seguinte (dia 8) já mudou
})

test('jogoDaSemana reinicia o ciclo depois de 6 semanas (42 dias)', () => {
  const jogo1 = jogoDaSemana(1)
  const jogo43 = jogoDaSemana(43) // 6 semanas depois (dia 1 + 6*7)
  assert.equal(jogo1.id, jogo43.id)
})

test('jogoDaSemana cobre os 6 jogos ao longo de 6 semanas seguidas', () => {
  const ids = [1, 8, 15, 22, 29, 36].map((dia) => jogoDaSemana(dia).id)
  const idsUnicos = new Set(ids)
  assert.equal(idsUnicos.size, 6)
})
