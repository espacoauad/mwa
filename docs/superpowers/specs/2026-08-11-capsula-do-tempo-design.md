# Cápsula do Tempo — Design

## Contexto e problema

Feedback externo sobre o produto (mesma conversa que originou o Modo
Recomeçar e o início personalizado): no dia 1, a pessoa registraria como
está se sentindo e o que espera conquistar; essa mensagem ficaria guardada
e só seria reaberta no dia 90, criando um momento emocional de encerramento
que reforça o quanto ela evoluiu.

O onboarding já coleta, na tela de Personalização (`TelaPersonalizacao.jsx`),
duas respostas que capturam exatamente essa intenção inicial: "O que mais
deseja transformar?" (`foco`) e "O que espera sentir ao final dos 90 dias?"
(`sentimentoEsperado`), salvas em `mwa_perfis.personalizacao`. Não faz
sentido perguntar a mesma coisa de novo numa tela separada no dia 1 — a
Cápsula do Tempo reaproveita essas respostas já existentes.

A tela de encerramento do dia 90 (`Conclusao90Dias.jsx`) já existe e é rica:
mostra a diferença de peso, sementes conquistadas, refeições registradas,
uma lista de conquistas reveláveis (déficit calórico, macros, fibras etc.) e
um certificado. A Cápsula do Tempo é uma seção nova dentro dessa mesma tela,
não um fluxo separado.

## Objetivo

Ao chegar no dia 90, mostrar um bloco "Cápsula do Tempo" que relembra a
intenção registrada no dia 1 (via as respostas já salvas do onboarding),
uma comparação de fotos antes/depois (quando disponível) e uma mensagem de
encerramento fixa, escrita por Wanessa.

## Lacuna encontrada

`concluirOnboarding` (em `AppContext.jsx`) já salva `personalizacao` em
`mwa_perfis` ao final do onboarding, mas `perfilParaUsuario` — a função que
transforma a linha do banco no objeto `usuario` usado pelo resto do app —
não inclui esse campo. Hoje, `usuario.personalizacao` é sempre
`undefined` fora do próprio fluxo de onboarding. Esta spec corrige isso.

## Modelo de dados

Nenhuma tabela ou coluna nova. A feature é 100% leitura de dados que já
existem:

- `mwa_perfis.personalizacao` (jsonb, já existe) — `foco` e
  `sentimentoEsperado`, usados via `montarFraseRecepcao` (já existe em
  `src/utils/personalizacao.js`, mesma função usada na frase de recepção do
  onboarding — sem duplicar lógica de fragmento).
- `mwa_pesagens.fotos` (jsonb, já existe) — usa `fotos.frente` da primeira
  e da última pesagem registrada da pessoa.

### `perfilParaUsuario` (alteração)

Em `src/context/AppContext.jsx`, a função `perfilParaUsuario(p)` ganha um
campo novo no objeto que retorna:

```js
personalizacao: p.personalizacao ?? {},
```

## Seção "Cápsula do Tempo"

Nova seção dentro de `Conclusao90Dias.jsx`, posicionada logo após o bloco
de saudação/título ("👑 90 DIAS...") e antes do grid de números da jornada
(peso/sementes/refeições) — revive o dia 1 antes de mostrar os números
finais.

**Condição de exibição:** a seção inteira só renderiza se
`usuario.personalizacao?.foco` existir. Contas criadas antes desta feature
(sem personalização registrada) simplesmente não veem a seção — sem espaço
vazio, sem erro.

**Conteúdo, de cima para baixo:**

1. **Relato inicial** — reconstrói a frase usando `montarFraseRecepcao`:

   > "No primeiro dia, seu foco era **{foco}**, e você esperava terminar se
   > sentindo **{sentimentoEsperado}**."

   Mesmo tratamento de "Outro" (texto livre) que a frase de recepção do
   onboarding já usa — `montarFraseRecepcao` já resolve isso, nenhuma
   lógica nova aqui.

2. **Fotos antes/depois** — bloco opcional, só aparece se:
   - existir pelo menos 2 pesagens registradas, **e**
   - a primeira e a última pesagem tiverem `fotos.frente` preenchido, **e**
   - a primeira e a última pesagem não forem a mesma (evita comparar uma
     foto única consigo mesma).

   Mostra as duas fotos lado a lado, com rótulos "Dia 1" e "Dia 90" (ou o
   dia real da última pesagem, se for diferente de 90 — mas rotulado
   "Hoje" por simplicidade, já que essa tela só aparece no dia 90).

3. **Mensagem de encerramento** — texto fixo, igual para todas as pessoas,
   sem interpolação de nome (o restante da tela já usa `primeiroNome` em
   outros pontos):

   > "Quando você começou, escreveu o que esperava sentir ao final desses
   > 90 dias. Hoje, esse dia chegou. Não importa se cada meta foi cumprida
   > à risca — o que importa é a constância que você construiu, dia após
   > dia, e isso já é a maior prova de que você é capaz de sustentar uma
   > mudança de verdade. Estou muito orgulhosa de você.
   > Com carinho, Wanessa."

## Fora de escopo

- Qualquer pergunta nova no dia 1 — a Cápsula reaproveita 100% as respostas
  já coletadas no onboarding (`foco`, `sentimentoEsperado`).
- "Hábitos conquistados" e "principais aprendizados" (itens da ideia
  original) — a lista de conquistas reveláveis que já existe em
  `Conclusao90Dias.jsx` (déficit, macros, fibras, densidade nutricional
  etc.) já cobre esse papel; repetir seria redundante na mesma tela.
- Gravação em áudio/vídeo da reflexão inicial — a spec original mencionava
  "escreveria ou gravaria"; aqui é só texto, reaproveitando dados já
  escritos no onboarding.
- Mensagem de encerramento personalizada por pessoa — é um texto único,
  fixo, o mesmo para todas.
- Qualquer edição da Cápsula depois de criada — não há tela de edição.

## Testes

- Nenhuma lógica pura nova é introduzida (a formatação da frase reaproveita
  `montarFraseRecepcao`, já testado). O que precisa de verificação:
  - `perfilParaUsuario` inclui `personalizacao` corretamente a partir de
    uma linha de `mwa_perfis` simulada — se essa função já tiver testes
    unitários, adicionar um caso; caso contrário, verificar manualmente.
  - Verificação manual no navegador (não há harness de teste de componente
    neste repositório): conta de teste com `personalizacao` preenchida e
    2+ pesagens com foto de frente → seção aparece completa; conta sem
    `personalizacao` → seção não aparece; conta com `personalizacao` mas
    sem pesagens com foto → seção aparece sem o bloco de fotos.
