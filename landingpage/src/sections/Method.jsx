import { Brain, Salad, CalendarCheck, HeartHandshake } from 'lucide-react'
import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'

const pillars = [
  {
    icon: Brain,
    number: '01',
    title: 'Mentalidade',
    text: 'Nenhuma transformação começa no prato. Ela começa na forma como você pensa, decide e se compromete com a sua própria saúde. No MWA, você aprende a sair do ciclo da culpa e construir uma relação mais consciente com o processo.',
  },
  {
    icon: Salad,
    number: '02',
    title: 'Nutrição Inteligente',
    text: 'Você aprende a montar refeições equilibradas, controlar calorias sem sofrimento, consumir proteínas de forma estratégica e fazer escolhas que cabem na vida real. Sem modismos. Sem dietas extremas. Sem terrorismo alimentar.',
  },
  {
    icon: CalendarCheck,
    number: '03',
    title: 'Rotina Sustentável',
    text: 'São os hábitos diários que sustentam os resultados. Por isso, o MWA ajuda você a organizar alimentação, água, metas, evolução e movimento em uma rotina possível.',
  },
  {
    icon: HeartHandshake,
    number: '04',
    title: 'Acompanhamento',
    text: 'Informação sem prática não gera transformação. Durante os 21 dias, você terá uma experiência guiada pelo aplicativo, com registros, conteúdos, metas e acompanhamento para manter você no caminho.',
  },
]

export default function Method() {
  return (
    <Section className="bg-cream">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>A abordagem</Eyebrow>
        <Title>MWA significa Método Wanessa Auad. Mas representa muito mais.</Title>
        <GoldRule className="mx-auto my-8" />
        <div className="space-y-4 text-base leading-relaxed text-ink/80">
          <p>
            MWA também significa <em className="font-display text-forest">My Wellness Approach</em>:
            uma abordagem completa de bem-estar, que une conhecimento nutricional, mentalidade,
            rotina e acompanhamento diário.
          </p>
          <p>
            O objetivo não é fazer você depender de uma dieta pronta. O objetivo é ensinar você a
            construir uma rotina que faça sentido para sua vida.
          </p>
          <p className="font-display italic text-forest">
            Quando você entende o caminho, o resultado deixa de ser uma tentativa e passa a ser uma
            consequência.
          </p>
        </div>
      </div>

      <div className="mt-20 text-center">
        <Title className="text-2xl md:text-3xl">Os 4 pilares do My Wellness Approach</Title>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {pillars.map(({ icon: Icon, number, title, text }) => (
          <div
            key={number}
            className="group rounded-3xl border border-sand bg-white p-8 transition-shadow duration-300 hover:shadow-md hover:shadow-forest/5"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-7 w-7 text-forest" strokeWidth={1.25} />
              <span className="font-display text-3xl text-gold/40">{number}</span>
            </div>
            <h3 className="mt-5 font-display text-xl text-forest-deep">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
