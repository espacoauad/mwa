import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import Botao from '../ui/Botao.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function LembretePesagem({ onFechar, onIrPara }) {
  const { ingles } = useIdioma()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  // Move o foco para o diálogo assim que ele é aberto (a11y: modal focus management).
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onFechar}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-sm rounded-3xl bg-creme p-6 shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lembrete-pesagem-titulo"
      >
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center justify-between">
          <h2 id="lembrete-pesagem-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Weigh-in Day!' : 'Dia de Pesagem!'} 🎯</h2>
          <button
            type="button"
            onClick={onFechar}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-verde/10"
            aria-label={ingles ? 'Close' : 'Fechar'}
          >
            <X size={20} className="text-verde/60" />
          </button>
        </div>

        {/* Mensagem */}
        <div className="mb-6 space-y-3">
          <p className="text-sm text-verde/80">
            <strong>{ingles ? 'Today is the day to log your weight!' : 'Hoje é dia de informar seu peso!'}</strong>
          </p>
          <p className="text-xs text-verde/60">
            {ingles ? 'Weigh yourself before eating, after using the bathroom, and in light clothing — always under the same conditions. Take 4 comparison photos: front, back, and both sides.' : 'Pese-se em jejum, após ir ao banheiro e com roupas leves — sempre nas mesmas condições. Tire as 4 fotos de comparação (frente, costas, laterais).'}
          </p>
          <p className="text-xs font-semibold text-sage">
            💡 {ingles ? 'Remember: small weight changes are normal. Photos reveal the real transformation!' : 'Lembre-se: pequenas mudanças no peso são normais. As fotos mostram a transformação real!'}
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onFechar}
            className="min-h-11 flex-1 rounded-xl border-2 border-verde/20 px-4 py-2.5 text-sm font-semibold text-verde hover:bg-verde/5"
          >
            {ingles ? 'Later' : 'Depois'}
          </button>
          <button
            type="button"
            onClick={() => {
              onIrPara('progresso')
              onFechar()
            }}
            className="min-h-11 flex-1 rounded-xl bg-sage px-4 py-2.5 text-sm font-semibold text-white hover:bg-sage/90"
          >
            {ingles ? 'Go to Progress' : 'Ir para Progresso'}
          </button>
        </div>
      </div>
    </div>
  )
}
