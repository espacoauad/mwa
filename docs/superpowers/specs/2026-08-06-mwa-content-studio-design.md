# MWA Content Studio — Design (Fase 1)

Data: 2026-08-06 · Status: aprovado pela proprietária, aguardando revisão do spec escrito.

## 1. Contexto e objetivo

A proprietária (Wanessa) quer uma ferramenta de uso **interno e particular** — nunca acessada pelos participantes do MWA — para criar, organizar e revisar todo o conteúdo que alimenta o My Wellness App: lições dos 90 dias, dicas diárias, desafios, reflexões, notificações, roteiros de vídeo/aula, posts e legendas de Instagram, Reels, carrosséis, Stories, mensagens de WhatsApp, e-mails, materiais de lançamento, conteúdo para usuários piloto, enquetes, conteúdo com princípios cristãos (quando selecionado) e prompts de imagem para IA.

O pedido original descreve **12 áreas funcionais** (painel, criador de conteúdo, modelos prontos, planejador dos 90 dias, calendário editorial, banco de ideias, biblioteca de conteúdos, assistente de campanhas, guia da marca, revisão/segurança, exportação, e a experiência geral). Isso é grande demais para uma única especificação/implementação — foi decomposto em 4 fases independentes, cada uma testável por si só:

- **Fase 1 (este documento):** núcleo — Painel Inicial, Criador de Conteúdo, tela de Resultado/edição, Modelos Prontos, Guia da Marca, Backup.
- **Fase 2:** Planejador dos 90 Dias + Calendário Editorial.
- **Fase 3:** Banco de Ideias + Biblioteca de Conteúdos completa (busca, tags, favoritos, detecção de repetição).
- **Fase 4:** Assistente de Campanhas + Revisão/Segurança avançada + exportação completa (CSV, pacote de campanha).

A ordem foi confirmada pela proprietária. Cada fase segue seu próprio ciclo spec → plano → implementação.

## 2. Identidade e tom (referência para todo o conteúdo gerado)

Reaproveita o material já aprovado do projeto, sem recriar do zero:

- **Manual de identidade visual:** [docs/MWA-Manual-Identidade-Visual.html](../../MWA-Manual-Identidade-Visual.html) — paleta (verde floresta `#08402F`, dourado `#c59f4f`, bege, branco), tipografia, símbolo.
- **Brandbook / copy da landing page:** [docs/MWA-BrandBook-LandingPage-Copy.md](../../MWA-BrandBook-LandingPage-Copy.md) — tom de voz, posicionamento.
- **Regras de marca do pedido original:** nome (MWA / My Wellness App), assinatura "Aprenda. Pratique. Evolua.", slogan institucional "Conhecimento para escolher. Constância para evoluir.", tom acolhedor/elegante/feminino sem infantilizar, proibição de promessas milagrosas, terrorismo nutricional, linguagem médica indevida, "projeto verão", "corpo perfeito", "transformação garantida", e da frase "Não é uma dieta. É uma nova forma de viver".
- Fé cristã só entra quando o formato/tom "Com fé" é selecionado.

Essas regras alimentam automaticamente o **Guia da Marca** (seção 5) e todo prompt gerado pelo Criador de Conteúdo.

## 3. Abordagem técnica

**Stack:** React + Vite (JavaScript), mesma base já usada em `landingpage/`. Sem backend nesta fase — persistência 100% em `localStorage` do navegador. CSS próprio com variáveis de design (cores/tipografia da identidade MWA), sem framework de UI pesado. Roteamento com `react-router`. Exportação em TXT/PDF gerada no navegador (sem servidor). Deploy como site Netlify separado (novo site na conta, não dentro do site da landing page).

**Local no projeto:** pasta própria `content-studio/` na raiz do repositório MWA, com `package.json`, `vite.config.js`, `netlify.toml` independentes — espelhando a estrutura de `landingpage/`.

**Por quê essa abordagem (vs. alternativas):**
- *Next.js com servidor* — rejeitado: adiciona complexidade de hospedagem/servidor sem necessidade real para uma usuária única, sem login nesta fase.
- *Builder low-code (Retool etc.)* — rejeitado: não entregaria a identidade visual personalizada e os fluxos específicos que a proprietária descreveu.
- localStorage puro é suficiente para uso de uma pessoa, e a estrutura de dados é desenhada em formato JSON simples para poder migrar para Supabase depois sem redesenho (login, sync entre dispositivos, e trabalho em equipe ficam para uma fase futura, fora do escopo das 4 fases atuais).

## 4. Estrutura de navegação

Menu lateral (desktop) / inferior (celular) mostrando **o mapa completo do app desde a Fase 1**, mesmo que só parte esteja funcional:

Funcionais nesta fase: Painel Inicial, Criar Conteúdo, Modelos Prontos, Guia da Marca, Configurações (backup).
Visíveis mas marcados "Em breve": Planejador 90 Dias, Calendário Editorial, Banco de Ideias, Biblioteca de Conteúdos, Campanhas.

Isso evita que a proprietária pense que uma função "sumiu" quando na verdade ainda não foi construída, e já orienta o mapa mental do app final.

## 5. Modelo de dados (localStorage)

Todas as chaves versionadas sob um namespace `mwa-content-studio` para não colidir com outros apps do navegador.

```
contentItems: [{
  id, createdAt, updatedAt,
  finalidade, formato, tema, publico,
  diaPrograma (1-90 ou null),
  objetivo, profundidade, tom, tamanho,
  camposObrigatorios, palavrasIncluir, palavrasEvitar,
  chamadaAcao, observacoes, produtoRelacionado,
  promptGerado,       // último prompt copiado
  historicoPrompts: [{ prompt, instrucaoExtra, criadoEm }],
  textoConteudo,      // corpo editável, colado/escrito pela usuária
  status: 'ideia' | 'rascunho' | 'em_revisao' | 'aprovado' | 'arquivado' | 'programado',
  isDemo: bool,
  tituloInterno
}]

templates: [{
  id, nome, formato, categoria,
  conteudoModelo,     // texto real, pronto para usar como ponto de partida
  origem: 'sistema' | 'usuario'
}]

brandGuide: {
  nome, nomeCompleto, assinatura, slogan,
  posicionamento, publico,
  tomDeVoz: [...], palavrasRecomendadas: [...], palavrasProibidas: [...],
  regrasSaude, diretrizesVisuais, exemplosAprovados: [...]
}

settings: { demoDataLoaded: bool, schemaVersion }
```

O `brandGuide` vem pré-preenchido a partir do manual e brandbook existentes (seção 2), editável pela proprietária a qualquer momento — e toda edição passa a valer para os próximos prompts gerados.

## 6. Telas da Fase 1

### 6.1 Painel Inicial
Cards com contagem de conteúdos por status; lista "criados recentemente" (últimos 5); lista "aguardando revisão"; botão em destaque "Criar novo conteúdo"; link "ver todos" abrindo uma lista simples de todo o conteúdo salvo, filtrável por status (busca por palavra-chave/tags/etiquetas fica para a Fase 3 — Biblioteca completa). Sem widget de calendário nesta fase (chega na Fase 2).

### 6.2 Criar Conteúdo
Formulário em etapas cobrindo todos os campos do pedido original: finalidade, formato, tema, público, dia do programa (1–90, opcional), objetivo, profundidade (rápido/intermediário/completo), tom, tamanho (curto/médio/longo), informações obrigatórias, palavras/ideias a incluir, palavras a evitar, chamada para ação, observações pessoais, produto/recurso relacionado. Uma tela de **resumo das escolhas** aparece antes de gerar o prompt, com botão "Editar" para voltar a qualquer campo.

### 6.3 Geração — Modo sem API
O app monta um **prompt completo**, combinando: contexto de marca (extraído do Guia da Marca vigente), todas as escolhas do formulário, e instruções explícitas de não inventar estatísticas/pesquisas/promessas e de sinalizar quando o conteúdo tocar em saúde/nutrição. O prompt aparece em um quadro com botão **"Copiar prompt"** e instrução curta de colar no Claude.ai (ou outra IA). Uma caixa **"Colar resposta aqui"** recebe o texto gerado e o transforma em conteúdo editável dentro do app.

*(Fora do escopo desta fase: qualquer chamada automática a uma API de IA. Se no futuro isso for adicionado, será via função serverless no Netlify — nunca com chave de API exposta no navegador.)*

### 6.4 Resultado / Editor
Área de texto editável com os botões do pedido original: Editar, Copiar, Salvar como rascunho, Aprovar, Arquivar, Exportar, Adicionar ao calendário (desabilitado com aviso "disponível na Fase 2"), Criar título, Criar chamada para ação, Criar prompt de imagem, Adaptar para outro formato, Transformar em carrossel/Stories/Reels.

**Mecânica sem API:** botões de ajuste de estilo (Regenerar, Deixar mais curto, Mais humano, Mais educativo, Mais acolhedor, Mais elegante, Simplificar, Corrigir português) **não reescrevem o texto sozinhos** — cada um gera um **novo prompt refinado** (prompt original + instrução específica do botão) para copiar e colar de novo no Claude, com a resposta colada de volta. Cada versão fica salva em `historicoPrompts` para não perder o histórico.

**Revisão leve automática (sem IA):** ao salvar/aprovar, o app varre o texto contra `palavrasProibidas` do Guia da Marca e destaca ocorrências; e mostra o aviso fixo "Este conteúdo contém informações relacionadas à saúde ou nutrição. Revise os dados antes da publicação." sempre que detectar termos de uma lista de palavras-gatilho (ex.: emagrecer, dieta, calorias, perda de peso). Nunca aprova nada automaticamente — aprovação é sempre um clique manual da proprietária.

### 6.5 Modelos Prontos
Biblioteca com os ~19 modelos do pedido original (conteúdo educativo diário, lição dos 90 dias, dica rápida, desafio do dia, reflexão de encerramento, notificação manhã/noite, carrossel educativo, sequência de 5 Stories, roteiro de Reels, legenda Instagram, post de lançamento, depoimento, boas-vindas, recuperação de participante desmotivado, celebração de progresso, conteúdo com fé, convite, mensagem para piloto, pesquisa de satisfação) — **cada um escrito com conteúdo real e específico do MWA**, não texto genérico de placeholder, seguindo o tom de voz da seção 2. Usar um modelo pré-preenche o Criador de Conteúdo com aquele ponto de partida. Permite criar, editar, duplicar e excluir modelos próprios.

### 6.6 Guia da Marca
Tela de referência fixa e editável com nome, slogans, posicionamento, tom de voz, palavras recomendadas/proibidas, público, diretrizes visuais, regras de saúde, exemplos aprovados — pré-populada a partir da seção 2. Qualquer edição aqui passa a valer para os próximos prompts gerados e para a revisão leve automática.

### 6.7 Configurações / Backup
Adição da proprietária além do pedido original de Fase 1: como os dados vivem só no navegador, uma tela simples para **baixar backup** (arquivo JSON com tudo) e **restaurar backup**, além do botão "Apagar apenas dados de demonstração" (remove só itens com `isDemo: true`, preservando conteúdo real).

## 7. Dados de demonstração

Ao abrir pela primeira vez, o app carrega ~8–10 `contentItems` de exemplo cobrindo formatos e status variados (para popular o Painel e mostrar o fluxo completo), todos marcados `isDemo: true`. Os **modelos prontos não são demo** — são conteúdo real utilizável desde o primeiro dia, então não são apagados pelo botão "apagar dados de demonstração".

## 8. Exportação (escopo desta fase)

Copiar texto, exportar TXT, exportar PDF (de um conteúdo individual e do Guia da Marca), imprimir (via navegador). Exportação de calendário em CSV e pacote de campanha completo ficam para a Fase 4.

## 9. Testes / verificação

Fluxo completo a validar antes de considerar a Fase 1 pronta: criar conteúdo do zero pelo formulário → gerar prompt → colar resposta simulada → editar → aprovar → ver refletido no Painel; usar um Modelo Pronto como ponto de partida; editar o Guia da Marca e confirmar que o próximo prompt gerado reflete a mudança; baixar backup, apagar dados de demonstração, restaurar backup; testar em largura de celular e desktop; exportar TXT e PDF de um item.
