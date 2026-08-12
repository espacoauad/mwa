// Motor de crescimento da MWA FARM — funções puras, sem UI, sem banco.
// O crescimento de cada canteiro depende de quantas vezes a pessoa cuidou
// dele (contagens), não do dia do programa. A leitura/persistência dessas
// contagens é responsabilidade de quem chama (MwaFarm.jsx), do mesmo jeito
// que MwaFarm.jsx já lê/persiste o registro de cuidados do dia.

import { PILARES } from '../../data/farm/pilares.js'
import { DECORACOES } from '../../data/farm/decoracoes.js'

const CUIDADOS_POR_ESTAGIO = 10
const ESTAGIO_MAXIMO = 3 // 0=semente, 1=broto, 2=floração, 3=plena

export function estagioDoPilar(pilarId, contagens) {
  const contagem = contagens?.[pilarId] ?? 0
  return Math.min(ESTAGIO_MAXIMO, Math.floor(contagem / CUIDADOS_POR_ESTAGIO))
}

function diaSeguro(diaAtual) {
  return diaAtual ?? 1
}

export function decoracoesLiberadas(diaAtual) {
  const dia = diaSeguro(diaAtual)
  return DECORACOES.filter((d) => dia >= d.dia)
}

// Único ponto de entrada que a tela (MwaFarm.jsx) precisa chamar.
export function resumoFazenda(contagens, diaAtual) {
  return {
    pilares: PILARES.map((pilar) => ({
      ...pilar,
      estagio: estagioDoPilar(pilar.id, contagens),
    })),
    decoracoes: decoracoesLiberadas(diaAtual),
  }
}
