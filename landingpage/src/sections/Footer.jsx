import { BRAND } from '../config.js'
import logoClara from '../assets/logo-mwa-clara.png'

export default function Footer() {
  return (
    <footer className="bg-forest-deep px-6 py-16 text-center">
      <div className="flex justify-center"><img src={logoClara} alt="MWA — My Wellness Approach" className="w-40" /></div>
      <p className="mt-4 text-sm text-cream/70">{BRAND.method}</p>
      <p className="mt-8 font-display italic text-cream/80">{BRAND.tagline}</p>
      <p className="mt-1 text-sm text-cream/50">Educação, motivação e diversão para uma vida com mais bem-estar.</p>
      <div className="mx-auto my-8 h-px w-16 bg-gold/40" />
      <p className="text-xs text-cream/50">
        Wanessa Auad — Nutricionista — CRN-1/27939
      </p>
      <p className="mt-2 text-xs text-cream/40">
        © {BRAND.year} MWA. Todos os direitos reservados.
      </p>
    </footer>
  )
}
