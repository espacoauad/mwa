import { useEffect, useState } from 'react'
import { X, Play, RotateCcw, Zap, Award } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

// Jogo do Plantio — cultive seus hábitos dos 30 dias respondendo desafios sobre cada pilar
// Cada acerto faz a planta crescer (semente → broto → planta)
// 8 pilares diferentes, 2 desafios por pilar = 16 desafios total
// Ganhe 🌱 ao acertar todos os 16 desafios

const PILARES = [
  {
    id: 'alimentacao',
    nome: 'Alimentação',
    nomeEN: 'Nutrition',
    emoji: '🍎',
    cor: 'bg-red-50 border-red-200',
    titulo: 'Escolha dos Alimentos',
  },
  {
    id: 'hidratacao',
    nome: 'Hidratação',
    nomeEN: 'Hydration',
    emoji: '💧',
    cor: 'bg-blue-50 border-blue-200',
    titulo: 'Ingestão de Água',
  },
  {
    id: 'movimento',
    nome: 'Movimento',
    nomeEN: 'Movement',
    emoji: '🏃',
    cor: 'bg-orange-50 border-orange-200',
    titulo: 'Atividade Física',
  },
  {
    id: 'sono',
    nome: 'Sono',
    nomeEN: 'Sleep',
    emoji: '😴',
    cor: 'bg-indigo-50 border-indigo-200',
    titulo: 'Qualidade do Sono',
  },
  {
    id: 'planejamento',
    nome: 'Planejamento',
    nomeEN: 'Planning',
    emoji: '📋',
    cor: 'bg-amber-50 border-amber-200',
    titulo: 'Organização da Rotina',
  },
  {
    id: 'macros',
    nome: 'Balanço',
    nomeEN: 'Balance',
    emoji: '⚖️',
    cor: 'bg-lime-50 border-lime-200',
    titulo: 'Controle de Macros',
  },
  {
    id: 'digestao',
    nome: 'Digestão',
    nomeEN: 'Digestion',
    emoji: '🧠',
    cor: 'bg-teal-50 border-teal-200',
    titulo: 'Saúde Intestinal',
  },
  {
    id: 'calorias',
    nome: 'Calorias',
    nomeEN: 'Calories',
    emoji: '📊',
    cor: 'bg-pink-50 border-pink-200',
    titulo: 'Controle Calórico',
  },
]

// Desafios por pilar (2 por pilar)
const DESAFIOS = {
  alimentacao: [
    {
      pergunta: 'Qual é a melhor receita para um shake proteico saudável?',
      perguntaEN: 'What is the best recipe for a healthy protein shake?',
      opcoes: [
        { texto: 'Apenas pó proteico com água', respostaEN: 'Only protein powder with water', correto: false },
        { texto: 'Leite + fruta inteira + pó proteico', respostaEN: 'Milk + whole fruit + protein powder', correto: true },
        { texto: 'Leite condensado + açúcar + pó proteico', respostaEN: 'Condensed milk + sugar + protein powder', correto: false },
      ],
    },
    {
      pergunta: 'Como garantir consistência nas refeições?',
      perguntaEN: 'How to ensure meal consistency?',
      opcoes: [
        { texto: 'Fazer as mesmas refeições', respostaEN: 'Same meals', correto: true },
        { texto: 'Comer conforme sinta vontade', respostaEN: 'Eat as you want', correto: false },
        { texto: 'Pular refeições para acelerar', respostaEN: 'Skip meals', correto: false },
      ],
    },
  ],
  hidratacao: [
    {
      pergunta: 'Quantos litros de água você deve beber?',
      perguntaEN: 'How much water should you drink daily?',
      opcoes: [
        { texto: '1 litro por dia', respostaEN: '1 liter per day', correto: false },
        { texto: '2-3 litros por dia (segundo seu peso)', respostaEN: '2-3 liters daily', correto: true },
        { texto: 'Só quando tem sede', respostaEN: 'Only when thirsty', correto: false },
      ],
    },
    {
      pergunta: 'Qual é o melhor momento para hidratar?',
      perguntaEN: 'Best time to hydrate?',
      opcoes: [
        { texto: 'Antes de dormir', respostaEN: 'Before sleeping', correto: false },
        { texto: 'Ao longo do dia, de forma equilibrada', respostaEN: 'Throughout the day', correto: true },
        { texto: 'Tudo de uma vez pela manhã', respostaEN: 'All in the morning', correto: false },
      ],
    },
  ],
  movimento: [
    {
      pergunta: 'Com que frequência você deve se movimentar?',
      perguntaEN: 'How often should you move?',
      opcoes: [
        { texto: 'Só finais de semana', respostaEN: 'Only weekends', correto: false },
        { texto: 'Diariamente (20-30 min)', respostaEN: 'Daily (20-30 min)', correto: true },
        { texto: 'Raramente', respostaEN: 'Rarely', correto: false },
      ],
    },
    {
      pergunta: 'Qual atividade é melhor para iniciar?',
      perguntaEN: 'Best activity to start with?',
      opcoes: [
        { texto: 'Academia pesada', respostaEN: 'Heavy gym', correto: false },
        { texto: 'Caminhada, alongamento ou dança', respostaEN: 'Walking or stretching', correto: true },
        { texto: 'Nenhuma (repouso total)', respostaEN: 'None (rest)', correto: false },
      ],
    },
  ],
  sono: [
    {
      pergunta: 'Quantas horas de sono você precisa?',
      perguntaEN: 'How many hours of sleep do you need?',
      opcoes: [
        { texto: '4-5 horas', respostaEN: '4-5 hours', correto: false },
        { texto: '7-9 horas', respostaEN: '7-9 hours', correto: true },
        { texto: 'Depende do dia', respostaEN: 'Depends on the day', correto: false },
      ],
    },
    {
      pergunta: 'Como melhorar a qualidade do sono?',
      perguntaEN: 'How to improve sleep quality?',
      opcoes: [
        { texto: 'Usar celular antes de dormir', respostaEN: 'Use phone before bed', correto: false },
        { texto: 'Horário consistente + quarto escuro', respostaEN: 'Consistent schedule + dark room', correto: true },
        { texto: 'Beber café à noite', respostaEN: 'Drink coffee at night', correto: false },
      ],
    },
  ],
  planejamento: [
    {
      pergunta: 'Quando você deve planejar a rotina?',
      perguntaEN: 'When should you plan?',
      opcoes: [
        { texto: 'Conforme as coisas acontecem', respostaEN: 'As things happen', correto: false },
        { texto: 'No final do dia (próximo dia)', respostaEN: 'Day before/evening', correto: true },
        { texto: 'Nunca (deixar fluir)', respostaEN: 'Never (go with flow)', correto: false },
      ],
    },
    {
      pergunta: 'O que deve incluir no seu planejamento?',
      perguntaEN: 'What to include in planning?',
      opcoes: [
        { texto: 'Apenas trabalho', respostaEN: 'Only work', correto: false },
        { texto: 'Refeições, exercícios, sono, trabalho', respostaEN: 'Meals, exercise, sleep, work', correto: true },
        { texto: 'Nada (improvisar)', respostaEN: 'Nothing (improvise)', correto: false },
      ],
    },
  ],
  macros: [
    {
      pergunta: 'Qual é a divisão ideal de macronutrientes?',
      perguntaEN: 'Ideal macronutrient split?',
      opcoes: [
        { texto: 'Só carboidratos', respostaEN: 'Only carbs', correto: false },
        { texto: 'Proteína, carboidratos e gordura equilibrados', respostaEN: 'Balanced proteins, carbs, fats', correto: true },
        { texto: 'Sem regra definida', respostaEN: 'No rules', correto: false },
      ],
    },
    {
      pergunta: 'Por que controlar os macros?',
      perguntaEN: 'Why track macros?',
      opcoes: [
        { texto: 'É inútil', respostaEN: 'Pointless', correto: false },
        { texto: 'Garante energia e recuperação muscular', respostaEN: 'Ensures energy & recovery', correto: true },
        { texto: 'Só para atletas profissionais', respostaEN: 'Only for pros', correto: false },
      ],
    },
  ],
  digestao: [
    {
      pergunta: 'Como melhorar a saúde intestinal?',
      perguntaEN: 'How to improve gut health?',
      opcoes: [
        { texto: 'Suplementos caros', respostaEN: 'Expensive supplements', correto: false },
        { texto: 'Fibra, probióticos naturais e hidratação', respostaEN: 'Fiber, probiotics & water', correto: true },
        { texto: 'Ignorar completamente', respostaEN: 'Ignore it', correto: false },
      ],
    },
    {
      pergunta: 'Qual alimento é melhor para o intestino?',
      perguntaEN: 'Best food for gut?',
      opcoes: [
        { texto: 'Alimentos ultraprocessados', respostaEN: 'Ultra-processed foods', correto: false },
        { texto: 'Frutas, verduras e alimentos naturais', respostaEN: 'Fruits, veggies & whole foods', correto: true },
        { texto: 'Não importa', respostaEN: 'Doesn\'t matter', correto: false },
      ],
    },
  ],
  calorias: [
    {
      pergunta: 'Como rastrear suas calorias?',
      perguntaEN: 'How to track calories?',
      opcoes: [
        { texto: 'Adivinhar sem pensar', respostaEN: 'Just guess', correto: false },
        { texto: 'Usar app ou anotar refeições', respostaEN: 'Use app or write down', correto: true },
        { texto: 'Não precisa rastrear', respostaEN: 'No need to track', correto: false },
      ],
    },
    {
      pergunta: 'Qual é a importância do déficit calórico?',
      perguntaEN: 'Why is calorie deficit important?',
      opcoes: [
        { texto: 'Não importa nada', respostaEN: 'Doesn\'t matter', correto: false },
        { texto: 'Cria perda de peso sustentável', respostaEN: 'Creates sustainable weight loss', correto: true },
        { texto: 'É perigoso', respostaEN: 'It\'s dangerous', correto: false },
      ],
    },
  ],
}

const ESTAGIOS_CRESCIMENTO = ['🌱', '🌿', '🌳']

export default function JogoPlantio({ onFechar }) {
  const { ingles } = useIdioma()
  const { registrarJogoPlantio } = useApp()
  const [fase, setFase] = useState('inicio')
  const [acertos, setAcertos] = useState(0)
  const [desafiocurrentIndex, setDesafioCurrentIndex] = useState(0)
  const [desafioAtual, setDesafioAtual] = useState(null)
  const [pilarAtual, setPilarAtual] = useState(null)
  const [progressoPlanta, setProgressoPlanta] = useState({}) // {pilarId: estagio}
  const [premioDado, setPremioDado] = useState(false)
  const [feedback, setFeedback] = useState(null)

  // Inicializar progresso das plantas
  useEffect(() => {
    const prog = {}
    PILARES.forEach((p) => {
      prog[p.id] = 0
    })
    setProgressoPlanta(prog)
  }, [])

  function comecar() {
    setAcertos(0)
    setDesafioCurrentIndex(0)
    setFeedback(null)
    setProgressoPlanta(
      PILARES.reduce((acc, p) => {
        acc[p.id] = 0
        return acc
      }, {})
    )
    setPremioDado(false)
    carregarDesafio(0)
    setFase('jogando')
  }

  function carregarDesafio(idx) {
    if (idx >= 16) {
      setFase('fim')
      return
    }

    const pilarIdx = Math.floor(idx / 2)
    const pilar = PILARES[pilarIdx]
    const desafioIdx = idx % 2

    setPilarAtual(pilar)
    setDesafioAtual(DESAFIOS[pilar.id][desafioIdx])
    setDesafioCurrentIndex(idx)
  }

  function responder(correto) {
    if (correto) {
      const novoAcerto = acertos + 1
      setAcertos(novoAcerto)
      setFeedback({ bom: true, texto: ingles ? 'Correct! 🌱 Growing...' : 'Correto! 🌱 Crescendo...' })

      // Atualizar crescimento da planta
      setProgressoPlanta((prev) => ({
        ...prev,
        [pilarAtual.id]: Math.min(2, prev[pilarAtual.id] + 1),
      }))

      setTimeout(() => {
        carregarDesafio(desafiocurrentIndex + 1)
      }, 1200)
    } else {
      setFeedback({ bom: false, texto: ingles ? 'Oops! Try again.' : 'Ops! Tente novamente.' })
      setTimeout(() => {
        setFeedback(null)
      }, 1000)
    }
  }

  // Premia ao terminar
  useEffect(() => {
    if (fase === 'fim' && acertos === 16 && !premioDado) {
      registrarJogoPlantio().then(() => setPremioDado(true))
    }
  }, [fase])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sage/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-creme p-6">
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold italic text-sage">
              {ingles ? 'Planting Game' : 'Jogo do Plantio'} 🌱
            </h2>
            <p className="text-xs text-sage/60">
              {ingles ? 'Grow your habits over 21 days by answering challenges' : 'Cultive seus hábitos respondendo desafios'}
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-full bg-sage/10 p-2 text-sage hover:bg-sage/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tela inicial */}
        {fase === 'inicio' && (
          <div className="rounded-2xl bg-sage/85 p-8 text-center text-white">
            <p className="text-5xl mb-4">🌱 → 🌿 → 🌳</p>
            <p className="mb-4 text-sm max-w-sm mx-auto">
              {ingles
                ? 'You have 8 seeds to grow. Each seed represents a pillar of your 30-day journey. Answer 2 questions per pillar. Every correct answer makes your plant grow. '
                : 'Você tem 8 sementes para cultivar. Cada uma representa um pilar dos seus 30 dias. Responda 2 perguntas por pilar. Cada acerto faz a planta crescer.'}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs max-w-xs mx-auto mb-6">
              {PILARES.map((p) => (
                <div key={p.id} className="flex items-center gap-1">
                  <span className="text-lg">{p.emoji}</span>
                  <span className="text-white/80">{ingles ? p.nomeEN : p.nome}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={comecar}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-sage hover:bg-creme transition-colors"
            >
              <Play size={18} /> {ingles ? 'Start Planting' : 'Começar a Plantar'}
            </button>
          </div>
        )}

        {/* Tela de jogo */}
        {fase === 'jogando' && desafioAtual && (
          <div>
            {/* Barra de progresso */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-bold text-sage">{desafiocurrentIndex + 1}/16 desafios</span>
                <span className="text-sage/60">{acertos} acertos</span>
              </div>
              <div className="w-full h-2 bg-sage/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sage transition-all duration-500"
                  style={{ width: `${((desafiocurrentIndex + 1) / 16) * 100}%` }}
                />
              </div>
            </div>

            {/* Pilar e pergunta */}
            <div className={`rounded-2xl border-2 p-6 mb-6 ${pilarAtual?.cor}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{pilarAtual?.emoji}</span>
                <div>
                  <h3 className="font-bold text-sage">{ingles ? pilarAtual?.nomeEN : pilarAtual?.nome}</h3>
                  <p className="text-xs text-sage/60">{pilarAtual?.titulo}</p>
                </div>
              </div>

              <p className="font-semibold text-sage text-lg mb-6">
                {ingles ? desafioAtual.perguntaEN : desafioAtual.pergunta}
              </p>

              {/* Opções */}
              <div className="space-y-2">
                {desafioAtual.opcoes.map((opcao, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => responder(opcao.correto)}
                    className="w-full rounded-xl bg-white/70 hover:bg-white p-3 text-left text-sm font-medium text-sage transition-colors border-2 border-transparent hover:border-sage"
                  >
                    {ingles ? opcao.respostaEN : opcao.texto}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`mt-4 rounded-lg p-3 text-center text-sm font-bold ${
                    feedback.bom ? 'bg-sage/10 text-sage' : 'bg-red-100 text-red-600'
                  }`}
                >
                  {feedback.texto}
                </div>
              )}
            </div>

            {/* Jardim em crescimento */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {PILARES.map((pilar) => (
                <div key={pilar.id} className="text-center">
                  <div className="text-3xl mb-1">{ESTAGIOS_CRESCIMENTO[progressoPlanta[pilar.id] || 0]}</div>
                  <p className="text-[10px] text-sage/60 truncate">{ingles ? pilar.nomeEN : pilar.nome}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tela final */}
        {fase === 'fim' && (
          <div className="rounded-2xl bg-sage/85 p-8 text-center text-white">
            <p className="text-5xl mb-4">{acertos === 16 ? '🏆' : '🌱'}</p>
            <p className="font-serif text-2xl font-semibold italic mb-2">
              {acertos === 16
                ? ingles
                  ? 'Garden Flourished!'
                  : 'Jardim Floresceu!'
                : ingles
                  ? 'Good Planting!'
                  : 'Bom Plantio!'}
            </p>
            <p className="text-sm text-white/80 mb-1">
              {ingles ? 'Correct answers' : 'Respostas corretas'}: {acertos}/16
            </p>

            {/* Plantas finais */}
            <div className="mt-6 grid grid-cols-4 gap-2 max-w-xs mx-auto mb-6">
              {PILARES.map((pilar) => (
                <div key={pilar.id} className="text-center">
                  <div className="text-4xl mb-1">{ESTAGIOS_CRESCIMENTO[progressoPlanta[pilar.id] || 0]}</div>
                  <p className="text-xs text-white/70">{pilar.emoji}</p>
                </div>
              ))}
            </div>

            {premioDado && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-yellow-300 px-4 py-2 font-bold text-sage">
                <Zap size={16} /> +10 🌱 {ingles ? 'earned!' : 'ganhas!'}
              </div>
            )}

            <button
              type="button"
              onClick={comecar}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-sage hover:bg-creme transition-colors"
            >
              <RotateCcw size={16} /> {ingles ? 'Plant Again' : 'Plantar de Novo'}
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-[11px] text-sage/50">
          {ingles ? 'Get all 16 correct for +10' : 'Acerte os 16 desafios e ganhe +10'} 🌱
        </p>
      </div>
    </div>
  )
}
