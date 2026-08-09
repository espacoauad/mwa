import { X, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { TIPOS_REFEICAO } from '../../utils/calculos.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const REFEICOES_EN = {
  'Café da manhã': 'Breakfast', 'Lanche da manhã': 'Morning snack', Almoço: 'Lunch',
  'Lanche da tarde': 'Afternoon snack', Jantar: 'Dinner', Ceia: 'Evening snack',
}

export default function ModalEscolherRefeicao() {
  const { ingles } = useIdioma()
  const { refeicoesHoje, abrirRefeicaoDoDia, fecharModalRefeicao } = useApp()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={fecharModalRefeicao}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-escolher-refeicao-titulo"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-escolher-refeicao-titulo" className="font-serif text-xl font-semibold italic text-verde">
            {ingles ? 'Which meal?' : 'Qual refeição?'}
          </h2>
          <button type="button" aria-label={ingles ? 'Close' : 'Fechar'} onClick={fecharModalRefeicao} className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"><X size={18} /></button>
        </div>
        <ul className="flex flex-col gap-2">
          {TIPOS_REFEICAO.map((tipo) => {
            const jaLancada = refeicoesHoje.some((r) => r.tipo === tipo)
            return (
              <li key={tipo}>
                <button
                  type="button"
                  onClick={() => abrirRefeicaoDoDia(tipo)}
                  className="flex w-full items-center justify-between rounded-lg border-2 border-sage/30 bg-white px-4 py-3.5 text-left font-medium text-verde outline-none hover:border-sage"
                >
                  <span>{ingles ? REFEICOES_EN[tipo] : tipo}</span>
                  {jaLancada && <Check size={18} className="text-sage" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
