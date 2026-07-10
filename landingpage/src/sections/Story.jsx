import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'
import fotoWanessa from '../assets/foto-wanessa-story.png'

export default function Story() {
  return (
    <Section className="bg-forest-deep">
      <div className="grid items-center gap-12 md:grid-cols-2">
        {/* Espaço reservado para foto elegante de Wanessa */}
        <div className="order-2 md:order-1">
          <div className="flex aspect-[4/5] items-end justify-center overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-b from-forest/40 to-forest/70">
            <img src={fotoWanessa} alt="Wanessa Auad" className="max-h-full w-auto object-contain drop-shadow-2xl" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Eyebrow light>Uma história real</Eyebrow>
          <Title light>A história por trás do MWA</Title>
          <GoldRule className="my-8" />
          <div className="space-y-4 text-sm leading-relaxed text-cream/80 md:text-base">
            <p>O MWA não nasceu apenas em um consultório. Nasceu também da minha própria transformação.</p>
            <p>
              Após a gestação do meu filho, eliminei 26 kg. Mas o maior desafio não era emagrecer.
              Era nunca mais precisar recomeçar.
            </p>
            <p>
              Foi nesse processo que entendi algo que mudou minha vida: dietas podem até gerar
              resultados rápidos, mas são os hábitos que mantêm esses resultados ao longo dos anos.
            </p>
            <p>
              Há 14 anos, mantenho minha transformação através de uma rotina baseada em alimentação
              inteligente, mudança de mentalidade e escolhas consistentes.
            </p>
            <p>
              Assim nasceu o MWA — Método Wanessa Auad | My Wellness Approach: experiência pessoal,
              ciência nutricional e mais de 20 anos de prática profissional em uma forma mais leve,
              estratégica e sustentável de viver saudável.
            </p>
          </div>
          <p className="mt-8 border-l-2 border-gold pl-5 font-display text-xl italic leading-relaxed text-gold-soft md:text-2xl">
            O maior resultado não foi perder 26 kg. Foi aprender a permanecer.
          </p>
        </div>
      </div>
    </Section>
  )
}
