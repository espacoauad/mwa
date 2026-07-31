// Push etapa A — lembrete da Estrela do Dia sem servidor.
// Enquanto o app está aberto (ou foi aberto no dia), avisamos uma única vez que a
// estrela ainda não acendeu. O push real com o app fechado é a etapa B (Web Push
// com service worker + Edge Function), que depende de aprovação e infraestrutura.

import { mensagemLembrete } from './jogos/estrelas.js'

const HORA_LEMBRETE = 18 // só lembra a partir do fim da tarde, para não ser intrusivo

export function podeNotificar() {
  return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
}

// Pede permissão apenas quando a pessoa demonstra interesse (nunca no primeiro acesso)
export async function pedirPermissaoEstrela() {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const resposta = await Notification.requestPermission()
  return resposta === 'granted'
}

export function deveLembrar({ estrelaAcesa, hora = new Date().getHours() }) {
  return !estrelaAcesa && hora >= HORA_LEMBRETE
}

export function lembrarEstrelaDoDia({ userId, hoje, estrelaAcesa, metas, ingles = false }) {
  if (!userId || !podeNotificar() || !deveLembrar({ estrelaAcesa })) return false

  const chave = `mwa_lembrete_estrela_${userId}_${hoje}`
  if (localStorage.getItem(chave)) return false

  const texto = mensagemLembrete(metas, false)[ingles ? 'en' : 'pt']
  new Notification(ingles ? '⭐ Your star is waiting' : '⭐ Sua estrela está esperando', {
    body: texto,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: `estrela_${hoje}`,
    requireInteraction: false,
  })
  localStorage.setItem(chave, '1')
  return true
}
