import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Sprout } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { resumoFazenda } from '../../utils/farm/crescimento.js'
import PlantaFazenda from './svg/PlantaFazenda.jsx'
import AnimalFazendaSvg from './svg/AnimalFazendaSvg.jsx'

// MWA FARM — a fazenda cresce sozinha ao longo da jornada (derivada de
// diaAtual), sem nenhuma tarefa obrigatória. Tocar numa planta ou bichinho só
// mostra informação; nada aqui concede ou consome sementes.

const NOMES_ESTAGIO = ['Semente', 'Broto', 'Floração', 'Plena']
const NOMES_ESTAGIO_EN = ['Seed', 'Sprout', 'Blooming', 'Full grown']

const EMOJI_DECORACAO = {
  cerca: '🌾',
  colmeia: '🍯',
  celeiro: '🏚️',
  espantalho: '🎃',
  bandeirinhas: '🎏',
  placa90: '🏆',
}

export default function MwaFarm({ onFechar }) {
  const { ingles } = useIdioma()
  const { diaAtual } = useApp()
  const [selecionado, setSelecionado] = useState(null) // { titulo, texto } | null
  const dialogRef = useRef(null)

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

  const resumo = useMemo(() => resumoFazenda(diaAtual), [diaAtual])
  const animais = resumo.decoracoes.filter((d) => d.tipo === 'animal')
  const decoracoes = resumo.decoracoes.filter((d) => d.tipo === 'decoracao')
  const diaExibido = diaAtual ?? 1

  function tocarPilar(pilar) {
    setSelecionado({
      titulo: ingles ? pilar.tituloHabitoEN : pilar.tituloHabito,
      texto: ingles ? pilar.textoEducativoEN : pilar.textoEducativo,
    })
  }

  function tocarAnimal(animal) {
    setSelecionado({
      titulo: ingles ? animal.nomeEN : animal.nome,
      texto: ingles
        ? `Arrived on day ${animal.dia} of your journey.`
        : `Chegou no dia ${animal.dia} da sua jornada.`,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mwa-farm-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-creme outline-none">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between gap-3 bg-verde px-5 py-4">
          <div>
            <h2 id="mwa-farm-titulo" className="font-serif text-lg font-semibold italic text-creme">
              MWA FARM
            </h2>
            <p className="text-[11px] text-creme/70">
              {ingles ? `Day ${diaExibido} of your journey` : `Dia ${diaExibido} da sua jornada`}
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label={ingles ? 'Close' : 'Fechar'}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-creme/15 text-creme hover:bg-creme/25"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cena */}
        <div className="relative overflow-hidden bg-gradient-to-b from-sky-200 to-sage-claro p-4">
          <div className="absolute right-4 top-3 h-8 w-8 rounded-full bg-ouro" aria-hidden="true" />

          {/* Decorações ambientais (não interativas) */}
          {decoracoes.length > 0 && (
            <div className="relative mb-2 flex flex-wrap gap-2" aria-hidden="true">
              {decoracoes.map((d) => (
                <span key={d.id} className="text-2xl" title={ingles ? d.nomeEN : d.nome}>
                  {EMOJI_DECORACAO[d.id] ?? '✨'}
                </span>
              ))}
            </div>
          )}

          {/* Bichinhos (interativos) */}
          {animais.length > 0 && (
            <div className="relative mb-3 flex flex-wrap gap-3">
              {animais.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => tocarAnimal(a)}
                  aria-label={ingles ? a.nomeEN : a.nome}
                  className="mwa-farm-bob rounded-full transition-transform active:scale-90"
                >
                  <AnimalFazendaSvg id={a.id} tamanho={40} />
                </button>
              ))}
            </div>
          )}

          {/* Canteiros dos 8 pilares */}
          <div className="relative grid grid-cols-4 gap-2">
            {resumo.pilares.map((pilar) => {
              const bloqueado = !pilar.liberado
              return (
                <button
                  key={pilar.id}
                  type="button"
                  onClick={() => !bloqueado && tocarPilar(pilar)}
                  disabled={bloqueado}
                  aria-label={
                    bloqueado
                      ? ingles ? `Unlocks on day ${pilar.diaLiberacao}` : `Libera no dia ${pilar.diaLiberacao}`
                      : ingles ? pilar.tituloHabitoEN : pilar.tituloHabito
                  }
                  className={`flex flex-col items-center gap-1 rounded-xl p-2 transition-transform ${
                    bloqueado ? 'cursor-not-allowed bg-white/40 opacity-60' : 'bg-white/70 active:scale-95'
                  }`}
                >
                  {bloqueado ? (
                    <>
                      <Sprout size={28} className="text-verde/25" aria-hidden="true" />
                      <span className="text-[9px] text-verde/50">
                        {ingles ? `Day ${pilar.diaLiberacao}` : `Dia ${pilar.diaLiberacao}`}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="mwa-farm-balanco">
                        <PlantaFazenda estagio={pilar.estagio} cor={pilar.cor} coroaId={pilar.coroaId} tamanho={40} />
                      </span>
                      <span className="text-[9px] font-semibold text-verde/70">
                        {ingles ? NOMES_ESTAGIO_EN[pilar.estagio] : NOMES_ESTAGIO[pilar.estagio]}
                      </span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Cartão de informação ao tocar */}
        {selecionado && (
          <div className="p-5" role="status" aria-live="polite">
            <div className="rounded-2xl bg-white p-4">
              <p className="font-serif text-base font-semibold italic text-verde">{selecionado.titulo}</p>
              <p className="mt-1 text-xs leading-relaxed text-verde/80">{selecionado.texto}</p>
            </div>
          </div>
        )}

        <p className="px-5 pb-5 pt-2 text-center text-[11px] text-verde/50">
          {ingles
            ? 'Your farm grows on its own as your journey unfolds — nothing to do here.'
            : 'Sua fazenda cresce sozinha conforme sua jornada avança — nada para fazer aqui.'}
        </p>
      </div>
    </div>
  )
}
