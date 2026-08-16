# Push Real (Etapa B) — Lembrete de Função do Dia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the client-only "função do dia" reminder (Reforçando Conceitos, exercício, MWA Farm, Lente da Consciência, jogo da semana, Versículo do Dia) with real Web Push, reusing the infrastructure already built for the Estrela do Dia push (service worker, `mwa_push_inscricoes`, `mwa_push_log`, VAPID secrets, cron/Edge Function pattern).

**Architecture:** Four components that currently record no completion signal (Reforçando Conceitos, Lente da Consciência, Versículo do Dia, MWA Farm) get a lightweight "viewed today" event write (no seeds/reward) so a new Edge Function can check "already engaged today" the same way the Estrela push checks "star already lit." A new Edge Function (`enviar-push-funcoes`) — reusing the already-configured Edge Function secrets (`CRON_SECRETO`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, no new secrets needed) — picks the day's category (calendar weekday), resolves the right "already done" signal per person (including, on Fridays, which of the 6 rotating games applies to that person specifically, based on their program day), and sends. A new `pg_cron` job fires it daily at 9h Brasília time (different from the Estrela's 18h). The existing client-only reminder (`src/utils/notificacaoFuncoes.js`) is retired.

**Tech Stack:** Plain JS (client tracking + AppContext wiring), Deno + TypeScript (Edge Function, same `jsr:@supabase/supabase-js@2` + `npm:web-push@3` pattern as `enviar-push-estrela`), PostgreSQL/`pg_cron`/`pg_net` (already enabled in this project).

## Global Constraints

- Portuguese identifiers/comments; all user-facing notification text is bilingual (pt/en), matching the exact copy already written in `src/utils/notificacaoFuncoes.js`.
- The 4 new tracking writes (Reforçando Conceitos, Lente da Consciência, Versículo do Dia, MWA Farm) grant **zero seeds** — `sementes: 0` — this is tracking-only, not a new gamification reward. Do not add entries to `RECOMPENSAS` (`src/data/skins.js`) for these.
- "Already engaged today" = the person opened that screen today. No deeper completion criteria for the 4 new categories.
- No new Supabase secrets — `enviar-push-funcoes` reuses the same `CRON_SECRETO`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` already configured for `enviar-push-estrela` (Edge Function secrets are project-wide in Supabase, not per-function).
- The Edge Function must check the `x-cron-secret` header (via the same constant-time `timingSafeEqual` pattern used in `enviar-push-estrela`/`hotmart-webhook`) **before** calling `webpush.setVapidDetails(...)` — lazy VAPID init after the auth check, matching the fix already applied to `enviar-push-estrela` (an unset/misconfigured VAPID secret must never turn an unauthorized request's clean 401 into a 500).
- Response shape from the Edge Function is `{ enviados, falhas, candidatos }` on every return path, including early returns — matching the schema-consistency fix already applied to `enviar-push-estrela`.
- `VersiculoDoDia.jsx` (in `src/components/ferramentas/`) is dead code — not imported anywhere except itself. Do not touch it. The component actually opened by the app is `VersiculoDoDiaModal.jsx`.
- Migrations are applied via the Supabase MCP tools (`apply_migration`) against project `kfavxgrvikflzyzvcoyb`, then the same SQL is committed to `supabase/migrations/` as the repo's historical record.

---

### Task 1: Shared "viewed today" tracking helper

**Files:**
- Modify: `src/lib/game.js` (add `registrarVisualizacao`)
- Modify: `src/context/AppContext.jsx:17-18` (add import), `src/context/AppContext.jsx:522-525` (add 4 wrapper functions, right after `registrarMomentoMwa`), `src/context/AppContext.jsx:955` (expose in context value, right after `registrarMomentoMwa,`)

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `registrarVisualizacao(userId, tipo, ref)` in `src/lib/game.js`; `registrarVistoConceitos()`, `registrarVistoLente()`, `registrarVistoVersiculo()`, `registrarVistoFazenda()` exposed via `useApp()` — Task 2 calls these from the 4 components.

- [ ] **Step 1: Add `registrarVisualizacao` to `src/lib/game.js`**

Add this function anywhere in the file (e.g. right after `concederSementes`, around line 34):

```js
// Grava que a pessoa abriu uma função sem rastreamento próprio hoje — não dá
// sementes, só existe pra um lembrete push saber que já pode deixar de
// insistir. A constraint única (user_id, tipo, ref) faz "já visto hoje" ser
// automático: inserir de novo no mesmo dia só falha (23505), sem duplicar.
export async function registrarVisualizacao(userId, tipo, ref) {
  if (!userId) return
  await supabase.from('mwa_game_eventos').insert({ user_id: userId, tipo, ref: String(ref), sementes: 0 })
}
```

- [ ] **Step 2: Wire it into `AppContext.jsx`**

Add `registrarVisualizacao` to the existing import from `../lib/game.js` (`src/context/AppContext.jsx:9-18`):

```js
import {
  carregarGame,
  concederSementes,
  comprarSkinDb,
  equiparSkinDb,
  registrarAcessoDiario,
  carregarTarefasHoje,
  carregarEstrelas,
  avaliarModoRecomecar,
  resolverModoRecomecar,
  registrarVisualizacao,
} from '../lib/game.js'
```

Add the 4 wrapper functions right after `registrarMomentoMwa` (`src/context/AppContext.jsx:522-525`):

```js
  // +5 🌱 pelo Momento MWA do dia (1x por dia)
  async function registrarMomentoMwa() {
    await premiar('momento_mwa', hoje)
  }

  // Marca que a pessoa viu a função hoje — sem sementes, só suprime o
  // lembrete push da função do dia pra quem já engajou.
  async function registrarVistoConceitos() {
    await registrarVisualizacao(userId, 'visto_conceitos', hoje)
  }

  async function registrarVistoLente() {
    await registrarVisualizacao(userId, 'visto_lente', hoje)
  }

  async function registrarVistoVersiculo() {
    await registrarVisualizacao(userId, 'visto_versiculo', hoje)
  }

  async function registrarVistoFazenda() {
    await registrarVisualizacao(userId, 'visto_fazenda', hoje)
  }
```

Expose the 4 new functions in the context value object, right after `registrarMomentoMwa,` (`src/context/AppContext.jsx:955`):

```js
    registrarMomentoMwa,
    registrarVistoConceitos,
    registrarVistoLente,
    registrarVistoVersiculo,
    registrarVistoFazenda,
    userId,
```

- [ ] **Step 3: Run the full test suite and build to verify nothing broke**

Run: `npm test`
Expected: all existing tests still pass (this task adds no new pure logic to test — it's Supabase I/O, matching the untested style of `concederSementes`/`premiar` already in this file).

Run: `npm run build`
Expected: build succeeds with no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/game.js src/context/AppContext.jsx
git commit -m "feat: adiciona rastreamento de visualizacao para conceitos, lente, versiculo e fazenda"
```

---

### Task 2: Wire the 4 components to record "viewed today" on open

**Files:**
- Modify: `src/components/ferramentas/ReforcandoConceitos.jsx`
- Modify: `src/components/ferramentas/LenteConsciencia.jsx`
- Modify: `src/components/ferramentas/VersiculoDoDiaModal.jsx`
- Modify: `src/components/game/MwaFarm.jsx`

**Interfaces:**
- Consumes: `registrarVistoConceitos`, `registrarVistoLente`, `registrarVistoVersiculo`, `registrarVistoFazenda` from Task 1's `useApp()`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: `ReforcandoConceitos.jsx`**

Add the import (this file currently has no `useApp` import — add it as a new import line at the top, after the existing imports):

```js
import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown, BookOpen } from 'lucide-react'
import { CONCEITOS_NUTRICIONAIS } from '../../data/conceitosNutricionais.js'
import { useApp } from '../../context/AppContext.jsx'
```

Destructure the function and add a mount-only effect, right after the component's opening line (`export default function ReforcandoConceitos({ onFechar }) {`):

```js
export default function ReforcandoConceitos({ onFechar }) {
  const { registrarVistoConceitos } = useApp()
  const [abertoId, setAbertoId] = useState(CONCEITOS_NUTRICIONAIS[0].id)
  const dialogRef = useRef(null)

  useEffect(() => {
    registrarVistoConceitos()
  }, [])
```

(Keep the rest of the existing function body — `alternar`, the two existing `useEffect`s, and the returned JSX — unchanged below this point.)

- [ ] **Step 2: `LenteConsciencia.jsx`**

Add the import (no `useApp` import exists yet):

```js
import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Eye, Heart, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
```

Destructure and add the effect right after the component's opening line (`export default function LenteConsciencia({ onFechar = null }) {`):

```js
export default function LenteConsciencia({ onFechar = null }) {
  const { registrarVistoLente } = useApp()
  const [etapaAtual, setEtapaAtual] = useState('pausar')

  useEffect(() => {
    registrarVistoLente()
  }, [])
```

(Keep the rest of the existing state declarations and body unchanged below this point.)

- [ ] **Step 3: `VersiculoDoDiaModal.jsx`**

This file already imports `useApp`. Add `registrarVistoVersiculo` to the existing destructure and add a new effect, right after the existing two `useEffect`s (after the focus-management effect, `src/components/ferramentas/VersiculoDoDiaModal.jsx:23-25`):

```js
export default function VersiculoDoDiaModal({ onFechar }) {
  const { diaAtual, totalDias, registrarVistoVersiculo } = useApp()
  const dialogRef = useRef(null)

  const versiculoHoje = versiculos.find(v => v.dia === diaAtual) || versiculos[0]
  const progresso = totalDias ? Math.round((diaAtual / totalDias) * 100) : 0

  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  // Move o foco para o diálogo assim que ele é aberto (a11y: modal focus management).
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    registrarVistoVersiculo()
  }, [])
```

- [ ] **Step 4: `MwaFarm.jsx`**

This file already imports `useApp`. Add `registrarVistoFazenda` to the existing destructure (`src/components/game/MwaFarm.jsx:90`) and add a new effect alongside the existing ones (`src/components/game/MwaFarm.jsx:105-106`):

```js
export default function MwaFarm({ onFechar }) {
  const { ingles } = useIdioma()
  const { diaAtual, game, registrarVistoFazenda } = useApp()
  const [selecionado, setSelecionado] = useState(null)
  const [cuidados, setCuidados] = useState([])
  const [contagens, setContagens] = useState(lerContagens)
  const dialogRef = useRef(null)
  const dia = Math.min(90, Math.max(1, diaAtual ?? 1))
  const resumo = useMemo(() => resumoFazenda(contagens, dia), [contagens, dia])
  const percentual = Math.round((dia / 90) * 100)
  const indiceFase = dia <= 22 ? 0 : dia <= 45 ? 1 : dia <= 68 ? 2 : 3
  const inicioFase = [1, 23, 46, 69][indiceFase]
  const fimFase = [22, 45, 68, 90][indiceFase]
  const progressoFase = (dia - inicioFase) / Math.max(1, fimFase - inicioFase)
  const imagemAtual = FASES_FARM[indiceFase]
  const imagemSeguinte = FASES_FARM[Math.min(3, indiceFase + 1)]

  useEffect(() => setCuidados(lerCuidados(dia)), [dia])
  useEffect(() => dialogRef.current?.focus(), [])
  useEffect(() => {
    registrarVistoFazenda()
  }, [])
```

- [ ] **Step 5: Run the full test suite and build to verify nothing broke**

Run: `npm test`
Expected: all tests pass.

Run: `npm run build`
Expected: build succeeds with no new errors.

- [ ] **Step 6: Manual verification**

Run `npm run dev`, open the app, open each of the 4 screens (Reforçando Conceitos, Lente da Consciência, Versículo do Dia, MWA Farm) in turn, and for each confirm (via the Supabase `execute_sql` tool) that a row appeared in `mwa_game_eventos` with the right `tipo` (`visto_conceitos`, `visto_lente`, `visto_versiculo`, `visto_fazenda`) and today's date as `ref`. Reopen each screen a second time and confirm no duplicate row was created (the unique constraint silently blocks it).

- [ ] **Step 7: Commit**

```bash
git add src/components/ferramentas/ReforcandoConceitos.jsx src/components/ferramentas/LenteConsciencia.jsx src/components/ferramentas/VersiculoDoDiaModal.jsx src/components/game/MwaFarm.jsx
git commit -m "feat: registra visualizacao ao abrir conceitos, lente, versiculo e fazenda"
```

---

### Task 3: Edge Function `enviar-push-funcoes`

**Files:**
- Create: `supabase/functions/enviar-push-funcoes/index.ts`

**Interfaces:**
- Consumes: tables `mwa_programas`, `mwa_perfis`, `mwa_game_eventos`, `mwa_push_inscricoes`, `mwa_push_log` (all pre-existing). Reuses the same Edge Function secrets already configured for `enviar-push-estrela`.
- Produces: an HTTPS endpoint at `https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-funcoes` that Task 5's `pg_cron` job calls.

- [ ] **Step 1: Write the Edge Function**

```ts
// supabase/functions/enviar-push-funcoes/index.ts
// ============================================================================
// enviar-push-funcoes — dispara push real (Web Push/VAPID) do lembrete
// rotativo de função do dia (Reforçando Conceitos, exercício, Fazenda,
// Lente da Consciência, um jogo diferente cada sexta, Versículo aos
// domingos) pra quem ainda não engajou com a função de hoje.
// Chamada 1x por dia (9h de Brasília) por um job do pg_cron, autenticada
// pelo mesmo esquema de segredo compartilhado (x-cron-secret) e as mesmas
// chaves VAPID já usadas por enviar-push-estrela — nenhum secret novo.
//
// Secrets necessários (já configurados, compartilhados com enviar-push-estrela):
//   CRON_SECRETO, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY já são injetados automaticamente.
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3";

const CRON_SECRETO = Deno.env.get("CRON_SECRETO") ?? "";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  if (ea.length !== eb.length) return false;
  let diff = 0;
  for (let i = 0; i < ea.length; i++) diff |= ea[i] ^ eb[i];
  return diff === 0;
}

// Mesma cópia bilíngue já usada em src/utils/notificacaoFuncoes.js.
const MENSAGENS_FIXAS: Record<string, { titulo: string; corpo: string; tituloEn: string; corpoEn: string }> = {
  conceitos: {
    titulo: "📖 Já deu uma olhada no Reforçando Conceitos hoje?",
    corpo: "Densidade nutricional, déficit calórico e mais, em poucos minutos.",
    tituloEn: "📖 Have you checked out Reinforcing Concepts today?",
    corpoEn: "Nutritional density, caloric deficit and more, in just a few minutes.",
  },
  exercicio: {
    titulo: "🔥 Já fez exercício hoje?",
    corpo: "Registre e veja quanto isso ajuda na sua meta de calorias.",
    tituloEn: "🔥 Have you exercised today?",
    corpoEn: "Log it and see how it helps your calorie goal.",
  },
  fazenda: {
    titulo: "🌻 Sua fazenda está crescendo",
    corpo: "Está plantando hábitos pra ver seu resultado florescer?",
    tituloEn: "🌻 Your farm is growing",
    corpoEn: "Are you planting habits to watch your results bloom?",
  },
  lente: {
    titulo: "🔍 Antes de agir no automático...",
    corpo: "Uma pausa guiada de menos de um minuto te espera na Lente da Consciência.",
    tituloEn: "🔍 Before acting on autopilot...",
    corpoEn: "A guided pause under a minute is waiting in the Awareness Lens.",
  },
  versiculo: {
    titulo: "✨ Uma reflexão pra hoje",
    corpo: "O Versículo do Dia está te esperando.",
    tituloEn: "✨ A reflection for today",
    corpoEn: "The Verse of the Day is waiting for you.",
  },
};

// Tipo de evento em mwa_game_eventos que indica "já engajou hoje" pra cada
// categoria fixa (todas exceto 'jogo', que depende do dia do programa da
// pessoa — resolvido por usuário mais abaixo).
const TIPO_EVENTO_FIXO: Record<string, string> = {
  conceitos: "visto_conceitos",
  exercicio: "exercicio",
  fazenda: "visto_fazenda",
  lente: "visto_lente",
  versiculo: "visto_versiculo",
};

// Os 6 jogos revezados às sextas — mesma cópia e mesma ordem de
// src/utils/notificacaoFuncoes.js (JOGOS_SEXTA), com o tipo de evento que
// cada um grava em mwa_game_eventos quando concluído.
const JOGOS_SEXTA = [
  { tipoEvento: "jogo_prato", titulo: "🍽️ Bora montar seu prato?", corpo: "Cumpra missões montando pratos de verdade e aprenda com cada escolha.", tituloEn: "🍽️ Ready to build your plate?", corpoEn: "Complete missions by building real plates and learn from every choice." },
  { tipoEvento: "jogo_vf", titulo: "🤔 Verdadeiro, falso ou depende?", corpo: "Nem tudo em nutrição é preto no branco — teste o que você sabe.", tituloEn: "🤔 True, false, or it depends?", corpoEn: "Not everything in nutrition is black and white — test what you know." },
  { tipoEvento: "jogo_troca", titulo: "🔄 Que tal uma Troca Inteligente?", corpo: "Melhore uma refeição sem abrir mão dela e veja o impacto de cada troca.", tituloEn: "🔄 How about a Smart Swap?", corpoEn: "Improve a meal without giving it up and see the impact of each swap." },
  { tipoEvento: "jogo_saciedade", titulo: "⚖️ Qual sustenta mais?", corpo: "Mesmas calorias, fomes diferentes — descubra na Batalha da Saciedade.", tituloEn: "⚖️ Which one keeps you full longer?", corpoEn: "Same calories, different hunger — find out in the Satiety Battle." },
  { tipoEvento: "jogo_rotulos", titulo: "🔍 Vire um Detetive dos Rótulos", corpo: "Aprenda a ler a tabela nutricional e a diferença entre porção e embalagem.", tituloEn: "🔍 Become a Label Detective", corpoEn: "Learn to read the nutrition table and the difference between serving and package." },
  { tipoEvento: "joguinho", titulo: "🍓 Um respiro pra mente", corpo: "Combine 3 frutas e relaxe um pouco no Jogo da Colheita.", tituloEn: "🍓 A breather for your mind", corpoEn: "Match 3 fruits and relax a little in the Harvest Game." },
];

// dataISO (YYYY-MM-DD) -> categoria do dia. 0=domingo..6=sábado, igual ao
// mapa de src/utils/notificacaoFuncoes.js.
function categoriaDoDia(dataISO: string): string | null {
  const diaSemana = new Date(`${dataISO}T00:00:00`).getDay();
  const mapa: Record<number, string | null> = { 0: "versiculo", 1: "conceitos", 2: "exercicio", 3: "fazenda", 4: "lente", 5: "jogo", 6: null };
  return mapa[diaSemana];
}

// Dias completos entre duas datas ISO (YYYY-MM-DD), tratadas como meia-noite UTC.
function diasEntre(inicioISO: string, fimISO: string): number {
  return Math.floor((Date.parse(`${fimISO}T00:00:00Z`) - Date.parse(`${inicioISO}T00:00:00Z`)) / 86400000);
}

Deno.serve(async (req) => {
  const recebido = req.headers.get("x-cron-secret") ?? "";
  if (!CRON_SECRETO || !timingSafeEqual(recebido, CRON_SECRETO)) {
    return json({ erro: "não autorizado" }, 401);
  }

  webpush.setVapidDetails(
    Deno.env.get("VAPID_SUBJECT")!,
    Deno.env.get("VAPID_PUBLIC_KEY")!,
    Deno.env.get("VAPID_PRIVATE_KEY")!,
  );

  const hoje = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  const categoria = categoriaDoDia(hoje);
  if (!categoria) return json({ enviados: 0, falhas: 0, candidatos: 0 }); // sábado

  const { data: programas, error: erroProgramas } = await supabase
    .from("mwa_programas")
    .select("user_id, data_inicio")
    .eq("status", "ativo")
    .or(`data_fim.is.null,data_fim.gte.${hoje}`);
  if (erroProgramas) return json({ erro: erroProgramas.message }, 500);

  // Uma pessoa pode ter mais de um programa ativo — guarda a data de início
  // mais antiga como âncora aproximada pro cálculo do dia do programa
  // (só usado na sexta, pra escolher o jogo da semana; imprecisão aqui é
  // cosmética, não afeta quem recebe o push).
  const ancoraPorUsuario = new Map<string, string>();
  for (const p of programas ?? []) {
    const atual = ancoraPorUsuario.get(p.user_id);
    if (!atual || p.data_inicio < atual) ancoraPorUsuario.set(p.user_id, p.data_inicio);
  }
  const userIds = [...ancoraPorUsuario.keys()];
  if (userIds.length === 0) return json({ enviados: 0, falhas: 0, candidatos: 0 });

  const { data: perfis, error: erroPerfis } = await supabase
    .from("mwa_perfis")
    .select("id, idioma, role")
    .in("id", userIds);
  if (erroPerfis) return json({ erro: erroPerfis.message }, 500);
  const idiomaPorUsuario = new Map((perfis ?? []).map((p) => [p.id, p.idioma]));
  const idsAdmin = new Set((perfis ?? []).filter((p) => p.role === "admin").map((p) => p.id));
  const candidatosIds = userIds.filter((id) => !idsAdmin.has(id));
  if (candidatosIds.length === 0) return json({ enviados: 0, falhas: 0, candidatos: 0 });

  // Resolve, por pessoa, qual tipo de evento em mwa_game_eventos significa
  // "já engajou hoje" — fixo pra todas as categorias, exceto sexta (jogo),
  // que depende do dia do programa de cada pessoa.
  const tipoEventoEsperado = new Map<string, string>();
  for (const id of candidatosIds) {
    if (categoria !== "jogo") {
      tipoEventoEsperado.set(id, TIPO_EVENTO_FIXO[categoria]);
      continue;
    }
    const ancora = ancoraPorUsuario.get(id)!;
    const ancoraISO = new Date(ancora).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
    const diaAtual = Math.min(90, Math.max(1, diasEntre(ancoraISO, hoje) + 1));
    const indice = Math.floor((diaAtual - 1) / 7) % JOGOS_SEXTA.length;
    tipoEventoEsperado.set(id, JOGOS_SEXTA[indice].tipoEvento);
  }

  const { data: eventosHoje, error: erroEventos } = await supabase
    .from("mwa_game_eventos")
    .select("user_id, tipo")
    .eq("ref", hoje)
    .in("user_id", candidatosIds);
  if (erroEventos) return json({ erro: erroEventos.message }, 500);
  const feitoHojePorUsuario = new Map<string, Set<string>>();
  for (const e of eventosHoje ?? []) {
    if (!feitoHojePorUsuario.has(e.user_id)) feitoHojePorUsuario.set(e.user_id, new Set());
    feitoHojePorUsuario.get(e.user_id)!.add(e.tipo);
  }

  const { data: jaEnviados, error: erroLog } = await supabase
    .from("mwa_push_log")
    .select("user_id")
    .eq("tipo", "funcao_dia")
    .eq("data", hoje)
    .in("user_id", candidatosIds);
  if (erroLog) return json({ erro: erroLog.message }, 500);
  const jaEnviadoHoje = new Set((jaEnviados ?? []).map((e) => e.user_id));

  const pendentes = candidatosIds.filter((id) => {
    const esperado = tipoEventoEsperado.get(id)!;
    const jaFeito = feitoHojePorUsuario.get(id)?.has(esperado) ?? false;
    return !jaFeito && !jaEnviadoHoje.has(id);
  });
  if (pendentes.length === 0) return json({ enviados: 0, falhas: 0, candidatos: 0 });

  const { data: inscricoes, error: erroInscricoes } = await supabase
    .from("mwa_push_inscricoes")
    .select("endpoint, user_id, p256dh, auth")
    .in("user_id", pendentes);
  if (erroInscricoes) return json({ erro: erroInscricoes.message }, 500);

  let enviados = 0;
  let falhas = 0;
  for (const inscricao of inscricoes ?? []) {
    const ingles = idiomaPorUsuario.get(inscricao.user_id) === "en-US";
    const esperado = tipoEventoEsperado.get(inscricao.user_id)!;
    const jogo = categoria === "jogo" ? JOGOS_SEXTA.find((j) => j.tipoEvento === esperado) : undefined;
    const texto = jogo ?? MENSAGENS_FIXAS[categoria];
    const payload = JSON.stringify({
      titulo: ingles ? texto.tituloEn : texto.titulo,
      corpo: ingles ? texto.corpoEn : texto.corpo,
      tag: `funcao_${hoje}`,
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
        { user_id: inscricao.user_id, tipo: "funcao_dia", data: hoje },
        { onConflict: "user_id,tipo,data" },
      );
      enviados++;
    } catch (erro) {
      const status = (erro as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 410) {
        await supabase.from("mwa_push_inscricoes").delete().eq("endpoint", inscricao.endpoint);
      } else {
        falhas++;
        console.error("falha ao enviar push (funcao do dia)", inscricao.user_id, erro);
      }
    }
  }

  return json({ enviados, falhas, candidatos: pendentes.length });
});
```

- [ ] **Step 2: Deploy the function**

Use the Supabase `deploy_edge_function` tool against project `kfavxgrvikflzyzvcoyb` with `name: "enviar-push-funcoes"`, `verify_jwt: false` (same justification as `enviar-push-estrela`: the function implements its own `x-cron-secret` auth, not Supabase JWT), and the file content above.

- [ ] **Step 3: Verify with an unauthorized request (should reject)**

Run (replace `<url>` with the deployed function URL):
```bash
curl -s -o /dev/null -w "%{http_code}" https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-funcoes
```
Expected: `401`.

- [ ] **Step 4: Verify with the correct secret (should run)**

Run (use the same `CRON_SECRETO` value already configured for `enviar-push-estrela` — check the Supabase dashboard's Edge Functions → Secrets, or ask the person who set it up):
```bash
curl -s -X POST https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-funcoes -H "x-cron-secret: <CRON_SECRETO>"
```
Expected: `200` with a JSON body like `{"enviados":0,"falhas":0,"candidatos":N}` — `N` may be 0 or more depending on today's weekday and who's already engaged.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/enviar-push-funcoes/index.ts
git commit -m "feat: adiciona edge function enviar-push-funcoes"
```

---

### Task 4: Retire the client-side "função do dia" reminder

**Files:**
- Modify: `src/App.jsx` (remove import and the `useEffect` that calls `lembrarFuncaoDoDia`)
- Delete: `src/utils/notificacaoFuncoes.js`
- Delete: `src/utils/notificacaoFuncoes.test.js`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Remove the import and effect from `App.jsx`**

Remove this import (currently right after the `pushSubscricao.js` import):

```js
import { lembrarFuncaoDoDia } from './utils/notificacaoFuncoes.js'
```

Remove this `useEffect` block (the "Lembrete diário rotativo das funções do app" one):

```js
  // Lembrete diário rotativo das funções do app (Reforçando Conceitos,
  // exercício, Fazenda, Lente da Consciência, jogo da semana, Versículo)
  useEffect(() => {
    const userId = sessao?.user?.id
    if (usuario && diaAtual && hoje && userId && !acessoBloqueado && usuario.role !== 'admin') {
      lembrarFuncaoDoDia({ userId, hoje, diaAtual, ingles, onAbrir: setAba })
    }
  }, [sessao, usuario, diaAtual, hoje, ingles, acessoBloqueado])
```

Before removing, check whether `diaAtual`, `hoje`, `ingles`, or `acessoBloqueado` are still used elsewhere in `AppInner` (they almost certainly are — `diaAtual`/`hoje` are used throughout, `acessoBloqueado` gates the early-return above, `ingles` comes from `useIdioma()` and is used elsewhere too) — do NOT remove their declarations, only this one `useEffect` block and the import.

- [ ] **Step 2: Delete the now-unused files**

```bash
rm src/utils/notificacaoFuncoes.js src/utils/notificacaoFuncoes.test.js
```

- [ ] **Step 3: Run the full test suite and build to verify nothing broke**

Run: `npm test`
Expected: all tests pass (the 4 tests from `notificacaoFuncoes.test.js` are gone, total count drops by 4; no failures).

Run: `npm run build`
Expected: build succeeds with no new errors (no remaining import of the deleted file).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git rm src/utils/notificacaoFuncoes.js src/utils/notificacaoFuncoes.test.js
git commit -m "feat: aposenta o lembrete local de funcao do dia (substituido por push real)"
```

---

### Task 5: Schedule the daily cron job and verify

**Files:**
- Create: `supabase/migrations/20260816120000_agendar_push_funcoes_cron.sql`

**Interfaces:**
- Consumes: the deployed Edge Function from Task 3, the existing `cron_secreto_push_estrela` Vault secret (already created for the Estrela push — reused, no new Vault secret needed since it's the same `CRON_SECRETO` value).
- Produces: a `pg_cron` job named `push-funcoes-diaria` that fires daily.

- [ ] **Step 1: Write the migration that schedules the cron job**

```sql
-- supabase/migrations/20260816120000_agendar_push_funcoes_cron.sql
select cron.schedule(
  'push-funcoes-diaria',
  '0 12 * * *', -- 12:00 UTC = 9:00 em Brasília (sem horário de verão hoje no Brasil)
  $$
  select net.http_post(
    url := 'https://kfavxgrvikflzyzvcoyb.supabase.co/functions/v1/enviar-push-funcoes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secreto_push_estrela')
    ),
    body := '{}'::jsonb
  );
  $$
);
```

Note: this reuses the *same* Vault secret name (`cron_secreto_push_estrela`) already created for the Estrela cron job — no new secret to create, since both jobs authenticate with the identical `CRON_SECRETO` value. `pg_cron`/`pg_net` extensions are already enabled from the previous migration, no need to re-create them.

- [ ] **Step 2: Apply the migration**

Use the Supabase `apply_migration` tool against project `kfavxgrvikflzyzvcoyb` with `name: "agendar_push_funcoes_cron"` and the SQL from Step 1.

- [ ] **Step 3: Verify the job is scheduled**

Use the Supabase `execute_sql` tool:
```sql
select jobname, schedule, active from cron.job where jobname = 'push-funcoes-diaria';
```
Expected: one row, `active = true`, `schedule = '0 12 * * *'`.

- [ ] **Step 4: Manual end-to-end verification**

1. Confirm today's weekday and what category it maps to (Sunday=Versículo, Monday=Conceitos, Tuesday=Exercício, Wednesday=Fazenda, Thursday=Lente, Friday=jogo da semana, Saturday=none).
2. Pick a test account that has NOT yet engaged with today's category (hasn't opened the relevant screen today, or hasn't exercised/played the relevant game if today is Tuesday/Friday) and DOES have a saved push subscription (from the Estrela push work already verified).
3. Manually trigger the function early (don't wait for 9h) with the curl command from Task 3 Step 4.
4. Expected: `{"enviados":1,...}` (or more), and a real system notification arrives — close the app first to confirm it still arrives with the app closed.
5. Tap the notification and confirm the app opens/focuses on the Ferramentas tab.
6. Run the same curl command again immediately. Expected: `{"enviados":0}` — blocked by `mwa_push_log`.
7. Open the relevant screen for that category (marking it as "viewed"), confirm via `execute_sql` that the right event now exists in `mwa_game_eventos`, then trigger the function a third time for a different, still-pending test account (if today isn't Saturday) to confirm the "already engaged" filter correctly skips someone who's already done it — or, simpler, re-check the first test account's exclusion logic by inspecting the query results directly via `execute_sql` rather than a third real device test.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260816120000_agendar_push_funcoes_cron.sql
git commit -m "feat: agenda push diario da funcao do dia via pg_cron"
```
