// Curadoria brasileira complementar. Valores centesimais de referência baseados em
// TACO/TBCA; preparações e marcas variam. `estimado` mantém essa incerteza visível.
const FONTE = 'TACO/TBCA — referência centesimal; preparação e marca podem variar'

const linhas = `
Alface crespa|Vegetais|11|1.3|1.7|0.2|1.8|60|alface,salada
Alface americana|Vegetais|9|0.6|1.7|0.1|1.0|60|alface,salada
Rúcula crua|Vegetais|13|1.8|2.2|0.1|1.7|50|rucula,folhas
Agrião cru|Vegetais|17|2.7|2.3|0.2|2.1|50|agriao,folhas
Couve crua|Vegetais|27|2.9|4.3|0.5|3.1|50|couve manteiga,folhas
Couve refogada|Vegetais|90|2.0|8.7|5.5|3.0|80|couve manteiga
Espinafre cozido|Vegetais|23|3.0|3.8|0.3|2.4|80|espinafre
Acelga crua|Vegetais|21|1.4|4.6|0.1|1.1|80|acelga
Repolho branco cru|Vegetais|17|0.9|3.9|0.1|1.9|80|repolho
Repolho roxo cru|Vegetais|31|1.9|7.2|0.1|2.0|80|repolho
Couve-flor cozida|Vegetais|19|1.2|3.9|0.3|2.1|80|couve flor
Pepino cru|Vegetais|10|0.9|2.0|0.1|1.1|80|pepino
Beterraba cozida|Vegetais|32|1.3|7.2|0.1|1.9|80|beterraba
Berinjela cozida|Vegetais|19|0.7|4.5|0.1|2.5|100|berinjela
Chuchu cozido|Vegetais|19|0.4|4.8|0.1|1.0|100|chuchu
Vagem cozida|Vegetais|25|1.8|5.3|0.2|2.7|80|vagem
Quiabo cozido|Vegetais|22|1.9|4.5|0.2|2.5|80|quiabo
Abóbora cabotiá cozida|Vegetais|48|1.4|10.8|0.7|2.6|100|abobora,japonesa
Abóbora moranga cozida|Vegetais|12|0.6|2.7|0.1|1.7|100|abobora,moranga
Pimentão verde cru|Vegetais|21|1.1|4.9|0.2|2.6|60|pimentao
Pimentão vermelho cru|Vegetais|26|1.0|6.0|0.2|2.1|60|pimentao
Cebola crua|Vegetais|39|1.7|8.9|0.1|2.2|30|cebola
Alho cru|Vegetais|113|7.0|23.9|0.2|4.3|5|alho
Milho-verde cozido|Vegetais|98|3.2|21.0|1.2|2.7|90|milho,espiga
Ervilha cozida|Vegetais|63|5.2|11.0|0.4|5.1|80|ervilha
Palmito em conserva|Vegetais|23|1.8|4.3|0.4|3.2|50|palmito
Champignon em conserva|Vegetais|22|2.3|4.0|0.3|1.0|50|cogumelo,champignon
Batata inglesa assada|Carboidratos|93|2.5|21.2|0.1|2.2|150|batata assada
Batata inglesa frita|Carboidratos|267|4.0|35.6|13.1|3.2|100|batata frita,fritas
Batata palha|Carboidratos|529|6.6|52.8|34.2|3.4|30|batata palha
Purê de batata|Carboidratos|113|2.0|16.8|4.4|1.3|120|pure de batata
Batata chips|Carboidratos|536|7.0|52.9|34.6|4.8|30|chips,salgadinho
Mandioquinha cozida|Carboidratos|80|0.9|18.9|0.2|1.8|120|batata baroa,cenoura amarela
Inhame cozido|Carboidratos|116|1.5|27.5|0.1|3.9|120|inhame
Cará cozido|Carboidratos|78|1.5|18.9|0.1|2.6|120|cara
Arroz parboilizado cozido|Carboidratos|123|2.5|26.4|0.4|1.0|100|arroz
Arroz negro cozido|Carboidratos|145|3.5|30.0|1.0|2.0|100|arroz preto
Feijão preto cozido|Carboidratos|77|4.5|14.0|0.5|8.4|80|feijao
Feijão branco cozido|Carboidratos|111|7.5|20.3|0.6|8.3|80|feijao
Feijão-fradinho cozido|Carboidratos|78|5.1|13.5|0.6|7.5|80|feijao fradinho,feijao de corda
Lentilha cozida|Carboidratos|93|6.3|16.3|0.5|7.9|80|lentilha
Grão-de-bico cozido|Carboidratos|164|8.9|27.4|2.6|7.6|80|grao de bico
Quinoa cozida|Carboidratos|120|4.4|21.3|1.9|2.8|100|quinoa
Farofa pronta|Carboidratos|406|2.1|80.3|9.1|7.8|30|farofa
Polenta cozida|Carboidratos|70|1.5|15.7|0.3|1.1|120|angu,polenta
Polenta frita|Carboidratos|213|3.0|31.0|9.0|2.0|100|polenta
Nhoque cozido|Carboidratos|155|4.0|31.0|1.5|2.0|150|nhoque
Pão de forma branco|Carboidratos|253|8.0|49.0|3.5|2.5|50|pao de forma
Bisnaguinha|Carboidratos|300|8.0|55.0|5.0|2.5|40|pao bisnaguinha
Pão de queijo|Carboidratos|363|5.1|34.2|24.6|0.6|50|pao de queijo
Torrada integral|Carboidratos|377|12.0|68.0|6.0|8.0|30|torrada
Granola tradicional|Carboidratos|421|10.0|68.0|12.0|8.0|30|granola
Cereal matinal de milho|Carboidratos|377|7.0|84.0|1.0|3.0|30|sucrilhos,cereal
Panqueca simples|Carboidratos|227|6.4|28.3|9.7|1.0|80|panqueca
Abacaxi|Frutas|48|0.9|12.3|0.1|1.0|100|ananás,abacaxi
Uva|Frutas|69|0.7|18.1|0.2|0.9|100|uva
Pera|Frutas|53|0.6|14.0|0.1|3.0|130|pera
Goiaba vermelha|Frutas|54|1.1|13.0|0.4|6.2|100|goiaba
Kiwi|Frutas|61|1.1|14.7|0.5|3.0|80|kiwi
Pêssego|Frutas|39|0.9|9.5|0.3|1.5|100|pessego
Ameixa fresca|Frutas|46|0.7|11.4|0.3|1.4|100|ameixa
Maracujá|Frutas|68|2.0|12.3|2.1|6.8|100|maracuja
Mexerica|Frutas|44|0.7|11.7|0.1|3.1|130|tangerina,bergamota,mimosa
Coco fresco|Frutas|354|3.3|15.2|33.5|9.0|50|coco
Acerola|Frutas|33|0.9|8.0|0.2|1.5|100|acerola
Açaí polpa sem açúcar|Frutas|58|0.8|6.2|3.9|2.6|100|acai
Jabuticaba|Frutas|58|0.6|15.3|0.1|2.3|100|jabuticaba
Caqui|Frutas|71|0.4|19.3|0.1|6.5|100|caqui
Melão|Frutas|29|0.7|7.5|0.0|0.3|150|melao
Figo fresco|Frutas|74|0.8|19.2|0.3|2.9|80|figo
Pitaya|Frutas|51|0.8|12.4|0.4|3.0|100|pitaya,fruta do dragao
Banana-da-terra cozida|Frutas|116|0.8|31.2|0.2|2.3|100|banana da terra
Uva-passa|Frutas|299|3.1|79.2|0.5|3.7|30|uva passa,passas
Damasco seco|Frutas|241|3.4|62.6|0.5|7.3|30|damasco
Ameixa seca|Frutas|240|2.2|63.9|0.4|7.1|30|ameixa seca
Leite integral|Laticínios|61|3.2|4.7|3.3|0|200|leite
Leite semidesnatado|Laticínios|46|3.3|4.8|1.6|0|200|leite
Leite sem lactose integral|Laticínios|61|3.2|4.7|3.3|0|200|leite zero lactose
Leite em pó integral|Laticínios|496|25.8|38.0|26.7|0|25|leite po
Bebida de soja|Laticínios|42|3.2|4.0|1.8|0.6|200|leite de soja,vegetal
Bebida de aveia|Laticínios|46|1.0|8.0|1.5|0.8|200|leite de aveia,vegetal
Bebida de amêndoas|Laticínios|24|0.8|3.0|1.2|0.5|200|leite de amendoas,vegetal
Iogurte natural integral|Laticínios|61|3.5|4.7|3.3|0|170|iogurte
Iogurte de morango|Laticínios|93|3.0|15.0|2.5|0|170|iogurte frutas
Iogurte proteico|Laticínios|65|10.0|5.0|0.5|0|160|iogurte protein,whey
Queijo muçarela|Laticínios|330|22.6|3.0|25.2|0|30|mucarela,mozarela,queijo amarelo
Queijo prato|Laticínios|360|22.7|1.9|29.1|0|30|queijo amarelo
Queijo parmesão|Laticínios|453|35.6|1.7|33.5|0|15|parmesao
Ricota|Laticínios|140|12.6|3.8|8.1|0|40|queijo ricota
Queijo cottage|Laticínios|98|11.1|3.4|4.3|0|50|cottage
Queijo coalho|Laticínios|357|23.0|3.0|28.0|0|40|coalho
Queijo provolone|Laticínios|351|25.6|2.1|26.6|0|30|provolone
Cheddar processado|Laticínios|310|18.0|6.0|24.0|0|30|cheddar
Cream cheese|Laticínios|342|6.2|4.1|34.2|0|30|queijo cremoso
Requeijão tradicional|Laticínios|257|9.6|2.4|23.4|0|30|requeijao
Lombo suíno assado|Proteínas|210|29.0|0|9.5|0|120|porco,lombo
Pernil suíno assado|Proteínas|262|32.0|0|14.0|0|120|porco,pernil
Costela bovina assada|Proteínas|373|28.8|0|28.6|0|120|costela,carne
Contrafilé grelhado|Proteínas|278|32.4|0|15.5|0|120|contra file,bife
Alcatra grelhada|Proteínas|239|31.9|0|11.6|0|120|alcatra,bife
Fígado bovino grelhado|Proteínas|225|29.9|4.0|9.0|0|100|figado
Frango sobrecoxa assada|Proteínas|233|28.2|0|12.9|0|120|sobrecoxa,frango
Frango empanado frito|Proteínas|289|24.0|12.0|16.0|1.0|100|frango frito,empanado
Sardinha em lata|Proteínas|208|24.6|0|11.5|0|84|sardinha
Camarão cozido|Proteínas|99|24.0|0.2|0.3|0|100|camarao
Bacalhau cozido|Proteínas|140|29.0|0|2.5|0|100|bacalhau
Merluza assada|Proteínas|122|26.0|0|2.0|0|120|merluza,peixe
Linguiça calabresa|Proteínas|336|18.0|2.0|28.0|0|60|calabresa,linguica
Salsicha cozida|Proteínas|290|12.0|2.0|26.0|0|50|salsicha
Presunto cozido|Proteínas|128|18.0|2.0|5.0|0|40|presunto
Peito de peru|Proteínas|110|18.0|3.0|2.5|0|40|blanquet,peru
Tofu|Proteínas|76|8.1|1.9|4.8|0.3|100|queijo de soja,soja
Proteína de soja cozida|Proteínas|141|16.6|12.0|3.5|5.6|100|pts,carne de soja
Castanha-do-pará|Gorduras boas|656|14.3|12.3|66.4|7.5|20|castanha do para,castanha brasil
Amendoim torrado|Gorduras boas|606|22.5|18.7|54.0|7.8|20|amendoim
Amêndoas|Gorduras boas|579|21.2|21.6|49.9|12.5|20|amendoas
Nozes|Gorduras boas|654|15.2|13.7|65.2|6.7|20|nozes
Pistache|Gorduras boas|562|20.2|27.2|45.3|10.3|20|pistache
Linhaça|Gorduras boas|534|18.3|28.9|42.2|27.3|15|linhaca
Semente de abóbora|Gorduras boas|559|30.2|10.7|49.1|6.0|20|semente abobora
Manteiga|Gorduras boas|717|0.9|0.1|81.1|0|10|manteiga
Margarina|Gorduras boas|596|0.2|0.6|67.4|0|10|margarina
Suco de laranja natural|Bebidas|45|0.7|10.4|0.2|0.2|200|suco laranja
Suco de uva integral|Bebidas|61|0.4|15.2|0.1|0.2|200|suco uva
Suco de abacaxi natural|Bebidas|48|0.4|12.0|0.1|0.3|200|suco abacaxi
Suco de maracujá com açúcar|Bebidas|64|0.2|16.0|0.1|0.2|200|suco maracuja
Água de coco|Bebidas|22|0.0|5.3|0.0|0.0|200|agua coco
Refrigerante comum|Bebidas|40|0|10.5|0|0|350|refri,coca cola,guarana
Refrigerante zero|Bebidas|0|0|0|0|0|350|refri zero,coca zero
Café sem açúcar|Bebidas|2|0.1|0.3|0|0|50|cafe preto
Café com leite sem açúcar|Bebidas|34|1.7|2.6|1.7|0|150|media,cafe leite
Cappuccino pronto|Bebidas|80|3.0|10.0|3.0|0|150|capuccino
Achocolatado com leite|Bebidas|83|3.2|12.0|2.5|0.5|200|nescau,toddy,chocolate
Prato feito com carne|Refeições prontas|152|9.0|17.0|5.5|2.4|400|pf,marmita
Feijoada|Refeições prontas|117|8.7|11.6|4.5|5.1|300|feijoada
Strogonoff de frango|Refeições prontas|176|13.0|6.0|11.0|0.5|200|estrogonofe,frango
Escondidinho de carne|Refeições prontas|180|9.0|20.0|7.0|1.5|250|escondidinho
Lasanha à bolonhesa|Refeições prontas|170|9.0|16.0|8.0|1.3|250|lasanha bolonhesa
Pizza de muçarela|Refeições prontas|266|11.0|33.0|10.0|2.3|120|pizza mussarela
Pizza de calabresa|Refeições prontas|285|12.0|31.0|13.0|2.0|120|pizza calabresa
Pizza de frango com catupiry|Refeições prontas|270|13.0|29.0|11.0|1.8|120|pizza frango
Coxinha de frango|Refeições prontas|283|10.0|31.0|13.0|1.5|100|coxinha,salgado
Empada de frango|Refeições prontas|358|10.0|28.0|23.0|1.2|80|empadinha,salgado
Torta salgada de frango|Refeições prontas|240|11.0|24.0|11.0|1.5|120|torta frango
Pastel de carne frito|Refeições prontas|310|11.0|32.0|16.0|2.0|100|pastel carne
Esfiha de carne|Refeições prontas|240|11.0|31.0|8.0|2.0|80|esfirra,esfiha
Quibe frito|Refeições prontas|280|13.0|25.0|14.0|3.0|100|kibe,quibe
Hambúrguer completo|Refeições prontas|260|13.0|25.0|12.0|1.5|200|hamburguer,x burguer,lanche
Cachorro-quente completo|Refeições prontas|230|8.0|28.0|10.0|1.8|220|hot dog,cachorro quente
Risoto de frango|Refeições prontas|160|8.0|22.0|4.5|1.0|250|risoto
Sopa de legumes com carne|Refeições prontas|68|5.0|8.0|2.0|1.5|300|sopa,caldo
Sushi salmão|Refeições prontas|150|7.0|22.0|4.0|1.0|120|sushi,japones
Brigadeiro|Doces e sobremesas|359|5.0|59.0|12.0|1.0|20|brigadeiro
Beijinho|Doces e sobremesas|360|4.0|55.0|14.0|2.0|20|beijinho,coco
Chocolate ao leite|Doces e sobremesas|535|7.6|59.4|29.7|3.4|25|chocolate
Chocolate meio amargo|Doces e sobremesas|546|4.9|61.2|31.3|7.0|25|chocolate amargo
Chocolate branco|Doces e sobremesas|539|5.9|59.2|32.1|0.2|25|chocolate
Bolo de chocolate|Doces e sobremesas|371|5.0|53.0|16.0|2.0|80|bolo chocolate
Bolo de cenoura com cobertura|Doces e sobremesas|359|4.0|54.0|14.0|1.5|80|bolo cenoura
Pudim de leite|Doces e sobremesas|193|5.3|32.0|5.0|0|100|pudim
Sorvete de creme|Doces e sobremesas|207|3.5|23.6|11.0|0.7|80|sorvete
Biscoito recheado|Doces e sobremesas|472|6.0|70.0|19.0|2.0|30|bolacha recheada,biscoito
Paçoca|Doces e sobremesas|487|16.0|52.0|24.0|7.0|20|pacoca,amendoim
Doce de leite|Doces e sobremesas|315|6.0|58.0|7.0|0|30|doce leite
Geleia de frutas|Doces e sobremesas|250|0.4|65.0|0.1|1.0|20|geleia
Mousse de maracujá|Doces e sobremesas|250|4.0|33.0|12.0|0.4|100|mousse maracuja
Leite condensado|Doces e sobremesas|321|7.9|54.4|8.7|0|30|leite condensado
Maionese|Molhos e complementos|680|1.0|1.0|75.0|0|15|maionese
Ketchup|Molhos e complementos|101|1.3|25.8|0.1|0.3|15|catchup,ketchup
Mostarda|Molhos e complementos|60|4.0|6.0|3.0|3.0|10|mostarda
Molho de tomate|Molhos e complementos|38|1.5|7.0|0.6|1.5|60|molho tomate
Molho branco|Molhos e complementos|145|4.0|9.0|10.0|0.3|60|bechamel,molho
Açúcar|Molhos e complementos|387|0|100|0|0|5|acucar
Mel|Molhos e complementos|304|0.3|82.4|0|0.2|15|mel
Creme de leite|Molhos e complementos|221|2.2|4.5|22.0|0|30|creme leite
Pamonha|Carboidratos|150|3.0|30.0|2.5|2.0|150|pamonha
Broa de milho|Carboidratos|290|5.0|55.0|6.0|2.0|50|broa,broa de milho
Feijão tropeiro|Refeições prontas|180|8.0|18.0|8.0|4.0|150|feijao tropeiro,tropeiro
Pastel de queijo frito|Refeições prontas|320|9.0|30.0|18.0|1.5|100|pastel queijo
Enroladinho de queijo|Refeições prontas|400|10.0|40.0|22.0|1.5|40|enroladinho,palito de queijo
Biscoito de queijo|Refeições prontas|480|8.0|55.0|25.0|1.0|30|biscoito de queijo,biscoito queijo
Ovo frito|Proteínas|196|13.6|0.6|15.4|0|50|ovo frito
Ovo mexido|Proteínas|168|12.0|1.5|12.5|0|100|ovo mexido
Frango desfiado cozido|Proteínas|165|29.0|0|4.5|0|100|frango desfiado,frango cozido
Picanha grelhada|Proteínas|289|26.0|0|20.0|0|120|picanha
Filé mignon grelhado|Proteínas|201|30.0|0|8.0|0|120|file mignon,filet mignon
Batata-doce assada|Carboidratos|90|1.5|21.0|0.1|2.5|150|batata doce assada
Pão árabe|Carboidratos|275|9.0|55.0|1.5|2.3|60|pao arabe,pao sirio
Pipoca sem óleo|Carboidratos|375|11.0|74.0|4.5|15.0|25|pipoca,pipoca estourada
Vitamina de frutas|Bebidas|85|3.0|15.0|1.8|1.0|250|vitamina,vitamina de banana
Chá verde|Bebidas|1|0|0.2|0|0|200|cha verde
Chá mate|Bebidas|2|0|0.4|0|0|200|cha mate,mate
Shoyu|Molhos e complementos|60|6.0|8.0|0|0.8|15|shoyu,molho de soja
Polpa de frutas vermelhas|Frutas|45|0.8|10.0|0.3|3.0|100|polpa frutas vermelhas,polpa mix berries
Polpa de cajá|Frutas|55|0.6|13.0|0.2|1.5|100|polpa caja,caja
`.trim()

const liquidos = new Set(['Bebidas'])

export const ALIMENTOS_EXTRAS = linhas.split('\n').map((linha, indice) => {
  const [nome, categoria, kcal, prot, carb, gord, fibra, porcao, aliases = ''] = linha.split('|')
  const unidadeBase = liquidos.has(categoria) ? 'ml' : 'g'
  return {
    id: `br-${String(indice + 1).padStart(3, '0')}`,
    nome,
    categoria,
    kcal: Number(kcal), prot: Number(prot), carb: Number(carb), gord: Number(gord), fibra: Number(fibra),
    porcao: Number(porcao), unidadeBase,
    aliases: aliases.split(',').map((x) => x.trim()).filter(Boolean),
    fonte: FONTE,
    estimado: true,
  }
})
