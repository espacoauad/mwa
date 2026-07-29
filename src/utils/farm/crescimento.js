// Motor de crescimento da MWA FARM — funções puras, sem UI, sem banco.
// Tudo é derivado de diaAtual (já existe no AppContext); nada aqui persiste
// estado próprio.

import { PILARES } from '../../data/farm/pilares.js'

const INTERVALO_LIBERACAO_DIAS = 4

function indiceDoPilar(pilarId) {
  return PILARES.findIndex((p) => p.id === pilarId)
}

// Segue o mesmo padrão de diaLiberacaoJogo em src/utils/jogosLiberacao.js:
// id desconhecido cai no dia 1 em vez de quebrar.
export function diaLiberacaoPilar(pilarId) {
  const indice = indiceDoPilar(pilarId)
  return indice === -1 ? 1 : 1 + indice * INTERVALO_LIBERACAO_DIAS
}

export function pilarLiberado(pilarId, diaAtual) {
  return diaAtual >= diaLiberacaoPilar(pilarId)
}
