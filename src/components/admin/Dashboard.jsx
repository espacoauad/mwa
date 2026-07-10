import { useAdmin } from '../../context/AdminContext.jsx'
import { TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { usuarios, pagamentos, sessoes, filtro, setFiltro, carregando } = useAdmin()

  const filtros = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: '7 Dias' },
    { id: 'mes', label: 'Mês' },
    { id: 'ano', label: 'Ano' },
    { id: 'tudo', label: 'Tudo' },
  ]

  // KPIs
  const usuariosAtivos = usuarios.length
  const receitaTotal = pagamentos
    .filter(p => p.status === 'aprovado')
    .reduce((s, p) => s + (p.valor ?? 0), 0)
  const pagamentosPendentes = pagamentos.filter(p => p.status === 'pendente').length
  const acessosHoje = sessoes.filter(s => s.tipo === 'login').length
  const sessoesMes = Math.round(sessoes.length / 30) // média

  const cards = [
    { label: 'Usuários Totais', valor: usuariosAtivos, cor: 'bg-sage-claro text-verde', icon: '👥' },
    { label: 'Receita Aprovada', valor: `R$ ${receitaTotal.toFixed(2)}`, cor: 'bg-green-50 text-green-700', icon: '💰' },
    { label: 'Pagamentos Pendentes', valor: pagamentosPendentes, cor: 'bg-yellow-50 text-yellow-700', icon: '⏳' },
    { label: 'Acessos (período)', valor: acessosHoje, cor: 'bg-blue-50 text-blue-700', icon: '🔓' },
    { label: 'Média Sessões/dia', valor: sessoesMes, cor: 'bg-purple-50 text-purple-700', icon: '📊' },
  ]

  if (carregando) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-verde">Dashboard</h2>
        <div className="flex gap-2">
          {filtros.map(f => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                filtro === f.id
                  ? 'bg-verde text-white'
                  : 'border border-cinza bg-white text-verde hover:bg-sage-claro'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-lg border border-cinza p-6 ${card.cor}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold opacity-70">{card.label}</p>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold">{card.valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Usuários por período */}
        <div className="rounded-lg border border-cinza bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-verde">
            <TrendingUp size={20} />
            Top 5 Últimos Usuários
          </h3>
          <div className="space-y-3">
            {usuarios.slice(0, 5).map(u => (
              <div key={u.id} className="flex items-center justify-between border-b border-cinza pb-2">
                <div>
                  <p className="font-semibold text-verde">{u.nome}</p>
                  <p className="text-xs text-cinza/60">{u.email}</p>
                </div>
                <p className="text-xs text-cinza">
                  {new Date(u.data_inicio).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas transações */}
        <div className="rounded-lg border border-cinza bg-white p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-verde">
            <TrendingUp size={20} />
            5 Últimas Transações
          </h3>
          <div className="space-y-3">
            {pagamentos.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between border-b border-cinza pb-2">
                <div>
                  <p className="font-semibold text-verde">R$ {p.valor?.toFixed(2)}</p>
                  <p className="text-xs text-cinza/60">{p.programa_tipo || 'Programa'}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    p.status === 'aprovado'
                      ? 'bg-green-100 text-green-700'
                      : p.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
