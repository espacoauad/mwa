# MWA FARM — Design

Data: 2026-07-29 · Status: aprovado pela proprietária, aguardando revisão do spec escrito.

## 1. Contexto e objetivo

A proprietária pediu uma "fazendinha animada" estilo Township: a cada dia do programa a pessoa "planta" hábitos novos e vê a fazenda crescer — flores, plantas e árvores nascendo. O objetivo é dar um retrato visual contínuo e envolvente da jornada, complementar às Estrelas do Dia (que recompensam esforço diário) e ao Monte Seu Prato (que ensina nutrição). A MWA FARM não ensina nem recompensa — é vitrine viva do progresso, e por isso pode adotar um visual mais lúdico/fofo (Township) do que o resto do app, decisão explícita da proprietária mesmo sabendo que isso destoa da diretriz "sem estética infantil" definida para os jogos educativos.

## 2. Descoberta técnica que recalibrou os números

O programa **não é 30 dias + 90 dias separados**. É um único contador (`diaDoPrograma`, em `src/utils/calculos.js`) que conta a partir de uma única data-âncora:
- Sem o programa de continuidade (90d) ativo: o contador **trava em 30**.
- Com o 90d ativo: o teto sobe para **90**, usando a mesma data-âncora (não recomeça do zero).

Ou seja, o teto real é **90 dias**, não 120. Todos os números de liberação e crescimento abaixo foram calibrados para esse teto.

**Decisão explícita**: quem nunca compra a continuidade de 90 dias verá a fazenda travada num estado parcial a partir do dia 30 (nem todos os pilares desbloqueados, nenhum na fase final) — reforça organicamente o valor de seguir para os 90 dias, sem ser um bloqueio artificial (a pessoa não perde nada que já tinha, só não vê a fazenda terminar de florescer). A proprietária foi informada dessa implicação antes da aprovação.

## 3. Estrutura de crescimento

### 3.1 Pilares (8, reaproveitando o conceito do extinto Jogo do Plantio)

`alimentacao`, `hidratacao`, `movimento`, `sono`, `planejamento`, `macros`, `digestao`, `calorias`.

Cada pilar é uma "plantação" própria na cena, com nome, cor de destaque e um texto educativo curto (1 frase, tom acolhedor). O arquivo `JogoPlantio.jsx` já foi removido do repositório (aposentado na Fase 4 dos jogos) — os textos serão **escritos do zero** para o contexto da fazenda, apenas inspirados no espírito daquele jogo, não copiados de nenhum arquivo existente.

### 3.2 Liberação dos pilares

1 pilar novo a cada 4 dias, começando no dia 1: **dias 1, 5, 9, 13, 17, 21, 25, 29** (fórmula `1 + índice × 4`, mesmo padrão de `diaLiberacaoJogo`). Todos os 8 pilares liberados até o dia 29, dentro da janela dos primeiros 30 dias — não depende de ter comprado a continuidade.

### 3.3 Estágios dentro de cada pilar

4 estágios: **semente → broto → floração → plena**. Avança 1 estágio a cada **20 dias** desde que aquele pilar foi liberado (3 transições = 60 dias após liberar).

```
estagio(pilar, diaAtual) = min(3, floor((diaAtual - diaLiberacao(pilar)) / 20))
```

Com essa fórmula, o último pilar (liberado no dia 29) atinge a fase plena por volta do **dia 89** — a fazenda "fecha" rica bem perto do fim da jornada de 90 dias, como pedido. O primeiro pilar (dia 1) já está pleno por volta do dia 61, e permanece assim — sem regressão.

**Cadência de novidade**: combinando os 8 dias de liberação com as ~3 transições de cada pilar (24 eventos de estágio no total, espalhados de forma escalonada pelos 90 dias), há uma mudança visível na fazenda a cada 2-4 dias em média — não só quando um pilar novo aparece.

### 3.4 Decorações sazonais (independentes dos pilares)

A cada 15 dias, um elemento novo aparece na cena, sem relação com nenhum pilar específico — só para a fazenda ficar mais viva com o tempo:

| Dia | Elemento |
|-----|----------|
| 15 | Cerca de madeira |
| 30 | Colmeia + abelha |
| 45 | Celeiro pequeno |
| 60 | Espantalho |
| 75 | Bandeirinhas coloridas |
| 90 | Placa "90 dias" + fogos discretos |

Mais 3 bichinhos decorativos entram em marcos intermediários, escolhidos para NÃO coincidir com dias de liberação de pilar (1,5,9,13,17,21,25,29) nem com os marcos de 15 em 15 da tabela acima — assim a novidade fica mais bem distribuída pelo calendário: galinha (dia 11), coelho (dia 23), vaquinha (dia 65).

## 4. Interatividade

- A fazenda cresce sozinha — **nenhuma ação é necessária**. Isso é proposital: diferencia da Estrela do Dia (que premia esforço) e evita virar "mais uma tarefa".
- Tocar numa planta ou bichinho dispara uma animação curta (pulinho/balanço) e abre um cartão pequeno com o nome do hábito daquele pilar + uma frase educativa curta.
- Plantações ainda não liberadas aparecem como silhueta/vaso vazio com "🔒 libera no dia X" — sem interação.

## 5. Visual e animação

- SVG ilustrado, estilo Township (formas arredondadas, cores quentes), mais fofo que o padrão "premium sóbrio" usado no Monte Seu Prato — decisão da proprietária.
- **Molde de planta compartilhado** entre os 4 estágios, parametrizado por cor de destaque + uma "coroa" (flor/fruto/copa) exclusiva por pilar → 8 coroas × 4 portes, em vez de 32 ilustrações do zero.
- 5 bichinhos (galinha, coelho, abelha, borboleta, vaquinha) como SVGs simples e fofos.
- Animações via CSS apenas (balanço de folhas, bichinho com bob/walk loop leve, borboleta esvoaçando) — sem canvas, sem bibliotecas de animação. Respeita `prefers-reduced-motion` (as animações de destaque somem, mantendo só o estado visual final).

## 6. Onde mora e como se integra

- Card de destaque na aba **Ferramentas**, acima da seção "Jogos de Nutrição" (não vira aba própria na barra inferior — decisão revisada da proprietária após ver que já são 6 abas).
- Abre em modal de tela cheia, mesmo padrão dos outros jogos (`role="dialog"`, Esc fecha, foco move ao abrir).
- **Zero mudança no banco de dados.** Todo o estado é derivado de `diaAtual`, que já existe no `AppContext`. Sem tabela nova, sem persistência própria.
- Sem interação com o sistema de sementes/recompensas — a MWA FARM não concede nem consome 🌱.

## 7. Arquivos novos

- `src/data/farm/pilares.js` — 8 pilares (id, nome/nomeEN, corAcento, tituloHabito/EN, textoEducativo/EN).
- `src/data/farm/decoracoes.js` — decorações sazonais e bichinhos (id, dia, tipo, nome/EN).
- `src/utils/farm/crescimento.js` — funções puras: `diaLiberacaoPilar`, `pilarLiberado`, `estagioDoPilar`, `decoracoesLiberadas`, `resumoFazenda`. Testadas via TDD, mesmo padrão dos demais jogos.
- `src/components/game/svg/PlantaFazenda.jsx` — molde de planta parametrizado (estágio + cor + coroa).
- `src/components/game/svg/AnimalFazendaSvg.jsx` — os 5 bichinhos.
- `src/components/game/MwaFarm.jsx` — tela principal (modal), cena com os 8 canteiros, decorações posicionadas, interação de toque.
- Alteração em `src/components/ferramentas/Ferramentas.jsx`: novo card de destaque + lazy import do modal.

## 8. Tratamento de erros e casos-limite

- `diaAtual` ausente/indefinido (ex.: contexto de demo sem login) → assume dia 1 (só o primeiro pilar em estágio semente, resto bloqueado), sem quebrar — mesmo padrão defensivo já usado em `afirmacaoDoDia`.
- `diaAtual` maior que 90 (não deveria acontecer, já que `diaDoPrograma` trava em 90, mas a função de estágio usa `min(3, ...)` e a de decorações usa comparação simples — ambas são seguras para qualquer valor acima do teto).
- Acessibilidade: cada planta/bichinho interativo é um `<button>` de verdade com `aria-label` nomeando o hábito, não uma `div` com `onClick`. Textos PT/EN em tudo, seguindo o padrão do projeto.

## 9. Testes

- `src/utils/farm/crescimento.test.js`: fórmula de liberação para os 8 pilares; cálculo de estágio em limites exatos (dia da liberação, 19 dias depois, 20 dias depois, 60+ dias depois); decorações liberadas nos limites de cada marco (dia 14 vs. 15); nenhuma regressão de estágio.
- `src/data/farm/pilares.test.js` (integridade): 8 pilares, ids únicos, textos bilíngues presentes — mesmo padrão de `ingredientes.test.js` e `conteudoJogos.test.js`.

## 10. Fora de escopo (não faz parte desta entrega)

- Qualquer recompensa em sementes por interagir com a fazenda.
- Persistência de estado além do que já existe (`diaAtual`).
- Aba própria na barra de navegação.
- Segunda fazenda/expansão separada para os 90 dias (a mesma cena evolui continuamente).
