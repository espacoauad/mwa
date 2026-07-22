import { useEffect, useState } from 'react'
import { ChevronRight, Eye, Heart, CheckCircle2, X } from 'lucide-react'

const ETAPAS_CONFIG = {
  pausar: {
    titulo: 'Pausar',
    pergunta: 'O que eu estou sentindo agora?',
    descricao: 'Consciência começa quando você reconhece o que realmente está acontecendo.',
    opcoes: [
      { id: 'fome-fisica', label: 'Fome física', emoji: '🍽️' },
      { id: 'vontade-emocional', label: 'Vontade emocional', emoji: '💭' },
      { id: 'cansaco', label: 'Cansaço', emoji: '😴' },
      { id: 'ansiedade', label: 'Ansiedade', emoji: '🫨' },
      { id: 'habito-automatico', label: 'Hábito automático', emoji: '🔄' },
      { id: 'nao-sei-ainda', label: 'Não sei ainda', emoji: '❓' },
    ],
  },
  observar: {
    titulo: 'Observar',
    pergunta: 'O que meu corpo ou minha rotina realmente precisam neste momento?',
    descricao: 'Olhe além do impulso. Qual é a real necessidade?',
    opcoes: [
      { id: 'comer-nutritivo', label: 'Comer algo nutritivo', emoji: '🥗' },
      { id: 'beber-agua', label: 'Beber água', emoji: '💧' },
      { id: 'descansar', label: 'Descansar', emoji: '🛌' },
      { id: 'respirar', label: 'Respirar por 1 minuto', emoji: '🌬️' },
      { id: 'organizar-refeicao', label: 'Organizar a próxima refeição', emoji: '📋' },
      { id: 'pedir-apoio', label: 'Pedir apoio', emoji: '🤝' },
    ],
  },
  escolher: {
    titulo: 'Escolher',
    pergunta: 'Qual é a decisão mais consciente e possível agora?',
    descricao: 'Não se trata de perfeição. É sobre escolher com gentileza.',
    opcoes: [
      { id: 'escolha-leve', label: 'Fazer uma escolha mais leve', emoji: '🪶' },
      { id: 'refeicao-equilibrada', label: 'Montar uma refeição equilibrada', emoji: '⚖️' },
      { id: 'esperar-reavaliar', label: 'Esperar 10 minutos e reavaliar', emoji: '⏱️' },
      { id: 'registrar-sentimento', label: 'Registrar o que senti', emoji: '✍️' },
      { id: 'gentileza-sem-culpa', label: 'Seguir com gentileza, sem culpa', emoji: '🌿' },
    ],
  },
}

export default function LenteConsciencia({ onFechar = null }) {
  const [etapaAtual, setEtapaAtual] = useState('pausar')
  const [selecoes, setSelecoes] = useState({
    pausar: null,
    observar: null,
    escolher: null,
  })
  const [resultado, setResultado] = useState(null)

  const config = ETAPAS_CONFIG[etapaAtual]
  const etapas = ['pausar', 'observar', 'escolher']
  const indiceEtapa = etapas.indexOf(etapaAtual)
  const progresso = ((indiceEtapa + 1) / etapas.length) * 100

  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  function selecionarOpcao(opcaoId) {
    setSelecoes((prev) => ({
      ...prev,
      [etapaAtual]: opcaoId,
    }))
  }

  function avancar() {
    if (!selecoes[etapaAtual]) return

    if (indiceEtapa < etapas.length - 1) {
      setEtapaAtual(etapas[indiceEtapa + 1])
    } else {
      finalizarJornada()
    }
  }

  function voltar() {
    if (indiceEtapa > 0) {
      setEtapaAtual(etapas[indiceEtapa - 1])
    }
  }

  function finalizarJornada() {
    setResultado({
      pausar: selecoes.pausar,
      observar: selecoes.observar,
      escolher: selecoes.escolher,
    })
  }

  function reiniciar() {
    setEtapaAtual('pausar')
    setSelecoes({ pausar: null, observar: null, escolher: null })
    setResultado(null)
  }

  // Tela de resultado
  if (resultado) {
    const labelPausar = ETAPAS_CONFIG.pausar.opcoes.find((o) => o.id === resultado.pausar)?.label
    const labelObservar = ETAPAS_CONFIG.observar.opcoes.find((o) => o.id === resultado.observar)?.label
    const labelEscolher = ETAPAS_CONFIG.escolher.opcoes.find((o) => o.id === resultado.escolher)?.label

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={onFechar}>
        <div
          className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-8"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lente-resultado-titulo"
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 id="lente-resultado-titulo" className="font-serif text-2xl font-semibold italic text-verde">Sua Jornada</h2>
            {onFechar && (
              <button
                type="button"
                aria-label="Fechar"
                onClick={onFechar}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Ícone de conclusão */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-sage-claro p-6">
              <CheckCircle2 size={48} className="text-sage" strokeWidth={1.5} />
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="mb-8 text-center">
            <p className="mb-4 font-serif text-xl font-semibold italic text-verde">
              Você pausou e se escutou.
            </p>
            <p className="text-sm text-verde/80">
              Esta consciência que você acabou de demonstrar é o primeiro passo para decisões mais alinhadas com quem você é.
            </p>
          </div>

          {/* Resumo da jornada */}
          <div className="mb-8 space-y-3 rounded-xl bg-white p-4">
            <div>
              <p className="text-xs font-semibold text-verde/80">Você sentiu:</p>
              <p className="text-sm font-medium text-verde">{labelPausar}</p>
            </div>
            <div className="border-t border-cinza pt-3">
              <p className="text-xs font-semibold text-verde/80">Seu corpo/rotina pediu por:</p>
              <p className="text-sm font-medium text-verde">{labelObservar}</p>
            </div>
            <div className="border-t border-cinza pt-3">
              <p className="text-xs font-semibold text-verde/80">Sua escolha consciente foi:</p>
              <p className="text-sm font-medium text-verde">{labelEscolher}</p>
            </div>
          </div>

          {/* Micro-copy final */}
          <div className="mb-6 rounded-lg bg-sage-claro p-4 text-center">
            <p className="text-xs text-verde">
              <span className="font-semibold">"Consciência não é controle rígido."</span> É aprender a se escutar antes de agir no automático.
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={reiniciar}
              className="flex-1 rounded-full border-2 border-verde px-4 py-3 font-semibold text-verde transition-all active:scale-95"
            >
              Começar de novo
            </button>
            {onFechar && (
              <button
                type="button"
                onClick={onFechar}
                className="flex-1 rounded-full bg-verde px-4 py-3 font-semibold text-white transition-all active:scale-95"
              >
                Fechar
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Tela principal da ferramenta
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={onFechar}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lente-titulo"
      >
        {/* Header com fechar */}
        <div className="mb-6 flex items-center justify-between">
          <h1 id="lente-titulo" className="font-serif text-2xl font-semibold italic text-verde">A Lente da Consciência</h1>
          {onFechar && (
            <button
              type="button"
              aria-label="Fechar"
              onClick={onFechar}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Barra de progresso */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-xs">
            <span className="font-semibold text-verde/80">
              {ETAPAS_CONFIG[etapaAtual].titulo}
            </span>
            <span className="text-verde/80">{indiceEtapa + 1} de 3</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-verde/10"
            role="progressbar"
            aria-valuenow={indiceEtapa + 1}
            aria-valuemin={1}
            aria-valuemax={etapas.length}
            aria-label="Progresso da jornada"
          >
            <div className="h-full rounded-full bg-sage transition-all duration-300" style={{ width: `${progresso}%` }} />
          </div>
        </div>

        {/* Ícone da etapa */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-sage-claro p-4">
            {etapaAtual === 'pausar' && <Eye size={32} className="text-sage" strokeWidth={1.5} />}
            {etapaAtual === 'observar' && <Heart size={32} className="text-sage" strokeWidth={1.5} />}
            {etapaAtual === 'escolher' && <CheckCircle2 size={32} className="text-sage" strokeWidth={1.5} />}
          </div>
        </div>

        {/* Pergunta e descrição */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-serif text-xl font-semibold italic text-verde">{config.pergunta}</h2>
          <p className="text-sm text-verde/80">{config.descricao}</p>
        </div>

        {/* Opções */}
        <div className="mb-8 space-y-3">
          {config.opcoes.map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              onClick={() => selecionarOpcao(opcao.id)}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                selecoes[etapaAtual] === opcao.id
                  ? 'border-sage bg-sage-claro'
                  : 'border-cinza bg-white hover:border-sage/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="text-lg">{opcao.emoji}</span>
                  <span className="font-medium text-verde">{opcao.label}</span>
                </span>
                {selecoes[etapaAtual] === opcao.id && (
                  <CheckCircle2 size={20} className="text-sage" strokeWidth={2} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Micro-copy motivadora */}
        <div className="mb-8 rounded-lg bg-verde/5 p-4 text-center">
          <p className="text-xs text-verde/80">
            💭 <span className="font-semibold">Dica:</span> Não há resposta "correta". Há apenas a sua verdade neste momento.
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={voltar}
            disabled={indiceEtapa === 0}
            className={`flex-1 rounded-full border-2 border-verde px-4 py-3 font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              indiceEtapa === 0 ? 'text-verde/50' : 'text-verde hover:bg-verde/5'
            }`}
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={avancar}
            disabled={!selecoes[etapaAtual]}
            className="flex-1 rounded-full bg-sage px-4 py-3 font-semibold text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              {indiceEtapa === etapas.length - 1 ? 'Finalizar' : 'Continuar'}
              <ChevronRight size={18} />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
