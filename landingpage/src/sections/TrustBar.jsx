import { Award, Smartphone, ShieldCheck, Sparkles, Zap, CreditCard } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'

const items = [
  { icon: Award, text: 'Mais de 20 anos de experiência real em emagrecimento' },
  { icon: ShieldCheck, text: 'Método criado por nutricionista com registro profissional' },
  { icon: Smartphone, text: 'Acompanhamento diário pelo aplicativo' },
  { icon: Sparkles, text: 'Não é PDF. Não é e-book. É uma experiência guiada' },
  { icon: Zap, text: 'Acesso imediato após a compra' },
  { icon: CreditCard, text: 'Pagamento único, sem mensalidade — e garantia de 7 dias' },
]

export default function TrustBar() {
  return (
    <Section className="bg-white">
      <div className="text-center">
        <Eyebrow>Por que confiar</Eyebrow>
        <Title>Uma abordagem criada por quem vive o que ensina.</Title>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-start gap-4 rounded-2xl border border-sand bg-cream/60 p-6"
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
            <p className="text-sm leading-relaxed text-ink/80">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
