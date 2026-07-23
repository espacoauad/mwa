# Revisão de Conteúdo dos 90 Dias — MWA

**Data:** 2026-07-23
**Branch:** security/correcoes-criticas
**Autora do produto:** Wanessa Auad (CRN-1/27939)
**Escopo:** Revisar todo o conteúdo textual dos 90 dias — correção factual/nutricional e adequação à voz da marca.

> Nota: Este é o **primeiro de dois projetos** que a Wanessa pediu na fase de conclusão do
> MWA. O segundo — **elevar a estética do app (visual premium)** — fica documentado para
> ser feito em seguida, com foco total, em seu próprio ciclo spec → plano → implementação.

---

## 1. Objetivo

Garantir que dicas, informativos e lanches dos 90 dias estejam:

1. **Corretos** — números nutricionais plausíveis e coerentes; afirmações de
   fisiologia/neurociência corretas e não exageradas; claims de saúde defensáveis para
   uma nutricionista registrada.
2. **Na voz da Wanessa** — coerentes com o Tom de Voz do brand book, do dia 1 ao 90, sem
   trechos genéricos ou com "cara de IA".

Prioridades declaradas pela Wanessa: **correção factual/nutricional** e **voz** (as duas
com peso igual). Consistência interna é secundária, mas cuidada de passagem.

## 2. Decisões travadas

- **Estrutura oficial:** 30 dias (Jornada de entrada) + 90 dias (Programa de continuidade,
  dias 31–90). O conteúdo do app já está inteiro montado nessa base. O brand book
  (`docs/MWA-BrandBook-LandingPage-Copy.md`, atualmente modificado) diz "21 dias" e está
  **fora de sincronia** — será atualizado depois, na frente de estética/landing. **Não é
  escopo deste projeto.**
  - **Histórico (esclarecido em 2026-07-23):** o modelo antigo era 21 dias base + 90 dias
    de continuação nova = 111 dias total (ver docs obsoletos citados no Bloco 3). Após a
    auditoria recomendar abandonar os 21 dias, os dias 22–30 — que antes eram o início do
    conteúdo de continuação — foram remanejados para dentro da jornada base, que passou a
    ter 30 dias. A continuação ("Programa de 90 Dias") não é mais um ciclo novo de 90 dias:
    é a extensão que leva a aluna do dia 31 ao dia 90 (60 dias de conteúdo novo), sempre
    contando a partir da mesma data de início da jornada. Total real: **90 dias corridos**,
    nunca 111, nunca 120. `totalDiasPrograma` (`src/utils/calculos.js`) só retorna 30 ou 90.
- **Nível de edição:** editar direto no código + entregar relatório do que mudou. A Wanessa
  reverte o que não gostar.
- **Abordagem:** revisão em **blocos por fase da jornada** (1–30, 31–60, 61–90), com um
  **checkpoint** após o bloco 1–30 para calibrar o tom antes de escalar.
- **Um único revisor** (a sessão principal) segura a voz do começo ao fim, apoiado por uma
  **tabela de referência nutricional** para manter números coerentes entre arquivos.

## 3. Régua de voz

Fonte: seção "Tom de Voz" do brand book + voz observada no conteúdo existente.

**Deve soar como:**
- Premium mas acessível · elegante mas humana · técnica mas simples · feminina mas não
  frágil · inspiradora sem exageros · direta mas acolhedora.
- Wanessa em 1ª pessoa ("eu", "comigo") falando com a mulher ("você").
- Educativa: explica o *porquê* fisiológico de forma simples, sem jargão excessivo.
- Filosofia "não é dieta, é uma nova forma de viver" — anti-restrição, pró-consciência.

**Nunca:**
- Promessa milagrosa · terrorismo alimentar · linguagem agressiva de emagrecimento ·
  urgência apelativa · excesso de emoji · clichê de infoproduto genérico.

**Emoji:** manter o estilo atual (parcimônia; 💚 pontual ao fim de trechos). Não adicionar
mais do que já existe.

**Toque pessoal:** preservar (ex.: "Ah, Wanessa, mas hoje eu quero muito um açaí!"). Não
higienizar a ponto de apagar a personalidade.

## 4. Checklist factual/nutricional

- **Números (calorias, proteína em g):** conferir plausibilidade contra valores nutricionais
  padrão; corrigir erros claros; manter coerência entre arquivos (mesmo alimento → mesmo
  valor de referência). Estimativas marcadas com "~".
- **Afirmações de fisiologia/neurociência** (grelina, dopamina/sistema dopaminérgico, NEAT,
  TMB/TDEE, déficit calórico, neuroplasticidade, saciedade, glicemia/fibra): conferir se
  estão corretas e não superdimensionadas.
- **Segurança de claims (CRN-1/27939):** moderar afirmações absolutas ("queima gordura",
  "garante", "acelera o metabolismo" categórico) para linguagem defensável ("ajuda a",
  "contribui para", "favorece"). Evitar qualquer coisa que configure promessa de resultado
  ou conselho de risco.
- **Referências bíblicas (versiculos.js):** conferir se `referencia` corresponde ao `texto`
  citado (NVI). O texto bíblico em si **não** é alterado.
- **Incerteza:** o que não puder ser confirmado com segurança é **sinalizado no relatório**,
  não "corrigido no chute".

## 5. Guardrails (não alterar)

- Estrutura de dados: campos, `dia`, `cta.tipo`, `produto`, caminhos de `imagem`.
- Preços (R$ 97 / R$ 147), janelas de oferta e termos de marca. Se algum número desses
  divergir entre arquivos, **sinalizar** — não alterar por conta própria.
- Não inventar novos claims nem novos produtos.
- Não alterar o texto bíblico dos versículos (só a `reflexao` entra na revisão de voz).

## 6. Formato do relatório (por bloco)

Um arquivo markdown em `docs/superpowers/reports/` por bloco, contendo:

- **Alterações**, por dia e por arquivo: trecho antes → depois → categoria
  (`fato` / `voz` / `segurança` / `consistência`) → justificativa curta.
- **Itens só sinalizados** (não editados): o que é, por que precisa da decisão da Wanessa.
- **Tabela de referência nutricional** acumulada (alimento → valor padrão usado), para
  auditoria e reuso nos blocos seguintes.

## 7. Faseamento e arquivos

**Bloco 1 — dias 1–30** (checkpoint com a Wanessa ao final):
- `src/data/dicas.js` (dias 1–30)
- `src/data/informativos.js` (recorte dias 1–30)
- `src/data/lanchesProteicos.js` (dias 1–21) + `src/data/lanches22a37.js` (dias 22–30)
- `src/data/conceitosNutricionais.js` (checagem factual dos conceitos base)
- `src/data/versiculos.js` (dias 1–30: voz da `reflexao` + conferência de referência)

**Bloco 2 — dias 31–60:**
- `src/data/dicas90.js` (dias 31–60)
- `src/data/informativos.js` (recorte 31–60)
- `src/data/lanches22a37.js` (31–37) + `src/data/lanches38a89.js` (38–60)
- `src/data/versiculos.js` (dias 31–60)

**Bloco 3 — dias 61–90:**
- `src/data/dicas90.js` (dias 61–90)
- `src/data/informativos.js` (recorte 61–90)
- `src/data/lanches38a89.js` (61–89)
- `src/data/versiculos.js` (dias 61–90; voz da `reflexao` + conferência de referência)
- **Limpeza de resíduo do modelo antigo (21+90=111 dias), confirmada com a Wanessa em
  2026-07-23:** o app não passa do dia 90 (`totalDiasPrograma` só retorna 30 ou 90 —
  ver `src/utils/calculos.js`). Isso deixou dois resíduos do modelo antigo para tratar
  neste bloco:
  - `src/data/versiculos.js` tem 21 versículos órfãos para os dias 91–111 ("PERMANÊNCIA
    E CONTINUAÇÃO") que nunca são exibidos — sinalizar para remoção ou repropósito.
  - `BLOQUEIO_ACESSO_DIA_111.md` e `CONCLUSAO_111_DIAS.md` (raiz do projeto) descrevem
    a lógica de bloqueio no dia 111 do modelo antigo (21 dias base + 90 de continuação),
    sem nenhuma correspondência no código atual — marcar como obsoletos/arquivar.

## 8. Critérios de sucesso

- Todos os números nutricionais dentro de faixa plausível e coerentes entre arquivos.
- Nenhum claim de saúde absoluto/arriscado remanescente; tudo defensável para uma
  nutricionista registrada.
- Voz coerente do dia 1 ao 90, aderente à régua da seção 3, com o toque pessoal preservado.
- Um relatório por bloco entregue; itens incertos sinalizados, não "chutados".
- `npm run build` continua passando após as edições (nada quebrado nos arquivos de dados).

## 9. Fora de escopo

- Elevação da estética/visual do app (projeto seguinte).
- Atualização do brand book (21 → 30 dias) e da landing page.
- Alteração de estrutura de produto, preços ou fluxo de oferta.
- Tradução/i18n do conteúdo.
