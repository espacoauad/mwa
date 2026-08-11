import Botao from '../ui/Botao.jsx'
import SeletorPergunta from './SeletorPergunta.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { OPCOES_FOCO, OPCOES_OBSTACULO, OPCOES_ROTINA, OPCOES_SENTIMENTO_ESPERADO } from '../../utils/personalizacao.js'

const FOCO_EN = {
  alimentacao: 'Your relationship with food',
  corpo: 'Your body and energy',
  rotina: 'Your routine and consistency',
  emocional: 'Your emotional relationship with food',
}

const OBSTACULO_EN = {
  falta_tempo: 'When my routine gets busy',
  perde_motivacao: 'After the initial motivation fades',
  cobranca: "When I'm too hard on myself and give up",
  fora_da_dieta: 'After slipping off my diet once',
}

const ROTINA_EN = {
  corrida: 'Busy, no time for myself',
  organizada_sem_foco: 'Organized, but no room to take care of myself',
  tranquila_sem_constancia: 'Calm, but not consistent',
  baguncada: 'Messy, I want a fresh start',
}

const SENTIMENTO_EN = {
  leve: 'Lighter and more energetic',
  orgulhosa: 'Proud of staying consistent',
  tranquila: 'With a calmer relationship with food',
  confiante: 'More confident in my body',
}

export default function TelaPersonalizacao({ dados, atualizar, avancar, voltar }) {
  const { ingles } = useIdioma()

  function escolher(campo, valor) {
    atualizar(campo, valor)
    if (valor !== 'outro') atualizar(`${campo}Outro`, '')
  }

  const valido =
    dados.foco &&
    (dados.foco !== 'outro' || dados.focoOutro.trim().length > 0) &&
    dados.sentimentoEsperado &&
    (dados.sentimentoEsperado !== 'outro' || dados.sentimentoEsperadoOutro.trim().length > 0)

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {ingles ? "Let's get to know you better" : 'Vamos te conhecer melhor'}
        </h1>
        <p className="mt-3 text-verde/70">
          {ingles
            ? 'Your answers help us personalize your journey from day one.'
            : 'Suas respostas ajudam a gente a personalizar sua jornada desde o primeiro dia.'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <SeletorPergunta
          idGrupo="grupo-foco"
          titulo={ingles ? 'What do you most want to transform?' : 'O que mais deseja transformar?'}
          opcoes={OPCOES_FOCO}
          labelsEn={FOCO_EN}
          ingles={ingles}
          valor={dados.foco}
          aoEscolher={(v) => escolher('foco', v)}
          permiteOutro
          valorOutro={dados.focoOutro}
          aoMudarOutro={(v) => atualizar('focoOutro', v)}
          placeholderOutro={ingles ? 'e.g. eating without guilt on weekends' : 'ex: comer sem culpa nos fins de semana'}
        />
        <SeletorPergunta
          idGrupo="grupo-obstaculo"
          titulo={ingles ? 'When do you usually give up?' : 'Em que momento costuma desistir?'}
          opcoes={OPCOES_OBSTACULO}
          labelsEn={OBSTACULO_EN}
          ingles={ingles}
          valor={dados.obstaculo}
          aoEscolher={(v) => escolher('obstaculo', v)}
          permiteOutro
          valorOutro={dados.obstaculoOutro}
          aoMudarOutro={(v) => atualizar('obstaculoOutro', v)}
          placeholderOutro={ingles ? 'e.g. when I travel' : 'ex: quando viajo'}
        />
        <SeletorPergunta
          idGrupo="grupo-rotina"
          titulo={ingles ? 'How is your routine today?' : 'Como está sua rotina hoje?'}
          opcoes={OPCOES_ROTINA}
          labelsEn={ROTINA_EN}
          ingles={ingles}
          valor={dados.rotina}
          aoEscolher={(v) => escolher('rotina', v)}
          permiteOutro
          valorOutro={dados.rotinaOutro}
          aoMudarOutro={(v) => atualizar('rotinaOutro', v)}
          placeholderOutro={ingles ? 'e.g. changes every week' : 'ex: muda toda semana'}
        />
        <SeletorPergunta
          idGrupo="grupo-sentimento"
          titulo={ingles ? 'What do you hope to feel at the end of the 90 days?' : 'O que espera sentir ao final dos 90 dias?'}
          opcoes={OPCOES_SENTIMENTO_ESPERADO}
          labelsEn={SENTIMENTO_EN}
          ingles={ingles}
          valor={dados.sentimentoEsperado}
          aoEscolher={(v) => escolher('sentimentoEsperado', v)}
          permiteOutro
          valorOutro={dados.sentimentoEsperadoOutro}
          aoMudarOutro={(v) => atualizar('sentimentoEsperadoOutro', v)}
          placeholderOutro={ingles ? 'e.g. proud of my choices' : 'ex: orgulhosa das minhas escolhas'}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar} disabled={!valido}>
          {ingles ? 'Continue' : 'Continuar'}
        </Botao>
        <Botao variante="secundario" onClick={voltar}>
          {ingles ? 'Back' : 'Voltar'}
        </Botao>
      </div>
    </>
  )
}
