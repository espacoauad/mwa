# Refeições agrupadas (alimentos dentro de uma refeição) — Design

## Contexto e problema

Hoje, cada alimento lançado no app vira uma linha **independente** na tabela
`mwa_refeicoes`, cada uma com seu próprio `tipo` (Café da manhã, Almoço...),
`horario` e `foto_url`. Não existe o conceito de "uma refeição com vários
alimentos dentro". Consequência prática: lançar arroz, feijão e frango no
almoço cria 3 registros soltos e sem vínculo entre si, e não há como anexar
uma única foto do prato representando o conjunto — cada alimento teria que
carregar sua própria foto, o que não faz sentido visual nem de uso.

Durante a investigação, identificamos um segundo problema, ortogonal mas que
precisa ser corrigido junto: a foto de refeição usa
`URL.createObjectURL()`, que gera um link válido **apenas na aba/sessão do
navegador que criou a foto**. Ao recarregar a página ou abrir em outro
aparelho, o link já não aponta para nada — ou seja, as fotos de refeição
nunca persistiram de fato.

## Objetivo

1. Reestruturar o lançamento de alimentação para que uma **refeição**
   (Café da manhã / Lanche da manhã / Almoço / Lanche da tarde / Jantar /
   Ceia) agrupe **múltiplos alimentos**, com uma única foto e um único
   horário por refeição.
2. Corrigir a persistência da foto, subindo-a de verdade para o Supabase
   Storage.
3. Simplificar os filtros de categoria na busca de alimentos.
4. Migrar os dados já existentes sem perda nutricional.

## Modelo de dados

### `mwa_refeicoes` (redefinida)

Passa a representar a refeição em si, não mais o alimento.

| coluna | tipo | notas |
|---|---|---|
| `id` | uuid | PK |
| `user_id` | uuid | FK auth.users |
| `data` | date | dia da refeição |
| `tipo` | text | Café da manhã / Lanche da manhã / Almoço / Lanche da tarde / Jantar / Ceia |
| `horario` | time | horário da refeição (não mais por alimento) |
| `foto_url` | text | URL pública no Supabase Storage; null se sem foto |
| `criado_em` | timestamptz | default now() |

Restrição única em `(user_id, data, tipo)`: é o mecanismo que implementa
"reabrir a refeição existente" — ao clicar em "Adicionar refeição" e
escolher um tipo que já tem refeição hoje, o app encontra o registro
existente (`select` por essas 3 colunas) em vez de criar um duplicado.

### `mwa_refeicoes_itens` (nova)

Um alimento dentro de uma refeição.

| coluna | tipo | notas |
|---|---|---|
| `id` | uuid | PK |
| `refeicao_id` | uuid | FK `mwa_refeicoes(id)` ON DELETE CASCADE |
| `nome` | text | |
| `marca` | text | nullable |
| `alimento_id` | text | nullable — referência ao banco de alimentos estático, ou null se manual |
| `quantidade` | numeric | |
| `quantidade_base` | numeric | |
| `medida_id` | text | |
| `medida_nome` | text | |
| `manual` | boolean | true se digitado manualmente |
| `calorias` | integer | |
| `proteina` | numeric | |
| `carbos` | numeric | |
| `gordura` | numeric | |
| `fibras` | numeric | |
| `criado_em` | timestamptz | default now() |

RLS em ambas as tabelas segue o padrão já usado no projeto (usuária só
acessa suas próprias linhas; `mwa_refeicoes_itens` verifica via join com
`mwa_refeicoes.user_id`).

Os totais de macros de uma refeição — e os totais do dia mostrados em
"Alimentação de hoje" — passam a ser a soma dos itens.

## Foto da refeição — Supabase Storage

- Bucket novo: `fotos-refeicoes`.
- Caminho: `{user_id}/{refeicao_id}.jpg` (upsert — nova foto substitui a
  anterior da mesma refeição).
- Política de acesso: cada usuária só lê/escreve dentro da própria pasta
  (`{user_id}/...`), mesmo padrão de segurança das outras tabelas.
- Ao trocar a foto, o app faz upload e salva a URL pública resultante em
  `mwa_refeicoes.foto_url`.

## Fluxo de UI

1. **Botão "Adicionar refeição"** abre a escolha do tipo de refeição
   (Café da manhã, Lanche da manhã, Almoço, Lanche da tarde, Jantar, Ceia).
2. Se já existe refeição desse tipo hoje → abre ela, mostrando os alimentos
   já lançados. Se não existe → cria uma nova (`insert` em
   `mwa_refeicoes`).
3. **Dentro da refeição aberta:**
   - Lista dos alimentos já adicionados, cada um editável/excluível
     individualmente.
   - Botão "Adicionar alimento" abre a busca de alimentos (tela atual,
     sem o campo "Refeição" — já escolhido no passo 1).
   - Campo de foto único no topo, representando o prato inteiro.
   - Campo de horário único, da refeição (não mais por alimento).
4. **Tela "Refeições" (lista do dia):** cada card é uma refeição fechada —
   foto, tipo, horário, macros totais somados dos itens. Toque expande
   para ver/editar/excluir os alimentos um por um, ou excluir a refeição
   inteira (cascata exclui os itens).

### Simplificação dos filtros de busca de alimento

Os chips de filtro na busca de alimentos ficam reduzidos a:
**Todos, Recentes, Favoritos, Meus Alimentos.**
Removidos: "Estados Unidos" e os filtros por categoria de alimento
(Frutas, Proteínas, etc. — `CATEGORIAS` em `src/data/alimentos.js`).

## Migração dos dados existentes

Migration única, rodada uma vez em produção:

1. Para cada grupo único de `(user_id, data, tipo)` na tabela atual
   `mwa_refeicoes`, criar uma linha na nova estrutura de refeição,
   herdando o horário do registro mais antigo do grupo.
2. Mover cada linha antiga (um alimento) para `mwa_refeicoes_itens`,
   vinculada à refeição criada no passo 1.
3. Fotos antigas (links `blob:` quebrados) são descartadas — a refeição
   migrada fica sem foto. Nenhum dado nutricional é perdido; apenas a
   organização muda.

## Pontos de integração existentes

- **Gamificação** (`premiar('refeicao', `${dia}:${tipo}`)`): continua
  igual, disparada na criação da refeição (não mais por alimento
  individual) — já era deduplicada por dia+tipo, então o comportamento de
  recompensa não muda.
- **Certificado de 30 dias** (`Conclusao30Dias.jsx`, contagem de
  refeições): a contagem passa a representar refeições (não mais
  alimentos), o que é mais fiel ao que a estatística pretende comunicar.
  Query simplifica (conta linhas de `mwa_refeicoes` diretamente, sem
  precisar somar itens).

## Fora de escopo

- Recuperar fotos antigas quebradas (impossível — o link nunca apontou
  para um arquivo real).
- Permitir duas refeições do mesmo tipo no mesmo dia (ex.: dois almoços)
  — decisão explícita: reabre a existente em vez de duplicar.
