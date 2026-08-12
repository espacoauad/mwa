// Retrato da Semana: seleção de pontos fortes/ponto de atenção e copy fixa,
// sem IA — tudo derivado de 4 contadores (0-7) já rastreados pelo app.

export const FORTE_FRAGMENTO = {
  refeicao: 'registrou suas refeições',
  agua: 'bateu sua meta de água',
  proteina: 'bateu sua meta de proteína',
  exercicio: 'registrou exercícios',
}

function emDias(n) {
  return n === 0 ? 'nenhum dos 7 dias' : `${n} dos 7 dias`
}

export const ATENCAO_FRASE = {
  refeicao: (n) =>
    `O registro das refeições foi o que mais ficou de lado essa semana — só ${emDias(n)}. Que tal focar só em registrar o café da manhã na próxima semana? Não precisa ser tudo de uma vez.`,
  agua: (n) =>
    `A água foi o que mais escapou essa semana — a meta só foi batida em ${emDias(n)}. Uma sugestão simples: deixe uma garrafa cheia visível na mesa, ela lembra por você.`,
  proteina: (n) =>
    `A meta de proteína só foi batida em ${emDias(n)} essa semana. Vale reforçar uma fonte de proteína em cada refeição principal — não precisa ser perfeito, só mais presente.`,
  exercicio: (n) =>
    `O exercício foi o que mais ficou pra trás essa semana — só ${emDias(n)}. Comece pequeno: 15 minutos já contam.`,
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
    const empateTotal = contadores[maisFraca] === contadores[maisForte]
    const maisFracaJaEhForte = contadores[maisFraca] >= PISO_PONTO_FORTE
    if (!empateTotal && !maisFracaJaEhForte) {
      pontoAtencao = { chave: maisFraca, n: contadores[maisFraca] }
    }
  }

  return { contadores, pontosFortes, pontoAtencao, semanaParada }
}

// Agrega as linhas brutas do Supabase (já filtradas pela semana) nos mapas
// data -> valor que calcularResumoSemanal espera. Isolado do componente
// porque soma proteína entre múltiplas refeições do mesmo dia — a parte
// mais fácil de quebrar silenciosamente, e a única sem cobertura de teste
// possível dentro de um arquivo .jsx neste repositório.
export function agregarSemana({ refeicoesRows, aguaRows, exerciciosRows }) {
  const refeicoesPorDia = new Map()
  const proteinaPorDia = new Map()
  for (const r of refeicoesRows ?? []) {
    refeicoesPorDia.set(r.data, true)
    const proteinaRefeicao = (r.mwa_refeicoes_itens ?? []).reduce(
      (soma, item) => soma + Number(item.proteina),
      0,
    )
    proteinaPorDia.set(r.data, (proteinaPorDia.get(r.data) ?? 0) + proteinaRefeicao)
  }

  const aguaPorDia = new Map()
  for (const a of aguaRows ?? []) {
    aguaPorDia.set(a.data, a.ml)
  }

  const exercicioPorDia = new Map()
  for (const e of exerciciosRows ?? []) {
    exercicioPorDia.set(e.data, true)
  }

  return { refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia }
}
