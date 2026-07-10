// Hall da Fama: 1 estrela por checkpoint (semana 1 = dia 7, semana 2 = dia 14, semana 3 = dia 21)
// quando há resultado positivo — perda de peso OU perda de alguma medida — em relação ao checkpoint anterior.
const CAMPOS_MEDIDA = ['cintura', 'quadril', 'peito']

export function calcularEstrelas(usuario, pesagens) {
  const porSemana = Object.fromEntries(pesagens.map((p) => [p.semana, p]))
  let pesoAnterior = usuario.peso
  let medidasAnteriores = usuario.medidas ?? {}
  const checkpoints = []

  for (const semana of [1, 2, 3]) {
    const p = porSemana[semana]
    if (!p) {
      checkpoints.push({ semana, dia: semana * 7, feita: false, estrela: false })
      continue
    }
    const perdeuPeso = p.peso < pesoAnterior
    const perdeuMedida = CAMPOS_MEDIDA.some(
      (c) => p.medidas?.[c] != null && medidasAnteriores?.[c] != null && p.medidas[c] < medidasAnteriores[c],
    )
    checkpoints.push({
      semana,
      dia: semana * 7,
      feita: true,
      estrela: perdeuPeso || perdeuMedida,
      perdeuPeso,
      perdeuMedida,
      deltaPeso: Math.round((p.peso - pesoAnterior) * 10) / 10,
    })
    pesoAnterior = p.peso
    medidasAnteriores = { ...medidasAnteriores, ...Object.fromEntries(CAMPOS_MEDIDA.filter((c) => p.medidas?.[c] != null).map((c) => [c, p.medidas[c]])) }
  }

  return checkpoints
}
