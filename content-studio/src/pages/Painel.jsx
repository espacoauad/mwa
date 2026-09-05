import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useContentItems } from '../hooks/useContentItems'
import { STATUS_LABELS } from '../data/options'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'

export default function Painel() {
  const { items, contagemPorStatus } = useContentItems()

  const recentes = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  const aguardandoRevisao = items.filter((i) => i.status === 'em_revisao').slice(0, 5)

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-forest-deep" style={{ fontFamily: 'Georgia, serif' }}>Painel Inicial</h1>
        <Link to="/criar">
          <Button><Plus size={18} /> Criar novo conteúdo</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <Card key={status} className="text-center">
            <p className="text-2xl font-semibold text-forest">{contagemPorStatus[status] || 0}</p>
            <p className="mt-1 text-xs text-mist">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-forest-deep">Criados recentemente</h2>
          {recentes.length === 0 ? (
            <EmptyState title="Nada por aqui ainda" description="Crie seu primeiro conteúdo para começar." />
          ) : (
            <ul className="space-y-3">
              {recentes.map((item) => (
                <li key={item.id}>
                  <Link to={`/conteudos/${item.id}`} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-forest/5">
                    <span className="truncate">{item.tituloInterno || item.tema}</span>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-forest-deep">Aguardando revisão</h2>
          {aguardandoRevisao.length === 0 ? (
            <EmptyState title="Nada aguardando revisão" description="Tudo em dia por aqui." />
          ) : (
            <ul className="space-y-3">
              {aguardandoRevisao.map((item) => (
                <li key={item.id}>
                  <Link to={`/conteudos/${item.id}`} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-forest/5">
                    <span className="truncate">{item.tituloInterno || item.tema}</span>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Link to="/conteudos" className="inline-block text-sm font-medium text-forest underline">Ver todos os conteúdos</Link>
    </div>
  )
}
