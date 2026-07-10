import { Section, Eyebrow, Title, CtaButton, GoldRule } from '../components/ui.jsx'

export default function FinalCta() {
  return (
    <Section className="bg-forest-deep">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow light>A decisão é sua</Eyebrow>
        <Title light>Transforme hábitos, conquiste resultados, mude sua vida.</Title>
        <GoldRule className="mx-auto my-8" />
        <div className="space-y-4 text-base leading-relaxed text-cream/85">
          <p>
            Daqui a 21 dias, você estará 21 dias mais velha. A diferença será a decisão que você
            toma hoje.
          </p>
          <p>
            Você pode continuar tentando começar uma nova dieta toda segunda-feira. Ou pode dar o
            primeiro passo em uma abordagem pensada para ensinar você a cuidar da sua saúde de forma
            mais inteligente, prática e sustentável.
          </p>
          <p className="font-display text-xl italic text-gold-soft">
            Sua transformação começa com uma única decisão.
          </p>
        </div>
        <CtaButton variant="gold" className="mt-10">Quero começar agora</CtaButton>
      </div>
    </Section>
  )
}
