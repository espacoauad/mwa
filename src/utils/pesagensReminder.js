/**
 * Calcula os dias de pesagem do programa MWA
 * Programa de 21 dias: dias 7, 14, 21
 * Programa de 90 dias: dias 28, 35, 42, 49, 56, 63, 70, 77, 84, 90
 */

export function getDiasPesagem(totalDiasPrograma) {
  const dias = []

  if (totalDiasPrograma >= 21) {
    // Dias de pesagem do programa de 21 dias
    dias.push(7, 14, 21)
  }

  if (totalDiasPrograma > 21) {
    // Dias de pesagem do programa de 90 dias (a cada 7 dias depois do dia 21)
    for (let dia = 28; dia <= totalDiasPrograma; dia += 7) {
      dias.push(dia)
    }
    // A grade de 7 em 7 a partir do dia 28 nunca cai exatamente no último dia (ex: 84 → 91).
    // Garante o último dia como checkpoint de fechamento do ciclo, igual ao dia 21 no programa inicial.
    if (!dias.includes(totalDiasPrograma)) {
      dias.push(totalDiasPrograma)
    }
  }

  return dias.sort((a, b) => a - b)
}

/**
 * Verifica se hoje é dia de pesagem
 * @param {number} diaAtual - Dia atual do programa
 * @param {number} totalDiasPrograma - Total de dias do programa
 * @returns {boolean}
 */
export function ehDiaPesagem(diaAtual, totalDiasPrograma) {
  const diasPesagem = getDiasPesagem(totalDiasPrograma)
  return diasPesagem.includes(diaAtual)
}

/**
 * Próximo dia de pesagem
 * @param {number} diaAtual - Dia atual do programa
 * @param {number} totalDiasPrograma - Total de dias do programa
 * @returns {number | null}
 */
export function proximoDiaPesagem(diaAtual, totalDiasPrograma) {
  const diasPesagem = getDiasPesagem(totalDiasPrograma)
  const proximo = diasPesagem.find((dia) => dia > diaAtual)
  return proximo ?? null
}

/**
 * Número da semana baseado no dia
 * @param {number} diaAtual - Dia atual do programa
 * @returns {number}
 */
export function getSemanaPesagem(diaAtual) {
  return Math.ceil(diaAtual / 7)
}
