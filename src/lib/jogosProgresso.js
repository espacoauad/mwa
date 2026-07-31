import { supabase } from './supabase.js'
import { mesclarProgresso } from '../utils/jogos/progresso.js'

// Progresso por jogo/missão (tabela mwa_jogos_progresso).
// Falhas de rede não podem travar o jogo: em caso de erro, devolvemos o que dá
// para seguir jogando e a partida continua valendo na sessão.

export async function carregarProgressoJogo(userId, jogoId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('mwa_jogos_progresso')
    .select('jogo_id, missao_id, nivel, melhor_pontuacao, estrelas, partidas')
    .eq('user_id', userId)
    .eq('jogo_id', jogoId)
  if (error) return []
  return data ?? []
}

// Salva o resultado de uma partida preservando o recorde anterior.
// Retorna o progresso já mesclado (ou null se não deu para salvar).
export async function salvarResultadoJogo(userId, jogoId, missaoId, resultado, anterior) {
  if (!userId) return null
  const mesclado = mesclarProgresso(anterior, resultado)
  const { error } = await supabase.from('mwa_jogos_progresso').upsert(
    {
      user_id: userId,
      jogo_id: jogoId,
      missao_id: missaoId ?? '',
      nivel: resultado.nivel ?? 1,
      ...mesclado,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: 'user_id,jogo_id,missao_id' },
  )
  if (error) return null
  return mesclado
}
