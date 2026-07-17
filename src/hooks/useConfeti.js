import confetti from 'canvas-confetti'

/**
 * Hook para disparar animações de confete
 */
export function useConfeti() {
  // Confete padrão: celebração simples
  function celebrar() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  // Confete em rajadas duplas (mais épico)
  function celebrarGrande() {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    })
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.7 },
      })
    }, 300)
  }

  // Confete especial: apenas corações/emojis verdes
  function celebrarVitoria() {
    const duration = 2500
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      const particleCount = Math.max(50, 200 * (timeLeft / duration))
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.1 },
      })
    }, 250)
  }

  // Fogos de artifício: rajadas verticais tipo "foguete" saindo de baixo,
  // em posições e instantes aleatórios, com formato de estrela
  function celebrarFogos() {
    const duration = 4000
    const animationEnd = Date.now() + duration
    const cores = ['#879B55', '#C9963B', '#344528', '#ffffff']

    function disparo() {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return
      confetti({
        particleCount: 40,
        startVelocity: 55,
        spread: 45,
        angle: 90,
        ticks: 100,
        origin: { x: Math.random(), y: 1 },
        colors: cores,
        shapes: ['star'],
        scalar: 1.1,
      })
      setTimeout(disparo, 350 + Math.random() * 400)
    }
    disparo()
  }

  return { celebrar, celebrarGrande, celebrarVitoria, celebrarFogos }
}
