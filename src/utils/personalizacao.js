// Opcoes e logica pura de personalizacao do onboarding (perguntas de
// motivacao e habitos). Nenhuma chamada externa/IA — a frase de recepcao e
// montada por lookup de fragmento, mesmo padrao usado para "objetivo" em
// calculos.js/TelaMetas.jsx.

export const OPCOES_FOCO = [
  { id: 'alimentacao', label: 'Sua relação com a alimentação', fragmento: 'sua relação com a alimentação', fragmentoEn: 'your relationship with food' },
  { id: 'corpo', label: 'Seu corpo e disposição', fragmento: 'seu corpo e disposição', fragmentoEn: 'your body and energy' },
  { id: 'rotina', label: 'Sua rotina e constância', fragmento: 'sua rotina e constância', fragmentoEn: 'your routine and consistency' },
  { id: 'emocional', label: 'Sua relação emocional com a comida', fragmento: 'sua relação emocional com a comida', fragmentoEn: 'your emotional relationship with food' },
]

export const OPCOES_OBSTACULO = [
  { id: 'falta_tempo', label: 'Quando a rotina fica corrida' },
  { id: 'perde_motivacao', label: 'Depois que a motivação inicial passa' },
  { id: 'cobranca', label: 'Quando me cobro demais e desanimo' },
  { id: 'fora_da_dieta', label: 'Depois de escapar da dieta uma vez' },
]

export const OPCOES_ROTINA = [
  { id: 'corrida', label: 'Corrida, sem tempo pra mim' },
  { id: 'organizada_sem_foco', label: 'Organizada, mas sem espaço pra me cuidar' },
  { id: 'tranquila_sem_constancia', label: 'Tranquila, mas sem constância' },
  { id: 'baguncada', label: 'Bagunçada, quero recomeçar' },
]

export const OPCOES_SENTIMENTO_ESPERADO = [
  { id: 'leve', label: 'Mais leve e disposta', fragmento: 'mais leve e disposta', fragmentoEn: 'lighter and more energetic' },
  { id: 'orgulhosa', label: 'Orgulhosa de ter sido constante', fragmento: 'orgulhosa de ter sido constante', fragmentoEn: 'proud of staying consistent' },
  { id: 'tranquila', label: 'Com uma relação mais tranquila com a comida', fragmento: 'com uma relação mais tranquila com a comida', fragmentoEn: 'a calmer relationship with food' },
  { id: 'confiante', label: 'Mais confiante com meu corpo', fragmento: 'mais confiante com seu corpo', fragmentoEn: 'more confident in your body' },
]

export const OPCOES_SONO = [
  { id: 'bem_disposta', label: 'Durmo bem e acordo disposta' },
  { id: 'cansada', label: 'Durmo, mas acordo cansada' },
  { id: 'pouco', label: 'Durmo pouco (menos de 6h)' },
  { id: 'irregular', label: 'Sono irregular, varia muito' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_HIDRATACAO = [
  { id: 'bastante', label: 'Bebo bastante água todo dia' },
  { id: 'pouca', label: 'Bebo pouca água, esqueço' },
  { id: 'so_com_sede', label: 'Só bebo quando sinto muita sede' },
  { id: 'troca_por_outras', label: 'Troco água por outras bebidas (café, suco, refrigerante)' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_HABITOS_ALIMENTARES = [
  { id: 'equilibrados', label: 'Equilibrados, mas quero evoluir' },
  { id: 'desorganizados', label: 'Desorganizados, como o que der' },
  { id: 'restritivos', label: 'Muito restritivos, vivo de dieta em dieta' },
  { id: 'exagero_fds', label: 'Bons, mas com exageros no fim de semana' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_INTESTINO = [
  { id: 'regular', label: 'Funciona bem, regular' },
  { id: 'preso', label: 'Preso, com frequência' },
  { id: 'irregular', label: 'Muito irregular, varia bastante' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

export const OPCOES_DISPOSICAO = [
  { id: 'alta', label: 'Alta, me sinto com energia' },
  { id: 'cansaco_maior_parte', label: 'Cansaço na maior parte do tempo' },
  { id: 'so_manha', label: 'Só de manhã, canso ao longo do dia' },
  { id: 'vai_e_volta', label: 'Vai e volta, depende do dia' },
  { id: 'prefiro_nao_responder', label: 'Prefiro não responder' },
]

// Monta os dois fragmentos usados na frase de recepção da tela final do
// onboarding (TelaMetas.jsx). Retorna null para um fragmento se a
// resposta correspondente ainda não foi preenchida. Quando `ingles` é
// true, usa o fragmento em inglês (fragmentoEn) em vez do português —
// o texto livre de "outro" não é traduzido, pois é escrito pela usuária.
export function montarFraseRecepcao(dados, ingles = false) {
  const campoFragmento = ingles ? 'fragmentoEn' : 'fragmento'
  const foco = dados.foco === 'outro'
    ? (dados.focoOutro || null)
    : (OPCOES_FOCO.find((o) => o.id === dados.foco)?.[campoFragmento] ?? null)
  const sentimento = dados.sentimentoEsperado === 'outro'
    ? (dados.sentimentoEsperadoOutro || null)
    : (OPCOES_SENTIMENTO_ESPERADO.find((o) => o.id === dados.sentimentoEsperado)?.[campoFragmento] ?? null)
  return { foco, sentimento }
}

// "Prefiro não responder" e "nunca respondeu" devem ser indistinguíveis no
// banco — ambos viram null.
function normalizarHabito(valor) {
  if (!valor || valor === 'prefiro_nao_responder') return null
  return valor
}

// Monta o objeto exato a ser salvo em mwa_perfis.personalizacao a partir
// do estado bruto do formulário de onboarding.
export function montarPersonalizacaoParaSalvar(dados) {
  return {
    foco: dados.foco || null,
    focoOutro: dados.foco === 'outro' ? (dados.focoOutro || null) : null,
    obstaculo: normalizarHabito(dados.obstaculo),
    obstaculoOutro: dados.obstaculo === 'outro' ? (dados.obstaculoOutro || null) : null,
    rotina: normalizarHabito(dados.rotina),
    rotinaOutro: dados.rotina === 'outro' ? (dados.rotinaOutro || null) : null,
    sentimentoEsperado: dados.sentimentoEsperado || null,
    sentimentoEsperadoOutro: dados.sentimentoEsperado === 'outro' ? (dados.sentimentoEsperadoOutro || null) : null,
    sono: normalizarHabito(dados.sono),
    hidratacao: normalizarHabito(dados.hidratacao),
    habitosAlimentares: normalizarHabito(dados.habitosAlimentares),
    intestino: normalizarHabito(dados.intestino),
    disposicao: normalizarHabito(dados.disposicao),
  }
}
