import { Check, ShieldCheck } from 'lucide-react'
import { Section, Eyebrow, Title, CtaButton } from '../components/ui.jsx'
import { BRAND } from '../config.js'

const included = [
  'Acesso completo ao aplicativo durante 21 dias',
  'Acompanhamento diário da alimentação',
  'Controle de água, peso, evolução e metas',
  'Conteúdos e dicas exclusivas',
  'Orientações para construção de hábitos',
  'Registro de progresso',
  'Acesso imediato após a compra',
  'Garantia incondicional de 7 dias',
]

export default function Offer() {
  return (
    <>
      {/* Oferta principal */}
      <Section id="oferta" className="bg-sand/50">
        <div className="mx-auto max-w-lg">
          <div className="rounded-[2rem] border border-gold/30 bg-white p-8 text-center shadow-xl shadow-forest/5 md:p-12">
            <Eyebrow>Comece hoje sua Jornada de 21 Dias</Eyebrow>
            <h3 className="font-display text-2xl text-forest-deep md:text-3xl">
              MWA | Jornada de 21 Dias
            </h3>
            <div className="mt-8">
              <p className="font-display text-6xl text-forest">{BRAND.price}</p>
              <p className="mt-2 text-sm text-mist">Pagamento único. Sem mensalidade.</p>
            </div>
            <ul className="mt-10 space-y-3 text-left">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
                  <p className="text-sm leading-relaxed text-ink/80">{item}</p>
                </li>
              ))}
            </ul>
            <CtaButton className="mt-10 w-full">Quero começar meus 21 dias</CtaButton>
            <p className="mt-4 text-xs text-mist">Compra segura pela Hotmart · Acesso imediato</p>
          </div>
        </div>
      </Section>

      {/* Garantia */}
      <Section className="bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-cream">
            <ShieldCheck className="h-8 w-8 text-gold" strokeWidth={1.5} />
          </div>
          <Title className="mt-6">Risco zero para começar.</Title>
          <div className="mt-6 max-w-xl space-y-3 text-base leading-relaxed text-ink/80">
            <p>
              Você terá <strong className="font-semibold text-forest">7 dias de garantia incondicional</strong>.
              Se entrar no programa e sentir que ele não é para você, devolvemos 100% do valor.
            </p>
            <p>Sem burocracia. Sem perguntas.</p>
            <p className="font-display text-lg italic text-forest">
              O risco é continuar no mesmo lugar.
            </p>
          </div>
        </div>
      </Section>
    </>
  )
}
