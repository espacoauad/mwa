// Regras comuns às rodadas dos jogos de perguntas (funções puras).
// Sorteio prioriza o que a pessoa ainda não viu — o banco rotativo evita a memorização
// que travava o antigo Jogo do Plantio.

export const PONTOS_PRIMEIRA = 10
export const PONTOS_SEGUNDA = 5
export const PONTOS_APRENDIZADO = 2

function embaralhar(lista) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

export function sortearRodada(banco, quantidade, vistos = []) {
  const jaVistos = new Set(vistos)
  const ineditos = embaralhar(banco.filter((q) => !jaVistos.has(q.id)))
  if (ineditos.length >= quantidade) return ineditos.slice(0, quantidade)
  // Acabaram os inéditos: completa com os já vistos, embaralhados
  const repetidos = embaralhar(banco.filter((q) => jaVistos.has(q.id)))
  return [...ineditos, ...repetidos].slice(0, quantidade)
}

// Errar não zera: quem chega à resposta depois de ler a explicação também pontua.
export function pontuarRodada(respostas) {
  return respostas.reduce((total, r) => {
    if (r.acertou) return total + (r.tentativas <= 1 ? PONTOS_PRIMEIRA : PONTOS_SEGUNDA)
    return total + PONTOS_APRENDIZADO
  }, 0)
}

export function mensagemFinal(acertos, total) {
  const proporcao = total > 0 ? acertos / total : 0
  if (proporcao >= 0.8) {
    return {
      pt: 'Você domina esses conceitos. Isso aparece nas suas escolhas do dia a dia.',
      en: 'You know these concepts well. It shows in your everyday choices.',
    }
  }
  if (proporcao >= 0.5) {
    return {
      pt: 'Bom caminho! Cada explicação lida hoje fica com você na próxima refeição.',
      en: 'Good progress! Every explanation you read today stays with you at your next meal.',
    }
  }
  return {
    pt: 'Rodada de aprendizado — e é assim que se aprende mesmo. Repita quando quiser.',
    en: 'A learning round — and that is exactly how learning works. Repeat whenever you like.',
  }
}
