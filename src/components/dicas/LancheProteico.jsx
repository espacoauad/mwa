import { useState } from 'react'
import { Sparkles, Check } from 'lucide-react'

// Card do lanche proteico do dia: nome, descrição, ingredientes, preparo e,
// quando houver, a foto do suplemento/alimento usado na receita.
export default function LancheProteico({ lanche }) {
  const [imagemOk, setImagemOk] = useState(true)

  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm shadow-verde/5">
      <div className="flex items-center justify-between">
        <span className="inline-block rounded-full bg-sage-claro px-3 py-1 text-xs font-semibold text-verde">
          Dia {lanche.dia} · Lanche proteico
        </span>
        <span className="rounded-full bg-verde px-3 py-1 text-xs font-bold text-ouro">
          {lanche.proteina} proteína
        </span>
      </div>

      <h2 className="mt-3 flex items-start gap-2 font-serif text-xl font-semibold italic leading-snug text-verde">
        <span className="text-2xl not-italic">{lanche.icone}</span> {lanche.titulo}
      </h2>

      <p className="mt-3 leading-relaxed text-verde/80">{lanche.descricao}</p>

      {/* Foto do suplemento (aparece só quando o arquivo existir) */}
      {lanche.produto?.imagem && imagemOk && (
        <div className="mt-4 overflow-hidden rounded-xl border-2 border-sage/25 bg-creme">
          <img
            src={lanche.produto.imagem}
            alt={lanche.produto.nome}
            onError={() => setImagemOk(false)}
            className="mx-auto max-h-56 w-full object-contain p-3"
          />
        </div>
      )}

      {/* Ingredientes */}
      <div className="mt-4 rounded-lg bg-sage-claro/40 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-verde/60">🧺 Ingredientes</p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {lanche.ingredientes.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-verde/80">
              <Check size={15} className="mt-0.5 shrink-0 text-sage" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Modo de preparo */}
      <div className="mt-3 rounded-lg bg-ouro-claro p-4">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-verde/60">
          <Sparkles size={13} /> Como fazer
        </p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-verde">{lanche.preparo}</p>
      </div>
    </article>
  )
}
