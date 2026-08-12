import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { supabase } from '../../lib/supabase.js'
import { diasDaSemana } from '../../utils/jogos/estrelas.js'
import {
  calcularResumoSemanal,
  agregarSemana,
  FORTE_FRAGMENTO,
  ATENCAO_FRASE,
  MENSAGEM_SEMANA_PARADA,
} from '../../utils/resumoSemanal.js'

export default function ResumoSemanal() {
  const { sessao, metas, hoje, fecharResumoSemanal } = useApp()
  const [resumo, setResumo] = useState(null)
  const [erro, setErro] = useState(false)
  const dialogRef = useRef(null)

  const dias = useMemo(() => diasDaSemana(hoje), [hoje])

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') fecharResumoSemanal()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fecharResumoSemanal])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useEffect(() => {
    const userId = sessao?.user?.id
    if (!userId || !metas) return
    let cancelado = false
    const primeiroDia = dias[0]
    const ultimoDia = dias[dias.length - 1]

    Promise.all([
      supabase
        .from('mwa_refeicoes')
        .select('data, mwa_refeicoes_itens(proteina)')
        .eq('user_id', userId)
        .gte('data', primeiroDia)
        .lte('data', ultimoDia),
      supabase
        .from('mwa_agua')
        .select('data, ml')
        .eq('user_id', userId)
        .gte('data', primeiroDia)
        .lte('data', ultimoDia),
      supabase
        .from('mwa_exercicios')
        .select('data')
        .eq('user_id', userId)
        .gte('data', primeiroDia)
        .lte('data', ultimoDia),
    ]).then(([refeicoesRes, aguaRes, exerciciosRes]) => {
      if (cancelado) return
      if (refeicoesRes.error || aguaRes.error || exerciciosRes.error) {
        setErro(true)
        return
      }

      const { refeicoesPorDia, proteinaPorDia, aguaPorDia, exercicioPorDia } = agregarSemana({
        refeicoesRows: refeicoesRes.data,
        aguaRows: aguaRes.data,
        exerciciosRows: exerciciosRes.data,
      })

      setResumo(
        calcularResumoSemanal({
          dias,
          refeicoesPorDia,
          proteinaPorDia,
          aguaPorDia,
          exercicioPorDia,
          metaProteina: metas.proteina,
          metaAguaMl: metas.aguaL * 1000,
        }),
      )
    }).catch(() => {
      if (!cancelado) setErro(true)
    })

    return () => {
      cancelado = true
    }
  }, [sessao, metas, dias])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-verde-escuro/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resumo-semanal-titulo"
    >
      <button
        type="button"
        onClick={fecharResumoSemanal}
        aria-label="Fechar"
        className="absolute right-4 top-4 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <X size={20} />
      </button>

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-sm shrink-0 rounded-[2.5rem] px-6 pb-8 pt-8 text-center outline-none"
        style={{ background: 'linear-gradient(135deg, #5a8a50 0%, #6d9a5f 40%, #7db567 100%)' }}
      >
        <p id="resumo-semanal-titulo" className="font-serif text-xl font-bold italic text-white">
          Retrato da sua semana
        </p>

        {erro ? (
          <p className="mt-6 text-sm text-white/70">Não consegui carregar o resumo dessa semana agora. Tente de novo mais tarde.</p>
        ) : !resumo ? (
          <p className="mt-6 text-sm text-white/70">Calculando...</p>
        ) : resumo.semanaParada ? (
          <p className="mt-6 text-base leading-relaxed text-white">{MENSAGEM_SEMANA_PARADA}</p>
        ) : (
          <div className="mt-6 space-y-4 text-left">
            <p className="text-sm leading-relaxed text-white">
              {resumo.pontosFortes.length === 2 ? (
                <>
                  Você {FORTE_FRAGMENTO[resumo.pontosFortes[0].chave]} em {resumo.pontosFortes[0].n} dos 7 dias e{' '}
                  {FORTE_FRAGMENTO[resumo.pontosFortes[1].chave]} em {resumo.pontosFortes[1].n} dos 7 dias. Esses
                  foram seus pontos fortes nessa semana. 💪
                </>
              ) : (
                <>
                  Você {FORTE_FRAGMENTO[resumo.pontosFortes[0].chave]} em {resumo.pontosFortes[0].n} dos 7 dias —
                  isso foi seu ponto forte na semana.
                </>
              )}
            </p>
            {resumo.pontoAtencao && (
              <p className="text-sm leading-relaxed text-white/90">
                {ATENCAO_FRASE[resumo.pontoAtencao.chave](resumo.pontoAtencao.n)}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={fecharResumoSemanal}
          className="mt-6 w-full rounded-2xl bg-ouro px-4 py-3 text-sm font-bold text-verde-escuro hover:brightness-105"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
