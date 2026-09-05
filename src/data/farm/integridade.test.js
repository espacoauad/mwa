import test from 'node:test'
import assert from 'node:assert/strict'
import { PILARES } from './pilares.js'
import { DECORACOES } from './decoracoes.js'
import { COROAS_SUPORTADAS } from '../../components/game/svg/coroasSuportadas.js'
import { IDS_ANIMAIS } from '../../components/game/svg/idsAnimais.js'

test('todo coroaId de PILARES tem um desenho correspondente em PlantaFazenda', () => {
  for (const pilar of PILARES) {
    assert.ok(COROAS_SUPORTADAS.includes(pilar.coroaId), `${pilar.id}: coroaId "${pilar.coroaId}" não tem desenho em PlantaFazenda.jsx`)
  }
})

test('toda decoração do tipo animal tem um SVG correspondente em AnimalFazendaSvg', () => {
  const animais = DECORACOES.filter((d) => d.tipo === 'animal')
  for (const animal of animais) {
    assert.ok(IDS_ANIMAIS.includes(animal.id), `${animal.id}: sem SVG correspondente em AnimalFazendaSvg.jsx`)
  }
})
