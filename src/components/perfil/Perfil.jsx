import { useState, lazy, Suspense } from 'react'
import { RotateCcw, Mail, Phone, AtSign, Globe, FlaskConical, BadgeCheck, LogOut, Camera, Star, Share2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { NIVEIS_ATIVIDADE, OBJETIVOS } from '../../utils/calculos.js'
import { PRODUTOS, CONTATO, formatarPreco, linkSessao } from '../../utils/ofertas.js'
import { NUTRICIONISTA, AVISO_CRN } from '../../data/legal.js'
import { calcularEstrelas } from '../../utils/hallDaFama.js'
import { redimensionarImagem } from '../../lib/imagem.js'
import DireitosLgpd from './DireitosLgpd.jsx'
import BotaoPagamento from '../upgrade/BotaoPagamento.jsx'
import Avatar from '../game/Avatar.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import CarregandoFallback from '../ui/CarregandoFallback.jsx'

const MinhaEvolucao = lazy(() => import('./MinhaEvolucao.jsx'))

const ATIVIDADE_EN = { sedentario: 'Sedentary', leve: 'Lightly active', moderado: 'Moderately active', intenso: 'Very active', atleta: 'Extremely active' }
const OBJETIVO_EN = { emagrecer: 'Lose weight', manter: 'Maintain weight', ganhar: 'Build muscle' }
const MEDIDAS_EN = { cintura: 'Waist', quadril: 'Hips', peito: 'Chest', braco: 'Arm', coxa: 'Thigh' }

export default function Perfil() {
  const { ingles, idioma, locale } = useIdioma()
  const {
    usuario,
    metas,
    diaAtual,
    totalDias,
    pesagens,
    game,
    reiniciar,
    sair,
    simuladorDia,
    setSimuladorDia,
    atualizarFotoPerfil,
    registrarIndicacao,
    atualizarIdioma,
  } = useApp()
  const diasDoPrograma = Array.from({ length: totalDias }, (_, i) => i + 1)
  const nivel = NIVEIS_ATIVIDADE.find((n) => n.id === usuario.nivelAtividade)
  const objetivo = OBJETIVOS.find((o) => o.id === usuario.objetivo)
  const medidas = Object.entries(usuario.medidas ?? {}).filter(([, v]) => v)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [avisoIndicacao, setAvisoIndicacao] = useState(null)
  const [evolucaoAberta, setEvolucaoAberta] = useState(false)

  const estrelas = calcularEstrelas(usuario, pesagens)

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

  async function indicarAmiga() {
    const texto = ingles
      ? `Hi! I’m doing MWA — Método Wanessa Auad, a 30-day program with an app, daily nutrition tips, and complete follow-up. I thought you might like it! 🌿\n\nTake a look: https://${CONTATO.site}`
      : `Oi! Estou fazendo o MWA — Método Wanessa Auad, um programa de 30 dias com app, dicas diárias da nutricionista e acompanhamento completo. Achei que você ia gostar! 🌿\n\nDá uma olhada: https://${CONTATO.site}`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    const ganho = await registrarIndicacao()
    setAvisoIndicacao(
      ganho > 0
        ? (ingles ? `+${ganho} 🌱 for referring a friend!` : `+${ganho} 🌱 por indicar uma amiga!`)
        : (ingles ? 'You already earned referral seeds today. Come back tomorrow! 🌱' : 'Você já ganhou sementes por indicação hoje. Volte amanhã! 🌱'),
    )
    setTimeout(() => setAvisoIndicacao(null), 3500)
  }

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Your profile' : 'Seu perfil'}</h1>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm shadow-verde/5">
        <p className="text-sm font-semibold text-verde">{ingles ? 'App language' : 'Idioma do aplicativo'}</p>
        <div className="mt-2 grid grid-cols-2 rounded-lg bg-cinza p-1">
          {[['pt-BR', 'Português'], ['en-US', 'English']].map(([valor, label]) => (
            <button key={valor} type="button" onClick={() => atualizarIdioma(valor)} aria-pressed={idioma === valor}
              className={`min-h-11 rounded-md py-2.5 text-sm font-semibold ${idioma === valor ? 'bg-verde text-white shadow-sm' : 'text-verde/60'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-verde p-5 text-white">
        <div className="flex items-center gap-4">
          {/* Foto real da pessoa (toque para trocar) */}
          <label
            className="relative shrink-0 cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-sage focus-within:ring-offset-2"
            aria-label={ingles ? 'Change profile photo' : 'Alterar foto de perfil'}
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-ouro bg-white/10">
              {usuario.fotoUrl ? (
                <img src={usuario.fotoUrl} alt={usuario.nome} className="h-full w-full object-cover" />
              ) : (
                <Camera size={22} className="text-white/50" />
              )}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ouro text-verde-escuro">
              <Camera size={12} />
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={escolherFoto} disabled={enviandoFoto} />
          </label>

          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl font-semibold italic">{usuario.nome}</p>
            <p className="mt-1 flex items-center gap-2 truncate text-sm text-white/70">
              <Mail size={14} className="shrink-0" /> <span className="truncate">{usuario.email}</span>
            </p>
          </div>
        </div>

        {/* Avatar gamificado, logo abaixo da foto real */}
        {game && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <Avatar avatar={game.avatar} tamanho="sm" />
            <div>
              <p className="text-xs font-semibold text-white/70">{ingles ? 'Your MWA avatar' : 'Seu avatar no MWA'}</p>
              <p className="text-sm font-bold text-ouro">{game.sementes} 🌱 {ingles ? 'seeds' : 'sementes'}</p>
            </div>
          </div>
        )}

        <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
          <Phone size={14} /> {usuario.whatsapp}
        </p>
        <p className="mt-3 inline-block rounded-full bg-ouro px-3 py-1 text-xs font-bold text-verde-escuro">
          {ingles ? 'Day' : 'Dia'} {diaAtual} {ingles ? 'of' : 'de'} {totalDias} · {objetivo?.emoji} {ingles ? OBJETIVO_EN[objetivo?.id] : objetivo?.label}
        </p>
      </div>

      {/* Hall da Fama — acumula em qualquer número de ciclos de 90 dias, não só nos 30 dias iniciais */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde/60">
            <Star size={15} className="text-ouro" /> {ingles ? 'Hall of Fame' : 'Hall da Fama'}
          </h2>
          <p className="flex items-center gap-1 text-sm font-bold text-verde">
            <Star size={14} className="fill-ouro text-ouro" /> {estrelas.filter((e) => e.estrela).length}
          </p>
        </div>
        <p className="mt-1 text-xs text-verde/80">
          {ingles ? 'Earn a star for every weekly weigh-in with a positive result — through the end of your program.' : 'Ganhe uma estrela a cada pesagem semanal com resultado positivo — até o fim do seu programa.'}
        </p>
        {estrelas.length === 0 ? (
          <p className="mt-3 rounded-xl bg-creme p-3 text-center text-xs text-verde/80">
            {ingles ? 'Log your first weekly weigh-in to start earning stars.' : 'Registre sua primeira pesagem semanal para começar a conquistar estrelas.'}
          </p>
        ) : (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
            {estrelas.map((c) => (
              <div
                key={c.id}
                className={`w-16 shrink-0 rounded-xl p-3 text-center ${c.estrela ? 'bg-ouro-claro' : 'bg-creme'}`}
              >
                <Star size={20} className={`mx-auto ${c.estrela ? 'fill-ouro text-ouro' : 'text-verde/20'}`} />
                <p className="mt-1 text-[11px] font-bold text-verde">{c.dia ? `${ingles ? 'Day' : 'Dia'} ${c.dia}` : '—'}</p>
                <p className="text-[9px] text-verde/80">{c.estrela ? (ingles ? 'Earned!' : 'Conquistada!') : (ingles ? 'No result' : 'Sem resultado')}</p>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setEvolucaoAberta(true)}
          className="mt-4 flex w-full items-center justify-between rounded-2xl bg-white p-5 text-left shadow-sm shadow-verde/5"
        >
          <div>
            <p className="font-semibold text-verde">Minha Evolução</p>
            <p className="mt-0.5 text-xs text-verde/60">Peso, medidas e sua linha do tempo</p>
          </div>
          <span className="text-2xl">📈</span>
        </button>
      </div>

      {/* Indicar uma amiga */}
      <div className="mt-4 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde">
          <Share2 size={15} /> {ingles ? 'Refer a friend' : 'Indique uma amiga'}
        </h2>
        <p className="mt-1 text-xs text-verde/70">
          {ingles ? 'Share MWA through WhatsApp and earn seeds for each referral, up to 3 per day.' : 'Envie o MWA pelo WhatsApp e ganhe sementes a cada indicação (até 3 por dia).'}
        </p>
        <button
          type="button"
          onClick={indicarAmiga}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-verde py-3 text-sm font-bold text-white transition-transform active:scale-[0.98]"
        >
          <Share2 size={16} /> {ingles ? 'Refer through WhatsApp' : 'Indicar pelo WhatsApp'}
        </button>
        {avisoIndicacao && (
          <p className="mt-2 rounded-lg bg-white/70 p-2.5 text-center text-xs font-semibold text-verde" role="status" aria-live="polite">
            {avisoIndicacao}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="text-sm font-semibold text-verde/60">{ingles ? 'Biometric information' : 'Dados biométricos'}</h2>
        <ul className="mt-2 divide-y divide-cinza text-sm">
          {[
            [ingles ? 'Starting weight' : 'Peso inicial', `${usuario.peso.toLocaleString(locale)} kg`],
            [ingles ? 'Height' : 'Altura', `${usuario.altura} cm`],
            [ingles ? 'Age' : 'Idade', `${usuario.idade} ${ingles ? 'years' : 'anos'}`],
            [ingles ? 'Sex' : 'Sexo', usuario.sexo === 'feminino' ? (ingles ? 'Female' : 'Feminino') : (ingles ? 'Male' : 'Masculino')],
            [ingles ? 'Activity' : 'Atividade', ingles ? ATIVIDADE_EN[nivel?.id] : nivel?.label],
          ].map(([l, v]) => (
            <li key={l} className="flex justify-between py-2.5">
              <span className="text-verde/70">{l}</span>
              <strong className="text-verde">{v}</strong>
            </li>
          ))}
        </ul>
      </div>

      {medidas.length > 0 && (
        <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
          <h2 className="text-sm font-semibold text-verde/60">{ingles ? 'Starting measurements' : 'Medidas iniciais'}</h2>
          <ul className="mt-2 divide-y divide-cinza text-sm">
            {medidas.map(([nome, valor]) => (
              <li key={nome} className="flex justify-between py-2.5">
                <span className="capitalize text-verde/70">{ingles ? MEDIDAS_EN[nome] : (nome === 'braco' ? 'braço' : nome)}</span>
                <strong className="text-verde">{valor} cm</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="text-sm font-semibold text-verde/60">{ingles ? 'Daily targets' : 'Metas diárias'}</h2>
        <ul className="mt-2 divide-y divide-cinza text-sm">
          {[
            ['BMR', `${metas.tmb.toLocaleString(locale)} kcal`],
            ['TDEE', `${metas.tdee.toLocaleString(locale)} kcal`],
            [ingles ? 'Calories' : 'Calorias', `${metas.calorias.toLocaleString(locale)} kcal`],
            [ingles ? 'Protein' : 'Proteína', `${metas.proteina} g`],
            [ingles ? 'Carbohydrates' : 'Carboidratos', `${metas.carboidrato} g`],
            [ingles ? 'Fat' : 'Gordura', `${metas.gordura} g`],
            [ingles ? 'Water' : 'Água', `${metas.aguaL.toLocaleString(locale)} L`],
            [ingles ? 'Fiber' : 'Fibras', `${metas.fibras} g`],
          ].map(([l, v]) => (
            <li key={l} className="flex justify-between py-2.5">
              <span className="text-verde/70">{l}</span>
              <strong className="text-verde">{v}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* Planos e serviços */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="text-sm font-semibold text-verde/60">{ingles ? 'MWA plans and services' : 'Planos e serviços MWA'}</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          <div className="rounded-lg bg-sage-claro p-3.5">
            <p className="text-xs font-bold uppercase text-sage">{ingles ? 'Your current plan' : 'Seu plano atual'}</p>
            <p className="font-semibold text-verde">{PRODUTOS.programa.nome}</p>
            <p className="text-xs text-verde/60">{ingles ? 'day' : 'dia'} {diaAtual} {ingles ? 'of' : 'de'} {totalDias}</p>
          </div>
          <div className="rounded-lg border-2 border-sage/25 bg-white p-3.5 text-left">
            <p className="text-xs font-semibold text-verde/60 mb-2">{ingles ? 'One-on-one mentoring with Wanessa Auad' : 'Mentoria individual com Wanessa Auad'}</p>
            <BotaoPagamento
              tipo="sessao"
              fallbackWhatsApp={linkSessao(diaAtual)}
              className="block w-full rounded-lg border-2 border-sage/25 bg-white p-3 text-left transition-colors hover:border-sage disabled:opacity-60"
            >
              <span className="block font-semibold text-verde">{PRODUTOS.sessao.nome}</span>
              <span className="block text-xs text-verde/60">{formatarPreco(PRODUTOS.sessao.preco)}</span>
            </BotaoPagamento>
          </div>
        </div>
      </div>

      {/* Modo demonstração */}
      <div className="mt-4 rounded-2xl border-2 border-dashed border-sage/40 bg-white p-5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde/60">
          <FlaskConical size={15} className="text-sage" /> {ingles ? 'Demo mode' : 'Modo demonstração'}
        </h2>
        <p className="mt-1 text-xs text-verde/80">
          {ingles ? 'Simulate any program day to preview guides, tips, and offers.' : 'Simule qualquer dia do programa para pré-visualizar informativos, dicas e ofertas.'}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <select
            value={simuladorDia ?? ''}
            onChange={(e) => setSimuladorDia(e.target.value ? Number(e.target.value) : null)}
            className="flex-1 rounded-lg border-2 border-sage/30 bg-white px-3 py-2.5 text-sm font-medium text-verde outline-none focus:border-sage"
          >
            <option value="">{ingles ? 'Actual day (today)' : 'Dia real (hoje)'}</option>
            {diasDoPrograma.map((d) => (
              <option key={d} value={d}>
                {ingles ? 'Simulate day' : 'Simular dia'} {d}
              </option>
            ))}
          </select>
          {simuladorDia && (
            <button
              type="button"
              onClick={() => setSimuladorDia(null)}
              className="min-h-11 rounded-lg bg-sage px-3 py-2.5 text-sm font-semibold text-white"
            >
              {ingles ? 'Return to actual day' : 'Voltar ao real'}
            </button>
          )}
        </div>
      </div>

      {/* Responsável técnica (CRN) */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde/60">
          <BadgeCheck size={15} className="text-sage" /> {ingles ? 'Registered nutritionist' : 'Responsável técnica'}
        </h2>
        <p className="mt-2 font-serif text-lg font-semibold italic text-verde">{NUTRICIONISTA.nome}</p>
        <p className="text-sm text-verde/70">{NUTRICIONISTA.titulo} · {NUTRICIONISTA.crn}</p>
        <p className="text-xs text-verde/80">{NUTRICIONISTA.conselho}</p>
        <p className="mt-3 rounded-lg bg-ouro-claro/60 p-3 text-xs leading-relaxed text-verde/70">
          ⚠️ {AVISO_CRN}
        </p>
      </div>

      <DireitosLgpd />

      {evolucaoAberta && (
        <Suspense fallback={<CarregandoFallback />}>
          <MinhaEvolucao onFechar={() => setEvolucaoAberta(false)} />
        </Suspense>
      )}

      {/* Contato MWA */}
      <div className="mt-4 rounded-2xl bg-verde p-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">My Wellness Approach</p>
        <p className="mt-1 font-serif text-base font-semibold italic text-ouro">{CONTATO.slogan}</p>
        <p className="mt-1 text-sm text-white/70">{CONTATO.tagline}</p>
        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-white/80">
          <li className="flex items-center gap-2">
            <AtSign size={14} className="text-ouro" /> {CONTATO.instagram}
          </li>
          <li className="flex items-center gap-2">
            <Mail size={14} className="text-ouro" /> {CONTATO.email}
          </li>
          <li className="flex items-center gap-2">
            <Globe size={14} className="text-ouro" /> {CONTATO.site}
          </li>
        </ul>
      </div>

      <button
        type="button"
        onClick={() => {
          if (window.confirm(ingles ? 'Redoing your profile deletes logged meals, exercise, and weigh-ins. Continue?' : 'Refazer o cadastro apaga refeições, exercícios e pesagens registrados. Continuar?')) {
            reiniciar()
          }
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-sage/30 bg-white py-3.5 text-sm font-semibold text-verde/70 transition-colors hover:border-sage"
      >
        <RotateCcw size={15} /> {ingles ? 'Redo profile and recalculate targets' : 'Refazer cadastro e recalcular metas'}
      </button>

      <button
        type="button"
        onClick={sair}
        className="mt-3 mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-cinza bg-white py-3.5 text-sm font-semibold text-verde/60 transition-colors hover:border-verde/40"
      >
        <LogOut size={15} /> {ingles ? 'Sign out' : 'Sair da conta'}
      </button>
    </div>
  )
}
