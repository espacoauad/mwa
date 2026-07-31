// Batalha da Saciedade — duas refeições com calorias parecidas e composições diferentes.
// A pergunta nunca é "qual é a saudável", e sim qual TENDE a saciar mais, e por quê.
// Linguagem sempre probabilística: saciedade varia entre pessoas.

export const DUELOS = [
  {
    id: 'd-pao-ovo',
    nivel: 1,
    a: {
      nome: '2 pães de queijo médios',
      nomeEN: '2 medium cheese breads',
      kcal: 280, prot: 6, carb: 30, gord: 14, fibra: 1,
    },
    b: {
      nome: '2 ovos mexidos com 1 fatia de pão integral',
      nomeEN: '2 scrambled eggs with 1 slice of whole grain bread',
      kcal: 290, prot: 19, carb: 15, gord: 15, fibra: 3,
    },
    maisSaciante: 'b',
    porque: 'Calorias quase iguais, mas a opção com ovos tem três vezes mais proteína e o triplo de fibra. Essa dupla é a que mais costuma prolongar a saciedade.',
    porqueEN: 'Almost identical calories, but the egg option has three times more protein and triple the fiber. That duo tends to prolong fullness the most.',
  },
  {
    id: 'd-suco-fruta',
    nivel: 1,
    a: {
      nome: '1 copo de suco de laranja (300 ml)',
      nomeEN: '1 glass of orange juice (300 ml)',
      kcal: 140, prot: 2, carb: 33, gord: 0.5, fibra: 0.7,
    },
    b: {
      nome: '2 laranjas inteiras',
      nomeEN: '2 whole oranges',
      kcal: 125, prot: 2.4, carb: 31, gord: 0.3, fibra: 6,
    },
    maisSaciante: 'b',
    porque: 'São as mesmas laranjas, mas mastigar leva tempo e a fibra permanece. O suco passa rápido e deixa menos sinal de saciedade.',
    porqueEN: 'Same oranges, but chewing takes time and the fiber stays. Juice goes down fast and leaves less fullness signal.',
  },
  {
    id: 'd-salada-castanha',
    nivel: 2,
    a: {
      nome: 'Prato grande de salada com frango grelhado',
      nomeEN: 'Large salad plate with grilled chicken',
      kcal: 320, prot: 32, carb: 12, gord: 15, fibra: 6,
    },
    b: {
      nome: '1 punhado generoso de castanhas (55 g)',
      nomeEN: '1 generous handful of nuts (55 g)',
      kcal: 315, prot: 10, carb: 16, gord: 25, fibra: 2,
    },
    maisSaciante: 'a',
    porque: 'Mesmas calorias em volumes muito diferentes. O prato de salada ocupa o estômago e entrega mais proteína — as castanhas são ótimas, mas concentram muita energia em pouquíssimo volume.',
    porqueEN: 'Same calories in very different volumes. The salad plate fills the stomach and delivers more protein — nuts are excellent, but pack lots of energy in very little volume.',
  },
  {
    id: 'd-iogurte-barra',
    nivel: 1,
    a: {
      nome: 'Iogurte grego com aveia e morangos',
      nomeEN: 'Greek yogurt with oats and strawberries',
      kcal: 210, prot: 17, carb: 24, gord: 3, fibra: 4,
    },
    b: {
      nome: '1 barra de cereal com cobertura',
      nomeEN: '1 coated cereal bar',
      kcal: 200, prot: 3, carb: 30, gord: 7, fibra: 1.5,
    },
    maisSaciante: 'a',
    porque: 'A barra é prática, mas tem quase seis vezes menos proteína. O iogurte com aveia costuma segurar bem mais tempo pelas mesmas calorias.',
    porqueEN: 'The bar is convenient, but has nearly six times less protein. Yogurt with oats usually holds much longer for the same calories.',
  },
  {
    id: 'd-arroz-feijao',
    nivel: 2,
    a: {
      nome: 'Prato com arroz, feijão, frango e salada',
      nomeEN: 'Plate with rice, beans, chicken and salad',
      kcal: 480, prot: 35, carb: 50, gord: 10, fibra: 10,
    },
    b: {
      nome: '2 fatias de pizza de mussarela',
      nomeEN: '2 slices of mozzarella pizza',
      kcal: 500, prot: 20, carb: 55, gord: 20, fibra: 3,
    },
    maisSaciante: 'a',
    porque: 'Calorias parecidas, mas o prato brasileiro entrega quase o dobro de proteína e mais que o triplo de fibra — e ainda ocupa mais espaço no estômago.',
    porqueEN: 'Similar calories, but the Brazilian plate delivers nearly double the protein and over triple the fiber — and takes up more stomach space.',
  },
  {
    id: 'd-refri-agua',
    nivel: 1,
    a: {
      nome: 'Sanduíche natural + refrigerante (350 ml)',
      nomeEN: 'Natural sandwich + soda (350 ml)',
      kcal: 480, prot: 22, carb: 70, gord: 11, fibra: 4,
    },
    b: {
      nome: 'Sanduíche natural + água e 1 iogurte',
      nomeEN: 'Natural sandwich + water and 1 yogurt',
      kcal: 470, prot: 32, carb: 52, gord: 12, fibra: 4,
    },
    maisSaciante: 'b',
    porque: 'As calorias do refrigerante não trazem saciedade nenhuma. Direcionar essas mesmas calorias para um iogurte soma 10 g de proteína ao lanche.',
    porqueEN: 'Soda calories bring no fullness at all. Redirecting those same calories to a yogurt adds 10 g of protein to the snack.',
  },
  {
    id: 'd-sopa-sanduiche',
    nivel: 2,
    a: {
      nome: 'Sopa de legumes com frango desfiado (prato fundo)',
      nomeEN: 'Vegetable soup with shredded chicken (deep bowl)',
      kcal: 300, prot: 25, carb: 25, gord: 9, fibra: 7,
    },
    b: {
      nome: 'Sanduíche de queijo quente',
      nomeEN: 'Grilled cheese sandwich',
      kcal: 310, prot: 13, carb: 30, gord: 15, fibra: 2,
    },
    maisSaciante: 'a',
    porque: 'A sopa combina volume, água, fibra e proteína. Alimentos com muita água e pouca densidade calórica tendem a saciar mais por caloria.',
    porqueEN: 'Soup combines volume, water, fiber and protein. Foods high in water and low in calorie density tend to satisfy more per calorie.',
  },
  {
    id: 'd-granola',
    nivel: 2,
    a: {
      nome: 'Tigela de granola com mel e leite (60 g de granola)',
      nomeEN: 'Bowl of granola with honey and milk (60 g granola)',
      kcal: 400, prot: 10, carb: 60, gord: 13, fibra: 5,
    },
    b: {
      nome: 'Tapioca com ovo e queijo',
      nomeEN: 'Tapioca crepe with egg and cheese',
      kcal: 390, prot: 22, carb: 42, gord: 15, fibra: 1,
    },
    maisSaciante: 'b',
    porque: 'A granola parece leve, mas concentra calorias e açúcar. A tapioca com ovo entrega mais que o dobro de proteína — e proteína é o macro que mais sacia.',
    porqueEN: 'Granola seems light, but concentrates calories and sugar. Tapioca with egg delivers more than double the protein — and protein is the most satiating macro.',
  },
]
