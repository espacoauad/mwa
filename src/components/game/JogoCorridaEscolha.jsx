// src/components/game/JogoCorridaEscolha.jsx
import { useEffect, useRef, useState } from 'react'
import { X, Play, RotateCcw, Star, Trophy } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { sortearItem } from '../../data/jogos/itensCorrida.js'
import {
  NUM_PISTAS,
  DURACAO_PARTIDA_MS,
  intervaloSpawn,
  duracaoQueda,
  pistaAleatoria,
  kcalDoItem,
  percentualSaudavel,
  estrelasCorrida,
  mensagemCorrida,
  mereceRecompensa,
} from '../../utils/jogos/corrida.js'
import { mesclarProgresso } from '../../utils/jogos/progresso.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'
import { carregarProgressoJogo, salvarResultadoJogo } from '../../lib/jogosProgresso.js'
import IngredienteSvg from './svg/IngredienteSvg.jsx'
import ItemNaoSaudavelSvg from './svg/ItemNaoSaudavelSvg.jsx'
import Avatar from './Avatar.jsx'

const JOGO_ID = 'corrida'
const PISTAS = Array.from({ length: NUM_PISTAS }, (_, i) => i)

// Um item caindo — controla sua própria animação (nasce no topo, anima até a
// altura do avatar) e avisa o componente pai se colidiu ou passou batido.
function ItemQueda({ entrada, pistaRef, onResolver }) {
  const [caindo, setCaindo] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCaindo(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  function aoTerminar() {
    onResolver(entrada, pistaRef.current === entrada.pista)
  }

  const Icone = entrada.item.tipo === 'saudavel' ? IngredienteSvg : ItemNaoSaudavelSvg

  return (
    <div
      className="pointer-events-none absolute flex justify-center"
      style={{
        left: `${entrada.pista * (100 / NUM_PISTAS)}%`,
        width: `${100 / NUM_PISTAS}%`,
        top: caindo ? '82%' : '-14%',
        transition: `top ${entrada.quedaMs}ms linear`,
      }}
      onTransitionEnd={aoTerminar}
    >
      <Icone id={entrada.item.svgId} tamanho={40} />
    </div>
  )
}

export default function JogoCorridaEscolha({ onFechar }) {
  const { ingles } = useIdioma()
  const { userId, game, registrarJogoCorrida } = useApp()

  const [fase, setFase] = useState('intro') // 'intro' | 'rodando' | 'resultado'
  const [pista, setPista] = useState(1)
  const [itensNaTela, setItensNaTela] = useState([])
  const [kcalSaudavel, setKcalSaudavel] = useState(0)
  const [kcalNaoSaudavel, setKcalNaoSaudavel] = useState(0)
  const [itensNaoSaudaveisComidos, setItensNaoSaudaveisComidos] = useState(0)
  const [beliscado, setBeliscado] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [barraAnimando, setBarraAnimando] = useState(false)
  const [premioDado, setPremioDado] = useState(false)
  const [recorde, setRecorde] = useState(null)

  const dialogRef = useRef(null)
  const pistaRef = useRef(1)
  const rodandoRef = useRef(false)
  const spawnTimeoutRef = useRef(null)
  const fimTimeoutRef = useRef(null)
  const feedbackTimeoutRef = useRef(null)
  const beliscadoTimeoutRef = useRef(null)
  const inicioRef = useRef(0)
  const proximoIdRef = useRef(0)
  const pistaItemAnteriorRef = useRef(null)
  const toqueInicioRef = useRef(null)
  const feedbackIdRef = useRef(0)

  const kcalTotal = kcalSaudavel + kcalNaoSaudavel
  const percentual = percentualSaudavel(kcalSaudavel, kcalNaoSaudavel)
  const estrelas = estrelasCorrida(percentual)
  const mensagem = mensagemCorrida(percentual)

  function fechar() {
    pararTimers()
    onFechar?.()
  }

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') fechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    pistaRef.current = pista
  }, [pista])

  // Carrega o recorde salvo (melhor % saudável já alcançado)
  useEffect(() => {
    let ativo = true
    carregarProgressoJogo(userId, JOGO_ID).then((linhas) => {
      if (ativo) setRecorde(linhas[0] ?? null)
    })
    return () => {
      ativo = false
    }
  }, [userId])

  // Setas ← → trocam de pista enquanto a corrida está rolando
  useEffect(() => {
    if (fase !== 'rodando') return
    function aoTeclar(e) {
      if (e.key === 'ArrowLeft') irParaPista(pistaRef.current - 1)
      if (e.key === 'ArrowRight') irParaPista(pistaRef.current + 1)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fase])

  // Barra de tempo: nasce cheia e anima até zero ao longo da partida
  useEffect(() => {
    if (fase !== 'rodando') {
      setBarraAnimando(false)
      return
    }
    setBarraAnimando(false)
    const frame = requestAnimationFrame(() => setBarraAnimando(true))
    return () => cancelAnimationFrame(frame)
  }, [fase])

  // Ao terminar: salva recorde e concede a recompensa diária (se elegível)
  useEffect(() => {
    if (fase !== 'resultado') return
    salvarResultadoJogo(userId, JOGO_ID, '', { pontuacao: percentual, estrelas }, recorde).then((salvo) => {
      setRecorde(salvo ?? mesclarProgresso(recorde, { pontuacao: percentual, estrelas }))
    })
    if (mereceRecompensa(percentual) && !premioDado) {
      tentarRecompensa(registrarJogoCorrida).then(setPremioDado)
    }
  }, [fase])

  useEffect(() => () => pararTimers(), [])

  function pararTimers() {
    rodandoRef.current = false
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current)
    if (fimTimeoutRef.current) clearTimeout(fimTimeoutRef.current)
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    if (beliscadoTimeoutRef.current) clearTimeout(beliscadoTimeoutRef.current)
  }

  function criarItem(decorrido) {
    const pistaEscolhida = pistaAleatoria(pistaItemAnteriorRef.current)
    pistaItemAnteriorRef.current = pistaEscolhida
    const entrada = {
      id: ++proximoIdRef.current,
      item: sortearItem(),
      pista: pistaEscolhida,
      quedaMs: duracaoQueda(decorrido),
    }
    setItensNaTela((atuais) => [...atuais, entrada])
  }

  function agendarProximoSpawn() {
    if (!rodandoRef.current) return
    const decorrido = Date.now() - inicioRef.current
    if (decorrido >= DURACAO_PARTIDA_MS) return
    criarItem(decorrido)
    spawnTimeoutRef.current = setTimeout(agendarProximoSpawn, intervaloSpawn(decorrido))
  }

  function terminarPartida() {
    pararTimers()
    setItensNaTela([])
    setFase('resultado')
  }

  function iniciarPartida() {
    pararTimers()
    setPista(1)
    pistaRef.current = 1
    pistaItemAnteriorRef.current = null
    setItensNaTela([])
    setKcalSaudavel(0)
    setKcalNaoSaudavel(0)
    setItensNaoSaudaveisComidos(0)
    setPremioDado(false)
    setFase('rodando')
    inicioRef.current = Date.now()
    rodandoRef.current = true
    agendarProximoSpawn()
    fimTimeoutRef.current = setTimeout(terminarPartida, DURACAO_PARTIDA_MS)
  }

  function mostrarFeedback(texto, tipo) {
    const id = ++feedbackIdRef.current
    setFeedback({ id, texto, tipo })
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current)
    feedbackTimeoutRef.current = setTimeout(() => setFeedback((f) => (f?.id === id ? null : f)), 500)
  }

  function resolverChegada(entrada, colidiu) {
    setItensNaTela((atuais) => atuais.filter((e) => e.id !== entrada.id))
    if (!colidiu) return
    const kcal = kcalDoItem(entrada.item)
    if (entrada.item.tipo === 'saudavel') {
      setKcalSaudavel((v) => v + kcal)
      mostrarFeedback('+', 'saudavel')
    } else {
      setKcalNaoSaudavel((v) => v + kcal)
      setItensNaoSaudaveisComidos((v) => v + 1)
      mostrarFeedback('!', 'naoSaudavel')
      setBeliscado(true)
      if (beliscadoTimeoutRef.current) clearTimeout(beliscadoTimeoutRef.current)
      beliscadoTimeoutRef.current = setTimeout(() => setBeliscado(false), 300)
    }
  }

  function irParaPista(indice) {
    setPista(Math.min(NUM_PISTAS - 1, Math.max(0, indice)))
  }

  function aoTocarInicio(e) {
    toqueInicioRef.current = e.touches[0].clientX
  }

  function aoTocarFim(e) {
    if (toqueInicioRef.current === null) return
    const deltaX = e.changedTouches[0].clientX - toqueInicioRef.current
    toqueInicioRef.current = null
    if (Math.abs(deltaX) < 40) return
    irParaPista(pistaRef.current + (deltaX > 0 ? 1 : -1))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jogo-corrida-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-3xl bg-creme p-5 outline-none">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="jogo-corrida-titulo" className="font-serif text-lg font-semibold italic text-verde">
            {ingles ? 'The Choice Run' : 'Corrida da Escolha'} 🏃
          </h2>
          <button
            type="button"
            onClick={fechar}
            aria-label={ingles ? 'Close' : 'Fechar'}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-verde/10 text-verde hover:bg-verde/20"
          >
            <X size={18} />
          </button>
        </div>

        {fase === 'intro' && (
          <div className="text-center">
            <p className="text-sm text-verde/80">
              {ingles
                ? 'Dodge the unhealthy foods and catch the healthy ones as you run down the trail.'
                : 'Desvie da comida não saudável e pegue a saudável enquanto corre pela trilha.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <IngredienteSvg id="banana" tamanho={36} />
                <span className="text-[10px] font-semibold text-verde/70">{ingles ? 'catch' : 'pega'}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ItemNaoSaudavelSvg id="hamburguer" tamanho={36} />
                <span className="text-[10px] font-semibold text-verde/70">{ingles ? 'dodge' : 'desvia'}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-verde/60">
              {ingles ? 'Swipe, use ← → or tap a lane to move.' : 'Arraste, use ← → ou toque numa pista para se mover.'}
            </p>
            {recorde && (
              <p className="mt-2 text-xs font-semibold text-ouro">
                {ingles ? `Your record: ${recorde.melhor_pontuacao}% healthy` : `Seu recorde: ${recorde.melhor_pontuacao}% saudável`}
              </p>
            )}
            <button
              type="button"
              onClick={iniciarPartida}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3 font-bold text-white active:scale-95"
            >
              <Play size={18} /> {ingles ? 'Start run' : 'Começar corrida'}
            </button>
          </div>
        )}

        {fase === 'rodando' && (
          <>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full bg-ouro"
                style={{
                  width: barraAnimando ? '0%' : '100%',
                  transition: barraAnimando ? `width ${DURACAO_PARTIDA_MS}ms linear` : 'none',
                }}
              />
            </div>

            <div
              className="relative h-[420px] overflow-hidden rounded-2xl bg-gradient-to-b from-sage-claro/50 to-creme"
              onTouchStart={aoTocarInicio}
              onTouchEnd={aoTocarFim}
            >
              <div className="pointer-events-none absolute inset-0 flex">
                {PISTAS.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => irParaPista(i)}
                    aria-label={ingles ? `Lane ${i + 1}` : `Pista ${i + 1}`}
                    className="pointer-events-auto h-full flex-1 border-l border-white/30 first:border-l-0"
                  />
                ))}
              </div>

              {itensNaTela.map((entrada) => (
                <ItemQueda key={entrada.id} entrada={entrada} pistaRef={pistaRef} onResolver={resolverChegada} />
              ))}

              <div
                className="absolute bottom-3 transition-[left] duration-150 ease-out"
                style={{ left: `${(pista + 0.5) * (100 / NUM_PISTAS)}%`, transform: 'translateX(-50%)' }}
              >
                <div className={beliscado ? 'mwa-corrida-belisco' : ''}>
                  <Avatar avatar={game?.avatar} tamanho="md" />
                </div>
                {feedback && (
                  <span
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 text-lg font-bold ${
                      feedback.tipo === 'saudavel' ? 'text-verde-escuro' : 'text-[#B0563C]'
                    }`}
                  >
                    {feedback.texto}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-2 text-center text-[11px] text-verde/60">
              {ingles ? 'Swipe, use ← → or tap a lane.' : 'Arraste, use ← → ou toque numa pista.'}
            </p>
          </>
        )}

        {fase === 'resultado' && (
          <div className="text-center" role="status" aria-live="polite">
            <div className="relative mx-auto mb-2 flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-sage-claro" aria-hidden="true" />
              <Trophy size={30} className="relative text-verde" strokeWidth={1.5} aria-hidden="true" />
            </div>

            <div
              className="flex justify-center gap-1.5"
              aria-label={`${estrelas} ${ingles ? 'of 3 stars' : 'de 3 estrelas'}`}
            >
              {[0, 1, 2].map((i) => (
                <Star key={i} size={24} className={i < estrelas ? 'fill-ouro text-ouro' : 'text-cinza'} aria-hidden="true" />
              ))}
            </div>

            <div className="mt-4 h-4 overflow-hidden rounded-full bg-cinza">
              {kcalTotal > 0 && (
                <div className="flex h-full">
                  <div className="h-full bg-verde-escuro" style={{ width: `${(kcalSaudavel / kcalTotal) * 100}%` }} />
                  <div className="h-full bg-[#B0563C]" style={{ width: `${(kcalNaoSaudavel / kcalTotal) * 100}%` }} />
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="font-semibold text-verde-escuro">
                {Math.round(kcalSaudavel)} kcal {ingles ? 'healthy' : 'saudável'}
              </span>
              <span className="font-semibold text-[#B0563C]">
                {Math.round(kcalNaoSaudavel)} kcal {ingles ? 'unhealthy' : 'não saudável'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-verde/70">{ingles ? 'You ate' : 'Você comeu'}</p>
                <p className="mt-1 text-xl font-bold text-verde">{Math.round(kcalTotal)} kcal</p>
              </div>
              <div className="rounded-xl bg-sage-claro/50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-verde/70">
                  {ingles ? 'With a perfect dodge' : 'Com desvio perfeito'}
                </p>
                <p className="mt-1 text-xl font-bold text-verde">{Math.round(kcalSaudavel)} kcal</p>
              </div>
            </div>

            {kcalTotal === 0 ? (
              <p className="mx-auto mt-2 max-w-[280px] text-sm leading-relaxed text-verde/75">
                {ingles
                  ? "You didn't catch anything this run — not even the healthy items. Try again and go for the fruits and veggies!"
                  : 'Você não comeu nada nessa corrida — nem o saudável, nem o resto. Bora tentar pegar as frutas e verduras na próxima?'}
              </p>
            ) : (
              <>
                {itensNaoSaudaveisComidos > 0 ? (
                  <p className="mt-2 text-xs font-semibold text-[#B0563C]">
                    {ingles
                      ? `+${Math.round(kcalNaoSaudavel)} kcal for not dodging ${itensNaoSaudaveisComidos} item${itensNaoSaudaveisComidos > 1 ? 's' : ''}`
                      : `+${Math.round(kcalNaoSaudavel)} kcal por não desviar de ${itensNaoSaudaveisComidos} ${itensNaoSaudaveisComidos > 1 ? 'itens' : 'item'}`}
                  </p>
                ) : (
                  <p className="mt-2 text-xs font-semibold text-verde-escuro">
                    {ingles ? 'Perfect dodge — no unhealthy item eaten!' : 'Desvio perfeito — nenhum item não saudável comido!'}
                  </p>
                )}

                <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-verde/75">
                  {ingles ? mensagem.en : mensagem.pt}
                </p>
              </>
            )}

            {recorde && (
              <p className="mt-2 text-xs font-semibold text-ouro">
                {ingles ? `Your record: ${recorde.melhor_pontuacao}% healthy` : `Seu recorde: ${recorde.melhor_pontuacao}% saudável`}
              </p>
            )}

            {premioDado && <p className="mt-2 font-bold text-ouro">+10 🌱 {ingles ? 'earned!' : 'ganhas!'}</p>}
            {!premioDado && mereceRecompensa(percentual) && (
              <p className="mt-2 text-xs text-verde/60">{ingles ? '(seeds already claimed today)' : '(sementes já resgatadas hoje)'}</p>
            )}

            <button
              type="button"
              onClick={iniciarPartida}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3 font-bold text-white active:scale-95"
            >
              <RotateCcw size={16} /> {ingles ? 'Play again' : 'Jogar de novo'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
