/**
 * Easing ease-out cúbico: início rápido, desaceleração suave no final.
 * Usado para dar sensação de "assentamento" às contagens numéricas e
 * aos anéis de progresso animados.
 */
export function facilitarSaidaCubica(progresso) {
  const p = Math.min(Math.max(progresso, 0), 1)
  return 1 - Math.pow(1 - p, 3)
}

/**
 * Calcula o valor intermediário de uma contagem animada entre `inicio` e
 * `fim`, dado um progresso de 0 a 1 (com easing ease-out aplicado).
 */
export function valorNaContagem(inicio, fim, progresso) {
  const suavizado = facilitarSaidaCubica(progresso)
  return inicio + (fim - inicio) * suavizado
}
