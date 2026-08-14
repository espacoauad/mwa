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
- **Acima da meta** (só a comida, sem contar exercício): `#B0563C`
  (terracota — mesmo tom já usado como cor de alerta em `statusMeta`,
  `src/utils/calculos.js`). Substitui o verde-escuro nesse caso; o anel
  fecha em 360° nessa cor, em opacidade cheia (não mais esmaecido).

## Preenchimento do anel

- `anguloComida = min(360 * calorias/metaCalorias, 360)`
- `anguloBonus = min(360 * (calorias + caloriasQueimadas)/metaCalorias, 360) - anguloComida`

O segmento verde-escuro vai de 0° a `anguloComida`. O segmento dourado
começa onde o verde-escuro termina e vai até `anguloComida + anguloBonus`
(nunca passando de 360° — sem dar uma segunda volta).

**Sem exercício lançado** (`caloriasQueimadas = 0`): `anguloBonus = 0`,
visualmente idêntico a um anel de progresso normal, só com o novo raio e
cor.

**Comida sozinha já ultrapassa a meta:** `anguloComida = 360`,
`anguloBonus = 0` (não sobra espaço pra mostrar — mesmo com exercício
lançado, não faz sentido indicar "espaço ganho" se já passou do ponto só
com comida). Diferente dos 3 anéis de macro (que só esmaecem a
opacidade), o anel de calorias troca de cor: fecha em 360° na cor de
alerta `#B0563C` (terracota), em opacidade cheia — um sinal mais direto
de "passou da meta" do que apenas escurecer.

**Comida + exercício ultrapassam a meta, mas a comida sozinha não:** verde-
escuro vai até onde a comida chega, dourado completa o resto até fechar o
anel em 360°.

**`metaCalorias` igual a 0:** mesmo tratamento defensivo que os outros
anéis já aplicam (evita divisão por zero) — não é um caso esperado na
prática, já que `metas.calorias` sempre vem de `calcularMetas`.

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

## Testes

Sem harness de teste de componente neste repositório (mesmo padrão do
resto do projeto) — verificação é build limpo (`npm run build`) mais
checagem manual no navegador:
- Sem exercício lançado: anel de calorias mostra só o segmento
  verde-escuro, sem segmento dourado, sem a linha "+N kcal do exercício".
- Com exercício lançado: segmento dourado aparece, crescendo conforme
  mais exercício é lançado no dia.
- Comida sozinha ultrapassando a meta: anel fecha em 360° na cor de
  alerta (terracota), opacidade cheia — mesmo com exercício lançado no
  mesmo dia (não deve aparecer segmento dourado nesse caso).
- Comida abaixo da meta + exercício levando a soma acima da meta: verde-
  escuro até o ponto da comida, dourado completando até 360°.
