import { lazy, Suspense, useMemo, useState } from 'react'
import { Calculator, Flame, Trash2, Search, BookOpen } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ALIMENTOS, macrosDoAlimento } from '../../data/alimentos.js'
import { TIPOS_EXERCICIO, INTENSIDADES, calcularGastoCalorico } from '../../data/exercicios.js'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import CarregandoFallback from '../ui/CarregandoFallback.jsx'
import LenteConsciencia from './LenteConsciencia.jsx'
import VersiculoDoDiaModal from './VersiculoDoDiaModal.jsx'
import ReforcandoConceitos from './ReforcandoConceitos.jsx'
import SeletorDeDia from '../ui/SeletorDeDia.jsx'
import { diaLiberacaoJogo, jogoLiberado } from '../../utils/jogosLiberacao.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Jogos de gamificação só abrem sob interação — carregados sob demanda para
// reduzir o bundle principal (cada um é um mini-jogo com bastante lógica própria).
const MonteSeuPrato = lazy(() => import('../game/MonteSeuPrato.jsx'))
const JogoVerdadeiroFalso = lazy(() => import('../game/JogoVerdadeiroFalso.jsx'))
const JogoTrocaInteligente = lazy(() => import('../game/JogoTrocaInteligente.jsx'))
const JogoBatalhaSaciedade = lazy(() => import('../game/JogoBatalhaSaciedade.jsx'))
const JogoDetetiveRotulos = lazy(() => import('../game/JogoDetetiveRotulos.jsx'))
const JogoColheita = lazy(() => import('../game/JogoColheita.jsx'))
const MwaFarm = lazy(() => import('../game/MwaFarm.jsx'))

function CalculadoraMacros() {
  const { ingles } = useIdioma()
  const { abrirEscolhaRefeicao } = useApp()
  const [busca, setBusca] = useState('')
  const [alimentoId, setAlimentoId] = useState(null)
  const [quantidade, setQuantidade] = useState('')

  const alimento = ALIMENTOS.find((a) => a.id === alimentoId)
  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return []
    return ALIMENTOS.filter((a) => a.nome.toLowerCase().includes(q)).slice(0, 6)
  }, [busca])

  const macros = alimento && Number(quantidade) > 0 ? macrosDoAlimento(alimento, Number(quantidade)) : null

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
      <h2 className="flex items-center gap-2 font-semibold text-verde">
        <Calculator size={18} className="text-sage" /> {ingles ? 'Macro calculator' : 'Calculadora de macros'}
      </h2>
      <p className="mt-1 text-sm text-verde/80">{ingles ? 'Look up any food in the database in seconds.' : 'Consulte qualquer alimento do banco em segundos.'}</p>

      <div className="mt-3 flex items-center gap-2 rounded-lg border-2 border-sage/30 bg-white px-3 focus-within:border-sage">
        <Search size={16} className="text-verde/40" />
        <input
          type="text"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setAlimentoId(null)
          }}
          placeholder={ingles ? 'Example: sweet potato, shake, egg…' : 'Ex.: batata-doce, shake, ovo...'}
          aria-label={ingles ? 'Search food' : 'Buscar alimento'}
          className="w-full py-3 font-medium text-verde outline-none"
        />
      </div>

      {resultados.length > 0 && !alimento && (
        <ul className="mt-2 overflow-hidden rounded-lg border border-cinza">
          {resultados.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  setAlimentoId(a.id)
                  setQuantidade(String(a.porcao))
                  setBusca(a.nome)
                }}
                className="w-full px-3 py-2.5 text-left text-sm text-verde/80 transition-colors hover:bg-sage-claro"
              >
                {a.suplemento && '🌿 '}
                {a.nome}
              </button>
            </li>
          ))}
        </ul>
      )}

      {alimento && (
        <>
          <div className="mt-3">
            <CampoNumero label={ingles ? 'Quantity' : 'Quantidade'} sufixo="g" value={quantidade} onChange={setQuantidade} />
          </div>
          {macros && (
            <div className="mt-3 grid grid-cols-5 gap-1 rounded-lg bg-verde p-3 text-center text-white">
              {[
                ['kcal', macros.calorias],
                ['prot', `${macros.proteina}g`],
                ['carb', `${macros.carbos}g`],
                ['gord', `${macros.gordura}g`],
                ['fibra', `${macros.fibras}g`],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-sm font-bold text-ouro">{v}</p>
                  <p className="text-[10px] text-white/60">{l}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3">
            <Botao variante="ouro" onClick={() => abrirEscolhaRefeicao()}>
              {ingles ? 'Add to my day →' : 'Adicionar ao meu dia →'}
            </Botao>
          </div>
        </>
      )}
    </section>
  )
}

function CalculadoraExercicio() {
  const { ingles, locale } = useIdioma()
  const { usuario, exerciciosHoje, gastoExercicios, adicionarExercicio, removerExercicio, carregandoDia } = useApp()
  const [tipoId, setTipoId] = useState('caminhada')
  const [intensidade, setIntensidade] = useState('moderada')
  const [duracao, setDuracao] = useState('')

  const gasto = calcularGastoCalorico(tipoId, intensidade, Number(duracao), usuario.peso)
  const tipo = TIPOS_EXERCICIO.find((t) => t.id === tipoId)

  function registrar() {
    adicionarExercicio({
      tipo: tipo.nome,
      emoji: tipo.emoji,
      intensidade,
      duracaoMin: Number(duracao),
      gastoCalorico: gasto,
    })
    setDuracao('')
  }

  return (
    <section className="mt-4 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
      <h2 className="flex items-center gap-2 font-semibold text-verde">
        <Flame size={18} className="text-ouro" /> {ingles ? 'Physical activity' : 'Atividade física'}
      </h2>
      <p className="mt-1 text-sm text-verde/80">
        {ingles ? `Estimate calories burned using the MET method and your weight of ${usuario.peso} kg.` : `Calcule seu gasto calórico (método MET, com base no seu peso de ${usuario.peso} kg).`}
      </p>

      <label className="mt-3 block">
        <span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Exercise' : 'Exercício'}</span>
        <select
          value={tipoId}
          onChange={(e) => setTipoId(e.target.value)}
          className="w-full rounded-lg border-2 border-sage/30 bg-white px-3 py-3.5 font-medium text-verde outline-none focus:border-sage"
        >
          {TIPOS_EXERCICIO.map((t) => (
            <option key={t.id} value={t.id}>
              {t.emoji} {t.nome}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3">
        <span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Intensity' : 'Intensidade'}</span>
        <div className="grid grid-cols-3 gap-2">
          {INTENSIDADES.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => setIntensidade(i.id)}
              title={i.descricao}
              className={`rounded-lg border-2 py-2.5 text-sm font-semibold transition-all ${
                intensidade === i.id ? 'border-sage bg-sage-claro text-verde' : 'border-sage/25 bg-white text-verde/80'
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <CampoNumero label={ingles ? 'Duration' : 'Duração'} sufixo="min" value={duracao} onChange={setDuracao} placeholder={ingles ? 'Example: 40' : 'Ex.: 40'} />
      </div>

      {gasto > 0 && (
        <div className="mt-3 rounded-lg bg-ouro-claro p-4 text-center">
          <p className="text-2xl font-bold text-verde">≈ {gasto} kcal</p>
          <p className="text-xs text-verde/80">
            {ingles ? `estimated for ${duracao} minutes of this activity` : `é o que você "libera" com ${duracao} min de ${tipo.nome.toLowerCase()}`} 🎉
          </p>
        </div>
      )}

      <div className="mt-3">
        <Botao onClick={registrar} disabled={!gasto || carregandoDia}>
          {ingles ? 'Log in my day' : 'Registrar no meu dia'}
        </Botao>
      </div>

      {exerciciosHoje.length > 0 && (
        <div className="mt-4 border-t border-cinza pt-3">
          <p className="text-xs font-semibold text-verde/80">
            {ingles ? 'Today' : 'Hoje'} · {ingles ? 'total' : 'total'} {gastoExercicios.toLocaleString(locale)} kcal
          </p>
          <ul className="mt-2 flex flex-col gap-2">
            {exerciciosHoje.map((e) => (
              <li key={e.id} className="flex items-center justify-between rounded-lg bg-creme px-3 py-2 text-sm">
                <span className="font-medium text-verde">
                  {e.emoji} {e.tipo} · {e.duracaoMin} min
                </span>
                <span className="flex items-center gap-2">
                  <strong className="text-verde">{e.gastoCalorico} kcal</strong>
                  <button
                    type="button"
                    aria-label={`${ingles ? 'Delete' : 'Excluir'} ${e.tipo}`}
                    onClick={() => removerExercicio(e.id)}
                    className="flex min-h-11 min-w-11 items-center justify-center text-verde/40 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

// Prateleira A — jogos que ensinam nutrição de verdade (progressão e missões)
const JOGOS_NUTRICAO = [
  {
    id: 'prato',
    emoji: '🍽️',
    titulo: 'Monte Seu Prato',
    desc: 'Cumpra missões montando pratos de verdade e aprenda com cada escolha. Missão concluída = +10 🌱 por dia',
  },
  {
    id: 'vf',
    emoji: '🤔',
    titulo: 'Verdadeiro, Falso ou Depende',
    desc: 'Nem tudo em nutrição é sim ou não. Cada resposta vem com a explicação. Rodada concluída = +10 🌱 por dia',
  },
  {
    id: 'troca',
    emoji: '🔄',
    titulo: 'Troca Inteligente',
    desc: 'Melhore uma refeição sem abrir mão dela e veja o impacto de cada troca. Rodada concluída = +10 🌱 por dia',
  },
  {
    id: 'saciedade',
    emoji: '⚖️',
    titulo: 'Batalha da Saciedade',
    desc: 'Mesmas calorias, fomes diferentes: descubra o que faz uma refeição sustentar mais. Rodada = +10 🌱 por dia',
  },
  {
    id: 'rotulos',
    emoji: '🔍',
    titulo: 'Detetive dos Rótulos',
    desc: 'Aprenda a ler a tabela nutricional e a diferença entre porção e embalagem. Rodada = +10 🌱 por dia',
  },
]

// Prateleira B — pausa leve, sem promessa educativa
const JOGOS_PAUSA = [
  {
    id: 'colheita',
    emoji: '🍓',
    titulo: 'Jogo da Colheita',
    desc: 'Um respiro para a mente: combine 3 frutas e relaxe. 300+ pontos = +10 🌱 por dia',
  },
]

const JOGOS_EN = {
  prato: ['Build Your Plate', 'Complete missions by building real plates and learn from every choice. Mission done = +10 🌱 per day'],
  vf: ['True, False or It Depends', 'Not everything in nutrition is yes or no. Every answer comes with an explanation. Round done = +10 🌱 per day'],
  troca: ['Smart Swap', 'Improve a meal without giving it up and see the impact of each swap. Round done = +10 🌱 per day'],
  saciedade: ['Satiety Battle', 'Same calories, different hunger: find out what makes a meal last longer. Round = +10 🌱 per day'],
  rotulos: ['Label Detective', 'Learn to read the nutrition table and the difference between serving and package. Round = +10 🌱 per day'],
  colheita: ['Harvest Game', 'A breather for your mind: match 3 fruits and relax. 300+ points = +10 🌱 per day'],
}

function CardJogo({ jogo, diaAtual, ingles, onAbrir }) {
  const liberado = jogoLiberado(jogo.id, diaAtual)
  return (
    <button
      type="button"
      onClick={liberado ? () => onAbrir(jogo.id) : undefined}
      disabled={!liberado}
      className={`mt-3 flex w-full items-center gap-4 rounded-2xl p-5 text-left transition-transform ${
        liberado
          ? 'bg-gradient-to-r from-sage-claro to-ouro-claro active:scale-[0.99]'
          : 'cursor-not-allowed bg-cinza/50 opacity-70'
      }`}
    >
      <span className="text-3xl">{liberado ? jogo.emoji : '🔒'}</span>
      <span className="flex-1">
        <span className="block font-serif text-lg font-semibold italic text-verde">
          {ingles ? JOGOS_EN[jogo.id][0] : jogo.titulo}
        </span>
        <span className="text-sm text-verde/80">
          {liberado
            ? ingles ? JOGOS_EN[jogo.id][1] : jogo.desc
            : ingles
              ? `Unlocks on day ${diaLiberacaoJogo(jogo.id)} of your program`
              : `Libera no dia ${diaLiberacaoJogo(jogo.id)} do seu programa`}
        </span>
      </span>
    </button>
  )
}

export default function Ferramentas() {
  const { ingles } = useIdioma()
  const { diaAtual } = useApp()
  // Um único estado guarda qual jogo está aberto (null = nenhum)
  const [jogoAtivo, setJogoAtivo] = useState(null)
  const [lenteAberta, setLenteAberta] = useState(false)
  const [versiculoAberto, setVersiculoAberto] = useState(false)
  const [conceitosAberto, setConceitosAberto] = useState(false)

  const fecharJogo = () => setJogoAtivo(null)

  return (
    <div className="px-5 pt-10">
      <SeletorDeDia />
      <h1 className="mt-3 font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Tools' : 'Ferramentas'}</h1>
      <p className="mb-4 mt-1 text-sm text-verde/80">{ingles ? 'Calculators and resources for your daily routine.' : 'Calculadoras para o seu dia a dia.'}</p>
      <CalculadoraMacros />
      <CalculadoraExercicio />

      {/* Reforçando Conceitos: glossário nutricional de apoio ao método */}
      <button
        type="button"
        onClick={() => setConceitosAberto(true)}
        className="mt-4 flex w-full items-center gap-4 rounded-2xl border-2 border-sage/30 bg-white p-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="rounded-full bg-sage-claro p-3">
          <BookOpen size={24} className="text-sage" strokeWidth={1.5} />
        </span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-semibold italic text-verde">
            {ingles ? 'Reinforcing Concepts' : 'Reforçando Conceitos'}
          </span>
          <span className="text-sm text-verde/80">
            {ingles
              ? 'Nutritional density, caloric deficit, macros and more — the why behind the method.'
              : 'Densidade nutricional, déficit calórico, macros e mais — o porquê por trás do método.'}
          </span>
        </span>
      </button>

      {/* MWA FARM: fazenda animada que cresce sozinha ao longo da jornada */}
      <button
        type="button"
        onClick={() => setJogoAtivo('fazenda')}
        className="mt-4 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-sky-100 to-sage-claro p-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="text-3xl">🌻</span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-semibold italic text-verde">MWA FARM</span>
          <span className="text-sm text-verde/80">
            {ingles
              ? 'Watch your farm grow on its own, day by day, as your journey unfolds.'
              : 'Veja sua fazenda crescer sozinha, dia a dia, conforme sua jornada avança.'}
          </span>
        </span>
      </button>

      {/* Prateleira A — jogos de nutrição, liberados aos poucos */}
      <h2 className="mt-8 font-serif text-lg font-semibold italic text-verde">
        {ingles ? 'Nutrition games' : 'Jogos de Nutrição'}
      </h2>
      <p className="mb-1 mt-0.5 text-sm text-verde/70">
        {ingles
          ? 'Learn by playing what you use at every meal.'
          : 'Aprenda brincando o que você usa em cada refeição.'}
      </p>
      {JOGOS_NUTRICAO.map((jogo) => (
        <CardJogo key={jogo.id} jogo={jogo} diaAtual={diaAtual} ingles={ingles} onAbrir={setJogoAtivo} />
      ))}

      {/* Prateleira B — pausa leve */}
      <h2 className="mt-8 font-serif text-lg font-semibold italic text-verde">
        {ingles ? 'Pause and care' : 'Pausa e Cuidado'}
      </h2>
      <p className="mb-1 mt-0.5 text-sm text-verde/70">
        {ingles ? 'A light break, with no lesson attached.' : 'Um respiro leve, sem lição para aprender.'}
      </p>
      {JOGOS_PAUSA.map((jogo) => (
        <CardJogo key={jogo.id} jogo={jogo} diaAtual={diaAtual} ingles={ingles} onAbrir={setJogoAtivo} />
      ))}

      {/* A Lente da Consciência: ferramenta de pausa guiada */}
      <section className="mt-6 rounded-2xl border-2 border-verde/20 bg-gradient-to-br from-verde/5 to-sage-claro/30 p-6">
        <div className="mb-4">
          <h2 className="font-serif text-lg font-semibold italic text-verde">🔍 {ingles ? 'The Awareness Lens' : 'A Lente da Consciência'}</h2>
          <p className="mt-1 text-sm text-verde/80">
            {ingles ? 'A guided pause to step out of autopilot and choose with clarity.' : 'Uma ferramenta de pausa guiada para sair do automático e escolher com clareza.'}
          </p>
        </div>
        <p className="mb-4 text-xs text-verde/80">
          <span className="italic">{ingles ? '“Awareness is not rigid control. It is learning to listen to yourself before acting on autopilot.”' : '"Consciência não é controle rígido. É aprender a se escutar antes de agir no automático."'}</span>
        </p>
        <button
          type="button"
          onClick={() => setLenteAberta(true)}
          className="w-full rounded-full bg-verde px-6 py-3 font-semibold text-white transition-all active:scale-95"
        >
          {ingles ? 'Open tool' : 'Abrir ferramenta'}
        </button>
      </section>

      {/* Versículo do Dia: Reflexão Espiritual */}
      <section className="mt-6 rounded-2xl border-2 border-ouro/20 bg-gradient-to-br from-ouro/5 to-sage-claro/30 p-6">
        <div className="mb-4">
          <h2 className="font-serif text-lg font-semibold italic text-verde">✨ {ingles ? 'Verse of the Day' : 'Versículo do Dia'}</h2>
          <p className="mt-1 text-sm text-verde/80">
            {ingles ? 'A reflection to inspire your journey.' : 'Uma reflexão para inspirar sua jornada.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVersiculoAberto(true)}
          className="w-full rounded-full bg-ouro px-6 py-3 font-semibold text-verde transition-all active:scale-95 hover:bg-ouro/90"
        >
          {ingles ? 'Open verse' : 'Abrir versículo'}
        </button>
      </section>

      {/* Modais dos Jogos */}
      <Suspense fallback={<CarregandoFallback />}>
        {jogoAtivo === 'prato' && <MonteSeuPrato onFechar={fecharJogo} />}
        {jogoAtivo === 'vf' && <JogoVerdadeiroFalso onFechar={fecharJogo} />}
        {jogoAtivo === 'troca' && <JogoTrocaInteligente onFechar={fecharJogo} />}
        {jogoAtivo === 'saciedade' && <JogoBatalhaSaciedade onFechar={fecharJogo} />}
        {jogoAtivo === 'rotulos' && <JogoDetetiveRotulos onFechar={fecharJogo} />}
        {jogoAtivo === 'colheita' && <JogoColheita onFechar={fecharJogo} />}
        {jogoAtivo === 'fazenda' && <MwaFarm onFechar={fecharJogo} />}
      </Suspense>
      {lenteAberta && <LenteConsciencia onFechar={() => setLenteAberta(false)} />}
      {versiculoAberto && <VersiculoDoDiaModal onFechar={() => setVersiculoAberto(false)} />}
      {conceitosAberto && <ReforcandoConceitos onFechar={() => setConceitosAberto(false)} />}

      {/* Padding final */}
      <div className="pb-8" />
    </div>
  )
}
