// src/components/game/svg/ItemNaoSaudavelSvg.jsx
// Biblioteca de ilustrações dos itens "não saudáveis" da Corrida da Escolha.
// Estilo flat, viewBox 48x48, mesma abordagem de paleta que IngredienteSvg.jsx.
// Uma ilustração por svgId; fallback = prato com "!" neutro.

const C = {
  paoClaro: '#E8C98A',
  paoEscuro: '#C9973F',
  carne: '#7A4B34',
  queijo: '#F0C750',
  alface: '#7A9A5A',
  vermelho: '#C0503F',
  chocolate: '#5A3A22',
  chocolateEscuro: '#3E2814',
  creme: '#F6F0E2',
  branco: '#FFFFFF',
  cinza: '#E9E2D4',
  rosa: '#E8A0A8',
  mostarda: '#E0A62C',
  refriEscuro: '#8A3B2E',
  gelo: '#DCEFF5',
}

const ICONES = {
  hamburguer: (
    <g>
      <path d="M8 20c0-6 7-10 16-10s16 4 16 10H8z" fill={C.paoClaro} />
      <circle cx="14" cy="12" r="1.2" fill={C.creme} />
      <circle cx="24" cy="9" r="1.2" fill={C.creme} />
      <circle cx="32" cy="13" r="1.2" fill={C.creme} />
      <rect x="7" y="20" width="34" height="3" fill={C.alface} />
      <rect x="7" y="23" width="34" height="6" rx="2" fill={C.carne} />
      <rect x="7" y="29" width="34" height="3" fill={C.queijo} />
      <rect x="7" y="32" width="34" height="7" rx="3" fill={C.paoEscuro} />
    </g>
  ),
  pizza: (
    <g>
      <path d="M24 6l17 34H7z" fill={C.paoClaro} stroke={C.paoEscuro} strokeWidth="1.5" />
      <path d="M24 6l14 28a20 20 0 0 1-28 0z" fill={C.queijo} />
      <circle cx="21" cy="24" r="2.6" fill={C.vermelho} />
      <circle cx="27" cy="30" r="2.6" fill={C.vermelho} />
      <circle cx="24" cy="18" r="2.2" fill={C.vermelho} />
    </g>
  ),
  'batata-frita': (
    <g>
      <path d="M12 20h24l-3 20a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3z" fill={C.vermelho} />
      <path d="M14 22h20l1-3H13z" fill={C.paoClaro} />
      <rect x="15" y="10" width="3.4" height="16" rx="1.5" fill={C.paoClaro} transform="rotate(-6 17 18)" />
      <rect x="20" y="8" width="3.4" height="18" rx="1.5" fill={C.paoClaro} />
      <rect x="25" y="9" width="3.4" height="17" rx="1.5" fill={C.paoClaro} transform="rotate(6 27 18)" />
      <rect x="29" y="11" width="3.4" height="15" rx="1.5" fill={C.paoClaro} transform="rotate(12 31 18)" />
    </g>
  ),
  'cachorro-quente': (
    <g>
      <path d="M6 22c0-6 6-9 18-9s18 3 18 9-6 9-18 9S6 28 6 22z" fill={C.paoEscuro} />
      <path d="M9 22c0-4 6-6 15-6s15 2 15 6-6 6-15 6-15-2-15-6z" fill={C.vermelho} />
      <path d="M11 20c3-2 20-2 23 0M11 24c3 2 20 2 23 0" stroke={C.mostarda} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  coxinha: (
    <g>
      <path d="M24 8c8 6 12 16 6 26-3 5-9 5-12 0-6-10-2-20 6-26z" fill={C.paoEscuro} />
      <path d="M24 8c6 5 9 12 6 19-2 4-7 4-10 1-4-6-2-14 4-20z" fill={C.paoClaro} opacity="0.6" />
    </g>
  ),
  brigadeiro: (
    <g>
      <circle cx="24" cy="26" r="14" fill={C.chocolate} />
      <circle cx="19" cy="20" r="1.4" fill={C.mostarda} />
      <circle cx="27" cy="17" r="1.4" fill={C.vermelho} />
      <circle cx="31" cy="24" r="1.4" fill={C.alface} />
      <circle cx="17" cy="28" r="1.4" fill={C.mostarda} />
      <circle cx="24" cy="32" r="1.4" fill={C.vermelho} />
      <circle cx="30" cy="33" r="1.4" fill={C.alface} />
    </g>
  ),
  'bolo-chocolate': (
    <g>
      <path d="M8 34L24 10l16 24z" fill={C.chocolate} />
      <path d="M8 34L24 10l16 24-16 6z" fill={C.chocolateEscuro} opacity="0.35" />
      <path d="M24 10c2 3 1 6-1 8s0 5 2 6" stroke={C.creme} strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <rect x="6" y="34" width="36" height="4" rx="2" fill={C.chocolateEscuro} />
    </g>
  ),
  sorvete: (
    <g>
      <path d="M18 24h12l-4 16a2 2 0 0 1-4 0z" fill={C.paoClaro} />
      <path d="M15 22a9 9 0 0 1 18 0c0 4-4 6-9 6s-9-2-9-6z" fill={C.branco} />
      <circle cx="24" cy="14" r="7" fill={C.rosa} />
    </g>
  ),
  refrigerante: (
    <g>
      <path d="M15 12h18l-2 26a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" fill={C.vermelho} />
      <path d="M14 12h20v3H14z" fill={C.refriEscuro} />
      <path d="M17 20c4 2 10 2 14 0" stroke={C.creme} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="22" y="4" width="3" height="9" rx="1.5" fill={C.gelo} transform="rotate(-10 23 8)" />
    </g>
  ),
  'biscoito-recheado': (
    <g>
      <circle cx="24" cy="17" r="11" fill={C.chocolate} />
      <circle cx="24" cy="31" r="11" fill={C.chocolate} />
      <rect x="13" y="20" width="22" height="8" fill={C.creme} />
      <circle cx="20" cy="17" r="1.2" fill={C.chocolateEscuro} />
      <circle cx="28" cy="14" r="1.2" fill={C.chocolateEscuro} />
      <circle cx="20" cy="31" r="1.2" fill={C.chocolateEscuro} />
      <circle cx="28" cy="34" r="1.2" fill={C.chocolateEscuro} />
    </g>
  ),
}

const FALLBACK = (
  <g>
    <circle cx="24" cy="24" r="16" fill={C.cinza} stroke={C.paoEscuro} strokeWidth="1.5" />
    <text x="24" y="30" fontSize="16" textAnchor="middle" fill={C.paoEscuro}>!</text>
  </g>
)

export default function ItemNaoSaudavelSvg({ id, tamanho = 44, className = '', rotulo }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={tamanho}
      height={tamanho}
      className={className}
      role={rotulo ? 'img' : 'presentation'}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      {ICONES[id] ?? FALLBACK}
    </svg>
  )
}

export const IDS_ILUSTRADOS = Object.keys(ICONES)
