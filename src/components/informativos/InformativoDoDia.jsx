import { Sparkles } from 'lucide-react'
import { linkCompraUpgrade, linkSessao } from '../../utils/ofertas.js'

const TONS = {
  bom: { borda: 'border-sage', badge: 'bg-sage text-white' },
  ruim: { borda: 'border-[#B0563C]/50', badge: 'bg-[#B0563C] text-white' },
  neutro: { borda: 'border-ouro', badge: 'bg-ouro text-verde-escuro' },
}

function CaixaComparacao({ opcao }) {
  const tom = TONS[opcao.tom] ?? TONS.neutro
  return (
    <div className={`rounded-xl border-2 bg-white p-4 ${tom.borda}`}>
      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tom.badge}`}>
        {opcao.nome}
      </span>
      <ul className="mt-3 flex flex-col gap-1.5">
        {opcao.itens.map(([rotulo, valor], i) => (
          <li key={i} className="flex items-baseline justify-between gap-2 text-xs">
            <span className="text-verde/60">{rotulo}</span>
            <span className="text-right font-semibold text-verde">{valor}</span>
          </li>
        ))}
      </ul>
      {opcao.total && (
        <p className="mt-2 border-t border-cinza pt-2 text-xs font-bold text-verde">{opcao.total}</p>
      )}
      {opcao.extras?.map((e, i) => (
        <p key={i} className="mt-1 text-[11px] font-medium text-verde/70">
          {e}
        </p>
      ))}
    </div>
  )
}

// Card do informativo diário: comparação visual A vs B (+ C) com dica e CTA
export default function InformativoDoDia({ informativo, dia, irPara }) {
  const duasColunas = informativo.opcoes.length === 2

  function acaoCta() {
    if (informativo.cta.tipo === 'progresso') irPara?.('progresso')
    else if (informativo.cta.tipo === 'sessao') window.open(linkSessao(dia), '_blank', 'noopener')
    else window.open(linkCompraUpgrade(dia), '_blank', 'noopener')
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-verde shadow-sm shadow-verde/10">
      <div className="p-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Informativo · Dia {informativo.dia} de 21
        </p>
        <p className="mt-2 text-4xl">{informativo.emoji}</p>
        <h2 className="mt-2 font-serif text-xl font-semibold italic leading-snug text-ouro">
          {informativo.titulo}
        </h2>
      </div>

      <div className="bg-creme p-4">
        <div className={`grid gap-3 ${duasColunas ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {informativo.opcoes.map((op, i) => (
            <CaixaComparacao key={i} opcao={op} />
          ))}
        </div>

        <div className="mt-3 rounded-xl bg-ouro p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-verde-escuro/70">
            <Sparkles size={13} /> Dica do dia
          </p>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-verde-escuro">{informativo.dica}</p>
        </div>

        {informativo.cta && (
          <button
            type="button"
            onClick={acaoCta}
            className="mt-3 w-full rounded-lg bg-verde px-6 py-4 font-semibold text-white transition-all hover:bg-verde-escuro active:scale-[0.98]"
          >
            {informativo.cta.label} →
          </button>
        )}
      </div>
    </article>
  )
}
