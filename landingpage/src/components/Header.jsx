import { useEffect, useState } from 'react'
import { CHECKOUT_URL } from '../config.js'
import logoMWA from '../assets/logo-mwa.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Principal"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-forest/10 bg-offwhite/85 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#" aria-label="MWA — voltar ao topo" className="flex items-center gap-2">
          <img src={logoMWA} alt="MWA" className="h-9 w-auto" />
        </a>
        <div className="flex items-center gap-6">
          <a
            href="#app"
            className="hidden text-sm font-medium text-forest/80 transition-colors hover:text-forest sm:block"
          >
            Como funciona
          </a>
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-forest px-5 py-2 text-sm font-semibold text-cream transition-all duration-300 hover:bg-forest-deep hover:shadow-lg hover:shadow-forest/20"
          >
            Começar agora
          </a>
        </div>
      </div>
    </nav>
  )
}
