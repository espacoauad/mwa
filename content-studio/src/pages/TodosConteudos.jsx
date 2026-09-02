import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContentItems } from '../hooks/useContentItems'
import { STATUS_CONTEUDO, STATUS_LABELS } from '../data/options'
import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'

export default function TodosConteudos() {
  const { items } = useContentItems()
  const [filtro, setFiltro] = useState('todos')

  const filtrados = filtro === 'todos' ? items : items.filter((i) => i.status === filtro)
  const ordenados = [...filtrados].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Todos os conteúdos</h1>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro('todos')}
          className={`font-ui rounded-full px-4 py-2 text-sm ${filtro === 'todos' ? 'bg-forest text-offwhite' : 'bg-white text-forest-deep border border-sand'}`}
        >
          Todos ({items.length})
        </button>
        {STATUS_CONTEUDO.map((status) => (
          <button
            key={status}
            onClick={() => setFiltro(status)}
            className={`font-ui rounded-full px-4 py-2 text-sm ${filtro === status ? 'bg-forest text-offwhite' : 'bg-white text-forest-deep border border-sand'}`}
          >
            {STATUS_LABELS[status]} ({items.filter((i) => i.status === status).length})
          </button>
        ))}
      </div>

      {ordenados.length === 0 ? (
        <EmptyState title="Nenhum conteúdo neste filtro" />
      ) : (
        <div className="space-y-3">
          {ordenados.map((item) => (
            <Link key={item.id} to={`/conteudos/${item.id}`}>
              <Card className="flex items-center justify-between hover:border-forest/40">
                <div>
                  <p className="font-medium text-forest-deep">{item.tituloInterno || item.tema}</p>
                  <p className="text-xs text-mist">{item.formato} · {item.finalidade}</p>
                </div>
                <StatusBadge status={item.status} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
