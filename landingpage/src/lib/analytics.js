/**
 * Módulo de analytics — Meta Pixel + GA4.
 *
 * Zero dependências novas: os SDKs são injetados via snippet oficial inline,
 * somente se o respectivo ID existir em env, e agendados após o idle do
 * navegador para não competir com o carregamento crítico (LCP).
 *
 * Uso:
 *   import { initAnalytics, track } from './lib/analytics.js'
 *   initAnalytics() // uma vez, no bootstrap (main.jsx)
 *   track('Lead')   // em qualquer handler de conversão
 *
 * Nota (futuro): sem Consent Mode avançado do GA4 (region-based consent /
 * denied-by-default). Se a MWA precisar de compliance de consentimento por
 * região, implementar `gtag('consent', 'default', {...})` antes do config.
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID
const GA4_ID = import.meta.env.VITE_GA4_ID

let initialized = false

/* ---------- Meta Pixel (snippet oficial) ---------- */
function loadMetaPixel(pixelId) {
  /* eslint-disable */
  ;(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = true
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
}

/* ---------- GA4 (gtag.js oficial) ---------- */
function loadGa4(measurementId) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId)
}

/**
 * Agenda a injeção dos snippets de analytics para depois que o navegador
 * estiver ocioso (ou no máximo 2s), evitando impacto no LCP. Só injeta o
 * que tiver ID configurado em env; sem nenhum ID, não faz nada.
 */
export function initAnalytics() {
  if (initialized) return
  initialized = true

  const schedule =
    typeof window.requestIdleCallback === 'function'
      ? window.requestIdleCallback
      : (cb) => setTimeout(cb, 2000)

  schedule(() => {
    if (PIXEL_ID) loadMetaPixel(PIXEL_ID)
    if (GA4_ID) loadGa4(GA4_ID)
  })
}

/* ---------- Mapa de eventos de conversão ---------- */
const EVENT_MAP = {
  InitiateCheckout: { fbq: 'InitiateCheckout', gtag: 'begin_checkout' },
  Lead: { fbq: 'Lead', gtag: 'generate_lead' },
  ViewContent: { fbq: 'ViewContent', gtag: 'view_item' },
}

/**
 * Dispara um evento de conversão nas plataformas configuradas.
 * Seguro para chamar mesmo sem `initAnalytics()` ter injetado nada — os
 * guards verificam se `window.fbq`/`window.gtag` existem antes de usar.
 */
export function track(evento, dados) {
  const mapped = EVENT_MAP[evento]
  if (!mapped) return

  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', mapped.fbq, dados)
  }
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', mapped.gtag, dados)
  }
}
