import { Plus, Pencil, Trash2, Camera } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function Alimentacao() {
  const { refeicoesHoje, totaisHoje, metas, removerRefeicao, abrirModalRefeicao } = useApp()
  const { ingles, locale } = useIdioma()

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Today’s nutrition' : 'Alimentação de hoje'}</h1>
      <p className="mt-1 text-sm text-verde/60">
        {totaisHoje.calorias.toLocaleString(locale)} {ingles ? 'of' : 'de'} {metas.calorias.toLocaleString(locale)} kcal ·{' '}
        {refeicoesHoje.length} {refeicoesHoje.length === 1 ? (ingles ? 'meal' : 'refeição') : (ingles ? 'meals' : 'refeições')}
      </p>

      {/* Barra de macros consumidos */}
      <div className="mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-white p-4 text-center shadow-sm shadow-verde/5">
        {[
          { label: 'Kcal', v: totaisHoje.calorias, m: metas.calorias },
          { label: ingles ? 'Prot' : 'Prot', v: totaisHoje.proteina, m: metas.proteina },
          { label: 'Carb', v: totaisHoje.carbos, m: metas.carboidrato },
          { label: ingles ? 'Fat' : 'Gord', v: totaisHoje.gordura, m: metas.gordura },
          { label: ingles ? 'Fiber' : 'Fibra', v: totaisHoje.fibras, m: metas.fibras },
        ].map((x) => (
          <div key={x.label}>
            <p className="text-lg font-bold text-verde">{x.v.toLocaleString(locale)}</p>
            <p className="text-[10px] font-medium text-verde/50">
              {x.label} / {x.m.toLocaleString(locale)}
            </p>
          </div>
        ))}
      </div>

      {/* Lista de refeições */}
      {refeicoesHoje.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">🍽️</span>
          <p className="font-medium text-verde/60">{ingles ? 'No meals logged today.' : 'Nenhuma refeição registrada hoje.'}</p>
          <p className="text-sm text-verde/40">{ingles ? 'Tap the button below to add your first one!' : 'Toque no botão abaixo para adicionar a primeira!'}</p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {refeicoesHoje.map((r) => (
            <li key={r.id} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm shadow-verde/5">
              {r.fotoUrl ? (
                <img src={r.fotoUrl} alt={r.nome} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-sage-claro text-sage">
                  <Camera size={22} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-sage">
                  {r.tipo} · {r.horario}
                </p>
                <p className="truncate font-semibold text-verde">{r.nome}</p>
                {r.quantidade && (
                  <p className="text-[11px] text-verde/45">
                    {r.quantidade} {r.medidaNome ?? r.unidadeBase ?? 'g'}
                  </p>
                )}
                <p className="text-xs text-verde/60">
                  {r.calorias} kcal · P {r.proteina}g · C {r.carbos}g · G {r.gordura}g
                </p>
              </div>
              <div className="flex flex-col justify-center gap-1.5">
                <button
                  type="button"
                  aria-label={`${ingles ? 'Edit' : 'Editar'} ${r.nome}`}
                  onClick={() => abrirModalRefeicao(r)}
                  className="rounded-md p-1.5 text-verde/40 transition-colors hover:bg-sage-claro hover:text-verde"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`${ingles ? 'Delete' : 'Excluir'} ${r.nome}`}
                  onClick={() => removerRefeicao(r.id)}
                  className="rounded-md p-1.5 text-verde/40 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => abrirModalRefeicao()}
        className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ouro px-5 py-3.5 font-semibold text-verde-escuro shadow-lg shadow-ouro/40 transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={20} strokeWidth={2.5} /> {ingles ? 'Add meal' : 'Adicionar refeição'}
      </button>
    </div>
  )
}
