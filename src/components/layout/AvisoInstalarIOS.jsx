// src/components/layout/AvisoInstalarIOS.jsx
import { useEffect, useState } from 'react'
import { deveMostrarAvisoIOS } from '../../utils/avisoIOS.js'

const CHAVE_DISPENSADO = 'mwa_aviso_ios_dispensado'

export default function AvisoInstalarIOS() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
    const dispensado = localStorage.getItem(CHAVE_DISPENSADO) === '1'
    setVisivel(deveMostrarAvisoIOS({ userAgent: navigator.userAgent, standalone, dispensado }))
  }, [])

  if (!visivel) return null

  function dispensar() {
    localStorage.setItem(CHAVE_DISPENSADO, '1')
    setVisivel(false)
  }

  return (
    <div className="fixed inset-x-4 bottom-20 z-40 flex items-center justify-between gap-3 rounded-2xl border border-verde/20 bg-white p-3 text-sm text-verde shadow-lg">
      <p>📲 Adicione o MWA à tela de início para receber lembretes mesmo com o app fechado.</p>
      <button type="button" onClick={dispensar} className="shrink-0 font-semibold text-verde/70">
        Entendi
      </button>
    </div>
  )
}
