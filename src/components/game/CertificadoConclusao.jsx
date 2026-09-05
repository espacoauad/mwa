import { useEffect, useRef, useState } from 'react'
import { X, Share2, Download } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'

/**
 * Certificado de Conclusão — imagem premium e compartilhável.
 * Reutilizável para a Jornada de 30 Dias e o Programa de 90 Dias (prop `dias`).
 * Gera PNG via html2canvas-pro e usa o compartilhamento nativo (fallback: download).
 * A medalha tem entrada animada; o cartão capturado permanece bonito em estático.
 */
export default function CertificadoConclusao({ dias = 30, titulo, onFechar }) {
  const { usuario } = useApp()
  const cardRef = useRef(null)
  const dialogRef = useRef(null)
  const [gerando, setGerando] = useState(false)
  const [aviso, setAviso] = useState(null)

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const nome = usuario?.nome?.trim() || 'Aluna MWA'
  const tituloPrograma = titulo || (dias === 90 ? 'Programa de 90 Dias' : 'Jornada de 30 Dias')
  const dataConclusao = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  async function compartilhar() {
    setGerando(true)
    setAviso(null)
    try {
      await document.fonts?.ready
      const html2canvas = (await import('html2canvas-pro')).default
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 })
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setGerando(false)
          return
        }
        const arquivo = new File([blob], `certificado-mwa-${dias}-dias.png`, { type: 'image/png' })
        if (navigator.canShare?.({ files: [arquivo] })) {
          try {
            await navigator.share({
              files: [arquivo],
              title: 'MWA — Meu certificado',
              text: `Concluí a ${tituloPrograma} do MWA! 🌿✨`,
            })
          } catch {
            /* pessoa cancelou */
          }
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `certificado-mwa-${dias}-dias.png`
          link.click()
          URL.revokeObjectURL(url)
          setAviso('Certificado salvo! Poste nos seus stories 📲')
          setTimeout(() => setAviso(null), 3500)
        }
        setGerando(false)
      }, 'image/png')
    } catch {
      setGerando(false)
      setAviso('Não foi possível gerar a imagem agora. Tente de novo.')
      setTimeout(() => setAviso(null), 3000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 overflow-y-auto bg-verde-escuro/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="certificado-titulo"
    >
      <button
        type="button"
        onClick={onFechar}
        className="fixed right-4 top-4 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      {/* Cartão do certificado (capturado como imagem) */}
      <div
        ref={(el) => {
          cardRef.current = el
          dialogRef.current = el
        }}
        tabIndex={-1}
        className="relative w-full max-w-[20rem] overflow-hidden rounded-[1.75rem] px-6 py-8 text-center outline-none"
        style={{ background: 'linear-gradient(165deg, #f8f4ec 0%, #f5efe2 55%, #efe4d0 100%)' }}
      >
        {/* Moldura dourada ornamental */}
        <div className="pointer-events-none absolute inset-2.5 rounded-[1.35rem] border border-ouro/50" />
        <div className="pointer-events-none absolute inset-[13px] rounded-[1.2rem] border border-ouro/25" />

        <div className="relative">
          <div className="flex items-center justify-center gap-2">
            <LogoMWA variante="simbolo" className="h-6 w-6" />
          </div>
          <p className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.35em] text-verde/50">
            My Wellness Approach
          </p>

          <p id="certificado-titulo" className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-ouro">
            Certificado de Conclusão
          </p>

          {/* Medalha */}
          <div className="relative mx-auto my-4 h-24 w-24">
            {/* Raios girando (atrás) */}
            <svg
              viewBox="0 0 100 100"
              className="mwa-medalha-raios absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {Array.from({ length: 16 }).map((_, i) => (
                <rect
                  key={i}
                  x="49"
                  y="2"
                  width="2"
                  height="16"
                  rx="1"
                  fill="#C59F4F"
                  opacity="0.5"
                  transform={`rotate(${i * 22.5} 50 50)`}
                />
              ))}
            </svg>
            {/* Disco da medalha */}
            <div
              className="mwa-medalha absolute inset-[14px] flex flex-col items-center justify-center rounded-full border-4 border-ouro shadow-lg"
              style={{ background: 'radial-gradient(circle at 35% 30%, #EFE3C7 0%, #C59F4F 55%, #9E7F3F 100%)' }}
            >
              <span className="font-serif text-2xl font-bold leading-none text-verde-escuro">{dias}</span>
              <span className="text-[7px] font-bold uppercase tracking-widest text-verde-escuro/70">dias</span>
            </div>
          </div>

          <p className="text-[10px] text-verde/60">Este certificado reconhece que</p>
          <p className="mt-1.5 font-serif text-xl font-bold italic leading-tight text-verde-escuro">
            {nome}
          </p>
          <p className="mt-2 px-1 text-[11px] leading-relaxed text-verde/75">
            concluiu com dedicação e consciência a <strong className="text-verde">{tituloPrograma}</strong> do
            MWA — construindo hábitos que permanecem.
          </p>

          <div className="mx-auto mt-5 h-px w-2/3 bg-gradient-to-r from-transparent via-ouro/50 to-transparent" />

          <div className="mt-4">
            <p className="font-serif text-base italic text-verde-escuro">Wanessa Auad</p>
            <p className="text-[8px] font-semibold uppercase tracking-wider text-verde/50">
              Nutricionista · CRN-1/27939
            </p>
          </div>

          <p className="mt-4 text-[8px] text-verde/40">{dataConclusao}</p>
        </div>
      </div>

      {/* Ações */}
      <div className="flex w-full max-w-[20rem] flex-col gap-2">
        <button
          type="button"
          onClick={compartilhar}
          disabled={gerando}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ouro to-ouro/90 px-6 py-3.5 font-bold text-verde-escuro shadow-lg shadow-ouro/30 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {navigator.canShare ? <Share2 size={18} /> : <Download size={18} />}
          {gerando ? 'Gerando...' : 'Compartilhar meu certificado'}
        </button>
        {aviso && (
          <p role="status" aria-live="polite" className="text-center text-xs text-white/90">
            {aviso}
          </p>
        )}
        <p className="text-center text-[11px] text-white/60">Mostre sua conquista para o mundo ✨</p>
      </div>
    </div>
  )
}
