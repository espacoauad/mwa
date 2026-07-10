import Botao from '../ui/Botao.jsx'
import { calcularMetas, OBJETIVOS } from '../../utils/calculos.js'

export default function TelaMetas({ dados, finalizar, voltar }) {
  const metas = calcularMetas({
    ...dados,
    idade: Number(dados.idade),
    peso: Number(dados.peso),
    altura: Number(dados.altura),
  })
  const objetivo = OBJETIVOS.find((o) => o.id === dados.objetivo)
  const primeiroNome = dados.nome.trim().split(' ')[0]

  const METAS_LISTA = [
    { label: 'Calorias', valor: `${metas.calorias.toLocaleString('pt-BR')} kcal`, emoji: '🔥' },
    { label: 'Proteína', valor: `${metas.proteina} g`, emoji: '🥩' },
    { label: 'Carboidratos', valor: `${metas.carboidrato} g`, emoji: '🍠' },
    { label: 'Gordura', valor: `${metas.gordura} g`, emoji: '🥑' },
    { label: 'Água', valor: `${metas.aguaL.toLocaleString('pt-BR')} L`, emoji: '💧' },
    { label: 'Fibras', valor: `${metas.fibras} g`, emoji: '🌾' },
  ]

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          Prontinho, {primeiroNome}!
        </h1>
        <p className="mt-3 text-verde/70">
          Suas metas para o objetivo <strong>{objetivo?.label.toLowerCase()}</strong> {objetivo?.emoji} foram
          calculadas.
        </p>
      </div>

      <div className="rounded-2xl bg-verde p-5 text-white">
        <p className="text-sm font-medium text-white/70">Seu metabolismo</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white/10 p-3 text-center">
            <p className="text-2xl font-bold text-ouro">{metas.tmb.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-white/70">TMB — gasto em repouso (kcal)</p>
          </div>
          <div className="rounded-lg bg-white/10 p-3 text-center">
            <p className="text-2xl font-bold text-ouro">{metas.tdee.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-white/70">TDEE — gasto total diário (kcal)</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <p className="text-sm font-semibold text-verde/60">Metas diárias do programa</p>
        <ul className="mt-3 flex flex-col divide-y divide-cinza">
          {METAS_LISTA.map((m) => (
            <li key={m.label} className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2 text-sm font-medium text-verde/80">
                <span>{m.emoji}</span> {m.label}
              </span>
              <span className="font-bold text-verde">{m.valor}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao variante="ouro" onClick={finalizar}>
          Começar meus 21 dias ✨
        </Botao>
        <Botao variante="secundario" onClick={voltar}>
          Voltar
        </Botao>
      </div>
    </>
  )
}
