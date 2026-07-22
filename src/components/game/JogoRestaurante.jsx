import { useEffect, useRef, useState } from 'react'
import { X, Play, RotateCcw, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Avatar from './Avatar.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Restaurante Saudável — a pessoa é a chef e monta pratos para os clientes,
// escolhendo opções saudáveis em cada etapa. 300+ pontos = +10 🌱 (1x por dia)

const META_PONTOS = 300
const TOTAL_CLIENTES = 5
const PONTOS_ITEM = 20
const BONUS_PRATO_PERFEITO = 20

const CATEGORIAS = [
  {
    id: 'proteina',
    nome: 'Proteína',
    pergunta: 'Qual proteína vai no prato?',
    opcoes: [
      { emoji: '🍗', nome: 'Frango grelhado', saudavel: true },
      { emoji: '🐟', nome: 'Peixe assado', saudavel: true },
      { emoji: '🥚', nome: 'Ovos mexidos', saudavel: true },
      { emoji: '🍤', nome: 'Camarão empanado', saudavel: false },
      { emoji: '🥓', nome: 'Bacon frito', saudavel: false },
      { emoji: '🌭', nome: 'Salsicha', saudavel: false },
    ],
  },
  {
    id: 'vegetal',
    nome: 'Vegetais',
    pergunta: 'E os vegetais?',
    opcoes: [
      { emoji: '🥗', nome: 'Salada verde', saudavel: true },
      { emoji: '🥦', nome: 'Brócolis no vapor', saudavel: true },
      { emoji: '🥕', nome: 'Cenoura ralada', saudavel: true },
      { emoji: '🍅', nome: 'Tomate fresco', saudavel: true },
      { emoji: '🧅', nome: 'Cebola empanada', saudavel: false },
      { emoji: '🍟', nome: 'Batata frita', saudavel: false },
    ],
  },
  {
    id: 'carbo',
    nome: 'Acompanhamento',
    pergunta: 'Qual acompanhamento?',
    opcoes: [
      { emoji: '🍠', nome: 'Batata-doce', saudavel: true },
      { emoji: '🍚', nome: 'Arroz integral', saudavel: true },
      { emoji: '🫘', nome: 'Feijão', saudavel: true },
      { emoji: '🍕', nome: 'Pizza', saudavel: false },
      { emoji: '🥐', nome: 'Croissant', saudavel: false },
      { emoji: '🍔', nome: 'X-burguer', saudavel: false },
    ],
  },
  {
    id: 'bebida',
    nome: 'Bebida',
    pergunta: 'E para beber?',
    opcoes: [
      { emoji: '💧', nome: 'Água', saudavel: true },
      { emoji: '🧃', nome: 'Suco natural', saudavel: true },
      { emoji: '🍵', nome: 'Chá gelado', saudavel: true },
      { emoji: '🥤', nome: 'Refrigerante', saudavel: false },
      { emoji: '🧋', nome: 'Milkshake', saudavel: false },
      { emoji: '🍺', nome: 'Cerveja', saudavel: false },
    ],
  },
]

const CLIENTES = [
  { emoji: '👩', nome: 'Dona Márcia', fala: 'Quero um prato leve e colorido!' },
  { emoji: '👨', nome: 'Seu Carlos', fala: 'Preciso de energia para o treino!' },
  { emoji: '👵', nome: 'Vó Lúcia', fala: 'Capriche na saúde, minha filha!' },
  { emoji: '👧', nome: 'Bia', fala: 'Quero comer bem gostoso e saudável!' },
  { emoji: '🧔', nome: 'Rafael', fala: 'Estou cuidando da alimentação, hein!' },
  { emoji: '👩‍🦰', nome: 'Paula', fala: 'Monta um prato nutritivo pra mim?' },
  { emoji: '👴', nome: 'Seu Antônio', fala: 'O médico pediu comida de verdade!' },
  { emoji: '🧕', nome: 'Samira', fala: 'Surpreenda-me com algo bem fresquinho!' },
]

function embaralhar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// 3 opções por etapa, garantindo pelo menos 1 saudável e 1 besteira
function sortearOpcoes(categoria) {
  const saudaveis = embaralhar(categoria.opcoes.filter((o) => o.saudavel))
  const besteiras = embaralhar(categoria.opcoes.filter((o) => !o.saudavel))
  const resto = embaralhar([...saudaveis.slice(1), ...besteiras.slice(1)]).slice(0, 1)
  return embaralhar([saudaveis[0], besteiras[0], ...resto])
}

function sortearClientes() {
  return embaralhar(CLIENTES).slice(0, TOTAL_CLIENTES)
}

function estrelasDoPrato(acertos) {
  if (acertos === CATEGORIAS.length) return 3
  if (acertos === CATEGORIAS.length - 1) return 2
  if (acertos >= CATEGORIAS.length - 2) return 1
  return 0
}

export default function JogoRestaurante({ onFechar }) {
  const { ingles } = useIdioma()
  const { game, registrarJogoRestaurante } = useApp()
  const [fase, setFase] = useState('inicio') // inicio | montando | reacao | fim
  const [clientes, setClientes] = useState([])
  const [clienteIdx, setClienteIdx] = useState(0)
  const [etapa, setEtapa] = useState(0)
  const [opcoes, setOpcoes] = useState([])
  const [prato, setPrato] = useState([])
  const [pontos, setPontos] = useState(0)
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

  function comecar() {
    setClientes(sortearClientes())
    setClienteIdx(0)
    setEtapa(0)
    setOpcoes(sortearOpcoes(CATEGORIAS[0]))
    setPrato([])
    setPontos(0)
    setPremioDado(false)
    setFase('montando')
  }

  function escolher(opcao) {
    const novoPrato = [...prato, opcao]
    if (opcao.saudavel) setPontos((p) => p + PONTOS_ITEM)

    if (novoPrato.length < CATEGORIAS.length) {
      setPrato(novoPrato)
      setEtapa(etapa + 1)
      setOpcoes(sortearOpcoes(CATEGORIAS[etapa + 1]))
      return
    }

    // Prato completo: bônus se tudo for saudável, depois mostra a reação
    if (novoPrato.every((o) => o.saudavel)) setPontos((p) => p + BONUS_PRATO_PERFEITO)
    setPrato(novoPrato)
    setFase('reacao')
  }

  function proximoCliente() {
    if (clienteIdx + 1 >= TOTAL_CLIENTES) {
      setFase('fim')
      return
    }
    setClienteIdx(clienteIdx + 1)
    setEtapa(0)
    setOpcoes(sortearOpcoes(CATEGORIAS[0]))
    setPrato([])
    setFase('montando')
  }

  // Premia ao terminar com pontuação suficiente
  useEffect(() => {
    if (fase === 'fim' && pontos >= META_PONTOS && !premioDado) {
      registrarJogoRestaurante().then(() => setPremioDado(true))
    }
  }, [fase])

  const cliente = clientes[clienteIdx]
  const categoria = CATEGORIAS[etapa]
  const acertos = prato.filter((o) => o.saudavel).length
  const estrelas = estrelasDoPrato(acertos)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="jogo-restaurante-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-sm rounded-3xl bg-creme p-5 outline-none">
        {/* Cabeçalho */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 id="jogo-restaurante-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Healthy Restaurant' : 'Restaurante Saudável'} 🍽️</h2>
            <p className="text-xs text-verde/60">
              Monte pratos saudáveis para os clientes. {META_PONTOS}+ pontos = +10 🌱
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
          {fase !== 'inicio' && fase !== 'fim' && (
            <p className="text-xs font-semibold text-verde/60">
              Cliente {clienteIdx + 1} de {TOTAL_CLIENTES}
            </p>
          )}
        </div>

        {/* Área do jogo */}
        <div className="relative min-h-96 select-none overflow-hidden rounded-2xl bg-gradient-to-b from-sage-claro/40 to-white p-4">
          {/* Tela inicial */}
          {fase === 'inicio' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-verde/80 text-center text-white backdrop-blur-sm">
              {game && <Avatar avatar={game.avatar} tamanho="lg" />}
              <p className="mt-2 text-2xl">👩‍🍳</p>
              <p className="mt-2 max-w-[230px] text-sm text-white/85">
                Você é a chef! Atenda {TOTAL_CLIENTES} clientes montando pratos saudáveis. Cada escolha boa vale +
                {PONTOS_ITEM} pontos, e prato perfeito ganha bônus!
              </p>
              <button
                type="button"
                onClick={comecar}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-verde"
              >
                <Play size={18} /> Abrir o restaurante
              </button>
            </div>
          )}

          {/* Montagem do prato */}
          {fase === 'montando' && cliente && (
            <div className="flex flex-col">
              {/* Cliente e pedido */}
              <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3">
                <span className="text-3xl">{cliente.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-verde">{cliente.nome}</p>
                  <p className="text-xs italic text-verde/70">“{cliente.fala}”</p>
                </div>
              </div>

              {/* Prato em montagem */}
              <div className="mt-3 flex items-center justify-center gap-1 rounded-xl bg-white/60 py-2 text-2xl">
                <span className="mr-1 text-lg">🍽️</span>
                {CATEGORIAS.map((c, i) => (
                  <span
                    key={c.id}
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      prato[i] ? 'bg-sage-claro' : 'border-2 border-dashed border-sage/40 text-xs text-verde/30'
                    }`}
                  >
                    {prato[i] ? prato[i].emoji : ''}
                  </span>
                ))}
              </div>

              {/* Etapa atual */}
              <p className="mt-4 text-center text-sm font-semibold text-verde">{categoria.pergunta}</p>
              <div className="mt-2 flex flex-col gap-2">
                {opcoes.map((o) => (
                  <button
                    key={o.nome}
                    type="button"
                    onClick={() => escolher(o)}
                    className="flex items-center gap-3 rounded-xl border-2 border-sage/25 bg-white px-4 py-3 text-left transition-all hover:border-sage active:scale-[0.98]"
                  >
                    <span className="text-2xl">{o.emoji}</span>
                    <span className="text-sm font-semibold text-verde">{o.nome}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reação do cliente */}
          {fase === 'reacao' && cliente && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-verde/85 text-center text-white backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <p className="text-4xl">{estrelas >= 2 ? '😋' : estrelas === 1 ? '🙂' : '😕'}</p>
              <p className="mt-2 font-serif text-lg font-semibold italic">
                {estrelas === 3
                  ? `${cliente.nome} amou o prato!`
                  : estrelas === 2
                    ? `${cliente.nome} gostou bastante!`
                    : estrelas === 1
                      ? `${cliente.nome} achou razoável...`
                      : `${cliente.nome} não gostou muito...`}
              </p>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star key={i} size={24} className={i < estrelas ? 'fill-ouro text-ouro' : 'text-white/30'} />
                ))}
              </div>
              <div className="mt-3 flex gap-1 text-2xl">
                {prato.map((o) => (
                  <span key={o.nome}>{o.emoji}</span>
                ))}
              </div>
              {acertos === CATEGORIAS.length && (
                <p className="mt-2 text-sm font-bold text-ouro">Prato perfeito! +{BONUS_PRATO_PERFEITO} de bônus 🎉</p>
              )}
              <button
                type="button"
                onClick={proximoCliente}
                className="mt-4 rounded-full bg-white px-6 py-2.5 font-bold text-verde"
              >
                {clienteIdx + 1 >= TOTAL_CLIENTES ? (ingles ? 'View result' : 'Ver resultado') : (ingles ? 'Next customer →' : 'Próximo cliente →')}
              </button>
            </div>
          )}

          {/* Fim de jogo */}
          {fase === 'fim' && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-verde/85 text-center text-white backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <p className="text-4xl">{pontos >= META_PONTOS ? '🏆' : '👩‍🍳'}</p>
              <p className="mt-2 font-serif text-xl font-semibold italic">
                {pontos >= META_PONTOS ? (ingles ? 'Five-star restaurant!' : 'Restaurante 5 estrelas!') : (ingles ? 'The menu can improve!' : 'O cardápio pode melhorar!')}
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
          Escolha saudável = +{PONTOS_ITEM} pontos · Prato perfeito = +{BONUS_PRATO_PERFEITO} de bônus ⭐
        </p>
      </div>
    </div>
  )
}
