import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, ScanLine, ScanSearch, Check, Lightbulb } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { ROTULOS } from '../../data/jogos/rotulos.js'
import { sortearRodada } from '../../utils/jogos/rodada.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'
import MolduraJogo from './MolduraJogo.jsx'

// Detetive dos Rótulos — ler a tabela nutricional de verdade.
// A armadilha é sempre a mesma da vida real: a porção declarada não é o que se consome.

const ROTULOS_POR_RODADA = 3

// Achata os rótulos sorteados numa fila de perguntas
function montarFila(rotulos) {
  return rotulos.flatMap((rotulo) => rotulo.perguntas.map((pergunta) => ({ rotulo, pergunta })))
}

function TabelaNutricional({ rotulo, ingles }) {
  const t = rotulo.tabela
  const linhas = [
    [ingles ? 'Energy' : 'Valor energético', `${t.kcal} kcal`],
    [ingles ? 'Carbs' : 'Carboidratos', `${t.carb} g`],
    [ingles ? 'of which sugars' : 'dos quais açúcares', `${t.acucares} g`, true],
    [ingles ? 'Protein' : 'Proteínas', `${t.prot} g`],
    [ingles ? 'Total fat' : 'Gorduras totais', `${t.gord} g`],
    [ingles ? 'Dietary fiber' : 'Fibra alimentar', `${t.fibra} g`],
    [ingles ? 'Sodium' : 'Sódio', `${t.sodio} mg`],
  ]
  return (
    <div className="rounded-xl border-2 border-verde bg-white p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-verde">
        {ingles ? 'Nutrition facts' : 'Informação nutricional'}
      </p>
      <p className="mt-0.5 text-[11px] text-verde/70">
        {ingles ? 'Serving: ' : 'Porção: '}
        <strong>{ingles ? rotulo.porcaoEN : rotulo.porcao}</strong>
        {' · '}
        {ingles ? 'servings per pack: ' : 'porções na embalagem: '}
        <strong>{rotulo.porcoesNoPacote}</strong>
      </p>
      <table className="mt-2 w-full text-[11px]">
        <tbody className="divide-y divide-cinza">
          {linhas.map(([nome, valor, recuo]) => (
            <tr key={nome}>
              <td className={`py-1 text-verde/75 ${recuo ? 'pl-3 italic' : ''}`}>{nome}</td>
              <td className="py-1 text-right font-bold text-verde">{valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function JogoDetetiveRotulos({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoRotulos } = useApp()
  const [rotulos, setRotulos] = useState(() => sortearRodada(ROTULOS, ROTULOS_POR_RODADA))
  const fila = useMemo(() => montarFila(rotulos), [rotulos])
  const [indice, setIndice] = useState(0)
  const [escolha, setEscolha] = useState(null)
  const [acertos, setAcertos] = useState(0)
  const [historico, setHistorico] = useState([])
  const [sequencia, setSequencia] = useState(0)
  const [fim, setFim] = useState(false)
  const [premioDado, setPremioDado] = useState(false)

  // Trava síncrona contra toques repetidos (ver JogoBatalhaSaciedade)
  const respondidoRef = useRef(false)

  const atual = fila[indice]
  const acertou = escolha !== null && atual?.pergunta.opcoes[escolha]?.correta === true

  function responder(i) {
    if (respondidoRef.current) return
    respondidoRef.current = true
    setEscolha(i)
    const certo = Boolean(atual.pergunta.opcoes[i].correta)
    if (certo) setAcertos((a) => a + 1)
    setHistorico((h) => [...h, certo ? 'acerto' : 'aprendizado'])
    setSequencia((s) => (certo ? s + 1 : 0))
  }

  function avancar() {
    if (indice + 1 >= fila.length) {
      setFim(true)
      return
    }
    setIndice(indice + 1)
    setEscolha(null)
    respondidoRef.current = false
  }

  function novaRodada() {
    setRotulos(sortearRodada(ROTULOS, ROTULOS_POR_RODADA))
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
    if (fim && acertos >= Math.ceil(fila.length / 2) && !premioDado) {
      tentarRecompensa(registrarJogoRotulos).then(setPremioDado)
    }
  }, [fim])

  return (
    <MolduraJogo
      titulo="Detetive dos Rótulos"
      tituloEN="Label Detective"
      subtitulo="A porção quase nunca é o pacote"
      subtituloEN="The serving is almost never the package"
      Icone={ScanSearch}
      acento="bg-sage"
      onFechar={onFechar}
      indice={indice}
      total={fila.length}
      acertos={acertos}
      historico={historico}
      sequencia={sequencia}
      fim={fim}
      premioDado={premioDado}
      onJogarDeNovo={novaRodada}
    >
      {atual && (
        <div>
          <div className="mb-2 flex items-center gap-2 rounded-xl bg-verde px-3 py-2 text-creme">
            <ScanLine size={15} className="shrink-0 text-ouro" aria-hidden="true" />
            <p className="text-xs font-bold">{ingles ? atual.rotulo.produtoEN : atual.rotulo.produto}</p>
          </div>

          <TabelaNutricional rotulo={atual.rotulo} ingles={ingles} />

          <p className="mt-3 text-sm font-semibold text-verde">
            {ingles ? atual.pergunta.perguntaEN : atual.pergunta.pergunta}
          </p>

          <div className="mt-2 space-y-2">
            {atual.pergunta.opcoes.map((o, i) => {
              const eEsta = escolha === i
              const revelar = escolha !== null
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => responder(i)}
                  disabled={revelar}
                  aria-pressed={eEsta}
                  className={`w-full rounded-xl border-2 p-3 text-left text-xs font-semibold transition-all ${
                    revelar
                      ? o.correta
                        ? 'border-sage bg-sage-claro/60 text-verde'
                        : eEsta
                          ? 'border-ouro bg-ouro-claro/50 text-verde'
                          : 'border-transparent bg-white/60 text-verde/40'
                      : 'border-sage/25 bg-white text-verde hover:border-sage active:scale-[0.99]'
                  }`}
                >
                  {ingles ? o.textoEN : o.texto}
                </button>
              )
            })}
          </div>

          {escolha !== null && (
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
                  {acertou ? (ingles ? 'Good eye!' : 'Bom olho!') : ingles ? 'Look again:' : 'Olhe de novo:'}
                </p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-verde/85">
                {ingles ? atual.pergunta.explicacaoEN : atual.pergunta.explicacao}
              </p>
              <button
                type="button"
                onClick={avancar}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-verde px-4 py-2.5 text-sm font-bold text-creme"
              >
                {indice + 1 >= fila.length
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
