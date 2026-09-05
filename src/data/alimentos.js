import { ALIMENTOS_EXTRAS } from './alimentosExtras.js'
import { ALIMENTOS_EUA } from './alimentosEua.js'
import { ALIMENTOS_MARCAS } from './alimentosMarcas.js'
import { ALIMENTOS_HERBALIFE } from './alimentosHerbalife.js'
import { ALIMENTOS_INDUSTRIALIZADOS } from './alimentosIndustrializados.js'
import { quantidadeNaBase } from '../utils/alimentos.js'

// Banco de alimentos — valores por 100 g/ml (base TACO/TBCA/rótulos)
// porcao = porção sugerida em gramas, usada para pré-preencher a quantidade

export const CATEGORIAS = [
  'Proteínas',
  'Carboidratos',
  'Frutas',
  'Vegetais',
  'Laticínios',
  'Gorduras boas',
  'Suplementos',
  'Refeições prontas',
  'Bebidas',
  'Doces e sobremesas',
  'Molhos e complementos',
]

const ALIMENTOS_BASE = [
  // Proteínas
  { id: 'frango-grelhado', nome: 'Frango grelhado (peito)', categoria: 'Proteínas', kcal: 165, prot: 31, carb: 0, gord: 3.6, fibra: 0, porcao: 120 },
  { id: 'patinho', nome: 'Carne bovina magra (patinho)', categoria: 'Proteínas', kcal: 190, prot: 32, carb: 0, gord: 6.5, fibra: 0, porcao: 100 },
  { id: 'carne-moida', nome: 'Carne moída refogada', categoria: 'Proteínas', kcal: 212, prot: 26, carb: 0, gord: 12, fibra: 0, porcao: 100 },
  { id: 'ovo', nome: 'Ovo cozido', categoria: 'Proteínas', kcal: 146, prot: 13, carb: 0.6, gord: 9.5, fibra: 0, porcao: 100 },
  { id: 'clara-ovo', nome: 'Clara de ovo cozida', categoria: 'Proteínas', kcal: 52, prot: 11, carb: 0.7, gord: 0.2, fibra: 0, porcao: 33, medidas: [{ id: 'g', nome: 'g', plural: 'g', base: 1 }, { id: 'porcao', nome: 'porção sugerida', plural: 'porções sugeridas', base: 33 }, { id: 'un', nome: 'unidade', plural: 'unidades', base: 33 }] },
  { id: 'tilapia', nome: 'Tilápia grelhada', categoria: 'Proteínas', kcal: 96, prot: 20, carb: 0, gord: 1.7, fibra: 0, porcao: 120 },
  { id: 'atum', nome: 'Atum em lata (água)', categoria: 'Proteínas', kcal: 116, prot: 26, carb: 0, gord: 1, fibra: 0, porcao: 80 },
  { id: 'salmao', nome: 'Salmão grelhado', categoria: 'Proteínas', kcal: 208, prot: 20, carb: 0, gord: 13, fibra: 0, porcao: 100 },
  { id: 'whey', nome: 'Whey protein (pó)', categoria: 'Proteínas', kcal: 400, prot: 80, carb: 8, gord: 6, fibra: 0, porcao: 30, medidas: medidasColher(30, 10) },

  // Carboidratos
  { id: 'arroz-branco', nome: 'Arroz branco cozido', categoria: 'Carboidratos', kcal: 128, prot: 2.5, carb: 28, gord: 0.2, fibra: 1.6, porcao: 100 },
  { id: 'arroz-integral', nome: 'Arroz integral cozido', categoria: 'Carboidratos', kcal: 124, prot: 2.6, carb: 25.8, gord: 1, fibra: 2.7, porcao: 100 },
  { id: 'feijao', nome: 'Feijão carioca cozido', categoria: 'Carboidratos', kcal: 76, prot: 4.8, carb: 13.6, gord: 0.5, fibra: 8.5, porcao: 80 },
  { id: 'batata-doce', nome: 'Batata-doce cozida', categoria: 'Carboidratos', kcal: 77, prot: 0.6, carb: 18.4, gord: 0.1, fibra: 2.2, porcao: 150 },
  { id: 'batata', nome: 'Batata inglesa cozida', categoria: 'Carboidratos', kcal: 52, prot: 1.2, carb: 11.9, gord: 0, fibra: 1.3, porcao: 150 },
  { id: 'mandioca', nome: 'Mandioca cozida', categoria: 'Carboidratos', kcal: 125, prot: 0.6, carb: 30, gord: 0.3, fibra: 1.6, porcao: 100 },
  { id: 'pao-frances', nome: 'Pão francês', categoria: 'Carboidratos', kcal: 300, prot: 8, carb: 58.6, gord: 3.1, fibra: 2.3, porcao: 50 },
  { id: 'pao-integral', nome: 'Pão integral', categoria: 'Carboidratos', kcal: 253, prot: 9.4, carb: 49.9, gord: 2.9, fibra: 6.9, porcao: 50 },
  { id: 'aveia', nome: 'Aveia em flocos', categoria: 'Carboidratos', kcal: 394, prot: 13.9, carb: 66.6, gord: 8.5, fibra: 9.1, porcao: 30, medidas: medidasColher(30, 8) },
  { id: 'tapioca', nome: 'Tapioca (goma)', categoria: 'Carboidratos', kcal: 240, prot: 0, carb: 60, gord: 0, fibra: 0, porcao: 50 },
  { id: 'macarrao', nome: 'Macarrão cozido', categoria: 'Carboidratos', kcal: 158, prot: 5.8, carb: 30.9, gord: 1, fibra: 1.6, porcao: 150 },
  { id: 'cuscuz', nome: 'Cuscuz de milho', categoria: 'Carboidratos', kcal: 113, prot: 2.2, carb: 25.3, gord: 0.7, fibra: 2.1, porcao: 100 },

  // Frutas
  { id: 'banana', nome: 'Banana', categoria: 'Frutas', kcal: 89, prot: 1.1, carb: 22.8, gord: 0.3, fibra: 2.6, porcao: 100 },
  { id: 'maca', nome: 'Maçã', categoria: 'Frutas', kcal: 52, prot: 0.3, carb: 13.8, gord: 0.2, fibra: 2.4, porcao: 130 },
  { id: 'mamao', nome: 'Mamão papaia', categoria: 'Frutas', kcal: 40, prot: 0.5, carb: 10.4, gord: 0.1, fibra: 1.8, porcao: 150 },
  { id: 'morango', nome: 'Morango', categoria: 'Frutas', kcal: 32, prot: 0.7, carb: 7.7, gord: 0.3, fibra: 2, porcao: 100 },
  { id: 'laranja', nome: 'Laranja', categoria: 'Frutas', kcal: 47, prot: 0.9, carb: 11.8, gord: 0.1, fibra: 2.4, porcao: 130 },
  { id: 'abacate', nome: 'Abacate', categoria: 'Frutas', kcal: 160, prot: 2, carb: 8.5, gord: 14.7, fibra: 6.7, porcao: 70 },
  { id: 'manga', nome: 'Manga', categoria: 'Frutas', kcal: 60, prot: 0.8, carb: 15, gord: 0.4, fibra: 1.6, porcao: 100 },
  { id: 'melancia', nome: 'Melancia', categoria: 'Frutas', kcal: 30, prot: 0.6, carb: 7.6, gord: 0.2, fibra: 0.4, porcao: 200 },

  // Vegetais
  { id: 'brocolis', nome: 'Brócolis cozido', categoria: 'Vegetais', kcal: 35, prot: 2.4, carb: 7, gord: 0.4, fibra: 3.4, porcao: 80 },
  { id: 'salada-verde', nome: 'Salada verde (mix folhas)', categoria: 'Vegetais', kcal: 20, prot: 1.5, carb: 3, gord: 0.2, fibra: 2, porcao: 80 },
  { id: 'cenoura', nome: 'Cenoura crua', categoria: 'Vegetais', kcal: 41, prot: 0.9, carb: 9.6, gord: 0.2, fibra: 2.8, porcao: 60 },
  { id: 'abobrinha', nome: 'Abobrinha refogada', categoria: 'Vegetais', kcal: 25, prot: 1.1, carb: 4.3, gord: 0.4, fibra: 1.4, porcao: 100 },
  { id: 'tomate', nome: 'Tomate', categoria: 'Vegetais', kcal: 18, prot: 0.9, carb: 3.9, gord: 0.2, fibra: 1.2, porcao: 80 },

  // Laticínios
  { id: 'iogurte-natural', nome: 'Iogurte natural desnatado', categoria: 'Laticínios', kcal: 41, prot: 4, carb: 6, gord: 0.1, fibra: 0, porcao: 170 },
  { id: 'iogurte-grego', nome: 'Iogurte grego light', categoria: 'Laticínios', kcal: 59, prot: 10, carb: 3.6, gord: 0.4, fibra: 0, porcao: 130 },
  { id: 'queijo-minas', nome: 'Queijo minas frescal', categoria: 'Laticínios', kcal: 264, prot: 17.4, carb: 3, gord: 20, fibra: 0, porcao: 30 },
  { id: 'leite-desnatado', nome: 'Leite desnatado', categoria: 'Laticínios', kcal: 35, prot: 3.4, carb: 4.9, gord: 0.1, fibra: 0, porcao: 200 },
  { id: 'requeijao-light', nome: 'Requeijão light', categoria: 'Laticínios', kcal: 181, prot: 11, carb: 4, gord: 13, fibra: 0, porcao: 20 },
  { id: 'leite-po-desnatado', nome: 'Leite em pó desnatado', categoria: 'Laticínios', kcal: 362, prot: 35.1, carb: 52.9, gord: 0.7, fibra: 0, porcao: 26, medidas: medidasColher(26, 9) },
  { id: 'leite-po-semidesnatado', nome: 'Leite em pó semidesnatado', categoria: 'Laticínios', kcal: 408, prot: 30, carb: 50, gord: 10, fibra: 0, porcao: 26, medidas: medidasColher(26, 9) },

  // Gorduras boas
  { id: 'azeite', nome: 'Azeite de oliva', categoria: 'Gorduras boas', kcal: 884, prot: 0, carb: 0, gord: 100, fibra: 0, porcao: 10 },
  { id: 'pasta-amendoim', nome: 'Pasta de amendoim', categoria: 'Gorduras boas', kcal: 588, prot: 25, carb: 20, gord: 50, fibra: 8, porcao: 15 },
  { id: 'castanha-caju', nome: 'Castanha de caju', categoria: 'Gorduras boas', kcal: 570, prot: 18.5, carb: 29.1, gord: 46.3, fibra: 3.7, porcao: 20 },
  { id: 'chia', nome: 'Semente de chia', categoria: 'Gorduras boas', kcal: 486, prot: 16.5, carb: 42.1, gord: 30.7, fibra: 34.4, porcao: 15 },

  // Suplementos
  { id: 'hbl-shake', nome: 'Shake proteico (pó)', categoria: 'Suplementos', aliases: ['shake proteico', 'shake'], kcal: 354, prot: 34.6, carb: 42.3, gord: 3.8, fibra: 11.5, porcao: 26, suplemento: true, estimado: true, medidas: medidasColher(26, 10, [{ id: 'dose', nome: 'dose', plural: 'doses', base: 26 }]) },
  { id: 'hbl-pdm', nome: 'Bebida proteica em pó', categoria: 'Suplementos', aliases: ['bebida proteica em po', 'bebida de proteina em po'], kcal: 393, prot: 53.6, carb: 46.4, gord: 3.6, fibra: 3.6, porcao: 28, suplemento: true, estimado: true, medidas: medidasColher(28, 10, [{ id: 'dose', nome: 'dose', plural: 'doses', base: 28 }]) },
  { id: 'hbl-cha', nome: 'Chá de ervas concentrado', categoria: 'Suplementos', aliases: ['cha de ervas', 'cha de ervas concentrado'], kcal: 294, prot: 0, carb: 58.8, gord: 0, fibra: 0, porcao: 1.7, suplemento: true, estimado: true },
  { id: 'hbl-nrg', nome: 'Chá com guaraná', categoria: 'Suplementos', aliases: ['cha com guarana'], kcal: 300, prot: 0, carb: 60, gord: 0, fibra: 0, porcao: 2, suplemento: true, estimado: true },
  { id: 'hbl-fiber', nome: 'Fibras solúveis (pó)', categoria: 'Suplementos', aliases: ['fibras', 'fibras soluveis'], kcal: 220, prot: 0, carb: 73.5, gord: 0, fibra: 73.5, porcao: 6.8, suplemento: true, estimado: true },
  { id: 'hbl-cr7', nome: 'Bebida isotônica em pó', categoria: 'Suplementos', aliases: ['isotonico', 'bebida isotonica'], kcal: 370, prot: 0, carb: 88.9, gord: 0, fibra: 0, porcao: 27, suplemento: true, estimado: true },
  { id: 'hbl-barra', nome: 'Barra de proteína', categoria: 'Suplementos', aliases: ['barra de proteina'], kcal: 400, prot: 28.6, carb: 42.9, gord: 11.4, fibra: 2.9, porcao: 35, suplemento: true, estimado: true },

  // Refeições prontas (estimativas por 100 g do prato)
  { id: 'pf-tradicional', nome: 'Prato feito (arroz, feijão, frango, salada)', categoria: 'Refeições prontas', kcal: 130, prot: 9, carb: 15, gord: 3.5, fibra: 2.5, porcao: 400 },
  { id: 'sanduiche-natural', nome: 'Sanduíche natural de frango', categoria: 'Refeições prontas', kcal: 190, prot: 12, carb: 22, gord: 6, fibra: 2, porcao: 180 },
  { id: 'tapioca-queijo', nome: 'Tapioca com queijo', categoria: 'Refeições prontas', kcal: 230, prot: 7, carb: 38, gord: 6, fibra: 0.5, porcao: 120 },
  { id: 'omelete', nome: 'Omelete com legumes', categoria: 'Refeições prontas', kcal: 154, prot: 11, carb: 3, gord: 11, fibra: 1, porcao: 150 },
]

// Medidas explícitas para alimentos em pó/flocos cuja porção sugerida NÃO
// equivale a 1 colher de sopa (ex.: whey, aveia — a porção é uma dose maior
// que 1 colher). `colherSopa` é o peso real de 1 colher de sopa do produto.
function medidasColher(porcaoGramas, colherSopa, extras = []) {
  return [
    { id: 'g', nome: 'g', plural: 'g', base: 1 },
    { id: 'porcao', nome: 'porção sugerida', plural: 'porções sugeridas', base: porcaoGramas },
    { id: 'colher', nome: 'colher de sopa', plural: 'colheres de sopa', base: colherSopa },
    { id: 'colher-sobremesa', nome: 'colher de sobremesa', plural: 'colheres de sobremesa', base: Math.round((colherSopa * 2) / 3) },
    { id: 'colher-cha', nome: 'colher de chá', plural: 'colheres de chá', base: Math.round(colherSopa / 3) },
    ...extras,
  ]
}

// Queijos cremosos/pastosos: não são fatiados, e a "porção sugerida" deles é
// maior que 1 colher de sopa real — por isso têm peso de colher próprio aqui,
// em vez de usar a regra automática (que reaproveitaria a porção inteira).
const COLHER_EXPLICITO = {
  'queijo cottage': 20,
  'cream cheese': 15,
}

function prepararAlimento(alimento) {
  const unidadeBase = alimento.unidadeBase ?? 'g'
  const medidasPadrao = [
    { id: unidadeBase, nome: unidadeBase, plural: unidadeBase, base: 1 },
    { id: 'porcao', nome: 'porção sugerida', plural: 'porções sugeridas', base: alimento.porcao },
  ]
  const nome = alimento.nome.toLowerCase()
  const colherExplicito = COLHER_EXPLICITO[nome]
  if (unidadeBase === 'ml') medidasPadrao.push({ id: 'copo', nome: 'copo', plural: 'copos', base: 200 })
  if (alimento.categoria === 'Frutas') medidasPadrao.push({ id: 'un', nome: 'unidade média', plural: 'unidades médias', base: alimento.porcao })
  if (/queijo|pão|torrada/.test(nome) && !colherExplicito) medidasPadrao.push({ id: 'fatia', nome: 'fatia', plural: 'fatias', base: alimento.porcao })
  if (/ovo/.test(nome)) medidasPadrao.push({ id: 'un', nome: 'unidade', plural: 'unidades', base: 50 })
  if (/pizza/.test(nome)) medidasPadrao.push({ id: 'fatia', nome: 'fatia', plural: 'fatias', base: alimento.porcao })
  if (/quiche/.test(nome)) medidasPadrao.push({ id: 'un', nome: 'unidade', plural: 'unidades', base: alimento.porcao })
  if (/\bcerveja\b/.test(nome)) {
    medidasPadrao.push({ id: 'lata', nome: 'lata (350ml)', plural: 'latas (350ml)', base: 350 })
    medidasPadrao.push({ id: 'longneck', nome: 'long neck (355ml)', plural: 'long necks (355ml)', base: 355 })
  }
  if (/feijão|lentilha|grão-de-bico|sopa|caldo/.test(nome)) medidasPadrao.push({ id: 'concha', nome: 'concha', plural: 'conchas', base: alimento.porcao })
  if (/iogurte/.test(nome)) medidasPadrao.push({ id: 'pote', nome: 'pote', plural: 'potes', base: alimento.porcao })
  if (colherExplicito || /azeite|manteiga|margarina|maionese|molho|açúcar|\bmel\b|creme de leite|farinha|pasta de|geleia|requeijão|cacau|achocolatado|ketchup|mostarda|shoyu/.test(nome)) {
    const colherSopa = colherExplicito ?? alimento.porcao
    medidasPadrao.push({ id: 'colher', nome: 'colher de sopa', plural: 'colheres de sopa', base: colherSopa })
    medidasPadrao.push({ id: 'colher-sobremesa', nome: 'colher de sobremesa', plural: 'colheres de sobremesa', base: Math.round((colherSopa * 2) / 3) })
    medidasPadrao.push({ id: 'colher-cha', nome: 'colher de chá', plural: 'colheres de chá', base: Math.round(colherSopa / 3) })
  }
  if (alimento.suplemento) medidasPadrao.push({ id: 'dose', nome: 'dose', plural: 'doses', base: alimento.porcao })
  const medidas = alimento.medidas ?? medidasPadrao
  return {
    aliases: [],
    fonte: alimento.suplemento ? 'Valores médios da categoria — conferir o rótulo do produto escolhido' : 'TACO/TBCA',
    fonteUrl: alimento.suplemento ? null : 'https://fcf.usp.br/tbca/',
    ultimaConferencia: alimento.suplemento ? '2026-07-13' : null,
    validacaoPendente: Boolean(alimento.suplemento),
    estimado: false,
    ...alimento,
    unidadeBase,
    medidas,
  }
}

export const ALIMENTOS = [...ALIMENTOS_BASE, ...ALIMENTOS_EXTRAS, ...ALIMENTOS_EUA, ...ALIMENTOS_MARCAS, ...ALIMENTOS_HERBALIFE, ...ALIMENTOS_INDUSTRIALIZADOS].map(prepararAlimento)

// Macros de um alimento para uma quantidade em gramas
export function macrosDoAlimento(alimento, quantidade, medidaId = alimento.unidadeBase ?? 'g') {
  const f = quantidadeNaBase(alimento, quantidade, medidaId) / 100
  return {
    calorias: Math.round(alimento.kcal * f),
    proteina: Math.round(alimento.prot * f * 10) / 10,
    carbos: Math.round(alimento.carb * f * 10) / 10,
    gordura: Math.round(alimento.gord * f * 10) / 10,
    fibras: Math.round(alimento.fibra * f * 10) / 10,
  }
}
