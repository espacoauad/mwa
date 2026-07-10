// Informativos diários MWA — comparações nutricionais visuais (dias 1–21)
// tom: 'bom' (verde), 'ruim' (terracota), 'neutro' (ouro)

export const INFORMATIVOS = [
  {
    dia: 1,
    emoji: '☕',
    titulo: 'Café da Manhã Inteligente',
    opcoes: [
      {
        nome: 'Tradicional',
        tom: 'ruim',
        itens: [
          ['Pão francês', '150 cal · 6g prot'],
          ['Manteiga', '100 cal · 0g prot'],
          ['Café açucarado', '80 cal · 0g'],
          ['Biscoito', '150 cal · 2g'],
        ],
        total: '480 cal · 8g proteína',
        extras: ['Saciedade: 2–3 horas ❌'],
      },
      {
        nome: 'MWA Inteligente',
        tom: 'bom',
        itens: [
          ['Shake MWA', '210 cal · 20g prot'],
          ['Maçã', '80 cal · 0g prot'],
          ['Chá Herbalife', '5 cal · 0g'],
        ],
        total: '295 cal · 20g proteína',
        extras: ['Saciedade: 4–5 horas ✅', 'Economia: 185 calorias!'],
      },
    ],
    dica: 'Mais que o dobro de proteína, menos calorias e o dobro da saciedade. Você já sabe qual escolher! 💚',
    cta: null,
  },
  {
    dia: 2,
    emoji: '🍳',
    titulo: 'Proteína no Café da Manhã',
    opcoes: [
      {
        nome: '3 ovos cozidos',
        tom: 'neutro',
        itens: [
          ['Calorias', '155'],
          ['Proteína', '13g ✅'],
          ['Tempo de preparo', '15 min'],
          ['Saciedade', '3h'],
        ],
      },
      {
        nome: 'Shake MWA',
        tom: 'bom',
        itens: [
          ['Calorias', '210'],
          ['Proteína', '20g'],
          ['Tempo de preparo', '2 min ⚡'],
          ['Saciedade', '4–5h'],
          ['Bônus', '+23 vitaminas e minerais'],
        ],
      },
    ],
    dica: 'Três ovos puros são nutritivos, mas sozinhos ficam sem graça e deixam a desejar em outros nutrientes. Já o shake, preparado com leite ou Nutrev, entrega mais proteína, sabor agradável e uma dose completa de vitaminas e minerais — uma ótima opção para o café da manhã! 💪',
    cta: null,
  },
  {
    dia: 3,
    emoji: '🌱',
    titulo: 'Sua jornada além dos 21 dias',
    opcoes: [
      {
        nome: 'Fase Inicial (Dias 1–21)',
        tom: 'neutro',
        itens: [
          ['Objetivo', 'Aprender o método'],
          ['Foco', 'Construir consciência'],
          ['Duração', '21 dias'],
          ['Resultado', 'Despertar (novo hábito)'],
        ],
      },
      {
        nome: 'Consolidação (Dias 22–90)',
        tom: 'bom',
        itens: [
          ['Objetivo', 'Transformar em estilo de vida'],
          ['Foco', 'Automatizar o método'],
          ['Duração', '69 dias adicionais'],
          ['Resultado', 'Permanência (nova forma de viver)'],
        ],
      },
    ],
    dica: 'Você já deu os primeiros passos. Agora, imagine transformar esse esforço inicial em um estilo de vida que não exige recomeços. Essa é a proposta do Programa de 90 Dias: consolidar o que você aprendeu em hábitos automáticos que duram a vida toda 💚',
    cta: { label: 'Continuar por 90 dias', tipo: 'upgrade' },
  },
  {
    dia: 4,
    emoji: '🥗',
    titulo: 'Salada: Qualidade vs Quantidade de Gordura',
    opcoes: [
      {
        nome: 'Salada verde clássica',
        tom: 'bom',
        itens: [
          ['Alface', '5 cal'],
          ['Tomate', '20 cal'],
          ['Cenoura', '25 cal'],
          ['Fio de azeite (1 col. chá)', '40 cal'],
        ],
        total: '90 cal · 2g proteína',
        extras: ['Refeição? NÃO — é acompanhamento'],
      },
      {
        nome: 'Salada com muita gordura',
        tom: 'ruim',
        itens: [
          ['Mesmos ingredientes', '+'],
          ['3 col. sopa de azeite', '360 cal'],
        ],
        total: '450 cal · 2g proteína',
        extras: ['Problema: SEM proteína', 'Causa: fome 1h depois'],
      },
    ],
    dica: 'A salada não emagrece. A PROTEÍNA emagrece. Adicione frango/ovos/peixe e vá devagar no azeite. Salada inteligente = proteína + verdura + pouco azeite 💚',
    cta: null,
  },
  {
    dia: 5,
    emoji: '🍗',
    titulo: 'Escolhas Inteligentes no Prato',
    opcoes: [
      {
        nome: '150g frango + 1 xíc. arroz branco',
        tom: 'neutro',
        itens: [
          ['Frango', '170 cal · 31g prot'],
          ['Arroz', '200 cal · 4g prot'],
          ['Brócolis', '35 cal · 4g prot'],
        ],
        total: '405 cal · 39g PROTEÍNA ✅',
        extras: ['Saciedade: 5+ horas'],
      },
      {
        nome: '150g frango + batata-doce',
        tom: 'bom',
        itens: [
          ['Frango', '170 cal · 31g prot'],
          ['Batata-doce', '100 cal · 2g prot'],
          ['Brócolis', '35 cal · 4g prot'],
        ],
        total: '305 cal · 37g PROTEÍNA ✅',
        extras: ['Saciedade: 5+ horas', 'Mais saudável? SIM!'],
      },
    ],
    dica: 'Frango + batata-doce = escolha inteligente. Arroz branco = caloria vazia. Qual você escolhe? 🍗',
    cta: null,
  },
  {
    dia: 6,
    emoji: '🐟',
    titulo: 'Peixe: Proteína Premium com Ômega 3',
    opcoes: [
      {
        nome: '150g salmão grelhado',
        tom: 'neutro',
        itens: [
          ['Calorias', '280'],
          ['Proteína', '25g ✅'],
          ['Ômega 3', 'ALTO (saúde!)'],
          ['Saciedade', '5h'],
          ['Custo', 'R$ 45–50/prato'],
        ],
      },
      {
        nome: '200g peixe branco (tilápia)',
        tom: 'bom',
        itens: [
          ['Calorias', '200'],
          ['Proteína', '30g ✅✅'],
          ['Ômega 3', 'baixo'],
          ['Saciedade', '5h'],
          ['Custo', 'R$ 15–20/prato'],
        ],
      },
    ],
    dica: 'Tanto salmão quanto peixe branco são excelentes. Salmão = mais ômega 3. Peixe branco = mais proteína, mais barato. Escolha conforme seu bolso! 🐟',
    cta: null,
  },
  {
    dia: 7,
    emoji: '🎉',
    titulo: 'Você Completou 1 Semana!',
    opcoes: [
      {
        nome: 'Seu progresso na semana 1',
        tom: 'bom',
        itens: [
          ['Roupa mais folgada', '✅'],
          ['Barriga menos inchada', '✅'],
          ['Energia maior', '✅'],
          ['Disposição alta', '✅'],
        ],
        extras: ['Você já venceu a etapa mais difícil: começar.'],
      },
    ],
    dica: 'Você venceu a parte mais difícil! Registre sua pesagem e suas fotos hoje. Hoje também é o último dia da condição especial do MWA | Programa de 90 Dias por R$ 127 — depois de hoje, essa continuidade passa a ter outro valor. Continue assim! 💪💚',
    cta: { label: 'Continuar por 90 dias', tipo: 'upgrade' },
  },
  {
    dia: 8,
    emoji: '🍨',
    titulo: 'Lanche: 260 Calorias ou 400 Calorias?',
    opcoes: [
      {
        nome: 'Iogurte grego + granola + mel',
        tom: 'bom',
        itens: [
          ['Iogurte grego', '120 cal · 15g prot'],
          ['Granola', '80 cal · 2g prot'],
          ['Mel', '60 cal'],
        ],
        total: '260 cal · 17g PROTEÍNA ✅',
        extras: ['Saciedade: 3h', 'Saúde: 10/10'],
      },
      {
        nome: 'Brownie (típico)',
        tom: 'ruim',
        itens: [
          ['Calorias', '400'],
          ['Proteína', '2g ❌'],
          ['Açúcar', 'MUITO'],
          ['Saciedade', '30 min'],
          ['Saúde', '2/10'],
        ],
        extras: ['Diferença: 140 calorias!'],
      },
    ],
    dica: 'Precisa de lanche? Escolha proteína! Iogurte grego > Brownie. Seu corpo agradece! 😋',
    cta: null,
  },
  {
    dia: 9,
    emoji: '🍌',
    titulo: 'Banana vs Açaí: Qual Escolher?',
    opcoes: [
      {
        nome: 'Banana + aveia + mel',
        tom: 'bom',
        itens: [
          ['Banana', '105 cal · 1g prot'],
          ['Aveia', '80 cal · 3g prot'],
          ['Mel', '65 cal'],
        ],
        total: '250 cal · 4g proteína',
        extras: ['Preço: R$ 2–3', 'Saúde: 9/10'],
      },
      {
        nome: 'Tigela de açaí (típica)',
        tom: 'ruim',
        itens: [
          ['Polpa de açaí', '350 cal'],
          ['Granola', '150 cal'],
          ['Mel', '100 cal'],
          ['Leite condensado', '100 cal'],
        ],
        total: '700 cal · 5g proteína',
        extras: ['Preço: R$ 25–30', 'Saúde: 4/10'],
      },
    ],
    dica: 'Açaí é lindo, mas é SOBREMESA, não lanche. Banana com aveia = inteligente, barato e rápido. Qual você escolhe? 🍌',
    cta: null,
  },
  {
    dia: 10,
    emoji: '🍞',
    titulo: 'Pão Branco vs Pão Integral',
    opcoes: [
      {
        nome: 'Pão francês (1 unidade)',
        tom: 'ruim',
        itens: [
          ['Calorias', '150'],
          ['Fibras', '0,8g'],
          ['Índice glicêmico', 'Alto'],
          ['Saciedade', '1–2h'],
        ],
      },
      {
        nome: 'Pão integral (2 fatias)',
        tom: 'bom',
        itens: [
          ['Calorias', '140'],
          ['Fibras', '4g ✅'],
          ['Índice glicêmico', 'Moderado'],
          ['Saciedade', '3h'],
        ],
      },
    ],
    dica: 'Mesma caloria, resultado diferente: mais fibras significam mais saciedade e menos pico de açúcar no sangue. Pequenas trocas, grandes resultados. 🌾',
    cta: null,
  },
  {
    dia: 11,
    emoji: '☕',
    titulo: 'Café com Leite: Integral vs Desnatado',
    opcoes: [
      {
        nome: 'Café com leite integral',
        tom: 'ruim',
        itens: [
          ['Café preto', '5 cal'],
          ['Leite integral 200ml', '140 cal'],
          ['Açúcar (1 colher)', '20 cal'],
        ],
        total: '165 cal · 7g proteína',
        extras: ['Saúde: 5/10'],
      },
      {
        nome: 'Café com leite desnatado',
        tom: 'bom',
        itens: [
          ['Café preto', '5 cal'],
          ['Leite desnatado 200ml', '80 cal'],
          ['Adoçante', '0 cal'],
        ],
        total: '85 cal · 8g PROTEÍNA ✅',
        extras: ['Economia: 80 calorias', 'Saúde: 8/10'],
      },
    ],
    dica: 'Mude do leite integral para o desnatado. 80 calorias por dia = 560 por semana. Pequenas mudanças = grandes resultados! ☕',
    cta: null,
  },
  {
    dia: 12,
    emoji: '🍫',
    titulo: 'Chocolate ao Leite vs 70% Cacau',
    opcoes: [
      {
        nome: 'Chocolate ao leite (30g)',
        tom: 'ruim',
        itens: [
          ['Calorias', '160'],
          ['Açúcar', '18g (MUITO!)'],
          ['Cacau', '10%'],
          ['Benefícios', 'ZERO'],
        ],
      },
      {
        nome: 'Chocolate 70% cacau (30g)',
        tom: 'bom',
        itens: [
          ['Calorias', '160'],
          ['Açúcar', '5g (muito menos!)'],
          ['Cacau', '70% (polifenóis)'],
          ['Benefícios', 'Antioxidantes ✅'],
        ],
      },
    ],
    dica: 'Mesma caloria, resultado diferente! Chocolate amargo = polifenóis = saúde do coração. Chocolate ao leite = açúcar = inchaço. Escolha inteligente! 🍫',
    cta: null,
  },
  {
    dia: 13,
    emoji: '🍝',
    titulo: 'Molho Pronto vs Molho Caseiro',
    opcoes: [
      {
        nome: 'Molho de tomate industrializado (100g)',
        tom: 'ruim',
        itens: [
          ['Calorias', '90'],
          ['Açúcar/sódio', 'Alto'],
          ['Aditivos', 'Vários'],
        ],
      },
      {
        nome: 'Molho caseiro (tomate, alho, azeite)',
        tom: 'bom',
        itens: [
          ['Calorias', '60'],
          ['Açúcar/sódio', 'Controlado por você'],
          ['Aditivos', 'Nenhum'],
        ],
      },
    ],
    dica: 'Molhos prontos costumam esconder açúcar e sódio em excesso. Fazer o seu leva poucos minutos a mais e coloca você no controle do que come. 🍅',
    cta: null,
  },
  {
    dia: 14,
    emoji: '🎉',
    titulo: 'Parabéns! Você Completou 2 Semanas!',
    opcoes: [
      {
        nome: '2 semanas — você já está diferente!',
        tom: 'bom',
        itens: [
          ['Roupas muito mais folgadas', '✅'],
          ['Barriga mais reta', '✅'],
          ['Rosto mais fino', '✅'],
          ['Disposição no teto', '✅'],
        ],
        extras: ['Agora é reta final. Faltam só 7 dias!'],
      },
    ],
    dica: 'Registre a pesagem da semana 2 e compare com a semana 1. Você consegue! 💚',
    cta: { label: 'Ver Meu Progresso', tipo: 'progresso' },
  },
  {
    dia: 15,
    emoji: '🎯',
    titulo: 'Sua jornada merece um olhar individual',
    opcoes: [
      {
        nome: 'Método Sozinho',
        tom: 'neutro',
        itens: [
          ['Informação', 'Completa (21 dicas + app)'],
          ['Apoio', 'Estrutura do método'],
          ['Desafios', 'Você resolve com autonomia'],
          ['Progresso', 'Tendência geral'],
        ],
      },
      {
        nome: 'Método + Ajuste Pessoal',
        tom: 'bom',
        itens: [
          ['Informação', 'Aplicada ao SEU contexto'],
          ['Apoio', 'Mentoria individual'],
          ['Desafios', 'Você resolve com orientação'],
          ['Progresso', 'Acelerado e seguro'],
        ],
      },
    ],
    dica: 'Você já percorreu 14 dias de aprendizado. Neste ponto, a teoria é clara — mas a prática começa a revelar os desafios específicos da SUA rotina. Uma sessão estratégica individual te ajuda a desenhar o mapa personalizado de sucesso. Esse é o diferencial: transformar método em hábito SEU 💚',
    cta: { label: 'Agendar minha sessão estratégica', tipo: 'sessao' },
  },
  {
    dia: 16,
    emoji: '🍊',
    titulo: 'Suco Natural vs Fruta Inteira',
    opcoes: [
      {
        nome: 'Suco de laranja (1 copo)',
        tom: 'ruim',
        itens: [
          ['Calorias', '120'],
          ['Açúcar', '25g (alto!)'],
          ['Fibra', 'quase ZERO ❌'],
          ['Saciedade', '30 min'],
        ],
      },
      {
        nome: '2 laranjas inteiras',
        tom: 'bom',
        itens: [
          ['Calorias', '80'],
          ['Açúcar', '15g'],
          ['Fibra', '4g ✅'],
          ['Saciedade', '2h'],
        ],
      },
    ],
    dica: 'Suco emagrece? Não — suco é açúcar líquido. Fruta inteira = fibra = saciedade = emagrecimento. Escolha sempre a fruta inteira! 🍊',
    cta: null,
  },
  {
    dia: 17,
    emoji: '🥔',
    titulo: 'Arroz Branco vs Integral vs Batata-Doce',
    opcoes: [
      {
        nome: '1 xíc. arroz branco',
        tom: 'ruim',
        itens: [
          ['Calorias', '200'],
          ['Carboidrato', '44g (rápido)'],
          ['Fibra', '0,6g ❌'],
          ['Sacia', '2h'],
        ],
      },
      {
        nome: '1 xíc. arroz integral',
        tom: 'neutro',
        itens: [
          ['Calorias', '215'],
          ['Carboidrato', '45g (lento)'],
          ['Fibra', '3,5g ✅'],
          ['Sacia', '3h'],
        ],
      },
      {
        nome: '1 batata-doce média',
        tom: 'bom',
        itens: [
          ['Calorias', '100'],
          ['Carboidrato', '24g (lento) ✅'],
          ['Fibra', '3,9g ✅'],
          ['Sacia', '4h'],
          ['Vitamina A', 'ALTÍSSIMA'],
        ],
      },
    ],
    dica: 'Ranking: 1º batata-doce (menos caloria, mais fibra e vitamina), 2º arroz integral, 3º arroz branco (vazio, não sacia). Qual você escolhe? 🥔',
    cta: null,
  },
  {
    dia: 18,
    emoji: '🍷',
    titulo: 'Cerveja vs Vinho vs Destilado',
    opcoes: [
      {
        nome: 'Cerveja (lata 350ml)',
        tom: 'ruim',
        itens: [
          ['Calorias', '150 (maioria do álcool)'],
          ['Carboidratos residuais', '~4g'],
          ['Causa inchaço?', 'SIM'],
          ['Saúde', '2/10'],
        ],
      },
      {
        nome: 'Vinho tinto (taça 150ml)',
        tom: 'bom',
        itens: [
          ['Calorias', '120'],
          ['Açúcar', '1g ✅'],
          ['Causa inchaço?', 'menos'],
          ['Saúde', '6/10'],
        ],
      },
      {
        nome: 'Destilado (dose 50ml)',
        tom: 'neutro',
        itens: [
          ['Calorias', '120'],
          ['Açúcar', '0g ✅✅'],
          ['Causa inchaço?', 'não'],
          ['Saúde', '5/10 (álcool puro)'],
        ],
      },
    ],
    dica: 'Se vai beber: vinho tinto > destilado > cerveja. Cerveja = inchaço + açúcar. Vinho = menos açúcar, mais polifenóis. Moderação sempre! 🍇',
    cta: null,
  },
  {
    dia: 19,
    emoji: '💪',
    titulo: 'Proteína em Pó vs Comida de Verdade',
    opcoes: [
      {
        nome: '1 scoop whey + leite',
        tom: 'neutro',
        itens: [
          ['Calorias', '140'],
          ['Proteína', '25g ✅'],
          ['Micronutrientes', 'poucos'],
          ['Saciedade', '1–2h'],
          ['Preço', 'R$ 2/dose'],
        ],
      },
      {
        nome: '150g peito de frango',
        tom: 'bom',
        itens: [
          ['Calorias', '170'],
          ['Proteína', '31g ✅✅'],
          ['Micronutrientes', 'MUITOS'],
          ['Saciedade', '4–5h'],
          ['Preço', 'R$ 5–7'],
        ],
      },
    ],
    dica: 'Proteína em pó é conveniente, não é melhor. Comida de verdade = mais vitaminas + maior saciedade. Ideal: 70% comida real + 30% suplemento. Você consegue! 💪',
    cta: null,
  },
  {
    dia: 20,
    emoji: '🥤',
    titulo: 'Refrigerante vs Chá Herbalife vs Água',
    opcoes: [
      {
        nome: 'Refrigerante (lata 350ml)',
        tom: 'ruim',
        itens: [
          ['Calorias', '150'],
          ['Açúcar', '40g (MUITO!)'],
          ['Efeito', 'pico de açúcar + queda'],
          ['Saúde', '0/10'],
          ['Emagrece?', 'NÃO'],
        ],
      },
      {
        nome: 'Chá Herbalife (1 dose)',
        tom: 'bom',
        itens: [
          ['Calorias', '5'],
          ['Açúcar', '0g ✅'],
          ['Efeito', 'energia + controle do apetite'],
          ['Saúde', '8/10'],
          ['Cabe na rotina?', 'SIM!'],
        ],
      },
      {
        nome: 'Água (1 litro)',
        tom: 'bom',
        itens: [
          ['Calorias', '0'],
          ['Açúcar', '0'],
          ['Efeito', 'hidrata'],
          ['Saúde', '10/10'],
          ['Emagrece?', 'ESSENCIAL'],
        ],
      },
    ],
    dica: 'Ordem de boas escolhas: 1º água (sempre!), 2º chá, 3º café/chá verde. Refrigerante: evite sempre que possível. Você já sabe escolher! 💚',
    cta: null,
  },
  {
    dia: 21,
    emoji: '🏆',
    titulo: 'Você completou sua Jornada de 21 Dias!',
    opcoes: [
      {
        nome: 'Seu resultado em 21 dias',
        tom: 'bom',
        itens: [
          ['Como contar calorias', '✅'],
          ['Proteína é a chave', '✅'],
          ['Pequenas mudanças = resultado', '✅'],
          ['Uma nova forma de viver', '✅'],
        ],
        extras: ['Registre a pesagem final e compare as fotos do dia 1 com as de hoje.'],
      },
    ],
    dica: 'Mais importante do que chegar até aqui é perceber que a transformação não depende de perfeição. Ela nasce da repetição, da consciência e das escolhas que você decide continuar fazendo. Este pode ser apenas o começo — o MWA | Programa de 90 Dias está disponível para você aprofundar sua evolução, com 20% OFF. 💚',
    cta: { label: 'Continuar por 90 dias', tipo: 'upgrade' },
  },
]

export function informativoDoDia(dia) {
  return INFORMATIVOS.find((i) => i.dia === dia) ?? INFORMATIVOS[0]
}
