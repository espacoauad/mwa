// Demo dos novos jogos educativos — só para desenvolvimento.
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import './demo.css'
import { IdiomaProvider } from '../src/context/IdiomaContext.jsx'
import { DemoAppProvider } from './stubs/AppContext.jsx'
import MonteSeuPrato from '../src/components/game/MonteSeuPrato.jsx'
import JogoVerdadeiroFalso from '../src/components/game/JogoVerdadeiroFalso.jsx'
import JogoTrocaInteligente from '../src/components/game/JogoTrocaInteligente.jsx'
import JogoBatalhaSaciedade from '../src/components/game/JogoBatalhaSaciedade.jsx'
import JogoDetetiveRotulos from '../src/components/game/JogoDetetiveRotulos.jsx'
import JogoCorridaEscolha from '../src/components/game/JogoCorridaEscolha.jsx'
import MomentoMwa from '../src/components/hoje/MomentoMwa.jsx'

const JOGOS = [
  ['prato', 'Monte Seu Prato', MonteSeuPrato],
  ['vf', 'Verdadeiro, Falso ou Depende', JogoVerdadeiroFalso],
  ['troca', 'Troca Inteligente', JogoTrocaInteligente],
  ['saciedade', 'Batalha da Saciedade', JogoBatalhaSaciedade],
  ['rotulos', 'Detetive dos Rótulos', JogoDetetiveRotulos],
  ['corrida', 'Corrida da Escolha', JogoCorridaEscolha],
  ['momento', 'Momento MWA', MomentoMwa],
]

function Demo() {
  const [aberto, setAberto] = useState(null)
  const Ativo = JOGOS.find(([id]) => id === aberto)?.[2]
  return (
    <div className="mx-auto max-w-md p-5">
      <h1 className="mb-1 font-serif text-2xl font-semibold italic text-verde">Jogos MWA — demo</h1>
      <p className="mb-4 text-sm text-verde/70">Toque para abrir cada jogo.</p>
      <div className="space-y-2">
        {JOGOS.map(([id, nome]) => (
          <button
            key={id}
            type="button"
            onClick={() => setAberto(id)}
            className="w-full rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-4 text-left font-serif text-lg font-semibold italic text-verde"
          >
            {nome}
          </button>
        ))}
      </div>
      {Ativo && <Ativo onFechar={() => setAberto(null)} />}
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdiomaProvider>
      <DemoAppProvider cenario="apagada">
        <Demo />
      </DemoAppProvider>
    </IdiomaProvider>
  </React.StrictMode>,
)
