import { LayoutDashboard, UtensilsCrossed, TrendingUp, Lightbulb, Calculator, User } from 'lucide-react'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const ABAS = [
  { id: 'hoje', pt: 'Hoje', en: 'Today', Icone: LayoutDashboard },
  { id: 'alimentacao', pt: 'Refeições', en: 'Meals', Icone: UtensilsCrossed },
  { id: 'progresso', pt: 'Progresso', en: 'Progress', Icone: TrendingUp },
  { id: 'dicas', pt: 'Dicas', en: 'Tips', Icone: Lightbulb },
  { id: 'ferramentas', pt: 'Ferramentas', en: 'Tools', Icone: Calculator },
  { id: 'perfil', pt: 'Perfil', en: 'Profile', Icone: User },
]

export default function TabBar({ aba, onMudar }) {
  const { ingles } = useIdioma()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-cinza bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {ABAS.map(({ id, pt, en, Icone }) => {
          const ativa = aba === id
          const label = ingles ? en : pt
          return (
            <button
              key={id}
              type="button"
              onClick={() => onMudar(id)}
              aria-label={label}
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
