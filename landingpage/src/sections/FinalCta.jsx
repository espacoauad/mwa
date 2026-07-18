import { Section, Title, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

export default function FinalCta() {
  return (
    <Section className="bg-forest-deep" lazy intrinsicHeight={490}>
      <Reveal className="mx-auto max-w-2xl text-center">
        <Title light>
          Os próximos 30 dias vão passar de qualquer forma.
          <br />
          <em className="italic text-gold-soft">A diferença será a decisão que você toma hoje.</em>
        </Title>
        <p className="mt-6 text-base leading-relaxed text-cream/75">
          Você pode continuar tentando sozinha — ou dar o primeiro passo em uma abordagem criada
          para ensinar você a cuidar da sua saúde de forma inteligente, prática e sustentável.
        </p>
        <div className="mt-10">
          <CtaButton variant="gold">Quero começar agora</CtaButton>
        </div>
      </Reveal>
    </Section>
  )
}
