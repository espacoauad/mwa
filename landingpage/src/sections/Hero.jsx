import { CtaButton, GoldRule } from '../components/ui.jsx'
import logoMWA from '../assets/logo-mwa.png'
import { BRAND } from '../config.js'

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-cream px-6 pb-24 pt-20 md:pb-32 md:pt-28">
      {/* detalhe decorativo sutil */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-gold/10" />

      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Marca — logo oficial */}
        <img src={logoMWA} alt="MWA — My Wellness Approach" className="w-52 md:w-64" />
        <p className="mt-4 font-display text-lg italic text-forest md:text-xl">
          {BRAND.method}
        </p>

        <GoldRule className="my-10" />

        {/* Headline */}
        <h2 className="max-w-3xl font-display text-3xl leading-snug text-forest-deep md:text-5xl md:leading-tight">
          Não é uma dieta.
          <br />
          <span className="italic text-forest">É uma nova forma de viver.</span>
        </h2>

        <p className="mt-6 text-sm font-light uppercase tracking-[0.2em] text-mist md:text-base">
          Transforme hábitos, conquiste resultados, mude sua vida.
        </p>

        {/* Texto de apoio */}
        <div className="mt-10 max-w-2xl space-y-4 text-base leading-relaxed text-ink/80 md:text-lg">
          <p>
            Aprenda, em <strong className="font-semibold text-forest">21 dias</strong>, a organizar
            sua alimentação, transformar seus hábitos e construir uma rotina mais saudável com o
            acompanhamento diário de uma nutricionista no seu bolso.
          </p>
          <p>
            O MWA nasceu da abordagem que permitiu a Wanessa Auad eliminar 26 kg após a gestação e
            manter sua transformação por 14 anos.
          </p>
        </div>

        <CtaButton className="mt-12">Quero começar meus 21 dias</CtaButton>

        {/* Selo de confiança */}
        <p className="mt-8 max-w-md text-xs leading-relaxed text-mist">
          Desenvolvido por Wanessa Auad — nutricionista, empreendedora e especialista em
          emagrecimento há mais de 20 anos. CRN-1/27939.
        </p>
      </div>
    </header>
  )
}
