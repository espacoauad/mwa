# Notificações de Funções do App — Design

## Contexto e problema

O app já tem 3 mecanismos de notificação independentes, todos usando a
Notification API do navegador (sem service worker/push real — a pessoa só
recebe a notificação se tiver aberto o app naquele dia):

- `src/utils/notificacaoEstrela.js` — lembra à noite (18h) se a Estrela do
  Dia ainda não acendeu.
- `src/utils/notificacoesReminder.js` — lembra 24h antes do dia de
  pesagem, e é quem **pede a permissão automaticamente** (silenciosa, no
  login, via `configurarNotificacoesPesagem` chamado em `App.jsx`).
- Nenhum dos dois lembra a pessoa de usar as outras funções do app:
  Reforçando Conceitos, exercício, MWA Farm, Lente da Consciência,
  Versículo do Dia e os jogos educativos — todas ficam "escondidas" na
  aba Ferramentas, sem nenhum empurrãozinho pra pessoa descobrir/voltar a
  usá-las.

## Objetivo

Um novo lembrete diário, rotacionando entre essas funções por dia da
semana, disparado assim que a pessoa abre o app (não à noite) — no
máximo 1x por dia, reaproveitando a permissão que já é pedida
automaticamente pelo fluxo de pesagem.

## Arquitetura

Novo arquivo `src/utils/notificacaoFuncoes.js`, seguindo o mesmo padrão
de `notificacaoEstrela.js`:

- Não pede permissão (já é pedida em outro lugar) — só checa
  `Notification.permission === 'granted'`.
- Dedupe por `localStorage`, chave `mwa_lembrete_funcao_${userId}_${hoje}`
  — no máximo 1 disparo por pessoa por dia.
- Chamado de dentro do `useEffect` que já existe em `App.jsx` (o mesmo
  que chama `configurarNotificacoesPesagem` hoje), porque é ali que
  `setAba` está disponível diretamente — o toque na notificação chama
  `setAba('ferramentas')` sem precisar de mecanismo novo de navegação.

## Mapeamento dos dias

| Dia | Função |
|---|---|
| Domingo | Versículo do Dia (fixo) |
| Segunda | Reforçando Conceitos |
| Terça | Exercício |
| Quarta | MWA Farm |
| Quinta | Lente da Consciência |
| Sexta | Um jogo diferente, pelo nome (revezando semana a semana) |
| Sábado | Sem lembrete |

Função pura `funcaoDoDia(dataISO)` decide isso a partir de
`new Date(dataISO).getDay()` — testável isoladamente.

## Rotação do jogo de sexta

Existem 6 jogos hoje (Monte Seu Prato, Verdadeiro/Falso ou Depende,
Troca Inteligente, Batalha da Saciedade, Detetive dos Rótulos, Jogo da
Colheita). Cada sexta-feira mostra um jogo diferente, revezando pela
lista — o ciclo completo leva 6 semanas.

Função pura `jogoDaSemana(diaAtual)`: `Math.floor(diaAtual / 7) % 6`,
indexando na lista de jogos — usa `diaAtual` (já disponível, mesmo
padrão que `dicaDoDia`/`informativoDoDia` já usam pra variar conteúdo
por dia do programa).

## Mensagens

Cada lembrete tem um título curto (com emoji) + uma frase ligada ao
"porquê" daquela função, não um genérico "não esqueça de usar o app".
Todas bilíngues (pt/en), mesmo padrão dos lembretes existentes.

| Dia | Título (pt) | Corpo (pt) |
|---|---|---|
| Segunda | 📖 Já deu uma olhada no Reforçando Conceitos hoje? | Densidade nutricional, déficit calórico e mais, em poucos minutos. |
| Terça | 🔥 Já fez exercício hoje? | Registre e veja quanto isso ajuda na sua meta de calorias. |
| Quarta | 🌻 Sua fazenda está crescendo | Está plantando hábitos pra ver seu resultado florescer? |
| Quinta | 🔍 Antes de agir no automático... | Uma pausa guiada de menos de um minuto te espera na Lente da Consciência. |
| Sexta | (título do jogo da semana) | (frase do jogo da semana, adaptada da descrição que já existe em `Ferramentas.jsx`) |
| Domingo | ✨ Uma reflexão pra hoje | O Versículo do Dia está te esperando. |

As 6 mensagens de sexta (uma por jogo) reaproveitam o texto de
`desc`/`JOGOS_EN` já escrito em `src/components/ferramentas/Ferramentas.jsx`
(`JOGOS_NUTRICAO` + `JOGOS_PAUSA`) — sem duplicar/reescrever do zero.

## Horário de disparo

Diferente do lembrete da estrela (que espera até 18h), este dispara **na
primeira abertura do app do dia** — sem esperar horário. Continua
limitado a 1x por dia via o dedupe de `localStorage`.

## Relação com o lembrete da estrela

Independentes — nos dias em que a estrela ainda não acendeu à noite, a
pessoa pode receber as duas notificações (a de função ao abrir o app, a
da estrela às 18h se ainda não tiver acendido).

## Toque na notificação

Chama `setAba('ferramentas')` — leva pra aba onde a função vive, sem
abrir o modal/jogo específico automaticamente.

## Fora de escopo

- Abrir automaticamente o modal/jogo específico ao tocar na notificação
  (só leva pra aba Ferramentas).
- Qualquer mudança no fluxo de pedido de permissão — continua sendo pedida
  pelo mesmo lugar de sempre (`configurarNotificacoesPesagem`).
- Lembrete no sábado.
- Mudar o lembrete da estrela (horário, condição) — inalterado.

## Testes

Funções puras testáveis com `node --test`, mesmo padrão do resto do
projeto:
- `funcaoDoDia(dataISO)` — cobre os 7 dias da semana, incluindo os casos
  fixos (domingo = versículo, sábado = null).
- `jogoDaSemana(diaAtual)` — confirma que revezar por `diaAtual` cobre os
  6 jogos ao longo de 6 semanas, e que o ciclo reinicia corretamente.

A parte que efetivamente dispara a notificação do navegador (chamada de
`Notification`, `localStorage`, `setAba`) segue o mesmo padrão não-testado
dos lembretes que já existem — sem harness de teste de componente/integração
neste repositório. Verificação manual: abrir o app em dias diferentes
(via Modo de Revisão, se aplicável) e confirmar que o lembrete certo
aparece pra cada dia da semana.
