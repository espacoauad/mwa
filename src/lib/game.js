import { supabase } from './supabase.js'
import { RECOMPENSAS } from '../data/skins.js'

// Busca (ou cria) o estado de jogo do usuário
export async function carregarGame(userId) {
  const { data } = await supabase.from('mwa_game').select('*').eq('user_id', userId).maybeSingle()
  if (data) return data
  const { data: novo } = await supabase
    .from('mwa_game')
    .insert({ user_id: userId })
    .select()
    .single()
  return novo
}

// Concede sementes por uma tarefa. A ref torna a recompensa única
// (ex.: 'agua' + '2026-07-09' = só ganha 1x por dia).
// Retorna a quantidade concedida (0 se já tinha ganhado).
export async function concederSementes(userId, tipo, ref) {
  const recompensa = RECOMPENSAS[tipo]
  if (!recompensa) return 0

  const { error } = await supabase
    .from('mwa_game_eventos')
    .insert({ user_id: userId, tipo, ref: String(ref), sementes: recompensa.sementes })

  // 23505 = já existe (tarefa já recompensada) — não é erro de verdade
  if (error) return 0

  const { data: game } = await supabase.from('mwa_game').select('sementes').eq('user_id', userId).single()
  const novoTotal = (game?.sementes ?? 0) + recompensa.sementes
  await supabase.from('mwa_game').update({ sementes: novoTotal, atualizado_em: new Date().toISOString() }).eq('user_id', userId)
  return recompensa.sementes
}

// Compra uma skin: debita as sementes, adiciona à coleção e já equipa
export async function comprarSkinDb(userId, game, categoria, skinId, preco) {
  const novoTotal = game.sementes - preco
  if (novoTotal < 0) return null
  const novasSkins = [...game.skins, skinId]
  const novoAvatar = { ...game.avatar, [categoria]: skinId }
  const { data } = await supabase
    .from('mwa_game')
    .update({ sementes: novoTotal, skins: novasSkins, avatar: novoAvatar, atualizado_em: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()
  return data
}

// Equipa uma skin já comprada
export async function equiparSkinDb(userId, game, categoria, skinId) {
  const novoAvatar = { ...game.avatar, [categoria]: skinId }
  const { data } = await supabase
    .from('mwa_game')
    .update({ avatar: novoAvatar, atualizado_em: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()
  return data
}

// ── Acelerador de sementes: bônus por acessar o app em dias seguidos ──
// Cresce a cada dia de sequência (até um teto) e reinicia se a pessoa falha um dia.
function bonusPorSequencia(sequencia) {
  return Math.min(5 + (sequencia - 1) * 3, 50)
}

function ontemISO(hojeISO) {
  const d = new Date(`${hojeISO}T00:00:00`)
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Chamado uma vez por sessão (quando o app carrega, já com o usuário logado).
// Atualiza a sequência de dias e credita o bônus do dia, sem duplicar.
export async function registrarAcessoDiario(userId, game, hojeISO) {
  if (game.ultimo_dia_acesso === hojeISO) return { game, bonus: 0, sequencia: game.sequencia_dias }

  const novaSequencia = game.ultimo_dia_acesso === ontemISO(hojeISO) ? game.sequencia_dias + 1 : 1
  const bonus = bonusPorSequencia(novaSequencia)

  // Trava a dupla concessão no mesmo dia (evita corrida entre abas/dispositivos)
  const { error } = await supabase
    .from('mwa_game_eventos')
    .insert({ user_id: userId, tipo: 'streak', ref: hojeISO, sementes: bonus })
  if (error) return { game, bonus: 0, sequencia: game.sequencia_dias }

  const novoTotal = game.sementes + bonus
  const { data } = await supabase
    .from('mwa_game')
    .update({
      sementes: novoTotal,
      sequencia_dias: novaSequencia,
      ultimo_dia_acesso: hojeISO,
      atualizado_em: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  return { game: data ?? game, bonus, sequencia: novaSequencia }
}

// Verifica quais tarefas centrais do dia já foram cumpridas (para a tela de "dia concluído")
export async function carregarTarefasHoje(userId, hojeISO) {
  const inicio = new Date(`${hojeISO}T00:00:00`)
  const fim = new Date(inicio.getTime() + 86400000)

  const { data } = await supabase
    .from('mwa_game_eventos')
    .select('tipo, sementes')
    .eq('user_id', userId)
    .gte('criado_em', inicio.toISOString())
    .lt('criado_em', fim.toISOString())

  const eventos = data ?? []
  const tipos = new Set(eventos.map((e) => e.tipo))
  const sementesHoje = eventos.reduce((s, e) => s + e.sementes, 0)

  return {
    refeicao: tipos.has('refeicao'),
    agua: tipos.has('agua'),
    dica: tipos.has('dica'),
    exercicio: tipos.has('exercicio'),
    // Qualquer jogo educativo concluído hoje cumpre a micro-meta "desafio" da estrela
    jogo: [...tipos].some((t) => t === 'joguinho' || t.startsWith('jogo_')),
    sementesHoje,
  }
}

// ── Estrelas do Dia ──
// Uma estrela por dia (ref = data) e a constelação da semana. A trava de duplicidade
// é a mesma dos outros eventos: a chave (tipo, ref) só entra uma vez.

export async function carregarEstrelas(userId, datasISO) {
  if (!userId || datasISO.length === 0) return []
  const { data } = await supabase
    .from('mwa_game_eventos')
    .select('ref')
    .eq('user_id', userId)
    .eq('tipo', 'estrela_dia')
    .in('ref', datasISO)
  return data ?? []
}
