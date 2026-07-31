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
  programa: { nome: 'MWA | Jornada de 30 Dias', preco: 97 },
  // Não existe um produto "90 dias" à parte — é um upgrade/upsell que libera os
  // dias 31–90 do mesmo programa. Preço único de R$ 97, sempre, em qualquer tela
  // (checkout da landing page ou upgrade dentro do app).
  upgrade: {
    nome: 'MWA | Upgrade para 90 Dias',
    preco: 97,
  },
  sessao: { nome: 'Sessão Estratégica MWA', preco: 297 },
}

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Cronograma oficial: o upgrade para 90 dias pode ser oferecido em qualquer momento
// entre o Dia 6 e o Dia 30 (mesmo preço de R$ 97 em toda a janela), e volta a ser
// oferecido como "nova oportunidade" a partir do Dia 30 (fim do ciclo de 30 dias).
export function faseUpgrade(dia) {
  if (dia >= 6 && dia <= 10) {
    return { id: 'oferta', ultimoDia: dia === 10, diasRestantes: 10 - dia }
  }
  if (dia >= 30) return { id: 'final' }
  if (dia >= 11) return { id: 'normal' }
  return { id: 'nenhuma' }
}

export function linkWhatsApp(mensagem) {
  return `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function linkCompraUpgrade(dia) {
  const fase = faseUpgrade(dia)
  if (fase.id === 'final') {
    return linkWhatsApp(
      `Olá! Completei o MWA | Jornada de 30 Dias e quero o upgrade para 90 dias (${formatarPreco(PRODUTOS.upgrade.preco)})!`,
    )
  }
  return linkWhatsApp(
    `Olá! Estou no Dia ${dia} do MWA | Jornada de 30 Dias e quero garantir o upgrade para 90 dias por ${formatarPreco(PRODUTOS.upgrade.preco)}!`,
  )
}

export function linkSessao(dia) {
  return linkWhatsApp(
    `Olá! Sou aluna do MWA | Jornada de 30 Dias (Dia ${dia}) e quero agendar minha Sessão Estratégica MWA (${formatarPreco(PRODUTOS.sessao.preco)}).`,
  )
}
