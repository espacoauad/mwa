// Molde de planta compartilhado entre os 4 estágios da MWA FARM.
// Cada pilar usa a mesma "planta-base" (caule + folhas), variando só a cor
// de destaque e a "coroa" (flor/fruto/espiga) no topo — assim 8 pilares × 4
// estágios não exigem 32 ilustrações desenhadas do zero.

const TERRA = '#8A6A48'
const CAULE = '#5C8A3F'
const FOLHA = '#7CA85C'

// Lista dos coroaId aceitos pelo switch abaixo — mantida em sincronia manual
// com os `case` labels. Usada por src/data/farm/integridade.test.js para
// checar que todo PILARES[].coroaId tem um desenho correspondente aqui.
export const COROAS_SUPORTADAS = ['tomate', 'flor-azul', 'girassol', 'lavanda', 'trigo', 'milho', 'erva', 'laranjeira']

function Coroa({ coroaId, cor, escala }) {
  const deslocamentoY = 34 - 18 * escala
  const transformBase = `translate(32 ${deslocamentoY}) scale(${escala})`

  switch (coroaId) {
    case 'tomate':
      return (
        <g transform={transformBase}>
          <circle cx="-5" cy="0" r="6" fill={cor} />
          <circle cx="5" cy="2" r="6" fill={cor} />
          <circle cx="0" cy="-6" r="6" fill={cor} />
        </g>
      )
    case 'flor-azul':
      return (
        <g transform={transformBase}>
          {[0, 72, 144, 216, 288].map((angulo) => (
            <ellipse key={angulo} cx="0" cy="-7" rx="4" ry="7" fill={cor} transform={`rotate(${angulo})`} />
          ))}
          <circle r="3.5" fill="#F6E9D2" />
        </g>
      )
    case 'girassol':
      return (
        <g transform={transformBase}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angulo) => (
            <ellipse key={angulo} cx="0" cy="-8" rx="3" ry="6" fill={cor} transform={`rotate(${angulo})`} />
          ))}
          <circle r="5" fill="#7A5A32" />
        </g>
      )
    case 'lavanda':
      return (
        <g transform={transformBase}>
          {[-6, -2, 2, 6].map((x) => (
            <ellipse key={x} cx={x} cy={-6 - Math.abs(x)} rx="2.2" ry="7" fill={cor} />
          ))}
        </g>
      )
    case 'trigo':
      return (
        <g transform={transformBase}>
          <rect x="-2" y="-14" width="4" height="14" rx="2" fill={cor} />
          {[-10, -6, -2, 2, 6, 10].map((y) => (
            <ellipse key={y} cx={y > 0 ? 4 : -4} cy={y} rx="3" ry="2" fill={cor} />
          ))}
        </g>
      )
    case 'milho':
      return (
        <g transform={transformBase}>
          <ellipse cx="0" cy="-6" rx="6" ry="11" fill={cor} />
          <path d="M-6 -6h12M-6 -2h12M-6 -10h12" stroke="#FFF8E6" strokeWidth="1.2" opacity="0.5" />
        </g>
      )
    case 'erva':
      return (
        <g transform={transformBase}>
          <path d="M0 0C-8 -8 -8 -18 0 -20C8 -18 8 -8 0 0Z" fill={cor} />
          <path d="M0 -2V-18" stroke="#3C5233" strokeWidth="1" opacity="0.4" />
        </g>
      )
    case 'laranjeira':
      return (
        <g transform={transformBase}>
          <circle cx="-6" cy="-2" r="5.5" fill={cor} />
          <circle cx="6" cy="-2" r="5.5" fill={cor} />
          <circle cx="0" cy="-10" r="5.5" fill={cor} />
        </g>
      )
    default:
      return <circle transform={transformBase} r="5" fill={cor} />
  }
}

export default function PlantaFazenda({ estagio, cor, coroaId, tamanho = 64, rotulo }) {
  const estagioSeguro = Math.min(3, Math.max(0, estagio ?? 0))
  const alturaCaule = 6 + estagioSeguro * 6
  const escalasCoroa = [0, 0.55, 0.8, 1]
  const escalaCoroa = escalasCoroa[estagioSeguro]

  return (
    <svg
      viewBox="0 0 64 64"
      width={tamanho}
      height={tamanho}
      role={rotulo ? 'img' : 'presentation'}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      <ellipse cx="32" cy="58" rx="16" ry="5" fill={TERRA} />
      <rect x="30" y={58 - alturaCaule} width="4" height={alturaCaule} rx="2" fill={CAULE} />
      {estagioSeguro >= 1 && (
        <>
          <ellipse
            cx="24"
            cy={58 - alturaCaule + 4}
            rx="7"
            ry="4"
            fill={FOLHA}
            transform={`rotate(-25 24 ${58 - alturaCaule + 4})`}
          />
          <ellipse
            cx="40"
            cy={58 - alturaCaule + 4}
            rx="7"
            ry="4"
            fill={FOLHA}
            transform={`rotate(25 40 ${58 - alturaCaule + 4})`}
          />
        </>
      )}
      {escalaCoroa > 0 && <Coroa coroaId={coroaId} cor={cor} escala={escalaCoroa} />}
    </svg>
  )
}
