import { Check } from 'lucide-react'
import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'

const emotional = [
  'Acordar se sentindo mais leve.',
  'Vestir aquela roupa que hoje está apertada.',
  'Saber exatamente o que comer sem depender de dietas malucas.',
  'Olhar para a balança e perceber que finalmente está no caminho certo.',
  'Sentir orgulho de ter mantido uma rotina saudável.',
  'Entender que você não precisa recomeçar do zero mais uma vez.',
]

const learnings = [
  'Como montar refeições equilibradas.',
  'Como controlar calorias sem sofrimento.',
  'Como consumir proteínas corretamente.',
  'Como manter o metabolismo ativo.',
  'Como lidar com a fome.',
  'Como evitar o efeito sanfona.',
  'Como criar hábitos que realmente permanecem.',
]

export default function Benefits() {
  return (
    <>
      {/* Benefícios emocionais */}
      <Section className="bg-cream">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Sua nova rotina</Eyebrow>
          <Title>Imagine como será daqui a 21 dias.</Title>
          <GoldRule className="mx-auto my-8" />
        </div>
        <ul className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          {emotional.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-2xl bg-white p-5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
              <p className="text-sm leading-relaxed text-ink/80">{item}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl text-center font-display text-lg italic text-forest">
          Essa transformação começa com pequenas decisões feitas todos os dias. E você não estará
          sozinha.
        </p>
      </Section>

      {/* Por que funciona */}
      <Section className="bg-forest text-cream">
        <div className="grid items-start gap-12 md:grid-cols-2">
          <div>
            <Eyebrow light>O diferencial</Eyebrow>
            <Title light>Por que o My Wellness App funciona?</Title>
            <GoldRule className="my-8" />
            <p className="text-base leading-relaxed text-cream/85">
              Porque ele une educação, prática e acompanhamento real do dia. Você aprende enquanto faz e
              constrói autonomia para continuar evoluindo depois do programa.
            </p>
            <p className="mt-8 font-display text-2xl italic leading-snug text-gold-soft">
              O MWA não entrega apenas informação. Ele organiza a prática.
            </p>
          </div>
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.2em] text-cream/60">
              Durante a jornada, você aprenderá
            </p>
            <ul className="space-y-3">
              {learnings.map((item) => (
                <li key={item} className="flex items-start gap-3 border-b border-cream/10 pb-3">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
                  <p className="text-sm leading-relaxed text-cream/85">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  )
}
