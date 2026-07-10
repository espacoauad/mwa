import { percentualMeta, statusMeta } from '../../utils/calculos.js'

// Indicador circular de meta: verde atingida, âmbar próxima, terracota longe
export default function AnelMeta({ label, consumido, meta, unidade }) {
  const pct = percentualMeta(consumido, meta)
  const { cor } = statusMeta(pct)
  const raio = 26
  const circ = 2 * Math.PI * raio
  const preenchido = (Math.min(pct, 100) / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r={raio} fill="none" stroke="#E8E4DC" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={raio}
            fill="none"
            stroke={cor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${preenchido} ${circ}`}
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-verde">
          {pct}%
        </span>
      </div>
      <p className="text-xs font-semibold text-verde/70">{label}</p>
      <p className="-mt-1 text-[10px] text-verde/50">
        {consumido.toLocaleString('pt-BR')}/{meta.toLocaleString('pt-BR')} {unidade}
      </p>
    </div>
  )
}
