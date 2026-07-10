// Cálculos nutricionais do programa de 21 dias

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
  if (pct >= 60) return { cor: '#C9963B', nome: 'quase lá' }
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

// Dia do programa (1–21) a partir da data de início
export function diaDoPrograma(dataInicio) {
  const inicio = new Date(dataInicio)
  inicio.setHours(0, 0, 0, 0)
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diff = Math.floor((hoje - inicio) / 86400000)
  return Math.min(21, Math.max(1, diff + 1))
}
