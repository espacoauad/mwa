import { useEffect, useRef, useState } from 'react'
import { X, Play, RotateCcw, Timer } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Jogo do Treino — toque no exercício que "acende" antes que o tempo passe.
// 300+ pontos = +10 🌱 (1x por dia)

const EXERCICIOS = ['🏃', '💪', '🤸', '🥊', '🚴', '🏋️', '⛹️', '🤾', '🏊']
const TAMANHO_GRADE = 9
const DURACAO_JOGO = 40 // segundos
const CICLO_MS = 850
const META_PONTOS = 300
const PONTOS_POR_ACERTO = 15

export default function JogoTreino({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoTreino } = useApp()
  const [fase, setFase] = useState('inicio') // inicio | jogando | fim
  const [ativa, setAtiva] = useState(null)
  const [pontos, setPontos] = useState(0)
  const [tempoRestante, setTempoRestante] = useState(DURACAO_JOGO)
  const [premioDado, setPremioDado] = useState(false)
  const ativaRef = useRef(null)

  function comecar() {
    setPontos(0)
    setTempoRestante(DURACAO_JOGO)
    setAtiva(null)
    setPremioDado(false)
    setFase('jogando')
  }

  // Sorteia qual célula "acende" a cada ciclo
  useEffect(() => {
    if (fase !== 'jogando') return
    const intervalo = setInterval(() => {
      let proxima
      do {
        proxima = Math.floor(Math.random() * TAMANHO_GRADE)
      } while (proxima === ativaRef.current)
      ativaRef.current = proxima
      setAtiva({ indice: proxima, emoji: EXERCICIOS[Math.floor(Math.random() * EXERCICIOS.length)] })
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
      registrarJogoTreino().then(() => setPremioDado(true))
    }
  }, [fase])

  function tocar(indice) {
    if (fase !== 'jogando' || ativa?.indice !== indice) return
    setPontos((p) => p + PONTOS_POR_ACERTO)
    setAtiva(null)
    ativaRef.current = null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-creme p-5">
        {/* Cabeçalho */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Workout Game' : 'Jogo do Treino'} 💪</h2>
            <p className="text-xs text-verde/60">Toque no exercício que acender. {META_PONTOS}+ pontos = +10 🌱</p>
          </div>
          <button type="button" onClick={onFechar} className="rounded-full bg-verde/10 p-2 text-verde hover:bg-verde/20">
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
                {ativa?.indice === i ? ativa.emoji : ''}
              </button>
            ))}
          </div>

          {/* Tela inicial */}
          {fase === 'inicio' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-verde/85 text-center text-white backdrop-blur-sm">
              <p className="text-4xl">🏃💪🤸</p>
              <p className="mt-3 max-w-[220px] text-sm text-white/85">
                Um exercício vai acender em um quadrado por vez. Toque nele rápido para pontuar!
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
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-verde/85 text-center text-white backdrop-blur-sm">
              <p className="text-4xl">{pontos >= META_PONTOS ? '🏆' : '💪'}</p>
              <p className="mt-2 font-serif text-xl font-semibold italic">
                {pontos >= META_PONTOS ? (ingles ? 'Workout complete!' : 'Treino completo!') : (ingles ? 'Good workout!' : 'Bom treino!')}
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

        <p className="mt-3 text-center text-[11px] text-verde/50">
          Cada acerto vale {PONTOS_POR_ACERTO} pontos. Fique de olho nos 9 quadrados!
        </p>
      </div>
    </div>
  )
}
