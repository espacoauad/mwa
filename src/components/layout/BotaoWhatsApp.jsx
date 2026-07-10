import { MessageCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function BotaoWhatsApp() {
  const { diaAtual } = useApp()
  const mensagem = encodeURIComponent(`Olá! Sou aluna do MWA | Jornada de 21 Dias, Dia ${diaAtual}.`)
  const link = `https://wa.me/5562994246775?text=${mensagem}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat com a nutricionista no WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-verde p-3.5 text-white shadow-lg shadow-verde/30 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle size={24} />
    </a>
  )
}
