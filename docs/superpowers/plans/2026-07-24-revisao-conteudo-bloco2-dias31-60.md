# Revisão de Conteúdo — Bloco 2 (Dias 31–60) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revisar e corrigir, diretamente no código, todo o conteúdo textual dos dias 31–60 do MWA (dicas, informativos, lanches e reflexões dos versículos) quanto a correção factual/nutricional e aderência à voz da marca — continuando o mesmo relatório do Bloco 1, com checkpoint com a Wanessa ao final antes de escalar ao Bloco 3.

**Architecture:** Mesma abordagem do Bloco 1 (`docs/superpowers/plans/2026-07-23-revisao-conteudo-bloco1-dias1-30.md`): cada task cobre um arquivo (ou recorte de dias), aplica a mesma régua de voz e checklist factual já validados no Bloco 1, edita diretamente com Edit, e registra no **mesmo arquivo de relatório** do Bloco 1 (`docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`), que passa a cobrir dias 1–60 (título e escopo do relatório atualizados na Task 1 deste bloco). `npm run build` verifica que nada quebrou.

**Tech Stack:** Igual ao Bloco 1 — JavaScript (ESM, arrays de objetos), build via Vite.

**Diferença central em relação ao Bloco 1:** a partir daqui, os arquivos de conteúdo (`dicas90.js`, `informativos.js`, `lanches22a37.js`, `lanches38a89.js`, `versiculos.js`) misturam dias de MAIS de um bloco no mesmo arquivo. Toda task precisa **confirmar a fronteira de linhas antes de editar** (grep pelo `dia:` de início e de fim do recorte) e nunca tocar dias fora do seu recorte.

## Global Constraints

Idênticas ao Bloco 1 — copiadas verbatim da spec (`docs/superpowers/specs/2026-07-23-revisao-conteudo-90-dias-design.md`) e já validadas na prática:

- **Estrutura oficial do programa:** 30 dias (jornada base, já revisada) + 90 dias (continuação, dias 31–90 = 60 dias novos). Total real: 90 dias corridos. Nunca mencionar "21 dias" nem "111 dias" como nome do programa.
- **Voz:** premium mas acessível · elegante mas humana · técnica mas simples · feminina mas não frágil · inspiradora sem exageros · direta mas acolhedora. 1ª pessoa da Wanessa ("eu", "comigo") falando com "você". Nunca: promessa milagrosa, terrorismo alimentar, linguagem agressiva de emagrecimento, urgência apelativa, excesso de emoji, clichê de infoproduto genérico.
- **Toque pessoal preservado:** não apagar personalidade existente.
- **Claims de saúde (CRN-1/27939):** moderar afirmações absolutas ("queima gordura", "garante", "acelera o metabolismo" categórico) para linguagem defensável ("ajuda a", "contribui para", "favorece").
- **Guardrails — NÃO alterar:** campos de estrutura de dados (`dia`, `pilar`/`icone`/`emoji`, `cta.tipo`, `produto`, `texto`/`referencia` dos versículos), preços, janelas de oferta, termos de marca. Sinalizar no relatório em vez de editar quando algo parecer errado fora do escopo de texto/fatos.
- **Incerteza:** o que não puder ser confirmado com segurança é sinalizado no relatório, nunca "corrigido no chute".

### Régua já calibrada pela Wanessa no checkpoint do Bloco 1 (aplicar desde já, sem novo checkpoint intermediário)

- **Produtos proprietários do programa — composição confirmada, usar como referência:**
  - **Whey 3W (Herbalife):** 1 dose/scoop (~34g pó) = **137 kcal · 26g proteína**.
  - **Barra de Proteína Citrus Lemon (Herbalife):** 1 unidade (~35g) = **140 kcal · 10g proteína**.
  - **Shake Fórmula 1 Herbalife, sabor baunilha, pó seco:** 2 colheres (~26g) = **221 kcal · 18g proteína**.
  - **Leite semidesnatado:** 250ml ≈ **120 kcal · 8g proteína** (proporcional para outras quantidades).
  - Ao verificar `proteina` em dias com esses produtos, use estes valores em vez de "sinalizar como não verificável" — o Bloco 1 já tinha vários desses dias e as correções costumam ser significativas (ex.: receitas que combinam shake + whey somam bem mais proteína do que a estimativa antiga presumia).
  - Se a receita disser "água OU leite" como escolha da leitora, e o cenário com água já bater dentro de ±3g do declarado, não é necessário editar — mencionar apenas se quiser, não é bloqueante.
- **Ausência de 1ª pessoa da Wanessa** em textos de apoio (descrições de lanche, glossário) é um padrão aceito pela Wanessa — não reescrever tom em massa, não sinalizar de novo (já está registrado como decisão no relatório).
- **Referências bíblicas divergentes:** mesma régua do Bloco 1 — nunca corrigir sozinho o texto/referência; se o `texto` não bater com a `referencia`, procure e proponha (não edite ainda) um versículo real e verificado (WebSearch, tradução NVI) mantendo o `tema` do dia, e registre em `## Itens Sinalizados` para a Wanessa decidir — **exceto** se for um erro óbvio de digitação/gramática dentro da `reflexao` (esses seguem sendo corrigidos direto, como no Bloco 1).

## Checklist de revisão (idêntico ao Bloco 1 — aplicar em toda task de conteúdo)

**A. Fatos/nutrição:**
1. Números de calorias e proteína plausíveis? Conferir contra a Tabela de Referência Nutricional do relatório (já tem ~40 alimentos + os 3 produtos Herbalife confirmados).
2. Mesmo alimento com mesmo valor entre arquivos? Padronizar divergências.
3. Afirmações de fisiologia/neurociência corretas e não infladas?
4. Claims de saúde defensáveis para uma nutricionista registrada?
5. Estimativas mantêm "~"?

**B. Voz:**
6. 1ª pessoa da Wanessa, tom acolhedor e direto?
7. Nenhum gatilho da lista "nunca"?
8. Toque pessoal preservado?
9. Campos do mesmo dia não se contradizem?

**C. Consistência interna:**
10. Terminologia consistente com `conceitosNutricionais.js`.
11. Nenhuma menção a "21 dias"/"111 dias" como nome de programa.

Cada edição = uma linha em `## Mudanças` do relatório (`Categoria` = exatamente `fato`/`voz`/`segurança`/`consistência`). Cada dúvida = uma linha em `## Itens Sinalizados` (ler a tabela primeiro — já tem ~12 linhas do Bloco 1, não duplicar nem apagar).

---

## File Structure

- **Modify:** `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md` — relatório contínuo, agora cobrindo dias 1–60 (renomear escopo na Task 1 deste bloco, sem criar arquivo novo).
- **Modify:** `src/data/dicas90.js` (linhas 13–374 — dias 31–60; linhas 375+ são dias 61–90, fora de escopo)
- **Modify:** `src/data/informativos.js` (linhas 743–1073 — dias 31–60; linhas 1074+ são dias 61–90, fora de escopo)
- **Modify:** `src/data/lanches22a37.js` (linhas 111–187 — dias 31–37, arquivo inteiro a partir daqui; já não há dias 22–30 neste bloco, já revisados no Bloco 1)
- **Modify:** `src/data/lanches38a89.js` (linhas 12–242 — dias 38–60; linhas 243+ são dias 61–89, fora de escopo)
- **Modify:** `src/data/versiculos.js` (linhas 223–434 — dias 31–60, campo `reflexao` + conferência de `referencia`; linhas 435+ são dias 61+, fora de escopo)

---

### Task 1: Atualizar escopo do relatório para cobrir o Bloco 2

**Files:**
- Modify: `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Produces: relatório com escopo estendido, pronto para as Tasks 2–6 anexarem linhas.

- [ ] **Step 1: Atualizar o cabeçalho do relatório**

Trocar o título de `# Bloco 1 (Dias 1–30) — Relatório de Revisão de Conteúdo` para
`# Blocos 1–2 (Dias 1–60) — Relatório de Revisão de Conteúdo`, e atualizar a linha
"Arquivos revisados:" para incluir `dicas90.js (dias 31–60), lanches22a37.js (dias 31–37),
lanches38a89.js (dias 38–60)`, mantendo a lista de arquivos do Bloco 1 já revisados.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "docs: estende escopo do relatorio para cobrir o bloco 2 (dias 31-60)"
```

---

### Task 2: Revisar `dicas90.js` (dias 31–60)

**Files:**
- Modify: `src/data/dicas90.js:13-374`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: terminologia canônica de `conceitosNutricionais.js`; Tabela de Referência Nutricional (inclui os 3 produtos Herbalife confirmados).

Campos por dia: `tema`, `pilar`, `icone`, `titulo`, `conteudo`, `dicaPratica`, `fraseMotivacional`,
`objetivoComportamental`, `produto`. Mesma estrutura de `dicas.js` (Bloco 1).

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 30,\|dia: 61,\|dia: 60,\|dia: 31,\|^]" src/data/dicas90.js`
Expected: `dia: 31,` próximo da linha 13, `dia: 60,` próximo da linha 363, `dia: 61,` próximo da
linha 375. Se os números mudaram, ajuste o recorte de leitura/edição para os dias 31–60.

- [ ] **Step 2: Ler `conceitosNutricionais.js` (referência de terminologia) e as linhas 13–374 de `dicas90.js`**

- [ ] **Step 3: Aplicar o checklist completo (A, B, C) a cada um dos 30 dias (31–60)**

- [ ] **Step 4: Editar diretamente com Edit, dia por dia**

- [ ] **Step 5: Registrar cada mudança em `## Mudanças` e cada dúvida em `## Itens Sinalizados`**

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/data/dicas90.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco2): revisa dicas90.js dias 31-60 (fatos + voz)"
```

---

### Task 3: Revisar `informativos.js` (dias 31–60)

**Files:**
- Modify: `src/data/informativos.js:743-1073`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional (arquivo com maior densidade de números).
- Produces: novos alimentos conferidos aqui devem ser adicionados à tabela para reuso no Bloco 3.

Estrutura idêntica ao Bloco 1: `emoji`, `titulo`, `opcoes` (array com `nome`, `tom`, `itens`,
`total`, `extras`), `dica`, `cta`.

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 30,\|dia: 31,\|dia: 60,\|dia: 61,\|^]" src/data/informativos.js`
Expected: `dia: 31,` próximo da linha 743, `dia: 60,` próximo da linha 1063, `dia: 61,` próximo
da linha 1074. Ajuste se os números mudaram.

- [ ] **Step 2: Ler as linhas 743–1073**

- [ ] **Step 3: Aplicar checklist A com foco nos números**

Para cada `opcoes[].itens`: conferir valores contra a Tabela de Referência, somar `itens` e
comparar com `total`, verificar coerência do `tom` (nunca rotular como "ruim" uma escolha que
não é de fato inferior). Adicionar alimentos novos à tabela do relatório.

- [ ] **Step 4: Aplicar checklist B e C ao campo `dica`**

- [ ] **Step 5: Editar diretamente com Edit, recalculando `total` sempre que corrigir um item**

- [ ] **Step 6: Registrar cada mudança em `## Mudanças` e cada dúvida em `## Itens Sinalizados`**

- [ ] **Step 7: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/data/informativos.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco2): revisa informativos.js dias 31-60 (fatos + voz)"
```

---

### Task 4: Revisar `lanches22a37.js` (dias 31–37, restante do arquivo)

**Files:**
- Modify: `src/data/lanches22a37.js:111-187`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional, incluindo os 3 produtos Herbalife confirmados.

Campos por dia: `icone`, `titulo`, `proteina`, `descricao`, `ingredientes`, `preparo`, `produto`.
Dias 22–30 deste arquivo já foram revisados no Bloco 1 — não tocar.

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 30,\|dia: 31,\|dia: 37,\|^]" src/data/lanches22a37.js`
Expected: `dia: 31,` logo após o dia 30 (já revisado), `dia: 37,` seguido de `]` fechando o
array. Ajuste se os números mudaram.

- [ ] **Step 2: Ler as linhas 111–187 (dias 31–37)**

- [ ] **Step 3: Aplicar checklist A, B, C — usar os valores Herbalife confirmados para whey/shake/barra**

Some a proteína dos `ingredientes` usando a Tabela de Referência (incluindo os 3 produtos
Herbalife). Tolerância ±3g. Corrija se fora da margem.

- [ ] **Step 4: Editar diretamente com Edit**

- [ ] **Step 5: Registrar cada mudança em `## Mudanças` e cada dúvida em `## Itens Sinalizados`**

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/data/lanches22a37.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco2): revisa lanches22a37.js dias 31-37 (fatos + voz)"
```

---

### Task 5: Revisar `lanches38a89.js` (dias 38–60)

**Files:**
- Modify: `src/data/lanches38a89.js:12-242`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional, incluindo os 3 produtos Herbalife confirmados.

Mesma estrutura de campos das Tasks 4. Dias 61–89 deste arquivo pertencem ao Bloco 3 — não tocar.

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 38,\|dia: 60,\|dia: 61,\|^]" src/data/lanches38a89.js`
Expected: `dia: 38,` próximo da linha 12, `dia: 60,` próximo da linha 233, `dia: 61,` próximo da
linha 243. Ajuste se os números mudaram.

- [ ] **Step 2: Ler as linhas 12–242 (dias 38–60)**

- [ ] **Step 3: Aplicar checklist A, B, C — usar os valores Herbalife confirmados para whey/shake/barra**

- [ ] **Step 4: Editar diretamente com Edit**

- [ ] **Step 5: Registrar cada mudança em `## Mudanças` e cada dúvida em `## Itens Sinalizados`**

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/data/lanches38a89.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco2): revisa lanches38a89.js dias 38-60 (fatos + voz)"
```

---

### Task 6: Revisar `versiculos.js` (dias 31–60, apenas `reflexao`)

**Files:**
- Modify: `src/data/versiculos.js:223-434`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Nenhuma dependência de tabela nutricional — voz + conferência bíblica.

Campos por dia: `dia`, `texto` (NVI — nunca alterar sozinho), `referencia` (nunca alterar
sozinho), `tema`, `reflexao` (único campo livremente editável).

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 30,\|dia: 31,\|dia: 60,\|dia: 61,\|^]" src/data/versiculos.js`
Expected: `dia: 31,` próximo da linha 223, `dia: 60,` próximo da linha 428, `dia: 61,` próximo
da linha 435. Ajuste se os números mudaram.

- [ ] **Step 2: Ler as linhas 223–434**

- [ ] **Step 3: Para cada dia, confirmar que `referencia` corresponde ao `texto` citado**

Se não bater: **não corrija sozinho o campo**. Em vez disso, use WebSearch para encontrar um
versículo real (NVI) que combine com o `tema` do dia, e registre a sugestão (referência +
texto propostos) em `## Itens Sinalizados` para a Wanessa decidir — a menos que ela já tenha
sinalizado explicitamente que quer correção direta (como fez no Bloco 1); se não houver essa
autorização explícita para este bloco, apenas sinalize.

- [ ] **Step 4: Aplicar checklist B (voz) ao campo `reflexao`, corrigindo erros de digitação/gramática direto**

- [ ] **Step 5: Editar apenas `reflexao` (+ typos) com Edit**

- [ ] **Step 6: Registrar cada mudança em `## Mudanças` e cada referência duvidosa em `## Itens Sinalizados`**

- [ ] **Step 7: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/data/versiculos.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco2): revisa reflexoes de versiculos.js dias 31-60 (voz)"
```

---

### Task 7: Finalizar relatório do Bloco 2 e preparar checkpoint com a Wanessa

**Files:**
- Modify: `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

- [ ] **Step 1: Recalcular o Resumo Executivo com os novos totais**

Contar as linhas de `## Mudanças` e `## Itens Sinalizados` (descontando cabeçalho e
separador) e atualizar as contagens por categoria. Usar o mesmo método de conferência do
Bloco 1: `awk` para isolar a seção e `grep -c "^|"` / `grep -oE` para contar categorias —
não confiar em contagem manual.

- [ ] **Step 2: Build final**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Conferir o diff completo do bloco**

Run: `git diff --stat 5d49aa4 HEAD -- src/data/`

(`5d49aa4` é o último commit antes do início deste bloco — âncora fixa.)

Expected: lista apenas `dicas90.js`, `informativos.js`, `lanches22a37.js`, `lanches38a89.js`,
`versiculos.js`.

- [ ] **Step 4: Commit final**

```bash
git add docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "docs: finaliza relatorio do bloco 2 (dias 31-60) com resumo executivo atualizado"
```

- [ ] **Step 5: Apresentar o checkpoint para a Wanessa**

Resumir: (a) quantas mudanças por categoria neste bloco, (b) exemplos concretos, (c) itens
sinalizados novos que precisam de decisão dela (especialmente sugestões de versículo, se
houver), (d) perguntar se aprova para eu escalar ao Bloco 3 (dias 61–90).

---

## Self-Review

- **Cobertura:** todos os arquivos do Bloco 2 mapeados (Task 2–6), relatório contínuo do
  Bloco 1 (Task 1), checkpoint final (Task 7). Régua de voz/fatos idêntica ao Bloco 1, com a
  calibração já aprovada pela Wanessa (produtos Herbalife, ausência de 1ª pessoa aceita)
  aplicada desde o início — não repete perguntas já respondidas.
- **Placeholders:** nenhum. Comandos de grep e build são exatos; os únicos números
  "a preencher" (Task 7) vêm de contagem automatizada, não de estimativa.
- **Consistência:** mesmo arquivo de relatório, mesma tabela de referência, mesmas 4
  categorias (`fato`/`voz`/`segurança`/`consistência`) do Bloco 1.
