import { useState } from 'react'
import { X, ChevronDown, BookOpen } from 'lucide-react'
import { CONCEITOS_NUTRICIONAIS } from '../../data/conceitosNutricionais.js'

// Apêndice de conceitos nutricionais: glossário com o que é e por que o MWA
// trabalha cada tema, para reforçar o conhecimento aplicado ao longo dos 30 dias.
export default function ReforcandoConceitos({ onFechar }) {
  const [abertoId, setAbertoId] = useState(CONCEITOS_NUTRICIONAIS[0].id)

  function alternar(id) {
    setAbertoId((atual) => (atual === id ? null : id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6">
        {/* Cabeçalho */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-sage-claro p-2">
              <BookOpen size={20} className="text-sage" strokeWidth={1.5} />
            </div>
            <h1 className="font-serif text-xl font-semibold italic text-verde">Reforçando Conceitos</h1>
          </div>
          <button type="button" onClick={onFechar} className="rounded-full bg-white p-2 text-verde/60">
            <X size={18} />
          </button>
        </div>
        <p className="mb-5 text-sm text-verde/70">
          Um pequeno guia com os conceitos que sustentam todo o método MWA — o que cada um significa e por que
          trabalhamos com ele ao longo da sua jornada aqui.
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
                  className="flex w-full items-center justify-between gap-3 p-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-serif text-base font-semibold italic text-verde">{c.titulo}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-sage transition-transform ${aberto ? 'rotate-180' : ''}`}
                  />
                </button>

                {aberto && (
                  <div className="space-y-3 border-t border-cinza px-4 pb-4 pt-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-verde/50">O que é</p>
                      <p className="mt-1 text-sm leading-relaxed text-verde/80">{c.oQueE}</p>
                    </div>
                    <div className="rounded-lg bg-sage-claro/40 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-sage">
                        Por que tratamos disso no programa
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-verde/80">{c.porQue}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-5 text-center text-[11px] text-verde/50">
          Volte aqui sempre que quiser relembrar o porquê por trás de cada escolha. 💚
        </p>
      </div>
    </div>
  )
}
