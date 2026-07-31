// Afirmações do Momento MWA — banco ampliado (8 → 40) para não repetir por semanas.
// Voz da marca: acolhedora, sem promessa, sem culpa. A afirmação do dia é estável
// (a mesma durante todo o dia) e gira conforme a data.

export const AFIRMACOES = [
  { pt: 'Você não precisa ser perfeita. Precisa ser constante.', en: 'You do not need to be perfect. You need to be consistent.' },
  { pt: 'Cada escolha saudável de hoje é um presente para você amanhã.', en: 'Every healthy choice today is a gift to your future self.' },
  { pt: 'Seu valor não é medido pelo número da balança.', en: 'Your worth is not measured by a number on the scale.' },
  { pt: 'Progresso não é uma linha reta — e está tudo bem.', en: 'Progress is not a straight line — and that is okay.' },
  { pt: 'Você já percorreu um caminho que muita gente nem começou.', en: 'You have already traveled a path many people have not begun.' },
  { pt: 'Cuidar de si mesma também é uma forma de amor-próprio.', en: 'Taking care of yourself is also an act of self-love.' },
  { pt: 'Um dia difícil não apaga todos os dias em que você se superou.', en: 'One difficult day does not erase all the days you overcame.' },
  { pt: 'Você está construindo hábitos que vão durar a vida toda.', en: 'You are building habits that can last a lifetime.' },
  { pt: 'Comece de onde você está, com o que você tem. Já é suficiente.', en: 'Start where you are, with what you have. That is already enough.' },
  { pt: 'A refeição seguinte é sempre uma nova chance de recomeçar.', en: 'The next meal is always a new chance to begin again.' },
  { pt: 'Disciplina é lembrar do que você quer, não do que você quer agora.', en: 'Discipline is remembering what you want, not what you want right now.' },
  { pt: 'O corpo que te carrega todos os dias merece ser bem cuidado.', en: 'The body that carries you every day deserves good care.' },
  { pt: 'Pequenas mudanças, repetidas, viram grandes transformações.', en: 'Small changes, repeated, become great transformations.' },
  { pt: 'Você não está atrasada. Está no seu tempo.', en: 'You are not behind. You are on your own time.' },
  { pt: 'Comparar sua jornada com a de outra pessoa rouba a sua alegria.', en: 'Comparing your journey to someone else’s steals your joy.' },
  { pt: 'Escolher com consciência é mais poderoso do que escolher com medo.', en: 'Choosing with awareness is more powerful than choosing out of fear.' },
  { pt: 'Você merece se sentir bem — não só parecer bem.', en: 'You deserve to feel good — not just look good.' },
  { pt: 'Nem toda fome é do estômago. Escutar é o primeiro passo.', en: 'Not all hunger comes from the stomach. Listening is the first step.' },
  { pt: 'Beber água é o cuidado mais simples que você pode se dar hoje.', en: 'Drinking water is the simplest care you can give yourself today.' },
  { pt: 'A constância vale mais do que a intensidade.', en: 'Consistency is worth more than intensity.' },
  { pt: 'Comer bem não é privação. É escolher o que te sustenta.', en: 'Eating well is not deprivation. It is choosing what sustains you.' },
  { pt: 'Descansar também faz parte do processo. Sono é reconstrução.', en: 'Resting is part of the process too. Sleep is rebuilding.' },
  { pt: 'Você é capaz de mais do que imagina — e já provou isso.', en: 'You are capable of more than you imagine — and you have proven it.' },
  { pt: 'O que você faz na maior parte do tempo importa mais que o ocasional.', en: 'What you do most of the time matters more than the occasional.' },
  { pt: 'Sua saúde é um investimento, nunca um gasto.', en: 'Your health is an investment, never an expense.' },
  { pt: 'Planejar hoje é cuidar de você amanhã.', en: 'Planning today is caring for yourself tomorrow.' },
  { pt: 'Gentileza consigo mesma acelera mais do que cobrança.', en: 'Kindness toward yourself moves you further than pressure.' },
  { pt: 'Você não precisa de motivação todos os dias. Precisa de rotina.', en: 'You do not need motivation every day. You need routine.' },
  { pt: 'Cada registro no app é um ato de consciência sobre a sua vida.', en: 'Every log in the app is an act of awareness about your life.' },
  { pt: 'Proteína, fibra e água: três aliadas simples e poderosas.', en: 'Protein, fiber and water: three simple, powerful allies.' },
  { pt: 'O espelho não conta a história completa. Sua energia conta.', en: 'The mirror does not tell the whole story. Your energy does.' },
  { pt: 'Não existe recomeço tardio. Existe recomeço.', en: 'There is no such thing as starting over too late. There is only starting over.' },
  { pt: 'Você está aprendendo a se escolher. Isso muda tudo.', en: 'You are learning to choose yourself. That changes everything.' },
  { pt: 'Movimento não é castigo pelo que você comeu. É cuidado.', en: 'Movement is not punishment for what you ate. It is care.' },
  { pt: 'Respire. Você não precisa resolver tudo hoje.', en: 'Breathe. You do not have to solve everything today.' },
  { pt: 'A mudança que dura é aquela que cabe na sua vida real.', en: 'Lasting change is the kind that fits your real life.' },
  { pt: 'Orgulhe-se do processo, não apenas do resultado.', en: 'Be proud of the process, not just the result.' },
  { pt: 'Você é a soma das suas escolhas repetidas, não de um único dia.', en: 'You are the sum of your repeated choices, not of a single day.' },
  { pt: 'Ser saudável é também ter paz com a comida.', en: 'Being healthy also means having peace with food.' },
  { pt: 'Transforme hábitos. Conquiste resultados. Mude sua vida.', en: 'Transform habits. Achieve results. Change your life.' },
]

export const INTENCOES = [
  { id: 'constancia', pt: 'Constância', en: 'Consistency' },
  { id: 'gentileza', pt: 'Gentileza', en: 'Kindness' },
  { id: 'presenca', pt: 'Presença', en: 'Presence' },
  { id: 'foco', pt: 'Foco', en: 'Focus' },
]

// A afirmação é estável dentro do mesmo dia e gira ao longo dos dias.
// Sem data válida, devolve a primeira: o Momento MWA nunca fica sem mensagem.
export function afirmacaoDoDia(dataISO) {
  const tempo = new Date(`${dataISO}T00:00:00`).getTime()
  if (!Number.isFinite(tempo)) return AFIRMACOES[0]
  const dias = Math.floor(tempo / 86400000)
  return AFIRMACOES[((dias % AFIRMACOES.length) + AFIRMACOES.length) % AFIRMACOES.length]
}
