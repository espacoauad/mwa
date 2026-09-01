import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useContentItems } from './useContentItems'

beforeEach(() => localStorage.clear())

describe('useContentItems', () => {
  it('loads the 9 demo items on first run', () => {
    const { result } = renderHook(() => useContentItems())
    expect(result.current.items).toHaveLength(9)
  })

  it('creates a new item with status "ideia" by default', () => {
    const { result } = renderHook(() => useContentItems())
    act(() => result.current.criar({ finalidade: 'Instagram', formato: 'Post', tema: 'Metas' }))
    const criado = result.current.items.find((i) => i.tema === 'Metas')
    expect(criado.status).toBe('ideia')
    expect(criado.isDemo).toBe(false)
  })

  it('updates an item and bumps updatedAt', () => {
    const { result } = renderHook(() => useContentItems())
    const alvo = result.current.items[0]
    act(() => result.current.atualizar(alvo.id, { status: 'aprovado' }))
    const atualizado = result.current.obter(alvo.id)
    expect(atualizado.status).toBe('aprovado')
  })

  it('apagarDemo removes only demo items', () => {
    const { result } = renderHook(() => useContentItems())
    act(() => result.current.criar({ finalidade: 'Instagram', formato: 'Post', tema: 'Metas' }))
    act(() => result.current.apagarDemo())
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].tema).toBe('Metas')
  })

  it('contagemPorStatus counts items by status', () => {
    const { result } = renderHook(() => useContentItems())
    expect(result.current.contagemPorStatus.aprovado).toBe(2)
  })
})
