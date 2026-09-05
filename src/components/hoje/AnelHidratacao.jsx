import { motion, useReducedMotion } from 'framer-motion'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { useContagem } from '../../hooks/useContagem.js'

/**
 * AnelHidratacao — Indicador premium de hidratação diária
 * Componente minimalista que reforça a mentalidade MWA através do design
 *
 * Props:
 *   consumidoMl: número — ml de água consumida
 *   metaMl: número — meta em ml
 *   onClickAdicionar: function — callback para adicionar água
 *   desabilitado: boolean — desativa os botões (ex.: durante o fetch do dia)
 */
export default function AnelHidratacao({ consumidoMl, metaMl, onClickAdicionar, desabilitado = false }) {
  const { ingles } = useIdioma()
  const reduzido = useReducedMotion()
  const ativo = !reduzido
  const raio = 50
  const circ = 2 * Math.PI * raio
  const pct = Math.min(Math.round((consumidoMl / metaMl) * 100), 100)
  const pctAnimado = useContagem(pct, { ativo, duracaoMs: 700 })
  const consumidoAnimado = useContagem(consumidoMl, { ativo, duracaoMs: 700 })
  const preenchido = (Math.min(pctAnimado, 100) / 100) * circ

  // Estado visual e micro-copy educativa
  let estado = { frase: ingles ? 'Start gently. Small sips are also an act of care.' : 'Comece com calma. Pequenos goles também constroem cuidado.', tipo: 'inicio', cor: '#C59F4F' }
  if (pct >= 40 && pct < 80) {
    estado = { frase: ingles ? 'Your body responds better when your routine supports it.' : 'Seu corpo responde melhor quando a rotina apoia.', tipo: 'progresso', cor: '#879B55' }
  } else if (pct >= 80 && pct < 100) {
    estado = { frase: ingles ? 'You are close to your target. Consistency comes one sip at a time.' : 'Você está perto da meta. Consistência também se bebe.', tipo: 'proximidade', cor: '#879B55' }
  } else if (pct >= 100) {
    estado = { frase: ingles ? 'Target reached. Another quiet act of care for yourself.' : 'Meta concluída. Mais um cuidado silencioso por você.', tipo: 'conquista', cor: '#08402F' }
  }

  const corTexto = pct >= 100 ? 'text-ouro' : 'text-verde/70'

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Indicador circular */}
      <div className="relative">
        <div className="relative h-56 w-56">
          <svg viewBox="0 0 120 120" className="h-56 w-56 -rotate-90">
            {/* Fundo cinza suave */}
            <circle cx="60" cy="60" r={raio} fill="none" stroke="#E8E4DC" strokeWidth="8" />

            {/* Preenchimento com progresso */}
            <circle
              cx="60"
              cy="60"
              r={raio}
              fill="none"
              stroke={estado.cor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${preenchido} ${circ}`}
            />
          </svg>

          {/* Núcleo: percentual */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ color: estado.cor }}>
              {Math.round(pctAnimado)}
            </span>
            <span className="text-xs font-semibold text-verde/80">%</span>
          </div>
        </div>
      </div>

      {/* Volume consumido / meta */}
      <div className="text-center">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-2xl font-semibold text-verde">
            {(consumidoAnimado / 1000).toFixed(1).replace('.', ',')}
          </span>
          <span className="text-sm font-medium text-verde/60">L</span>
          <span className="text-verde/80"> {ingles ? 'of' : 'de'} </span>
          <span className="text-lg font-medium text-verde/70">
            {(metaMl / 1000).toFixed(1).replace('.', ',')} L
          </span>
        </div>
      </div>

      {/* Micro-copy educativa */}
      <p className={`text-center text-sm font-medium transition-colors duration-500 motion-reduce:transition-none ${corTexto}`}>
        {estado.frase}
      </p>

      {/* Botões de ação */}
      <div className="flex gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={() => onClickAdicionar && onClickAdicionar(-250)}
          disabled={desabilitado}
          className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-sage/30 font-bold text-verde/60 transition-colors hover:border-sage/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-sage/30"
          aria-label={ingles ? 'Remove 250 ml of water' : 'Remover 250 ml de água'}
        >
          −
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          onClick={() => onClickAdicionar && onClickAdicionar(250)}
          disabled={desabilitado}
          className="min-h-11 rounded-lg bg-sage px-4 py-2.5 text-sm font-semibold text-white hover:bg-sage/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-sage"
          aria-label={ingles ? 'Add 250 ml of water' : 'Adicionar 250 ml de água'}
        >
          +250 ml
        </motion.button>
      </div>

      {/* Label acessível */}
      <div className="sr-only" role="status" aria-live="polite">
        {ingles
          ? `Hydration: ${consumidoMl} ml of ${metaMl} ml, ${pct}% of the target. ${estado.frase}`
          : `Hidratação: ${consumidoMl} ml de ${metaMl} ml, ${pct}% da meta. ${estado.frase}`}
      </div>
    </div>
  )
}
