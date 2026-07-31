# Revisão de Conteúdo — Bloco 1 (Dias 1–30) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revisar e corrigir, diretamente no código, todo o conteúdo textual dos dias 1–30 do MWA (dicas, informativos, lanches, conceitos nutricionais e reflexões dos versículos) quanto a correção factual/nutricional e aderência à voz da marca — entregando um relatório de mudanças para checkpoint com a Wanessa antes de escalar para os blocos 2 e 3.

**Architecture:** Nenhum código de aplicação é alterado — apenas os arrays de dados em `src/data/*.js` (strings de conteúdo). Cada task cobre um arquivo (ou um recorte de dias dentro dele), aplica uma régua fixa de voz e um checklist factual, edita diretamente com a ferramenta Edit, e registra cada mudança em um relatório markdown compartilhado. `npm run build` é a verificação objetiva de que nada quebrou a sintaxe/estrutura dos dados.

**Tech Stack:** Nenhuma dependência nova. Arquivos-fonte em JavaScript (ESM, arrays de objetos literais), build via Vite (`npm run build`).

**Não é uma task de código com testes automatizados de comportamento.** É revisão editorial de prosa: o "teste" de cada task é a aplicação do checklist abaixo + a verificação de build. Não pule o checklist — ele é o critério de aceite de cada mudança.

## Global Constraints

Copiado verbatim da spec (`docs/superpowers/specs/2026-07-23-revisao-conteudo-90-dias-design.md`):

- **Estrutura oficial do programa:** 30 dias (jornada base) + 90 dias (continuação, dias 31–90 = 60 dias novos). Total real: 90 dias corridos. Não mencionar "21 dias" nem "111 dias" em nenhuma edição.
- **Voz:** premium mas acessível · elegante mas humana · técnica mas simples · feminina mas não frágil · inspiradora sem exageros · direta mas acolhedora. 1ª pessoa da Wanessa ("eu", "comigo") falando com "você". Nunca: promessa milagrosa, terrorismo alimentar, linguagem agressiva de emagrecimento, urgência apelativa, excesso de emoji, clichê de infoproduto genérico.
- **Toque pessoal preservado:** falas como "Ah, Wanessa, mas hoje eu quero muito um açaí!" não são "erros de voz" — são a personalidade da marca. Não apagar.
- **Claims de saúde (CRN-1/27939):** moderar afirmações absolutas ("queima gordura", "garante", "acelera o metabolismo" categórico) para linguagem defensável ("ajuda a", "contribui para", "favorece").
- **Guardrails — NÃO alterar:** campos de estrutura de dados (`dia`, `cta.tipo`, `produto`, caminhos de `imagem`), preços (R$ 97 / R$ 147), janelas de oferta, termos de marca, texto bíblico dos versículos (só a `reflexao` é revisada). Se algo aqui parecer errado, **sinalizar no relatório**, não editar.
- **Incerteza:** o que não puder ser confirmado com segurança é sinalizado no relatório, nunca "corrigido no chute".

---

## Checklist de revisão (aplicar em toda task de conteúdo)

**A. Fatos/nutrição:**
1. Números de calorias e proteína (g) são plausíveis? Conferir contra a Tabela de Referência Nutricional (Task 1, atualizada a cada task).
2. Mesmo alimento aparece com o mesmo valor em arquivos diferentes? Se divergir, usar o valor mais preciso e registrar a padronização.
3. Afirmações de fisiologia/neurociência (grelina, dopamina, NEAT, TMB/TDEE, déficit calórico, neuroplasticidade, saciedade, glicemia/fibra, efeito térmico dos alimentos) — estão corretas e não infladas?
4. Claims de saúde são defensáveis para uma nutricionista registrada (ver Global Constraints)?
5. Estimativas de proteína/calorias mantêm o "~" quando são aproximação?

**B. Voz:**
6. Está em 1ª pessoa da Wanessa, tom acolhedor e direto (não genérico/"cara de IA")?
7. Nenhum gatilho da lista "nunca" (promessa milagrosa, terrorismo alimentar, urgência apelativa, excesso de emoji)?
8. O toque pessoal existente foi preservado (não neutralizado)?
9. Coerente com o restante do texto do mesmo dia (título, conteúdo, dica prática, frase motivacional não se contradizem)?

**C. Consistência interna:**
10. Terminologia consistente com `conceitosNutricionais.js` (ex.: sempre "déficit calórico", nunca variações informais que confundam).
11. Nenhuma menção a "21 dias" ou "111 dias" (ver Global Constraints).

Cada edição feita = uma linha na tabela de mudanças do relatório. Cada dúvida não resolvida = uma linha na lista de itens sinalizados.

---

## File Structure

- **Create:** `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md` — relatório de mudanças do bloco (Task 1 cria o esqueleto; Tasks 2–7 preenchem; Task 8 finaliza).
- **Modify:** `src/data/conceitosNutricionais.js` (linhas 1–87, arquivo inteiro)
- **Modify:** `src/data/dicas.js` (linhas 1–330, arquivo inteiro — dias 1–30)
- **Modify:** `src/data/informativos.js` (linhas 6–742 — dias 1–30; linhas 743+ são dias 31–90, fora de escopo neste bloco)
- **Modify:** `src/data/lanchesProteicos.js` (linhas 1–248, arquivo inteiro — dias 1–21)
- **Modify:** `src/data/lanches22a37.js` (linhas 11–100 — dias 22–30; linhas 101+ são dias 31–37, fora de escopo)
- **Modify:** `src/data/versiculos.js` (linhas 9–222 — dias 1–30, apenas campo `reflexao` + conferência de `referencia`; linhas 223+ são dias 31+, fora de escopo)

---

### Task 1: Criar relatório do bloco e tabela de referência nutricional

**Files:**
- Create: `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Produces: arquivo de relatório com 3 seções (`## Tabela de Referência Nutricional`, `## Mudanças`, `## Itens Sinalizados`) que as Tasks 2–7 vão preencher usando o mesmo formato de linha de tabela.

- [ ] **Step 1: Criar o arquivo de relatório com o esqueleto abaixo**

```markdown
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

## Mudanças

| Dia | Arquivo | Campo | Antes → Depois (resumo) | Categoria | Justificativa |
|---|---|---|---|---|---|

## Itens Sinalizados (não editados — decisão da Wanessa)

| Dia | Arquivo | O que é | Por que precisa de decisão |
|---|---|---|---|
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "docs: cria esqueleto do relatorio de revisao do bloco 1 (dias 1-30)"
```

---

### Task 2: Revisar `conceitosNutricionais.js` (glossário base — todo o arquivo)

**Files:**
- Modify: `src/data/conceitosNutricionais.js:1-87`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional da Task 1 (seção `## Tabela de Referência Nutricional`).
- Produces: terminologia canônica (`densidade nutricional`, `déficit calórico`, `TDEE`, `macronutrientes`, `efeito térmico`) que as Tasks 3–7 devem usar de forma consistente.

Este arquivo já foi lido integralmente durante o design e está factualmente sólido (9
conceitos: densidade nutricional, déficit calórico, calorias, macronutrientes, proteína,
carboidrato, gordura, fibras, micronutrientes). É o glossário-base citado pelos outros
arquivos — revise primeiro para travar a terminologia canônica.

- [ ] **Step 1: Ler o arquivo inteiro**

Leia `src/data/conceitosNutricionais.js` do início ao fim antes de editar qualquer coisa.

- [ ] **Step 2: Aplicar o checklist (seção A e B) a cada um dos 9 conceitos**

Pontos de atenção conhecidos a verificar com atenção redobrada (não são erros confirmados,
são os pontos de maior risco factual do arquivo):
- `deficit-calorico`: confirma que "TDEE" é usado corretamente como total de gasto diário
  (não confundir com TMB, que é só o gasto em repouso).
- `proteina`: "maior efeito térmico" é uma afirmação comparativa real (efeito térmico dos
  alimentos: proteína ~20-30%, carboidrato ~5-10%, gordura ~0-3%) — está correto, mas
  confirme que o texto não exagera o tamanho do efeito.
- `gordura`: "9 kcal por grama" está correto (vs. 4 kcal/g de proteína e carboidrato,
  conforme já dito em `macronutrientes`) — confirme que os dois trechos não se contradizem.

- [ ] **Step 3: Editar apenas onde o checklist apontar problema**

Use a ferramenta Edit para cada mudança pontual. Não reescreva parágrafos que já passam no
checklist — este arquivo tende a precisar de poucas ou nenhuma edição.

- [ ] **Step 4: Registrar cada mudança na tabela `## Mudanças` do relatório**

Formato de linha (edite o relatório da Task 1 com Edit, adicionando linhas à tabela):

```
| — | conceitosNutricionais.js | `oQueE` (id: deficit-calorico) | "texto antigo resumido" → "texto novo resumido" | fato | motivo em 1 frase |
```

Se nenhuma mudança for necessária, adicione uma linha única:
`| — | conceitosNutricionais.js | — | Nenhuma alteração — checklist aprovado sem ressalvas | — | — |`

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: build conclui sem erro (exit code 0).

- [ ] **Step 6: Commit**

```bash
git add src/data/conceitosNutricionais.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco1): revisa conceitosNutricionais.js (fatos + voz)"
```

---

### Task 3: Revisar `dicas.js` (dias 1–30, arquivo inteiro)

**Files:**
- Modify: `src/data/dicas.js:1-330`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: terminologia canônica da Task 2; Tabela de Referência Nutricional da Task 1.
- Produces: nada consumido por outra task — arquivo é folha da árvore de dependências.

Campos por dia: `tema`, `pilar`, `icone`, `titulo`, `conteudo`, `dicaPratica`,
`fraseMotivacional`, `objetivoComportamental`, `produto`. O campo mais denso e mais
propenso a claims fisiológicos é `conteudo`.

- [ ] **Step 1: Ler o arquivo inteiro (30 dias) antes de editar**

Leia `src/data/dicas.js` do início ao fim. Preste atenção especial aos dias que já
mencionam conceitos fisiológicos nomeados (ex.: dia 1 cita TMB/TDEE/déficit calórico —
confirme consistência com `conceitosNutricionais.js` revisado na Task 2).

- [ ] **Step 2: Aplicar o checklist completo (A, B, C) a cada um dos 30 dias**

Para cada dia, confira em especial:
- `conteudo`: toda afirmação de fisiologia/neurociência tem base real e não está inflada.
- `dicaPratica`: a ação sugerida é segura, concreta e não contraditória com `conteudo`.
- `fraseMotivacional`: soa como a Wanessa (1ª pessoa, sem clichê de infoproduto).
- Nenhuma menção redundante ou incorreta a "21 dias" ou "111 dias".

- [ ] **Step 3: Editar diretamente com a ferramenta Edit, dia por dia**

Priorize correções pontuais (trocar uma frase, moderar um claim) sobre reescrita completa
do parágrafo — preserve a estrutura e o comprimento quando o conteúdo já está correto e na
voz.

- [ ] **Step 4: Registrar cada mudança na tabela `## Mudanças` do relatório**

Mesmo formato de linha da Task 2, uma linha por edição, com o número do dia preenchido
(1–30).

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: build conclui sem erro (exit code 0).

- [ ] **Step 6: Commit**

```bash
git add src/data/dicas.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco1): revisa dicas.js dias 1-30 (fatos + voz)"
```

---

### Task 4: Revisar `informativos.js` (dias 1–30, linhas 6–742)

**Files:**
- Modify: `src/data/informativos.js:6-742`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional da Task 1 (arquivo com maior densidade de
  números — a task que mais alimenta e mais depende dessa tabela).
- Produces: qualquer alimento novo conferido aqui deve ser adicionado à Tabela de
  Referência Nutricional no relatório, para reuso nos blocos 2 e 3.

Estrutura por dia: `emoji`, `titulo`, `opcoes` (array de comparações, cada uma com `nome`,
`tom` — `bom`/`ruim`/`neutro` —, `itens` — pares `[nome, valor]` —, `total`, `extras`),
`dica`, `cta`. Antes de editar, confirme que a linha 743 é `dia: 31,` (início do bloco 2 —
**não editar a partir daí**).

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 30,\|dia: 31," src/data/informativos.js`
Expected:
```
723:    dia: 30,
743:    dia: 31,
```
Se os números de linha mudaram (por edições anteriores no mesmo arquivo), ajuste o recorte
de leitura/edição para parar antes do `dia: 31,` atual.

- [ ] **Step 2: Ler as linhas 6–742**

Leia `src/data/informativos.js` das linhas 6 a 742 (dias 1 a 30) antes de editar.

- [ ] **Step 3: Aplicar o checklist A (fatos) com foco nos números**

Para cada `opcoes[].itens` e `total`:
1. Confira cada valor de calorias/proteína contra a Tabela de Referência Nutricional.
2. Confira se a soma dos `itens` bate com o `total` declarado (some manualmente).
3. Se um alimento não estiver na tabela, calcule/estime com uma fonte plausível (TACO/USDA)
   e **adicione uma linha nova na Tabela de Referência Nutricional do relatório** antes de
   seguir para o próximo dia.
4. Confira se o `tom` (`bom`/`ruim`/`neutro`) é coerente com os números apresentados —
   nunca rotular como "ruim" uma escolha que não seja de fato inferior nutricionalmente
   (isso violaria a regra de "sem terrorismo alimentar").

- [ ] **Step 4: Aplicar o checklist B e C ao campo `dica`**

O campo `dica` é o texto longo educativo de cada informativo — aplique a régua de voz e
os pontos de fisiologia normalmente (mesmos critérios da Task 3).

- [ ] **Step 5: Editar diretamente com Edit, dia por dia**

Ao corrigir um número em `itens`, recalcule e corrija o `total` correspondente na mesma
edição — nunca deixe os dois dessincronizados.

- [ ] **Step 6: Registrar cada mudança na tabela `## Mudanças` do relatório**

Mesmo formato das tasks anteriores. Números corrigidos entram como categoria `fato`.

- [ ] **Step 7: Verificar build**

Run: `npm run build`
Expected: build conclui sem erro (exit code 0).

- [ ] **Step 8: Commit**

```bash
git add src/data/informativos.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco1): revisa informativos.js dias 1-30 (fatos + voz)"
```

---

### Task 5: Revisar `lanchesProteicos.js` (dias 1–21, arquivo inteiro)

**Files:**
- Modify: `src/data/lanchesProteicos.js:1-248`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional (Tasks 1 e 4).
- Produces: qualquer alimento novo conferido aqui é adicionado à tabela para reuso na
  Task 6.

Campos por dia: `icone`, `titulo`, `proteina` (string tipo `~19g`), `descricao`,
`ingredientes` (array), `preparo`, `produto` (`{ nome, imagem }` ou `null`).

- [ ] **Step 1: Ler o arquivo inteiro**

Leia `src/data/lanchesProteicos.js` do início ao fim (dias 1–21).

- [ ] **Step 2: Aplicar checklist A aos valores de `proteina`**

Para cada dia, some a proteína dos `ingredientes` usando a Tabela de Referência
Nutricional e confira contra o valor declarado em `proteina`. Tolerância: ±3g (é uma
estimativa de app, não rótulo nutricional). Fora dessa margem, corrija o valor.

- [ ] **Step 3: Aplicar checklist B e C a `descricao` e `preparo`**

`descricao` é onde mora a voz (ex.: "Uma forma rápida, prática e inteligente..."); `preparo`
deve ser instrução clara e realizável em poucos passos.

- [ ] **Step 4: Editar diretamente com Edit**

- [ ] **Step 5: Registrar cada mudança na tabela `## Mudanças` do relatório**

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build conclui sem erro (exit code 0).

- [ ] **Step 7: Commit**

```bash
git add src/data/lanchesProteicos.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco1): revisa lanchesProteicos.js dias 1-21 (fatos + voz)"
```

---

### Task 6: Revisar `lanches22a37.js` (dias 22–30, linhas 11–100)

**Files:**
- Modify: `src/data/lanches22a37.js:11-100`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional (Tasks 1, 4, 5).

O arquivo cobre dias 22–37, mas **apenas 22–30 são escopo deste bloco** (31–37 pertencem
ao Bloco 2). Mesma estrutura de campos da Task 5.

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 30,\|dia: 31," src/data/lanches22a37.js`
Expected:
```
100:    dia: 30,
111:    dia: 31,
```
Se os números mudaram, ajuste o recorte para parar no fim do objeto do dia 30 (antes de
`dia: 31,`).

- [ ] **Step 2: Ler as linhas 11–100**

- [ ] **Step 3: Aplicar checklist A, B, C (mesmos critérios da Task 5) apenas aos dias 22–30**

Não altere nada a partir da linha 101 (dias 31–37) — isso pertence ao Bloco 2.

- [ ] **Step 4: Editar diretamente com Edit**

- [ ] **Step 5: Registrar cada mudança na tabela `## Mudanças` do relatório**

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: build conclui sem erro (exit code 0).

- [ ] **Step 7: Commit**

```bash
git add src/data/lanches22a37.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco1): revisa lanches22a37.js dias 22-30 (fatos + voz)"
```

---

### Task 7: Revisar `versiculos.js` (dias 1–30, linhas 9–222 — apenas `reflexao`)

**Files:**
- Modify: `src/data/versiculos.js:9-222`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Nenhuma dependência de tabela nutricional — esta task é só voz + conferência bíblica.

Campos por dia: `dia`, `texto` (citação NVI — **não alterar**), `referencia` (livro/versículo
— **não alterar o texto, só confirmar que bate**), `tema`, `reflexao` (**único campo
editável**).

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 30,\|dia: 31," src/data/versiculos.js`
Expected:
```
216:    dia: 30,
223:    dia: 31,
```
Se os números mudaram, ajuste o recorte para parar no fim do objeto do dia 30.

- [ ] **Step 2: Ler as linhas 9–222**

- [ ] **Step 3: Para cada dia, confirmar que `referencia` corresponde ao `texto` citado**

Se a referência parecer incorreta (livro/capítulo/versículo não bate com a citação), **não
corrija sozinho** — adicione à tabela `## Itens Sinalizados` do relatório, porque isso é
uma citação bíblica e merece conferência da própria Wanessa.

- [ ] **Step 4: Aplicar checklist B (voz) apenas ao campo `reflexao`**

A reflexão deve soar como a Wanessa falando diretamente com a aluna — acolhedora, sem
clichê genérico de devocional. Note e corrija erros de digitação/gramática (ex.: "abraçe"
→ "abrace", já identificado no dia 3) como parte desta task.

- [ ] **Step 5: Editar apenas `reflexao` (e correções ortográficas pontuais) com Edit**

Nunca editar `texto` ou `referencia`.

- [ ] **Step 6: Registrar cada mudança na tabela `## Mudanças` e cada referência duvidosa em `## Itens Sinalizados`**

- [ ] **Step 7: Verificar build**

Run: `npm run build`
Expected: build conclui sem erro (exit code 0).

- [ ] **Step 8: Commit**

```bash
git add src/data/versiculos.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco1): revisa reflexoes de versiculos.js dias 1-30 (voz)"
```

---

### Task 8: Finalizar relatório do Bloco 1 e preparar checkpoint com a Wanessa

**Files:**
- Modify: `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: todas as linhas de `## Mudanças` e `## Itens Sinalizados` registradas nas
  Tasks 2–7, e a Tabela de Referência Nutricional consolidada.
- Produces: resumo executivo que abre o relatório (para leitura rápida da Wanessa) e a
  base de referência nutricional que o Bloco 2 vai herdar.

- [ ] **Step 1: Adicionar um resumo executivo no topo do relatório**

Insira, logo abaixo do cabeçalho do relatório (após a linha "Arquivos revisados: ..."),
uma seção nova:

```markdown
## Resumo Executivo

- Total de mudanças: [N] (fato: [N], voz: [N], segurança: [N], consistência: [N])
- Total de itens sinalizados para decisão da Wanessa: [N]
- Arquivos sem nenhuma alteração necessária: [lista, se houver]
```

Preencha `[N]` e `[lista]` contando as linhas reais das tabelas `## Mudanças` e
`## Itens Sinalizados` preenchidas nas Tasks 2–7 — não deixe placeholder no arquivo final.

- [ ] **Step 2: Rodar build final de todo o bloco**

Run: `npm run build`
Expected: build conclui sem erro (exit code 0). Se falhar, volte à task que introduziu o
problema (identifique pelo `git log` dos commits deste bloco) e corrija antes de prosseguir.

- [ ] **Step 3: Conferir o diff completo do bloco antes do commit final**

Run: `git diff --stat 892ae13 HEAD -- src/data/`

(`892ae13` é o commit da spec deste projeto, imediatamente anterior ao início da Task 1 —
use-o como âncora fixa em vez de contar commits, já que o número real de commits pode
variar.)

Expected: lista apenas os 6 arquivos de dados do Bloco 1 (`conceitosNutricionais.js`,
`dicas.js`, `informativos.js`, `lanchesProteicos.js`, `lanches22a37.js`, `versiculos.js`).

- [ ] **Step 4: Commit final do resumo**

```bash
git add docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "docs: finaliza relatorio do bloco 1 (dias 1-30) com resumo executivo"
```

- [ ] **Step 5: Apresentar o checkpoint para a Wanessa**

Não é um step de código — é a entrega ao usuário. Resuma em texto (fora do relatório): (a)
quantas mudanças por categoria, (b) 2-3 exemplos concretos de correção de fato e 2-3 de
ajuste de voz, (c) a lista de itens sinalizados que precisam da decisão dela, (d) pergunta
direta: aprova o tom das edições para eu escalar aos Blocos 2 (dias 31–60) e 3 (dias
61–90)?

---

## Self-Review (já aplicado ao escrever este plano)

- **Cobertura da spec:** todas as seções 3–7 da spec (régua de voz, checklist factual,
  guardrails, relatório, faseamento do Bloco 1) estão mapeadas em pelo menos uma task.
  A limpeza de resíduos do modelo antigo (versículos órfãos 91–111, docs obsoletos)
  permanece no Bloco 3, conforme já registrado na spec — não faz parte deste plano.
- **Placeholders:** nenhum "TBD"/"implementar depois" — cada task tem checklist concreto,
  comandos exatos e formato exato de log. Os únicos `[N]`/`[lista]` (Task 8, Step 1) são
  preenchidos com dados reais gerados pelas tasks anteriores, não são lacunas de plano.
  As correções de conteúdo em si (Tasks 2–7) são necessariamente abertas — é trabalho
  editorial guiado por um checklist explícito, não uma implementação com resultado único.
- **Consistência de nomes:** o arquivo de relatório (`2026-07-23-bloco1-dias1-30-relatorio.md`)
  e o formato de linha da tabela `## Mudanças` são idênticos em todas as tasks 2–7.
