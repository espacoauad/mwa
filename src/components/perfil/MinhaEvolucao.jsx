import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { pesagensComRotulo, proporcaoCinturaQuadril, estagioPostura, corConquista } from '../../utils/evolucao.js'
import GraficoLinha from './GraficoLinha.jsx'
import AvatarManequim from './AvatarManequim.jsx'

const FOTO_LABELS = { frente: 'Frente', costas: 'Costas', latEsq: 'Lateral esq.', latDir: 'Lateral dir.' }

export default function MinhaEvolucao({ onFechar }) {
  const { pesagens, usuario, totalDias } = useApp()
  const dialogRef = useRef(null)

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
  const proporcaoAtual = proporcaoCinturaQuadril(medidasAtuais)
  const ultimoIndice = Math.max(0, comRotulo.length - 1)

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
          <p className="text-sm font-semibold text-verde/60">Seu estado atual</p>
          <div className="mt-3 flex items-center gap-4">
            <AvatarManequim
              proporcao={proporcaoAtual}
              estagioPostura={estagioPostura(ultimoIndice, comRotulo.length)}
              corAcento={corConquista(ultimoIndice)}
              tamanho="lg"
            />
            <div className="flex-1">
              <p className="text-3xl font-bold text-verde">{pesoAtual != null ? `${pesoAtual} kg` : '—'}</p>
              <ul className="mt-2 flex flex-col gap-0.5 text-sm text-verde/70">
                <li>Cintura: {medidasAtuais.cintura ?? '—'} cm</li>
                <li>Quadril: {medidasAtuais.quadril ?? '—'} cm</li>
                <li>Peito: {medidasAtuais.peito ?? '—'} cm</li>
              </ul>
            </div>
          </div>
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
                    <AvatarManequim
                      proporcao={proporcaoCinturaQuadril(pesagem.medidas)}
                      estagioPostura={estagioPostura(indice, comRotulo.length)}
                      corAcento={corConquista(indice)}
                      tamanho="sm"
                    />
                    <div className="grid grid-cols-2 gap-1">
                      {Object.entries(FOTO_LABELS).map(([id, rotuloFoto]) =>
                        pesagem.fotos?.[id] ? (
                          <img
                            key={id}
                            src={pesagem.fotos[id]}
                            alt={`${rotuloFoto} — ${rotulo}`}
                            className="aspect-[3/4] w-full rounded-lg object-cover"
                          />
                        ) : (
                          <span key={id} className="flex aspect-[3/4] w-full items-center justify-center rounded-lg bg-creme text-[10px] text-verde/40">
                            Sem foto
                          </span>
                        ),
                      )}
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
