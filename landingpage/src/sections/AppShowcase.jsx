import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { Section, Eyebrow, Title, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import {
  ScreenHoje, ScreenRefeicoes, ScreenProgresso, ScreenDica,
  ScreenMacros, ScreenExercicio, ScreenJogos, ScreenReflexao,
} from '../components/PhoneScreens.jsx'

const features = [
  { id: 'hoje', label: 'Acompanhe seu dia', desc: 'Calorias, água e macros calculados automaticamente para o seu corpo e objetivo.', Screen: ScreenHoje },
  { id: 'refeicoes', label: 'Registre refeições', desc: 'Banco de alimentos pronto: escolha, toque e os nutrientes são somados na hora.', Screen: ScreenRefeicoes },
  { id: 'progresso', label: 'Veja sua evolução', desc: 'Pesagens, medidas e fotos de antes e depois — sua transformação registrada.', Screen: ScreenProgresso },
  { id: 'dicas', label: 'Aprenda todos os dias', desc: 'Uma orientação exclusiva da nutricionista por dia, durante os 30 dias.', Screen: ScreenDica },
  { id: 'macros', label: 'Calculadora de macros', desc: 'Consulte qualquer alimento em segundos, sem decorar tabela nutricional.', Screen: ScreenMacros },
  { id: 'exercicio', label: 'Atividade física', desc: 'Registre treinos e veja as calorias gastas somadas às metas do dia.', Screen: ScreenExercicio },
  { id: 'jogos', label: 'Jogos que motivam', desc: 'Cumpra metas, jogue e personalize seu avatar. Leveza para sustentar o processo.', Screen: ScreenJogos },
  { id: 'reflexao', label: 'Reflexões que edificam', desc: 'A cada dia, uma mensagem que cuida da mente e do coração — porque transformação também nasce por dentro.', Screen: ScreenReflexao },
]

const AUTO_MS = 5000

export default function AppShowcase() {
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const touchX = useRef(null)
  const tabRefs = useRef([])

  const pausado = hovering || userPaused

  // Auto-avanço lento; pausa no hover/interação/toggle manual; desliga com reduced-motion.
  useEffect(() => {
    if (pausado) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setActive((a) => (a + 1) % features.length), AUTO_MS)
    return () => clearInterval(t)
  }, [pausado])

  const { Screen, label, desc } = features[active]

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) {
      setUserPaused(true)
      setActive((a) => (a + (dx < 0 ? 1 : -1) + features.length) % features.length)
    }
    touchX.current = null
  }

  function irPara(i) {
    setUserPaused(true)
    setActive(i)
  }

  function onTabKeyDown(e) {
    const ultimo = features.length - 1
    let alvo = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') alvo = active === ultimo ? 0 : active + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') alvo = active === 0 ? ultimo : active - 1
    else if (e.key === 'Home') alvo = 0
    else if (e.key === 'End') alvo = ultimo
    if (alvo === null) return
    e.preventDefault()
    irPara(alvo)
    tabRefs.current[alvo]?.focus()
  }

  return (
    <Section id="app" className="bg-forest-deep" wide>
      <div className="text-center">
        <Reveal>
          <Eyebrow light>O aplicativo</Eyebrow>
          <Title light>Mais do que um app. Um método que acompanha você todos os dias.</Title>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/70 md:text-base">
            O método de uma nutricionista no seu bolso: registre, aprenda e veja sua evolução em tempo real.
          </p>
        </Reveal>
      </div>

      <div
        className="mt-14 grid items-center gap-10 md:grid-cols-[1fr_auto_1fr] md:gap-12"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Navegação de recursos (desktop: coluna esquerda) */}
        <div
          role="tablist"
          aria-label="Recursos do aplicativo"
          className="order-2 flex flex-wrap justify-center gap-2 md:order-1 md:flex-col md:justify-start"
          onKeyDown={onTabKeyDown}
        >
          {features.map((f, i) => (
            <button
              key={f.id}
              ref={(el) => { tabRefs.current[i] = el }}
              id={`tab-${f.id}`}
              role="tab"
              aria-selected={i === active}
              aria-controls={`panel-${f.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => irPara(i)}
              className={`rounded-full px-4 py-2.5 text-left text-xs font-semibold transition-[background-color,color,box-shadow] duration-300 md:text-sm ${
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
            <div
              id={`panel-${features[active].id}`}
              role="tabpanel"
              aria-labelledby={`tab-${features[active].id}`}
              className="overflow-hidden rounded-[1.9rem] bg-cream"
            >
              <div key={active} className="screen-in">
                <Screen />
              </div>
            </div>
          </div>
          {/* Dots (mobile) + controle de pausa */}
          <div className="mt-5 flex items-center justify-center gap-3 md:hidden">
            <div className="flex gap-1.5" aria-hidden="true">
              {features.map((f, i) => (
                <span
                  key={f.id}
                  className={`h-1.5 w-5 origin-center rounded-full bg-gold transition-transform duration-300 ${
                    i === active ? 'scale-x-100' : 'scale-x-[0.3] bg-white/25'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? 'Retomar avanço automático das telas' : 'Pausar avanço automático das telas'}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-cream/70 hover:bg-white/20 hover:text-cream"
            >
              {userPaused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
            </button>
          </div>
        </Reveal>

        {/* Descrição do recurso ativo */}
        <div className="order-3 text-center md:text-left">
          <div key={active} className="screen-in" aria-live="polite">
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
