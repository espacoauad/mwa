import { useEffect, useMemo, useState } from 'react'
import { X, Repeat, TrendingDown, Sparkles, Lock, Flame } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { abrirCheckout } from '../../lib/hotmart.js'
import { useConfeti } from '../../hooks/useConfeti.js'
import LogoMWA from '../ui/LogoMWA.jsx'

/**
 * Tela de encerramento dos 21 dias — a primeira linha de chegada.
 * Céu estrelado com chuva de estrelas e foguetes de confete ao abrir.
 * Cada conquista começa "trancada": ao tocar, revela o aprendizado.
 * CTA principal: upgrade para 90 dias de continuidade.
 */
export default function Conclusao21Dias() {
  const { usuario, sessao, game, pesagens, fecharConclusao21 } = useApp()
  const { celebrarVitoria, celebrarFogos } = useConfeti()
  const [totalRefeicoes, setTotalRefeicoes] = useState(0)
  const [reveladas, setReveladas] = useState(() => new Set())

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

  useEffect(() => {
    setTimeout(() => celebrarVitoria(), 300)
    setTimeout(() => celebrarFogos(), 700)
  }, [celebrarVitoria, celebrarFogos])

  const primeiroNome = usuario?.nome?.trim().split(' ')[0] ?? ''
  const pesoInicial = usuario?.peso ?? null
  const pesoAtual = pesagens.length > 0 ? pesagens[pesagens.length - 1].peso : null
  const diferencaPeso = pesoInicial && pesoAtual ? Math.round((pesoInicial - pesoAtual) * 10) / 10 : null
  const totalSementes = game?.sementes ?? 0

  // Posições fixas para o céu estrelado - MAIS DENSO E CELEBRATIVO
  const estrelas = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        top: `${(i * 19) % 100}%`,
        left: `${(i * 29) % 100}%`,
        delay: `${(i % 15) * 0.2}s`,
        tamanho: 1.5 + (i % 4),
        opacity: 0.4 + (i % 6) * 0.1,
      })),
    [],
  )
  const cadentes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        top: `${5 + i * 12}%`,
        left: `${20 + i * 8}%`,
        delay: `${i * 0.8}s`,
      })),
    [],
  )

  const conquistas = [
    {
      icon: '🎯',
      titulo: 'Você Quebrou a Inércia',
      destaque: true,
      texto:
        'Os primeiros 21 dias são sempre os mais difíceis — porque o corpo e a mente ainda falam mais alto que a decisão. Você não só chegou até aqui, como mudou padrões que eram automáticos. Isso é a base de tudo que vem depois.',
    },
    {
      icon: '🥗',
      titulo: 'Aprendeu a Montar um Prato',
      texto: 'Proteína, vegetais, carboidrato, gordura boa — não é complicado quando você sabe. Você entendeu a estrutura, e essa estrutura te sustenta em qualquer lugar.',
    },
    {
      icon: '⚙️',
      titulo: 'Macronutrientes: O Que São e Por Quê',
      texto: 'Você parou de pensar em comida como "calorias" e começou a entender como ferramentas. Proteína constrói, carboidrato energiza, gordura sustenta — cada um com seu papel. Contabilizar macros não é obsessão, é se conhecer. Isso muda tudo.',
    },
    {
      icon: '🎯',
      titulo: 'Déficit Calórico: A Matemática da Transformação',
      texto: 'Gastar mais do que come. Simples assim. Você entendeu que perder peso não é mágica — é um saldo consistente. Sem culpa, sem extremos. Déficit sustentável é o que te trouxe até aqui.',
    },
    {
      icon: '💧',
      titulo: 'Hidratação Entrou na Rotina',
      texto: 'Água não é extra, é base. Você descobriu que metade do "cansaço" era só desidratação. Simples assim.',
    },
    {
      icon: '📊',
      titulo: 'A Importância de Medir',
      texto: 'Você pesou algo uma vez, viu o número real, e isso calibrou para sempre seu "olho nutricional". Medir não é obsessão — é aprendizado que te liberta da incerteza.',
    },
    {
      icon: '🌾',
      titulo: 'Fibra Como Ferramenta',
      texto: 'Não é limpeza nem castigo. Fibra é o que faz a refeição te sustentar por horas. Você entendeu que um prato com vegetais te segura diferente.',
    },
    {
      icon: '✨',
      titulo: 'Densidade Nutricional',
      texto: 'Você aprendeu que nem todas as calorias são iguais. Um prato denso em nutrientes (vitaminas, minerais, fibras) te sustenta mais do que o mesmo número de calorias em alimentos vazios. Qualidade importa.',
    },
    {
      icon: '🧠',
      titulo: 'Consciência Antes do Garfo',
      texto: 'Aquela pausa que você começou a fazer — respirar, observar a fome, depois comer — é tudo. Consciência é o superpoder que ninguém vê, mas que muda tudo.',
    },
    {
      icon: '🎊',
      titulo: 'Você Merecia Isso',
      texto: 'Não é sobre ser perfeito nos 21 dias. É sobre decidir que você merecia cuidado — e manter essa decisão dia após dia, refeição após refeição.',
    },
  ]

  function alternarRevelada(i) {
    setReveladas((atual) => {
      const novo = new Set(atual)
      if (novo.has(i)) novo.delete(i)
      else novo.add(i)
      return novo
    })
  }

  function continuarPor90Dias() {
    abrirCheckout('programa90d')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#faf6f0] via-[#f5ede0] to-[#f0e5d3]">
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

      <button
        type="button"
        onClick={fecharConclusao21}
        className="fixed right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-verde-escuro hover:bg-white/20"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      <div className="relative z-10 flex flex-col items-center gap-6 p-4 pb-10">
        <div className="w-full max-w-sm pt-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">✨</span>
            <LogoMWA variante="simbolo" tema="claro" className="h-6 w-6" />
            <span className="text-2xl">✨</span>
          </div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-verde-escuro/70">My Wellness Approach</p>
          <p className="font-serif text-6xl font-bold italic text-ouro drop-shadow-lg">21 DIAS</p>
          <p className="mt-2 text-4xl">🎉🎊✨</p>
          <p className="mt-4 text-lg font-bold text-verde-escuro">
            {primeiroNome ? `${primeiroNome},` : 'Você'}
          </p>
          <p className="text-base font-semibold text-verde-escuro/90">você chegou até aqui.</p>
          <p className="mt-2 text-sm italic text-verde-escuro/75">E isso é tudo o que importa.</p>
        </div>

        {/* Números da jornada - PREMIUM CELEBRATIVO */}
        <div className="grid w-full max-w-sm grid-cols-3 gap-3">
          {diferencaPeso !== null && (
            <div className="group rounded-3xl border-2 border-sage/60 bg-gradient-to-br from-sage/30 to-sage/10 p-4 text-center backdrop-blur-md transition-all hover:border-sage hover:shadow-lg hover:shadow-sage/20">
              <div className="mb-2 flex items-center justify-center gap-1">
                <TrendingDown size={18} className="text-sage" />
              </div>
              <p className="text-2xl font-black text-sage">{diferencaPeso > 0 ? `-${diferencaPeso}` : diferencaPeso}kg</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-sage/70">transformação</p>
              <p className="mt-2 text-xs text-sage/50">⭐</p>
            </div>
          )}
          <div className="group rounded-3xl border-2 border-ouro/60 bg-gradient-to-br from-ouro/30 to-ouro/10 p-4 text-center backdrop-blur-md transition-all hover:border-ouro hover:shadow-lg hover:shadow-ouro/20">
            <div className="mb-2 flex items-center justify-center gap-1">
              <Sparkles size={18} className="text-ouro" />
            </div>
            <p className="text-2xl font-black text-ouro">{totalSementes}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-ouro/70">sementes</p>
            <p className="mt-2 text-xs text-ouro/50">✨</p>
          </div>
          <div className="group rounded-3xl border-2 border-verde-escuro/40 bg-gradient-to-br from-verde-escuro/20 to-verde-escuro/5 p-4 text-center backdrop-blur-md transition-all hover:border-verde-escuro/60 hover:shadow-lg hover:shadow-verde-escuro/20">
            <div className="mb-2 flex items-center justify-center">
              <span className="text-xl">🍽️</span>
            </div>
            <p className="text-2xl font-black text-verde-escuro">{totalRefeicoes}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-verde-escuro/60">refeições</p>
            <p className="mt-2 text-xs text-verde-escuro/40">🏆</p>
          </div>
        </div>

        {/* Botão "Ver meus aprendizados" - logo após os resultados */}
        <button
          type="button"
          onClick={fecharConclusao21}
          className="w-full rounded-2xl px-6 py-2.5 text-sm font-medium text-verde-escuro/70 hover:bg-white/10 hover:text-verde-escuro"
        >
          Ver meus aprendizados
        </button>

        {/* Conquistas interativas */}
        <div className="w-full max-w-sm">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-verde-escuro/70">
            Toque em cada aprendizado para revelar
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
                    <p className="flex-1 text-xs font-semibold leading-snug text-verde-escuro">{c.titulo}</p>
                    {!aberta && <Lock size={12} className="shrink-0 text-verde-escuro/50" />}
                  </div>
                  {aberta ? (
                    <p className="text-xs leading-relaxed text-verde-escuro/85">{c.texto}</p>
                  ) : (
                    <p className="text-[11px] italic text-verde-escuro/60">Toque para revelar</p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Transição para 90 dias - SUPER PREMIUM */}
        <div className="w-full max-w-sm rounded-3xl border-2 border-ouro/50 bg-gradient-to-br from-ouro/25 via-white/15 to-ouro/10 p-7 text-center backdrop-blur-lg shadow-2xl shadow-ouro/20">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-2xl">✨</span>
            <span className="text-2xl">💎</span>
            <span className="text-2xl">✨</span>
          </div>
          <p className="font-serif text-xl italic leading-relaxed text-verde-escuro mb-4 font-semibold">
            "Esses 21 dias foram uma confissão que você merecia cuidado. E agora, essa confissão é sua certeza."
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-transparent via-ouro to-transparent mx-auto mb-4"></div>
          <p className="text-sm leading-relaxed text-verde-escuro/90">
            Você carrega consigo um conhecimento que é só seu — aquele que a ensina a alimentar seu corpo com respeito, a escutar seus próprios sinais, a reconhecer que merecia estar aqui. Isso não vai embora. Os próximos 69 dias vão aprofundar quem você está se tornando.
          </p>
          <p className="mt-3 text-sm font-semibold text-verde-escuro italic">
            Uma mulher que confia em si mesma.
          </p>
          <p className="mt-4 text-xs font-bold text-ouro uppercase tracking-[0.2em]">
            ✦ Você merece essa continuidade ✦
          </p>
        </div>

        {/* CTA - Upgrade em GRANDE destaque */}
        <div className="w-full max-w-sm pb-4 space-y-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-ouro via-ouro to-ouro/80 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <button
              type="button"
              onClick={continuarPor90Dias}
              className="relative flex w-full items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-ouro via-ouro/95 to-ouro px-6 py-5 font-black text-verde-escuro transition-all active:scale-[0.97] hover:shadow-2xl hover:shadow-ouro/40 shadow-xl shadow-ouro/30"
            >
              <Repeat size={22} />
              <span className="text-base uppercase tracking-wide">Upgrade para 90 dias</span>
              <span className="text-lg">👑</span>
            </button>
          </div>
          <p className="text-xs text-verde-escuro/60 text-center">A excelência está na repetição</p>
        </div>

        <div className="flex items-center gap-1.5 text-verde-escuro/60">
          <Flame size={12} />
          <p className="text-[11px] font-serif italic">Com admiração, Wanessa ❤️</p>
        </div>
      </div>
    </div>
  )
}
