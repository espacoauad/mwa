import { Plus, GlassWater, Camera, Pencil, Trash2, TrendingDown, Flame, Calculator, Search, Lock } from 'lucide-react'
import { Section, Eyebrow, Title, GoldRule } from '../components/ui.jsx'

function Phone({ children, label }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[290px] overflow-hidden rounded-[2.2rem] border border-forest/10 bg-white p-2.5 shadow-xl shadow-forest/10">
        <div className="overflow-hidden rounded-[1.8rem] bg-cream">{children}</div>
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-mist">{label}</p>
    </div>
  )
}

function TelaHoje() {
  return (
    <div>
      <div className="bg-forest px-5 pb-10 pt-6 text-cream">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-soft">My Wellness Approach</p>
        <p className="mt-2 text-[10px] capitalize text-cream/60">sexta-feira, 10 de julho</p>
        <p className="font-display text-lg font-semibold italic">Olá, Maria 🌿</p>
        <div className="mt-3 rounded-xl bg-white/10 p-3">
          <div className="flex items-baseline justify-between text-xs">
            <p className="font-semibold">Dia <span className="text-xl text-gold-soft">7</span> de 21</p>
            <p className="text-cream/70">33% do programa</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-1/3 rounded-full bg-gold-soft" />
          </div>
        </div>
      </div>
      <div className="-mt-6 px-4 pb-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <p className="text-[10px] font-semibold text-forest/60">Resumo do dia</p>
          {[
            ['Calorias', '1.240 / 1.800 kcal'],
            ['Proteína', '82 / 120 g'],
            ['Água', '1,5 / 2,5 L'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-sand py-1.5 text-[11px] last:border-0">
              <span className="font-medium text-forest/80">{k}</span>
              <span className="font-semibold text-forest">{v}</span>
            </div>
          ))}
          <div className="flex justify-between py-1.5 text-[11px]">
            <span className="flex items-center gap-1 font-medium text-forest/80"><Flame size={11} className="text-gold" /> Exercícios</span>
            <span className="font-semibold text-forest">320 kcal</span>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
          <p className="flex items-center gap-1 text-[11px] font-semibold text-forest"><GlassWater size={12} className="text-gold" /> Hidratação</p>
          <span className="rounded-lg bg-forest px-2.5 py-1 text-[10px] font-semibold text-cream">+ 250 ml</span>
        </div>
        <div className="mt-3 flex justify-center">
          <span className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-[11px] font-semibold text-forest-deep shadow-md">
            <Plus size={13} strokeWidth={2.5} /> Adicionar refeição
          </span>
        </div>
      </div>
    </div>
  )
}

function TelaAlimentacao() {
  const refeicoes = [
    ['Café da manhã · 07h30', 'Ovos mexidos com aveia', '320 kcal · P 25g · C 28g · G 12g'],
    ['Almoço · 12h40', 'Frango grelhado, arroz e salada', '540 kcal · P 42g · C 55g · G 14g'],
    ['Lanche · 16h00', 'Iogurte com morangos', '180 kcal · P 12g · C 22g · G 4g'],
  ]
  return (
    <div className="px-4 py-5">
      <p className="font-display text-base font-semibold italic text-forest">Alimentação de hoje</p>
      <p className="text-[10px] text-forest/60">1.240 de 1.800 kcal · 3 refeições</p>
      <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-white p-2.5 text-center shadow-sm">
        {[['1.240','Kcal'],['82','Prot'],['110','Carb'],['38','Gord']].map(([v,k]) => (
          <div key={k}><p className="text-xs font-bold text-forest">{v}</p><p className="text-[8px] font-medium text-forest/50">{k}</p></div>
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {refeicoes.map(([tipo, nome, macro]) => (
          <li key={nome} className="flex gap-2 rounded-xl bg-white p-2.5 shadow-sm">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sand text-forest/50"><Camera size={16} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[8px] font-semibold text-gold">{tipo}</p>
              <p className="truncate text-[11px] font-semibold text-forest">{nome}</p>
              <p className="text-[9px] text-forest/60">{macro}</p>
            </div>
            <div className="flex flex-col justify-center gap-1 text-forest/40">
              <Pencil size={11} /><Trash2 size={11} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TelaProgresso() {
  return (
    <div className="px-4 py-5">
      <p className="font-display text-base font-semibold italic text-forest">Seu progresso</p>
      <p className="text-[10px] text-forest/60">Pesagem e fotos a cada 7 dias</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[['75,2 kg','Peso inicial'],['72,4 kg','Peso atual'],['-2,8 kg','Variação']].map(([v,k], i) => (
          <div key={k} className="rounded-xl bg-white p-2.5 text-center shadow-sm">
            <p className="flex items-center justify-center gap-0.5 text-[11px] font-bold text-forest">
              {i === 2 && <TrendingDown size={11} className="text-gold" />}{v}
            </p>
            <p className="text-[8px] font-medium text-forest/50">{k}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
        <p className="text-[10px] font-semibold text-forest/60">Evolução do peso (kg)</p>
        <svg viewBox="0 0 200 90" className="mt-2 w-full">
          <polyline points="10,20 70,38 130,52 190,66" fill="none" stroke="#c49b62" strokeWidth="2.5" strokeLinecap="round" />
          {[[10,20],[70,38],[130,52],[190,66]].map(([x,y]) => (
            <circle key={x} cx={x} cy={y} r="4" fill="#344528" />
          ))}
        </svg>
        <div className="flex justify-between text-[8px] text-forest/50"><span>Início</span><span>Sem 1</span><span>Sem 2</span><span>Sem 3</span></div>
      </div>
      <div className="mt-3 rounded-xl bg-gold/15 p-3">
        <p className="text-[10px] font-semibold text-forest">📸 Semana 2 — dia de pesagem!</p>
        <p className="text-[9px] text-forest/60">Registre seu peso e suas fotos de progresso.</p>
      </div>
    </div>
  )
}


function Blur({ children, w = 'w-full' }) {
  return <span className={`inline-block ${w} select-none rounded bg-forest/10 text-transparent [filter:blur(3px)]`}>{children}</span>
}

function TelaCalculadora() {
  return (
    <div className="px-4 py-5">
      <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-forest"><Calculator size={14} className="text-gold" /> Calculadora de macros</p>
      <p className="text-[9px] text-forest/60">Consulte qualquer alimento do banco em segundos.</p>
      <div className="mt-3 flex items-center gap-1.5 rounded-lg border-2 border-forest/15 bg-white px-2.5 py-2">
        <Search size={11} className="text-forest/40" />
        <span className="text-[10px] font-medium text-forest">batata-doce cozida</span>
      </div>
      <div className="mt-2 overflow-hidden rounded-lg border border-sand bg-white text-[9px]">
        <div className="border-b border-sand px-2.5 py-2 font-medium text-forest">Batata-doce cozida</div>
        <div className="px-2.5 py-2 text-forest/50"><Blur w="w-28">Batata inglesa</Blur></div>
        <div className="px-2.5 py-2 text-forest/50"><Blur w="w-24">Batata baroa</Blur></div>
      </div>
      <div className="mt-3 rounded-lg bg-white p-2.5 text-[9px]"><span className="text-forest/60">Quantidade</span> <b className="font-semibold text-forest">150 g</b></div>
      <div className="mt-2 grid grid-cols-5 gap-1 rounded-lg bg-forest p-2.5 text-center">
        <div><p className="text-[11px] font-bold text-gold-soft">116</p><p className="text-[7px] text-cream/60">kcal</p></div>
        <div><p className="text-[11px] font-bold text-gold-soft">2g</p><p className="text-[7px] text-cream/60">prot</p></div>
        <div><p className="text-[11px] font-bold text-gold-soft">27g</p><p className="text-[7px] text-cream/60">carb</p></div>
        <div><p className="text-[11px] font-bold text-gold-soft">0g</p><p className="text-[7px] text-cream/60">gord</p></div>
        <div><p className="text-[11px] font-bold text-gold-soft">4g</p><p className="text-[7px] text-cream/60">fibra</p></div>
      </div>
      <div className="mt-3 flex justify-center"><span className="rounded-full bg-gold px-4 py-2 text-[9px] font-semibold text-forest-deep">Adicionar ao meu dia →</span></div>
    </div>
  )
}

function TelaExercicio() {
  return (
    <div className="px-4 py-5">
      <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-forest"><Flame size={14} className="text-gold" /> Lançar atividade física</p>
      <p className="text-[9px] text-forest/60">Seu gasto entra no balanço calórico do dia.</p>
      <div className="mt-3 grid grid-cols-2 gap-1.5 text-center text-[9px]">
        <div className="rounded-lg border-2 border-forest bg-forest px-1 py-2 font-semibold text-cream">🚶 Caminhada</div>
        <div className="rounded-lg border-2 border-sand bg-white px-1 py-2 text-forest/60">🏋️ Musculação</div>
        <div className="rounded-lg border-2 border-sand bg-white px-1 py-2 text-forest/60">🏃 Corrida</div>
        <div className="rounded-lg border-2 border-sand bg-white px-1 py-2 text-forest/60">🧘 Yoga / pilates</div>
      </div>
      <div className="mt-2 rounded-lg bg-white p-2.5 text-[9px]">
        <div className="flex justify-between"><span className="text-forest/60">Intensidade</span><b className="font-semibold text-forest">Moderada</b></div>
        <div className="mt-1.5 flex justify-between border-t border-sand pt-1.5"><span className="text-forest/60">Duração</span><b className="font-semibold text-forest">40 min</b></div>
      </div>
      <div className="mt-2 rounded-lg bg-forest p-3 text-center">
        <p className="text-[8px] uppercase tracking-widest text-cream/60">Gasto estimado</p>
        <p className="font-display text-xl text-gold-soft">169 kcal</p>
      </div>
      <div className="mt-2 rounded-lg bg-white p-2.5 text-[9px]">
        <p className="font-semibold text-forest/60">Hoje</p>
        <div className="mt-1 flex justify-between"><span className="text-forest">🚶 Caminhada · <Blur w="w-14">40 min</Blur></span><b className="font-semibold text-gold">169 kcal</b></div>
      </div>
      <div className="mt-3 flex justify-center"><span className="rounded-full bg-gold px-4 py-2 text-[9px] font-semibold text-forest-deep">Registrar atividade</span></div>
    </div>
  )
}

function TelaDicas() {
  return (
    <div className="px-4 py-5">
      <p className="font-display text-sm font-semibold italic text-forest">Conteúdo do programa</p>
      <p className="text-[9px] text-forest/60">Um informativo e uma dica novos por dia.</p>
      <div className="mt-3 flex gap-1.5">
        {[5, 6].map((d) => (
          <span key={d} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-forest/25 bg-white text-[9px] font-bold text-forest">{d}</span>
        ))}
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-forest bg-forest text-[9px] font-bold text-cream">7</span>
        {[8, 9].map((d) => (
          <span key={d} className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-sand bg-white text-forest/25"><Lock size={9} /></span>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-white p-3">
        <p className="text-[8px] font-semibold uppercase tracking-widest text-gold">💡 Dica do dia 7</p>
        <p className="mt-1 font-display text-[12px] font-semibold italic text-forest">Água: seu acelerador de resultados</p>
        <div className="mt-2 space-y-1">
          <Blur>Conteúdo exclusivo do programa sobre hidratação</Blur>
          <Blur>e como a água acelera seu metabolismo diário</Blur>
          <Blur w="w-3/4">disponível para as alunas na jornada</Blur>
        </div>
      </div>
      <div className="mt-2 rounded-xl bg-forest p-3">
        <p className="text-[8px] font-semibold uppercase tracking-widest text-gold-soft">📊 Informativo do dia 7</p>
        <p className="mt-1 font-display text-[12px] font-semibold italic text-cream">Proteína em cada refeição</p>
        <div className="mt-2 space-y-1">
          <span className="block h-2 w-full rounded bg-cream/20 [filter:blur(2px)]"></span>
          <span className="block h-2 w-5/6 rounded bg-cream/20 [filter:blur(2px)]"></span>
          <span className="block h-2 w-2/3 rounded bg-cream/20 [filter:blur(2px)]"></span>
        </div>
      </div>
      <p className="mt-2 text-center text-[8px] italic text-forest/50">Conteúdo liberado dia a dia durante a jornada</p>
    </div>
  )
}

export default function AppScreens() {
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>Conheça o app por dentro</Eyebrow>
        <Title>Tudo o que você precisa para viver seus primeiros 21 dias de transformação, na palma da mão.</Title>
        <GoldRule className="mx-auto my-8" />
      </div>
      <div className="grid gap-10 md:grid-cols-3">
        <Phone label="Sua jornada diária"><TelaHoje /></Phone>
        <Phone label="Lançamento de refeições"><TelaAlimentacao /></Phone>
        <Phone label="Evolução do peso"><TelaProgresso /></Phone>
        <Phone label="Calculadora de macros"><TelaCalculadora /></Phone>
        <Phone label="Atividade física"><TelaExercicio /></Phone>
        <Phone label="Dicas e conteúdos diários"><TelaDicas /></Phone>
      </div>
      <p className="mx-auto mt-10 max-w-md text-center text-xs italic leading-relaxed text-mist">
        Telas ilustrativas do aplicativo. Os conteúdos completos são liberados dia a dia, exclusivamente para as alunas.
      </p>
    </Section>
  )
}
