function item(overrides) {
  const agora = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    createdAt: agora,
    updatedAt: agora,
    finalidade: 'Conteúdo interno do MWA',
    formato: 'Dica diária',
    tema: 'Hidratação',
    publico: 'Participantes dos 90 dias',
    diaPrograma: null,
    objetivo: '',
    profundidade: 'Rápido',
    tom: 'Acolhedor',
    tamanho: 'Curto',
    camposObrigatorios: '',
    palavrasIncluir: '',
    palavrasEvitar: '',
    chamadaAcao: '',
    observacoes: '',
    produtoRelacionado: '',
    promptGerado: '',
    historicoPrompts: [],
    textoConteudo: '',
    status: 'ideia',
    isDemo: true,
    tituloInterno: 'Conteúdo de demonstração',
    ...overrides,
  }
}

export const demoContentSeed = [
  item({ tituloInterno: 'Dica de hidratação (exemplo)', formato: 'Dica diária', tema: 'Hidratação', status: 'aprovado', textoConteudo: '💡 Dica do dia: comece a manhã com um copo de água antes do café.\n\nPor quê: ajuda o corpo a despertar antes mesmo da primeira refeição.' }),
  item({ tituloInterno: 'Lição dia 12 (exemplo)', formato: 'Lição', tema: 'Planejamento', diaPrograma: 12, status: 'em_revisao', textoConteudo: '🌿 Dia 12 — Planejando a semana\n\nHoje vamos organizar as refeições da semana em 10 minutos, sem complicação.' }),
  item({ tituloInterno: 'Desafio do fim de semana (exemplo)', formato: 'Desafio', tema: 'Movimento', status: 'rascunho' }),
  item({ tituloInterno: 'Carrossel leitura de rótulos (exemplo)', formato: 'Carrossel', tema: 'Leitura de rótulos', finalidade: 'Instagram', status: 'ideia' }),
  item({ tituloInterno: 'Legenda motivacional (exemplo)', formato: 'Legenda', tema: 'Motivação', finalidade: 'Instagram', status: 'aprovado', textoConteudo: 'Constância não é sobre ser perfeita todos os dias. É sobre voltar sempre que sair do caminho. 🌱' }),
  item({ tituloInterno: 'E-mail de boas-vindas (exemplo)', formato: 'E-mail', tema: 'Autoconhecimento', finalidade: 'E-mail', status: 'programado' }),
  item({ tituloInterno: 'Reflexão de encerramento (exemplo)', formato: 'Reflexão', tema: 'Progresso', status: 'arquivado', textoConteudo: '🕯️ Hoje você apareceu. Isso já conta.' }),
  item({ tituloInterno: 'Roteiro de Reels sono (exemplo)', formato: 'Reels', tema: 'Sono', finalidade: 'Instagram', status: 'ideia' }),
  item({ tituloInterno: 'Notificação da manhã (exemplo)', formato: 'Notificação', tema: 'Consistência', status: 'em_revisao' }),
]
