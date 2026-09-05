import { STATUS_LABELS } from '../../data/options'

const CORES = {
  ideia: 'bg-sand text-forest-deep',
  rascunho: 'bg-gold-soft/60 text-forest-deep',
  em_revisao: 'bg-gold text-forest-deep',
  aprovado: 'bg-sage text-white',
  arquivado: 'bg-mist/30 text-forest-deep',
  programado: 'bg-forest text-offwhite',
}

export function StatusBadge({ status }) {
  return (
    <span className={`font-ui inline-block rounded-full px-3 py-1 text-xs font-semibold ${CORES[status] || CORES.ideia}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
