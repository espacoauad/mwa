import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { diasDoMes, mesAnterior, mesSeguinte, dataDentroDoIntervalo } from '../../utils/datas.js'

const DIAS_SEMANA_PT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const DIAS_SEMANA_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function ModalCalendario({ diaSelecionado, dataMin, dataMax, onEscolher, onFechar }) {
  const { ingles, locale } = useIdioma()
  const [mesReferencia, setMesReferencia] = useState(`${diaSelecionado.slice(0, 7)}-01`)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const dias = diasDoMes(mesReferencia)
  const nomeMes = new Date(`${mesReferencia}T00:00:00`).toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={onFechar}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-calendario-titulo"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="modal-calendario-titulo" className="font-serif text-lg font-semibold italic capitalize text-verde">
            {nomeMes}
          </h2>
          <button
            type="button"
            aria-label={ingles ? 'Close' : 'Fechar'}
            onClick={onFechar}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMesReferencia(mesAnterior(mesReferencia))}
            aria-label={ingles ? 'Previous month' : 'Mês anterior'}
            className="flex min-h-11 min-w-11 items-center justify-center text-verde/60"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => setMesReferencia(mesSeguinte(mesReferencia))}
            aria-label={ingles ? 'Next month' : 'Próximo mês'}
            className="flex min-h-11 min-w-11 items-center justify-center text-verde/60"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-verde/50">
          {(ingles ? DIAS_SEMANA_EN : DIAS_SEMANA_PT).map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {dias.map((data, i) => {
            if (!data) return <span key={`vazio-${i}`} />
            const desabilitado = !dataDentroDoIntervalo(data, dataMin, dataMax)
            const selecionado = data === diaSelecionado
            return (
              <button
                key={data}
                type="button"
                disabled={desabilitado}
                onClick={() => onEscolher(data)}
                className={`flex aspect-square items-center justify-center rounded-full text-sm font-medium ${
                  selecionado
                    ? 'bg-verde text-white'
                    : desabilitado
                      ? 'cursor-not-allowed text-verde/20'
                      : 'text-verde hover:bg-sage-claro'
                }`}
              >
                {Number(data.slice(8, 10))}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
