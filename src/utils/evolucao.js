import { getDiasPesagem } from './pesagensReminder.js'

// Ordena as pesagens por data crescente sem alterar o array original.
export function pesagensOrdenadas(pesagens) {
  return [...(pesagens ?? [])].sort((a, b) => new Date(a.data) - new Date(b.data))
}

// Associa cada pesagem (em ordem cronológica) ao marco de dia correspondente
// (15/30/45/60/75/90, conforme o total de dias do programa da pessoa). Se
// houver mais pesagens do que marcos disponíveis, as excedentes recebem um
// rótulo genérico em vez de estourar o array de marcos.
export function pesagensComRotulo(pesagens, totalDias) {
  const marcos = getDiasPesagem(totalDias)
  return pesagensOrdenadas(pesagens).map((pesagem, indice) => ({
    pesagem,
    rotulo: indice < marcos.length ? `Dia ${marcos[indice]}` : `Pesagem ${indice + 1}`,
  }))
}

// Razão cintura/quadril arredondada, ou null se alguma medida estiver ausente.
export function proporcaoCinturaQuadril(medidas) {
  const cintura = medidas?.cintura
  const quadril = medidas?.quadril
  if (!cintura || !quadril) return null
  return Math.round((cintura / quadril) * 100) / 100
}

// Estágio de postura (0-3) proporcional à posição no histórico — usado pelo
// avatar-manequim para uma progressão visual sutil de postura/energia.
export function estagioPostura(indice, total) {
  if (total <= 1) return 3
  const proporcao = indice / (total - 1)
  return Math.min(3, Math.round(proporcao * 3))
}

// Cores de "conquista" por marco atingido — cicla pelas cores de marca já
// existentes no app (sem inventar cores novas).
export const CORES_CONQUISTA = ['sage', 'ouro', 'verde']

export function corConquista(indice) {
  return CORES_CONQUISTA[indice % CORES_CONQUISTA.length]
}

// Converte uma lista de valores (com possíveis gaps nulos) em coordenadas SVG
// {x, y} dentro de uma área útil de largura x altura, com preenchimento nas
// bordas. Valores null viram gaps (null), não zero.
export function pontosGrafico(valores, largura, altura, preenchimento) {
  const validos = valores.filter((v) => v != null)
  if (validos.length === 0) return valores.map(() => null)

  const minimo = Math.min(...validos)
  const maximo = Math.max(...validos)
  const amplitude = maximo - minimo || 1

  const areaLargura = largura - preenchimento * 2
  const areaAltura = altura - preenchimento * 2

  return valores.map((valor, indice) => {
    if (valor == null) return null
    const x = preenchimento + (valores.length === 1 ? 0 : (indice / (valores.length - 1)) * areaLargura)
    const y = preenchimento + areaAltura - ((valor - minimo) / amplitude) * areaAltura
    return { x, y }
  })
}
