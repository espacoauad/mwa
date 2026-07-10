import { supabase } from './supabase.js'

export async function processarCompraHotmart(evento) {
  try {
    const { buyer, buyer_email, product_id, status, price } = evento

    if (status !== 'aprovado' && status !== 'completed') {
      console.log('Pagamento não aprovado:', status)
      return { sucesso: false, motivo: 'pagamento_nao_aprovado' }
    }

    // Gerar cupom único baseado no buyer_id e timestamp
    const cupom = `MWA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase()

    // Registrar cupom no banco
    const { data, error } = await supabase
      .from('mwa_cupons')
      .insert({
        codigo: cupom,
        ativo: true,
        usado: false,
        origem: 'hotmart',
        detalhes: {
          buyer,
          buyer_email,
          product_id,
          price,
          hotmart_webhook_date: new Date().toISOString(),
        },
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar cupom:', error)
      return { sucesso: false, motivo: 'erro_cupom', detalhes: error.message }
    }

    // Enviar email pro cliente com o cupom
    await enviarEmailCupom(buyer_email, cupom, buyer)

    // Registrar pagamento
    await supabase.from('mwa_pagamentos').insert({
      user_email: buyer_email,
      valor: price,
      status: 'aprovado',
      programa_tipo: '21d',
      metodo: 'hotmart',
      criado_em: new Date().toISOString(),
      detalhes: {
        cupom,
        buyer,
        product_id,
      },
    })

    return { sucesso: true, cupom }
  } catch (err) {
    console.error('Erro ao processar webhook:', err)
    return { sucesso: false, motivo: 'erro_sistema', detalhes: err.message }
  }
}

async function enviarEmailCupom(email, cupom, nome) {
  try {
    // Aqui você usaria um serviço de email (SendGrid, Resend, etc)
    // Por enquanto, vou usar a função de email do Supabase (se houver)
    // Ou você pode configurar um serviço externo

    console.log(`Email enviado para ${email}:`)
    console.log(`Cupom: ${cupom}`)
    console.log(`Resgate em: https://metodomwa.com.br/resgate?cupom=${cupom}`)

    // Se tiver edge function de email:
    // await supabase.functions.invoke('enviar-email-cupom', {
    //   body: { email, cupom, nome }
    // })
  } catch (err) {
    console.error('Erro ao enviar email:', err)
  }
}
