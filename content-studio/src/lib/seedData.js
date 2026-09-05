import { readItem, writeItem } from './storage'
import { brandGuideSeed } from '../data/brandGuideSeed'

export function garantirDadosIniciais() {
  if (readItem('brandGuide', null) === null) {
    writeItem('brandGuide', brandGuideSeed)
  }
}
