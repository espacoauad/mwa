import { Component } from 'react'

// Sem isso, um erro de JS em qualquer lugar da árvore derruba o React inteiro
// e a pessoa vê uma tela em branco, sem nenhuma pista do que quebrou.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { erro: null }
  }

  static getDerivedStateFromError(erro) {
    return { erro }
  }

  componentDidCatch(erro, info) {
    console.error('Erro capturado pelo ErrorBoundary:', erro, info)
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-serif text-2xl font-semibold italic text-verde">Algo deu errado</p>
          <p className="text-sm text-verde/70">
            Tenta recarregar a página. Se continuar acontecendo, manda essa mensagem pro suporte:
          </p>
          <pre className="max-w-full overflow-x-auto whitespace-pre-wrap rounded-lg bg-red-50 p-3 text-left text-xs text-red-800">
            {String(this.state.erro?.stack || this.state.erro?.message || this.state.erro)}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-verde px-5 py-3 text-sm font-semibold text-white"
          >
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
