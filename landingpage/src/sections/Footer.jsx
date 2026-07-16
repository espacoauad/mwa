import { BRAND } from '../config.js'
import logoMWA from '../assets/logo-mwa.png'

export default function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-offwhite px-6 py-12 text-center">
      <img src={logoMWA} alt="MWA" className="mx-auto h-12 w-auto" loading="lazy" />
      <p className="mt-4 font-display text-lg italic text-forest">{BRAND.tagline}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-mist">{BRAND.concept}</p>
      <p className="mt-6 text-xs text-mist">
        {BRAND.author} — Nutricionista — {BRAND.crn}
      </p>
      <p className="mt-1 text-xs text-mist/70">© {BRAND.year} {BRAND.name}. Todos os direitos reservados.</p>
    </footer>
  )
}
