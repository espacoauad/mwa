import { Check } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

const imagine = [
  'Acordar se sentindo mais leve e com mais energia.',
  'Vestir aquela roupa que hoje está apertada.',
  'Saber exatamente o que comer e por quê — sem depender de modismos.',
  'Olhar para a balança e perceber que finalmente está no caminho.',
  'Sentir orgulho de ter sustentado uma rotina saudável por 30 dias.',
  'Entender que você não precisa recomeçar do zero nunca mais.',
]

const chips = ['Mais leveza', 'Menos culpa', 'Mais clareza', 'Mais consistência']

export default function Benefits() {
  return (
    <Section className="bg-offwhite" lazy intrinsicHeight={970}>
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>A transformação</Eyebrow>
          <Title>Imagine como será daqui a 30 dias.</Title>
        </Reveal>
        <div className="mt-10 space-y-3">
          {imagine.map((item, i) => (
            <Reveal key={item} delay={i * 70} className="flex items-start gap-3 rounded-2xl border border-forest/10 bg-cream/60 p-5">
              <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-sage" strokeWidth={2.2} />
              <p className="text-sm leading-relaxed text-ink/85 md:text-base">{item}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200} className="mt-8 flex flex-wrap justify-center gap-2.5">
          {chips.map((c) => (
            <span key={c} className="rounded-full border border-sage/40 bg-sage/10 px-4 py-2 text-xs font-semibold text-forest md:text-sm">
              {c}
            </span>
          ))}
        </Reveal>
        <Reveal delay={260} className="mt-10 text-center">
          <p className="text-base leading-relaxed text-ink/75">
            Essa transformação começa com pequenas decisões feitas todos os dias.
          </p>
          <p className="mt-1 font-display text-lg italic text-forest">E você não estará sozinha.</p>
        </Reveal>
      </div>
    </Section>
  )
}
