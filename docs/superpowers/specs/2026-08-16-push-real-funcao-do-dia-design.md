# Push Real (Etapa B) — Lembrete de Função do Dia — Design

## Contexto e problema

A [Estrela do Dia já migrou pra push real](2026-08-15-push-real-estrela-design.md)
— funciona com o app fechado. O lembrete de função do dia (Reforçando
Conceitos, exercício, MWA Farm, Lente da Consciência, um jogo diferente
cada sexta, Versículo do Dia aos domingos), em `src/utils/notificacaoFuncoes.js`,
continua no modelo antigo: `new Notification()` direto no navegador, sem
service worker, só funciona com o app aberto.

Confirmado na prática: uma pessoa recebeu a notificação do Versículo do
Dia com o app aberto, clicou, e nada aconteceu. Investigação encontrou a
causa — esse é um problema documentado do WebKit/Safari no iOS: uma
notificação criada via `new Notification()` recebe o clique no próprio
objeto `Notification` (não no `notificationclick` do service worker), e
esse caminho é conhecidamente pouco confiável no iOS, principalmente em
apps instalados na tela de início. Não é uma regressão desta sessão — é a
mesma limitação de fundo que motivou migrar a Estrela do Dia.

## Objetivo

Migrar o lembrete de função do dia pro mesmo push real (Web Push/VAPID),
reaproveitando toda a infraestrutura já construída (service worker,
`mwa_push_inscricoes`, `mwa_push_log`, chaves VAPID, padrão de Edge
Function + `pg_cron`). Lembrete de pesagem (24h antes) fica fora de
escopo, pra uma rodada seguinte.

## Horário de disparo

**9h de Brasília** (12:00 UTC) — diferente da Estrela (18h). É um convite
pra "descobrir algo hoje", faz sentido cedo; a Estrela é mais "ainda dá
tempo", faz sentido à noite.

## Condição "só manda se ainda não fez"

Diferente do comportamento atual (sempre dispara 1x/dia, mesmo se a
pessoa já tiver feito aquela função), o push real só envia se a pessoa
**ainda não engajou** com a função do dia. Investigação no banco encontrou
uma divergência real entre as 6 categorias:

| Categoria | Sinal hoje |
|---|---|
| Exercício | ✅ já existe (`mwa_game_eventos`, `tipo='exercicio'`) |
| Jogo da semana | ✅ já existe (cada jogo grava seu próprio `tipo`: `jogo_prato`, `jogo_vf`, `jogo_troca`, `jogo_saciedade`, `jogo_rotulos`, `joguinho`) |
| Reforçando Conceitos | ❌ nenhum — `ReforcandoConceitos.jsx` não grava nada no Supabase |
| Lente da Consciência | ❌ nenhum — `LenteConsciencia.jsx` não grava nada |
| Versículo do Dia | ❌ nenhum — `VersiculoDoDia.jsx`/`VersiculoDoDiaModal.jsx` não gravam nada |
| MWA Farm | ❌ nenhum — abrir/cuidar da fazenda não grava evento distinto |

Decisão: adicionar rastreamento nas 4 telas sem sinal, **sem conceder
sementes** (recompensa do jogo é uma decisão separada, fora de escopo
aqui). Cada uma grava, ao abrir, um evento em `mwa_game_eventos`:

- `ReforcandoConceitos.jsx` → `tipo: 'visto_conceitos'`
- `LenteConsciencia.jsx` → `tipo: 'visto_lente'`
- `VersiculoDoDiaModal.jsx` (o componente de fato aberto pela pessoa, via
  `versiculoAberto` em `Ferramentas.jsx` — `VersiculoDoDia.jsx` existe no
  mesmo diretório mas não é importado por nenhum outro arquivo além de si
  mesmo, é código órfão, fora de escopo tocar nele aqui) → `tipo: 'visto_versiculo'`
- Tela da Fazenda → `tipo: 'visto_fazenda'`

Todos com `sementes: 0`, `ref` = data de hoje (ISO). A constraint única já
existente em `mwa_game_eventos` (`user_id, tipo, ref`) evita duplicar —
basta tentar inserir e ignorar erro de conflito, mesmo padrão que
`concederSementes` já usa pra outros tipos.

"Já fez hoje" = abriu a tela hoje. Não exige nenhuma interação mais
profunda (não distingue "abriu e fechou" de "leu tudo") — critério simples
e uniforme entre as 4, e todas as mensagens da função do dia já são só um
convite pra "dar uma olhada", não uma tarefa com conclusão formal.

## Arquitetura

Mesmo padrão da Estrela do Dia — nova Edge Function
`supabase/functions/enviar-push-funcoes/index.ts`, chamada 1x por dia
(9h BRT) por um `pg_cron` novo, autenticada pelo mesmo esquema de segredo
compartilhado (`x-cron-secret`), reaproveitando o `CRON_SECRETO` e as
chaves VAPID já configurados.

```
pg_cron (12:00 UTC = 9h BRT)
        │ chama via pg_net (mesmo x-cron-secret)
        ▼
Edge Function "enviar-push-funcoes"
        │
        ├─ busca pessoas: programa ativo, não vencido, não-admin
        │  (mesmos 3 filtros já usados em enviar-push-estrela)
        │
        ├─ pra cada pessoa, calcula:
        │    diaSemana = dia da semana de hoje (calendário)
        │    tipo = funcaoDoDia(diaSemana)  — domingo=versiculo,
        │           segunda=conceitos, terça=exercicio, quarta=fazenda,
        │           quinta=lente, sexta=jogo, sábado=null (pula)
        │    se tipo == 'jogo': calcula diaAtual (dias desde o início
        │           do programa) pra saber qual dos 6 jogos da semana
        │
        ├─ filtra: já tem o evento correspondente hoje? pula.
        │  (exercicio/jogo_X para essas 2 categorias, visto_X pras outras 4)
        │
        ├─ filtra: já tem envio hoje em mwa_push_log (tipo='funcao_dia')? pula.
        │
        ├─ filtra: tem inscrição em mwa_push_inscricoes? só quem tem.
        │
        └─ envia via Web Push, grava mwa_push_log, remove inscrições
           mortas (404/410) — mesmo tratamento de erro da Estrela
```

### Cálculo de `diaAtual` no servidor

Hoje só o cliente calcula (`diaDoPrograma` em `src/utils/calculos.js`):
dias corridos desde `mwa_programas.data_inicio` (linha com `tipo='21d'`),
capado em 30 ou 90 dependendo de programa 90d ativo. A Edge Function
replica essa conta em SQL/JS a partir do mesmo dado (`mwa_programas`, já
consultado pra filtrar quem está ativo) — sem chamar nada do cliente.

### Mensagens

Copiadas exatamente do `mensagemFuncao()` já escrito em
`src/utils/notificacaoFuncoes.js` (títulos/corpos bilíngues, incluindo os
6 textos de jogo da semana) — reescritas em TypeScript na Edge Function,
mesmo padrão de duplicação (não importação) já usado entre
`notificacaoFuncoes.js` e `Ferramentas.jsx` por causa da fronteira
Deno/Node × React.

## Cliente

`src/utils/notificacaoFuncoes.js` e seu uso em `App.jsx` são **removidos**
— mesma decisão da Estrela do Dia, pra não duplicar notificação em quem
estiver com o app aberto na hora certa.

## Toque na notificação

Mesmo padrão já construído pra Estrela: o service worker já lida com
`notificationclick` e navega pra aba indicada via `?aba=` (cold start) ou
`postMessage` (app já aberto). A Edge Function manda `aba: 'ferramentas'`
no payload, igual à Estrela.

## Fora de escopo

- Lembrete de pesagem (24h antes) — rodada seguinte.
- Conceder sementes pelas 4 novas telas rastreadas.
- Abrir automaticamente o conteúdo específico (Versículo, jogo etc) ao
  tocar na notificação — só leva pra aba Ferramentas, mesmo comportamento
  de hoje.

## Testes

- Funções puras (mapeamento dia-da-semana → categoria, rotação do jogo da
  semana, cálculo de `diaAtual`) testáveis com `node --test`, mesmo padrão
  do resto do projeto — reaproveitando os testes já existentes de
  `notificacaoFuncoes.test.js` como referência de casos de borda.
- Edge Function: verificação manual (igual à Estrela) — sem cobertura
  automatizada neste repositório.
- As 4 novas gravações client-side: verificação manual (abrir cada tela,
  confirmar no Supabase que o evento foi gravado, confirmar que abrir de
  novo no mesmo dia não duplica).
