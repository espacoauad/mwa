import { Gauge, BookOpen, Sparkles, Gamepad2, Smartphone } from 'lucide-react'
import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'

const pillars = [
  {
    icon: Gauge,
    number: '01',
    title: 'Monitoramento real',
    text: 'Ao registrar suas refeições, água e movimento, você enxerga seu dia como ele realmente é. O app mostra quanto já consumiu, o que ainda precisa e ajuda a ajustar a próxima escolha.',
  },
  {
    icon: BookOpen,
    number: '02',
    title: 'Educação',
    text: 'Conteúdos e dicas ajudam você a entender o que comer, quanto comer e por quê. O conhecimento transforma números em escolhas conscientes e cria autonomia.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Motivação',
    text: 'Metas, evolução visível e pequenas conquistas mantêm o foco no que você já avançou. Cada dia oferece um próximo passo claro e possível.',
  },
  {
    icon: Gamepad2,
    number: '04',
    title: 'Diversão',
    text: 'Jogos, desafios e recompensas tornam o cuidado mais leve. Você aprende brincando e transforma a construção de hábitos em uma experiência simples, mágica e divertida.',
  },
]

export default function Method() {
  return (
    <Section className="bg-cream">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>A abordagem</Eyebrow>
        <Title>MWA é My Wellness App: seu ecossistema completo de bem-estar.</Title>
        <GoldRule className="mx-auto my-8" />
        <div className="space-y-4 text-base leading-relaxed text-ink/80">
          <p>
            <em className="font-display text-forest">Approach</em> significa abordagem: uma forma
            própria de enxergar, organizar e conduzir o bem-estar. Por isso,{' '}
            <em className="font-display text-forest">My Wellness Approach</em> pode ser entendido
            como <strong className="font-semibold text-forest">Minha Abordagem de Bem-Estar</strong>.
          </p>
          <p>
            Essa abordagem reúne mais de 20 anos de experiência em nutrição, comportamento,
            mudança de hábitos e qualidade de vida. No app, essa expertise deixa de estar restrita
            ao consultório e passa a acompanhar você nas escolhas reais de cada dia.
          </p>
          <p>
            O objetivo não é entregar regras rígidas ou fazer você depender de uma dieta pronta.
            É ensinar você a compreender seu corpo, interpretar sua rotina e tomar decisões com
            mais autonomia.
          </p>
          <p className="font-display italic text-forest">
            Quando você entende o caminho, o resultado deixa de ser uma tentativa e passa a ser uma
            consequência.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-gold/30 bg-white p-7 text-left shadow-sm md:p-9">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-forest text-gold-soft">
              <Smartphone className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display text-xl italic leading-relaxed text-forest md:text-2xl">
                “Minha expertise em bem-estar, traduzida em orientação simples e presente na palma
                da sua mão.”
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                O app transforma experiência profissional em acompanhamento diário: você registra,
                entende, aprende e recebe direção para escolher melhor — onde estiver e no momento
                em que realmente precisa.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Criadora e mentora do My Wellness App
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20 text-center">
        <Title className="text-2xl md:text-3xl">Os 4 pilares do My Wellness App</Title>
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
