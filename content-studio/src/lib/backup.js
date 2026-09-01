import { NAMESPACE, allKeys } from './storage'

export function exportarBackup() {
  const dados = {}
  allKeys().forEach((chaveCompleta) => {
    const nomeCurto = chaveCompleta.replace(`${NAMESPACE}:`, '')
    dados[nomeCurto] = JSON.parse(localStorage.getItem(chaveCompleta))
  })
  return { exportadoEm: new Date().toISOString(), namespace: NAMESPACE, dados }
}

export function restaurarBackup(arquivoJson) {
  if (!arquivoJson?.dados) throw new Error('Arquivo de backup inválido.')
  Object.entries(arquivoJson.dados).forEach(([nomeCurto, valor]) => {
    localStorage.setItem(`${NAMESPACE}:${nomeCurto}`, JSON.stringify(valor))
  })
}
