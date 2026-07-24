// Lanches proteicos dos dias 1-21 — simples, práticos e rápidos.
// Dias 22-30 (fim da Jornada de 30 Dias): ver lanches22a37.js.
// Curadoria nutricional: cada dia traz um lanche com boa dose de proteína para
// sustentar a saciedade entre as refeições, preservar massa magra e evitar beliscos.
//
// Produtos de suplementação aparecem nos dias indicados. O campo `imagem` recebe o caminho
// da foto do produto (arquivos em /public/produtos/...). Enquanto a foto não é
// adicionada, o card mostra apenas o texto — a imagem aparece sozinha quando o arquivo existir.

export const LANCHES_PROTEICOS = [
  {
    dia: 1,
    icone: '🥤',
    titulo: 'Shake clássico',
    proteina: '~26g',
    descricao:
      'Uma forma rápida, prática e inteligente de garantir proteína e nutrientes logo nas primeiras horas do dia — pensada para caber na sua rotina sem exigir tempo que você não tem.',
    ingredientes: ['2 colheres de shake', '200 ml de leite desnatado (ou bebida vegetal)', '½ banana', 'Gelo a gosto'],
    preparo: 'Bata tudo no liquidificador por 30 segundos e beba na hora. Dá para levar na garrafinha.',
    produto: { nome: 'Shake proteico', imagem: '/produtos/shake-proteico.jpg' },
  },
  {
    dia: 2,
    icone: '🥚',
    titulo: 'Ovos cozidos temperados',
    proteina: '~13g',
    descricao:
      'Clássico que nunca falha: cozinhe uma leva no início da semana e tenha proteína pronta na geladeira o tempo todo.',
    ingredientes: ['2 ovos', 'Sal, pimenta-do-reino e orégano', 'Fio de azeite (opcional)'],
    preparo: 'Cozinhe os ovos por 8–10 min, descasque, corte ao meio e tempere. Guarde na geladeira por até 5 dias.',
    produto: null,
  },
  {
    dia: 3,
    icone: '🥜',
    titulo: 'Iogurte grego com castanhas',
    proteina: '~15g',
    descricao:
      'O iogurte grego tem quase o dobro de proteína do comum. Com castanhas, vira um lanche cremoso, crocante e muito saciante.',
    ingredientes: ['1 pote de iogurte grego natural', '1 punhado pequeno de castanhas (ou nozes)', 'Canela a gosto'],
    preparo: 'Misture, polvilhe canela e pronto. Sem açúcar: a canela já traz o docinho.',
    produto: null,
  },
  {
    dia: 4,
    icone: '🍵',
    titulo: 'Chá de ervas + barra de proteína',
    proteina: '~10g',
    descricao:
      'Dupla perfeita para a tarde: o chá de ervas ajuda a dar energia e foco, contribui para reduzir a retenção de líquidos e é um aliado do emagrecimento — tudo com pouquíssimas calorias. A barra segura a fome com proteína.',
    ingredientes: ['1 dose de chá de ervas concentrado em água quente ou gelada', '1 barra de proteína'],
    preparo: 'Dissolva o chá na água e saboreie junto com a barra. Ideal no meio da tarde, quando bate a vontade de doce.',
    produto: { nome: 'Chá de ervas concentrado + Barra de Proteína', imagem: '/produtos/cha-ervas.jpg' },
    // obs: imagem do chá; a barra também aparece no dia 12
  },
  {
    dia: 5,
    icone: '🥪',
    titulo: 'Mini sanduíche de frango desfiado',
    proteina: '~20g',
    descricao:
      'Aproveite as sobras do almoço: frango desfiado num pão integral é um lanche de verdade, barato e cheio de proteína.',
    ingredientes: ['3 colheres de frango cozido e desfiado', '1 fatia de pão integral', 'Alface e tomate', 'Iogurte natural no lugar da maionese'],
    preparo: 'Misture o frango com uma colher de iogurte, tempere e monte o sanduíche. Fica pronto em 2 minutos.',
    produto: null,
  },
  {
    dia: 6,
    icone: '💪',
    titulo: 'Whey protein batido',
    proteina: '~24g',
    descricao:
      'O Whey 3W combina três formas de proteína (isolada, concentrada e hidrolisada), o que favorece uma liberação mais gradual de aminoácidos — por isso é tão usado depois do treino, para ajudar na recuperação muscular. Com fruta congelada, vira um smoothie cremoso e refrescante.',
    ingredientes: ['1 dose de whey protein', '250 ml de água gelada ou leite', '½ banana congelada ou 4–5 morangos congelados', 'Gelo'],
    preparo: 'Bata tudo no liquidificador por 20 segundos até ficar cremoso. A fruta congelada dá textura de milk-shake. Beba de preferência até 1h depois do treino.',
    produto: { nome: 'Whey protein', imagem: '/produtos/whey-generico.jpg' },
  },
  {
    dia: 7,
    icone: '🧀',
    titulo: 'Queijo com mix de castanhas',
    proteina: '~14g',
    descricao:
      'Dia de pesagem pede um lanche prático e sem preparo. Queijo e castanhas combinam proteína e gordura boa para saciar por horas.',
    ingredientes: ['2 cubos de queijo (minas ou muçarela)', '1 punhado de mix de castanhas'],
    preparo: 'Monte um potinho e leve com você. Zero preparo, ótima saciedade.',
    produto: null,
  },
  {
    dia: 8,
    icone: '🥤',
    titulo: 'Shake proteico reforçado',
    proteina: '~50g',
    descricao:
      'Entramos na semana das proteínas! Some shake + whey para um lanche que substitui bem uma refeição leve nos dias mais corridos.',
    ingredientes: ['2 colheres de shake proteico', '1 dose de whey protein', '200 ml de leite', 'Canela e gelo'],
    preparo: 'Bata tudo no liquidificador. Fica cremoso, doce na medida e com alta proteína.',
    produto: { nome: 'Shake proteico + whey protein', imagem: '/produtos/shake-proteico.jpg' },
  },
  {
    dia: 9,
    icone: '🍳',
    titulo: 'Ovo mexido com queijo',
    proteina: '~16g',
    descricao:
      'Quente, rápido e reconfortante. Em 3 minutos você tem um lanche proteico que segura a fome até a próxima refeição.',
    ingredientes: ['2 ovos', '1 fatia de queijo picada', 'Cebolinha, sal e pimenta'],
    preparo: 'Bata os ovos, jogue na frigideira antiaderente com o queijo e mexa até firmar. Sirva quente.',
    produto: null,
  },
  {
    dia: 10,
    icone: '🥞',
    titulo: 'Panqueca proteica de banana',
    proteina: '~14g',
    descricao:
      'Só 2 ingredientes e nada de farinha. Uma panqueca fofa, naturalmente doce e cheia de proteína do ovo.',
    ingredientes: ['1 banana amassada', '2 ovos', 'Canela a gosto'],
    preparo: 'Misture tudo, despeje colheradas na frigideira quente e doure dos dois lados. Pronto em 5 minutos.',
    produto: null,
  },
  {
    dia: 11,
    icone: '🌾',
    titulo: 'Iogurte com fibras',
    proteina: '~12g',
    descricao:
      'Proteína + fibra é a combinação que mais sacia e ainda cuida do intestino. As fibras solúveis turbinam o iogurte sem alterar o sabor.',
    ingredientes: ['1 iogurte natural', '1 dose de fibras solúveis', '1 colher de aveia'],
    preparo: 'Misture as fibras e a aveia no iogurte, espere 1 minuto para engrossar e aproveite.',
    produto: { nome: 'Fibras solúveis', imagem: '/produtos/fibras-soluveis.jpg' },
  },
  {
    dia: 12,
    icone: '🍫',
    titulo: 'Barra de proteína + chá gelado',
    proteina: '~10g',
    descricao:
      'Para levar na bolsa: a barra de proteína satisfaz a vontade de doce com proteína, e o chá gelado refresca sem calorias vazias.',
    ingredientes: ['1 barra de proteína', '1 dose de chá de ervas concentrado em água gelada com gelo'],
    preparo: 'Prepare o chá numa garrafa com gelo e leve junto com a barra. Lanche de emergência perfeito.',
    produto: { nome: 'Barra de proteína', imagem: '/produtos/barra-proteina-generica.jpg' },
  },
  {
    dia: 13,
    icone: '🥕',
    titulo: 'Homus com palitos de legumes',
    proteina: '~9g',
    descricao:
      'O grão-de-bico do homus traz proteína vegetal e fibra. Com palitos de cenoura e pepino, vira um lanche leve e crocante.',
    ingredientes: ['3 colheres de homus (grão-de-bico)', 'Cenoura e pepino em palitos'],
    preparo: 'Corte os legumes em palitos e use como "colher" para o homus. Refrescante e saciante.',
    produto: null,
  },
  {
    dia: 14,
    icone: '🥤',
    titulo: 'Shake com aveia',
    proteina: '~27g',
    descricao:
      'Fim da semana 2! A aveia deixa o shake mais encorpado e libera energia devagar — ótimo para os dias de maior atividade.',
    ingredientes: ['2 colheres de shake proteico', '1 colher de aveia em flocos', '200 ml de leite', 'Gelo'],
    preparo: 'Bata tudo até ficar cremoso. A aveia dá aquela sensação de lanche completo.',
    produto: { nome: 'Shake proteico', imagem: '/produtos/shake-proteico.jpg' },
  },
  {
    dia: 15,
    icone: '🐟',
    titulo: 'Atum na torrada integral',
    proteina: '~22g',
    descricao:
      'Atum é proteína pura e barata. Sobre uma torrada integral, é um lanche rápido que sacia muito e ainda traz ômega-3.',
    ingredientes: ['1 lata de atum em água (escorrido)', '2 torradas integrais', 'Suco de limão, sal e cebolinha'],
    preparo: 'Tempere o atum com limão e sal, espalhe sobre as torradas. Pronto em 2 minutos.',
    produto: null,
  },
  {
    dia: 16,
    icone: '🍓',
    titulo: 'Cottage com fruta',
    proteina: '~14g',
    descricao:
      'O queijo cottage é leve, cremoso e riquíssimo em proteína. Com morangos, equilibra o docinho da fruta com saciedade.',
    ingredientes: ['4 colheres de queijo cottage', '½ xícara de morangos (ou fruta a gosto)', 'Canela'],
    preparo: 'Coloque o cottage numa tigela, adicione a fruta picada e polvilhe canela.',
    produto: null,
  },
  {
    dia: 17,
    icone: '🍹',
    titulo: 'Vitamina proteica de frutas',
    proteina: '~26g',
    descricao:
      'Whey protein batido com fruta vira uma vitamina cremosa que substitui o lanche da tarde com muita proteína e sabor.',
    ingredientes: ['1 dose de whey protein', '½ banana ou ½ manga', '200 ml de água ou leite', 'Gelo'],
    preparo: 'Bata tudo no liquidificador até ficar homogêneo. Gelado fica ainda melhor.',
    produto: { nome: 'Whey protein', imagem: '/produtos/whey-generico.jpg' },
  },
  {
    dia: 18,
    icone: '🫛',
    titulo: 'Grão-de-bico torrado',
    proteina: '~11g',
    descricao:
      'Crocante como salgadinho, mas cheio de proteína e fibra. Faça uma leva e substitua a batata frita da vontade.',
    ingredientes: ['1 xícara de grão-de-bico cozido', 'Azeite, sal, páprica e alho em pó'],
    preparo: 'Seque bem o grão, tempere e asse a 200°C por 25–30 min até dourar. Guarde num pote fechado.',
    produto: null,
  },
  {
    dia: 19,
    icone: '🥣',
    titulo: 'Overnight oats proteico',
    proteina: '~35g',
    descricao:
      'Prepare à noite, acorde com o lanche pronto. Aveia + whey descansando na geladeira viram um creme proteico delicioso.',
    ingredientes: ['3 colheres de aveia', '1 dose de whey protein', '150 ml de leite', 'Frutas para cobrir'],
    preparo: 'Misture tudo num potinho, tampe e deixe na geladeira de um dia para o outro. De manhã, cubra com frutas.',
    produto: { nome: 'Whey protein', imagem: '/produtos/whey-generico.jpg' },
  },
  {
    dia: 20,
    icone: '🍓',
    titulo: 'Salada de frutas com iogurte grego',
    proteina: '~15g',
    descricao:
      'Uma tigela colorida que une a fibra das frutas com a proteína do iogurte grego — saciante, refrescante e naturalmente doce, sem açúcar adicionado.',
    ingredientes: ['1 pote de iogurte grego zero açúcar', 'Frutas picadas (morango, banana, mamão, maçã)', '1 colher de aveia ou granola sem açúcar (opcional)', 'Canela a gosto'],
    preparo: 'Pique as frutas numa tigela, cubra com o iogurte grego e finalize com canela. Se quiser crocância, salpique a aveia por cima.',
    produto: null,
  },
]

// Retorna o lanche do dia informado (com fallback para o dia 1).
export function lancheDoDia(dia) {
  return LANCHES_PROTEICOS.find((l) => l.dia === dia) || LANCHES_PROTEICOS[0]
}
