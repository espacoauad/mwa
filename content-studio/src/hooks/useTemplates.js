import { useCallback, useState } from 'react'
import { readCollection, writeCollection } from '../lib/storage'
import { templatesSeed } from '../data/templatesSeed'

function carregarInicial() {
  const existentes = readCollection('templates', [])
  if (existentes.length > 0) return existentes
  writeCollection('templates', templatesSeed)
  return templatesSeed
}

export function useTemplates() {
  const [templates, setTemplates] = useState(carregarInicial)

  const persist = useCallback((proximos) => {
    writeCollection('templates', proximos)
    setTemplates(proximos)
    return proximos
  }, [])

  const criar = useCallback((dados) => {
    const novo = { id: crypto.randomUUID(), origem: 'usuario', ...dados }
    const atuais = readCollection('templates', [])
    persist([novo, ...atuais])
    return novo
  }, [persist])

  const atualizar = useCallback((id, alteracoes) => {
    const atuais = readCollection('templates', [])
    persist(atuais.map((t) => (t.id === id ? { ...t, ...alteracoes } : t)))
  }, [persist])

  const remover = useCallback((id) => {
    const atuais = readCollection('templates', [])
    persist(atuais.filter((t) => t.id !== id))
  }, [persist])

  const duplicar = useCallback((id) => {
    const atuais = readCollection('templates', [])
    const original = atuais.find((t) => t.id === id)
    if (!original) return
    const copia = { ...original, id: crypto.randomUUID(), nome: `${original.nome} (cópia)`, origem: 'usuario' }
    persist([copia, ...atuais])
    return copia
  }, [persist])

  const obter = useCallback((id) => templates.find((t) => t.id === id), [templates])

  return { templates, criar, atualizar, remover, duplicar, obter, persist }
}
