import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import TelaConsentimento from './TelaConsentimento.jsx'
import TelaContato from './TelaContato.jsx'
import TelaBiometria from './TelaBiometria.jsx'
import TelaCorporais from './TelaCorporais.jsx'
import TelaMetas from './TelaMetas.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const TOTAL_TELAS = 5

export default function OnboardingFlow() {
  const { sessao, concluirOnboarding } = useApp()
  const { ingles } = useIdioma()
  const [tela, setTela] = useState(0)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const [dados, setDados] = useState({
    nome: '',
    email: sessao?.user?.email ?? '',
    whatsapp: '',
    consentimentoLgpd: false,
    cienteAvisoCrn: false,
    sexo: '',
    idade: '',
    peso: '',
    altura: '',
    nivelAtividade: '',
    objetivo: '',
    medidas: { cintura: '', quadril: '', peito: '', braco: '', coxa: '' },
  })

  function atualizar(campo, valor) {
    setDados((d) => ({ ...d, [campo]: valor }))
  }

  function atualizarMedida(campo, valor) {
    setDados((d) => ({ ...d, medidas: { ...d.medidas, [campo]: valor } }))
  }

  const avancar = () => setTela((t) => Math.min(t + 1, TOTAL_TELAS - 1))
  const voltar = () => setTela((t) => Math.max(t - 1, 0))

  async function finalizar() {
    setSalvando(true)
    setErro(null)
    try {
      await concluirOnboarding({
        ...dados,
        idade: Number(dados.idade),
        peso: Number(dados.peso),
        altura: Number(dados.altura),
      })
    } catch {
      setErro(ingles
        ? 'We could not save your profile. Check your connection and try again.'
        : 'Não foi possível salvar seu cadastro. Verifique sua conexão e tente novamente.')
      setSalvando(false)
    }
  }

  const telas = [
    <TelaConsentimento key="0" dados={dados} atualizar={atualizar} avancar={avancar} />,
    <TelaContato key="1" dados={dados} atualizar={atualizar} avancar={avancar} />,
    <TelaBiometria key="2" dados={dados} atualizar={atualizar} avancar={avancar} voltar={voltar} />,
    <TelaCorporais key="3" dados={dados} atualizarMedida={atualizarMedida} avancar={avancar} voltar={voltar} />,
    <TelaMetas key="4" dados={dados} finalizar={finalizar} voltar={voltar} />,
  ]

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
      <div
        className="mb-8 flex gap-2"
        role="progressbar"
        aria-valuenow={tela + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_TELAS}
        aria-label={ingles ? `Step ${tela + 1} of ${TOTAL_TELAS}` : `Passo ${tela + 1} de ${TOTAL_TELAS}`}
      >
        {Array.from({ length: TOTAL_TELAS }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= tela ? 'bg-sage' : 'bg-sage/20'}`}
          />
        ))}
      </div>
      {erro && (
        <p role="alert" className="mb-4 rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{erro}</p>
      )}
      {salvando && (
        <p role="status" aria-live="polite" className="mb-4 rounded-lg bg-sage-claro p-3 text-sm font-medium text-verde">
          {ingles ? 'Saving your profile…' : 'Salvando seu cadastro…'}
        </p>
      )}
      <div className="flex flex-1 flex-col">{telas[tela]}</div>
    </div>
  )
}
