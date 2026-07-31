import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Repeat, TrendingDown, Sparkles, Flame, Lock, Award } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { abrirCheckout } from '../../lib/hotmart.js'
import { PRODUTOS, formatarPreco } from '../../utils/ofertas.js'
import { useConfeti } from '../../hooks/useConfeti.js'
import LogoMWA from '../ui/LogoMWA.jsx'
import CertificadoConclusao from './CertificadoConclusao.jsx'

/**
 * Tela de encerramento do programa de 90 dias — a linha de chegada.
 * Céu estrelado com chuva de estrelas e foguetes de confete ao abrir.
 * Cada conquista começa "trancada": ao tocar, revela o aprendizado por trás
 * dela — incluindo o total de calorias economizadas ao longo do déficit.
 */
export default function Conclusao90Dias({ persistente = false }) {
  const { usuario, sessao, metas, game, pesagens, fecharConclusao90 } = useApp()
  const { celebrarVitoria, celebrarFogos } = useConfeti()
  const [totalRefeicoes, setTotalRefeicoes] = useState(0)
  const [caloriasEconomizadas, setCaloriasEconomizadas] = useState(null)
  const [diasRegistrados, setDiasRegistrados] = useState(0)
  const [reveladas, setReveladas] = useState(() => new Set())
  const [certificadoAberto, setCertificadoAberto] = useState(false)
  const dialogRef = useRef(null)

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    function aoTeclar(e) {
      // se o certificado estiver aberto por cima, deixa o Esc dele agir sozinho
      if (e.key === 'Escape' && !certificadoAberto && !persistente) fecharConclusao90()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fecharConclusao90, certificadoAberto, persistente])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    const userId = sessao?.user?.id
    if (!userId) return
    let cancelado = false
    supabase
      .from('mwa_refeicoes')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .then(({ count }) => {
        if (!cancelado) setTotalRefeicoes(count ?? 0)
      })
    return () => {
      cancelado = true
    }
  }, [sessao])

  // Soma, por dia registrado, a diferença entre o gasto (TDEE) e o consumido —
  // o déficit real que a pessoa construiu ao longo da jornada.
  useEffect(() => {
    const userId = sessao?.user?.id
    if (!userId || !metas?.tdee) return
    let cancelado = false
    supabase
      .from('mwa_refeicoes')
      .select('data, calorias')
      .eq('user_id', userId)
      .then(({ data }) => {
        if (cancelado || !data) return
        const porDia = {}
        for (const r of data) {
          porDia[r.data] = (porDia[r.data] ?? 0) + Number(r.calorias)
        }
        const dias = Object.values(porDia).filter((total) => total > 0)
        const economia = dias.reduce((soma, consumido) => soma + (metas.tdee - consumido), 0)
        setCaloriasEconomizadas(Math.round(economia))
        setDiasRegistrados(dias.length)
      })
    return () => {
      cancelado = true
    }
  }, [sessao, metas?.tdee])

  useEffect(() => {
    // a11y: respeita prefers-reduced-motion — sem chuva de confete para quem pediu menos movimento
    const prefereMenosMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefereMenosMovimento) return
    setTimeout(() => celebrarVitoria(), 300)
    setTimeout(() => celebrarFogos(), 700)
  }, [celebrarVitoria, celebrarFogos])

  const primeiroNome = usuario?.nome?.trim().split(' ')[0] ?? ''
  const pesoInicial = usuario?.peso ?? null
  const pesoAtual = pesagens.length > 0 ? pesagens[pesagens.length - 1].peso : null
  const diferencaPeso = pesoInicial && pesoAtual ? Math.round((pesoInicial - pesoAtual) * 10) / 10 : null
  const totalSementes = game?.sementes ?? 0
  const kgEquivalentes = caloriasEconomizadas ? Math.round((caloriasEconomizadas / 7700) * 10) / 10 : null

  // Posições fixas (não recalculadas a cada render) para o céu estrelado - MAIS CELEBRATIVO
  const estrelas = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        top: `${(i * 19) % 100}%`,
        left: `${(i * 29) % 100}%`,
        delay: `${(i % 15) * 0.2}s`,
        tamanho: 1.5 + (i % 4),
        opacity: 0.3 + (i % 6) * 0.12,
      })),
    [],
  )
  const cadentes = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        top: `${5 + i * 10}%`,
        left: `${15 + i * 7}%`,
        delay: `${i * 0.6}s`,
      })),
    [],
  )

  const conquistas = [
    {
      icon: '🔥',
      titulo: 'Seu déficit total',
      destaque: true,
      texto:
        caloriasEconomizadas === null
          ? 'Calculando o quanto você economizou dia após dia...'
          : caloriasEconomizadas > 0
            ? `Somando cada refeição registrada nesses ${diasRegistrados} dias, você economizou ${caloriasEconomizadas.toLocaleString('pt-BR')} kcal em relação ao seu gasto — o equivalente calórico a aproximadamente ${kgEquivalentes} kg de gordura. Esse número não é sorte, é resultado de centenas de pequenas escolhas conscientes.`
            : 'Seus dados de refeições registradas ainda são poucos para calcular o déficit total com precisão — mas cada escolha consciente que você fez teve seu peso.',
    },
    { icon: '⚙️', titulo: 'Macronutrientes (Macros)', texto: 'Você aprendeu que proteína, carboidrato e gordura não são inimigos — são ferramentas para construir refeições que sustentam seu corpo e sua energia. Saber balanceá-los é o superpoder por trás de pratos que saciam de verdade.' },
    { icon: '📊', titulo: 'A Importância de Contabilizar', texto: 'Pesar, medir, registrar: não é obsessão, é aprendizado. Você descobriu que medir uma vez calibra o olho para sempre. Conhecer números reais te liberta de "achismos" e te dá poder de decisão real.' },
    { icon: '🌾', titulo: 'Fibras: O Segredo Silencioso', texto: 'Fibra não é "limpeza". É a aliada da saciedade, do controle de açúcar no sangue e da disposição. Você entendeu que um prato com fibra segura a refeição por muito mais tempo — e no seu dia.' },
    { icon: '✨', titulo: 'Densidade Nutricional: Qualidade Importa', texto: 'Você descobriu que nem todas as calorias são iguais. Um prato denso em nutrientes (vitaminas, minerais, fibras) te sustenta mais do que o mesmo número de calorias em alimentos vazios. Você não come por quantidade — come por qualidade.' },
    { icon: '🔄', titulo: 'Deficit Calórico', texto: 'Você aprendeu que emagrecer de forma sustentável não é sobre restrição extrema, é sobre manter um pequeno déficit consistente dia após dia. Esse número — a diferença entre o que você gasta e o que consome — é a física silenciosa do seu resultado.' },
    { icon: '🥗', titulo: 'Nutrição Consciente', texto: 'Você aprendeu a montar pratos equilibrados e a ler rótulos sem se deixar enganar pelo marketing — sem precisar contar cada caloria.' },
    { icon: '💧', titulo: 'Hidratação de Verdade', texto: 'A água virou parte da sua rotina, não uma lembrança de última hora. Isso sustenta energia, saciedade e disposição todos os dias.' },
    { icon: '🧠', titulo: 'Fome Física vs. Emocional', texto: 'Você aprendeu a diferenciar fome real de fome emocional — e a pausar antes de decidir, em vez de agir no automático.' },
    { icon: '⚖️', titulo: 'Regra 80/20', texto: 'Você descobriu que consistência flexível sustenta resultados muito mais do que perfeição rígida — e que cabe pizza com as amigas.' },
    { icon: '🔁', titulo: 'Retomada Sem Culpa', texto: 'Um deslize deixou de significar um dia inteiro perdido. Você aprendeu a voltar na próxima refeição, sem esperar segunda-feira.' },
    { icon: '🛌', titulo: 'Sono e Estresse', texto: 'Você entendeu que dormir bem e administrar o estresse fazem parte do resultado, tanto quanto o que está no prato.' },
  ]

  function alternarRevelada(i) {
    setReveladas((atual) => {
      const novo = new Set(atual)
      if (novo.has(i)) novo.delete(i)
      else novo.add(i)
      return novo
    })
  }

  function refazer90Dias() {
    abrirCheckout('renovacao90d')
  }

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#12190c] via-verde-escuro to-verde outline-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conclusao90-titulo"
    >
      {/* Céu estrelado */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {estrelas.map((e, i) => (
          <span
            key={i}
            className="mwa-estrela absolute rounded-full bg-white"
            style={{ top: e.top, left: e.left, width: e.tamanho, height: e.tamanho, animationDelay: e.delay }}
          />
        ))}
        {cadentes.map((c, i) => (
          <span
            key={i}
            className="mwa-estrela-cadente absolute h-px w-16 bg-gradient-to-r from-transparent via-ouro to-white"
            style={{ top: c.top, left: c.left, animationDelay: c.delay }}
          />
        ))}
      </div>

      {!persistente && (
        <button
          type="button"
          onClick={fecharConclusao90}
          className="fixed right-4 top-4 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 p-4 pb-10">
        <div className="w-full max-w-sm pt-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-3xl animate-bounce motion-reduce:animate-none">👑</span>
            <LogoMWA variante="simbolo" tema="claro" className="h-6 w-6" />
            <span className="text-3xl animate-bounce motion-reduce:animate-none" style={{ animationDelay: '0.2s' }}>👑</span>
          </div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-ouro/70">My Wellness Approach</p>
          <p id="conclusao90-titulo" className="font-serif text-6xl font-black italic text-ouro drop-shadow-lg">90 DIAS</p>
          <p className="mt-3 text-5xl">🏆✨👑</p>
          <p className="mt-5 text-xl font-black text-white">
            {primeiroNome ? `${primeiroNome},` : 'Você'}
          </p>
          <p className="text-lg font-bold text-white/95">consolidou a transformação.</p>
          <p className="mt-2 text-sm italic text-white/80">Você não é mais alguém que tenta. Você é alguém que é.</p>
        </div>

        {/* Números da jornada - PREMIUM CELEBRATIVO */}
        <div className="grid w-full max-w-sm grid-cols-3 gap-3">
          {diferencaPeso !== null && (
            <div className="group rounded-3xl border-2 border-sage/60 bg-gradient-to-br from-sage/40 to-sage/15 p-4 text-center backdrop-blur-md transition-all hover:border-sage/80 hover:shadow-lg hover:shadow-sage/30">
              <div className="mb-2 flex items-center justify-center">
                <TrendingDown size={20} className="text-sage" />
              </div>
              <p className="text-2xl font-black text-sage">{diferencaPeso > 0 ? `-${diferencaPeso}` : diferencaPeso}kg</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-sage/80">transformação</p>
              <p className="mt-2 text-lg">✨</p>
            </div>
          )}
          <div className="group rounded-3xl border-2 border-ouro/60 bg-gradient-to-br from-ouro/40 to-ouro/15 p-4 text-center backdrop-blur-md transition-all hover:border-ouro/80 hover:shadow-lg hover:shadow-ouro/30">
            <div className="mb-2 flex items-center justify-center">
              <Sparkles size={20} className="text-ouro" />
            </div>
            <p className="text-2xl font-black text-ouro">{totalSementes}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-ouro/80">sementes</p>
            <p className="mt-2 text-lg">🌟</p>
          </div>
          <div className="group rounded-3xl border-2 border-white/40 bg-gradient-to-br from-white/20 to-white/5 p-4 text-center backdrop-blur-md transition-all hover:border-white/60 hover:shadow-lg hover:shadow-white/20">
            <div className="mb-2 flex items-center justify-center">
              <span className="text-xl">🍽️</span>
            </div>
            <p className="text-2xl font-black text-white">{totalRefeicoes}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/70">refeições</p>
            <p className="mt-2 text-lg">👑</p>
          </div>
        </div>

        {/* Certificado — destaque comemorativo */}
        <button
          type="button"
          onClick={() => setCertificadoAberto(true)}
          className="flex w-full max-w-sm items-center justify-center gap-2.5 rounded-2xl border-2 border-ouro bg-gradient-to-r from-ouro/30 via-ouro/15 to-ouro/30 px-6 py-4 font-bold text-white shadow-lg shadow-ouro/25 transition-all active:scale-[0.98] hover:shadow-xl hover:shadow-ouro/40"
        >
          <Award size={22} className="text-ouro" />
          <span className="uppercase tracking-wide">Ver meu certificado</span>
          <span className="text-lg">🏅</span>
        </button>

        {/* Conquistas interativas */}
        <div className="w-full max-w-sm">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-white/60">
            Toque em cada conquista para revelar
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {conquistas.map((c, i) => {
              const aberta = reveladas.has(i)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => alternarRevelada(i)}
                  className={`rounded-2xl border p-3.5 text-left transition-all active:scale-[0.97] ${
                    c.destaque ? 'col-span-2 border-ouro/50 bg-ouro/10' : 'border-white/15 bg-white/10'
                  } backdrop-blur hover:bg-white/15`}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="text-xl leading-none">{c.icon}</span>
                    <p className="flex-1 text-xs font-semibold leading-snug text-white">{c.titulo}</p>
                    {!aberta && <Lock size={12} className="shrink-0 text-white/40" />}
                  </div>
                  {aberta ? (
                    <p className="text-xs leading-relaxed text-white/85">{c.texto}</p>
                  ) : (
                    <p className="text-[11px] italic text-white/40">Toque para revelar</p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Recomendação: excelência na repetição - SUPER PREMIUM */}
        <div className="w-full max-w-sm rounded-3xl border-2 border-ouro/60 bg-gradient-to-br from-ouro/30 via-white/15 to-ouro/20 p-8 text-center backdrop-blur-lg shadow-2xl shadow-ouro/40">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="text-3xl">✨</span>
            <span className="text-3xl">🏆</span>
            <span className="text-3xl">✨</span>
          </div>
          <p className="font-serif text-2xl italic leading-relaxed text-ouro mb-5 font-bold">
            "A excelência não é um destino. É uma repetição que você escolhe todos os dias."
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-ouro to-transparent mx-auto mb-5"></div>
          <p className="text-base leading-relaxed text-white/95 mb-4">
            <span className="font-semibold">90 repetições.</span> Você contabilizou macros. Respeitou seu déficit. Escolheu densidade nutricional. Honrou as fibras.
          </p>
          <p className="text-base font-semibold text-white/95 mb-4">
            E 90 repetições se transformaram em hábitos. Hábitos se transformaram em identidade.
          </p>
          <p className="text-sm italic text-white/85 mb-4">
            O próximo ciclo não é recomeçar — é elevar.
          </p>
          <p className="text-xs font-bold text-ouro uppercase tracking-[0.2em]">
            ✦ Hábitos mudam vidas ✦ Repetição constrói excelência ✦
          </p>
        </div>

        {/* Oferta exclusiva para um novo ciclo */}
        <div className="w-full max-w-sm space-y-3 pb-4">
          <div className="rounded-2xl border border-ouro/40 bg-white/10 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ouro">
              Condição exclusiva para participantes
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">
              Preserve todo o seu histórico e comece uma nova jornada de 90 dias com novas metas.
            </p>
            <div className="mt-3 flex items-end justify-center gap-2">
              <span className="pb-1 text-sm text-white/55 line-through">{formatarPreco(PRODUTOS.programa.preco)}</span>
              <span className="font-serif text-4xl font-black text-ouro">{formatarPreco(PRODUTOS.renovacao.preco)}</span>
            </div>
            <p className="mt-1 text-xs text-white/55">pagamento único · sem renovação automática</p>
          </div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-ouro via-ouro to-ouro/80 rounded-3xl blur opacity-75"></div>
            <button
              type="button"
              onClick={refazer90Dias}
              className="relative flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-ouro via-ouro/95 to-ouro px-6 py-5 font-black text-verde-escuro transition-all active:scale-[0.97] hover:shadow-2xl hover:shadow-ouro/50 shadow-xl shadow-ouro/40"
            >
              <Repeat size={22} />
              <span className="text-base uppercase tracking-wide">Começar um novo ciclo</span>
              <span className="text-lg">🚀</span>
            </button>
          </div>
          <p className="text-xs text-white/60 text-center">A verdade já é sua. Agora é só continuar evoluindo.</p>
          {!persistente && (
            <button
              type="button"
              onClick={fecharConclusao90}
              className="w-full rounded-2xl px-6 py-3 text-sm font-semibold text-ouro/80 hover:text-ouro hover:bg-white/10 transition-all border border-white/20 hover:border-ouro/40"
            >
              Explorar outras seções
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-white/40">
          <Flame size={12} />
          <p className="text-[11px] font-serif italic">Com admiração, Wanessa ❤️</p>
        </div>
      </div>

      {certificadoAberto && (
        <CertificadoConclusao dias={90} onFechar={() => setCertificadoAberto(false)} />
      )}
    </div>
  )
}
