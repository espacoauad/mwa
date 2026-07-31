import { useEffect, useRef, useState } from 'react'
import { X, Sparkles, Wind } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { afirmacaoDoDia, INTENCOES } from '../../data/jogos/afirmacoes.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'

// Momento MWA — sucessor do Jardim de Afirmações.
// Cerca de 40 segundos: afirmação do dia → respiração guiada (3 ciclos) → intenção.
// Sai da lista de jogos e vira um cuidado diário na aba Hoje.

const CICLOS = 3
const FASES_RESPIRACAO = [
  { id: 'inspire', segundos: 4, pt: 'Inspire', en: 'Breathe in' },
  { id: 'segure', segundos: 4, pt: 'Segure', en: 'Hold' },
  { id: 'solte', segundos: 6, pt: 'Solte devagar', en: 'Breathe out slowly' },
]

export default function MomentoMwa({ onFechar }) {
  const { ingles } = useIdioma()
  const { hoje, registrarMomentoMwa } = useApp()
  const [etapa, setEtapa] = useState('afirmacao') // afirmacao | respiracao | intencao | fim
  const [ciclo, setCiclo] = useState(0)
  const [faseIdx, setFaseIdx] = useState(0)
  const [intencao, setIntencao] = useState(null)
  const [premioDado, setPremioDado] = useState(false)
  const dialogRef = useRef(null)

  const afirmacao = afirmacaoDoDia(hoje)
  const fase = FASES_RESPIRACAO[faseIdx]

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
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

  // Ciclo de respiração guiada
  useEffect(() => {
    if (etapa !== 'respiracao') return
    const tempo = setTimeout(() => {
      if (faseIdx + 1 < FASES_RESPIRACAO.length) {
        setFaseIdx(faseIdx + 1)
        return
      }
      if (ciclo + 1 < CICLOS) {
        setCiclo(ciclo + 1)
        setFaseIdx(0)
        return
      }
      setEtapa('intencao')
    }, fase.segundos * 1000)
    return () => clearTimeout(tempo)
  }, [etapa, faseIdx, ciclo])

  async function escolherIntencao(id) {
    setIntencao(id)
    setEtapa('fim')
    setPremioDado(await tentarRecompensa(registrarMomentoMwa))
  }

  const escala = fase?.id === 'inspire' ? 'scale-100' : fase?.id === 'segure' ? 'scale-100' : 'scale-50'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="momento-mwa-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-3xl bg-creme p-6 outline-none">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2 id="momento-mwa-titulo" className="font-serif text-xl font-semibold italic text-verde">
              {ingles ? 'MWA Moment' : 'Momento MWA'}
            </h2>
            <p className="text-xs text-verde/60">
              {ingles ? 'Less than a minute for you' : 'Menos de um minuto para você'}
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label={ingles ? 'Close' : 'Fechar'}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-verde/10 text-verde hover:bg-verde/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* 1 · Afirmação do dia */}
        {etapa === 'afirmacao' && (
          <div className="text-center">
            <Sparkles size={22} className="mx-auto text-ouro" aria-hidden="true" />
            <p className="mt-4 font-serif text-lg font-medium italic leading-relaxed text-verde">
              “{ingles ? afirmacao.en : afirmacao.pt}”
            </p>
            <button
              type="button"
              onClick={() => setEtapa('respiracao')}
              className="mt-6 w-full rounded-full bg-verde px-6 py-3 text-sm font-bold text-creme"
            >
              {ingles ? 'Breathe with me' : 'Respirar comigo'}
            </button>
          </div>
        )}

        {/* 2 · Respiração guiada */}
        {etapa === 'respiracao' && (
          <div className="text-center">
            <div className="flex h-44 items-center justify-center">
              <div
                className={`flex h-32 w-32 items-center justify-center rounded-full bg-sage-claro transition-transform ease-in-out motion-reduce:transition-none ${escala}`}
                style={{ transitionDuration: `${fase.segundos}s` }}
              >
                <Wind size={26} className="text-sage" aria-hidden="true" />
              </div>
            </div>
            <p className="font-serif text-xl font-semibold italic text-verde" role="status" aria-live="polite">
              {ingles ? fase.en : fase.pt}
            </p>
            <p className="mt-1 text-xs text-verde/60">
              {ingles ? 'Cycle' : 'Ciclo'} {ciclo + 1}/{CICLOS}
            </p>
            <button
              type="button"
              onClick={() => setEtapa('intencao')}
              className="mt-5 text-xs font-semibold text-verde/60 underline"
            >
              {ingles ? 'Skip breathing' : 'Pular a respiração'}
            </button>
          </div>
        )}

        {/* 3 · Intenção do dia */}
        {etapa === 'intencao' && (
          <div>
            <p className="text-center text-sm font-semibold text-verde">
              {ingles ? 'Today I choose:' : 'Hoje eu escolho:'}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {INTENCOES.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => escolherIntencao(i.id)}
                  className="rounded-xl border-2 border-sage/30 bg-white px-3 py-4 font-serif text-base font-semibold italic text-verde transition-all hover:border-sage active:scale-[0.98]"
                >
                  {ingles ? i.en : i.pt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4 · Fecho */}
        {etapa === 'fim' && (
          <div className="text-center" role="status" aria-live="polite">
            <Sparkles size={24} className="mx-auto text-ouro" aria-hidden="true" />
            <p className="mt-3 font-serif text-lg font-semibold italic text-verde">
              {ingles ? 'Your moment is complete' : 'Seu momento está completo'}
            </p>
            <p className="mt-1 text-sm text-verde/75">
              {ingles ? 'Today you chose ' : 'Hoje você escolheu '}
              <strong className="text-verde">
                {ingles
                  ? INTENCOES.find((i) => i.id === intencao)?.en
                  : INTENCOES.find((i) => i.id === intencao)?.pt}
              </strong>
              .
            </p>
            {premioDado && (
              <p className="mt-3 inline-block rounded-full bg-ouro px-3 py-1 text-xs font-bold text-verde">
                +5 🌱 {ingles ? 'earned!' : 'ganhas!'}
              </p>
            )}
            <button
              type="button"
              onClick={onFechar}
              className="mt-5 w-full rounded-full bg-verde px-6 py-3 text-sm font-bold text-creme"
            >
              {ingles ? 'Close' : 'Fechar'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
