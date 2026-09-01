function dispararDownload(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escaparHtml(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function copiarTexto(texto) {
  return navigator.clipboard.writeText(texto)
}

export function baixarTxt(nomeArquivo, texto) {
  const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' })
  dispararDownload(blob, nomeArquivo.endsWith('.txt') ? nomeArquivo : `${nomeArquivo}.txt`)
}

export function baixarJson(nomeArquivo, objeto) {
  const blob = new Blob([JSON.stringify(objeto, null, 2)], { type: 'application/json' })
  dispararDownload(blob, nomeArquivo.endsWith('.json') ? nomeArquivo : `${nomeArquivo}.json`)
}

export function abrirJanelaImpressao(titulo, texto) {
  const janela = window.open('', '_blank', 'width=800,height=900')
  if (!janela) return
  janela.document.write(`<!doctype html><html><head><title>${escaparHtml(titulo)}</title>
    <style>
      body { font-family: Georgia, serif; padding: 40px; color: #052a1f; line-height: 1.6; white-space: pre-wrap; }
      h1 { font-family: Georgia, serif; color: #08402f; }
    </style>
  </head><body><h1>${escaparHtml(titulo)}</h1><div>${escaparHtml(texto)}</div></body></html>`)
  janela.document.close()
  janela.focus()
  janela.print()
}
