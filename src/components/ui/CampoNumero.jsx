export default function CampoNumero({ label, sufixo, value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-verde">{label}</span>
      <div className="flex items-center rounded-lg border-2 border-sage/30 bg-white transition-colors focus-within:border-sage">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 rounded-lg px-3 py-3.5 text-base font-semibold text-verde outline-none"
          {...props}
        />
        {sufixo && <span className="pr-3 text-xs font-medium text-sage">{sufixo}</span>}
      </div>
    </label>
  )
}
