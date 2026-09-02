import { useCallback, useState } from 'react'
import { readItem, writeItem } from '../lib/storage'
import { brandGuideSeed } from '../data/brandGuideSeed'

export function useBrandGuide() {
  const [guia, setGuia] = useState(() => readItem('brandGuide', brandGuideSeed))

  const salvar = useCallback((alteracoes) => {
    setGuia((atual) => {
      const proximo = { ...atual, ...alteracoes }
      writeItem('brandGuide', proximo)
      return proximo
    })
  }, [])

  return { guia, salvar }
}
