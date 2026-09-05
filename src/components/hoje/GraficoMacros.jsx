import { useReducedMotion } from 'framer-motion'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { useContagem } from '../../hooks/useContagem.js'

const CORES = {
  proteina: '#08402f',
  carbos: '#879b55',
  gordura: '#c59f4f',
  fibras: '#879b55',
  caloriasBase: '#052a1f',
  caloriasExercicio: '#c59f4f',
  alerta: '#b0563c',
}

// Barra horizontal de progresso de um nutriente: nome e valores embaixo da
// linha, preenchimento na cor específica do nutriente, e vira vermelho
// (cor de alerta) assim que o consumido ultrapassa a meta — sinalizando
// claramente números extrapolados, o que os antigos anéis concêntricos
// (muito pequenos) não deixavam visível.
function BarraNutriente({ label, valorAnimado, valorFinal, meta, unidade, cor, locale }) {
  const excedeu = meta > 0 && valorFinal > meta
  const corBarra = excedeu ? CORES.alerta : cor
  const largura = meta > 0 ? Math.min(100, (valorAnimado / meta) * 100) : 0

  return (
    <div className="w-full">
      <div className="h-3 w-full overflow-hidden rounded-full bg-cinza">
        <div
          className="h-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${largura}%`, backgroundColor: corBarra }}
        />
      </div>
      <div className="mt-1.5 flex items-baseline justify-between">
        <span className={`text-xs font-semibold ${excedeu ? 'text-[#b0563c]' : 'text-verde/70'}`}>{label}</span>
        <span className="text-xs text-verde/80">
          <strong className={excedeu ? 'text-[#b0563c]' : 'text-verde'}>
            {Math.round(valorAnimado).toLocaleString(locale)}
          </strong>
          /{meta.toLocaleString(locale)} {unidade}
        </span>
      </div>
    </div>
  )
}

export default function GraficoMacros({
  proteina = 0,
  carbos = 0,
  gordura = 0,
  fibras = 0,
  metaProteina = 100,
  metaCarbos = 100,
  metaGordura = 40,
  metaFibras = 25,
  calorias = 0,
  metaCalorias = 1800,
  caloriasQueimadas = 0,
}) {
  const { ingles, locale } = useIdioma()
  const reduzido = useReducedMotion()
  const ativo = !reduzido
  const proteinaAnimada = useContagem(proteina, { ativo })
  const carbosAnimados = useContagem(carbos, { ativo })
  const gorduraAnimada = useContagem(gordura, { ativo })
  const fibrasAnimadas = useContagem(fibras, { ativo })
  const caloriasAnimadas = useContagem(calorias, { ativo })
  const caloriasQueimadasAnimadas = useContagem(caloriasQueimadas, { ativo })

  // Calorias: o segmento de consumo reflete as calorias LÍQUIDAS (comida
  // menos exercício) — exercício encolhe esse segmento, nunca aumenta o
  // preenchimento. O segmento dourado ("coberto pelo exercício") preenche a
  // diferença até onde a comida sozinha chegaria. A cor de alerta usa os
  // valores finais (não animados) pra não piscar de cor durante a contagem.
  const netCaloriasAnimado = Math.max(caloriasAnimadas - caloriasQueimadasAnimadas, 0)
  const netCaloriasFinal = calorias - caloriasQueimadas
  const acimaDaMeta = metaCalorias > 0 && netCaloriasFinal > metaCalorias
  const corConsumoCalorias = acimaDaMeta ? CORES.alerta : CORES.caloriasBase
  const larguraNet = metaCalorias > 0 ? Math.min(100, (netCaloriasAnimado / metaCalorias) * 100) : 0
  const larguraBruto = metaCalorias > 0 ? Math.min(100, (caloriasAnimadas / metaCalorias) * 100) : 0
  const larguraExercicio = Math.max(0, larguraBruto - larguraNet)

  const caloriasInteiro = Math.round(caloriasAnimadas)
  const metaCaloriasInteiro = Math.round(metaCalorias)
  const caloriasQueimadasInteiro = Math.round(caloriasQueimadasAnimadas)

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Calorias em destaque */}
      <div className="text-center">
        <p className={`font-serif text-3xl font-bold ${acimaDaMeta ? 'text-[#b0563c]' : 'text-verde'}`}>{caloriasInteiro}</p>
        <p className="mt-0.5 text-xs text-verde/80 tracking-wide">{ingles ? `of ${metaCaloriasInteiro} kcal` : `de ${metaCaloriasInteiro} kcal`}</p>
        {caloriasQueimadasInteiro > 0 && (
          <p className="mt-0.5 text-xs font-semibold text-ouro">
            {ingles ? `+${caloriasQueimadasInteiro} kcal from exercise` : `+${caloriasQueimadasInteiro} kcal do exercício`}
          </p>
        )}
      </div>

      {/* Barra de Calorias (dois segmentos: consumo líquido + coberto pelo exercício) */}
      <div className="w-full">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-cinza">
          <div
            className="absolute inset-y-0 left-0 transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${larguraNet}%`, backgroundColor: corConsumoCalorias }}
          />
          <div
            className="absolute inset-y-0 transition-[left,width] duration-500 ease-out motion-reduce:transition-none"
            style={{ left: `${larguraNet}%`, width: `${larguraExercicio}%`, backgroundColor: CORES.caloriasExercicio }}
          />
        </div>
        <div className="mt-1.5 flex items-baseline justify-between">
          <span className={`text-xs font-semibold ${acimaDaMeta ? 'text-[#b0563c]' : 'text-verde/70'}`}>{ingles ? 'Calories' : 'Calorias'}</span>
          <span className="text-xs text-verde/80">
            <strong className={acimaDaMeta ? 'text-[#b0563c]' : 'text-verde'}>{caloriasInteiro.toLocaleString(locale)}</strong>
            /{metaCaloriasInteiro.toLocaleString(locale)} kcal
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-ouro/20" />

      {/* Barras de macronutrientes */}
      <div className="flex flex-col gap-4">
        <BarraNutriente
          label={ingles ? 'Protein' : 'Proteína'}
          valorAnimado={proteinaAnimada}
          valorFinal={proteina}
          meta={metaProteina}
          unidade="g"
          cor={CORES.proteina}
          locale={locale}
        />
        <BarraNutriente
          label={ingles ? 'Carbohydrates' : 'Carboidratos'}
          valorAnimado={carbosAnimados}
          valorFinal={carbos}
          meta={metaCarbos}
          unidade="g"
          cor={CORES.carbos}
          locale={locale}
        />
        <BarraNutriente
          label={ingles ? 'Fat' : 'Gordura'}
          valorAnimado={gorduraAnimada}
          valorFinal={gordura}
          meta={metaGordura}
          unidade="g"
          cor={CORES.gordura}
          locale={locale}
        />
        <BarraNutriente
          label={ingles ? 'Fiber' : 'Fibras'}
          valorAnimado={fibrasAnimadas}
          valorFinal={fibras}
          meta={metaFibras}
          unidade="g"
          cor={CORES.fibras}
          locale={locale}
        />
      </div>

      {/* Resumo acessível (leitor de tela) */}
      <div className="sr-only" role="status" aria-live="polite">
        {ingles
          ? `Calories: ${caloriasInteiro} of ${metaCaloriasInteiro} kcal.${caloriasQueimadasInteiro > 0 ? ` ${caloriasQueimadasInteiro} kcal covered by exercise.` : ''} ${acimaDaMeta ? 'Over your goal, even after exercise.' : 'Within your goal.'}`
          : `Calorias: ${caloriasInteiro} de ${metaCaloriasInteiro} kcal.${caloriasQueimadasInteiro > 0 ? ` ${caloriasQueimadasInteiro} kcal cobertas pelo exercício.` : ''} ${acimaDaMeta ? 'Acima da meta, mesmo com o exercício.' : 'Dentro da meta.'}`}
      </div>
    </div>
  )
}
