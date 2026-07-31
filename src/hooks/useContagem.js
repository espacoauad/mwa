import { useEffect, useRef, useState } from 'react'
import { valorNaContagem } from '../utils/contagem.js'

/**
 * Anima um número do seu valor anterior até `valorAlvo`, quadro a quadro.
 * Quando `ativo` é falso (ex.: prefers-reduced-motion), retorna `valorAlvo`
 * direto, sem animação.
 */
export function useContagem(valorAlvo, { duracaoMs = 600, ativo = true } = {}) {
  const [valorExibido, setValorExibido] = useState(ativo ? 0 : valorAlvo)
  const valorAnteriorRef = useRef(ativo ? 0 : valorAlvo)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!ativo) {
      setValorExibido(valorAlvo)
      valorAnteriorRef.current = valorAlvo
      return
    }

    const valorInicial = valorAnteriorRef.current
    if (valorInicial === valorAlvo) return

    const inicio = performance.now()

    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracaoMs, 1)
      setValorExibido(valorNaContagem(valorInicial, valorAlvo, progresso))
      if (progresso < 1) {
        frameRef.current = requestAnimationFrame(passo)
      } else {
        valorAnteriorRef.current = valorAlvo
      }
    }

    frameRef.current = requestAnimationFrame(passo)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [valorAlvo, ativo, duracaoMs])

  return valorExibido
}
