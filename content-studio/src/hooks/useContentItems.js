import { useCallback, useMemo, useState } from 'react'
import { readCollection, writeCollection } from '../lib/storage'
import { demoContentSeed } from '../data/demoContentSeed'

function carregarInicial() {
  const existentes = readCollection('contentItems', null)
  if (existentes !== null) return existentes
  writeCollection('contentItems', demoContentSeed)
  return demoContentSeed
}

export function useContentItems() {
  const [items, setItems] = useState(carregarInicial)

  const persist = useCallback((proximos) => {
    writeCollection('contentItems', proximos)
    setItems(proximos)
    return proximos
  }, [])

  const criar = useCallback((dados) => {
    const agora = new Date().toISOString()
    const novo = {
      id: crypto.randomUUID(),
      createdAt: agora,
      updatedAt: agora,
      status: 'ideia',
      isDemo: false,
      historicoPrompts: [],
      textoConteudo: '',
      promptGerado: '',
      diaPrograma: null,
      ...dados,
    }
    const atuais = readCollection('contentItems', [])
    persist([novo, ...atuais])
    return novo
  }, [persist])

  const atualizar = useCallback((id, alteracoes) => {
    const atuais = readCollection('contentItems', [])
    const proximos = atuais.map((i) => (i.id === id ? { ...i, ...alteracoes, updatedAt: new Date().toISOString() } : i))
    persist(proximos)
  }, [persist])

  const remover = useCallback((id) => {
    const atuais = readCollection('contentItems', [])
    persist(atuais.filter((i) => i.id !== id))
  }, [persist])

  const apagarDemo = useCallback(() => {
    const atuais = readCollection('contentItems', [])
    persist(atuais.filter((i) => !i.isDemo))
  }, [persist])

  const obter = useCallback((id) => items.find((i) => i.id === id), [items])

  const contagemPorStatus = useMemo(
    () => items.reduce((acc, i) => ({ ...acc, [i.status]: (acc[i.status] || 0) + 1 }), {}),
    [items],
  )

  return { items, criar, atualizar, remover, apagarDemo, obter, contagemPorStatus }
}
