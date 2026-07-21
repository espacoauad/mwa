import { useMemo, useState } from 'react'
import { Calculator, Flame, Trash2, Search, BookOpen } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ALIMENTOS, macrosDoAlimento } from '../../data/alimentos.js'
import { TIPOS_EXERCICIO, INTENSIDADES, calcularGastoCalorico } from '../../data/exercicios.js'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import JogoColheita from '../game/JogoColheita.jsx'
import JogoEscolhas from '../game/JogoEscolhas.jsx'
import JogoTreino from '../game/JogoTreino.jsx'
import JogoMente from '../game/JogoMente.jsx'
import JogoRestaurante from '../game/JogoRestaurante.jsx'
import LenteConsciencia from './LenteConsciencia.jsx'
import JogoPoda from '../game/JogoPoda.jsx'
import JogoPlantio from '../game/JogoPlantio.jsx'
import VersiculoDoDiaModal from './VersiculoDoDiaModal.jsx'
import ReforcandoConceitos from './ReforcandoConceitos.jsx'
import { diaLiberacaoJogo, jogoLiberado } from '../../utils/jogosLiberacao.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

function CalculadoraMacros() {
  const { ingles } = useIdioma()
  const { abrirModalRefeicao } = useApp()
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
      <p className="mt-1 text-sm text-verde/60">{ingles ? 'Look up any food in the database in seconds.' : 'Consulte qualquer alimento do banco em segundos.'}</p>

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
            <Botao variante="ouro" onClick={() => abrirModalRefeicao()}>
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
  const { usuario, exerciciosHoje, gastoExercicios, adicionarExercicio, removerExercicio } = useApp()
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
      <p className="mt-1 text-sm text-verde/60">
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
                intensidade === i.id ? 'border-sage bg-sage-claro text-verde' : 'border-sage/25 bg-white text-verde/60'
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
          <p className="text-xs text-verde/60">
            {ingles ? `estimated for ${duracao} minutes of this activity` : `é o que você "libera" com ${duracao} min de ${tipo.nome.toLowerCase()}`} 🎉
          </p>
        </div>
      )}

      <div className="mt-3">
        <Botao onClick={registrar} disabled={!gasto}>
          {ingles ? 'Log in my day' : 'Registrar no meu dia'}
        </Botao>
      </div>

      {exerciciosHoje.length > 0 && (
        <div className="mt-4 border-t border-cinza pt-3">
          <p className="text-xs font-semibold text-verde/60">
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
                    className="text-verde/40 hover:text-red-700"
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

const JOGOS = [
  {
    id: 'colheita',
    emoji: '🍓',
    titulo: 'Jogo da Colheita',
    desc: 'Combine 3 frutas e relaxe. 300+ pontos = +10 🌱 por dia',
  },
  {
    id: 'escolhas',
    emoji: '🥗',
    titulo: 'Jogo das Escolhas',
    desc: 'Seu avatar apanha o saudável e desvia da besteira. 300+ pontos = +10 🌱 por dia',
  },
  {
    id: 'treino',
    emoji: '💪',
    titulo: 'Jogo do Treino',
    desc: 'Toque nos exercícios que acenderem. 300+ pontos = +10 🌱 por dia',
  },
  {
    id: 'poda',
    emoji: '✂️',
    titulo: 'Jogo da Poda',
    desc: 'Toque só nos hábitos que precisam ser podados. 300+ pontos = +10 🌱 por dia',
  },
  {
    id: 'plantio',
    emoji: '🌱',
    titulo: 'Jogo do Plantio',
    desc: 'Cultive seus hábitos respondendo desafios sobre os 30 dias. 16 acertos = +10 🌱 por dia',
  },
  {
    id: 'restaurante',
    emoji: '🍽️',
    titulo: 'Restaurante Saudável',
    desc: 'Seja a chef e monte pratos saudáveis para os clientes. 300+ pontos = +10 🌱 por dia',
  },
  {
    id: 'mente',
    emoji: '🌷',
    titulo: 'Jardim de Afirmações',
    desc: 'Colha mensagens positivas para sua mente. Complete = +15 🌱 por dia',
  },
]

const JOGOS_EN = {
  colheita: ['Harvest Game', 'Match 3 fruits and relax. 300+ points = +10 🌱 per day'],
  escolhas: ['Choices Game', 'Catch healthy foods and avoid junk food. 300+ points = +10 🌱 per day'],
  treino: ['Workout Game', 'Tap the exercises as they light up. 300+ points = +10 🌱 per day'],
  poda: ['Pruning Game', 'Tap only the habits that need pruning. 300+ points = +10 🌱 per day'],
  plantio: ['Planting Game', 'Grow your habits over 21 days by answering challenges. 16 correct = +10 🌱 per day'],
  restaurante: ['Healthy Restaurant', 'Be the chef and prepare healthy plates. 300+ points = +10 🌱 per day'],
  mente: ['Affirmation Garden', 'Harvest positive messages for your mind. Complete it = +15 🌱 per day'],
}

export default function Ferramentas() {
  const { ingles } = useIdioma()
  const { diaAtual } = useApp()
  const [jogoAberto, setJogoAberto] = useState(false)
  const [escolhasAberto, setEscolhasAberto] = useState(false)
  const [treinoAberto, setTreinoAberto] = useState(false)
  const [podaAberto, setPodaAberto] = useState(false)
  const [plantioAberto, setPlantioAberto] = useState(false)
  const [menteAberto, setMenteAberto] = useState(false)
  const [restauranteAberto, setRestauranteAberto] = useState(false)
  const [lenteAberta, setLenteAberta] = useState(false)
  const [versiculoAberto, setVersiculoAberto] = useState(false)
  const [conceitosAberto, setConceitosAberto] = useState(false)

  const abrirJogo = {
    colheita: () => setJogoAberto(true),
    escolhas: () => setEscolhasAberto(true),
    treino: () => setTreinoAberto(true),
    poda: () => setPodaAberto(true),
    plantio: () => setPlantioAberto(true),
    restaurante: () => setRestauranteAberto(true),
    mente: () => setMenteAberto(true),
  }

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Tools' : 'Ferramentas'}</h1>
      <p className="mb-4 mt-1 text-sm text-verde/60">{ingles ? 'Calculators and resources for your daily routine.' : 'Calculadoras para o seu dia a dia.'}</p>
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
          <span className="text-sm text-verde/60">
            {ingles
              ? 'Nutritional density, caloric deficit, macros and more — the why behind the method.'
              : 'Densidade nutricional, déficit calórico, macros e mais — o porquê por trás do método.'}
          </span>
        </span>
      </button>

      {/* Jogos: liberados aos poucos, 1 novo a cada 3 dias */}
      {JOGOS.map((jogo) => {
        const liberado = jogoLiberado(jogo.id, diaAtual)
        return (
          <button
            key={jogo.id}
            type="button"
            onClick={liberado ? abrirJogo[jogo.id] : undefined}
            disabled={!liberado}
            className={`mt-3 flex w-full items-center gap-4 rounded-2xl p-5 text-left transition-transform first:mt-4 ${
              liberado
                ? 'bg-gradient-to-r from-sage-claro to-ouro-claro active:scale-[0.99]'
                : 'cursor-not-allowed bg-cinza/50 opacity-70'
            }`}
          >
            <span className="text-3xl">{liberado ? jogo.emoji : '🔒'}</span>
            <span className="flex-1">
              <span className="block font-serif text-lg font-semibold italic text-verde">{ingles ? JOGOS_EN[jogo.id][0] : jogo.titulo}</span>
              <span className="text-sm text-verde/60">
                {liberado ? (ingles ? JOGOS_EN[jogo.id][1] : jogo.desc) : (ingles ? `Unlocks on day ${diaLiberacaoJogo(jogo.id)} of your program` : `Libera no dia ${diaLiberacaoJogo(jogo.id)} do seu programa`)}
              </span>
            </span>
          </button>
        )
      })}

      {/* A Lente da Consciência: ferramenta de pausa guiada */}
      <section className="mt-6 rounded-2xl border-2 border-verde/20 bg-gradient-to-br from-verde/5 to-sage-claro/30 p-6">
        <div className="mb-4">
          <h2 className="font-serif text-lg font-semibold italic text-verde">🔍 {ingles ? 'The Awareness Lens' : 'A Lente da Consciência'}</h2>
          <p className="mt-1 text-sm text-verde/70">
            {ingles ? 'A guided pause to step out of autopilot and choose with clarity.' : 'Uma ferramenta de pausa guiada para sair do automático e escolher com clareza.'}
          </p>
        </div>
        <p className="mb-4 text-xs text-verde/60">
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
          <p className="mt-1 text-sm text-verde/70">
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
      {jogoAberto && <JogoColheita onFechar={() => setJogoAberto(false)} />}
      {restauranteAberto && <JogoRestaurante onFechar={() => setRestauranteAberto(false)} />}
      {escolhasAberto && <JogoEscolhas onFechar={() => setEscolhasAberto(false)} />}
      {treinoAberto && <JogoTreino onFechar={() => setTreinoAberto(false)} />}
      {podaAberto && <JogoPoda onFechar={() => setPodaAberto(false)} />}
      {plantioAberto && <JogoPlantio onFechar={() => setPlantioAberto(false)} />}
      {menteAberto && <JogoMente onFechar={() => setMenteAberto(false)} />}
      {lenteAberta && <LenteConsciencia onFechar={() => setLenteAberta(false)} />}
      {versiculoAberto && <VersiculoDoDiaModal onFechar={() => setVersiculoAberto(false)} />}
      {conceitosAberto && <ReforcandoConceitos onFechar={() => setConceitosAberto(false)} />}

      {/* Padding final */}
      <div className="pb-8" />
    </div>
  )
}
