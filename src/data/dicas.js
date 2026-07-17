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
      'Hoje começa uma jornada de 21 dias — o tempo que a ciência sugere para começar a consolidar um novo hábito. Seu corpo gasta energia até em repouso: essa é a sua TMB (Taxa Metabólica Basal). Somando suas atividades diárias, chegamos ao seu TDEE, o total de calorias que você gasta por dia. Suas metas foram calculadas a partir desses números e do seu objetivo: para emagrecer com saúde, é preciso consumir um pouco menos calorias do que você gasta — isso se chama déficit calórico, e é o único mecanismo real por trás de qualquer emagrecimento, não importa o nome da dieta da vez. Não busque perfeição: busque constância. Registrar o que você come já muda o seu comportamento alimentar — estudos mostram que quem anota, emagrece mais.',
    dicaPratica: 'Registre TODAS as refeições de hoje, mesmo as que "não contam" — consciência vem antes da mudança. E o foco dos seus próximos 21 dias será entender e aplicar, na prática, quatro conceitos que sustentam todo o método: análise de macros (como proteína, carboidrato e gordura se distribuem no seu prato), controle de calorias (quanto você realmente consome), déficit calórico (a base fisiológica de todo emagrecimento) e densidade nutricional (escolher alimentos que entregam mais nutriente por caloria). Se quiser revisitar cada um desses conceitos a qualquer momento, encontre o guia completo em Ferramentas → Reforçando Conceitos.',
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
      'Olá! Aqui é a Wanessa. Você já começou a sentir a diferença de ter uma estratégia clara. Mas a verdade é que hábitos profundos levam tempo para se tornarem automáticos. Eu mantenho minha transformação há 14 anos porque entendi que o segredo não é a intensidade de uma semana, mas a consistência de meses. Foque em viver bem estes primeiros dias, um de cada vez — a constância que você está construindo agora é o que sustenta qualquer resultado no futuro. Continuidade é tudo.',
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
    titulo: 'Sede, fome e as calorias dos sucos',
    conteudo:
      'O hipotálamo participa do controle da fome e da sede, e os sinais podem se confundir. Antes de um lanche fora de hora, beba água e observe. Atenção também aos sucos: mesmo natural e sem açúcar, o suco concentra várias frutas, tem menos fibra e é consumido rapidamente. Um copo pode somar as calorias de 3 ou 4 frutas sem oferecer a mesma saciedade de mastigá-las. Para hidratar, prefira água; quando quiser fruta, priorize a fruta inteira. Suco pode fazer parte, mas em porção planejada.',
    dicaPratica: 'Hoje, troque um copo de suco pela fruta inteira + água e compare a saciedade.',
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
      'Semana da proteína! Ela é o macro mais importante em um processo de emagrecimento por três motivos: (1) preserva massa muscular enquanto você perde gordura; (2) é o macro que mais sacia — você sente menos fome; (3) tem o maior efeito térmico: o corpo gasta 20–30% das calorias da proteína só para digeri-la. É por isso que ela tem a maior densidade nutricional entre os três macros: entrega mais benefício — saciedade, preservação muscular, funções no corpo — por caloria consumida. Sua meta diária está no painel, e mantê-la em dia é o ajuste mais importante no seu controle de macros. A maioria das pessoas come proteína de menos no café da manhã e de mais no jantar — equilibrar isso melhora os resultados.',
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
    produto: { nome: 'Shake proteico', descricao: 'Cerca de 18 g de proteína por dose preparada com leite desnatado — café da manhã ou lanche prático.' },
  },
  {
    dia: 10,
    tema: 'Proteínas',
    icone: '⏰',
    titulo: 'O lanche muda quando entra proteína',
    conteudo:
      'Compare dois lanches: uma fruta sozinha é nutritiva, mas pode deixar a fome voltar mais cedo; fruta + iogurte natural, queijo ou ovos acrescenta proteína e costuma prolongar a saciedade. O mesmo vale para pão ou tapioca: quando entram ovos, frango, atum ou queijo, a refeição fica mais completa. A proteína ajuda a preservar músculos, exige mais digestão e reduz os beliscos. Distribua-a ao longo do dia, em vez de concentrar tudo no jantar.',
    dicaPratica: 'Monte hoje um lanche com fruta ou pão + uma fonte de proteína e compare quanto tempo a fome demora a voltar.',
    produto: { nome: 'Bebida proteica em pó', descricao: '15 g de proteína por dose — reforço para lanches ou para enriquecer o shake.' },
  },
  {
    dia: 11,
    tema: 'Fibras',
    icone: '🌾',
    titulo: 'Fibras: saciedade de longa duração',
    conteudo:
      'Semana das fibras! Elas retardam o esvaziamento do estômago, estabilizam a glicose no sangue e mantêm você satisfeito(a) por horas — tudo isso praticamente sem calorias absorvíveis. É um dos exemplos mais claros de densidade nutricional: altíssimo benefício fisiológico por quase nenhuma caloria. Sua meta está no painel (cerca de 14 g a cada 1000 kcal). A maioria dos brasileiros consome metade do recomendado. Boas fontes: feijão (8,5 g/100 g), aveia, chia, frutas com casca, brócolis e folhas. Aumente gradualmente e beba bastante água junto — fibra sem água pode causar desconforto.',
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
    produto: { nome: 'Fibras solúveis', descricao: '5 g de fibras solúveis e insolúveis por dose, sabor neutro — misture em água ou no shake.' },
  },
  {
    dia: 13,
    tema: 'Fibras',
    icone: '🍎',
    titulo: 'Fruta é saudável — e quantidade também conta',
    conteudo:
      'Frutas oferecem vitaminas, água e fibras, mas também fornecem calorias e carboidratos. Uma unidade média costuma ter aproximadamente 60–120 kcal, variando muito conforme o tipo e o tamanho; porções de uva, manga, banana, açaí e frutas secas podem somar rapidamente. Comer muitas frutas ao longo do dia, além da sua necessidade, pode dificultar o déficit calórico. Isso não torna a fruta vilã: a estratégia é variar, respeitar porções e, para maior saciedade, combinar com proteína.',
    dicaPratica: 'Observe hoje quantas porções de fruta você come e experimente uma delas com iogurte natural ou queijo.',
    produto: null,
  },
  {
    dia: 14,
    tema: 'Carboidratos',
    icone: '🍠',
    titulo: 'Massas: menos quantidade, mais saciedade',
    conteudo:
      'Duas semanas — faça hoje sua pesagem e fotos na aba PROGRESSO! Massa não precisa ser excluída. O ajuste está na composição do prato — no controle de macros, não na exclusão: reduza a porção de macarrão e complete o prato com proteína — frango, carne magra, atum, ovos, queijo ou uma opção vegetal — e vegetais. A mesma refeição fica mais equilibrada e tende a sustentar por mais tempo do que um prato grande de massa com pouco acompanhamento. Carboidrato dá energia; proteína e fibras prolongam a saciedade.',
    dicaPratica: 'Na próxima massa, use cerca de 1/4 do prato de massa, 1/4 de proteína e metade de vegetais.',
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
    titulo: 'Granola, balas, doces e quitandas: o detalhe é a porção',
    conteudo:
      'Granola pode parecer leve, mas muitas versões juntam açúcar, mel, óleo e frutas secas: 3–4 colheres podem acrescentar cerca de 150–250 kcal. Balas parecem pequenas, porém várias ao longo do dia viram calorias pouco percebidas e quase nenhuma saciedade. Doces e quitandas — pão de queijo, biscoitos, bolos, broas e salgados assados — também concentram farinha e gordura. Nada disso é proibido: escolha uma porção, coma com atenção e evite o "beliscar sem contar".',
    dicaPratica: 'Meça a granola com colher e coloque doces ou quitandas em um prato; não coma direto do pacote ou da travessa.',
    produto: null,
  },
  {
    dia: 17,
    tema: 'Gorduras',
    icone: '🥑',
    titulo: 'Gordura não engorda — excesso de calorias engorda',
    conteudo:
      'Semana das gorduras! Elas são essenciais: formam hormônios, constroem membranas celulares e transportam as vitaminas A, D, E e K. A questão é escolher bem e dosar. O azeite é uma boa fonte de gordura, mas continua calórico: 1 colher de sopa tem aproximadamente 90–120 kcal, conforme a medida. Regar salada, cozinhar e finalizar o prato sem medir pode somar várias colheres. Use colher ou dosador; saudável não significa "à vontade".',
    dicaPratica: 'Meça sempre o azeite em uma colher antes de usar, em vez de despejar direto no prato. Assim você sabe exatamente quanto consumiu e consegue registrar aqui no app a gordura e as calorias certas.',
    produto: null,
  },
  {
    dia: 18,
    tema: 'Gorduras',
    icone: '🐟',
    titulo: 'Ômega-3: a gordura anti-inflamatória',
    conteudo:
      'O ômega-3 (EPA e DHA) é uma gordura que o corpo não produz — precisa vir da alimentação. Ele reduz inflamação, protege o coração, apoia o cérebro e pode até melhorar a recuperação muscular: poucos gramas entregam um benefício funcional desproporcional ao tamanho da porção, o que faz dele um dos nutrientes de maior densidade nutricional que existem. As melhores fontes são peixes gordos de água fria: salmão, sardinha, atum. A recomendação é consumi-los 2x por semana. Chia e linhaça trazem a versão vegetal (ALA), que o corpo converte em pequena quantidade. Se peixe não faz parte da sua rotina, a suplementação é uma alternativa prática.',
    dicaPratica: 'Inclua sardinha, salmão ou atum em uma refeição hoje — ou 1 colher de chia no iogurte.',
    produto: { nome: 'Ômega 3 (óleo de peixe)', descricao: 'Cápsulas de óleo de peixe ricas em EPA e DHA, com óleos essenciais de hortelã e tomilho.' },
  },
  {
    dia: 19,
    tema: 'Gorduras',
    icone: '🥜',
    titulo: 'Oleaginosas: o lanche perfeito (na dose certa)',
    conteudo:
      'Amendoim, castanhas, nozes e amêndoas oferecem gorduras boas, proteína, fibras e minerais. Mas são alimentos muito concentrados: cerca de 30 g — um punhado pequeno — costuma fornecer 170–200 kcal. Pasta de amendoim também exige atenção: uma colher generosa pode virar duas sem perceber. Elas podem ajudar na saciedade quando porcionadas, mas comer direto do pacote pode acrescentar centenas de calorias e atrapalhar o déficit calórico.',
    dicaPratica: 'Separe porções de 20–30 g de amendoim ou castanhas em potinhos e guarde o pacote antes de comer.',
    produto: null,
  },
  {
    dia: 20,
    tema: 'Manutenção',
    icone: '🧭',
    titulo: 'Depois dos 21 dias: o plano de manutenção',
    conteudo:
      'Reta final! O maior erro pós-programa é "voltar ao normal" — porque foi o "normal" que trouxe você até aqui. A manutenção usa tudo o que você praticou: proteína em todas as refeições, alimentos de alta densidade nutricional ocupando a maior parte do prato, água na meta e um controle de macros que já virou instinto, não esforço. A diferença é que agora as calorias que você consome se equilibram com as que gasta — não é mais o déficit calórico que te trouxe até aqui, é o equilíbrio calórico que sustenta o resultado. A regra 80/20 é sua aliada: 80% de escolhas alinhadas, 20% de flexibilidade para pizza com amigos e bolo de aniversário. Rigidez extrema quebra; consistência flexível dura para sempre.',
    dicaPratica: 'Escreva 3 hábitos deste programa que você vai manter. Fixe na geladeira.',
    produto: null,
  },
  {
    dia: 21,
    tema: 'Manutenção',
    icone: '🏆',
    titulo: 'Você conseguiu! Agora vem a repetição.',
    conteudo:
      'Dia 21! Faça sua pesagem final e as fotos de comparação — e celebre cada detalhe: peso, medidas, disposição, como suas roupas caem, como você se vê. Mas aqui está a verdade que a ciência confirma: 21 dias construíram o gatilho. 90 dias construirão a identidade. Você provou que consegue ser constante por 21 repetições; essa habilidade é exatamente o que sustenta resultados para a vida toda. Os próximos 69 dias não vão repetir o que você aprendeu aqui — vão aprofundá-lo até que seja impossível voltar atrás. Macros, déficit calórico, densidade nutricional, fibra: tudo isso se tornará tão automático quanto respirar. A excelência está na repetição. E você já iniciou a dela. 💚',
    dicaPratica: 'Compare as fotos do dia 1 com as de hoje. Essa transformação que você vê é apenas o começo. Reserve 15 minutos para decidir: continua comigo nos próximos 90 dias?',
    produto: null,
  },
]

export function dicaDoDia(dia) {
  return DICAS.find((d) => d.dia === dia)
}
