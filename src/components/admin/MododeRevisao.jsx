import { useState, useEffect } from 'react'
import { Lock, Unlock, ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

/**
 * Modo de revisão: permite visualizar qualquer dia do programa
 * sem bloqueios. Útil para Q&A, testes e revisão de conteúdo.
 */
export default function ModoDeRevisao() {
  const { usuario, game, programas } = useApp()
  const [diaAtual, setDiaAtual] = useState(1)
  const [diaParaVisualizacao, setDiaParaVisualizacao] = useState(1)
  const [expandido, setExpandido] = useState(false)
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    // Calcula dia atual ao montar
    if (programas?.length > 0) {
      const diasDesde = (dataISO) => {
        const inicio = new Date(dataISO)
        inicio.setHours(0, 0, 0, 0)
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        return Math.floor((hoje - inicio) / 86400000) + 1
      }

      // Ancorado sempre na data de início da jornada de 30 dias (não na data
      // de compra do 90d) — ver mesma decisão em src/utils/calculos.js.
      const p21 = programas.find((p) => p.tipo === '21d')
      if (p21) {
        const diaCorrido = diasDesde(p21.dataInicio)
        const p90 = programas.find((p) => p.tipo === '90d' && p.status === 'ativo')
        setDiaAtual(p90 ? Math.min(90, Math.max(1, diaCorrido)) : Math.min(30, Math.max(1, diaCorrido)))
      }
    }
  }, [programas])

  // Modo de revisão sempre permite ver até 90 dias (todo o programa)
  const totalDias = 90

  // Armazenar em sessionStorage para passar pro resto da app
  useEffect(() => {
    if (ativo) {
      sessionStorage.setItem('mwaModorevisao', JSON.stringify({
        ativo: true,
        diaVisualizacao: diaParaVisualizacao,
      }))
    } else {
      sessionStorage.removeItem('mwaModorevisao')
    }
  }, [ativo, diaParaVisualizacao])

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-xs">
      {/* Botão Flutuante */}
      <button
        onClick={() => setExpandido(!expandido)}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all ${
          ativo ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-600 hover:bg-slate-700'
        } text-white`}
        title={ativo ? 'Modo de Revisão ATIVO' : 'Ativar Modo de Revisão'}
      >
        {ativo ? <Unlock size={24} /> : <Lock size={24} />}
      </button>

      {/* Painel Expandido */}
      {expandido && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl p-6 border border-slate-200 space-y-4">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              {ativo ? <Unlock size={18} className="text-purple-600" /> : <Lock size={18} />}
              Modo de Revisão
            </h3>
            <p className="text-xs text-slate-600">
              Visualize qualquer dia do programa (1–{totalDias}) sem restrições de acesso.
            </p>
          </div>

          {/* Toggle Ativo/Inativo */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-slate-700">
              {ativo ? '✅ Modo ATIVO' : '⚪ Modo DESATIVADO'}
            </span>
          </label>

          {ativo && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              {/* Dia Atual */}
              <div className="bg-slate-50 p-3 rounded-lg">
                <p className="text-xs font-semibold text-slate-600 uppercase mb-1">Dia Atual</p>
                <p className="text-2xl font-bold text-slate-900">{diaAtual}</p>
              </div>

              {/* Seletor de Dia */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 uppercase">
                  Visualizar Dia
                </label>
                <input
                  type="range"
                  min={1}
                  max={totalDias}
                  value={diaParaVisualizacao}
                  onChange={(e) => setDiaParaVisualizacao(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    min={1}
                    max={totalDias}
                    value={diaParaVisualizacao}
                    onChange={(e) => {
                      const val = Math.min(totalDias, Math.max(1, Number(e.target.value)))
                      setDiaParaVisualizacao(val)
                    }}
                    className="w-16 px-2 py-1 text-sm border border-slate-300 rounded"
                  />
                  <span className="text-xs text-slate-600">de {totalDias} dias</span>
                </div>
              </div>

              {/* Botões rápidos */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setDiaParaVisualizacao(1)}
                  className="px-2 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                >
                  Dia 1
                </button>
                <button
                  onClick={() => setDiaParaVisualizacao(Math.floor(totalDias / 2))}
                  className="px-2 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                >
                  Meio
                </button>
                <button
                  onClick={() => setDiaParaVisualizacao(totalDias)}
                  className="px-2 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded text-slate-700 transition-colors"
                >
                  Fim
                </button>
              </div>

              {/* Status */}
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-700">
                  <strong>Visualizando dia {diaParaVisualizacao}.</strong> Todas as restrições de dia estão desativadas.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setExpandido(false)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          >
            <ChevronRight size={16} />
            Fechar
          </button>
        </div>
      )}
    </div>
  )
}
