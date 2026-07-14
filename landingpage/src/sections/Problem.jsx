import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'

export default function Problem() {
  return (
    <Section className="bg-sand/50">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>O ciclo que precisa acabar</Eyebrow>
        <Title>Pare de começar uma nova dieta toda segunda-feira.</Title>
        <GoldRule className="mx-auto my-8" />
        <div className="space-y-5 text-left text-base leading-relaxed text-ink/80 md:text-lg">
          <p>Você não precisa viver contando calorias sem entender o que está fazendo.</p>
          <p>Não precisa sofrer com restrições impossíveis.</p>
          <p>
            Não precisa se sentir culpada por não conseguir manter uma rotina que nunca foi pensada
            para a sua vida real.
          </p>
          <p className="font-display text-xl italic text-forest md:text-2xl">
            O problema não é falta de força de vontade. O problema é tentar mudar sem clareza, sem
            acompanhamento e sem uma rotina possível de sustentar.
          </p>
          <p>
            O My Wellness App ajuda você a entender seu corpo, organizar sua alimentação e
            construir hábitos que podem acompanhar você depois dos 21 dias.
          </p>
        </div>
      </div>
    </Section>
  )
}
