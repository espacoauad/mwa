import { GraduationCap } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import fotoWanessa480 from '../assets/foto-wanessa-final-480.webp'
import fotoWanessa800 from '../assets/foto-wanessa-final-800.webp'
import fotoWanessa1200 from '../assets/foto-wanessa-final-1200.webp'

const learnings = [
  'Montar refeições equilibradas',
  'Controlar calorias sem sofrimento',
  'Consumir proteínas corretamente',
  'Manter o metabolismo ativo',
  'Lidar com a fome',
  'Evitar o efeito sanfona',
  'Criar hábitos que permanecem',
]

export default function About() {
  return (
    <Section className="bg-cream" wide>
      <div className="grid items-center gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
        <Reveal className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-3xl border border-gold/30 shadow-xl shadow-forest/10">
            <img
              src={fotoWanessa800}
              srcSet={`${fotoWanessa480} 480w, ${fotoWanessa800} 800w, ${fotoWanessa1200} 1200w`}
              sizes="(min-width: 768px) 35vw, 90vw"
              alt="Wanessa Auad"
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <Eyebrow>Quem guia você</Eyebrow>
            <Title>Criado por Wanessa Auad</Title>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Nutricionista · CRN-1/27939 · 20+ anos de experiência
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-6 space-y-4 text-base leading-relaxed text-ink/80">
            <p>
              Há mais de 20 anos ajudo pessoas a conquistarem saúde, autoestima e qualidade de vida
              através da educação alimentar. Antes de virar método, essa abordagem foi a minha
              própria jornada.
            </p>
            <p>Durante os 30 dias, você aprende comigo a:</p>
          </Reveal>
          <Reveal delay={180} className="mt-4 grid gap-2 sm:grid-cols-2">
            {learnings.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <GraduationCap size={16} aria-hidden="true" className="shrink-0 text-sage" />
                <p className="text-sm text-ink/80">{item}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
