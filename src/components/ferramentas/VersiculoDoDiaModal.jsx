import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import versiculos from '../../data/versiculos.js'

export default function VersiculoDoDiaModal({ onFechar }) {
  const { diaAtual, totalDias } = useApp()
  const dialogRef = useRef(null)

  const versiculoHoje = versiculos.find(v => v.dia === diaAtual) || versiculos[0]
  const progresso = totalDias ? Math.round((diaAtual / totalDias) * 100) : 0

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm" onClick={onFechar}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="max-h-[92vh] w-full max-w-sm overflow-hidden rounded-3xl outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="versiculo-titulo"
      >
        <div className="max-h-[92vh] overflow-y-auto">
          {/* CABEÇALHO COM FECHAR */}
          <div className="sticky top-0 z-20 bg-creme p-5 flex items-center justify-between">
            <div>
              <h2 id="versiculo-titulo" className="font-serif text-xl font-semibold italic text-verde">✨ {diaAtual === 1 ? 'Versículo do Dia' : `Dia ${diaAtual}`}</h2>
              <p className="text-xs text-verde/80">Dia {diaAtual} de {totalDias}</p>
            </div>
            <button
              type="button"
              aria-label="Fechar"
              onClick={onFechar}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-verde/10 text-verde hover:bg-verde/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div
            className="relative px-6 py-8 space-y-6"
            style={{ background: 'linear-gradient(160deg, #344528 0%, #4A5F3A 55%, #879B55 100%)' }}
          >
            {/* Decoração de canto */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-ouro/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-ouro/15 rounded-full blur-3xl" />

            {/* CONTEÚDO */}
            <div className="relative z-10 space-y-6">
              {/* TEXTO DO VERSÍCULO */}
              <div className="text-center space-y-4">
                <p className="text-sm text-ouro uppercase tracking-wider font-bold">
                  {versiculoHoje.tema}
                </p>

                <p className="font-serif text-lg leading-relaxed text-white italic">
                  "{versiculoHoje.texto}"
                </p>

                {/* REFERÊNCIA BÍBLICA */}
                <p className="text-base font-bold text-ouro">
                  — {versiculoHoje.referencia}
                </p>
              </div>

              {/* LINHA DIVISÓRIA */}
              <div className="h-0.5 bg-gradient-to-r from-transparent via-ouro/40 to-transparent" />

              {/* REFLEXÃO DO DIA */}
              <div className="bg-black/15 backdrop-blur rounded-2xl p-4 border border-white/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-ouro mb-2">💭 Reflexão</p>
                <p className="text-xs leading-relaxed text-white/95">
                  {versiculoHoje.reflexao}
                </p>
              </div>

              {/* PROGRESSO VISUAL */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-semibold text-white/90">Sua jornada</p>
                  <p className="text-xs font-bold text-ouro">{progresso}%</p>
                </div>
                <div
                  className="w-full h-2 bg-black/20 rounded-full overflow-hidden border border-white/20"
                  role="progressbar"
                  aria-valuenow={progresso}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Sua jornada"
                >
                  <div
                    className="h-full bg-gradient-to-r from-ouro to-sage transition-all duration-300"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </div>

              {/* CTA INSPIRADOR */}
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center border border-white/20">
                <p className="text-xs font-semibold text-white">
                  🙏 Comece hoje lembrando: você é digno de cuidado, amor e transformação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
