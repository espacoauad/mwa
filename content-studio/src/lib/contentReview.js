const TERMOS_SAUDE = ['emagrec', 'dieta', 'caloria', 'perda de peso', 'peso corporal', 'gordura corporal', 'ganho de massa', 'nutricional', 'restrição alimentar']

export function detectarAvisoSaude(texto = '') {
  const alvo = texto.toLowerCase()
  return TERMOS_SAUDE.some((termo) => alvo.includes(termo))
}

export function encontrarPalavrasProibidas(texto = '', palavrasProibidas = []) {
  const alvo = texto.toLowerCase()
  return palavrasProibidas.filter((palavra) => alvo.includes(palavra.toLowerCase()))
}
