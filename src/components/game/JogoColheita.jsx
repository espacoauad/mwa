import { useEffect, useRef, useState } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Jogo da Colheita — combine 3 ou mais frutas iguais (estilo match-3)
// 300+ pontos ao fim das jogadas = +10 🌱 (1x por dia)

const FRUTAS = ['🍎', '🥦', '🥕', '🍇', '🍓', '🍋']
const N = 6
const JOGADAS_INICIAIS = 20
const META_PONTOS = 300

const aleatoria = () => FRUTAS[Math.floor(Math.random() * FRUTAS.length)]

// Gera um tabuleiro inicial sem combinações prontas
function gerarTabuleiro() {
  const b = []
  for (let i = 0; i < N * N; i++) {
    let f
    do {
      f = aleatoria()
    } while (
      (i % N >= 2 && b[i - 1] === f && b[i - 2] === f) ||
      (Math.floor(i / N) >= 2 && b[i - N] === f && b[i - 2 * N] === f)
    )
    b.push(f)
  }
  return b
}

// Retorna o conjunto de posições que formam trincas (ou mais)
function acharCombinacoes(b) {
  const achadas = new Set()
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N - 2; c++) {
      const i = r * N + c
      if (b[i] && b[i] === b[i + 1] && b[i] === b[i + 2]) {
        achadas.add(i); achadas.add(i + 1); achadas.add(i + 2)
      }
    }
  }
  for (let c = 0; c < N; c++) {
    for (let r = 0; r < N - 2; r++) {
      const i = r * N + c
      if (b[i] && b[i] === b[i + N] && b[i] === b[i + 2 * N]) {
        achadas.add(i); achadas.add(i + N); achadas.add(i + 2 * N)
      }
    }
  }
  return achadas
}

// Frutas caem para preencher os buracos; novas nascem no topo
function aplicarGravidade(b) {
  const novo = [...b]
  for (let c = 0; c < N; c++) {
    const coluna = []
    for (let r = N - 1; r >= 0; r--) {
      if (novo[r * N + c]) coluna.push(novo[r * N + c])
    }
    for (let r = N - 1; r >= 0; r--) {
      novo[r * N + c] = coluna[N - 1 - r] ?? aleatoria()
    }
  }
  return novo
}

const pausa = (ms) => new Promise((r) => setTimeout(r, ms))

export default function JogoColheita({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJoguinho } = useApp()
  const [tabuleiro, setTabuleiro] = useState(gerarTabuleiro)
  const [selecionada, setSelecionada] = useState(null)
  const [sumindo, setSumindo] = useState(new Set())
  const [pontos, setPontos] = useState(0)
  const [jogadas, setJogadas] = useState(JOGADAS_INICIAIS)
  const [processando, setProcessando] = useState(false)
  const [fim, setFim] = useState(false)
  const [premioDado, setPremioDado] = useState(false)
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

  const saoVizinhas = (a, b) => {
    const dr = Math.abs(Math.floor(a / N) - Math.floor(b / N))
    const dc = Math.abs((a % N) - (b % N))
    return dr + dc === 1
  }

  async function resolverCascatas(b) {
    let atual = b
    let ganhoTotal = 0
    while (true) {
      const combinacoes = acharCombinacoes(atual)
      if (combinacoes.size === 0) break
      ganhoTotal += combinacoes.size * 10
      setSumindo(combinacoes)
      await pausa(350)
      const limpo = atual.map((f, i) => (combinacoes.has(i) ? null : f))
      setSumindo(new Set())
      atual = aplicarGravidade(limpo)
      setTabuleiro(atual)
      await pausa(200)
    }
    return ganhoTotal
  }

  async function tocar(i) {
    if (processando || fim) return
    if (selecionada === null) {
      setSelecionada(i)
      return
    }
    if (selecionada === i) {
      setSelecionada(null)
      return
    }
    if (!saoVizinhas(selecionada, i)) {
      setSelecionada(i)
      return
    }

    // Troca as duas frutas
    setProcessando(true)
    const trocado = [...tabuleiro]
    ;[trocado[selecionada], trocado[i]] = [trocado[i], trocado[selecionada]]
    setTabuleiro(trocado)
    setSelecionada(null)
    await pausa(250)

    if (acharCombinacoes(trocado).size === 0) {
      // Troca inválida: desfaz
      setTabuleiro(tabuleiro)
      setProcessando(false)
      return
    }

    const ganho = await resolverCascatas(trocado)
    const novosPontos = pontos + ganho
    setPontos(novosPontos)
    const restantes = jogadas - 1
    setJogadas(restantes)

    if (restantes === 0) {
      setFim(true)
      if (novosPontos >= META_PONTOS) {
        await registrarJoguinho()
        setPremioDado(true)
      }
    }
    setProcessando(false)
  }

  function reiniciar() {
    setTabuleiro(gerarTabuleiro())
    setPontos(0)
    setJogadas(JOGADAS_INICIAIS)
    setFim(false)
    setPremioDado(false)
    setSelecionada(null)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jogo-colheita-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-3xl bg-creme p-5 outline-none">
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 id="jogo-colheita-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Harvest Game' : 'Jogo da Colheita'} 🍓</h2>
            <p className="text-xs text-verde/60">Combine 3 frutas iguais. {META_PONTOS}+ pontos = +10 🌱</p>
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
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-verde/80">{ingles ? 'Points' : 'Pontos'}</p>
            <p className={`text-2xl font-bold ${pontos >= META_PONTOS ? 'text-sage' : 'text-verde'}`}>{pontos}</p>
          </div>
          <div className="rounded-xl bg-white p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wide text-verde/80">{ingles ? 'Moves' : 'Jogadas'}</p>
            <p className={`text-2xl font-bold ${jogadas <= 5 ? 'text-red-500' : 'text-verde'}`}>{jogadas}</p>
          </div>
        </div>

        {/* Tabuleiro */}
        <div className="relative">
          <div className="grid grid-cols-6 gap-1.5 rounded-2xl bg-white p-2.5">
            {tabuleiro.map((fruta, i) => (
              <button
                key={i}
                type="button"
                onClick={() => tocar(i)}
                className={`flex aspect-square items-center justify-center rounded-lg text-2xl transition-all duration-200 motion-reduce:transition-none ${
                  selecionada === i
                    ? 'scale-110 bg-ouro-claro ring-2 ring-ouro'
                    : sumindo.has(i)
                      ? 'scale-0 opacity-0'
                      : 'bg-creme hover:bg-sage-claro/50'
                }`}
              >
                {fruta}
              </button>
            ))}
          </div>

          {/* Fim de jogo */}
          {fim && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-verde/85 backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <div className="p-6 text-center text-white">
                <p className="text-4xl">{pontos >= META_PONTOS ? '🏆' : '🌱'}</p>
                <p className="mt-2 font-serif text-xl font-semibold italic">
                  {pontos >= META_PONTOS ? (ingles ? 'Amazing harvest!' : 'Colheita incrível!') : (ingles ? 'Good try!' : 'Boa tentativa!')}
                </p>
                <p className="mt-1 text-sm text-white/80">{pontos} pontos</p>
                {premioDado && <p className="mt-2 font-bold text-ouro">+10 🌱 {ingles ? 'earned!' : 'ganhas!'}</p>}
                {!premioDado && pontos >= META_PONTOS && (
                  <p className="mt-2 text-xs text-white/60">{ingles ? '(game seeds already claimed today)' : '(sementes do joguinho já resgatadas hoje)'}</p>
                )}
                <button
                  type="button"
                  onClick={reiniciar}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-bold text-verde"
                >
                  <RotateCcw size={16} /> Jogar de novo
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-3 text-center text-[11px] text-verde/70">
          Toque numa fruta e depois na vizinha para trocá-las de lugar.
        </p>
      </div>
    </div>
  )
}
