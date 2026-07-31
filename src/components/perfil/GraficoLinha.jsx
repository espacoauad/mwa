import { pontosGrafico } from '../../utils/evolucao.js'

const LARGURA = 300
const ALTURA = 120
const PREENCHIMENTO = 24

export default function GraficoLinha({ titulo, pontos, sufixo = '' }) {
  const valores = pontos.map((p) => p.valor)
  const coordenadas = pontosGrafico(valores, LARGURA, ALTURA, PREENCHIMENTO)
  const coordenadasValidas = coordenadas.filter(Boolean)

  const caminho = coordenadasValidas.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm shadow-verde/5">
      <p className="text-sm font-semibold text-verde">{titulo}</p>

      {coordenadasValidas.length < 2 ? (
        <p className="mt-3 rounded-lg bg-creme p-3 text-center text-xs text-verde/70">
          Ainda não há dados suficientes para um gráfico — continue registrando suas pesagens.
        </p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${LARGURA} ${ALTURA}`}
            className="mt-2 w-full"
            role="img"
            aria-label={`Gráfico de ${titulo.toLowerCase()} ao longo do tempo`}
          >
            <path d={caminho} fill="none" stroke="var(--color-sage)" strokeWidth="2" />
            {coordenadas.map((c, i) =>
              c ? <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="var(--color-verde)" /> : null,
            )}
          </svg>

          <div className="mt-2 flex justify-between text-[10px] text-verde/60">
            {pontos.map((p, i) => (
              <span key={i}>{p.rotulo}</span>
            ))}
          </div>

          {/* Tabela oculta visualmente, para leitores de tela — um SVG não é lido de forma útil sozinho */}
          <table className="sr-only">
            <caption>{titulo}</caption>
            <thead>
              <tr>
                <th scope="col">Marco</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>
              {pontos.map((p, i) => (
                <tr key={i}>
                  <td>{p.rotulo}</td>
                  <td>{p.valor != null ? `${p.valor}${sufixo}` : 'Sem registro'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
