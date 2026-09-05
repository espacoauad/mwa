import { ArrowRight, ShieldCheck, Award, Smartphone, Zap, CreditCard, HeartHandshake, Calculator, Flame, Gamepad2 } from 'lucide-react'
import LogoMWA from '../ui/LogoMWA.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

function irParaPreco() {
  document.querySelector('#preco')?.scrollIntoView({ behavior: 'smooth' })
}

function BotaoCTA({ children, className = '' }) {
  const { ingles } = useIdioma()
  return (
    <button
      onClick={irParaPreco}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-verde px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-verde/90 hover:shadow-xl transition-all md:px-10 md:py-5 md:text-lg ${className}`}
    >
      {children ?? (ingles ? 'Start my 30 days' : 'Começar meus 30 dias')}
    </button>
  )
}

export default function LandingVendas() {
  const { ingles } = useIdioma()

  // Gatilhos de confiança logo abaixo do título
  const gatilhos = [
    { icon: Award, texto: '20+ anos de experiência em emagrecimento', textoEn: '20+ years of experience in weight loss' },
    { icon: ShieldCheck, texto: 'Nutricionista · CRN-1/27939', textoEn: 'Registered Dietitian · CRN-1/27939' },
    { icon: Smartphone, texto: 'Monitoramento real do seu dia — simples e prático', textoEn: 'Real tracking of your day — simple and practical' },
    { icon: HeartHandshake, texto: 'Garantia incondicional de 7 dias — risco zero', textoEn: 'Unconditional 7-day guarantee — zero risk' },
    { icon: Zap, texto: 'Acesso imediato após a compra', textoEn: 'Immediate access after purchase' },
    { icon: CreditCard, texto: 'Pagamento único · nenhuma cobrança automática', textoEn: 'One-time payment · no automatic charges' },
  ]

  // Objeções silenciosas que a cliente carrega antes de decidir
  const objecoes = [
    {
      pergunta: '"Será que eu vou conseguir seguir?"',
      perguntaEn: '"Will I actually be able to stick with it?"',
      resposta:
        'O app foi desenhado para ser simples: metas calculadas automaticamente, refeições registradas em segundos e uma orientação nova a cada dia — sem depender apenas da força de vontade. Você entende o próximo passo e acompanha sua evolução.',
      respostaEn:
        "The app was designed to be simple: goals calculated automatically, meals logged in seconds, and new guidance every day — without relying on willpower alone. You always know your next step and track your progress.",
    },
    {
      pergunta: '"Será que isso é só mais uma dieta?"',
      perguntaEn: '"Is this just another diet?"',
      resposta:
        'Não é uma dieta restritiva com prazo de validade. É educação para você entender o que comer, quanto comer e como se comportar diante das escolhas do dia a dia — criando autonomia para cuidar de si.',
      respostaEn:
        "It's not a restrictive diet with an expiration date. It's education — understanding what to eat, how much to eat, and how to handle everyday food choices — building the independence to take care of yourself.",
    },
  ]

  const concreto = [
    { pt: 'Mais leveza', en: 'More lightness' },
    { pt: 'Menos culpa', en: 'Less guilt' },
    { pt: 'Mais clareza alimentar', en: 'More food clarity' },
    { pt: 'Mais controle', en: 'More control' },
    { pt: 'Mais consistência', en: 'More consistency' },
  ]

  const imagine = [
    { pt: 'Acordar se sentindo mais leve e com energia nova.', en: 'Waking up feeling lighter and full of new energy.' },
    { pt: 'Vestir aquela roupa que hoje está apertada — sem esforço.', en: 'Wearing that outfit that feels tight today — effortlessly.' },
    { pt: 'Saber exatamente o que comer e por quê, sem depender de modismos.', en: 'Knowing exactly what to eat and why, without relying on fads.' },
    { pt: 'Ver seu corpo mais firme e sua roupa ficando larga.', en: 'Seeing your body get firmer and your clothes fit looser.' },
    { pt: 'Sentir a segurança de ter aprendido algo que vai durar para a vida toda.', en: 'Feeling the confidence of having learned something that lasts a lifetime.' },
  ]

  const pilares = [
    { pt: 'Monitoramento', en: 'Tracking' },
    { pt: 'Educação', en: 'Education' },
    { pt: 'Motivação', en: 'Motivation' },
    { pt: 'Diversão', en: 'Fun' },
  ]

  const recursos = [
    { emoji: '🍽', texto: 'Alimentação', textoEn: 'Nutrition' },
    { emoji: '💧', texto: 'Consumo de água', textoEn: 'Water intake' },
    { emoji: '⚖️', texto: 'Peso', textoEn: 'Weight' },
    { emoji: '📉', texto: 'Evolução', textoEn: 'Progress' },
    { emoji: '🥗', texto: 'Macronutrientes', textoEn: 'Macronutrients' },
    { emoji: '📚', texto: 'Conteúdos exclusivos', textoEn: 'Exclusive content' },
    { emoji: '💪', texto: 'Exercícios', textoEn: 'Workouts' },
    { emoji: '🎯', texto: 'Metas personalizadas', textoEn: 'Personalized goals' },
    { emoji: '📲', texto: 'Suporte', textoEn: 'Support' },
  ]

  const aprendizados = [
    { pt: 'Como montar refeições equilibradas.', en: 'How to put together balanced meals.' },
    { pt: 'Como controlar calorias sem sofrimento.', en: 'How to control calories without suffering.' },
    { pt: 'Como consumir proteínas corretamente.', en: 'How to eat protein correctly.' },
    { pt: 'Como manter o metabolismo ativo.', en: 'How to keep your metabolism active.' },
    { pt: 'Como lidar com a fome.', en: 'How to handle hunger.' },
    { pt: 'Como evitar o efeito sanfona.', en: 'How to avoid yo-yo dieting.' },
    { pt: 'Como criar hábitos que realmente permanecem.', en: 'How to build habits that actually last.' },
  ]

  const inclusos = [
    { pt: 'App completo com acompanhamento diário por 30 dias', en: 'Full app with daily tracking for 30 days' },
    { pt: 'Cálculo personalizado de calorias e macronutrientes', en: 'Personalized calorie and macronutrient calculation' },
    { pt: 'Banco de alimentos e calculadora de macros', en: 'Food database and macro calculator' },
    { pt: 'Registro de exercícios com contagem de calorias gastas', en: 'Exercise logging with calories burned' },
    { pt: 'Uma dica exclusiva da nutricionista a cada dia', en: "One exclusive tip from the dietitian every day" },
    { pt: 'Jogos que tornam o processo mais leve e motivador', en: 'Games that make the process lighter and more motivating' },
    { pt: 'Suporte via WhatsApp', en: 'Support via WhatsApp' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-creme via-white to-sage-claro/20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-cinza bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <LogoMWA variante="simbolo" className="h-9 w-9" />
            <h1 className="font-serif text-xl font-bold italic text-verde">MWA · My Wellness App</h1>
          </div>
          <button
            onClick={irParaPreco}
            className="rounded-lg bg-verde px-5 py-2 text-sm font-bold text-white hover:bg-verde/90 transition-colors"
          >
            {ingles ? 'Start now' : 'Começar agora'}
          </button>
        </div>
      </header>

      {/* Hero — dor + promessa + autoridade, tudo nos primeiros segundos */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
        <div className="mb-6">
          <span className="inline-block rounded-full bg-sage-claro px-4 py-2 text-xs font-bold uppercase text-verde">
            MWA · My Wellness App
          </span>
        </div>

        <h2 className="mb-6 font-serif text-3xl font-bold uppercase leading-tight text-verde md:text-5xl">
          {ingles ? 'Transform habits. Achieve results. Change your life.' : 'Transforme hábitos. Conquiste resultados. Mude sua vida.'}
        </h2>

        <p className="mx-auto mb-4 max-w-2xl text-lg font-semibold leading-relaxed text-verde md:text-xl">
          {ingles
            ? "It's not a diet. Over 30 days, one step a day, MWA guides you through the app to change your relationship with food and build habits that last — no restriction, no guilt."
            : 'Não é uma dieta. Em 30 dias, um passo por dia, o MWA guia você pelo aplicativo para mudar sua relação com a comida e construir hábitos que permanecem — sem restrição, sem culpa.'}
        </p>

        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-verde/70">
          {ingles
            ? "Built from the same approach that helped Wanessa Auad lose 26 kg and maintain her transformation for 14 years — now in your pocket."
            : 'Criado a partir da abordagem que permitiu a Wanessa Auad eliminar 26 kg e manter sua transformação por 14 anos — agora no seu bolso.'}
        </p>

        {/* Gatilhos de autoridade */}
        <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-3 text-left md:grid-cols-2">
          {gatilhos.map((g, i) => {
            const Icon = g.icon
            return (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-sage-claro bg-white p-3">
                <Icon size={20} className="shrink-0 text-sage" />
                <p className="text-sm font-semibold text-verde">{ingles ? g.textoEn : g.texto}</p>
              </div>
            )
          })}
        </div>

        <BotaoCTA />
        <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-verde/60">
          {ingles ? 'Developed by Wanessa Auad — Registered Dietitian · CRN-1/27939' : 'Desenvolvido por Wanessa Auad — Nutricionista · CRN-1/27939'}
        </p>
      </section>

      {/* O problema */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ouro">{ingles ? 'The problem' : 'O problema'}</p>
          <p className="mb-6 font-serif text-2xl font-bold text-verde md:text-3xl">
            {ingles ? 'Stop starting over every Monday.' : 'Pare de recomeçar toda segunda-feira.'}
          </p>
          <p className="mb-6 text-base leading-relaxed text-verde/80">
            {ingles
              ? "You don't need to count calories without understanding what you're doing. You don't need impossible restrictions. And you don't need to carry guilt for not sustaining a routine that was never designed for your real life."
              : 'Você não precisa contar calorias sem entender o que está fazendo. Não precisa de restrições impossíveis. E não precisa carregar culpa por não sustentar uma rotina que nunca foi pensada para a sua vida real.'}
          </p>
          <p className="mb-6 font-serif text-xl italic text-verde">
            {ingles ? "The problem isn't your willpower. It's trying to change without a method." : 'O problema não é a sua força de vontade. É tentar mudar sem método.'}
          </p>
          <p className="mb-8 text-base leading-relaxed text-verde/80">
            {ingles
              ? 'MWA exists to teach you to understand your body, organize your eating, and build habits that last — long after the program ends.'
              : 'O MWA existe para ensinar você a entender seu corpo, organizar sua alimentação e construir hábitos que continuam — muito depois do programa.'}
          </p>
          <BotaoCTA className="!bg-transparent !text-verde !shadow-none border-2 border-verde hover:!bg-verde hover:!text-white">
            {ingles ? 'I want to start now' : 'Quero começar agora'}
          </BotaoCTA>
        </div>
      </section>

      {/* História — Wanessa */}
      <section className="bg-verde py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ouro-claro">{ingles ? 'The story' : 'A história'}</p>
          <h3 className="mb-8 font-serif text-2xl font-bold italic text-white md:text-3xl">
            {ingles ? 'Before it was a method, it was a transformed life.' : 'Antes de ser um método, foi uma vida transformada.'}
          </h3>
          <div className="mx-auto max-w-2xl space-y-5 text-left text-base leading-relaxed text-white/85">
            {ingles ? (
              <>
                <p>
                  After my son's birth, I lost 26 kg. But the biggest challenge wasn't losing the weight —
                  it was never having to start over again.
                </p>
                <p>
                  That's when I understood: diets can produce quick results, but it's habits that sustain
                  them over the years. For 14 years I've lived this transformation, with smart eating,
                  mindset, and consistent choices.
                </p>
                <p>
                  As a dietitian, I turned that experience into a method — the same one that now guides
                  you every day through the app.
                </p>
              </>
            ) : (
              <>
                <p>
                  Após a gestação do meu filho, eliminei 26 kg. Mas o maior desafio não era emagrecer —
                  era nunca mais precisar recomeçar.
                </p>
                <p>
                  Foi nesse processo que entendi: dietas até geram resultados rápidos, mas são os
                  hábitos que os mantêm ao longo dos anos. Há 14 anos vivo essa transformação, com
                  alimentação inteligente, mentalidade e escolhas consistentes.
                </p>
                <p>
                  Como nutricionista, transformei essa vivência em método — o mesmo que agora acompanha
                  você todos os dias pelo aplicativo.
                </p>
              </>
            )}
          </div>
          <p className="mx-auto mt-8 max-w-2xl border-l-2 border-ouro pl-5 text-left font-serif text-xl italic leading-snug text-ouro-claro md:text-2xl">
            {ingles ? '"The biggest result wasn\'t losing 26 kg. It was learning to stay."' : '"O maior resultado não foi perder 26 kg. Foi aprender a permanecer."'}
          </p>
          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-serif text-3xl font-bold text-ouro-claro md:text-4xl">26 kg</p>
              <p className="mt-1 text-xs leading-snug text-white/60">{ingles ? 'lost after pregnancy' : 'eliminados após a gestação'}</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-ouro-claro md:text-4xl">{ingles ? '14 years' : '14 anos'}</p>
              <p className="mt-1 text-xs leading-snug text-white/60">{ingles ? 'maintaining the transformation' : 'mantendo a transformação'}</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-ouro-claro md:text-4xl">20+</p>
              <p className="mt-1 text-xs leading-snug text-white/60">{ingles ? 'years as a dietitian' : 'anos como nutricionista'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Objeções — respondendo ao que a cliente pensa antes de decidir */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-2 text-center font-serif text-3xl font-bold italic text-verde">
            {ingles ? 'Your questions, answered' : 'Suas dúvidas, respondidas'}
          </h3>
          <p className="mb-10 text-center text-sm text-verde/60">
            {ingles ? "We know exactly what's on your mind before you decide." : 'Sabemos exatamente o que passa pela sua cabeça antes de decidir.'}
          </p>
          <div className="space-y-5">
            {objecoes.map((o, i) => (
              <div key={i} className="rounded-2xl border-2 border-sage-claro bg-white p-6">
                <p className="mb-2 font-serif text-lg font-semibold italic text-verde">{ingles ? o.perguntaEn : o.pergunta}</p>
                <p className="text-sm leading-relaxed text-verde/75">{ingles ? o.respostaEn : o.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Imagine daqui a 30 dias */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-10 text-center font-serif text-3xl font-bold italic text-verde">
            {ingles ? 'Imagine what 30 days from now looks like.' : 'Imagine como será daqui a 30 dias.'}
          </h3>
          <div className="space-y-4">
            {imagine.map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg border border-cinza bg-creme/40 p-5">
                <span className="text-xl text-sage">✔</span>
                <p className="text-base font-semibold text-verde">{ingles ? item.en : item.pt}</p>
              </div>
            ))}
          </div>

          {/* Linguagem concreta da transformação prática */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {concreto.map((c, i) => (
              <span
                key={i}
                className="rounded-full border-2 border-sage bg-sage-claro/50 px-4 py-2 text-sm font-bold text-verde"
              >
                {ingles ? c.en : c.pt}
              </span>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-base leading-relaxed text-verde/80">
              {ingles ? 'This transformation begins with small decisions made every day.' : 'Essa transformação começa com pequenas decisões feitas todos os dias.'}
            </p>
            <p className="mt-2 text-lg font-bold text-verde">{ingles ? "And you won't be alone." : 'E você não estará sozinha.'}</p>
          </div>
        </div>
      </section>

      {/* Mais do que um aplicativo */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 className="mb-3 font-serif text-3xl font-bold italic text-verde">
            {ingles ? 'A complete path to your well-being.' : 'Um caminho completo para o seu bem-estar.'}
          </h3>
          <p className="mb-10 text-xl font-semibold text-verde/80">
            {ingles ? 'Everything connects to help you build habits that last.' : 'Tudo se conecta para ajudar você a criar hábitos que permanecem.'}
          </p>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-verde/80">
            {ingles
              ? "Throughout the day, you log what you ate and the app adds up calories and nutrients in real time. So you see how much you've already had, what's left, and how to adjust your next meal."
              : 'Ao longo do dia, você registra o que comeu e o app soma calorias e nutrientes em tempo real. Assim, você vê quanto já consumiu, o que ainda precisa e como ajustar a próxima refeição.'}
          </p>

          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {pilares.map((p, i) => (
              <div key={i} className="rounded-xl bg-sage-claro/50 p-5">
                <p className="font-serif text-lg font-bold italic text-verde">{ingles ? p.en : p.pt}</p>
              </div>
            ))}
          </div>

          <p className="mb-2 text-base text-verde/80">
            {ingles
              ? 'Education shows you the why. Tracking shows you where you stand. Motivation helps you keep going.'
              : 'Educação mostra o porquê. O monitoramento mostra onde você está. A motivação ajuda a continuar.'}
          </p>
          <p className="mb-10 text-xl font-bold text-verde">
            {ingles ? 'And the games bring the fun, making the process simple, magical and light. ✨' : 'E os jogos trazem diversão, tornando o processo simples, mágico e leve. ✨'}
          </p>

          <p className="mb-6 font-semibold text-verde">{ingles ? "Every day you'll be able to track:" : 'Todos os dias você poderá acompanhar:'}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {recursos.map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-cinza bg-white p-3">
                <span className="text-xl">{r.emoji}</span>
                <p className="text-sm font-semibold text-verde">{ingles ? r.textoEn : r.texto}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-serif text-xl font-bold italic text-ouro">
            {ingles ? 'All in one place.' : 'Tudo em um único lugar.'}
          </p>
        </div>
      </section>

      {/* Telas do App */}
      <section id="telas" className="bg-verde py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="mb-3 text-center font-serif text-3xl font-bold italic text-white">
            {ingles ? 'See inside the app' : 'Conheça o app por dentro'}
          </h3>
          <p className="mb-12 text-center text-sm text-white/70">
            {ingles ? 'Everything you need for your 30 days, in the palm of your hand.' : 'Tudo o que você precisa para os seus 30 dias, na palma da mão.'}
          </p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Tela 1: Hoje */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-1 text-left font-serif text-sm font-bold italic text-verde">{ingles ? 'Hi, Mary 🌿' : 'Olá, Maria 🌿'}</p>
                <p className="mb-3 text-left text-[10px] text-verde/60">{ingles ? "Day 7 of 30 — you're doing great!" : 'Dia 7 de 30 — você está indo bem!'}</p>
                <div className="relative mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#879B55 0% 68%, #E8E4DC 68% 100%)' }}>
                  <div className="flex flex-col items-center justify-center rounded-full bg-creme" style={{ width: '5.5rem', height: '5.5rem' }}>
                    <p className="text-lg font-bold text-verde">1.240</p>
                    <p className="text-[9px] text-verde/60">{ingles ? 'of 1,800 kcal' : 'de 1.800 kcal'}</p>
                  </div>
                </div>
                <div className="mb-2 rounded-lg bg-white p-2.5 text-left">
                  <p className="text-[10px] font-semibold text-verde">{ingles ? '💧 Water' : '💧 Água'}</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-cinza">
                    <div className="h-2 rounded-full bg-sage" style={{ width: '60%' }}></div>
                  </div>
                  <p className="mt-1 text-[9px] text-verde/60">{ingles ? '1,500 ml of 2,500 ml' : '1.500 ml de 2.500 ml'}</p>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="rounded-lg bg-white p-1.5">
                    <p className="text-[10px] font-bold text-verde">82g</p>
                    <p className="text-[8px] text-verde/60">{ingles ? 'Protein' : 'Proteína'}</p>
                  </div>
                  <div className="rounded-lg bg-white p-1.5">
                    <p className="text-[10px] font-bold text-verde">110g</p>
                    <p className="text-[8px] text-verde/60">{ingles ? 'Carbs' : 'Carbos'}</p>
                  </div>
                  <div className="rounded-lg bg-white p-1.5">
                    <p className="text-[10px] font-bold text-verde">38g</p>
                    <p className="text-[8px] text-verde/60">{ingles ? 'Fat' : 'Gordura'}</p>
                  </div>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'Track your day' : 'Acompanhe seu dia'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles ? 'Calories, water and macros calculated automatically for your body and goal.' : 'Calorias, água e macros calculados automaticamente para o seu corpo e objetivo.'}
              </p>
            </div>

            {/* Tela 2: Refeições */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 text-left font-serif text-sm font-bold italic text-verde">{ingles ? "Today's meals" : 'Refeições de hoje'}</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-white p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-verde">{ingles ? '☕ Breakfast' : '☕ Café da manhã'}</p>
                      <p className="text-[9px] text-verde/60">07:30</p>
                    </div>
                    <p className="mt-0.5 select-none text-[9px] text-verde/70 blur-[3px]">{ingles ? 'MWA shake + banana' : 'Shake MWA + banana'}</p>
                    <p className="text-[9px] font-semibold text-sage">{ingles ? '320 kcal · 25g prot' : '320 kcal · 25g prot'}</p>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-verde">{ingles ? '🍽️ Lunch' : '🍽️ Almoço'}</p>
                      <p className="text-[9px] text-verde/60">12:40</p>
                    </div>
                    <p className="mt-0.5 select-none text-[9px] text-verde/70 blur-[3px]">{ingles ? 'Grilled chicken, rice and salad' : 'Frango grelhado, arroz e salada'}</p>
                    <p className="text-[9px] font-semibold text-sage">540 kcal · 42g prot</p>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-verde">{ingles ? '🥗 Snack' : '🥗 Lanche'}</p>
                      <p className="text-[9px] text-verde/60">16:00</p>
                    </div>
                    <p className="mt-0.5 select-none text-[9px] text-verde/70 blur-[3px]">{ingles ? 'Yogurt with fiber' : 'Iogurte com fibras'}</p>
                    <p className="text-[9px] font-semibold text-sage">180 kcal · 12g prot</p>
                  </div>
                  <button className="w-full rounded-lg bg-verde py-2 text-[10px] font-bold text-white">
                    {ingles ? '+ Add meal' : '+ Adicionar refeição'}
                  </button>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'Log your meals' : 'Registre suas refeições'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles ? 'Ready-made food database: pick, tap, and nutrients add up instantly.' : 'Banco de alimentos pronto: escolha, toque e os nutrientes são somados na hora.'}
              </p>
            </div>

            {/* Tela 3: Progresso */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-1 text-left font-serif text-sm font-bold italic text-verde">{ingles ? 'Your progress' : 'Seu progresso'}</p>
                <div className="mb-3 rounded-lg bg-white p-2.5 text-left">
                  <p className="text-[9px] text-verde/60">{ingles ? 'Current weight' : 'Peso atual'}</p>
                  <p className="text-lg font-bold text-verde">72.4 kg <span className="text-[10px] font-semibold text-sage">▼ -2.8 kg</span></p>
                </div>
                <div className="rounded-lg bg-white p-2.5">
                  <p className="mb-2 text-left text-[10px] font-semibold text-verde">{ingles ? 'Weekly progress' : 'Evolução semanal'}</p>
                  <div className="flex h-20 items-end justify-around gap-1.5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-cinza" style={{ height: '72px' }}></div>
                      <p className="text-[8px] text-verde/60">{ingles ? 'Start' : 'Início'}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-sage/60" style={{ height: '64px' }}></div>
                      <p className="text-[8px] text-verde/60">{ingles ? 'Wk 1' : 'Sem 1'}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-sage" style={{ height: '58px' }}></div>
                      <p className="text-[8px] text-verde/60">{ingles ? 'Wk 2' : 'Sem 2'}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-verde" style={{ height: '52px' }}></div>
                      <p className="text-[8px] text-verde/60">{ingles ? 'Wk 3' : 'Sem 3'}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 rounded-lg bg-ouro-claro/40 p-2 text-left">
                  <p className="text-[9px] font-semibold text-verde">{ingles ? '🏆 Measurements: -4 cm waist' : '🏆 Medidas: -4 cm de cintura'}</p>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'See your progress' : 'Veja sua evolução'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles ? 'Weekly weigh-ins, measurements and before/after photos — your transformation, on record.' : 'Pesagens semanais, medidas e fotos de antes e depois — sua transformação registrada.'}
              </p>
            </div>

            {/* Tela 4: Dicas diárias */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-1 text-left font-serif text-sm font-bold italic text-verde">{ingles ? 'Tip of the day' : 'Dica do dia'}</p>
                <p className="mb-3 text-left text-[10px] text-verde/60">{ingles ? 'Day 4 of 30 · Hydration' : 'Dia 4 de 30 · Hidratação'}</p>
                <div className="rounded-lg bg-white p-3 text-left">
                  <p className="text-2xl">💧</p>
                  <p className="mt-1 text-[11px] font-bold leading-snug text-verde">
                    {ingles ? 'Water: your results accelerator' : 'Água: seu acelerador de resultados'}
                  </p>
                  <p className="mt-1.5 select-none text-[9px] leading-relaxed text-verde/70 blur-[3px]">
                    {ingles
                      ? 'Your body confuses thirst with hunger. Drinking water throughout the day reduces snacking, improves digestion and supports your results during the program.'
                      : 'Seu corpo confunde sede com fome. Beber água ao longo do dia reduz beliscos, melhora a digestão e apoia os seus resultados durante o programa.'}
                  </p>
                </div>
                <div className="mt-2 rounded-lg bg-sage-claro/60 p-2.5 text-left">
                  <p className="text-[9px] font-bold text-verde">{ingles ? '✅ Practical tip' : '✅ Dica prática'}</p>
                  <p className="mt-0.5 select-none text-[9px] leading-relaxed text-verde/80 blur-[3px]">
                    {ingles ? "Drink 1 glass of water 15 minutes before each of today's meals." : 'Beba 1 copo de água 15 minutos antes de cada refeição de hoje.'}
                  </p>
                </div>
                <div className="mt-2 rounded-lg bg-white p-2 text-left">
                  <p className="text-[9px] font-bold text-verde">{ingles ? '🔒 Exclusive content for members' : '🔒 Conteúdo exclusivo para alunas'}</p>
                  <p className="mt-0.5 text-[9px] text-verde/60">{ingles ? 'By Wanessa Auad · Dietitian' : 'Por Wanessa Auad · Nutricionista'}</p>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'Learn every day' : 'Aprenda todos os dias'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles
                  ? "Throughout the 30 days, you get the dietitian's knowledge daily: one exclusive tip a day to transform your habits."
                  : 'Durante os 30 dias, você recebe diariamente o conhecimento da nutricionista: uma dica exclusiva por dia para transformar seus hábitos.'}
              </p>
            </div>

            {/* Tela 5: Calculadora de macros */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <Calculator size={14} className="not-italic text-sage" /> {ingles ? 'Macro calculator' : 'Calculadora de macros'}
                </p>
                <div className="rounded-lg border-2 border-sage/30 bg-white px-3 py-2.5 text-left text-[10px] text-verde/50">
                  {ingles ? 'E.g.: sweet potato, shake...' : 'Ex.: batata-doce, shake...'}
                </div>
                <div className="mt-2 rounded-lg bg-white p-3 text-left">
                  <p className="text-[10px] font-bold text-verde">{ingles ? 'Sweet potato · 150g' : 'Batata-doce · 150g'}</p>
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">129</p>
                      <p className="text-[7px] text-verde/60">kcal</p>
                    </div>
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">2g</p>
                      <p className="text-[7px] text-verde/60">{ingles ? 'prot' : 'prot'}</p>
                    </div>
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">30g</p>
                      <p className="text-[7px] text-verde/60">{ingles ? 'carb' : 'carb'}</p>
                    </div>
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">0g</p>
                      <p className="text-[7px] text-verde/60">{ingles ? 'fat' : 'gord'}</p>
                    </div>
                  </div>
                </div>
                <button className="mt-2 w-full rounded-lg bg-sage py-2 text-[10px] font-bold text-white">
                  {ingles ? '+ Add to meal' : '+ Adicionar à refeição'}
                </button>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'Macro calculator' : 'Calculadora de macros'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles ? 'Look up any food in the database in seconds, no need to memorize nutrition tables.' : 'Consulte qualquer alimento do banco de dados em segundos, sem precisar decorar tabela nutricional.'}
              </p>
            </div>

            {/* Tela 6: Exercício */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <Flame size={14} className="not-italic text-ouro" /> {ingles ? 'Log exercise' : 'Registrar exercício'}
                </p>
                <div className="space-y-1.5">
                  {(ingles
                    ? [
                        ['🚶‍♀️', 'Walking', '30 min', '145 kcal'],
                        ['🚴', 'Cycling', '20 min', '180 kcal'],
                        ['🏋️‍♀️', 'Weight training', '45 min', '210 kcal'],
                      ]
                    : [
                        ['🚶‍♀️', 'Caminhada', '30 min', '145 kcal'],
                        ['🚴', 'Bike', '20 min', '180 kcal'],
                        ['🏋️‍♀️', 'Musculação', '45 min', '210 kcal'],
                      ]
                  ).map(([e, nome, tempo, kcal], i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white p-2 text-left">
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-verde">
                        <span>{e}</span> {nome} <span className="text-verde/50">· {tempo}</span>
                      </span>
                      <span className="text-[9px] font-bold text-ouro">-{kcal}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 rounded-lg bg-ouro-claro/50 p-2 text-center">
                  <p className="text-[9px] font-bold text-verde">{ingles ? "Total burned today: 535 kcal 🔥" : 'Gasto total do dia: 535 kcal 🔥'}</p>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'Physical activity' : 'Atividade física'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles ? "Log your workouts and instantly see how many calories you burned — added to your daily goals." : 'Registre seus treinos e veja na hora quantas calorias você gastou — tudo somado às suas metas do dia.'}
              </p>
            </div>

            {/* Tela 7: Jogos */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <Gamepad2 size={14} className="not-italic text-sage" /> {ingles ? 'Your avatar' : 'Seu avatar'}
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-claro text-2xl">🦋</span>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-verde">{ingles ? '135 🌱 seeds' : '135 🌱 sementes'}</p>
                    <p className="text-[8px] text-verde/60">{ingles ? 'Earn by playing and hitting goals' : 'Ganhe jogando e cumprindo metas'}</p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="text-lg">🍓</p>
                    <p className="text-[9px] font-bold text-verde">{ingles ? 'Harvest' : 'Colheita'}</p>
                  </div>
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="text-lg">🥗</p>
                    <p className="text-[9px] font-bold text-verde">{ingles ? 'Choices' : 'Escolhas'}</p>
                  </div>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'Games that motivate' : 'Jogos que motivam'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles ? 'Complete tasks, play, and customize your avatar. Gamification to make the 30 days lighter.' : 'Cumpra tarefas, jogue e personalize seu avatar. Gamificação para tornar os 30 dias mais leves.'}
              </p>
            </div>

            {/* Tela 8: Reflexões que edificam */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <span className="text-sm">✨</span> {ingles ? 'Reflection of the day' : 'Reflexão do dia'}
                </p>
                <div
                  className="relative overflow-hidden rounded-2xl border border-ouro/30 p-4 text-center"
                  style={{ background: 'linear-gradient(160deg, #08402F 0%, #486E42 55%, #879B55 100%)' }}
                >
                  <p className="text-[8px] font-bold uppercase tracking-wider text-ouro-claro">{ingles ? 'Respect for the body' : 'Respeito ao corpo'}</p>
                  <p className="mt-2 font-serif text-[11px] italic leading-snug text-white">
                    {ingles
                      ? '"Do you not know that your bodies are temples of the Holy Spirit, who is in you?"'
                      : '"Ou não sabem que o corpo de vocês é templo do Espírito Santo que habita em vocês?"'}
                  </p>
                  <p className="mt-2 text-[9px] font-bold text-ouro-claro">— 1 {ingles ? 'Corinthians' : 'Coríntios'} 6:19</p>
                  <div className="mx-auto my-3 h-px w-2/3 bg-ouro/30" />
                  <div className="rounded-xl border border-white/15 bg-black/15 p-2.5 text-left">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-ouro-claro">{ingles ? '💭 Reflection' : '💭 Reflexão'}</p>
                    <p className="mt-1 text-[9px] leading-relaxed text-white/95">
                      {ingles ? 'Your body is sacred. Every food choice is an act of caring for yourself.' : 'Seu corpo é sagrado. Cada escolha alimentar é um ato de cuidado com você mesma.'}
                    </p>
                  </div>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">{ingles ? 'Reflections that uplift' : 'Reflexões que edificam'}</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                {ingles ? 'Every day, a message that nurtures the mind and heart — because transformation is born from within, too.' : 'A cada dia, uma mensagem que cuida da mente e do coração — porque transformação também nasce por dentro.'}
              </p>
            </div>
          </div>

          <div className="mt-14 text-center">
            <BotaoCTA className="!bg-white !text-verde hover:!bg-creme" />
          </div>
        </div>
      </section>

      {/* Por que funciona */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-6 text-center font-serif text-3xl font-bold italic text-verde">
            {ingles ? 'Why does My Wellness App work?' : 'Por que o My Wellness App funciona?'}
          </h3>
          <p className="mb-2 text-center text-base leading-relaxed text-verde/80">
            {ingles ? 'Because it turns information into daily practice and shows your progress clearly.' : 'Porque ele transforma informação em prática diária e mostra sua evolução de forma clara.'}
          </p>
          <p className="mb-10 text-center text-lg font-bold text-verde">
            {ingles ? 'You learn, put it into practice, track it, and have fun while building new habits.' : 'Você aprende, coloca em prática, acompanha e se diverte enquanto cria novos hábitos.'}
          </p>

          <p className="mb-6 text-center font-semibold text-verde">{ingles ? "You'll learn:" : 'Você aprenderá:'}</p>
          <div className="space-y-3">
            {aprendizados.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-cinza bg-white p-4">
                <span className="text-sage">✅</span>
                <p className="text-sm font-semibold text-verde">{ingles ? item.en : item.pt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autoridade — Wanessa */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h3 className="mb-10 font-serif text-2xl font-bold italic text-verde md:text-3xl">
            {ingles ? 'Built with experience. Guided with purpose.' : 'Criado com experiência. Guiado com propósito.'}
          </h3>

          <div className="mx-auto max-w-lg rounded-2xl border-2 border-sage-claro bg-creme/50 p-8">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-sage-claro text-4xl">
              🌿
            </div>
            <p className="font-serif text-2xl font-bold italic text-verde">Wanessa Auad</p>
            <p className="text-sm font-semibold text-verde/70">{ingles ? 'Registered Dietitian · CRN-1/27939' : 'Nutricionista · CRN-1/27939'}</p>
            <p className="mb-6 mt-1 text-sm font-semibold text-ouro">{ingles ? 'Creator and mentor of My Wellness App' : 'Criadora e mentora do My Wellness App'}</p>
            <p className="mb-4 text-sm leading-relaxed text-verde/80">
              {ingles
                ? "For over 20 years, I've helped people achieve health, self-esteem and quality of life through nutrition education."
                : 'Há mais de 20 anos, ajudo pessoas a conquistarem saúde, autoestima e qualidade de vida através da educação alimentar.'}
            </p>
            <p className="mb-4 text-sm leading-relaxed text-verde/80">
              {ingles
                ? 'After following hundreds of transformation stories, I gathered everything that truly works into one program.'
                : 'Depois de acompanhar centenas de histórias de transformação, reuni tudo o que realmente funciona em um único programa.'}
            </p>
            <p className="text-sm font-bold leading-relaxed text-verde">
              {ingles ? 'Now you can have access to that knowledge right on your phone.' : 'Agora você pode ter acesso a esse conhecimento diretamente no seu celular.'}
            </p>
          </div>

          <div className="mt-10">
            <BotaoCTA />
          </div>
        </div>
      </section>

      {/* Preço */}
      <section id="preco" className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-10 space-y-3 text-center">
            <p className="text-lg font-semibold text-verde">{ingles ? "What's it worth to learn to take care of your health?" : 'Quanto vale aprender a cuidar da sua saúde?'}</p>
            <p className="text-lg font-semibold text-verde">{ingles ? "What's it worth to put on an outfit and like what you see in the mirror?" : 'Quanto vale vestir uma roupa e gostar do que vê no espelho?'}</p>
            <p className="text-lg font-semibold text-verde">{ingles ? "What's it worth to get your self-esteem back?" : 'Quanto vale recuperar sua autoestima?'}</p>
            <p className="text-lg font-semibold text-verde">
              {ingles ? "What's it worth to stop starting your routine over every Monday?" : 'Quanto vale deixar de recomeçar sua rotina toda segunda-feira?'}
            </p>
          </div>

          <p className="mb-8 text-center text-base text-verde/70">
            {ingles ? 'You could invest hundreds or thousands in consultations and programs.' : 'Você pode investir centenas ou milhares de reais em consultas e programas.'}
            <br />
            <strong className="text-verde">{ingles ? 'Or start today with MWA.' : 'Ou começar hoje mesmo com o MWA.'}</strong>
          </p>

          {/* Ancoragem de valor: o que está incluso, antes de revelar o preço */}
          <div className="mb-8 rounded-2xl border border-sage-claro bg-white p-6">
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-verde/60">
              {ingles ? "This isn't just a course. Here's what you get:" : 'Isso não é só um curso. Você leva:'}
            </p>
            <div className="space-y-2.5">
              {inclusos.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sage">✔</span>
                  <p className="text-sm text-verde/80">{ingles ? item.en : item.pt}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-ouro bg-gradient-to-br from-ouro-claro/30 to-sage-claro/30 p-10 text-center md:p-12">
            <p className="mb-2 text-sm font-bold uppercase text-ouro">{ingles ? 'MWA | 30-Day Journey' : 'MWA | Jornada de 30 Dias'}</p>
            <div className="mb-6">
              <span className="font-serif text-7xl font-bold text-verde">R$ 97</span>
              <p className="mt-2 text-verde/70">{ingles ? 'Full access for 30 days · one-time payment' : 'Acesso completo durante 30 dias · pagamento único'}</p>
            </div>

            <button
              disabled
              className="mb-4 inline-flex items-center gap-2 rounded-xl bg-verde px-10 py-5 text-lg font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {ingles ? 'Start my 30 days' : 'Começar meus 30 dias'}
            </button>
            <p className="mb-6 text-xs text-verde/50">{ingles ? '(button will be enabled at launch)' : '(botão será ativado no lançamento)'}</p>

            <div className="mx-auto mb-4 flex max-w-md items-center gap-3 rounded-lg bg-white/70 p-4 text-left">
              <ShieldCheck size={28} className="shrink-0 text-sage" />
              <p className="text-xs leading-relaxed text-verde">
                {ingles ? (
                  <><strong>Unconditional 7-day guarantee.</strong> If you join and feel it's not for you, we refund 100% of your money. No questions asked.</>
                ) : (
                  <><strong>Garantia incondicional de 7 dias.</strong> Se você entrar e sentir que não é para você, devolvemos 100% do valor. Sem perguntas.</>
                )}
              </p>
            </div>

            <div className="mx-auto flex max-w-md items-center gap-3 rounded-lg bg-white/70 p-4 text-left">
              <span className="text-2xl">🎁</span>
              <p className="text-xs leading-relaxed text-verde">
                {ingles ? (
                  <><strong>Your progress can continue:</strong> at checkout, you can add the{' '}
                  <strong>MWA | 90-Day Program</strong> at a special member rate — and the continuation is also available inside the app.</>
                ) : (
                  <><strong>Sua evolução pode continuar:</strong> no checkout, você pode adicionar o{' '}
                  <strong>MWA | Programa de 90 Dias</strong> em condição especial para alunas — e a
                  continuidade também fica disponível dentro do aplicativo.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decisão final */}
      <section className="bg-verde py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h3 className="mb-6 font-serif text-3xl font-bold italic text-white">
            {ingles ? 'Your decision starts now.' : 'Sua decisão começa agora.'}
          </h3>
          <p className="mb-10 text-base text-white/80">
            {ingles ? 'The next 30 days will pass either way.' : 'Os próximos 30 dias vão passar de qualquer forma.'}
            <br />
            {ingles ? 'The only difference will be choosing between:' : 'A única diferença será escolher entre:'}
          </p>

          <div className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-6">
              <p className="mb-2 text-3xl">❌</p>
              <p className="font-semibold text-white/80">{ingles ? 'Staying where you are.' : 'Continuar onde está.'}</p>
            </div>
            <div className="rounded-xl bg-white p-6">
              <p className="mb-2 text-3xl">✅</p>
              <p className="font-semibold text-verde">
                {ingles ? 'Looking back and being grateful you took the first step today.' : 'Olhar para trás e agradecer por ter dado o primeiro passo hoje.'}
              </p>
            </div>
          </div>

          <p className="mb-8 font-serif text-xl font-bold italic text-ouro-claro">
            {ingles ? 'Your transformation starts with a single decision.' : 'Sua transformação começa com uma única decisão.'}
          </p>

          <button
            onClick={irParaPreco}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-lg font-bold text-verde shadow-lg hover:bg-creme transition-colors"
          >
            {ingles ? 'Start now' : 'Começar agora'}
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 py-16">
        <h3 className="mb-8 text-center font-serif text-2xl font-bold italic text-verde">
          {ingles ? 'Frequently Asked Questions' : 'Dúvidas Frequentes'}
        </h3>
        <div className="space-y-4">
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? 'How do I access the app?' : 'Como acesso o app?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? 'After purchase, you receive the instructions and your access code by email. Just redeem it and create your account.' : 'Após a compra, você recebe por email as instruções e seu código de acesso. É só resgatar e criar sua conta.'}
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? 'Do I need to download it from an app store?' : 'Preciso baixar na loja de aplicativos?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? 'No. The app runs right in your phone browser and can be added to your home screen in one tap, without taking up storage.' : 'Não. O app funciona direto no navegador do celular e pode ser adicionado à tela inicial em um toque, sem ocupar memória.'}
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? 'Is it a PDF or an e-book?' : 'É um PDF ou e-book?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? 'No. MWA is an experience guided by the app, with logging, content, goals and daily tracking.' : 'Não. O MWA é uma experiência guiada pelo aplicativo, com registros, conteúdos, metas e acompanhamento diário.'}
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? 'How long will I have access?' : 'Por quanto tempo terei acesso?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? 'Access to the Journey is 30 days, starting when you create your account.' : 'O acesso da Jornada é de 30 dias, começando quando você criar sua conta.'}
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? 'Can I continue after the 30 days?' : 'Posso continuar depois dos 30 dias?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? 'Yes. You can add the MWA | 90-Day Program right at checkout, at a special member rate, or purchase the continuation inside the app.' : 'Sim. Você pode adicionar o MWA | Programa de 90 Dias já no checkout, em condição especial para alunas, ou contratar a continuidade dentro do aplicativo.'}
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? 'Is there a monthly fee?' : 'Existe mensalidade?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? 'No. The 30-Day Journey is a one-time payment of R$ 97.' : 'Não. A Jornada de 30 Dias é pagamento único de R$ 97.'}
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? "What if I don't like it?" : 'E se eu não gostar?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? "You have an unconditional 7-day guarantee. Just request a refund and we return 100% of your money, no questions asked." : 'Você tem 7 dias de garantia incondicional. Basta pedir o reembolso e devolvemos 100% do valor, sem perguntas.'}
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">{ingles ? 'Can I share my access?' : 'Posso compartilhar meu acesso?'}</summary>
            <p className="mt-2 text-sm text-verde/70">
              {ingles ? 'No. Access is individual and personal.' : 'Não. O acesso é individual e pessoal.'}
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cinza bg-white py-10 text-center text-sm text-verde/60">
        <LogoMWA variante="simbolo" className="mx-auto mb-2 h-10 w-10" />
        <p className="font-serif text-lg font-bold italic text-verde">MWA · My Wellness App</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-verde/40">My Wellness Approach</p>
        <p className="mx-auto mt-3 max-w-xs text-sm text-verde/70">{ingles ? 'A complete path to your well-being.' : 'Um caminho completo para o seu bem-estar.'}</p>
        <div className="mx-auto mt-6 max-w-2xl space-y-2 border-t border-cinza px-4 pt-5 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-verde/60">{ingles ? 'Important notices' : 'Avisos importantes'}</p>
          <p className="text-[11px] leading-relaxed text-verde/60">
            {ingles ? (
              <>MWA | 30-Day Journey is an <strong>educational</strong> program for organizing habits and eating routine. It does not diagnose, treat, cure or prevent any disease and <strong>does not replace consultation with a dietitian, doctor or other health professional</strong>. The app's content is general and informational and does not constitute individualized nutritional care or a dietary prescription.</>
            ) : (
              <>O MWA | Jornada de 30 Dias é um programa <strong>educacional</strong> de organização de
              hábitos e rotina alimentar. Ele não realiza diagnóstico, tratamento, cura ou prevenção
              de qualquer doença e <strong>não substitui consulta com nutricionista, médico ou outro
              profissional de saúde</strong>. O conteúdo do aplicativo tem caráter geral e informativo
              e não constitui atendimento nutricional individualizado nem prescrição dietética.</>
            )}
          </p>
          <p className="text-[11px] leading-relaxed text-verde/60">
            {ingles
              ? "Results vary from person to person and depend on individual factors and adherence to the guidance — no specific result is promised or guaranteed. Wanessa Auad's story is a real personal account and does not represent a promise of results. If you have a health condition, use medication, are pregnant, breastfeeding, or have a history of an eating disorder, seek individualized professional guidance before changing your diet."
              : 'Resultados variam de pessoa para pessoa e dependem de fatores individuais e da aplicação das orientações — nenhum resultado específico é prometido ou garantido. A história de Wanessa Auad é um relato pessoal real e não representa promessa de resultado. Em caso de condição de saúde, uso de medicamentos, gestação, amamentação ou histórico de transtorno alimentar, procure orientação profissional individualizada antes de mudar sua alimentação.'}
          </p>
        </div>
        <p className="mt-6 text-xs">{ingles ? 'Wanessa Auad — Registered Dietitian — CRN-1/27939' : 'Wanessa Auad — Nutricionista — CRN-1/27939'}</p>
        <p className="mt-4 text-xs">© 2026 MWA · My Wellness App</p>
        <p className="mt-1 text-xs">metodomwa.com.br</p>
      </footer>
    </div>
  )
}
