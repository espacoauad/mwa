// Regras de progresso dos jogos — funções puras (sem banco, sem UI).
// O recorde nunca regride: uma tentativa pior conta como partida, mas não apaga a conquista.

export function mesclarProgresso(anterior, resultado) {
  const base = anterior ?? { melhor_pontuacao: 0, estrelas: 0, partidas: 0 }
  return {
    melhor_pontuacao: Math.max(base.melhor_pontuacao, resultado.pontuacao),
    estrelas: Math.max(base.estrelas, resultado.estrelas),
    partidas: base.partidas + 1,
  }
}

// Um nível abre quando alguma missão do nível anterior alcançou 2+ estrelas.
export function nivelLiberado(nivel, missoes, progressoPorMissaoId = {}) {
  if (nivel <= 1) return true
  return missoes
    .filter((m) => m.nivel === nivel - 1)
    .some((m) => (progressoPorMissaoId[m.id]?.estrelas ?? 0) >= 2)
}

export function progressoPorMissao(linhas) {
  const mapa = {}
  for (const linha of linhas ?? []) {
    mapa[linha.missao_id] = {
      melhor_pontuacao: linha.melhor_pontuacao,
      estrelas: linha.estrelas,
      partidas: linha.partidas,
    }
  }
  return mapa
}
