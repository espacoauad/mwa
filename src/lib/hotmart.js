// ============================================================================
// Configuração da Hotmart no front-end (MWA)
// ----------------------------------------------------------------------------
// Preencha os links de checkout de cada produto e os contatos de suporte.
// Os IDENTIFICADORES oficiais (product.id) NÃO ficam aqui — ficam nos Secrets
// da Edge Function hotmart-webhook, no servidor.
//
// Regra de ouro: estes botões só ABREM o checkout. Quem libera o acesso é
// sempre o webhook no servidor — nunca o retorno do navegador.
// ============================================================================

export const HOTMART = {
  // Cole aqui os links de checkout de cada produto (Hotmart → produto → oferta):
  checkout: {
    // Oferta principal: primeiro ciclo de 90 dias por R$ 197
    programa90d: 'https://pay.hotmart.com/SEU-CHECKOUT-90D',
    // Oferta exclusiva: novo ciclo de 90 dias por R$ 127
    renovacao90d: 'https://pay.hotmart.com/SEU-CHECKOUT-RENOVACAO-90D',
    sessao: 'https://pay.hotmart.com/SEU-CHECKOUT-SESSAO',
  },

  // Contatos de suporte mostrados na tela "Sessão adquirida":
  suporte: {
    whatsapp: '55SEUNUMERO',            // só dígitos, com DDI+DDD, ex.: 5531999999999
    whatsappMsg: 'Olá! Comprei uma sessão individual no MWA e quero agendar.',
    email: 'suporte@metodomwa.com.br',
  },
}

// Link pronto do WhatsApp de suporte
export function linkWhatsappSuporte() {
  const { whatsapp, whatsappMsg } = HOTMART.suporte
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`
}

// Abre o checkout do produto informado ('programa90d' | 'renovacao90d' | 'sessao')
export function abrirCheckout(produto) {
  const url = HOTMART.checkout[produto]
  if (!url) return
  window.open(url, '_blank', 'noopener')
}
