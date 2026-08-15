import { test } from 'node:test'
import assert from 'node:assert/strict'
import { urlBase64ParaUint8Array, inscricaoParaLinha } from './pushSubscricao.js'

test('urlBase64ParaUint8Array decodifica uma string base64url conhecida', () => {
  // "TVdB" decodifica pros bytes de "MWA" (77, 87, 65)
  const bytes = urlBase64ParaUint8Array('TVdB')
  assert.deepEqual([...bytes], [77, 87, 65])
})

test('urlBase64ParaUint8Array aceita - e _ no lugar de + e /', () => {
  const bytes = urlBase64ParaUint8Array('--__')
  assert.equal(bytes.length, 3)
})

test('inscricaoParaLinha monta a linha pro upsert a partir de uma subscription', () => {
  const subscriptionFalsa = {
    toJSON: () => ({
      endpoint: 'https://push.exemplo/abc',
      keys: { p256dh: 'chave-publica', auth: 'segredo' },
    }),
  }
  const linha = inscricaoParaLinha('user-123', subscriptionFalsa)
  assert.equal(linha.endpoint, 'https://push.exemplo/abc')
  assert.equal(linha.user_id, 'user-123')
  assert.equal(linha.p256dh, 'chave-publica')
  assert.equal(linha.auth, 'segredo')
  assert.equal(typeof linha.atualizado_em, 'string')
})
