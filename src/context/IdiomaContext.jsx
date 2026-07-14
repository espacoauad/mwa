import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export const PORTUGUES = 'pt-BR'
export const INGLES = 'en-US'

const IdiomaContext = createContext(null)

function idiomaInicial() {
  return localStorage.getItem('mwa_idioma') === INGLES ? INGLES : PORTUGUES
}

export function IdiomaProvider({ children }) {
  const [idioma, setIdioma] = useState(idiomaInicial)

  useEffect(() => {
    localStorage.setItem('mwa_idioma', idioma)
    document.documentElement.lang = idioma
  }, [idioma])

  const valor = useMemo(() => ({
    idioma,
    locale: idioma,
    ingles: idioma === INGLES,
    alterarIdioma: setIdioma,
  }), [idioma])

  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>
}

export function useIdioma() {
  const contexto = useContext(IdiomaContext)
  if (!contexto) throw new Error('useIdioma deve ser usado dentro de <IdiomaProvider>')
  return contexto
}
