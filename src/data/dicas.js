// Dicas diárias do programa de 21 dias
// Temas: 1–3 introdução, 4–7 hidratação, 8–10 proteínas, 11–13 fibras,
// 14–16 carboidratos, 17–19 gorduras, 20–21 manutenção

export const DICAS = [
  {
    dia: 1,
    tema: 'Introdução',
    icone: '🌱',
    titulo: 'Bem-vindo(a) aos seus 21 dias!',
    conteudo:
      'Hoje começa uma jornada de 21 dias — o tempo que a ciência sugere para começar a consolidar um novo hábito. Seu corpo gasta energia até em repouso: essa é a sua TMB (Taxa Metabólica Basal). Somando suas atividades diárias, chegamos ao seu TDEE, o total de calorias que você gasta por dia. Suas metas foram calculadas a partir desses números e do seu objetivo. Não busque perfeição: busque constância. Registrar o que você come já muda o seu comportamento alimentar — estudos mostram que quem anota, emagrece mais.',
    dicaPratica: 'Registre TODAS as refeições de hoje, mesmo as que "não contam". Consciência vem antes da mudança.',
    produto: null,
  },
  {
    dia: 2,
    tema: 'Introdução',
    icone: '🧮',
    titulo: 'O que são macros, afinal?',
    conteudo:
      'Macronutrientes são os três blocos que compõem tudo o que você come: proteínas (4 kcal/g) constroem e preservam seus músculos; carboidratos (4 kcal/g) são a fonte de energia preferida do corpo; gorduras (9 kcal/g) regulam hormônios e absorvem vitaminas. Emagrecer não é só "comer menos" — é dar ao corpo a proporção certa. Por isso seu painel mostra metas separadas para cada macro. Uma dieta com proteína adequada preserva massa magra enquanto você perde gordura, e é isso que muda o corpo de verdade.',
    dicaPratica: 'Olhe o painel HOJE e veja qual macro está mais longe da meta. Ajuste a próxima refeição para equilibrá-lo.',
    produto: null,
  },
  {
    dia: 3,
    tema: 'Visão de Longo Prazo',
    icone: '🌱',
    titulo: 'Planejar é cuidar do seu "eu" do futuro',
    conteudo:
      'Olá! Aqui é a Wanessa. Você já começou a sentir a diferença de ter uma estratégia clara. Mas a verdade é que hábitos profundos levam tempo para se tornarem automáticos. Eu mantenho minha transformação há 14 anos porque entendi que o segredo não é a intensidade de uma semana, mas a consistência de meses. O Programa de 90 Dias foi desenhado para que essa nova forma de viver deixe de ser um desafio e se torne sua natureza. Por ser aluna da Jornada de 21 dias, preparei uma condição especial para você não interromper sua evolução. Continuidade é tudo.',
    dicaPratica: 'Reserve 5 minutos hoje para escrever onde você quer estar daqui a 3 meses. Visualize sua energia, suas roupas e sua saúde.',
    produto: null,
  },
  {
    dia: 4,
    tema: 'Hidratação',
    icone: '💧',
    titulo: 'Água: seu acelerador de resultados',
    conteudo:
      'Entramos na semana da hidratação! Seu corpo é cerca de 60% água, e ela participa de TODAS as reações do metabolismo — inclusive a queima de gordura. Desidratação leve (1–2%) já reduz energia, concentração e rendimento físico, e é frequentemente confundida com fome. Sua meta pessoal é de 35 ml por kg de peso, calculada no seu painel. Espalhe ao longo do dia: o corpo absorve melhor pequenos volumes frequentes do que grandes volumes de uma vez.',
    dicaPratica: 'Deixe uma garrafa cheia sempre à vista. Meta: beber 1 copo assim que acordar, antes do café.',
    produto: null,
  },
  {
    dia: 5,
    tema: 'Hidratação',
    icone: '🥤',
    titulo: 'Sede ou fome? Aprenda a diferenciar',
    conteudo:
      'O hipotálamo, região do cérebro que controla a fome, também controla a sede — e os sinais se confundem. Resultado: muita gente come quando na verdade precisa beber. Antes de um lanche fora de hora, beba um copo de água e espere 10 minutos. Se a "fome" passar, era sede. Beber 500 ml de água antes das refeições principais também reduz naturalmente a quantidade que você come, além de dar um pequeno impulso temporário no metabolismo.',
    dicaPratica: 'Hoje, beba 1 copo de água 15 minutos antes do almoço e do jantar. Observe a diferença na saciedade.',
    produto: null,
  },
  {
    dia: 6,
    tema: 'Hidratação',
    icone: '🍵',
    titulo: 'Chás: hidratação que trabalha a seu favor',
    conteudo:
      'Chás contam para sua meta de água e ainda trazem compostos bioativos. O chá verde e o chá preto contêm catequinas e cafeína, que ajudam a elevar levemente o gasto energético e dão foco e disposição — ótimos aliados em um programa de emagrecimento. Prefira sem açúcar: adoçar o chá transforma um aliado de 5 kcal em uma bebida calórica. Uma xícara no meio da manhã ou antes do treino é o momento ideal.',
    dicaPratica: 'Troque o cafezinho adoçado da tarde por um chá quente ou gelado sem açúcar.',
    produto: { nome: 'Herbal Tea Concentrate', descricao: 'Chá instantâneo com extratos de chá verde e preto — energia com apenas ~6 kcal por dose.' },
  },
  {
    dia: 7,
    tema: 'Hidratação',
    icone: '⚖️',
    titulo: 'Dia de pesagem — semana 1 concluída!',
    conteudo:
      'Uma semana! Hoje é dia de pesagem e fotos na aba PROGRESSO. Pese-se em jejum, após ir ao banheiro, com roupas leves — sempre nas mesmas condições, para comparar o comparável. Importante: o peso oscila naturalmente 1–2 kg por retenção de líquido, sal, hormônios e intestino. Por isso as fotos importam tanto: músculos mais firmes e menos inchaço aparecem no espelho antes de aparecerem na balança. Avalie a tendência da semana, nunca um dia isolado.',
    dicaPratica: 'Faça sua pesagem e as 4 fotos hoje cedo. Vista a mesma roupa nas próximas semanas para comparar.',
    produto: null,
  },
  {
    dia: 8,
    tema: 'Proteínas',
    icone: '🥩',
    titulo: 'Proteína: o macro que muda o jogo',
    conteudo:
      'Semana da proteína! Ela é o macro mais importante em um processo de emagrecimento por três motivos: (1) preserva massa muscular enquanto você perde gordura; (2) é o macro que mais sacia — você sente menos fome; (3) tem o maior efeito térmico: o corpo gasta 20–30% das calorias da proteína só para digeri-la. Sua meta diária está no painel. A maioria das pessoas come proteína de menos no café da manhã e de mais no jantar — equilibrar isso melhora os resultados.',
    dicaPratica: 'Inclua uma fonte de proteína no café da manhã de hoje: ovos, iogurte ou um shake.',
    produto: null,
  },
  {
    dia: 9,
    tema: 'Proteínas',
    icone: '🍳',
    titulo: 'As melhores fontes de proteína',
    conteudo:
      'Fontes magras entregam mais proteína por caloria: peito de frango (31 g/100 g), atum (26 g), tilápia (20 g), ovos (6 g por unidade), iogurte grego (10 g/100 g) e cortes magros de carne vermelha. Fontes vegetais como feijão, lentilha e grão-de-bico também contribuem, junto com fibras. Na correria, um shake proteico bem formulado resolve: rápido, prático e com dose certa. Use a calculadora de macros na aba FERRAMENTAS para conferir qualquer alimento.',
    dicaPratica: 'Confira na calculadora quanto de proteína tem o seu almoço típico. Está perto de 30 g?',
    produto: { nome: 'Shake Herbalife', descricao: 'Cerca de 18 g de proteína por dose preparada com leite desnatado — café da manhã ou lanche prático.' },
  },
  {
    dia: 10,
    tema: 'Proteínas',
    icone: '⏰',
    titulo: 'Distribua a proteína ao longo do dia',
    conteudo:
      'O corpo aproveita melhor a proteína quando ela chega em doses regulares: procure 20–30 g por refeição, a cada 3–4 horas, em vez de concentrar tudo no jantar. Essa distribuição mantém a síntese muscular ativa o dia inteiro e controla a fome entre as refeições — a maior causa de beliscos. Se seu jantar costuma ser "pesado" e o café da manhã "leve", experimente inverter um pouco esse equilíbrio e observe a energia ao longo do dia.',
    dicaPratica: 'Planeje as refeições de hoje garantindo pelo menos 20 g de proteína em três delas.',
    produto: { nome: 'Protein Drink Mix', descricao: '15 g de proteína por dose — reforço para lanches ou para enriquecer o shake.' },
  },
  {
    dia: 11,
    tema: 'Fibras',
    icone: '🌾',
    titulo: 'Fibras: saciedade de longa duração',
    conteudo:
      'Semana das fibras! Elas retardam o esvaziamento do estômago, estabilizam a glicose no sangue e mantêm você satisfeito(a) por horas — tudo isso praticamente sem calorias absorvíveis. Sua meta está no painel (cerca de 14 g a cada 1000 kcal). A maioria dos brasileiros consome metade do recomendado. Boas fontes: feijão (8,5 g/100 g), aveia, chia, frutas com casca, brócolis e folhas. Aumente gradualmente e beba bastante água junto — fibra sem água pode causar desconforto.',
    dicaPratica: 'Adicione 1 colher de chia ou aveia em alguma refeição de hoje. São +5 g de fibra fáceis.',
    produto: null,
  },
  {
    dia: 12,
    tema: 'Fibras',
    icone: '🦠',
    titulo: 'Intestino saudável, corpo saudável',
    conteudo:
      'Suas fibras alimentam trilhões de bactérias benéficas no intestino — a microbiota. Ela influencia digestão, imunidade, inflamação e até o humor e o apetite. Fibras solúveis (aveia, maçã, feijão) viram um gel que alimenta essas bactérias; insolúveis (folhas, farelos) aceleram o trânsito intestinal. Intestino regular também significa menos inchaço abdominal — aquele efeito "desinchou" das primeiras semanas vem muito daí. Variedade de vegetais = microbiota diversa = metabolismo melhor.',
    dicaPratica: 'Coma pelo menos 3 vegetais de cores diferentes hoje. Cada cor alimenta bactérias diferentes.',
    produto: { nome: 'Active Fiber Complex', descricao: '5 g de fibras solúveis e insolúveis por dose, sabor neutro — misture em água ou no shake.' },
  },
  {
    dia: 13,
    tema: 'Fibras',
    icone: '🍎',
    titulo: 'Fibra é a "vacina" contra a fome',
    conteudo:
      'Compare: 100 kcal de biscoito somem em 2 mordidas e não saciam nada; 100 kcal de maçã com casca (2 unidades pequenas) enchem o estômago, demoram a digerir e seguram a fome por horas. Essa é a mágica da densidade nutricional: alimentos ricos em fibra e água entregam mais volume e nutrição por caloria. No supermercado, a regra prática é simples: quanto menos ingredientes no rótulo e mais perto da forma natural, mais fibra e saciedade o alimento entrega.',
    dicaPratica: 'Quando bater vontade de doce hoje, coma primeiro uma fruta. Se a vontade continuar, tudo bem — mas geralmente ela passa.',
    produto: null,
  },
  {
    dia: 14,
    tema: 'Carboidratos',
    icone: '🍠',
    titulo: 'Dia de pesagem + a verdade sobre carboidratos',
    conteudo:
      'Duas semanas — faça hoje sua pesagem e fotos na aba PROGRESSO! E vamos falar do macro mais injustiçado: o carboidrato. Ele NÃO é vilão — é a fonte de energia preferida do cérebro e dos músculos. O problema é a qualidade e a quantidade. Carboidratos integrais e naturais (batata-doce, arroz integral, frutas, mandioca) vêm com fibras e nutrientes; os ultraprocessados (biscoitos, refrigerantes, salgadinhos) são "calorias vazias": muita energia, zero saciedade, zero nutrição.',
    dicaPratica: 'Pese-se, tire as fotos e compare com a semana 1. Depois, confira: seus carboidratos de hoje são "de verdade" ou de pacote?',
    produto: null,
  },
  {
    dia: 15,
    tema: 'Ajuste de Rota e Personalização',
    icone: '🎯',
    titulo: 'Onde a teoria encontra a sua vida real',
    conteudo:
      'Olá! Ao longo de 20 anos como nutricionista, percebi que o método é a bússola, mas a estratégia individual é o que garante que você não pare no meio do caminho. No MWA, acreditamos que "o corpo responde quando a mente entende". Na Sessão Estratégica, eu e você olharemos para os seus desafios específicos — seja o sono, a rotina de trabalho ou a organização das refeições — para desenhar o seu mapa personalizado de sucesso. É a oportunidade de ter a minha experiência de 14 anos de manutenção aplicada diretamente à sua realidade. Você está no ponto crítico onde o "entusiasmo inicial" começa a ser testado pela rotina. Oferecer suporte individual agora previne a desistência.',
    dicaPratica: 'Liste os dois pontos da sua rotina que você ainda sente dificuldade em ajustar. Esse será o ponto de partida da nossa conversa individual.',
    produto: null,
  },
  {
    dia: 16,
    tema: 'Carboidratos',
    icone: '🔍',
    titulo: 'Açúcar escondido: onde ele se disfarça',
    conteudo:
      'O açúcar se esconde sob mais de 50 nomes nos rótulos: xarope de milho, maltodextrina, dextrose, néctar, suco concentrado... Molho pronto, pão de forma, iogurte "de frutas", granola e barrinhas podem carregar açúcar equivalente a uma sobremesa. Um iogurte adoçado pode ter 20 g de açúcar — 4 colheres de chá! A defesa: leia a lista de ingredientes (se açúcar está entre os 3 primeiros, cuidado) e prefira versões naturais que você mesmo adoça com fruta.',
    dicaPratica: 'Pegue 3 produtos da sua despensa e procure o açúcar na lista de ingredientes. Vai se surpreender.',
    produto: null,
  },
  {
    dia: 17,
    tema: 'Gorduras',
    icone: '🥑',
    titulo: 'Gordura não engorda — excesso de calorias engorda',
    conteudo:
      'Semana das gorduras! Elas são essenciais: formam hormônios (inclusive os que regulam o apetite), constroem membranas celulares e transportam as vitaminas A, D, E e K. Cortar gordura demais desregula o corpo. A questão é escolher bem: priorize as insaturadas — azeite, abacate, castanhas, peixes — e modere as saturadas. O único cuidado real é a densidade calórica: com 9 kcal/g, porções pequenas somam rápido. Uma colher de azeite tem ~90 kcal; meça, não despeje.',
    dicaPratica: 'Troque a margarina ou manteiga de hoje por meio abacate amassado ou pasta de amendoim no pão.',
    produto: null,
  },
  {
    dia: 18,
    tema: 'Gorduras',
    icone: '🐟',
    titulo: 'Ômega-3: a gordura anti-inflamatória',
    conteudo:
      'O ômega-3 (EPA e DHA) é uma gordura que o corpo não produz — precisa vir da alimentação. Ele reduz inflamação, protege o coração, apoia o cérebro e pode até melhorar a recuperação muscular. As melhores fontes são peixes gordos de água fria: salmão, sardinha, atum. A recomendação é consumi-los 2x por semana. Chia e linhaça trazem a versão vegetal (ALA), que o corpo converte em pequena quantidade. Se peixe não faz parte da sua rotina, a suplementação é uma alternativa prática.',
    dicaPratica: 'Inclua sardinha, salmão ou atum em uma refeição hoje — ou 1 colher de chia no iogurte.',
    produto: { nome: 'Herbalifeline', descricao: 'Cápsulas de óleo de peixe ricas em EPA e DHA, com óleos essenciais de hortelã e tomilho.' },
  },
  {
    dia: 19,
    tema: 'Gorduras',
    icone: '🥜',
    titulo: 'Oleaginosas: o lanche perfeito (na dose certa)',
    conteudo:
      'Castanhas, nozes e amêndoas reúnem gordura boa, proteína, fibra e minerais como selênio e magnésio. Estudos associam o consumo regular a menor risco cardíaco e melhor controle de peso — apesar de calóricas, sua mastigação lenta e alta saciedade compensam. A dose ideal é "1 punhado fechado" (~30 g, 170–200 kcal). O erro é comer direto do pacote no sofá: aí um punhado vira três. Porcione antes e guarde o resto.',
    dicaPratica: 'Separe porções de 30 g de castanhas em potinhos para os lanches da semana.',
    produto: null,
  },
  {
    dia: 20,
    tema: 'Manutenção',
    icone: '🧭',
    titulo: 'Depois dos 21 dias: o plano de manutenção',
    conteudo:
      'Reta final! O maior erro pós-programa é "voltar ao normal" — porque foi o "normal" que trouxe você até aqui. A manutenção usa tudo o que você praticou: proteína em todas as refeições, metade do prato de vegetais, água na meta, carboidratos de verdade e gordura boa na dose certa. A regra 80/20 é sua aliada: 80% de escolhas alinhadas, 20% de flexibilidade para pizza com amigos e bolo de aniversário. Rigidez extrema quebra; consistência flexível dura para sempre.',
    dicaPratica: 'Escreva 3 hábitos deste programa que você vai manter. Fixe na geladeira.',
    produto: null,
  },
  {
    dia: 21,
    tema: 'Manutenção',
    icone: '🏆',
    titulo: 'Você conseguiu! E agora?',
    conteudo:
      'Dia 21! Faça hoje sua pesagem final e as fotos de comparação — e celebre CADA progresso: peso, medidas, disposição, sono, roupas mais folgadas. Você provou que consegue manter constância por 3 semanas; essa é exatamente a habilidade que mantém resultados para a vida. Próximos passos possíveis: renovar por mais 21 dias com metas atualizadas (seu peso mudou, suas metas também), ou migrar para o modo manutenção. Converse com sua nutricionista pelo botão do WhatsApp para planejar a próxima fase. Orgulho de você! 💚',
    dicaPratica: 'Compare as fotos do dia 1 com as de hoje. Mande para a nutricionista com sua maior vitória do programa.',
    produto: null,
  },
]

export function dicaDoDia(dia) {
  return DICAS.find((d) => d.dia === dia) ?? DICAS[0]
}
