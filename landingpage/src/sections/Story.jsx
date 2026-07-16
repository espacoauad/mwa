import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import CountUp from '../components/CountUp.jsx'
import fotoWanessaStory from '../assets/foto-wanessa-story-final.jpg'

const stats = [
  { value: 26, suffix: ' kg', label: 'eliminados após a gestação' },
  { value: 14, suffix: ' anos', label: 'mantendo a transformação' },
  { value: 20, suffix: '+', label: 'anos como nutricionista' },
]

export default function Story() {
  return (
    <Section className="bg-forest-deep" wide>
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="order-2 md:order-1">
          <div className="overflow-hidden rounded-3xl border border-gold/25 shadow-2xl shadow-black/30">
            <img
              src={fotoWanessaStory}
              alt="Wanessa Auad, nutricionista e criadora do MWA"
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </Reveal>

        <div className="order-1 md:order-2">
          <Reveal>
            <Eyebrow light>A história</Eyebrow>
            <Title light>Antes de ser um método, foi uma vida transformada.</Title>
          </Reveal>

          <Reveal delay={120} className="mt-8 space-y-5 text-base leading-relaxed text-cream/85">
            <p>
              Após a gestação do meu filho, eliminei 26 kg. Mas o maior desafio não era emagrecer —
              era nunca mais precisar recomeçar.
            </p>
            <p>
              Foi nesse processo que entendi: dietas até geram resultados rápidos, mas são os
              hábitos que os mantêm ao longo dos anos. Há 14 anos vivo essa transformação, com
              alimentação inteligente, mentalidade e escolhas consistentes.
            </p>
            <p>
              Como nutricionista, transformei essa vivência em método — o mesmo que agora acompanha
              você todos os dias pelo aplicativo.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 border-l-2 border-gold pl-5 font-display text-xl italic leading-snug text-gold-soft md:text-2xl">
              "O maior resultado não foi perder 26 kg. Foi aprender a permanecer."
            </p>
          </Reveal>

          <Reveal delay={260} className="mt-10 grid grid-cols-3 gap-4">
            {stats.map(({ value, suffix, label }) => (
              <div key={label}>
                <p className="font-display text-3xl text-gold md:text-4xl">
                  <CountUp value={value} suffix={suffix} />
                </p>
                <p className="mt-1 text-xs leading-snug text-cream/60">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
