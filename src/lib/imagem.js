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

// Redimensiona preservando a proporção original (para fotos de corpo inteiro,
// onde recortar em quadrado cortaria a pessoa) — usado nas fotos de pesagem.
export function redimensionarImagemProporcional(arquivo, ladoMaximo = 480, qualidade = 0.82) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onerror = () => reject(new Error('Não foi possível ler a imagem'))
    leitor.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Arquivo inválido'))
      img.onload = () => {
        const escala = Math.min(1, ladoMaximo / Math.max(img.width, img.height))
        const largura = Math.round(img.width * escala)
        const altura = Math.round(img.height * escala)

        const canvas = document.createElement('canvas')
        canvas.width = largura
        canvas.height = altura
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, largura, altura)

        resolve(canvas.toDataURL('image/jpeg', qualidade))
      }
      img.src = leitor.result
    }
    leitor.readAsDataURL(arquivo)
  })
}
