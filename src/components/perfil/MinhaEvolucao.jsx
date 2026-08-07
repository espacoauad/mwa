import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { pesagensComRotulo } from '../../utils/evolucao.js'
import GraficoLinha from './GraficoLinha.jsx'
import AvatarEvolucaoRealista, { calcularEstagioCorporal } from './AvatarEvolucaoRealista.jsx'

const FOTO_LABELS = { frente: 'Frente', costas: 'Costas', latEsq: 'Lateral esq.', latDir: 'Lateral dir.' }

export default function MinhaEvolucao({ onFechar }) {
  const { pesagens, usuario, totalDias } = useApp()
  const dialogRef = useRef(null)
  const [fotosComErro, setFotosComErro] = useState(() => new Set())

  useEffect(() => {
    if (!onFechar) return
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const comRotulo = pesagensComRotulo(pesagens, totalDias)
  const temHistorico = comRotulo.length >= 1
  const temTimelineComparativa = comRotulo.length >= 2

  const ultima = temHistorico ? comRotulo[comRotulo.length - 1].pesagem : null
  const pesoAtual = ultima?.peso ?? usuario?.peso ?? null
  const medidasAtuais = ultima?.medidas ?? usuario?.medidas ?? {}
  const sexoAvatar = usuario?.sexo === 'masculino' ? 'masculino' : 'feminino'
  const estagioAtual = calcularEstagioCorporal({
    peso: pesoAtual,
    altura: usuario?.altura,
    cintura: medidasAtuais.cintura,
  })

  const pontosPeso = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.peso ?? null }))
  const pontosCintura = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.medidas?.cintura ?? null }))
  const pontosQuadril = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.medidas?.quadril ?? null }))
  const pontosPeito = comRotulo.map(({ pesagem, rotulo }) => ({ rotulo, valor: pesagem.medidas?.peito ?? null }))

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-creme"
      role="dialog"
      aria-modal="true"
      aria-labelledby="minha-evolucao-titulo"
    >
      <div ref={dialogRef} tabIndex={-1} className="mx-auto max-w-md px-5 pb-16 pt-10 outline-none">
        <div className="flex items-center justify-between">
          <h1 id="minha-evolucao-titulo" className="font-serif text-2xl font-semibold italic text-verde">
            Minha Evolução
          </h1>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/70 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Estado atual */}
        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm shadow-verde/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-verde">Avatar de evolução</h2>
              <p className="text-xs text-verde/55">Representação visual do resultado atual.</p>
            </div>
            <span className="rounded-full bg-sage-claro px-3 py-1 text-[11px] font-bold text-verde">Atual</span>
          </div>
          <div className="mt-3 flex justify-center">
            <AvatarEvolucaoRealista sexo={sexoAvatar} estagio={estagioAtual} mostrarEtapas />
          </div>
          <p className="mt-2 text-center text-xl font-bold text-verde">
            {pesoAtual != null ? `${pesoAtual} kg` : 'Aguardando pesagem'}
          </p>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-verde/65">
            <li>Cintura: {medidasAtuais.cintura ?? '—'} cm</li>
            <li>Quadril: {medidasAtuais.quadril ?? '—'} cm</li>
            <li>Peito: {medidasAtuais.peito ?? '—'} cm</li>
          </ul>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-verde/50">
            Estimado a partir do peso, IMC e circunferência de cintura disponíveis. Ilustrativo; não substitui avaliação clínica.
          </p>
        </section>

        {!temTimelineComparativa && (
          <p className="mt-4 rounded-xl bg-white p-4 text-center text-sm text-verde/70 shadow-sm shadow-verde/5">
            Registre mais uma pesagem para começar a ver sua evolução em gráficos e linha do tempo.
          </p>
        )}

        {temTimelineComparativa && (
          <>
            {/* Gráficos de evolução */}
            <div className="mt-4 flex flex-col gap-3">
              <GraficoLinha titulo="Peso" pontos={pontosPeso} sufixo=" kg" />
              <GraficoLinha titulo="Cintura" pontos={pontosCintura} sufixo=" cm" />
              <GraficoLinha titulo="Quadril" pontos={pontosQuadril} sufixo=" cm" />
              <GraficoLinha titulo="Peito" pontos={pontosPeito} sufixo=" cm" />
            </div>

            {/* Timeline avatar + fotos por marco */}
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-verde/60">Linha do tempo</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {comRotulo.map(({ pesagem, rotulo }, indice) => (
                  <div key={pesagem.id} className="flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl bg-white p-3 shadow-sm shadow-verde/5">
                    <p className="text-xs font-bold uppercase tracking-wide text-verde/60">{rotulo}</p>
                    <AvatarEvolucaoRealista
                      sexo={sexoAvatar}
                      estagio={calcularEstagioCorporal({
                        peso: pesagem.peso,
                        altura: usuario?.altura,
                        cintura: pesagem.medidas?.cintura,
                      })}
                      tamanho="pequeno"
                    />
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(FOTO_LABELS).map(([id, rotuloFoto]) => {
                        const chave = `${pesagem.id}:${id}`
                        return pesagem.fotos?.[id] && !fotosComErro.has(chave) ? (
                          <img
                            key={id}
                            src={pesagem.fotos[id]}
                            alt={`${rotuloFoto} — ${rotulo}`}
                            className="aspect-[3/4] w-full rounded-lg object-cover"
                            onError={() =>
                              setFotosComErro((atual) => {
                                if (atual.has(chave)) return atual
                                const proximo = new Set(atual)
                                proximo.add(chave)
                                return proximo
                              })
                            }
                          />
                        ) : (
                          <span key={id} className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-creme text-[10px] text-verde/40">
                            Sem foto
                          </span>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
