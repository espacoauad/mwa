import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'
import { BRAND } from '../config.js'
import fotoWanessa from '../assets/foto-wanessa.png'

export default function About() {
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-12 md:grid-cols-5">
        <div className="md:col-span-2">
          {/* Espaço reservado para foto profissional */}
          <div className="relative aspect-square overflow-hidden rounded-full border border-gold/30 bg-sand/60">
            <img src={fotoWanessa} alt="Wanessa Auad — nutricionista" className="absolute left-1/2 top-4 w-[92%] -translate-x-1/2 object-contain" />
          </div>
        </div>
        <div className="md:col-span-3">
          <Eyebrow>Quem criou o método</Eyebrow>
          <Title>Criado por Wanessa Auad</Title>
          <p className="mt-3 text-sm font-medium tracking-wide text-gold">
            Nutricionista | CRN-1/27939 | Especialista em emagrecimento há mais de 20 anos
          </p>
          <GoldRule className="my-8" />
          <div className="space-y-4 text-base leading-relaxed text-ink/80">
            <p>
              Há mais de 20 anos, ajudo pessoas a conquistarem saúde, autoestima e qualidade de vida
              através da educação alimentar. Mas antes de transformar esse conhecimento em método,
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
              Agora, reuni essa experiência em um programa acessível, prático e guiado pelo
              aplicativo, para que você também possa começar sua transformação.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
