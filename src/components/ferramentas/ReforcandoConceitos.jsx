import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown, BookOpen } from 'lucide-react'
import { CONCEITOS_NUTRICIONAIS } from '../../data/conceitosNutricionais.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Apêndice de conceitos nutricionais: glossário com o que é e por que o MWA
// trabalha cada tema, para reforçar o conhecimento aplicado ao longo dos 30 dias.
export default function ReforcandoConceitos({ onFechar }) {
  const { ingles } = useIdioma()
  const [abertoId, setAbertoId] = useState(CONCEITOS_NUTRICIONAIS[0].id)
  const dialogRef = useRef(null)

  function alternar(id) {
    setAbertoId((atual) => (atual === id ? null : id))
  }

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={onFechar}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="conceitos-titulo"
      >
        {/* Cabeçalho */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-sage-claro p-2">
              <BookOpen size={20} className="text-sage" strokeWidth={1.5} />
            </div>
            <h1 id="conceitos-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Reinforcing Concepts' : 'Reforçando Conceitos'}</h1>
          </div>
          <button
            type="button"
            aria-label={ingles ? 'Close' : 'Fechar'}
            onClick={onFechar}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-verde/80">
          {ingles
            ? "A small guide to the concepts behind the whole MWA method — what each one means and why we work with it throughout your journey here."
            : 'Um pequeno guia com os conceitos que sustentam todo o método MWA — o que cada um significa e por que trabalhamos com ele ao longo da sua jornada aqui.'}
        </p>

        {/* Acordeão de conceitos */}
        <div className="flex flex-col gap-2.5">
          {CONCEITOS_NUTRICIONAIS.map((c) => {
            const aberto = abertoId === c.id
            return (
              <div
                key={c.id}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${
                  aberto ? 'border-sage bg-white' : 'border-cinza bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => alternar(c.id)}
                  aria-expanded={aberto}
                  aria-controls={`conceito-painel-${c.id}`}
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-serif text-base font-semibold italic text-verde">{ingles ? c.tituloEn : c.titulo}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-sage transition-transform ${aberto ? 'rotate-180' : ''}`}
                  />
                </button>

                <div
                  id={`conceito-painel-${c.id}`}
                  hidden={!aberto}
                  className="space-y-3 border-t border-cinza px-4 pb-4 pt-3"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-verde/80">{ingles ? 'What it is' : 'O que é'}</p>
                    <p className="mt-1 text-sm leading-relaxed text-verde/80">{ingles ? c.oQueEEn : c.oQueE}</p>
                  </div>
                  <div className="rounded-lg bg-sage-claro/40 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-sage">
                      {ingles ? 'Why we cover this in the program' : 'Por que tratamos disso no programa'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-verde/80">{ingles ? c.porQueEn : c.porQue}</p>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        <p className="mt-5 text-center text-[11px] text-verde/80">
          {ingles
            ? 'Come back here anytime you want to remember the why behind each choice. 💚'
            : 'Volte aqui sempre que quiser relembrar o porquê por trás de cada escolha. 💚'}
        </p>
      </div>
    </div>
  )
}
