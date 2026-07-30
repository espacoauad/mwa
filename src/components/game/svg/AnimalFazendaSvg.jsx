// Bichinhos decorativos da MWA FARM — aparecem em marcos de dias fixos,
// sem relação com os pilares. Ilustração simples e fofa (estilo Township).

const CORES = {
  galinha: { corpo: '#F6E9D2', crista: '#E2574C', bico: '#E8973F' },
  coelho: { corpo: '#F2E6D8', interno: '#F0B8C4' },
  abelha: { corpo: '#F4C242', listra: '#3C3020' },
  borboleta: { asa: '#9B84C9', corpo: '#3C3020' },
  vaquinha: { corpo: '#FFFFFF', manchas: '#3C3020' },
}

function Galinha() {
  const c = CORES.galinha
  return (
    <g>
      <ellipse cx="20" cy="24" rx="14" ry="11" fill={c.corpo} />
      <circle cx="32" cy="14" r="7" fill={c.corpo} />
      <path d="M30 8c1-3 5-3 5 0" fill={c.crista} />
      <path d="M38 14l5 2-5 2z" fill={c.bico} />
    </g>
  )
}

function Coelho() {
  const c = CORES.coelho
  return (
    <g>
      <ellipse cx="20" cy="26" rx="13" ry="10" fill={c.corpo} />
      <circle cx="30" cy="16" r="8" fill={c.corpo} />
      <ellipse cx="24" cy="4" rx="2.4" ry="9" fill={c.corpo} transform="rotate(-12 24 4)" />
      <ellipse cx="33" cy="3" rx="2.4" ry="9" fill={c.corpo} transform="rotate(10 33 3)" />
      <ellipse cx="24" cy="6" rx="1.1" ry="5" fill={c.interno} transform="rotate(-12 24 6)" />
      <ellipse cx="33" cy="5" rx="1.1" ry="5" fill={c.interno} transform="rotate(10 33 5)" />
    </g>
  )
}

function Abelha() {
  const c = CORES.abelha
  return (
    <g>
      <ellipse cx="24" cy="24" rx="12" ry="8" fill={c.corpo} />
      <path d="M14 20h20M14 24h20M14 28h20" stroke={c.listra} strokeWidth="2.4" opacity="0.85" />
      <ellipse cx="14" cy="16" rx="7" ry="5" fill="#EAF3FF" opacity="0.7" transform="rotate(-20 14 16)" />
      <ellipse cx="20" cy="14" rx="7" ry="5" fill="#EAF3FF" opacity="0.7" transform="rotate(10 20 14)" />
    </g>
  )
}

function Borboleta() {
  const c = CORES.borboleta
  return (
    <g>
      <ellipse cx="24" cy="20" rx="2" ry="12" fill={c.corpo} />
      <ellipse cx="14" cy="14" rx="9" ry="7" fill={c.asa} transform="rotate(-20 14 14)" />
      <ellipse cx="34" cy="14" rx="9" ry="7" fill={c.asa} transform="rotate(20 34 14)" />
      <ellipse cx="15" cy="26" rx="6" ry="5" fill={c.asa} opacity="0.85" transform="rotate(-10 15 26)" />
      <ellipse cx="33" cy="26" rx="6" ry="5" fill={c.asa} opacity="0.85" transform="rotate(10 33 26)" />
    </g>
  )
}

function Vaquinha() {
  const c = CORES.vaquinha
  return (
    <g>
      <ellipse cx="24" cy="26" rx="16" ry="11" fill={c.corpo} stroke="#E5DDD0" strokeWidth="0.5" />
      <ellipse cx="14" cy="20" rx="4" ry="5" fill={c.manchas} />
      <ellipse cx="30" cy="30" rx="5" ry="4" fill={c.manchas} />
      <circle cx="36" cy="18" r="7" fill={c.corpo} />
      <ellipse cx="32" cy="12" rx="2" ry="3" fill={c.corpo} />
      <ellipse cx="40" cy="12" rx="2" ry="3" fill={c.corpo} />
    </g>
  )
}

const ANIMAIS = { galinha: Galinha, coelho: Coelho, abelha: Abelha, borboleta: Borboleta, vaquinha: Vaquinha }

export default function AnimalFazendaSvg({ id, tamanho = 48, rotulo, className = '' }) {
  const Componente = ANIMAIS[id]
  if (!Componente) return null
  return (
    <svg
      viewBox="0 0 48 40"
      width={tamanho}
      height={tamanho}
      className={className}
      role={rotulo ? 'img' : 'presentation'}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      <Componente />
    </svg>
  )
}

export const IDS_ANIMAIS = Object.keys(ANIMAIS)
