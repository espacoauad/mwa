import { useState } from 'react'
import { iniciarPagamento } from '../../utils/pagamentos.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Botão que abre o Checkout Pro do Mercado Pago (PIX, cartão, boleto).
// Em caso de falha, mostra o erro e oferece o WhatsApp como caminho alternativo.
export default function BotaoPagamento({ tipo, className, children, fallbackWhatsApp }) {
  const { ingles } = useIdioma()
  const [abrindo, setAbrindo] = useState(false)
  const [erro, setErro] = useState(null)

  async function pagar() {
    setAbrindo(true)
    setErro(null)
    try {
      const { init_point } = await iniciarPagamento(tipo)
      window.location.href = init_point
    } catch (e) {
      setErro(e.message)
      setAbrindo(false)
    }
  }

  return (
    <>
      <button type="button" onClick={pagar} disabled={abrindo} className={className}>
        {abrindo ? (ingles ? 'Opening payment…' : 'Abrindo pagamento…') : children}
      </button>
      {erro && (
        <p className="mt-2 rounded-lg border-2 border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700">
          {erro}
          {fallbackWhatsApp && (
            <>
              {' '}
              <a href={fallbackWhatsApp} target="_blank" rel="noopener noreferrer" className="font-bold underline">
                {ingles ? 'Talk to Wanessa on WhatsApp' : 'Falar com a Wanessa no WhatsApp'}
              </a>
            </>
          )}
        </p>
      )}
    </>
  )
}
