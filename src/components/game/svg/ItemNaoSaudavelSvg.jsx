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
  crosta: '#B98444',
  tampaClara: '#F0E8D8',
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
      <path d="M24 6L41 38Q24 46 7 38Z" fill={C.queijo} />
      <path d="M7 38Q24 46 41 38" fill="none" stroke={C.crosta} strokeWidth="3" strokeLinecap="round" />
      <circle cx="21" cy="26" r="2.6" fill={C.vermelho} />
      <circle cx="28" cy="31" r="2.6" fill={C.vermelho} />
      <circle cx="24" cy="19" r="2.2" fill={C.vermelho} />
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
      <path d="M24 8c9 7 13 17 8 27-2 4-5 6-8 6s-6-2-8-6c-5-10-1-20 8-27z" fill={C.paoEscuro} />
      <path d="M24 8c6 6 9 13 7 20-1 3-4 5-7 5" fill="none" stroke={C.paoClaro} strokeWidth="1.4" opacity="0.6" strokeLinecap="round" />
      <circle cx="20" cy="18" r="1" fill={C.chocolateEscuro} opacity="0.5" />
      <circle cx="27" cy="21" r="1" fill={C.chocolateEscuro} opacity="0.5" />
      <circle cx="22" cy="26" r="1" fill={C.chocolateEscuro} opacity="0.5" />
      <circle cx="28" cy="29" r="1" fill={C.chocolateEscuro} opacity="0.5" />
      <circle cx="19" cy="31" r="1" fill={C.chocolateEscuro} opacity="0.5" />
    </g>
  ),
  brigadeiro: (
    <g>
      <path d="M10 28h28l-3 12a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3z" fill={C.mostarda} />
      <path d="M10 28l2 3M15 28l1.5 3M20 28l1 3M24 28v3M28 28l-1 3M33 28l-1.5 3M38 28l-2 3" stroke={C.paoEscuro} strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <circle cx="24" cy="20" r="12" fill={C.chocolate} />
      <circle cx="19" cy="16" r="1.3" fill={C.mostarda} />
      <circle cx="27" cy="13" r="1.3" fill={C.vermelho} />
      <circle cx="30" cy="20" r="1.3" fill={C.alface} />
      <circle cx="17" cy="22" r="1.3" fill={C.mostarda} />
      <circle cx="24" cy="26" r="1.3" fill={C.vermelho} />
      <circle cx="29" cy="26" r="1.3" fill={C.alface} />
    </g>
  ),
  'bolo-chocolate': (
    <g>
      <ellipse cx="24" cy="37" rx="19" ry="3.5" fill={C.creme} opacity="0.5" />
      <path d="M8 35L24 9L40 35Z" fill={C.chocolate} />
      <path d="M12.9 27L35.1 27" stroke={C.creme} strokeWidth="3" />
      <path d="M17.9 19L30.1 19" stroke={C.creme} strokeWidth="2.6" />
      <path d="M24 9c2 2 1 5-1 6.5" stroke={C.branco} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="23.3" cy="8" r="1.6" fill={C.branco} />
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
      <path d="M13 14h22l-3 26a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3z" fill={C.vermelho} />
      <path d="M15 20c3 2 15 2 18 0" stroke={C.creme} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="14" rx="11" ry="3" fill={C.refriEscuro} />
      <ellipse cx="24" cy="11" rx="8" ry="2.6" fill={C.tampaClara} />
      <rect x="26" y="2" width="3" height="11" rx="1.5" fill={C.tampaClara} transform="rotate(8 27.5 7.5)" />
    </g>
  ),
  'biscoito-recheado': (
    <g>
      <ellipse cx="24" cy="16" rx="15" ry="7" fill={C.chocolate} />
      <ellipse cx="24" cy="32" rx="15" ry="7" fill={C.chocolate} />
      <rect x="9" y="16" width="30" height="16" fill={C.creme} />
      <ellipse cx="24" cy="16" rx="15" ry="4.5" fill={C.chocolateEscuro} opacity="0.25" />
      <ellipse cx="24" cy="32" rx="15" ry="4.5" fill={C.chocolateEscuro} opacity="0.25" />
      <circle cx="17" cy="13" r="1" fill={C.chocolateEscuro} />
      <circle cx="24" cy="11" r="1" fill={C.chocolateEscuro} />
      <circle cx="31" cy="14" r="1" fill={C.chocolateEscuro} />
      <circle cx="17" cy="35" r="1" fill={C.chocolateEscuro} />
      <circle cx="24" cy="37" r="1" fill={C.chocolateEscuro} />
      <circle cx="31" cy="34" r="1" fill={C.chocolateEscuro} />
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
