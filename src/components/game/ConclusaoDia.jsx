import { useEffect, useRef, useState } from 'react'
import { X, Share2, Download, Flame } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Avatar from './Avatar.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'

const MENSAGENS = [
  'Você está evoluindo. Continue assim! 🌱',
  'Cada escolha de hoje te aproxima da sua melhor versão.',
  'Consistência é o que transforma — e você foi consistente hoje.',
  'Um dia de cada vez, e você está arrasando.',
  'Seu "eu" do futuro agradece o que você fez hoje.',
  'Pequenos passos, grandes resultados. Continue!',
  'Transforme hábitos, cultive resultados!',
]

const TAREFAS = [
  { chave: 'refeicao', emoji: '🍽️', label: 'Refeição' },
  { chave: 'agua', emoji: '💧', label: 'Água' },
  { chave: 'dica', emoji: '💡', label: 'Dica do dia' },
  { chave: 'exercicio', emoji: '💪', label: 'Exercício' },
]

export default function ConclusaoDia() {
  const { usuario, diaAtual, game, tarefasHoje, fecharConclusaoDia, registrarCompartilhamento } = useApp()
  const [compartilhando, setCompartilhando] = useState(false)
  const [aviso, setAviso] = useState(null)
  const cardRef = useRef(null)
  const dialogRef = useRef(null)

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') fecharConclusaoDia()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fecharConclusaoDia])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const primeiroNome = usuario?.nome?.trim().split(' ')[0] ?? ''
  const mensagem = MENSAGENS[diaAtual % MENSAGENS.length]
  const sequencia = game?.sequencia_dias ?? 1

  async function compartilhar() {
    setCompartilhando(true)
    setAviso(null)
    try {
      // Garante que a fonte (Lora) já carregou antes de capturar — evita corte de texto na imagem
      await document.fonts?.ready
      const html2canvas = (await import('html2canvas-pro')).default
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 })

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setCompartilhando(false)
          return
        }
        const arquivo = new File([blob], `mwa-dia-${diaAtual}.png`, { type: 'image/png' })

        if (navigator.canShare?.({ files: [arquivo] })) {
          try {
            await navigator.share({
              files: [arquivo],
              title: 'MWA — Método Wanessa Auad',
              text: `Concluí o dia ${diaAtual} do meu MWA! 🌿`,
            })
            await registrarCompartilhamento()
          } catch {
            // pessoa cancelou o compartilhamento
          }
        } else {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `mwa-dia-${diaAtual}.png`
          link.click()
          URL.revokeObjectURL(url)
          setAviso('Imagem salva! Poste nos seus stories 📲')
          await registrarCompartilhamento()
          setTimeout(() => setAviso(null), 3500)
        }
        setCompartilhando(false)
      }, 'image/png')
    } catch {
      setCompartilhando(false)
      setAviso('Não foi possível gerar a imagem agora. Tente de novo.')
      setTimeout(() => setAviso(null), 3000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-verde-escuro/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="conclusao-dia-titulo"
    >
      <button
        type="button"
        onClick={fecharConclusaoDia}
        aria-label="Fechar"
        className="absolute right-4 top-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <X size={20} />
      </button>

      {/* Cartão compartilhável */}
      <div
        ref={(el) => {
          cardRef.current = el
          dialogRef.current = el
        }}
        tabIndex={-1}
        className="relative w-full max-w-sm shrink-0 overflow-hidden rounded-[2rem] px-8 pb-10 pt-8 text-center outline-none"
        style={{ background: 'linear-gradient(160deg, #344528 0%, #4A5F3A 45%, #879B55 100%)' }}
      >
        {/* Decoração */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -right-10 h-48 w-48 rounded-full bg-ouro/20 blur-2xl" />

        <div className="relative flex items-center justify-center gap-1.5">
          <LogoMWA variante="simbolo" tema="claro" className="h-4 w-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">My Wellness Approach</p>
        </div>

        <p id="conclusao-dia-titulo" className="relative mt-4 font-serif text-2xl font-bold italic text-ouro">
          Dia {diaAtual} concluído! 🎉
        </p>

        {game && (
          <div className="relative mt-5 flex justify-center">
            {usuario?.fotoUrl ? (
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-ouro/60">
                  <img src={usuario.fotoUrl} alt={usuario.nome} className="h-full w-full object-cover" />
                </div>
                {/* Avatar do jogo como selo, sobre a foto real */}
                <div className="absolute -bottom-1 -right-1 rounded-full bg-verde-escuro p-0.5 ring-2 ring-white/30">
                  <Avatar avatar={game.avatar} tamanho="sm" />
                </div>
              </div>
            ) : (
              <div className="rounded-full bg-white/10 p-1.5 ring-4 ring-ouro/40">
                <Avatar avatar={game.avatar} tamanho="lg" />
              </div>
            )}
          </div>
        )}

        <p className="relative mt-4 text-lg font-semibold text-white">
          {primeiroNome ? `Parabéns, ${primeiroNome}!` : 'Parabéns!'}
        </p>
        <p className="relative mx-auto mt-1 max-w-[240px] text-sm leading-relaxed text-white/80">{mensagem}</p>

        {/* Sementes ganhas hoje */}
        <div className="relative mt-6 rounded-2xl bg-white/10 p-4" role="status" aria-live="polite">
          <p className="text-3xl font-bold text-ouro">+{tarefasHoje.sementesHoje} 🌱</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-white/60">
            sementes conquistadas hoje
          </p>
        </div>

        {/* Sequência */}
        {sequencia > 1 && (
          <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-ouro px-4 py-1.5 text-sm font-bold text-verde-escuro">
            <Flame size={15} /> {sequencia} dias seguidos
          </div>
        )}

        {/* Checklist do dia */}
        <div className="relative mt-6 grid grid-cols-4 gap-2">
          {TAREFAS.map((t) => (
            <div
              key={t.chave}
              className={`rounded-xl p-2.5 ${tarefasHoje[t.chave] ? 'bg-white/20' : 'bg-white/5 opacity-40'}`}
            >
              <p className="text-lg">{t.emoji}</p>
              <p className="mt-0.5 text-[9px] font-semibold leading-tight text-white">{t.label}</p>
            </div>
          ))}
        </div>

        <p className="relative mx-auto mt-6 max-w-[220px] font-serif text-sm italic leading-snug text-white/60">
          Mais do que um método, um estilo de vida que transforma.
        </p>
      </div>

      {/* Ações (fora do cartão — não entram na imagem) */}
      <div className="flex w-full max-w-sm shrink-0 flex-col gap-2.5">
        {aviso && (
          <p role="status" aria-live="polite" className="rounded-lg bg-white/90 p-3 text-center text-sm font-semibold text-verde">{aviso}</p>
        )}
        <button
          type="button"
          onClick={compartilhar}
          disabled={compartilhando}
          className="flex items-center justify-center gap-2 rounded-xl bg-ouro px-6 py-4 font-bold text-verde-escuro transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {compartilhando ? (
            'Gerando imagem...'
          ) : (
            <>
              <Share2 size={18} /> Compartilhar minha conquista
            </>
          )}
        </button>
        <button
          type="button"
          onClick={fecharConclusaoDia}
          className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15"
        >
          Continuar no app
        </button>
      </div>
    </div>
  )
}
