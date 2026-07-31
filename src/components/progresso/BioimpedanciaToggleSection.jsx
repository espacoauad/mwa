import { BIOIMPEDANCIA_METRICAS } from '../../utils/bioimpedancia.js'

export default function BioimpedanciaToggleSection({
  toggles,
  values,
  onToggleChange,
  onValueChange,
  validacoes = {},
}) {
  return (
    <div className="mt-6 space-y-4 border-t border-verde/20 pt-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-verde/70">
          📊 Dados de Bioimpedância <span className="text-xs text-verde/50">(opcional)</span>
        </h3>
        <p className="text-xs text-verde/60">Ative conforme seu equipamento</p>
      </div>

      {/* Toggle list */}
      <div className="space-y-3">
        {BIOIMPEDANCIA_METRICAS.map((metrica) => {
          const isActive = toggles?.[metrica.key]
          const value = values?.[metrica.key] ?? ''
          const erro = validacoes?.[metrica.key]
          const temErro = !!erro

          return (
            <div
              key={metrica.key}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                temErro
                  ? 'border-ouro/50 bg-ouro/5'
                  : isActive
                    ? 'border-verde/20 bg-verde/5'
                    : 'border-verde/10 bg-transparent'
              }`}
            >
              {/* Toggle checkbox */}
              <input
                type="checkbox"
                id={`bio-${metrica.key}`}
                checked={isActive ?? false}
                onChange={(e) => onToggleChange(metrica.key, e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-verde"
              />

              {/* Label */}
              <label
                htmlFor={`bio-${metrica.key}`}
                className="cursor-pointer text-sm font-medium text-verde"
                title={metrica.dica}
              >
                {metrica.label}
              </label>

              {/* Input field (only if active) */}
              {isActive && (
                <input
                  type="number"
                  placeholder={`${metrica.minVal}-${metrica.maxVal}`}
                  min={metrica.minVal}
                  max={metrica.maxVal}
                  step={metrica.key.includes('percentual') ? '0.1' : '0.5'}
                  value={value}
                  onChange={(e) => onValueChange(metrica.key, e.target.value)}
                  className={`ml-auto w-24 rounded border px-2 py-1 text-sm text-verde transition-colors ${
                    temErro
                      ? 'border-ouro/50 bg-ouro/5 focus:border-ouro'
                      : 'border-verde/20 focus:border-verde'
                  }`}
                />
              )}

              {/* Unit label (only if active) */}
              {isActive && (
                <span className="text-xs text-verde/60">{metrica.unidade}</span>
              )}

              {/* Error message */}
              {temErro && (
                <div className="absolute mt-1 text-xs text-ouro">{erro}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
