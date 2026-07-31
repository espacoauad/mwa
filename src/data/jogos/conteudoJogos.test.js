import test from 'node:test'
import assert from 'node:assert/strict'
import { PERGUNTAS } from './perguntas.js'
import { TROCAS, MISSOES_TROCA } from './trocas.js'
import { DUELOS } from './duelos.js'
import { ROTULOS, totalPerguntasRotulos } from './rotulos.js'

const RESPOSTAS_VALIDAS = new Set(['v', 'f', 'depende'])

test('o banco tem tamanho suficiente para não repetir cedo', () => {
  assert.ok(PERGUNTAS.length >= 30, `esperava >=30 perguntas, veio ${PERGUNTAS.length}`)
})

test('toda pergunta tem id único, resposta válida e explicação nos dois idiomas', () => {
  const ids = PERGUNTAS.map((p) => p.id)
  assert.equal(new Set(ids).size, ids.length, 'há ids duplicados')

  for (const p of PERGUNTAS) {
    assert.ok(RESPOSTAS_VALIDAS.has(p.resposta), `${p.id}: resposta inválida`)
    assert.ok(p.afirmacao && p.afirmacaoEN, `${p.id}: falta afirmação bilíngue`)
    assert.ok(p.explicacao?.length > 20, `${p.id}: explicação curta demais`)
    assert.ok(p.explicacaoEN?.length > 20, `${p.id}: falta explicação em inglês`)
    assert.ok(p.tema && p.nivel, `${p.id}: falta tema ou nível`)
  }
})

test('as três respostas aparecem no banco, com "depende" bem representado', () => {
  const contagem = PERGUNTAS.reduce((acc, p) => ({ ...acc, [p.resposta]: (acc[p.resposta] ?? 0) + 1 }), {})
  assert.ok(contagem.v >= 5, 'poucas afirmações verdadeiras')
  assert.ok(contagem.f >= 5, 'poucas afirmações falsas')
  assert.ok(contagem.depende >= 4, 'poucas afirmações "depende"')
})

test('as explicações evitam promessas e linguagem alarmista', () => {
  const proibidos = /garante|milagr|nunca mais|emagrec[ei] \d|cura\b|proibido para sempre/i
  for (const p of PERGUNTAS) {
    assert.doesNotMatch(p.explicacao, proibidos, `${p.id}: linguagem inadequada`)
  }
})

// ── Troca Inteligente ──

test('cada troca tem exatamente uma melhor opção e uma missão conhecida', () => {
  assert.ok(TROCAS.length >= 5)
  for (const t of TROCAS) {
    const melhores = t.opcoes.filter((o) => o.melhor)
    assert.equal(melhores.length, 1, `${t.id}: precisa de exatamente 1 melhor opção`)
    assert.ok(MISSOES_TROCA[t.missao], `${t.id}: missão desconhecida`)
    assert.equal(t.opcoes.length, 3, `${t.id}: esperado 3 opções`)
    for (const o of t.opcoes) {
      assert.ok(o.impacto?.length > 20 && o.impactoEN?.length > 20, `${t.id}/${o.id}: falta impacto bilíngue`)
      assert.ok(o.depois?.kcal > 0, `${t.id}/${o.id}: falta o resultado da troca`)
    }
  }
})

test('a melhor troca realmente cumpre a missão que promete', () => {
  for (const t of TROCAS) {
    const melhor = t.opcoes.find((o) => o.melhor)
    if (t.missao === 'proteina') {
      assert.ok(melhor.depois.prot > t.antes.prot, `${t.id}: a melhor troca não aumenta proteína`)
    }
    if (t.missao === 'fibra') {
      assert.ok(melhor.depois.fibra > t.antes.fibra, `${t.id}: a melhor troca não aumenta fibra`)
    }
    if (t.missao === 'densidade') {
      assert.ok(melhor.depois.kcal < t.antes.kcal, `${t.id}: a melhor troca não reduz calorias`)
    }
    if (t.missao === 'saciedade') {
      const ganhou = melhor.depois.prot > t.antes.prot || melhor.depois.fibra > t.antes.fibra
      assert.ok(ganhou, `${t.id}: a melhor troca não melhora proteína nem fibra`)
    }
  }
})

// ── Batalha da Saciedade ──

test('os duelos têm calorias parecidas — a diferença está na composição', () => {
  assert.ok(DUELOS.length >= 6)
  for (const d of DUELOS) {
    const diferenca = Math.abs(d.a.kcal - d.b.kcal)
    const media = (d.a.kcal + d.b.kcal) / 2
    assert.ok(diferenca / media <= 0.12, `${d.id}: diferença calórica alta demais (${diferenca} kcal)`)
    assert.ok(['a', 'b'].includes(d.maisSaciante), `${d.id}: resposta inválida`)
    assert.ok(d.porque?.length > 30 && d.porqueEN?.length > 30, `${d.id}: falta explicação bilíngue`)
  }
})

test('a opção mais saciante tem vantagem em proteína ou fibra', () => {
  for (const d of DUELOS) {
    const vencedora = d[d.maisSaciante]
    const perdedora = d[d.maisSaciante === 'a' ? 'b' : 'a']
    const vantagem = vencedora.prot > perdedora.prot || vencedora.fibra > perdedora.fibra
    assert.ok(vantagem, `${d.id}: a resposta não se sustenta nos números`)
  }
})

test('a linguagem dos duelos é probabilística, não absoluta', () => {
  for (const d of DUELOS) {
    assert.doesNotMatch(d.porque, /sempre sacia|garantidamente|com certeza vai/i, `${d.id}: linguagem absoluta`)
  }
})

// ── Detetive dos Rótulos ──

test('cada rótulo tem perguntas com uma única resposta correta', () => {
  assert.ok(ROTULOS.length >= 4)
  assert.ok(totalPerguntasRotulos() >= 8)
  for (const r of ROTULOS) {
    assert.ok(r.porcoesNoPacote > 0, `${r.id}: falta o número de porções`)
    assert.ok(r.tabela?.kcal > 0, `${r.id}: falta a tabela nutricional`)
    for (const q of r.perguntas) {
      const corretas = q.opcoes.filter((o) => o.correta)
      assert.equal(corretas.length, 1, `${q.id}: precisa de exatamente 1 resposta correta`)
      assert.ok(q.explicacao?.length > 20, `${q.id}: explicação curta demais`)
      assert.ok(q.perguntaEN && q.explicacaoEN, `${q.id}: falta versão em inglês`)
    }
  }
})
