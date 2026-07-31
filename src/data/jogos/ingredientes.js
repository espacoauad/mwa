// Ingredientes do Monte Seu Prato — apenas METADADOS do jogo.
// Os valores nutricionais NÃO são duplicados aqui: vêm de src/data/alimentos.js
// (base TACO/TBCA, por 100 g), via alimentoId. Fonte única de verdade.

import { ALIMENTOS } from '../alimentos.js'

export const GRUPOS = [
  { id: 'proteina', nome: 'Proteínas', nomeEN: 'Proteins' },
  { id: 'carbo', nome: 'Carboidratos', nomeEN: 'Carbs' },
  { id: 'vegetal', nome: 'Vegetais', nomeEN: 'Veggies' },
  { id: 'fruta', nome: 'Frutas', nomeEN: 'Fruits' },
  { id: 'gordura', nome: 'Gorduras boas', nomeEN: 'Good fats' },
  { id: 'extra', nome: 'Extras', nomeEN: 'Extras' },
]

// porcao: gramas e rótulo da porção de referência exibida no jogo
const METADADOS = [
  // Proteínas
  { alimentoId: 'frango-grelhado', grupo: 'proteina', porcao: { g: 120, rotulo: '1 filé médio', rotuloEN: '1 medium fillet' } },
  { alimentoId: 'ovo', grupo: 'proteina', porcao: { g: 50, rotulo: '1 unidade', rotuloEN: '1 egg' } },
  { alimentoId: 'tilapia', grupo: 'proteina', porcao: { g: 120, rotulo: '1 filé médio', rotuloEN: '1 medium fillet' } },
  { alimentoId: 'patinho', grupo: 'proteina', porcao: { g: 100, rotulo: '1 bife médio', rotuloEN: '1 medium steak' } },
  { alimentoId: 'atum', grupo: 'proteina', porcao: { g: 80, rotulo: '1 lata drenada', rotuloEN: '1 drained can' } },
  { alimentoId: 'iogurte-grego', grupo: 'proteina', porcao: { g: 130, rotulo: '1 pote', rotuloEN: '1 cup' } },
  { alimentoId: 'iogurte-natural', grupo: 'proteina', porcao: { g: 170, rotulo: '1 pote', rotuloEN: '1 cup' } },
  { alimentoId: 'queijo-minas', grupo: 'proteina', porcao: { g: 30, rotulo: '1 fatia', rotuloEN: '1 slice' } },
  { alimentoId: 'omelete', grupo: 'proteina', porcao: { g: 150, rotulo: '1 omelete', rotuloEN: '1 omelet' } },

  // Carboidratos
  { alimentoId: 'arroz-integral', grupo: 'carbo', porcao: { g: 100, rotulo: '4 col. de sopa', rotuloEN: '4 tbsp' } },
  { alimentoId: 'arroz-branco', grupo: 'carbo', porcao: { g: 100, rotulo: '4 col. de sopa', rotuloEN: '4 tbsp' } },
  { alimentoId: 'feijao', grupo: 'carbo', porcao: { g: 80, rotulo: '1 concha', rotuloEN: '1 ladle' } },
  { alimentoId: 'batata-doce', grupo: 'carbo', porcao: { g: 150, rotulo: '1 unidade média', rotuloEN: '1 medium unit' } },
  { alimentoId: 'pao-integral', grupo: 'carbo', porcao: { g: 50, rotulo: '2 fatias', rotuloEN: '2 slices' } },
  { alimentoId: 'pao-frances', grupo: 'carbo', porcao: { g: 50, rotulo: '1 unidade', rotuloEN: '1 roll' } },
  { alimentoId: 'aveia', grupo: 'carbo', porcao: { g: 30, rotulo: '3 col. de sopa', rotuloEN: '3 tbsp' } },
  { alimentoId: 'tapioca', grupo: 'carbo', porcao: { g: 50, rotulo: '1 unidade', rotuloEN: '1 unit' } },
  { alimentoId: 'macarrao', grupo: 'carbo', porcao: { g: 150, rotulo: '1 pegador', rotuloEN: '1 serving' } },

  // Vegetais
  { alimentoId: 'brocolis', grupo: 'vegetal', porcao: { g: 80, rotulo: '4 buquês', rotuloEN: '4 florets' } },
  { alimentoId: 'salada-verde', grupo: 'vegetal', porcao: { g: 80, rotulo: '1 prato de folhas', rotuloEN: '1 plate of greens' } },
  { alimentoId: 'cenoura', grupo: 'vegetal', porcao: { g: 60, rotulo: '½ unidade ralada', rotuloEN: '½ grated unit' } },
  { alimentoId: 'abobrinha', grupo: 'vegetal', porcao: { g: 100, rotulo: '½ xícara', rotuloEN: '½ cup' } },
  { alimentoId: 'tomate', grupo: 'vegetal', porcao: { g: 80, rotulo: '1 unidade média', rotuloEN: '1 medium unit' } },

  // Frutas
  { alimentoId: 'banana', grupo: 'fruta', porcao: { g: 100, rotulo: '1 unidade', rotuloEN: '1 unit' } },
  { alimentoId: 'maca', grupo: 'fruta', porcao: { g: 130, rotulo: '1 unidade', rotuloEN: '1 unit' } },
  { alimentoId: 'mamao', grupo: 'fruta', porcao: { g: 150, rotulo: '1 fatia média', rotuloEN: '1 medium slice' } },
  { alimentoId: 'morango', grupo: 'fruta', porcao: { g: 100, rotulo: '8 unidades', rotuloEN: '8 units' } },
  { alimentoId: 'laranja', grupo: 'fruta', porcao: { g: 130, rotulo: '1 unidade', rotuloEN: '1 unit' } },
  { alimentoId: 'abacate', grupo: 'fruta', porcao: { g: 70, rotulo: '2 col. de sopa', rotuloEN: '2 tbsp' } },

  // Gorduras boas
  { alimentoId: 'azeite', grupo: 'gordura', porcao: { g: 10, rotulo: '1 col. de sopa', rotuloEN: '1 tbsp' } },
  { alimentoId: 'pasta-amendoim', grupo: 'gordura', porcao: { g: 15, rotulo: '1 col. de sopa', rotuloEN: '1 tbsp' } },
  { alimentoId: 'castanha-caju', grupo: 'gordura', porcao: { g: 20, rotulo: '1 punhado', rotuloEN: '1 handful' } },
  { alimentoId: 'chia', grupo: 'gordura', porcao: { g: 15, rotulo: '1 col. de sopa', rotuloEN: '1 tbsp' } },

  // Extras
  { alimentoId: 'leite-desnatado', grupo: 'extra', porcao: { g: 200, rotulo: '1 copo', rotuloEN: '1 glass' } },
  { alimentoId: 'whey', grupo: 'extra', porcao: { g: 30, rotulo: '1 dose', rotuloEN: '1 scoop' } },
  { alimentoId: 'requeijao-light', grupo: 'extra', porcao: { g: 20, rotulo: '1 col. de sopa', rotuloEN: '1 tbsp' } },
]

const PORCOES_PERMITIDAS = [0.5, 1, 1.5, 2]

// Junta metadados do jogo com o alimento da base (macros por 100 g)
export const INGREDIENTES = METADADOS.map((meta) => {
  const alimento = ALIMENTOS.find((a) => a.id === meta.alimentoId)
  return alimento ? { ...meta, alimento, porcoesPermitidas: PORCOES_PERMITIDAS } : null
}).filter(Boolean)

export function ingredientesDoGrupo(grupoId) {
  return INGREDIENTES.filter((i) => i.grupo === grupoId)
}
