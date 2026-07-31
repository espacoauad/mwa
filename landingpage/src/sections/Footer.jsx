import { BRAND } from '../config.js'
import logoMWA from '../assets/logo-mwa.png'

export default function Footer() {
  return (
    <footer className="border-t border-forest/10 bg-offwhite px-6 py-12 text-center">
      <img src={logoMWA} alt="MWA" width={41} height={48} className="mx-auto h-12 w-auto" loading="lazy" />
      <p className="mt-4 font-display text-lg italic text-forest">{BRAND.tagline}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-mist">{BRAND.concept}</p>
      <div className="mx-auto mt-8 max-w-2xl space-y-2 border-t border-forest/10 pt-6 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-mist">Avisos importantes</p>
        <p className="text-[11px] leading-relaxed text-mist/90">
          O MWA | Jornada de 30 Dias é um programa <strong>educacional</strong> de organização de
          hábitos e rotina alimentar. Ele não realiza diagnóstico, tratamento, cura ou prevenção de
          qualquer doença ou condição de saúde e <strong>não substitui consulta com nutricionista,
          médico ou outro profissional de saúde</strong>. O conteúdo do aplicativo tem caráter geral
          e informativo e não constitui atendimento nutricional individualizado nem prescrição
          dietética.
        </p>
        <p className="text-[11px] leading-relaxed text-mist/90">
          Resultados variam de pessoa para pessoa e dependem de fatores individuais e da aplicação
          das orientações — nenhum resultado específico é prometido ou garantido. A história de
          Wanessa Auad é um relato pessoal real e não representa promessa de resultado.
        </p>
        <p className="text-[11px] leading-relaxed text-mist/90">
          Se você tem alguma condição de saúde, faz uso de medicamentos, está gestante ou
          amamentando, ou tem histórico de transtorno alimentar, procure orientação profissional
          individualizada antes de iniciar qualquer mudança na alimentação.
        </p>
      </div>
      <p className="mt-6 text-xs text-mist">
        {BRAND.author} — Nutricionista — {BRAND.crn}
      </p>
      <p className="mt-1 text-xs text-mist/70">© {BRAND.year} {BRAND.name}. Todos os direitos reservados.</p>
    </footer>
  )
}
