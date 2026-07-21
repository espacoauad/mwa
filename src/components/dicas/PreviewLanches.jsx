import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { LANCHES_PROTEICOS, lancheDoDia } from '../../data/lanchesProteicos.js'
import { dicaDoDia } from '../../data/dicas.js'
import { informativoDoDia } from '../../data/informativos.js'
import { linkWhatsApp } from '../../utils/ofertas.js'
import InformativoDoDia from '../informativos/InformativoDoDia.jsx'
import LancheProteico from './LancheProteico.jsx'

// Rota pública de pré-visualização (/preview-lanches) — mostra o conteúdo completo
// de cada dia (informativo + dica + lanche), SEM precisar de login. Uso interno/temporário.
export default function PreviewLanches() {
  const [dia, setDia] = useState(21) // abre no dia 21 (encerramento do ciclo)
  const [secao, setSecao] = useState('informativo')

  const informativo = informativoDoDia(dia)
  const dica = dicaDoDia(dia)
  const lanche = lancheDoDia(dia)

  return (
    <div className="mx-auto min-h-screen max-w-md bg-creme px-5 pb-16 pt-10">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-sage">Preview interno</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold italic text-verde">Conteúdo do programa — 30 dias</h1>
        <p className="mt-1 text-sm text-verde/60">Escolha o dia e alterne entre informativo, dica e lanche.</p>
      </div>

      {/* Seletor de dias 1–21 */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {LANCHES_PROTEICOS.map((l) => {
          const ativo = l.dia === dia
          return (
            <button
              key={l.dia}
              type="button"
              onClick={() => setDia(l.dia)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                ativo ? 'border-verde bg-verde text-white' : 'border-sage/40 bg-white text-verde hover:border-sage'
              }`}
            >
              {l.dia}
            </button>
          )
        })}
      </div>

      {/* Abas informativo / dica / lanche */}
      <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-cinza p-1">
        {[
          { id: 'informativo', label: '📊 Informativo' },
          { id: 'dica', label: '💡 Dica' },
          { id: 'lanche', label: '🥪 Lanche' },
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

      <div className="mt-4">
        {/* Informativo */}
        {secao === 'informativo' && informativo && (
          <InformativoDoDia informativo={informativo} dia={dia} irPara={() => {}} />
        )}
        {secao === 'informativo' && !informativo && (
          <article className="rounded-2xl bg-white p-6 text-center shadow-sm shadow-verde/5">
            <p className="text-3xl">🌿</p>
            <p className="mt-3 font-serif text-lg font-semibold italic text-verde">Sem informativo neste dia</p>
          </article>
        )}

        {/* Dica */}
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
                <p className="text-xs font-bold uppercase tracking-wide text-sage">🌿 Opção prática</p>
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

        {/* Lanche */}
        {secao === 'lanche' && lanche && <LancheProteico key={lanche.dia} lanche={lanche} />}
      </div>
    </div>
  )
}
