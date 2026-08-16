// public/service-worker.js
// Service worker mínimo para push real — sem cache/offline, só os dois
// handlers necessários pra notificação chegar com o app fechado.

self.addEventListener('push', (event) => {
  let dados = {}
  try {
    dados = event.data ? event.data.json() : {}
  } catch {
    dados = {}
  }
  const titulo = dados.titulo || 'MWA'
  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: dados.corpo || '',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: dados.tag || 'mwa-push',
      data: { aba: dados.aba || 'ferramentas' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const aba = event.notification.data?.aba || 'ferramentas'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      for (const cliente of lista) {
        if ('focus' in cliente) {
          cliente.postMessage({ tipo: 'push-click', aba })
          return cliente.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow('/?aba=' + aba)
    })
  )
})
