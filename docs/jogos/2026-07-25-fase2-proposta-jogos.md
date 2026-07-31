# Fase 2 — Proposta de Reformulação dos Jogos MWA

Data: 2026-07-25 · Depende de: `2026-07-25-fase1-diagnostico-jogos.md` · Nenhum código alterado ainda.

## 0. Decisões da proprietária já incorporadas

| Decisão | Resposta |
|---------|----------|
| Jardim de Afirmações | Vira "momento de cuidado" diário, em versão melhorada |
| Loja do avatar | Mantém skins atuais **e** adiciona linha mais adulta |
| Ilustrações dos ingredientes | SVGs próprios (premium) |
| Lista de jogos da nova arquitetura | Aprovada |
| Novo requisito | Sistema de **estrelas diárias + push** para trazer a pessoa ao app todos os dias |

**Recomendação sobre o Jogo da Colheita (pendente): MANTER como "pausa leve".**
Motivos: (1) é tecnicamente sólido e sem custo de manutenção; (2) jogos casuais curtos aumentam retenção e frequência de abertura do app — exatamente o objetivo do sistema de estrelas; (3) aposentá-lo removeria o único momento "sem cobrança" do app. Condições: sai da prateleira "educativa" (nova seção "Pausas"), corrige o bug de tabuleiro sem jogadas possíveis, e a descrição deixa claro que é relaxamento, não aprendizado.

## 1. Nova arquitetura de jogos

Duas prateleiras na aba Ferramentas (ou nova aba "Jornada de Jogos"):

### Prateleira A — Jogos de Nutrição (educativos, com progressão)
1. **Monte Seu Prato** ⭐ (carro-chefe)
2. **Verdadeiro, Falso ou Depende** (evolução do Jogo do Plantio, mantém metáfora da planta)
3. **Troca Inteligente**
4. **Batalha da Saciedade**
5. **Detetive dos Rótulos**
6. **Desafio do Dia** (missão curta ligada ao conteúdo do dia da jornada)

### Prateleira B — Pausas e Cuidado
7. **Jogo da Colheita** (match-3, "pausa leve", corrigido)
8. **Momento MWA** (ex-Jardim de Afirmações, reformulado — ver §6)

Aposentados: Jogo das Escolhas, Jogo do Treino, Jogo da Poda.
Liberação gradual mantida (1 novo a cada 3 dias), nova ordem: Colheita (d1) → Monte Seu Prato (d2) → V/F/Depende (d5) → Troca Inteligente (d8) → Batalha da Saciedade (d11) → Detetive dos Rótulos (d14) → Desafio do Dia (diário, desde d3). Momento MWA disponível desde o dia 1 na aba Hoje.

## 2. Monte Seu Prato — especificação

### Jornada do usuário
1. **Escolher missão** (cards com nível, melhor resultado em estrelas e status).
2. **Montar o prato**: abas por categoria (Proteínas, Carboidratos, Vegetais, Frutas, Gorduras boas, Bebidas, Molhos/Extras). Tocar adiciona ao prato; tocar no item do prato permite ajustar porção (½×, 1×, 1½×, 2×) ou remover. Prato visual central + painel nutricional ao vivo (kcal, prot, carb, gord, fibra) com barras indicando a faixa-alvo da missão.
3. **Confirmar** → tela de análise: 0–3 estrelas, o que acertou, o que pode melhorar, 1 sugestão de troca inteligente, 1 micro-ensinamento. Botões: Tentar de novo · Próxima missão.

### Missões de lançamento (Fase 3 — protótipo)
1. Monte um lanche equilibrado (nível 1)
2. Monte um jantar equilibrado (nível 1)
3. Monte uma refeição rica em proteínas e fibras (nível 2)

Backlog (Fase 4): faixa calórica máxima, maior saciedade, melhorar prato desequilibrado ("Corrija o Prato" vira missão deste jogo, evitando app inchado), situações cotidianas (marmita de trabalho, pós-treino, restaurante por quilo).

### Avaliação multicritério (0–100 → estrelas)
- Adequação à missão (40 pts): metas específicas da missão (faixa kcal, mínimo de proteína/fibra etc.).
- Equilíbrio de macros (20 pts): distribuição dentro de faixas amplas (não há proporção única "certa").
- Variedade e grupos (15 pts): presença de vegetais/frutas, diversidade de grupos.
- Porções (15 pts): penaliza suavemente extremos (prato de 1200 kcal num lanche, ou prato só com 80 kcal).
- Índice de saciedade estimada (10 pts): heurística proteína + fibra + volume/densidade calórica, sempre comunicada com linguagem probabilística ("tende a saciar mais").
- ≥85 = 3⭐ · 65–84 = 2⭐ · 45–64 = 1⭐ · <45 = "vamos ajustar juntos" (sem tom punitivo).
- Várias combinações atingem 3⭐ — não existe resposta única.

### Feedback (tom acolhedor, nunca moralista)
Modelo: "Seu prato ficou rico em proteínas (32 g) e tem uma boa fonte de fibras. Para aumentar a saciedade, você poderia acrescentar uma porção de vegetais. 💡 Fibra + proteína retardam o esvaziamento gástrico — é por isso que esse par tende a segurar a fome por mais tempo."

### Dados — sem duplicar números
`src/data/jogos/ingredientes.js` referencia `alimentos.js` (fonte única TACO/TBCA, valores por 100 g). O jogo só adiciona metadados:

```js
{
  alimentoId: 'frango-grelhado',      // chave em alimentos.js — macros vêm de lá
  grupo: 'proteina',                  // proteina|carbo|vegetal|fruta|gordura|bebida|extra
  porcao: { g: 120, rotulo: '1 filé médio' },
  porcoesPermitidas: [0.5, 1, 1.5, 2],
  svg: 'frango-grelhado',             // id na biblioteca de SVGs premium
  refeicoes: ['almoco', 'jantar'],
  fonte: 'TACO 4ª ed.',
}
```

`src/data/jogos/missoes.js`:

```js
{
  id: 'lanche-equilibrado', nivel: 1, tipoRefeicao: 'lanche',
  titulo: 'Monte um lanche equilibrado',
  criterios: { kcal: { min: 150, max: 400 }, prot: { min: 10 }, fibra: { min: 4 },
               gruposMin: { 'vegetal|fruta': 1 } },
  ensinamento: '...', // micro-lição exibida no resultado
}
```

Motor de pontuação em `src/utils/jogos/avaliarPrato.js` (puro, testável com vitest — já existe padrão de testes em `utils/*.test.js`).

### SVGs premium
Biblioteca própria `src/components/game/svg/IngredienteSvg.jsx` (sprite único, flat, paleta verde+dourado+tons naturais, traço consistente). ~40 ingredientes no protótipo. Sem fotos (peso) e sem emoji.

## 3. Demais jogos (Fase 4)

- **V/F/Depende**: banco ≥60 perguntas em `src/data/jogos/perguntas.js` (campos: afirmação, resposta `v|f|depende`, explicação ≤2 frases, fonte, nível, tema). 8 por rodada, sorteadas sem repetir as últimas vistas. Errou → mostra a explicação e segue (aprende-se do erro; sem clique até acertar). Planta cresce com participação + acertos.
- **Troca Inteligente**: refeição ilustrada + missão ("aumente a proteína") + 3 trocas possíveis; qualquer troca coerente pontua, a melhor pontua mais; impacto numérico mostrado antes/depois.
- **Batalha da Saciedade**: 2 refeições com kcal semelhantes; escolher a que "tende a saciar mais"; revela os porquês (proteína, fibra, volume, líquido vs. sólido).
- **Detetive dos Rótulos**: rótulo simulado (estilo ANVISA); 3 perguntas por rótulo (porção vs. embalagem, açúcar total consumido, comparação de sódio).
- **Desafio do Dia**: 1 pergunta/missão curta derivada do conteúdo educativo do dia (`dicas90.js`/`informativos.js`) — reforço espaçado do que a pessoa leu.

## 4. Progressão e persistência

- Por jogo: nível, melhor pontuação, total de partidas, estrelas acumuladas.
- Recompensas: participação sempre vale algo (+3 🌱), desempenho dá bônus (+5 a +12), primeira vez 3⭐ numa missão dá medalha. Fim do tudo-ou-nada.
- **Mudança de banco necessária (1 tabela nova)** — `mwa_jogos_progresso`:
  - Campos: `user_id`, `jogo_id`, `missao_id?`, `nivel`, `melhor_pontuacao`, `estrelas`, `partidas`, `atualizado_em`. RLS igual a `mwa_game`.
  - Motivo: hoje nada persiste além do evento de recompensa; melhor pontuação/estrelas exigem estado por jogo.
  - Impacto: zero em dados existentes (tabela nova, aditiva). Migração: 1 arquivo em `supabase/migrations/`. Sem mudança nas tabelas atuais.
- Eventos de recompensa continuam em `mwa_game_eventos` (dedup por `ref` já resolve "1× por dia").

## 5. Estrelas do Dia — sistema de retorno diário + push

### Mecânica (simples de entender: "entre todo dia e ganhe sua estrela")
- **1 estrela dourada por dia**, ganha ao completar **2 de 3** micro-metas: ① registrar 1 refeição ou água · ② ler o conteúdo do dia · ③ jogar 1 desafio (qualquer jogo educativo).
- **Céu da semana**: 7 estrelas viram uma **constelação** → bônus (+25 🌱 + medalha). Visual: card no topo da aba Hoje com as estrelas da semana acendendo em dourado.
- Não punitivo: perdeu um dia, a constelação recomeça, mas as estrelas do mês ficam no histórico (calendário mensal de estrelas no Perfil). Integra com o streak existente (`sequencia_dias`) — a estrela é a versão *visível e celebrada* do streak que hoje é só um número com chama.
- Persistência: reutiliza `mwa_game_eventos` com `tipo: 'estrela_dia'`, `ref: data` (dedup automática, **sem tabela nova**).

### Push — situação real e proposta
- **Hoje**: o app só usa `Notification` do navegador **com o app aberto** (`notificacoesReminder.js`). Isso não traz ninguém de volta.
- **Proposta em 2 etapas**:
  - **Etapa A (junto com a Fase 4, sem servidor)**: PWA + service worker com notificações locais agendadas onde o SO permite; banner in-app "sua estrela de hoje ainda está apagada" ao abrir.
  - **Etapa B (push real, requer infraestrutura — aprovação separada)**: Web Push com chaves VAPID; tabela nova `mwa_push_subscriptions` (user_id, endpoint, chaves, horário preferido); Edge Function `enviar-push-diario` rodando 1×/dia (cron do Supabase) enviando para quem ainda não ganhou a estrela. Exemplos de mensagem: "⭐ Sua estrela de hoje ainda não acendeu — 2 minutinhos e ela é sua." · "🌱 Dia 12 da sua jornada. Seu desafio de hoje já está pronto." Horário escolhido pela usuária no Perfil; opção de desligar (LGPD).

## 6. Momento MWA (ex-Jardim de Afirmações) — versão melhorada

- Sai da lista de jogos; vira card diário na aba **Hoje**.
- Fluxo (≈40 s): 1 afirmação do dia (banco ampliado de 8 → 40+, sem repetição próxima) → respiração guiada de 3 ciclos (animação de círculo expandindo, discreta) → "intenção do dia" opcional em 1 toque ("Hoje eu escolho: constância / gentileza / presença / foco").
- Recompensa: +5 🌱 (antes +15) e conta como micro-meta ② da Estrela do Dia.
- Conteúdo mantém a voz da marca das afirmações atuais.

## 7. Loja do avatar

- Mantém as 12 skins atuais.
- Nova **Coleção Elegante** (6 itens premium, preços altos = objetivo de longo prazo): ex. Garça Real, Cisne, Leoa, Beija-flor Dourado, Gata Siamesa, Fênix; 3 fundos ("Mármore", "Champagne", "Jardim Noturno") e 2 molduras ("Ouro Escovado", "Esmeralda"). SVGs próprios em vez de emoji — mesma biblioteca visual dos ingredientes.

## 8. Wireframes

Prévia visual das 3 telas principais do Monte Seu Prato + card Estrelas do Dia apresentada no chat (mockup). Referência textual:

```
[Missões]            [Montagem]                 [Resultado]
┌──────────────┐     ┌──────────────────┐      ┌──────────────────┐
│ Nível 1      │     │ Missão + alvo    │      │  ⭐⭐⭐ 92/100     │
│ ▸ Lanche eq. │     │ [prato visual]   │      │  O que acertou    │
│ ▸ Jantar eq. │     │ kcal ▓▓▓░ 320    │      │  O que melhorar   │
│ Nível 2 🔒   │     │ prot ▓▓░░ 18g    │      │  Troca sugerida   │
│ ▸ Prot+fibra │     │ fibra ▓░░░ 5g    │      │  💡 micro-lição   │
│              │     │ [abas categorias]│      │ [De novo][Próxima]│
└──────────────┘     └──────────────────┘      └──────────────────┘
```

## 9. Resumo de mudanças de banco (para aprovação)

| Item | Tipo | Quando | Justificativa |
|------|------|--------|---------------|
| `mwa_jogos_progresso` | tabela nova, aditiva | Fase 4 | melhor pontuação, níveis e estrelas por jogo |
| `mwa_push_subscriptions` + Edge Function + cron | infra nova | Etapa B do push | push real com app fechado |
| `mwa_game_eventos` | **sem alteração** — só novos valores de `tipo` | Fases 3–4 | estrela do dia e novos jogos |
| Tabelas existentes | **intocadas** | — | preservação total de dados |

## 10. Plano da Fase 3 (após aprovação desta proposta)

1. Biblioteca SVG dos ~40 ingredientes do protótipo.
2. `ingredientes.js`, `missoes.js` (3 missões), motor `avaliarPrato.js` + testes.
3. Componente `MonteSeuPrato.jsx` (padrão modal acessível atual, PT/EN).
4. Integração na aba Ferramentas atrás de flag de liberação; sementes via `mwa_game_eventos`.
5. Teste em mobile e desktop + prévia para aprovação. Nada dos jogos atuais é removido nesta fase.
