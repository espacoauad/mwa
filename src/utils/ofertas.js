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
  programa: { nome: 'MWA | Jornada de 90 Dias', preco: 197 },
  renovacao: {
    nome: 'MWA | Novo Ciclo de 90 Dias',
    preco: 127,
  },
  sessao: { nome: 'Sessão Estratégica MWA', preco: 297 },
}

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function linkWhatsApp(mensagem) {
  return `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(mensagem)}`
}

export function linkCompraRenovacao() {
  return linkWhatsApp(
    `Olá! Completei o MWA | Jornada de 90 Dias e quero iniciar um novo ciclo por ${formatarPreco(PRODUTOS.renovacao.preco)}!`,
  )
}

export function linkSessao(dia) {
  return linkWhatsApp(
    `Olá! Sou aluna do MWA | Jornada de 90 Dias (Dia ${dia}) e quero agendar minha Sessão Estratégica MWA (${formatarPreco(PRODUTOS.sessao.preco)}).`,
  )
}
