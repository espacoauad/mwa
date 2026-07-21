import { useEffect, useState } from 'react'
import { Lock, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dicaDoDia } from '../../data/dicas.js'
import { dicaDoDia as dicaDoDia90 } from '../../data/dicas90.js'
import { informativoDoDia } from '../../data/informativos.js'
import { linkWhatsApp } from '../../utils/ofertas.js'
import InformativoDoDia from '../informativos/InformativoDoDia.jsx'
import LancheProteico from './LancheProteico.jsx'
import { lancheDoDia } from '../../data/lanchesProteicos.js'
import { lancheDoDia22a37 } from '../../data/lanches22a37.js'
import { lancheDoDia38a89 } from '../../data/lanches38a89.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function Dicas({ irPara }) {
  const { ingles } = useIdioma()
  const { diaAtual, totalDias, marcarDicaLida } = useApp()
  const [diaAberto, setDiaAberto] = useState(diaAtual)
  const [secao, setSecao] = useState('informativo')

  // +10 🌱 ao abrir a dica do dia atual (só conta 1x por dia)
  useEffect(() => {
    if (diaAberto === diaAtual) {
      marcarDicaLida(diaAtual)
    }
  }, [diaAberto, diaAtual])

  const diasDoPrograma = Array.from({ length: totalDias }, (_, i) => i + 1)
  const dica = diaAberto <= 30 ? dicaDoDia(diaAberto) : dicaDoDia90(diaAberto)
  const informativo = informativoDoDia(diaAberto)
  const lanche = diaAberto <= 21 ? lancheDoDia(diaAberto) : diaAberto >= 22 && diaAberto <= 37 ? lancheDoDia22a37(diaAberto) : diaAberto >= 38 && diaAberto <= 89 ? lancheDoDia38a89(diaAberto) : null

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Program content' : 'Conteúdo do programa'}</h1>
      <p className="mt-1 text-sm text-verde/60">
        {ingles ? `A new guide and educational tip every day. You are on day ${diaAtual}.` : `Um informativo e uma dica novos por dia. Você está no dia ${diaAtual}.`}
      </p>

      {/* Seletor de dias */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {diasDoPrograma.map((d) => {
          const bloqueada = d > diaAtual
          const ativa = d === diaAberto
          return (
            <button
              key={d}
              type="button"
              disabled={bloqueada}
              onClick={() => setDiaAberto(d)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                ativa
                  ? 'border-verde bg-verde text-white'
                  : bloqueada
                    ? 'border-cinza bg-white text-verde/25'
                    : 'border-sage/40 bg-white text-verde hover:border-sage'
              }`}
            >
              {bloqueada ? <Lock size={13} /> : d}
            </button>
          )
        })}
      </div>

      {/* Alternância informativo / dica / lanche proteico */}
      <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-cinza p-1">
        {[
          { id: 'informativo', label: ingles ? '📊 Guide' : '📊 Informativo' },
          { id: 'dica', label: ingles ? '💡 Tip' : '💡 Dica' },
          { id: 'lanche', label: ingles ? '🥪 Snack' : '🥪 Lanche' },
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
        {secao === 'informativo' && !informativo && (
          <article className="rounded-2xl bg-white p-6 text-center shadow-sm shadow-verde/5">
            <p className="text-3xl">🌿</p>
            <p className="mt-3 font-serif text-lg font-semibold italic text-verde">
              {ingles ? 'New guide in preparation' : 'Novo informativo em preparação'}
            </p>
            <p className="mt-1 text-sm text-verde/60">
              {ingles ? 'The MWA team is finishing today’s comparison guide. Meanwhile, enjoy the educational tip.' : 'O conteúdo comparativo deste dia está sendo finalizado pela equipe MWA. Enquanto isso, aproveite a dica educativa do dia.'}
            </p>
          </article>
        )}

        {secao === 'dica' && dica && (
          <article className="rounded-2xl bg-white p-6 shadow-sm shadow-verde/5">
            <span className="inline-block rounded-full bg-sage-claro px-3 py-1 text-xs font-semibold text-verde">
              {ingles ? 'Day' : 'Dia'} {dica.dia} · {dica.tema}
            </span>
            <h2 className="mt-3 flex items-start gap-2 font-serif text-xl font-semibold italic leading-snug text-verde">
              <span className="text-2xl not-italic">{dica.icone}</span> {dica.titulo}
            </h2>
            <p className="mt-3 leading-relaxed text-verde/80">{dica.conteudo}</p>

            <div className="mt-4 rounded-lg bg-ouro-claro p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-verde/60">
                <Sparkles size={13} /> {ingles ? 'Practical tip' : 'Dica prática'}
              </p>
              <p className="mt-1 text-sm font-medium text-verde">{dica.dicaPratica}</p>
            </div>

            {dica.produto && (
              <div className="mt-3 rounded-lg border-2 border-sage/25 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-sage">🌿 {ingles ? 'Practical option' : 'Opção prática'}</p>
                <p className="mt-1 font-semibold text-verde">{dica.produto.nome}</p>
                <p className="text-sm text-verde/70">{dica.produto.descricao}</p>
                <a
                  href={linkWhatsApp(`Olá! Vi a dica do dia ${dica.dia} do MWA e quero saber mais sobre o ${dica.produto.nome}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-sage underline"
                >
                  {ingles ? 'Ask the nutritionist →' : 'Perguntar à nutricionista →'}
                </a>
              </div>
            )}
          </article>
        )}
        {secao === 'dica' && !dica && (
          <article className="rounded-2xl bg-white p-6 text-center shadow-sm shadow-verde/5">
            <p className="text-3xl">🌿</p>
            <p className="mt-3 font-serif text-lg font-semibold italic text-verde">{ingles ? 'New tip in preparation' : 'Nova dica em preparação'}</p>
            <p className="mt-1 text-sm text-verde/60">
              {ingles ? 'The MWA team is finishing today’s educational content. Meanwhile, enjoy the daily guide.' : 'O conteúdo educativo deste dia está sendo finalizado pela equipe MWA. Enquanto isso, aproveite o informativo do dia.'}
            </p>
          </article>
        )}

        {secao === 'lanche' && lanche && <LancheProteico key={lanche.dia} lanche={lanche} />}
        {secao === 'lanche' && !lanche && (
          <article className="rounded-2xl bg-white p-6 text-center shadow-sm shadow-verde/5">
            <p className="text-3xl">🥪</p>
            <p className="mt-3 font-serif text-lg font-semibold italic text-verde">
              {ingles ? 'No protein snack for this day' : 'Este dia não tem lanche proteico'}
            </p>
            <p className="mt-1 text-sm text-verde/60">
              {ingles ? 'Revisit any previous day to see its protein snack.' : 'Volte a qualquer dia anterior para rever o lanche proteico daquele dia.'}
            </p>
          </article>
        )}
      </div>

    </div>
  )
}
