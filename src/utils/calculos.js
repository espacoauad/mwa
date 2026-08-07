// Cálculos nutricionais da Jornada de 30 Dias

export const NIVEIS_ATIVIDADE = [
  { id: 'sedentario', label: 'Sedentário', descricao: 'Pouco ou nenhum exercício', fator: 1.2 },
  { id: 'leve', label: 'Levemente ativo', descricao: 'Exercício leve 1–3x por semana', fator: 1.375 },
  { id: 'moderado', label: 'Moderadamente ativo', descricao: 'Exercício moderado 3–5x por semana', fator: 1.55 },
  { id: 'intenso', label: 'Muito ativo', descricao: 'Exercício intenso 6–7x por semana', fator: 1.725 },
  { id: 'atleta', label: 'Extremamente ativo', descricao: 'Treino pesado diário ou trabalho físico', fator: 1.9 },
]

export const OBJETIVOS = [
  { id: 'emagrecer', label: 'Emagrecer', descricao: 'Déficit calórico saudável', emoji: '🔥', ajuste: -500 },
  { id: 'manter', label: 'Manter o peso', descricao: 'Equilíbrio e bem-estar', emoji: '⚖️', ajuste: 0 },
  { id: 'ganhar', label: 'Ganhar massa', descricao: 'Superávit para hipertrofia', emoji: '💪', ajuste: 300 },
]

export const TIPOS_REFEICAO = [
  'Café da manhã',
  'Lanche da manhã',
  'Almoço',
  'Lanche da tarde',
  'Jantar',
  'Ceia',
]

// TMB — fórmula de Mifflin-St Jeor
export function calcularTMB({ sexo, peso, altura, idade }) {
  const base = 10 * peso + 6.25 * altura - 5 * idade
  return Math.round(sexo === 'masculino' ? base + 5 : base - 161)
}

// TDEE — TMB multiplicada pelo fator de atividade
export function calcularTDEE(tmb, nivelAtividadeId) {
  const nivel = NIVEIS_ATIVIDADE.find((n) => n.id === nivelAtividadeId)
  return Math.round(tmb * (nivel ? nivel.fator : 1.2))
}

// Metas diárias completas a partir dos dados do onboarding
export function calcularMetas(dados) {
  const tmb = calcularTMB(dados)
  const tdee = calcularTDEE(tmb, dados.nivelAtividade)
  const objetivo = OBJETIVOS.find((o) => o.id === dados.objetivo) ?? OBJETIVOS[1]

  // Nunca abaixo da TMB por segurança
  const calorias = Math.max(tmb, tdee + objetivo.ajuste)

  // Distribuição de macros: 30% proteína / 40% carboidrato / 30% gordura
  const proteina = Math.round((calorias * 0.3) / 4)
  const carboidrato = Math.round((calorias * 0.4) / 4)
  const gordura = Math.round((calorias * 0.3) / 9)

  // Fibras: 14 g por 1000 kcal (recomendação padrão)
  const fibras = Math.round((calorias / 1000) * 14)

  // Água: 35 ml por kg, em copos de 250 ml
  const aguaMl = Math.round(dados.peso * 35)
  const aguaL = Math.round((aguaMl / 1000) * 10) / 10
  const copos = Math.max(6, Math.round(aguaMl / 250))

  return { tmb, tdee, calorias, proteina, carboidrato, gordura, fibras, aguaMl, aguaL, copos }
}

// Percentual de uma meta atingida (0–100+, sem teto para mostrar excesso)
export function percentualMeta(consumido, meta) {
  if (!meta) return 0
  return Math.round((consumido / meta) * 100)
}

// Semáforo das metas: verde atingida, amarelo próxima, vermelho longe
export function statusMeta(pct) {
  if (pct >= 100) return { cor: '#879B55', nome: 'atingida' }
  if (pct >= 60) return { cor: '#C59F4F', nome: 'quase lá' }
  return { cor: '#B0563C', nome: 'em andamento' }
}

export function dataHojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function horarioAgora() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function diasDesde(dataISO) {
  const inicio = new Date(dataISO)
  inicio.setHours(0, 0, 0, 0)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return Math.floor((hoje - inicio) / 86400000) + 1
}

// O 90d ativo é a fonte de verdade: enquanto existir, mostramos essa linha.
// `programas` é a lista já mapeada para camelCase (ver programaDoBanco em AppContext).
export function programa90Ativo(programas) {
  return (programas ?? []).find((p) => p.tipo === '90d' && p.status === 'ativo') ?? null
}

// Dia do programa (1–90), contado sempre a partir de UMA única data-âncora: o
// início real da Jornada de 30 Dias (tipo '21d' no banco — identificador
// histórico — ou o perfil, para contas antigas sem registro em mwa_programas).
// Sem 90d ativo: contador trava em 30 (fim da jornada de entrada).
// Com 90d ativo: o cap de 30 é removido e o contador segue até 90 — usando a
// MESMA data-âncora, não a data de compra do 90d. Isso é proposital: se a
// aluna comprar a continuidade de uma vez (bundle no checkout) ou no meio dos
// 30 dias, ela continua vendo os dias 1–30 normalmente, dia a dia, e só
// avança para o conteúdo do dia 31+ quando o calendário real chegar lá — sem
// pular para o dia 31 no instante da compra (bug corrigido em 2026-07-21).
export function diaDoPrograma(programas, dataInicioFallback) {
  // Modo de revisão: permite visualizar qualquer dia sem restrições
  const modoRevisao = typeof sessionStorage !== 'undefined' ? JSON.parse(sessionStorage.getItem('mwaModorevisao') || 'null') : null
  if (modoRevisao?.ativo && modoRevisao?.diaVisualizacao) {
    return modoRevisao.diaVisualizacao
  }

  const p21 = (programas ?? []).find((p) => p.tipo === '21d')
  const inicio = p21?.dataInicio ?? dataInicioFallback
  const diaCorrido = diasDesde(inicio)

  const p90 = programa90Ativo(programas)
  if (p90) {
    return Math.min(90, Math.max(1, diaCorrido))
  }
  return Math.min(30, Math.max(1, diaCorrido))
}

// Total de dias do programa da cliente, para exibição de progresso (barra, "Dia X de Y").
export function totalDiasPrograma(programas) {
  return programa90Ativo(programas) ? 90 : 30
}
