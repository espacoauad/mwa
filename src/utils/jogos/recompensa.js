// Concessão de sementes à prova de falhas.
//
// A tela de resultado é o momento em que a pessoa aprende com o que jogou —
// ela não pode desaparecer porque a rede caiu ou porque a recompensa falhou.
// Aqui a falha vira apenas "sem selo de sementes", nunca uma tela quebrada.

export async function tentarRecompensa(registrar) {
  if (typeof registrar !== 'function') return false
  try {
    await registrar()
    return true
  } catch (erro) {
    console.warn('[MWA] não foi possível conceder as sementes agora:', erro)
    return false
  }
}
