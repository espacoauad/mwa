import { useEffect, useRef } from 'react'
import { X, RotateCcw, Star, Flame, Check, Trophy } from 'lucide-react'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { useConfeti } from '../../hooks/useConfeti.js'
import { mensagemFinal } from '../../utils/jogos/rodada.js'

// Moldura comum aos jogos de rodada (V/F/Depende, Troca, Saciedade, Rótulos).
// Cuida do modal acessível, identidade visual do jogo, placar e tela final —
// cada jogo só implementa o próprio miolo.
//
// O placar é uma fileira de pontos, não uma barra: mostra progresso E desempenho
// ao mesmo tempo, que é o que dá leitura de jogo em vez de formulário.

export default function MolduraJogo({
  titulo,
  tituloEN,
  subtitulo,
  subtituloEN,
  Icone,
  acento = 'bg-sage-claro', // cor do selo do jogo — sempre clara, para o ícone verde ler bem
  onFechar,
  indice,
  total,
  acertos,
  historico = [],
  sequencia = 0,
  fim,
  premioDado,
  sementes = 10,
  onJogarDeNovo,
  children,
}) {
  const { ingles } = useIdioma()
  const { celebrar } = useConfeti()
  const dialogRef = useRef(null)
  const celebrouRef = useRef(false)
  const idTitulo = `jogo-${(tituloEN ?? titulo).replace(/\s+/g, '-').toLowerCase()}`

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

  const estrelas = total > 0 ? Math.min(3, Math.max(0, Math.round((acertos / total) * 3))) : 0
  const mensagem = mensagemFinal(acertos, total)[ingles ? 'en' : 'pt']

  // Celebra uma única vez, e só quando o desempenho merece
  useEffect(() => {
    if (!fim || celebrouRef.current) return
    celebrouRef.current = true
    if (estrelas >= 2 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) celebrar()
  }, [fim])

  useEffect(() => {
    if (!fim) celebrouRef.current = false
  }, [fim])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-verde/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={idTitulo}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="max-h-[92vh] w-full max-w-md overflow-hidden rounded-3xl bg-creme outline-none"
      >
        <div className="max-h-[92vh] overflow-y-auto">
          {/* Cabeçalho: fundo verde sempre (contraste garantido), cor do jogo no selo */}
          <div className="bg-verde px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {Icone && (
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-verde ${acento}`}>
                    <Icone size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <h2 id={idTitulo} className="font-serif text-lg font-semibold italic leading-tight text-creme">
                    {ingles ? tituloEN : titulo}
                  </h2>
                  <p className="text-[11px] text-creme/70">{ingles ? subtituloEN : subtitulo}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onFechar}
                aria-label={ingles ? 'Close' : 'Fechar'}
                className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-creme/15 text-creme hover:bg-creme/25"
              >
                <X size={18} />
              </button>
            </div>

            {/* Placar: um ponto por pergunta, com o resultado de cada uma */}
            {!fim && total > 0 && (
              <div className="mt-3 flex items-center justify-between gap-3">
                <ul
                  className="flex flex-wrap gap-1.5"
                  aria-label={ingles ? 'Round scoreboard' : 'Placar da rodada'}
                >
                  {Array.from({ length: total }).map((_, i) => {
                    const resultado = historico[i]
                    const atual = i === indice
                    return (
                      <li
                        key={i}
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          resultado === 'acerto'
                            ? 'bg-ouro text-verde'
                            : resultado === 'aprendizado'
                              ? 'bg-creme/70 text-verde'
                              : atual
                                ? 'bg-creme/30 text-creme ring-2 ring-creme'
                                : 'bg-creme/15 text-creme/50'
                        }`}
                      >
                        {resultado === 'acerto' ? (
                          <Check size={11} strokeWidth={3.5} aria-hidden="true" />
                        ) : (
                          i + 1
                        )}
                        <span className="sr-only">
                          {resultado === 'acerto'
                            ? ingles ? 'correct' : 'acertou'
                            : resultado === 'aprendizado'
                              ? ingles ? 'learned' : 'aprendeu'
                              : ingles ? 'pending' : 'pendente'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                {sequencia >= 2 && (
                  <span
                    className="flex shrink-0 items-center gap-1 rounded-full bg-ouro px-2 py-0.5 text-[11px] font-bold text-verde"
                    role="status"
                    aria-live="polite"
                  >
                    <Flame size={12} aria-hidden="true" /> {sequencia}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Miolo do jogo ou tela final */}
          <div className="p-5">
            {fim ? (
              <div className="text-center" role="status" aria-live="polite">
                <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center">
                  <span className={`mwa-medalha absolute inset-0 rounded-full ${acento}`} aria-hidden="true" />
                  <Trophy size={34} className="relative text-verde" strokeWidth={1.5} aria-hidden="true" />
                </div>

                <div
                  className="flex justify-center gap-1.5"
                  aria-label={`${estrelas} ${ingles ? 'of 3 stars' : 'de 3 estrelas'}`}
                >
                  {[0, 1, 2].map((i) => (
                    <Star
                      key={i}
                      size={26}
                      className={i < estrelas ? 'fill-ouro text-ouro' : 'text-cinza'}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <p className="mt-3 font-serif text-2xl font-semibold italic text-verde">
                  {acertos}/{total}
                </p>
                <p className="mx-auto mt-1 max-w-[280px] text-sm leading-relaxed text-verde/75">{mensagem}</p>

                {premioDado ? (
                  <p className="mt-3 inline-block rounded-full bg-ouro px-4 py-1.5 text-sm font-bold text-verde">
                    +{sementes} 🌱 {ingles ? 'earned!' : 'ganhas!'}
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-verde/50">
                    {ingles ? '(seeds already claimed today)' : '(sementes já resgatadas hoje)'}
                  </p>
                )}

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={onJogarDeNovo}
                    className="inline-flex items-center gap-2 rounded-full bg-verde px-6 py-3 text-sm font-bold text-creme transition-transform active:scale-[0.98]"
                  >
                    <RotateCcw size={15} /> {ingles ? 'New round' : 'Nova rodada'}
                  </button>
                </div>
              </div>
            ) : (
              children
            )}

            <p className="mt-4 text-center text-[11px] text-verde/50">
              {ingles
                ? 'Educational content — it does not replace individual guidance from your dietitian.'
                : 'Conteúdo educativo — não substitui a orientação individual da sua nutricionista.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
