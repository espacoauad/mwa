# Cápsula do Tempo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the day-90 celebration screen, show a "Cápsula do Tempo" section that replays the person's day-1 intention (reusing answers already collected during onboarding), an optional before/after photo comparison, and a fixed closing message from Wanessa.

**Architecture:** No new database schema. `perfilParaUsuario` (the `mwa_perfis` → `usuario` object mapper in `AppContext.jsx`) gains one field so `usuario.personalizacao` becomes available app-wide. `Conclusao90Dias.jsx` gains a new section that reuses the already-tested `montarFraseRecepcao` from `src/utils/personalizacao.js` and the already-loaded `pesagens` array — pure UI addition to an existing screen.

**Tech Stack:** React 18 (Vite), Tailwind, `node --test` for pure-function unit tests (none new in this plan — see Global Constraints).

## Global Constraints

- No new database tables, columns, or migrations — this feature only reads `mwa_perfis.personalizacao` and `mwa_pesagens.fotos`, both of which already exist.
- The Cápsula do Tempo section renders only when `usuario.personalizacao?.foco` resolves to a non-null fragment via `montarFraseRecepcao` — accounts without onboarding personalization data (created before that feature existed) see no section, no error, no empty gap.
- The photo comparison block renders only when: `pesagens.length >= 2`, the first and last pesagem are not the same record, and both have `fotos.frente` set.
- The closing message is fixed, identical for every user, no name interpolation — copied verbatim from the spec below, do not paraphrase.
- No React component-testing harness exists in this repo (`node --test` runs plain `.js` files only, cannot import `.jsx`) — `Conclusao90Dias.jsx`'s new section is verified manually in a browser (last task), not via automated component tests.

---

### Task 1: Expose `personalizacao` on the `usuario` object

**Files:**
- Modify: `src/context/AppContext.jsx:35-55` (the `perfilParaUsuario` function)

**Interfaces:**
- Produces: `usuario.personalizacao` — an object with keys `foco`, `focoOutro`, `obstaculo`, `obstaculoOutro`, `rotina`, `rotinaOutro`, `sentimentoEsperado`, `sentimentoEsperadoOutro`, `sono`, `hidratacao`, `habitosAlimentares`, `intestino`, `disposicao` (the shape written by `montarPersonalizacaoParaSalvar` in `src/utils/personalizacao.js`, unchanged by this plan) — or `{}` for accounts with no personalization data. Consumed by Task 2.

- [ ] **Step 1: Add the field to `perfilParaUsuario`**

In `src/context/AppContext.jsx`, the `perfilParaUsuario` function currently ends with:

```js
    role: p.role ?? 'user',
    fotoUrl: p.foto_url ?? null,
    idioma: p.idioma ?? 'pt-BR',
  }
}
```

Add one line, right after `idioma`:

```js
    role: p.role ?? 'user',
    fotoUrl: p.foto_url ?? null,
    idioma: p.idioma ?? 'pt-BR',
    personalizacao: p.personalizacao ?? {},
  }
}
```

- [ ] **Step 2: Run the full test suite and production build**

Run: `npm test`
Expected: PASS (no test in this repo exercises `perfilParaUsuario` directly — this is a plain data-mapping change with no pure-function test to add; see Global Constraints. One pre-existing unrelated failure in `src/data/farm/integridade.test.js` is expected and not your concern).

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: expoe personalizacao no objeto usuario"
```

---

### Task 2: "Cápsula do Tempo" section in `Conclusao90Dias.jsx`

**Files:**
- Modify: `src/components/game/Conclusao90Dias.jsx`

**Interfaces:**
- Consumes: `usuario.personalizacao` (Task 1), `montarFraseRecepcao(dados) => { foco, sentimento }` (already exists, from `src/utils/personalizacao.js`), `pesagens` array (already destructured from `useApp()` in this file at the existing line `const { usuario, sessao, metas, game, pesagens, fecharConclusao90 } = useApp()`).

- [ ] **Step 1: Import `montarFraseRecepcao`**

At the top of `src/components/game/Conclusao90Dias.jsx`, add this import next to the other imports (after the `LogoMWA` import, before `CertificadoConclusao`):

```js
import { montarFraseRecepcao } from '../../utils/personalizacao.js'
```

- [ ] **Step 2: Compute the capsule data**

Right after the existing line `const kgEquivalentes = caloriasEconomizadas ? Math.round((caloriasEconomizadas / 7700) * 10) / 10 : null`, add:

```js
  const { foco, sentimento } = montarFraseRecepcao(usuario?.personalizacao ?? {})
  const primeiraPesagem = pesagens[0]
  const ultimaPesagem = pesagens[pesagens.length - 1]
  const mostrarFotosCapsula =
    pesagens.length >= 2 &&
    primeiraPesagem?.id !== ultimaPesagem?.id &&
    Boolean(primeiraPesagem?.fotos?.frente) &&
    Boolean(ultimaPesagem?.fotos?.frente)
```

- [ ] **Step 3: Render the section**

The current JSX has this structure (title block, then the numbers grid):

```jsx
          <p className="mt-2 text-sm italic text-white/80">Você não é mais alguém que tenta. Você é alguém que é.</p>
        </div>

        {/* Números da jornada - PREMIUM CELEBRATIVO */}
        <div className="grid w-full max-w-sm grid-cols-3 gap-3">
```

Insert the new section between the closing `</div>` of the title block and the numbers-grid comment:

```jsx
          <p className="mt-2 text-sm italic text-white/80">Você não é mais alguém que tenta. Você é alguém que é.</p>
        </div>

        {/* Cápsula do Tempo — relembra a intenção do dia 1 */}
        {foco && sentimento && (
          <div className="w-full max-w-sm rounded-3xl border-2 border-ouro/40 bg-white/10 p-6 backdrop-blur-md">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-ouro/80">
              Cápsula do Tempo
            </p>
            <p className="text-center text-sm leading-relaxed text-white/90">
              No primeiro dia, seu foco era <strong className="text-ouro">{foco}</strong>, e você esperava terminar se sentindo <strong className="text-ouro">{sentimento}</strong>.
            </p>
            {mostrarFotosCapsula && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <img
                    src={primeiraPesagem.fotos.frente}
                    alt="Foto do dia 1"
                    className="aspect-[3/4] w-full rounded-xl object-cover"
                  />
                  <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-white/60">Dia 1</p>
                </div>
                <div className="text-center">
                  <img
                    src={ultimaPesagem.fotos.frente}
                    alt="Foto de hoje"
                    className="aspect-[3/4] w-full rounded-xl object-cover"
                  />
                  <p className="mt-1.5 text-[11px] font-bold uppercase tracking-widest text-white/60">Hoje</p>
                </div>
              </div>
            )}
            <p className="mt-5 text-center text-sm italic leading-relaxed text-white/85">
              "Quando você começou, escreveu o que esperava sentir ao final desses 90 dias. Hoje, esse dia chegou. Não importa se cada meta foi cumprida à risca — o que importa é a constância que você construiu, dia após dia, e isso já é a maior prova de que você é capaz de sustentar uma mudança de verdade. Estou muito orgulhosa de você."
            </p>
            <p className="mt-2 text-center text-xs font-semibold text-ouro/70">Com carinho, Wanessa</p>
          </div>
        )}

        {/* Números da jornada - PREMIUM CELEBRATIVO */}
        <div className="grid w-full max-w-sm grid-cols-3 gap-3">
```

- [ ] **Step 4: Run the full test suite and production build**

Run: `npm test`
Expected: PASS (same pre-existing unrelated failure as every prior task in this session, nothing new).

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/game/Conclusao90Dias.jsx
git commit -m "feat: adiciona secao Capsula do Tempo na tela de encerramento do dia 90"
```

---

### Task 3: Manual verification in the browser

No React component-testing harness exists in this repo (see Global Constraints), so this feature must be verified manually against a running dev server.

- [ ] **Step 1: Start the dev server**

Use the project's normal dev workflow (`npm run dev`).

- [ ] **Step 2: Create a disposable test account with personalization data and 2 weigh-ins with front photos**

Sign up, confirm the email via the Supabase MCP `execute_sql` tool (`update auth.users set email_confirmed_at = now() where email = '<test-email>';`, project_id `kfavxgrvikflzyzvcoyb`), and complete onboarding — answer the Personalização screen (`foco` and `sentimentoEsperado` are required to reach the final screen). Then, from the app's Progresso screen, register 2 weigh-ins, each with a "frente" photo attached (or, if that's awkward to do through the UI in this pass, insert two `mwa_pesagens` rows directly via `execute_sql` with distinct `data` values and a `fotos: {"frente": "<any reachable image URL>"}` jsonb payload for each — either approach is fine, the goal is to end up with 2 pesagens where `fotos.frente` is set on both).

- [ ] **Step 3: Force the program into its day-90 state and open the conclusion screen**

`Conclusao90Dias` (in its normal, non-blocked form — not the `persistente` upsell variant) only mounts when `diaAtual === 90` AND there's an active 90-day program (`programa90Ativo`, derived from a `mwa_programas` row with `tipo = '90d'` and `status = 'ativo'`). This app already has a built-in "Modo de Revisão" that overrides `diaAtual` via `sessionStorage` (see `src/utils/calculos.js`'s `diaDoPrograma`), which avoids having to backdate any real dates.

Via the Supabase MCP `execute_sql` tool (project_id `kfavxgrvikflzyzvcoyb`), give the test account an active 90-day program:

```sql
insert into public.mwa_programas (user_id, tipo, status, origem, data_inicio)
values ('<test-user-id>', '90d', 'ativo', 'manual_teste', now());
```

Then, in the browser (via the app's own JS context — e.g. through the browser tooling's JS-execution capability), set the review-mode override and reload:

```js
sessionStorage.setItem('mwaModorevisao', JSON.stringify({ ativo: true, diaVisualizacao: 90 }))
```

- [ ] **Step 4: Confirm the Cápsula do Tempo section**

With the conclusion screen open, confirm:
- The "Cápsula do Tempo" section appears, positioned between the title block and the numbers grid.
- The relato-inicial sentence correctly shows the `foco` and `sentimentoEsperado` chosen during onboarding, formatted the same way as the onboarding reception sentence.
- The before/after photo block appears, showing the two photos with "Dia 1" / "Hoje" labels.
- The fixed closing message renders exactly as written in the spec, signed "Com carinho, Wanessa".

- [ ] **Step 5: Confirm graceful hiding for an account without personalization**

Using a second disposable test account that skips or never had onboarding personalization (or by clearing `personalizacao` to `{}` for the test account via `execute_sql` and reloading), confirm the conclusion screen renders normally with the Cápsula do Tempo section absent — no visual gap, no console error.

- [ ] **Step 6: Confirm graceful hiding of the photo block only**

For a test account with personalization but only 1 pesagem (or 2 pesagens where at least one lacks `fotos.frente`), confirm the Cápsula do Tempo section still renders (relato inicial + closing message) but without the photo comparison block.

- [ ] **Step 7: Clean up the test accounts**

Delete both disposable test accounts (auth user + `mwa_perfis` row + any `mwa_pesagens`/`mwa_programas` rows created for the test) via the Supabase MCP tools, matching how test accounts were cleaned up in prior testing sessions in this repo.
