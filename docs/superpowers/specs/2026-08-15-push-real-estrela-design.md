# Push Real (Etapa B) — Lembrete da Estrela do Dia — Design

## Contexto e problema

O app tem hoje 3 mecanismos de notificação, todos usando a `Notification` API
do navegador diretamente (`new Notification(...)`), sem service worker:

- `src/utils/notificacoesReminder.js` — lembra 24h antes do dia de pesagem.
- `src/utils/notificacaoEstrela.js` — lembra às 18h se a Estrela do Dia ainda
  não acendeu.
- `src/utils/notificacaoFuncoes.js` — lembrete diário rotativo das funções do
  app, na primeira abertura.

Nenhum deles é push de verdade: a pessoa só recebe a notificação se o app
estiver aberto naquele momento. Os próprios comentários no código já chamam
isso de "Push etapa A — sem servidor" e apontam a etapa B (Web Push com
service worker + backend) como o próximo passo, "que depende de aprovação e
infraestrutura".

## Objetivo

Implementar push real (funciona com o app fechado) usando o padrão Web Push
(VAPID), migrando **um** lembrete como prova de conceito: a Estrela do Dia.
Os outros dois lembretes (pesagem, função do dia) reaproveitam a mesma infra
em rodadas futuras — fora de escopo aqui.

## Por que Web Push nativo (e não Firebase/OneSignal)

O MWA já tem um Supabase dedicado e auditado para LGPD (`mwa_lgpd_auditoria`).
Um serviço de push de terceiros guardaria endpoints de dispositivo dos
usuários fora desse perímetro já auditado, sem necessidade — o protocolo Web
Push padrão (VAPID) resolve inteiramente dentro do Supabase existente, sem
novo fornecedor.

## Arquitetura

```
Navegador                         Supabase
┌──────────────┐   inscreve      ┌───────────────────────┐
│ service       │────────────────▶│ mwa_push_inscricoes   │
│ worker novo   │                 └───────────────────────┘
└──────────────┘                          ▲
                                           │ lê
                             pg_cron (21:00 UTC = 18h BRT)
                                           │ chama via pg_net
                                           ▼
                             Edge Function nova
                             "enviar-push-estrela"
                                           │ envia (protocolo Web Push)
                                           ▼
                             Push Service (Google/Apple/Mozilla)
                                           │ entrega mesmo com app fechado
                                           ▼
                                    notificação no aparelho
```

## Dados novos no Supabase

### `mwa_push_inscricoes`

Guarda a inscrição push de cada dispositivo. Uma pessoa pode ter várias
linhas (celular + desktop, por exemplo).

| coluna | tipo | notas |
|---|---|---|
| `endpoint` | text | chave primária — identifica o dispositivo/navegador junto ao push service |
| `user_id` | uuid | FK `auth.users`, indexado |
| `p256dh` | text | chave pública da inscrição (parte do protocolo Web Push) |
| `auth` | text | segredo da inscrição (parte do protocolo Web Push) |
| `criado_em` | timestamptz | default `now()` |
| `atualizado_em` | timestamptz | default `now()` |

RLS: cada pessoa só faz `insert`/`update`/`delete`/`select` nas linhas com o
próprio `user_id`. A Edge Function lê todas usando a service role key
(mesmo padrão de `hotmart-webhook`).

### `mwa_push_log`

Registro de envio — evita duplicar notificação se o cron rodar mais de uma
vez, e serve de auditoria.

| coluna | tipo | notas |
|---|---|---|
| `id` | uuid | default `gen_random_uuid()` |
| `user_id` | uuid | FK `auth.users` |
| `tipo` | text | `'estrela_dia'` por enquanto |
| `data` | date | dia do lembrete |
| `enviado_em` | timestamptz | default `now()` |

Constraint única em `(user_id, tipo, data)`. RLS: sem acesso de leitura pro
usuário final (tabela operacional interna); só a service role escreve/lê.

## Fluxo do cliente

1. Novo `public/service-worker.js` — mínimo, só dois handlers:
   - `push`: mostra a notificação a partir do payload recebido (título,
     corpo, ícone, badge, tag).
   - `notificationclick`: foca uma aba existente do app (ou abre uma nova) e
     navega pra aba Ferramentas.
   - Sem cache/offline — fora de escopo, evita mexer no comportamento atual
     de carregamento do app.
2. Novo `src/utils/pushSubscricao.js` — registra o service worker e, assim
   que a permissão de notificação já concedida (reaproveitando o fluxo
   automático que já existe hoje, via `configurarNotificacoesPesagem`),
   chama `registration.pushManager.subscribe()` com a chave pública VAPID e
   faz upsert da inscrição em `mwa_push_inscricoes` (por `endpoint`).
3. Continua **sem pedir permissão de novo** — mantém o comportamento
   automático/silencioso já confirmado (nenhuma UI de opt-in nova).
4. Chave pública VAPID em variável de ambiente do Vite
   (`VITE_VAPID_PUBLIC_KEY` — pode ser pública, faz parte do protocolo). A
   chave privada só existe como secret da Edge Function.

## Fluxo do servidor

- `pg_cron` agenda 1x por dia, `21:00 UTC` (18h em Brasília — sem DST no
  Brasil atualmente), chamando a nova Edge Function via `pg_net`
  (`net.http_post`).
- Nova Edge Function `supabase/functions/enviar-push-estrela/index.ts`,
  seguindo o mesmo padrão de `hotmart-webhook` (Deno, `createClient` com
  `SUPABASE_SERVICE_ROLE_KEY` injetada automaticamente, secrets via
  `Deno.env.get`). Lógica:
  1. Busca pessoas com programa ativo (`mwa_programas.status = 'ativo'` pra
     aquele `user_id`).
  2. Filtra: **sem** evento `tipo = 'estrela_dia'` em `mwa_game_eventos` pra
     hoje (`ref = hoje`), **com** ao menos uma linha em
     `mwa_push_inscricoes`, **sem** linha em `mwa_push_log` pra
     `(user_id, 'estrela_dia', hoje)`.
  3. Pra cada inscrição encontrada, envia o push (texto igual ao já usado em
     `mensagemLembrete`, de `src/utils/jogos/estrelas.js`) usando as chaves
     VAPID.
  4. Sucesso → grava linha em `mwa_push_log`.
  5. Push service responde 404/410 (inscrição expirada/inválida) → apaga a
     linha correspondente de `mwa_push_inscricoes`.
  6. Outros erros → loga, não bloqueia o envio pras próximas pessoas do
     lote.

## Aviso para iOS

Push real no iOS só funciona com o app instalado na tela de início (iOS
16.4+) — Safari numa aba comum não recebe push em background. Um banner
pequeno e dispensável (chave em `localStorage` pra não insistir todo dia),
mostrado só quando detectar iOS fora do modo standalone, sugerindo "Adicione
o MWA à tela de início para receber lembretes mesmo com o app fechado".

## Decisão: aposentar `notificacaoEstrela.js`

O lembrete client-side atual (`new Notification()` local, só com app aberto
às 18h) é **removido**, não mantido em paralelo — o push real cobre o mesmo
caso e melhor (funciona com app fechado). Rodar os dois ao mesmo tempo
duplicaria a notificação pra quem estiver com o app aberto nesse horário.

Efeito colateral aceito: quem tiver permissão de notificação concedida mas,
por algum motivo, não conseguir gerar uma inscrição push (navegador sem
suporte a Push API, iOS sem instalar) deixa de receber esse lembrete
específico — equivalente a quem hoje nunca abre o app à noite.

## Fora de escopo

- Migrar o lembrete de pesagem (24h antes) e o de função do dia pro push
  real — próximas rodadas, reaproveitando a mesma infra (tabelas, service
  worker, chaves VAPID já existirão).
- Timezone por usuário — assume toda a base em horário de Brasília.
- Qualquer UI de opt-in explícito — permanece automático/silencioso.
- Cache/funcionamento offline no service worker.

## Testes

- Funções puras (se houver lógica de filtro/seleção extraída) testáveis com
  `node --test`, mesmo padrão do resto do projeto.
- A Edge Function em si (chamada de rede, envio real de push) não tem
  cobertura automatizada neste repositório — verificação manual: rodar a
  função manualmente (via `supabase functions invoke` ou chamada HTTP
  direta) contra uma conta de teste sem evento `estrela_dia` hoje e com
  inscrição push salva, confirmar que a notificação chega com o app
  fechado, e que rodar de novo no mesmo dia não duplica (bloqueado por
  `mwa_push_log`).
- Verificação manual do banner de iOS: simular `iOS` + fora de standalone
  (DevTools) e confirmar que aparece; confirmar que dispensar grava a chave
  e não reaparece.
