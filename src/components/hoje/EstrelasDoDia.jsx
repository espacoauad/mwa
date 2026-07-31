import { Star, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { METAS_ESTRELA, mensagemLembrete, constelacaoCompleta } from '../../utils/jogos/estrelas.js'

const INICIAIS = { 'pt-BR': ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'], 'en-US': ['M', 'T', 'W', 'T', 'F', 'S', 'S'] }

// Card do topo da aba Hoje: a estrela de hoje e a constelação da semana.
// A regra cabe numa frase — entre todo dia, cumpra 2 tarefinhas, acenda a estrela.
export default function EstrelasDoDia() {
  const { ingles } = useIdioma()
  const { metasEstrela, semanaEstrelas, estrelaHojeAcesa } = useApp()

  if (!semanaEstrelas?.length) return null

  const fechada = constelacaoCompleta(semanaEstrelas)
  const acesas = semanaEstrelas.filter((d) => d.acesa).length
  const mensagem = mensagemLembrete(metasEstrela, fechada)[ingles ? 'en' : 'pt']
  const iniciais = INICIAIS[ingles ? 'en-US' : 'pt-BR']

  return (
    <section
      className={`rounded-2xl bg-verde p-4 ${fechada ? 'ring-2 ring-ouro' : ''}`}
      aria-labelledby="estrelas-titulo"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id="estrelas-titulo" className="font-serif text-base font-semibold italic text-creme">
            {ingles ? 'Daily Stars' : 'Estrelas do Dia'}
          </h2>
          <p className="mt-0.5 text-xs text-creme/75" role="status" aria-live="polite">
            {mensagem}
          </p>
        </div>
        <p className="shrink-0 text-right">
          <span className="font-serif text-2xl font-semibold text-ouro">{acesas}</span>
          <span className="text-xs text-creme/60">/7</span>
        </p>
      </div>

      {/* Constelação da semana */}
      <ul className="mt-3 flex justify-between gap-1" aria-label={ingles ? 'Week stars' : 'Estrelas da semana'}>
        {semanaEstrelas.map((dia, i) => (
          <li key={dia.data} className="flex flex-1 flex-col items-center gap-1">
            <Star
              size={22}
              aria-hidden="true"
              className={
                dia.acesa
                  ? 'fill-ouro text-ouro'
                  : dia.hoje
                    ? 'animate-pulse text-creme/70 motion-reduce:animate-none'
                    : 'text-creme/25'
              }
            />
            <span className={`text-[10px] ${dia.hoje ? 'font-bold text-creme' : 'text-creme/50'}`}>{iniciais[i]}</span>
            <span className="sr-only">
              {dia.data} — {dia.acesa ? (ingles ? 'star earned' : 'estrela conquistada') : ingles ? 'not yet' : 'ainda não'}
            </span>
          </li>
        ))}
      </ul>

      {/* Micro-metas de hoje (some quando a estrela já está acesa) */}
      {!estrelaHojeAcesa && (
        <ul className="mt-3 space-y-1 border-t border-creme/15 pt-3">
          {METAS_ESTRELA.map((meta) => {
            const feita = metasEstrela[meta.id]
            return (
              <li key={meta.id} className="flex items-center gap-2 text-xs">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                    feita ? 'bg-ouro text-verde' : 'border border-creme/30'
                  }`}
                  aria-hidden="true"
                >
                  {feita && <Check size={10} strokeWidth={3} />}
                </span>
                <span className={feita ? 'text-creme/60 line-through' : 'text-creme/90'}>
                  {ingles ? meta.en : meta.pt}
                </span>
              </li>
            )
          })}
          <li className="pt-1 text-[11px] text-creme/50">
            {ingles ? 'Two of the three light up your star.' : 'Duas das três já acendem a sua estrela.'}
          </li>
        </ul>
      )}
    </section>
  )
}
