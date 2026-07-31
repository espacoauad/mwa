# Fase 4 — Implementação completa

Data: 2026-07-28 · Depende de: fase1 (diagnóstico), fase2 (proposta), fase3 (protótipo).

## 1. Progresso persistido no banco

- **Tabela nova `mwa_jogos_progresso`** (aditiva, aplicada em produção): `user_id`, `jogo_id`, `missao_id`, `nivel`, `melhor_pontuacao`, `estrelas`, `partidas`, `atualizado_em`. RLS no mesmo padrão de `mwa_game` (cada pessoa só lê e escreve o próprio progresso). Migration: `supabase/migrations/20260726090000_criar_mwa_jogos_progresso.sql`.
- **Nenhuma tabela existente foi alterada.** Nenhum dado atual foi tocado.
- Regras em `src/utils/jogos/progresso.js` (puras, testadas): o recorde nunca regride — tentativa pior conta partida, mas não apaga a conquista.
- Sem rede, o progresso ainda vale na sessão (o jogo não trava).

## 2. Estrelas do Dia (retorno diário)

- **Regra**: 1 estrela por dia ao cumprir 2 de 3 micro-metas — registrar refeição/água, ler o conteúdo do dia, jogar 1 desafio. 7 estrelas fecham a constelação da semana (+25 🌱).
- Card no topo da aba Hoje (`EstrelasDoDia.jsx`) com constelação da semana, checklist das metas e anel dourado quando a semana fecha.
- **Sem tabela nova**: usa `mwa_game_eventos` com `tipo: 'estrela_dia'` e `'constelacao'` (dedup por `ref` já existente).
- **Push etapa A** (`notificacaoEstrela.js`): lembrete local a partir das 18h, 1x por dia, só para quem já autorizou notificações. A etapa B (Web Push com app fechado) segue pendente de aprovação — exige service worker, tabela de inscrições e Edge Function com cron.

## 3. Quatro novos jogos educativos

Todos com moldura comum (`MolduraJogo.jsx`): modal acessível, progresso, tela final com estrelas.

| Jogo | Conteúdo | Mecânica-chave |
|------|----------|----------------|
| Verdadeiro, Falso ou Depende | 35 afirmações | Opção "depende"; explicação após **toda** resposta, sem repetir até acertar; banco rotativo (não repete entre rodadas) |
| Troca Inteligente | 6 cenários | Mostra o impacto numérico de **todas** as trocas; "sua troca também ajuda" em vez de erro |
| Batalha da Saciedade | 8 duelos | Calorias parecidas, composições diferentes; linguagem sempre probabilística |
| Detetive dos Rótulos | 5 rótulos, 9 perguntas | Tabela nutricional real; armadilha porção × embalagem |

Dados em `src/data/jogos/` com testes que validam **semântica**, não só formato: a melhor troca precisa realmente cumprir a missão; a opção mais saciante precisa ter vantagem em proteína ou fibra; os duelos precisam ter calorias equivalentes (≤12% de diferença).

## 4. Momento MWA, loja e aposentadorias

- **Momento MWA** (`hoje/MomentoMwa.jsx`): sucessor do Jardim de Afirmações. Afirmação do dia (banco de 8 → 40) → respiração guiada de 3 ciclos → intenção do dia. +5 🌱 (antes eram 15 por virar 8 cartas). Card na aba Hoje.
- **Coleção Elegante**: 6 personagens, 3 fundos e 2 molduras premium (400–900 🌱), ao lado das skins originais. Teste protege o fallback do avatar (o primeiro item de cada lista precisa continuar gratuito).
- **Aposentados** (removidos do código, preservados no histórico do git): Jogo das Escolhas, do Treino, da Poda, do Plantio, Restaurante Saudável e Jardim de Afirmações. As recompensas órfãs saíram de `skins.js`.
- **Ferramentas reorganizada** em duas prateleiras: "Jogos de Nutrição" (5 jogos) e "Pausa e Cuidado" (Colheita).
- **Liberação**: Colheita d1 · Monte Seu Prato d2 · V/F/Depende d5 · Troca d8 · Saciedade d11 · Rótulos d14.

## 5. Testes e verificação

- **88 testes automatizados passando** (eram 31 na Fase 3); build de produção limpo.
- Verificado no navegador: os 4 jogos novos, o Momento MWA (fluxo completo até a recompensa) e os 3 estados do card de Estrelas. Console sem erros.
- Bug corrigido no caminho: `afirmacaoDoDia` quebrava com data ausente — agora tem teste.

## 6. Pendências

1. **Push etapa B** (notificação com o app fechado): precisa da sua aprovação — envolve service worker, tabela `mwa_push_subscriptions` e Edge Function com cron diário.
2. **Desafio do Dia**: previsto na proposta, ainda não implementado (missão curta ligada ao conteúdo do dia).
3. **Ilustrações SVG**: hoje cobrem os 35 ingredientes do Monte Seu Prato. A Coleção Elegante ainda usa emoji.
4. **Nada foi publicado** — as mudanças estão apenas no seu computador, sem commit.
