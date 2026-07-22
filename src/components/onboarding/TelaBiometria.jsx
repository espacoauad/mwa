import { useState } from 'react'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import { NIVEIS_ATIVIDADE, OBJETIVOS } from '../../utils/calculos.js'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const ATIVIDADE_EN = {
  sedentario: ['Sedentary', 'Little or no exercise'],
  leve: ['Lightly active', 'Light exercise 1–3 times a week'],
  moderado: ['Moderately active', 'Moderate exercise 3–5 times a week'],
  intenso: ['Very active', 'Intense exercise 6–7 times a week'],
  atleta: ['Extremely active', 'Daily intense training or physical work'],
}

const OBJETIVO_EN = { emagrecer: 'Lose weight', manter: 'Maintain', ganhar: 'Build muscle' }

export default function TelaBiometria({ dados, atualizar, avancar, voltar }) {
  const { ingles } = useIdioma()
  const [tocado, setTocado] = useState({})
  const idade = Number(dados.idade)
  const peso = Number(dados.peso)
  const altura = Number(dados.altura)
  const pesoValido = peso >= 30 && peso <= 300
  const alturaValida = altura >= 120 && altura <= 230
  const idadeValida = idade >= 14 && idade <= 100
  const valido =
    idadeValida && pesoValido && alturaValida &&
    dados.sexo && dados.nivelAtividade && dados.objetivo

  function marcarTocado(campo) {
    setTocado((t) => ({ ...t, [campo]: true }))
  }

  const erroPeso = ingles ? 'Enter a weight between 30 and 300 kg.' : 'Informe um peso entre 30 e 300 kg.'
  const erroAltura = ingles ? 'Enter a height between 120 and 230 cm.' : 'Informe uma altura entre 120 e 230 cm.'
  const erroIdade = ingles ? 'Enter an age between 14 and 100.' : 'Informe uma idade entre 14 e 100 anos.'

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">{ingles ? 'Your biometric information' : 'Seus dados biométricos'}</h1>
        <p className="mt-3 text-verde/70">{ingles ? 'We use it to calculate your BMR, TDEE, and daily targets.' : 'Com eles calculamos sua TMB, TDEE e todas as suas metas.'}</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <CampoNumero
              label={ingles ? 'Weight' : 'Peso'}
              sufixo="kg"
              value={dados.peso}
              onChange={(v) => atualizar('peso', v)}
              onBlur={() => marcarTocado('peso')}
              placeholder="72"
              step="0.1"
              aria-invalid={tocado.peso && !pesoValido}
              aria-describedby={tocado.peso && !pesoValido ? 'erro-peso' : undefined}
            />
            {tocado.peso && !pesoValido && (
              <p id="erro-peso" role="alert" className="mt-1.5 text-xs font-medium text-red-700">{erroPeso}</p>
            )}
          </div>
          <div>
            <CampoNumero
              label={ingles ? 'Height' : 'Altura'}
              sufixo="cm"
              value={dados.altura}
              onChange={(v) => atualizar('altura', v)}
              onBlur={() => marcarTocado('altura')}
              placeholder="168"
              aria-invalid={tocado.altura && !alturaValida}
              aria-describedby={tocado.altura && !alturaValida ? 'erro-altura' : undefined}
            />
            {tocado.altura && !alturaValida && (
              <p id="erro-altura" role="alert" className="mt-1.5 text-xs font-medium text-red-700">{erroAltura}</p>
            )}
          </div>
          <div>
            <CampoNumero
              label={ingles ? 'Age' : 'Idade'}
              sufixo={ingles ? 'years' : 'anos'}
              value={dados.idade}
              onChange={(v) => atualizar('idade', v)}
              onBlur={() => marcarTocado('idade')}
              placeholder="35"
              aria-invalid={tocado.idade && !idadeValida}
              aria-describedby={tocado.idade && !idadeValida ? 'erro-idade' : undefined}
            />
            {tocado.idade && !idadeValida && (
              <p id="erro-idade" role="alert" className="mt-1.5 text-xs font-medium text-red-700">{erroIdade}</p>
            )}
          </div>
        </div>

        <div>
          <span id="grupo-sexo" className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Biological sex' : 'Sexo biológico'}</span>
          <div role="group" aria-labelledby="grupo-sexo" className="grid grid-cols-2 gap-3">
            {[
              { id: 'feminino', label: ingles ? 'Female ♀' : 'Feminino ♀' },
              { id: 'masculino', label: ingles ? 'Male ♂' : 'Masculino ♂' },
            ].map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => atualizar('sexo', op.id)}
                aria-pressed={dados.sexo === op.id}
                className={`rounded-lg border-2 px-4 py-3.5 font-semibold transition-all ${
                  dados.sexo === op.id
                    ? 'border-sage bg-sage-claro text-verde'
                    : 'border-sage/25 bg-white text-verde/60 hover:border-sage/50'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span id="grupo-atividade" className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Physical activity level' : 'Nível de atividade física'}</span>
          <div role="group" aria-labelledby="grupo-atividade" className="flex flex-col gap-2">
            {NIVEIS_ATIVIDADE.map((nivel) => (
              <button
                key={nivel.id}
                type="button"
                onClick={() => atualizar('nivelAtividade', nivel.id)}
                aria-pressed={dados.nivelAtividade === nivel.id}
                className={`rounded-lg border-2 px-4 py-3 text-left transition-all ${
                  dados.nivelAtividade === nivel.id
                    ? 'border-sage bg-sage-claro'
                    : 'border-sage/25 bg-white hover:border-sage/50'
                }`}
              >
                <span className="block text-sm font-semibold text-verde">{ingles ? ATIVIDADE_EN[nivel.id][0] : nivel.label}</span>
                <span className="block text-xs text-verde/60">{ingles ? ATIVIDADE_EN[nivel.id][1] : nivel.descricao}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span id="grupo-objetivo" className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Goal' : 'Objetivo'}</span>
          <div role="group" aria-labelledby="grupo-objetivo" className="grid grid-cols-3 gap-2">
            {OBJETIVOS.map((obj) => (
              <button
                key={obj.id}
                type="button"
                onClick={() => atualizar('objetivo', obj.id)}
                aria-pressed={dados.objetivo === obj.id}
                className={`rounded-lg border-2 px-2 py-3 text-center transition-all ${
                  dados.objetivo === obj.id
                    ? 'border-sage bg-sage-claro'
                    : 'border-sage/25 bg-white hover:border-sage/50'
                }`}
              >
                <span className="block text-xl">{obj.emoji}</span>
                <span className="block text-xs font-semibold text-verde">{ingles ? OBJETIVO_EN[obj.id] : obj.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar} disabled={!valido}>
          {ingles ? 'Continue' : 'Continuar'}
        </Botao>
        <Botao variante="secundario" onClick={voltar}>
          {ingles ? 'Back' : 'Voltar'}
        </Botao>
      </div>
    </>
  )
}
