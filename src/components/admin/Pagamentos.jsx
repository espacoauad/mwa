import { useAdmin } from '../../context/AdminContext.jsx'
import { CreditCard } from 'lucide-react'

export default function Pagamentos() {
  const { pagamentos, carregando, filtro, setFiltro } = useAdmin()

  const filtros = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: '7 Dias' },
    { id: 'mes', label: 'Mês' },
    { id: 'ano', label: 'Ano' },
    { id: 'tudo', label: 'Tudo' },
  ]

  const stats = {
    total: pagamentos.length,
    aprovados: pagamentos.filter(p => p.status === 'aprovado').length,
    pendentes: pagamentos.filter(p => p.status === 'pendente').length,
    recusados: pagamentos.filter(p => p.status === 'recusado').length,
    receita: pagamentos
      .filter(p => p.status === 'aprovado')
      .reduce((s, p) => s + (p.valor ?? 0), 0),
  }

  if (carregando) return <div className="text-center py-8">Carregando...</div>

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-verde">
          <CreditCard size={24} />
          Pagamentos
        </h2>

        <div className="mb-4 flex gap-2">
          {filtros.map(f => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
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

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-cinza bg-white p-4">
          <p className="text-xs text-cinza/60">Total de Pedidos</p>
          <p className="text-3xl font-bold text-verde">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-green-300 bg-green-50 p-4">
          <p className="text-xs text-green-600">Aprovados</p>
          <p className="text-3xl font-bold text-green-700">{stats.aprovados}</p>
        </div>
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-xs text-yellow-600">Pendentes</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.pendentes}</p>
        </div>
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="text-xs text-red-600">Recusados</p>
          <p className="text-3xl font-bold text-red-700">{stats.recusados}</p>
        </div>
        <div className="rounded-lg border border-ouro bg-ouro-claro/30 p-4">
          <p className="text-xs text-ouro">Receita Total</p>
          <p className="text-2xl font-bold text-ouro">R$ {stats.receita.toFixed(2)}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-cinza bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-cinza bg-sage-claro/30">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-verde">Data</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Programa</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Valor</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Status</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Método</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cinza">
            {pagamentos.slice(0, 50).map(p => (
              <tr key={p.id} className="hover:bg-creme/50 transition-colors">
                <td className="px-6 py-3 text-xs text-cinza/70">
                  {new Date(p.criado_em).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-3 font-semibold text-verde">
                  {p.programa_tipo || 'Programa'}
                </td>
                <td className="px-6 py-3 font-semibold">R$ {p.valor?.toFixed(2)}</td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      p.status === 'aprovado'
                        ? 'bg-green-100 text-green-700'
                        : p.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs text-cinza/60">
                  {p.metodo || 'PIX'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-sm text-cinza/60">
        Exibindo até 50 registros. Total: {pagamentos.length}
      </p>
    </div>
  )
}
