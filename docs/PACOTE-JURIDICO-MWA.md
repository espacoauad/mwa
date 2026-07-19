# MWA — Pacote para Revisão Jurídica

**Para:** Advogado(a) responsável
**De:** Wanessa Auad — MWA | My Wellness App
**Data:** 18/07/2026
**Assunto:** Revisão de avisos legais, conformidade e documentos pendentes antes do lançamento

---

## 1. Contexto do produto (resumo para o advogado)

- **Produto:** "MWA | Jornada de 30 Dias" — programa **educacional** digital (aplicativo web/PWA) de organização de hábitos alimentares e rotina de bem-estar. Pagamento único de R$ 97, acesso por 30 dias.
- **Continuidade:** "MWA | Programa de 90 Dias" (oferta interna e no checkout) e "Sessão Estratégica" individual.
- **Autora/responsável técnica:** Wanessa Auad, nutricionista, CRN-1/27939.
- **Natureza:** o app registra alimentação, água, peso, medidas, metas e traz conteúdos diários (dicas, informativos, reflexões). **Não** faz prescrição dietética individualizada nem atendimento clínico individual.
- **Coleta de dados de saúde:** peso, medidas corporais, hábitos alimentares, metas — **dado pessoal sensível** (LGPD, Art. 11).
- **Venda:** checkout Hotmart (aquisição) + Mercado Pago (renovações/upgrades internos). Programa de afiliados a 30%.
- **Observação relevante de conduta:** a titular é distribuidora Herbalife há 21 anos, mas atua como nutricionista há menos tempo; por isso (a) toda menção à marca Herbalife foi **removida** do produto, e (b) a comunicação separa "20+ anos de experiência em emagrecimento" da credencial "Nutricionista — CRN-1/27939", para não sugerir tempo de registro profissional que não corresponde à realidade.

---

## 2. Avisos legais JÁ inseridos na página (texto atual — revisar redação)

Estes textos já estão publicados no rodapé da landing page e da página de vendas. **Pedimos que revise a redação, adequação e suficiência jurídica de cada um.**

### 2.1 Bloco "Avisos importantes" (rodapé da landing e da /vendas)

> **Avisos importantes**
>
> O MWA | Jornada de 30 Dias é um programa **educacional** de organização de hábitos e rotina alimentar. Ele não realiza diagnóstico, tratamento, cura ou prevenção de qualquer doença ou condição de saúde e **não substitui consulta com nutricionista, médico ou outro profissional de saúde**. O conteúdo do aplicativo tem caráter geral e informativo e não constitui atendimento nutricional individualizado nem prescrição dietética.
>
> Resultados variam de pessoa para pessoa e dependem de fatores individuais e da aplicação das orientações — nenhum resultado específico é prometido ou garantido. A história de Wanessa Auad é um relato pessoal real e não representa promessa de resultado.
>
> Se você tem alguma condição de saúde, faz uso de medicamentos, está gestante ou amamentando, ou tem histórico de transtorno alimentar, procure orientação profissional individualizada antes de iniciar qualquer mudança na alimentação.

### 2.2 Ressalvas pontuais espalhadas na página

- Sob a história pessoal (26 kg / 14 anos): *"Relato pessoal — resultados individuais variam."*
- Ao fim da seção de benefícios ("Imagine daqui a 30 dias"): *"Resultados variam de pessoa para pessoa e dependem da aplicação das orientações."*
- No quiz de entrada: título "Mini-autoavaliação" + *"Autoavaliação educativa de hábitos — não é diagnóstico clínico."*
- Selo de autoria: *"Desenvolvido por Wanessa Auad — Nutricionista · CRN-1/27939"* (sem número de anos ao lado da credencial).

**Perguntas ao advogado sobre esta seção:**
1. A redação do bloco 2.1 é suficiente e adequada, ou precisa de ajustes de linguagem/abrangência?
2. O aviso deve aparecer também **antes da compra** (topo/meio da página), e não só no rodapé?
3. É recomendável reproduzir o mesmo aviso **dentro do aplicativo** (primeiro acesso / onboarding) e no **checkout da Hotmart**?

---

## 3. Documentos e itens que PRECISAM ser criados ou revisados (pendências)

### 3.1 Política de Privacidade (CRÍTICO — bloqueia o lançamento)
- Ainda **não existe**. Na página há um link placeholder ("política de privacidade") sem documento por trás.
- Deve tratar **dado sensível de saúde** (LGPD Art. 11): base legal, finalidade, consentimento específico e destacado, retenção, compartilhamento (Supabase, Hotmart, Mercado Pago, ferramenta de e-mail), direitos do titular, encarregado (DPO).

### 3.2 Termos de Uso (CRÍTICO)
- Ainda não existe. Deve cobrir: natureza educacional do produto, ausência de relação clínica, licença de uso individual e intransferível, política de reembolso (garantia de 7 dias — ver 3.5), regras da continuidade de 90 dias, foro.

### 3.3 Fluxo de consentimento LGPD no cadastro (CRÍTICO)
- O app coleta peso, medidas e hábitos. É preciso **consentimento específico e destacado** para dado sensível de saúde no momento do cadastro (não um checkbox genérico).
- No quiz de captura de leads também há coleta de nome/e-mail com checkbox de consentimento — validar a redação atual: *"Concordo em receber conteúdos do MWA por e-mail."*

### 3.4 Identificação profissional (CRN) na comunicação
- Optamos por manter "Nutricionista — CRN-1/27939" no selo do hero, na barra de confiança, na seção de autoria e no rodapé, conforme o Código de Ética do Nutricionista (Res. CFN 599/2018, atualizada pela Res. CFN 856/2026), que exige identificação com nome e número de inscrição na divulgação profissional.
- **Pergunta:** a forma e os locais dessa identificação estão adequados? Há exigência adicional (ex.: no checkout, nos anúncios, no material de afiliados)?

### 3.5 Garantia / política de reembolso
- A página oferece "garantia incondicional de 7 dias" (mínimo do CDC para compra online). Processo de reembolso e revogação de acesso ainda não está formalizado.
- **Pergunta:** há risco em apresentar os 7 dias legais como "garantia" (benefício)? Uma "garantia estendida condicional" (ex.: concluir o programa) traria algum risco adicional?

### 3.6 Publicidade, promessas e o Código de Ética do Nutricionista
- A comunicação evita promessa de emagrecimento como resultado garantido; usa "resultados variam".
- O Código de Ética **veda ofertas/promoções/sorteios** como publicidade do profissional. Por isso a continuidade de 90 dias é comunicada como "condição especial para alunas", sem contagem regressiva nem urgência apelativa.
- **Pergunta:** a comunicação atual (landing, /vendas, futuros anúncios) está dentro dos limites do Código de Ética? Há termos a evitar?

### 3.7 Depoimentos (para o futuro)
- Ainda não há depoimentos publicados. Quando houver, cada um precisará de **termo de autorização de uso de imagem/depoimento** assinado, e da ressalva "resultados variam".
- **Pedido:** modelo de termo de autorização de depoimento.

### 3.8 Programa de afiliados (30%)
- Afiliados divulgarão o produto de uma profissional com registro (CRN). Sem material aprovado, há risco de promessa indevida em nome da marca.
- **Pedido:** parecer sobre um **termo de conduta do afiliado** + regras de copy aprovada, para limitar promessas de resultado.

### 3.9 Dados de saúde e menores / públicos vulneráveis
- **Pergunta:** é necessário restrição de idade mínima? Tratamento específico para gestantes/lactantes/pessoas com histórico de transtorno alimentar (hoje há apenas o aviso do item 2.1)?

---

## 4. Resumo do que pedimos ao advogado

1. Revisar a redação e a suficiência dos avisos do item 2.
2. Elaborar/revisar: **Política de Privacidade**, **Termos de Uso**, **fluxo de consentimento de dado sensível** (itens 3.1–3.3).
3. Opinar sobre identificação profissional/CRN (3.4), garantia (3.5) e limites de publicidade do Código de Ética (3.6).
4. Fornecer modelo de **termo de autorização de depoimento** (3.7) e **termo de conduta de afiliado** (3.8).
5. Orientar sobre públicos vulneráveis/idade mínima (3.9).

*Documento gerado como apoio à revisão jurídica. Não constitui parecer jurídico.*
