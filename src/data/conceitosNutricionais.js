// Glossário de conceitos nutricionais do MWA — apêndice de apoio em Ferramentas.
// Cada conceito explica o que é e por que o programa trabalha esse tema,
// com a mesma base científica usada nos informativos e dicas dos 30 dias.

export const CONCEITOS_NUTRICIONAIS = [
  {
    id: 'densidade-nutricional',
    emoji: '💎',
    titulo: 'Densidade Nutricional',
    tituloEn: 'Nutrient Density',
    oQueE:
      'É a quantidade de nutrientes — vitaminas, minerais, proteína, fibra — que um alimento entrega em relação às calorias que ele contém. Um alimento de alta densidade nutricional entrega muito benefício por caloria; um de baixa densidade entrega muita caloria e pouco benefício real ao corpo.',
    oQueEEn:
      "It's the amount of nutrients — vitamins, minerals, protein, fiber — a food delivers relative to the calories it contains. A high nutrient-density food delivers a lot of benefit per calorie; a low-density one delivers a lot of calories and little real benefit to the body.",
    porQue:
      'Emagrecer com saúde não é apenas "comer menos" — é privilegiar alimentos que nutrem de verdade dentro do seu orçamento calórico. Cada vez que você escolhe batata-doce em vez de arroz branco, ou um shake proteico em vez de pão com manteiga, está aplicando esse conceito na prática, mesmo sem perceber.',
    porQueEn:
      'Losing weight in a healthy way isn\'t just "eating less" — it\'s favoring foods that truly nourish you within your calorie budget. Every time you choose sweet potato over white rice, or a protein shake over bread with butter, you\'re applying this concept in practice, even without noticing.',
  },
  {
    id: 'deficit-calorico',
    emoji: '⚖️',
    titulo: 'Déficit Calórico',
    tituloEn: 'Caloric Deficit',
    oQueE:
      'É a diferença entre as calorias que você consome e as calorias que seu corpo gasta em um dia (o seu TDEE). Quando você consome um pouco menos do que gasta, o corpo é obrigado a buscar energia nas reservas de gordura — e é exatamente aí que o emagrecimento acontece.',
    oQueEEn:
      "It's the difference between the calories you consume and the calories your body burns in a day (your TDEE). When you consume a bit less than you burn, your body is forced to pull energy from fat reserves — and that's exactly where weight loss happens.",
    porQue:
      'É o único mecanismo comprovado cientificamente por trás de qualquer emagrecimento, não importa o nome da dieta da vez. Sem entender e sustentar o déficit calórico, nenhuma estratégia alimentar funciona de forma real e duradoura — por isso ele é a base de tudo o que você pratica aqui no MWA.',
    porQueEn:
      "It's the only scientifically proven mechanism behind any weight loss, no matter what the diet of the moment is called. Without understanding and sustaining a caloric deficit, no eating strategy works in a real, lasting way — that's why it's the foundation of everything you practice here in MWA.",
  },
  {
    id: 'calorias',
    emoji: '🔥',
    titulo: 'Calorias',
    tituloEn: 'Calories',
    oQueE:
      'É a unidade de medida da energia que os alimentos fornecem ao seu corpo. Toda caloria que você consome vem de um dos três macronutrientes: proteína, carboidrato ou gordura.',
    oQueEEn:
      "It's the unit that measures the energy foods give your body. Every calorie you consume comes from one of three macronutrients: protein, carbohydrate, or fat.",
    porQue:
      'Contar calorias não é sobre obsessão ou restrição — é sobre ter clareza real do que você consome, para poder ajustar com precisão em vez de "achismo". É essa clareza que transforma boas intenções em resultado mensurável, e é por isso que o app te ajuda a registrar cada refeição.',
    porQueEn:
      "Counting calories isn't about obsession or restriction — it's about having real clarity on what you consume, so you can adjust with precision instead of guesswork. That clarity is what turns good intentions into measurable results, which is why the app helps you log every meal.",
  },
  {
    id: 'macronutrientes',
    emoji: '🧩',
    titulo: 'Macronutrientes',
    tituloEn: 'Macronutrients',
    oQueE:
      'São os três grandes grupos de nutrientes que fornecem energia ao corpo: proteínas, carboidratos e gorduras. Proteína e carboidrato têm 4 kcal por grama; gordura tem 9 kcal por grama — mais que o dobro.',
    oQueEEn:
      "They're the three major nutrient groups that provide energy to the body: protein, carbohydrate, and fat. Protein and carbs have 4 kcal per gram; fat has 9 kcal per gram — more than double.",
    porQue:
      'Não é só o total de calorias que importa, mas a proporção entre elas. Essa proporção determina se você preserva massa muscular, sente saciedade e mantém energia estável ao longo do dia. Ajustar macros é ajustar a qualidade do seu resultado, não apenas a quantidade da balança.',
    porQueEn:
      "It's not just the calorie total that matters, but the proportion between them. That proportion determines whether you preserve muscle mass, feel satiated, and keep energy stable throughout the day. Adjusting macros means adjusting the quality of your result, not just the number on the scale.",
  },
  {
    id: 'proteina',
    emoji: '🥩',
    titulo: 'Proteína',
    tituloEn: 'Protein',
    oQueE:
      'Macronutriente formado por aminoácidos, responsável por construir e preservar músculos, produzir enzimas e hormônios, e sustentar seu sistema imunológico.',
    oQueEEn:
      'A macronutrient made of amino acids, responsible for building and preserving muscle, producing enzymes and hormones, and sustaining your immune system.',
    porQue:
      'É o macro mais saciante, tem o maior efeito térmico (o corpo gasta mais energia só para digeri-la) e é essencial para que você perca gordura sem perder músculo — a diferença real entre "emagrecer" e conquistar um corpo firme e com disposição.',
    porQueEn:
      "It's the most satiating macro, has the highest thermic effect (your body spends more energy just digesting it), and is essential for losing fat without losing muscle — the real difference between \"losing weight\" and achieving a toned, energetic body.",
  },
  {
    id: 'carboidrato',
    emoji: '🍠',
    titulo: 'Carboidrato',
    tituloEn: 'Carbohydrate',
    oQueE:
      'Principal fonte de energia rápida do corpo, especialmente para o cérebro e os músculos em atividade. Pode ser simples (açúcares, alimentos refinados) ou complexo (integrais, tubérculos, leguminosas).',
    oQueEEn:
      "The body's main source of fast energy, especially for the brain and active muscles. It can be simple (sugars, refined foods) or complex (whole grains, tubers, legumes).",
    porQue:
      'A qualidade do carboidrato escolhido — sua fibra, seu índice glicêmico — determina se ele sustenta sua energia por horas ou gera picos de fome logo depois. Carboidrato não é vilão: é sobre escolher bem e respeitar a porção.',
    porQueEn:
      "The quality of the carb you choose — its fiber, its glycemic index — determines whether it sustains your energy for hours or triggers hunger spikes soon after. Carbs aren't the villain: it's about choosing well and respecting the portion.",
  },
  {
    id: 'gordura',
    emoji: '🥑',
    titulo: 'Gordura',
    tituloEn: 'Fat',
    oQueE:
      'O macronutriente mais calórico (9 kcal por grama), essencial para produção hormonal, absorção das vitaminas A, D, E e K, e saúde das membranas celulares.',
    oQueEEn:
      'The most calorie-dense macronutrient (9 kcal per gram), essential for hormone production, absorbing vitamins A, D, E and K, and cell membrane health.',
    porQue:
      'Gordura não engorda por si só — excesso de calorias engorda, e a gordura concentra mais calorias por grama que qualquer outro macro. Escolher bem (azeite, ômega-3) e medir a quantidade é o que ajuda a aproveitar os benefícios sem sabotar o seu déficit calórico.',
    porQueEn:
      "Fat doesn't make you gain weight by itself — a calorie surplus does, and fat packs more calories per gram than any other macro. Choosing well (olive oil, omega-3) and measuring the amount is what helps you enjoy the benefits without sabotaging your caloric deficit.",
  },
  {
    id: 'fibras',
    emoji: '🌾',
    titulo: 'Fibras',
    tituloEn: 'Fiber',
    oQueE:
      'Parte dos alimentos vegetais que o corpo não digere completamente. Retarda o esvaziamento do estômago, estabiliza a glicose no sangue e alimenta as bactérias benéficas do seu intestino.',
    oQueEEn:
      "The part of plant foods your body doesn't fully digest. It slows stomach emptying, stabilizes blood glucose, and feeds the beneficial bacteria in your gut.",
    porQue:
      'Fibra é sinônimo de saciedade prolongada com baixíssimo custo calórico — uma das ferramentas mais poderosas, e mais subestimadas, para sustentar o déficit calórico sem sofrimento e sem fome descontrolada.',
    porQueEn:
      "Fiber is synonymous with prolonged satiety at a very low calorie cost — one of the most powerful, and most underrated, tools for sustaining a caloric deficit without suffering or out-of-control hunger.",
  },
  {
    id: 'micronutrientes',
    emoji: '🍊',
    titulo: 'Micronutrientes',
    tituloEn: 'Micronutrients',
    oQueE:
      'Vitaminas e minerais que o corpo precisa em pequenas quantidades, mas que são essenciais para praticamente todas as funções metabólicas, imunológicas e hormonais.',
    oQueEEn:
      'Vitamins and minerals your body needs in small amounts, but which are essential for practically every metabolic, immune, and hormonal function.',
    porQue:
      'Uma alimentação em déficit calórico, se mal planejada, pode ser pobre em micronutrientes — e isso compromete energia, imunidade e até os próprios resultados. Escolher alimentos de alta densidade nutricional contribui para que, mesmo comendo menos calorias, você continue bem nutrida.',
    porQueEn:
      'A poorly planned diet in a caloric deficit can be low in micronutrients — and that compromises energy, immunity, and even your results. Choosing high nutrient-density foods helps you stay well-nourished even while eating fewer calories.',
  },
]
