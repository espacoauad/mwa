import { MessageCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function BotaoWhatsApp() {
  const { diaAtual } = useApp()
  const { ingles } = useIdioma()
  const mensagem = encodeURIComponent(ingles
    ? `Hello! I’m an MWA participant | 90-Day Journey, Day ${diaAtual}.`
    : `Olá! Sou aluna do MWA | Jornada de 90 Dias, Dia ${diaAtual}.`)
  const link = `https://wa.me/5562994246775?text=${mensagem}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ingles ? 'Chat with the nutritionist on WhatsApp' : 'Chat com a nutricionista no WhatsApp'}
      className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-verde p-3.5 text-white shadow-lg shadow-verde/30 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle size={24} />
    </a>
  )
}
