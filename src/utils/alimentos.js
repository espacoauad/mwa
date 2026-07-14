export function normalizarTexto(valor = '') {
  return String(valor).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

export function termosDoAlimento(alimento) {
  return normalizarTexto([alimento.nome, alimento.categoria, alimento.marca, alimento.sabor, ...(alimento.aliases ?? [])].filter(Boolean).join(' '))
}

export function pontuarAlimento(alimento, consulta) {
  const q = normalizarTexto(consulta)
  if (!q) return 0
  const nome = normalizarTexto(alimento.nome)
  const aliases = (alimento.aliases ?? []).map(normalizarTexto)
  const termos = termosDoAlimento(alimento)
  if (nome === q || aliases.includes(q)) return 100
  if (nome.startsWith(q) || aliases.some((a) => a.startsWith(q))) return 80
  if (nome.includes(q) || aliases.some((a) => a.includes(q))) return 60
  const palavras = q.split(' ').filter(Boolean)
  return palavras.every((p) => termos.includes(p)) ? 40 + palavras.length : 0
}

export function buscarAlimentos(alimentos, consulta, limite = 60) {
  const q = normalizarTexto(consulta)
  if (!q) return alimentos.slice(0, limite)
  return alimentos.map((alimento, indice) => ({ alimento, indice, pontos: pontuarAlimento(alimento, q) }))
    .filter((item) => item.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos || a.indice - b.indice)
    .slice(0, limite).map((item) => item.alimento)
}

export function medidaPorId(alimento, medidaId) {
  return (alimento.medidas ?? []).find((m) => m.id === medidaId)
}

export function quantidadeNaBase(alimento, quantidade, medidaId = alimento.unidadeBase ?? 'g') {
  const numero = Number(quantidade)
  if (!Number.isFinite(numero) || numero < 0) return 0
  const medida = medidaPorId(alimento, medidaId)
  return medida ? numero * medida.base : numero
}

export function formatarMedida(medida, quantidade) {
  if (!medida) return ''
  return Number(quantidade) === 1 ? medida.nome : (medida.plural ?? medida.nome)
}
