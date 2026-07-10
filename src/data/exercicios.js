// Tabela MET por tipo de exercício e intensidade
// Gasto calórico = MET × peso (kg) × duração (horas)

export const TIPOS_EXERCICIO = [
  { id: 'caminhada', nome: 'Caminhada', emoji: '🚶', met: { leve: 2.8, moderada: 3.5, alta: 4.5 } },
  { id: 'corrida', nome: 'Corrida', emoji: '🏃', met: { leve: 7.0, moderada: 9.8, alta: 11.5 } },
  { id: 'musculacao', nome: 'Musculação', emoji: '🏋️', met: { leve: 3.5, moderada: 5.0, alta: 6.0 } },
  { id: 'ciclismo', nome: 'Ciclismo / bike', emoji: '🚴', met: { leve: 4.0, moderada: 6.8, alta: 8.5 } },
  { id: 'natacao', nome: 'Natação', emoji: '🏊', met: { leve: 5.8, moderada: 7.0, alta: 9.8 } },
  { id: 'hiit', nome: 'HIIT / funcional', emoji: '⚡', met: { leve: 6.0, moderada: 8.0, alta: 10.0 } },
  { id: 'yoga', nome: 'Yoga / pilates', emoji: '🧘', met: { leve: 2.5, moderada: 3.0, alta: 4.0 } },
  { id: 'danca', nome: 'Dança', emoji: '💃', met: { leve: 3.5, moderada: 5.0, alta: 7.3 } },
  { id: 'futebol', nome: 'Futebol / esportes', emoji: '⚽', met: { leve: 5.0, moderada: 7.0, alta: 10.0 } },
  { id: 'faxina', nome: 'Tarefas domésticas', emoji: '🧹', met: { leve: 2.5, moderada: 3.3, alta: 4.0 } },
]

export const INTENSIDADES = [
  { id: 'leve', label: 'Leve', descricao: 'Dá para conversar tranquilamente' },
  { id: 'moderada', label: 'Moderada', descricao: 'Conversa com algum esforço' },
  { id: 'alta', label: 'Alta', descricao: 'Difícil falar frases completas' },
]

export function calcularGastoCalorico(tipoId, intensidadeId, duracaoMin, pesoKg) {
  const tipo = TIPOS_EXERCICIO.find((t) => t.id === tipoId)
  if (!tipo || !duracaoMin || !pesoKg) return 0
  const met = tipo.met[intensidadeId] ?? tipo.met.moderada
  return Math.round(met * pesoKg * (duracaoMin / 60))
}
