import { useState } from 'react'
import Botao from '../ui/Botao.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function TelaContato({ dados, atualizar, avancar }) {
  const { ingles } = useIdioma()
  const [tocado, setTocado] = useState({})
  const nomeValido = dados.nome.trim().length >= 2
  const emailValido = /\S+@\S+\.\S+/.test(dados.email)
  const whatsappValido = dados.whatsapp.trim().length >= 10
  const valido = nomeValido && emailValido && whatsappValido

  function marcarTocado(campo) {
    setTocado((t) => ({ ...t, [campo]: true }))
  }

  const campo =
    'w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-4 text-lg font-medium text-verde outline-none transition-colors focus:border-sage'
  const campoInvalido = 'w-full rounded-lg border-2 border-red-300 bg-white px-4 py-4 text-lg font-medium text-verde outline-none transition-colors focus:border-red-400'

  const erroNome = ingles ? 'Enter your full name.' : 'Informe seu nome completo.'
  const erroEmail = ingles ? 'Enter a valid e-mail address.' : 'Informe um e-mail válido.'
  const erroWhatsapp = ingles ? 'Enter a valid phone number with area code.' : 'Informe um número válido com DDD.'

  return (
    <>
      <div className="mb-8">
        <LogoMWA variante="simbolo" className="mb-4 h-12 w-12" />
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {ingles ? 'More than a method, a lifestyle that transforms!' : 'Mais do que um método, um estilo de vida que transforma!'}
        </h1>
        <p className="mt-3 text-verde/70">
          {ingles ? 'First, your contact details for follow-up.' : 'Primeiro, seus dados de contato para o acompanhamento.'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Full name' : 'Nome completo'}</span>
          <input
            type="text"
            autoComplete="name"
            value={dados.nome}
            onChange={(e) => atualizar('nome', e.target.value)}
            onBlur={() => marcarTocado('nome')}
            placeholder={ingles ? 'Your name' : 'Seu nome'}
            aria-invalid={tocado.nome && !nomeValido}
            aria-describedby={tocado.nome && !nomeValido ? 'erro-nome' : undefined}
            className={tocado.nome && !nomeValido ? campoInvalido : campo}
          />
          {tocado.nome && !nomeValido && (
            <p id="erro-nome" role="alert" className="mt-1.5 text-sm font-medium text-red-700">{erroNome}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-verde">E-mail</span>
          <input
            type="email"
            autoComplete="email"
            spellCheck={false}
            value={dados.email}
            onChange={(e) => atualizar('email', e.target.value)}
            onBlur={() => marcarTocado('email')}
            placeholder="voce@email.com"
            aria-invalid={tocado.email && !emailValido}
            aria-describedby={tocado.email && !emailValido ? 'erro-email' : undefined}
            className={tocado.email && !emailValido ? campoInvalido : campo}
          />
          {tocado.email && !emailValido && (
            <p id="erro-email" role="alert" className="mt-1.5 text-sm font-medium text-red-700">{erroEmail}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-verde">WhatsApp</span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            value={dados.whatsapp}
            onChange={(e) => atualizar('whatsapp', e.target.value)}
            onBlur={() => marcarTocado('whatsapp')}
            placeholder="(62) 99999-9999"
            aria-invalid={tocado.whatsapp && !whatsappValido}
            aria-describedby={tocado.whatsapp && !whatsappValido ? 'erro-whatsapp' : undefined}
            className={tocado.whatsapp && !whatsappValido ? campoInvalido : campo}
          />
          {tocado.whatsapp && !whatsappValido && (
            <p id="erro-whatsapp" role="alert" className="mt-1.5 text-sm font-medium text-red-700">{erroWhatsapp}</p>
          )}
        </label>

      </div>

      <div className="mt-auto pt-8">
        <Botao onClick={avancar} disabled={!valido}>
          {ingles ? 'Continue' : 'Continuar'}
        </Botao>
      </div>
    </>
  )
}
