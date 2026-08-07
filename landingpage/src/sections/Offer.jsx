import { useEffect, useRef } from 'react'
import { Check, ShieldCheck, Sparkles } from 'lucide-react'
import { Section, Eyebrow, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import { BRAND } from '../config.js'
import { track } from '../lib/analytics.js'

const included = [
  'Acesso completo ao aplicativo durante 90 dias',
  'Acompanhamento diário da alimentação',
  'Controle de água, peso, evolução e metas',
  'Cálculo personalizado de calorias e macronutrientes',
  'Conteúdos, dicas e informativos liberados diariamente',
  'Registro de exercícios com calorias gastas',
  'Jogos, recompensas e personalização do avatar',
  'Acesso imediato após a compra',
]

export default function Offer() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track('ViewContent')
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Section id="oferta" className="bg-offwhite">
      <div ref={sectionRef}>
      <Reveal className="mx-auto mb-10 max-w-2xl space-y-2 text-center">
        <p className="font-display text-xl italic text-forest md:text-2xl">
          Quanto vale parar de recomeçar toda segunda-feira?
        </p>
        <p className="text-sm text-mist md:text-base">
          Você pode investir centenas de reais em tentativas isoladas — ou começar hoje com um método completo.
        </p>
      </Reveal>

      <Reveal delay={100} className="mx-auto max-w-lg">
        <div className="rounded-[2rem] border border-gold/40 bg-white p-8 text-center shadow-2xl shadow-forest/10 md:p-12">
          <Eyebrow>Comece hoje</Eyebrow>
          <h3 className="font-display text-2xl text-forest-deep md:text-3xl">{BRAND.product}</h3>
          <div className="mt-8">
            <p className="font-display text-6xl text-forest md:text-7xl">{BRAND.price}</p>
            <p className="mt-2 text-sm text-mist">Pagamento único. Sem mensalidade.</p>
          </div>
          <ul className="mt-10 space-y-3 text-left">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-gold" strokeWidth={2.2} />
                <p className="text-sm leading-relaxed text-ink/80">{item}</p>
              </li>
            ))}
          </ul>
          <CtaButton className="mt-10 w-full">Quero começar meus 90 dias</CtaButton>

          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-sage/10 p-4 text-left">
            <ShieldCheck size={24} aria-hidden="true" className="shrink-0 text-sage" />
            <p className="text-xs leading-relaxed text-ink/80 md:text-sm">
              <strong className="text-forest">Garantia incondicional de 7 dias.</strong> Se sentir
              que não é para você, devolvemos 100% do valor. Sem burocracia, sem perguntas.
            </p>
          </div>

          <div className="mt-3 flex items-start gap-3 rounded-2xl bg-gold/10 p-4 text-left">
            <Sparkles size={24} aria-hidden="true" className="shrink-0 text-gold" />
            <p className="text-xs leading-relaxed text-ink/80 md:text-sm">
              <strong className="text-forest">Quer acelerar seus resultados?</strong> Durante os
              90 dias, você pode adicionar a <strong>Sessão Estratégica Individual</strong> comigo
              — R$ 297, opcional, contratada quando quiser dentro do aplicativo.
            </p>
          </div>

        </div>
      </Reveal>
      </div>
    </Section>
  )
}
