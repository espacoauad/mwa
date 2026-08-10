# Início personalizado (onboarding) — Design

## Contexto e problema

Hoje o onboarding do MWA (`OnboardingFlow.jsx`) tem 5 telas — Consentimento,
Contato, Biometria, Corporais (opcional), Metas — todas voltadas a dados
biométricos e de contato. A tela final (`TelaMetas.jsx`) já monta uma frase
simples a partir do objetivo escolhido ("Suas metas para o objetivo
**emagrecer** 🎯 foram calculadas"), mas nada no fluxo pergunta como a
pessoa está se sentindo, o que ela quer transformar, ou como estão seus
hábitos hoje.

Feedback externo sobre o produto (conversa de 2026-08-09/10): o app "não
soa genérico" quando a cliente sente que ele já a conhece desde o primeiro
minuto. Esta spec adiciona duas telas novas ao onboarding para coletar essa
personalização e usá-la numa recepção customizada ao final.

## Objetivo

1. Coletar 4 respostas motivacionais (usadas para montar uma frase de
   recepção personalizada) e 5 respostas de hábitos de saúde (guardadas
   para uso futuro em outras partes do app, sem uso imediato além do
   armazenamento).
2. Exibir a frase de recepção na tela final do onboarding, junto das metas
   de macro que já existem hoje.
3. Não usar nenhuma API de IA/LLM — o projeto não tem essa integração hoje;
   a frase é montada por template simples em JS, mesmo padrão já usado em
   `TelaMetas.jsx` para o objetivo.

## Modelo de dados

### `mwa_perfis` (alteração)

Nova coluna, mesmo padrão da coluna `medidas` já existente:

| coluna | tipo | notas |
|---|---|---|
| `personalizacao` | jsonb | default `'{}'::jsonb`. Ver formato abaixo. |

Formato do jsonb:

```json
{
  "foco": "rotina",
  "focoOutro": null,
  "obstaculo": "cobranca",
  "rotina": "corrida",
  "sentimentoEsperado": "orgulhosa",
  "sentimentoEsperadoOutro": null,
  "sono": "cansada",
  "hidratacao": null,
  "habitosAlimentares": "equilibrados",
  "intestino": null,
  "disposicao": "vai_e_volta"
}
```

Campos de hábitos (`sono`, `hidratacao`, `habitosAlimentares`, `intestino`,
`disposicao`) ficam `null` se a tela de Hábitos for pulada inteira ou se a
pergunta específica for respondida como "Prefiro não responder". Campos
`focoOutro`/`sentimentoEsperadoOutro` só têm valor quando a opção "Outro"
foi escolhida na respectiva pergunta; nesse caso o campo principal
(`foco`/`sentimentoEsperado`) guarda a string `'outro'`.

## Perguntas

### Tela de Personalização (motivação) — obrigatória

| pergunta | chave | opções |
|---|---|---|
| O que mais deseja transformar? | `foco` | `alimentacao`, `corpo`, `rotina`, `emocional`, `outro` (texto livre) |
| Em que momento costuma desistir? | `obstaculo` | `falta_tempo`, `perde_motivacao`, `cobranca`, `fora_da_dieta`, `outro` (texto livre) |
| Como está sua rotina hoje? | `rotina` | `corrida`, `organizada_sem_foco`, `tranquila_sem_constancia`, `bagunçada`, `outro` (texto livre) |
| O que espera sentir ao final dos 90 dias? | `sentimentoEsperado` | `leve`, `orgulhosa`, `tranquila`, `confiante`, `outro` (texto livre) |

Labels dos chips:

- `foco`: "Sua relação com a alimentação" / "Seu corpo e disposição" / "Sua rotina e constância" / "Sua relação emocional com a comida"
- `obstaculo`: "Quando a rotina fica corrida" / "Depois que a motivação inicial passa" / "Quando me cobro demais e desanimo" / "Depois de escapar da dieta uma vez"
- `rotina`: "Corrida, sem tempo pra mim" / "Organizada, mas sem espaço pra me cuidar" / "Tranquila, mas sem constância" / "Bagunçada, quero recomeçar"
- `sentimentoEsperado`: "Mais leve e disposta" / "Orgulhosa de ter sido constante" / "Com uma relação mais tranquila com a comida" / "Mais confiante com meu corpo"

**Validação:** `foco` e `sentimentoEsperado` são obrigatórios para habilitar
"Continuar" (entram na frase de recepção). `obstaculo` e `rotina` são
opcionais. Escolher um chip preenchido limpa o campo "Outro" da mesma
pergunta e vice-versa (mutuamente exclusivos).

### Tela de Hábitos — 100% opcional

Botão "Pular esta etapa" no topo, mesmo padrão de `TelaCorporais.jsx`.

| pergunta | chave | opções |
|---|---|---|
| Como está seu sono? | `sono` | `bem_disposta`, `cansada`, `pouco`, `irregular`, `prefiro_nao_responder` |
| Como está sua hidratação? | `hidratacao` | `bastante`, `pouca`, `so_com_sede`, `troca_por_outras`, `prefiro_nao_responder` |
| Como você considera seus hábitos alimentares hoje? | `habitosAlimentares` | `equilibrados`, `desorganizados`, `restritivos`, `exagero_fds`, `prefiro_nao_responder` |
| Como está seu intestino? | `intestino` | `regular`, `preso`, `irregular`, `prefiro_nao_responder` |
| Como está sua disposição no dia a dia? | `disposicao` | `alta`, `cansaco_maior_parte`, `so_manha`, `vai_e_volta`, `prefiro_nao_responder` |

Labels dos chips:

- `sono`: "Durmo bem e acordo disposta" / "Durmo, mas acordo cansada" / "Durmo pouco (menos de 6h)" / "Sono irregular, varia muito" / "Prefiro não responder"
- `hidratacao`: "Bebo bastante água todo dia" / "Bebo pouca água, esqueço" / "Só bebo quando sinto muita sede" / "Troco água por outras bebidas (café, suco, refrigerante)" / "Prefiro não responder"
- `habitosAlimentares`: "Equilibrados, mas quero evoluir" / "Desorganizados, como o que der" / "Muito restritivos, vivo de dieta em dieta" / "Bons, mas com exageros no fim de semana" / "Prefiro não responder"
- `intestino`: "Funciona bem, regular" / "Preso, com frequência" / "Muito irregular, varia bastante" / "Prefiro não responder"
- `disposicao`: "Alta, me sinto com energia" / "Cansaço na maior parte do tempo" / "Só de manhã, canso ao longo do dia" / "Vai e volta, depende do dia" / "Prefiro não responder"

Nenhuma pergunta desta tela é obrigatória; "Continuar" sempre habilitado,
independentemente do preenchimento.

## Frase de recepção

Em `TelaMetas.jsx`, um novo parágrafo entre o título ("Prontinho, {nome}!")
e o card de metabolismo:

> "**{nome}**, nos próximos 90 dias, seu foco será **{fragmento de foco}**,
> para você terminar se sentindo **{fragmento de sentimentoEsperado}**."

Mapeamento de `foco` → fragmento (usado quando `foco !== 'outro'`):

- `alimentacao` → "sua relação com a alimentação"
- `corpo` → "seu corpo e disposição"
- `rotina` → "sua rotina e constância"
- `emocional` → "sua relação emocional com a comida"
- `outro` → usa `dados.focoOutro` diretamente (o placeholder do campo já
  orienta a pessoa a escrever como um fragmento de frase, ex.: "comer sem
  culpa nos fins de semana")

Mapeamento de `sentimentoEsperado` → fragmento (mesma lógica, usa
`dados.sentimentoEsperadoOutro` quando `'outro'`):

- `leve` → "mais leve e disposta"
- `orgulhosa` → "orgulhosa de ter sido constante"
- `tranquila` → "com uma relação mais tranquila com a comida"
- `confiante` → "mais confiante com seu corpo"

As respostas de `obstaculo`, `rotina` e das 5 perguntas de hábitos não
entram nesta frase — ficam apenas salvas em `mwa_perfis.personalizacao`
para uso futuro em outras partes do app (fora do escopo desta spec).

## Fluxo do onboarding

`OnboardingFlow.jsx` passa de `TOTAL_TELAS = 5` para `7`:

Consentimento → Contato → Biometria → Corporais → **Personalização** (nova)
→ **Hábitos** (nova, opcional) → Metas (final)

Novos componentes, seguindo o padrão de `TelaBiometria.jsx`/`TelaCorporais.jsx`:

- `src/components/onboarding/TelaPersonalizacao.jsx`
- `src/components/onboarding/TelaHabitos.jsx`

`dados` (estado central de `OnboardingFlow.jsx`) ganha os 11 campos novos
listados no modelo de dados, todos inicializados como `''` (chips) ou
`null` (campos "Outro"), exceto os de hábitos que inicializam como `null`.

`concluirOnboarding` (em `AppContext.jsx`) passa a incluir
`personalizacao: { foco, focoOutro, obstaculo, rotina, sentimentoEsperado, sentimentoEsperadoOutro, sono, hidratacao, habitosAlimentares, intestino, disposicao }`
no insert de `mwa_perfis`.

## Fora de escopo

- Qualquer geração de texto via IA/LLM — a frase de recepção é 100%
  template/regras em JS, sem chamada externa.
- Usar as respostas de hábitos (sono, hidratação, etc.) em qualquer outra
  tela do app (resumo semanal, dicas, Modo Recomeçar) — ficam apenas
  salvas, prontas para uso futuro quando essas outras features forem
  desenhadas.
- Editar essas respostas depois do onboarding (não há tela de edição em
  Perfil para revisitar `personalizacao`).
- Testes automatizados de componente — não existe harness de teste de
  componente React neste repositório (`node --test` roda apenas arquivos
  `.js` puros); a validação de `foco`/`sentimentoEsperado` obrigatórios e o
  cálculo do fragmento de frase (função pura) são cobertos por testes
  unitários; a UI em si é verificada manualmente no navegador.

## Testes

- Nova função pura `montarFraseRecepcao(dados)` em
  `src/utils/personalizacao.js` (arquivo `.js` puro, não `.jsx` — precisa
  ser importável por `node --test` sem transform de JSX, mesma razão pela
  qual a falha pré-existente em `integridade.test.js` existe hoje).
  `TelaMetas.jsx` importa e usa essa função. Coberta por testes unitários:
  mapeamento de cada opção de `foco`/`sentimentoEsperado` para o fragmento
  correto, uso de `focoOutro`/`sentimentoEsperadoOutro` quando a opção é
  `'outro'`.
- Verificação manual no navegador: preencher a tela de Personalização,
  pular a tela de Hábitos, confirmar que a frase de recepção aparece
  corretamente em `TelaMetas.jsx`; repetir preenchendo Hábitos também e
  confirmar que `mwa_perfis.personalizacao` foi salvo com os 11 campos.
