import Botao from '../ui/Botao.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function TelaContato({ dados, atualizar, avancar }) {
  const { ingles } = useIdioma()
  const emailValido = /\S+@\S+\.\S+/.test(dados.email)
  const valido = dados.nome.trim().length >= 2 && emailValido && dados.whatsapp.trim().length >= 10

  const campo =
    'w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-4 text-lg font-medium text-verde outline-none transition-colors focus:border-sage'

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
            value={dados.nome}
            onChange={(e) => atualizar('nome', e.target.value)}
            placeholder={ingles ? 'Your name' : 'Seu nome'}
            className={campo}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-verde">E-mail</span>
          <input
            type="email"
            value={dados.email}
            onChange={(e) => atualizar('email', e.target.value)}
            placeholder="voce@email.com"
            className={campo}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-verde">WhatsApp</span>
          <input
            type="tel"
            value={dados.whatsapp}
            onChange={(e) => atualizar('whatsapp', e.target.value)}
            placeholder="(62) 99999-9999"
            className={campo}
          />
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
