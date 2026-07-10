import { supabase } from '../lib/supabase.js'

// Cria o checkout no servidor (preço calculado lá) e retorna o link do Mercado Pago
export async function iniciarPagamento(tipo) {
  const { data, error } = await supabase.functions.invoke('mwa-mp-preferencia', {
    body: { tipo, origem: window.location.origin },
  })
  if (error) throw new Error('Não foi possível abrir o pagamento. Tente novamente.')
  if (data?.error) throw new Error(data.error)
  return data // { pagamento_id, preference_id, init_point, valor, titulo }
}

// Situação dos meus pagamentos (para exibir status no app)
export async function meusPagamentos() {
  const { data } = await supabase
    .from('mwa_pagamentos')
    .select('*')
    .order('criado_em', { ascending: false })
  return data ?? []
}
