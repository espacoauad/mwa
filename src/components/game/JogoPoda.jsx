import { useEffect, useRef, useState } from 'react'
import { X, Play, RotateCcw, Timer } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Jogo da Poda — toque só nos hábitos que precisam ser "podados" (ruins). Deixe os hábitos
// que sustentam (bons) em paz — tocar neles por engano tira pontos.
// 300+ pontos = +10 🌱 (1x por dia)

const HABITOS = [
  { emoji: '🍭', tipo: 'ruim' },
  { emoji: '🛋️', tipo: 'ruim' },
  { emoji: '🥤', tipo: 'ruim' },
  { emoji: '📱', tipo: 'ruim' },
  { emoji: '🍟', tipo: 'ruim' },
  { emoji: '⏰', tipo: 'ruim' },
  { emoji: '💧', tipo: 'bom' },
  { emoji: '🥗', tipo: 'bom' },
  { emoji: '🚶', tipo: 'bom' },
  { emoji: '😴', tipo: 'bom' },
  { emoji: '🙏', tipo: 'bom' },
  { emoji: '🫁', tipo: 'bom' },
]
const TAMANHO_GRADE = 9
const DURACAO_JOGO = 40 // segundos
const CICLO_MS = 850
const META_PONTOS = 300
const PONTOS_POR_PODA = 20
const PONTOS_PENALIDADE = 10

export default function JogoPoda({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoPoda } = useApp()
  const [fase, setFase] = useState('inicio') // inicio | jogando | fim
  const [ativa, setAtiva] = useState(null)
  const [pontos, setPontos] = useState(0)
  const [tempoRestante, setTempoRestante] = useState(DURACAO_JOGO)
  const [premioDado, setPremioDado] = useState(false)
  const [aviso, setAviso] = useState(null)
  const ativaRef = useRef(null)
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

  function comecar() {
    setPontos(0)
    setTempoRestante(DURACAO_JOGO)
    setAtiva(null)
    setPremioDado(false)
    setFase('jogando')
  }

  // Sorteia qual hábito "cresce" a cada ciclo
  useEffect(() => {
    if (fase !== 'jogando') return
    const intervalo = setInterval(() => {
      let proxima
      do {
        proxima = Math.floor(Math.random() * TAMANHO_GRADE)
      } while (proxima === ativaRef.current)
      ativaRef.current = proxima
      setAtiva({ indice: proxima, habito: HABITOS[Math.floor(Math.random() * HABITOS.length)] })
    }, CICLO_MS)
    return () => clearInterval(intervalo)
  }, [fase])

  // Cronômetro regressivo
  useEffect(() => {
    if (fase !== 'jogando') return
    const intervalo = setInterval(() => {
      setTempoRestante((t) => {
        if (t <= 1) {
          clearInterval(intervalo)
          setFase('fim')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(intervalo)
  }, [fase])

  // Premia ao terminar com pontuação suficiente
  useEffect(() => {
    if (fase === 'fim' && pontos >= META_PONTOS && !premioDado) {
      registrarJogoPoda().then(() => setPremioDado(true))
    }
  }, [fase])

  function tocar(indice) {
    if (fase !== 'jogando' || ativa?.indice !== indice) return
    if (ativa.habito.tipo === 'ruim') {
      setPontos((p) => p + PONTOS_POR_PODA)
      setAviso({ texto: ingles ? 'Pruned! 🌱' : 'Podado! 🌱', bom: true })
    } else {
      setPontos((p) => Math.max(0, p - PONTOS_PENALIDADE))
      setAviso({ texto: ingles ? 'This habit should be nurtured, not pruned!' : 'Esse hábito é para regar, não podar!', bom: false })
    }
    setTimeout(() => setAviso(null), 700)
    setAtiva(null)
    ativaRef.current = null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jogo-poda-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-3xl bg-creme p-5 outline-none">
        {/* Cabeçalho */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 id="jogo-poda-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Pruning Game' : 'Jogo da Poda'} ✂️🌿</h2>
            <p className="text-xs text-verde/60">
              Toque só nos hábitos que precisam ser podados. {META_PONTOS}+ pontos = +10 🌱
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            aria-label={ingles ? 'Close' : 'Fechar'}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-verde/10 text-verde hover:bg-verde/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Placar */}
        <div className="mb-3 flex items-center justify-between">
          <p className={`text-lg font-bold ${pontos >= META_PONTOS ? 'text-sage' : 'text-verde'}`}>{pontos} pts</p>
          <p className="flex items-center gap-1.5 text-sm font-bold text-verde">
            <Timer size={16} className={tempoRestante <= 10 ? 'text-red-500' : 'text-ouro'} />
            {tempoRestante}s
          </p>
        </div>

        {/* Área do jogo */}
        <div className="relative aspect-square rounded-2xl bg-white p-2.5">
          <div className="grid h-full grid-cols-3 gap-2">
            {Array.from({ length: TAMANHO_GRADE }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => tocar(i)}
                className={`flex items-center justify-center rounded-xl text-4xl transition-all duration-150 ${
                  ativa?.indice === i ? 'scale-105 bg-ouro-claro ring-2 ring-ouro' : 'bg-creme'
                }`}
              >
                {ativa?.indice === i ? ativa.habito.emoji : ''}
              </button>
            ))}
          </div>

          {/* Aviso de acerto/erro */}
          {aviso && (
            <div
              role="status"
              aria-live="polite"
              className={`absolute left-1/2 top-2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold ${
                aviso.bom ? 'bg-sage-claro text-verde' : 'bg-red-100 text-red-700'
              }`}
            >
              {aviso.texto}
            </div>
          )}

          {/* Tela inicial */}
          {fase === 'inicio' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-verde/85 text-center text-white backdrop-blur-sm">
              <p className="text-4xl">🌿✂️🍭</p>
              <p className="mt-3 max-w-[240px] text-sm text-white/85">
                {ingles ? (
                  <>
                    One habit appears at a time. Tap only the ones that should be <strong>pruned</strong> — leave
                    the ones that sustain you (water, sleep, walking...) alone.
                  </>
                ) : (
                  <>
                    Um hábito vai aparecer por vez. Toque só nos que precisam ser <strong>podados</strong> — deixe
                    os que sustentam (água, sono, caminhada...) em paz.
                  </>
                )}
              </p>
              <button
                type="button"
                onClick={comecar}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-verde"
              >
                <Play size={18} /> Jogar
              </button>
            </div>
          )}

          {/* Fim de jogo */}
          {fase === 'fim' && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-verde/85 text-center text-white backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <p className="text-4xl">{pontos >= META_PONTOS ? '🏆' : '🌱'}</p>
              <p className="mt-2 font-serif text-xl font-semibold italic">
                {pontos >= META_PONTOS ? (ingles ? 'Garden pruned!' : 'Jardim podado!') : (ingles ? 'Good pruning!' : 'Boa poda!')}
              </p>
              <p className="mt-1 text-sm text-white/80">{pontos} pontos</p>
              {premioDado && <p className="mt-2 font-bold text-ouro">+10 🌱 {ingles ? 'earned!' : 'ganhas!'}</p>}
              <button
                type="button"
                onClick={comecar}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-verde"
              >
                <RotateCcw size={16} /> Jogar de novo
              </button>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-[11px] text-verde/70">
          Podar certo vale +{PONTOS_POR_PODA} pontos. Regar por engano tira {PONTOS_PENALIDADE}.
        </p>
      </div>
    </div>
  )
}
