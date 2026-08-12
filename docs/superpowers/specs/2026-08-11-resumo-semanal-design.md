# Resumo Semanal Inteligente — Design

## Contexto e problema

Feedback externo sobre o produto (mesma conversa que originou o Modo
Recomeçar, o início personalizado e a Cápsula do Tempo): todo domingo, o
app poderia entregar um "Retrato da sua semana" — pontos fortes, o hábito
em que mais evoluiu, um ponto de atenção, uma vitória não percebida e uma
sugestão simples. Isso "ensina, direciona e evita que os gráficos sejam
apenas números".

Como o projeto não tem integração com IA/LLM, essa spec escolhe um
subconjunto de 3 dos 5 insights originais — **pontos fortes**, **ponto de
atenção** e **sugestão** — que dá pra calcular com confiança a partir de
dados que o app já registra, sem inventar especificidade que os dados não
sustentam (por exemplo, "hábito que mais evoluiu" e "vitória não
percebida" exigiriam comparar com a semana anterior, o que não existe
ainda para as primeiras semanas de uso de qualquer pessoa e ficou fora de
escopo desta primeira versão).

## Objetivo

Aos domingos, abrir automaticamente um modal "Retrato da sua Semana"
mostrando, a partir de 4 métricas diárias já rastreadas pelo app (refeição
registrada, meta de água batida, meta de proteína batida, exercício
registrado): os 2 pontos mais fortes da semana, o ponto que mais precisa
de atenção, e uma sugestão simples atrelada a ele.

## Métricas

Para cada um dos 7 dias da semana (segunda a domingo, usando
`diasDaSemana` já existente em `src/utils/jogos/estrelas.js`), calcula-se
um contador (0-7) por métrica:

| métrica | condição do dia contar |
|---|---|
| `refeicao` | existe pelo menos 1 `mwa_refeicoes` naquele dia |
| `agua` | `mwa_agua.ml` do dia ≥ meta diária de água (`metas.aguaL * 1000`) |
| `proteina` | soma da proteína de todos os itens das refeições do dia ≥ meta diária de proteína (`metas.proteina`) |
| `exercicio` | existe pelo menos 1 `mwa_exercicios` naquele dia |

## Seleção de pontos fortes e ponto de atenção

1. Ordenar as 4 métricas por contador decrescente; em caso de empate, usar
   a ordem fixa `refeicao, agua, proteina, exercicio`.
2. **Elegíveis a "ponto forte"**: métricas com contador ≥ 3. Pegar as 2
   primeiras da lista ordenada (ou 1, se só uma for elegível).
3. **Semana parada**: se nenhuma métrica é elegível (0 métricas com
   contador ≥ 3), não há pontos fortes nem ponto de atenção — mostra
   apenas a mensagem acolhedora genérica (ver Copy).
4. **Ponto de atenção**: a métrica com o menor contador entre as 4 (última
   da lista ordenada). Se essa métrica também estiver entre os pontos
   fortes selecionados (só acontece se as 4 métricas tiverem contadores
   muito próximos/iguais), não mostrar ponto de atenção — não faz sentido
   apontar fraqueza numa semana onde tudo foi parecido.

## Copy

**Pontos fortes (2 métricas elegíveis):**

> "Você {forte-1} em {n1} dos 7 dias e {forte-2} em {n2} dos 7 dias. Esses
> foram seus pontos fortes nessa semana. 💪"

**Pontos fortes (1 métrica elegível):**

> "Você {forte-1} em {n1} dos 7 dias — isso foi seu ponto forte na
> semana."

Fragmentos de "forte" por métrica:

- `refeicao`: "registrou suas refeições"
- `agua`: "bateu sua meta de água"
- `proteina`: "bateu sua meta de proteína"
- `exercicio`: "registrou exercícios"

**Ponto de atenção + sugestão** (uma frase completa por métrica, já com
`{n}` = contador dessa métrica):

- `refeicao`: "O registro das refeições foi o que mais ficou de lado essa
  semana — só {n} dos 7 dias. Que tal focar só em registrar o café da
  manhã na próxima semana? Não precisa ser tudo de uma vez."
- `agua`: "A água foi o que mais escapou essa semana — a meta só foi
  batida em {n} dos 7 dias. Uma sugestão simples: deixe uma garrafa cheia
  visível na mesa, ela lembra por você."
- `proteina`: "A meta de proteína só foi batida em {n} dos 7 dias essa
  semana. Vale reforçar uma fonte de proteína em cada refeição principal —
  não precisa ser perfeito, só mais presente."
- `exercicio`: "O exercício foi o que mais ficou pra trás essa semana — só
  {n} dos 7 dias. Comece pequeno: 15 minutos já contam."

**Semana parada** (nenhuma métrica elegível a ponto forte):

> "Essa foi uma semana mais parada, e tudo bem — cada semana é diferente.
> Que tal escolher só uma coisa pequena pra focar na próxima?"

## Modelo de dados

Nenhuma tabela ou coluna nova. As métricas são calculadas ao vivo, e o
controle de exibição usa `localStorage` (mesmo padrão de `ConclusaoDia`),
chave `mwa_resumo_semanal_${userId}_${segundaDaSemana}` — `segundaDaSemana`
é o primeiro elemento de `diasDaSemana(hoje)`.

## Fluxo e arquitetura

**`src/utils/resumoSemanal.js`** (novo, `.js` puro, testável via
`node --test`):

- Constantes de copy (`FORTE_FRAGMENTO`, `ATENCAO_FRASE` — mapas por
  métrica, como descrito acima).
- `calcularResumoSemanal({ dias, refeicoesPorDia, proteinaPorDia,
  aguaPorDia, exercicioPorDia, metaProteina, metaAguaMl })` — função pura
  que recebe os dados brutos já agregados por dia (mapas `data -> valor`)
  e devolve `{ contadores, pontosFortes, pontoAtencao, semanaParada }`,
  seguindo a lógica de seleção acima. Não faz nenhuma chamada ao Supabase
  — só matemática e regras.

**`src/components/game/ResumoSemanal.jsx`** (novo):

- Mesmo "esqueleto" de modal que `ConclusaoDia.jsx`/`Conclusao90Dias.jsx`
  já usam: `role="dialog"`, `aria-modal`, fecha com Esc, foco movido pro
  diálogo ao abrir.
- Busca seus próprios dados da semana ao montar (mesmo padrão de
  `Conclusao90Dias.jsx`, que já faz suas próprias consultas Supabase ao
  abrir) — `mwa_refeicoes` + `mwa_refeicoes_itens` (proteína), `mwa_agua`,
  `mwa_exercicios`, todos filtrados pelo intervalo dos 7 dias da semana.
  Agrega em mapas `data -> valor` e chama `calcularResumoSemanal`.
- Usa `metas.aguaL` e `metas.proteina` (já calculados via `calcularMetas`,
  disponíveis em `useApp()`) como metas diárias — nenhum cálculo de meta
  novo.

**`AppContext.jsx`** (alteração):

- Novo estado `resumoSemanalAberto` + função `fecharResumoSemanal`.
- Novo `useEffect`, no mesmo estilo dos que já abrem `Conclusao30Dias`
  (`diaAtual === 30`) e `Conclusao90Dias` (`diaAtual === 90`): se `hoje`
  cai num domingo (`new Date(...).getDay() === 0`) e a chave do
  `localStorage` pra essa semana ainda não existe, marca a chave e abre o
  modal.
- Montado em `Hoje.jsx`, mesmo padrão lazy/Suspense dos outros modais de
  jogo.

## Fora de escopo

- "Hábito que mais evoluiu" e "vitória não percebida" (2 dos 5 insights
  originais) — exigem comparação com a semana anterior; ficam para uma
  versão futura, quando houver base de semanas suficiente e um design
  específico para essa comparação.
- Qualquer geração de texto via IA/LLM — 100% regras determinísticas,
  copy fixa por métrica.
- Histórico/arquivo de resumos passados (uma tela "Meus Resumos") — o
  modal aparece uma vez por semana e não fica salvo para revisão depois.
- Recuperar um resumo perdido se a pessoa não abrir o app no domingo —
  nesse caso, aquela semana simplesmente não gera resumo.

## Testes

- `src/utils/resumoSemanal.test.js`: cobre `calcularResumoSemanal` com
  casos para 2 pontos fortes, 1 ponto forte, semana parada (0 elegíveis),
  e o caso de empate total (ponto de atenção vira `null`).
- Nenhum teste de componente automatizado (não existe harness de teste de
  componente React neste repositório) — `ResumoSemanal.jsx` é verificado
  manualmente no navegador: forçar dados de uma semana no banco para uma
  conta de teste, confirmar que o modal abre no domingo e mostra o texto
  correto para os 3 cenários (2 fortes, 1 forte, semana parada), e que não
  reabre na mesma semana após fechado.
