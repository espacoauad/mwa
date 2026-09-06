// Stub do AppContext usado só no demo: simula recompensa e estado sem Supabase.
// userId nulo faz a camada de progresso operar apenas em memória.
import { createContext, useContext, useState } from 'react'
import { estrelasDaSemana, metasCumpridas } from '../../src/utils/jogos/estrelas.js'

const hoje = new Date()
const hojeISO = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`

// Toda função de recompensa usada pelos jogos precisa existir aqui — senão o demo
// diverge do app real e esconde ou inventa problemas.
const RECOMPENSAS_SIMULADAS = [
  'registrarJogoPrato',
  'registrarJogoVerdadeiroFalso',
  'registrarJogoTroca',
  'registrarJogoSaciedade',
  'registrarJogoRotulos',
  'registrarJogoCorrida',
  'registrarJoguinho',
  'registrarMomentoMwa',
]

const PADRAO = {
  userId: null,
  hoje: hojeISO,
  ...Object.fromEntries(
    RECOMPENSAS_SIMULADAS.map((nome) => [
      nome,
      async () => console.log(`[demo] ${nome} chamado (recompensa simulada)`),
    ]),
  ),
}

const DemoContext = createContext(null)

// cenario: 'apagada' | 'acesa' | 'completa'
export function DemoAppProvider({ cenario = 'apagada', children }) {
  const semana = estrelasDaSemana(hojeISO, []).map((dia) => {
    if (cenario === 'completa') return { ...dia, acesa: true }
    if (dia.futuro) return dia
    // 'apagada' acende só os dias já passados; 'acesa' inclui o de hoje
    if (dia.hoje) return { ...dia, acesa: cenario === 'acesa' }
    return { ...dia, acesa: true }
  })

  const tarefas =
    cenario === 'apagada'
      ? { refeicao: true, agua: false, dica: false, jogo: false }
      : { refeicao: true, agua: true, dica: true, jogo: true }

  const valor = {
    ...PADRAO,
    tarefasHoje: tarefas,
    metasEstrela: metasCumpridas(tarefas, { jogouHoje: tarefas.jogo }),
    semanaEstrelas: semana,
    estrelaHojeAcesa: semana.find((d) => d.hoje)?.acesa ?? false,
  }
  return <DemoContext.Provider value={valor}>{children}</DemoContext.Provider>
}

export function useApp() {
  return useContext(DemoContext) ?? PADRAO
}

// Provider para exibir a aba Ferramentas REAL, sem login — diaAtual alto o
// bastante para os jogos aparecerem liberados.
export function DemoFerramentasProvider({ diaAtual = 20, children }) {
  const [exerciciosHoje, setExerciciosHoje] = useState([])

  function adicionarExercicio(ex) {
    setExerciciosHoje((atuais) => [...atuais, { ...ex, id: String(Date.now()) }])
  }
  function removerExercicio(id) {
    setExerciciosHoje((atuais) => atuais.filter((e) => e.id !== id))
  }

  const valor = {
    ...PADRAO,
    diaAtual,
    usuario: { peso: 65, altura: 165, idade: 30, sexo: 'feminino', nivelAtividade: 'moderado' },
    exerciciosHoje,
    gastoExercicios: exerciciosHoje.reduce((s, e) => s + (e.gastoCalorico ?? 0), 0),
    adicionarExercicio,
    removerExercicio,
    abrirEscolhaRefeicao: () => console.log('[demo] abrirEscolhaRefeicao chamado'),
  }
  return <DemoContext.Provider value={valor}>{children}</DemoContext.Provider>
}
