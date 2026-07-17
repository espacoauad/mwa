import { useEffect, useRef, useState } from 'react'
import { Section, Eyebrow, Title, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  ScreenHoje, ScreenRefeicoes, ScreenProgresso, ScreenDica,
  ScreenMacros, ScreenExercicio, ScreenJogos,
} from '../components/PhoneScreens.jsx'

const features = [
  { id: 'hoje', label: 'Acompanhe seu dia', desc: 'Calorias, água e macros calculados automaticamente para o seu corpo e objetivo.', Screen: ScreenHoje },
  { id: 'refeicoes', label: 'Registre refeições', desc: 'Banco de alimentos pronto: escolha, toque e os nutrientes são somados na hora.', Screen: ScreenRefeicoes },
  { id: 'progresso', label: 'Veja sua evolução', desc: 'Pesagens, medidas e fotos de antes e depois — sua transformação registrada.', Screen: ScreenProgresso },
  { id: 'dicas', label: 'Aprenda todos os dias', desc: 'Uma orientação exclusiva da nutricionista por dia, durante os 30 dias.', Screen: ScreenDica },
  { id: 'macros', label: 'Calculadora de macros', desc: 'Consulte qualquer alimento em segundos, sem decorar tabela nutricional.', Screen: ScreenMacros },
  { id: 'exercicio', label: 'Atividade física', desc: 'Registre treinos e veja as calorias gastas somadas às metas do dia.', Screen: ScreenExercicio },
  { id: 'jogos', label: 'Jogos que motivam', desc: 'Cumpra metas, jogue e personalize seu avatar. Leveza para sustentar o processo.', Screen: ScreenJogos },
]

const AUTO_MS = 5000

export default function AppShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)

  // Auto-avanço lento; pausa no hover/interação; desliga com reduced-motion.
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((a) => (a + 1) % features.length), AUTO_MS)
    return () => clearInterval(t)
  }, [paused])

  const { Screen, label, desc } = features[active]

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) {
      setPaused(true)
      setActive((a) => (a + (dx < 0 ? 1 : -1) + features.length) % features.length)
    }
    touchX.current = null
  }

  return (
    <Section id="app" className="bg-forest-deep" wide lazy intrinsicHeight={1130}>
      <div className="text-center">
        <Reveal>
          <Eyebrow light>O aplicativo</Eyebrow>
          <Title light>Mais do que um app. Um método que acompanha você todos os dias.</Title>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/70 md:text-base">
            Uma nutricionista no seu bolso: registre, aprenda e veja sua evolução em tempo real.
          </p>
        </Reveal>
      </div>

      <div
        className="mt-14 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Navegação de recursos (desktop: coluna esquerda) */}
        <div role="tablist" aria-label="Recursos do aplicativo" className="order-2 flex flex-wrap justify-center gap-2 md:order-1 md:flex-col md:justify-start">
          {features.map((f, i) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => { setPaused(true); setActive(i) }}
              className={`rounded-full px-4 py-2.5 text-left text-xs font-semibold transition-all duration-300 md:text-sm ${
                i === active
                  ? 'bg-gold text-forest-deep shadow-lg shadow-gold/20'
                  : 'bg-white/5 text-cream/70 hover:bg-white/10 hover:text-cream'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Telefone central */}
        <Reveal className="order-1 md:order-2" >
          <div
            className="mx-auto w-64 rounded-[2.4rem] border-[5px] border-white/15 bg-cream p-1.5 shadow-2xl shadow-black/40"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="overflow-hidden rounded-[1.9rem] bg-cream">
              <div key={active} className="screen-in">
                <Screen />
              </div>
            </div>
          </div>
          {/* Dots (mobile) */}
          <div className="mt-5 flex justify-center gap-1.5 md:hidden" aria-hidden="true">
            {features.map((f, i) => (
              <span key={f.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-5 bg-gold' : 'w-1.5 bg-white/25'}`} />
            ))}
          </div>
        </Reveal>

        {/* Descrição do recurso ativo */}
        <div className="order-3 text-center md:text-left">
          <div key={active} className="screen-in">
            <h3 className="font-display text-2xl text-gold-soft">{label}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/75 md:text-base">{desc}</p>
          </div>
        </div>
      </div>

      <div className="mt-14 text-center">
        <CtaButton variant="gold">Quero começar meus 30 dias</CtaButton>
      </div>
    </Section>
  )
}
