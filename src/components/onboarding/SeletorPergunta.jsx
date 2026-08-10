export default function SeletorPergunta({
  idGrupo,
  titulo,
  opcoes,
  labelsEn,
  ingles,
  valor,
  aoEscolher,
  permiteOutro = false,
  valorOutro = '',
  aoMudarOutro,
  placeholderOutro,
}) {
  const chipClasse = (selecionado) =>
    `rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
      selecionado
        ? 'border-sage bg-sage-claro text-verde'
        : 'border-sage/25 bg-white text-verde/60 hover:border-sage/50'
    }`

  return (
    <div>
      <span id={idGrupo} className="mb-2 block text-sm font-semibold text-verde">{titulo}</span>
      <div role="group" aria-labelledby={idGrupo} className="flex flex-wrap gap-2">
        {opcoes.map((op) => (
          <button
            key={op.id}
            type="button"
            onClick={() => aoEscolher(op.id)}
            aria-pressed={valor === op.id}
            className={chipClasse(valor === op.id)}
          >
            {ingles ? (labelsEn[op.id] ?? op.label) : op.label}
          </button>
        ))}
        {permiteOutro && (
          <button
            type="button"
            onClick={() => aoEscolher('outro')}
            aria-pressed={valor === 'outro'}
            className={chipClasse(valor === 'outro')}
          >
            {ingles ? 'Other' : 'Outro'}
          </button>
        )}
      </div>
      {permiteOutro && valor === 'outro' && (
        <input
          type="text"
          value={valorOutro}
          onChange={(e) => aoMudarOutro(e.target.value)}
          placeholder={placeholderOutro}
          className="mt-2 w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-3 text-sm font-medium text-verde outline-none transition-colors focus:border-sage"
        />
      )}
    </div>
  )
}
