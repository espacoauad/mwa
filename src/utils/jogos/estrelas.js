// Estrelas do Dia — a regra que traz a pessoa de volta ao app todos os dias.
// Uma estrela por dia, conquistada ao cumprir 2 das 3 micro-metas.
// Sete estrelas na semana formam uma constelação.
// Nada é punitivo: perder um dia só recomeça a constelação, não apaga o histórico.

export const META_MINIMA = 2

export const METAS_ESTRELA = [
  { id: 'registro', pt: 'Registrar uma refeição ou a água', en: 'Log a meal or your water' },
  { id: 'conteudo', pt: 'Ler o conteúdo do dia', en: "Read today's content" },
  { id: 'desafio', pt: 'Jogar um desafio', en: 'Play a challenge' },
]

// Traduz as tarefas já rastreadas pelo app nas 3 micro-metas da estrela
export function metasCumpridas(tarefasHoje = {}, { jogouHoje = false } = {}) {
  return {
    registro: Boolean(tarefasHoje.refeicao || tarefasHoje.agua),
    conteudo: Boolean(tarefasHoje.dica),
    desafio: Boolean(jogouHoje),
  }
}

export function quantasMetas(metas) {
  return METAS_ESTRELA.filter((m) => metas[m.id]).length
}

export function ganhouEstrelaHoje(metas) {
  return quantasMetas(metas) >= META_MINIMA
}

function paraData(iso) {
  return new Date(`${iso}T00:00:00`)
}

function paraISO(data) {
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`
}

// Semana de segunda a domingo (padrão brasileiro de "semana do programa")
export function diasDaSemana(hojeISO) {
  const hoje = paraData(hojeISO)
  const diaSemana = (hoje.getDay() + 6) % 7 // 0 = segunda
  const segunda = new Date(hoje)
  segunda.setDate(hoje.getDate() - diaSemana)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(segunda)
    d.setDate(segunda.getDate() + i)
    return paraISO(d)
  })
}

// eventos: linhas de mwa_game_eventos com tipo 'estrela_dia' (ref = data ISO)
export function estrelasDaSemana(hojeISO, eventos = []) {
  const acesas = new Set((eventos ?? []).map((e) => e.ref))
  return diasDaSemana(hojeISO).map((data) => ({
    data,
    acesa: acesas.has(data),
    hoje: data === hojeISO,
    futuro: data > hojeISO,
  }))
}

export function constelacaoCompleta(semana) {
  return semana.every((d) => d.acesa)
}

// Mensagens curtas e acolhedoras — usadas no card da Hoje e na notificação
export function mensagemLembrete(metas, constelacaoFechada = false) {
  if (constelacaoFechada) {
    return {
      pt: 'Constelação completa! Sete dias seguidos de cuidado com você.',
      en: 'Constellation complete! Seven days in a row caring for yourself.',
    }
  }
  if (ganhouEstrelaHoje(metas)) {
    return {
      pt: 'Estrela de hoje acesa. Você conquistou mais um dia. ⭐',
      en: "Today's star is lit. One more day earned. ⭐",
    }
  }
  const faltam = META_MINIMA - quantasMetas(metas)
  if (faltam === 1) {
    return {
      pt: 'Falta só uma tarefinha para acender a estrela de hoje.',
      en: 'Just one small task left to light up today’s star.',
    }
  }
  return {
    pt: 'Sua estrela de hoje ainda está apagada — duas tarefinhas e ela é sua.',
    en: 'Today’s star is still dim — two small tasks and it’s yours.',
  }
}
