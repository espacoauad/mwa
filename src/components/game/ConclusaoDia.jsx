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

const MACROS_LABELS = [
  { chave: 'calorias', emoji: '🔥', label: 'Calorias', unidade: 'kcal' },
  { chave: 'proteina', emoji: '🥚', label: 'Proteína', unidade: 'g' },
  { chave: 'carbos', emoji: '🌾', label: 'Carbos', unidade: 'g' },
  { chave: 'gordura', emoji: '🥑', label: 'Gordura', unidade: 'g' },
]

export default function ConclusaoDia() {
  const { usuario, diaAtual, game, tarefasHoje, totaisHoje, semanaEstrelas, fecharConclusaoDia, registrarCompartilhamento } = useApp()
  const [compartilhando, setCompartilhando] = useState(false)
  const [aviso, setAviso] = useState(null)
  const cardRef = useRef(null)
  const dialogRef = useRef(null)

  // Contar estrelas acesas na semana
  const estrelasDiaHoje = semanaEstrelas?.find((d) => d.hoje)?.acesa ? 1 : 0
  const totalEstrelasSemanais = semanaEstrelas?.filter((d) => d.acesa)?.length ?? 0

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

        // Mensagem com link de compra (compatível com WhatsApp, email, etc)
        const linkCompra = 'https://metodomwa.com.br'
        const textoCompartilhamento = `Estou no dia ${diaAtual} da minha transformação com o MWA — Método Wanessa Auad! 🌿\n\nMacros de hoje:\n🔥 ${totaisHoje.calorias} kcal | 🥚 ${totaisHoje.proteina}g proteína | 🌾 ${totaisHoje.carbos}g carbos\n\n✨ Sementes conquistadas: +${tarefasHoje.sementesHoje} 🌱\n\nVem comigo: ${linkCompra}`

        if (navigator.canShare?.({ files: [arquivo] })) {
          try {
            await navigator.share({
              files: [arquivo],
              title: 'MWA — Método Wanessa Auad',
              text: textoCompartilhamento,
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

      {/* Cartão compartilhável - REDESIGN */}
      <div
        ref={(el) => {
          cardRef.current = el
          dialogRef.current = el
        }}
        tabIndex={-1}
        className="relative w-full max-w-sm shrink-0 overflow-hidden rounded-[2.5rem] px-6 pb-8 pt-6 text-center outline-none"
        style={{ background: 'linear-gradient(135deg, #5a8a50 0%, #6d9a5f 40%, #7db567 100%)' }}
      >
        {/* Decoração premium */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-12 h-60 w-60 rounded-full bg-ouro/15 blur-3xl" />

        {/* Header com logo */}
        <div className="relative flex items-center justify-center gap-2">
          <LogoMWA variante="simbolo" tema="claro" className="h-5 w-5" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">Método Wanessa Auad</p>
        </div>

        {/* Dia concluído - destaque grande */}
        <p id="conclusao-dia-titulo" className="relative mt-3 font-serif text-3xl font-bold italic text-white">
          Dia {diaAtual}
        </p>
        <p className="relative text-sm text-ouro font-semibold">Concluído com sucesso! 🎉</p>

        {/* Foto do usuário - GRANDE E DESTACADA */}
        {game && (
          <div className="relative mt-6 flex justify-center">
            {usuario?.fotoUrl ? (
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-ouro/80 shadow-lg">
                  <img src={usuario.fotoUrl} alt={usuario.nome} className="h-full w-full object-cover" />
                </div>
                {/* Avatar do jogo como selo */}
                <div className="absolute -bottom-2 -right-2 rounded-full bg-ouro p-1 ring-3 ring-white/30 shadow-md">
                  <Avatar avatar={game.avatar} tamanho="md" />
                </div>
              </div>
            ) : (
              <div className="rounded-full bg-white/15 p-2 ring-4 ring-ouro/60 shadow-lg">
                <Avatar avatar={game.avatar} tamanho="lg" />
              </div>
            )}
          </div>
        )}

        {/* Mensagem personalizada */}
        <p className="relative mt-5 text-base font-semibold text-white">
          {primeiroNome ? `Parabéns, ${primeiroNome}!` : 'Parabéns!'}
        </p>
        <p className="relative mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/85">{mensagem}</p>

        {/* Tarefas Completadas - DESTAQUE PRINCIPAL */}
        <div className="relative mt-5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Tarefas Completadas</p>
          <div className="grid grid-cols-4 gap-2.5">
            {TAREFAS.map((t) => (
              <div
                key={t.chave}
                className={`rounded-xl p-4 transition-all text-center border ${
                  tarefasHoje[t.chave]
                    ? 'bg-white/20 border-white/40'
                    : 'bg-white/10 border-white/20 opacity-50'
                }`}
              >
                <p className={`text-2xl mb-1 ${!tarefasHoje[t.chave] ? 'opacity-60' : ''}`}>{t.emoji}</p>
                <p className={`text-[9px] font-bold leading-tight text-white ${!tarefasHoje[t.chave] ? 'opacity-70' : ''}`}>{t.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Estrelas da Semana - BRANDO */}
        {semanaEstrelas && semanaEstrelas.length > 0 && (
          <div className="relative mt-5 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-white/70">Estrelas</p>
              <p className="text-[9px] text-white/60">{totalEstrelasSemanais} de {semanaEstrelas.length}</p>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {semanaEstrelas.map((dia, idx) => (
                <p key={idx} className={`text-lg ${dia.acesa ? 'text-white' : 'text-white/25'}`}>⭐</p>
              ))}
            </div>
          </div>
        )}

        {/* Sequência com destaque */}
        {sequencia > 1 && (
          <div className="relative mt-3 inline-flex items-center gap-2 rounded-full bg-ouro px-5 py-2 text-sm font-bold text-verde shadow-md">
            <Flame size={16} /> {sequencia} dias seguidos
          </div>
        )}

        {/* Macros - CARDS CLAROS E LIMPOS */}
        <div className="relative mt-5 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">Nutrição do Dia</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Calorias */}
            <div className="rounded-xl bg-white/25 px-4 py-4 backdrop-blur-sm border border-white/30">
              <p className="text-3xl text-center">🔥</p>
              <p className="mt-2 text-center text-sm font-bold text-white">{totaisHoje.calorias}</p>
              <p className="text-center text-[10px] text-white/80">Calorias</p>
            </div>

            {/* Proteína */}
            <div className="rounded-xl bg-white/25 px-4 py-4 backdrop-blur-sm border border-white/30">
              <p className="text-3xl text-center">🥚</p>
              <p className="mt-2 text-center text-sm font-bold text-white">{totaisHoje.proteina}</p>
              <p className="text-center text-[10px] text-white/80">Proteína (g)</p>
            </div>

            {/* Carboidrato */}
            <div className="rounded-xl bg-white/25 px-4 py-4 backdrop-blur-sm border border-white/30">
              <p className="text-3xl text-center">🌾</p>
              <p className="mt-2 text-center text-sm font-bold text-white">{totaisHoje.carbos}</p>
              <p className="text-center text-[10px] text-white/80">Carboidrato (g)</p>
            </div>

            {/* Gordura */}
            <div className="rounded-xl bg-white/25 px-4 py-4 backdrop-blur-sm border border-white/30">
              <p className="text-3xl text-center">🥑</p>
              <p className="mt-2 text-center text-sm font-bold text-white">{totaisHoje.gordura}</p>
              <p className="text-center text-[10px] text-white/80">Gordura (g)</p>
            </div>
          </div>
        </div>

        {/* Sementes - PEQUENO, EMBAIXO */}
        <div className="relative mt-4 rounded-lg bg-white/12 px-3 py-2 border border-white/20 text-center" role="status" aria-live="polite">
          <p className="text-2xl font-bold text-ouro leading-none">+{tarefasHoje.sementesHoje}</p>
          <p className="text-[9px] font-bold uppercase tracking-wide text-white/75 mt-0.5">🌱 Sementes</p>
        </div>

        {/* Footer motivacional */}
        <p className="relative mx-auto mt-4 max-w-xs font-serif text-[11px] italic leading-relaxed text-white/60">
          Transforme hábitos, cultive resultados! ✨
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
