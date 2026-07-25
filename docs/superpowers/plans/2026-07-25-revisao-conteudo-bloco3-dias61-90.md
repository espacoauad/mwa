# Revisão de Conteúdo — Bloco 3 (Dias 61–90) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revisar e corrigir, diretamente no código, todo o conteúdo textual dos dias 61–90 do MWA (dicas, informativos, lanches e reflexões dos versículos) quanto a correção factual/nutricional e aderência à voz da marca — o último bloco da revisão. Além disso, executar a limpeza de resíduos do modelo antigo (21+90=111 dias) já agendada para este bloco desde a spec original.

**Architecture:** Mesma abordagem dos Blocos 1 e 2: cada task cobre um arquivo (ou recorte de dias), aplica a mesma régua de voz e checklist factual já validados, edita diretamente com Edit, e registra no **mesmo arquivo de relatório contínuo** (`docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`), que passa a cobrir dias 1–90 (título e escopo atualizados na Task 1). `npm run build` verifica que nada quebrou.

**Tech Stack:** Igual aos blocos anteriores — JavaScript (ESM, arrays de objetos), build via Vite.

**Este é o último bloco de conteúdo.** Depois da Task de finalização, a revisão completa dos 90
dias estará encerrada.

## Global Constraints

Idênticas aos Blocos 1 e 2 — copiadas verbatim da spec e já validadas na prática:

- **Estrutura oficial do programa:** 30 dias (jornada base) + 90 dias (continuação, dias 31–90 =
  60 dias novos). Total real: 90 dias corridos. Nunca mencionar "21 dias" nem "111 dias" como
  nome do programa.
- **Voz:** premium mas acessível · elegante mas humana · técnica mas simples · feminina mas não
  frágil · inspiradora sem exageros · direta mas acolhedora. 1ª pessoa da Wanessa ("eu", "comigo")
  falando com "você". Nunca: promessa milagrosa, terrorismo alimentar, linguagem agressiva de
  emagrecimento, urgência apelativa, excesso de emoji, clichê de infoproduto genérico.
- **Toque pessoal preservado:** não apagar personalidade existente.
- **Claims de saúde (CRN-1/27939):** moderar afirmações absolutas para linguagem defensável
  ("ajuda a", "contribui para", "favorece"). Termos técnicos (ex.: "densidade nutricional") usados
  apenas com o sentido correto definido em `conceitosNutricionais.js` — nunca aplicados a um
  nutriente isolado comparado a si mesmo (ver Bloco 2 para exemplos já corrigidos).
- **Guardrails — NÃO alterar:** campos de estrutura de dados (`dia`, `pilar`/`icone`/`emoji`,
  `cta.tipo`, `produto`, `texto`/`referencia` dos versículos), preços, janelas de oferta, termos
  de marca. Sinalizar no relatório em vez de editar quando algo parecer errado fora do escopo de
  texto/fatos.
- **Incerteza:** o que não puder ser confirmado com segurança é sinalizado no relatório, nunca
  "corrigido no chute".
- **Explicações fisiológicas contestadas** (ex.: mecanismos populares mas cientificamente
  discutíveis, do tipo já suavizado nos Blocos 1-2): sinalizar a proposta de suavização em vez de
  aplicar direto — a Wanessa pediu para ver o texto exato antes de qualquer suavização desse tipo
  (mesma regra que já vale desde o Bloco 2).

### Régua já calibrada pela Wanessa (aplicar desde já, sem repetir perguntas já respondidas)

- **Produtos proprietários — composição confirmada, usar como referência:**
  - **Whey 3W (Herbalife):** 1 dose/scoop (~34g pó) = **137 kcal · 26g proteína**.
  - **Barra de Proteína Citrus Lemon (Herbalife):** 1 unidade (~35g) = **140 kcal · 10g proteína**.
  - **Shake Fórmula 1 Herbalife, sabor baunilha, pó seco:** 2 colheres (~26g) = **221 kcal · 18g
    proteína**.
  - **Leite semidesnatado:** 250ml ≈ **120 kcal · 8g proteína** (proporcional).
  - Quando o produto/quantidade for genérico (ex.: "queijo branco", "queijo ralado", "iogurte" sem
    tipo, "1 lata de atum" sem tamanho), **padronizar para o tipo/porção mais comum no Brasil** e
    recalcular a proteína — não sinalizar mais essas ambiguidades como pendência (decisão já
    tomada no checkpoint pós-Bloco-2). Referências já usadas: queijo branco/fresco = minas frescal
    (~17g/100g); queijo ralado = parmesão (~35g/100g); lata de atum = padrão ~170g total/~120g
    escorrido (~26g/100g escorrido); iogurte sem tipo = grego (~10g/100g); colher de requeijão =
    ~17g de peso.
- **Ausência de 1ª pessoa da Wanessa** em textos de apoio (descrições de lanche, glossário,
  reflexões de versículo) é um padrão aceito pela Wanessa — não sinalizar de novo, não reescrever
  tom em massa.
- **Referências bíblicas divergentes:** nunca corrigir sozinho o texto/referência. Se o `texto`
  não bater com a `referencia`, use WebSearch para propor um versículo real e verificado (NVI) que
  combine com o `tema` do dia, e registre a proposta em `## Itens Sinalizados` — a Wanessa decide
  se aplica no checkpoint deste bloco (mesmo processo do Bloco 2).
- **Claims científicos contestados mas populares** (fadiga de decisão, sede/fome, densidade
  nutricional mal aplicada, etc.): se encontrar um novo caso do mesmo padrão já resolvido nos
  Blocos 1-2, proponha a suavização em `## Itens Sinalizados` com o texto exato antes/depois — não
  aplique direto (a Wanessa quer ver o texto antes, como already estabelecido).

## Checklist de revisão (idêntico aos blocos anteriores — aplicar em toda task de conteúdo)

**A. Fatos/nutrição:**
1. Números de calorias e proteína plausíveis? Conferir contra a Tabela de Referência Nutricional
   do relatório (já tem ~40 alimentos + os 3 produtos Herbalife confirmados + os tipos-padrão de
   queijo/atum/iogurte já estabelecidos).
2. Mesmo alimento com mesmo valor entre arquivos? Padronizar divergências.
3. Afirmações de fisiologia/neurociência corretas e não infladas?
4. Claims de saúde defensáveis para uma nutricionista registrada?
5. Estimativas mantêm "~"?

**B. Voz:**
6. 1ª pessoa da Wanessa, tom acolhedor e direto (não genérico/"cara de IA")?
7. Nenhum gatilho da lista "nunca"?
8. Toque pessoal preservado?
9. Campos do mesmo dia não se contradizem?

**C. Consistência interna:**
10. Terminologia consistente com `conceitosNutricionais.js`.
11. Nenhuma menção a "21 dias"/"111 dias" como nome de programa.
12. **Atenção especial no dia 90** (o último dia do programa inteiro — fim da jornada de 90 dias):
    tom deve estar à altura do encerramento completo, sem claims exagerados, coerente com o que já
    foi feito no dia 30 (Bloco 1/2).

Cada edição = uma linha em `## Mudanças` do relatório (`Categoria` = exatamente `fato`, `voz`,
`segurança` ou `consistência`). Cada dúvida = uma linha em `## Itens Sinalizados` (ler a tabela
primeiro — já tem poucas linhas remanescentes dos blocos anteriores, não duplicar).

---

## File Structure

- **Modify:** `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md` — relatório
  contínuo, agora cobrindo dias 1–90 (escopo final).
- **Modify:** `src/data/dicas90.js` (linhas 375–736 — dias 61–90, restante do arquivo)
- **Modify:** `src/data/informativos.js` (linhas 1074–1412 — dias 61–90, restante do arquivo;
  também corrigir o resíduo "21 dicas" do dia 15, já sinalizado nos blocos anteriores)
- **Modify:** `src/data/lanches38a89.js` (linhas 243–532 — dias 61–89, restante do arquivo)
- **Modify:** `src/data/versiculos.js` (linhas 435–648 — dias 61–90, campo `reflexao`; linhas
  649–795, dias 91–111 — resíduo órfão do modelo antigo, ver Task 6)
- **Modify/Archive:** `BLOQUEIO_ACESSO_DIA_111.md`, `CONCLUSAO_111_DIAS.md` (raiz do projeto) —
  marcar como obsoletos (ver Task 6)

---

### Task 1: Estender escopo do relatório pro Bloco 3

**Files:**
- Modify: `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

- [ ] **Step 1: Atualizar o cabeçalho do relatório**

Trocar o título de `# Blocos 1–2 (Dias 1–60) — Relatório de Revisão de Conteúdo` para
`# Blocos 1–3 (Dias 1–90) — Relatório de Revisão de Conteúdo COMPLETO`, e atualizar a lista de
"Arquivos revisados" para incluir a linha do Bloco 3: `dicas90.js (dias 61–90), informativos.js
(dias 61–90), lanches38a89.js (dias 61–89), versiculos.js (dias 61–90, campo reflexao)`.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "docs: estende escopo do relatorio para cobrir o bloco 3 (dias 61-90)"
```

---

### Task 2: Revisar `dicas90.js` (dias 61–90)

**Files:**
- Modify: `src/data/dicas90.js:375-736`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: terminologia canônica de `conceitosNutricionais.js`; Tabela de Referência Nutricional.

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 60,\|dia: 61,\|dia: 90,\|^]" src/data/dicas90.js`
Expected: `dia: 61,` próximo da linha 375, `dia: 90,` próximo da linha 725, `]` na linha 736.
Ajuste se os números mudaram.

- [ ] **Step 2: Ler `conceitosNutricionais.js` e as linhas 375–736 de `dicas90.js`**

- [ ] **Step 3: Aplicar o checklist completo (A, B, C, incluindo o item 12 sobre o dia 90) aos 30 dias**

O dia 90 é o encerramento de TODO o programa — dê atenção redobrada ao tom, coerente com o
encerramento do dia 30 já revisado nos blocos anteriores.

- [ ] **Step 4: Editar diretamente com Edit, dia por dia. Logar cada `## Mudanças` imediatamente após cada edição — não reconstruir a lista no final.**

- [ ] **Step 5: Antes de escrever o relatório final, rodar auto-auditoria**

Run: `git log --oneline -1` (antes de começar, para anotar o commit-base)
Depois de editar: `git diff --stat <commit-base> -- src/data/dicas90.js`
Confirme que cada dia alterado tem uma linha correspondente em `## Mudanças` — os números devem
bater exatamente.

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/data/dicas90.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco3): revisa dicas90.js dias 61-90 (fatos + voz)"
```

---

### Task 3: Revisar `informativos.js` (dias 61–90) — incluindo o resíduo "21 dicas" do dia 15

**Files:**
- Modify: `src/data/informativos.js:1074-1412`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional.
- Produces: novos alimentos conferidos aqui devem ser adicionados à tabela.

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 60,\|dia: 61,\|dia: 90,\|^]" src/data/informativos.js`
Expected: `dia: 61,` próximo da linha 1074, `dia: 90,` próximo da linha 1393, `]` na linha 1412.

- [ ] **Step 2: Corrigir o resíduo "21 dicas" do dia 15 (já sinalizado e aprovado nos blocos anteriores)**

Localize o dia 15 (fora do recorte 61-90, mas esta é a task designada para fechar essa pendência).
O texto atual (`opcoes[0].itens`, "Método Sozinho") diz algo como "Informação: Completa (21 dicas
+ app)". Corrija para "30 dicas" (o programa de 30 dias tem 30 dicas diárias em `dicas.js`).
Registre esta edição em `## Mudanças` (Dia 15, categoria `consistência`) e remova a linha
correspondente de `## Itens Sinalizados`.

- [ ] **Step 3: Ler as linhas 1074–1412**

- [ ] **Step 4: Aplicar checklist A com foco nos números (somar `itens` vs `total` quando existir)**

Nota do Bloco 2: dias 31+ deste arquivo podem não ter campo `total` (cards qualitativos) — não
assuma a mesma estrutura do Bloco 1 sem confirmar primeiro (`grep -n "total:" src/data/informativos.js`
e veja se aparece no recorte 61-90).

- [ ] **Step 5: Aplicar checklist B e C ao campo `dica`**

- [ ] **Step 6: Editar diretamente com Edit, logando cada `## Mudanças` imediatamente**

- [ ] **Step 7: Auto-auditoria do diff antes do relatório final** (mesmo processo da Task 2)

- [ ] **Step 8: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 9: Commit**

```bash
git add src/data/informativos.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco3): revisa informativos.js dias 61-90 e corrige residuo 21 dicas (dia 15)"
```

---

### Task 4: Revisar `lanches38a89.js` (dias 61–89, restante do arquivo)

**Files:**
- Modify: `src/data/lanches38a89.js:243-532`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Consumes: Tabela de Referência Nutricional, incluindo os 3 produtos Herbalife confirmados e os
  tipos-padrão de queijo/atum/iogurte já estabelecidos nos Blocos 1-2.

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 60,\|dia: 61,\|dia: 89,\|^]" src/data/lanches38a89.js`
Expected: `dia: 61,` próximo da linha 243, `dia: 89,` próximo da linha 523, `]` na linha 532.

- [ ] **Step 2: Ler as linhas 243–532 (dias 61–89 — 29 dias, o último dia deste arquivo é 89, não 90)**

- [ ] **Step 3: Aplicar checklist A, B, C — usar os tipos-padrão já estabelecidos para ingredientes genéricos**

Se encontrar "queijo branco/ralado/fresco" sem tipo, "iogurte" sem tipo, ou "1 lata de atum" sem
tamanho, **já padronize direto** para os valores estabelecidos no checkpoint pós-Bloco-2 (ver
Global Constraints) — não sinalize mais essas ambiguidades como pendência.

- [ ] **Step 4: Editar diretamente com Edit, logando cada `## Mudanças` imediatamente**

- [ ] **Step 5: Auto-auditoria do diff antes do relatório final**

- [ ] **Step 6: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/data/lanches38a89.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco3): revisa lanches38a89.js dias 61-89 (fatos + voz)"
```

---

### Task 5: Revisar `versiculos.js` (dias 61–90, apenas `reflexao`)

**Files:**
- Modify: `src/data/versiculos.js:435-648`
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Nenhuma dependência de tabela nutricional — voz + conferência bíblica.

Campos por dia: `dia`, `texto` (NVI — nunca alterar sozinho), `referencia` (nunca alterar
sozinho), `tema`, `reflexao` (único campo livremente editável).

- [ ] **Step 1: Confirmar o limite do recorte**

Run: `grep -n "dia: 60,\|dia: 61,\|dia: 90,\|dia: 91," src/data/versiculos.js`
Expected: `dia: 61,` próximo da linha 435, `dia: 90,` próximo da linha 640, `dia: 91,` próximo da
linha 649 (início do resíduo órfão — dias 91-111 são tratados na Task 6, não aqui).

- [ ] **Step 2: Ler as linhas 435–648 (dias 61–90)**

- [ ] **Step 3: Para cada dia, confirmar que `referencia` corresponde ao `texto` citado**

Se não bater: use WebSearch para propor um versículo real (NVI) que combine com o `tema`, e
registre a proposta em `## Itens Sinalizados` — não edite `texto`/`referencia` diretamente
(mesma regra do Bloco 2 — a Wanessa decide no checkpoint).

- [ ] **Step 4: Atenção especial ao dia 90 (fim de todo o programa)**

Confira se a `reflexao` do dia 90 está à altura do encerramento completo (90 dias), coerente com
o dia 30 (fim da jornada base, já revisado). Se o texto for genérico (igual a qualquer outro dia),
registre como item sinalizado sugerindo um reconhecimento do marco — não reescreva sem aprovação,
seguindo a mesma cautela usada para o dia 30 no Bloco 1/2 (naquele caso a reescrita só ocorreu após
aprovação explícita).

- [ ] **Step 5: Aplicar checklist B (voz) ao campo `reflexao`, corrigindo erros de digitação/gramática direto**

- [ ] **Step 6: Editar apenas `reflexao` (+ typos) com Edit, logando cada `## Mudanças` imediatamente**

- [ ] **Step 7: Auto-auditoria do diff — confirmar ZERO mudanças em `texto`/`referencia`**

- [ ] **Step 8: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 9: Commit**

```bash
git add src/data/versiculos.js docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "content(bloco3): revisa reflexoes de versiculos.js dias 61-90 (voz)"
```

---

### Task 6: Limpar resíduos do modelo antigo (21+90=111 dias)

**Files:**
- Modify: `src/data/versiculos.js:649-795` (dias 91-111, remoção)
- Modify: `BLOQUEIO_ACESSO_DIA_111.md`, `CONCLUSAO_111_DIAS.md` (marcar obsoletos)
- Modify (log): `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

**Interfaces:**
- Nenhuma dependência de outras tasks.

Este é o achado estrutural documentado na spec original (`docs/superpowers/specs/2026-07-23-revisao-conteudo-90-dias-design.md`,
seção sobre limpeza de resíduos) e confirmado durante o checkpoint do Bloco 1: o app não passa do
dia 90 (`totalDiasPrograma` em `src/utils/calculos.js` só retorna 30 ou 90). Os versículos dos dias
91-111 nunca são exibidos a nenhuma usuária.

- [ ] **Step 1: Confirmar que os versículos 91-111 são de fato inacessíveis**

Run: `grep -n "diaDoPrograma\|totalDiasPrograma" src/utils/calculos.js`
Confirme que a lógica trava em 90 (não deve haver caminho que produza `diaAtual > 90`).

- [ ] **Step 2: Remover as entradas dos dias 91-111 de `versiculos.js`**

Use Edit para remover o bloco inteiro de objetos entre `dia: 91,` (linha ~649) e o fechamento do
array (`]`, linha ~795) — mantendo apenas o `]` de fechamento do array `versiculos`. Confira que
o comentário de cabeçalho do arquivo (linha 2-4, menciona "111 Versículos Bíblicos") também seja
atualizado para refletir os 90 versículos remanescentes.

- [ ] **Step 3: Marcar os dois documentos obsoletos**

Adicione uma linha no topo de `BLOQUEIO_ACESSO_DIA_111.md` e `CONCLUSAO_111_DIAS.md` (raiz do
projeto):

```markdown
> ⚠️ **OBSOLETO** — Este documento descreve o modelo antigo do programa (21 dias base + 90 dias
> de continuação = 111 dias total). O modelo atual é 30 dias base + 90 dias corridos no total
> (ver `docs/superpowers/specs/2026-07-23-revisao-conteudo-90-dias-design.md`). Mantido apenas
> para referência histórica.
```

- [ ] **Step 4: Registrar a limpeza no relatório**

Adicionar uma linha em `## Mudanças` (Dia "91-111", arquivo `versiculos.js`, categoria
`consistência`, justificativa: remoção de conteúdo órfão do modelo antigo, nunca exibido a
usuárias reais).

- [ ] **Step 5: Verificar build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/data/versiculos.js BLOQUEIO_ACESSO_DIA_111.md CONCLUSAO_111_DIAS.md docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "chore(bloco3): remove versiculos orfaos (dias 91-111) e marca docs obsoletos do modelo antigo"
```

---

### Task 7: Finalizar relatório do Bloco 3 (e da revisão completa) e preparar checkpoint final

**Files:**
- Modify: `docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md`

- [ ] **Step 1: Recalcular o Resumo Executivo com os novos totais**

Usar o mesmo método de conferência dos blocos anteriores:

```bash
awk '/^## Mudanças/{f=1;next}/^## Itens Sinalizados/{f=0}f' docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md | grep -c "^|"
awk '/^## Itens Sinalizados/{f=1;next}f' docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md | grep -c "^|"
awk '/^## Mudanças/{f=1;next}/^## Itens Sinalizados/{f=0}f' docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md | grep -oE "\| fato \||\| voz \||\| segurança \||\| consistência \|" | sort | uniq -c
```

Subtrair 2 de cada contagem de linhas (cabeçalho + separador da tabela markdown) para o total real.

- [ ] **Step 2: Build final**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 3: Conferir o diff completo do bloco**

Run: `git diff --stat 078c34a HEAD -- src/data/`

(`078c34a` é o último commit antes do início deste bloco — âncora fixa.)

Expected: lista apenas `dicas90.js`, `informativos.js`, `lanches38a89.js`, `versiculos.js`.

- [ ] **Step 4: Commit final**

```bash
git add docs/superpowers/reports/2026-07-23-bloco1-dias1-30-relatorio.md
git commit -m "docs: finaliza relatorio do bloco 3 (dias 61-90) - revisao completa dos 90 dias encerrada"
```

- [ ] **Step 5: Apresentar o checkpoint final para a Wanessa**

Resumir: (a) quantas mudanças por categoria neste bloco e no total acumulado (Blocos 1-3), (b)
exemplos concretos, (c) itens sinalizados novos que precisam de decisão dela (especialmente
sugestões de versículo e o item do dia 90, se houver), (d) confirmar que a limpeza de resíduos
(Task 6) foi concluída, (e) perguntar se ela quer revisar mais alguma coisa ou considerar a
revisão de conteúdo dos 90 dias encerrada.

---

## Self-Review

- **Cobertura:** todos os arquivos do Bloco 3 mapeados (Tasks 2-5), limpeza de resíduos
  formalizada (Task 6, cumprindo o compromisso da spec original), relatório contínuo (Task 1),
  checkpoint final (Task 7). Régua de voz/fatos idêntica aos blocos anteriores, com todas as
  calibrações já aprovadas pela Wanessa (produtos Herbalife, tipos-padrão de ingrediente,
  ausência de 1ª pessoa, processo de suavização de claims científicos com aprovação prévia)
  aplicadas desde o início — não repete perguntas já respondidas.
- **Placeholders:** nenhum. Comandos de grep e build são exatos; os números "a preencher" (Task 7)
  vêm de contagem automatizada.
- **Consistência:** mesmo arquivo de relatório, mesma tabela de referência, mesmas 4 categorias
  do Bloco 1/2. Lição aprendida do Bloco 2 (auto-auditoria de diff obrigatória em cada task,
  contagens sempre via script, nunca manual) replicada em todas as tasks deste bloco.
