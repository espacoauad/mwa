import { useState } from 'react'
import { Check } from 'lucide-react'
import { Section, Eyebrow, Title, CtaButton } from '../components/ui.jsx'
import Reveal from '../components/Reveal.jsx'
import { track } from '../lib/analytics.js'

/* ---------- Conteúdo oficial do quiz (verbatim do briefing) ---------- */
const perguntas = [
  {
    id: 'p1',
    texto: 'Como começa a sua manhã?',
    opcoes: [
      { letra: 'A', texto: 'Café da manhã com calma' },
      { letra: 'B', texto: 'Qualquer coisa, correndo' },
      { letra: 'C', texto: 'Costumo pular o café' },
    ],
  },
  {
    id: 'p2',
    texto: 'E no fim da tarde?',
    opcoes: [
      { letra: 'A', texto: 'Lanche que eu planejei' },
      { letra: 'B', texto: 'Belisco o que aparecer' },
      { letra: 'C', texto: 'Seguro a fome até o jantar' },
    ],
  },
  {
    id: 'p3',
    texto: 'Água ao longo do dia?',
    opcoes: [
      { letra: 'A', texto: '2 litros ou mais' },
      { letra: 'B', texto: 'Alguns copos, quando lembro' },
      { letra: 'C', texto: 'Quase nada' },
    ],
  },
  {
    id: 'p4',
    texto: 'Quando "sai da linha", o que acontece?',
    opcoes: [
      { letra: 'A', texto: 'Sigo normal na próxima refeição' },
      { letra: 'B', texto: 'Culpa — e compenso restringindo' },
      { letra: 'C', texto: 'Desisto e recomeço na segunda' },
    ],
  },
  {
    id: 'p5',
    texto: 'Suas refeições têm horário?',
    opcoes: [
      { letra: 'A', texto: 'Quase sempre' },
      { letra: 'B', texto: 'Cada dia é diferente' },
      { letra: 'C', texto: 'Como quando dá' },
    ],
  },
]

const perfis = {
  A: {
    titulo: 'Fundação pronta',
    texto:
      'Você já tem base — o que falta é método para a consistência virar resultado. Os 30 dias do MWA organizam o que você já sabe em prática diária.',
  },
  B: {
    titulo: 'Piloto automático',
    texto:
      'Suas escolhas estão acontecendo sem você perceber. O MWA devolve a consciência: registro simples, um passo por dia, sem culpa.',
  },
  C: {
    titulo: 'Rotina no limite',
    texto:
      'Hoje a rotina decide por você. O MWA começa pequeno — um passo por dia — para você retomar o controle sem virar a vida do avesso.',
  },
}

/* Regra de desempate: maioria de respostas define o perfil; em caso de
 * empate entre letras, prevalece a resposta dada em P4 (índice 3). */
function calcularPerfil(respostas) {
  const contagem = { A: 0, B: 0, C: 0 }
  respostas.forEach((letra) => {
    if (letra) contagem[letra] += 1
  })
  const maior = Math.max(contagem.A, contagem.B, contagem.C)
  const empatadas = Object.keys(contagem).filter((letra) => contagem[letra] === maior)
  return empatadas.length === 1 ? empatadas[0] : respostas[3]
}

export default function Quiz() {
  const [fase, setFase] = useState('quiz') // 'quiz' | 'captura' | 'resultado'
  const [passo, setPasso] = useState(0)
  const [respostas, setRespostas] = useState([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [aceitou, setAceitou] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [perfilResultado, setPerfilResultado] = useState(null)

  const perguntaAtual = perguntas[passo]
  const respondidas = respostas.filter(Boolean).length
  const progresso = fase === 'quiz' ? respondidas / perguntas.length : 1

  function responder(letra) {
    const novasRespostas = [...respostas]
    novasRespostas[passo] = letra
    setRespostas(novasRespostas)

    setTimeout(() => {
      if (passo < perguntas.length - 1) {
        setPasso(passo + 1)
      } else {
        setFase('captura')
      }
    }, 280)
  }

  async function handleCaptureSubmit(event) {
    event.preventDefault()
    if (!nome || !email || !aceitou) return

    const perfil = calcularPerfil(respostas)
    setEnviando(true)

    try {
      const resposta = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'quiz-mwa',
          nome,
          email,
          perfil,
          respostas: respostas.join(''),
          consentimento: 'sim',
          'bot-field': '',
        }).toString(),
      })
      if (resposta.ok) track('Lead')
    } catch (erro) {
      console.warn('[quiz-mwa] Netlify Forms indisponível (esperado em dev local):', erro)
    }

    setEnviando(false)
    setPerfilResultado(perfil)
    setFase('resultado')
  }

  return (
    <Section id="quiz" className="bg-cream">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Mini-autoavaliação</Eyebrow>
          <Title>Qual hábito está sabotando você?</Title>
          <p className="mt-4 text-base leading-relaxed text-ink/75 md:text-lg">
            5 perguntas, 1 minuto — descubra por onde a sua mudança começa.
          </p>
          <p className="mt-2 text-xs text-mist">
            Autoavaliação educativa de hábitos — não é diagnóstico clínico.
          </p>
        </Reveal>
      </div>

      <Reveal delay={120} className="mx-auto mt-10 max-w-xl">
        <div className="rounded-[2rem] border border-forest/10 bg-white p-8 shadow-xl shadow-forest/5 md:p-10">
          {/* Barra de progresso — dourada, motion transform-only (scaleX) */}
          <div
            className="h-1 w-full overflow-hidden rounded-full bg-forest/10"
            role="progressbar"
            aria-valuenow={Math.round(progresso * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso do mini-diagnóstico"
          >
            <div
              className="h-full origin-left rounded-full bg-gold transition-transform duration-500 ease-out"
              style={{ transform: `scaleX(${progresso})` }}
            />
          </div>

          {fase === 'quiz' && (
            <fieldset className="mt-8 border-0 p-0">
              <legend className="font-display text-xl text-forest-deep md:text-2xl">
                {perguntaAtual.texto}
              </legend>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-mist">
                Pergunta {passo + 1} de {perguntas.length}
              </p>

              <div className="mt-6 space-y-3">
                {perguntaAtual.opcoes.map((opcao) => {
                  const id = `${perguntaAtual.id}-${opcao.letra}`
                  const marcada = respostas[passo] === opcao.letra
                  return (
                    <label
                      key={opcao.letra}
                      htmlFor={id}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 text-left text-sm transition-colors duration-300 md:text-base ${
                        marcada
                          ? 'border-sage bg-sage/10'
                          : 'border-forest/10 hover:border-forest/25'
                      }`}
                    >
                      <input
                        type="radio"
                        id={id}
                        name={perguntaAtual.id}
                        value={opcao.letra}
                        checked={marcada}
                        onChange={() => responder(opcao.letra)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 ${
                          marcada ? 'border-sage bg-sage' : 'border-forest/25'
                        }`}
                      >
                        {marcada && <Check size={14} strokeWidth={3} className="text-cream" />}
                      </span>
                      <span className="text-ink/85">{opcao.texto}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>
          )}

          {fase === 'captura' && (
            <form onSubmit={handleCaptureSubmit} className="mt-8 space-y-5">
              <p className="text-sm leading-relaxed text-ink/75">
                Quase lá. Deixe seus dados para ver o seu resultado.
              </p>

              <div>
                <label htmlFor="quiz-nome" className="mb-2 block text-sm font-medium text-forest">
                  Nome
                </label>
                <input
                  id="quiz-nome"
                  type="text"
                  autoComplete="name"
                  required
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-forest/15 bg-offwhite px-4 py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-sage focus-visible:ring-2 focus-visible:ring-gold"
                />
              </div>

              <div>
                <label htmlFor="quiz-email" className="mb-2 block text-sm font-medium text-forest">
                  E-mail
                </label>
                <input
                  id="quiz-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-xl border border-forest/15 bg-offwhite px-4 py-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-sage focus-visible:ring-2 focus-visible:ring-gold"
                />
              </div>

              <label htmlFor="quiz-consentimento" className="flex items-start gap-3 text-left text-xs leading-relaxed text-ink/75 md:text-sm">
                <input
                  id="quiz-consentimento"
                  type="checkbox"
                  required
                  checked={aceitou}
                  onChange={(event) => setAceitou(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-forest/30 text-sage focus-visible:ring-2 focus-visible:ring-gold"
                />
                <span>
                  Concordo em receber conteúdos do MWA por e-mail. Leia a{' '}
                  <a
                    href="#"
                    data-todo="politica"
                    className="underline decoration-gold underline-offset-2 hover:text-forest"
                  >
                    política de privacidade
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={enviando}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest px-9 py-4 text-sm font-semibold tracking-wide text-cream transition-all duration-300 hover:bg-forest-deep hover:shadow-xl hover:shadow-forest/25 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
              >
                Ver meu resultado
              </button>
            </form>
          )}

          {fase === 'resultado' && perfilResultado && (
            <div className="mt-8 text-center">
              <Eyebrow>Seu resultado</Eyebrow>
              <h3 className="font-display text-2xl text-forest-deep md:text-3xl">
                {perfis[perfilResultado].titulo}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/80 md:text-base">
                {perfis[perfilResultado].texto}
              </p>
              <CtaButton className="mt-8">Quero começar meus 30 dias</CtaButton>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  )
}
