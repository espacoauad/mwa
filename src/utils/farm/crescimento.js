// Motor de crescimento da MWA FARM — funções puras, sem UI, sem banco.
// Tudo é derivado de diaAtual (já existe no AppContext); nada aqui persiste
// estado próprio.

import { PILARES } from '../../data/farm/pilares.js'
import { DECORACOES } from '../../data/farm/decoracoes.js'

const INTERVALO_LIBERACAO_DIAS = 4

function indiceDoPilar(pilarId) {
  return PILARES.findIndex((p) => p.id === pilarId)
}

// Ponto único de default: diaAtual ausente/indefinido assume o dia 1. Cada
// primitiva usa isso internamente para nunca quebrar, mesmo se chamada fora
// de resumoFazenda.
function diaSeguro(diaAtual) {
  return diaAtual ?? 1
}

// Segue o mesmo padrão de diaLiberacaoJogo em src/utils/jogosLiberacao.js:
// id desconhecido cai no dia 1 em vez de quebrar.
export function diaLiberacaoPilar(pilarId) {
  const indice = indiceDoPilar(pilarId)
  return indice === -1 ? 1 : 1 + indice * INTERVALO_LIBERACAO_DIAS
}

export function pilarLiberado(pilarId, diaAtual) {
  return diaSeguro(diaAtual) >= diaLiberacaoPilar(pilarId)
}

const DIAS_POR_ESTAGIO = 20
const ESTAGIO_MAXIMO = 3 // 0=semente, 1=broto, 2=floração, 3=plena

export function estagioDoPilar(pilarId, diaAtual) {
  const dia = diaSeguro(diaAtual)
  const diaLiberacao = diaLiberacaoPilar(pilarId)
  if (dia < diaLiberacao) return -1
  return Math.min(ESTAGIO_MAXIMO, Math.floor((dia - diaLiberacao) / DIAS_POR_ESTAGIO))
}

export function decoracoesLiberadas(diaAtual) {
  const dia = diaSeguro(diaAtual)
  return DECORACOES.filter((d) => dia >= d.dia)
}

// Único ponto de entrada que a tela (MwaFarm.jsx) precisa chamar.
// diaAtual ausente/indefinido assume o dia 1, para nunca quebrar a tela.
export function resumoFazenda(diaAtual) {
  return {
    pilares: PILARES.map((pilar) => ({
      ...pilar,
      liberado: pilarLiberado(pilar.id, diaAtual),
      estagio: estagioDoPilar(pilar.id, diaAtual),
      diaLiberacao: diaLiberacaoPilar(pilar.id),
    })),
    decoracoes: decoracoesLiberadas(diaAtual),
  }
}
