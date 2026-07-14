import {
  UtensilsCrossed, Droplets, Scale, TrendingUp, PieChart,
  PlayCircle, Dumbbell, Target, MessageCircle, Gamepad2, Brain, Sprout, Camera,
} from 'lucide-react'
import { Section, Eyebrow, Title, GoldRule, CtaButton } from '../components/ui.jsx'

const steps = [
  'Faça sua inscrição.',
  'Receba o acesso ao aplicativo.',
  'Comece sua Jornada de 21 Dias.',
  'Monitore alimentação, água, movimento e evolução em tempo real.',
  'Aprenda com conteúdos e dicas diárias e divirta-se com os jogos.',
  'Construa hábitos que podem continuar depois do programa.',
]

const features = [
  { icon: UtensilsCrossed, label: 'Registro de alimentação' },
  { icon: Droplets, label: 'Consumo de água' },
  { icon: Scale, label: 'Controle de peso' },
  { icon: TrendingUp, label: 'Evolução semanal' },
  { icon: PieChart, label: 'Macronutrientes' },
  { icon: PlayCircle, label: 'Educação diária' },
  { icon: Dumbbell, label: 'Exercícios' },
  { icon: Target, label: 'Metas personalizadas' },
  { icon: MessageCircle, label: 'Suporte' },
  { icon: Gamepad2, label: 'Jogos e recompensas' },
]

const appConcepts = [
  {
    icon: Target,
    title: 'Um plano que começa em você',
    text: 'O app calcula metas de calorias, proteínas, carboidratos, gorduras, fibras e água de acordo com seu perfil e objetivo.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Alimentação sem adivinhação',
    text: 'Registre alimentos e medidas do dia a dia. O app soma tudo na hora e mostra quanto você comeu e o que ainda cabe na sua meta.',
  },
  {
    icon: Droplets,
    title: 'Hidratação visível',
    text: 'Cada copo entra no seu acompanhamento diário. Você vê o progresso da meta e recebe um incentivo claro para continuar.',
  },
  {
    icon: Dumbbell,
    title: 'Movimento que conta',
    text: 'Registre caminhada, musculação, corrida e outras atividades. O gasto estimado entra no balanço do seu dia.',
  },
  {
    icon: PlayCircle,
    title: 'Educação para autonomia',
    text: 'Dicas e informativos são liberados diariamente para transformar números em conhecimento e escolhas mais conscientes.',
  },
  {
    icon: Brain,
    title: 'Consciência antes da escolha',
    text: 'A Lente da Consciência propõe uma pausa guiada para sair do automático, entender o momento e escolher com mais clareza.',
  },
  {
    icon: MessageCircle,
    title: 'Inspirações que edificam',
    text: 'Palavras diárias, reflexões e versículos fortalecem a mente, renovam a fé e lembram que bem-estar também envolve propósito e cuidado interior.',
  },
  {
    icon: Camera,
    title: 'Progresso além da balança',
    text: 'Pesagens semanais, medidas, fotos e histórico ajudam você a enxergar mudanças que um único número não consegue mostrar.',
  },
  {
    icon: Gamepad2,
    title: 'Aprender também pode ser divertido',
    text: 'Jogos sobre alimentação, movimento e mentalidade são liberados ao longo da jornada para reforçar hábitos de um jeito leve.',
  },
]

const dailyFlow = [
  ['01', 'Veja seu plano', 'Comece o dia sabendo suas metas.'],
  ['02', 'Registre sua rotina', 'Alimentação, água e movimento em poucos toques.'],
  ['03', 'Entenda o momento', 'O app mostra o balanço real e orienta a próxima escolha.'],
  ['04', 'Aprenda e evolua', 'Conteúdo, inspiração, jogos e progresso mantêm a jornada viva.'],
]

function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[320px] rounded-[2.5rem] border border-forest/10 bg-white p-3 shadow-xl shadow-forest/10">
      <div className="rounded-[2rem] bg-cream p-5">
        <p className="text-xs text-mist">Olá, Maria</p>
        <p className="mt-1 font-display text-lg text-forest-deep">
          Dia 7 de 21 <span className="text-gold">— você está indo bem.</span>
        </p>

        <div className="mt-4 rounded-2xl bg-forest p-4 text-cream">
          <p className="text-[0.65rem] uppercase tracking-widest text-gold-soft">Calorias de hoje</p>
          <p className="mt-1 font-display text-2xl">1.240 <span className="text-sm text-cream/60">de 1.800 kcal</span></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-forest-deep">
            <div className="h-full w-[69%] rounded-full bg-gold" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            ['Proteína', '82 g'],
            ['Carbo', '110 g'],
            ['Gordura', '38 g'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-white p-2.5">
              <p className="text-[0.6rem] uppercase tracking-wider text-mist">{k}</p>
              <p className="mt-0.5 text-sm font-medium text-forest">{v}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-xl bg-white p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-mist">Água</span>
            <span className="font-medium text-forest">1.500 ml de 2.500 ml</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
            <div className="h-full w-[60%] rounded-full bg-forest/70" />
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-white p-3 text-xs">
          <p className="font-medium text-forest-deep">Seu progresso</p>
          <div className="mt-2 flex justify-between text-mist">
            <span>Peso atual: <strong className="text-forest">72,4 kg</strong></span>
            <span className="text-gold">-2,8 kg</span>
          </div>
          <p className="mt-1 text-mist">Medidas: -4 cm de cintura</p>
        </div>

        <div className="mt-3 rounded-xl border border-gold/30 bg-gold/10 p-3">
          <p className="text-[0.6rem] uppercase tracking-widest text-gold">Dica do dia</p>
          <p className="mt-1 text-xs text-ink/80">Água: seu acelerador de resultados.</p>
        </div>
      </div>
    </div>
  )
}

export default function Journey() {
  return (
    <>
      {/* Como funciona */}
      <Section className="bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>Como funciona</Eyebrow>
          <Title>21 dias para aprender uma nova forma de cuidar de você.</Title>
          <GoldRule className="mx-auto my-8" />
          <p className="text-base leading-relaxed text-ink/80">
            Ao entrar no MWA, você terá acesso imediato ao aplicativo e começará sua Jornada de 21
            Dias. Todos os dias, o app ajuda você a acompanhar alimentação, hidratação, peso,
            evolução, conteúdos e metas. Você não estará sozinha — terá uma estrutura simples,
            prática e organizada para transformar conhecimento em hábitos no dia a dia.
          </p>
        </div>
        <ol className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-4 rounded-2xl bg-cream/70 p-5">
              <span className="font-display text-2xl text-gold">{String(i + 1).padStart(2, '0')}</span>
              <p className="pt-1 text-sm leading-relaxed text-ink/80">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* O app por inteiro */}
      <Section className="bg-forest-deep text-cream">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow light>O app por inteiro</Eyebrow>
          <Title light>Mais do que contar calorias: um ecossistema para cuidar do todo.</Title>
          <GoldRule className="mx-auto my-8" />
          <p className="text-base leading-relaxed text-cream/80">
            O MWA conecta o que acontece no seu prato, no seu corpo e na sua mente. Cada recurso
            ajuda você a perceber melhor a rotina, fazer escolhas com consciência e transformar
            pequenas ações em hábitos que permanecem.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {appConcepts.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-3xl border border-cream/10 bg-white/5 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/15">
                <Icon className="h-5 w-5 text-gold-soft" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-display text-lg text-cream">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-6 rounded-[2rem] border border-gold/20 bg-cream/5 p-7 md:grid-cols-2 md:p-10">
          <div>
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-6 w-6 text-gold-soft" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-cream">A jornada vira uma experiência</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/75">
              Jogo da Colheita, Jogo das Escolhas, Jogo do Treino, Restaurante Saudável,
              Jogo da Poda e Jardim de Afirmações trabalham alimentação, movimento e mentalidade
              sem transformar o cuidado em obrigação.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Sprout className="h-6 w-6 text-gold-soft" strokeWidth={1.5} />
              <h3 className="font-display text-xl text-cream">Cada cuidado gera uma conquista</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/75">
              Registrar refeições, alcançar a meta de água, fazer exercícios, ler a dica e concluir
              a pesagem rende sementes. Elas liberam itens para personalizar o avatar e tornam a
              evolução mais visível e motivadora.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-gold-soft">
            A dinâmica do seu dia no app
          </p>
          <ol className="mt-7 grid gap-4 md:grid-cols-4">
            {dailyFlow.map(([number, title, text]) => (
              <li key={number} className="rounded-2xl bg-white p-5 text-forest-deep">
                <span className="font-display text-2xl text-gold">{number}</span>
                <h3 className="mt-3 font-display text-lg text-forest">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* O aplicativo */}
      <Section className="bg-sand/50">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <Eyebrow>O aplicativo</Eyebrow>
            <Title>Um ecossistema que acompanha suas escolhas em tempo real.</Title>
            <p className="mt-6 text-base leading-relaxed text-ink/80">
              A cada refeição registrada, o app atualiza calorias e nutrientes e mostra exatamente
              quanto você já consumiu e o que ainda precisa. Você entende o que comer, quanto comer e
              como se comportar diante das escolhas do dia — com educação, motivação e{' '}
              <strong className="font-semibold text-forest">diversão para continuar</strong>.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm text-ink/80">
                  <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm italic leading-relaxed text-mist">
              Tudo em um único lugar, para que você pare de tentar fazer tudo sozinha e comece a
              seguir uma direção clara.
            </p>
            <CtaButton className="mt-8">Começar minha transformação</CtaButton>
          </div>
          <PhoneMockup />
        </div>
      </Section>
    </>
  )
}
