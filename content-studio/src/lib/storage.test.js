import { beforeEach, describe, expect, it } from 'vitest'
import { readCollection, writeCollection, readItem, writeItem, allKeys, NAMESPACE } from './storage'

beforeEach(() => localStorage.clear())

describe('storage', () => {
  it('returns fallback when a collection does not exist yet', () => {
    expect(readCollection('contentItems', [])).toEqual([])
  })

  it('round-trips a collection', () => {
    writeCollection('contentItems', [{ id: '1' }])
    expect(readCollection('contentItems', [])).toEqual([{ id: '1' }])
  })

  it('round-trips a single item', () => {
    writeItem('brandGuide', { nome: 'MWA' })
    expect(readItem('brandGuide', null)).toEqual({ nome: 'MWA' })
  })

  it('namespaces every key it writes', () => {
    writeItem('settings', { schemaVersion: 1 })
    expect(localStorage.getItem(`${NAMESPACE}:settings`)).not.toBeNull()
  })

  it('lists only namespaced keys', () => {
    localStorage.setItem('outroApp:qualquerCoisa', '1')
    writeItem('settings', { schemaVersion: 1 })
    expect(allKeys()).toEqual([`${NAMESPACE}:settings`])
  })
})
