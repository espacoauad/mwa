import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { diaAnterior, diaSeguinte, dataDentroDoIntervalo, formatarDataExtenso } from '../../utils/datas.js'
import ModalCalendario from './ModalCalendario.jsx'

export default function SeletorDeDia({ tema = 'claro' }) {
  const { ingles, locale } = useIdioma()
  const { diaVisualizado, estaVendoHoje, dataInicioPrograma, hoje, mudarDiaVisualizado, voltarParaHoje } = useApp()
  const [calendarioAberto, setCalendarioAberto] = useState(false)

  const anterior = diaAnterior(diaVisualizado)
  const seguinte = diaSeguinte(diaVisualizado)
  const podeVoltar = dataDentroDoIntervalo(anterior, dataInicioPrograma, hoje)
  const podeAvancar = dataDentroDoIntervalo(seguinte, dataInicioPrograma, hoje)

  const corTexto = tema === 'escuro' ? 'text-white/60' : 'text-verde/60'
  const corIcone = tema === 'escuro' ? 'text-white/50' : 'text-verde/50'
  const corIconeDesabilitado = tema === 'escuro' ? 'text-white/15' : 'text-verde/15'

  return (
    <div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => mudarDiaVisualizado(anterior)}
          disabled={!podeVoltar}
          aria-label={ingles ? 'Previous day' : 'Dia anterior'}
          className="flex min-h-11 min-w-11 items-center justify-center disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} className={podeVoltar ? corIcone : corIconeDesabilitado} />
        </button>
        <button
          type="button"
          onClick={() => setCalendarioAberto(true)}
          className={`flex-1 truncate text-center text-sm capitalize ${corTexto}`}
        >
          {formatarDataExtenso(diaVisualizado, locale)}
        </button>
        <button
          type="button"
          onClick={() => mudarDiaVisualizado(seguinte)}
          disabled={!podeAvancar}
          aria-label={ingles ? 'Next day' : 'Próximo dia'}
          className="flex min-h-11 min-w-11 items-center justify-center disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} className={podeAvancar ? corIcone : corIconeDesabilitado} />
        </button>
      </div>

      {!estaVendoHoje && (
        <div className="mt-1 flex items-center gap-2 rounded-full bg-ouro-claro px-3 py-1.5 text-xs font-semibold text-verde">
          <CalendarDays size={12} className="shrink-0" />
          <span className="truncate">
            {ingles ? 'Viewing a past day' : 'Vendo um dia passado'}
          </span>
          <button type="button" onClick={voltarParaHoje} className="ml-auto shrink-0 underline">
            {ingles ? 'Back to today' : 'Voltar para hoje'}
          </button>
        </div>
      )}

      {calendarioAberto && (
        <ModalCalendario
          diaSelecionado={diaVisualizado}
          dataMin={dataInicioPrograma}
          dataMax={hoje}
          onEscolher={(data) => {
            mudarDiaVisualizado(data)
            setCalendarioAberto(false)
          }}
          onFechar={() => setCalendarioAberto(false)}
        />
      )}
    </div>
  )
}
