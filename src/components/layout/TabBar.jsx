import { LayoutDashboard, UtensilsCrossed, TrendingUp, Lightbulb, Calculator, User } from 'lucide-react'

const ABAS = [
  { id: 'hoje', label: 'Hoje', Icone: LayoutDashboard },
  { id: 'alimentacao', label: 'Refeições', Icone: UtensilsCrossed },
  { id: 'progresso', label: 'Progresso', Icone: TrendingUp },
  { id: 'dicas', label: 'Dicas', Icone: Lightbulb },
  { id: 'ferramentas', label: 'Ferramentas', Icone: Calculator },
  { id: 'perfil', label: 'Perfil', Icone: User },
]

export default function TabBar({ aba, onMudar }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cinza bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {ABAS.map(({ id, label, Icone }) => {
          const ativa = aba === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onMudar(id)}
              className={`flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 pb-2 pt-2 transition-colors ${
                ativa ? 'text-verde' : 'text-verde/40'
              }`}
            >
              <Icone size={20} strokeWidth={ativa ? 2.4 : 1.8} />
              <span className={`text-[10px] ${ativa ? 'font-semibold' : 'font-medium'}`}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
