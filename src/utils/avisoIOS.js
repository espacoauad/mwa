// src/utils/avisoIOS.js
// Push real só funciona no iOS com o app instalado na tela de início (iOS
// 16.4+) — nunca numa aba comum do Safari. Decide se mostra o aviso.
export function ehIOSNaoInstalado({ userAgent = '', standalone = false } = {}) {
  const ehIOS = /iphone|ipad|ipod/i.test(userAgent)
  return ehIOS && !standalone
}

export function deveMostrarAvisoIOS({ userAgent, standalone, dispensado }) {
  return ehIOSNaoInstalado({ userAgent, standalone }) && !dispensado
}
