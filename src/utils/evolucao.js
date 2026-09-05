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

// Histórico das últimas 3 pesagens com o delta de peso em relação à
// pesagem imediatamente anterior (ou ao peso inicial, para a primeira
// pesagem da lista completa). Usa o índice real de cada pesagem dentro do
// array completo — não a posição dentro da janela dos últimos 3 — para que
// o cálculo funcione com qualquer quantidade de pesagens, incluindo 1 ou 2.
// Pressupõe `pesagens` em ordem cronológica crescente (garantido hoje pelo
// `.order('data')` do carregamento em AppContext.jsx) — use
// `pesagensOrdenadas` antes de chamar esta função se essa garantia não valer.
export function historicoSemanal(pesagens, pesoInicial) {
  const janela = pesagens.slice(-3)
  const inicioJanela = pesagens.length - janela.length
  return janela.map((pesagem, indice) => {
    const indiceReal = inicioJanela + indice
    const pesagemAnterior = indiceReal > 0 ? pesagens[indiceReal - 1] : { peso: pesoInicial }
    const delta = Math.round((pesagem.peso - pesagemAnterior.peso) * 10) / 10
    return {
      semana: pesagem.semana,
      peso: pesagem.peso,
      delta,
      medidas: pesagem.medidas?.cintura ? `${pesagem.medidas.cintura} cm` : '—',
    }
  })
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
