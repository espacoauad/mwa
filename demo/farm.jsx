// Demo da MWA FARM — mostra a fazenda em vários dias da jornada lado a lado,
// para verificar visualmente a progressão de crescimento. Só para desenvolvimento.
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './demo.css'
import { IdiomaProvider } from '../src/context/IdiomaContext.jsx'
import { DemoFarmProvider } from './stubs/AppContext.jsx'
import MwaFarm from '../src/components/game/MwaFarm.jsx'

const DIAS_DE_EXEMPLO = [1, 11, 15, 30, 60, 89]

function Demo() {
  const [dia, setDia] = useState(1)
  const [aberto, setAberto] = useState(false)

  return (
    <div className="mx-auto max-w-md space-y-3 p-5">
      <p className="text-sm font-semibold text-verde">Escolha o dia da jornada:</p>
      <div className="flex flex-wrap gap-2">
        {DIAS_DE_EXEMPLO.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDia(d)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              dia === d ? 'bg-verde text-creme' : 'bg-white text-verde'
            }`}
          >
            Dia {d}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setAberto(true)}
        className="w-full rounded-2xl bg-verde px-4 py-3 font-semibold text-creme"
      >
        Ver Fazenda do Dia {dia}
      </button>
      {aberto && (
        <DemoFarmProvider diaAtual={dia}>
          <MwaFarm onFechar={() => setAberto(false)} />
        </DemoFarmProvider>
      )}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdiomaProvider>
      <Demo />
    </IdiomaProvider>
  </React.StrictMode>,
)
