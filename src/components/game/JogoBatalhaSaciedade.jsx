import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Swords, Check, Lightbulb } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { DUELOS } from '../../data/jogos/duelos.js'
import { sortearRodada } from '../../utils/jogos/rodada.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'
import MolduraJogo from './MolduraJogo.jsx'

// Batalha da Saciedade — duas refeições com calorias parecidas.
// A pergunta é qual TENDE a saciar mais: proteína, fibra e volume explicam a diferença.

const POR_RODADA = 5

function CardRefeicao({ refeicao, lado, escolhido, revelar, vencedor, onEscolher, ingles }) {
  const estado = revelar
    ? vencedor
      ? 'border-sage bg-sage-claro/60'
      : escolhido
        ? 'border-ouro bg-ouro-claro/50'
        : 'border-transparent bg-white/60 opacity-70'
    : 'border-sage/25 bg-white hover:border-sage active:scale-[0.99]'

  return (
    <button
      type="button"
      onClick={() => onEscolher(lado)}
      disabled={revelar}
      aria-pressed={escolhido}
      className={`flex-1 rounded-2xl border-2 p-3 text-left transition-all ${estado}`}
    >
      <p className="min-h-[2.6rem] text-xs font-semibold leading-snug text-verde">
        {ingles ? refeicao.nomeEN : refeicao.nome}
      </p>
      <p className="mt-2 font-serif text-lg font-semibold text-verde">{refeicao.kcal} kcal</p>
      {revelar && (
        <dl className="mt-1.5 space-y-0.5 border-t border-verde/10 pt-1.5 text-[11px] text-verde/75">
          <div className="flex justify-between gap-2">
            <dt>{ingles ? 'protein' : 'proteína'}</dt>
            <dd className="font-bold">{refeicao.prot} g</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>{ingles ? 'fiber' : 'fibra'}</dt>
            <dd className="font-bold">{refeicao.fibra} g</dd>
          </div>
        </dl>
      )}
    </button>
  )
}

export default function JogoBatalhaSaciedade({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoSaciedade } = useApp()
  const [rodada, setRodada] = useState(() => sortearRodada(DUELOS, POR_RODADA))
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [acertos, setAcertos] = useState(0)
  const [historico, setHistorico] = useState([])
  const [sequencia, setSequencia] = useState(0)
  const [fim, setFim] = useState(false)
  const [premioDado, setPremioDado] = useState(false)

  // Trava síncrona: o estado do React só muda no próximo render, então dois toques
  // rápidos no mesmo card contariam o acerto duas vezes sem esta proteção.
  const respondidoRef = useRef(false)

  const atual = rodada[indice]
  const acertou = escolha !== null && escolha === atual?.maisSaciante

  function escolher(lado) {
    if (respondidoRef.current) return
    respondidoRef.current = true
    setEscolha(lado)
    const certo = lado === atual.maisSaciante
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
    setRodada(sortearRodada(DUELOS, POR_RODADA))
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
      tentarRecompensa(registrarJogoSaciedade).then(setPremioDado)
    }
  }, [fim])

  return (
    <MolduraJogo
      titulo="Batalha da Saciedade"
      tituloEN="Satiety Battle"
      subtitulo="Mesmas calorias, fomes diferentes"
      subtituloEN="Same calories, different hunger"
      Icone={Swords}
      acento="bg-ouro"
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
          <p className="mb-2 text-center text-sm font-semibold text-verde">
            {ingles ? 'Which one tends to satisfy longer?' : 'Qual tende a saciar por mais tempo?'}
          </p>

          <div className="flex items-stretch gap-2">
            <CardRefeicao
              refeicao={atual.a}
              lado="a"
              escolhido={escolha === 'a'}
              revelar={Boolean(escolha)}
              vencedor={atual.maisSaciante === 'a'}
              onEscolher={escolher}
              ingles={ingles}
            />
            <div className="flex items-center">
              <Swords size={16} className="text-ouro" aria-hidden="true" />
            </div>
            <CardRefeicao
              refeicao={atual.b}
              lado="b"
              escolhido={escolha === 'b'}
              revelar={Boolean(escolha)}
              vencedor={atual.maisSaciante === 'b'}
              onEscolher={escolher}
              ingles={ingles}
            />
          </div>

          {escolha && (
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
                  {acertou ? (ingles ? 'Exactly!' : 'Exatamente!') : ingles ? 'Look at the numbers:' : 'Olhe os números:'}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-verde/85">{ingles ? atual.porqueEN : atual.porque}</p>
              <button
                type="button"
                onClick={avancar}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-verde px-4 py-2.5 text-sm font-bold text-creme"
              >
                {indice + 1 >= rodada.length
                  ? ingles ? 'See result' : 'Ver resultado'
                  : ingles ? 'Next duel' : 'Próximo duelo'}
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </MolduraJogo>
  )
}
