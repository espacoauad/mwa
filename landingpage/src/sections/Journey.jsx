import {
  UtensilsCrossed, Droplets, Scale, TrendingUp, PieChart,
  PlayCircle, Dumbbell, Target, MessageCircle, Camera,
} from 'lucide-react'
import { Section, Eyebrow, Title, GoldRule, CtaButton } from '../components/ui.jsx'

const steps = [
  'Faça sua inscrição.',
  'Receba o acesso ao aplicativo.',
  'Comece sua Jornada de 21 Dias.',
  'Acompanhe sua alimentação, água, peso e evolução.',
  'Aprenda com os conteúdos e dicas diárias do programa.',
  'Construa hábitos que podem continuar depois do programa.',
]

const features = [
  { icon: UtensilsCrossed, label: 'Registro de alimentação' },
  { icon: Droplets, label: 'Consumo de água' },
  { icon: Scale, label: 'Controle de peso' },
  { icon: TrendingUp, label: 'Evolução semanal' },
  { icon: PieChart, label: 'Macronutrientes' },
  { icon: PlayCircle, label: 'Conteúdos exclusivos' },
  { icon: Dumbbell, label: 'Exercícios' },
  { icon: Target, label: 'Metas personalizadas' },
  { icon: MessageCircle, label: 'Suporte' },
  { icon: Camera, label: 'Registro de progresso' },
]

function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[2.5rem] border border-forest/10 bg-white p-3 shadow-xl shadow-forest/10">
      <div className="rounded-[2rem] bg-cream p-5">
        <p className="text-xs text-mist">Olá, Maria</p>
        <p className="mt-1 font-display text-lg text-forest-deep">
          Dia 7 de 21 <span className="text-gold">— você está indo bem.</span>
        </p>

        <div className="mt-4 rounded-2xl bg-forest p-4 text-cream">
          <p className="text-[0.65rem] uppercase tracking-widest text-gold-soft">Calorias de hoje</p>
          <p className="mt-1 font-display text-2xl">1.240 <span className="text-sm text-cream/60">de 1.800 kcal</span></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-forest-deep">
            <div className="h-full w-[69%] rounded-full bg-gold" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ['Proteína', '82 g'],
            ['Carbo', '110 g'],
            ['Gordura', '38 g'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white p-2.5">
              <p className="text-[0.6rem] uppercase tracking-wider text-mist">{k}</p>
              <p className="mt-0.5 text-sm font-medium text-forest">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-xl bg-white p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-mist">Água</span>
            <span className="font-medium text-forest">1.500 ml de 2.500 ml</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
            <div className="h-full w-[60%] rounded-full bg-forest/70" />
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-white p-3 text-xs">
          <p className="font-medium text-forest-deep">Seu progresso</p>
          <div className="mt-2 flex justify-between text-mist">
            <span>Peso atual: <strong className="text-forest">72,4 kg</strong></span>
            <span className="text-gold">-2,8 kg</span>
          </div>
          <p className="mt-1 text-mist">Medidas: -4 cm de cintura</p>
        </div>

        <div className="mt-3 rounded-xl border border-gold/30 bg-gold/10 p-3">
          <p className="text-[0.6rem] uppercase tracking-widest text-gold">Dica do dia</p>
          <p className="mt-1 text-xs text-ink/80">Água: seu acelerador de resultados.</p>
        </div>
      </div>
    </div>
  )
}

export default function Journey() {
  return (
    <>
      {/* Como funciona */}
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Como funciona</Eyebrow>
          <Title>21 dias para aprender uma nova forma de cuidar de você.</Title>
          <GoldRule className="mx-auto my-8" />
          <p className="text-base leading-relaxed text-ink/80">
            Ao entrar no MWA, você terá acesso imediato ao aplicativo e começará sua Jornada de 21
            Dias. Todos os dias, o app ajuda você a acompanhar alimentação, hidratação, peso,
            evolução, conteúdos e metas. Você não estará sozinha — terá uma estrutura simples,
            prática e organizada para aplicar o método no dia a dia.
          </p>
        </div>
        <ol className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-4 rounded-2xl bg-cream/70 p-5">
              <span className="font-display text-2xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              <p className="pt-1 text-sm leading-relaxed text-ink/80">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* O aplicativo */}
      <Section className="bg-sand/50">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <Eyebrow>O aplicativo</Eyebrow>
            <Title>Mais do que um aplicativo. Um método que acompanha você diariamente.</Title>
            <p className="mt-6 text-base leading-relaxed text-ink/80">
              Durante 21 dias, você terá acesso a um sistema desenvolvido para entregar exatamente o
              que normalmente falta em qualquer dieta: organização, conhecimento, motivação e
              acompanhamento. Você terá literalmente uma{' '}
              <strong className="font-semibold text-forest">nutricionista no seu bolso</strong>.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-ink/80">
                  <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm italic leading-relaxed text-mist">
              Tudo em um único lugar, para que você pare de tentar fazer tudo sozinha e comece a
              seguir uma direção clara.
            </p>
            <CtaButton className="mt-8">Começar minha transformação</CtaButton>
          </div>
          <PhoneMockup />
        </div>
      </Section>
    </>
  )
}
