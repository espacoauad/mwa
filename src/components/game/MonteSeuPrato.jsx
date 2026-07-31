import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Star, RotateCcw, ChevronLeft, Lock, Minus, Plus, Trash2, Lightbulb, Check, ArrowUpRight, ScanLine } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { MISSOES } from '../../data/jogos/missoes.js'
import { GRUPOS, ingredientesDoGrupo } from '../../data/jogos/ingredientes.js'
import { avaliarPrato, totaisDoPrato } from '../../utils/jogos/avaliarPrato.js'
import { mesclarProgresso, nivelLiberado, progressoPorMissao } from '../../utils/jogos/progresso.js'
import { carregarProgressoJogo, salvarResultadoJogo } from '../../lib/jogosProgresso.js'
import { tentarRecompensa } from '../../utils/jogos/recompensa.js'
import IngredienteSvg from './svg/IngredienteSvg.jsx'

const JOGO_ID = 'prato'

// Monte Seu Prato — jogo educativo principal do MWA.
// A pessoa escolhe uma missão, monta o prato com ingredientes reais (base TACO/TBCA)
// e recebe uma avaliação multicritério com feedback acolhedor. Várias combinações vencem.

const MULT_MIN = 0.5
const MULT_MAX = 2

function rotuloMult(mult) {
  return { 0.5: '½×', 1: '1×', 1.5: '1½×', 2: '2×' }[mult] ?? `${mult}×`
}

function textoCriterio(criterio, ingles) {
  const { id, atual, alvo, ok } = criterio
  if (id === 'kcal') {
    if (ok) return ingles ? `Within the mission's calorie range (${atual} kcal)` : `Dentro da faixa de calorias da missão (${atual} kcal)`
    return atual > alvo.max
      ? ingles ? `Above the calorie range (${atual} of up to ${alvo.max} kcal)` : `Acima da faixa de calorias (${atual} de até ${alvo.max} kcal)`
      : ingles ? `Below the calorie range (${atual} of at least ${alvo.min} kcal)` : `Abaixo da faixa de calorias (${atual} de pelo menos ${alvo.min} kcal)`
  }
  if (id === 'prot') {
    return ok
      ? ingles ? `Good protein source (${atual} g)` : `Boa fonte de proteína (${atual} g)`
      : ingles ? `Protein below target (${atual} of ${alvo.min} g)` : `Proteína abaixo do alvo (${atual} de ${alvo.min} g)`
  }
  if (id === 'fibra') {
    return ok
      ? ingles ? `Good fiber amount (${atual} g)` : `Boa quantidade de fibras (${atual} g)`
      : ingles ? `Fiber below target (${atual} of ${alvo.min} g)` : `Fibras abaixo do alvo (${atual} de ${alvo.min} g)`
  }
  const querFruta = id.includes('fruta')
  if (ok) return ingles ? (querFruta ? 'Has a veggie or fruit' : 'Has a veggie on the plate') : querFruta ? 'Tem vegetal ou fruta no prato' : 'Tem vegetal no prato'
  return ingles ? (querFruta ? 'Missing a veggie or fruit' : 'Missing a veggie') : querFruta ? 'Faltou um vegetal ou uma fruta' : 'Faltou um vegetal'
}

const SUGESTOES = {
  'mais-fibra': {
    pt: 'Troca inteligente: aveia, feijão ou chia somam fibra de um jeito prático — e fibra tende a aumentar a saciedade.',
    en: 'Smart swap: oats, beans or chia add fiber easily — and fiber tends to increase satiety.',
  },
  'mais-proteina': {
    pt: 'Troca inteligente: ovo, frango grelhado ou iogurte grego somam proteína com poucas calorias.',
    en: 'Smart swap: eggs, grilled chicken or Greek yogurt add protein with few calories.',
  },
  'mais-vegetais': {
    pt: 'Troca inteligente: uma porção de vegetais ou uma fruta acrescenta volume e fibra com pouquíssimas calorias.',
    en: 'Smart swap: a portion of veggies or a fruit adds volume and fiber with very few calories.',
  },
  'menos-calorias': {
    pt: 'Troca inteligente: reduza a porção do item mais calórico (toque no − dele) ou troque por uma versão que entregue mais nutrientes com menos calorias.',
    en: 'Smart swap: reduce the portion of the most caloric item (tap its −) or swap it for one that delivers more nutrients with fewer calories.',
  },
  'mais-calorias': {
    pt: 'O prato ficou pequeno para a missão — acrescente mais um grupo alimentar para completá-lo.',
    en: 'The plate is too small for this mission — add one more food group to complete it.',
  },
  equilibrado: {
    pt: 'Prato no ponto! Na próxima, experimente variar os grupos para descobrir novas combinações.',
    en: 'Spot on! Next time, try varying the groups to discover new combinations.',
  },
}

// Momento-chave do método: comer bem e ainda assim passar das calorias.
// A mensagem explica por que monitorar importa, sem culpa e sem alarmismo.
const LICAO_EXCESSO = {
  pt: 'Dá para escolher bons alimentos e mesmo assim não emagrecer — é aí que monitorar faz toda a diferença. O emagrecimento acontece no déficit calórico, e o déficit inteligente é aquele em que cada caloria traz nutrientes e saciedade: assim você emagrece com saúde, sem passar fome.',
  en: 'You can pick good foods and still not lose weight — that is where tracking makes the difference. Weight loss happens in a calorie deficit, and a smart deficit is one where every calorie brings nutrients and satiety: that is how you lose weight healthily, without going hungry.',
}

export default function MonteSeuPrato({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoPrato, userId } = useApp()
  const [fase, setFase] = useState('missoes') // missoes | montando | resultado
  const [missao, setMissao] = useState(null)
  const [grupoAtivo, setGrupoAtivo] = useState('proteina')
  const [itens, setItens] = useState([]) // [{ ingrediente, mult }]
  const [resultado, setResultado] = useState(null)
  const [melhores, setMelhores] = useState({}) // { missaoId: { melhor_pontuacao, estrelas, partidas } }
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

  // Carrega o progresso salvo (melhor pontuação, estrelas e níveis liberados)
  useEffect(() => {
    let ativo = true
    carregarProgressoJogo(userId, JOGO_ID).then((linhas) => {
      if (ativo) setMelhores(progressoPorMissao(linhas))
    })
    return () => {
      ativo = false
    }
  }, [userId])

  const itensMotor = useMemo(
    () => itens.map(({ ingrediente, mult }) => ({ alimento: ingrediente.alimento, gramas: ingrediente.porcao.g * mult, grupo: ingrediente.grupo })),
    [itens],
  )
  const totais = useMemo(() => totaisDoPrato(itensMotor), [itensMotor])

  function escolherMissao(m) {
    setMissao(m)
    setItens([])
    setGrupoAtivo('proteina')
    setResultado(null)
    setFase('montando')
  }

  function adicionar(ingrediente) {
    setItens((atuais) =>
      atuais.some((i) => i.ingrediente.alimentoId === ingrediente.alimentoId) ? atuais : [...atuais, { ingrediente, mult: 1 }],
    )
  }

  function ajustarPorcao(alimentoId, delta) {
    setItens((atuais) =>
      atuais.map((i) =>
        i.ingrediente.alimentoId === alimentoId ? { ...i, mult: Math.min(MULT_MAX, Math.max(MULT_MIN, i.mult + delta)) } : i,
      ),
    )
  }

  function remover(alimentoId) {
    setItens((atuais) => atuais.filter((i) => i.ingrediente.alimentoId !== alimentoId))
  }

  async function confirmar() {
    const r = avaliarPrato(itensMotor, missao)
    setResultado(r)
    setFase('resultado')

    const anterior = melhores[missao.id]
    const salvo = await salvarResultadoJogo(
      userId,
      JOGO_ID,
      missao.id,
      { pontuacao: r.pontuacao, estrelas: r.estrelas, nivel: missao.nivel },
      anterior,
    )
    // Sem rede, o progresso vale ao menos na sessão — a pessoa não perde o feedback
    setMelhores((m) => ({
      ...m,
      [missao.id]: salvo ?? mesclarProgresso(anterior, { pontuacao: r.pontuacao, estrelas: r.estrelas }),
    }))
  }

  // Recompensa (1x por dia, dedup no banco): só quando a missão é realmente cumprida
  useEffect(() => {
    if (fase === 'resultado' && resultado?.missaoCumprida && !premioDado) {
      tentarRecompensa(registrarJogoPrato).then(setPremioDado)
    }
  }, [fase])

  const criteriosBarra = useMemo(() => {
    if (!missao) return []
    const c = missao.criterios
    const barras = []
    if (c.kcal) barras.push({ id: 'kcal', rotulo: 'kcal', atual: totais.kcal, alvoTexto: `${c.kcal.min}–${c.kcal.max}`, pct: Math.min(1, totais.kcal / c.kcal.max), estourou: totais.kcal > c.kcal.max, ok: totais.kcal >= c.kcal.min && totais.kcal <= c.kcal.max })
    if (c.prot) barras.push({ id: 'prot', rotulo: ingles ? 'protein' : 'proteína', atual: `${totais.prot} g`, alvoTexto: `≥ ${c.prot.min} g`, pct: Math.min(1, totais.prot / c.prot.min), ok: totais.prot >= c.prot.min })
    if (c.fibra) barras.push({ id: 'fibra', rotulo: ingles ? 'fiber' : 'fibra', atual: `${totais.fibra} g`, alvoTexto: `≥ ${c.fibra.min} g`, pct: Math.min(1, totais.fibra / c.fibra.min), ok: totais.fibra >= c.fibra.min })
    return barras
  }, [missao, totais, ingles])

  const faltando = criteriosBarra.filter((b) => !b.ok)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="monte-seu-prato-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl bg-creme p-5 outline-none">
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {fase !== 'missoes' && (
              <button
                type="button"
                onClick={() => setFase('missoes')}
                aria-label={ingles ? 'Back to missions' : 'Voltar às missões'}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-verde/10 text-verde hover:bg-verde/20"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <h2 id="monte-seu-prato-titulo" className="font-serif text-xl font-semibold italic text-verde">
                {ingles ? 'Build Your Plate' : 'Monte Seu Prato'}
              </h2>
              <p className="text-xs text-verde/60">
                {fase === 'montando' && missao
                  ? ingles ? missao.tituloEN : missao.titulo
                  : ingles ? 'Real ingredients, real learning' : 'Ingredientes reais, aprendizado de verdade'}
              </p>
            </div>
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

        {/* Escolha de missão */}
        {fase === 'missoes' && (
          <div className="space-y-4">
            {[1, 2].map((nivel) => (
              <div key={nivel}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-verde/60">
                  {ingles ? 'Level' : 'Nível'} {nivel}
                </p>
                <div className="space-y-2">
                  {MISSOES.filter((m) => m.nivel === nivel).map((m) => {
                    const bloqueada = !nivelLiberado(nivel, MISSOES, melhores)
                    const melhor = melhores[m.id]
                    return (
                      <button
                        key={m.id}
                        type="button"
                        disabled={bloqueada}
                        onClick={() => escolherMissao(m)}
                        className={`w-full rounded-2xl border-2 p-4 text-left transition-colors ${
                          bloqueada
                            ? 'cursor-not-allowed border-cinza bg-white/50 opacity-60'
                            : 'border-sage/25 bg-white hover:border-sage'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-verde">{ingles ? m.tituloEN : m.titulo}</p>
                          {bloqueada ? (
                            <Lock size={16} className="shrink-0 text-verde/40" aria-hidden="true" />
                          ) : (
                            <span className="flex shrink-0 gap-0.5" aria-label={melhor ? `${melhor.estrelas} estrelas` : undefined}>
                              {[0, 1, 2].map((i) => (
                                <Star key={i} size={14} className={i < (melhor?.estrelas ?? 0) ? 'fill-ouro text-ouro' : 'text-cinza'} />
                              ))}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-verde/60">
                          {bloqueada
                            ? ingles ? 'Get 2+ stars on a level 1 mission to unlock' : 'Consiga 2+ estrelas numa missão do nível 1 para liberar'
                            : ingles ? m.resumoEN : m.resumo}
                        </p>
                        {melhor && !bloqueada && (
                          <p className="mt-1 text-[11px] font-semibold text-sage">
                            {ingles ? 'Best score' : 'Melhor pontuação'}: {melhor.melhor_pontuacao}
                            {melhor.partidas > 1 && ` · ${melhor.partidas} ${ingles ? 'plays' : 'partidas'}`}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <p className="text-center text-[11px] text-verde/50">
              {ingles
                ? 'Values per portion, TACO/TBCA food database — the same one used in your diary.'
                : 'Valores por porção, base TACO/TBCA — a mesma do seu diário alimentar.'}
            </p>
          </div>
        )}

        {/* Montagem do prato */}
        {fase === 'montando' && missao && (
          <div>
            {/* Painel nutricional ao vivo */}
            <div className="rounded-2xl bg-white p-3">
              {criteriosBarra.map((b) => (
                <div key={b.id} className="mb-2 flex items-center gap-2 text-xs text-verde last:mb-0">
                  <span className="w-16 shrink-0">{b.rotulo}</span>
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full bg-sage-claro/60"
                    role="progressbar"
                    aria-label={`${b.rotulo}: ${b.atual}`}
                    aria-valuenow={Math.round(b.pct * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-300 motion-reduce:transition-none ${
                        b.estourou ? 'bg-red-400' : b.ok ? 'bg-sage' : 'bg-ouro'
                      }`}
                      style={{ width: `${Math.round(b.pct * 100)}%` }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right font-bold">{b.atual}</span>
                  <span className="w-16 shrink-0 text-right text-verde/50">{b.alvoTexto}</span>
                </div>
              ))}
              <p className="mt-2 text-[11px] text-verde/60" role="status" aria-live="polite">
                {itens.length === 0
                  ? ingles ? 'Tap ingredients below to add them to your plate.' : 'Toque nos ingredientes abaixo para montar o prato.'
                  : faltando.length === 0
                    ? ingles ? 'Mission targets reached — you can confirm!' : 'Alvos da missão atingidos — pode confirmar!'
                    : (ingles ? 'Still missing: ' : 'Ainda falta: ') + faltando.map((f) => f.rotulo).join(', ')}
              </p>
            </div>

            {/* Prato em montagem */}
            {itens.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {itens.map(({ ingrediente, mult }) => (
                  <div key={ingrediente.alimentoId} className="flex items-center gap-2 rounded-xl bg-white px-2 py-1.5">
                    <IngredienteSvg id={ingrediente.alimentoId} tamanho={30} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-verde">{ingrediente.alimento.nome}</p>
                      <p className="text-[11px] text-verde/50">
                        {rotuloMult(mult)} {ingles ? ingrediente.porcao.rotuloEN : ingrediente.porcao.rotulo} · {Math.round(ingrediente.porcao.g * mult)} g
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => ajustarPorcao(ingrediente.alimentoId, -0.5)}
                      disabled={mult <= MULT_MIN}
                      aria-label={ingles ? `Reduce ${ingrediente.alimento.nome} portion` : `Diminuir porção de ${ingrediente.alimento.nome}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-claro/60 text-verde disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => ajustarPorcao(ingrediente.alimentoId, 0.5)}
                      disabled={mult >= MULT_MAX}
                      aria-label={ingles ? `Increase ${ingrediente.alimento.nome} portion` : `Aumentar porção de ${ingrediente.alimento.nome}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-claro/60 text-verde disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remover(ingrediente.alimentoId)}
                      aria-label={ingles ? `Remove ${ingrediente.alimento.nome}` : `Remover ${ingrediente.alimento.nome}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-verde/50 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Abas de grupos */}
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label={ingles ? 'Food groups' : 'Grupos de alimentos'}>
              {GRUPOS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="tab"
                  aria-selected={grupoAtivo === g.id}
                  onClick={() => setGrupoAtivo(g.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    grupoAtivo === g.id ? 'bg-verde text-creme' : 'bg-white text-verde hover:bg-sage-claro/50'
                  }`}
                >
                  {ingles ? g.nomeEN : g.nome}
                </button>
              ))}
            </div>

            {/* Grade de ingredientes */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ingredientesDoGrupo(grupoAtivo).map((ing) => {
                const noPrato = itens.some((i) => i.ingrediente.alimentoId === ing.alimentoId)
                return (
                  <button
                    key={ing.alimentoId}
                    type="button"
                    onClick={() => adicionar(ing)}
                    disabled={noPrato}
                    className={`flex items-center gap-2 rounded-xl border-2 p-2 text-left transition-all ${
                      noPrato ? 'border-sage bg-sage-claro/40' : 'border-transparent bg-white hover:border-sage active:scale-[0.98]'
                    }`}
                  >
                    <IngredienteSvg id={ing.alimentoId} tamanho={38} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold leading-tight text-verde">{ing.alimento.nome}</p>
                      <p className="text-[11px] text-verde/50">
                        {ingles ? ing.porcao.rotuloEN : ing.porcao.rotulo} · {Math.round((ing.alimento.kcal * ing.porcao.g) / 100)} kcal
                      </p>
                    </div>
                    {noPrato && <Check size={14} className="ml-auto shrink-0 text-sage" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>

            {/* Ações */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setItens([])}
                disabled={itens.length === 0}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-sage/40 px-4 py-2.5 text-sm font-bold text-verde disabled:opacity-40"
              >
                <RotateCcw size={14} /> {ingles ? 'Restart' : 'Reiniciar'}
              </button>
              <button
                type="button"
                onClick={confirmar}
                disabled={itens.length === 0}
                className="flex-1 rounded-full bg-verde px-4 py-2.5 text-sm font-bold text-creme transition-colors hover:bg-verde/90 disabled:opacity-40"
              >
                {ingles ? 'Rate my plate' : 'Avaliar meu prato'}
              </button>
            </div>
          </div>
        )}

        {/* Resultado */}
        {fase === 'resultado' && resultado && missao && (
          <div role="status" aria-live="polite">
            <div className="rounded-2xl bg-verde p-6 text-center text-creme">
              <div className="flex justify-center gap-1" aria-label={`${resultado.estrelas} de 3 estrelas`}>
                {[0, 1, 2].map((i) => (
                  <Star key={i} size={30} className={i < resultado.estrelas ? 'fill-ouro text-ouro' : 'text-creme/30'} />
                ))}
              </div>
              <p className="mt-2 font-serif text-xl font-semibold italic">
                {resultado.excedeuCalorias
                  ? ingles ? 'Nutritious — but above the target' : 'Nutritivo — mas acima do alvo'
                  : resultado.estrelas === 3
                    ? ingles ? 'Balanced plate!' : 'Prato equilibrado!'
                    : resultado.estrelas >= 1
                      ? ingles ? 'Nice progress!' : 'Bom caminho!'
                      : ingles ? "Let's adjust together" : 'Vamos ajustar juntos'}
              </p>
              <p className="text-sm text-creme/80">
                {resultado.pontuacao} {ingles ? 'points' : 'pontos'} · {totais.kcal} kcal · {totais.prot} g {ingles ? 'protein' : 'proteína'} · {totais.fibra} g {ingles ? 'fiber' : 'fibra'}
              </p>
              {premioDado ? (
                <p className="mt-2 inline-block rounded-full bg-ouro px-3 py-1 text-xs font-bold text-verde">+10 🌱 {ingles ? 'earned!' : 'ganhas!'}</p>
              ) : (
                <p className="mt-2 text-xs text-creme/70">
                  {resultado.missaoCumprida
                    ? ingles ? '(seeds already claimed today)' : '(sementes já resgatadas hoje)'
                    : ingles ? 'Complete the mission to earn +10 🌱' : 'Cumpra a missão para ganhar +10 🌱'}
                </p>
              )}
            </div>

            {/* O que acertou / pode melhorar */}
            <div className="mt-3 space-y-1.5 rounded-2xl bg-white p-4">
              {resultado.criterios.map((c) => (
                <p key={c.id} className="flex items-start gap-2 text-xs text-verde">
                  {c.ok ? (
                    <Check size={14} className="mt-0.5 shrink-0 text-sage" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-ouro" aria-hidden="true" />
                  )}
                  {textoCriterio(c, ingles)}
                </p>
              ))}
            </div>

            {/* Lição do excesso calórico: só aparece quando o prato passa da faixa da missão */}
            {resultado.excedeuCalorias && (
              <div className="mt-3 rounded-2xl border-2 border-ouro bg-white p-4">
                <p className="flex items-center gap-2 text-xs font-bold text-verde">
                  <ScanLine size={15} className="shrink-0 text-ouro" aria-hidden="true" />
                  {ingles ? 'Why tracking matters' : 'Por que monitorar importa'}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-verde/85">{LICAO_EXCESSO[ingles ? 'en' : 'pt']}</p>
              </div>
            )}

            {/* Sugestão + micro-lição */}
            <div className="mt-3 rounded-2xl bg-ouro-claro p-4">
              <p className="flex items-start gap-2 text-xs font-medium text-verde">
                <Lightbulb size={14} className="mt-0.5 shrink-0 text-ouro" aria-hidden="true" />
                {(SUGESTOES[resultado.sugestao] ?? SUGESTOES.equilibrado)[ingles ? 'en' : 'pt']}
              </p>
              <p className="mt-2 border-t border-ouro/30 pt-2 text-[11px] italic text-verde/70">
                {ingles ? missao.ensinamentoEN : missao.ensinamento}
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setFase('montando')}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-sage/40 px-4 py-2.5 text-sm font-bold text-verde"
              >
                <RotateCcw size={14} /> {ingles ? 'Try again' : 'Tentar de novo'}
              </button>
              <button
                type="button"
                onClick={() => setFase('missoes')}
                className="flex-1 rounded-full bg-verde px-4 py-2.5 text-sm font-bold text-creme hover:bg-verde/90"
              >
                {ingles ? 'Missions' : 'Missões'}
              </button>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-verde/50">
          {ingles
            ? 'Educational content — it does not replace individual guidance from your dietitian.'
            : 'Conteúdo educativo — não substitui a orientação individual da sua nutricionista.'}
        </p>
      </div>
    </div>
  )
}
