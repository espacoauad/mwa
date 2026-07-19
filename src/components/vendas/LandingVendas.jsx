import { ArrowRight, ShieldCheck, Award, Smartphone, Zap, CreditCard, HeartHandshake, Calculator, Flame, Gamepad2 } from 'lucide-react'
import LogoMWA from '../ui/LogoMWA.jsx'

function irParaPreco() {
  document.querySelector('#preco')?.scrollIntoView({ behavior: 'smooth' })
}

function BotaoCTA({ children = 'Começar meus 30 dias', className = '' }) {
  return (
    <button
      onClick={irParaPreco}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-verde px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-verde/90 hover:shadow-xl transition-all md:px-10 md:py-5 md:text-lg ${className}`}
    >
      {children}
    </button>
  )
}

export default function LandingVendas() {
  // Gatilhos de confiança logo abaixo do título
  const gatilhos = [
    { icon: Award, texto: '20+ anos de experiência em emagrecimento' },
    { icon: ShieldCheck, texto: 'Nutricionista · CRN-1/27939' },
    { icon: Smartphone, texto: 'Monitoramento real do seu dia — simples e prático' },
    { icon: HeartHandshake, texto: 'Garantia incondicional de 7 dias — risco zero' },
    { icon: Zap, texto: 'Acesso imediato após a compra' },
    { icon: CreditCard, texto: 'Pagamento único · nenhuma cobrança automática' },
  ]

  // Objeções silenciosas que a cliente carrega antes de decidir
  const objecoes = [
    {
      pergunta: '"Será que eu vou conseguir seguir?"',
      resposta:
        'O app foi desenhado para ser simples: metas calculadas automaticamente, refeições registradas em segundos e uma orientação nova a cada dia — sem depender apenas da força de vontade. Você entende o próximo passo e acompanha sua evolução.',
    },
    {
      pergunta: '"Será que isso é só mais uma dieta?"',
      resposta:
        'Não é uma dieta restritiva com prazo de validade. É educação para você entender o que comer, quanto comer e como se comportar diante das escolhas do dia a dia — criando autonomia para cuidar de si.',
    },
  ]

  const concreto = ['Mais leveza', 'Menos culpa', 'Mais clareza alimentar', 'Mais controle', 'Mais consistência']

  const imagine = [
    'Acordar se sentindo mais leve e com energia nova.',
    'Vestir aquela roupa que hoje está apertada — sem esforço.',
    'Saber exatamente o que comer e por quê, sem depender de modismos.',
    'Ver seu corpo mais firme e sua roupa ficando larga.',
    'Sentir a segurança de ter aprendido algo que vai durar para a vida toda.',
  ]

  const pilares = ['Monitoramento', 'Educação', 'Motivação', 'Diversão']

  const recursos = [
    { emoji: '🍽', texto: 'Alimentação' },
    { emoji: '💧', texto: 'Consumo de água' },
    { emoji: '⚖️', texto: 'Peso' },
    { emoji: '📉', texto: 'Evolução' },
    { emoji: '🥗', texto: 'Macronutrientes' },
    { emoji: '📚', texto: 'Conteúdos exclusivos' },
    { emoji: '💪', texto: 'Exercícios' },
    { emoji: '🎯', texto: 'Metas personalizadas' },
    { emoji: '📲', texto: 'Suporte' },
  ]

  const aprendizados = [
    'Como montar refeições equilibradas.',
    'Como controlar calorias sem sofrimento.',
    'Como consumir proteínas corretamente.',
    'Como manter o metabolismo ativo.',
    'Como lidar com a fome.',
    'Como evitar o efeito sanfona.',
    'Como criar hábitos que realmente permanecem.',
  ]

  const inclusos = [
    'App completo com acompanhamento diário por 30 dias',
    'Cálculo personalizado de calorias e macronutrientes',
    'Banco de alimentos e calculadora de macros',
    'Registro de exercícios com contagem de calorias gastas',
    'Uma dica exclusiva da nutricionista a cada dia',
    'Jogos que tornam o processo mais leve e motivador',
    'Suporte via WhatsApp',
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
            Começar agora
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
          Transforme hábitos. Conquiste resultados. Mude sua vida.
        </h2>

        <p className="mx-auto mb-4 max-w-2xl text-lg font-semibold leading-relaxed text-verde md:text-xl">
          Não é uma dieta. Em 30 dias, um passo por dia, o MWA guia você pelo aplicativo para
          mudar sua relação com a comida e construir hábitos que permanecem — sem restrição, sem culpa.
        </p>

        <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-verde/70">
          Criado a partir da abordagem que permitiu a Wanessa Auad eliminar 26 kg e manter sua
          transformação por 14 anos — agora no seu bolso.
        </p>

        {/* Gatilhos de autoridade */}
        <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-3 text-left md:grid-cols-2">
          {gatilhos.map((g, i) => {
            const Icon = g.icon
            return (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-sage-claro bg-white p-3">
                <Icon size={20} className="shrink-0 text-sage" />
                <p className="text-sm font-semibold text-verde">{g.texto}</p>
              </div>
            )
          })}
        </div>

        <BotaoCTA />
        <p className="mx-auto mt-6 max-w-xl text-xs leading-relaxed text-verde/60">
          Desenvolvido por Wanessa Auad — Nutricionista · CRN-1/27939
        </p>
      </section>

      {/* O problema */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ouro">O problema</p>
          <p className="mb-6 font-serif text-2xl font-bold text-verde md:text-3xl">
            Pare de recomeçar toda segunda-feira.
          </p>
          <p className="mb-6 text-base leading-relaxed text-verde/80">
            Você não precisa contar calorias sem entender o que está fazendo. Não precisa de
            restrições impossíveis. E não precisa carregar culpa por não sustentar uma rotina que
            nunca foi pensada para a sua vida real.
          </p>
          <p className="mb-6 font-serif text-xl italic text-verde">
            O problema não é a sua força de vontade. É tentar mudar sem método.
          </p>
          <p className="mb-8 text-base leading-relaxed text-verde/80">
            O MWA existe para ensinar você a entender seu corpo, organizar sua alimentação e
            construir hábitos que continuam — muito depois do programa.
          </p>
          <BotaoCTA className="!bg-transparent !text-verde !shadow-none border-2 border-verde hover:!bg-verde hover:!text-white">
            Quero começar agora
          </BotaoCTA>
        </div>
      </section>

      {/* História — Wanessa */}
      <section className="bg-verde py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ouro-claro">A história</p>
          <h3 className="mb-8 font-serif text-2xl font-bold italic text-white md:text-3xl">
            Antes de ser um método, foi uma vida transformada.
          </h3>
          <div className="mx-auto max-w-2xl space-y-5 text-left text-base leading-relaxed text-white/85">
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
          </div>
          <p className="mx-auto mt-8 max-w-2xl border-l-2 border-ouro pl-5 text-left font-serif text-xl italic leading-snug text-ouro-claro md:text-2xl">
            "O maior resultado não foi perder 26 kg. Foi aprender a permanecer."
          </p>
          <div className="mx-auto mt-10 grid max-w-md grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-serif text-3xl font-bold text-ouro-claro md:text-4xl">26 kg</p>
              <p className="mt-1 text-xs leading-snug text-white/60">eliminados após a gestação</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-ouro-claro md:text-4xl">14 anos</p>
              <p className="mt-1 text-xs leading-snug text-white/60">mantendo a transformação</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-ouro-claro md:text-4xl">20+</p>
              <p className="mt-1 text-xs leading-snug text-white/60">anos como nutricionista</p>
            </div>
          </div>
        </div>
      </section>

      {/* Objeções — respondendo ao que a cliente pensa antes de decidir */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-2 text-center font-serif text-3xl font-bold italic text-verde">
            Suas dúvidas, respondidas
          </h3>
          <p className="mb-10 text-center text-sm text-verde/60">
            Sabemos exatamente o que passa pela sua cabeça antes de decidir.
          </p>
          <div className="space-y-5">
            {objecoes.map((o, i) => (
              <div key={i} className="rounded-2xl border-2 border-sage-claro bg-white p-6">
                <p className="mb-2 font-serif text-lg font-semibold italic text-verde">{o.pergunta}</p>
                <p className="text-sm leading-relaxed text-verde/75">{o.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Imagine daqui a 30 dias */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h3 className="mb-10 text-center font-serif text-3xl font-bold italic text-verde">
            Imagine como será daqui a 30 dias.
          </h3>
          <div className="space-y-4">
            {imagine.map((item, i) => (
              <div key={i} className="flex items-start gap-4 rounded-lg border border-cinza bg-creme/40 p-5">
                <span className="text-xl text-sage">✔</span>
                <p className="text-base font-semibold text-verde">{item}</p>
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
                {c}
              </span>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-base leading-relaxed text-verde/80">
              Essa transformação começa com pequenas decisões feitas todos os dias.
            </p>
            <p className="mt-2 text-lg font-bold text-verde">E você não estará sozinha.</p>
          </div>
        </div>
      </section>

      {/* Mais do que um aplicativo */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h3 className="mb-3 font-serif text-3xl font-bold italic text-verde">
            Seu ecossistema de bem-estar.
          </h3>
          <p className="mb-10 text-xl font-semibold text-verde/80">
            Tudo se conecta para ajudar você a criar hábitos que permanecem.
          </p>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-verde/80">
            Ao longo do dia, você registra o que comeu e o app soma calorias e nutrientes em tempo real.
            Assim, você vê quanto já consumiu, o que ainda precisa e como ajustar a próxima refeição.
          </p>

          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {pilares.map((p, i) => (
              <div key={i} className="rounded-xl bg-sage-claro/50 p-5">
                <p className="font-serif text-lg font-bold italic text-verde">{p}</p>
              </div>
            ))}
          </div>

          <p className="mb-2 text-base text-verde/80">
            Educação mostra o porquê. O monitoramento mostra onde você está. A motivação ajuda a continuar.
          </p>
          <p className="mb-10 text-xl font-bold text-verde">
            E os jogos trazem diversão, tornando o processo simples, mágico e leve. ✨
          </p>

          <p className="mb-6 font-semibold text-verde">Todos os dias você poderá acompanhar:</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {recursos.map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-cinza bg-white p-3">
                <span className="text-xl">{r.emoji}</span>
                <p className="text-sm font-semibold text-verde">{r.texto}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-serif text-xl font-bold italic text-ouro">
            Tudo em um único lugar.
          </p>
        </div>
      </section>

      {/* Telas do App */}
      <section id="telas" className="bg-verde py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h3 className="mb-3 text-center font-serif text-3xl font-bold italic text-white">
            Conheça o app por dentro
          </h3>
          <p className="mb-12 text-center text-sm text-white/70">
            Tudo o que você precisa para os seus 30 dias, na palma da mão.
          </p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Tela 1: Hoje */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-1 text-left font-serif text-sm font-bold italic text-verde">Olá, Maria 🌿</p>
                <p className="mb-3 text-left text-[10px] text-verde/60">Dia 7 de 30 — você está indo bem!</p>
                <div className="relative mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#879B55 0% 68%, #E8E4DC 68% 100%)' }}>
                  <div className="flex flex-col items-center justify-center rounded-full bg-creme" style={{ width: '5.5rem', height: '5.5rem' }}>
                    <p className="text-lg font-bold text-verde">1.240</p>
                    <p className="text-[9px] text-verde/60">de 1.800 kcal</p>
                  </div>
                </div>
                <div className="mb-2 rounded-lg bg-white p-2.5 text-left">
                  <p className="text-[10px] font-semibold text-verde">💧 Água</p>
                  <div className="mt-1 h-2 w-full rounded-full bg-cinza">
                    <div className="h-2 rounded-full bg-sage" style={{ width: '60%' }}></div>
                  </div>
                  <p className="mt-1 text-[9px] text-verde/60">1.500 ml de 2.500 ml</p>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="rounded-lg bg-white p-1.5">
                    <p className="text-[10px] font-bold text-verde">82g</p>
                    <p className="text-[8px] text-verde/60">Proteína</p>
                  </div>
                  <div className="rounded-lg bg-white p-1.5">
                    <p className="text-[10px] font-bold text-verde">110g</p>
                    <p className="text-[8px] text-verde/60">Carbos</p>
                  </div>
                  <div className="rounded-lg bg-white p-1.5">
                    <p className="text-[10px] font-bold text-verde">38g</p>
                    <p className="text-[8px] text-verde/60">Gordura</p>
                  </div>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">Acompanhe seu dia</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                Calorias, água e macros calculados automaticamente para o seu corpo e objetivo.
              </p>
            </div>

            {/* Tela 2: Refeições */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 text-left font-serif text-sm font-bold italic text-verde">Refeições de hoje</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-white p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-verde">☕ Café da manhã</p>
                      <p className="text-[9px] text-verde/60">07:30</p>
                    </div>
                    <p className="mt-0.5 select-none text-[9px] text-verde/70 blur-[3px]">Shake MWA + banana</p>
                    <p className="text-[9px] font-semibold text-sage">320 kcal · 25g prot</p>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-verde">🍽️ Almoço</p>
                      <p className="text-[9px] text-verde/60">12:40</p>
                    </div>
                    <p className="mt-0.5 select-none text-[9px] text-verde/70 blur-[3px]">Frango grelhado, arroz e salada</p>
                    <p className="text-[9px] font-semibold text-sage">540 kcal · 42g prot</p>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-verde">🥗 Lanche</p>
                      <p className="text-[9px] text-verde/60">16:00</p>
                    </div>
                    <p className="mt-0.5 select-none text-[9px] text-verde/70 blur-[3px]">Iogurte com fibras</p>
                    <p className="text-[9px] font-semibold text-sage">180 kcal · 12g prot</p>
                  </div>
                  <button className="w-full rounded-lg bg-verde py-2 text-[10px] font-bold text-white">
                    + Adicionar refeição
                  </button>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">Registre suas refeições</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                Banco de alimentos pronto: escolha, toque e os nutrientes são somados na hora.
              </p>
            </div>

            {/* Tela 3: Progresso */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-1 text-left font-serif text-sm font-bold italic text-verde">Seu progresso</p>
                <div className="mb-3 rounded-lg bg-white p-2.5 text-left">
                  <p className="text-[9px] text-verde/60">Peso atual</p>
                  <p className="text-lg font-bold text-verde">72,4 kg <span className="text-[10px] font-semibold text-sage">▼ -2,8 kg</span></p>
                </div>
                <div className="rounded-lg bg-white p-2.5">
                  <p className="mb-2 text-left text-[10px] font-semibold text-verde">Evolução semanal</p>
                  <div className="flex h-20 items-end justify-around gap-1.5">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-cinza" style={{ height: '72px' }}></div>
                      <p className="text-[8px] text-verde/60">Início</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-sage/60" style={{ height: '64px' }}></div>
                      <p className="text-[8px] text-verde/60">Sem 1</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-sage" style={{ height: '58px' }}></div>
                      <p className="text-[8px] text-verde/60">Sem 2</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 rounded-t bg-verde" style={{ height: '52px' }}></div>
                      <p className="text-[8px] text-verde/60">Sem 3</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 rounded-lg bg-ouro-claro/40 p-2 text-left">
                  <p className="text-[9px] font-semibold text-verde">🏆 Medidas: -4 cm de cintura</p>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">Veja sua evolução</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                Pesagens semanais, medidas e fotos de antes e depois — sua transformação registrada.
              </p>
            </div>

            {/* Tela 4: Dicas diárias */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-1 text-left font-serif text-sm font-bold italic text-verde">Dica do dia</p>
                <p className="mb-3 text-left text-[10px] text-verde/60">Dia 4 de 30 · Hidratação</p>
                <div className="rounded-lg bg-white p-3 text-left">
                  <p className="text-2xl">💧</p>
                  <p className="mt-1 text-[11px] font-bold leading-snug text-verde">
                    Água: seu acelerador de resultados
                  </p>
                  <p className="mt-1.5 select-none text-[9px] leading-relaxed text-verde/70 blur-[3px]">
                    Seu corpo confunde sede com fome. Beber água ao longo do dia reduz beliscos,
                    melhora a digestão e apoia os seus resultados durante o programa.
                  </p>
                </div>
                <div className="mt-2 rounded-lg bg-sage-claro/60 p-2.5 text-left">
                  <p className="text-[9px] font-bold text-verde">✅ Dica prática</p>
                  <p className="mt-0.5 select-none text-[9px] leading-relaxed text-verde/80 blur-[3px]">
                    Beba 1 copo de água 15 minutos antes de cada refeição de hoje.
                  </p>
                </div>
                <div className="mt-2 rounded-lg bg-white p-2 text-left">
                  <p className="text-[9px] font-bold text-verde">🔒 Conteúdo exclusivo para alunas</p>
                  <p className="mt-0.5 text-[9px] text-verde/60">Por Wanessa Auad · Nutricionista</p>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">Aprenda todos os dias</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                Durante os 30 dias, você recebe diariamente o conhecimento da nutricionista:
                uma dica exclusiva por dia para transformar seus hábitos.
              </p>
            </div>

            {/* Tela 5: Calculadora de macros */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <Calculator size={14} className="not-italic text-sage" /> Calculadora de macros
                </p>
                <div className="rounded-lg border-2 border-sage/30 bg-white px-3 py-2.5 text-left text-[10px] text-verde/50">
                  Ex.: batata-doce, shake...
                </div>
                <div className="mt-2 rounded-lg bg-white p-3 text-left">
                  <p className="text-[10px] font-bold text-verde">Batata-doce · 150g</p>
                  <div className="mt-2 grid grid-cols-4 gap-1.5">
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">129</p>
                      <p className="text-[7px] text-verde/60">kcal</p>
                    </div>
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">2g</p>
                      <p className="text-[7px] text-verde/60">prot</p>
                    </div>
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">30g</p>
                      <p className="text-[7px] text-verde/60">carb</p>
                    </div>
                    <div className="rounded bg-creme p-1.5 text-center">
                      <p className="text-[10px] font-bold text-verde">0g</p>
                      <p className="text-[7px] text-verde/60">gord</p>
                    </div>
                  </div>
                </div>
                <button className="mt-2 w-full rounded-lg bg-sage py-2 text-[10px] font-bold text-white">
                  + Adicionar à refeição
                </button>
              </div>
              <h4 className="mt-5 font-bold text-white">Calculadora de macros</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                Consulte qualquer alimento do banco de dados em segundos, sem precisar decorar tabela nutricional.
              </p>
            </div>

            {/* Tela 6: Exercício */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <Flame size={14} className="not-italic text-ouro" /> Registrar exercício
                </p>
                <div className="space-y-1.5">
                  {[
                    ['🚶‍♀️', 'Caminhada', '30 min', '145 kcal'],
                    ['🚴', 'Bike', '20 min', '180 kcal'],
                    ['🏋️‍♀️', 'Musculação', '45 min', '210 kcal'],
                  ].map(([e, nome, tempo, kcal], i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-white p-2 text-left">
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold text-verde">
                        <span>{e}</span> {nome} <span className="text-verde/50">· {tempo}</span>
                      </span>
                      <span className="text-[9px] font-bold text-ouro">-{kcal}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 rounded-lg bg-ouro-claro/50 p-2 text-center">
                  <p className="text-[9px] font-bold text-verde">Gasto total do dia: 535 kcal 🔥</p>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">Atividade física</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                Registre seus treinos e veja na hora quantas calorias você gastou — tudo somado às suas metas do dia.
              </p>
            </div>

            {/* Tela 7: Jogos */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <Gamepad2 size={14} className="not-italic text-sage" /> Seu avatar
                </p>
                <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-claro text-2xl">🦋</span>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-verde">135 🌱 sementes</p>
                    <p className="text-[8px] text-verde/60">Ganhe jogando e cumprindo metas</p>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="text-lg">🍓</p>
                    <p className="text-[9px] font-bold text-verde">Colheita</p>
                  </div>
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="text-lg">🥗</p>
                    <p className="text-[9px] font-bold text-verde">Escolhas</p>
                  </div>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">Jogos que motivam</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                Cumpra tarefas, jogue e personalize seu avatar. Gamificação para tornar os 30 dias mais leves.
              </p>
            </div>

            {/* Tela 8: Reflexões que edificam */}
            <div className="text-center">
              <div className="mx-auto w-56 rounded-[2rem] border-4 border-white/20 bg-creme p-4 shadow-2xl">
                <p className="mb-3 flex items-center gap-1.5 text-left font-serif text-sm font-bold italic text-verde">
                  <span className="text-sm">✨</span> Reflexão do dia
                </p>
                <div
                  className="relative overflow-hidden rounded-2xl border border-ouro/30 p-4 text-center"
                  style={{ background: 'linear-gradient(160deg, #344528 0%, #4A5F3A 55%, #879B55 100%)' }}
                >
                  <p className="text-[8px] font-bold uppercase tracking-wider text-ouro-claro">Respeito ao corpo</p>
                  <p className="mt-2 font-serif text-[11px] italic leading-snug text-white">
                    "Ou não sabem que o corpo de vocês é templo do Espírito Santo que habita em vocês?"
                  </p>
                  <p className="mt-2 text-[9px] font-bold text-ouro-claro">— 1 Coríntios 6:19</p>
                  <div className="mx-auto my-3 h-px w-2/3 bg-ouro/30" />
                  <div className="rounded-xl border border-white/15 bg-black/15 p-2.5 text-left">
                    <p className="text-[8px] font-bold uppercase tracking-wider text-ouro-claro">💭 Reflexão</p>
                    <p className="mt-1 text-[9px] leading-relaxed text-white/95">
                      Seu corpo é sagrado. Cada escolha alimentar é um ato de cuidado com você mesma.
                    </p>
                  </div>
                </div>
              </div>
              <h4 className="mt-5 font-bold text-white">Reflexões que edificam</h4>
              <p className="mx-auto mt-1 max-w-xs text-xs text-white/70">
                A cada dia, uma mensagem que cuida da mente e do coração — porque transformação também nasce por dentro.
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
            Por que o My Wellness App funciona?
          </h3>
          <p className="mb-2 text-center text-base leading-relaxed text-verde/80">
            Porque ele transforma informação em prática diária e mostra sua evolução de forma clara.
          </p>
          <p className="mb-10 text-center text-lg font-bold text-verde">
            Você aprende, coloca em prática, acompanha e se diverte enquanto cria novos hábitos.
          </p>

          <p className="mb-6 text-center font-semibold text-verde">Você aprenderá:</p>
          <div className="space-y-3">
            {aprendizados.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-cinza bg-white p-4">
                <span className="text-sage">✅</span>
                <p className="text-sm font-semibold text-verde">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autoridade — Wanessa */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h3 className="mb-10 font-serif text-2xl font-bold italic text-verde md:text-3xl">
            Criado com experiência. Guiado com propósito.
          </h3>

          <div className="mx-auto max-w-lg rounded-2xl border-2 border-sage-claro bg-creme/50 p-8">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-sage-claro text-4xl">
              🌿
            </div>
            <p className="font-serif text-2xl font-bold italic text-verde">Wanessa Auad</p>
            <p className="text-sm font-semibold text-verde/70">Nutricionista · CRN-1/27939</p>
            <p className="mb-6 mt-1 text-sm font-semibold text-ouro">Criadora e mentora do My Wellness App</p>
            <p className="mb-4 text-sm leading-relaxed text-verde/80">
              Há mais de 20 anos, ajudo pessoas a conquistarem saúde, autoestima e
              qualidade de vida através da educação alimentar.
            </p>
            <p className="mb-4 text-sm leading-relaxed text-verde/80">
              Depois de acompanhar centenas de histórias de transformação, reuni tudo
              o que realmente funciona em um único programa.
            </p>
            <p className="text-sm font-bold leading-relaxed text-verde">
              Agora você pode ter acesso a esse conhecimento diretamente no seu celular.
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
            <p className="text-lg font-semibold text-verde">Quanto vale aprender a cuidar da sua saúde?</p>
            <p className="text-lg font-semibold text-verde">Quanto vale vestir uma roupa e gostar do que vê no espelho?</p>
            <p className="text-lg font-semibold text-verde">Quanto vale recuperar sua autoestima?</p>
            <p className="text-lg font-semibold text-verde">
              Quanto vale deixar de recomeçar sua rotina toda segunda-feira?
            </p>
          </div>

          <p className="mb-8 text-center text-base text-verde/70">
            Você pode investir centenas ou milhares de reais em consultas e programas.
            <br />
            <strong className="text-verde">Ou começar hoje mesmo com o MWA.</strong>
          </p>

          {/* Ancoragem de valor: o que está incluso, antes de revelar o preço */}
          <div className="mb-8 rounded-2xl border border-sage-claro bg-white p-6">
            <p className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-verde/60">
              Isso não é só um curso. Você leva:
            </p>
            <div className="space-y-2.5">
              {inclusos.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-sage">✔</span>
                  <p className="text-sm text-verde/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-ouro bg-gradient-to-br from-ouro-claro/30 to-sage-claro/30 p-10 text-center md:p-12">
            <p className="mb-2 text-sm font-bold uppercase text-ouro">MWA | Jornada de 30 Dias</p>
            <div className="mb-6">
              <span className="font-serif text-7xl font-bold text-verde">R$ 97</span>
              <p className="mt-2 text-verde/70">Acesso completo durante 30 dias · pagamento único</p>
            </div>

            <button
              disabled
              className="mb-4 inline-flex items-center gap-2 rounded-xl bg-verde px-10 py-5 text-lg font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Começar meus 30 dias
            </button>
            <p className="mb-6 text-xs text-verde/50">(botão será ativado no lançamento)</p>

            <div className="mx-auto mb-4 flex max-w-md items-center gap-3 rounded-lg bg-white/70 p-4 text-left">
              <ShieldCheck size={28} className="shrink-0 text-sage" />
              <p className="text-xs leading-relaxed text-verde">
                <strong>Garantia incondicional de 7 dias.</strong> Se você entrar e sentir que
                não é para você, devolvemos 100% do valor. Sem perguntas.
              </p>
            </div>

            <div className="mx-auto flex max-w-md items-center gap-3 rounded-lg bg-white/70 p-4 text-left">
              <span className="text-2xl">🎁</span>
              <p className="text-xs leading-relaxed text-verde">
                <strong>Sua evolução pode continuar:</strong> no checkout, você pode adicionar o{' '}
                <strong>MWA | Programa de 90 Dias</strong> em condição especial para alunas — e a
                continuidade também fica disponível dentro do aplicativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Decisão final */}
      <section className="bg-verde py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h3 className="mb-6 font-serif text-3xl font-bold italic text-white">
            Sua decisão começa agora.
          </h3>
          <p className="mb-10 text-base text-white/80">
            Os próximos 30 dias vão passar de qualquer forma.
            <br />
            A única diferença será escolher entre:
          </p>

          <div className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-6">
              <p className="mb-2 text-3xl">❌</p>
              <p className="font-semibold text-white/80">Continuar onde está.</p>
            </div>
            <div className="rounded-xl bg-white p-6">
              <p className="mb-2 text-3xl">✅</p>
              <p className="font-semibold text-verde">
                Olhar para trás e agradecer por ter dado o primeiro passo hoje.
              </p>
            </div>
          </div>

          <p className="mb-8 font-serif text-xl font-bold italic text-ouro-claro">
            Sua transformação começa com uma única decisão.
          </p>

          <button
            onClick={irParaPreco}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-lg font-bold text-verde shadow-lg hover:bg-creme transition-colors"
          >
            Começar agora
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 py-16">
        <h3 className="mb-8 text-center font-serif text-2xl font-bold italic text-verde">
          Dúvidas Frequentes
        </h3>
        <div className="space-y-4">
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">Como acesso o app?</summary>
            <p className="mt-2 text-sm text-verde/70">
              Após a compra, você recebe por email as instruções e seu código de acesso. É só resgatar e criar sua conta.
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">Preciso baixar na loja de aplicativos?</summary>
            <p className="mt-2 text-sm text-verde/70">
              Não. O app funciona direto no navegador do celular e pode ser adicionado à tela inicial em um toque, sem ocupar memória.
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">É um PDF ou e-book?</summary>
            <p className="mt-2 text-sm text-verde/70">
              Não. O MWA é uma experiência guiada pelo aplicativo, com registros, conteúdos, metas e acompanhamento diário.
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">Por quanto tempo terei acesso?</summary>
            <p className="mt-2 text-sm text-verde/70">
              O acesso da Jornada é de 30 dias, começando quando você criar sua conta.
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">Posso continuar depois dos 30 dias?</summary>
            <p className="mt-2 text-sm text-verde/70">
              Sim. Você pode adicionar o MWA | Programa de 90 Dias já no checkout, em condição especial para alunas, ou contratar a continuidade dentro do aplicativo.
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">Existe mensalidade?</summary>
            <p className="mt-2 text-sm text-verde/70">
              Não. A Jornada de 30 Dias é pagamento único de R$ 97.
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">E se eu não gostar?</summary>
            <p className="mt-2 text-sm text-verde/70">
              Você tem 7 dias de garantia incondicional. Basta pedir o reembolso e devolvemos 100% do valor, sem perguntas.
            </p>
          </details>
          <details className="rounded-lg border border-cinza bg-white p-4 cursor-pointer">
            <summary className="font-semibold text-verde">Posso compartilhar meu acesso?</summary>
            <p className="mt-2 text-sm text-verde/70">
              Não. O acesso é individual e pessoal.
            </p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cinza bg-white py-10 text-center text-sm text-verde/60">
        <LogoMWA variante="simbolo" className="mx-auto mb-2 h-10 w-10" />
        <p className="font-serif text-lg font-bold italic text-verde">MWA · My Wellness App</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-verde/40">My Wellness Approach</p>
        <p className="mx-auto mt-3 max-w-xs text-sm text-verde/70">Seu ecossistema para criar hábitos de bem-estar.</p>
        <div className="mx-auto mt-6 max-w-2xl space-y-2 border-t border-cinza px-4 pt-5 text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-verde/60">Avisos importantes</p>
          <p className="text-[11px] leading-relaxed text-verde/60">
            O MWA | Jornada de 30 Dias é um programa <strong>educacional</strong> de organização de
            hábitos e rotina alimentar. Ele não realiza diagnóstico, tratamento, cura ou prevenção
            de qualquer doença e <strong>não substitui consulta com nutricionista, médico ou outro
            profissional de saúde</strong>. O conteúdo do aplicativo tem caráter geral e informativo
            e não constitui atendimento nutricional individualizado nem prescrição dietética.
          </p>
          <p className="text-[11px] leading-relaxed text-verde/60">
            Resultados variam de pessoa para pessoa e dependem de fatores individuais e da aplicação
            das orientações — nenhum resultado específico é prometido ou garantido. A história de
            Wanessa Auad é um relato pessoal real e não representa promessa de resultado. Em caso de
            condição de saúde, uso de medicamentos, gestação, amamentação ou histórico de transtorno
            alimentar, procure orientação profissional individualizada antes de mudar sua alimentação.
          </p>
        </div>
        <p className="mt-6 text-xs">Wanessa Auad — Nutricionista — CRN-1/27939</p>
        <p className="mt-4 text-xs">© 2026 MWA · My Wellness App</p>
        <p className="mt-1 text-xs">metodomwa.com.br</p>
      </footer>
    </div>
  )
}
