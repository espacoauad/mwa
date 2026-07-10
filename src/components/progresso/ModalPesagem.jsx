import { useState } from 'react'
import { X, Camera } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'

const FOTOS = [
  { id: 'frente', label: 'Frente' },
  { id: 'costas', label: 'Costas' },
  { id: 'latEsq', label: 'Lateral esq.' },
  { id: 'latDir', label: 'Lateral dir.' },
]

const MEDIDAS = [
  { id: 'cintura', label: 'Cintura' },
  { id: 'quadril', label: 'Quadril' },
  { id: 'peito', label: 'Peito' },
]

export default function ModalPesagem({ semana, onFechar }) {
  const { adicionarPesagem } = useApp()
  const [peso, setPeso] = useState('')
  const [fotos, setFotos] = useState({})
  const [medidas, setMedidas] = useState({ cintura: '', quadril: '', peito: '' })

  function escolherFoto(id, e) {
    const arquivo = e.target.files?.[0]
    if (arquivo) setFotos((f) => ({ ...f, [id]: URL.createObjectURL(arquivo) }))
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
    onFechar()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={onFechar}>
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold italic text-verde">Pesagem — semana {semana}</h2>
          <button type="button" aria-label="Fechar" onClick={onFechar} className="rounded-full bg-white p-2 text-verde/60">
            <X size={18} />
          </button>
        </div>

        <CampoNumero label="Peso de hoje" sufixo="kg" value={peso} onChange={setPeso} placeholder="Ex.: 71.2" step="0.1" />

        <div className="mt-4">
          <span className="mb-2 block text-sm font-semibold text-verde">Fotos de progresso</span>
          <div className="grid grid-cols-4 gap-2">
            {FOTOS.map((f) => (
              <label key={f.id} className="cursor-pointer text-center">
                {fotos[f.id] ? (
                  <img src={fotos[f.id]} alt={f.label} className="aspect-[3/4] w-full rounded-lg object-cover" />
                ) : (
                  <span className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border-2 border-dashed border-sage/40 bg-white text-sage">
                    <Camera size={18} />
                  </span>
                )}
                <span className="mt-1 block text-[10px] font-medium text-verde/60">{f.label}</span>
                <input type="file" accept="image/*" capture="environment" onChange={(e) => escolherFoto(f.id, e)} className="hidden" />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-sm font-semibold text-verde">Medidas (opcional)</span>
          <div className="grid grid-cols-3 gap-2">
            {MEDIDAS.map((m) => (
              <CampoNumero
                key={m.id}
                label={m.label}
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
            Salvar pesagem
          </Botao>
        </div>
      </div>
    </div>
  )
}
