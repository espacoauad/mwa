// Redimensiona e comprime uma imagem no navegador antes de salvar (evita linhas gigantes no banco)
export function redimensionarImagem(arquivo, tamanho = 320, qualidade = 0.82) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem'))
    leitor.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Arquivo inválido'))
      img.onload = () => {
        const lado = Math.min(img.width, img.height)
        const origemX = (img.width - lado) / 2
        const origemY = (img.height - lado) / 2

        const canvas = document.createElement('canvas')
        canvas.width = tamanho
        canvas.height = tamanho
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, origemX, origemY, lado, lado, 0, 0, tamanho, tamanho)

        resolve(canvas.toDataURL('image/jpeg', qualidade))
      }
      img.src = leitor.result
    }
    leitor.readAsDataURL(arquivo)
  })
}
