import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Section, Eyebrow, Title } from '../components/ui.jsx'

const faqs = [
  ['Como acesso o app?', 'Após a compra pela Hotmart, você receberá as instruções de acesso ao aplicativo.'],
  ['Preciso baixar na loja de aplicativos?', 'O acesso será explicado após a compra. A experiência foi criada para ser simples e prática no celular.'],
  ['É um PDF ou e-book?', 'Não. O MWA é uma experiência guiada pelo aplicativo, com acompanhamento diário, registros, conteúdos e metas.'],
  ['Por quanto tempo terei acesso?', 'O acesso inicial é de 21 dias.'],
  ['Posso continuar depois dos 21 dias?', 'Sim. Dentro do aplicativo, você poderá receber a oferta para continuar no Programa de 90 Dias.'],
  ['Quanto custa o programa inicial?', 'O investimento para a Jornada de 21 Dias é de R$ 97, em pagamento único.'],
  ['Existe mensalidade?', 'Não. O programa inicial é pagamento único.'],
  ['E se eu não gostar?', 'Você tem 7 dias de garantia incondicional. Se sentir que não é para você, pode solicitar reembolso.'],
  ['Posso compartilhar meu acesso?', 'Não. O acesso é individual e pessoal.'],
  ['A sessão individual está inclusa?', 'Não. A Sessão Estratégica MWA é uma oferta opcional dentro do aplicativo, com condições apresentadas diretamente por lá.'],
]

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-sand">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-forest-deep">{question}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gold transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="pb-5 text-sm leading-relaxed text-ink/75">{answer}</p>}
    </div>
  )
}

export default function Faq() {
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <Eyebrow>Dúvidas frequentes</Eyebrow>
          <Title>Perguntas e respostas</Title>
        </div>
        <div className="mt-10">
          {faqs.map(([q, a]) => (
            <FaqItem key={q} question={q} answer={a} />
          ))}
        </div>
      </div>
    </Section>
  )
}
