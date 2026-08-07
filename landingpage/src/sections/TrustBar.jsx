import { Award, ShieldCheck, CreditCard } from 'lucide-react'
import Reveal from '../components/Reveal.jsx'

const items = [
  { icon: ShieldCheck, label: 'Garantia incondicional de 7 dias' },
  { icon: Award, label: '20+ anos de experiência em emagrecimento' },
  { icon: CreditCard, label: 'Pagamento único, sem mensalidade' },
]

export default function TrustBar() {
  return (
    <div className="border-y border-forest/10 bg-cream px-6 py-8">
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {items.map(({ icon: Icon, label }, i) => (
          <Reveal key={label} delay={i * 90} className="flex items-center justify-center gap-2.5 text-center md:text-left">
            <Icon size={20} aria-hidden="true" className="shrink-0 text-gold" strokeWidth={1.8} />
            <p className="text-xs font-medium leading-snug text-forest md:text-sm">{label}</p>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
