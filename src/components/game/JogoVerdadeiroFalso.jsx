import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, X as XIcon, HelpCircle, ChevronRight, Lightbulb } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { PERGUNTAS } from '../../data/jogos/perguntas.js'
import { sortearRodada } from '../../utils/jogos/rodada.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'
import MolduraJogo from './MolduraJogo.jsx'

// Verdadeiro, Falso ou Depende — evolução do antigo Jogo do Plantio.
// Banco rotativo, opção "depende" e explicação após CADA resposta:
// errar aqui é parte do aprendizado, não motivo para repetir até acertar.

const POR_RODADA = 8
const CHAVE_VISTOS = 'mwa_vf_vistos'

const OPCOES = [
  { id: 'v', pt: 'Verdadeiro', en: 'True', Icone: Check, cor: 'bg-sage-claro text-verde border-sage' },
  { id: 'f', pt: 'Falso', en: 'False', Icone: XIcon, cor: 'bg-red-50 text-red-700 border-red-300' },
  { id: 'depende', pt: 'Depende', en: 'It depends', Icone: HelpCircle, cor: 'bg-ouro-claro text-verde border-ouro' },
]

function lerVistos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_VISTOS) ?? '[]')
  } catch {
    return []
  }
}

function guardarVistos(ids) {
  try {
    // Mantém só as duas últimas rodadas na memória para o banco poder girar
    localStorage.setItem(CHAVE_VISTOS, JSON.stringify(ids.slice(-POR_RODADA * 2)))
  } catch {
    // Sem localStorage (aba anônima): a rodada continua funcionando
  }
}

export default function JogoVerdadeiroFalso({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoVerdadeiroFalso } = useApp()
  const [rodada, setRodada] = useState(() => sortearRodada(PERGUNTAS, POR_RODADA, lerVistos()))
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [acertos, setAcertos] = useState(0)
  const [historico, setHistorico] = useState([])
  const [sequencia, setSequencia] = useState(0)
  const [fim, setFim] = useState(false)
  const [premioDado, setPremioDado] = useState(false)

  // Trava síncrona contra toques repetidos (ver JogoBatalhaSaciedade)
  const respondidoRef = useRef(false)

  const atual = rodada[indice]
  const respondeu = escolha !== null
  const acertou = respondeu && escolha === atual?.resposta

  const rotuloResposta = useMemo(() => {
    const opcao = OPCOES.find((o) => o.id === atual?.resposta)
    return ingles ? opcao?.en : opcao?.pt
  }, [atual, ingles])

  function responder(id) {
    if (respondidoRef.current) return
    respondidoRef.current = true
    setEscolha(id)
    const certo = id === atual.resposta
    if (certo) setAcertos((a) => a + 1)
    setHistorico((h) => [...h, certo ? 'acerto' : 'aprendizado'])
    setSequencia((s) => (certo ? s + 1 : 0))
  }

  function avancar() {
    guardarVistos([...lerVistos(), atual.id])
    if (indice + 1 >= rodada.length) {
      setFim(true)
      return
    }
    setIndice(indice + 1)
    setEscolha(null)
    respondidoRef.current = false
  }

  function novaRodada() {
    setRodada(sortearRodada(PERGUNTAS, POR_RODADA, lerVistos()))
    setIndice(0)
    setEscolha(null)
    setAcertos(0)
    setHistorico([])
    setSequencia(0)
    setFim(false)
    setPremioDado(false)
    respondidoRef.current = false
  }

  // Recompensa ao concluir a rodada com metade ou mais de acertos (1x por dia)
  useEffect(() => {
    if (fim && acertos >= Math.ceil(rodada.length / 2) && !premioDado) {
      tentarRecompensa(registrarJogoVerdadeiroFalso).then(setPremioDado)
    }
  }, [fim])

  return (
    <MolduraJogo
      titulo="Verdadeiro, Falso ou Depende"
      tituloEN="True, False or It Depends"
      subtitulo="Nem tudo em nutrição é sim ou não"
      subtituloEN="Not everything in nutrition is yes or no"
      Icone={HelpCircle}
      acento="bg-sage-claro"
      onFechar={onFechar}
      indice={indice}
      total={rodada.length}
      acertos={acertos}
      historico={historico}
      sequencia={sequencia}
      fim={fim}
      premioDado={premioDado}
      onJogarDeNovo={novaRodada}
    >
      {atual && (
        <div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-center font-serif text-lg font-medium leading-snug text-verde">
              “{ingles ? atual.afirmacaoEN : atual.afirmacao}”
            </p>
          </div>

          {/* Opções */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {OPCOES.map(({ id, pt, en, Icone, cor }) => {
              const eEsta = escolha === id
              const eCerta = atual.resposta === id
              const destaque = respondeu && (eCerta || eEsta)
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => responder(id)}
                  disabled={respondeu}
                  aria-pressed={eEsta}
                  className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-xs font-bold transition-all ${
                    destaque
                      ? eCerta
                        ? 'border-sage bg-sage-claro text-verde'
                        : 'border-red-300 bg-red-50 text-red-700 opacity-70'
                      : respondeu
                        ? 'border-transparent bg-white text-verde/40'
                        : `${cor} active:scale-[0.97]`
                  }`}
                >
                  <Icone size={18} aria-hidden="true" />
                  {ingles ? en : pt}
                </button>
              )
            })}
          </div>

          {/* Explicação — aparece sempre, acertando ou não */}
          {respondeu && (
            <div
              className={`mt-3 rounded-2xl border-2 p-4 ${acertou ? 'border-sage bg-sage-claro/50' : 'border-ouro bg-ouro-claro/60'}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    acertou ? 'bg-sage text-creme' : 'bg-ouro text-verde'
                  }`}
                  aria-hidden="true"
                >
                  {acertou ? <Check size={16} strokeWidth={3} /> : <Lightbulb size={15} />}
                </span>
                <p className="text-xs font-bold text-verde">
                  {acertou
                    ? ingles ? 'That’s it!' : 'É isso mesmo!'
                    : `${ingles ? 'The answer is' : 'A resposta é'}: ${rotuloResposta}`}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-verde/85">
                {ingles ? atual.explicacaoEN : atual.explicacao}
              </p>
              <button
                type="button"
                onClick={avancar}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-verde px-4 py-2.5 text-sm font-bold text-creme"
              >
                {indice + 1 >= rodada.length
                  ? ingles ? 'See result' : 'Ver resultado'
                  : ingles ? 'Next' : 'Próxima'}
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </MolduraJogo>
  )
}
