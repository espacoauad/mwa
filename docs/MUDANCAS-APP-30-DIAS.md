# Mapa de mudanças: app 21→30 dias

Documento de mapeamento (não é implementação). Investigado em 2026-07-16, branch
`security/correcoes-criticas`, via `grep -rn "21" src/ --include="*.jsx" --include="*.js"` e
inspeção manual de cada arquivo relevante.

> **Atualização 2026-07-21 — migração concluída.** Tudo mapeado abaixo foi implementado:
> `calculos.js`/`AppContext.jsx`/`Hoje.jsx` migrados para o corte em 30/31/90, tela de
> encerramento (`Conclusao30Dias.jsx`) + certificado compartilhável criados, `ofertas.js` e
> `InformativoDoDia.jsx` corrigidos, conteúdo dos dias 20-22/28/30 (em `dicas.js`/`dicas90.js`/
> `versiculos.js`/`informativos.js`) reescrito para não soar como encerramento fora do dia 30.
> O texto histórico abaixo permanece como registro de como o bug foi encontrado.
>
> **Pendência nova, descoberta durante a correção:** a estrutura interna de "Mês 1 / Mês 2 /
> Mês 3" dentro do conteúdo do Programa de 90 Dias (`src/data/dicas90.js`) foi escrita
> assumindo que a continuidade paga começava no dia 22 (ex.: "Mês 2 = dias 64–81", dia 184 do
> arquivo). Agora que a continuidade paga começa no dia 31, essa rotulação interna dos meses
> ficou desalinhada por 9 dias em relação ao dia real da aluna. Corrigir isso exige renumerar
> ~60 entradas de conteúdo (dias 31–90) — está fora do escopo desta sessão; precisa de uma
> rodada de conteúdo dedicada.

## Contexto e achado central

O produto de entrada mudou de "Jornada de 21 Dias" (R$ 97) para "MWA | Jornada de 30 Dias"
(R$ 97). A landing standalone (`landingpage/`) e a página `/vendas` do próprio app
(`src/components/vendas/LandingVendas.jsx`) **já falam "30 dias"** em toda a copy — isso já
foi migrado (ver seção "O que já está pronto" abaixo). **O runtime do app (`src/` fora de
`vendas/`) continua rodando a lógica de 21 dias** — jornada, dicas diárias, oferta de
upgrade, tela de conclusão e bloqueio de acesso. É esse runtime que este documento mapeia.

### Achado importante: o app já não usa mais "111 dias" — ele usa "90 dias" como ciclo total

Documentos antigos (`ATIVAR_90DIAS_CONSOLE.md`, `BLOQUEIO_ACESSO_DIA_111.md`, datado de
2026-07-13) descrevem um modelo **aditivo**: 21 dias + 90 dias = ciclo de 111 dias, com
bloqueio de acesso no dia 111. **Isso não é o que o código faz hoje.** O código atual
(`src/utils/calculos.js`, `src/App.jsx`) já foi alterado para um modelo de **contador
combinado que satura em 90**, não 111:

```js
// src/utils/calculos.js:112-119
const p90 = programa90Ativo(programas)
if (p90) {
  return Math.min(90, Math.max(22, 21 + diasDesde(p90.dataInicio)))
}
```

Ou seja: com o Programa de 90 Dias ativo, o contador de dias continua de 22 até um teto de
90 — isto é, a "continuação" na prática só tem 69 dias úteis de numeração (90 − 21), não
90 dias adicionais. `totalDiasPrograma()` retorna 90 (não 111). `src/App.jsx:40` bloqueia
acesso em `diaAtual === 90`, não 111. `src/components/admin/MododeRevisao.jsx:29-33`
replica a mesma fórmula (duplicação de lógica a observar).

Os conteúdos já seguem esse modelo de 90 (não 111): `informativos.js` tem 90 itens (dias
1–90), `dicas.js` tem 21 (dias 1–21) + `dicas90.js` tem 69 (dias 22–90) = 90 total.
`src/components/informativos/InformativoDoDia.jsx:54` mostra
`informativo.dia > 21 ? 90 : 21` como denominador — outra confirmação do teto em 90.

**Exceção que ainda carrega o modelo antigo de 111:** `src/data/versiculos.js` tem **111
versículos** (dias 1–111, comentário no topo: "111 Versículos Bíblicos"), mas
`src/components/ferramentas/VersiculoDoDia.jsx:13` busca
`versiculos.find(v => v.dia === diaAtual)` usando o `diaAtual` do contexto — que hoje
satura em 90. **Os versículos dos dias 91–111 são conteúdo morto/inacessível no app
atual.** Isso é uma inconsistência pré-existente entre arquivos de conteúdo, não algo
introduzido por esta tarefa, mas é relevante para o replanejamento de 30+90.

**Decisão em aberto (a levantar na sessão de migração):** ao mudar a entrada para 30 dias,
o ciclo combinado com o upgrade de 90 dias deve:
- (a) manter o padrão atual de "teto único de 90" → dias 1–30 (entrada) + dias 31–90 de
  continuação (60 dias de conteúdo novo/realocado, não 90); ou
- (b) voltar ao modelo aditivo original (30 + 90 = 120), exigindo 90 dias completos de
  conteúdo de continuação e teto de bloqueio em 120?

Essa decisão determina quantos itens novos são necessários em `dicas90.js`,
`informativos.js` e `versiculos.js`, e o valor exato do bloqueio de acesso. Não decidido
nesta tarefa — está fora de escopo.

---

## 1. Duração da jornada e contador de dias

**Arquivo:** `src/utils/calculos.js`
- `diasDesde()` (linhas 86-92): calcula dias corridos desde uma data ISO, sem menção a 21/30.
- `programa90Ativo()` (linhas 94-98): sem mudança necessária.
- `diaDoPrograma()` (linhas 100-119): contém os literais `21` (linha 118, `Math.min(21, ...)`)
  e `22`/`90` (linha 114, continuação). **Precisa mudar** `21`→`30` na branch sem 90d
  (linha 118) e recalcular os literais `22`/`90` da branch com 90d ativo (linha 114) conforme
  a decisão (a) ou (b) acima. Comentários das linhas 100-104 também citam "1–90"/"21"/"22" e
  precisam ser reescritos.
- `totalDiasPrograma()` (linhas 121-123): retorna `90 : 21` — trocar `21`→`30` e `90` pelo
  novo teto decidido.

**Arquivo:** `src/components/admin/MododeRevisao.jsx` (linhas 29-33) — duplica a mesma
fórmula de `diaDoPrograma` independentemente (não importa a função de `calculos.js`).
Contém os mesmos literais `90`, `22`, `21` e precisa da mesma mudança em paralelo, ou
melhor: refatorar para importar `diaDoPrograma` de `calculos.js` e eliminar a duplicação
(observação de qualidade, não obrigatória para o mapeamento, mas vale registrar).

---

## 2. Textos diários (dias 1–30) — jornada de entrada

**Arquivo:** `src/data/dicas.js`
- 21 itens hoje (`dia: 1` a `dia: 21`, confirmado via grep — 21 ocorrências de `dia:\s*\d+`).
- Comentário de topo (linhas 1-3) descreve os temas por faixa de dias: "1–3 introdução, 4–7
  hidratação, 8–10 proteínas, 11–13 fibras, 14–16 carboidratos, 17–19 gorduras, 20–21
  manutenção" — 21 dias cobertos por 7 temas.
- **Precisa de 9 dias novos de conteúdo** (dias 22–30) escritos no mesmo formato (`dia`,
  `tema`, `icone`, `titulo`, `conteudo`, `dicaPratica`, `produto`), OU redistribuir os temas
  existentes ao longo de 30 dias (ex.: esticar cada fase). Textos de dia 1 (linha 10) e dia
  21 citam explicitamente "21 dias" na copy (`'Bem-vindo(a) aos seus 21 dias!'`,
  `'jornada de 21 dias'`) — precisam virar "30 dias".

**Arquivo:** `src/data/dicas90.js`
- Comentário de topo (linhas 1-8): "Dias 1–21: ver dicas.js... Este arquivo cobre
  exclusivamente a continuidade... dias 22–90". Hoje tem **69 itens** (`dia: 22` a
  `dia: 90`).
- Conteúdo do dia 22 (linha 17) cita explicitamente "os primeiros 21 dias", "chegamos ao
  dia 22" e "os próximos 68 dias" — todo esse texto de transição precisa ser reescrito para
  "os primeiros 30 dias" / "chegamos ao dia 31" / recalcular "os próximos N dias" conforme
  a decisão (a)/(b) da seção anterior.
- Se a jornada de entrada passa a ter 30 dias, a numeração inteira deste arquivo desloca:
  o que hoje é `dia: 22` passa a ser `dia: 31` (ou o que for decidido), e todos os 69 `dia:`
  precisam ser renumerados (ou 60, se o teto continuar em 90).

**Arquivo:** `src/data/informativos.js`
- Comentário de topo (linha 1): "comparações nutricionais visuais (dias 1–21)" — **já
  desatualizado mesmo para o modelo atual**: o arquivo na verdade tem **90 itens** (`dia: 1`
  a `dia: 90`, confirmado via grep), não 21. O comentário nunca foi atualizado quando o
  arquivo cresceu de 21 para 90 itens.
- Vai precisar da mesma renumeração/expansão que `dicas.js` + `dicas90.js` para acomodar
  30 (+60 ou +90) dias.
- **Consumidor:** `src/components/informativos/InformativoDoDia.jsx:54` — literal
  `informativo.dia > 21 ? 90 : 21` precisa virar `informativo.dia > 30 ? <teto> : 30`.

**Arquivo:** `src/data/versiculos.js`
- 111 itens (dias 1–111), comentário de topo diz "111 Versículos Bíblicos", linha 9 marca
  "DIAS 1-21: FUNDAÇÃO". Consumido por `src/components/ferramentas/VersiculoDoDia.jsx:13`
  via `diaAtual` (que hoje satura em 90 — ver achado central). Precisa de: (1) decidir se
  o teto final é 90, 111 ou 120 (mesma decisão em aberto), e (2) renumerar/completar os
  dias 1–30 (hoje 1–21) mantendo ou reaproveitando o conteúdo de fundação existente.

**Arquivo:** `src/components/dicas/Dicas.jsx`
- Linha 83 (`AppContext` consumido em `Hoje.jsx`, ver abaixo) e linha 29:
  `const dica = diaAberto <= 21 ? dicaDoDia(diaAberto) : dicaDoDia90(diaAberto)` — literal
  `21` precisa virar `30`.
- Linha 31: lógica de lanches por faixa —
  `diaAberto <= 21 ? lancheDoDia(diaAberto) : diaAberto >= 22 && diaAberto <= 37 ? lancheDoDia22a37(diaAberto) : diaAberto >= 38 && diaAberto <= 89 ? lancheDoDia38a89(diaAberto) : null`.
  Todos os literais (`21`, `22`, `37`, `38`, `89`) precisam recalcular. **Nota:** hoje o
  dia 90 já cai no `null` final (nenhum lanche exibido no último dia) — gap pré-existente,
  não introduzido por esta mudança, mas que deve ser revisto ao redesenhar as faixas.
- Linhas 150/153 (texto visível): "Lanches proteicos disponíveis nos dias 1 a 21" /
  "Volte a qualquer dia de 1 a 21" — copy a atualizar para "1 a 30".

**Arquivos de dados de lanches por faixa (mesmo padrão de renumeração):**
- `src/data/lanchesProteicos.js` — dias 1–21 (base), comentário linha 3: "mesma base
  científica usada nos informativos e dicas dos 21 dias".
- `src/data/lanches22a37.js` — dias 22–37 (16 itens), comentário linha 1: "dias 22–37 do
  programa de 90 dias... Continuação após os 21 primeiros dias".
- `src/data/lanches38a89.js` — dias 38–89 (52 itens). Confirma o gap do dia 90 citado acima
  (52 + 16 + 21 = 89, falta o dia 90).
- Todos os três precisam de renumeração de `dia:` e ajuste de comentários de topo quando a
  entrada virar 30 dias.

**Arquivo:** `src/components/hoje/Hoje.jsx`
- Linha 5: importa `dicaDoDia90` de `dicas90.js`.
- Linha 83: `const dica = diaAtual <= 21 ? dicaDoDia(diaAtual) : dicaDoDia90(diaAtual)` —
  mesmo literal `21` a trocar por `30`.

---

## 3. Janela da oferta de 90 dias (hoje dia 3–7, na prática dia 6–10)

**Arquivo:** `src/utils/ofertas.js`
- Comentário linhas 16-18 e 31-34 descreve o cronograma **oficial**: "a oferta especial do
  Programa de 90 Dias abre no Dia 6, fica ativa por R$ 97 até o Dia 10... A partir do Dia 11
  (inclusive depois de concluída a Jornada de 21 Dias)... valor cheio de R$ 147" —
  **note que isso já não bate com o "dia 3–7" mencionado no brief da task**; o código e
  o comentário dizem dia 6–10, não 3–7. Isso é uma divergência a esclarecer com quem definiu
  o brief antes de implementar — o mapeamento aqui segue o que o código faz hoje.
- `faseUpgrade(dia)` (linhas 35-42): literais `6`, `10`, `21`, `11`. A condição
  `if (dia >= 21) return { id: 'final' }` (linha 39) marca a fase "final" (jornada
  concluída, upgrade por valor cheio) — esse `21` precisa virar `30`. As janelas de oferta
  (`6`–`10`, `11`) podem ou não precisar mudar dependendo de decisão de negócio (a oferta
  pode continuar nos mesmos dias absolutos, ou ser recalculada proporcionalmente para uma
  jornada 30/21 mais longa — decisão de negócio, não técnica).
- `linkCompraUpgrade()` (linhas 48-63) e `linkSessao()` (linhas 65-69): todas as mensagens
  de WhatsApp geradas citam `'MWA | Jornada de 21 Dias'` como texto fixo (linhas 52, 57, 61,
  67) — precisam virar `'MWA | Jornada de 30 Dias'`.
- `PRODUTOS.programa.nome` (linha 15): `'MWA | Jornada de 21 Dias'` — **já deveria ter
  virado `'MWA | Jornada de 30 Dias'` junto com a landing**, mas ainda não mudou aqui. Este
  é provavelmente o primeiro literal a corrigir, pois `ofertas.js` é importado por vários
  componentes (`CardUpgrade.jsx`, `Conclusao21Dias.jsx`, `BotaoWhatsApp.jsx`) que herdam o
  nome do produto dessa constante.

**Consumidores de `ofertas.js` com literais próprios (fora da constante):**
- `src/components/upgrade/CardUpgrade.jsx` linhas 69, 74, 84: comentário "fase final — dia
  21+", texto visível `'Você completou sua Jornada de 21 Dias!'`, e mensagem de fallback
  WhatsApp citando "Jornada de 21 Dias".
- `src/components/layout/BotaoWhatsApp.jsx` linhas 9-10: mensagem fixa "21-Day Journey" /
  "Jornada de 21 Dias" (independente de `ofertas.js`).

---

## 4. Tela de conclusão (hoje dia 21)

**Arquivo:** `src/components/game/Conclusao21Dias.jsx`
- Nome do arquivo/componente inclui "21" — decisão de manter o nome do arquivo (custo de
  rename baixo, mas quebra o histórico de git-blame) ou renomear para
  `Conclusao30Dias.jsx`. Recomendo renomear quando a mudança for implementada, para não
  deixar o nome do arquivo divergente do conteúdo.
- Textos visíveis com "21 dias"/"21 DIAS": linha 76 ("Os primeiros 21 dias são sempre os
  mais difíceis..."), linha 121 ("Não é sobre ser perfeito nos 21 dias..."), linha 175
  (`'21 DIAS'` em destaque tipográfico), linha 264 ("Esses 21 dias foram uma confissão...").
  Todos precisam virar "30 dias" / "30 DIAS".
- `continuarPor90Dias()` (linha 134) chama `abrirCheckout('programa90d')` — sem mudança de
  lógica, só de contexto textual ao redor.

**Arquivo:** `src/context/AppContext.jsx`
- Linhas 128-129: estado `conclusao21Aberta` — nome a considerar renomear
  (`conclusao30Aberta`) por consistência, mesmo trade-off do item acima.
- Linhas 257-265: efeito que abre a tela de conclusão —
  `if (diaAtual !== 21 || programa90Ativo || !userId) return` (linha 260) e chave de
  localStorage `mwa_21_concluido_${userId}` (linha 261). O literal `21` (condição) e o `21`
  na chave de storage **precisam mudar juntos** — mas atenção: se a chave de storage mudar
  de nome, usuárias que já viram a tela de conclusão sob a chave antiga (`mwa_21_concluido_*`)
  veriam a tela de novo sob a chave nova. Migração de dado a considerar (ou manter o nome da
  chave por compatibilidade mesmo trocando o número exibido).
- Linhas 271-276: efeito equivalente para a conclusão de 90 dias
  (`if (diaAtual !== 90 || !programa90Ativo || !userId) return`) — o literal `90` aqui
  depende da mesma decisão (a)/(b) da seção "Achado central".
- Linhas 331-332: `fecharConclusao21()` — nome a alinhar se o rename acima for feito.
- Linhas 431-434: criação do registro `mwa_programas` com `tipo: '21d'` no onboarding —
  **este é o literal mais sensível**: o valor `'21d'` é usado como **chave de banco de
  dados** (Supabase, tabela `mwa_programas`, coluna `tipo`), consumido também por
  `programa90Ativo()`/`diaDoPrograma()` (que buscam `p.tipo === '21d'`) e pelo webhook
  Hotmart (`src/lib/hotmart-webhook.js:47`, `programa_tipo: '21d'`). Mudar esse literal
  para `'30d'` é uma **migração de dados**, não só de código: contas já criadas com
  `tipo: '21d'` no banco continuariam existindo, e o código teria que continuar
  reconhecendo `'21d'` como alias do produto de entrada (ou rodar uma migração SQL). Está
  fora do escopo desta tarefa, mas é a mudança de maior risco operacional do mapa inteiro.

**Arquivo:** `src/components/game/Conclusao90Dias.jsx` — não cita "21", mas depende do
mesmo `diaAtual === 90` (via `programa90Ativo` do contexto) — recalcular junto com a
decisão (a)/(b).

---

## 5. Bloqueio de acesso (hoje dia 111 no doc antigo, dia 90 no código atual)

Ver "Achado central" acima para a divergência entre a documentação
(`BLOQUEIO_ACESSO_DIA_111.md`) e o código (`src/App.jsx`, `src/utils/calculos.js`).

**Arquivo:** `src/App.jsx`
- Linha 32: desestrutura `diaAtual`, `programa90Ativo` do contexto.
- Linha 39-40: comentário "Verifica se acesso deve ser bloqueado (dia 90 sem programa 90d
  ativo)" e `const acessoBloqueado = usuario && diaAtual === 90 && !programa90Ativo`.
- Linha 89-92: aplica o bloqueio, renderiza `<AcessoBloqueado usuario={usuario} />`.
- O literal `90` aqui precisa recalcular conforme a decisão (a)/(b): se o teto continuar
  saturado em 90, este número não muda quando a entrada virar 30 (só muda o que "chegar a
  90" significa: 30 + 60 de continuação em vez de 21 + 69); se virar aditivo (30+90=120),
  este `90` vira `120`.

**Arquivo:** `src/components/layout/AcessoBloqueado.jsx` — não apareceu na busca por "21",
mas o texto da tela (conforme `BLOQUEIO_ACESSO_DIA_111.md`, seção "Mensagens Mostradas",
linhas 236-253) fala em "111 dias" (`"Você completou seus 111 dias..."`,
`"histórico de 111 dias está salvo"`) — **precisa ser lido e conferido diretamente no
componente** quando a migração acontecer, pois o número exibido ali deve refletir o teto
final decidido (90 ou 120), não 111 nem um valor hardcoded desatualizado.

**Arquivo:** `BLOQUEIO_ACESSO_DIA_111.md` (raiz do repo) — documento inteiro descreve o
modelo de "111 dias" que não corresponde mais ao código (`App.jsx` usa 90). Precisa ser
reescrito ou marcado como histórico/desatualizado quando a migração para 30 dias for
implementada, para não confundir quem ler depois.

**Arquivo:** `ATIVAR_90DIAS_CONSOLE.md` (raiz do repo) — script de console para ativar
manualmente um programa `90d` via Supabase. Não contém literais de dia (só `tipo: '90d'`),
não precisa mudar por causa do 30 dias, mas o texto ao redor ("fim do ciclo de 21 + 90
dias", se existisse) deveria ser conferido — não encontrado neste arquivo especificamente
(o "111"/"21+90" está apenas em `BLOQUEIO_ACESSO_DIA_111.md`).

---

## 6. Outros pontos com "21" encontrados (menor prioridade, listados para completude)

- `src/components/auth/TelaAuth.jsx:11,25` — `descricaoEntrar: 'Entre para continuar sua
  transformação de 21 dias.'` (PT) e equivalente em inglês (linha 25). Copy a atualizar.
- `src/components/onboarding/TelaMetas.jsx:68` — botão `'Começar meus 21 dias ✨'` /
  `'Start my 21 days ✨'`. Copy a atualizar (paralelo ao que a landing já fez em
  `BotaoCTA`: `'Começar meus 30 dias'`).
- `src/components/perfil/Perfil.jsx:59-60` — mensagem de convite/compartilhamento via
  WhatsApp citando "21-day program" / "programa de 21 dias". Linha 131: comentário sobre
  Hall da Fama acumulando "em qualquer número de ciclos de 90 dias, não só nos 21 dias
  iniciais" — comentário a reescrever, sem lógica associada encontrada que dependa do
  literal.
- `src/components/vendas/ResgateCupom.jsx:213` — texto visível
  `'Você tem <strong>21 dias</strong> de acesso completo ao app MWA.'` — tela de resgate de
  cupom da compra Hotmart; copy a atualizar para 30 dias.
- `src/components/game/JogoPlantio.jsx` (linhas 6, 335, 353-354) e
  `src/components/ferramentas/Ferramentas.jsx` (linhas 254, 275) — nome/descrição do "Jogo
  do Plantio" cita "21 dias" / "21 days" em título e regras (`'16 acertos = +10 por dia'`).
  Copy a atualizar; a lógica de sementes/acertos (8 sementes, 2 perguntas por pilar) não
  depende do número de dias, só o texto descritivo cita 21.
- `src/components/ferramentas/ReforcandoConceitos.jsx:6` — comentário de código apenas
  ("...aplicado ao longo dos 21 dias"), sem texto visível ao usuário.
- `src/data/conceitosNutricionais.js:3` — comentário de topo ("mesma base científica usada
  nos informativos e dicas dos 21 dias"), sem impacto funcional.
- `src/data/legal.js:33,68,72` — Termos de Uso/Política citam "MWA — Método Wanessa Auad 21
  Dias" e "duração de 21 dias (extensível a 90 dias)" — **documento legal**, precisa de
  revisão jurídica/copy ao mudar para 30 dias (não é só find-replace, é um texto que a
  usuária aceita formalmente — ver `src/components/legal/DocumentoLegal.jsx` e
  `src/components/onboarding/TelaConsentimento.jsx` como consumidores).
- `src/lib/hotmart.js:17` — comentário: "21d é vendido pela landing page na Hotmart (não
  precisa de botão no app)" — comentário a atualizar; a lógica de roteamento por
  `product.id`/`offer.code` (ver `ARQUITETURA-HOTMART-MWA.md` seção 1) não usa a string
  `'21d'` para diferenciar produtos Hotmart, só para o campo interno `mwa_programas.tipo`
  (ver risco de migração de dados na seção 4 acima).
- `src/lib/hotmart-webhook.js:47` — `programa_tipo: '21d'`. **Nota:** este arquivo já é
  descrito em `ARQUITETURA-HOTMART-MWA.md` (seção 12) como "código antigo, roda no
  navegador, usa colunas inexistentes... está quebrado e inseguro; será substituído pela
  Edge Function e removido no plano" — ou seja, este literal específico provavelmente não
  precisa ser corrigido, porque o arquivo inteiro está planejado para remoção. Não tratar
  como pendência real da migração de 30 dias.
- `src/components/hoje/AnelHidratacao.demo.jsx:106` — `setConsumidoMl(2100)` — falso
  positivo do grep (número `2100`, não relacionado a dias).
- `src/components/vendas/LandingVendas.jsx` — falso positivo do grep original (`'210 kcal'`
  em texto de treino); a página já fala 30 dias corretamente em todo o resto (ver seção
  "O que já está pronto").
- `src/data/alimentosExtras.js`, `src/data/alimentos.js`, `src/data/alimentosEua.js` — todas
  as ocorrências de "21" são valores nutricionais (gramas de proteína/carboidrato, kcal),
  não relacionados a dias. Nenhuma ação necessária.

---

## 7. O que já está pronto (fora do escopo de mudança, referência)

- `landingpage/` (projeto standalone) — já fala "30 dias" em `Hero.jsx`, `Offer.jsx`,
  `AppShowcase.jsx`, `Faq.jsx`, `FinalCta.jsx`, `About.jsx`, `Benefits.jsx`, `Method.jsx`,
  `config.js`.
- `src/components/vendas/LandingVendas.jsx` (página `/vendas` dentro do app) — já fala "30
  dias" em ~15 pontos (hero, benefícios, seção "Imagine", FAQ, CTA final, preço). Confirmado:
  nenhuma ocorrência de "21 dias" neste arquivo (a única correspondência de "21" é
  `'210 kcal'`, falso positivo).

---

## 8. Resumo executivo (para quem for planejar a próxima sessão)

| Área | Arquivo(s) principal(is) | Ação |
|---|---|---|
| Contador de dias | `src/utils/calculos.js`, `src/components/admin/MododeRevisao.jsx` | Trocar `21`→`30`; decidir teto combinado (90 mantido ou 120 aditivo) |
| Nome do produto | `src/utils/ofertas.js` (`PRODUTOS.programa.nome`) | `'MWA \| Jornada de 21 Dias'` → `'MWA \| Jornada de 30 Dias'` (afeta todos os consumidores) |
| Conteúdo diário entrada | `src/data/dicas.js` (21→30 itens), `src/data/lanchesProteicos.js`, trecho 1–30 de `informativos.js`/`versiculos.js` | Escrever/redistribuir 9 dias novos de conteúdo |
| Conteúdo diário continuação | `src/data/dicas90.js`, `lanches22a37.js`, `lanches38a89.js`, trecho 31+ de `informativos.js`/`versiculos.js` | Renumerar tudo a partir do novo dia 31 (ou 22, se o teto ficar em 90) |
| Oferta 90d | `src/utils/ofertas.js` (`faseUpgrade`) | Confirmar com negócio se a janela dia 6–10 muda; ajustar `dia >= 21` → `dia >= 30` |
| Tela de conclusão | `src/components/game/Conclusao21Dias.jsx`, `AppContext.jsx` (`conclusao21Aberta`, chave `mwa_21_concluido_*`) | Copy + possível rename de arquivo/estado + decisão sobre migração da chave de storage |
| Bloqueio de acesso | `src/App.jsx`, `src/components/layout/AcessoBloqueado.jsx`, `BLOQUEIO_ACESSO_DIA_111.md` | Recalcular literal `90`; reescrever doc; conferir texto "111 dias" no componente |
| Banco de dados | `mwa_programas.tipo = '21d'` (onboarding em `AppContext.jsx:434`, webhook, `calculos.js`) | Maior risco: migração de dado, não só de código — fora de escopo |
| Copy secundária | `TelaAuth.jsx`, `TelaMetas.jsx`, `Perfil.jsx`, `ResgateCupom.jsx`, `JogoPlantio.jsx`, `Ferramentas.jsx`, `legal.js` | Find-and-replace de copy + revisão jurídica para `legal.js` |
| Já pronto | `landingpage/`, `src/components/vendas/LandingVendas.jsx` | Nenhuma ação — referência de tom/copy para as mudanças acima |

Esta tabela e as seções acima são um mapa para planejamento; nenhuma mudança de código foi
feita nesta tarefa.
