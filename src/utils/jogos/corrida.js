// Regras puras da Corrida da Escolha — corredor de 3 pistas onde o jogador
// pega itens saudáveis e desvia dos não saudáveis (sem funções de UI/timer).

import { macrosDoAlimento } from '../../data/alimentos.js'

export const NUM_PISTAS = 3
export const DURACAO_PARTIDA_MS = 35000

const INTERVALO_SPAWN_INICIAL_MS = 1100
const INTERVALO_SPAWN_FINAL_MS = 550
const QUEDA_INICIAL_MS = 2200
const QUEDA_FINAL_MS = 1400

export const PREMIO_MINIMO_PERCENTUAL = 50

function interpolar(decorridoMs, duracaoMs, inicio, fim) {
  const t = Math.min(Math.max(decorridoMs / duracaoMs, 0), 1)
  return inicio + (fim - inicio) * t
}

// Quanto tempo até o próximo item nascer — encolhe conforme a partida avança.
export function intervaloSpawn(decorridoMs, duracaoMs = DURACAO_PARTIDA_MS) {
  return interpolar(decorridoMs, duracaoMs, INTERVALO_SPAWN_INICIAL_MS, INTERVALO_SPAWN_FINAL_MS)
}

// Quanto tempo um item leva para cair até o avatar — encolhe do mesmo jeito.
export function duracaoQueda(decorridoMs, duracaoMs = DURACAO_PARTIDA_MS) {
  return interpolar(decorridoMs, duracaoMs, QUEDA_INICIAL_MS, QUEDA_FINAL_MS)
}

// Sorteia uma pista diferente da anterior, pra manter as 3 pistas ocupadas.
export function pistaAleatoria(anterior = null) {
  if (NUM_PISTAS <= 1) return 0
  let pista
  do {
    pista = Math.floor(Math.random() * NUM_PISTAS)
  } while (pista === anterior)
  return pista
}

// Calorias de "uma mordida" do item = uma porção de referência do alimento.
export function kcalDoItem(item) {
  return macrosDoAlimento(item.alimento, 1, 'porcao').calorias
}

export function percentualSaudavel(kcalSaudavel, kcalNaoSaudavel) {
  const total = kcalSaudavel + kcalNaoSaudavel
  if (total <= 0) return 0
  return Math.round((kcalSaudavel / total) * 100)
}

export function estrelasCorrida(percentual) {
  if (percentual >= 90) return 3
  if (percentual >= 70) return 2
  if (percentual >= 50) return 1
  return 0
}

export function mereceRecompensa(percentual) {
  return percentual >= PREMIO_MINIMO_PERCENTUAL
}

// Lição final — sempre acolhedora, nunca de punição, mesmo no desempenho baixo.
export function mensagemCorrida(percentual) {
  if (percentual >= 90) {
    return {
      pt: 'Desvio quase perfeito! Foi assim, pista a pista, que as calorias saudáveis dominaram o total do dia.',
      en: 'A near-perfect dodge! Lane by lane, that is how the healthy calories took over the total.',
    }
  }
  if (percentual >= 50) {
    return {
      pt: 'Mais da metade das suas calorias vieram de escolhas saudáveis — os itens que passaram batido é que somaram o resto.',
      en: 'More than half your calories came from healthy choices — the items that slipped by are what added the rest.',
    }
  }
  return {
    pt: 'Foi assim que o total de calorias subiu: cada item não saudável que passou pela pista somou junto, sem parecer muito de cada vez.',
    en: 'That is how the calorie total climbed: every unhealthy item that got through added up, without feeling like much at a time.',
  }
}
