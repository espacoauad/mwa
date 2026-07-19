import { useState } from 'react'
import { Plus, GlassWater, Flame, Lightbulb, ChevronRight, Newspaper, Share2, PartyPopper, Camera } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dicaDoDia } from '../../data/dicas.js'
import { dicaDoDia as dicaDoDia90 } from '../../data/dicas90.js'
import { informativoDoDia } from '../../data/informativos.js'
import { redimensionarImagem } from '../../lib/imagem.js'
import AnelMeta from './AnelMeta.jsx'
import AnelHidratacao from './AnelHidratacao.jsx'
import GraficoMacros from './GraficoMacros.jsx'
import SeuProgresso from './SeuProgresso.jsx'
import CardUpgrade from '../upgrade/CardUpgrade.jsx'
import Avatar from '../game/Avatar.jsx'
import LojaAvatar from '../game/LojaAvatar.jsx'
import ConclusaoDia from '../game/ConclusaoDia.jsx'
import Conclusao30Dias from '../game/Conclusao30Dias.jsx'
import Conclusao90Dias from '../game/Conclusao90Dias.jsx'
import LogoMWA from '../ui/LogoMWA.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

export default function Hoje({ irParaDicas }) {
  const { ingles, locale } = useIdioma()
  const {
    usuario,
    programa90Ativo,
    metas,
    diaAtual,
    totalDias,
    pesagens,
    totaisHoje,
    gastoExercicios,
    aguaMl,
    adicionarAgua,
    abrirModalRefeicao,
    game,
    registrarCompartilhamento,
    diaCompleto,
    conclusaoDiaAberta,
    abrirConclusaoDia,
    conclusao30Aberta,
    fecharConclusao30,
    conclusao90Aberta,
    atualizarFotoPerfil,
  } = useApp()
  const [lojaAberta, setLojaAberta] = useState(false)
  const [avisoCompartilhar, setAvisoCompartilhar] = useState(null)
  const [enviandoFoto, setEnviandoFoto] = useState(false)

  // Foto de perfil: mesma lógica da aba Perfil, disponível aqui também
  async function escolherFoto(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setEnviandoFoto(true)
    try {
      const dataUrl = await redimensionarImagem(arquivo)
      await atualizarFotoPerfil(dataUrl)
    } finally {
      setEnviandoFoto(false)
    }
  }

  // Compartilhar: abre o menu nativo do celular (Instagram, WhatsApp...) e premia com sementes
  async function compartilhar() {
    const texto = ingles
      ? `I’m on day ${diaAtual} of my transformation with MWA — Método Wanessa Auad! 🌿 Join me: https://metodomwa.com.br`
      : `Estou no dia ${diaAtual} da minha transformação com o MWA — Método Wanessa Auad! 🌿 Vem comigo: https://metodomwa.com.br`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'MWA — Método Wanessa Auad', text: texto })
      } else {
        await navigator.clipboard.writeText(texto)
        setAvisoCompartilhar(ingles ? 'Text copied! Paste it into your Instagram story 📲' : 'Texto copiado! Cole nos seus stories do Instagram 📲')
        setTimeout(() => setAvisoCompartilhar(null), 4000)
      }
      await registrarCompartilhamento()
    } catch {
      // Pessoa cancelou o compartilhamento — não premia
    }
  }

  const primeiroNome = usuario.nome.trim().split(' ')[0]
  const progresso = Math.round((diaAtual / totalDias) * 100)
  const dica = diaAtual <= 21 ? dicaDoDia(diaAtual) : dicaDoDia90(diaAtual)
  const informativo = informativoDoDia(diaAtual)
  const dataFormatada = new Date().toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const linhasResumo = [
    { label: ingles ? 'Calories' : 'Calorias', consumido: totaisHoje.calorias, meta: metas.calorias, unidade: 'kcal' },
    { label: ingles ? 'Protein' : 'Proteína', consumido: totaisHoje.proteina, meta: metas.proteina, unidade: 'g' },
    { label: ingles ? 'Carbohydrates' : 'Carboidratos', consumido: totaisHoje.carbos, meta: metas.carboidrato, unidade: 'g' },
    { label: ingles ? 'Fat' : 'Gordura', consumido: totaisHoje.gordura, meta: metas.gordura, unidade: 'g' },
    { label: ingles ? 'Fiber' : 'Fibras', consumido: totaisHoje.fibras, meta: metas.fibras, unidade: 'g' },
  ]

  return (
    <div>
      {/* Cabeçalho */}
      <header className="bg-verde px-6 pb-14 pt-10 text-white">
        <div className="flex items-center gap-2">
          <LogoMWA variante="simbolo" tema="claro" className="h-6 w-6" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ouro">My Wellness Approach</p>
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm capitalize text-white/60">{dataFormatada}</p>
            <h1 className="mt-1 font-serif text-2xl font-semibold italic">{ingles ? 'Hello' : 'Olá'}, {primeiroNome} 🌿</h1>
          </div>
          {/* Foto real (toque para trocar) + avatar gamificado logo abaixo (toque abre a loja) */}
          <div className="flex flex-col items-center gap-1.5">
            <label className="relative cursor-pointer">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-ouro bg-white/10">
                {usuario.fotoUrl ? (
                  <img src={usuario.fotoUrl} alt={usuario.nome} className="h-full w-full object-cover" />
                ) : (
                  <Camera size={18} className="text-white/50" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ouro text-verde-escuro">
                <Camera size={10} />
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={escolherFoto} disabled={enviandoFoto} />
            </label>

            {game && (
              <button
                type="button"
                onClick={() => setLojaAberta(true)}
                className="flex flex-col items-center gap-1"
              >
                <Avatar avatar={game.avatar} tamanho="sm" />
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-ouro">
                  {game.sementes} 🌱
                </span>
                {game.sequencia_dias > 1 && (
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-ouro/80">
                    <Flame size={9} /> {game.sequencia_dias}d
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-white/10 p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-semibold">
              {ingles ? 'Day' : 'Dia'} <span className="text-2xl text-ouro">{diaAtual}</span> {ingles ? 'of' : 'de'} {totalDias}
            </p>
            <p className="text-sm text-white/70">{progresso}% {ingles ? 'of the program' : 'do programa'}</p>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-ouro transition-all" style={{ width: `${progresso}%` }} />
          </div>
        </div>
      </header>

      <main className="-mt-8 px-5">
        {/* Banner: dia concluído */}
        {diaCompleto && (
          <button
            type="button"
            onClick={abrirConclusaoDia}
            className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-verde to-sage p-4 text-left text-white shadow-lg shadow-verde/20 transition-transform active:scale-[0.99]"
          >
            <PartyPopper size={22} className="shrink-0 text-ouro" />
            <span className="flex-1">
              <span className="block text-sm font-bold">{ingles ? `Day ${diaAtual} completed!` : `Dia ${diaAtual} concluído!`} 🎉</span>
              <span className="text-xs text-white/80">{ingles ? 'Tap to view and share your achievement' : 'Toque para ver e compartilhar sua conquista'}</span>
            </span>
            <ChevronRight size={18} className="text-white/60" />
          </button>
        )}

        {/* Painel Premium: Macronutrientes em Anéis Concêntricos */}
        <section className="rounded-2xl bg-white p-6 shadow-lg shadow-verde/10">
          <h2 className="mb-1 text-sm font-semibold text-verde/60">{ingles ? 'Your intake today' : 'Seu consumo de hoje'}</h2>
          <p className="mb-6 text-xs text-verde/40">{ingles ? 'Macronutrients at a glance — protein is the focus' : 'Macronutrientes em destaque — proteína é o foco'}</p>
          <GraficoMacros
            proteina={totaisHoje.proteina}
            carbos={totaisHoje.carbos}
            gordura={totaisHoje.gordura}
            metaProteina={metas.proteina}
            metaCarbos={metas.carboidrato}
            metaGordura={metas.gordura}
            calorias={totaisHoje.calorias}
            metaCalorias={metas.calorias}
          />
          {/* Metas complementares embaixo */}
          <div className="mt-6 border-t border-cinza pt-4">
            <AnelMeta label={ingles ? 'Fiber' : 'Fibras'} consumido={totaisHoje.fibras} meta={metas.fibras} unidade="g" />
          </div>
        </section>

        {/* Seção: Seu Progresso */}
        <SeuProgresso usuario={usuario} pesagens={pesagens} />

        {/* Resumo do dia */}
        <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
          <h2 className="text-sm font-semibold text-verde/60">{ingles ? 'Daily summary' : 'Resumo do dia'}</h2>
          <ul className="mt-2 divide-y divide-cinza">
            {linhasResumo.map((l) => (
              <li key={l.label} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium text-verde/80">{l.label}</span>
                <span className="text-verde/60">
                  <strong className="text-verde">{l.consumido.toLocaleString(locale)}</strong> /{' '}
                  {l.meta.toLocaleString(locale)} {l.unidade}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between py-2.5 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-verde/80">
                <Flame size={15} className="text-ouro" /> {ingles ? 'Exercise calories' : 'Gasto com exercícios'}
              </span>
              <strong className="text-verde">{gastoExercicios.toLocaleString(locale)} kcal</strong>
            </li>
          </ul>
        </section>

        {/* Seção de Hidratação: Anel Premium */}
        <section className="mt-6 rounded-2xl bg-white p-8 shadow-lg shadow-verde/10">
          <div className="mb-2 flex items-center gap-2">
            <GlassWater size={18} className="text-sage" />
            <h2 className="text-sm font-semibold text-verde/60">{ingles ? 'Hydration strategy' : 'Estratégia de Hidratação'}</h2>
          </div>
          <p className="mb-6 text-xs text-verde/40">
            {ingles ? 'Strategic hydration helps your body perform at its full capacity' : 'A hidratação estratégica sinaliza ao seu corpo que ele pode funcionar em plena capacidade'}
          </p>
          <AnelHidratacao consumidoMl={aguaMl} metaMl={metas.aguaMl} onClickAdicionar={adicionarAgua} />
        </section>

        {/* Informativo do dia */}
        {informativo && (
          <button
            type="button"
            onClick={irParaDicas}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-verde p-5 text-left text-white transition-transform active:scale-[0.99]"
          >
            <span className="text-2xl">{informativo.emoji}</span>
            <span className="flex-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-white/60">
                <Newspaper size={12} /> {ingles ? `Day ${diaAtual} guide` : `Informativo do dia ${diaAtual}`}
              </span>
              <span className="block font-serif text-base font-semibold italic text-ouro">
                {informativo.titulo}
              </span>
            </span>
            <ChevronRight size={18} className="text-white/40" />
          </button>
        )}

        {/* Dica do dia */}
        {dica && (
          <button
            type="button"
            onClick={irParaDicas}
            className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
          >
            <span className="text-2xl">{dica.icone}</span>
            <span className="flex-1">
              <span className="flex items-center gap-1 text-xs font-semibold text-verde/60">
                <Lightbulb size={12} /> {ingles ? `Tip for day ${diaAtual}` : `Dica do dia ${diaAtual}`}
              </span>
              <span className="block font-serif text-base font-semibold italic text-verde">{dica.titulo}</span>
            </span>
            <ChevronRight size={18} className="text-verde/40" />
          </button>
        )}

        {/* Compartilhar no Instagram: +15 🌱 por dia */}
        <button
          type="button"
          onClick={compartilhar}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sage">
            <Share2 size={20} />
          </span>
          <span className="flex-1">
            <span className="block font-serif text-base font-semibold italic text-verde">
              {ingles ? 'Share your journey' : 'Compartilhe sua jornada'}
            </span>
            <span className="text-xs text-verde/60">
              {ingles ? <>Post to your story and earn <strong className="text-verde">+15 🌱</strong> per day</> : <>Poste nos stories e ganhe <strong className="text-verde">+15 🌱</strong> por dia</>}
            </span>
          </span>
          <ChevronRight size={18} className="text-verde/40" />
        </button>
        {avisoCompartilhar && (
          <p className="mt-2 rounded-lg bg-sage-claro p-3 text-center text-sm font-semibold text-verde">
            {avisoCompartilhar}
          </p>
        )}

        {/* Oferta de upgrade conforme o cronograma (some quando o Programa de 90 Dias já está ativo) */}
        {!programa90Ativo && <CardUpgrade dia={diaAtual} />}
      </main>

      {/* Botão flutuante: adicionar refeição */}
      <button
        type="button"
        onClick={() => abrirModalRefeicao()}
        className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ouro px-5 py-3.5 font-semibold text-verde-escuro shadow-lg shadow-ouro/40 transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={20} strokeWidth={2.5} /> {ingles ? 'Add meal' : 'Adicionar refeição'}
      </button>

      {/* Loja de skins do avatar */}
      {lojaAberta && <LojaAvatar onFechar={() => setLojaAberta(false)} />}

      {/* Tela de conclusão do dia (compartilhável) */}
      {conclusaoDiaAberta && <ConclusaoDia />}

      {/* Tela de encerramento da Jornada de 30 Dias */}
      {conclusao30Aberta && <Conclusao30Dias />}

      {/* Tela de encerramento do programa (dia 90) */}
      {conclusao90Aberta && <Conclusao90Dias />}
    </div>
  )
}
