// Hall da Fama: 1 estrela por pesagem registrada, quando há resultado positivo — perda de
// peso OU perda de alguma medida — em relação à pesagem anterior (ou ao perfil, na primeira).
//
// Cronológico, não por "número de semana": isso importa porque uma pessoa pode comprar o
// Programa de 90 Dias mais de uma vez (novo ciclo após o dia 90). As pesagens de ciclos
// diferentes nunca são apagadas, e o número da semana se repete entre ciclos (ex.: semana 4
// do 1º ciclo e semana 4 do 2º ciclo). Calcular por ordem cronológica das pesagens reais —
// em vez de por um número de semana fixo — evita que um ciclo novo sobrescreva ou colida
// com o histórico de estrelas do ciclo anterior.
const CAMPOS_MEDIDA = ['cintura', 'quadril', 'peito']

export function calcularEstrelas(usuario, pesagens) {
  const ordenadas = [...pesagens].sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0))
  let pesoAnterior = usuario.peso
  let medidasAnteriores = usuario.medidas ?? {}
  const resultados = []

  for (const p of ordenadas) {
    const perdeuPeso = p.peso < pesoAnterior
    const perdeuMedida = CAMPOS_MEDIDA.some(
      (c) => p.medidas?.[c] != null && medidasAnteriores?.[c] != null && p.medidas[c] < medidasAnteriores[c],
    )
    resultados.push({
      id: p.id,
      data: p.data,
      semana: p.semana,
      dia: p.semana ? p.semana * 7 : null,
      estrela: perdeuPeso || perdeuMedida,
      perdeuPeso,
      perdeuMedida,
      deltaPeso: Math.round((p.peso - pesoAnterior) * 10) / 10,
    })
    pesoAnterior = p.peso
    medidasAnteriores = {
      ...medidasAnteriores,
      ...Object.fromEntries(CAMPOS_MEDIDA.filter((c) => p.medidas?.[c] != null).map((c) => [c, p.medidas[c]])),
    }
  }

  return resultados
}

export function totalEstrelas(usuario, pesagens) {
  return calcularEstrelas(usuario, pesagens).filter((r) => r.estrela).length
}
