import { lazy, Suspense, useEffect, useState } from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import { IdiomaProvider, useIdioma } from './context/IdiomaContext.jsx'
import TelaAuth from './components/auth/TelaAuth.jsx'
import CarregandoFallback from './components/ui/CarregandoFallback.jsx'
import TabBar from './components/layout/TabBar.jsx'
import BotaoWhatsApp from './components/layout/BotaoWhatsApp.jsx'
import AvisoInstalarIOS from './components/layout/AvisoInstalarIOS.jsx'
import Hoje from './components/hoje/Hoje.jsx'
import Alimentacao from './components/alimentacao/Alimentacao.jsx'
import Progresso from './components/progresso/Progresso.jsx'
import Dicas from './components/dicas/Dicas.jsx'
import Ferramentas from './components/ferramentas/Ferramentas.jsx'
import Perfil from './components/perfil/Perfil.jsx'
import ModalEscolherRefeicao from './components/alimentacao/ModalEscolherRefeicao.jsx'
import ModalRefeicaoAberta from './components/alimentacao/ModalRefeicaoAberta.jsx'
import ModalAdicionarAlimento from './components/alimentacao/ModalAdicionarAlimento.jsx'
import LembretePesagem from './components/progresso/LembretePesagem.jsx'
import Conclusao90Dias from './components/game/Conclusao90Dias.jsx'
import AdminApp from './components/admin/AdminApp.jsx'
import LandingVendas from './components/vendas/LandingVendas.jsx'
import ResgateCupom from './components/vendas/ResgateCupom.jsx'
import PreviewLanches from './components/dicas/PreviewLanches.jsx'
import ModoDeRevisao from './components/admin/MododeRevisao.jsx'
import { ehDiaPesagem } from './utils/pesagensReminder.js'
import { configurarNotificacoesPesagem } from './utils/notificacoesReminder.js'
import { lembrarFuncaoDoDia } from './utils/notificacaoFuncoes.js'
import { garantirInscricaoPush } from './utils/pushSubscricao.js'

// Fluxo de cadastro (onboarding) é pesado e só é usado uma vez por pessoa —
// carregado sob demanda para reduzir o bundle principal.
const OnboardingFlow = lazy(() => import('./components/onboarding/OnboardingFlow.jsx'))

const AVISOS_PAGAMENTO = {
  sucesso: { texto: '✅ Pagamento aprovado! Seu acesso será liberado em instantes.', estilo: 'border-sage bg-sage-claro text-verde' },
  pendente: { texto: '⏳ Pagamento em processamento. Avisaremos assim que for confirmado.', estilo: 'border-ouro bg-ouro-claro text-verde' },
  falha: { texto: '❌ O pagamento não foi concluído. Você pode tentar novamente quando quiser.', estilo: 'border-red-300 bg-red-50 text-red-800' },
}

// Mantida em sincronia com as chaves de `telas` (abaixo, dentro de AppInner).
// Não referenciamos `telas` diretamente aqui porque ela só existe depois dos
// retornos antecipados (usuário deslogado, onboarding, admin...) — se o efeito
// de ?aba= disparasse antes disso, `telas` ainda estaria em TDZ.
const ABAS_VALIDAS = ['hoje', 'alimentacao', 'progresso', 'dicas', 'ferramentas', 'perfil']

function AppInner() {
  const { sessao, carregando, usuario, modalRefeicao, ganhoSementes, diaAtual, totalDias, programa90Ativo, hoje } = useApp()
  const { ingles } = useIdioma()
  const [aba, setAba] = useState('hoje')
  const [avisoPagamento, setAvisoPagamento] = useState(null)
  const [mostrarLembretePesagem, setMostrarLembretePesagem] = useState(false)
  const [jaMostrarLembrete, setJaMostrarLembrete] = useState(false)

  // Ao terminar o ciclo, a comemoração do dia 90 permanece até a renovação.
  const acessoBloqueado = usuario && diaAtual === 90 && !programa90Ativo

  // Ao voltar do checkout, o Mercado Pago adiciona ?pagamento= na URL
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('pagamento')
    if (status) {
      window.history.replaceState({}, '', window.location.pathname)
      setAvisoPagamento(AVISOS_PAGAMENTO[status] ?? null)
    }
  }, [])

  // App aberto a partir do toque numa notificação push com o app fechado —
  // o service worker cold-starta em /?aba=..., já que nesse caso não existe
  // uma janela controlada pra receber o postMessage de 'push-click'.
  useEffect(() => {
    const abaPush = new URLSearchParams(window.location.search).get('aba')
    if (abaPush) {
      window.history.replaceState({}, '', window.location.pathname)
      if (ABAS_VALIDAS.includes(abaPush)) {
        setAba(abaPush)
      }
    }
  }, [])

  // Verifica se é dia de pesagem e mostra lembrete
  useEffect(() => {
    if (usuario && diaAtual && !jaMostrarLembrete && totalDias) {
      if (ehDiaPesagem(diaAtual, totalDias)) {
        setMostrarLembretePesagem(true)
        setJaMostrarLembrete(true)
      }
    }
  }, [usuario, diaAtual, totalDias, jaMostrarLembrete])

  // Configura notificações push 24h antes da pesagem
  useEffect(() => {
    const userId = sessao?.user?.id
    if (usuario && diaAtual && totalDias && userId) {
      configurarNotificacoesPesagem(diaAtual, totalDias, userId)
    }
  }, [sessao, usuario, diaAtual, totalDias])

  // Lembrete diário rotativo das funções do app (Reforçando Conceitos,
  // exercício, Fazenda, Lente da Consciência, jogo da semana, Versículo)
  useEffect(() => {
    const userId = sessao?.user?.id
    if (usuario && diaAtual && hoje && userId && !acessoBloqueado && usuario.role !== 'admin') {
      lembrarFuncaoDoDia({ userId, hoje, diaAtual, ingles, onAbrir: setAba })
    }
  }, [sessao, usuario, diaAtual, hoje, ingles, acessoBloqueado])

  // Garante a inscrição push do dispositivo atual (sem pedir permissão de novo).
  // Depende do id do usuário e de `usuario` ter terminado de carregar (booleano) —
  // não do objeto `usuario` inteiro, cuja identidade muda a cada atualização de
  // perfil (foto, idioma etc), o que reexecutaria o registro do service worker +
  // upsert no Supabase à toa. `sessao` costuma ficar disponível antes de `usuario`
  // terminar de carregar (são efeitos assíncronos separados em AppContext), então
  // sem o `!!usuario` aqui o efeito dispararia uma única vez com `usuario` ainda
  // nulo e nunca mais rodaria — a inscrição push nunca aconteceria.
  useEffect(() => {
    const userId = sessao?.user?.id
    if (usuario && userId) {
      garantirInscricaoPush(userId)
    }
  }, [sessao?.user?.id, !!usuario])

  // Toque numa notificação push -> navega pra aba indicada
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    function aoReceberMensagem(evento) {
      if (evento.data?.tipo === 'push-click') {
        setAba(evento.data.aba || 'ferramentas')
      }
    }
    navigator.serviceWorker.addEventListener('message', aoReceberMensagem)
    return () => navigator.serviceWorker.removeEventListener('message', aoReceberMensagem)
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
    return (
      <Suspense fallback={<CarregandoFallback />}>
        <OnboardingFlow />
      </Suspense>
    )
  }

  if (usuario?.role === 'admin') {
    return <AdminApp />
  }

  // Bloqueia acesso se chegou ao dia 90 sem programa 90d ativo
  if (acessoBloqueado) {
    return <Conclusao90Dias persistente />
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
          <span className="block text-xs font-normal opacity-60">{ingles ? 'tap to close' : 'toque para fechar'}</span>
        </button>
      )}
      <div className="pb-28">{telas[aba]}</div>
      <BotaoWhatsApp />
      <AvisoInstalarIOS />
      <TabBar aba={aba} onMudar={setAba} />
      <ModoDeRevisao />
      {modalRefeicao.etapa === 'escolher' && <ModalEscolherRefeicao />}
      {modalRefeicao.etapa === 'aberta' && <ModalRefeicaoAberta />}
      {modalRefeicao.etapa === 'alimento' && <ModalAdicionarAlimento />}
      {mostrarLembretePesagem && (
        <LembretePesagem
          onFechar={() => setMostrarLembretePesagem(false)}
          onIrPara={setAba}
        />
      )}
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
  if (rota === '/preview-lanches') return <IdiomaProvider><PreviewLanches /></IdiomaProvider>

  return (
    <IdiomaProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </IdiomaProvider>
  )
}
