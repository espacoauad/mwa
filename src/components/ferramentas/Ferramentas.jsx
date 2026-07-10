import { useMemo, useState } from 'react'
import { Calculator, Flame, Trash2, Search } from 'lucide-react'
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

function CalculadoraMacros() {
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
        <Calculator size={18} className="text-sage" /> Calculadora de macros
      </h2>
      <p className="mt-1 text-sm text-verde/60">Consulte qualquer alimento do banco em segundos.</p>

      <div className="mt-3 flex items-center gap-2 rounded-lg border-2 border-sage/30 bg-white px-3 focus-within:border-sage">
        <Search size={16} className="text-verde/40" />
        <input
          type="text"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value)
            setAlimentoId(null)
          }}
          placeholder="Ex.: batata-doce, shake, ovo..."
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
                {a.herbalife && '🌿 '}
                {a.nome}
              </button>
            </li>
          ))}
        </ul>
      )}

      {alimento && (
        <>
          <div className="mt-3">
            <CampoNumero label="Quantidade" sufixo="g" value={quantidade} onChange={setQuantidade} />
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
              Adicionar ao meu dia →
            </Botao>
          </div>
        </>
      )}
    </section>
  )
}

function CalculadoraExercicio() {
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
        <Flame size={18} className="text-ouro" /> Atividade física
      </h2>
      <p className="mt-1 text-sm text-verde/60">
        Calcule seu gasto calórico (método MET, com base no seu peso de {usuario.peso} kg).
      </p>

      <label className="mt-3 block">
        <span className="mb-2 block text-sm font-semibold text-verde">Exercício</span>
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
        <span className="mb-2 block text-sm font-semibold text-verde">Intensidade</span>
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
        <CampoNumero label="Duração" sufixo="min" value={duracao} onChange={setDuracao} placeholder="Ex.: 40" />
      </div>

      {gasto > 0 && (
        <div className="mt-3 rounded-lg bg-ouro-claro p-4 text-center">
          <p className="text-2xl font-bold text-verde">≈ {gasto} kcal</p>
          <p className="text-xs text-verde/60">
            é o que você "libera" com {duracao} min de {tipo.nome.toLowerCase()} 🎉
          </p>
        </div>
      )}

      <div className="mt-3">
        <Botao onClick={registrar} disabled={!gasto}>
          Registrar no meu dia
        </Botao>
      </div>

      {exerciciosHoje.length > 0 && (
        <div className="mt-4 border-t border-cinza pt-3">
          <p className="text-xs font-semibold text-verde/60">
            Hoje · total {gastoExercicios.toLocaleString('pt-BR')} kcal
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
                    aria-label={`Excluir ${e.tipo}`}
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

export default function Ferramentas() {
  const [jogoAberto, setJogoAberto] = useState(false)
  const [escolhasAberto, setEscolhasAberto] = useState(false)
  const [treinoAberto, setTreinoAberto] = useState(false)
  const [menteAberto, setMenteAberto] = useState(false)
  const [restauranteAberto, setRestauranteAberto] = useState(false)
  const [lenteAberta, setLenteAberta] = useState(false)

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">Ferramentas</h1>
      <p className="mb-4 mt-1 text-sm text-verde/60">Calculadoras para o seu dia a dia.</p>
      <CalculadoraMacros />
      <CalculadoraExercicio />

      {/* Jogo da Colheita: passatempo que rende sementes */}
      <button
        type="button"
        onClick={() => setJogoAberto(true)}
        className="mt-4 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="text-3xl">🍓</span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-semibold italic text-verde">Jogo da Colheita</span>
          <span className="text-sm text-verde/60">
            Combine 3 frutas e relaxe. 300+ pontos = <strong className="text-verde">+10 🌱</strong> por dia
          </span>
        </span>
      </button>

      {/* Jogo das Escolhas: o avatar apanha comida saudável */}
      <button
        type="button"
        onClick={() => setEscolhasAberto(true)}
        className="mt-3 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-ouro-claro to-sage-claro p-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="text-3xl">🥗</span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-semibold italic text-verde">Jogo das Escolhas</span>
          <span className="text-sm text-verde/60">
            Seu avatar apanha o saudável e desvia da besteira. 300+ pontos = <strong className="text-verde">+10 🌱</strong> por dia
          </span>
        </span>
      </button>

      {/* Jogo do Treino: reflexo temático de atividade física */}
      <button
        type="button"
        onClick={() => setTreinoAberto(true)}
        className="mt-3 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="text-3xl">💪</span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-semibold italic text-verde">Jogo do Treino</span>
          <span className="text-sm text-verde/60">
            Toque nos exercícios que acenderem. 300+ pontos = <strong className="text-verde">+10 🌱</strong> por dia
          </span>
        </span>
      </button>

      {/* Jardim de Afirmações: mensagens positivas */}
      <button
        type="button"
        onClick={() => setMenteAberto(true)}
        className="mt-3 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-ouro-claro to-sage-claro p-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="text-3xl">🌷</span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-semibold italic text-verde">Jardim de Afirmações</span>
          <span className="text-sm text-verde/60">
            Colha mensagens positivas para sua mente. Complete = <strong className="text-verde">+15 🌱</strong> por dia
          </span>
        </span>
      </button>

      {/* Restaurante Saudável: monte pratos saudáveis para os clientes */}
      <button
        type="button"
        onClick={() => setRestauranteAberto(true)}
        className="mt-3 flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r from-sage-claro to-ouro-claro p-5 text-left transition-transform active:scale-[0.99]"
      >
        <span className="text-3xl">🍽️</span>
        <span className="flex-1">
          <span className="block font-serif text-lg font-semibold italic text-verde">Restaurante Saudável</span>
          <span className="text-sm text-verde/60">
            Seja a chef e monte pratos saudáveis para os clientes. 300+ pontos = <strong className="text-verde">+10 🌱</strong> por dia
          </span>
        </span>
      </button>

      {/* A Lente da Consciência: ferramenta de pausa guiada */}
      <section className="mt-6 rounded-2xl border-2 border-verde/20 bg-gradient-to-br from-verde/5 to-sage-claro/30 p-6">
        <div className="mb-4">
          <h2 className="font-serif text-lg font-semibold italic text-verde">🔍 A Lente da Consciência</h2>
          <p className="mt-1 text-sm text-verde/70">
            Uma ferramenta de pausa guiada para sair do automático e escolher com clareza.
          </p>
        </div>
        <p className="mb-4 text-xs text-verde/60">
          <span className="italic">"Consciência não é controle rígido. É aprender a se escutar antes de agir no automático."</span>
        </p>
        <button
          type="button"
          onClick={() => setLenteAberta(true)}
          className="w-full rounded-full bg-verde px-6 py-3 font-semibold text-white transition-all active:scale-95"
        >
          Abrir ferramenta
        </button>
      </section>

      {jogoAberto && <JogoColheita onFechar={() => setJogoAberto(false)} />}
      {restauranteAberto && <JogoRestaurante onFechar={() => setRestauranteAberto(false)} />}
      {escolhasAberto && <JogoEscolhas onFechar={() => setEscolhasAberto(false)} />}
      {treinoAberto && <JogoTreino onFechar={() => setTreinoAberto(false)} />}
      {menteAberto && <JogoMente onFechar={() => setMenteAberto(false)} />}
      {lenteAberta && <LenteConsciencia onFechar={() => setLenteAberta(false)} />}
    </div>
  )
}
