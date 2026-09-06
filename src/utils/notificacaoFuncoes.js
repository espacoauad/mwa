// Lembrete diário rotativo das funções do app (Reforçando Conceitos,
// exercício, Lente da Consciência, um jogo diferente cada
// sexta, Versículo do Dia aos domingos) — dispara na primeira abertura
// do app do dia, sem esperar horário (diferente do lembrete da Estrela
// do Dia, que espera até 18h). Reaproveita a permissão de notificação já
// pedida por src/utils/notificacoesReminder.js — não pede de novo aqui.
//
// Os 6 jogos abaixo são copiados de src/components/ferramentas/Ferramentas.jsx
// (JOGOS_NUTRICAO + JOGOS_PAUSA) em vez de importados de lá: este arquivo
// é carregado por `node --test`, que não interpreta .jsx — importar um
// .jsx direto quebra com ERR_UNKNOWN_FILE_EXTENSION.
const JOGOS_SEXTA = [
  {
    id: 'prato',
    titulo: '🍽️ Bora montar seu prato?',
    corpo: 'Cumpra missões montando pratos de verdade e aprenda com cada escolha.',
    tituloEn: '🍽️ Ready to build your plate?',
    corpoEn: 'Complete missions by building real plates and learn from every choice.',
  },
  {
    id: 'vf',
    titulo: '🤔 Verdadeiro, falso ou depende?',
    corpo: 'Nem tudo em nutrição é preto no branco — teste o que você sabe.',
    tituloEn: '🤔 True, false, or it depends?',
    corpoEn: 'Not everything in nutrition is black and white — test what you know.',
  },
  {
    id: 'troca',
    titulo: '🔄 Que tal uma Troca Inteligente?',
    corpo: 'Melhore uma refeição sem abrir mão dela e veja o impacto de cada troca.',
    tituloEn: '🔄 How about a Smart Swap?',
    corpoEn: 'Improve a meal without giving it up and see the impact of each swap.',
  },
  {
    id: 'saciedade',
    titulo: '⚖️ Qual sustenta mais?',
    corpo: 'Mesmas calorias, fomes diferentes — descubra na Batalha da Saciedade.',
    tituloEn: '⚖️ Which one keeps you full longer?',
    corpoEn: 'Same calories, different hunger — find out in the Satiety Battle.',
  },
  {
    id: 'rotulos',
    titulo: '🔍 Vire um Detetive dos Rótulos',
    corpo: 'Aprenda a ler a tabela nutricional e a diferença entre porção e embalagem.',
    tituloEn: '🔍 Become a Label Detective',
    corpoEn: 'Learn to read the nutrition table and the difference between serving and package.',
  },
  {
    id: 'colheita',
    titulo: '🍓 Um respiro pra mente',
    corpo: 'Combine 3 frutas e relaxe um pouco no Jogo da Colheita.',
    tituloEn: '🍓 A breather for your mind',
    corpoEn: 'Match 3 fruits and relax a little in the Harvest Game.',
  },
]

export function podeNotificar() {
  return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
}

// Decide qual função lembrar hoje, a partir do dia da semana real
// (calendário, não dia do programa). Retorna um id fixo, ou null nos
// dias sem lembrete (quarta e sábado).
export function funcaoDoDia(dataISO) {
  const diaSemana = new Date(`${dataISO}T00:00:00`).getDay() // 0=domingo .. 6=sábado
  const mapa = { 0: 'versiculo', 1: 'conceitos', 2: 'exercicio', 3: null, 4: 'lente', 5: 'jogo', 6: null }
  return mapa[diaSemana]
}

// Escolhe qual dos 6 jogos é o "jogo da semana" — revezando pela lista a
// cada 7 dias de diaAtual (dia do programa, sempre >= 1), ciclo completo
// de 6 semanas (42 dias).
export function jogoDaSemana(diaAtual) {
  const indice = Math.floor((diaAtual - 1) / 7) % JOGOS_SEXTA.length
  return JOGOS_SEXTA[indice]
}

function mensagemFuncao(tipo, diaAtual, ingles) {
  if (tipo === 'conceitos') {
    return ingles
      ? { titulo: '📖 Have you checked out Reinforcing Concepts today?', corpo: 'Nutritional density, caloric deficit and more, in just a few minutes.' }
      : { titulo: '📖 Já deu uma olhada no Reforçando Conceitos hoje?', corpo: 'Densidade nutricional, déficit calórico e mais, em poucos minutos.' }
  }
  if (tipo === 'exercicio') {
    return ingles
      ? { titulo: '🔥 Have you exercised today?', corpo: 'Log it and see how it helps your calorie goal.' }
      : { titulo: '🔥 Já fez exercício hoje?', corpo: 'Registre e veja quanto isso ajuda na sua meta de calorias.' }
  }
  if (tipo === 'lente') {
    return ingles
      ? { titulo: '🔍 Before acting on autopilot...', corpo: 'A guided pause under a minute is waiting in the Awareness Lens.' }
      : { titulo: '🔍 Antes de agir no automático...', corpo: 'Uma pausa guiada de menos de um minuto te espera na Lente da Consciência.' }
  }
  if (tipo === 'jogo') {
    const jogo = jogoDaSemana(diaAtual)
    return ingles ? { titulo: jogo.tituloEn, corpo: jogo.corpoEn } : { titulo: jogo.titulo, corpo: jogo.corpo }
  }
  if (tipo === 'versiculo') {
    return ingles
      ? { titulo: '✨ A reflection for today', corpo: 'The Verse of the Day is waiting for you.' }
      : { titulo: '✨ Uma reflexão pra hoje', corpo: 'O Versículo do Dia está te esperando.' }
  }
  return null
}

// Dispara o lembrete de função do dia — no máximo 1x por pessoa por dia,
// na primeira abertura do app (sem esperar horário). `onAbrir` (se
// passado) é chamado com 'ferramentas' quando a pessoa toca na
// notificação.
export function lembrarFuncaoDoDia({ userId, hoje, diaAtual, ingles = false, onAbrir }) {
  if (!userId || !hoje || !diaAtual || !podeNotificar()) return false

  const tipo = funcaoDoDia(hoje)
  if (!tipo) return false // sábado

  const chave = `mwa_lembrete_funcao_${userId}_${hoje}`
  if (localStorage.getItem(chave)) return false

  const mensagem = mensagemFuncao(tipo, diaAtual, ingles)
  if (!mensagem) return false

  localStorage.setItem(chave, '1')
  try {
    const notificacao = new Notification(mensagem.titulo, {
      body: mensagem.corpo,
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: `funcao_${hoje}`,
      requireInteraction: false,
    })
    if (onAbrir) {
      notificacao.onclick = () => {
        window.focus()
        onAbrir('ferramentas')
      }
    }
  } catch {
    // Chrome Android e apps instalados no iOS não suportam o construtor
    // Notification() sem service worker — falha silenciosa, sem crashar o app.
    return false
  }
  return true
}
