import { useEffect, useState } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import TelaAuth from './components/auth/TelaAuth.jsx'
import OnboardingFlow from './components/onboarding/OnboardingFlow.jsx'
import TabBar from './components/layout/TabBar.jsx'
import BotaoWhatsApp from './components/layout/BotaoWhatsApp.jsx'
import Hoje from './components/hoje/Hoje.jsx'
import Alimentacao from './components/alimentacao/Alimentacao.jsx'
import Progresso from './components/progresso/Progresso.jsx'
import Dicas from './components/dicas/Dicas.jsx'
import Ferramentas from './components/ferramentas/Ferramentas.jsx'
import Perfil from './components/perfil/Perfil.jsx'
import ModalRefeicao from './components/alimentacao/ModalRefeicao.jsx'
import AdminApp from './components/admin/AdminApp.jsx'
import LandingVendas from './components/vendas/LandingVendas.jsx'
import ResgateCupom from './components/vendas/ResgateCupom.jsx'

const AVISOS_PAGAMENTO = {
  sucesso: { texto: '✅ Pagamento aprovado! Seu acesso será liberado em instantes.', estilo: 'border-sage bg-sage-claro text-verde' },
  pendente: { texto: '⏳ Pagamento em processamento. Avisaremos assim que for confirmado.', estilo: 'border-ouro bg-ouro-claro text-verde' },
  falha: { texto: '❌ O pagamento não foi concluído. Você pode tentar novamente quando quiser.', estilo: 'border-red-300 bg-red-50 text-red-800' },
}

function AppInner() {
  const { sessao, carregando, usuario, modalRefeicao, ganhoSementes } = useApp()
  const [aba, setAba] = useState('hoje')
  const [avisoPagamento, setAvisoPagamento] = useState(null)

  // Ao voltar do checkout, o Mercado Pago adiciona ?pagamento= na URL
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('pagamento')
    if (status) {
      window.history.replaceState({}, '', window.location.pathname)
      setAvisoPagamento(AVISOS_PAGAMENTO[status] ?? null)
    }
  }, [])

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="font-serif text-xl font-semibold italic text-verde/60">MWA 🌿</p>
      </div>
    )
  }

  if (!sessao) {
    return <TelaAuth />
  }

  if (!usuario) {
    return <OnboardingFlow />
  }

  if (usuario?.role === 'admin') {
    return <AdminApp />
  }

  const telas = {
    hoje: <Hoje irParaDicas={() => setAba('dicas')} />,
    alimentacao: <Alimentacao />,
    progresso: <Progresso />,
    dicas: <Dicas irPara={setAba} />,
    ferramentas: <Ferramentas />,
    perfil: <Perfil />,
  }

  return (
    <div className="mx-auto min-h-screen max-w-md">
      {avisoPagamento && (
        <button
          type="button"
          onClick={() => setAvisoPagamento(null)}
          className={`mx-5 mt-4 block w-[calc(100%-2.5rem)] rounded-lg border-2 p-3.5 text-left text-sm font-semibold ${avisoPagamento.estilo}`}
        >
          {avisoPagamento.texto}
          <span className="block text-xs font-normal opacity-60">toque para fechar</span>
        </button>
      )}
      <div className="pb-28">{telas[aba]}</div>
      <BotaoWhatsApp />
      <TabBar aba={aba} onMudar={setAba} />
      {modalRefeicao.aberto && <ModalRefeicao />}
      {/* Aviso de sementes ganhas (gamificação) */}
      {ganhoSementes && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 animate-bounce rounded-full bg-verde px-5 py-2.5 font-bold text-ouro shadow-lg">
          +{ganhoSementes.qtd} 🌱
        </div>
      )}
    </div>
  )
}

export default function App() {
  // Páginas públicas (fora do app logado)
  const rota = window.location.pathname
  if (rota === '/vendas') return <LandingVendas />
  if (rota === '/resgate') return <ResgateCupom />

  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
