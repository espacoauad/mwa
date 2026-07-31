// Demo visual do card Estrelas do Dia — só para desenvolvimento.
import React from 'react'
import ReactDOM from 'react-dom/client'
import './demo.css'
import { IdiomaProvider } from '../src/context/IdiomaContext.jsx'
import { DemoAppProvider } from './stubs/AppContext.jsx'
import EstrelasDoDia from '../src/components/hoje/EstrelasDoDia.jsx'

const CENARIOS = [
  ['apagada', 'Meio da semana · estrela de hoje ainda apagada'],
  ['acesa', 'Estrela de hoje conquistada'],
  ['completa', 'Constelação da semana completa'],
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdiomaProvider>
      <div className="mx-auto max-w-md space-y-3 p-5">
        {CENARIOS.map(([cenario, titulo]) => (
          <div key={cenario} className="space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-verde/50">{titulo}</p>
            <DemoAppProvider cenario={cenario}>
              <EstrelasDoDia />
            </DemoAppProvider>
          </div>
        ))}
      </div>
    </IdiomaProvider>
  </React.StrictMode>,
)
