import { CHECKOUT_URL } from '../config.js'

/* ---------- Botão CTA (link para checkout Hotmart) ---------- */
export function CtaButton({ children, variant = 'primary', href = CHECKOUT_URL, className = '' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-9 py-4 text-sm md:text-base font-medium tracking-wide transition-all duration-300'
  const variants = {
    primary:
      'bg-forest text-cream hover:bg-forest-deep hover:shadow-lg hover:shadow-forest/20 hover:-translate-y-0.5',
    gold:
      'bg-gold text-white hover:bg-gold-soft hover:shadow-lg hover:shadow-gold/25 hover:-translate-y-0.5',
    outline:
      'border border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-cream',
    light:
      'bg-cream text-forest hover:bg-white hover:shadow-lg hover:-translate-y-0.5',
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </a>
  )
}

/* ---------- Seção com respiro padrão ---------- */
export function Section({ children, className = '', id }) {
  return (
    <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  )
}

/* ---------- Rótulo pequeno acima do título ---------- */
export function Eyebrow({ children, light = false }) {
  return (
    <p
      className={`mb-4 text-xs font-medium uppercase tracking-[0.3em] ${
        light ? 'text-gold-soft' : 'text-gold'
      }`}
    >
      {children}
    </p>
  )
}

/* ---------- Título de seção (serif elegante) ---------- */
export function Title({ children, light = false, className = '' }) {
  return (
    <h2
      className={`font-display text-3xl leading-snug md:text-4xl ${
        light ? 'text-cream' : 'text-forest-deep'
      } ${className}`}
    >
      {children}
    </h2>
  )
}

/* ---------- Divisor dourado sutil ---------- */
export function GoldRule({ className = '' }) {
  return <div className={`h-px w-16 bg-gold ${className}`} />
}
