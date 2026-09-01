import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBrandGuide } from './useBrandGuide'
import { readItem } from '../lib/storage'
import { brandGuideSeed } from '../data/brandGuideSeed'

beforeEach(() => localStorage.clear())

describe('useBrandGuide', () => {
  it('falls back to the seed when nothing is stored', () => {
    const { result } = renderHook(() => useBrandGuide())
    expect(result.current.guia.nome).toBe('MWA')
  })

  it('persists edits to storage', () => {
    const { result } = renderHook(() => useBrandGuide())
    act(() => result.current.salvar({ slogan: 'Novo slogan' }))
    expect(result.current.guia.slogan).toBe('Novo slogan')
    expect(readItem('brandGuide', null).slogan).toBe('Novo slogan')
  })

  it('keeps unrelated fields when saving a partial edit', () => {
    const { result } = renderHook(() => useBrandGuide())
    act(() => result.current.salvar({ slogan: 'Novo slogan' }))
    expect(result.current.guia.nomeCompleto).toBe(brandGuideSeed.nomeCompleto)
  })
})
