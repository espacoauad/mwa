export const INSTRUCOES_AJUSTE = {
  regenerar: 'Gere uma nova versão completa, diferente da anterior, mantendo o mesmo pedido.',
  mais_curto: 'Deixe o texto mais curto e direto, cortando o que não for essencial.',
  mais_humano: 'Deixe o texto mais humano e conversacional, como se estivesse falando pessoalmente.',
  mais_educativo: 'Reforce o caráter educativo, explicando o "porquê" por trás da orientação.',
  mais_acolhedor: 'Deixe o tom mais acolhedor e gentil, sem soar exigente.',
  mais_elegante: 'Deixe a escrita mais elegante e refinada, sem perder clareza.',
  simplificar: 'Simplifique a linguagem, evitando termos técnicos.',
  corrigir_portugues: 'Revise e corrija a ortografia e a gramática do texto, mantendo o conteúdo.',
}

export function montarPrompt({ brandGuide, escolhas, instrucaoExtra }) {
  const linhas = []

  linhas.push(`Você é a redatora oficial do ${brandGuide.nomeCompleto} (${brandGuide.nome}).`)
  linhas.push(`Assinatura da marca: "${brandGuide.assinatura}". Slogan institucional: "${brandGuide.slogan}".`)
  linhas.push(`Posicionamento: ${brandGuide.posicionamento}`)
  linhas.push(`Tom de voz obrigatório: ${brandGuide.tomDeVoz.join(', ')}.`)
  if (brandGuide.palavrasProibidas?.length) {
    linhas.push(`Nunca use estas palavras/expressões: ${brandGuide.palavrasProibidas.join(', ')}.`)
  }
  if (brandGuide.regrasSaude) linhas.push(brandGuide.regrasSaude)
  linhas.push('Nunca invente estatísticas, pesquisas, referências científicas ou benefícios não comprovados.')

  if (escolhas.tom === 'Com fé') {
    linhas.push('Este conteúdo deve trazer fé cristã de forma natural: esperança, propósito, cuidado, gratidão, disciplina e respeito ao corpo — sem tom religioso forçado ou julgador.')
  }

  linhas.push('')
  linhas.push('--- Pedido de conteúdo ---')
  linhas.push(`Finalidade: ${escolhas.finalidade}`)
  linhas.push(`Formato: ${escolhas.formato}`)
  linhas.push(`Tema: ${escolhas.tema}`)
  if (escolhas.publico) linhas.push(`Público: ${escolhas.publico}`)
  if (escolhas.diaPrograma) linhas.push(`Dia do programa (90 dias): ${escolhas.diaPrograma}`)
  if (escolhas.objetivo) linhas.push(`Objetivo do conteúdo: ${escolhas.objetivo}`)
  linhas.push(`Nível de profundidade: ${escolhas.profundidade}`)
  linhas.push(`Tom: ${escolhas.tom}`)
  linhas.push(`Tamanho: ${escolhas.tamanho}`)
  if (escolhas.camposObrigatorios) linhas.push(`Informações obrigatórias que precisam aparecer: ${escolhas.camposObrigatorios}`)
  if (escolhas.palavrasIncluir) linhas.push(`Palavras ou ideias que devem aparecer: ${escolhas.palavrasIncluir}`)
  if (escolhas.palavrasEvitar) linhas.push(`Palavras que devem ser evitadas: ${escolhas.palavrasEvitar}`)
  if (escolhas.chamadaAcao) linhas.push(`Chamada para ação desejada: ${escolhas.chamadaAcao}`)
  if (escolhas.produtoRelacionado) linhas.push(`Produto/recurso do MWA relacionado: ${escolhas.produtoRelacionado}`)
  if (escolhas.observacoes) linhas.push(`Observações pessoais da Wanessa: ${escolhas.observacoes}`)

  if (instrucaoExtra) {
    linhas.push('')
    linhas.push('--- Ajuste solicitado nesta versão ---')
    linhas.push(instrucaoExtra)
  }

  linhas.push('')
  linhas.push('Entregue apenas o texto final do conteúdo, pronto para revisão — sem explicações extras antes ou depois.')

  return linhas.join('\n')
}
