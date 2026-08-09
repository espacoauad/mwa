
export function itemDoBanco(linha) {
  return {
    id: linha.id,
    alimentoId: linha.alimento_id,
    nome: linha.nome,
    marca: linha.marca,
    quantidade: linha.quantidade,
    quantidadeBase: linha.quantidade_base,
    medidaId: linha.medida_id,
    medidaNome: linha.medida_nome,
    manual: linha.manual,
    calorias: linha.calorias,
    proteina: linha.proteina,
    carbos: linha.carbos,
    gordura: linha.gordura,
    fibras: linha.fibras,
  }
}

export function itemParaBanco(item) {
  return {
    alimento_id: item.alimentoId ?? null,
    nome: item.nome,
    marca: item.marca ?? null,
    quantidade: item.quantidade,
    quantidade_base: item.quantidadeBase,
    medida_id: item.medidaId,
    medida_nome: item.medidaNome,
    manual: item.manual,
    calorias: item.calorias,
    proteina: item.proteina,
    carbos: item.carbos,
    gordura: item.gordura,
    fibras: item.fibras,
  }
}

export function refeicaoDoBanco(linha, itensDoBanco = []) {
  return {
    id: linha.id,
    data: linha.data,
    tipo: linha.tipo,
    horario: linha.horario,
    fotoUrl: linha.foto_url,
    itens: itensDoBanco.map(itemDoBanco),
  }
}

export function totaisDaRefeicao(refeicao) {
  const t = { calorias: 0, proteina: 0, carbos: 0, gordura: 0, fibras: 0 }
  for (const item of refeicao.itens) {
    t.calorias += item.calorias
    t.proteina += item.proteina
    t.carbos += item.carbos
    t.gordura += item.gordura
    t.fibras += item.fibras
  }
  return {
    calorias: Math.round(t.calorias),
    proteina: Math.round(t.proteina * 10) / 10,
    carbos: Math.round(t.carbos * 10) / 10,
    gordura: Math.round(t.gordura * 10) / 10,
    fibras: Math.round(t.fibras * 10) / 10,
  }
}
