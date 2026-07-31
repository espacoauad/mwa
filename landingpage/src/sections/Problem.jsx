import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

export default function Problem() {
  return (
    <Section className="bg-offwhite" lazy intrinsicHeight={530}>
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>O problema</Eyebrow>
          <Title>Pare de recomeçar toda segunda-feira.</Title>
        </Reveal>
        <Reveal delay={120} className="mt-8 space-y-5 text-base leading-relaxed text-ink/80 md:text-lg">
          <p>
            Você não precisa contar calorias sem entender o que está fazendo. Não precisa de
            restrições impossíveis. E não precisa carregar culpa por não sustentar uma rotina que
            nunca foi pensada para a sua vida real.
          </p>
          <p className="font-display text-xl italic text-forest md:text-2xl">
            O problema não é a sua força de vontade. É tentar mudar sem método.
          </p>
          <p>
            O MWA existe para ensinar você a entender seu corpo, organizar sua alimentação e
            construir hábitos que continuam — muito depois do programa.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
