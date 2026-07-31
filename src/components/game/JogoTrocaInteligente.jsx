import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Target, ArrowRight, Repeat, Check, Lightbulb } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { TROCAS, MISSOES_TROCA } from '../../data/jogos/trocas.js'
import { sortearRodada } from '../../utils/jogos/rodada.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'
import MolduraJogo from './MolduraJogo.jsx'

// Troca Inteligente — uma refeição real e uma missão. Nenhuma opção é "errada":
// todas melhoram algo, e o jogo mostra o impacto numérico de cada uma.

const POR_RODADA = 4

function Delta({ rotulo, antes, depois, unidade = '', melhorMaior = true }) {
  const diferenca = Math.round((depois - antes) * 10) / 10
  const neutro = diferenca === 0
  const bom = melhorMaior ? diferenca > 0 : diferenca < 0
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      <span className="text-verde/60">{rotulo}</span>
      <span className="font-semibold text-verde/70">{antes}{unidade}</span>
      <ArrowRight size={10} className="text-verde/40" aria-hidden="true" />
      <span className={`font-bold ${neutro ? 'text-verde/70' : bom ? 'text-sage' : 'text-ouro'}`}>
        {depois}{unidade}
      </span>
    </div>
  )
}

export default function JogoTrocaInteligente({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoTroca } = useApp()
  const [rodada, setRodada] = useState(() => sortearRodada(TROCAS, POR_RODADA))
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
  const opcaoEscolhida = atual?.opcoes.find((o) => o.id === escolha)
  const acertou = opcaoEscolhida?.melhor === true

  function escolher(id) {
    if (respondidoRef.current) return
    respondidoRef.current = true
    setEscolha(id)
    const certo = Boolean(atual.opcoes.find((o) => o.id === id)?.melhor)
    if (certo) setAcertos((a) => a + 1)
    setHistorico((h) => [...h, certo ? 'acerto' : 'aprendizado'])
    setSequencia((s) => (certo ? s + 1 : 0))
  }

  function avancar() {
    if (indice + 1 >= rodada.length) {
      setFim(true)
      return
    }
    setIndice(indice + 1)
    setEscolha(null)
    respondidoRef.current = false
  }

  function novaRodada() {
    setRodada(sortearRodada(TROCAS, POR_RODADA))
    setIndice(0)
    setEscolha(null)
    setAcertos(0)
    setHistorico([])
    setSequencia(0)
    setFim(false)
    setPremioDado(false)
    respondidoRef.current = false
  }

  useEffect(() => {
    if (fim && acertos >= Math.ceil(rodada.length / 2) && !premioDado) {
      tentarRecompensa(registrarJogoTroca).then(setPremioDado)
    }
  }, [fim])

  return (
    <MolduraJogo
      titulo="Troca Inteligente"
      tituloEN="Smart Swap"
      subtitulo="Pequenas mudanças, grande diferença"
      subtituloEN="Small changes, big difference"
      Icone={Repeat}
      acento="bg-ouro-claro"
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
          {/* Missão */}
          <div className="flex items-center gap-2 rounded-xl bg-verde px-3 py-2 text-creme">
            <Target size={15} className="shrink-0 text-ouro" aria-hidden="true" />
            <p className="text-xs font-bold">
              {ingles ? 'Mission: ' : 'Missão: '}
              {ingles ? MISSOES_TROCA[atual.missao].en : MISSOES_TROCA[atual.missao].pt}
            </p>
          </div>

          {/* Refeição atual */}
          <div className="mt-2 rounded-2xl bg-white p-4">
            <p className="text-sm font-medium leading-snug text-verde">
              {ingles ? atual.refeicaoEN : atual.refeicao}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-cinza pt-2 text-[11px] text-verde/70">
              <span>{atual.antes.kcal} kcal</span>
              <span>{atual.antes.prot} g {ingles ? 'protein' : 'proteína'}</span>
              <span>{atual.antes.fibra} g {ingles ? 'fiber' : 'fibra'}</span>
            </div>
          </div>

          {/* Opções de troca */}
          <div className="mt-3 space-y-2">
            {atual.opcoes.map((o) => {
              const eEsta = escolha === o.id
              const revelar = Boolean(escolha)
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => escolher(o.id)}
                  disabled={revelar}
                  aria-pressed={eEsta}
                  className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                    revelar
                      ? o.melhor
                        ? 'border-sage bg-sage-claro/60'
                        : eEsta
                          ? 'border-ouro bg-ouro-claro/50'
                          : 'border-transparent bg-white/60 opacity-60'
                      : 'border-sage/25 bg-white hover:border-sage active:scale-[0.99]'
                  }`}
                >
                  <p className="text-xs font-semibold text-verde">{ingles ? o.textoEN : o.texto}</p>
                  {revelar && (
                    <div className="mt-2 space-y-0.5 border-t border-verde/10 pt-2">
                      <Delta rotulo="kcal" antes={atual.antes.kcal} depois={o.depois.kcal} melhorMaior={false} />
                      <Delta rotulo={ingles ? 'protein' : 'proteína'} antes={atual.antes.prot} depois={o.depois.prot} unidade=" g" />
                      <Delta rotulo={ingles ? 'fiber' : 'fibra'} antes={atual.antes.fibra} depois={o.depois.fibra} unidade=" g" />
                      <p className="pt-1 text-[11px] leading-relaxed text-verde/80">{ingles ? o.impactoEN : o.impacto}</p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Fecho educativo */}
          {escolha && (
            <div className="mt-3 rounded-2xl bg-ouro-claro p-4" role="status" aria-live="polite">
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
                    ? ingles ? 'Best swap for this mission!' : 'Melhor troca para esta missão!'
                    : ingles ? 'Your swap helps too — see the numbers above' : 'Sua troca também ajuda — veja os números acima'}
                </p>
              </div>
              <p className="mt-1 text-[11px] italic leading-relaxed text-verde/75">
                {ingles ? atual.ensinamentoEN : atual.ensinamento}
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
