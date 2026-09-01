import { EmptyState } from '../components/ui/EmptyState'

export default function EmBreve({ titulo, fase }) {
  return (
    <div className="p-6">
      <EmptyState
        title={`${titulo} — em breve`}
        description={`Esta área chega na ${fase} do MWA Content Studio. Por enquanto, use Criar Conteúdo e Modelos Prontos.`}
      />
    </div>
  )
}
