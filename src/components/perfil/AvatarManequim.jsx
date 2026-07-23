const CORES = {
  sage: 'var(--color-sage)',
  ouro: 'var(--color-ouro)',
  verde: 'var(--color-verde)',
}

const TAMANHOS = {
  sm: 64,
  lg: 140,
}

export default function AvatarManequim({ proporcao, estagioPostura = 0, corAcento = 'sage', tamanho = 'lg' }) {
  const largura = TAMANHOS[tamanho]
  const altura = largura * 1.6

  // proporcao tipica 0.65 (cintura bem mais estreita que quadril) a 1.0
  // (cintura e quadril quase iguais). Sem dado, usa uma silhueta neutra.
  const razao = proporcao ?? 0.8
  const larguraCintura = 34 + razao * 26 // 34px (mais estreita) a 60px (mais reta)
  const larguraQuadril = 60

  // Postura: braços mais afastados do corpo e leve inclinação de coluna nos
  // estagios mais avancados — reforco visual de energia/confianca, não uma
  // tentativa de representar mudanca fisica literal.
  const aberturaBraco = 6 + estagioPostura * 3 // 6 a 15

  const cor = CORES[corAcento] ?? CORES.sage

  return (
    <svg
      viewBox="0 0 100 160"
      width={largura}
      height={altura}
      role="img"
      aria-label="Ilustração simplificada da forma corporal atual"
    >
      {/* Cabeça */}
      <ellipse cx="50" cy="20" rx="14" ry="16" fill="var(--color-creme)" stroke="var(--color-verde)" strokeWidth="2" />

      {/* Torso — largura no busto, afunila até a cintura, alarga até o quadril */}
      <path
        d={`M ${50 - 24} 40
            L ${50 - larguraCintura / 2} 90
            L ${50 - larguraQuadril / 2} 130
            L ${50 + larguraQuadril / 2} 130
            L ${50 + larguraCintura / 2} 90
            L ${50 + 24} 40
            Z`}
        fill="var(--color-creme)"
        stroke="var(--color-verde)"
        strokeWidth="2"
      />

      {/* Faixa de conquista na cintura */}
      <rect x={50 - larguraCintura / 2} y="86" width={larguraCintura} height="8" fill={cor} rx="2" />

      {/* Braços — ângulo varia com o estágio de postura */}
      <line x1={50 - 24} y1="45" x2={50 - 24 - aberturaBraco} y2="95" stroke="var(--color-verde)" strokeWidth="4" strokeLinecap="round" />
      <line x1={50 + 24} y1="45" x2={50 + 24 + aberturaBraco} y2="95" stroke="var(--color-verde)" strokeWidth="4" strokeLinecap="round" />

      {/* Pernas */}
      <line x1={50 - larguraQuadril / 4} y1="130" x2={50 - larguraQuadril / 4} y2="158" stroke="var(--color-verde)" strokeWidth="5" strokeLinecap="round" />
      <line x1={50 + larguraQuadril / 4} y1="130" x2={50 + larguraQuadril / 4} y2="158" stroke="var(--color-verde)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}
