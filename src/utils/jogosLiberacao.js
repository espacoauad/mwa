// Liberação gradual dos jogos: 1 jogo novo a cada 3 dias, começando no dia 1.
// Ordem definida: Colheita → Escolhas → Treino → Poda → Plantio → Restaurante → Jardim de Afirmações (por último).
export const ORDEM_JOGOS = ['colheita', 'escolhas', 'treino', 'poda', 'plantio', 'restaurante', 'mente']
const INTERVALO_DIAS = 3

export function diaLiberacaoJogo(jogoId) {
  const indice = ORDEM_JOGOS.indexOf(jogoId)
  if (indice === -1) return 1
  return 1 + indice * INTERVALO_DIAS
}

export function jogoLiberado(jogoId, diaAtual) {
  return diaAtual >= diaLiberacaoJogo(jogoId)
}
