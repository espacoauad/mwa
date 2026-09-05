import { Brain, Salad, CalendarCheck, HeartHandshake } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

const pillars = [
  {
    icon: Brain,
    title: 'Mentalidade',
    text: 'Nenhuma transformação começa no prato. Começa na forma como você pensa, decide e se compromete com a própria saúde — fora do ciclo da culpa.',
  },
  {
    icon: Salad,
    title: 'Nutrição Inteligente',
    text: 'Refeições equilibradas, calorias sob controle e proteína na medida certa. Sem modismos, sem extremos, sem terrorismo alimentar.',
  },
  {
    icon: CalendarCheck,
    title: 'Rotina Sustentável',
    text: 'São os hábitos diários que sustentam resultados. Alimentação, água, metas e movimento organizados em uma rotina possível.',
  },
  {
    icon: HeartHandshake,
    title: 'Acompanhamento',
    text: 'Informação sem prática não transforma. Durante os 90 dias, o app guia, registra e mostra sua evolução — todos os dias.',
  },
]

export default function Method() {
  return (
    <Section className="bg-cream" wide lazy intrinsicHeight={1250}>
      <div className="text-center">
        <Reveal>
          <Eyebrow>O método</Eyebrow>
          <Title>Os 4 pilares do My Wellness Approach</Title>
        </Reveal>
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, text }, i) => (
          <Reveal
            key={title}
            delay={i * 100}
            className="group rounded-3xl border border-forest/10 bg-offwhite p-7 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-forest/10"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage/15 text-forest transition-colors duration-300 group-hover:bg-gold/20">
              <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <h3 className="mt-5 font-display text-xl text-forest-deep">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
