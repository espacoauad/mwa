import { useEffect, useState } from 'react'
import { Lock, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { DICAS_90 } from '../../data/dicas90.js'
import { INFORMATIVOS } from '../../data/informativos.js'
import { linkWhatsApp } from '../../utils/ofertas.js'
import InformativoDoDia from '../informativos/InformativoDoDia.jsx'

export default function Dicas({ irPara }) {
  const { diaAtual, marcarDicaLida } = useApp()
  const [diaAberto, setDiaAberto] = useState(diaAtual)
  const [secao, setSecao] = useState('informativo')

  // +10 🌱 ao abrir a dica do dia atual (só conta 1x por dia)
  useEffect(() => {
    if (diaAberto === diaAtual) {
      marcarDicaLida(diaAtual)
    }
  }, [diaAberto, diaAtual])

  const dica = DICAS_90.find((d) => d.dia === diaAberto)
  const informativo = INFORMATIVOS.find((i) => i.dia === diaAberto)

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">Conteúdo do programa</h1>
      <p className="mt-1 text-sm text-verde/60">
        Um informativo e uma dica novos por dia. Você está no dia {diaAtual}.
      </p>

      {/* Seletor de dias */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {DICAS_90.map((d) => {
          const bloqueada = d.dia > diaAtual
          const ativa = d.dia === diaAberto
          return (
            <button
              key={d.dia}
              type="button"
              disabled={bloqueada}
              onClick={() => setDiaAberto(d.dia)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                ativa
                  ? 'border-verde bg-verde text-white'
                  : bloqueada
                    ? 'border-cinza bg-white text-verde/25'
                    : 'border-sage/40 bg-white text-verde hover:border-sage'
              }`}
            >
              {bloqueada ? <Lock size={13} /> : d.dia}
            </button>
          )
        })}
      </div>

      {/* Alternância informativo / dica */}
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg bg-cinza p-1">
        {[
          { id: 'informativo', label: '📊 Informativo' },
          { id: 'dica', label: '💡 Dica educativa' },
        ].map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => setSecao(op.id)}
            className={`rounded-md py-2 text-sm font-semibold transition-colors ${
              secao === op.id ? 'bg-white text-verde shadow-sm' : 'text-verde/50'
            }`}
          >
            {op.label}
          </button>
        ))}
      </div>

      <div className="mt-4 pb-4">
        {secao === 'informativo' && informativo && (
          <InformativoDoDia informativo={informativo} dia={diaAtual} irPara={irPara} />
        )}

        {secao === 'dica' && dica && (
          <article className="rounded-2xl bg-white p-6 shadow-sm shadow-verde/5">
            <span className="inline-block rounded-full bg-sage-claro px-3 py-1 text-xs font-semibold text-verde">
              Dia {dica.dia} · {dica.tema}
            </span>
            <h2 className="mt-3 flex items-start gap-2 font-serif text-xl font-semibold italic leading-snug text-verde">
              <span className="text-2xl not-italic">{dica.icone}</span> {dica.titulo}
            </h2>
            <p className="mt-3 leading-relaxed text-verde/80">{dica.conteudo}</p>

            <div className="mt-4 rounded-lg bg-ouro-claro p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-verde/60">
                <Sparkles size={13} /> Dica prática
              </p>
              <p className="mt-1 text-sm font-medium text-verde">{dica.dicaPratica}</p>
            </div>

            {dica.produto && (
              <div className="mt-3 rounded-lg border-2 border-sage/25 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-sage">🌿 Aliado Herbalife</p>
                <p className="mt-1 font-semibold text-verde">{dica.produto.nome}</p>
                <p className="text-sm text-verde/70">{dica.produto.descricao}</p>
                <a
                  href={linkWhatsApp(`Olá! Vi a dica do dia ${dica.dia} do MWA e quero saber mais sobre o ${dica.produto.nome}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-sage underline"
                >
                  Perguntar à nutricionista →
                </a>
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  )
}
