import { TrendingDown, TrendingUp, Minus } from 'lucide-react'

export default function SeuProgresso({ usuario, pesagens }) {
  // Se não há pesagens, mostrar placeholder
  if (!pesagens || pesagens.length === 0) {
    return (
      <section className="mwa-sombra-premium mt-4 rounded-2xl bg-white p-8">
        <h2 className="mb-1 text-sm font-semibold text-verde/60">Seu progresso</h2>
        <p className="mb-6 text-xs text-verde/80">
          Registre sua primeira pesagem para acompanhar o progresso — peso, medidas e fotos.
        </p>
        <div className="rounded-lg bg-sage-claro p-4 text-center">
          <p className="text-sm font-medium text-verde">
            📊 Quando você registrar sua primeira pesagem, sua evolução aparecerá aqui.
          </p>
        </div>
      </section>
    )
  }

  // Dados básicos
  const pesoInicial = usuario.peso
  const ultimaPesagem = pesagens[pesagens.length - 1]
  const pesoAtual = ultimaPesagem.peso
  const variacao = Math.round((pesoAtual - pesoInicial) * 10) / 10
  const IconeVariacao = variacao < 0 ? TrendingDown : variacao > 0 ? TrendingUp : Minus
  const corVariacao = variacao < 0 ? 'text-sage' : variacao > 0 ? 'text-ouro' : 'text-verde/60'

  // Calcular mudanças em medidas (última vs primeira)
  const medidas = []
  const medidasLabels = { cintura: 'Cintura', quadril: 'Quadril', peito: 'Peito' }

  if (pesagens.length > 0) {
    const primeiraPesagem = pesagens[0]

    for (const [campo, label] of Object.entries(medidasLabels)) {
      const valorPrimeiro = primeiraPesagem.medidas?.[campo]
      const valorUltimo = ultimaPesagem.medidas?.[campo]

      if (valorPrimeiro && valorUltimo) {
        const delta = Math.round((valorPrimeiro - valorUltimo) * 10) / 10
        if (delta !== 0) {
          medidas.push({
            campo,
            label,
            valorAtual: valorUltimo,
            delta,
            cor: delta > 0 ? 'text-sage' : 'text-verde/60',
          })
        }
      }
    }
  }

  // Ordenar por magnitude de mudança (maior primeiro)
  medidas.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))

  // Dados de histórico semanal (últimas 3 semanas ou todas se <3)
  const historicoSemanal = pesagens.slice(-3).map((p, i) => {
    const pesagemAnterior = i === 0 ? (pesagens.length > 3 ? pesagens[pesagens.length - 4] : { peso: pesoInicial }) : pesagens[pesagens.length - 3 + i - 1]
    const deltaSemana = Math.round((p.peso - pesagemAnterior.peso) * 10) / 10
    const corDelta = deltaSemana <= 0 ? 'text-sage' : 'text-ouro'

    // Medida principal da semana (cintura)
    const medidasSemana = p.medidas?.cintura ? `${p.medidas.cintura} cm` : '—'

    return {
      semana: p.semana,
      peso: p.peso,
      delta: deltaSemana,
      corDelta,
      medidas: medidasSemana,
    }
  })

  return (
    <section className="mwa-sombra-premium mt-4 rounded-2xl bg-white p-8">
      {/* Header */}
      <h2 className="mb-1 text-sm font-semibold text-verde/60">Seu progresso</h2>
      <p className="mb-6 text-xs text-verde/80">
        O corpo responde quando a mente entende o caminho percorrido. Seus resultados como consequência de uma nova forma de viver.
      </p>

      {/* Grid 3 cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Card 1: Peso + Evolução */}
        <div className="rounded-xl bg-gradient-to-br from-verde/5 to-sage-claro p-4">
          <p className="text-xs font-semibold text-verde/70">Peso atual</p>
          <p className="mt-2 font-serif text-2xl font-bold text-verde">
            {pesoAtual.toLocaleString('pt-BR')} <span className="text-sm text-verde/60">kg</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <IconeVariacao size={18} className={corVariacao} />
            <span className={`font-semibold ${corVariacao}`}>
              {variacao > 0 ? '+' : ''}{variacao.toLocaleString('pt-BR')} kg
            </span>
          </div>
          <p className="mt-1 text-[10px] text-verde/80">desde o início</p>
        </div>

        {/* Card 2: Top Medidas */}
        <div className="rounded-xl bg-gradient-to-br from-ouro-claro to-sage-claro p-4">
          <p className="text-xs font-semibold text-verde/70">Medidas</p>
          <div className="mt-2 space-y-2">
            {medidas.length > 0 ? (
              medidas.slice(0, 2).map((m) => (
                <div key={m.campo}>
                  <p className="text-[11px] text-verde/60">{m.label}</p>
                  <p className={`font-semibold ${m.cor}`}>
                    {m.delta > 0 ? '−' : '+'}{Math.abs(m.delta)} cm
                  </p>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-verde/80">Nenhuma medida registrada ainda</p>
            )}
          </div>
        </div>

        {/* Card 3: Semana Atual */}
        <div className="rounded-xl bg-gradient-to-br from-verde/5 to-creme p-4">
          <p className="text-xs font-semibold text-verde/70">Evolução semanal</p>
          <div className="mt-2 space-y-1.5 text-[10px]">
            {historicoSemanal.length > 0 ? (
              historicoSemanal.slice(-2).map((s) => (
                <div key={s.semana} className="flex items-center justify-between">
                  <span className="text-verde/60">Sem {s.semana}</span>
                  <span className={`font-medium ${s.corDelta}`}>
                    {s.delta > 0 ? '+' : ''}{s.delta} kg
                  </span>
                </div>
              ))
            ) : (
              <p className="text-verde/80">Registre sua pesagem</p>
            )}
          </div>
        </div>
      </div>

      {/* Mini tabela de histórico (opcional, se 2+ pesagens) */}
      {pesagens.length >= 2 && (
        <div className="mt-6 border-t border-ouro/20 pt-4">
          <h3 className="mb-3 text-xs font-semibold text-verde/70">Histórico resumido</h3>
          <div className="space-y-2 text-xs">
            {historicoSemanal.map((s) => (
              <div key={s.semana} className="flex items-center justify-between rounded-lg bg-verde/5 px-3 py-2">
                <span className="font-medium text-verde">Semana {s.semana}</span>
                <div className="flex items-center gap-4">
                  <span className="text-verde/70">
                    <strong className="text-verde">{s.peso.toLocaleString('pt-BR')} kg</strong>
                  </span>
                  <span className={`font-medium ${s.corDelta}`}>
                    ({s.delta > 0 ? '+' : ''}{s.delta})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bioimpedancia Evolution Section */}
      {(() => {
        const metricas = {
          percentualGordura: [],
          percentualMusculo: [],
          gorduraVisceral: [],
          idadeMetabolica: [],
          toraxCm: [],
          circAbdominalCm: [],
        }

        pesagens.forEach((p) => {
          if (!p.bioimpedancia) return
          Object.entries(p.bioimpedancia).forEach(([key, val]) => {
            if (val !== null && val !== undefined) {
              metricas[key].push({
                semana: p.semana,
                valor: val,
              })
            }
          })
        })

        const metricsComDados = Object.entries(metricas)
          .filter(([_, values]) => values.length > 0)
          .map(([key, values]) => ({ key, values }))

        if (metricsComDados.length === 0) return null

        const labels = {
          percentualGordura: '% Gordura Corporal',
          percentualMusculo: '% Músculo',
          gorduraVisceral: 'Gordura Visceral',
          idadeMetabolica: 'Idade Metabólica',
          toraxCm: 'Tórax',
          circAbdominalCm: 'Circ. Abdominal',
        }

        const units = {
          percentualGordura: '%',
          percentualMusculo: '%',
          gorduraVisceral: '',
          idadeMetabolica: ' anos',
          toraxCm: ' cm',
          circAbdominalCm: ' cm',
        }

        const melhorEhMenor = {
          percentualGordura: true,
          percentualMusculo: false,
          gorduraVisceral: true,
          idadeMetabolica: true,
          toraxCm: false,
          circAbdominalCm: true,
        }

        return (
          <div className="mt-6 border-t border-ouro/20 pt-4">
            <h3 className="mb-4 text-sm font-semibold text-verde/70">📊 Bioimpedância</h3>
            <div className="space-y-4">
              {metricsComDados.map(({ key, values }) => (
                <div
                  key={key}
                  className="rounded-lg border border-verde/10 bg-gradient-to-br from-verde/5 to-sage-claro p-4"
                >
                  <p className="mb-2 text-xs font-semibold text-verde">{labels[key]}</p>
                  <div className="space-y-1.5">
                    {values.map((entry, idx) => {
                      const valorAnterior = idx > 0 ? values[idx - 1].valor : null
                      const variacao = valorAnterior ? entry.valor - valorAnterior : null

                      let corVariacao = 'text-verde/60'
                      if (variacao !== null) {
                        const isMelhoraMenor = melhorEhMenor[key]
                        const isMelhora = isMelhoraMenor ? variacao < 0 : variacao > 0
                        const isPiora = isMelhoraMenor ? variacao > 0 : variacao < 0

                        corVariacao = isMelhora ? 'text-sage' : isPiora ? 'text-ouro' : 'text-verde/60'
                      }

                      return (
                        <div key={idx} className="flex items-center justify-between text-[11px]">
                          <span className="text-verde/70">Semana {entry.semana}:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-verde">
                              {entry.valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                              {units[key]}
                            </span>
                            {variacao !== null && (
                              <span className={`font-medium ${corVariacao}`}>
                                {variacao > 0 ? '+' : ''}
                                {variacao.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })()}
    </section>
  )
}
