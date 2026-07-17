import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const MEDIDAS = [
  { id: 'cintura', pt: 'Cintura', en: 'Waist' },
  { id: 'quadril', pt: 'Quadril', en: 'Hips' },
  { id: 'peito', pt: 'Peito', en: 'Chest' },
  { id: 'braco', pt: 'Braço', en: 'Arm' },
  { id: 'coxa', pt: 'Coxa', en: 'Thigh' },
]

export default function TelaCorporais({ dados, atualizarMedida, avancar, voltar }) {
  const { ingles } = useIdioma()
  return (
    <>
      <div className="mb-6">
        <span className="mb-3 inline-block rounded-full bg-sage-claro px-3 py-1 text-xs font-semibold text-verde">
          {ingles ? 'Optional, but recommended' : 'Opcional, mas recomendado'}
        </span>
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">{ingles ? 'Body measurements' : 'Medidas corporais'}</h1>
        <p className="mt-3 text-verde/70">
          {ingles ? 'A measuring tape reveals progress the scale can hide. Measure directly on the skin without tightening.' : 'A fita métrica mostra progresso que a balança esconde. Meça sem apertar, sobre a pele.'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MEDIDAS.map((m) => (
          <CampoNumero
            key={m.id}
            label={ingles ? m.en : m.pt}
            sufixo="cm"
            value={dados.medidas[m.id]}
            onChange={(v) => atualizarMedida(m.id, v)}
            placeholder="—"
            step="0.5"
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar}>{ingles ? 'Continue' : 'Continuar'}</Botao>
        <button type="button" onClick={avancar} className="py-1 text-sm font-medium text-verde/50 underline">
          {ingles ? 'Skip this step' : 'Pular esta etapa'}
        </button>
        <Botao variante="secundario" onClick={voltar}>
          {ingles ? 'Back' : 'Voltar'}
        </Botao>
      </div>
    </>
  )
}
