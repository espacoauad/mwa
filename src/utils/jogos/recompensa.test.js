import test from 'node:test'
import assert from 'node:assert/strict'
import { tentarRecompensa } from './recompensa.js'

test('concede normalmente quando tudo funciona', async () => {
  let chamou = false
  const ok = await tentarRecompensa(async () => {
    chamou = true
  })
  assert.equal(chamou, true)
  assert.equal(ok, true)
})

test('a tela de resultado sobrevive a uma falha de rede na recompensa', async () => {
  const ok = await tentarRecompensa(async () => {
    throw new Error('network down')
  })
  assert.equal(ok, false)
})

test('função ausente não quebra o jogo', async () => {
  assert.equal(await tentarRecompensa(undefined), false)
  assert.equal(await tentarRecompensa(null), false)
})

test('função síncrona também é aceita', async () => {
  assert.equal(await tentarRecompensa(() => 'pronto'), true)
})
