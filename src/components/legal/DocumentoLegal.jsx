import { X } from 'lucide-react'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Visualizador em tela cheia para Política de Privacidade e Termos de Uso
export default function DocumentoLegal({ documento, onFechar }) {
  const { ingles } = useIdioma()
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-verde/40 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col bg-creme">
        <div className="flex items-center justify-between border-b-2 border-cinza bg-white px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold italic text-verde">{documento.titulo}</h2>
            <p className="text-xs text-verde/50">{documento.atualizacao}</p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label={ingles ? 'Close' : 'Fechar'}
            className="rounded-full bg-sage-claro p-2 text-verde transition-colors hover:bg-sage/30"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {documento.secoes.map((secao) => (
            <section key={secao.titulo} className="mb-5">
              <h3 className="text-sm font-bold text-verde">{secao.titulo}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-verde/75">{secao.texto}</p>
            </section>
          ))}
          <button
            type="button"
            onClick={onFechar}
            className="mb-4 w-full rounded-lg bg-verde py-3.5 text-sm font-semibold text-white transition-colors hover:bg-verde-escuro"
          >
            {ingles ? 'I understand' : 'Entendi'}
          </button>
        </div>
      </div>
    </div>
  )
}
