// Textos legais e de conformidade do MWA — CRN + LGPD
import { CONTATO } from '../utils/ofertas.js'

export const NUTRICIONISTA = {
  nome: 'Wanessa Auad',
  titulo: 'Nutricionista Clínica',
  crn: 'CRN-1/27939',
  conselho: 'Conselho Regional de Nutricionistas — 1ª Região (DF, GO, MT, TO)',
}

export const AVISO_CRN = `Este programa foi desenvolvido pela Nutricionista ${NUTRICIONISTA.nome} (${NUTRICIONISTA.crn}) com finalidade educacional e de acompanhamento nutricional. Ele NÃO substitui consulta médica nem tratamento de saúde. Se você tem alguma condição de saúde (diabetes, hipertensão, gestação, transtornos alimentares ou outras), consulte seu médico antes de iniciar.`

export const DADOS_COLETADOS = [
  { titulo: 'Identificação e contato', itens: 'nome, e-mail e WhatsApp' },
  { titulo: 'Dados biométricos', itens: 'peso, altura, idade, sexo e medidas corporais' },
  { titulo: 'Rotina alimentar', itens: 'refeições, água e exercícios registrados no app' },
  { titulo: 'Progresso', itens: 'pesagens semanais e fotos de acompanhamento' },
  { titulo: 'Hábitos e motivação', itens: 'sono, hidratação, funcionamento intestinal, disposição, hábitos alimentares e seus objetivos pessoais' },
]

export const USOS_DADOS = [
  'Calcular suas metas nutricionais (calorias, macros, água e fibras)',
  'Acompanhar seu progresso durante o programa',
  'Enviar informativos e lembretes do programa',
  'Prestar suporte pelo WhatsApp',
  'Personalizar sua experiência e recepção no aplicativo',
]

export const POLITICA_PRIVACIDADE = {
  titulo: 'Política de Privacidade',
  atualizacao: 'Última atualização: julho de 2026',
  secoes: [
    {
      titulo: '1. Quem somos',
      texto: `O MWA — Método Wanessa Auad, Jornada de 30 Dias, é um programa de acompanhamento nutricional conduzido pela Nutricionista ${NUTRICIONISTA.nome} (${NUTRICIONISTA.crn}). Contato: ${CONTATO.email} · ${CONTATO.instagram} · ${CONTATO.site}.`,
    },
    {
      titulo: '2. Dados que coletamos',
      texto: 'Coletamos apenas o necessário para o seu acompanhamento: dados de identificação e contato (nome, e-mail, WhatsApp), dados biométricos (peso, altura, idade, sexo, medidas corporais), registros de rotina alimentar (refeições, água, exercícios), registros de progresso (pesagens e fotos de acompanhamento) e dados de hábitos e motivação (sono, hidratação, funcionamento intestinal, disposição, hábitos alimentares e seus objetivos pessoais).',
    },
    {
      titulo: '3. Para que usamos seus dados',
      texto: 'Usamos seus dados exclusivamente para: calcular suas metas nutricionais, acompanhar seu progresso durante o programa, enviar informativos e lembretes, prestar suporte e personalizar sua experiência e recepção no aplicativo. Não usamos seus dados para nenhuma outra finalidade sem novo consentimento.',
    },
    {
      titulo: '4. Compartilhamento',
      texto: 'NÃO vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais. Seus dados podem ser processados por fornecedores de tecnologia estritamente necessários ao funcionamento do serviço (hospedagem e processamento de pagamento), sempre sob obrigações de confidencialidade.',
    },
    {
      titulo: '5. Seus direitos (LGPD)',
      texto: 'Conforme a Lei nº 13.709/2018 (LGPD), você pode a qualquer momento: confirmar a existência de tratamento dos seus dados; acessar e exportar seus dados; corrigir dados incompletos ou desatualizados; revogar o consentimento; e solicitar a exclusão dos seus dados. Essas ações estão disponíveis no menu Perfil → Meus Direitos LGPD, ou pelo e-mail ' + CONTATO.email + '.',
    },
    {
      titulo: '6. Segurança e retenção',
      texto: 'Adotamos medidas técnicas para proteger seus dados. Dados de acompanhamento são mantidos enquanto sua conta estiver ativa. Após pedido de exclusão, os dados pessoais são removidos em até 30 dias; registros financeiros são mantidos por 5 anos, conforme exigência legal.',
    },
    {
      titulo: '7. Alterações desta política',
      texto: 'Se esta política mudar, você será avisado com pelo menos 30 dias de antecedência dentro do app ou por e-mail.',
    },
  ],
}

export const TERMOS_USO = {
  titulo: 'Termos de Uso',
  atualizacao: 'Última atualização: julho de 2026',
  secoes: [
    {
      titulo: '1. Aceitação',
      texto: 'Ao usar o app MWA — Método Wanessa Auad, Jornada de 30 Dias, você concorda com estes Termos de Uso e com a Política de Privacidade. Se não concordar, não utilize o serviço.',
    },
    {
      titulo: '2. Descrição do serviço',
      texto: 'O MWA é um programa educacional de acompanhamento nutricional com duração de 30 dias (extensível a 90 dias), que inclui cálculo de metas, registro de refeições, acompanhamento de progresso e conteúdos educativos diários.',
    },
    {
      titulo: '3. Natureza educacional — não é atendimento médico',
      texto: `O conteúdo do programa tem caráter educacional e de orientação nutricional, elaborado pela Nutricionista ${NUTRICIONISTA.nome} (${NUTRICIONISTA.crn}). O programa NÃO substitui consulta médica, diagnóstico ou tratamento de saúde. Resultados variam de pessoa para pessoa e não há garantia de resultados específicos.`,
    },
    {
      titulo: '4. Responsabilidades do usuário',
      texto: 'Você se compromete a fornecer informações verdadeiras no cadastro, manter a confidencialidade do seu acesso, usar o app apenas para fins pessoais e informar condições de saúde relevantes ao seu médico antes de iniciar o programa.',
    },
    {
      titulo: '5. Pagamentos e cancelamento',
      texto: 'O acesso ao programa é liberado após a confirmação do pagamento. Você pode exercer o direito de arrependimento em até 7 dias corridos após a compra, conforme o Código de Defesa do Consumidor. Após esse prazo, não há reembolso proporcional pelo período não utilizado.',
    },
    {
      titulo: '6. Propriedade intelectual',
      texto: 'Todo o conteúdo do programa (textos, informativos, imagens, marca MWA) é de propriedade de Wanessa Auad. É proibida a reprodução, distribuição ou revenda sem autorização por escrito.',
    },
    {
      titulo: '7. Lei aplicável',
      texto: 'Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de Goiânia/GO para dirimir eventuais controvérsias.',
    },
  ],
}
