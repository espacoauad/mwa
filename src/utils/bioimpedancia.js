// Constantes de métricas
export const BIOIMPEDANCIA_METRICAS = [
  {
    key: 'imc',
    label: 'IMC',
    unidade: '',
    minVal: 10,
    maxVal: 60,
    dica: 'Índice de Massa Corporal medido pelo equipamento',
    melhorEhMenor: true,
  },
  {
    key: 'percentualGordura',
    label: '% Gordura Corporal',
    unidade: '%',
    minVal: 0,
    maxVal: 100,
    dica: 'Percentual de gordura no corpo',
    melhorEhMenor: true,
  },
  {
    key: 'percentualMusculo',
    label: '% Músculo',
    unidade: '%',
    minVal: 0,
    maxVal: 100,
    dica: 'Percentual de massa magra/muscular',
    melhorEhMenor: false,
  },
  {
    key: 'gorduraVisceral',
    label: 'Gordura Visceral',
    unidade: '',
    minVal: 0,
    maxVal: 200,
    dica: 'Gordura interna ao redor dos órgãos (0-200)',
    melhorEhMenor: true,
  },
  {
    key: 'idadeMetabolica',
    label: 'Idade Metabólica',
    unidade: ' anos',
    minVal: 0,
    maxVal: 150,
    dica: 'Idade biológica estimada do seu metabolismo',
    melhorEhMenor: true,
  },
  {
    key: 'toraxCm',
    label: 'Tórax',
    unidade: ' cm',
    minVal: 0,
    maxVal: 999,
    dica: 'Medida da circunferência do tórax',
    melhorEhMenor: false,
  },
  {
    key: 'circAbdominalCm',
    label: 'Circ. Abdominal',
    unidade: ' cm',
    minVal: 0,
    maxVal: 999,
    dica: 'Medida da circunferência abdominal',
    melhorEhMenor: true,
  },
]

// Mapa para acesso rápido
export const BIOIMPEDANCIA_MAP = new Map(
  BIOIMPEDANCIA_METRICAS.map((m) => [m.key, m])
)

export function validarBioimpedancia(data) {
  const erros = {}

  for (const [key, valor] of Object.entries(data || {})) {
    if (valor === null || valor === undefined) continue

    const metrica = BIOIMPEDANCIA_MAP.get(key)
    if (!metrica) continue

    const numVal = Number(valor)

    if (isNaN(numVal)) {
      erros[key] = `${metrica.label} deve ser um número`
      continue
    }

    if (numVal < metrica.minVal || numVal > metrica.maxVal) {
      erros[key] = `${metrica.label} deve estar entre ${metrica.minVal} e ${metrica.maxVal}${metrica.unidade}`
    }
  }

  return {
    valid: Object.keys(erros).length === 0,
    erros,
  }
}

export function filterBioimpedanciaData(data) {
  const filtered = {}

  for (const [key, valor] of Object.entries(data || {})) {
    if (valor !== null && valor !== undefined && valor !== '') {
      filtered[key] = Number(valor)
    }
  }

  return Object.keys(filtered).length > 0 ? filtered : null
}
