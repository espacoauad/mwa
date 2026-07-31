// Liberação gradual dos jogos: a coleção abre aos poucos para não sobrecarregar
// quem está começando. O Monte Seu Prato (carro-chefe) abre logo no dia 2.
export const ORDEM_JOGOS = ['colheita', 'prato', 'vf', 'troca', 'saciedade', 'rotulos']

const DIAS_LIBERACAO = {
  colheita: 1,
  prato: 2,
  vf: 5,
  troca: 8,
  saciedade: 11,
  rotulos: 14,
}

export function diaLiberacaoJogo(jogoId) {
  return DIAS_LIBERACAO[jogoId] ?? 1
}

export function jogoLiberado(jogoId, diaAtual) {
  return diaAtual >= diaLiberacaoJogo(jogoId)
}
