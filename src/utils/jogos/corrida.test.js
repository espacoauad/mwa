import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DURACAO_PARTIDA_MS,
  NUM_PISTAS,
  intervaloSpawn,
  duracaoQueda,
  pistaAleatoria,
  percentualSaudavel,
  estrelasCorrida,
  mensagemCorrida,
  PREMIO_MINIMO_PERCENTUAL,
  mereceRecompensa,
  kcalDoItem,
} from './corrida.js'

test('intervalo de spawn diminui conforme o tempo passa', () => {
  const inicio = intervaloSpawn(0)
  const meio = intervaloSpawn(DURACAO_PARTIDA_MS / 2)
  const fim = intervaloSpawn(DURACAO_PARTIDA_MS)
  assert.equal(inicio, 1100)
  assert.equal(fim, 550)
  assert.ok(meio < inicio && meio > fim)
})

test('intervalo de spawn não passa dos limites mesmo além da duração', () => {
  assert.equal(intervaloSpawn(DURACAO_PARTIDA_MS * 2), 550)
  assert.equal(intervaloSpawn(-500), 1100)
})

test('duração da queda diminui conforme o tempo passa', () => {
  assert.equal(duracaoQueda(0), 2200)
  assert.equal(duracaoQueda(DURACAO_PARTIDA_MS), 1400)
  assert.ok(duracaoQueda(DURACAO_PARTIDA_MS / 2) < 2200)
})

test('pista aleatória nunca repete a pista anterior', () => {
  for (let i = 0; i < 200; i++) {
    const anterior = i % NUM_PISTAS
    const proxima = pistaAleatoria(anterior)
    assert.notEqual(proxima, anterior)
    assert.ok(proxima >= 0 && proxima < NUM_PISTAS)
  }
})

test('primeira pista aceita qualquer valor (sem anterior)', () => {
  const pista = pistaAleatoria(null)
  assert.ok(pista >= 0 && pista < NUM_PISTAS)
})

test('percentual saudável calcula a proporção correta e trata divisão por zero', () => {
  assert.equal(percentualSaudavel(80, 20), 80)
  assert.equal(percentualSaudavel(0, 0), 0)
  assert.equal(percentualSaudavel(100, 0), 100)
})

test('estrelas seguem os cortes de 90/70/50%', () => {
  assert.equal(estrelasCorrida(95), 3)
  assert.equal(estrelasCorrida(90), 3)
  assert.equal(estrelasCorrida(89), 2)
  assert.equal(estrelasCorrida(70), 2)
  assert.equal(estrelasCorrida(69), 1)
  assert.equal(estrelasCorrida(50), 1)
  assert.equal(estrelasCorrida(49), 0)
})

test('recompensa exige pelo menos 50% saudável', () => {
  assert.equal(PREMIO_MINIMO_PERCENTUAL, 50)
  assert.equal(mereceRecompensa(50), true)
  assert.equal(mereceRecompensa(49), false)
})

test('mensagem final varia com o desempenho, sempre sem punir', () => {
  const otima = mensagemCorrida(95)
  const media = mensagemCorrida(60)
  const baixa = mensagemCorrida(20)
  assert.notEqual(otima.pt, media.pt)
  assert.notEqual(media.pt, baixa.pt)
  for (const m of [otima, media, baixa]) {
    assert.ok(m.pt.length > 0 && m.en.length > 0)
  }
})

test('kcal do item usa a porção de referência do alimento', () => {
  const item = {
    alimento: {
      kcal: 200,
      porcao: 100,
      unidadeBase: 'g',
      medidas: [{ id: 'g', base: 1 }, { id: 'porcao', base: 100 }],
    },
  }
  assert.equal(kcalDoItem(item), 200)
})
