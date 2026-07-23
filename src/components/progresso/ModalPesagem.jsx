import { useEffect, useRef, useState } from 'react'
import { X, Camera } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useConfeti } from '../../hooks/useConfeti.js'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { redimensionarImagemProporcional } from '../../lib/imagem.js'

const FOTOS = [
  { id: 'frente', pt: 'Frente', en: 'Front' },
  { id: 'costas', pt: 'Costas', en: 'Back' },
  { id: 'latEsq', pt: 'Lateral esq.', en: 'Left side' },
  { id: 'latDir', pt: 'Lateral dir.', en: 'Right side' },
]

const MEDIDAS = [
  { id: 'cintura', pt: 'Cintura', en: 'Waist' },
  { id: 'quadril', pt: 'Quadril', en: 'Hips' },
  { id: 'peito', pt: 'Peito', en: 'Chest' },
]

export default function ModalPesagem({ semana, onFechar }) {
  const { ingles } = useIdioma()
  const { adicionarPesagem } = useApp()
  const { celebrarGrande } = useConfeti()
  const [peso, setPeso] = useState('')
  const [fotos, setFotos] = useState({})
  const [medidas, setMedidas] = useState({ cintura: '', quadril: '', peito: '' })
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  // Move o foco para o diálogo assim que ele é aberto (a11y: modal focus management).
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  async function escolherFoto(id, e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    const dataUrl = await redimensionarImagemProporcional(arquivo)
    setFotos((f) => ({ ...f, [id]: dataUrl }))
  }

  const valido = Number(peso) >= 30 && Number(peso) <= 300

  function salvar() {
    adicionarPesagem({
      semana,
      peso: Number(peso),
      fotos,
      medidas: {
        cintura: Number(medidas.cintura) || null,
        quadril: Number(medidas.quadril) || null,
        peito: Number(medidas.peito) || null,
      },
    })
    const prefereMenosMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefereMenosMovimento) {
      // Sem confete: fecha o modal logo em seguida, sem esperar a animação
      onFechar()
    } else {
      // 🎉 Dispara confete de celebração
      celebrarGrande()
      // Fecha o modal após a animação
      setTimeout(() => onFechar(), 600)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={onFechar}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-pesagem-titulo"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-pesagem-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? 'Weigh-in — week' : 'Pesagem — semana'} {semana}</h2>
          <button
            type="button"
            aria-label={ingles ? 'Close' : 'Fechar'}
            onClick={onFechar}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"
          >
            <X size={18} />
          </button>
        </div>

        <CampoNumero label={ingles ? 'Today’s weight' : 'Peso de hoje'} sufixo="kg" value={peso} onChange={setPeso} placeholder={ingles ? 'Example: 71.2' : 'Ex.: 71.2'} step="0.1" />

        <div className="mt-4">
          <span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Progress photos' : 'Fotos de progresso'}</span>
          <div className="grid grid-cols-4 gap-2">
            {FOTOS.map((f) => (
              <label key={f.id} className="cursor-pointer rounded-lg text-center focus-within:ring-2 focus-within:ring-sage focus-within:ring-offset-2">
                {fotos[f.id] ? (
                  <img src={fotos[f.id]} alt={ingles ? f.en : f.pt} className="aspect-[3/4] w-full rounded-lg object-cover" />
                ) : (
                  <span className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border-2 border-dashed border-sage/40 bg-white text-sage">
                    <Camera size={18} />
                  </span>
                )}
                <span className="mt-1 block text-[10px] font-medium text-verde/60">{ingles ? f.en : f.pt}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => escolherFoto(f.id, e)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Measurements (optional)' : 'Medidas (opcional)'}</span>
          <div className="grid grid-cols-3 gap-2">
            {MEDIDAS.map((m) => (
              <CampoNumero
                key={m.id}
                label={ingles ? m.en : m.pt}
                sufixo="cm"
                value={medidas[m.id]}
                onChange={(v) => setMedidas((x) => ({ ...x, [m.id]: v }))}
                placeholder="—"
                step="0.5"
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <Botao onClick={salvar} disabled={!valido}>
            {ingles ? 'Save weigh-in' : 'Salvar pesagem'}
          </Botao>
        </div>
      </div>
    </div>
  )
}
