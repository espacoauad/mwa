// Push real (Web Push/VAPID) — registra o service worker e garante que o
// dispositivo tenha uma inscrição salva no Supabase, reaproveitando a
// permissão de notificação já concedida em outro lugar (não pede permissão
// aqui).
import { supabase } from '../lib/supabase.js'

// Chave pública VAPID — não é segredo, faz parte do protocolo Web Push.
const VAPID_PUBLIC_KEY = 'BGW_X_MMpDTDq8Nof4pKWMRKzU4sIebEburSWN4JBirHqIksyxj-7ykLn-QStanc7yGA5CmAjmwyHpYCcOQQ_GQ'

export function urlBase64ParaUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Segura = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const bruto = atob(base64Segura)
  return Uint8Array.from([...bruto].map((c) => c.charCodeAt(0)))
}

export function suportaPush() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window
}

export async function registrarServiceWorker() {
  if (!suportaPush()) return null
  return navigator.serviceWorker.register('/service-worker.js')
}

export function inscricaoParaLinha(userId, subscription) {
  const json = subscription.toJSON()
  return {
    endpoint: json.endpoint,
    user_id: userId,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
    atualizado_em: new Date().toISOString(),
  }
}

// Garante que o dispositivo atual tenha uma inscrição push salva —
// idempotente, seguro de chamar toda vez que o app carrega.
export async function garantirInscricaoPush(userId) {
  try {
    if (!userId || !suportaPush() || Notification.permission !== 'granted') return false
    const registration = await registrarServiceWorker()
    if (!registration) return false
    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ParaUint8Array(VAPID_PUBLIC_KEY),
      })
    }
    const linha = inscricaoParaLinha(userId, subscription)
    const { error } = await supabase.from('mwa_push_inscricoes').upsert(linha, { onConflict: 'endpoint' })
    return !error
  } catch {
    // Navegador sem suporte completo, ou pessoa negou no meio do fluxo —
    // falha silenciosa, sem crashar o app (mesmo padrão dos lembretes locais).
    return false
  }
}

// Desfaz a inscrição push do dispositivo atual — usada no logout e na
// exclusão/reinício de conta, pra um dispositivo compartilhado ou reutilizado
// não continuar recebendo push da conta anterior. Best-effort: mesmo padrão
// defensivo de garantirInscricaoPush, nunca deixa o chamador quebrar por isso.
export async function removerInscricaoPush() {
  if (!suportaPush()) return false
  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) return false
    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) return false
    return await subscription.unsubscribe()
  } catch {
    return false
  }
}
