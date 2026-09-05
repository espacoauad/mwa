// Utilitários de data para a navegação entre dias (edição de dias passados).
// Todas as datas são strings AAAA-MM-DD, mesmo formato usado pela coluna
// `data` das tabelas mwa_refeicoes/mwa_exercicios/mwa_agua/mwa_pesagens.

function formatarISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function diaAnterior(dataISO) {
  const d = new Date(`${dataISO}T00:00:00`)
  d.setDate(d.getDate() - 1)
  return formatarISO(d)
}

export function diaSeguinte(dataISO) {
  const d = new Date(`${dataISO}T00:00:00`)
  d.setDate(d.getDate() + 1)
  return formatarISO(d)
}

export function dataDentroDoIntervalo(dataISO, minISO, maxISO) {
  return dataISO >= minISO && dataISO <= maxISO
}

// Grade de dias do mês de `referenciaISO` (AAAA-MM-01), preenchida com
// `null` nas posições antes do dia 1 para alinhar num grid de 7 colunas
// (domingo primeiro).
export function diasDoMes(referenciaISO) {
  const [ano, mes] = referenciaISO.split('-').map(Number)
  const primeiroDia = new Date(ano, mes - 1, 1)
  const ultimoDia = new Date(ano, mes, 0).getDate()
  const diaSemanaInicio = primeiroDia.getDay()
  const dias = Array.from({ length: diaSemanaInicio }, () => null)
  for (let dia = 1; dia <= ultimoDia; dia++) {
    dias.push(`${ano}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`)
  }
  return dias
}

export function mesAnterior(referenciaISO) {
  const [ano, mes] = referenciaISO.split('-').map(Number)
  const d = new Date(ano, mes - 2, 1)
  return formatarISO(d)
}

export function mesSeguinte(referenciaISO) {
  const [ano, mes] = referenciaISO.split('-').map(Number)
  const d = new Date(ano, mes, 1)
  return formatarISO(d)
}

export function formatarDataExtenso(dataISO, locale) {
  return new Date(`${dataISO}T00:00:00`).toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}
