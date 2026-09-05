import { useState } from 'react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'

const faqs = [
  ['Como acesso o app?', 'Após a compra pela Hotmart, você recebe por email as instruções e seu código de acesso. É só resgatar e criar sua conta.'],
  ['Preciso baixar na loja de aplicativos?', 'Não. O app funciona direto no navegador do celular e pode ser adicionado à tela inicial em um toque, sem ocupar memória.'],
  ['É um PDF ou e-book?', 'Não. O MWA é uma experiência guiada pelo aplicativo, com registros, conteúdos, metas e acompanhamento diário.'],
  ['Por quanto tempo terei acesso?', 'O acesso da Jornada é de 90 dias, começando quando você criar sua conta.'],
  ['Existe mensalidade?', 'Não. A Jornada de 90 Dias é pagamento único de R$ 197.'],
  ['E se eu não gostar?', 'Você tem 7 dias de garantia incondicional. Basta pedir reembolso e devolvemos 100% do valor, sem perguntas.'],
  ['Posso compartilhar meu acesso?', 'Não. O acesso é individual e pessoal.'],
  [
    'Como falo com vocês se tiver problema?',
    (
      <>
        Suporte por e-mail — respondemos em horário comercial:{' '}
        <a
          href="mailto:atendimento@metodomwa.com.br"
          className="font-semibold text-forest hover:text-forest-deep"
        >
          atendimento@metodomwa.com.br
        </a>
        . Dentro do aplicativo você também encontra um canal de dúvidas pelo WhatsApp.
      </>
    ),
  ],
]

/* Item de FAQ controlado (em vez de <details> nativo) para permitir a
 * transição animada de abertura/fechamento via CSS grid-template-rows
 * (0fr → 1fr) — a técnica padrão para animar algo equivalente a height:auto. */
function ItemFaq({ pergunta, resposta, aberto, onToggle, id }) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-offwhite px-6 py-4 transition-colors open:border-gold/40">
      <button
        type="button"
        id={`faq-pergunta-${id}`}
        aria-expanded={aberto}
        aria-controls={`faq-resposta-${id}`}
        onClick={onToggle}
        className="flex w-full cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-forest md:text-base"
      >
        {pergunta}
        <span aria-hidden="true" className={`shrink-0 text-gold transition-transform duration-300 ${aberto ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div
        id={`faq-resposta-${id}`}
        role="region"
        aria-labelledby={`faq-pergunta-${id}`}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: aberto ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{resposta}</p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [abertoIndex, setAbertoIndex] = useState(null)

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
              <ItemFaq
                id={i}
                pergunta={q}
                resposta={a}
                aberto={abertoIndex === i}
                onToggle={() => setAbertoIndex((atual) => (atual === i ? null : i))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
