import { useState } from 'react'
import { RotateCcw, Mail, Phone, AtSign, Globe, Crown, FlaskConical, BadgeCheck, LogOut, Camera, Star, Share2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { NIVEIS_ATIVIDADE, OBJETIVOS } from '../../utils/calculos.js'
import { PRODUTOS, CONTATO, formatarPreco, linkCompraUpgrade, linkSessao } from '../../utils/ofertas.js'
import { NUTRICIONISTA, AVISO_CRN } from '../../data/legal.js'
import { calcularEstrelas } from '../../utils/hallDaFama.js'
import { redimensionarImagem } from '../../lib/imagem.js'
import DireitosLgpd from './DireitosLgpd.jsx'
import BotaoPagamento from '../upgrade/BotaoPagamento.jsx'
import Avatar from '../game/Avatar.jsx'

export default function Perfil() {
  const {
    usuario,
    metas,
    diaAtual,
    pesagens,
    game,
    reiniciar,
    sair,
    simuladorDia,
    setSimuladorDia,
    atualizarFotoPerfil,
    registrarIndicacao,
  } = useApp()
  const nivel = NIVEIS_ATIVIDADE.find((n) => n.id === usuario.nivelAtividade)
  const objetivo = OBJETIVOS.find((o) => o.id === usuario.objetivo)
  const medidas = Object.entries(usuario.medidas ?? {}).filter(([, v]) => v)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [avisoIndicacao, setAvisoIndicacao] = useState(null)

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
    const texto = `Oi! Estou fazendo o MWA — Método Wanessa Auad, um programa de 21 dias com app, dicas diárias da nutricionista e acompanhamento completo. Achei que você ia gostar! 🌿\n\nDá uma olhada: https://${CONTATO.site}`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    const ganho = await registrarIndicacao()
    setAvisoIndicacao(
      ganho > 0
        ? `+${ganho} 🌱 por indicar uma amiga!`
        : 'Você já ganhou sementes por indicação hoje. Volte amanhã! 🌱',
    )
    setTimeout(() => setAvisoIndicacao(null), 3500)
  }

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">Seu perfil</h1>

      <div className="mt-4 rounded-2xl bg-verde p-5 text-white">
        <div className="flex items-center gap-4">
          {/* Foto real da pessoa (toque para trocar) */}
          <label className="relative shrink-0 cursor-pointer">
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
            <input type="file" accept="image/*" className="hidden" onChange={escolherFoto} disabled={enviandoFoto} />
          </label>

          <div className="flex-1">
            <p className="font-serif text-xl font-semibold italic">{usuario.nome}</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-white/70">
              <Mail size={14} /> {usuario.email}
            </p>
          </div>
        </div>

        {/* Avatar gamificado, logo abaixo da foto real */}
        {game && (
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <Avatar avatar={game.avatar} tamanho="sm" />
            <div>
              <p className="text-xs font-semibold text-white/70">Seu avatar no MWA</p>
              <p className="text-sm font-bold text-ouro">{game.sementes} 🌱 sementes</p>
            </div>
          </div>
        )}

        <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
          <Phone size={14} /> {usuario.whatsapp}
        </p>
        <p className="mt-3 inline-block rounded-full bg-ouro px-3 py-1 text-xs font-bold text-verde-escuro">
          Dia {diaAtual} de 21 · {objetivo?.emoji} {objetivo?.label}
        </p>
      </div>

      {/* Hall da Fama */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde/60">
          <Star size={15} className="text-ouro" /> Hall da Fama
        </h2>
        <p className="mt-1 text-xs text-verde/50">
          Ganhe uma estrela nas pesagens dos dias 7, 14 e 21 quando o resultado for positivo.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {estrelas.map((c) => (
            <div
              key={c.semana}
              className={`rounded-xl p-3 text-center ${c.estrela ? 'bg-ouro-claro' : 'bg-creme'}`}
            >
              <Star
                size={22}
                className={`mx-auto ${c.estrela ? 'fill-ouro text-ouro' : 'text-verde/20'}`}
              />
              <p className="mt-1 text-xs font-bold text-verde">Dia {c.dia}</p>
              <p className="text-[10px] text-verde/50">
                {c.estrela ? 'Conquistada!' : c.feita ? 'Sem resultado' : 'Pendente'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Indicar uma amiga */}
      <div className="mt-4 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde">
          <Share2 size={15} /> Indique uma amiga
        </h2>
        <p className="mt-1 text-xs text-verde/70">
          Envie o MWA pelo WhatsApp e ganhe sementes a cada indicação (até 3 por dia).
        </p>
        <button
          type="button"
          onClick={indicarAmiga}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-verde py-3 text-sm font-bold text-white transition-transform active:scale-[0.98]"
        >
          <Share2 size={16} /> Indicar pelo WhatsApp
        </button>
        {avisoIndicacao && (
          <p className="mt-2 rounded-lg bg-white/70 p-2.5 text-center text-xs font-semibold text-verde">
            {avisoIndicacao}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="text-sm font-semibold text-verde/60">Dados biométricos</h2>
        <ul className="mt-2 divide-y divide-cinza text-sm">
          {[
            ['Peso inicial', `${usuario.peso.toLocaleString('pt-BR')} kg`],
            ['Altura', `${usuario.altura} cm`],
            ['Idade', `${usuario.idade} anos`],
            ['Sexo', usuario.sexo === 'feminino' ? 'Feminino' : 'Masculino'],
            ['Atividade', nivel?.label],
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
          <h2 className="text-sm font-semibold text-verde/60">Medidas iniciais</h2>
          <ul className="mt-2 divide-y divide-cinza text-sm">
            {medidas.map(([nome, valor]) => (
              <li key={nome} className="flex justify-between py-2.5">
                <span className="capitalize text-verde/70">{nome === 'braco' ? 'braço' : nome}</span>
                <strong className="text-verde">{valor} cm</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="text-sm font-semibold text-verde/60">Metas diárias</h2>
        <ul className="mt-2 divide-y divide-cinza text-sm">
          {[
            ['TMB', `${metas.tmb.toLocaleString('pt-BR')} kcal`],
            ['TDEE', `${metas.tdee.toLocaleString('pt-BR')} kcal`],
            ['Calorias', `${metas.calorias.toLocaleString('pt-BR')} kcal`],
            ['Proteína', `${metas.proteina} g`],
            ['Carboidratos', `${metas.carboidrato} g`],
            ['Gordura', `${metas.gordura} g`],
            ['Água', `${metas.aguaL.toLocaleString('pt-BR')} L`],
            ['Fibras', `${metas.fibras} g`],
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
        <h2 className="text-sm font-semibold text-verde/60">Planos e serviços MWA</h2>
        <div className="mt-3 flex flex-col gap-2.5">
          <div className="rounded-lg bg-sage-claro p-3.5">
            <p className="text-xs font-bold uppercase text-sage">Seu plano atual</p>
            <p className="font-semibold text-verde">{PRODUTOS.programa.nome}</p>
            <p className="text-xs text-verde/60">{formatarPreco(PRODUTOS.programa.preco)} · dia {diaAtual} de 21</p>
          </div>
          <div>
            <BotaoPagamento
              tipo="upgrade"
              fallbackWhatsApp={linkCompraUpgrade(diaAtual)}
              className="block w-full rounded-lg border-2 border-ouro/60 p-3.5 text-left transition-colors hover:bg-ouro-claro disabled:opacity-60"
            >
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-ouro">
                <Crown size={12} /> Continue sua transformação
              </span>
              <span className="block font-semibold text-verde">{PRODUTOS.upgrade.nome}</span>
              <span className="block text-xs text-verde/60">
                {diaAtual >= 3 && diaAtual <= 7
                  ? `${formatarPreco(PRODUTOS.upgrade.precoOferta)} (condição especial válida até o dia 7)`
                  : diaAtual >= 21
                    ? `${formatarPreco(PRODUTOS.upgrade.precoFinal20)} (20% OFF)`
                    : `${formatarPreco(PRODUTOS.upgrade.precoCheio)}`}
              </span>
            </BotaoPagamento>
          </div>
          <div className="rounded-lg border-2 border-sage/25 bg-white p-3.5 text-left">
            <p className="text-xs font-semibold text-verde/60 mb-2">Mentoria individual com Wanessa Auad</p>
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
          <FlaskConical size={15} className="text-sage" /> Modo demonstração
        </h2>
        <p className="mt-1 text-xs text-verde/50">
          Simule qualquer dia do programa para pré-visualizar informativos, dicas e ofertas.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <select
            value={simuladorDia ?? ''}
            onChange={(e) => setSimuladorDia(e.target.value ? Number(e.target.value) : null)}
            className="flex-1 rounded-lg border-2 border-sage/30 bg-white px-3 py-2.5 text-sm font-medium text-verde outline-none focus:border-sage"
          >
            <option value="">Dia real (hoje)</option>
            {Array.from({ length: 21 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                Simular dia {d}
              </option>
            ))}
          </select>
          {simuladorDia && (
            <button
              type="button"
              onClick={() => setSimuladorDia(null)}
              className="rounded-lg bg-sage px-3 py-2.5 text-sm font-semibold text-white"
            >
              Voltar ao real
            </button>
          )}
        </div>
      </div>

      {/* Responsável técnica (CRN) */}
      <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-verde/60">
          <BadgeCheck size={15} className="text-sage" /> Responsável técnica
        </h2>
        <p className="mt-2 font-serif text-lg font-semibold italic text-verde">{NUTRICIONISTA.nome}</p>
        <p className="text-sm text-verde/70">{NUTRICIONISTA.titulo} · {NUTRICIONISTA.crn}</p>
        <p className="text-xs text-verde/50">{NUTRICIONISTA.conselho}</p>
        <p className="mt-3 rounded-lg bg-ouro-claro/60 p-3 text-xs leading-relaxed text-verde/70">
          ⚠️ {AVISO_CRN}
        </p>
      </div>

      <DireitosLgpd />

      {/* Contato MWA */}
      <div className="mt-4 rounded-2xl bg-verde p-5 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">My Wellness Approach</p>
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
          if (window.confirm('Refazer o cadastro apaga refeições, exercícios e pesagens registrados. Continuar?')) {
            reiniciar()
          }
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-sage/30 bg-white py-3.5 text-sm font-semibold text-verde/70 transition-colors hover:border-sage"
      >
        <RotateCcw size={15} /> Refazer cadastro e recalcular metas
      </button>

      <button
        type="button"
        onClick={sair}
        className="mt-3 mb-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-cinza bg-white py-3.5 text-sm font-semibold text-verde/60 transition-colors hover:border-verde/40"
      >
        <LogOut size={15} /> Sair da conta
      </button>
    </div>
  )
}
