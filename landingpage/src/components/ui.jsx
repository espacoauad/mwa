import { ArrowRight } from 'lucide-react'
import { CHECKOUT_URL } from '../config.js'
import { track } from '../lib/analytics.js'

/* ---------- Botão CTA (link para checkout Hotmart) ---------- */
export function CtaButton({ children, variant = 'primary', href = CHECKOUT_URL, className = '' }) {
  const base =
    'group inline-flex items-center justify-center gap-2 rounded-full px-9 py-4 text-sm md:text-base font-semibold tracking-wide transition-[background-color,box-shadow,transform] duration-300'
  const variants = {
    primary:
      'bg-forest text-cream hover:bg-forest-deep hover:shadow-xl hover:shadow-forest/25 hover:-translate-y-0.5',
    gold:
      'bg-gold text-forest-deep hover:bg-gold-soft hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5',
    outline:
      'border border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-cream',
    light:
      'bg-cream text-forest hover:bg-white hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5',
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('InitiateCheckout')}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowRight
        size={18}
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </a>
  )
}

/* ---------- Seção com respiro padrão ----------
 * `lazy` + `intrinsicHeight`: aplica content-visibility: auto para que o
 * navegador pule style/layout/paint de seções fora da viewport (custo
 * principal do Lighthouse mobile é Style & Layout). O contain-intrinsic-size
 * usa "auto <altura>" — a altura estimada só serve de placeholder até a
 * seção ser medida de verdade (fica "lembrada" depois), então evita salto
 * visível desde que a estimativa seja próxima da altura mobile real.
 * Não usar em seções com âncora (#app, #oferta) nem acima da dobra.
 */
export function Section({ children, className = '', id, wide = false, lazy = false, intrinsicHeight }) {
  return (
    <section
      id={id}
      className={`px-6 py-20 md:py-28 ${className}`}
      style={lazy ? { contentVisibility: 'auto', containIntrinsicSize: `auto ${intrinsicHeight}px` } : undefined}
    >
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-5xl'}`}>{children}</div>
    </section>
  )
}

/* ---------- Kicker: rótulo pequeno acima do título ---------- */
export function Eyebrow({ children, light = false }) {
  return (
    <p
      className={`mb-4 text-xs font-semibold uppercase tracking-[0.3em] ${
        light ? 'text-gold-soft' : 'text-gold'
      }`}
    >
      {children}
    </p>
  )
}

/* ---------- Título de seção (Fraunces) ---------- */
export function Title({ children, light = false, className = '' }) {
  return (
    <h2
      className={`text-balance font-display text-3xl leading-snug md:text-[2.6rem] md:leading-tight ${
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
