import { LogOut, BarChart3, Users, Clock, CreditCard, FileText } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function LayoutAdmin({ aba, onMudar, children }) {
  const { sair } = useApp()

  const abas = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'sessoes', label: 'Sessões', icon: Clock },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-creme">
      <header className="border-b border-cinza bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="font-serif text-2xl font-bold italic text-verde">MWA Admin</h1>
            <p className="text-xs text-cinza">Painel de Administração</p>
          </div>
          <button
            onClick={sair}
            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>

        <nav className="flex gap-1 border-t border-cinza px-4">
          {abas.map((tab) => {
            const Icon = tab.icon
            const ativo = aba === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onMudar(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  ativo
                    ? 'border-verde text-verde'
                    : 'border-transparent text-cinza/60 hover:text-verde'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
