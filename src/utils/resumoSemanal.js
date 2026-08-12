// Retrato da Semana: seleção de pontos fortes/ponto de atenção e copy fixa,
// sem IA — tudo derivado de 4 contadores (0-7) já rastreados pelo app.

export const FORTE_FRAGMENTO = {
  refeicao: 'registrou suas refeições',
  agua: 'bateu sua meta de água',
  proteina: 'bateu sua meta de proteína',
  exercicio: 'registrou exercícios',
}

export const ATENCAO_FRASE = {
  refeicao: (n) =>
    `O registro das refeições foi o que mais ficou de lado essa semana — só ${n} dos 7 dias. Que tal focar só em registrar o café da manhã na próxima semana? Não precisa ser tudo de uma vez.`,
  agua: (n) =>
    `A água foi o que mais escapou essa semana — a meta só foi batida em ${n} dos 7 dias. Uma sugestão simples: deixe uma garrafa cheia visível na mesa, ela lembra por você.`,
  proteina: (n) =>
    `A meta de proteína só foi batida em ${n} dos 7 dias essa semana. Vale reforçar uma fonte de proteína em cada refeição principal — não precisa ser perfeito, só mais presente.`,
  exercicio: (n) =>
    `O exercício foi o que mais ficou pra trás essa semana — só ${n} dos 7 dias. Comece pequeno: 15 minutos já contam.`,
}

export const MENSAGEM_SEMANA_PARADA =
  'Essa foi uma semana mais parada, e tudo bem — cada semana é diferente. Que tal escolher só uma coisa pequena pra focar na próxima?'

const ORDEM_METRICAS = ['refeicao', 'agua', 'proteina', 'exercicio']
const PISO_PONTO_FORTE = 3

// dias: as 7 datas ISO da semana (diasDaSemana). Os mapas *PorDia usam
// essas mesmas datas como chave — valor truthy (refeicao/exercicio) ou
// numérico (agua/proteina) para o dia em questão.
export function calcularResumoSemanal({
  dias,
  refeicoesPorDia,
  proteinaPorDia,
  aguaPorDia,
  exercicioPorDia,
  metaProteina,
  metaAguaMl,
}) {
  const contadores = {
    refeicao: dias.filter((d) => refeicoesPorDia.get(d)).length,
    agua: dias.filter((d) => (aguaPorDia.get(d) ?? 0) >= metaAguaMl).length,
    proteina: dias.filter((d) => (proteinaPorDia.get(d) ?? 0) >= metaProteina).length,
    exercicio: dias.filter((d) => exercicioPorDia.get(d)).length,
  }

  const ordenado = [...ORDEM_METRICAS].sort((a, b) => contadores[b] - contadores[a])

  const elegiveis = ordenado.filter((chave) => contadores[chave] >= PISO_PONTO_FORTE)
  const pontosFortes = elegiveis.slice(0, 2).map((chave) => ({ chave, n: contadores[chave] }))
  const semanaParada = pontosFortes.length === 0

  let pontoAtencao = null
  if (!semanaParada) {
    const maisFraca = ordenado[ordenado.length - 1]
    const maisForte = ordenado[0]
    if (contadores[maisFraca] !== contadores[maisForte]) {
      pontoAtencao = { chave: maisFraca, n: contadores[maisFraca] }
    }
  }

  return { contadores, pontosFortes, pontoAtencao, semanaParada }
}
