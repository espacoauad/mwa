import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  validarBioimpedancia,
  filterBioimpedanciaData,
} from './bioimpedancia.js'

describe('validarBioimpedancia', () => {
  it('should accept valid data', () => {
    const data = {
      percentualGordura: 23.5,
      percentualMusculo: 44.6,
    }
    const result = validarBioimpedancia(data)
    assert.strictEqual(result.valid, true)
    assert.deepStrictEqual(result.erros, {})
  })

  it('should reject percentualGordura > 100', () => {
    const data = { percentualGordura: 150 }
    const result = validarBioimpedancia(data)
    assert.strictEqual(result.valid, false)
    assert.match(result.erros.percentualGordura, /entre 0 e 100/)
  })

  it('should reject percentualGordura < 0', () => {
    const data = { percentualGordura: -5 }
    const result = validarBioimpedancia(data)
    assert.strictEqual(result.valid, false)
  })

  it('should ignore null/undefined fields', () => {
    const data = {
      percentualGordura: 25,
      percentualMusculo: undefined,
    }
    const result = validarBioimpedancia(data)
    assert.strictEqual(result.valid, true)
  })

  it('should reject non-numeric values', () => {
    const data = {
      percentualGordura: 'abc',
    }
    const result = validarBioimpedancia(data)
    assert.strictEqual(result.valid, false)
    assert.match(result.erros.percentualGordura, /número/)
  })
})

describe('filterBioimpedanciaData', () => {
  it('should return only non-null values', () => {
    const data = {
      percentualGordura: 23.5,
      percentualMusculo: null,
      gorduraVisceral: 4,
    }
    const filtered = filterBioimpedanciaData(data)
    assert.deepStrictEqual(filtered, {
      percentualGordura: 23.5,
      gorduraVisceral: 4,
    })
  })

  it('should return null if all fields are empty', () => {
    const data = {
      percentualGordura: null,
      percentualMusculo: undefined,
    }
    const filtered = filterBioimpedanciaData(data)
    assert.strictEqual(filtered, null)
  })
})
