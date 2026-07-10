import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'

const MEDIDAS = [
  { id: 'cintura', label: 'Cintura' },
  { id: 'quadril', label: 'Quadril' },
  { id: 'peito', label: 'Peito' },
  { id: 'braco', label: 'Braço' },
  { id: 'coxa', label: 'Coxa' },
]

export default function TelaCorporais({ dados, atualizarMedida, avancar, voltar }) {
  return (
    <>
      <div className="mb-6">
        <span className="mb-3 inline-block rounded-full bg-sage-claro px-3 py-1 text-xs font-semibold text-verde">
          Opcional, mas recomendado
        </span>
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">Medidas corporais</h1>
        <p className="mt-3 text-verde/70">
          A fita métrica mostra progresso que a balança esconde. Meça sem apertar, sobre a pele.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MEDIDAS.map((m) => (
          <CampoNumero
            key={m.id}
            label={m.label}
            sufixo="cm"
            value={dados.medidas[m.id]}
            onChange={(v) => atualizarMedida(m.id, v)}
            placeholder="—"
            step="0.5"
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar}>Continuar</Botao>
        <button type="button" onClick={avancar} className="py-1 text-sm font-medium text-verde/50 underline">
          Pular esta etapa
        </button>
        <Botao variante="secundario" onClick={voltar}>
          Voltar
        </Botao>
      </div>
    </>
  )
}
