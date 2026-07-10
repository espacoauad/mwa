import { ArrowRight, CalendarRange, UserRound } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'

export default function Ecosystem() {
  return (
    <Section className="bg-cream">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>Depois dos 21 dias</Eyebrow>
        <Title>Sua transformação não precisa terminar no Dia 21.</Title>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
          O MWA foi criado para ser o início de uma nova forma de viver. Dentro do aplicativo, você
          poderá continuar sua evolução e aprofundar sua jornada.
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-sand bg-white p-8">
          <CalendarRange className="h-6 w-6 text-gold" strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-xl text-forest-deep">MWA | Programa de 90 Dias</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">
            A continuidade natural da sua jornada. Essa oferta será apresentada dentro do
            aplicativo, com uma condição especial exclusiva para alunas nos primeiros dias do
            programa.
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold">
            Disponível no app <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>
        <div className="rounded-3xl border border-sand bg-white p-8">
          <UserRound className="h-6 w-6 text-gold" strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-xl text-forest-deep">Sessão Estratégica MWA</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">
            Deseja uma orientação individual? Dentro do aplicativo, você poderá agendar uma sessão
            online com Wanessa Auad para olhar sua rotina, dificuldades e objetivos de forma
            personalizada. Ideal para quem deseja clareza, direcionamento e ajustes individuais.
          </p>
          <p className="mt-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gold">
            Disponível no app <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>
      </div>
    </Section>
  )
}
