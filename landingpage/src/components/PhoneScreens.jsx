import { Calculator, Flame, Gamepad2, Sparkles } from 'lucide-react'

/* Telas do app desenhadas em código — conteúdo interno do telefone do showcase. */

export function ScreenHoje() {
  return (
    <div className="p-4">
      <p className="mb-1 text-left font-display text-sm font-bold italic text-forest">Olá, Maria 🌿</p>
      <p className="mb-3 text-left text-[10px] text-forest/60">Dia 7 de 30 — você está indo bem!</p>
      <div className="relative mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#879B55 0% 68%, #E8E4DC 68% 100%)' }}>
        <div className="flex flex-col items-center justify-center rounded-full bg-cream" style={{ width: '5.5rem', height: '5.5rem' }}>
          <p className="text-lg font-bold text-forest">1.240</p>
          <p className="text-[9px] text-forest/60">de 1.800 kcal</p>
        </div>
      </div>
      <div className="mb-2 rounded-lg bg-white p-2.5 text-left">
        <p className="text-[10px] font-semibold text-forest">💧 Água</p>
        <div className="mt-1 h-2 w-full rounded-full bg-sand">
          <div className="h-2 rounded-full bg-sage" style={{ width: '60%' }}></div>
        </div>
        <p className="mt-1 text-[9px] text-forest/60">1.500 ml de 2.500 ml</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div className="rounded-lg bg-white p-1.5">
          <p className="text-[10px] font-bold text-forest">82g</p>
          <p className="text-[8px] text-forest/60">Proteína</p>
        </div>
        <div className="rounded-lg bg-white p-1.5">
          <p className="text-[10px] font-bold text-forest">110g</p>
          <p className="text-[8px] text-forest/60">Carbos</p>
        </div>
        <div className="rounded-lg bg-white p-1.5">
          <p className="text-[10px] font-bold text-forest">38g</p>
          <p className="text-[8px] text-forest/60">Gordura</p>
        </div>
      </div>
    </div>
  )
}

export function ScreenRefeicoes() {
  return (
    <div className="p-4">
      <p className="mb-3 text-left font-display text-sm font-bold italic text-forest">Refeições de hoje</p>
      <div className="space-y-2">
        <div className="rounded-lg bg-white p-2.5 text-left">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-forest">☕ Café da manhã</p>
            <p className="text-[9px] text-forest/60">07:30</p>
          </div>
          <p className="mt-0.5 text-[9px] text-forest/70">Shake MWA + banana</p>
          <p className="text-[9px] font-semibold text-sage">320 kcal · 25g prot</p>
        </div>
        <div className="rounded-lg bg-white p-2.5 text-left">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-forest">🍽️ Almoço</p>
            <p className="text-[9px] text-forest/60">12:40</p>
          </div>
          <p className="mt-0.5 text-[9px] text-forest/70">Frango grelhado, arroz e salada</p>
          <p className="text-[9px] font-semibold text-sage">540 kcal · 42g prot</p>
        </div>
        <div className="rounded-lg bg-white p-2.5 text-left">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-forest">🥗 Lanche</p>
            <p className="text-[9px] text-forest/60">16:00</p>
          </div>
          <p className="mt-0.5 text-[9px] text-forest/70">Iogurte com fibras</p>
          <p className="text-[9px] font-semibold text-sage">180 kcal · 12g prot</p>
        </div>
        <button className="w-full rounded-lg bg-forest py-2 text-[10px] font-bold text-white">
          + Adicionar refeição
        </button>
      </div>
    </div>
  )
}

export function ScreenProgresso() {
  return (
    <div className="p-4">
      <p className="mb-1 text-left font-display text-sm font-bold italic text-forest">Seu progresso</p>
      <div className="mb-3 rounded-lg bg-white p-2.5 text-left">
        <p className="text-[9px] text-forest/60">Peso atual</p>
        <p className="text-lg font-bold text-forest">72,4 kg <span className="text-[10px] font-semibold text-sage">▼ -2,8 kg</span></p>
      </div>
      <div className="rounded-lg bg-white p-2.5">
        <p className="mb-2 text-left text-[10px] font-semibold text-forest">Evolução semanal</p>
        <div className="flex h-20 items-end justify-around gap-1.5">
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 rounded-t bg-sand" style={{ height: '72px' }}></div>
            <p className="text-[8px] text-forest/60">Início</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 rounded-t bg-sage/60" style={{ height: '64px' }}></div>
            <p className="text-[8px] text-forest/60">Sem 1</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 rounded-t bg-sage" style={{ height: '58px' }}></div>
            <p className="text-[8px] text-forest/60">Sem 2</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 rounded-t bg-forest" style={{ height: '52px' }}></div>
            <p className="text-[8px] text-forest/60">Sem 3</p>
          </div>
        </div>
      </div>
      <div className="mt-2 rounded-lg bg-gold/15 p-2 text-left">
        <p className="text-[9px] font-semibold text-forest">🏆 Medidas: -4 cm de cintura</p>
      </div>
    </div>
  )
}

export function ScreenDica() {
  return (
    <div className="p-4">
      <p className="mb-1 text-left font-display text-sm font-bold italic text-forest">Dica do dia</p>
      <p className="mb-3 text-left text-[10px] text-forest/60">Dia 4 de 30 · Hidratação</p>
      <div className="rounded-lg bg-white p-3 text-left">
        <p className="text-2xl">💧</p>
        <p className="mt-1 text-[11px] font-bold leading-snug text-forest">
          Água: seu acelerador de resultados
        </p>
        <p className="mt-1.5 text-[9px] leading-relaxed text-forest/70">
          Seu corpo confunde sede com fome. Beber água ao longo do dia reduz beliscos,
          melhora a digestão e apoia os seus resultados durante o programa.
        </p>
      </div>
      <div className="mt-2 rounded-lg bg-sage/15 p-2.5 text-left">
        <p className="text-[9px] font-bold text-forest">✅ Dica prática</p>
        <p className="mt-0.5 text-[9px] leading-relaxed text-forest/80">
          Beba 1 copo de água 15 minutos antes de cada refeição de hoje.
        </p>
      </div>
      <div className="mt-2 rounded-lg bg-white p-2 text-left">
        <p className="text-[9px] font-bold text-forest">🔒 Conteúdo exclusivo para alunas</p>
        <p className="mt-0.5 text-[9px] text-forest/60">Educação para escolhas mais conscientes</p>
      </div>
    </div>
  )
}

export function ScreenMacros() {
  return (
    <div className="p-4">
      <p className="mb-3 flex items-center gap-1.5 text-left font-display text-sm font-bold italic text-forest">
        <Calculator size={14} className="not-italic text-sage" /> Calculadora de macros
      </p>
      <div className="rounded-lg border-2 border-sage/30 bg-white px-3 py-2.5 text-left text-[10px] text-forest/50">
        Ex.: batata-doce, shake...
      </div>
      <div className="mt-2 rounded-lg bg-white p-3 text-left">
        <p className="text-[10px] font-bold text-forest">Batata-doce · 150g</p>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          <div className="rounded bg-cream p-1.5 text-center">
            <p className="text-[10px] font-bold text-forest">129</p>
            <p className="text-[7px] text-forest/60">kcal</p>
          </div>
          <div className="rounded bg-cream p-1.5 text-center">
            <p className="text-[10px] font-bold text-forest">2g</p>
            <p className="text-[7px] text-forest/60">prot</p>
          </div>
          <div className="rounded bg-cream p-1.5 text-center">
            <p className="text-[10px] font-bold text-forest">30g</p>
            <p className="text-[7px] text-forest/60">carb</p>
          </div>
          <div className="rounded bg-cream p-1.5 text-center">
            <p className="text-[10px] font-bold text-forest">0g</p>
            <p className="text-[7px] text-forest/60">gord</p>
          </div>
        </div>
      </div>
      <button className="mt-2 w-full rounded-lg bg-sage py-2 text-[10px] font-bold text-white">
        + Adicionar à refeição
      </button>
    </div>
  )
}

export function ScreenExercicio() {
  return (
    <div className="p-4">
      <p className="mb-3 flex items-center gap-1.5 text-left font-display text-sm font-bold italic text-forest">
        <Flame size={14} className="not-italic text-gold" /> Registrar exercício
      </p>
      <div className="space-y-1.5">
        {[
          ['🚶‍♀️', 'Caminhada', '30 min', '145 kcal'],
          ['🚴', 'Bike', '20 min', '180 kcal'],
          ['🏋️‍♀️', 'Musculação', '45 min', '210 kcal'],
        ].map(([e, nome, tempo, kcal], i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-white p-2 text-left">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-forest">
              <span>{e}</span> {nome} <span className="text-forest/50">· {tempo}</span>
            </span>
            <span className="text-[9px] font-bold text-gold">-{kcal}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 rounded-lg bg-gold/15 p-2 text-center">
        <p className="text-[9px] font-bold text-forest">Gasto total do dia: 535 kcal 🔥</p>
      </div>
    </div>
  )
}

export function ScreenJogos() {
  return (
    <div className="p-4">
      <p className="mb-3 flex items-center gap-1.5 text-left font-display text-sm font-bold italic text-forest">
        <Gamepad2 size={14} className="not-italic text-sage" /> Seu avatar
      </p>
      <div className="flex items-center gap-3 rounded-lg bg-white p-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-2xl">🦋</span>
        <div className="text-left">
          <p className="text-[10px] font-bold text-forest">135 🌱 sementes</p>
          <p className="text-[8px] text-forest/60">Ganhe jogando e cumprindo metas</p>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-lg bg-white p-2 text-center">
          <p className="text-lg">🍓</p>
          <p className="text-[9px] font-bold text-forest">Colheita</p>
        </div>
        <div className="rounded-lg bg-white p-2 text-center">
          <p className="text-lg">🥗</p>
          <p className="text-[9px] font-bold text-forest">Escolhas</p>
        </div>
      </div>
    </div>
  )
}

export function ScreenReflexao() {
  return (
    <div className="p-4">
      <p className="mb-3 flex items-center gap-1.5 text-left font-display text-sm font-bold italic text-forest">
        <Sparkles size={14} className="not-italic text-gold" /> Reflexão do dia
      </p>
      <div
        className="relative overflow-hidden rounded-2xl border border-gold/30 p-4 text-center"
        style={{ background: 'linear-gradient(160deg, #2A3B1F 0%, #4A5F3A 55%, #879B55 100%)' }}
      >
        <p className="text-[8px] font-bold uppercase tracking-wider text-gold-soft">Respeito ao corpo</p>
        <p className="mt-2 font-display text-[11px] italic leading-snug text-white">
          "Ou não sabem que o corpo de vocês é templo do Espírito Santo que habita em vocês?"
        </p>
        <p className="mt-2 text-[9px] font-bold text-gold-soft">— 1 Coríntios 6:19</p>
        <div className="mx-auto my-3 h-px w-2/3 bg-gold/30" />
        <div className="rounded-xl border border-white/15 bg-black/15 p-2.5 text-left">
          <p className="text-[8px] font-bold uppercase tracking-wider text-gold-soft">💭 Reflexão</p>
          <p className="mt-1 text-[9px] leading-relaxed text-white/95">
            Seu corpo é sagrado. Cada escolha alimentar é um ato de cuidado com você mesma.
          </p>
        </div>
      </div>
    </div>
  )
}
