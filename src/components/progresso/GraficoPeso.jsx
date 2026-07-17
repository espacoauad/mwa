import { useIdioma } from '../../context/IdiomaContext.jsx'

// Gráfico de peso — série única: linha 2px verde-escuro, rótulos diretos nos
// pontos (sem legenda), grade discreta. Pontos ≥ 8px com anel branco.
export default function GraficoPeso({ pontos }) {
  const { ingles, locale } = useIdioma()
  // pontos: [{ rotulo, peso }]
  const W = 340
  const H = 170
  const M = { top: 24, right: 16, bottom: 26, left: 34 }

  const pesos = pontos.map((p) => p.peso)
  const min = Math.floor(Math.min(...pesos) - 1)
  const max = Math.ceil(Math.max(...pesos) + 1)
  const escalaY = (v) => M.top + ((max - v) / (max - min || 1)) * (H - M.top - M.bottom)
  const escalaX = (i) =>
    pontos.length === 1
      ? W / 2
      : M.left + (i / (pontos.length - 1)) * (W - M.left - M.right)

  const linhas = [min, Math.round((min + max) / 2), max]
  const caminho = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${escalaX(i)},${escalaY(p.peso)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={ingles ? 'Weight trend throughout the program' : 'Evolução do peso ao longo do programa'}>
      {/* Grade discreta */}
      {linhas.map((v) => (
        <g key={v}>
          <line x1={M.left} x2={W - M.right} y1={escalaY(v)} y2={escalaY(v)} stroke="#E8E4DC" strokeWidth="1" />
          <text x={M.left - 6} y={escalaY(v) + 3} textAnchor="end" fontSize="9" fill="#34452880">
            {v}
          </text>
        </g>
      ))}

      {/* Linha da série */}
      <path d={caminho} fill="none" stroke="#344528" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Pontos com anel + rótulo direto */}
      {pontos.map((p, i) => (
        <g key={i}>
          <circle cx={escalaX(i)} cy={escalaY(p.peso)} r="5" fill="#344528" stroke="#FFFFFF" strokeWidth="2">
            <title>{`${p.rotulo}: ${p.peso.toLocaleString(locale)} kg`}</title>
          </circle>
          <text
            x={escalaX(i)}
            y={escalaY(p.peso) - 10}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="#344528"
          >
            {p.peso.toLocaleString(locale)}
          </text>
          <text x={escalaX(i)} y={H - 8} textAnchor="middle" fontSize="9" fill="#34452880">
            {p.rotulo}
          </text>
        </g>
      ))}
    </svg>
  )
}
