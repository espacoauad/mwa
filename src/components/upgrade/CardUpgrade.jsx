import { Clock, Crown, CalendarHeart } from 'lucide-react'
import { faseUpgrade, PRODUTOS, formatarPreco, linkCompraUpgrade, linkSessao, linkWhatsApp } from '../../utils/ofertas.js'
import BotaoPagamento from './BotaoPagamento.jsx'

// Card de upgrade exibido na aba HOJE conforme o cronograma oficial:
// dia 3–7 oferta especial de lançamento, 8–20 valor cheio, 21+ tela final com 20% OFF
export default function CardUpgrade({ dia }) {
  const fase = faseUpgrade(dia)
  if (fase.id === 'nenhuma') return null

  if (fase.id === 'oferta') {
    const prazo = fase.ultimoDia
      ? 'Condição especial válida hoje'
      : `Condição especial disponível até o dia 7 (${fase.diasRestantes} ${fase.diasRestantes === 1 ? 'dia restante' : 'dias restantes'})`
    return (
      <section className="mt-4 overflow-hidden rounded-2xl border-2 border-ouro/50 bg-ouro-claro p-5 shadow-sm shadow-verde/5">
        <span className="inline-block rounded-full bg-verde px-3 py-1 text-xs font-bold text-ouro">
          Continuidade MWA
        </span>
        <h2 className="mt-3 font-serif text-xl font-semibold italic text-verde">
          MWA | Programa de 90 Dias
        </h2>
        <p className="mt-1 text-sm text-verde/70">
          Aprofunde seus hábitos com acompanhamento estendido — 90 dias de transformação contínua.
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm text-verde/50 line-through">{formatarPreco(PRODUTOS.upgrade.precoCheio)}</span>
          <span className="text-3xl font-bold text-verde">{formatarPreco(PRODUTOS.upgrade.precoOferta)}</span>
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-verde/70">
          <Clock size={14} className="text-ouro" /> {prazo}
        </p>
        <BotaoPagamento
          tipo="upgrade"
          fallbackWhatsApp={linkCompraUpgrade(dia)}
          className="mt-4 block w-full rounded-lg bg-ouro px-6 py-4 text-center font-semibold text-verde-escuro transition-all hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
        >
          Garantir continuidade de 90 dias
        </BotaoPagamento>
        <p className="mt-2 text-center text-xs text-verde/50">
          PIX, cartão ou boleto · pagamento seguro via Mercado Pago
        </p>
      </section>
    )
  }

  if (fase.id === 'normal') {
    return (
      <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
        <h2 className="flex items-center gap-2 font-semibold text-verde">
          <CalendarHeart size={18} className="text-sage" /> MWA | Programa de 90 Dias
        </h2>
        <p className="mt-1 text-sm text-verde/60">
          Aprofunde seus aprendizados com 90 dias de acompanhamento contínuo — {formatarPreco(PRODUTOS.upgrade.precoCheio)}.
        </p>
        <BotaoPagamento
          tipo="upgrade"
          fallbackWhatsApp={linkCompraUpgrade(dia)}
          className="mt-3 block w-full rounded-lg border-2 border-sage/40 bg-white px-6 py-3.5 text-center text-sm font-semibold text-verde transition-colors hover:border-sage disabled:opacity-60"
        >
          Garantir por {formatarPreco(PRODUTOS.upgrade.precoCheio)}
        </BotaoPagamento>
      </section>
    )
  }

  // fase final — dia 21+: nova oportunidade com 20% OFF sobre o valor cheio
  return (
    <section className="mt-4 overflow-hidden rounded-2xl bg-verde p-5 text-white shadow-lg shadow-verde/20">
      <p className="text-3xl">🏆</p>
      <h2 className="mt-1 font-serif text-xl font-semibold italic text-ouro">
        Você completou sua Jornada de 21 Dias!
      </h2>
      <p className="mt-1 text-sm text-white/70">
        Seus hábitos estão transformados. Agora, escolha como quer aprofundar:
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        <div>
          <BotaoPagamento
            tipo="upgrade_vip"
            fallbackWhatsApp={linkWhatsApp(`Olá! Completei o MWA | Jornada de 21 Dias e quero o MWA | Programa de 90 Dias com 20% OFF (${formatarPreco(PRODUTOS.upgrade.precoFinal20)})!`)}
            className="block w-full rounded-lg bg-ouro p-4 text-left text-verde-escuro transition-all hover:brightness-95 active:scale-[0.99] disabled:opacity-60"
          >
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase">
              <Crown size={13} /> Nova oportunidade · 20% OFF
            </span>
            <span className="mt-0.5 block font-serif text-lg font-semibold italic">
              MWA | Programa de 90 Dias — {formatarPreco(PRODUTOS.upgrade.precoFinal20)}
            </span>
            <span className="text-xs text-verde-escuro/70">
              em vez de {formatarPreco(PRODUTOS.upgrade.precoCheio)}
            </span>
          </BotaoPagamento>
        </div>

        <div>
          <BotaoPagamento
            tipo="sessao"
            fallbackWhatsApp={linkSessao(dia)}
            className="block w-full rounded-lg bg-white/10 p-4 text-left transition-colors hover:bg-white/15 disabled:opacity-60"
          >
            <span className="block font-semibold">Sessão Estratégica MWA — {formatarPreco(PRODUTOS.sessao.preco)}</span>
            <span className="text-xs text-white/60">orientação individual online com Wanessa Auad</span>
          </BotaoPagamento>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-white/50">
        PIX, cartão ou boleto · pagamento seguro via Mercado Pago
      </p>
    </section>
  )
}
