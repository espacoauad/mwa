import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import { NIVEIS_ATIVIDADE, OBJETIVOS } from '../../utils/calculos.js'

export default function TelaBiometria({ dados, atualizar, avancar, voltar }) {
  const idade = Number(dados.idade)
  const peso = Number(dados.peso)
  const altura = Number(dados.altura)
  const valido =
    idade >= 14 && idade <= 100 &&
    peso >= 30 && peso <= 300 &&
    altura >= 120 && altura <= 230 &&
    dados.sexo && dados.nivelAtividade && dados.objetivo

  return (
    <>
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold italic leading-tight text-verde">Seus dados biométricos</h1>
        <p className="mt-3 text-verde/70">Com eles calculamos sua TMB, TDEE e todas as suas metas.</p>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-3">
          <CampoNumero label="Peso" sufixo="kg" value={dados.peso} onChange={(v) => atualizar('peso', v)} placeholder="72" step="0.1" />
          <CampoNumero label="Altura" sufixo="cm" value={dados.altura} onChange={(v) => atualizar('altura', v)} placeholder="168" />
          <CampoNumero label="Idade" sufixo="anos" value={dados.idade} onChange={(v) => atualizar('idade', v)} placeholder="35" />
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-verde">Sexo biológico</span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'feminino', label: 'Feminino ♀' },
              { id: 'masculino', label: 'Masculino ♂' },
            ].map((op) => (
              <button
                key={op.id}
                type="button"
                onClick={() => atualizar('sexo', op.id)}
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
          <span className="mb-2 block text-sm font-semibold text-verde">Nível de atividade física</span>
          <div className="flex flex-col gap-2">
            {NIVEIS_ATIVIDADE.map((nivel) => (
              <button
                key={nivel.id}
                type="button"
                onClick={() => atualizar('nivelAtividade', nivel.id)}
                className={`rounded-lg border-2 px-4 py-3 text-left transition-all ${
                  dados.nivelAtividade === nivel.id
                    ? 'border-sage bg-sage-claro'
                    : 'border-sage/25 bg-white hover:border-sage/50'
                }`}
              >
                <span className="block text-sm font-semibold text-verde">{nivel.label}</span>
                <span className="block text-xs text-verde/60">{nivel.descricao}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-verde">Objetivo</span>
          <div className="grid grid-cols-3 gap-2">
            {OBJETIVOS.map((obj) => (
              <button
                key={obj.id}
                type="button"
                onClick={() => atualizar('objetivo', obj.id)}
                className={`rounded-lg border-2 px-2 py-3 text-center transition-all ${
                  dados.objetivo === obj.id
                    ? 'border-sage bg-sage-claro'
                    : 'border-sage/25 bg-white hover:border-sage/50'
                }`}
              >
                <span className="block text-xl">{obj.emoji}</span>
                <span className="block text-xs font-semibold text-verde">{obj.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-8">
        <Botao onClick={avancar} disabled={!valido}>
          Continuar
        </Botao>
        <Botao variante="secundario" onClick={voltar}>
          Voltar
        </Botao>
      </div>
    </>
  )
}
