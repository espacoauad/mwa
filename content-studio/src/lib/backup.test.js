import { beforeEach, describe, expect, it } from 'vitest'
import { exportarBackup, restaurarBackup } from './backup'
import { writeItem, readItem } from './storage'

beforeEach(() => localStorage.clear())

describe('backup', () => {
  it('exports every namespaced key without the namespace prefix', () => {
    writeItem('brandGuide', { nome: 'MWA' })
    const backup = exportarBackup()
    expect(backup.dados.brandGuide).toEqual({ nome: 'MWA' })
  })

  it('restores a backup back into storage', () => {
    const backup = { exportadoEm: '2026-01-01', namespace: 'mwa-content-studio', dados: { brandGuide: { nome: 'Restaurado' } } }
    restaurarBackup(backup)
    expect(readItem('brandGuide', null)).toEqual({ nome: 'Restaurado' })
  })

  it('throws on a file without a dados field', () => {
    expect(() => restaurarBackup({})).toThrow()
  })
})
