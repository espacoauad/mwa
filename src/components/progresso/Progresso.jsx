import { useState } from 'react'
import { Scale, Camera, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import GraficoPeso from './GraficoPeso.jsx'
import ModalPesagem from './ModalPesagem.jsx'
import Botao from '../ui/Botao.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function Progresso() {
  const { ingles, locale } = useIdioma()
  const { usuario, pesagens, diaAtual } = useApp()
  const [modalAberto, setModalAberto] = useState(false)
  const [pesagemEmEdicao, setPesagemEmEdicao] = useState(null)

  const pontos = [
    { rotulo: ingles ? 'Start' : 'Início', peso: usuario.peso },
    ...pesagens.map((p) => ({ rotulo: `${ingles ? 'Wk' : 'Sem'} ${p.semana}`, peso: p.peso })),
  ]

  const pesoAtual = pontos[pontos.length - 1].peso
  const variacao = Math.round((pesoAtual - usuario.peso) * 10) / 10
  const proximaSemana = pesagens.length + 1
  const diaPesagem = diaAtual >= proximaSemana * 7
  const programaCompleto = pesagens.length >= 3

  const IconeVariacao = variacao < 0 ? TrendingDown : variacao > 0 ? TrendingUp : Minus

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Your progress' : 'Seu progresso'}</h1>
      <p className="mt-1 text-sm text-verde/60">{ingles ? 'Weigh-ins and photos every 7 days — compare like with like.' : 'Pesagem e fotos a cada 7 dias — compare o comparável.'}</p>

      {/* Resumo do peso */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: ingles ? 'Starting weight' : 'Peso inicial', valor: `${usuario.peso.toLocaleString(locale)} kg` },
          { label: ingles ? 'Current weight' : 'Peso atual', valor: `${pesoAtual.toLocaleString(locale)} kg` },
          {
            label: ingles ? 'Change' : 'Variação',
            valor: `${variacao > 0 ? '+' : ''}${variacao.toLocaleString(locale)} kg`,
            icone: true,
          },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 text-center shadow-sm shadow-verde/5">
            <p className="flex items-center justify-center gap-1 text-lg font-bold text-verde">
              {c.icone && <IconeVariacao size={16} className={variacao < 0 ? 'text-sage' : 'text-ouro'} />}
              {c.valor}
            </p>
            <p className="text-[10px] font-medium text-verde/80">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="mb-2 text-sm font-semibold text-verde/60">{ingles ? 'Weight trend (kg)' : 'Evolução do peso (kg)'}</h2>
        <GraficoPeso pontos={pontos} />
      </div>

      {/* Chamada para pesagem */}
      {!programaCompleto && (
        <div className={`mt-4 rounded-2xl p-5 ${diaPesagem ? 'bg-ouro-claro' : 'bg-white shadow-sm shadow-verde/5'}`}>
          <h2 className="flex items-center gap-2 font-semibold text-verde">
            <Scale size={18} className="text-sage" />
            {diaPesagem ? (ingles ? `Week ${proximaSemana}: weigh-in day! 📸` : `Semana ${proximaSemana}: dia de pesagem! 📸`) : (ingles ? `Next weigh-in: day ${proximaSemana * 7}` : `Próxima pesagem: dia ${proximaSemana * 7}`)}
          </h2>
          <p className="mt-1 text-sm text-verde/70">
            {diaPesagem
              ? (ingles ? 'Weigh yourself before eating and take 4 photos: front, back, and both sides.' : 'Pese-se em jejum e tire as 4 fotos (frente, costas e laterais).')
              : (ingles ? 'You may log it earlier if you prefer — the key is to keep the same conditions.' : 'Você pode registrar antes se preferir — o importante é manter as mesmas condições.')}
          </p>
          <div className="mt-3">
            <Botao variante={diaPesagem ? 'ouro' : 'secundario'} onClick={() => setModalAberto(true)}>
              {ingles ? `Log week ${proximaSemana} weigh-in` : `Registrar pesagem da semana ${proximaSemana}`}
            </Botao>
          </div>
        </div>
      )}

      {/* Histórico */}
      {pesagens.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 pb-4">
          <h2 className="text-sm font-semibold text-verde/60">{ingles ? 'History' : 'Histórico'}</h2>
          {pesagens.map((p, i) => {
            const pesoAnterior = i === 0 ? usuario.peso : pesagens[i - 1].peso
            const delta = Math.round((p.peso - pesoAnterior) * 10) / 10
            const fotos = [p.fotos?.frente, p.fotos?.costas, p.fotos?.latEsq, p.fotos?.latDir].filter(Boolean)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPesagemEmEdicao(p)}
                className="w-full rounded-2xl bg-white p-4 text-left shadow-sm shadow-verde/5 transition-transform active:scale-[0.99]"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-verde">{ingles ? 'Week' : 'Semana'} {p.semana}</p>
                  <p className="text-sm text-verde/60">
                    <strong className="text-verde">{p.peso.toLocaleString(locale)} kg</strong>{' '}
                    <span className={delta <= 0 ? 'text-sage' : 'text-ouro'}>
                      ({delta > 0 ? '+' : ''}
                      {delta.toLocaleString(locale)})
                    </span>
                  </p>
                </div>
                {fotos.length > 0 ? (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {fotos.map((f, j) => (
                      <img key={j} src={f} alt={ingles ? `Photo ${j + 1} from week ${p.semana}` : `Foto ${j + 1} da semana ${p.semana}`} className="aspect-[3/4] w-full rounded-lg object-cover" />
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 flex items-center gap-1 text-xs text-verde/80">
                    <Camera size={12} /> {ingles ? 'No photos this week' : 'Sem fotos nesta semana'}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      )}

      {programaCompleto && (
        <div className="mt-4 rounded-2xl bg-verde p-5 text-center text-white">
          <p className="text-2xl">🏆</p>
          <p className="mt-1 font-serif text-lg font-semibold italic">{ingles ? 'Program completed!' : 'Programa completo!'}</p>
          <p className="mt-1 text-sm text-white/70">
            {ingles ? 'Talk to your nutritionist to plan your next phase.' : 'Fale com a nutricionista para planejar sua próxima fase.'}
          </p>
        </div>
      )}

      {modalAberto && <ModalPesagem semana={proximaSemana} onFechar={() => setModalAberto(false)} />}
      {pesagemEmEdicao && (
        <ModalPesagem pesagemExistente={pesagemEmEdicao} onFechar={() => setPesagemEmEdicao(null)} />
      )}
    </div>
  )
}
