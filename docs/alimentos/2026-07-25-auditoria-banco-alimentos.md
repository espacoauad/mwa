# Auditoria do banco de alimentos — MWA
Data: 2026-07-25 · Fase 1 (somente diagnóstico — nada foi modificado)

## 1. Onde o banco vive hoje

O banco de alimentos é **100% local, no código do app** (não existe tabela de alimentos no Supabase):

| Arquivo | Itens | Conteúdo | Fonte declarada |
|---|---|---|---|
| `src/data/alimentos.js` | 53 | Base curada (proteínas, carbos, frutas, suplementos genéricos, refeições) | TACO/TBCA + rótulos |
| `src/data/alimentosExtras.js` | 175 | Curadoria brasileira (formato pipe-delimited) | TACO/TBCA (estimado) |
| `src/data/alimentosEua.js` | 61 | Alimentos americanos | USDA FoodData Central |
| **Total** | **289** | | |

Por categoria: Carboidratos 56, Refeições prontas 41, Proteínas 34, Vegetais 32, Frutas 29, Laticínios 25, Doces e sobremesas 25, Bebidas 16, Gorduras boas 13, Molhos e complementos 11, Suplementos 7.

Flags atuais: `estimado` = 243 itens (84%); `validacaoPendente` = 7 (os suplementos genéricos); **nenhum item tem marca, sabor ou código de barras**.

## 2. Como o diário registra (ponto crítico — favorável)

- `ModalRefeicao.jsx` grava no diário um **snapshot completo**: nome, marca, `alimentoId`, quantidade, medida e os 5 macros calculados.
- `mwa_refeicoes` (Supabase) guarda esses valores em colunas próprias + JSON `detalhes`.
- **Consequência: alterar ou remover alimentos do banco NÃO altera registros antigos.** A estratégia de preservação já existe por construção. (Hoje há apenas 3 refeições registradas no banco — risco praticamente zero.)

## 3. Como o cálculo funciona

- Valores nutricionais são **por 100 g ou 100 ml** (`unidadeBase`).
- Cada alimento tem `medidas[]` com `base` = equivalência em g/ml (ex.: copo = 200 ml, dose = porção). `quantidadeNaBase()` converte, `macrosDoAlimento()` escala. Alterar quantidade/medida recalcula corretamente. ✅

## 4. Como a busca funciona (`src/utils/alimentos.js`)

- Normaliza acentos/caixa/pontuação; pontua: nome exato 100 > prefixo 80 > contém 60 > todas as palavras nos termos 40+.
- Campos indexados: nome, categoria, marca, sabor, aliases. ✅ acentos, apelidos, multi-palavra.
- **Faltas**: singular/plural, código de barras, priorização de recentes/favoritos dentro do ranking (recentes/favoritos existem só como filtros).
- Recentes, favoritos e "Meus alimentos" (personalizados) ficam **apenas no localStorage** — se a pessoa trocar de aparelho, perde tudo. ⚠️

## 5. Qualidade dos dados (script de auditoria executado em 2026-07-25)

- IDs duplicados: **0** · Nomes duplicados exatos: **0** · Sem porção: **0** · Valores negativos: **0** · Líquido sem ml: **0** · Sem fonte: **0**
- Incoerência kcal × macros (tolerância 25%): **1** — `hbl-fiber` (fibras solúveis: 220 kcal vs 294 calculadas). Explicável: fibra rende ~2 kcal/g, não 4. Não é erro; a validação futura deve tratar fibra separadamente.
- Fibra > carboidrato: **1** — `br-001` Alface crespa (1,8 vs 1,7 g). Arredondamento TACO; inofensivo, mas documentado.
- Duplicidades semânticas PT × US (valores idênticos, intencionais pela categoria 🇺🇸): Panqueca simples ≈ Pancake americano; Batata chips ≈ Potato chips; Purê de batata ≈ Mashed potatoes. Manter, mas vincular por `equivalenteDe` no futuro.
- Produtos descontinuados: não aplicável ainda (não há produtos de marca).

## 6. Herbalife hoje

7 itens genéricos com prefixo `hbl-` ("Shake proteico (pó)", "Bebida proteica em pó", "Chá de ervas concentrado", "Chá com guaraná", "Fibras solúveis", "Bebida isotônica em pó", "Barra de proteína"), todos `estimado` + `validacaoPendente`, com fonte "valores médios da categoria — conferir o rótulo". Não há nenhum produto Herbalife nominal com dados de rótulo.

## 7. Campos existentes × campos exigidos pela especificação

Existentes: `id, nome, categoria, kcal, prot, carb, gord, fibra, porcao, unidadeBase, medidas[], aliases[], fonte, fonteUrl, estimado, validacaoPendente, ultimaConferencia, suplemento, origem`.

Faltantes: `marca` (a UI já lê, mas nenhum alimento tem), `linha`, `sabor`, `subcategoria`, `descricao`, `acucaresTotais`, `acucaresAdicionados`, `gordSaturada`, `sodio`, `teorAlcoolico`, `codigoBarras`, `situacao` (validado/pendente/descontinuado — hoje é booleano), `dataValidacao` como padrão para todos.

Categoria de bebidas alcoólicas: **inexistente** (nenhuma cerveja, vinho, destilado ou drink no banco). O cálculo atual ignora álcool (7 kcal/g) — precisa de campo próprio para bater kcal.

## 8. Modelo de dados proposto (para aprovação)

Extensão retrocompatível do objeto atual (tudo opcional; alimentos existentes continuam válidos):

```js
{
  id, nome, marca, linha, sabor, categoria, subcategoria, descricao,
  estadoPreparo,            // ex.: 'pó', 'preparado com água', 'congelado', 'pronto'
  kcal, prot, carb, gord, fibra,            // por 100 g/ml (como hoje)
  acucares, acucaresAdicionados, gordSat, sodio,   // por 100 g/ml, opcionais
  alcoolGL,                 // % vol, só bebidas alcoólicas
  porcao, unidadeBase, medidas: [{ id, nome, plural, base }],
  aliases: [], ean: null,
  fonte, fonteUrl, dataConsulta,
  situacao: 'validado' | 'aguardando_validacao' | 'descontinuado',
  estimado: bool,           // mantém o selo "valor estimado" atual
}
```

**Decisão de arquitetura pendente (recomendação):** para centenas de itens, manter arquivos JS versionados por lote (`src/data/catalogo/*.js`) funciona e é auditável no git. Para milhares + painel admin + cadastro de usuário sincronizado + aprovação, o caminho certo é tabela `mwa_alimentos` no Supabase (RLS, busca com `unaccent`/`pg_trgm`, auditoria por trigger), com o bundle local como seed/fallback offline. Proposta: **Fase 2 cria a tabela e o app passa a mesclar catálogo remoto + local**, sem remover nada do bundle. O bundle principal já está em ~902 kB — colocar milhares de alimentos nele pioraria o carregamento.

## 9. Fontes definidas

1. **TBCA — Tabela Brasileira de Composição de Alimentos (USP)** — genéricos brasileiros (já em uso).
2. **TACO (Unicamp)** — genéricos brasileiros (já em uso).
3. **USDA FoodData Central** — itens americanos (já em uso).
4. **Rótulo oficial / site do fabricante** — industrializados (Lacta/Mondelez, Nestlé, Danone, Vigor, Piracanjuba, Itambé, Verde Campo, Wickbold, Bauducco, M. Dias Branco, Ambev, Heineken, Coca-Cola Brasil, PepsiCo, Seara, Sadia/BRF etc.), com URL e data de consulta por item.
5. **Herbalife Brasil** — páginas oficiais de produto `herbalife.com/pt-br/u/products/...` (confirmado no ar, com SKU por produto; Fórmula 1 em Doce de Leite, Baunilha Cremoso, Morango Cremoso, Chocolate Sensation, Coco, Banana Caramelizada, Café, Cookies & Cream — lista completa a levantar na Fase 3).
6. **Open Food Facts / sites colaborativos** — apenas para *cross-check* de código de barras; nunca como fonte primária.

Todo item de marca sem rótulo confirmável entra como `aguardando_validacao` e não aparece na busca padrão.

## 10. Estratégia anti-duplicidade

- `id` slug único e estável (`marca-linha-sabor-tamanho`); EAN único quando existir.
- Antes de cada lote: comparação por nome normalizado + aliases contra o catálogo inteiro (script `auditoria-alimentos.mjs`, a ser movido para `scripts/`).
- Genérico × marca coexistem de propósito ("chocolate ao leite" genérico + "Lacta ao Leite 80 g"); vinculados por `equivalenteDe` para a busca sugerir o genérico quando a marca não existir.

## 11. Primeiro lote proposto (Fase 2 — ~25 itens de teste, dados a validar rótulo a rótulo antes da importação)

Chocolates e doces de marca (categoria com maior demanda de registro real): Sonho de Valsa, Ouro Branco, Batom ao leite, Bis ao leite, Bis Xtra, Lacta ao Leite 80 g, Prestígio, Chokito, KitKat ao leite, Snickers, Twix, M&M's chocolate ao leite, Serenata de Amor, Charge, Diamante Negro, Paçoquita, Trakinas, Oreo, Passatempo, Bono, Nescau (pó), Toddy (pó), Nutella, Doce de leite Itambé, Goiabada Predilecta.

Cada um entrará com: porção oficial do rótulo, unidade (1 bombom = X g etc.), macros por 100 g + por porção, fonte com URL e data. O lote será apresentado em tabela para aprovação **antes** de entrar no app.

## 12. Impactos técnicos mapeados

- `ModalRefeicao.jsx`: exibir marca/sabor/selos; hoje só mostra nome + kcal por porção.
- Busca: adicionar plural/singular simples e priorização de recentes/favoritos no ranking.
- `macrosDoAlimento()`: sem mudança para os campos novos (são informativos); bebidas alcoólicas precisam de kcal do rótulo (não recalcular por Atwater).
- Migrar recentes/favoritos/personalizados do localStorage para o Supabase (senão o usuário perde ao trocar de aparelho).
- Painel admin + aprovação de cadastros de usuários: exige a tabela no Supabase (decisão do item 8).
- Testes existentes: `src/utils/alimentos.test.js` — estender para novos campos e conversões.

## 13.5 Progresso da Fase 2 (atualizado em 2026-07-28)

**Feito (com TDD, testes verdes: 59/59 na suíte completa):**
- Busca agora tolera plural/singular ("bombons" encontra "bombom", "sonhos de valsa" encontra "Sonho de Valsa") e tolera uma palavra extra em consultas de 2+ termos ("chocolate Bis", "bombom Sonho de Valsa"), sem quebrar os casos exatos existentes.
- Novo campo opcional `situacao`: itens com `situacao: 'aguardando_validacao'` ficam **fora da busca padrão** (regra 1 da especificação: não publicar no banco definitivo sem confirmação). O modelo de dados já aceita `marca, sabor, subcategoria, descricao, acucares, acucaresAdicionados, gordSat, sodio, alcoolGL, ean, dataConsulta` sem exigir mudança de código (passam direto pelo objeto), retrocompatível com os 289 itens existentes.

**Bloqueado — pesquisa de rótulos de marca:** tentei confirmar dados oficiais de Bis, Sonho de Valsa, Ouro Branco e Paçoquita via busca e fetch automatizados. Resultado: as tabelas nutricionais dos fabricantes estão majoritariamente em **imagem** (não extraível como texto), sites oficiais bloquearam o acesso automatizado (403/302), e agregadores (FatSecret) deram dados parciais e por vezes inconsistentes entre porções — não confiável o suficiente para publicar como "validado".

**Decisão (usuário, 2026-07-28):** em vez de publicar valores incertos como "aguardando validação", o usuário vai enviar **fotos dos rótulos** dos produtos prioritários. Leitura de imagem é mais confiável que scraping. Lote 1 (chocolates/doces de marca) fica pausado até o recebimento das fotos.

**Próximo passo imediato:** ao receber as fotos, extrair os valores exatos do rótulo, preencher o modelo completo (porção oficial, macros, açúcares, sódio) com fonte = "rótulo do produto, foto enviada por Wanessa Auad em [data]", `situacao: 'validado'`, e apresentar a tabela do lote para aprovação final antes de inserir no `ALIMENTOS`.

## 13.6 Lote 1 inserido — chocolates/doces de marca (2026-07-28)

Criado [src/data/alimentosMarcas.js](../../src/data/alimentosMarcas.js) com testes dedicados em [alimentosMarcas.test.js](../../src/data/alimentosMarcas.test.js). Integrado ao `ALIMENTOS` (298 itens totais). 92/92 testes passando, auditoria de qualidade sem novos problemas.

**5 itens `validado`** (fonte conferida por fetch direto na página citada, valores batendo):
- Sonho de Valsa (Lacta) — Casas Pedro
- Paçoquita Diet (Santa Helena) — Consulta Remédios
- KitKat tradicional ao leite (Nestlé) — Extra Mercado
- Snickers Original (Mars) — Comper (açúcares não constavam na fonte, deixados em branco)
- Bis ao leite (Lacta) — Tabela TACO Online, confirmado por fetch direto + reconfirmado pelo usuário citando a mesma fonte

**4 itens `aguardando_validacao`** (ocultos da busca padrão pela trava em `buscarAlimentos`, fontes divergiram entre si): Paçoquita tradicional, Laka branco, Diamante Negro, Milka ao leite dos Alpes. Ficam no código para referência mas invisíveis ao usuário até confirmação por foto do rótulo.

## 13.7 Lote 1 — segunda leva (2026-07-28/29)

Mais 5 itens pesquisados e confirmados por fetch direto na fonte:

**2 novos `validado`:** Trakinas recheado chocolate (Zaffari) e Oreo Original (Cafezale) — ambos com todos os 5 macros centrais confirmados na fonte; gordura saturada/trans e açúcares adicionados ausentes na fonte consultada (campos deixados em branco, não inventados).

**3 novos `aguardando_validacao`:**
- **Ouro Branco** (Lacta) — fonte (Zaffari) confirmou kcal/açúcares/proteína/gordura/sódio, mas **não trazia carboidrato nem fibra**. Como o array `ALIMENTOS` exige todos os campos numéricos centrais preenchidos (regra do teste `alimentos.test.js`), o carboidrato foi **calculado por diferença calórica (Atwater)** e a fibra recebeu um placeholder — ambos marcados explicitamente como não confirmados no campo `fonte` e o item fica oculto da busca.
- **Nescau** — achado importante: duas fontes deram valores muito diferentes (430 kcal/17,5g proteína por 100g vs 370 kcal/3,5g proteína por 100g), sugerindo que estão descrevendo **formulações diferentes** (Nescau clássico vs Nescau 2.0/fortificado) sendo confundidas nas buscas. Não publiquei nenhuma das duas até identificar a versão exata pela foto do rótulo.
- **Nutella** — fonte confirmou kcal/carboidrato/proteína/sódio mas não gordura nem fibra (campos centrais); usados valores de referência genéricos do produto como placeholder, sinalizados como não confirmados.

Total após esta leva: **303 alimentos**, 14 de marca (9 validados, 5 aguardando validação: Paçoquita tradicional, Laka, Diamante Negro, Milka, Ouro Branco, Nescau, Nutella — 7 no total, contando a leva anterior). 92/92 testes passando, build de produção ok (`npm run build`, 14.8s, sem erros).

## 13.8 Lote 1 — terceira leva (2026-07-29)

Mais 5 itens pesquisados, 3 confirmados por fetch direto na fonte:

**3 novos `validado`:** Twix Original (Doce Malu, 40g), Chokito (Colibri Festas, 32g), M&M's Mini chocolate ao leite (TabNut/Unifesp — base acadêmica com ficha completa por 100g; nome do item deixa explícito que é a versão *mini/tubo*, não o pacote tradicional, para não misturar versões diferentes).

**2 novos `aguardando_validacao`:**
- **Toddy Original** — mesmo padrão de suspeita já visto no Nescau: a fonte confirmada por fetch direto (Pão de Açúcar) deu 16,5g de proteína/100g, enquanto uma busca ampla anterior indicava ~1,5g/100g — 10x de diferença, incompatível com simples arredondamento. Prováveis formulações/SKUs diferentes sendo confundidos. Não publicado até confirmação por foto do rótulo.
- **Serenata de Amor (Garoto)** — fonte (Solufition) confirmou kcal/carboidratos/proteína/gordura/açúcares/sódio, mas não trazia fibra alimentar (campo central obrigatório) — fica pendente só por essa lacuna.

Total após esta leva: **308 alimentos**, 19 de marca (12 validados, 7 aguardando validação). 92/92 testes passando, build de produção ok (`npm run build`, ~20s, sem erros).

**Padrão identificado nesta fase:** produtos em pó/achocolatados (Nescau, Toddy) têm mostrado buscas com valores de proteína conflitantes em ordem de grandeza — hipótese de que existem duas linhas (clássica vs. fortificada/"2.0") sendo confundidas pelos agregadores. Recomendo que a foto do rótulo desses dois, especificamente, traga bem visível o nome completo da linha/versão do produto.

## 13.9 Lote 1 — encerramento (2026-07-29)

Últimos itens da lista original pesquisados:

**3 novos `validado`:**
- Batom ao leite (Garoto) — Pão de Açúcar, todos os campos centrais confirmados.
- Doce de leite tradicional (Itambé) — Comper, todos os campos centrais confirmados.
- Goiabada Original (Predilecta) — Esfera; o próprio rótulo declara "não contém quantidades significativas de proteínas/gorduras/sódio", então esses campos são 0 **por declaração do rótulo**, não estimativa.

**1 novo `aguardando_validacao`:** Prestígio (Nestlé — corrigido: **não é Lacta**, como eu tinha assumido antes de pesquisar) — fonte confirmou kcal/carboidrato/proteína, mas não gordura nem fibra.

**1 item descartado:** "Charge" (Lacta) não apareceu em nenhuma busca como produto atualmente comercializado — não encontrei evidência de que ainda existe no mercado. Não foi cadastrado (nem como pendente) para não sugerir um produto que talvez não exista mais. Se você souber que ainda é vendido, me avise que refaço a busca.

**Lote 1 encerrado.** Total: **312 alimentos** no banco, 23 de marca (**13 validados**, buscáveis: Sonho de Valsa, Paçoquita Diet, KitKat, Bis ao leite, Snickers, Trakinas, Oreo, Twix, Chokito, M&M's Mini, Batom, Doce de leite Itambé, Goiabada Predilecta; **10 aguardando validação**, ocultos da busca: Prestígio, Toddy, Serenata de Amor, Ouro Branco, Nescau, Nutella, Paçoquita tradicional, Laka, Diamante Negro, Milka). 92/92 testes passando, build de produção ok.

## 13.10 Fase 3 — Herbalife Brasil, primeira leva (2026-07-29)

**Achado importante:** o site de marketing `herbalife.com/pt-br` não expõe tabela nutricional (é só vitrine — venda é via distribuidor independente). A tabela real está nas páginas de loja de distribuidor (`produtos.clienteherbalife.com.br`), mas como **imagem**, não texto. Solução: baixei as imagens e li o rótulo diretamente (mesmo método das fotos que você já vinha enviando) — é na prática a fonte mais confiável usada até agora, porque é o rótulo oficial em pixels, não um resumo de terceiro.

**6 produtos Herbalife reais cadastrados, todos `validado`:**

| Produto | Linha/sabor | Porção do rótulo | kcal/100g ou ml |
|---|---|---|---|
| Whey Protein 3W | Herbalife24, Chocolate | 34 g (3 medidas) | 376 |
| Beauty Booster | Skin, Frutas Vermelhas | 12 g (2 medidas) | 358 |
| Fórmula 1 Shake | Baunilha Cremoso, pó puro | 26 g | 350 |
| Protein Powder | Fórmula 3 | 6 g (1 colher de sopa) | 367 |
| Fiber Concentrate | Uva | 15 ml | 40 |
| Sopa Snack Proteica Frango com Legumes | — | 28 g (1 sachê) | 336 |

Notas de qualidade registradas no `fonte` de cada item:
- **Whey Protein 3W**: o rótulo imprime "SÓDIO 82 g" — fisicamente impossível numa porção de 34 g. Tratei como erro de impressão por "82 mg" (bate com o %VD de 3% impresso no próprio rótulo) e documentei a divergência em vez de corrigir silenciosamente.
- **Protein Powder** e **Fiber Concentrate**: o rótulo declara "não contém quantidade significativa" para carboidratos/gorduras/fibra — registrei como 0 porque é o que o rótulo diz, não uma estimativa minha.
- **Fórmula 1 Shake**: cadastrado só o pó puro (a tabela também trazia "pó + leite" e "pó + Nutrev", mas somar isso duplicaria nutrientes se o usuário já registra o leite separadamente — decisão alinhada com a regra da especificação).
- **Sopa**: contém glúten — diferente da maioria dos outros produtos Herbalife pesquisados, vale atenção.
- Auditoria automática aponta kcal do Fiber Concentrate como "incoerente" pelo cálculo simples (4/4/9 por grama) — é porque fibra solúvel rende ~2 kcal/g, não 0, e o produto é quase só fibra; não é erro de dado, é limitação do script de auditoria (mesmo padrão já visto no item genérico `hbl-fiber`).

**Itens ainda não pesquisados desta lista:** Nutri Soup (pote 416g/432g — variante maior da sopa, ainda não confirmada), demais sabores do Fórmula 1 (só Baunilha Cremoso foi confirmado), demais produtos do catálogo completo (chás, barras, isotônicos de marca, etc.).

**Sobre os 7 itens genéricos antigos (`hbl-*`):** já existiam no banco antes desta sessão, com nomes genéricos tipo "Shake proteico (pó)" e fonte "valores médios da categoria". Testei a busca por "shake herbalife" e o produto real (`herbalife-formula-1-shake-baunilha-cremoso`) já aparece em primeiro lugar, à frente do genérico — não precisei mexer em nada. Não apaguei nem alterei os genéricos (regra da especificação de não tocar em itens existentes sem diagnóstico); eles continuam disponíveis como fallback para quem registra um suplemento de outra marca sem encontrá-lo nominalmente.

Total após esta leva: **318 alimentos** no banco (29 de marca). 95/95 testes passando, build de produção ok.

## 13.11 Fase 3 — Herbalife Brasil, segunda leva (2026-07-29)

Mais 3 itens confirmados por rótulo oficial (foto/imagem):

- **Barra de Proteína** (Citrus Lemon, 35 g/1 barra) — o cabeçalho da tabela dizia "quantidade por embalagem", mas a conferência por Atwater confirmou que os valores são de 1 barra, não da caixa de 7. Sódio impresso como "25 g" tratado como 25 mg (mesmo padrão do Whey Protein 3W).
- **Herbal Concentrate** (Original, 1,7 g/½ colher de chá) — rótulo declara "não contém quantidade significativa" de proteína/gordura/fibra/sódio, registrados como 0 por declaração do próprio rótulo. Contém 85 mg de cafeína por 250 ml preparado.
- **Nutri Soup Frango com Legumes** — a imagem da tabela do site oficial (produtos.clienteherbalife.com.br) trazia um erro real: "15 kcal" e "4 g de carboidrato" por porção de 27 g, incompatível com os próprios macros da mesma tabela (9,4 g proteína bateria uns 70+ kcal, não 15). Reconferido com zoom — não era erro de leitura minha. **Wanessa enviou foto do pote físico** (rótulo com "NOVA FÓRMULA" impresso) confirmando 91 kcal/27 g, batendo com Atwater (≈89 kcal). Publicado como `validado` usando a foto real, que substitui e corrige a imagem desatualizada do site.

Esse caso do Nutri Soup é o funcionamento pretendido do processo: quando a fonte automatizada não fecha a conta, o item fica sinalizado em vez de publicado, e a foto do rótulo físico resolve com certeza.

Total: **321 alimentos** no banco, 32 de marca (9 produtos Herbalife reais validados: Whey Protein 3W, Beauty Booster, Fórmula 1 Shake, Protein Powder, Fiber Concentrate, Sopa Snack Proteica, Barra de Proteína, Herbal Concentrate, Nutri Soup). 101/101 testes passando, build de produção ok.

**Restam do catálogo Herbalife:** isotônicos de marca (CR7 Drive, Prolong), Aloe, produtos de hidratação/recuperação, demais chás/sabores, snacks. Seguem para uma próxima leva quando você quiser continuar.

## 13. Plano de testes

1. Script de auditoria roda a cada lote (duplicados, kcal×macros com regra de fibra/álcool, porções, unidades).
2. Testes unitários: conversão de medidas novas (lata 350 ml, long neck 355 ml, taça 150 ml, dose 50 ml, fatia, bombom).
3. Regressão de busca: "sonho valsa", "pao queijo", "formula 1", "coca zero" retornam o esperado.
4. Regressão do diário: registrar, editar quantidade, trocar medida, conferir totais do dia.
5. Build de produção + verificação de tamanho de bundle.
