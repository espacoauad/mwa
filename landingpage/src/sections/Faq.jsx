import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

const faqs = [
  ['Como acesso o app?', 'Após a compra pela Hotmart, você recebe por email as instruções e seu código de acesso. É só resgatar e criar sua conta.'],
  ['Preciso baixar na loja de aplicativos?', 'Não. O app funciona direto no navegador do celular e pode ser adicionado à tela inicial em um toque, sem ocupar memória.'],
  ['É um PDF ou e-book?', 'Não. O MWA é uma experiência guiada pelo aplicativo, com registros, conteúdos, metas e acompanhamento diário.'],
  ['Por quanto tempo terei acesso?', 'O acesso da Jornada é de 30 dias, começando quando você criar sua conta.'],
  ['Posso continuar depois dos 30 dias?', 'Sim. Você pode adicionar o MWA | Programa de 90 Dias já no checkout, em condição especial para alunas, ou contratar a continuidade dentro do aplicativo.'],
  ['Existe mensalidade?', 'Não. A Jornada de 30 Dias é pagamento único de R$ 97.'],
  ['E se eu não gostar?', 'Você tem 7 dias de garantia incondicional. Basta pedir reembolso e devolvemos 100% do valor, sem perguntas.'],
  ['Posso compartilhar meu acesso?', 'Não. O acesso é individual e pessoal.'],
]

export default function Faq() {
  return (
    <Section className="bg-cream" lazy intrinsicHeight={670}>
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Eyebrow>Dúvidas frequentes</Eyebrow>
          <Title>O que você precisa saber</Title>
        </Reveal>
        <div className="mt-10 space-y-3">
          {faqs.map(([q, a], i) => (
            <Reveal key={q} delay={i * 50}>
              <details className="group rounded-2xl border border-forest/10 bg-offwhite px-6 py-4 transition-colors open:border-gold/40">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-forest md:text-base">
                  {q}
                  <span aria-hidden="true" className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
