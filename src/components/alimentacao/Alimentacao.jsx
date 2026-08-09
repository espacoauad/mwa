// src/components/alimentacao/Alimentacao.jsx
import { useState } from 'react'
import { Plus, Trash2, Camera, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { totaisDaRefeicao } from '../../utils/refeicoes.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const REFEICOES_EN = {
  'Café da manhã': 'Breakfast', 'Lanche da manhã': 'Morning snack', Almoço: 'Lunch',
  'Lanche da tarde': 'Afternoon snack', Jantar: 'Dinner', Ceia: 'Evening snack',
}

export default function Alimentacao() {
  const { refeicoesHoje, totaisHoje, metas, removerRefeicaoCompleta, abrirEscolhaRefeicao, abrirRefeicaoDoDia } = useApp()
  const { ingles, locale } = useIdioma()
  const [expandida, setExpandida] = useState(null)

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Today’s nutrition' : 'Alimentação de hoje'}</h1>
      <p className="mt-1 text-sm text-verde/60">
        {totaisHoje.calorias.toLocaleString(locale)} {ingles ? 'of' : 'de'} {metas.calorias.toLocaleString(locale)} kcal ·{' '}
        {refeicoesHoje.length} {refeicoesHoje.length === 1 ? (ingles ? 'meal' : 'refeição') : (ingles ? 'meals' : 'refeições')}
      </p>

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
            <p className="text-[10px] font-medium text-verde/80">{x.label} / {x.m.toLocaleString(locale)}</p>
          </div>
        ))}
      </div>

      {refeicoesHoje.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">🍽️</span>
          <p className="font-medium text-verde/60">{ingles ? 'No meals logged today.' : 'Nenhuma refeição registrada hoje.'}</p>
          <p className="text-sm text-verde/80">{ingles ? 'Tap the button below to add your first one!' : 'Toque no botão abaixo para adicionar a primeira!'}</p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {refeicoesHoje.map((r) => {
            const totais = totaisDaRefeicao(r)
            const aberta = expandida === r.id
            return (
              <li key={r.id} className="rounded-2xl bg-white shadow-sm shadow-verde/5">
                <button type="button" onClick={() => setExpandida(aberta ? null : r.id)} className="flex w-full items-center gap-3 p-4 text-left">
                  {r.fotoUrl ? (
                    <img src={r.fotoUrl} alt={r.tipo} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-sage-claro text-sage"><Camera size={22} /></span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-sage">{r.tipo} · {r.horario}</p>
                    <p className="font-semibold text-verde">{totais.calorias} kcal · P {totais.proteina}g · C {totais.carbos}g · G {totais.gordura}g</p>
                    <p className="text-[11px] text-verde/60">{r.itens.length} {r.itens.length === 1 ? (ingles ? 'food' : 'alimento') : (ingles ? 'foods' : 'alimentos')}</p>
                  </div>
                  <ChevronDown size={18} className={`shrink-0 text-verde/40 transition-transform ${aberta ? 'rotate-180' : ''}`} />
                </button>
                {aberta && (
                  <div className="border-t border-cinza px-4 pb-4 pt-3">
                    <ul className="flex flex-col gap-1.5">
                      {r.itens.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-sm text-verde/80">
                          <span className="truncate">{item.nome}</span>
                          <span className="shrink-0 text-verde/60">{item.calorias} kcal</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => abrirRefeicaoDoDia(r.tipo)} className="flex items-center gap-1 text-sm font-semibold text-sage"><Plus size={14} /> {ingles ? 'Add food' : 'Adicionar alimento'}</button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmado = window.confirm(ingles ? `Delete the whole "${r.tipo}" meal?` : `Excluir a refeição "${r.tipo}" inteira?`)
                          if (confirmado) removerRefeicaoCompleta(r.id)
                        }}
                        className="ml-auto flex items-center gap-1 text-sm font-semibold text-red-700"
                      >
                        <Trash2 size={14} /> {ingles ? 'Delete' : 'Excluir'}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={abrirEscolhaRefeicao}
        className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ouro px-5 py-3.5 font-semibold text-verde-escuro shadow-lg shadow-ouro/40 transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={20} strokeWidth={2.5} /> {ingles ? 'Add meal' : 'Adicionar refeição'}
      </button>
    </div>
  )
}
