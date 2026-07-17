import { useState } from 'react'
import { X, Sparkles, RotateCcw } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Jardim de Afirmações — vire as 8 sementes e colha uma mensagem positiva em cada uma.
// Ao revelar todas: +15 🌱 (1x por dia)

const AFIRMACOES = [
  { emoji: '🌱', pt: 'Você não precisa ser perfeita. Precisa ser constante.', en: 'You do not need to be perfect. You need to be consistent.' },
  { emoji: '🌿', pt: 'Cada escolha saudável de hoje é um presente para você amanhã.', en: 'Every healthy choice today is a gift to your future self.' },
  { emoji: '🌸', pt: 'Seu valor não é medido pelo número da balança.', en: 'Your worth is not measured by a number on the scale.' },
  { emoji: '🍃', pt: 'Progresso não é uma linha reta — e está tudo bem.', en: 'Progress is not a straight line — and that is okay.' },
  { emoji: '🌻', pt: 'Você já percorreu um caminho que muita gente nem começou.', en: 'You have already traveled a path many people have not begun.' },
  { emoji: '🌷', pt: 'Cuidar de si mesma também é uma forma de amor-próprio.', en: 'Taking care of yourself is also an act of self-love.' },
  { emoji: '🍀', pt: 'Um dia difícil não apaga todos os dias em que você se superou.', en: 'One difficult day does not erase all the days you overcame.' },
  { emoji: '🌼', pt: 'Você está construindo hábitos que vão durar a vida toda.', en: 'You are building habits that can last a lifetime.' },
]

export default function JogoMente({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoMente } = useApp()
  const [reveladas, setReveladas] = useState([])
  const [premioDado, setPremioDado] = useState(false)
  const [processando, setProcessando] = useState(false)

  const completo = reveladas.length === AFIRMACOES.length

  async function revelar(indice) {
    if (reveladas.includes(indice) || processando) return
    const novas = [...reveladas, indice]
    setReveladas(novas)

    if (novas.length === AFIRMACOES.length && !premioDado) {
      setProcessando(true)
      await registrarJogoMente()
      setPremioDado(true)
      setProcessando(false)
    }
  }

  function reiniciar() {
    setReveladas([])
    setPremioDado(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-creme p-5">
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Affirmation Garden' : 'Jardim de Afirmações'} 🌷</h2>
            <p className="text-xs text-verde/60">{ingles ? 'Tap each seed and harvest a message for yourself.' : 'Toque em cada semente e colha uma mensagem para você.'}</p>
          </div>
          <button type="button" onClick={onFechar} className="rounded-full bg-verde/10 p-2 text-verde hover:bg-verde/20">
            <X size={18} />
          </button>
        </div>

        <p className="mb-3 text-center text-sm font-bold text-verde">
          {reveladas.length} {ingles ? 'of' : 'de'} {AFIRMACOES.length} {ingles ? 'harvested' : 'colhidas'}
        </p>

        {/* Grade de cartas */}
        <div className="grid grid-cols-4 gap-2.5">
          {AFIRMACOES.map((a, i) => {
            const virada = reveladas.includes(i)
            return (
              <button
                key={i}
                type="button"
                onClick={() => revelar(i)}
                disabled={virada}
                className={`flex aspect-square items-center justify-center rounded-2xl text-3xl transition-all duration-300 ${
                  virada ? 'bg-sage-claro' : 'bg-verde hover:bg-verde/90 active:scale-95'
                }`}
              >
                {virada ? a.emoji : '🌰'}
              </button>
            )
          })}
        </div>

        {/* Mensagens reveladas */}
        {reveladas.length > 0 && (
          <div className="mt-4 max-h-40 space-y-2 overflow-y-auto">
            {reveladas
              .slice()
              .reverse()
              .map((i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-white p-3 text-left">
                  <span className="text-lg">{AFIRMACOES[i].emoji}</span>
                  <p className="text-sm font-medium leading-snug text-verde">{ingles ? AFIRMACOES[i].en : AFIRMACOES[i].pt}</p>
                </div>
              ))}
          </div>
        )}

        {/* Conclusão */}
        {completo && (
          <div className="mt-4 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-4 text-center">
            <Sparkles size={22} className="mx-auto text-verde" />
            <p className="mt-1 font-serif text-lg font-semibold italic text-verde">{ingles ? 'Garden completed!' : 'Jardim completo!'} 🌸</p>
            {premioDado && <p className="mt-1 text-sm font-bold text-verde">+15 🌱 {ingles ? 'earned!' : 'ganhas!'}</p>}
            <button
              type="button"
              onClick={reiniciar}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-verde px-5 py-2.5 text-sm font-bold text-white"
            >
              <RotateCcw size={15} /> {ingles ? 'Harvest again' : 'Colher de novo'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
