// Produtos e cronograma de ofertas do MWA — Método Wanessa Auad
// Fonte oficial: MWA-BrandBook-LandingPage-Copy.md (seções 3 e 6)

export const CONTATO = {
  whatsapp: '5562994246775',
  // TODO(placeholder): confirmar handle oficial do Instagram da marca MWA
  instagram: '@metodomwa',
  email: 'contato@metodomwa.com.br',
  site: 'metodomwa.com.br',
  slogan: 'Mais do que um método, um estilo de vida que transforma!',
  tagline: 'Transforme hábitos, conquiste resultados, mude sua vida!',
}

export const PRODUTOS = {
  programa: { nome: 'MWA | Jornada de 21 Dias', preco: 97 },
  // precoCheio: valor integral do Programa de 90 Dias — vale dos dias 8–20 e também
  // a partir do Dia 21 (preço fixo, sem desconto adicional)
  // precoOferta: valor especial de lançamento, ativo do Dia 3 ao Dia 7
  upgrade: {
    nome: 'MWA | Programa de 90 Dias',
    precoCheio: 147,
    precoOferta: 97,
  },
  sessao: { nome: 'Sessão Estratégica MWA', preco: 297 },
}

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Cronograma oficial: a oferta especial do Programa de 90 Dias abre no Dia 6,
// fica ativa por R$ 97 até o Dia 10 e então expira. A partir do Dia 11 (inclusive
// depois de concluída a Jornada de 21 Dias), a continuidade fica disponível
// pelo valor cheio fixo de R$ 147.
export function faseUpgrade(dia) {
  if (dia >= 6 && dia <= 10) {
    return { id: 'oferta', ultimoDia: dia === 10, diasRestantes: 10 - dia }
  }
  if (dia >= 21) return { id: 'final' }
  if (dia >= 11) return { id: 'normal' }
  return { id: 'nenhuma' }
}

export function linkWhatsApp(mensagem) {
  return `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function linkCompraUpgrade(dia) {
  const fase = faseUpgrade(dia)
  if (fase.id === 'oferta') {
    return linkWhatsApp(
      `Olá! Estou no Dia ${dia} do MWA | Jornada de 21 Dias e quero garantir o MWA | Programa de 90 Dias por ${formatarPreco(PRODUTOS.upgrade.precoOferta)}!`,
    )
  }
  if (fase.id === 'final') {
    return linkWhatsApp(
      `Olá! Completei o MWA | Jornada de 21 Dias e quero aprofundar meu aprendizado com o MWA | Programa de 90 Dias (${formatarPreco(PRODUTOS.upgrade.precoCheio)})!`,
    )
  }
  return linkWhatsApp(
    `Olá! Estou no Dia ${dia} do MWA | Jornada de 21 Dias e quero saber mais sobre o MWA | Programa de 90 Dias (${formatarPreco(PRODUTOS.upgrade.precoCheio)}).`,
  )
}

export function linkSessao(dia) {
  return linkWhatsApp(
    `Olá! Sou aluna do MWA | Jornada de 21 Dias (Dia ${dia}) e quero agendar minha Sessão Estratégica MWA (${formatarPreco(PRODUTOS.sessao.preco)}).`,
  )
}
