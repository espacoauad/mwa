// src/lib/storage.js
import { supabase } from './supabase.js'

export async function uploadFotoRefeicao(userId, refeicaoId, arquivo) {
  const caminho = `${userId}/${refeicaoId}.jpg`
  const { error } = await supabase.storage
    .from('fotos-refeicoes')
    .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type || 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from('fotos-refeicoes').getPublicUrl(caminho)
  return `${data.publicUrl}?v=${Date.now()}`
}

export async function removerFotoRefeicao(userId, refeicaoId) {
  await supabase.storage.from('fotos-refeicoes').remove([`${userId}/${refeicaoId}.jpg`])
}

// LGPD: direito de exclusão — apaga todas as fotos de refeição da pessoa no Storage.
export async function limparFotosRefeicoesDoUsuario(userId) {
  const { data: arquivos, error } = await supabase.storage.from('fotos-refeicoes').list(userId)
  if (error || !arquivos?.length) return
  const caminhos = arquivos.map((arquivo) => `${userId}/${arquivo.name}`)
  await supabase.storage.from('fotos-refeicoes').remove(caminhos)
}
