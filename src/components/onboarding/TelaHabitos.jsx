import Botao from '../ui/Botao.jsx'
import SeletorPergunta from './SeletorPergunta.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import {
  OPCOES_SONO,
  OPCOES_HIDRATACAO,
  OPCOES_HABITOS_ALIMENTARES,
  OPCOES_INTESTINO,
  OPCOES_DISPOSICAO,
} from '../../utils/personalizacao.js'

const SONO_EN = {
  bem_disposta: 'I sleep well and wake up rested',
  cansada: 'I sleep, but wake up tired',
  pouco: 'I sleep little (less than 6h)',
  irregular: 'Irregular sleep, varies a lot',
  prefiro_nao_responder: 'Prefer not to say',
}

const HIDRATACAO_EN = {
  bastante: 'I drink plenty of water every day',
  pouca: 'I drink little water, I forget',
  so_com_sede: 'I only drink when very thirsty',
  troca_por_outras: 'I swap water for other drinks (coffee, juice, soda)',
  prefiro_nao_responder: 'Prefer not to say',
}

const HABITOS_ALIMENTARES_EN = {
  equilibrados: 'Balanced, but I want to improve',
  desorganizados: 'Disorganized, I eat whatever',
  restritivos: 'Very restrictive, diet after diet',
  exagero_fds: 'Good, but I overdo it on weekends',
  prefiro_nao_responder: 'Prefer not to say',
}

const INTESTINO_EN = {
  regular: 'Works well, regular',
  preso: 'Constipated, frequently',
  irregular: 'Very irregular, varies a lot',
  prefiro_nao_responder: 'Prefer not to say',
}

const DISPOSICAO_EN = {
  alta: 'High, I feel energetic',
  cansaco_maior_parte: 'Tired most of the time',
  so_manha: 'Only in the morning, I tire throughout the day',
  vai_e_volta: 'Comes and goes, depends on the day',
  prefiro_nao_responder: 'Prefer not to say',
}

export default function TelaHabitos({ dados, atualizar, avancar, voltar }) {
  const { ingles } = useIdioma()

  return (
    <>
      <div className="mb-6">
        <span className="mb-3 inline-block rounded-full bg-sage-claro px-3 py-1 text-xs font-semibold text-verde">
          {ingles ? 'Optional, but recommended' : 'Opcional, mas recomendado'}
        </span>
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">
          {ingles ? 'Your habits today' : 'Seus hábitos hoje'}
        </h1>
        <p className="mt-3 text-verde/70">
          {ingles
            ? 'This helps us give you more accurate tips throughout the journey.'
            : 'Isso nos ajuda a te dar dicas mais certeiras ao longo da jornada.'}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <SeletorPergunta
          idGrupo="grupo-sono"
          titulo={ingles ? 'How is your sleep?' : 'Como está seu sono?'}
          opcoes={OPCOES_SONO}
          labelsEn={SONO_EN}
          ingles={ingles}
          valor={dados.sono}
          aoEscolher={(v) => atualizar('sono', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-hidratacao"
          titulo={ingles ? 'How is your hydration?' : 'Como está sua hidratação?'}
          opcoes={OPCOES_HIDRATACAO}
          labelsEn={HIDRATACAO_EN}
          ingles={ingles}
          valor={dados.hidratacao}
          aoEscolher={(v) => atualizar('hidratacao', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-habitos-alimentares"
          titulo={ingles ? 'How do you rate your eating habits today?' : 'Como você considera seus hábitos alimentares hoje?'}
          opcoes={OPCOES_HABITOS_ALIMENTARES}
          labelsEn={HABITOS_ALIMENTARES_EN}
          ingles={ingles}
          valor={dados.habitosAlimentares}
          aoEscolher={(v) => atualizar('habitosAlimentares', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-intestino"
          titulo={ingles ? 'How is your digestion?' : 'Como está seu intestino?'}
          opcoes={OPCOES_INTESTINO}
          labelsEn={INTESTINO_EN}
          ingles={ingles}
          valor={dados.intestino}
          aoEscolher={(v) => atualizar('intestino', v)}
        />
        <SeletorPergunta
          idGrupo="grupo-disposicao"
          titulo={ingles ? 'How is your energy day-to-day?' : 'Como está sua disposição no dia a dia?'}
          opcoes={OPCOES_DISPOSICAO}
          labelsEn={DISPOSICAO_EN}
          ingles={ingles}
          valor={dados.disposicao}
          aoEscolher={(v) => atualizar('disposicao', v)}
        />
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar}>{ingles ? 'Continue' : 'Continuar'}</Botao>
        <button type="button" onClick={avancar} className="flex min-h-11 items-center justify-center py-1 text-sm font-medium text-verde/70 underline">
          {ingles ? 'Skip this step' : 'Pular esta etapa'}
        </button>
        <Botao variante="secundario" onClick={voltar}>
          {ingles ? 'Back' : 'Voltar'}
        </Botao>
      </div>
    </>
  )
}
