import test from 'node:test'
import assert from 'node:assert/strict'
import { montarFraseRecepcao, montarPersonalizacaoParaSalvar, OPCOES_FOCO, OPCOES_SENTIMENTO_ESPERADO } from './personalizacao.js'

test('OPCOES_FOCO e OPCOES_SENTIMENTO_ESPERADO tem 4 opcoes cada, todas com fragmento', () => {
  assert.equal(OPCOES_FOCO.length, 4)
  assert.equal(OPCOES_SENTIMENTO_ESPERADO.length, 4)
  assert.ok(OPCOES_FOCO.every((o) => typeof o.fragmento === 'string' && o.fragmento.length > 0))
  assert.ok(OPCOES_SENTIMENTO_ESPERADO.every((o) => typeof o.fragmento === 'string' && o.fragmento.length > 0))
})

test('montarFraseRecepcao usa o fragmento da opcao escolhida', () => {
  const { foco, sentimento } = montarFraseRecepcao({
    foco: 'rotina',
    focoOutro: '',
    sentimentoEsperado: 'orgulhosa',
    sentimentoEsperadoOutro: '',
  })
  assert.equal(foco, 'sua rotina e constância')
  assert.equal(sentimento, 'orgulhosa de ter sido constante')
})

test('montarFraseRecepcao usa o texto livre quando a opcao e "outro"', () => {
  const { foco, sentimento } = montarFraseRecepcao({
    foco: 'outro',
    focoOutro: 'comer sem culpa nos fins de semana',
    sentimentoEsperado: 'outro',
    sentimentoEsperadoOutro: 'orgulhosa das minhas escolhas',
  })
  assert.equal(foco, 'comer sem culpa nos fins de semana')
  assert.equal(sentimento, 'orgulhosa das minhas escolhas')
})

test('montarFraseRecepcao retorna null quando a resposta esta vazia', () => {
  const { foco, sentimento } = montarFraseRecepcao({ foco: '', focoOutro: '', sentimentoEsperado: '', sentimentoEsperadoOutro: '' })
  assert.equal(foco, null)
  assert.equal(sentimento, null)
})

test('montarPersonalizacaoParaSalvar normaliza habitos pulados para null', () => {
  const dados = {
    foco: 'rotina', focoOutro: '',
    obstaculo: '', obstaculoOutro: '',
    rotina: '', rotinaOutro: '',
    sentimentoEsperado: 'orgulhosa', sentimentoEsperadoOutro: '',
    sono: '', hidratacao: '', habitosAlimentares: '', intestino: '', disposicao: '',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.sono, null)
  assert.equal(salvo.hidratacao, null)
  assert.equal(salvo.habitosAlimentares, null)
  assert.equal(salvo.intestino, null)
  assert.equal(salvo.disposicao, null)
  assert.equal(salvo.obstaculo, null)
  assert.equal(salvo.rotina, null)
})

test('montarPersonalizacaoParaSalvar preserva o texto livre de "outro" em obstaculo e rotina', () => {
  const dados = {
    foco: 'rotina', focoOutro: '',
    obstaculo: 'outro', obstaculoOutro: 'quando viajo',
    rotina: 'outro', rotinaOutro: 'muda toda semana',
    sentimentoEsperado: 'orgulhosa', sentimentoEsperadoOutro: '',
    sono: '', hidratacao: '', habitosAlimentares: '', intestino: '', disposicao: '',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.obstaculo, 'outro')
  assert.equal(salvo.obstaculoOutro, 'quando viajo')
  assert.equal(salvo.rotina, 'outro')
  assert.equal(salvo.rotinaOutro, 'muda toda semana')
})

test('montarPersonalizacaoParaSalvar normaliza "prefiro_nao_responder" para null, igual a pular', () => {
  const dados = {
    foco: 'rotina', focoOutro: '',
    obstaculo: '', obstaculoOutro: '',
    rotina: '', rotinaOutro: '',
    sentimentoEsperado: 'orgulhosa', sentimentoEsperadoOutro: '',
    sono: 'prefiro_nao_responder', hidratacao: '', habitosAlimentares: '', intestino: 'prefiro_nao_responder', disposicao: '',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.sono, null)
  assert.equal(salvo.intestino, null)
})

test('montarPersonalizacaoParaSalvar preserva respostas reais e o texto livre de "outro"', () => {
  const dados = {
    foco: 'outro', focoOutro: 'comer sem culpa',
    obstaculo: 'cobranca', obstaculoOutro: '',
    rotina: 'corrida', rotinaOutro: '',
    sentimentoEsperado: 'leve', sentimentoEsperadoOutro: '',
    sono: 'cansada', hidratacao: 'bastante', habitosAlimentares: 'equilibrados', intestino: 'regular', disposicao: 'alta',
  }
  const salvo = montarPersonalizacaoParaSalvar(dados)
  assert.equal(salvo.foco, 'outro')
  assert.equal(salvo.focoOutro, 'comer sem culpa')
  assert.equal(salvo.obstaculo, 'cobranca')
  assert.equal(salvo.rotina, 'corrida')
  assert.equal(salvo.sono, 'cansada')
  assert.equal(salvo.hidratacao, 'bastante')
  assert.equal(salvo.habitosAlimentares, 'equilibrados')
  assert.equal(salvo.intestino, 'regular')
  assert.equal(salvo.disposicao, 'alta')
})
