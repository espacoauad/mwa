// Detetive dos Rótulos — rótulos simulados no padrão brasileiro (valores por porção).
// Produtos fictícios de propósito: o objetivo é ler a tabela, não julgar marcas.
// A armadilha central é sempre a mesma da vida real: porção declarada ≠ o que se consome.

export const ROTULOS = [
  {
    id: 'r-biscoito',
    nivel: 1,
    produto: 'Biscoito recheado (pacote de 130 g)',
    produtoEN: 'Sandwich cookies (130 g package)',
    porcao: '30 g (3 unidades)',
    porcaoEN: '30 g (3 cookies)',
    porcoesNoPacote: 4.3,
    tabela: { kcal: 140, carb: 21, acucares: 10, prot: 1.5, gord: 6, fibra: 0.5, sodio: 95 },
    perguntas: [
      {
        id: 'r-biscoito-q1',
        pergunta: 'Se você comer o pacote inteiro, quantas calorias serão?',
        perguntaEN: 'If you eat the whole package, how many calories is that?',
        opcoes: [
          { texto: '140 kcal', textoEN: '140 kcal' },
          { texto: 'Cerca de 600 kcal', textoEN: 'About 600 kcal', correta: true },
          { texto: 'Cerca de 280 kcal', textoEN: 'About 280 kcal' },
        ],
        explicacao: 'O pacote tem pouco mais de 4 porções. 140 kcal × 4,3 dá cerca de 600 kcal — é o número que conta se o pacote acabar.',
        explicacaoEN: 'The package has just over 4 servings. 140 kcal × 4.3 is about 600 kcal — that is the number that counts if the package is finished.',
      },
      {
        id: 'r-biscoito-q2',
        pergunta: 'Quanto açúcar você consome ao comer 6 biscoitos?',
        perguntaEN: 'How much sugar do you consume eating 6 cookies?',
        opcoes: [
          { texto: '10 g', textoEN: '10 g' },
          { texto: '20 g — o equivalente a 4 colheres de chá', textoEN: '20 g — about 4 teaspoons', correta: true },
          { texto: '5 g', textoEN: '5 g' },
        ],
        explicacao: 'A porção do rótulo é 3 unidades. Seis biscoitos são duas porções: 20 g de açúcar, cerca de 4 colheres de chá.',
        explicacaoEN: 'The label serving is 3 cookies. Six is two servings: 20 g of sugar, about 4 teaspoons.',
      },
    ],
  },
  {
    id: 'r-suco',
    nivel: 1,
    produto: 'Néctar de uva (caixa de 1 litro)',
    produtoEN: 'Grape nectar (1 liter carton)',
    porcao: '200 ml (1 copo)',
    porcaoEN: '200 ml (1 glass)',
    porcoesNoPacote: 5,
    tabela: { kcal: 120, carb: 29, acucares: 28, prot: 0, gord: 0, fibra: 0.2, sodio: 10 },
    perguntas: [
      {
        id: 'r-suco-q1',
        pergunta: 'O rótulo diz "100% natural, sem conservantes". Isso significa que não tem açúcar adicionado?',
        perguntaEN: 'The label says "100% natural, no preservatives". Does that mean no added sugar?',
        opcoes: [
          { texto: 'Sim, natural quer dizer sem açúcar', textoEN: 'Yes, natural means no sugar' },
          { texto: 'Não — quem responde isso é a tabela e a lista de ingredientes', textoEN: 'No — the table and ingredient list answer that', correta: true },
          { texto: 'Só se for orgânico', textoEN: 'Only if it is organic' },
        ],
        explicacao: 'Frases da frente da embalagem são marketing. Com 28 g de açúcar por copo e quase nenhuma fibra, a tabela conta a história real.',
        explicacaoEN: 'Front-of-package claims are marketing. With 28 g of sugar per glass and almost no fiber, the table tells the real story.',
      },
      {
        id: 'r-suco-q2',
        pergunta: 'Dois copos ao longo do dia somam quantas calorias?',
        perguntaEN: 'Two glasses during the day add up to how many calories?',
        opcoes: [
          { texto: '240 kcal — quase um lanche completo', textoEN: '240 kcal — nearly a full snack', correta: true },
          { texto: '120 kcal', textoEN: '120 kcal' },
          { texto: 'Bebidas não contam calorias', textoEN: 'Drinks do not count calories' },
        ],
        explicacao: 'Bebidas contam no total do dia como qualquer alimento — e, por não saciarem, costumam passar despercebidas no registro.',
        explicacaoEN: 'Drinks count toward your daily total like any food — and because they do not satisfy, they often go unnoticed in tracking.',
      },
    ],
  },
  {
    id: 'r-iogurte',
    nivel: 2,
    produto: 'Iogurte de morango "zero açúcar" (pote de 170 g)',
    produtoEN: 'Strawberry yogurt "sugar-free" (170 g cup)',
    porcao: '170 g (1 pote)',
    porcaoEN: '170 g (1 cup)',
    porcoesNoPacote: 1,
    tabela: { kcal: 110, carb: 9, acucares: 0, prot: 5, gord: 5, fibra: 0, sodio: 70 },
    perguntas: [
      {
        id: 'r-iogurte-q1',
        pergunta: 'Sendo "zero açúcar", esse iogurte é necessariamente baixo em calorias?',
        perguntaEN: 'Being "sugar-free", is this yogurt necessarily low in calories?',
        opcoes: [
          { texto: 'Não — a gordura responde por boa parte das 110 kcal', textoEN: 'No — fat accounts for much of the 110 kcal', correta: true },
          { texto: 'Sim, zero açúcar é sempre zero caloria', textoEN: 'Yes, sugar-free is always calorie-free' },
          { texto: 'Sim, porque não tem carboidrato', textoEN: 'Yes, because it has no carbs' },
        ],
        explicacao: 'Zero açúcar não é zero caloria. Aqui, 5 g de gordura equivalem a 45 kcal — quase metade do total do pote.',
        explicacaoEN: 'Sugar-free is not calorie-free. Here, 5 g of fat equals 45 kcal — nearly half the cup’s total.',
      },
      {
        id: 'r-iogurte-q2',
        pergunta: 'Para um lanche que sustente até o jantar, o que mais faz falta neste iogurte?',
        perguntaEN: 'For a snack that holds until dinner, what does this yogurt most lack?',
        opcoes: [
          { texto: 'Mais proteína e alguma fibra', textoEN: 'More protein and some fiber', correta: true },
          { texto: 'Mais gordura', textoEN: 'More fat' },
          { texto: 'Nada, está completo', textoEN: 'Nothing, it is complete' },
        ],
        explicacao: '5 g de proteína é pouco para um lanche. Somar uma fruta e aveia, ou escolher uma versão grega, tende a sustentar bem mais.',
        explicacaoEN: '5 g of protein is little for a snack. Adding fruit and oats, or choosing a Greek version, tends to sustain much longer.',
      },
    ],
  },
  {
    id: 'r-macarrao-instantaneo',
    nivel: 2,
    produto: 'Macarrão instantâneo (pacote de 80 g com tempero)',
    produtoEN: 'Instant noodles (80 g package with seasoning)',
    porcao: '40 g (meio pacote)',
    porcaoEN: '40 g (half package)',
    porcoesNoPacote: 2,
    tabela: { kcal: 190, carb: 26, acucares: 1, prot: 4, gord: 8, fibra: 1, sodio: 850 },
    perguntas: [
      {
        id: 'r-macarrao-q1',
        pergunta: 'Ninguém prepara meio pacote. Quanto sódio tem o pacote inteiro?',
        perguntaEN: 'Nobody cooks half a package. How much sodium is in the whole package?',
        opcoes: [
          { texto: '1700 mg — perto do limite diário recomendado', textoEN: '1700 mg — close to the recommended daily limit', correta: true },
          { texto: '850 mg', textoEN: '850 mg' },
          { texto: '425 mg', textoEN: '425 mg' },
        ],
        explicacao: 'A porção declarada é metade do pacote. Preparado inteiro, chega a cerca de 1700 mg de sódio — a recomendação diária gira em torno de 2000 mg.',
        explicacaoEN: 'The declared serving is half the package. Prepared whole, it reaches about 1700 mg of sodium — the daily recommendation is around 2000 mg.',
      },
      {
        id: 'r-macarrao-q2',
        pergunta: 'Como transformar isso numa refeição mais equilibrada?',
        perguntaEN: 'How can you turn this into a more balanced meal?',
        opcoes: [
          { texto: 'Usar metade do tempero e somar ovo e legumes', textoEN: 'Use half the seasoning and add egg and vegetables', correta: true },
          { texto: 'Comer sem molho nenhum', textoEN: 'Eat it with no sauce at all' },
          { texto: 'Trocar por dois pacotes menores', textoEN: 'Swap for two smaller packages' },
        ],
        explicacao: 'O tempero concentra o sódio; usar menos já ajuda. Somar ovo e legumes acrescenta proteína e fibra, que é o que falta ao prato.',
        explicacaoEN: 'The seasoning concentrates sodium; using less already helps. Adding egg and vegetables brings the protein and fiber the dish lacks.',
      },
    ],
  },
  {
    id: 'r-granola',
    nivel: 2,
    produto: 'Granola tradicional (pacote de 500 g)',
    produtoEN: 'Traditional granola (500 g package)',
    porcao: '30 g (2 colheres de sopa)',
    porcaoEN: '30 g (2 tablespoons)',
    porcoesNoPacote: 16.7,
    tabela: { kcal: 135, carb: 20, acucares: 7, prot: 3, gord: 5, fibra: 2.5, sodio: 15 },
    perguntas: [
      {
        id: 'r-granola-q1',
        pergunta: 'Uma tigela cheia costuma levar cerca de 90 g. Quantas calorias isso representa?',
        perguntaEN: 'A full bowl usually holds about 90 g. How many calories is that?',
        opcoes: [
          { texto: 'Cerca de 405 kcal — o triplo da porção do rótulo', textoEN: 'About 405 kcal — triple the label serving', correta: true },
          { texto: '135 kcal', textoEN: '135 kcal' },
          { texto: 'Cerca de 200 kcal', textoEN: 'About 200 kcal' },
        ],
        explicacao: 'A porção do rótulo (2 colheres) é bem menor do que a tigela real. Três porções somam cerca de 405 kcal, antes do leite e da fruta.',
        explicacaoEN: 'The label serving (2 tablespoons) is much smaller than a real bowl. Three servings add up to about 405 kcal, before milk and fruit.',
      },
    ],
  },
]

export function totalPerguntasRotulos() {
  return ROTULOS.reduce((total, r) => total + r.perguntas.length, 0)
}
