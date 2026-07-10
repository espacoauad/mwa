import { useAdmin } from '../../context/AdminContext.jsx'
import { Users, Search } from 'lucide-react'
import { useState } from 'react'

export default function Clientes() {
  const { usuarios, carregando, filtro, setFiltro } = useAdmin()
  const [busca, setBusca] = useState('')

  const filtros = [
    { id: 'hoje', label: 'Hoje' },
    { id: '7d', label: '7 Dias' },
    { id: 'mes', label: 'Mês' },
    { id: 'ano', label: 'Ano' },
    { id: 'tudo', label: 'Tudo' },
  ]

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    u.email?.toLowerCase().includes(busca.toLowerCase())
  )

  if (carregando) return <div className="text-center py-8">Carregando...</div>

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-verde">
          <Users size={24} />
          Clientes
        </h2>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cinza/60" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full rounded-lg border border-cinza bg-white pl-10 pr-4 py-2 text-sm placeholder-cinza/60 focus:border-verde focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
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
      </div>

      <div className="overflow-x-auto rounded-lg border border-cinza bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-cinza bg-sage-claro/30">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-verde">Nome</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Peso</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Altura</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Data Início</th>
              <th className="px-6 py-3 text-left font-semibold text-verde">Dia do Programa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cinza">
            {usuariosFiltrados.map(u => {
              const dias = Math.ceil(
                (new Date() - new Date(u.data_inicio)) / (1000 * 60 * 60 * 24)
              )
              return (
                <tr key={u.id} className="hover:bg-creme/50 transition-colors">
                  <td className="px-6 py-3 font-semibold text-verde">{u.nome}</td>
                  <td className="px-6 py-3 text-cinza/70">{u.email}</td>
                  <td className="px-6 py-3">{u.peso} kg</td>
                  <td className="px-6 py-3">{u.altura} cm</td>
                  <td className="px-6 py-3 text-sm">
                    {new Date(u.data_inicio).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-sage-claro/50 px-3 py-1 text-xs font-semibold text-verde">
                      Dia {dias}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-sm text-cinza/60">
        {usuariosFiltrados.length} clientes encontrados
      </p>
    </div>
  )
}
