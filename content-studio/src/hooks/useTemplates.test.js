import { beforeEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTemplates } from './useTemplates'

beforeEach(() => localStorage.clear())

describe('useTemplates', () => {
  it('loads the 20 seed templates when storage is empty', () => {
    const { result } = renderHook(() => useTemplates())
    expect(result.current.templates).toHaveLength(20)
  })

  it('creates a user template with origem "usuario"', () => {
    const { result } = renderHook(() => useTemplates())
    act(() => result.current.criar({ nome: 'Meu modelo', formato: 'Post', categoria: 'Instagram', conteudoModelo: 'Texto' }))
    const criado = result.current.templates.find((t) => t.nome === 'Meu modelo')
    expect(criado.origem).toBe('usuario')
  })

  it('duplicates a template with a new id and "(cópia)" suffix', () => {
    const { result } = renderHook(() => useTemplates())
    const original = result.current.templates[0]
    act(() => result.current.duplicar(original.id))
    const copia = result.current.templates.find((t) => t.nome === `${original.nome} (cópia)`)
    expect(copia).toBeDefined()
    expect(copia.id).not.toBe(original.id)
  })

  it('removes a template by id', () => {
    const { result } = renderHook(() => useTemplates())
    const alvo = result.current.templates[0]
    act(() => result.current.remover(alvo.id))
    expect(result.current.templates.find((t) => t.id === alvo.id)).toBeUndefined()
  })
})
