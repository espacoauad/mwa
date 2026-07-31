// Biblioteca de ilustrações dos ingredientes do Monte Seu Prato.
// Estilo flat premium, paleta MWA (verdes, dourado e tons naturais), viewBox 48x48.
// Uma ilustração por alimentoId; fallback = pratinho neutro.

const C = {
  verde: '#3C5233',
  folha: '#7A9A5A',
  folhaClara: '#A9C48A',
  ouro: '#C9A15C',
  ouroClaro: '#E7CF9F',
  creme: '#F6F0E2',
  branco: '#FFFFFF',
  terracota: '#C96F4A',
  vermelho: '#C0503F',
  marrom: '#8A6A48',
  marromClaro: '#B08D62',
  roxoBatata: '#A66A5A',
  cinza: '#E9E2D4',
}

const ICONES = {
  'frango-grelhado': (
    <g>
      <path d="M14 30c-4-8 1-19 12-20 9-1 15 6 14 13-1 8-9 11-15 10l-4 5-3-2 2-5c-3 0-5-.4-6-1z" fill={C.terracota} />
      <path d="M18 12c4-3 12-3 15 2" stroke={C.ouroClaro} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="38" r="3.4" fill={C.creme} />
      <circle cx="15" cy="41" r="3.4" fill={C.creme} />
      <rect x="10" y="33" width="4" height="8" rx="2" transform="rotate(35 12 37)" fill={C.creme} />
    </g>
  ),
  ovo: (
    <g>
      <path d="M24 6c8 0 14 10 14 20a14 14 0 0 1-28 0C10 16 16 6 24 6z" fill={C.branco} stroke={C.cinza} strokeWidth="1.5" />
      <circle cx="24" cy="28" r="7" fill={C.ouro} />
      <circle cx="21.5" cy="25.5" r="2" fill={C.ouroClaro} />
    </g>
  ),
  tilapia: (
    <g>
      <ellipse cx="22" cy="24" rx="15" ry="9" fill={C.folha} />
      <path d="M35 24l9-7-3 7 3 7z" fill={C.verde} />
      <circle cx="14" cy="22" r="1.8" fill={C.verde} />
      <path d="M20 16c3 2 3 14 0 16M26 16c3 2 3 14 0 16" stroke={C.folhaClara} strokeWidth="1.6" fill="none" />
    </g>
  ),
  patinho: (
    <g>
      <path d="M8 26c0-9 8-14 17-14s15 5 15 12-6 12-16 12S8 33 8 26z" fill={C.vermelho} />
      <path d="M13 26c0-6 6-9 12-9s10 3 10 8-4 8-11 8-11-2-11-7z" fill={C.terracota} />
      <path d="M16 25c4-3 12-3 15 1" stroke={C.creme} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  atum: (
    <g>
      <ellipse cx="24" cy="16" rx="15" ry="5" fill={C.cinza} />
      <path d="M9 16v14c0 3 7 5 15 5s15-2 15-5V16c0 3-7 5-15 5S9 19 9 16z" fill={C.creme} />
      <ellipse cx="24" cy="27" rx="9" ry="4.5" fill={C.folha} opacity="0.85" />
      <circle cx="18.5" cy="26" r="1.1" fill={C.verde} />
    </g>
  ),
  'iogurte-grego': (
    <g>
      <path d="M13 14h22l-3 26c0 2-7 3-8 3s-8-1-8-3z" fill={C.branco} stroke={C.cinza} strokeWidth="1.5" />
      <rect x="11" y="10" width="26" height="6" rx="3" fill={C.ouro} />
      <path d="M18 24c3 3 9 3 12 0" stroke={C.cinza} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  ),
  'iogurte-natural': (
    <g>
      <path d="M13 14h22l-3 26c0 2-7 3-8 3s-8-1-8-3z" fill={C.branco} stroke={C.cinza} strokeWidth="1.5" />
      <rect x="11" y="10" width="26" height="6" rx="3" fill={C.folha} />
      <circle cx="24" cy="28" r="4" fill={C.creme} />
    </g>
  ),
  'queijo-minas': (
    <g>
      <path d="M6 32L38 18c3 4 5 9 5 14H6z" fill={C.ouroClaro} />
      <path d="M6 32h37v4H6z" fill={C.ouro} />
      <circle cx="24" cy="29" r="2" fill={C.creme} />
      <circle cx="33" cy="27" r="1.5" fill={C.creme} />
      <circle cx="16" cy="31" r="1.3" fill={C.creme} />
    </g>
  ),
  omelete: (
    <g>
      <path d="M6 30a18 10 0 0 1 36 0z" fill={C.ouroClaro} />
      <path d="M6 30h36c0 3-8 5-18 5S6 33 6 30z" fill={C.ouro} />
      <circle cx="18" cy="26" r="1.6" fill={C.folha} />
      <circle cx="27" cy="24" r="1.6" fill={C.terracota} />
      <circle cx="33" cy="27" r="1.4" fill={C.folha} />
    </g>
  ),
  'arroz-integral': (
    <g>
      <path d="M8 26h32a16 12 0 0 1-32 0z" fill={C.verde} />
      <path d="M12 25c2-5 8-8 12-8s10 3 12 8z" fill={C.marromClaro} />
      <ellipse cx="18" cy="21" rx="2" ry="1.2" fill={C.creme} transform="rotate(-20 18 21)" />
      <ellipse cx="26" cy="19" rx="2" ry="1.2" fill={C.creme} transform="rotate(15 26 19)" />
      <ellipse cx="31" cy="22" rx="2" ry="1.2" fill={C.creme} transform="rotate(-10 31 22)" />
    </g>
  ),
  'arroz-branco': (
    <g>
      <path d="M8 26h32a16 12 0 0 1-32 0z" fill={C.folha} />
      <path d="M12 25c2-5 8-8 12-8s10 3 12 8z" fill={C.branco} />
      <ellipse cx="18" cy="21" rx="2" ry="1.2" fill={C.cinza} transform="rotate(-20 18 21)" />
      <ellipse cx="26" cy="19" rx="2" ry="1.2" fill={C.cinza} transform="rotate(15 26 19)" />
      <ellipse cx="31" cy="22" rx="2" ry="1.2" fill={C.cinza} transform="rotate(-10 31 22)" />
    </g>
  ),
  feijao: (
    <g>
      <path d="M8 26h32a16 12 0 0 1-32 0z" fill={C.creme} stroke={C.cinza} strokeWidth="1.4" />
      <path d="M11 26c1-4 6-7 13-7s12 3 13 7z" fill={C.marrom} />
      <ellipse cx="18" cy="22" rx="2.6" ry="1.7" fill={C.marromClaro} transform="rotate(-15 18 22)" />
      <ellipse cx="26" cy="20.5" rx="2.6" ry="1.7" fill={C.marromClaro} transform="rotate(10 26 20.5)" />
      <ellipse cx="32" cy="23" rx="2.6" ry="1.7" fill={C.marromClaro} transform="rotate(-8 32 23)" />
    </g>
  ),
  'batata-doce': (
    <g>
      <path d="M7 28C7 20 16 14 25 15s17 7 15 14c-1 6-9 8-18 7S7 33 7 28z" fill={C.roxoBatata} />
      <path d="M14 22c-2 2-3 6-2 9M22 19c-1 2-1 5 0 8" stroke={C.terracota} strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  ),
  'pao-integral': (
    <g>
      <path d="M8 20c0-5 7-8 16-8s16 3 16 8v14c0 2-2 3-4 3H12c-2 0-4-1-4-3z" fill={C.marromClaro} />
      <path d="M8 20c0 3 7 5 16 5s16-2 16-5" stroke={C.marrom} strokeWidth="1.6" fill="none" />
      <circle cx="18" cy="31" r="1.2" fill={C.marrom} />
      <circle cx="26" cy="33" r="1.2" fill={C.marrom} />
      <circle cx="32" cy="30" r="1.2" fill={C.marrom} />
    </g>
  ),
  'pao-frances': (
    <g>
      <ellipse cx="24" cy="27" rx="17" ry="11" fill={C.ouroClaro} />
      <path d="M13 24c2-2 5-2 7 0M21 22c2-2 5-2 7 0M29 24c2-2 5-2 7 0" stroke={C.ouro} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  aveia: (
    <g>
      <path d="M8 26h32a16 12 0 0 1-32 0z" fill={C.ouro} />
      <path d="M12 25c2-4 7-7 12-7s10 3 12 7z" fill={C.ouroClaro} />
      <path d="M24 6c3 3 3 8 0 11-3-3-3-8 0-11z" fill={C.folha} />
      <circle cx="19" cy="21" r="1.4" fill={C.marromClaro} />
      <circle cx="27" cy="20" r="1.4" fill={C.marromClaro} />
    </g>
  ),
  tapioca: (
    <g>
      <path d="M6 28a18 9 0 0 1 36 0l-18 3z" fill={C.branco} stroke={C.cinza} strokeWidth="1.5" />
      <path d="M6 28c6 4 30 4 36 0-4 6-12 9-18 9S10 34 6 28z" fill={C.creme} stroke={C.cinza} strokeWidth="1.2" />
    </g>
  ),
  macarrao: (
    <g>
      <ellipse cx="24" cy="32" rx="17" ry="7" fill={C.creme} stroke={C.cinza} strokeWidth="1.4" />
      <path d="M11 30c2-8 6-13 13-13s11 5 13 13" stroke={C.ouro} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M15 30c2-6 5-9 9-9s7 3 9 9" stroke={C.ouroClaro} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </g>
  ),
  brocolis: (
    <g>
      <rect x="21" y="26" width="6" height="12" rx="3" fill={C.folhaClara} />
      <circle cx="16" cy="20" r="7" fill={C.folha} />
      <circle cx="28" cy="15" r="8" fill={C.verde} />
      <circle cx="33" cy="24" r="6" fill={C.folha} />
      <circle cx="22" cy="26" r="5" fill={C.verde} />
    </g>
  ),
  'salada-verde': (
    <g>
      <path d="M8 27h32a16 11 0 0 1-32 0z" fill={C.creme} stroke={C.cinza} strokeWidth="1.4" />
      <path d="M14 26c0-6 4-10 8-10 1 3 0 7-3 10z" fill={C.folha} />
      <path d="M22 26c1-6 6-9 10-8 0 3-2 6-5 8z" fill={C.folhaClara} />
      <path d="M30 26c3-3 7-3 9 0z" fill={C.verde} />
    </g>
  ),
  cenoura: (
    <g>
      <path d="M18 14L34 30c2 2 1 5-1 6L14 18c-1-2 2-5 4-4z" fill={C.terracota} transform="rotate(3 24 24)" />
      <path d="M32 10c1 3 0 6-2 8M38 14c-3 1-6 1-8-1" stroke={C.folha} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M20 20l4 4M25 25l4 4" stroke={C.vermelho} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </g>
  ),
  abobrinha: (
    <g>
      <rect x="7" y="19" width="34" height="11" rx="5.5" fill={C.folha} transform="rotate(-8 24 24)" />
      <path d="M12 22l26-4M13 27l26-4" stroke={C.folhaClara} strokeWidth="1.6" strokeLinecap="round" transform="rotate(-8 24 24)" />
      <rect x="39" y="16" width="5" height="5" rx="2" fill={C.verde} transform="rotate(-8 41 18)" />
    </g>
  ),
  tomate: (
    <g>
      <circle cx="24" cy="27" r="14" fill={C.vermelho} />
      <path d="M24 12l-3-4M24 13l4-5" stroke={C.folha} strokeWidth="2" strokeLinecap="round" />
      <path d="M17 13c2 3 12 3 14 0l-4 5h-6z" fill={C.folha} />
      <path d="M15 24c1-4 4-7 7-8" stroke={C.terracota} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  ),
  banana: (
    <g>
      <path d="M10 14c2 14 12 22 26 21l2 4c-17 3-31-8-32-24z" fill={C.ouro} />
      <path d="M10 14l-2-3 3-1 2 4z" fill={C.marrom} />
      <path d="M14 18c3 8 10 14 18 15" stroke={C.ouroClaro} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  maca: (
    <g>
      <path d="M24 15c-2-3-8-4-11-1-4 4-4 14 1 20 3 4 7 5 10 3 3 2 7 1 10-3 5-6 5-16 1-20-3-3-9-2-11 1z" fill={C.vermelho} />
      <path d="M24 14c0-3 1-6 3-7" stroke={C.marrom} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M27 9c3-2 6-1 7 1-2 2-5 2-7-1z" fill={C.folha} />
    </g>
  ),
  mamao: (
    <g>
      <path d="M9 24a15 15 0 0 1 30 0c0 9-7 14-15 14S9 33 9 24z" fill={C.ouro} />
      <path d="M14 24a10 10 0 0 1 20 0c0 6-4 9-10 9s-10-3-10-9z" fill={C.terracota} />
      <circle cx="20" cy="24" r="1.3" fill={C.verde} />
      <circle cx="24" cy="27" r="1.3" fill={C.verde} />
      <circle cx="28" cy="24" r="1.3" fill={C.verde} />
    </g>
  ),
  morango: (
    <g>
      <path d="M24 42C14 36 9 28 11 20c1-5 6-7 13-7s12 2 13 7c2 8-3 16-13 22z" fill={C.vermelho} />
      <path d="M17 10c3 2 11 2 14 0l-3 5h-8z" fill={C.folha} />
      <circle cx="19" cy="22" r="1.1" fill={C.ouroClaro} />
      <circle cx="27" cy="21" r="1.1" fill={C.ouroClaro} />
      <circle cx="23" cy="28" r="1.1" fill={C.ouroClaro} />
      <circle cx="27" cy="33" r="1.1" fill={C.ouroClaro} />
    </g>
  ),
  laranja: (
    <g>
      <circle cx="24" cy="26" r="14" fill={C.terracota} />
      <circle cx="24" cy="26" r="10" fill={C.ouroClaro} />
      <path d="M24 16v20M14 26h20M17 19l14 14M31 19L17 33" stroke={C.terracota} strokeWidth="1.6" />
      <path d="M27 10c2-2 5-2 7 0-2 2-5 2-7 0z" fill={C.folha} />
    </g>
  ),
  abacate: (
    <g>
      <path d="M24 6c5 0 7 6 8 10 2 6 6 8 6 15a14 12 0 0 1-28 0c0-7 4-9 6-15 1-4 3-10 8-10z" fill={C.verde} />
      <path d="M24 12c3 0 5 4 6 8 1 5 4 6 4 11a10 9 0 0 1-20 0c0-5 3-6 4-11 1-4 3-8 6-8z" fill={C.folhaClara} />
      <circle cx="24" cy="31" r="5" fill={C.marrom} />
    </g>
  ),
  azeite: (
    <g>
      <path d="M20 6h8v7l4 6v22c0 2-1 3-3 3H19c-2 0-3-1-3-3V19l4-6z" fill={C.ouroClaro} opacity="0.9" />
      <path d="M16 26h16v15c0 2-1 3-3 3H19c-2 0-3-1-3-3z" fill={C.ouro} />
      <rect x="20" y="4" width="8" height="4" rx="1.5" fill={C.verde} />
      <ellipse cx="24" cy="34" rx="3" ry="4" fill={C.folha} opacity="0.6" />
    </g>
  ),
  'pasta-amendoim': (
    <g>
      <path d="M12 16h24v22c0 3-2 5-5 5H17c-3 0-5-2-5-5z" fill={C.marromClaro} />
      <rect x="10" y="10" width="28" height="8" rx="3" fill={C.verde} />
      <path d="M17 27c2-3 5-3 7 0s5 3 7 0" stroke={C.marrom} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  'castanha-caju': (
    <g>
      <path d="M14 18c6-2 10 2 10 7s-5 9-10 7c-4-2-5-5-4-8s2-5 4-6z" fill={C.ouroClaro} transform="rotate(-15 17 25)" />
      <path d="M28 22c6-2 10 2 10 7s-5 9-10 7c-4-2-5-5-4-8s2-5 4-6z" fill={C.ouro} transform="rotate(10 33 29)" />
    </g>
  ),
  chia: (
    <g>
      <path d="M12 14h24l-2 24c0 3-4 5-10 5s-10-2-10-5z" fill={C.creme} stroke={C.cinza} strokeWidth="1.4" />
      <rect x="14" y="9" width="20" height="7" rx="3" fill={C.folha} />
      <circle cx="19" cy="24" r="1.4" fill={C.verde} />
      <circle cx="25" cy="21" r="1.4" fill={C.marrom} />
      <circle cx="29" cy="26" r="1.4" fill={C.verde} />
      <circle cx="21" cy="30" r="1.4" fill={C.marrom} />
      <circle cx="27" cy="33" r="1.4" fill={C.verde} />
    </g>
  ),
  'leite-desnatado': (
    <g>
      <path d="M16 8h16v6l2 6v20c0 2-1 3-3 3H17c-2 0-3-1-3-3V20l2-6z" fill={C.branco} stroke={C.cinza} strokeWidth="1.5" />
      <path d="M14 24h20v16c0 2-1 3-3 3H17c-2 0-3-1-3-3z" fill={C.creme} />
      <path d="M16 8h16v4H16z" fill={C.folha} />
    </g>
  ),
  whey: (
    <g>
      <path d="M14 18h20v20c0 3-2 5-5 5H19c-3 0-5-2-5-5z" fill={C.verde} />
      <path d="M15 14h18l1 4H14z" fill={C.folha} />
      <rect x="18" y="8" width="12" height="6" rx="2" fill={C.ouro} />
      <path d="M19 28c2-2 4-2 5 0s3 2 5 0" stroke={C.folhaClara} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  'requeijao-light': (
    <g>
      <path d="M10 20h28v14c0 3-2 5-5 5H15c-3 0-5-2-5-5z" fill={C.branco} stroke={C.cinza} strokeWidth="1.5" />
      <rect x="8" y="14" width="32" height="8" rx="3" fill={C.folha} />
      <path d="M16 30h16" stroke={C.cinza} strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
}

const FALLBACK = (
  <g>
    <circle cx="24" cy="24" r="16" fill={C.creme} stroke={C.cinza} strokeWidth="1.5" />
    <circle cx="24" cy="24" r="9" fill={C.branco} />
  </g>
)

export default function IngredienteSvg({ id, tamanho = 44, className = '', rotulo }) {
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
