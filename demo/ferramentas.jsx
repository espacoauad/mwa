// Demo da aba Ferramentas REAL do app — mesmo componente de produção,
// sem precisar de login. Só para desenvolvimento.
import React from 'react'
import ReactDOM from 'react-dom/client'
import './demo.css'
import { IdiomaProvider } from '../src/context/IdiomaContext.jsx'
import { DemoFerramentasProvider } from './stubs/AppContext.jsx'
import Ferramentas from '../src/components/ferramentas/Ferramentas.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdiomaProvider>
      <DemoFerramentasProvider diaAtual={20}>
        <div className="mx-auto max-w-md pb-10">
          <Ferramentas />
        </div>
      </DemoFerramentasProvider>
    </IdiomaProvider>
  </React.StrictMode>,
)
