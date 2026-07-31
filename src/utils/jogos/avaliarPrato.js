// Motor de avaliação do Monte Seu Prato — função pura, sem UI.
// Recebe itens [{ alimento (valores por 100 g), gramas, grupo }] e uma missão,
// devolve pontuação 0–100, estrelas, critérios da missão e componentes da nota.
//
// Filosofia MWA: não existe resposta única — várias combinações alcançam 3 estrelas.
// A nota considera missão, equilíbrio de macros, variedade, porções e saciedade estimada.

const PESOS = { missao: 50, equilibrio: 15, variedade: 12, porcoes: 15, saciedade: 8 }

// Faixas amplas de distribuição calórica (% das kcal) — equilíbrio, não prescrição
const FAIXA_PROT = [10, 40]
const FAIXA_CARB = [30, 65]
const FAIXA_GORD = [10, 40]

// Faixa genérica de energia por tipo de refeição (componente "porções")
const FAIXA_KCAL_REFEICAO = { lanche: [100, 500], refeicao: [250, 900] }

export function totaisDoPrato(itens) {
  const soma = { kcal: 0, prot: 0, carb: 0, gord: 0, fibra: 0, gramas: 0 }
  for (const { alimento, gramas } of itens) {
    const f = (Number(gramas) || 0) / 100
    soma.kcal += alimento.kcal * f
    soma.prot += alimento.prot * f
    soma.carb += alimento.carb * f
    soma.gord += alimento.gord * f
    soma.fibra += alimento.fibra * f
    soma.gramas += Number(gramas) || 0
  }
  return {
    kcal: Math.round(soma.kcal),
    prot: Math.round(soma.prot * 10) / 10,
    carb: Math.round(soma.carb * 10) / 10,
    gord: Math.round(soma.gord * 10) / 10,
    fibra: Math.round(soma.fibra * 10) / 10,
    gramas: Math.round(soma.gramas),
  }
}

export function estrelasDaPontuacao(pontuacao) {
  if (pontuacao >= 85) return 3
  if (pontuacao >= 65) return 2
  if (pontuacao >= 45) return 1
  return 0
}

// Grau de cumprimento de um mínimo: 1 se atingiu, cai 2× mais rápido que o déficit relativo
function grauMinimo(atual, min) {
  if (atual >= min) return 1
  return Math.max(0, 1 - (2 * (min - atual)) / min)
}

function grauFaixaKcal(atual, { min, max }) {
  if (atual > max) return Math.max(0, 1 - (2 * (atual - max)) / max)
  if (atual < min) return Math.max(0, 1 - (2 * (min - atual)) / min)
  return 1
}

// Pontos de um macro dentro da faixa percentual, com tolerância de 15 p.p.
function pontosFaixaPct(pct, [min, max], maximo) {
  if (pct >= min && pct <= max) return maximo
  const distancia = pct < min ? min - pct : pct - max
  return maximo * Math.max(0, 1 - distancia / 15)
}

function avaliarCriterios(totais, itens, missao) {
  const criterios = []
  const c = missao.criterios ?? {}

  if (c.kcal) {
    criterios.push({
      id: 'kcal',
      atual: totais.kcal,
      alvo: c.kcal,
      ok: totais.kcal >= c.kcal.min && totais.kcal <= c.kcal.max,
      grau: grauFaixaKcal(totais.kcal, c.kcal),
    })
  }
  if (c.prot) {
    criterios.push({ id: 'prot', atual: totais.prot, alvo: c.prot, ok: totais.prot >= c.prot.min, grau: grauMinimo(totais.prot, c.prot.min) })
  }
  if (c.fibra) {
    criterios.push({ id: 'fibra', atual: totais.fibra, alvo: c.fibra, ok: totais.fibra >= c.fibra.min, grau: grauMinimo(totais.fibra, c.fibra.min) })
  }
  for (const [chave, minimo] of Object.entries(c.gruposMin ?? {})) {
    const grupos = chave.split('|')
    const quantos = itens.filter((i) => grupos.includes(i.grupo)).length
    criterios.push({ id: `grupos:${chave}`, atual: quantos, alvo: { min: minimo }, ok: quantos >= minimo, grau: Math.min(1, quantos / minimo) })
  }
  return criterios
}

function pontosMissao(criterios) {
  if (criterios.length === 0) return PESOS.missao
  // O critério de kcal pesa em dobro: é o coração da missão
  let shares = 0
  let obtido = 0
  for (const criterio of criterios) {
    const peso = criterio.id === 'kcal' ? 2 : 1
    shares += peso
    obtido += peso * criterio.grau
  }
  return (obtido / shares) * PESOS.missao
}

function pontosEquilibrio(totais) {
  if (totais.kcal <= 0) return 0
  const terco = PESOS.equilibrio / 3
  const protPct = (totais.prot * 4 * 100) / totais.kcal
  const carbPct = (totais.carb * 4 * 100) / totais.kcal
  const gordPct = (totais.gord * 9 * 100) / totais.kcal
  return (
    pontosFaixaPct(protPct, FAIXA_PROT, terco) +
    pontosFaixaPct(carbPct, FAIXA_CARB, terco) +
    pontosFaixaPct(gordPct, FAIXA_GORD, terco)
  )
}

function pontosVariedade(itens) {
  const grupos = new Set(itens.map((i) => i.grupo))
  let pontos = grupos.size >= 3 ? 8 : grupos.size === 2 ? 5 : grupos.size === 1 ? 2 : 0
  if (itens.some((i) => i.grupo === 'vegetal' || i.grupo === 'fruta')) pontos += 4
  return pontos
}

function pontosPorcoes(totais, missao) {
  const faixa = FAIXA_KCAL_REFEICAO[missao.tipoRefeicao] ?? FAIXA_KCAL_REFEICAO.refeicao
  if (totais.kcal >= faixa[0] && totais.kcal <= faixa[1]) return PESOS.porcoes
  const fora = totais.kcal > faixa[1] ? totais.kcal - faixa[1] : faixa[0] - totais.kcal
  return PESOS.porcoes * Math.max(0, 1 - fora / 300)
}

// Heurística de saciedade estimada: proteína + fibra + densidade calórica (kcal/g).
// É uma tendência, não uma certeza — a UI sempre comunica com "tende a".
function pontosSaciedade(totais) {
  if (totais.gramas <= 0) return 0
  let pontos = 0
  if (totais.prot >= 15) pontos += 3
  else if (totais.prot >= 10) pontos += 1.5
  if (totais.fibra >= 5) pontos += 3
  else if (totais.fibra >= 3) pontos += 1.5
  const densidade = totais.kcal / totais.gramas
  if (densidade <= 1.25) pontos += 2
  else if (densidade <= 1.75) pontos += 1
  return Math.min(PESOS.saciedade, pontos)
}

function sugestaoPrincipal(criterios, totais) {
  // Estourar a faixa calórica vem antes de qualquer outra lacuna: sem déficit não há
  // resultado, por mais nutritivo que o prato seja.
  const kcalCriterio = criterios.find((c) => c.id === 'kcal')
  if (kcalCriterio && totais.kcal > kcalCriterio.alvo.max) return 'menos-calorias'

  const fibra = criterios.find((c) => c.id === 'fibra')
  if (fibra && !fibra.ok) return 'mais-fibra'
  const prot = criterios.find((c) => c.id === 'prot')
  if (prot && !prot.ok) return 'mais-proteina'
  const grupos = criterios.find((c) => c.id.startsWith('grupos:'))
  if (grupos && !grupos.ok) return 'mais-vegetais'
  if (kcalCriterio && !kcalCriterio.ok) return 'mais-calorias'
  if (totais.fibra < 6) return 'mais-fibra'
  return null
}

function excedeuFaixaCalorica(criterios, totais) {
  const kcal = criterios.find((c) => c.id === 'kcal')
  return Boolean(kcal && totais.kcal > kcal.alvo.max)
}

export function avaliarPrato(itens, missao) {
  const totais = totaisDoPrato(itens)
  const criterios = avaliarCriterios(totais, itens, missao)

  if (itens.length === 0) {
    return {
      pontuacao: 0,
      estrelas: 0,
      totais,
      criterios,
      detalhes: { missao: 0, equilibrio: 0, variedade: 0, porcoes: 0, saciedade: 0 },
      sugestao: 'mais-calorias',
      excedeuCalorias: false,
      missaoCumprida: false,
    }
  }

  const detalhes = {
    missao: pontosMissao(criterios),
    equilibrio: pontosEquilibrio(totais),
    variedade: pontosVariedade(itens),
    porcoes: pontosPorcoes(totais, missao),
    saciedade: pontosSaciedade(totais),
  }

  let pontuacao = Math.round(detalhes.missao + detalhes.equilibrio + detalhes.variedade + detalhes.porcoes + detalhes.saciedade)

  // Critério da missão totalmente perdido (grau 0) → nota máxima 60 (1 estrela):
  // o prato pode até estar "equilibrado", mas não cumpre o que a missão pediu.
  if (criterios.some((c) => c.grau === 0)) pontuacao = Math.min(pontuacao, 60)

  // 3 estrelas só com todos os critérios da missão cumpridos
  let estrelas = estrelasDaPontuacao(pontuacao)
  if (estrelas === 3 && criterios.some((c) => !c.ok)) estrelas = 2

  return {
    pontuacao,
    estrelas,
    totais,
    criterios,
    detalhes,
    sugestao: sugestaoPrincipal(criterios, totais),
    excedeuCalorias: excedeuFaixaCalorica(criterios, totais),
    // A recompensa em sementes depende disto: a missão só conta como cumprida
    // quando todos os critérios são atendidos.
    missaoCumprida: criterios.every((c) => c.ok),
  }
}
