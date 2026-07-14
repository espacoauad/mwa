import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'
import { BRAND } from '../config.js'
import fotoWanessaFinal from '../assets/foto-wanessa-final.jpg'

export default function About() {
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          {/* Espaço reservado para foto profissional */}
          <div className="overflow-hidden rounded-3xl border border-gold/30 bg-sand/60 shadow-xl shadow-forest/10">
            <img
              src={fotoWanessaFinal}
              alt="Wanessa Auad — nutricionista"
              className="aspect-square h-auto w-full object-cover"
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <Eyebrow>Criadora e mentora</Eyebrow>
          <Title>Wanessa Auad</Title>
          <p className="mt-3 text-sm font-medium tracking-wide text-gold">
            Criadora e mentora do My Wellness App | Nutricionista
          </p>
          <GoldRule className="my-8" />
          <div className="space-y-4 text-base leading-relaxed text-ink/80">
            <p>
              Há mais de 20 anos, ajudo pessoas a conquistarem saúde, autoestima e qualidade de vida
              através da educação alimentar. Antes de transformar esse conhecimento em um aplicativo,
              vivi minha própria jornada.
            </p>
            <p>
              Depois da gestação, eliminei 26 kg e aprendi que o maior desafio não era perder peso,
              mas manter uma vida saudável sem viver presa a dietas.
            </p>
            <p>
              Há 14 anos, mantenho esse resultado com a mesma abordagem que hoje ensino no MWA:
              mentalidade, nutrição inteligente, rotina e consistência.
            </p>
            <p>
              Agora, reuni minha expertise em bem-estar em um programa acessível, prático e guiado pelo
              aplicativo, para que você também possa começar sua transformação.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
