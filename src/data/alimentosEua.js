const FONTE = 'USDA FoodData Central (FNDDS/SR Legacy) — receita e marca podem variar'
const FONTE_URL = 'https://fdc.nal.usda.gov/'

const linhas = `
Pancake americano|Carboidratos|227|6.4|28.3|9.7|1.0|80|pancake,panqueca americana
Waffle|Carboidratos|291|7.9|32.9|14.1|1.8|75|waffle,waffles
Bagel simples|Carboidratos|277|10.7|55.2|1.4|2.3|100|bagel,pao bagel
English muffin|Carboidratos|235|7.7|46.0|1.8|2.7|57|english muffin,muffin ingles
Cornbread|Carboidratos|330|6.6|54.0|10.0|3.0|60|corn bread,pao de milho americano
Oatmeal preparado|Carboidratos|71|2.5|12.0|1.5|1.7|240|oatmeal,mingau de aveia
Breakfast cereal açucarado|Carboidratos|380|5.5|87.0|1.5|3.0|30|cereal,breakfast cereal
Hash browns|Carboidratos|219|3.0|28.0|11.0|2.7|85|hash brown,batata ralada frita
Mashed potatoes|Carboidratos|113|2.0|16.8|4.4|1.3|210|mashed potato,pure de batata
Baked potato com casca|Carboidratos|93|2.5|21.2|0.1|2.2|173|baked potato,batata assada
Macaroni and cheese|Refeições prontas|164|6.1|21.1|6.3|1.1|200|mac and cheese,mac n cheese,macarrao com queijo
Peanut butter and jelly sandwich|Refeições prontas|340|10.0|48.0|13.0|3.0|100|pbj,pb&j,sanduiche pasta de amendoim geleia
Grilled cheese sandwich|Refeições prontas|350|13.0|33.0|18.0|1.5|120|grilled cheese,sanduiche queijo quente
Turkey sandwich|Refeições prontas|230|14.0|27.0|7.0|2.0|160|turkey sandwich,sanduiche de peru
BLT sandwich|Refeições prontas|270|11.0|28.0|13.0|2.0|150|blt,bacon lettuce tomato sandwich
Cheeseburger|Refeições prontas|286|14.0|24.0|15.0|1.2|180|cheeseburger,x burger,hamburguer com queijo
American hot dog|Refeições prontas|290|10.0|25.0|17.0|1.2|150|hot dog,cachorro quente americano
Sloppy joe sandwich|Refeições prontas|230|12.0|25.0|9.0|2.0|180|sloppy joe,sanduiche carne moida
Meatloaf|Refeições prontas|214|14.0|9.0|14.0|1.0|150|meat loaf,bolo de carne
Chili con carne|Refeições prontas|130|9.0|13.0|5.0|4.0|240|chili,chilli,feijao com carne
Chicken pot pie|Refeições prontas|240|9.0|22.0|13.0|1.5|200|pot pie,torta de frango americana
Fried chicken|Proteínas|246|30.0|9.0|10.0|0.5|120|fried chicken,frango frito americano
Chicken nuggets|Proteínas|296|15.0|18.0|18.0|1.0|100|nuggets,nugget de frango
Buffalo wings|Proteínas|290|24.0|3.0|20.0|0|120|buffalo chicken wings,asas de frango picantes
Bacon frito|Proteínas|541|37.0|1.4|42.0|0|16|bacon,bacon strips
Breakfast sausage|Proteínas|339|19.0|1.0|28.0|0|56|sausage patty,linguica cafe da manha
Pulled pork|Proteínas|238|24.0|6.0|13.0|0.5|120|pulled pork,porco desfiado
BBQ ribs|Proteínas|361|20.0|10.0|27.0|0|150|barbecue ribs,costelinha barbecue
Tuna salad|Proteínas|187|16.0|3.0|12.0|0.5|100|tuna salad,salada de atum com maionese
Taco de carne|Refeições prontas|226|9.0|20.0|12.0|3.0|100|beef taco,taco
Burrito de carne e feijão|Refeições prontas|206|9.0|27.0|7.0|4.0|200|beef bean burrito,burrito
Quesadilla de queijo|Refeições prontas|310|13.0|31.0|15.0|2.0|130|cheese quesadilla,quesadilla
Nachos com queijo|Refeições prontas|306|8.0|36.0|15.0|4.0|150|nachos,nachos cheese
Caesar salad com molho|Refeições prontas|130|5.0|8.0|9.0|2.0|180|caesar salad,salada caesar
Coleslaw|Refeições prontas|152|1.0|14.0|10.0|2.0|100|cole slaw,salada de repolho americana
Green bean casserole|Refeições prontas|110|3.0|12.0|6.0|2.5|150|casserole de vagem
Tater tots|Carboidratos|240|3.0|31.0|12.0|3.0|85|tater tots,bolinho de batata
French fries estilo fast-food|Carboidratos|312|3.4|41.4|14.7|3.8|117|fast food fries,french fries,batata frita
Potato chips|Carboidratos|536|7.0|52.9|34.6|4.8|28|potato chips,batata chips
Tortilla chips|Carboidratos|497|6.6|67.4|24.2|5.0|28|tortilla chips,nachos sem molho
Buttered popcorn|Carboidratos|535|8.7|57.5|30.2|10.0|28|butter popcorn,pipoca com manteiga
Pretzels|Carboidratos|380|10.0|80.0|2.6|3.5|30|pretzel,salgadinho pretzel
Cheese crackers|Carboidratos|503|10.0|58.0|26.0|2.0|30|cheese crackers,biscoito de queijo
Granola bar|Doces e sobremesas|430|8.0|67.0|16.0|5.0|35|granola bar,barra de granola
Chocolate chip cookie|Doces e sobremesas|488|5.5|64.0|24.0|2.5|30|cookie,cookie chocolate
Brownie|Doces e sobremesas|466|6.0|60.0|24.0|2.0|60|brownie de chocolate
Glazed donut|Doces e sobremesas|421|5.0|57.0|20.0|1.5|60|donut,doughnut,rosquinha
Blueberry muffin|Doces e sobremesas|377|5.0|53.0|17.0|1.5|100|muffin mirtilo,blueberry muffin
Cupcake com cobertura|Doces e sobremesas|389|4.0|57.0|17.0|1.0|75|cupcake,frosted cupcake
Apple pie|Doces e sobremesas|237|2.0|34.0|11.0|1.6|125|apple pie,torta de maca
Pumpkin pie|Doces e sobremesas|243|4.0|34.0|11.0|1.8|125|pumpkin pie,torta de abobora
Cheesecake|Doces e sobremesas|321|5.5|25.5|23.0|0.5|100|cheesecake,torta de queijo
S'more|Doces e sobremesas|400|4.0|70.0|12.0|2.0|50|smore,s mores,marshmallow chocolate cracker
Maple syrup|Molhos e complementos|260|0|67.0|0.1|0|20|maple syrup,xarope de bordo
Ranch dressing|Molhos e complementos|430|1.0|7.0|44.0|0|30|ranch,molho ranch
Barbecue sauce|Molhos e complementos|172|1.0|41.0|0.6|0.8|30|bbq sauce,molho barbecue
Lemonade com açúcar|Bebidas|40|0.1|10.5|0|0.1|240|lemonade,limonada americana
Sweet iced tea|Bebidas|38|0|9.5|0|0|240|sweet tea,cha gelado doce
Sports drink|Bebidas|24|0|6.0|0|0|355|sports drink,isotonico,gatorade
Energy drink|Bebidas|45|0|11.0|0|0|250|energy drink,energetico
Pumpkin spice latte|Bebidas|83|3.0|12.0|2.8|0|355|pumpkin latte,latte de abobora
`.trim()

export const ALIMENTOS_EUA = linhas.split('\n').map((linha, indice) => {
  const [nome, categoria, kcal, prot, carb, gord, fibra, porcao, aliases = ''] = linha.split('|')
  const unidadeBase = categoria === 'Bebidas' ? 'ml' : 'g'
  const medidas = unidadeBase === 'ml'
    ? [{ id: 'ml', nome: 'ml', plural: 'ml', base: 1 }, { id: 'cup', nome: 'cup (xícara americana)', plural: 'cups (xícaras americanas)', base: 240 }, { id: 'floz', nome: 'fl oz', plural: 'fl oz', base: 29.5735 }, { id: 'porcao', nome: 'serving (porção)', plural: 'servings (porções)', base: Number(porcao) }]
    : [{ id: 'g', nome: 'g', plural: 'g', base: 1 }, { id: 'oz', nome: 'oz (onça)', plural: 'oz (onças)', base: 28.3495 }, { id: 'porcao', nome: 'serving (porção)', plural: 'servings (porções)', base: Number(porcao) }]
  return {
    id: `us-${String(indice + 1).padStart(3, '0')}`,
    nome, categoria, origem: 'Estados Unidos',
    kcal: Number(kcal), prot: Number(prot), carb: Number(carb), gord: Number(gord), fibra: Number(fibra),
    porcao: Number(porcao), unidadeBase, medidas,
    aliases: aliases.split(',').map((x) => x.trim()).filter(Boolean),
    fonte: FONTE, fonteUrl: FONTE_URL, estimado: true,
  }
})
