import { useReducedMotion } from 'framer-motion'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { useContagem } from '../../hooks/useContagem.js'

// Gráfico de macronutrientes em anéis concêntricos, com o anel de calorias
// por fora dos 3 anéis de macro (proteína/carboidrato/gordura).
// Design premium MWA: minimalismo + hierarquia visual + respiro

export default function GraficoMacros({ proteina = 0, carbos = 0, gordura = 0, metaProteina = 100, metaCarbos = 100, metaGordura = 40, calorias = 0, metaCalorias = 1800, caloriasQueimadas = 0 }) {
  const { ingles } = useIdioma()
  const reduzido = useReducedMotion()
  const ativo = !reduzido
  const proteinaAnimada = useContagem(proteina, { ativo })
  const carbosAnimados = useContagem(carbos, { ativo })
  const gorduraAnimada = useContagem(gordura, { ativo })
  const caloriasAnimadas = useContagem(calorias, { ativo })
  const caloriasQueimadasAnimadas = useContagem(caloriasQueimadas, { ativo })
  const centro = 100 // Centro do SVG (viewBox = 200x200)
  const espessuraAnel = 9
  const espessuraCalorias = 14

  // Raios para cada anel (do externo para interno) — anel de calorias por
  // fora dos 3 de macro, mais grosso, pra se destacar como indicador principal
  const raios = {
    calorias: 84, // anel mais externo, mais grosso
    proteina: 64,
    carbos: 44,
    gordura: 24,
  }

  // Função: Converte porcentagem em ângulo (0 a 360), sem ultrapassar 360
  function percentualParaAngulo(atual, meta) {
    if (!meta) return 0
    return Math.min(360 * (atual / meta), 360)
  }

  // Função: Calcula coordenadas do ponto final do arco
  function calcularPontoFinal(raio, anguloGraus) {
    const angulo = (anguloGraus - 90) * (Math.PI / 180)
    return {
      x: centro + raio * Math.cos(angulo),
      y: centro + raio * Math.sin(angulo),
    }
  }

  // Função: Desenha um arco entre dois ângulos (0–360) numa cor. Usada tanto
  // pelos anéis de macro (sempre de 0 até o ângulo atual, ponta arredondada)
  // quanto pelo anel de calorias (dois segmentos adjacentes, ponta reta —
  // ponta arredondada distorceria o tamanho visual de cada segmento na
  // fronteira entre eles).
  function desenharArco(raio, espessura, anguloInicio, anguloFim, cor, linecap = 'round') {
    if (anguloFim <= anguloInicio) return null
    const pontoInicio = calcularPontoFinal(raio, anguloInicio)
    const pontoFim = calcularPontoFinal(raio, anguloFim)
    const largoArco = anguloFim - anguloInicio > 180 ? 1 : 0
    return (
      <path
        d={`M ${pontoInicio.x} ${pontoInicio.y} A ${raio} ${raio} 0 ${largoArco} 1 ${pontoFim.x} ${pontoFim.y}`}
        fill="none"
        stroke={cor}
        strokeWidth={espessura}
        strokeLinecap={linecap}
      />
    )
  }

  // Função: Desenha um anel de progresso de macro (fundo + 1 arco de 0 até o atual)
  function desenharAnel(raio, atual, meta, cor, opacidade = 1) {
    const angulo = percentualParaAngulo(atual, meta)
    return (
      <g key={`anel-${cor}`}>
        {/* Anel de fundo (meta) */}
        <circle cx={centro} cy={centro} r={raio} fill="none" stroke="#E8E4DC" strokeWidth={espessuraAnel} opacity="0.4" />
        {/* Anel de progresso */}
        <g opacity={opacidade}>{desenharArco(raio, espessuraAnel, 0, angulo, cor)}</g>
      </g>
    )
  }

  // Anel de calorias: o segmento de consumo (verde-escuro, ou terracota de
  // alerta) reflete as calorias LÍQUIDAS (comida menos exercício) — exercício
  // encolhe esse segmento, nunca aumenta o preenchimento. O segmento dourado
  // ("coberto pelo exercício") preenche a diferença até onde a comida sozinha
  // chegaria, e nunca passa daí — a área colorida total nunca cresce por
  // causa do exercício, só muda de cor.
  function desenharAnelCalorias() {
    const netCaloriasAnimado = caloriasAnimadas - caloriasQueimadasAnimadas
    const anguloConsumo = percentualParaAngulo(Math.max(netCaloriasAnimado, 0), metaCalorias)
    const anguloComidaBruta = percentualParaAngulo(caloriasAnimadas, metaCalorias)
    // A cor de alerta usa os valores finais (não animados) pra não piscar de
    // cor durante a contagem — só o preenchimento (ângulos) anima suavemente.
    const netCaloriasFinal = calorias - caloriasQueimadas
    const acimaDaMeta = metaCalorias > 0 && netCaloriasFinal > metaCalorias
    const corConsumo = acimaDaMeta ? '#B0563C' : '#052A1F'

    return (
      <g key="anel-calorias">
        <circle cx={centro} cy={centro} r={raios.calorias} fill="none" stroke="#E8E4DC" strokeWidth={espessuraCalorias} opacity="0.4" />
        {desenharArco(raios.calorias, espessuraCalorias, 0, anguloConsumo, corConsumo, 'butt')}
        {desenharArco(raios.calorias, espessuraCalorias, anguloConsumo, anguloComidaBruta, '#C59F4F', 'butt')}
      </g>
    )
  }

  // Controle de opacidade se ultrapassou meta (anéis de macro apenas)
  const opacidadeProteina = proteina > metaProteina ? 0.7 : 1
  const opacidadeCarbos = carbos > metaCarbos ? 0.7 : 1
  const opacidadeGordura = gordura > metaGordura ? 0.7 : 1

  // Calorie display (usa os valores já animados)
  const caloriasInteiro = Math.round(caloriasAnimadas)
  const metaCaloriasInteiro = Math.round(metaCalorias)
  const caloriasQueimadasInteiro = Math.round(caloriasQueimadasAnimadas)
  const acimaDaMetaTexto = metaCalorias > 0 && calorias - caloriasQueimadas > metaCalorias

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Calorias em cima */}
      <div className="text-center">
        <p className="font-serif text-3xl font-bold text-verde">{caloriasInteiro}</p>
        <p className="mt-0.5 text-xs text-verde/80 tracking-wide">de {metaCaloriasInteiro} kcal</p>
        {caloriasQueimadasInteiro > 0 && (
          <p className="mt-0.5 text-xs font-semibold text-ouro">
            {ingles ? `+${caloriasQueimadasInteiro} kcal from exercise` : `+${caloriasQueimadasInteiro} kcal do exercício`}
          </p>
        )}
      </div>

      <div className="h-px w-16 bg-ouro/30" />

      {/* SVG do gráfico */}
      <svg viewBox="0 0 200 200" className="h-48 w-48 md:h-56 md:w-56" aria-hidden="true">
        {/* Anel de Calorias (mais externo, mais grosso) */}
        {desenharAnelCalorias()}

        {/* Anel de Proteína (Verde Profundo) */}
        {desenharAnel(raios.proteina, proteinaAnimada, metaProteina, '#08402F', opacidadeProteina)}

        {/* Anel de Carboidratos (Sage) */}
        {desenharAnel(raios.carbos, carbosAnimados, metaCarbos, '#879B55', opacidadeCarbos)}

        {/* Anel de Gordura (Dourado) */}
        {desenharAnel(raios.gordura, gorduraAnimada, metaGordura, '#C59F4F', opacidadeGordura)}
      </svg>

      {/* Rótulos dos macros */}
      <div className="grid grid-cols-3 gap-6 text-center">
        {/* Proteína */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Protein' : 'Proteína'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-verde">
            {Math.round(proteinaAnimada)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/80">de {Math.round(metaProteina)}g</p>
        </div>

        {/* Carboidratos */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Carbs' : 'Carboidratos'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-sage">
            {Math.round(carbosAnimados)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/80">de {Math.round(metaCarbos)}g</p>
        </div>

        {/* Gordura */}
        <div>
          <p className="text-xs font-semibold text-verde/70">{ingles ? 'Fat' : 'Gordura'}</p>
          <p className="mt-1 font-serif text-xl font-bold text-ouro">
            {Math.round(gorduraAnimada)}<span className="text-xs font-normal text-verde/60">g</span>
          </p>
          <p className="mt-0.5 text-[10px] text-verde/80">de {Math.round(metaGordura)}g</p>
        </div>
      </div>

      {/* Resumo acessível (leitor de tela) */}
      <div className="sr-only" role="status" aria-live="polite">
        {ingles
          ? `Calories: ${caloriasInteiro} of ${metaCaloriasInteiro} kcal.${caloriasQueimadasInteiro > 0 ? ` ${caloriasQueimadasInteiro} kcal covered by exercise.` : ''} ${acimaDaMetaTexto ? 'Over your goal, even after exercise.' : 'Within your goal.'}`
          : `Calorias: ${caloriasInteiro} de ${metaCaloriasInteiro} kcal.${caloriasQueimadasInteiro > 0 ? ` ${caloriasQueimadasInteiro} kcal cobertas pelo exercício.` : ''} ${acimaDaMetaTexto ? 'Acima da meta, mesmo com o exercício.' : 'Dentro da meta.'}`}
      </div>
    </div>
  )
}
