/**
 * Sistema de notificações push 24h antes do dia de pesagem
 */

import { getDiasPesagem } from './pesagensReminder.js'

/**
 * Solicita permissão para enviar notificações push
 */
export async function solicitarPermissaoNotificacao() {
  if (!('Notification' in window)) {
    console.log('Browser não suporta notificações')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permissao = await Notification.requestPermission()
    return permissao === 'granted'
  }

  return false
}

/**
 * Calcula quantos dias faltam para o próximo dia de pesagem
 * @param {number} diaAtual - Dia atual do programa
 * @param {number} totalDiasPrograma - Total de dias do programa
 * @returns {number | null} - Dias restantes ou null se não houver próxima pesagem
 */
export function diasAteProximaPesagem(diaAtual, totalDiasPrograma) {
  const diasPesagem = getDiasPesagem(totalDiasPrograma)
  const proximoPesagem = diasPesagem.find((dia) => dia > diaAtual)

  if (!proximoPesagem) return null
  return proximoPesagem - diaAtual
}

/**
 * Verifica se deve enviar notificação (24h antes da pesagem)
 * @param {number} diaAtual - Dia atual do programa
 * @param {number} totalDiasPrograma - Total de dias do programa
 * @returns {boolean}
 */
export function ehDia24hAntesPesagem(diaAtual, totalDiasPrograma) {
  const diasRestantes = diasAteProximaPesagem(diaAtual, totalDiasPrograma)
  return diasRestantes === 1
}

/**
 * Envia notificação push 24h antes da pesagem
 * @param {number} diaAtual - Dia atual do programa
 * @param {number} totalDiasPrograma - Total de dias do programa
 * @param {string} userId - ID do usuário (para verificar se já foi notificado hoje)
 */
export async function enviarNotificacao24hPesagem(diaAtual, totalDiasPrograma, userId) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return
  }

  if (!ehDia24hAntesPesagem(diaAtual, totalDiasPrograma)) {
    return
  }

  // Evita enviar múltiplas notificações do mesmo dia
  const chaveCache = `notif_pesagem_24h_${userId}_${diaAtual}`
  if (localStorage.getItem(chaveCache)) {
    return
  }

  const diasPesagem = getDiasPesagem(totalDiasPrograma)
  const proximoPesagem = diasPesagem.find((dia) => dia > diaAtual)

  new Notification('📸 Amanhã é dia de pesagem!', {
    body: `Prepare suas 4 fotos e medidas para o Dia ${proximoPesagem}. Você está no caminho certo! 💚`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: `pesagem_${proximoPesagem}`,
    requireInteraction: false,
  })

  // Marca como notificado para não repetir
  localStorage.setItem(chaveCache, 'true')
}

/**
 * Configura verificação diária de notificação de pesagem
 * Chamado no AppInner quando usuário está logado
 */
export function configurarNotificacoesPesagem(diaAtual, totalDiasPrograma, userId) {
  // iOS Safari fora de app instalado na tela de início não tem a API Notification
  if (!('Notification' in window)) return

  // Tenta solicitar permissão (silenciosamente, não força)
  if (Notification.permission === 'default') {
    solicitarPermissaoNotificacao().catch(() => {
      // Ignora se usuário recusar
    })
  }

  // Envia notificação se for 24h antes
  if (diaAtual && totalDiasPrograma && userId) {
    enviarNotificacao24hPesagem(diaAtual, totalDiasPrograma, userId)
  }
}
