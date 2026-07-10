import { supabase } from './supabase.js'

export async function registrarSessao(userId, tipo, detalhes = {}) {
  try {
    await supabase.from('mwa_sessoes').insert({
      user_id: userId,
      tipo,
      detalhes,
    })
  } catch (err) {
    console.error('Erro ao registrar sessão:', err)
  }
}
