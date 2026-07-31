// Lanches proteicos dos dias 22–37 (22-30 fim da Jornada de 30 Dias, 31-37
// início da continuidade de 90 dias). Mantém foco em:
// • Alta proteína (sustentação de massa magra)
// • Praticidade (rotina acelerada)
// • Variedade (evita monotonia)
// • Alimentos versáteis (disponíveis o ano todo)
//
// Produtos de suplementação continuam sendo opções principais nos dias indicados.

export const LANCHES_22_37 = [
  {
    dia: 22,
    icone: '🥜',
    titulo: 'Amendoim torrado com maçã',
    proteina: '~7g',
    descricao:
      'Voltando ao começo com tudo novo! Amendoim é proteína + gordura boa, e a maçã traz fibra e saciação. Dupla que nunca falha.',
    ingredientes: ['1 punhado pequeno de amendoim torrado (25g)', '1 maçã pequena picada', 'Sal a gosto'],
    preparo: 'Coloque o amendoim num pote pequeno, coma acompanhado de maçã em cubinhos. Lanche portátil perfeito.',
    produto: null,
  },
  {
    dia: 23,
    icone: '💪',
    titulo: 'Whey batido com morango congelado',
    proteina: '~24g',
    descricao:
      'Alta proteína com textura cremosa e refrescante. Ideal para os dias mais quentes ou depois de treino leve.',
    ingredientes: ['1 dose de whey protein', '½ xícara de morango congelado', '200ml de água ou leite', 'Gelo'],
    preparo: 'Bata tudo no liquidificador. O morango congelado dá textura de sorvete sem açúcar.',
    produto: { nome: 'Whey protein', imagem: '/produtos/whey-generico.jpg' },
  },
  {
    dia: 24,
    icone: '🧀',
    titulo: 'Requeijão com cenoura e rabanete',
    proteina: '~7g',
    descricao:
      'Requeijão light é proteína concentrada. Com cenoura e rabanete crus, vira um lanche crocante que sacia por horas.',
    ingredientes: ['4 colheres de sopa de requeijão light', 'Cenoura em palitos (1 cenoura média)', 'Rabanete em fatias finas (4–5)', 'Sal e pimenta a gosto'],
    preparo: 'Coloque o requeijão num potinho e use cenoura e rabanete como "colher". Crocante e satisfatório.',
    produto: null,
  },
  {
    dia: 25,
    icone: '🥤',
    titulo: 'Shake clássico + fibra',
    proteina: '~25g',
    descricao:
      'Volta do shake proteico com turbina de fibra. Proteína + fibra = máxima saciedade. A fibra ainda regula intestino.',
    ingredientes: ['2 colheres de shake proteico', '1 dose de fibras solúveis', '200ml de leite desnatado', 'Canela e gelo'],
    preparo: 'Bata tudo no liquidificador por 30 segundos. Fica espesso e delicioso.',
    produto: { nome: 'Shake proteico + fibras', imagem: '/produtos/shake-proteico.jpg' },
  },
  {
    dia: 26,
    icone: '🍗',
    titulo: 'Frango desfiado com macarrão integral',
    proteina: '~29g',
    descricao:
      'Refeição light que parece lanche. Frango + macarrão integral (baixo IG) = carboidrato lento + proteína = energia controlada.',
    ingredientes: ['80g de peito de frango cozido e desfiado', '80g de macarrão integral cozido', 'Molho light (ou azeite + tomate)', 'Alho, sal, orégano'],
    preparo: 'Tempere o frango desfiado com tomate ou azeite, misture com macarrão quente. Pronto em 5 minutos se tiver frango pré-cozido.',
    produto: null,
  },
  {
    dia: 27,
    icone: '🥞',
    titulo: 'Panqueca de aveia com melado',
    proteina: '~12g',
    descricao:
      'Aveia proteica é satisfatória. Com um fio de melado natural, satisfaz vontade de doce sem culpa.',
    ingredientes: ['½ xícara de aveia em flocos', '1 ovo inteiro', '100ml de leite', 'Canela, 1 colher de chá de melado natural', 'Sal uma pitada'],
    preparo: 'Bata tudo no liquidificador, despeje na frigideira quente e doure dos dois lados. Em 5 minutos está pronto.',
    produto: null,
  },
  {
    dia: 28,
    icone: '🫘',
    titulo: 'Feijão cozido com melado',
    proteina: '~8g',
    descricao:
      'Feijão é proteína vegetal, carboidrato lento e fibra. Com melado, traz aquele docinho saudável sem açúcar refinado.',
    ingredientes: ['½ xícara de feijão cozido (já temperado do almoço)', '1 colher de chá de melado natural', 'Canela a gosto'],
    preparo: 'Misture o feijão com melado numa tigela. Pode comer quente ou em temperatura ambiente. Doce natural garantido.',
    produto: null,
  },
  {
    dia: 29,
    icone: '🍓',
    titulo: 'Iogurte grego com mirtilo fresco',
    proteina: '~16g',
    descricao:
      'Mirtilo é antioxidante puro. Com iogurte grego, vira um lanche que previne inflamação enquanto sacia.',
    ingredientes: ['1 pote de iogurte grego (170g)', '½ xícara de mirtilo fresco', '1 colher de mel (opcional)', 'Noz-moscada uma pitada'],
    preparo: 'Coloque o iogurte numa tigela, cubra com mirtilo, regue com mel se desejar e polvilhe noz-moscada.',
    produto: null,
  },
  {
    dia: 30,
    icone: '💪',
    titulo: 'Whey com Banana e Aveia — Marco dos 30 Dias',
    proteina: '~35g',
    descricao:
      'Você chegou ao dia 30. Esse shake é o mesmo de sempre — whey + carboidrato lento (banana + aveia) para ajudar na recuperação — mas hoje ele também celebra 30 dias de escolhas consistentes.',
    ingredientes: ['1 dose de whey protein', '½ banana', '1 colher de aveia em flocos', '200ml de leite', 'Gelo'],
    preparo: 'Bata tudo no liquidificador até cremoso. Consumir após o treino ajuda no processo de recuperação.',
    produto: { nome: 'Whey protein', imagem: '/produtos/whey-generico.jpg' },
  },
  {
    dia: 31,
    icone: '🥕',
    titulo: 'Cenoura cozida com homus de grão-de-bico',
    proteina: '~7g',
    descricao:
      'Cenoura cozida fica doce naturalmente. Homus traz proteína vegetal. Dupla equilibrada e leve.',
    ingredientes: ['1 cenoura média cozida e cortada em palitos', '3 colheres de homus caseiro (ou comprado)', 'Sal e limão para temperar'],
    preparo: 'Cozinhe a cenoura até ficar morna, cubra com homus e aproveite quente ou em temperatura ambiente.',
    produto: null,
  },
  {
    dia: 32,
    icone: '🍫',
    titulo: 'Barra de proteína + chá gelado',
    proteina: '~10g',
    descricao:
      'Lanche pronto para levar. A barra satisfaz o doce, e o chá gelado refresca sem calorias vazias.',
    ingredientes: ['1 barra de proteína', '1 dose de chá de ervas concentrado em água gelada'],
    preparo: 'Prepare o chá numa garrafa com gelo. Leve barra + garrafinha. Lanche de bolsa 100%.',
    produto: { nome: 'Barra de proteína + chá', imagem: '/produtos/barra-proteina-generica.jpg' },
  },
  {
    dia: 33,
    icone: '🐠',
    titulo: 'Atum com abacate em torrada',
    proteina: '~34g',
    descricao:
      'Atum (ômega-3 + proteína) + abacate (gordura boa) + torrada integral (fibra) = lanche perfeito.',
    ingredientes: ['1 lata padrão de atum em água (~120g escorrido)', '¼ abacate maduro', '2 torradas integrais', 'Limão e sal'],
    preparo: 'Esprema atum com garfo, misture com abacate amassado, tempere com limão e sal. Espalhe na torrada.',
    produto: null,
  },
  {
    dia: 34,
    icone: '🧈',
    titulo: 'Pasta de amendoim com maçã e canela',
    proteina: '~5g',
    descricao:
      'Clássico prático e leve. Amendoim + maçã + canela = satisfação sem excesso.',
    ingredientes: ['1 colher de sopa de pasta de amendoim natural', '1 maçã média picada', 'Canela a gosto', 'Pitada de sal'],
    preparo: 'Mergulhe os cubos de maçã na pasta de amendoim. Polvilhe canela sobre tudo. Pronto em 2 minutos.',
    produto: null,
  },
  {
    dia: 35,
    icone: '🥣',
    titulo: 'Overnight de chia com iogurte',
    proteina: '~14g',
    descricao:
      'Prepare à noite, acorde com lanche pronto. Chia + iogurte = magia em potinho.',
    ingredientes: ['1 pote de iogurte natural (200ml)', '2 colheres de sementes de chia', '½ banana picada', '1 colher de mel'],
    preparo: 'Misture iogurte, chia e mel num pote. Deixe na geladeira de um dia para o outro. De manhã, cubra com banana.',
    produto: null,
  },
  {
    dia: 36,
    icone: '🌽',
    titulo: 'Milho cozido com gengibre',
    proteina: '~4g',
    descricao:
      'Lanche leve e diferente. Milho cozido é satisfatório, e o gengibre ajuda na digestão e favorece processos anti-inflamatórios.',
    ingredientes: ['1 espiga pequena de milho cozido (ou 200g de grãos)', 'Gengibre fresco ralado (uma colher de chá)', 'Sal e pimenta', 'Limão a gosto'],
    preparo: 'Cozinhe o milho (ou compre já cozido), tempere com gengibre ralado, sal, pimenta e suco de limão. Coma morno.',
    produto: null,
  },
  {
    dia: 37,
    icone: '🎉',
    titulo: 'Batida turbo de proteína + berries',
    proteina: '~43g',
    descricao:
      'Entrando na reta final da semana 5-6! Vitamina TURBO com dupla de proteína: Whey + Shake. Favorece a saciação por mais tempo.',
    ingredientes: ['1 dose de whey protein', '1 colher de shake proteico', '½ xícara de berries variados', '200ml de leite', 'Gelo'],
    preparo: 'Bata tudo no liquidificador até virar uma vitamina cremosa. Gelada é ainda melhor.',
    produto: { nome: 'Whey protein + shake proteico', imagem: '/produtos/whey-generico.jpg' },
  },
]

// Retorna o lanche do dia 22–37
export function lancheDoDia22a37(dia) {
  return LANCHES_22_37.find((l) => l.dia === dia) || null
}
