import { CtaButton, GoldRule } from '../components/ui.jsx'
import logoMWA from '../assets/logo-mwa.png'

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-offwhite px-6 pb-16 pt-28 md:pb-24 md:pt-36">
      {/* Órbitas decorativas */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-gold/10" />
      <div className="pointer-events-none absolute -bottom-52 -left-40 h-96 w-96 rounded-full bg-sage/5" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div className="text-center md:text-left">
          <p className="hero-enter text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            MWA · My Wellness App
          </p>

          <h1 className="hero-enter hero-enter-delay-1 mt-6 font-display text-4xl leading-[1.15] text-forest-deep md:text-6xl">
            Não é uma dieta.
            <br />
            <em className="italic text-forest">É uma nova forma de viver.</em>
          </h1>

          <GoldRule className="hero-enter hero-enter-delay-2 mx-auto my-8 md:mx-0" />

          <p className="hero-enter hero-enter-delay-2 mx-auto max-w-xl text-base leading-relaxed text-ink/80 md:mx-0 md:text-lg">
            Em <strong className="font-semibold text-forest">30 dias</strong>, você aprende a
            metodologia MWA e aplica no seu dia a dia: alimentação organizada, hidratação,
            movimento e evolução acompanhados diariamente pelo aplicativo.
          </p>

          <p className="hero-enter hero-enter-delay-3 mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mist md:mx-0">
            Criado a partir da abordagem que permitiu a Wanessa Auad eliminar 26 kg e manter sua
            transformação por 14 anos — agora no seu bolso.
          </p>

          <div className="hero-enter hero-enter-delay-4 mt-10">
            <CtaButton>Quero começar meus 30 dias</CtaButton>
            <p className="mt-6 text-xs leading-relaxed text-mist md:text-sm">
              Desenvolvido por Wanessa Auad — Nutricionista · CRN-1/27939 · 20+ anos de experiência
            </p>
          </div>
        </div>

        <div className="hero-enter hero-enter-delay-3 flex justify-center md:justify-end">
          <img
            src={logoMWA}
            alt="MWA — My Wellness Approach"
            className="w-64 max-w-full drop-shadow-[0_18px_28px_rgba(42,59,31,0.12)] sm:w-72 md:w-full md:max-w-[26rem]"
          />
        </div>
      </div>
    </header>
  )
}