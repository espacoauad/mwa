import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PenSquare, LibraryBig, BookOpen, Settings, CalendarDays, CalendarRange, Lightbulb, FolderOpen, Megaphone } from 'lucide-react'

const ITENS = [
  { to: '/', label: 'Painel', icon: LayoutDashboard, fim: true },
  { to: '/criar', label: 'Criar Conteúdo', icon: PenSquare },
  { to: '/modelos', label: 'Modelos Prontos', icon: LibraryBig },
  { to: '/marca', label: 'Guia da Marca', icon: BookOpen },
  { to: '/planejador', label: 'Planejador 90 Dias', icon: CalendarDays, emBreve: true },
  { to: '/calendario', label: 'Calendário Editorial', icon: CalendarRange, emBreve: true },
  { to: '/ideias', label: 'Banco de Ideias', icon: Lightbulb, emBreve: true },
  { to: '/biblioteca', label: 'Biblioteca de Conteúdos', icon: FolderOpen, emBreve: true },
  { to: '/campanhas', label: 'Campanhas', icon: Megaphone, emBreve: true },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function NavMenu({ orientation = 'vertical' }) {
  const container = orientation === 'vertical'
    ? 'flex flex-col gap-1'
    : 'flex flex-row justify-around'

  return (
    <nav className={`font-ui ${container}`}>
      {ITENS.map(({ to, label, icon: Icon, fim, emBreve }) => (
        <NavLink
          key={to}
          to={to}
          end={fim}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
              isActive ? 'bg-forest text-offwhite' : 'text-forest-deep hover:bg-forest/10'
            } ${emBreve ? 'opacity-60' : ''}`
          }
        >
          <Icon size={18} />
          <span className={orientation === 'horizontal' ? 'hidden sm:inline' : ''}>{label}</span>
          {emBreve && <span className="ml-auto text-[10px] uppercase tracking-wide">em breve</span>}
        </NavLink>
      ))}
    </nav>
  )
}
