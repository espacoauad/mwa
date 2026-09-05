import logoOficial from '../../assets/logo-mwa.png'
import logoClara from '../../assets/logo-mwa-clara.png'
import simboloOficial from '../../assets/simbolo-mwa.png'
import simboloClaro from '../../assets/simbolo-mwa-claro.png'

// Logo oficial MWA (arquivo enviado por Wanessa — ver branding/LEIA-ME.md).
// variante: 'completa' (símbolo + MWA + tagline), 'simbolo' (só o ícone), 'wordmark' (MWA + tagline, sem ícone)
// tema: 'escuro' (traços verde-escuro, para fundo claro) | 'claro' (traços creme, para fundo verde/escuro)
export default function LogoMWA({ variante = 'completa', tema = 'escuro', className = '' }) {
  if (variante === 'simbolo') {
    return (
      <img
        src={tema === 'claro' ? simboloClaro : simboloOficial}
        alt="MWA"
        className={`object-contain ${className}`}
      />
    )
  }

  if (variante === 'wordmark') {
    const corPrincipal = tema === 'claro' ? '#FFFFFF' : '#08402F'
    const corTagline = tema === 'claro' ? '#E3C486' : '#879b55'
    return (
      <div className={`text-center ${className}`}>
        <p className="font-serif text-4xl font-bold tracking-wide">
          <span style={{ color: corPrincipal }}>M</span>
          <span style={{ color: '#C59F4F' }}>W</span>
          <span style={{ color: corPrincipal }}>A</span>
        </p>
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: corTagline }}>
          My Wellness Approach
        </p>
      </div>
    )
  }

  return (
    <img
      src={tema === 'claro' ? logoClara : logoOficial}
      alt="MWA — My Wellness Approach"
      className={`w-36 object-contain ${className}`}
    />
  )
}
