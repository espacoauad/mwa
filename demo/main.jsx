// Harness de demonstração do Monte Seu Prato — APENAS para desenvolvimento.
// Renderiza o jogo fora do app (sem login), com a recompensa simulada via stub.
// Não entra no build de produção (config própria em vite.demo.config.js).
import React from 'react'
import ReactDOM from 'react-dom/client'
import './demo.css'
import { IdiomaProvider } from '../src/context/IdiomaContext.jsx'
import MonteSeuPrato from '../src/components/game/MonteSeuPrato.jsx'

function Demo() {
  return (
    <IdiomaProvider>
      <MonteSeuPrato onFechar={() => {}} />
    </IdiomaProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
)
