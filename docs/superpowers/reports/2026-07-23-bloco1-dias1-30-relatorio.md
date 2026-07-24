# Bloco 1 (Dias 1–30) — Relatório de Revisão de Conteúdo

Data: 2026-07-23
Arquivos revisados: conceitosNutricionais.js, dicas.js, informativos.js (dias 1–30),
lanchesProteicos.js, lanches22a37.js (dias 22–30), versiculos.js (dias 1–30, campo reflexao)

## Tabela de Referência Nutricional

Valores padrão usados para conferência de plausibilidade (fonte: TACO/USDA, arredondado).
Atualizar esta tabela sempre que um novo alimento for conferido.

| Alimento | Porção | Calorias | Proteína |
|---|---|---|---|
| Ovo cozido (1 unidade, ~50g) | 1 un | ~70 kcal | ~6g |
| Iogurte grego natural (1 pote, 100g) | 100g | ~100 kcal | ~10g |
| Pão francês (1 un, ~50g) | 1 un | ~150 kcal | ~4-6g |
| Pão integral (1 fatia, ~25g) | 1 fatia | ~65-70 kcal | ~3g |
| Banana (1 unidade média) | 1 un | ~90 kcal | ~1g |
| Aveia em flocos (2 colheres de sopa, ~20g) | 20g | ~75 kcal | ~2.5g |
| Castanhas/nozes (punhado, ~15g) | 15g | ~90-100 kcal | ~2-3g |
| Azeite (1 colher de sopa, ~13g) | 1 colher | ~110-120 kcal | 0g |
| Peito de frango grelhado (100g) | 100g | ~165 kcal | ~31g |
| Leite desnatado (200ml) | 200ml | ~70 kcal | ~7g |
| Atum enlatado em água, escorrido (100g) | 100g | ~115 kcal | ~26g |
| Tilápia crua (100g) | 100g | ~95 kcal | ~20g |
| Feijão cozido (100g) | 100g | ~130 kcal | ~8-9g (fibra ~8,5g) |
| Azeite de oliva (1 colher de sopa, ~13-15g) | 1 colher | ~110-135 kcal | 0g |
| Maçã (1 unidade média, ~130g) | 1 un | ~75-90 kcal | ~0-0,5g |
| Granola (porção, ~20g) | 20g | ~80-90 kcal | ~2g |
| Mel (1 colher de sopa, ~20g) | 1 colher | ~60-65 kcal | 0g |
| Salmão grelhado (100g, cozido) | 100g | ~200-230 kcal | ~20-25g |
| Cerveja (lata, 350ml, ~5% ABV) | 350ml | ~145-150 kcal | ~1g |
| Vinho tinto (taça, 150ml) | 150ml | ~120-125 kcal | ~0g |
| Batata frita (porção média, ~115g) | ~115g | ~360-365 kcal | ~4g |
| Batata assada com casca (1 unidade média, ~170g) | 1 un | ~160 kcal | ~4g |

## Mudanças

| Dia | Arquivo | Campo | Antes → Depois (resumo) | Categoria | Justificativa |
|---|---|---|---|---|---|
| — | conceitosNutricionais.js | `porQue` (id: gordura) | "...é o que garante todos os benefícios sem sabotar..." → "...é o que ajuda a aproveitar os benefícios sem sabotar..." | segurança | "garante" é afirmação absoluta não defensável para CRN-1; suavizado para linguagem defensável |
| — | conceitosNutricionais.js | `porQue` (id: micronutrientes) | "...densidade nutricional garante que, mesmo comendo menos calorias..." → "...densidade nutricional contribui para que, mesmo comendo menos calorias..." | segurança | "garante" é afirmação absoluta não defensável para CRN-1; suavizado para "contribui para" |
| 4 | dicas.js | `titulo` | "Água: seu acelerador de resultados" → "Água: sua aliada nos resultados" | segurança | "acelerador de resultados" sugere causalidade direta água→emagrecimento, análogo ao exemplo "acelera o metabolismo" citado nos guardrails; suavizado para linguagem defensável |
| 4 | dicas.js | `conteudo` | "ela participa de TODAS as reações do metabolismo — inclusive a queima de gordura" → "ela participa da grande maioria das reações do metabolismo — inclusive dos processos ligados à queima de gordura" | segurança | "TODAS" é afirmação absoluta não defensável; suavizado, e "a queima de gordura" (causal direto) virou "processos ligados à queima de gordura" |
| 15 | dicas.js | `conteudo` | "a estratégia individual é o que garante que você não pare no meio do caminho" → "a estratégia individual é o que faz a diferença para você não parar no meio do caminho" | segurança | "garante" é promessa absoluta sobre adesão/resultado, não defensável para CRN-1; suavizado |
| 17 | dicas.js | `conteudo` | "1 colher de sopa tem aproximadamente 90–120 kcal" → "1 colher de sopa tem aproximadamente 110–120 kcal" | fato | Valor mínimo (90 kcal) divergia da Tabela de Referência Nutricional do relatório (~110-120 kcal para 1 colher de sopa de azeite); alinhado |
| 18 | dicas.js | `conteudo` | "Ele reduz inflamação, protege o coração, apoia o cérebro..." → "Ele ajuda a reduzir a inflamação, contribui para a saúde do coração, favorece o cérebro..." | segurança | Afirmações absolutas de causalidade ("reduz", "protege", "apoia") não defensáveis para CRN-1 — RCTs de grande porte não confirmam redução significativa de eventos cardiovasculares maiores com suplementação de ômega-3 em população geral; suavizado para linguagem defensável |
| 23 | dicas.js | `fraseMotivacional` | "Planejar não é ser rigída." → "Planejar não é ser rígida." | voz | Correção ortográfica (acentuação) |
| 23 | dicas.js | `objetivoComportamental` | "sem culpa ou exesso de controle" → "sem culpa ou excesso de controle" | voz | Correção ortográfica (typo) |
| 26 | dicas.js | `conteudo` | "Alem disso, cansaço reduz..." → "Além disso, cansaço reduz..." | voz | Correção ortográfica (acentuação) |
| 2 | informativos.js | `opcoes[0].itens` (3 ovos cozidos) | "Calorias: 155 / Proteína: 13g" → "Calorias: 210 / Proteína: 18g" | fato | 3 ovos cozidos, pela Tabela de Referência (~70 kcal/~6g proteína cada), somam ~210 kcal/~18g proteína — o valor anterior correspondia a ~2 ovos, não 3; corrigido para bater com o número de ovos declarado no `nome` |
| 14 | informativos.js | `dica` | "Sua sensibilidade à insulina melhora, seus níveis de inflamação tendem a cair..." → "Sua sensibilidade à insulina tende a melhorar, seus níveis de inflamação tendem a cair..." | segurança | Primeira cláusula afirmava melhora de sensibilidade à insulina em 2 semanas como fato certo (não hedged), inconsistente com a cláusula seguinte já hedged ("tendem a cair"); suavizado para linguagem defensável e consistente |
| 20 | informativos.js | `dica` | "é o solvente de todas as reações metabólicas do seu corpo, inclusive da queima de gordura" → "é o solvente da grande maioria das reações metabólicas do seu corpo, incluindo os processos ligados à queima de gordura" | segurança | "TODAS" é afirmação absoluta não defensável (mesmo padrão já corrigido na Task 3 em dicas.js dia 4); suavizado para "grande maioria" e "processos ligados à" |
| 20 | informativos.js | `opcoes[2].itens` (Água) | "Emagrece? ESSENCIAL" → "Emagrece? SIM, apoia" | segurança | "ESSENCIAL" para emagrecimento é uma causalidade direta água→resultado não defensável para CRN-1 (mesmo padrão do título "acelerador de resultados" já corrigido na Task 3); suavizado para linguagem defensável mantendo o formato binário usado nas outras opções do mesmo dia |

## Itens Sinalizados (não editados — decisão da Wanessa)

| Dia | Arquivo | O que é | Por que precisa de decisão |
|---|---|---|---|
| — | conceitosNutricionais.js | Nenhum dos 9 conceitos usa 1ª pessoa da Wanessa ("eu"/"comigo") — é um glossário de referência, não uma fala pessoal | Confirmar se isso é intencional (tom de apêndice/glossário) ou se deveria ganhar voz pessoal como o resto do conteúdo |
| 8, 11, 18 | dicas.js | `conteudo` usa "densidade nutricional" aplicado a um macronutriente/nutriente isolado (proteína no dia 8, fibra no dia 11, ômega-3 no dia 18: "ela tem a maior densidade nutricional entre os três macros", "é um dos exemplos mais claros de densidade nutricional", "um dos nutrientes de maior densidade nutricional que existem") | A definição canônica em `conceitosNutricionais.js` (Task 2) descreve densidade nutricional como propriedade de um *alimento* (nutrientes por caloria), não de um nutriente isolado comparado a si mesmo. O uso nos dias 8/11/18 é uma extensão metafórica que reforça a ideia pedagogicamente, mas diverge tecnicamente da definição estrita. Não editado por ser um recurso retórico repetido e não uma afirmação factualmente incorreta — mas sinalizado para a Wanessa confirmar se a extensão do termo é aceitável ou se prefere reformular |
| 23 | dicas.js | `conteudo` explica fadiga de decisão com o modelo "seu cérebro gasta energia real — usamos glicose, oxigênio — para tomar decisões. Quanto mais decisões você toma... mais esgotada fica sua capacidade de decidir bem" | O modelo de "esgotamento do ego"/depleção de glicose para decisões (ego depletion) é popular mas cientificamente contestado — várias tentativas de replicação não confirmaram o efeito na magnitude original. A ideia geral de fadiga de decisão tem apoio mais amplo, mas a explicação fisiológica específica (glicose/oxigênio como recurso finito) é uma simplificação discutível. Não editado por não haver uma reformulação segura sem mais contexto do quanto a Wanessa quer se apoiar nesse modelo — sinalizado para decisão |
| 3 | informativos.js | `opcoes` — "150g salmão grelhado" (280 cal · 25g prot) e "200g peixe branco/tilápia" (200 cal · 30g prot) | Conferindo contra dados padrão de peixe cozido (salmão ~200-230 kcal/~20-25g proteína por 100g; tilápia crua ~95 kcal/~20g proteína por 100g na Tabela de Referência), a proteína de ambas as opções parece um pouco subestimada para o peso declarado (ex.: 200g de tilápia deveria ficar mais perto de ~40g de proteína se calculado sobre peso cru). A variação depende muito de peso cru vs. cozido e do corte/espécie do peixe, então não há como corrigir com segurança sem essa informação — sinalizado em vez de editado no chute |
| 9 | informativos.js | `opcoes[0].itens` (Banana + aveia + mel) | "Banana: 105 cal · 1g prot" diverge levemente da Tabela de Referência (~75-90 kcal para banana média). O valor de 105 kcal é compatível com uma banana média-grande (dado USDA), então não é necessariamente um erro — apenas uma calibração diferente de "banana média". Não editado por ser uma variação plausível de tamanho de fruta, não um erro claro — sinalizado para padronização futura se a Wanessa preferir um valor único |
| 11 | informativos.js | `opcoes[1].itens` (Café com leite desnatado) | "Leite desnatado 200ml: 80 cal" diverge da Tabela de Referência (~70 kcal/200ml). O texto do dia (itens, `total`, `extras` "Economia: 80 calorias" e o cálculo semanal na `dica`: "80 calorias... viram quase 560 calorias por semana") é internamente consistente com o valor de 80 cal. Corrigir para bater com a tabela exigiria editar em cascata itens + total + extras + dica por uma diferença marginal (10 kcal, dentro da variação normal entre marcas de leite desnatado) — sinalizado para decisão da Wanessa em vez de editado |
| 15 | informativos.js | `opcoes[0].itens` (Método Sozinho) | "Informação: Completa (21 dicas + app)" — o programa de 30 dias tem 30 dicas diárias (dicas.js dias 1-30), não 21. Não é literalmente "21 dias" (o texto protegido pelo guardrail), mas parece um resíduo da estrutura antiga de 21 dias mencionada no histórico do projeto (commit "esclarece historico 21->30 dias"). Não editado por já haver limpeza de resíduos agendada para o Bloco 3 — sinalizado para confirmar se deve ser corrigido para "30 dicas" agora ou no Bloco 3 |
