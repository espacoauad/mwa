import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kfavxgrvikflzyzvcoyb.supabase.co'
const SUPABASE_KEY = 'sb_publishable_0J5iJD2TOr0j0qoEEZ9XzQ_eOEXlPh-'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Dados dos 15 lanches com especificações nutricionais
const lanches = [
  {
    id: 1,
    titulo: 'Iogurte Grego com Granola e Berries',
    descricao: '150g iogurte grego + 2 colheres (chá) granola integral + 50g berries',
    calorias: 155,
    proteina: 14,
    carboidrato: 18,
    gordura: 3.5,
    fibra: 2.5,
    praticidade: 5,
    ingredientes: ['Iogurte grego 0%', 'Granola integral', 'Morango/Mirtilo/Amora'],
    modo_preparo: 'Coloque o iogurte em uma tigela, coloque as berries no topo, finalize com a granola.',
  },
  {
    id: 2,
    titulo: 'Banana com Pasta de Amendoim Light',
    descricao: '1 banana média (100g) + 1 colher (sopa) de pasta de amendoim 25% reduzida',
    calorias: 180,
    proteina: 8,
    carboidrato: 22,
    gordura: 7,
    fibra: 2.8,
    praticidade: 5,
    ingredientes: ['Banana', 'Pasta de amendoim light'],
    modo_preparo: 'Corte a banana longitudinalmente, passe a pasta de amendoim nos dois lados.',
  },
  {
    id: 3,
    titulo: 'Bolo Proteico de Caneca',
    descricao: '30g pó proteico + 50ml leite + 1 ovo + 15g aveia + microondas 90s',
    calorias: 165,
    proteina: 16,
    carboidrato: 16,
    gordura: 3.5,
    fibra: 2,
    praticidade: 4,
    ingredientes: ['Pó proteico', 'Leite desnatado', 'Ovo', 'Aveia', 'Fermento'],
    modo_preparo: 'Misture todos em uma xícara, microondas 90 segundos em potência máxima.',
  },
  {
    id: 4,
    titulo: 'Picolé de Iogurte Proteico',
    descricao: '100ml iogurte grego + 15g mel + 50ml suco de berries',
    calorias: 110,
    proteina: 10,
    carboidrato: 12,
    gordura: 1.5,
    fibra: 0.5,
    praticidade: 3,
    ingredientes: ['Iogurte grego', 'Mel', 'Suco natural'],
    modo_preparo: 'Bata no liquidificador, coloque em molde de picolé, congele 4 horas.',
  },
  {
    id: 5,
    titulo: 'Sanduíche de Frango Desfiado',
    descricao: '60g frango + 2 fatias pão integral + 20g requeijão light + alface + tomate',
    calorias: 195,
    proteina: 18,
    carboidrato: 20,
    gordura: 4.5,
    fibra: 3.5,
    praticidade: 5,
    ingredientes: ['Peito de frango', 'Pão integral', 'Requeijão light', 'Alface', 'Tomate'],
    modo_preparo: 'Passe requeijão no pão, adicione alface, frango e tomate. Corte diagonalmente.',
  },
  {
    id: 6,
    titulo: 'Cream Cheese com Crackers Integrais',
    descricao: '30g cream cheese light + 6 crackers integrais (22g)',
    calorias: 160,
    proteina: 9,
    carboidrato: 14,
    gordura: 7,
    fibra: 2,
    praticidade: 5,
    ingredientes: ['Cream cheese light', 'Crackers integrais'],
    modo_preparo: 'Abra os crackers, espalhe o cream cheese com uma faca.',
  },
  {
    id: 7,
    titulo: 'Batida Proteica de Morango',
    descricao: '1 scoop pó proteico + 150ml leite + 100g morango + 50ml água',
    calorias: 140,
    proteina: 20,
    carboidrato: 14,
    gordura: 1,
    fibra: 2,
    praticidade: 5,
    ingredientes: ['Pó proteico', 'Leite desnatado', 'Morango', 'Água'],
    modo_preparo: 'Bata tudo no liquidificador até homogêneo. Beba imediatamente.',
  },
  {
    id: 8,
    titulo: 'Ovos Cozidos com Maçã',
    descricao: '2 ovos cozidos + 1 maçã pequena (120g)',
    calorias: 155,
    proteina: 13,
    carboidrato: 18,
    gordura: 6,
    fibra: 2.5,
    praticidade: 4,
    ingredientes: ['Ovos', 'Maçã'],
    modo_preparo: 'Cozinhe os ovos, deixe esfriar, descasque. Coma com a maçã.',
  },
  {
    id: 9,
    titulo: 'Barra Proteica Caseira',
    descricao: '50g pó proteico + 40g pasta amendoim + 30g aveia + 20ml agave',
    calorias: 175,
    proteina: 12,
    carboidrato: 19,
    gordura: 5,
    fibra: 2.5,
    praticidade: 3,
    ingredientes: ['Pó proteico', 'Pasta de amendoim', 'Aveia', 'Calda de agave'],
    modo_preparo: 'Misture todos, pressione em forma, congele 2h, corte em 4 barras.',
  },
  {
    id: 10,
    titulo: 'Queijo Branco com Mel e Nozes',
    descricao: '100g queijo branco + 1 colher (chá) mel + 8 nozes (14g)',
    calorias: 185,
    proteina: 16,
    carboidrato: 12,
    gordura: 9.5,
    fibra: 1.2,
    praticidade: 5,
    ingredientes: ['Queijo branco', 'Mel', 'Nozes'],
    modo_preparo: 'Coloque o queijo, regue com mel, coloque nozes ao lado.',
  },
  {
    id: 11,
    titulo: 'Wrap Proteico Light',
    descricao: '1 wrap integral + 50g frango + 30g rúcula + 20g cenoura + mostarda',
    calorias: 175,
    proteina: 15,
    carboidrato: 18,
    gordura: 5.5,
    fibra: 3,
    praticidade: 4,
    ingredientes: ['Wrap integral', 'Frango desfiado', 'Rúcula', 'Cenoura', 'Mostarda'],
    modo_preparo: 'Coloque frango, rúcula e cenoura no wrap, regue com mostarda, enrole bem.',
  },
  {
    id: 12,
    titulo: 'Pudim de Chia com Leite',
    descricao: '200ml leite + 20g chia + 15g mel + ½ banana',
    calorias: 160,
    proteina: 8.5,
    carboidrato: 16,
    gordura: 7,
    fibra: 3.5,
    praticidade: 3,
    ingredientes: ['Leite desnatado', 'Sementes de chia', 'Mel', 'Banana'],
    modo_preparo: 'Misture leite, chia e mel. Deixe descansar 4h. Decore com banana.',
  },
  {
    id: 13,
    titulo: 'Frango Grelhado com Maçã',
    descricao: '60g peito de frango grelhado + 150g maçã',
    calorias: 145,
    proteina: 19,
    carboidrato: 18,
    gordura: 1.5,
    fibra: 2.5,
    praticidade: 3,
    ingredientes: ['Peito de frango', 'Maçã'],
    modo_preparo: 'Grelhe o frango temperado, sirva acompanhado de maçã fatiada.',
  },
  {
    id: 14,
    titulo: 'Tapioca Proteica com Queijo',
    descricao: '1 tapioca (40g polvilho) + 30g queijo meia cura ralado',
    calorias: 170,
    proteina: 11,
    carboidrato: 17,
    gordura: 6.5,
    fibra: 0.8,
    praticidade: 4,
    ingredientes: ['Polvilho de tapioca', 'Queijo meia cura'],
    modo_preparo: 'Prepare a tapioca, recheie com queijo ralado. Dobradura ou aberta.',
  },
  {
    id: 15,
    titulo: 'Castanhas com Frutas Vermelhas',
    descricao: '25g castanhas (amêndoas/do pará) + 80g berries',
    calorias: 180,
    proteina: 6.5,
    carboidrato: 14,
    gordura: 12,
    fibra: 2.8,
    praticidade: 5,
    ingredientes: ['Castanhas', 'Berries diversas'],
    modo_preparo: 'Combine as castanhas e berries em uma tigela. Coma direto.',
  },
]

async function inserirLanches() {
  console.log('📝 Iniciando inserção de lanches...\n')

  try {
    // Vamos distribuir os 15 lanches ao longo dos 89 dias
    // Cada dia tem 2 lanches (manhã e tarde), então 89 dias = 178 lanches
    // Vamos repetir os 15 lanches aproximadamente 12x

    const lanchesParaInserir = []
    for (let dia = 1; dia <= 89; dia++) {
      // Seleciona 2 lanches diferentes por dia
      const lanches1 = lanches[(dia - 1) % 15]
      const lanches2 = lanches[(dia + 6) % 15] // offset de 6 para variedade

      lanchesParaInserir.push({
        dia,
        tipo: 'lanche_manha',
        titulo_lanche: lanches1.titulo,
        descricao: lanches1.descricao,
        calorias: lanches1.calorias,
        proteina: lanches1.proteina,
        carboidrato: lanches1.carboidrato,
        gordura: lanches1.gordura,
        fibra: lanches1.fibra,
        ingredientes: lanches1.ingredientes,
        modo_preparo: lanches1.modo_preparo,
        praticidade: lanches1.praticidade,
      })

      lanchesParaInserir.push({
        dia,
        tipo: 'lanche_tarde',
        titulo_lanche: lanches2.titulo,
        descricao: lanches2.descricao,
        calorias: lanches2.calorias,
        proteina: lanches2.proteina,
        carboidrato: lanches2.carboidrato,
        gordura: lanches2.gordura,
        fibra: lanches2.fibra,
        ingredientes: lanches2.ingredientes,
        modo_preparo: lanches2.modo_preparo,
        praticidade: lanches2.praticidade,
      })
    }

    console.log(`✅ Preparados ${lanchesParaInserir.length} registros de lanches\n`)
    console.log('📊 Amostra dos primeiros 4 lanches (dias 1-2):')
    lanchesParaInserir.slice(0, 4).forEach((l, i) => {
      console.log(`  ${i + 1}. [Dia ${l.dia}] ${l.tipo}: ${l.titulo_lanche} (${l.calorias}kcal, ${l.proteina}g proteína)`)
    })

    console.log(
      `\n⚠️  Nota: Esta é uma prévia dos dados que serão inseridos no banco.\n
Para realmente inserir no Supabase, será necessário:\n
1. Criar a tabela 'mwa_lanches' no Supabase com os campos acima
2. Usar uma chave com permissão admin/service_role
3. Executar via SQL Editor do Supabase Dashboard\n`,
    )

    console.log('📝 Script SQL para criar a tabela (execute no Supabase SQL Editor):')
    console.log(`
CREATE TABLE IF NOT EXISTS mwa_lanches (
  id BIGSERIAL PRIMARY KEY,
  dia INTEGER NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  titulo_lanche VARCHAR(255) NOT NULL,
  descricao TEXT,
  calorias FLOAT,
  proteina FLOAT,
  carboidrato FLOAT,
  gordura FLOAT,
  fibra FLOAT,
  ingredientes TEXT[] DEFAULT '{}',
  modo_preparo TEXT,
  praticidade INTEGER DEFAULT 5,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_mwa_lanches_dia ON mwa_lanches(dia);
`)

    console.log('\n✅ Dados prontos para revisão. Próximos passos:')
    console.log('1. Revisar o arquivo LANCHES_NUTRICIONAIS_PARA_REVISAR.md')
    console.log('2. Confirmar se deseja prosseguir com a inserção')
    console.log('3. Executar script de inserção no Supabase')
  } catch (erro) {
    console.error('❌ Erro:', erro)
  }
}

inserirLanches()
