/**
 * Calcula os dias de pesagem do programa MWA.
 * Cadência fixa a cada 15 dias, em todo o ciclo de 90 dias: meio e fim de
 * cada bloco de 30 — dias 15 e 30 (Jornada de 30 Dias), 45 e 60 (Programa de
 * 90 Dias, bloco 1), 75 e 90 (Programa de 90 Dias, bloco 2).
 */

const DIAS_PESAGEM_CICLO = [15, 30, 45, 60, 75, 90]

export function getDiasPesagem(totalDiasPrograma) {
  return DIAS_PESAGEM_CICLO.filter((dia) => dia <= totalDiasPrograma)
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
