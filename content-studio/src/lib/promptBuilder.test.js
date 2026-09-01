import { describe, expect, it } from 'vitest'
import { montarPrompt, INSTRUCOES_AJUSTE } from './promptBuilder'
import { brandGuideSeed } from '../data/brandGuideSeed'

const escolhasBase = {
  finalidade: 'Instagram',
  formato: 'Legenda',
  tema: 'Hidratação',
  publico: 'Participantes dos 90 dias',
  profundidade: 'Rápido',
  tom: 'Acolhedor',
  tamanho: 'Curto',
}

describe('montarPrompt', () => {
  it('includes the brand tone and forbidden words', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(prompt).toContain('Acolhedor')
    expect(prompt).toContain('projeto verão')
  })

  it('includes every selected field', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(prompt).toContain('Formato: Legenda')
    expect(prompt).toContain('Tema: Hidratação')
  })

  it('appends the extra instruction when provided', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase, instrucaoExtra: INSTRUCOES_AJUSTE.mais_curto })
    expect(prompt).toContain('Ajuste solicitado nesta versão')
    expect(prompt).toContain(INSTRUCOES_AJUSTE.mais_curto)
  })

  it('adds the faith-content instruction only when tom is "Com fé"', () => {
    const comFe = montarPrompt({ brandGuide: brandGuideSeed, escolhas: { ...escolhasBase, tom: 'Com fé' } })
    const semFe = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(comFe).toContain('fé cristã')
    expect(semFe).not.toContain('fé cristã')
  })

  it('never fabricates a claim that stats are allowed', () => {
    const prompt = montarPrompt({ brandGuide: brandGuideSeed, escolhas: escolhasBase })
    expect(prompt).toContain('Nunca invente estatísticas')
  })
})
