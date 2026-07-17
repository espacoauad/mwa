import { useIdioma } from '../../context/IdiomaContext.jsx'

// Gráfico de macronutrientes em anéis concêntricos
// Design premium MWA: minimalismo + hierarquia visual + respiro

export default function GraficoMacros({ proteina = 0, carbos = 0, gordura = 0, metaProteina = 100, metaCarbos = 100, metaGordura = 40, calorias = 0, metaCalorias = 1800 }) {
  const { ingles } = useIdioma()
  const centro = 100 // Centro do SVG (viewBox = 200x200)
  const espessuraAnel = 9

  // Raios para cada anel (do externo para interno) — espaçamento de 25px entre cada
  const raios = {
    proteina: 80,  // anel externo (Verde)
    carbos: 55,    // anel do meio (Sage) — 25px de distância
    gordura: 30    // anel interno (Dourado) — 25px de distância
  }

  // Função: Converte porcentagem em ângulo (0 a 360)
  function percentualParaAngulo(atual, meta) {
    return Math.min(360 * (atual / meta), 360)
  }

  // Função: Calcula coordenadas do ponto final do arco
  function calcularPontoFinal(raio, anguloGraus) {
    const angulo = (anguloGraus - 90) * (Math.PI / 180)
    return {
      x: centro + raio * Math.cos(angulo),
      y: centro + raio * Math.sin(angulo)
    }
  }

  // Função: Desenha um anel de progresso
  function desenharAnel(raio, atual, meta, cor, opacidade = 1) {
    const angulo = percentualParaAngulo(atual, meta)
    const largoArco = angulo > 180 ? 1 : 0
    const ponto = calcularPontoFinal(raio, angulo)

    return (
      <g key={`anel-${cor}`}>
        {/* Anel de fundo (meta) */}
        <circle cx={centro} cy={centro} r={raio} fill="none" stroke="#E8E4DC" strokeWidth={espessuraAnel} opacity="0.4" />

        {/* Anel de progresso */}
        {atual > 0 && (
          <path
            d={`M ${centro} ${centro - raio} A ${raio} ${raio} 0 ${largoArco} 1 ${ponto.x} ${ponto.y}`}
            fill="none"
            stroke={cor}
            strokeWidth={espessuraAnel}
            strokeLinecap="round"
            opacity={opacidade}
          />
        )}
      </g>
    )
  }

  // Controle de opacidade se ultrapassou meta
  const opacidadeProteina = proteina > metaProteina ? 0.7 : 1
  const opacidadeCarbos = carbos > metaCarbos ? 0.7 : 1
  const opacidadeGordura = gordura > metaGordura ? 0.7 : 1

  // Calorie display
  const caloriasInteiro = Math.round(calorias)
  const metaCaloriasInteiro = Math.round(metaCalorias)

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Calorias em cima */}
      <div className="text-center">
        <p className="font-serif text-3xl font-bold text-verde">{caloriasInteiro}</p>
        <p className="mt-0.5 text-xs text-verde/50 tracking-wide">de {metaCaloriasInteiro} kcal</p>
      </div>

      {/* SVG do gráfico */}
      <svg viewBox="0 0 200 200" className="h-48 w-48 md:h-56 md:w-56">
        {/* Anel de Proteína (externo, Verde Profundo) */}
        {desenharAnel(raios.proteina, proteina, metaProteina, '#344528', opacidadeProteina)}

        {/* Anel de Carboidratos (meio, Sage) */}
        {desenharAnel(raios.carbos, carbos, metaCarbos, '#879B55', opacidadeCarbos)}

        {/* Anel de Gordura (interno, Dourado) */}
        {desenharAnel(raios.gordura, gordura, metaGordura, '#D4AF7A', opacidadeGordura)}
      </svg>

      {/* Rótulos dos macros */}
      <div className="grid grid-cols-3 gap-6 text-center">
        {/* Proteína */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Protein' : 'Proteína'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-verde">
            {Math.round(proteina)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/40">de {Math.round(metaProteina)}g</p>
        </div>

        {/* Carboidratos */}
        <div>
          <p className="text-xs font-semibold text-verde/70">Carbs</p>
          <p className="mt-1 font-serif text-xl font-bold text-sage">
            {Math.round(carbos)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/40">de {Math.round(metaCarbos)}g</p>
        </div>

        {/* Gordura */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Fat' : 'Gordura'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-ouro">
            {Math.round(gordura)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/40">de {Math.round(metaGordura)}g</p>
        </div>
      </div>
    </div>
  )
}
