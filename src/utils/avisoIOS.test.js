// src/utils/avisoIOS.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ehIOSNaoInstalado, deveMostrarAvisoIOS } from './avisoIOS.js'

test('detecta iPhone fora do modo standalone', () => {
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  assert.equal(ehIOSNaoInstalado({ userAgent: ua, standalone: false }), true)
})

test('nao marca iPhone ja instalado (standalone)', () => {
  const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)'
  assert.equal(ehIOSNaoInstalado({ userAgent: ua, standalone: true }), false)
})

test('nao marca Android', () => {
  const ua = 'Mozilla/5.0 (Linux; Android 14)'
  assert.equal(ehIOSNaoInstalado({ userAgent: ua, standalone: false }), false)
})

test('deveMostrarAvisoIOS respeita a flag de dispensado', () => {
  const base = { userAgent: 'iPhone', standalone: false }
  assert.equal(deveMostrarAvisoIOS({ ...base, dispensado: false }), true)
  assert.equal(deveMostrarAvisoIOS({ ...base, dispensado: true }), false)
})
