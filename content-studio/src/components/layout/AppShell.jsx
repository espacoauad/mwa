import { Outlet } from 'react-router-dom'
import { NavMenu } from './NavMenu'

export function AppShell() {
  return (
    <div className="min-h-screen bg-offwhite font-ui">
      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sand p-4 md:block">
          <p className="mb-6 px-2 text-lg font-semibold text-forest" style={{ fontFamily: 'Georgia, serif' }}>MWA Content Studio</p>
          <NavMenu orientation="vertical" />
        </aside>
        <main className="min-h-screen w-full pb-24 md:pb-0">
          <Outlet />
        </main>
      </div>
      <div className="fixed inset-x-0 bottom-0 border-t border-sand bg-white/95 p-2 md:hidden">
        <NavMenu orientation="horizontal" />
      </div>
    </div>
  )
}
