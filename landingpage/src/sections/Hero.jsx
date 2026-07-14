import { CtaButton, GoldRule } from '../components/ui.jsx'
import logoMWA from '../assets/logo-mwa.png'
import { BRAND } from '../config.js'

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-cream px-6 py-16 md:py-24">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-gold/10" />

      <div className="mx-auto grid max-w-6xl items-start gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div className="flex justify-center md:justify-end">
          <img
            src={logoMWA}
            alt="MWA — My Wellness Approach"
            className="w-72 max-w-full drop-shadow-[0_18px_28px_rgba(52,69,40,0.12)] sm:w-80 md:w-full md:max-w-[30rem]"
          />
        </div>

        <div className="text-center md:text-left">
          <p className="font-display text-xl italic text-forest md:text-2xl">
            {BRAND.method}
          </p>

          <GoldRule className="mx-auto my-8 md:mx-0" />

          <h2 className="font-display text-3xl leading-snug text-forest-deep md:text-5xl md:leading-tight">
            Seu bem-estar,
            <br />
            <span className="italic text-forest">organizado em um único app.</span>
          </h2>

          <p className="mt-6 text-sm font-light uppercase tracking-[0.2em] text-mist md:text-base">
            Educação, motivação e diversão para hábitos que cabem na vida real.
          </p>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-ink/80 md:text-lg">
            <p>
              Tenha, em <strong className="font-semibold text-forest">21 dias</strong>, um ecossistema
              completo para organizar sua alimentação, acompanhar sua rotina e construir hábitos de
              bem-estar com clareza sobre cada escolha do seu dia.
            </p>
            <p>
              Registre suas refeições e veja em tempo real quanto já consumiu, o que ainda precisa e
              como ajustar a próxima escolha — sem adivinhação e sem culpa.
            </p>
          </div>

          <CtaButton className="mt-10">Quero começar meus 21 dias</CtaButton>

          <p className="mt-7 max-w-xl text-xs leading-relaxed text-mist md:text-sm">
            Minha expertise em bem-estar, transformada em monitoramento, educação, motivação e jogos
            na palma da sua mão — para tornar o processo simples, mágico e divertido.
          </p>
        </div>
      </div>
    </header>
  )
}