import { Lock, Repeat, MessageCircle } from 'lucide-react'
import { abrirCheckout } from '../../lib/hotmart.js'
import { linkWhatsApp } from '../../utils/ofertas.js'
import LogoMWA from '../ui/LogoMWA.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

/**
 * Tela exibida quando:
 * - Pessoa chegou ao dia 90 (fim do ciclo)
 * - Não tem um programa 90d ativo pago
 * - Não pode mais acessar o app até pagar novo ciclo
 */
export default function AcessoBloqueado({ usuario }) {
  const { ingles } = useIdioma()
  const primeiroNome = usuario?.nome?.trim().split(' ')[0] ?? ''

  function continuarComNovoCiclo() {
    abrirCheckout('programa90d')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-gradient-to-b from-verde-escuro via-verde/90 to-verde-escuro/95 p-4 backdrop-blur-sm">
      {/* Container */}
      <div className="w-full max-w-sm space-y-6 py-10">
        {/* ÍCONE BLOQUEIO */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-ouro/20 blur-2xl rounded-full"></div>
            <div className="relative bg-ouro/10 p-6 rounded-full border border-ouro/30">
              <Lock size={48} className="text-ouro" />
            </div>
          </div>
        </div>

        {/* CABEÇALHO */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <LogoMWA variante="simbolo" tema="claro" className="h-5 w-5" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">My Wellness Approach</p>
          </div>
          <h1 className="font-serif text-4xl font-bold italic text-ouro">
            {ingles ? '90 Days Done' : '90 Dias Feitos'}
          </h1>
          <p className="text-lg font-semibold text-white leading-relaxed">
            {primeiroNome ? (ingles ? `${primeiroNome}, you made it here` : `${primeiroNome}, você chegou até aqui`) : (ingles ? 'You made it here' : 'Você chegou até aqui')}
          </p>
          <p className="text-sm text-white/80 italic">
            {ingles ? 'And that changes everything.' : 'E isso muda tudo.'}
          </p>
        </div>

        {/* MENSAGEM PRINCIPAL */}
        <div className="rounded-2xl bg-gradient-to-br from-ouro/20 to-ouro/5 backdrop-blur border border-ouro/30 p-6 space-y-4">
          <p className="text-sm leading-relaxed text-white/95">
            {ingles
              ? `${primeiroNome || 'You'} didn't just complete a program. You became someone who knows how to feed their body with respect. Who trusts their own choices. Who understands that excellence is a daily repetition, not a destination.`
              : `${primeiroNome || 'Você'} não completou só um programa. Se tornou alguém que sabe alimentar seu corpo com respeito. Que confia em suas próprias escolhas. Que entendeu que excelência é uma repetição que você escolhe todos os dias.`}
          </p>
          <div className="flex items-start gap-3 bg-white/10 p-4 rounded-lg border border-white/15">
            <p className="text-sm text-white/90 flex-1">
              <strong>💚 {ingles ? 'Everything stays:' : 'Tudo permanece:'}</strong> {ingles ? 'your 90-day history, your progress, your seeds, your avatar — nothing disappears. It is the foundation for what comes next.' : 'seu histórico de 90 dias, seu progresso, suas sementes, seu avatar — nada desaparece. É a base para o que vem depois.'}
            </p>
          </div>
        </div>

        {/* PRÓXIMA FASE */}
        <div className="rounded-2xl bg-gradient-to-br from-sage/25 to-sage/10 backdrop-blur border border-sage/50 p-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-sage/80 mb-1">
            🌱 {ingles ? 'Your Next 90 Days' : 'Seus Próximos 90 Dias'}
          </p>
          <p className="text-sm leading-relaxed text-white/90">
            {ingles
              ? 'The next cycle is not starting over — it is going deeper. You already know how to do this. Now it is about elevating what you built and discovering what excellence looks like when repetition becomes identity.'
              : 'O próximo ciclo não é recomeçar — é ir mais fundo. Você já sabe como fazer isso. Agora é sobre elevar o que você construiu e descobrir como fica a excelência quando a repetição vira identidade.'}
          </p>
          <ul className="text-sm leading-relaxed text-white/85 space-y-2 mt-3">
            <li>✅ {ingles ? '90 new daily tips building on what you learned' : '90 novas dicas diárias que aprofundam o que você aprendeu'}</li>
            <li>✅ {ingles ? 'Your complete history always visible' : 'Seu histórico completo sempre à vista'}</li>
            <li>✅ {ingles ? 'Continued tracking of weight, photos, and transformation' : 'Acompanhamento contínuo de peso, fotos e transformação'}</li>
            <li>✅ {ingles ? 'Direct support through WhatsApp' : 'Suporte direto via WhatsApp'}</li>
          </ul>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="space-y-3 pt-2">
          {/* CTA Principal */}
          <button
            type="button"
            onClick={continuarComNovoCiclo}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-ouro via-ouro/95 to-ouro px-6 py-4 font-black text-verde-escuro transition-all active:scale-[0.98] hover:shadow-2xl hover:shadow-ouro/40 shadow-lg shadow-ouro/30 text-base uppercase tracking-wide"
          >
            <span>👑</span>
            {ingles ? 'Continue Your Transformation' : 'Continuar Minha Transformação'}
          </button>

          {/* Dúvidas */}
          <a
            href={linkWhatsApp('Oi Wanessa! Completei os 90 dias e gostaria de saber mais sobre como continuar no próximo ciclo.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-white/15 hover:bg-white/20 backdrop-blur px-6 py-3 font-semibold text-white transition-colors border border-white/20"
          >
            <MessageCircle size={16} /> {ingles ? 'Have Questions?' : 'Tem Dúvidas?'}
          </a>
        </div>

        {/* MENSAGEM FINAL */}
        <div className="text-center space-y-2 pt-2">
          <p className="text-sm text-white/80 font-serif italic">
            {ingles ? 'Your data is completely safe and waiting for you.' : 'Seus dados estão completamente seguros e te esperando.'}
          </p>
          <p className="text-xs text-white/60">
            {ingles ? 'With admiration, Wanessa ❤️' : 'Com admiração, Wanessa ❤️'}
          </p>
        </div>
      </div>
    </div>
  )
}
