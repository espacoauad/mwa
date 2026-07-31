# Fase 3 — Protótipo do Monte Seu Prato (entregue)

Data: 2026-07-25 · Status: aguardando aprovação da proprietária para a Fase 4.

## Arquivos novos
- `src/utils/jogos/avaliarPrato.js` — motor de avaliação (puro, testável)
- `src/utils/jogos/avaliarPrato.test.js` — 9 testes (TDD)
- `src/data/jogos/missoes.js` — 3 missões bilíngues
- `src/data/jogos/ingredientes.js` — 35 ingredientes (metadados; macros vêm de `alimentos.js`, TACO/TBCA)
- `src/data/jogos/ingredientes.test.js` — 3 testes de integridade
- `src/components/game/svg/IngredienteSvg.jsx` — 35 ilustrações SVG flat premium
- `src/components/game/MonteSeuPrato.jsx` — o jogo (modal acessível, PT/EN)
- `demo/` — harness de demonstração local (fora do build de produção; recompensa simulada)

## Arquivos alterados
- `src/data/skins.js` — recompensa `jogo_prato` (+10 🌱, 1×/dia)
- `src/context/AppContext.jsx` — `registrarJogoPrato()`
- `src/utils/jogosLiberacao.js` — liberação do jogo no dia 2 (sem deslocar os demais)
- `src/components/ferramentas/Ferramentas.jsx` — card, lazy import e modal
- `.claude/launch.json` — config `demo-prato`

## Banco de dados
Nenhuma alteração. Recompensa usa `mwa_game_eventos` existente (dedup por ref).

## Regras do jogo implementadas
- 3 missões (lanche equilibrado, jantar equilibrado, proteína+fibra); nível 2 trava até 2+ estrelas no nível 1 (progresso em memória da sessão — persistência em banco virá na Fase 4 com `mwa_jogos_progresso`).
- Painel nutricional ao vivo com barras por critério e aviso "ainda falta…".
- Porções ajustáveis ½× a 2×; adicionar/remover/reiniciar.
- Nota 0–100: missão 50 (kcal pesa dobro) + equilíbrio de macros 15 + variedade 12 + porções 15 + saciedade estimada 8. Critério zerado limita a nota a 60; 3 estrelas exigem todos os critérios cumpridos. Várias combinações vencem.
- Feedback acolhedor: acertos, pontos de melhoria, troca inteligente e micro-lição da missão. Aviso de conteúdo educativo no rodapé.

## Testes
- `npm test`: 31/31 (motor, integridade dos dados, testes pré-existentes).
- `npm run build`: ok (o demo não entra no bundle).
- Fluxo completo verificado no navegador (demo): missão → montagem → painel ao vivo → avaliação 3⭐ (99 pts) → recompensa disparada → desbloqueio do nível 2 → mobile 375 px sem overflow.

## Como acessar
- Demo isolado (sem login): servidor `demo-prato` → http://localhost:5199
- No app real: aba Ferramentas → card "Monte Seu Prato" (libera no dia 2 do programa).

## Pendências para Fase 4 (após aprovação)
- Persistir progresso (`mwa_jogos_progresso`), demais jogos, Estrelas do Dia, Momento MWA, push Etapa A, Coleção Elegante, remoção dos jogos aposentados.
