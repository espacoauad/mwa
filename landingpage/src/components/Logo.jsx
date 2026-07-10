export default function Logo({ tema = 'escuro', tamanho = 'lg' }) {
  const cor = tema === 'claro' ? '#F5F1E8' : '#344528'
  const tagline = tema === 'claro' ? '#D4AF7A' : '#879b55'
  const gid = tema === 'claro' ? 'gLc' : 'gLe'
  const px = tamanho === 'lg' ? 'h-24 w-24 md:h-28 md:w-28' : 'h-10 w-10'
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className={px} aria-hidden="true">
        <path d="M 132 28 A 76 76 0 1 0 132 172" fill="none" stroke={cor} strokeWidth="5" strokeLinecap="round" />
        <path d="M 78 55 C 75 90, 85 130, 100 165 C 90 140, 78 100, 82 60 Z" fill={cor} />
        <path d="M 100 165 C 92 140, 84 105, 84 75 C 90 100, 100 130, 108 150 Z" fill={cor} />
        <path d="M 100 165 C 104 135, 118 100, 145 75 C 130 105, 115 135, 108 165 Z" fill={`url(#${gid})`} />
        <circle cx="100" cy="62" r="13" fill={cor} />
        <defs>
          <linearGradient id="gLe" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e6c78f" /><stop offset="50%" stopColor="#d4af7a" /><stop offset="100%" stopColor="#b8935c" />
          </linearGradient>
          <linearGradient id="gLc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0dcb8" /><stop offset="50%" stopColor="#d4af7a" /><stop offset="100%" stopColor="#c49b62" />
          </linearGradient>
        </defs>
      </svg>
      {tamanho === 'lg' && (
        <p className="mt-2 font-display text-5xl font-medium tracking-wide md:text-6xl">
          <span style={{ color: cor }}>M</span>
          <span style={{ color: '#c49b62' }}>W</span>
          <span style={{ color: cor }}>A</span>
        </p>
      )}
    </div>
  )
}
