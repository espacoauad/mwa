# Refeições Agrupadas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reestruturar o lançamento de refeições no app MWA para que uma refeição (Café da manhã/Almoço/etc) agrupe múltiplos alimentos com uma única foto e horário, corrigindo também o bug de a foto nunca persistir de verdade.

**Architecture:** `mwa_refeicoes` passa a representar a refeição (uma linha por tipo+dia); nova tabela `mwa_refeicoes_itens` guarda os alimentos dentro dela (FK `refeicao_id`). Fluxo de UI em 3 telas: escolher tipo → refeição aberta (foto, itens, horário) → adicionar alimento (busca/manual). Foto sobe pro Supabase Storage.

**Tech Stack:** React 18 + Vite, Supabase (Postgres + Auth + Storage), Tailwind, `node:test` para testes de funções puras.

## Global Constraints

- Projeto Supabase de produção: `kfavxgrvikflzyzvcoyb` — contém dados reais de usuárias já cadastradas. A migração de dados (Task 1) precisa ser cuidadosa e reversível até o momento de aplicar em produção.
- Restrição única `(user_id, data, tipo)` em `mwa_refeicoes`: reabrir uma refeição do mesmo tipo no mesmo dia em vez de duplicar.
- Filtros de busca de alimento ficam só: Todos, Recentes, Favoritos, Meus Alimentos (remove Estados Unidos e categorias).
- Sem framework de mock/teste de componentes React no projeto — funções puras (mappers) ganham testes reais com `node:test`; componentes React são verificados manualmente via `npm run dev`.
- Build de produção: `npm run build` (Vite). Deploy: Netlify, site `metodomwa` (siteId `7d9d91bc-3b70-436b-ad09-192565c87121`).

---

### Task 1: Banco de dados — nova estrutura, Storage, migração dos dados

**Files:**
- Create: `supabase/migrations/20260809000000_reestruturar_refeicoes.sql`

**Interfaces:**
- Produces: tabela `mwa_refeicoes` redefinida (colunas: `id, user_id, data, tipo, horario, foto_url, criado_em`), tabela nova `mwa_refeicoes_itens` (colunas: `id, refeicao_id, nome, marca, alimento_id, quantidade, quantidade_base, medida_id, medida_nome, manual, calorias, proteina, carbos, gordura, fibras, criado_em`), bucket de Storage `fotos-refeicoes`.

- [ ] **Step 1: Escrever a migration**

```sql
-- supabase/migrations/20260809000000_reestruturar_refeicoes.sql

-- 1) Nova tabela de itens (alimentos dentro de uma refeição)
create table public.mwa_refeicoes_itens (
  id uuid primary key default gen_random_uuid(),
  refeicao_id uuid not null references public.mwa_refeicoes(id) on delete cascade,
  nome text not null,
  marca text,
  alimento_id text,
  quantidade numeric not null,
  quantidade_base numeric not null,
  medida_id text not null,
  medida_nome text not null,
  manual boolean not null default false,
  calorias integer not null default 0,
  proteina numeric not null default 0,
  carbos numeric not null default 0,
  gordura numeric not null default 0,
  fibras numeric not null default 0,
  criado_em timestamptz not null default now()
);

alter table public.mwa_refeicoes_itens enable row level security;

create policy "itens da propria refeicao"
  on public.mwa_refeicoes_itens
  for all
  using (
    exists (
      select 1 from public.mwa_refeicoes r
      where r.id = refeicao_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.mwa_refeicoes r
      where r.id = refeicao_id and r.user_id = auth.uid()
    )
  );

-- 2) Migra os dados existentes: cada linha antiga de mwa_refeicoes era um
--    alimento solto. Agrupa por (user_id, data, tipo) em refeicoes novas,
--    e move cada alimento para mwa_refeicoes_itens.

-- 2a) tabela temporaria com o id da futura "refeicao" pra cada grupo
create temporary table _grupos as
select
  user_id, data, tipo,
  min(horario) as horario,
  gen_random_uuid() as nova_refeicao_id
from public.mwa_refeicoes
group by user_id, data, tipo;

-- 2b) copia cada alimento antigo pra mwa_refeicoes_itens, ligado ao grupo
insert into public.mwa_refeicoes_itens
  (refeicao_id, nome, marca, alimento_id, quantidade, quantidade_base,
   medida_id, medida_nome, manual, calorias, proteina, carbos, gordura, fibras, criado_em)
select
  g.nova_refeicao_id,
  r.nome, r.marca, r.alimento_id, r.quantidade, r.quantidade_base,
  r.medida_id, r.medida_nome, coalesce(r.manual, false),
  r.calorias, r.proteina, r.carbos, r.gordura, r.fibras, r.criado_em
from public.mwa_refeicoes r
join _grupos g on g.user_id = r.user_id and g.data = r.data and g.tipo = r.tipo;

-- 3) Recria mwa_refeicoes com a nova forma (uma linha por refeicao)
alter table public.mwa_refeicoes rename to _mwa_refeicoes_antiga;

create table public.mwa_refeicoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null,
  tipo text not null,
  horario time not null,
  foto_url text,
  criado_em timestamptz not null default now(),
  unique (user_id, data, tipo)
);

alter table public.mwa_refeicoes enable row level security;

create policy "refeicoes da propria usuaria"
  on public.mwa_refeicoes
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

insert into public.mwa_refeicoes (id, user_id, data, tipo, horario, criado_em)
select nova_refeicao_id, user_id, data, tipo, horario, now()
from _grupos;

drop table public._mwa_refeicoes_antiga;
drop table _grupos;

-- 4) Bucket de Storage pras fotos de refeicao
insert into storage.buckets (id, name, public)
values ('fotos-refeicoes', 'fotos-refeicoes', true)
on conflict (id) do nothing;

create policy "le fotos de refeicao publicamente"
  on storage.objects for select
  using (bucket_id = 'fotos-refeicoes');

create policy "sobe foto na propria pasta"
  on storage.objects for insert
  with check (bucket_id = 'fotos-refeicoes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "atualiza foto na propria pasta"
  on storage.objects for update
  using (bucket_id = 'fotos-refeicoes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "apaga foto na propria pasta"
  on storage.objects for delete
  using (bucket_id = 'fotos-refeicoes' and (storage.foldername(name))[1] = auth.uid()::text);
```

- [ ] **Step 2: Aplicar a migration no projeto de produção**

Usar a ferramenta MCP do Supabase (`apply_migration`, projeto `kfavxgrvikflzyzvcoyb`, nome `reestruturar_refeicoes`) com o conteúdo do Step 1.

- [ ] **Step 3: Verificar a migração com queries diretas**

Rodar via `execute_sql` no mesmo projeto:

```sql
-- Confere que nenhum dado nutricional foi perdido: soma de calorias antes/depois deve bater
-- (rodar ANTES de aplicar a migration e guardar o número, depois comparar com isto):
select round(sum(calorias)) as total_calorias from public.mwa_refeicoes_itens;

-- Confere que cada usuaria+dia+tipo aparece só uma vez em mwa_refeicoes:
select user_id, data, tipo, count(*) from public.mwa_refeicoes group by 1,2,3 having count(*) > 1;
-- Esperado: 0 linhas

-- Confere que o bucket foi criado:
select id, public from storage.buckets where id = 'fotos-refeicoes';
-- Esperado: 1 linha, public = true
```

Expected: total de calorias igual ao valor somado antes da migração (nenhum dado perdido); zero linhas duplicadas; bucket existe.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260809000000_reestruturar_refeicoes.sql
git commit -m "feat: reestrutura mwa_refeicoes para agrupar alimentos por refeicao"
```

---

### Task 2: Funções puras de mapeamento (banco ↔ app) com testes

**Files:**
- Create: `src/utils/refeicoes.js`
- Test: `src/utils/refeicoes.test.js`

**Interfaces:**
- Produces:
  - `itemDoBanco(linha)` → `{ id, alimentoId, nome, marca, quantidade, quantidadeBase, medidaId, medidaNome, manual, calorias, proteina, carbos, gordura, fibras }`
  - `itemParaBanco(item)` → objeto pronto pra insert/update em `mwa_refeicoes_itens` (sem `id`, sem `refeicao_id`)
  - `refeicaoDoBanco(linha, itensDoBanco)` → `{ id, data, tipo, horario, fotoUrl, itens: [itemDoBanco(...), ...] }`
  - `totaisDaRefeicao(refeicao)` → `{ calorias, proteina, carbos, gordura, fibras }` (soma dos itens)

- [ ] **Step 1: Escrever os testes (falhando)**

```javascript
// src/utils/refeicoes.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { itemDoBanco, itemParaBanco, refeicaoDoBanco, totaisDaRefeicao } from './refeicoes.js'

test('itemDoBanco converte linha do banco pro formato do app', () => {
  const linha = {
    id: 'item-1', alimento_id: 'arroz-cozido', nome: 'Arroz cozido', marca: null,
    quantidade: 100, quantidade_base: 100, medida_id: 'g', medida_nome: '100 g',
    manual: false, calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6,
  }
  assert.deepEqual(itemDoBanco(linha), {
    id: 'item-1', alimentoId: 'arroz-cozido', nome: 'Arroz cozido', marca: null,
    quantidade: 100, quantidadeBase: 100, medidaId: 'g', medidaNome: '100 g',
    manual: false, calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6,
  })
})

test('itemParaBanco converte item do app pro formato do banco, sem id', () => {
  const item = {
    alimentoId: 'feijao-cozido', nome: 'Feijão cozido', marca: null,
    quantidade: 80, quantidadeBase: 80, medidaId: 'g', medidaNome: '80 g',
    manual: false, calorias: 55, proteina: 3.6, carbos: 10, gordura: 0.3, fibras: 3.5,
  }
  assert.deepEqual(itemParaBanco(item), {
    alimento_id: 'feijao-cozido', nome: 'Feijão cozido', marca: null,
    quantidade: 80, quantidade_base: 80, medida_id: 'g', medida_nome: '80 g',
    manual: false, calorias: 55, proteina: 3.6, carbos: 10, gordura: 0.3, fibras: 3.5,
  })
})

test('refeicaoDoBanco agrupa a refeicao com seus itens', () => {
  const linha = { id: 'ref-1', data: '2026-08-09', tipo: 'Almoço', horario: '12:30', foto_url: null }
  const itensBanco = [
    { id: 'item-1', alimento_id: 'arroz-cozido', nome: 'Arroz cozido', marca: null, quantidade: 100, quantidade_base: 100, medida_id: 'g', medida_nome: '100 g', manual: false, calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6 },
  ]
  const refeicao = refeicaoDoBanco(linha, itensBanco)
  assert.equal(refeicao.id, 'ref-1')
  assert.equal(refeicao.tipo, 'Almoço')
  assert.equal(refeicao.fotoUrl, null)
  assert.equal(refeicao.itens.length, 1)
  assert.equal(refeicao.itens[0].nome, 'Arroz cozido')
})

test('totaisDaRefeicao soma os macros de todos os itens', () => {
  const refeicao = {
    itens: [
      { calorias: 130, proteina: 2.7, carbos: 28, gordura: 0.3, fibras: 1.6 },
      { calorias: 55, proteina: 3.6, carbos: 10, gordura: 0.3, fibras: 3.5 },
    ],
  }
  assert.deepEqual(totaisDaRefeicao(refeicao), {
    calorias: 185, proteina: 6.3, carbos: 38, gordura: 0.6, fibras: 5.1,
  })
})

test('totaisDaRefeicao com refeicao vazia retorna zeros', () => {
  assert.deepEqual(totaisDaRefeicao({ itens: [] }), {
    calorias: 0, proteina: 0, carbos: 0, gordura: 0, fibras: 0,
  })
})
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `node --test src/utils/refeicoes.test.js`
Expected: FAIL — `Cannot find module './refeicoes.js'`

- [ ] **Step 3: Implementar `src/utils/refeicoes.js`**

```javascript
// src/utils/refeicoes.js

export function itemDoBanco(linha) {
  return {
    id: linha.id,
    alimentoId: linha.alimento_id,
    nome: linha.nome,
    marca: linha.marca,
    quantidade: linha.quantidade,
    quantidadeBase: linha.quantidade_base,
    medidaId: linha.medida_id,
    medidaNome: linha.medida_nome,
    manual: linha.manual,
    calorias: linha.calorias,
    proteina: linha.proteina,
    carbos: linha.carbos,
    gordura: linha.gordura,
    fibras: linha.fibras,
  }
}

export function itemParaBanco(item) {
  return {
    alimento_id: item.alimentoId ?? null,
    nome: item.nome,
    marca: item.marca ?? null,
    quantidade: item.quantidade,
    quantidade_base: item.quantidadeBase,
    medida_id: item.medidaId,
    medida_nome: item.medidaNome,
    manual: item.manual,
    calorias: item.calorias,
    proteina: item.proteina,
    carbos: item.carbos,
    gordura: item.gordura,
    fibras: item.fibras,
  }
}

export function refeicaoDoBanco(linha, itensDoBanco = []) {
  return {
    id: linha.id,
    data: linha.data,
    tipo: linha.tipo,
    horario: linha.horario,
    fotoUrl: linha.foto_url,
    itens: itensDoBanco.map(itemDoBanco),
  }
}

export function totaisDaRefeicao(refeicao) {
  const t = { calorias: 0, proteina: 0, carbos: 0, gordura: 0, fibras: 0 }
  for (const item of refeicao.itens) {
    t.calorias += item.calorias
    t.proteina += item.proteina
    t.carbos += item.carbos
    t.gordura += item.gordura
    t.fibras += item.fibras
  }
  return {
    calorias: Math.round(t.calorias),
    proteina: Math.round(t.proteina * 10) / 10,
    carbos: Math.round(t.carbos * 10) / 10,
    gordura: Math.round(t.gordura * 10) / 10,
    fibras: Math.round(t.fibras * 10) / 10,
  }
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `node --test src/utils/refeicoes.test.js`
Expected: PASS (5 testes)

- [ ] **Step 5: Commit**

```bash
git add src/utils/refeicoes.js src/utils/refeicoes.test.js
git commit -m "feat: adiciona mappers puros pra refeicoes agrupadas, com testes"
```

---

### Task 3: `src/lib/storage.js` — upload da foto de refeição

**Files:**
- Create: `src/lib/storage.js`

**Interfaces:**
- Consumes: `supabase` de `src/lib/supabase.js`
- Produces: `uploadFotoRefeicao(userId, refeicaoId, arquivo)` → `Promise<string>` (URL pública) ou lança erro.

- [ ] **Step 1: Implementar**

```javascript
// src/lib/storage.js
import { supabase } from './supabase.js'

export async function uploadFotoRefeicao(userId, refeicaoId, arquivo) {
  const caminho = `${userId}/${refeicaoId}.jpg`
  const { error } = await supabase.storage
    .from('fotos-refeicoes')
    .upload(caminho, arquivo, { upsert: true, contentType: arquivo.type || 'image/jpeg' })
  if (error) throw error
  const { data } = supabase.storage.from('fotos-refeicoes').getPublicUrl(caminho)
  return `${data.publicUrl}?v=${Date.now()}`
}

export async function removerFotoRefeicao(userId, refeicaoId) {
  await supabase.storage.from('fotos-refeicoes').remove([`${userId}/${refeicaoId}.jpg`])
}
```

O `?v=${Date.now()}` na URL evita que o navegador mostre a foto antiga em cache quando a usuária troca a foto de uma refeição já existente (mesmo caminho de arquivo, conteúdo novo).

- [ ] **Step 2: Verificação manual**

Não há como testar upload real sem rede/credenciais em `node --test`. A verificação acontece na Task 6, ao usar a função de dentro do app rodando (`npm run dev`), confirmando que a foto aparece depois de recarregar a página (prova de que persistiu de verdade, ao contrário do bug antigo).

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.js
git commit -m "feat: adiciona upload de foto de refeicao pro Supabase Storage"
```

---

### Task 4: `AppContext.jsx` — leitura agrupada (fetch + estado)

**Files:**
- Modify: `src/context/AppContext.jsx`

**Interfaces:**
- Consumes: `refeicaoDoBanco` de `src/utils/refeicoes.js` (Task 2)
- Produces: estado `refeicoes` passa a ser um array de refeições agrupadas (cada uma com `.itens`); `refeicoesHoje` e `totaisHoje` continuam existindo com o mesmo formato de saída (nenhum outro componente precisa mudar por causa desses dois).

- [ ] **Step 1: Trocar o import dos mappers antigos pelos novos**

Em `src/context/AppContext.jsx`, localizar o bloco (linhas 62–76 atualmente):

```javascript
function refeicaoDoBanco(r) {
  return {
    id: r.id,
    data: r.data,
    horario: r.horario,
    tipo: r.tipo,
    nome: r.nome,
    calorias: Number(r.calorias),
    proteina: Number(r.proteina),
    carbos: Number(r.carbos),
    gordura: Number(r.gordura),
    fibras: Number(r.fibras),
    ...(r.detalhes ?? {}),
  }
}

function refeicaoParaBanco(ref) {
  const { id, data, horario, tipo, nome, calorias, proteina, carbos, gordura, fibras, ...detalhes } = ref
  return {
    horario,
```
(e o restante da função `refeicaoParaBanco` logo abaixo)

Apagar as duas funções inteiras (`refeicaoDoBanco` e `refeicaoParaBanco`) e, no topo do arquivo, adicionar o import:

```javascript
import { itemDoBanco, itemParaBanco, refeicaoDoBanco, totaisDaRefeicao } from '../utils/refeicoes.js'
```

- [ ] **Step 2: Atualizar a busca inicial de refeições (efeito `carregar`)**

Localizar, dentro da função `carregar()`, a linha:

```javascript
        supabase.from('mwa_refeicoes').select('*').eq('user_id', userId).eq('data', hoje),
```

Trocar por uma busca que já traz os itens de cada refeição (select aninhado do Supabase):

```javascript
        supabase.from('mwa_refeicoes').select('*, mwa_refeicoes_itens(*)').eq('user_id', userId).eq('data', hoje),
```

Localizar a linha que mapeia o resultado:

```javascript
      setRefeicoes((refs.data ?? []).map(refeicaoDoBanco))
```

Trocar por:

```javascript
      setRefeicoes((refs.data ?? []).map((r) => refeicaoDoBanco(r, r.mwa_refeicoes_itens)))
```

- [ ] **Step 3: Atualizar `totaisHoje` pra somar os itens de todas as refeições**

Localizar (linhas 367–383 atualmente):

```javascript
  const totaisHoje = useMemo(() => {
    const t = { calorias: 0, proteina: 0, carbos: 0, gordura: 0, fibras: 0 }
    for (const r of refeicoesHoje) {
      t.calorias += r.calorias
      t.proteina += r.proteina
      t.carbos += r.carbos
      t.gordura += r.gordura
      t.fibras += r.fibras
    }
    return {
      calorias: Math.round(t.calorias),
      proteina: Math.round(t.proteina * 10) / 10,
      carbos: Math.round(t.carbos * 10) / 10,
      gordura: Math.round(t.gordura * 10) / 10,
      fibras: Math.round(t.fibras * 10) / 10,
    }
  }, [refeicoesHoje])
```

Trocar por:

```javascript
  const totaisHoje = useMemo(() => {
    const t = { calorias: 0, proteina: 0, carbos: 0, gordura: 0, fibras: 0 }
    for (const refeicao of refeicoesHoje) {
      const totaisRefeicao = totaisDaRefeicao(refeicao)
      t.calorias += totaisRefeicao.calorias
      t.proteina += totaisRefeicao.proteina
      t.carbos += totaisRefeicao.carbos
      t.gordura += totaisRefeicao.gordura
      t.fibras += totaisRefeicao.fibras
    }
    return {
      calorias: Math.round(t.calorias),
      proteina: Math.round(t.proteina * 10) / 10,
      carbos: Math.round(t.carbos * 10) / 10,
      gordura: Math.round(t.gordura * 10) / 10,
      fibras: Math.round(t.fibras * 10) / 10,
    }
  }, [refeicoesHoje])
```

- [ ] **Step 4: Verificação manual**

Run: `npm run build`
Expected: build conclui sem erro (ainda não usamos `itemParaBanco` nem alteramos as ações — isso é a Task 5 — mas o import precisa resolver sem erro de sintaxe).

- [ ] **Step 5: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: AppContext passa a buscar refeicoes com itens agrupados"
```

---

### Task 5: `AppContext.jsx` — ações (criar refeição, adicionar/editar/remover item, remover refeição, trocar foto)

**Files:**
- Modify: `src/context/AppContext.jsx`

**Interfaces:**
- Consumes: `itemParaBanco` (Task 2), `uploadFotoRefeicao`/`removerFotoRefeicao` (Task 3)
- Produces (novas funções expostas pelo contexto, substituindo `adicionarRefeicao`/`atualizarRefeicao`/`removerRefeicao`):
  - `obterOuCriarRefeicao(tipo)` → `Promise<refeicao>`
  - `adicionarItemRefeicao(refeicaoId, item)` → `Promise<void>`
  - `atualizarItemRefeicao(refeicaoId, itemId, dados)` → `Promise<void>`
  - `removerItemRefeicao(refeicaoId, itemId)` → `Promise<void>`
  - `removerRefeicaoCompleta(refeicaoId)` → `Promise<void>`
  - `atualizarFotoRefeicao(refeicaoId, arquivo)` → `Promise<void>`

- [ ] **Step 1: Substituir `adicionarRefeicao`/`atualizarRefeicao`/`removerRefeicao`**

Localizar (linhas 594–616 atualmente):

```javascript
  async function adicionarRefeicao(refeicao) {
    const { data, error } = await supabase
      .from('mwa_refeicoes')
      .insert({ user_id: userId, data: hoje, ...refeicaoParaBanco(refeicao) })
      .select()
      .single()
    if (!error) {
      setRefeicoes((rs) => [...rs, refeicaoDoBanco(data)])
      await registrarSessao(userId, 'atividade', { acao: 'refeicao_adicionada', tipo: refeicao.tipo })
      // +5 🌱 por tipo de refeição por dia (café, almoço, jantar...)
      await premiar('refeicao', `${hoje}:${refeicao.tipo}`)
    }
  }

  async function atualizarRefeicao(id, dados) {
    setRefeicoes((rs) => rs.map((r) => (r.id === id ? { ...r, ...dados } : r)))
    await supabase.from('mwa_refeicoes').update(refeicaoParaBanco(dados)).eq('id', id)
  }

  async function removerRefeicao(id) {
    setRefeicoes((rs) => rs.filter((r) => r.id !== id))
    await supabase.from('mwa_refeicoes').delete().eq('id', id)
  }
```

Trocar pelo bloco inteiro abaixo:

```javascript
  async function obterOuCriarRefeicao(tipo) {
    const existente = refeicoesHoje.find((r) => r.tipo === tipo)
    if (existente) return existente

    const { data, error } = await supabase
      .from('mwa_refeicoes')
      .insert({ user_id: userId, data: hoje, tipo, horario: horarioAgora() })
      .select()
      .single()
    if (error) throw error

    const nova = refeicaoDoBanco(data, [])
    setRefeicoes((rs) => [...rs, nova])
    await registrarSessao(userId, 'atividade', { acao: 'refeicao_criada', tipo })
    return nova
  }

  async function adicionarItemRefeicao(refeicaoId, item) {
    const { data, error } = await supabase
      .from('mwa_refeicoes_itens')
      .insert({ refeicao_id: refeicaoId, ...itemParaBanco(item) })
      .select()
      .single()
    if (error) throw error

    const novoItem = itemDoBanco(data)
    setRefeicoes((rs) =>
      rs.map((r) => (r.id === refeicaoId ? { ...r, itens: [...r.itens, novoItem] } : r)),
    )
    const refeicao = refeicoesHoje.find((r) => r.id === refeicaoId)
    if (refeicao) await premiar('refeicao', `${hoje}:${refeicao.tipo}`)
  }

  async function atualizarItemRefeicao(refeicaoId, itemId, dados) {
    setRefeicoes((rs) =>
      rs.map((r) =>
        r.id === refeicaoId
          ? { ...r, itens: r.itens.map((i) => (i.id === itemId ? { ...i, ...dados } : i)) }
          : r,
      ),
    )
    await supabase.from('mwa_refeicoes_itens').update(itemParaBanco(dados)).eq('id', itemId)
  }

  async function removerItemRefeicao(refeicaoId, itemId) {
    const refeicao = refeicoes.find((r) => r.id === refeicaoId)
    const itensRestantes = (refeicao?.itens ?? []).filter((i) => i.id !== itemId)

    if (itensRestantes.length === 0) {
      // Sem alimentos, a refeição inteira some da lista
      setRefeicoes((rs) => rs.filter((r) => r.id !== refeicaoId))
      await supabase.from('mwa_refeicoes_itens').delete().eq('id', itemId)
      await supabase.from('mwa_refeicoes').delete().eq('id', refeicaoId)
      if (refeicao?.fotoUrl) await removerFotoRefeicao(userId, refeicaoId)
    } else {
      setRefeicoes((rs) =>
        rs.map((r) => (r.id === refeicaoId ? { ...r, itens: itensRestantes } : r)),
      )
      await supabase.from('mwa_refeicoes_itens').delete().eq('id', itemId)
    }
  }

  async function removerRefeicaoCompleta(refeicaoId) {
    const refeicao = refeicoes.find((r) => r.id === refeicaoId)
    setRefeicoes((rs) => rs.filter((r) => r.id !== refeicaoId))
    await supabase.from('mwa_refeicoes').delete().eq('id', refeicaoId)
    if (refeicao?.fotoUrl) await removerFotoRefeicao(userId, refeicaoId)
  }

  async function atualizarFotoRefeicao(refeicaoId, arquivo) {
    const url = await uploadFotoRefeicao(userId, refeicaoId, arquivo)
    setRefeicoes((rs) => rs.map((r) => (r.id === refeicaoId ? { ...r, fotoUrl: url } : r)))
    await supabase.from('mwa_refeicoes').update({ foto_url: url }).eq('id', refeicaoId)
  }
```

- [ ] **Step 2: Adicionar os novos imports necessários**

No topo do arquivo, junto aos outros imports de `src/lib` e `src/utils`, adicionar:

```javascript
import { uploadFotoRefeicao, removerFotoRefeicao } from '../lib/storage.js'
import { horarioAgora } from '../utils/calculos.js'
```

(`horarioAgora` já existe em `src/utils/calculos.js` — é a mesma função que `ModalRefeicao.jsx` já importa hoje.)

- [ ] **Step 3: Atualizar o estado e as funções do modal**

Localizar (linhas 702–708 atualmente):

```javascript
  function abrirModalRefeicao(inicial = null) {
    setModalRefeicao({ aberto: true, inicial })
  }

  function fecharModalRefeicao() {
    setModalRefeicao({ aberto: false, inicial: null })
  }
```

Trocar por:

```javascript
  function abrirEscolhaRefeicao() {
    setModalRefeicao({ etapa: 'escolher', refeicaoId: null, itemInicial: null })
  }

  async function abrirRefeicaoDoDia(tipo) {
    const refeicao = await obterOuCriarRefeicao(tipo)
    setModalRefeicao({ etapa: 'aberta', refeicaoId: refeicao.id, itemInicial: null })
  }

  function abrirAdicionarAlimento(itemInicial = null) {
    setModalRefeicao((m) => ({ ...m, etapa: 'alimento', itemInicial }))
  }

  function voltarParaRefeicaoAberta() {
    setModalRefeicao((m) => ({ ...m, etapa: 'aberta', itemInicial: null }))
  }

  function fecharModalRefeicao() {
    setModalRefeicao({ etapa: null, refeicaoId: null, itemInicial: null })
  }
```

Localizar a declaração de estado (linha 127 atualmente):

```javascript
  const [modalRefeicao, setModalRefeicao] = useState({ aberto: false, inicial: null })
```

Trocar por:

```javascript
  const [modalRefeicao, setModalRefeicao] = useState({ etapa: null, refeicaoId: null, itemInicial: null })
```

- [ ] **Step 4: Atualizar o objeto `valor` exportado pelo contexto**

Localizar, dentro do objeto `valor` (por volta da linha 710–772), as linhas:

```javascript
    adicionarRefeicao,
    atualizarRefeicao,
    removerRefeicao,
```

e

```javascript
    abrirModalRefeicao,
    fecharModalRefeicao,
```

Trocar as duas por:

```javascript
    obterOuCriarRefeicao,
    adicionarItemRefeicao,
    atualizarItemRefeicao,
    removerItemRefeicao,
    removerRefeicaoCompleta,
    atualizarFotoRefeicao,
```

e

```javascript
    abrirEscolhaRefeicao,
    abrirRefeicaoDoDia,
    abrirAdicionarAlimento,
    voltarParaRefeicaoAberta,
    fecharModalRefeicao,
```

- [ ] **Step 5: Verificação manual**

Run: `npm run build`
Expected: build conclui sem erro (nenhum componente ainda usa as funções novas — isso é normal até a Task 8; o importante aqui é não ter erro de sintaxe/import).

- [ ] **Step 6: Commit**

```bash
git add src/context/AppContext.jsx
git commit -m "feat: AppContext ganha acoes para refeicoes agrupadas (criar, item, foto)"
```

---

### Task 6: `ModalEscolherRefeicao.jsx` — escolher o tipo de refeição

**Files:**
- Create: `src/components/alimentacao/ModalEscolherRefeicao.jsx`

**Interfaces:**
- Consumes: `refeicoesHoje`, `abrirRefeicaoDoDia`, `fecharModalRefeicao` de `useApp()` (Task 5); `TIPOS_REFEICAO` de `src/utils/calculos.js` (já existe, usado hoje em `ModalRefeicao.jsx`)
- Produces: componente `<ModalEscolherRefeicao />`, sem props.

- [ ] **Step 1: Implementar**

```jsx
// src/components/alimentacao/ModalEscolherRefeicao.jsx
import { X, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { TIPOS_REFEICAO } from '../../utils/calculos.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const REFEICOES_EN = {
  'Café da manhã': 'Breakfast', 'Lanche da manhã': 'Morning snack', Almoço: 'Lunch',
  'Lanche da tarde': 'Afternoon snack', Jantar: 'Dinner', Ceia: 'Evening snack',
}

export default function ModalEscolherRefeicao() {
  const { ingles } = useIdioma()
  const { refeicoesHoje, abrirRefeicaoDoDia, fecharModalRefeicao } = useApp()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={fecharModalRefeicao}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-escolher-refeicao-titulo"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-escolher-refeicao-titulo" className="font-serif text-xl font-semibold italic text-verde">
            {ingles ? 'Which meal?' : 'Qual refeição?'}
          </h2>
          <button type="button" aria-label={ingles ? 'Close' : 'Fechar'} onClick={fecharModalRefeicao} className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"><X size={18} /></button>
        </div>
        <ul className="flex flex-col gap-2">
          {TIPOS_REFEICAO.map((tipo) => {
            const jaLancada = refeicoesHoje.some((r) => r.tipo === tipo)
            return (
              <li key={tipo}>
                <button
                  type="button"
                  onClick={() => abrirRefeicaoDoDia(tipo)}
                  className="flex w-full items-center justify-between rounded-lg border-2 border-sage/30 bg-white px-4 py-3.5 text-left font-medium text-verde outline-none hover:border-sage"
                >
                  <span>{ingles ? REFEICOES_EN[tipo] : tipo}</span>
                  {jaLancada && <Check size={18} className="text-sage" />}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificação manual**

Run: `npm run build`
Expected: build conclui sem erro. (A verificação visual completa acontece na Task 8, quando o componente é ligado no `App.jsx`.)

- [ ] **Step 3: Commit**

```bash
git add src/components/alimentacao/ModalEscolherRefeicao.jsx
git commit -m "feat: adiciona tela de escolha do tipo de refeicao"
```

---

### Task 7: `ModalAdicionarAlimento.jsx` — busca/lançamento de alimento (reescrita do `ModalRefeicao.jsx`)

**Files:**
- Create: `src/components/alimentacao/ModalAdicionarAlimento.jsx`
- Delete: `src/components/alimentacao/ModalRefeicao.jsx` (será removido só na Task 9, depois de tudo ligado — deixar existir por enquanto não quebra nada)

**Interfaces:**
- Consumes: `modalRefeicao` (com `.refeicaoId` e `.itemInicial`), `adicionarItemRefeicao`, `atualizarItemRefeicao`, `voltarParaRefeicaoAberta` de `useApp()` (Task 5)
- Produces: componente `<ModalAdicionarAlimento />`, sem props.

Esse componente é a tela de busca/manual do `ModalRefeicao.jsx` atual, com estas mudanças:
- Remove os campos "Refeição" (`tipo`) e "Horário" (agora pertencem à refeição, não ao alimento).
- Remove o campo de foto (agora pertence à refeição).
- Filtros de categoria na busca ficam só: Todos, Recentes, Favoritos, Meus alimentos.
- Ao salvar, chama `adicionarItemRefeicao`/`atualizarItemRefeicao` (não mais `adicionarRefeicao`/`atualizarRefeicao`) e depois `voltarParaRefeicaoAberta()` em vez de `fecharModalRefeicao()`.

- [ ] **Step 1: Implementar**

```jsx
// src/components/alimentacao/ModalAdicionarAlimento.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Search, Star, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ALIMENTOS, macrosDoAlimento } from '../../data/alimentos.js'
import { buscarAlimentos, formatarMedida, medidaPorId, quantidadeNaBase } from '../../utils/alimentos.js'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const FILTROS_EN = { Todos: 'All', Recentes: 'Recent', Favoritos: 'Favorites', 'Meus alimentos': 'My foods' }

const lerLocal = (chave, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(chave)) ?? fallback } catch { return fallback }
}

export default function ModalAdicionarAlimento() {
  const { ingles } = useIdioma()
  const { modalRefeicao, adicionarItemRefeicao, atualizarItemRefeicao, voltarParaRefeicaoAberta, fecharModalRefeicao } = useApp()
  const editando = modalRefeicao.itemInicial
  const [modo, setModo] = useState(editando?.manual ? 'manual' : 'banco')
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [personalizados, setPersonalizados] = useState(() => lerLocal('mwa_alimentos_personalizados'))
  const [favoritos, setFavoritos] = useState(() => lerLocal('mwa_alimentos_favoritos'))
  const [recentes, setRecentes] = useState(() => lerLocal('mwa_alimentos_recentes'))
  const [alimentoId, setAlimentoId] = useState(editando?.alimentoId ?? null)
  const [quantidade, setQuantidade] = useState(editando?.quantidade ?? '')
  const [medidaId, setMedidaId] = useState(editando?.medidaId ?? 'g')
  const [salvarPersonalizado, setSalvarPersonalizado] = useState(false)
  const [manual, setManual] = useState({
    nome: editando?.manual ? editando.nome : '', marca: editando?.marca ?? '',
    calorias: editando?.manual ? editando.calorias : '', proteina: editando?.manual ? editando.proteina : '',
    carbos: editando?.manual ? editando.carbos : '', gordura: editando?.manual ? editando.gordura : '',
    fibras: editando?.manual ? editando.fibras : '',
  })
  const dialogRef = useRef(null)

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') voltarParaRefeicaoAberta()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [voltarParaRefeicaoAberta])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const todosAlimentos = useMemo(() => [...personalizados, ...ALIMENTOS], [personalizados])
  const alimento = todosAlimentos.find((a) => a.id === alimentoId)

  const resultados = useMemo(() => {
    let base = todosAlimentos
    if (filtro === 'Favoritos') base = base.filter((a) => favoritos.includes(a.id))
    else if (filtro === 'Recentes') base = recentes.map((id) => base.find((a) => a.id === id)).filter(Boolean)
    else if (filtro === 'Meus alimentos') base = base.filter((a) => a.categoria === 'Meus alimentos')
    return buscarAlimentos(base, busca, 60)
  }, [todosAlimentos, filtro, favoritos, recentes, busca])

  const macros = modo === 'banco' && alimento && Number(quantidade) > 0
    ? macrosDoAlimento(alimento, Number(quantidade), medidaId) : null

  function escolherAlimento(a) {
    setAlimentoId(a.id)
    setQuantidade('1')
    setMedidaId(a.medidas?.some((m) => m.id === 'porcao') ? 'porcao' : (a.unidadeBase ?? 'g'))
    const novos = [a.id, ...recentes.filter((id) => id !== a.id)].slice(0, 20)
    setRecentes(novos); localStorage.setItem('mwa_alimentos_recentes', JSON.stringify(novos))
  }

  function alternarFavorito(id) {
    const novos = favoritos.includes(id) ? favoritos.filter((x) => x !== id) : [id, ...favoritos]
    setFavoritos(novos); localStorage.setItem('mwa_alimentos_favoritos', JSON.stringify(novos))
  }

  const macrosManuaisValidos = ['calorias', 'proteina', 'carbos', 'gordura', 'fibras']
    .every((campo) => manual[campo] === '' || Number(manual[campo]) >= 0)
  const valido = modo === 'banco'
    ? alimento && Number(quantidade) > 0
    : manual.nome.trim() && manual.calorias !== '' && macrosManuaisValidos && Number(quantidade) > 0

  async function salvar() {
    let item
    if (modo === 'banco') {
      const medida = medidaPorId(alimento, medidaId)
      item = {
        nome: alimento.nome, marca: alimento.marca ?? null, alimentoId: alimento.id,
        quantidade: Number(quantidade), quantidadeBase: quantidadeNaBase(alimento, quantidade, medidaId),
        medidaId, medidaNome: formatarMedida(medida, quantidade),
        manual: false, ...macros,
      }
    } else {
      item = {
        nome: manual.nome.trim(), marca: manual.marca.trim() || null, alimentoId: null,
        quantidade: Number(quantidade), quantidadeBase: Number(quantidade), medidaId: 'g', medidaNome: 'g',
        manual: true, calorias: Math.round(Number(manual.calorias) || 0),
        proteina: Number(manual.proteina) || 0, carbos: Number(manual.carbos) || 0,
        gordura: Number(manual.gordura) || 0, fibras: Number(manual.fibras) || 0,
      }
      if (salvarPersonalizado && !editando) {
        const fator = 100 / Number(quantidade)
        const novo = {
          id: `custom-${Date.now()}`, nome: item.nome, marca: item.marca, categoria: 'Meus alimentos',
          kcal: item.calorias * fator, prot: item.proteina * fator, carb: item.carbos * fator,
          gord: item.gordura * fator, fibra: item.fibras * fator, porcao: Number(quantidade), unidadeBase: 'g',
          aliases: [], fonte: 'Cadastrado pela usuária', estimado: true,
          medidas: [{ id: 'g', nome: 'g', plural: 'g', base: 1 }, { id: 'porcao', nome: 'porção cadastrada', plural: 'porções cadastradas', base: Number(quantidade) }],
        }
        const novos = [novo, ...personalizados]
        setPersonalizados(novos); localStorage.setItem('mwa_alimentos_personalizados', JSON.stringify(novos))
      }
    }
    if (editando) await atualizarItemRefeicao(modalRefeicao.refeicaoId, editando.id, item)
    else await adicionarItemRefeicao(modalRefeicao.refeicaoId, item)
    voltarParaRefeicaoAberta()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={voltarParaRefeicaoAberta}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-adicionar-alimento-titulo"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-adicionar-alimento-titulo" className="font-serif text-xl font-semibold italic text-verde">{editando ? (ingles ? 'Edit food' : 'Editar alimento') : (ingles ? 'Add food' : 'Adicionar alimento')}</h2>
          <button type="button" aria-label={ingles ? 'Close' : 'Fechar'} onClick={fecharModalRefeicao} className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-cinza p-1">
          {[['banco', ingles ? 'Search foods' : 'Buscar alimento'], ['manual', ingles ? 'Enter manually' : 'Inserir manualmente']].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setModo(id)} aria-pressed={modo === id} className={`rounded-md py-2 text-sm font-semibold ${modo === id ? 'bg-white text-verde shadow-sm' : 'text-verde/80'}`}>{label}</button>
          ))}
        </div>
        {modo === 'banco' ? <div className="mt-4">
          <div className="flex items-center gap-2 rounded-lg border-2 border-sage/30 bg-white px-3 focus-within:border-sage"><Search size={16} className="text-verde/40" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={ingles ? 'Search food, brand, or alternative name…' : 'Buscar alimento, marca ou apelido...'} className="w-full py-3 font-medium text-verde outline-none" />
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {['Todos', 'Recentes', 'Favoritos', 'Meus alimentos'].map((cat) => <button key={cat} type="button" onClick={() => setFiltro(cat)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${filtro === cat ? 'bg-verde text-white' : 'bg-white text-verde/80'}`}>{ingles ? FILTROS_EN[cat] : cat}</button>)}
          </div>
          <ul className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-cinza bg-white">
            {resultados.map((a) => <li key={a.id} className={`flex items-center ${alimentoId === a.id ? 'bg-sage-claro' : ''}`}>
              <button type="button" onClick={() => escolherAlimento(a)} className="min-w-0 flex-1 px-3 py-2.5 text-left text-sm text-verde/80">
                <span className="block truncate font-medium">{a.suplemento && '🌿 '}{a.nome}</span>
                <span className="text-[10px] text-verde/80">{a.origem === 'Estados Unidos' && '🇺🇸 '}{a.categoria} · {a.kcal} kcal/100{a.unidadeBase}</span>
              </button>
              <button type="button" aria-label={`${favoritos.includes(a.id) ? (ingles ? 'Remove from' : 'Remover') : (ingles ? 'Add to' : 'Adicionar')} ${ingles ? 'favorites' : 'favorito'}`} onClick={() => alternarFavorito(a.id)} className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-ouro"><Star size={16} fill={favoritos.includes(a.id) ? 'currentColor' : 'none'} /></button>
            </li>)}
            {!resultados.length && <li className="px-3 py-4 text-sm text-verde/80">{ingles ? 'Nothing found. Try another name or enter it manually.' : 'Nada encontrado. Tente um sinônimo ou cadastre manualmente.'}</li>}
          </ul>
          {alimento && <div className="mt-3 grid grid-cols-2 gap-3">
            <CampoNumero label={ingles ? 'Quantity' : 'Quantidade'} value={quantidade} onChange={setQuantidade} min="0" step="any" placeholder="1" />
            <label><span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Serving unit' : 'Medida'}</span><select value={medidaId} onChange={(e) => setMedidaId(e.target.value)} className="w-full rounded-lg border-2 border-sage/30 bg-white px-3 py-3.5 font-medium text-verde outline-none">{alimento.medidas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}</select></label>
          </div>}
          {macros && <div className="mt-3 grid grid-cols-5 gap-1 rounded-lg bg-verde p-3 text-center text-white">{[['kcal', macros.calorias], ['prot', `${macros.proteina}g`], ['carb', `${macros.carbos}g`], ['gord', `${macros.gordura}g`], ['fibra', `${macros.fibras}g`]].map(([l, v]) => <div key={l}><p className="text-sm font-bold text-ouro">{v}</p><p className="text-[10px] text-white/60">{l}</p></div>)}</div>}
          {alimento?.estimado && <p className="mt-2 flex items-start gap-1 text-[11px] text-verde/80"><AlertCircle size={13} className="mt-0.5 shrink-0" />{ingles ? 'Reference value: preparation, recipe, or brand may change the macros.' : 'Valor de referência: preparação, receita ou marca pode alterar os macros.'}</p>}
        </div> : <div className="mt-4 flex flex-col gap-3">
          <label><span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Food or meal name' : 'Nome do alimento'}</span><input value={manual.nome} onChange={(e) => setManual((m) => ({ ...m, nome: e.target.value }))} placeholder={ingles ? 'Example: Homemade casserole' : 'Ex.: Strogonoff da vovó'} className="w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-3.5 font-medium text-verde outline-none" /></label>
          <label><span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Brand (optional)' : 'Marca (opcional)'}</span><input value={manual.marca} onChange={(e) => setManual((m) => ({ ...m, marca: e.target.value }))} className="w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-3.5 font-medium text-verde outline-none" /></label>
          <CampoNumero label={ingles ? 'Serving weight' : 'Peso desta porção'} sufixo="g" value={quantidade} onChange={setQuantidade} min="0.1" step="any" placeholder="100" />
          <div className="grid grid-cols-2 gap-3"><CampoNumero label="Calorias" sufixo="kcal" value={manual.calorias} onChange={(v) => setManual((m) => ({ ...m, calorias: v }))} min="0" /><CampoNumero label="Proteína" sufixo="g" value={manual.proteina} onChange={(v) => setManual((m) => ({ ...m, proteina: v }))} min="0" /><CampoNumero label="Carboidratos" sufixo="g" value={manual.carbos} onChange={(v) => setManual((m) => ({ ...m, carbos: v }))} min="0" /><CampoNumero label="Gordura" sufixo="g" value={manual.gordura} onChange={(v) => setManual((m) => ({ ...m, gordura: v }))} min="0" /></div>
          <CampoNumero label="Fibras" sufixo="g" value={manual.fibras} onChange={(v) => setManual((m) => ({ ...m, fibras: v }))} min="0" />
          {!editando && <label className="flex items-center gap-2 text-sm font-medium text-verde/70"><input type="checkbox" checked={salvarPersonalizado} onChange={(e) => setSalvarPersonalizado(e.target.checked)} /> {ingles ? 'Save for reuse in “My foods”' : 'Salvar para reutilizar em “Meus alimentos”'}</label>}
        </div>}
        <div className="mt-5"><Botao onClick={salvar} disabled={!valido}>{editando ? (ingles ? 'Save changes' : 'Salvar alterações') : (ingles ? 'Add to meal' : 'Adicionar à refeição')}</Botao></div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificação manual**

Run: `npm run build`
Expected: build conclui sem erro.

- [ ] **Step 3: Commit**

```bash
git add src/components/alimentacao/ModalAdicionarAlimento.jsx
git commit -m "feat: reescreve tela de busca de alimento sem tipo/horario/foto"
```

---

### Task 8: `ModalRefeicaoAberta.jsx` — refeição aberta (foto, horário, lista de itens)

**Files:**
- Create: `src/components/alimentacao/ModalRefeicaoAberta.jsx`

**Interfaces:**
- Consumes: `modalRefeicao`, `refeicoesHoje`, `abrirAdicionarAlimento`, `removerItemRefeicao`, `removerRefeicaoCompleta`, `atualizarFotoRefeicao`, `fecharModalRefeicao` de `useApp()` (Task 5); `totaisDaRefeicao` de `src/utils/refeicoes.js` (Task 2)
- Produces: componente `<ModalRefeicaoAberta />`, sem props.

- [ ] **Step 1: Implementar**

```jsx
// src/components/alimentacao/ModalRefeicaoAberta.jsx
import { useState } from 'react'
import { X, Plus, Camera, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { totaisDaRefeicao } from '../../utils/refeicoes.js'
import Botao from '../ui/Botao.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const REFEICOES_EN = {
  'Café da manhã': 'Breakfast', 'Lanche da manhã': 'Morning snack', Almoço: 'Lunch',
  'Lanche da tarde': 'Afternoon snack', Jantar: 'Dinner', Ceia: 'Evening snack',
}

export default function ModalRefeicaoAberta() {
  const { ingles } = useIdioma()
  const {
    modalRefeicao, refeicoesHoje, abrirAdicionarAlimento,
    removerItemRefeicao, removerRefeicaoCompleta, atualizarFotoRefeicao, fecharModalRefeicao,
  } = useApp()
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const refeicao = refeicoesHoje.find((r) => r.id === modalRefeicao.refeicaoId)

  if (!refeicao) return null
  const totais = totaisDaRefeicao(refeicao)

  async function escolherFoto(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setEnviandoFoto(true)
    try {
      await atualizarFotoRefeicao(refeicao.id, arquivo)
    } finally {
      setEnviandoFoto(false)
    }
  }

  async function excluirRefeicao() {
    const confirmado = window.confirm(
      ingles ? `Delete the whole "${refeicao.tipo}" meal, with all its foods?` : `Excluir a refeição "${refeicao.tipo}" inteira, com todos os alimentos?`,
    )
    if (confirmado) {
      await removerRefeicaoCompleta(refeicao.id)
      fecharModalRefeicao()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={fecharModalRefeicao}>
      <div
        className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-refeicao-aberta-titulo"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-refeicao-aberta-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? REFEICOES_EN[refeicao.tipo] : refeicao.tipo} · {refeicao.horario}</h2>
          <button type="button" aria-label={ingles ? 'Close' : 'Fechar'} onClick={fecharModalRefeicao} className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"><X size={18} /></button>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-sage/40 bg-white p-4 focus-within:border-sage focus-within:ring-2 focus-within:ring-sage focus-within:ring-offset-2">
          {refeicao.fotoUrl ? <img src={refeicao.fotoUrl} alt={ingles ? 'Meal' : 'Foto da refeição'} className="h-14 w-14 rounded-lg object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-sage-claro text-sage"><Camera size={22} /></span>}
          <span className="text-sm font-medium text-verde/70">{enviandoFoto ? (ingles ? 'Sending…' : 'Enviando…') : refeicao.fotoUrl ? (ingles ? 'Change meal photo' : 'Trocar foto da refeição') : (ingles ? 'Add meal photo 📸' : 'Adicionar foto da refeição 📸')}</span>
          <input type="file" accept="image/*" capture="environment" onChange={escolherFoto} disabled={enviandoFoto} className="sr-only" />
        </label>

        {totais.calorias > 0 && (
          <div className="mt-3 grid grid-cols-5 gap-1 rounded-lg bg-verde p-3 text-center text-white">
            {[['kcal', totais.calorias], ['prot', `${totais.proteina}g`], ['carb', `${totais.carbos}g`], ['gord', `${totais.gordura}g`], ['fibra', `${totais.fibras}g`]].map(([l, v]) => <div key={l}><p className="text-sm font-bold text-ouro">{v}</p><p className="text-[10px] text-white/60">{l}</p></div>)}
          </div>
        )}

        <ul className="mt-4 flex flex-col gap-2">
          {refeicao.itens.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm shadow-verde/5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-verde">{item.nome}</p>
                <p className="text-[11px] text-verde/80">{item.quantidade} {item.medidaNome ?? 'g'} · {item.calorias} kcal</p>
              </div>
              <button type="button" aria-label={`${ingles ? 'Edit' : 'Editar'} ${item.nome}`} onClick={() => abrirAdicionarAlimento(item)} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-verde/60 hover:bg-sage-claro hover:text-verde"><Pencil size={16} /></button>
              <button type="button" aria-label={`${ingles ? 'Delete' : 'Excluir'} ${item.nome}`} onClick={() => removerItemRefeicao(refeicao.id, item.id)} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-verde/60 hover:bg-red-50 hover:text-red-700"><Trash2 size={16} /></button>
            </li>
          ))}
          {refeicao.itens.length === 0 && (
            <li className="rounded-lg bg-white p-4 text-center text-sm text-verde/60">{ingles ? 'No foods yet.' : 'Nenhum alimento ainda.'}</li>
          )}
        </ul>

        <div className="mt-4 flex flex-col gap-2">
          <Botao onClick={() => abrirAdicionarAlimento()}><Plus size={18} className="mr-1 inline" />{ingles ? 'Add food' : 'Adicionar alimento'}</Botao>
          <button type="button" onClick={excluirRefeicao} className="py-2 text-sm font-semibold text-red-700">{ingles ? 'Delete whole meal' : 'Excluir refeição inteira'}</button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificação manual**

Run: `npm run build`
Expected: build conclui sem erro.

- [ ] **Step 3: Commit**

```bash
git add src/components/alimentacao/ModalRefeicaoAberta.jsx
git commit -m "feat: adiciona tela da refeicao aberta com foto, itens e horario"
```

---

### Task 9: Ligar tudo — `App.jsx`, `Alimentacao.jsx`, remover o modal antigo

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/alimentacao/Alimentacao.jsx`
- Modify: `src/components/ferramentas/Ferramentas.jsx`
- Delete: `src/components/alimentacao/ModalRefeicao.jsx`

**Interfaces:**
- Consumes: `ModalEscolherRefeicao` (Task 6), `ModalAdicionarAlimento` (Task 7), `ModalRefeicaoAberta` (Task 8), `totaisDaRefeicao` (Task 2), `abrirEscolhaRefeicao`/`removerRefeicaoCompleta` de `useApp()` (Task 5)

- [ ] **Step 1: Trocar o import e a renderização do modal em `App.jsx`**

Localizar:

```javascript
import ModalRefeicao from './components/alimentacao/ModalRefeicao.jsx'
```

Trocar por:

```javascript
import ModalEscolherRefeicao from './components/alimentacao/ModalEscolherRefeicao.jsx'
import ModalRefeicaoAberta from './components/alimentacao/ModalRefeicaoAberta.jsx'
import ModalAdicionarAlimento from './components/alimentacao/ModalAdicionarAlimento.jsx'
```

Localizar:

```javascript
      {modalRefeicao.aberto && <ModalRefeicao />}
```

Trocar por:

```javascript
      {modalRefeicao.etapa === 'escolher' && <ModalEscolherRefeicao />}
      {modalRefeicao.etapa === 'aberta' && <ModalRefeicaoAberta />}
      {modalRefeicao.etapa === 'alimento' && <ModalAdicionarAlimento />}
```

- [ ] **Step 2: Reescrever `Alimentacao.jsx` pra lista agrupada**

Substituir o arquivo inteiro por:

```jsx
// src/components/alimentacao/Alimentacao.jsx
import { useState } from 'react'
import { Plus, Trash2, Camera, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { totaisDaRefeicao } from '../../utils/refeicoes.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const REFEICOES_EN = {
  'Café da manhã': 'Breakfast', 'Lanche da manhã': 'Morning snack', Almoço: 'Lunch',
  'Lanche da tarde': 'Afternoon snack', Jantar: 'Dinner', Ceia: 'Evening snack',
}

export default function Alimentacao() {
  const { refeicoesHoje, totaisHoje, metas, removerRefeicaoCompleta, abrirEscolhaRefeicao, abrirRefeicaoDoDia } = useApp()
  const { ingles, locale } = useIdioma()
  const [expandida, setExpandida] = useState(null)

  return (
    <div className="px-5 pt-10">
      <h1 className="font-serif text-2xl font-semibold italic text-verde">{ingles ? 'Today’s nutrition' : 'Alimentação de hoje'}</h1>
      <p className="mt-1 text-sm text-verde/60">
        {totaisHoje.calorias.toLocaleString(locale)} {ingles ? 'of' : 'de'} {metas.calorias.toLocaleString(locale)} kcal ·{' '}
        {refeicoesHoje.length} {refeicoesHoje.length === 1 ? (ingles ? 'meal' : 'refeição') : (ingles ? 'meals' : 'refeições')}
      </p>

      <div className="mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-white p-4 text-center shadow-sm shadow-verde/5">
        {[
          { label: 'Kcal', v: totaisHoje.calorias, m: metas.calorias },
          { label: ingles ? 'Prot' : 'Prot', v: totaisHoje.proteina, m: metas.proteina },
          { label: 'Carb', v: totaisHoje.carbos, m: metas.carboidrato },
          { label: ingles ? 'Fat' : 'Gord', v: totaisHoje.gordura, m: metas.gordura },
          { label: ingles ? 'Fiber' : 'Fibra', v: totaisHoje.fibras, m: metas.fibras },
        ].map((x) => (
          <div key={x.label}>
            <p className="text-lg font-bold text-verde">{x.v.toLocaleString(locale)}</p>
            <p className="text-[10px] font-medium text-verde/80">{x.label} / {x.m.toLocaleString(locale)}</p>
          </div>
        ))}
      </div>

      {refeicoesHoje.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">🍽️</span>
          <p className="font-medium text-verde/60">{ingles ? 'No meals logged today.' : 'Nenhuma refeição registrada hoje.'}</p>
          <p className="text-sm text-verde/80">{ingles ? 'Tap the button below to add your first one!' : 'Toque no botão abaixo para adicionar a primeira!'}</p>
        </div>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {refeicoesHoje.map((r) => {
            const totais = totaisDaRefeicao(r)
            const aberta = expandida === r.id
            return (
              <li key={r.id} className="rounded-2xl bg-white shadow-sm shadow-verde/5">
                <button type="button" onClick={() => setExpandida(aberta ? null : r.id)} className="flex w-full items-center gap-3 p-4 text-left">
                  {r.fotoUrl ? (
                    <img src={r.fotoUrl} alt={r.tipo} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-sage-claro text-sage"><Camera size={22} /></span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-sage">{r.tipo} · {r.horario}</p>
                    <p className="font-semibold text-verde">{totais.calorias} kcal · P {totais.proteina}g · C {totais.carbos}g · G {totais.gordura}g</p>
                    <p className="text-[11px] text-verde/60">{r.itens.length} {r.itens.length === 1 ? (ingles ? 'food' : 'alimento') : (ingles ? 'foods' : 'alimentos')}</p>
                  </div>
                  <ChevronDown size={18} className={`shrink-0 text-verde/40 transition-transform ${aberta ? 'rotate-180' : ''}`} />
                </button>
                {aberta && (
                  <div className="border-t border-cinza px-4 pb-4 pt-3">
                    <ul className="flex flex-col gap-1.5">
                      {r.itens.map((item) => (
                        <li key={item.id} className="flex items-center justify-between text-sm text-verde/80">
                          <span className="truncate">{item.nome}</span>
                          <span className="shrink-0 text-verde/60">{item.calorias} kcal</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex gap-2">
                      <button type="button" onClick={() => abrirRefeicaoDoDia(r.tipo)} className="flex items-center gap-1 text-sm font-semibold text-sage"><Plus size={14} /> {ingles ? 'Add food' : 'Adicionar alimento'}</button>
                      <button
                        type="button"
                        onClick={() => {
                          const confirmado = window.confirm(ingles ? `Delete the whole "${r.tipo}" meal?` : `Excluir a refeição "${r.tipo}" inteira?`)
                          if (confirmado) removerRefeicaoCompleta(r.id)
                        }}
                        className="ml-auto flex items-center gap-1 text-sm font-semibold text-red-700"
                      >
                        <Trash2 size={14} /> {ingles ? 'Delete' : 'Excluir'}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={abrirEscolhaRefeicao}
        className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ouro px-5 py-3.5 font-semibold text-verde-escuro shadow-lg shadow-ouro/40 transition-transform hover:scale-105 active:scale-95"
      >
        <Plus size={20} strokeWidth={2.5} /> {ingles ? 'Add meal' : 'Adicionar refeição'}
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Remover o modal antigo**

```bash
git rm src/components/alimentacao/ModalRefeicao.jsx
```

- [ ] **Step 2b: Corrigir o terceiro consumidor de `abrirModalRefeicao` — `Ferramentas.jsx`**

Esse arquivo tem um botão de atalho "Adicionar ao meu dia" que também chamava o modal antigo diretamente (achado durante a implementação da Task 5 — não estava listado nas Interfaces originais deste plano).

Localizar, em `src/components/ferramentas/Ferramentas.jsx`:

```javascript
  const { abrirModalRefeicao } = useApp()
```

Trocar por:

```javascript
  const { abrirEscolhaRefeicao } = useApp()
```

Localizar:

```javascript
            <Botao variante="ouro" onClick={() => abrirModalRefeicao()}>
```

Trocar por:

```javascript
            <Botao variante="ouro" onClick={() => abrirEscolhaRefeicao()}>
```

- [ ] **Step 3: Verificação manual — fluxo completo no navegador**

Run: `npm run dev`, abrir o app, logar com uma conta de teste.

1. Ir em "Refeições" → tocar "Adicionar refeição" → escolher "Almoço" → abre a tela da refeição vazia.
2. Tocar "Adicionar alimento" → buscar e escolher um alimento → salvar → volta pra tela da refeição, alimento aparece na lista.
3. Repetir o passo 2 com um segundo alimento → confirma que os dois aparecem juntos, macros somados no topo.
4. Tirar/escolher uma foto → confirma que aparece na tela.
5. Recarregar a página inteira (F5) → abrir a refeição de novo → confirma que a foto **continua aparecendo** (prova que persistiu de verdade, ao contrário do bug antigo com blob URL).
6. Fechar o modal, voltar em "Adicionar refeição" → escolher "Almoço" de novo → confirma que abre a MESMA refeição (com os alimentos já lançados), não uma nova vazia.
7. Na lista de "Refeições", tocar no card do Almoço → confirma que expande mostrando os alimentos.
8. Excluir um alimento (não o último) → confirma que a refeição continua existindo com o outro alimento.
9. Excluir o alimento restante → confirma que o card do Almoço inteiro some da lista.
10. Checar os filtros da busca de alimento → confirma que aparecem só Todos/Recentes/Favoritos/Meus alimentos.

Expected: todos os 10 passos se comportam como descrito, sem erros no console do navegador.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/alimentacao/Alimentacao.jsx src/components/ferramentas/Ferramentas.jsx
git commit -m "feat: liga fluxo de refeicoes agrupadas no App e na lista do dia"
```

---

### Task 10: Build de produção e deploy

**Files:** nenhum arquivo novo — apenas build e publicação.

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: build conclui sem erro.

- [ ] **Step 2: Deploy no Netlify**

Publicar a pasta `dist/` gerada no site `metodomwa` (siteId `7d9d91bc-3b70-436b-ad09-192565c87121`), mesmo processo já usado nas correções anteriores desta sessão (ferramenta MCP do Netlify, `deploy-site`, rodando o comando retornado a partir da pasta `dist`).

- [ ] **Step 3: Verificação final em produção**

Repetir os 10 passos do Step 3 da Task 9, dessa vez em `https://app.metodomwa.com.br` (não no `npm run dev` local), com uma conta de teste.

- [ ] **Step 4: Push final**

```bash
git push origin main
```
