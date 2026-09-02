import { describe, expect, it } from 'vitest'
import { detectarAvisoSaude, encontrarPalavrasProibidas } from './contentReview'

describe('detectarAvisoSaude', () => {
  it('flags text mentioning weight loss', () => {
    expect(detectarAvisoSaude('Esse hábito ajuda a emagrecer com saúde.')).toBe(true)
  })

  it('does not flag unrelated text', () => {
    expect(detectarAvisoSaude('Hoje o desafio é organizar sua semana.')).toBe(false)
  })
})

describe('encontrarPalavrasProibidas', () => {
  it('finds a case-insensitive match', () => {
    const achadas = encontrarPalavrasProibidas('Este é o Projeto Verão da sua vida!', ['projeto verão'])
    expect(achadas).toEqual(['projeto verão'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(encontrarPalavrasProibidas('Texto limpo e acolhedor.', ['projeto verão'])).toEqual([])
  })
})
