# Anel de Calorias — Design

## Contexto e problema

Na tela Hoje, `GraficoMacros.jsx` desenha 3 anéis concêntricos (proteína,
carboidrato, gordura) em torno de um número de calorias mostrado apenas
como texto no topo ("X de Y kcal") — sem anel próprio.

`totaisHoje.calorias` (soma das refeições) e `gastoExercicios` (soma dos
exercícios lançados, via `AppContext`) já existem como valores separados,
mas nunca são combinados: o gasto com exercício não afeta em nada a meta
de calorias nem qualquer indicador visual. `Hoje.jsx` já usa
`gastoExercicios` numa linha de texto ("Gasto com exercícios") no resumo
do dia, mas isso não chega ao `GraficoMacros`.

## Objetivo

Adicionar um 4º anel — o de calorias — em torno dos 3 já existentes,
maior e mais grosso, mostrando quanto foi consumido em relação à meta. Ao
lançar exercício, um segmento em cor diferente mostra o quanto isso
"abriu" de espaço extra na meta do dia.

## Arquitetura e dados

Nenhuma mudança em `AppContext` — `gastoExercicios` já existe e já é
exposto. A única mudança de dado é `Hoje.jsx` passar
`caloriasQueimadas={gastoExercicios}` como novo prop pro `GraficoMacros`.

`GraficoMacros` ganha o prop `caloriasQueimadas = 0` (padrão retrocompatível
— sem passar nada, o componente se comporta exatamente como hoje).

## Anéis: tamanho e cor

Os 3 anéis de macro encolhem para abrir espaço para o novo anel externo,
mais grosso:

| Anel | Raio (antes) | Raio (depois) | Espessura |
|---|---|---|---|
| Calorias (novo) | — | 84 | 14 |
| Proteína | 80 | 64 | 9 |
| Carboidratos | 55 | 44 | 9 |
| Gordura | 30 | 24 | 9 |

Cores do anel de calorias:
- **Consumido** (comida, dentro da meta): `#052A1F` (verde-escuro-profundo
  — tom já presente na paleta do app via `--color-verde-escuro`, mas ainda
  não usado em nenhum anel).
- **Ganho pelo exercício**: `#C59F4F` (dourado/`ouro` — mesma cor já
  associada a recompensa/sementes no resto do app).
- **Acima da meta** (calorias líquidas, já descontado o exercício): `#B0563C`
  (terracota). Substitui o verde-escuro nesse caso; o anel fecha em 360°
  nessa cor, em opacidade cheia (não mais esmaecido).

  *Nota da revisão final:* a versão original desta spec dizia que
  `#B0563C` era "o mesmo tom já usado como cor de alerta em
  `statusMeta`" — isso está errado. Em `statusMeta`
  (`src/utils/calculos.js`), `#B0563C` significa "longe da meta, ainda no
  início" (< 60% de progresso), o oposto semântico de "passou do limite".
  Mantemos a cor aqui mesmo assim, por decisão deliberada (é a única cor
  de alerta/atenção já presente na paleta do app) — mas é uma reutilização
  com significado diferente do de `statusMeta`, não uma reafirmação dele.

## Preenchimento do anel (revisado — ver nota de correção abaixo)

> **Correção pós-revisão final:** a primeira versão desta seção somava
> `calorias + caloriasQueimadas` como preenchimento — ou seja, mais
> exercício deixava o anel **mais cheio**, o oposto da ideia de "abrir
> espaço". A revisão final do branch pegou isso com um exemplo concreto:
> meta 1800, comeu 1200, queimou 600 → o anel fechava 100%, idêntico a
> quem comeu 1800 e não fez exercício nenhum. A versão abaixo corrige
> isso: exercício **reduz** o quanto conta como consumido, nunca aumenta
> o preenchimento.

- `netCalorias = calorias - caloriasQueimadas` (pode ser negativo se o
  exercício superar a comida)
- `anguloConsumo = min(360 * max(netCalorias, 0)/metaCalorias, 360)` — o
  quanto do anel está "realmente" preenchido, já descontado o exercício
- `anguloComidaBruta = min(360 * calorias/metaCalorias, 360)` — até onde
  o anel chegaria só com a comida, sem considerar exercício (o mesmo
  cálculo que os 3 anéis de macro já usam)
- `acimaDaMeta = netCalorias > metaCalorias` — passou da meta **mesmo
  depois de descontar o exercício**

O segmento de consumo (verde-escuro, ou terracota se `acimaDaMeta`) vai
de 0° a `anguloConsumo`. O segmento dourado (exercício) vai de
`anguloConsumo` até `anguloComidaBruta` — nunca passa daí, então o
exercício nunca faz o anel parecer mais cheio do que a comida sozinha já
mostraria. Mais exercício encolhe o segmento de consumo e faz o dourado
crescer no lugar — a área colorida total nunca aumenta.

**Sem exercício lançado** (`caloriasQueimadas = 0`): `netCalorias =
calorias`, `anguloConsumo = anguloComidaBruta`, segmento dourado com
tamanho zero — visualmente idêntico a um anel de progresso normal, só
com o novo raio e cor.

**Exercício cobre toda a comida** (`caloriasQueimadas >= calorias`):
`anguloConsumo = 0` (nada de verde/terracota), o anel mostra só o
segmento dourado, do tamanho de `anguloComidaBruta` — "tudo que você
comeu já foi coberto pelo exercício".

**Comida sozinha ultrapassa a meta, mas o exercício traz de volta pra
dentro dela** (`calorias > metaCalorias` mas `netCalorias <=
metaCalorias`): o anel NÃO fica na cor de alerta — `acimaDaMeta` olha
`netCalorias`, não `calorias` bruta. `anguloComidaBruta` fica travado em
360°, então o dourado preenche de `anguloConsumo` até 360°, mostrando
visualmente "o exercício perdoou boa parte do excesso".

**Mesmo com exercício, ainda passou da meta** (`netCalorias >
metaCalorias`): `anguloConsumo = 360` (trava, igual `anguloComidaBruta`)
— anel fecha inteiro na cor de alerta, sem espaço pra dourado (não faz
sentido sinalizar "espaço ganho" se ainda está acima da meta mesmo com o
desconto do exercício).

**`metaCalorias` igual a 0:** mesmo tratamento defensivo que os outros
anéis já aplicam (evita divisão por zero) — não é um caso esperado na
prática, já que `metas.calorias` sempre vem de `calcularMetas`.

## Ponta dos arcos (linecap)

Os 3 anéis de macro usam `strokeLinecap="round"` (ponta arredondada) —
mantido sem mudança. O anel de calorias, por ter 2 segmentos adjacentes
(consumo + exercício), usa `strokeLinecap="butt"` (ponta reta) nos dois —
com ponta arredondada, a sobreposição das duas "meia-luas" na fronteira
entre os segmentos distorce visualmente o tamanho de cada um (mais
perceptível em bônus de exercício pequenos, onde a ponta arredondada
sozinha já ocupa boa parte do segmento).

## Texto acima do anel

Mantém "X de Y kcal" como já existe. Quando `caloriasQueimadas > 0`, uma
segunda linha aparece abaixo, na cor dourada: "+N kcal do exercício". Sem
exercício lançado no dia, essa linha não é renderizada.

## Fora de escopo

- Qualquer mudança em como `metas.calorias` é calculada — a meta continua
  fixa, o exercício só afeta o preenchimento visual do anel, não o número
  da meta em si.
- Mudanças no anel de fibra (`AnelMeta`) ou no anel de hidratação
  (`AnelHidratacao`) — inalterados.
- Qualquer alteração em `gastoExercicios` ou em como exercícios são
  lançados — só passa a ser consumido por um novo lugar (`GraficoMacros`).

## Acessibilidade e idioma (adicionado na revisão final)

- O `<svg>` do anel ganha `aria-hidden="true"` (é uma duplicata visual do
  texto acima dele — nenhuma informação exclusiva vive só no desenho).
- Um resumo `sr-only` com `role="status"` e `aria-live="polite"`
  descreve em texto puro o que o anel mostra (consumido, meta e se está
  acima dela mesmo com o desconto do exercício) — mesmo padrão já usado
  por `AnelHidratacao.jsx`.
- A linha "+N kcal do exercício" passa a respeitar `ingles` (igual aos
  rótulos de macro logo abaixo), em vez de ficar fixa em português.

## Testes

Sem harness de teste de componente neste repositório (mesmo padrão do
resto do projeto) — verificação é build limpo (`npm run build`) mais
checagem manual no navegador:
- Sem exercício lançado: anel de calorias mostra só o segmento
  verde-escuro/terracota, sem segmento dourado, sem a linha "+N kcal do
  exercício".
- Com exercício lançado, cobrindo só parte da comida: segmento
  verde-escuro encolhe, segmento dourado aparece logo depois dele,
  completando até onde a comida sozinha chegaria — a área colorida total
  não aumenta em relação a como o anel ficaria sem o exercício.
- Exercício cobre toda a comida do dia: só aparece o segmento dourado
  (nenhum verde/terracota).
- Comida sozinha ultrapassa a meta, mas o exercício traz o líquido de
  volta pra dentro dela: anel NÃO fica na cor de alerta; dourado
  preenche até 360°.
- Mesmo descontando o exercício, ainda passa da meta: anel fecha 360° na
  cor de alerta, sem segmento dourado.
