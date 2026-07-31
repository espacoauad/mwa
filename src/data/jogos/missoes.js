// Missões do Monte Seu Prato — protótipo (Fase 3)
// Os critérios alimentam o motor src/utils/jogos/avaliarPrato.js.
// Faixas pensadas para permitir VÁRIAS combinações vencedoras (não há resposta única).

export const MISSOES = [
  {
    id: 'lanche-equilibrado',
    nivel: 1,
    tipoRefeicao: 'lanche',
    titulo: 'Monte um lanche equilibrado',
    tituloEN: 'Build a balanced snack',
    resumo: 'Entre 150 e 400 kcal, com proteína, fibra e uma fruta ou vegetal.',
    resumoEN: 'Between 150–400 kcal, with protein, fiber and a fruit or veggie.',
    criterios: {
      kcal: { min: 150, max: 400 },
      prot: { min: 10 },
      fibra: { min: 4 },
      gruposMin: { 'vegetal|fruta': 1 },
    },
    ensinamento:
      'Lanches com proteína + fibra tendem a segurar a fome por mais tempo que lanches só de carboidrato — mesmo com as mesmas calorias.',
    ensinamentoEN:
      'Snacks with protein + fiber tend to keep hunger away longer than carb-only snacks — even at the same calories.',
  },
  {
    id: 'jantar-equilibrado',
    nivel: 1,
    tipoRefeicao: 'refeicao',
    titulo: 'Monte um jantar equilibrado',
    tituloEN: 'Build a balanced dinner',
    resumo: 'Entre 350 e 700 kcal, com boa proteína, fibra e pelo menos um vegetal.',
    resumoEN: 'Between 350–700 kcal, with good protein, fiber and at least one veggie.',
    criterios: {
      kcal: { min: 350, max: 700 },
      prot: { min: 25 },
      fibra: { min: 6 },
      gruposMin: { vegetal: 1 },
    },
    ensinamento:
      'Um jantar equilibrado combina os grupos: a proteína preserva os músculos, o carboidrato dá energia e os vegetais somam fibra e volume com poucas calorias.',
    ensinamentoEN:
      'A balanced dinner combines groups: protein preserves muscle, carbs give energy, and veggies add fiber and volume with few calories.',
  },
  {
    id: 'proteina-fibra',
    nivel: 2,
    tipoRefeicao: 'refeicao',
    titulo: 'Refeição rica em proteínas e fibras',
    tituloEN: 'A meal rich in protein and fiber',
    resumo: 'Pelo menos 35 g de proteína e 10 g de fibra, entre 350 e 750 kcal.',
    resumoEN: 'At least 35 g protein and 10 g fiber, between 350–750 kcal.',
    criterios: {
      kcal: { min: 350, max: 750 },
      prot: { min: 35 },
      fibra: { min: 10 },
      gruposMin: { vegetal: 1 },
    },
    ensinamento:
      'Proteína e fibra são a dupla da saciedade: retardam o esvaziamento do estômago e ajudam a manter a glicemia mais estável depois da refeição.',
    ensinamentoEN:
      'Protein and fiber are the satiety duo: they slow stomach emptying and help keep blood sugar steadier after the meal.',
  },
]

export function missaoPorId(id) {
  return MISSOES.find((m) => m.id === id)
}
