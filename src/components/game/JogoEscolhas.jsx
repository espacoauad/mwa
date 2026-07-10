import { useEffect, useRef, useState } from 'react'
import { X, Heart, Play, RotateCcw } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Avatar from './Avatar.jsx'

// Jogo das Escolhas — o avatar da pessoa apanha comida saudável e desvia das besteiras.
// 300+ pontos = +10 🌱 (1x por dia)

const SAUDAVEIS = ['🍎', '🥦', '🍓', '🥕', '🍇', '💧']
const BESTEIRAS = ['🍩', '🍟', '🍔', '🥤', '🍰']
const META_PONTOS = 300
const VIDAS_INICIAIS = 3
const TICK_MS = 50

let proximoId = 1

export default function JogoEscolhas({ onFechar }) {
  const { game, registrarJogoAvatar } = useApp()
  const [fase, setFase] = useState('inicio') // inicio | jogando | fim
  const [itens, setItens] = useState([])
  const [avatarX, setAvatarX] = useState(50)
  const [pontos, setPontos] = useState(0)
  const [vidas, setVidas] = useState(VIDAS_INICIAIS)
  const [premioDado, setPremioDado] = useState(false)
  const areaRef = useRef(null)
  const avatarXRef = useRef(50)
  const ticksRef = useRef(0)

  avatarXRef.current = avatarX

  function comecar() {
    setItens([])
    setPontos(0)
    setVidas(VIDAS_INICIAIS)
    setPremioDado(false)
    ticksRef.current = 0
    setFase('jogando')
  }

  // Loop do jogo
  useEffect(() => {
    if (fase !== 'jogando') return

    const intervalo = setInterval(() => {
      ticksRef.current += 1
      const tick = ticksRef.current
      // Fica mais rápido com o tempo (até um limite)
      const velocidade = Math.min(1.4 + tick / 600, 2.8)

      setItens((atuais) => {
        let novos = atuais.map((it) => ({ ...it, y: it.y + velocidade }))

        // Nasce um item novo a cada ~0,65s (mais frequente com o tempo)
        const intervaloNascimento = Math.max(13 - Math.floor(tick / 200), 8)
        if (tick % intervaloNascimento === 0) {
          const saudavel = Math.random() < 0.6
          const lista = saudavel ? SAUDAVEIS : BESTEIRAS
          novos.push({
            id: proximoId++,
            x: 8 + Math.random() * 84,
            y: -6,
            emoji: lista[Math.floor(Math.random() * lista.length)],
            saudavel,
          })
        }

        // Colisões com o avatar (zona de baixo)
        const pegos = []
        novos = novos.filter((it) => {
          const naZona = it.y >= 80 && it.y <= 94
          const encostou = Math.abs(it.x - avatarXRef.current) < 11
          if (naZona && encostou) {
            pegos.push(it)
            return false
          }
          return it.y < 105
        })

        if (pegos.length > 0) {
          const bons = pegos.filter((p) => p.saudavel).length
          const ruins = pegos.length - bons
          if (bons > 0) setPontos((p) => p + bons * 10)
          if (ruins > 0) {
            setVidas((v) => {
              const restam = v - ruins
              if (restam <= 0) setFase('fim')
              return Math.max(0, restam)
            })
          }
        }

        return novos
      })
    }, TICK_MS)

    return () => clearInterval(intervalo)
  }, [fase])

  // Premia ao terminar com pontuação suficiente
  useEffect(() => {
    if (fase === 'fim' && pontos >= META_PONTOS && !premioDado) {
      registrarJogoAvatar().then(() => setPremioDado(true))
    }
  }, [fase])

  // Arrastar o dedo/mouse move o avatar
  function mover(e) {
    if (fase !== 'jogando' || !areaRef.current) return
    const rect = areaRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const pct = ((clientX - rect.left) / rect.width) * 100
    setAvatarX(Math.max(6, Math.min(94, pct)))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-creme p-5">
        {/* Cabeçalho */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-semibold italic text-verde">Jogo das Escolhas 🥗</h2>
            <p className="text-xs text-verde/60">
              Apanhe o saudável, desvie da besteira. {META_PONTOS}+ pontos = +10 🌱
            </p>
          </div>
          <button type="button" onClick={onFechar} className="rounded-full bg-verde/10 p-2 text-verde hover:bg-verde/20">
            <X size={18} />
          </button>
        </div>

        {/* Placar */}
        <div className="mb-3 flex items-center justify-between">
          <p className={`text-lg font-bold ${pontos >= META_PONTOS ? 'text-sage' : 'text-verde'}`}>
            {pontos} pts
          </p>
          <div className="flex gap-1">
            {Array.from({ length: VIDAS_INICIAIS }).map((_, i) => (
              <Heart
                key={i}
                size={20}
                className={i < vidas ? 'fill-red-400 text-red-400' : 'fill-cinza text-cinza'}
              />
            ))}
          </div>
        </div>

        {/* Área do jogo */}
        <div
          ref={areaRef}
          onPointerMove={mover}
          onTouchMove={mover}
          className="relative h-96 touch-none select-none overflow-hidden rounded-2xl bg-gradient-to-b from-sage-claro/40 to-white"
        >
          {/* Itens caindo */}
          {itens.map((it) => (
            <span
              key={it.id}
              className="absolute text-2xl"
              style={{ left: `${it.x}%`, top: `${it.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              {it.emoji}
            </span>
          ))}

          {/* Avatar da pessoa */}
          {game && (
            <div
              className="absolute bottom-2 transition-none"
              style={{ left: `${avatarX}%`, transform: 'translateX(-50%)' }}
            >
              <Avatar avatar={game.avatar} tamanho="sm" />
            </div>
          )}

          {/* Tela inicial */}
          {fase === 'inicio' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-verde/80 text-center text-white backdrop-blur-sm">
              {game && <Avatar avatar={game.avatar} tamanho="lg" />}
              <p className="mt-4 max-w-[220px] text-sm text-white/85">
                Arraste o dedo para mover o seu avatar. Apanhe 🍎 🥦 🍓 e desvie de 🍩 🍟 🍔!
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
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-verde/85 text-center text-white backdrop-blur-sm">
              <p className="text-4xl">{pontos >= META_PONTOS ? '🏆' : '💪'}</p>
              <p className="mt-2 font-serif text-xl font-semibold italic">
                {pontos >= META_PONTOS ? 'Escolhas perfeitas!' : 'Quase lá!'}
              </p>
              <p className="mt-1 text-sm text-white/80">{pontos} pontos</p>
              {premioDado && <p className="mt-2 font-bold text-ouro">+10 🌱 ganhas!</p>}
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
          Saudável = +10 pontos · Besteira = perde uma vida ❤️
        </p>
      </div>
    </div>
  )
}
