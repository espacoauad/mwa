# Push Real (Etapa B) — Lembrete da Estrela do Dia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client-only "Estrela do Dia" reminder (which only fires while the app happens to be open) with real Web Push (VAPID) that reaches the person even with the app closed.

**Architecture:** New Supabase tables for push subscriptions (`mwa_push_inscricoes`) and send-dedupe/audit (`mwa_push_log`); a minimal service worker in the client that subscribes to push (reusing the notification permission already granted today) and stores the subscription; a new Supabase Edge Function (`enviar-push-estrela`) that queries who still needs today's star lit and sends the push via the Web Push protocol; a `pg_cron` job that fires the function once a day at 18h Brasília time. The existing client-only reminder (`src/utils/notificacaoEstrela.js`) is retired — the server push supersedes it.

**Tech Stack:** Plain JS (client), Deno + TypeScript (Edge Function, `jsr:@supabase/supabase-js@2` + `npm:web-push@3`, matching the existing `hotmart-webhook` function's conventions), PostgreSQL/`pg_cron`/`pg_net` (already available in this Supabase project), `node:test` for pure client-side logic.

## Global Constraints

- Portuguese identifiers/comments/user-facing text, matching the rest of the codebase (`docs/superpowers/specs/2026-08-15-push-real-estrela-design.md`). Notification copy is bilingual (pt/en) using the existing `idioma` field on `mwa_perfis` (`'pt-BR'` / `'en-US'`).
- Do NOT add a new notification-permission prompt or opt-in UI — reuse the permission already requested automatically by `configurarNotificacoesPesagem` (`src/utils/notificacoesReminder.js`).
- No new npm dependency in the client (`package.json` stays as-is) — the service worker and subscription code use only browser-native APIs. The Edge Function is the only place that adds a dependency (`npm:web-push`), which is fine since Edge Functions are Deno, not part of the Vite bundle.
- No caching/offline behavior in the service worker — only `push` and `notificationclick` handlers.
- VAPID public key is not secret — it is committed as a plain constant in client source, matching this codebase's existing convention of committing the Supabase publishable key directly in `src/lib/supabase.js` (no `.env` machinery exists in this project; don't introduce one).
- VAPID private key and the cron shared secret are Edge Function secrets — never committed to git.
- The Edge Function's cron secret must be validated with the same constant-time comparison pattern already used in `supabase/functions/hotmart-webhook/index.ts` (`timingSafeEqual`), to avoid a timing side-channel.
- Migrations are applied via the Supabase MCP tools (`apply_migration`) against project `kfavxgrvikflzyzvcoyb`, then the same SQL is committed to `supabase/migrations/` as the repo's historical record (matching the existing migrations already in that folder).

---

### Task 1: Migration — `mwa_push_inscricoes` table

**Files:**
- Create: `supabase/migrations/20260815130000_criar_mwa_push_inscricoes.sql`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: table `public.mwa_push_inscricoes(endpoint text PK, user_id uuid, p256dh text, auth text, criado_em timestamptz, atualizado_em timestamptz)` — Task 4 (client upsert) and Task 7 (Edge Function read/delete) depend on this exact shape.

- [ ] **Step 1: Write the migration SQL**

```sql
-- supabase/migrations/20260815130000_criar_mwa_push_inscricoes.sql
create table public.mwa_push_inscricoes (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index mwa_push_inscricoes_user_id_idx on public.mwa_push_inscricoes(user_id);

alter table public.mwa_push_inscricoes enable row level security;

create policy "usuario gerencia as proprias inscricoes push"
  on public.mwa_push_inscricoes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

- [ ] **Step 2: Apply the migration to the project**

Use the Supabase `apply_migration` tool against project `kfavxgrvikflzyzvcoyb` with `name: "criar_mwa_push_inscricoes"` and the SQL above as `query`.

- [ ] **Step 3: Verify the table and RLS policy exist**

Use the Supabase `list_tables` tool (schema `public`, `verbose: true`) and confirm `mwa_push_inscricoes` appears with `rls_enabled: true` and the columns above.

- [ ] **Step 4: Commit the migration file**

```bash
git add supabase/migrations/20260815130000_criar_mwa_push_inscricoes.sql
git commit -m "feat: cria tabela mwa_push_inscricoes para push real"
```

---

### Task 2: Migration — `mwa_push_log` table

**Files:**
- Create: `supabase/migrations/20260815130100_criar_mwa_push_log.sql`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: table `public.mwa_push_log(id uuid PK, user_id uuid, tipo text, data date, enviado_em timestamptz)`, unique on `(user_id, tipo, data)` — Task 7 (Edge Function) depends on this exact shape for its dedupe check and upsert.

- [ ] **Step 1: Write the migration SQL**

```sql
-- supabase/migrations/20260815130100_criar_mwa_push_log.sql
create table public.mwa_push_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null,
  data date not null,
  enviado_em timestamptz not null default now(),
  unique (user_id, tipo, data)
);

alter table public.mwa_push_log enable row level security;
-- Tabela operacional interna (log de envio) — sem policy de leitura/escrita
-- pro usuário final. Só a service role (usada pela Edge Function) acessa;
-- a service role ignora RLS por padrão no Supabase.
```

- [ ] **Step 2: Apply the migration to the project**

Use the Supabase `apply_migration` tool against project `kfavxgrvikflzyzvcoyb` with `name: "criar_mwa_push_log"` and the SQL above as `query`.

- [ ] **Step 3: Verify the table exists**

Use the Supabase `list_tables` tool (schema `public`, `verbose: true`) and confirm `mwa_push_log` appears with `rls_enabled: true` and the columns above, and no policies (internal-only table).

- [ ] **Step 4: Commit the migration file**

```bash
git add supabase/migrations/20260815130100_criar_mwa_push_log.sql
git commit -m "feat: cria tabela mwa_push_log para dedupe/auditoria de push"
```

---

### Task 3: Minimal service worker

**Files:**
- Create: `public/service-worker.js`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: a service worker at `/service-worker.js` that (a) shows a notification on `push` events built from a JSON payload `{ titulo, corpo, tag, aba }`, and (b) on `notificationclick`, focuses/opens a client window and posts `{ tipo: 'push-click', aba }` to it. Task 4 registers this file; Task 5 listens for the posted message.

- [ ] **Step 1: Write the service worker**

```js
// public/service-worker.js
// Service worker mínimo para push real — sem cache/offline, só os dois
// handlers necessários pra notificação chegar com o app fechado.

self.addEventListener('push', (event) => {
  let dados = {}
  try {
    dados = event.data ? event.data.json() : {}
  } catch {
    dados = {}
  }
  const titulo = dados.titulo || 'MWA'
  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: dados.corpo || '',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: dados.tag || 'mwa-push',
      data: { aba: dados.aba || 'ferramentas' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const aba = event.notification.data?.aba || 'ferramentas'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((lista) => {
      for (const cliente of lista) {
        if ('focus' in cliente) {
          cliente.postMessage({ tipo: 'push-click', aba })
          return cliente.focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow('/')
    })
  )
})
```

- [ ] **Step 2: Verify it's syntactically valid**

Run: `node --check public/service-worker.js`
Expected: no output, exit code 0 (this only checks JS syntax; browser-only globals like `self`/`clients` are fine since `--check` doesn't execute the file).

- [ ] **Step 3: Commit**

```bash
git add public/service-worker.js
git commit -m "feat: adiciona service worker minimo para push real"
```

---

### Task 4: `src/utils/pushSubscricao.js` — subscription logic

**Files:**
- Create: `src/utils/pushSubscricao.js`
- Test: `src/utils/pushSubscricao.test.js`

**Interfaces:**
- Consumes: `supabase` client from `../lib/supabase.js` (existing).
- Produces: `urlBase64ParaUint8Array(base64)`, `inscricaoParaLinha(userId, subscription)`, `suportaPush()`, `registrarServiceWorker()`, `garantirInscricaoPush(userId)` — Task 5 calls `garantirInscricaoPush(userId)` from `App.jsx`.

- [ ] **Step 1: Generate real VAPID keys**

Run: `npx --yes web-push generate-vapid-keys`
This prints a Public Key and a Private Key. Keep both — the public key goes into Step 3 below (committed, it's not secret); the private key is used only in Task 8 (Edge Function secret, never committed).

- [ ] **Step 2: Write the failing tests**

```js
// src/utils/pushSubscricao.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { urlBase64ParaUint8Array, inscricaoParaLinha } from './pushSubscricao.js'

test('urlBase64ParaUint8Array decodifica uma string base64url conhecida', () => {
  // "TVdB" decodifica pros bytes de "MWA" (77, 87, 65)
  const bytes = urlBase64ParaUint8Array('TVdB')
  assert.deepEqual([...bytes], [77, 87, 65])
})

test('urlBase64ParaUint8Array aceita - e _ no lugar de + e /', () => {
  const bytes = urlBase64ParaUint8Array('--__')
  assert.equal(bytes.length, 3)
})

test('inscricaoParaLinha monta a linha pro upsert a partir de uma subscription', () => {
  const subscriptionFalsa = {
    toJSON: () => ({
      endpoint: 'https://push.exemplo/abc',
      keys: { p256dh: 'chave-publica', auth: 'segredo' },
    }),
  }
  const linha = inscricaoParaLinha('user-123', subscriptionFalsa)
  assert.equal(linha.endpoint, 'https://push.exemplo/abc')
  assert.equal(linha.user_id, 'user-123')
  assert.equal(linha.p256dh, 'chave-publica')
  assert.equal(linha.auth, 'segredo')
  assert.equal(typeof linha.atualizado_em, 'string')
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `node --test src/utils/pushSubscricao.test.js`
Expected: FAIL — `Cannot find module './pushSubscricao.js'`.

- [ ] **Step 4: Write the implementation**

Replace `SUBSTITUA_PELA_CHAVE_PUBLICA_VAPID` below with the real Public Key printed in Step 1.

```js
// src/utils/pushSubscricao.js
// Push real (Web Push/VAPID) — registra o service worker e garante que o
// dispositivo tenha uma inscrição salva no Supabase, reaproveitando a
// permissão de notificação já concedida em outro lugar (não pede permissão
// aqui).
import { supabase } from '../lib/supabase.js'

// Chave pública VAPID — não é segredo, faz parte do protocolo Web Push.
const VAPID_PUBLIC_KEY = 'SUBSTITUA_PELA_CHAVE_PUBLICA_VAPID'

export function urlBase64ParaUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Segura = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const bruto = atob(base64Segura)
  return Uint8Array.from([...bruto].map((c) => c.charCodeAt(0)))
}

export function suportaPush() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window
}

export async function registrarServiceWorker() {
  if (!suportaPush()) return null
  return navigator.serviceWorker.register('/service-worker.js')
}

export function inscricaoParaLinha(userId, subscription) {
  const json = subscription.toJSON()
  return {
    endpoint: json.endpoint,
    user_id: userId,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
    atualizado_em: new Date().toISOString(),
  }
}

// Garante que o dispositivo atual tenha uma inscrição push salva —
// idempotente, seguro de chamar toda vez que o app carrega.
export async function garantirInscricaoPush(userId) {
  if (!userId || !suportaPush() || Notification.permission !== 'granted') return false
  try {
    const registration = await registrarServiceWorker()
    if (!registration) return false
    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ParaUint8Array(VAPID_PUBLIC_KEY),
      })
    }
    const linha = inscricaoParaLinha(userId, subscription)
    const { error } = await supabase.from('mwa_push_inscricoes').upsert(linha, { onConflict: 'endpoint' })
    return !error
  } catch {
    // Navegador sem suporte completo, ou pessoa negou no meio do fluxo —
    // falha silenciosa, sem crashar o app (mesmo padrão dos lembretes locais).
    return false
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `node --test src/utils/pushSubscricao.test.js`
Expected: PASS — all 3 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/utils/pushSubscricao.js src/utils/pushSubscricao.test.js
git commit -m "feat: adiciona logica de inscricao push (VAPID)"
```

---

### Task 5: Wire real push into the app; retire the client-only star reminder

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/context/AppContext.jsx:26` (remove import), `src/context/AppContext.jsx:349-353` (remove the old reminder `useEffect`)
- Delete: `src/utils/notificacaoEstrela.js`

**Interfaces:**
- Consumes: `garantirInscricaoPush(userId)` from Task 4's `src/utils/pushSubscricao.js`.
- Produces: nothing new consumed by later tasks.

- [ ] **Step 1: Remove the old client-side star reminder from `AppContext.jsx`**

Remove the import at `src/context/AppContext.jsx:26`:

```js
import { lembrarEstrelaDoDia } from '../utils/notificacaoEstrela.js'
```

Remove the `useEffect` block at `src/context/AppContext.jsx:349-353`:

```js
  // Lembrete local da estrela (só se a pessoa já autorizou notificações)
  useEffect(() => {
    if (!userId || !semanaEstrelas.length) return
    lembrarEstrelaDoDia({ userId, hoje, estrelaAcesa: estrelaHojeAcesa, metas: metasEstrela, ingles })
  }, [userId, hoje, estrelaHojeAcesa, metasEstrela, semanaEstrelas.length, ingles])
```

- [ ] **Step 2: Delete the now-unused file**

```bash
rm src/utils/notificacaoEstrela.js
```

- [ ] **Step 3: Add the push wiring to `src/App.jsx`**

Add the import, right after the existing `notificacaoFuncoes.js` import (`src/App.jsx:26`):

```js
import { lembrarFuncaoDoDia } from './utils/notificacaoFuncoes.js'
import { garantirInscricaoPush } from './utils/pushSubscricao.js'
```

Add two new `useEffect` blocks in `AppInner`, right after the existing "Lembrete diário rotativo das funções do app" effect (`src/App.jsx:76-83`):

```js
  // Garante a inscrição push do dispositivo atual (sem pedir permissão de novo)
  useEffect(() => {
    const userId = sessao?.user?.id
    if (usuario && userId) {
      garantirInscricaoPush(userId)
    }
  }, [sessao, usuario])

  // Toque numa notificação push -> navega pra aba indicada
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    function aoReceberMensagem(evento) {
      if (evento.data?.tipo === 'push-click') {
        setAba(evento.data.aba || 'ferramentas')
      }
    }
    navigator.serviceWorker.addEventListener('message', aoReceberMensagem)
    return () => navigator.serviceWorker.removeEventListener('message', aoReceberMensagem)
  }, [])
```

- [ ] **Step 4: Run the full test suite and build to verify nothing broke**

Run: `npm test`
Expected: all existing tests pass (no test referenced `notificacaoEstrela.js`, so none should break).

Run: `npm run build`
Expected: build succeeds with no new errors (no remaining import of the deleted file).

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/context/AppContext.jsx
git rm src/utils/notificacaoEstrela.js
git commit -m "feat: liga push real da Estrela do Dia e aposenta o lembrete local"
```

---

### Task 6: iOS "add to home screen" notice

**Files:**
- Create: `src/utils/avisoIOS.js`
- Test: `src/utils/avisoIOS.test.js`
- Create: `src/components/layout/AvisoInstalarIOS.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `deveMostrarAvisoIOS({ userAgent, standalone, dispensado })` (pure, tested), and `<AvisoInstalarIOS />` (self-contained component, no props) — Task 6 alone renders it; no other task depends on it.

- [ ] **Step 1: Write the failing tests**

```js
// src/utils/avisoIOS.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ehIOSNaoInstalado, deveMostrarAvisoIOS } from './avisoIOS.js'

test('detecta iPhone fora do modo standalone', () => {
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  assert.equal(ehIOSNaoInstalado({ userAgent: ua, standalone: false }), true)
})

test('nao marca iPhone ja instalado (standalone)', () => {
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  assert.equal(ehIOSNaoInstalado({ userAgent: ua, standalone: true }), false)
})

test('nao marca Android', () => {
  const ua = 'Mozilla/5.0 (Linux; Android 14)'
  assert.equal(ehIOSNaoInstalado({ userAgent: ua, standalone: false }), false)
})

test('deveMostrarAvisoIOS respeita a flag de dispensado', () => {
  const base = { userAgent: 'iPhone', standalone: false }
  assert.equal(deveMostrarAvisoIOS({ ...base, dispensado: false }), true)
  assert.equal(deveMostrarAvisoIOS({ ...base, dispensado: true }), false)
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/utils/avisoIOS.test.js`
Expected: FAIL — `Cannot find module './avisoIOS.js'`.

- [ ] **Step 3: Write the implementation**

```js
// src/utils/avisoIOS.js
// Push real só funciona no iOS com o app instalado na tela de início (iOS
// 16.4+) — nunca numa aba comum do Safari. Decide se mostra o aviso.
export function ehIOSNaoInstalado({ userAgent = '', standalone = false } = {}) {
  const ehIOS = /iphone|ipad|ipod/i.test(userAgent)
  return ehIOS && !standalone
}

export function deveMostrarAvisoIOS({ userAgent, standalone, dispensado }) {
  return ehIOSNaoInstalado({ userAgent, standalone }) && !dispensado
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test src/utils/avisoIOS.test.js`
Expected: PASS — all 4 tests green.

- [ ] **Step 5: Write the banner component**

```jsx
// src/components/layout/AvisoInstalarIOS.jsx
import { useEffect, useState } from 'react'
import { deveMostrarAvisoIOS } from '../../utils/avisoIOS.js'

const CHAVE_DISPENSADO = 'mwa_aviso_ios_dispensado'

export default function AvisoInstalarIOS() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
    const dispensado = localStorage.getItem(CHAVE_DISPENSADO) === '1'
    setVisivel(deveMostrarAvisoIOS({ userAgent: navigator.userAgent, standalone, dispensado }))
  }, [])

  if (!visivel) return null

  function dispensar() {
    localStorage.setItem(CHAVE_DISPENSADO, '1')
    setVisivel(false)
  }

  return (
    <div className="fixed inset-x-4 bottom-20 z-40 flex items-center justify-between gap-3 rounded-2xl border border-verde/20 bg-white p-3 text-sm text-verde shadow-lg">
      <p>📲 Adicione o MWA à tela de início para receber lembretes mesmo com o app fechado.</p>
      <button type="button" onClick={dispensar} className="shrink-0 font-semibold text-verde/70">
        Entendi
      </button>
    </div>
  )
}
```

- [ ] **Step 6: Mount the banner in `App.jsx`**

Add the import, alongside the other layout imports near the top of `src/App.jsx`:

```js
import BotaoWhatsApp from './components/layout/BotaoWhatsApp.jsx'
import AvisoInstalarIOS from './components/layout/AvisoInstalarIOS.jsx'
```

Render it right after `<BotaoWhatsApp />` in the returned JSX (`src/App.jsx`, inside the main `<div className="mx-auto min-h-screen max-w-md">`):

```jsx
      <BotaoWhatsApp />
      <AvisoInstalarIOS />
```

- [ ] **Step 7: Run the full test suite and build to verify nothing broke**

Run: `npm test`
Expected: all tests pass, including the 4 new ones.

Run: `npm run build`
Expected: build succeeds with no new errors.

- [ ] **Step 8: Manual verification in the browser**

Run `npm run dev`, open the app, open DevTools → toggle device emulation to an iPhone (this changes the user agent), and reload without adding to home screen. Confirm the banner appears at the bottom of the screen. Click "Entendi" and reload — confirm it does not reappear. Switch device emulation to a non-iOS device (or desktop) and confirm the banner never appears there.

- [ ] **Step 9: Commit**

```bash
git add src/utils/avisoIOS.js src/utils/avisoIOS.test.js src/components/layout/AvisoInstalarIOS.jsx src/App.jsx
git commit -m "feat: adiciona aviso para instalar o app no iOS (push real)"
```

---

### Task 7: Edge Function `enviar-push-estrela`

**Files:**
- Create: `supabase/functions/enviar-push-estrela/index.ts`

**Interfaces:**
- Consumes: tables `mwa_programas`, `mwa_game_eventos`, `mwa_perfis`, `mwa_push_inscricoes`, `mwa_push_log` (all from Tasks 1–2 and pre-existing schema).
- Produces: an HTTPS endpoint at `https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-estrela` that Task 8's `pg_cron` job calls.

- [ ] **Step 1: Write the Edge Function**

```ts
// supabase/functions/enviar-push-estrela/index.ts
// ============================================================================
// enviar-push-estrela — dispara push real (Web Push/VAPID) do lembrete da
// Estrela do Dia pra quem ainda não acendeu a estrela hoje.
// Chamada 1x por dia (18h de Brasília) por um job do pg_cron, autenticada
// por um segredo compartilhado (header x-cron-secret) — não usa JWT de
// usuário nem a service role key no header, pra reduzir o que vaza se o
// job do cron for lido por alguém com acesso à tabela cron.job.
//
// Secrets necessários (Edge Functions → Secrets):
//   CRON_SECRETO         precisa bater com o header x-cron-secret
//   VAPID_PUBLIC_KEY      mesma chave pública usada no cliente
//   VAPID_PRIVATE_KEY     chave privada VAPID
//   VAPID_SUBJECT         ex.: mailto:espacoauad@gmail.com
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já são injetados automaticamente.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const CRON_SECRETO = Deno.env.get("CRON_SECRETO") ?? "";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

webpush.setVapidDetails(
  Deno.env.get("VAPID_SUBJECT")!,
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Comparação de tempo constante (mesmo padrão de hotmart-webhook)
function timingSafeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

const MENSAGEM = {
  titulo: "⭐ Sua estrela está esperando",
  corpo: "Sua estrela de hoje ainda está apagada — duas tarefinhas e ela é sua.",
  tituloEn: "⭐ Your star is waiting",
  corpoEn: "Today's star is still dim — two small tasks and it's yours.",
};

Deno.serve(async (req) => {
  const recebido = req.headers.get("x-cron-secret") ?? "";
  if (!CRON_SECRETO || !timingSafeEqual(recebido, CRON_SECRETO)) {
    return json({ erro: "não autorizado" }, 401);
  }

  const hoje = new Date().toISOString().slice(0, 10);

  const { data: programas, error: erroProgramas } = await supabase
    .from("mwa_programas")
    .select("user_id")
    .eq("status", "ativo");
  if (erroProgramas) return json({ erro: erroProgramas.message }, 500);

  const userIds = [...new Set((programas ?? []).map((p) => p.user_id))];
  if (userIds.length === 0) return json({ enviados: 0 });

  const { data: acesas } = await supabase
    .from("mwa_game_eventos")
    .select("user_id")
    .eq("tipo", "estrela_dia")
    .eq("ref", hoje)
    .in("user_id", userIds);
  const jaAcesa = new Set((acesas ?? []).map((e) => e.user_id));

  const { data: jaEnviados } = await supabase
    .from("mwa_push_log")
    .select("user_id")
    .eq("tipo", "estrela_dia")
    .eq("data", hoje)
    .in("user_id", userIds);
  const jaEnviado = new Set((jaEnviados ?? []).map((e) => e.user_id));

  const pendentes = userIds.filter((id) => !jaAcesa.has(id) && !jaEnviado.has(id));
  if (pendentes.length === 0) return json({ enviados: 0 });

  const { data: perfis } = await supabase
    .from("mwa_perfis")
    .select("id, idioma")
    .in("id", pendentes);
  const idiomaPorUsuario = new Map((perfis ?? []).map((p) => [p.id, p.idioma]));

  const { data: inscricoes, error: erroInscricoes } = await supabase
    .from("mwa_push_inscricoes")
    .select("endpoint, user_id, p256dh, auth")
    .in("user_id", pendentes);
  if (erroInscricoes) return json({ erro: erroInscricoes.message }, 500);

  let enviados = 0;
  for (const inscricao of inscricoes ?? []) {
    const ingles = idiomaPorUsuario.get(inscricao.user_id) === "en-US";
    const payload = JSON.stringify({
      titulo: ingles ? MENSAGEM.tituloEn : MENSAGEM.titulo,
      corpo: ingles ? MENSAGEM.corpoEn : MENSAGEM.corpo,
      tag: `estrela_${hoje}`,
      aba: "ferramentas",
    });

    try {
      await webpush.sendNotification(
        {
          endpoint: inscricao.endpoint,
          keys: { p256dh: inscricao.p256dh, auth: inscricao.auth },
        },
        payload,
      );
      await supabase.from("mwa_push_log").upsert(
        { user_id: inscricao.user_id, tipo: "estrela_dia", data: hoje },
        { onConflict: "user_id,tipo,data" },
      );
      enviados++;
    } catch (erro) {
      const status = (erro as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410) {
        await supabase.from("mwa_push_inscricoes").delete().eq("endpoint", inscricao.endpoint);
      } else {
        console.error("falha ao enviar push", inscricao.user_id, erro);
      }
    }
  }

  return json({ enviados, candidatos: pendentes.length });
});
```

- [ ] **Step 2: Deploy the function**

Use the Supabase `deploy_edge_function` tool against project `kfavxgrvikflzyzvcoyb` with `name: "enviar-push-estrela"` and the file content above.

- [ ] **Step 3: Set the required secrets**

In the Supabase dashboard (Edge Functions → `enviar-push-estrela` → Secrets, or via CLI `supabase secrets set`), set:
- `CRON_SECRETO` — a freshly generated random string (e.g. `openssl rand -hex 32`), not committed anywhere.
- `VAPID_PUBLIC_KEY` — the same Public Key generated in Task 4, Step 1.
- `VAPID_PRIVATE_KEY` — the Private Key generated in Task 4, Step 1.
- `VAPID_SUBJECT` — `mailto:espacoauad@gmail.com`.

- [ ] **Step 4: Verify with an unauthorized request (should reject)**

Run (replace `<url>` with the deployed function URL):
```bash
curl -s -o /dev/null -w "%{http_code}" https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-estrela
```
Expected: `401`.

- [ ] **Step 5: Verify with the correct secret (should run)**

Run (replace `<CRON_SECRETO>` with the value set in Step 3):
```bash
curl -s -X POST https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-estrela -H "x-cron-secret: <CRON_SECRETO>"
```
Expected: `200` with a JSON body like `{"enviados":0}` (0 is expected if no test account currently has a saved push subscription yet — that's covered end-to-end in Task 8).

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/enviar-push-estrela/index.ts
git commit -m "feat: adiciona edge function enviar-push-estrela"
```

---

### Task 8: Schedule the daily cron job and verify end-to-end

**Files:**
- Create: `supabase/migrations/20260815130200_agendar_push_estrela_cron.sql`

**Interfaces:**
- Consumes: the deployed Edge Function from Task 7, the `CRON_SECRETO` value set in Task 7 Step 3.
- Produces: a `pg_cron` job named `push-estrela-diaria` that fires daily.

- [ ] **Step 1: Store the cron secret in Supabase Vault (manual, not committed)**

This step inserts an actual secret value, so it is run directly against the database — it must NOT be added to a migration file that gets committed to git.

Use the Supabase `execute_sql` tool against project `kfavxgrvikflzyzvcoyb` with the same `CRON_SECRETO` value set as the Edge Function secret in Task 7, Step 3:

```sql
select vault.create_secret('<CRON_SECRETO_AQUI>', 'cron_secreto_push_estrela');
```

- [ ] **Step 2: Write the migration that schedules the cron job**

```sql
-- supabase/migrations/20260815130200_agendar_push_estrela_cron.sql
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

select cron.schedule(
  'push-estrela-diaria',
  '0 21 * * *', -- 21:00 UTC = 18:00 em Brasília (sem horário de verão hoje no Brasil)
  $$
  select net.http_post(
    url := 'https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-estrela',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secreto_push_estrela')
    ),
    body := '{}'::jsonb
  );
  $$
);
```

- [ ] **Step 3: Apply the migration**

Use the Supabase `apply_migration` tool against project `kfavxgrvikflzyzvcoyb` with `name: "agendar_push_estrela_cron"` and the SQL from Step 2.

- [ ] **Step 4: Verify the job is scheduled**

Use the Supabase `execute_sql` tool:
```sql
select jobname, schedule, active from cron.job where jobname = 'push-estrela-diaria';
```
Expected: one row, `active = true`, `schedule = '0 21 * * *'`.

- [ ] **Step 5: End-to-end manual verification**

1. Run `npm run dev`, open the app in a real browser (not just DevTools device emulation — actual push delivery needs a real push service), log in with a test account, and confirm (DevTools → Application → Service Workers) that `service-worker.js` is registered and (DevTools → Application → Storage → IndexedDB or Network tab on Supabase requests) that a row was upserted into `mwa_push_inscricoes` for that user.
2. Confirm that test account has NOT lit today's star (no `estrela_dia` row in `mwa_game_eventos` for today) — use the Supabase `execute_sql` tool to check, or simply don't complete 2 of the 3 daily micro-goals.
3. Manually trigger the function early (don't wait for 18h) with the same `curl` command from Task 7 Step 5.
4. Expected: `{"enviados":1,...}` (or more, if other test accounts qualify), and a real system notification appears on the test device/browser — close the app first to confirm it still arrives.
5. Run the same `curl` command again immediately.
6. Expected: `{"enviados":0}` — the `mwa_push_log` row from the first send prevents a duplicate.
7. Tap the notification and confirm the app opens/focuses on the Ferramentas tab.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260815130200_agendar_push_estrela_cron.sql
git commit -m "feat: agenda push diario da estrela via pg_cron"
```
