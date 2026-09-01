import { beforeEach, describe, expect, it } from 'vitest'
import { garantirDadosIniciais } from './seedData'
import { readItem, writeItem, readCollection } from './storage'

beforeEach(() => localStorage.clear())

describe('garantirDadosIniciais', () => {
  it('seeds the brand guide when missing', () => {
    garantirDadosIniciais()
    expect(readItem('brandGuide', null).nome).toBe('MWA')
  })

  it('does not overwrite an already-edited brand guide', () => {
    garantirDadosIniciais()
    writeItem('brandGuide', { nome: 'Editado' })
    garantirDadosIniciais()
    expect(readItem('brandGuide', null).nome).toBe('Editado')
  })

  it('is safe to call twice without duplicating templates', () => {
    garantirDadosIniciais()
    garantirDadosIniciais()
    expect(readCollection('templates', [])).toHaveLength(0)
  })
})
