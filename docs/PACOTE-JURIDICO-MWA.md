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

## 3. Documentos e itens para revisão jurídica

**Correção importante:** ao revisar o código do aplicativo, identificamos que a Política de Privacidade, os Termos de Uso e um fluxo de consentimento LGPD **já existem e já estão em produção** dentro do app (não são placeholders). O pedido a seguir NÃO é "criar do zero" — é **revisar, corrigir e validar juridicamente** um rascunho que já está no ar sendo aceito por usuárias reais. Isso é mais urgente, não menos: qualquer inadequação já está exposta.

### 3.1 Política de Privacidade (CRÍTICO — revisar o que já está publicado)

Texto integral atualmente em produção (arquivo `src/data/legal.js`, exibido dentro do app):

> **Política de Privacidade** — Última atualização: julho de 2026
>
> **1. Quem somos.** O MWA — Método Wanessa Auad, Jornada de 30 Dias, é um programa de acompanhamento nutricional conduzido pela Nutricionista Wanessa Auad (CRN-1/27939). Contato: [e-mail] · [Instagram] · [site].
>
> **2. Dados que coletamos.** Coletamos apenas o necessário para o seu acompanhamento: dados de identificação e contato (nome, e-mail, WhatsApp), dados biométricos (peso, altura, idade, sexo, medidas corporais), registros de rotina alimentar (refeições, água, exercícios) e registros de progresso (pesagens e fotos de acompanhamento).
>
> **3. Para que usamos seus dados.** Usamos seus dados exclusivamente para: calcular suas metas nutricionais, acompanhar seu progresso durante o programa, enviar informativos e lembretes, e prestar suporte. Não usamos seus dados para nenhuma outra finalidade sem novo consentimento.
>
> **4. Compartilhamento.** NÃO vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais. Seus dados podem ser processados por fornecedores de tecnologia estritamente necessários ao funcionamento do serviço (hospedagem e processamento de pagamento), sempre sob obrigações de confidencialidade.
>
> **5. Seus direitos (LGPD).** Conforme a Lei nº 13.709/2018 (LGPD), você pode a qualquer momento: confirmar a existência de tratamento dos seus dados; acessar e exportar seus dados; corrigir dados incompletos ou desatualizados; revogar o consentimento; e solicitar a exclusão dos seus dados. Essas ações estão disponíveis no menu Perfil → Meus Direitos LGPD, ou pelo e-mail de contato.
>
> **6. Segurança e retenção.** Adotamos medidas técnicas para proteger seus dados. Dados de acompanhamento são mantidos enquanto sua conta estiver ativa. Após pedido de exclusão, os dados pessoais são removidos em até 30 dias; registros financeiros são mantidos por 5 anos, conforme exigência legal.
>
> **7. Alterações desta política.** Se esta política mudar, você será avisado com pelo menos 30 dias de antecedência dentro do app ou por e-mail.

**Perguntas ao advogado:**
1. Falta indicação de **encarregado (DPO)** e canal formal de contato do DPO — precisa ser adicionado?
2. O texto não menciona explicitamente que peso/medidas/hábitos alimentares são **dado sensível de saúde (LGPD Art. 11)**, nem a base legal específica para esse tratamento (consentimento? execução de contrato?) — precisa ser explicitado?
3. Fornecedores citados de forma genérica ("hospedagem e processamento de pagamento") — nomear Supabase, Hotmart, Mercado Pago explicitamente, ou a redação genérica já é suficiente?
4. "Registros financeiros mantidos por 5 anos" — confirmar prazo correto conforme legislação tributária/civil aplicável.

### 3.2 Termos de Uso (CRÍTICO — revisar o que já está publicado)

Texto integral atualmente em produção (mesmo arquivo):

> **Termos de Uso** — Última atualização: julho de 2026
>
> **1. Aceitação.** Ao usar o app MWA — Método Wanessa Auad, Jornada de 30 Dias, você concorda com estes Termos de Uso e com a Política de Privacidade. Se não concordar, não utilize o serviço.
>
> **2. Descrição do serviço.** O MWA é um programa educacional de acompanhamento nutricional com duração de 30 dias (extensível a 90 dias), que inclui cálculo de metas, registro de refeições, acompanhamento de progresso e conteúdos educativos diários.
>
> **3. Natureza educacional — não é atendimento médico.** O conteúdo do programa tem caráter educacional e de orientação nutricional, elaborado pela Nutricionista Wanessa Auad (CRN-1/27939). O programa NÃO substitui consulta médica, diagnóstico ou tratamento de saúde. Resultados variam de pessoa para pessoa e não há garantia de resultados específicos.
>
> **4. Responsabilidades do usuário.** Você se compromete a fornecer informações verdadeiras no cadastro, manter a confidencialidade do seu acesso, usar o app apenas para fins pessoais e informar condições de saúde relevantes ao seu médico antes de iniciar o programa.
>
> **5. Pagamentos e cancelamento.** O acesso ao programa é liberado após a confirmação do pagamento. Você pode exercer o direito de arrependimento em até 7 dias corridos após a compra, conforme o Código de Defesa do Consumidor. Após esse prazo, não há reembolso proporcional pelo período não utilizado.
>
> **6. Propriedade intelectual.** Todo o conteúdo do programa (textos, informativos, imagens, marca MWA) é de propriedade de Wanessa Auad. É proibida a reprodução, distribuição ou revenda sem autorização por escrito.
>
> **7. Lei aplicável.** Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de Goiânia/GO para dirimir eventuais controvérsias.

**Perguntas ao advogado:**
1. Falta cláusula sobre a **continuidade de 90 dias** (regras de contratação, preço, se há novo direito de arrependimento próprio) — precisa ser adicionada?
2. Falta cláusula específica de **licença de uso individual e intransferível** (hoje isso só aparece como regra de produto na landing, "acesso não pode ser compartilhado") — deveria constar nos Termos?
3. Item 5 já cobre o CDC de 7 dias — confirmar se a redação está juridicamente completa (forma de solicitar, prazo de devolução do valor).

### 3.3 Fluxo de consentimento no cadastro (revisar o que já está publicado)

Já implementado em `TelaConsentimento.jsx`, exibido obrigatoriamente no onboarding, antes de qualquer uso do app:
- Lista visível do que é coletado e para quê (biometria, rotina alimentar, progresso).
- Aviso de responsabilidade CRN, com o texto: *"Este programa foi desenvolvido pela Nutricionista Wanessa Auad (CRN-1/27939) com finalidade educacional e de acompanhamento nutricional. Ele NÃO substitui consulta médica nem tratamento de saúde. Se você tem alguma condição de saúde (diabetes, hipertensão, gestação, transtornos alimentares ou outras), consulte seu médico antes de iniciar."*
- **Dois checkboxes obrigatórios e separados** (o botão de avançar fica desabilitado até ambos serem marcados): (1) autorização de tratamento de dados + concordância com Política de Privacidade e Termos de Uso (com os documentos completos acessíveis por links antes de marcar); (2) leitura do aviso de responsabilidade de saúde.
- No quiz de captura de leads da landing (fora do app), há um checkbox separado: *"Concordo em receber conteúdos do MWA por e-mail."*

**Pergunta ao advogado:** este fluxo (dois checkboxes específicos, com o texto completo acessível antes de marcar) satisfaz a exigência de **consentimento específico e destacado para dado sensível de saúde** (LGPD Art. 11), ou precisa de ajuste (ex.: um checkbox dedicado só para dado de saúde, separado do consentimento geral de privacidade)?

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

1. Revisar a redação e a suficiência dos avisos do item 2 (landing/vendas).
2. **Revisar e corrigir** (não criar do zero) a Política de Privacidade, os Termos de Uso e o fluxo de consentimento **já publicados** no app (itens 3.1–3.3) — são textos em produção, aceitos por usuárias reais hoje.
3. Opinar sobre identificação profissional/CRN (3.4), garantia (3.5) e limites de publicidade do Código de Ética (3.6).
4. Fornecer modelo de **termo de autorização de depoimento** (3.7) e **termo de conduta de afiliado** (3.8).
5. Orientar sobre públicos vulneráveis/idade mínima (3.9).

*Documento gerado como apoio à revisão jurídica. Não constitui parecer jurídico.*
