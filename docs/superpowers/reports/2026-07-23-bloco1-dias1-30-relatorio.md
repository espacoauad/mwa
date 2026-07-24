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

## Itens Sinalizados (não editados — decisão da Wanessa)

| Dia | Arquivo | O que é | Por que precisa de decisão |
|---|---|---|---|
| — | conceitosNutricionais.js | Nenhum dos 9 conceitos usa 1ª pessoa da Wanessa ("eu"/"comigo") — é um glossário de referência, não uma fala pessoal | Confirmar se isso é intencional (tom de apêndice/glossário) ou se deveria ganhar voz pessoal como o resto do conteúdo |
| 8, 11, 18 | dicas.js | `conteudo` usa "densidade nutricional" aplicado a um macronutriente/nutriente isolado (proteína no dia 8, fibra no dia 11, ômega-3 no dia 18: "ela tem a maior densidade nutricional entre os três macros", "é um dos exemplos mais claros de densidade nutricional", "um dos nutrientes de maior densidade nutricional que existem") | A definição canônica em `conceitosNutricionais.js` (Task 2) descreve densidade nutricional como propriedade de um *alimento* (nutrientes por caloria), não de um nutriente isolado comparado a si mesmo. O uso nos dias 8/11/18 é uma extensão metafórica que reforça a ideia pedagogicamente, mas diverge tecnicamente da definição estrita. Não editado por ser um recurso retórico repetido e não uma afirmação factualmente incorreta — mas sinalizado para a Wanessa confirmar se a extensão do termo é aceitável ou se prefere reformular |
| 23 | dicas.js | `conteudo` explica fadiga de decisão com o modelo "seu cérebro gasta energia real — usamos glicose, oxigênio — para tomar decisões. Quanto mais decisões você toma... mais esgotada fica sua capacidade de decidir bem" | O modelo de "esgotamento do ego"/depleção de glicose para decisões (ego depletion) é popular mas cientificamente contestado — várias tentativas de replicação não confirmaram o efeito na magnitude original. A ideia geral de fadiga de decisão tem apoio mais amplo, mas a explicação fisiológica específica (glicose/oxigênio como recurso finito) é uma simplificação discutível. Não editado por não haver uma reformulação segura sem mais contexto do quanto a Wanessa quer se apoiar nesse modelo — sinalizado para decisão |
