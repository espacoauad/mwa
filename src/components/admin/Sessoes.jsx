import { useAdmin } from '../../context/AdminContext.jsx'
import { Clock } from 'lucide-react'

export default function Sessoes() {
  const { sessoes, carregando, filtro, setFiltro } = useAdmin()

  const filtros = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: '7 Dias' },
    { id: 'mes', label: 'Mês' },
    { id: 'ano', label: 'Ano' },
    { id: 'tudo', label: 'Tudo' },
  ]

  const estadisticas = {
    logins: sessoes.filter(s => s.tipo === 'login').length,
    logouts: sessoes.filter(s => s.tipo === 'logout').length,
    atividades: sessoes.filter(s => s.tipo === 'atividade').length,
  }

  if (carregando) return <div className="text-center py-8">Carregando...</div>

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-verde">
          <Clock size={24} />
          Sessões e Atividades
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

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-cinza bg-white p-4">
          <p className="text-sm text-cinza/60">Logins</p>
          <p className="text-3xl font-bold text-verde">{estadisticas.logins}</p>
        </div>
        <div className="rounded-lg border border-cinza bg-white p-4">
          <p className="text-sm text-cinza/60">Logouts</p>
          <p className="text-3xl font-bold text-verde">{estadisticas.logouts}</p>
        </div>
        <div className="rounded-lg border border-cinza bg-white p-4">
          <p className="text-sm text-cinza/60">Atividades</p>
          <p className="text-3xl font-bold text-verde">{estadisticas.atividades}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-cinza bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-cinza bg-sage-claro/30">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-verde">Hora</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Tipo</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Usuário</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Detalhes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cinza">
            {sessoes.slice(0, 100).map(s => (
              <tr key={s.id} className="hover:bg-creme/50 transition-colors">
                <td className="px-6 py-3 text-xs text-cinza/70">
                  {new Date(s.criado_em).toLocaleString('pt-BR')}
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      s.tipo === 'login'
                        ? 'bg-green-100 text-green-700'
                        : s.tipo === 'logout'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {s.tipo.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-3 text-verde">{s.user_id?.slice(0, 8)}...</td>
                <td className="px-6 py-3 text-xs text-cinza/60">
                  {JSON.stringify(s.detalhes).slice(0, 40)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-sm text-cinza/60">
        Exibindo até 100 registros. Total: {sessoes.length}
      </p>
    </div>
  )
}
