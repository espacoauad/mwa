import { useEffect, useMemo, useRef, useState } from 'react'
import { Droplets, Hand, Sparkles, Sprout, X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'
import { resumoFazenda, estagioDoPilar } from '../../utils/farm/crescimento.js'
import farmFase1 from '../../assets/farm/mwa-farm-fase-1.png'
import farmFase2 from '../../assets/farm/mwa-farm-fase-2.png'
import farmFase3 from '../../assets/farm/mwa-farm-fase-3.png'
import farmFase4 from '../../assets/farm/mwa-farm-fase-4.png'
import PlantaFazenda from './svg/PlantaFazenda.jsx'

const ESTAGIOS = ['Uma intenção foi plantada', 'Sua constância criou raízes', 'Seu cuidado está florescendo', 'Este hábito já faz parte da sua vida']
const ESTAGIOS_EN = ['An intention was planted', 'Your consistency has taken root', 'Your care is blooming', 'This habit is now part of your life']
const MENSAGENS = [
  'Toda transformação começa quando você decide cuidar de si mais uma vez.',
  'Talvez você ainda não perceba todas as mudanças, mas o seu jardim já percebe.',
  'Sua dedicação está transformando pequenas escolhas em uma nova forma de viver.',
  'Você não está apenas cumprindo tarefas. Está cultivando a vida que deseja viver.',
]
const MENSAGENS_EN = [
  'Every transformation begins when you choose to care for yourself one more time.',
  'You may not notice every change yet, but your garden already does.',
  'Your dedication is turning small choices into a new way of living.',
  'You are not just completing tasks. You are cultivating the life you want to live.',
]

// Mapeamento nominal: cada hotspot pertence a um cenário específico.
// Nunca depende da ordem de PILARES, evitando "água" abrir outro hábito.
// As áreas são invisíveis para preservar a ilustração sem elementos flutuantes.
const AREAS_POR_ID = {
  hidratacao: { left: '5%', top: '10%', width: '29%', height: '20%' },
  alimentacao: { left: '33%', top: '11%', width: '31%', height: '18%' },
  macros: { left: '65%', top: '20%', width: '31%', height: '18%' },
  digestao: { left: '4%', top: '31%', width: '34%', height: '18%' },
  calorias: { left: '64%', top: '34%', width: '32%', height: '18%' },
  movimento: { left: '4%', top: '50%', width: '38%', height: '17%' },
  sono: { left: '56%', top: '50%', width: '40%', height: '18%' },
  planejamento: { left: '55%', top: '70%', width: '41%', height: '18%' },
}

const FASES_FARM = [farmFase1, farmFase2, farmFase3, farmFase4]

function mensagemDoDia(dia, ingles) {
  const indice = dia >= 76 ? 3 : dia >= 46 ? 2 : dia >= 21 ? 1 : 0
  return (ingles ? MENSAGENS_EN : MENSAGENS)[indice]
}

function chaveCuidado(dia) {
  return `mwa-farm-cuidado-dia-${dia}`
}

function lerCuidados(dia) {
  try {
    return JSON.parse(localStorage.getItem(chaveCuidado(dia)) || '[]')
  } catch {
    return []
  }
}

const CHAVE_CONTAGENS = 'mwa-farm-contagens'

function migrarContagensDeCuidadosAntigos() {
  const contagens = {}
  for (let dia = 1; dia <= 90; dia++) {
    for (const pilarId of lerCuidados(dia)) {
      contagens[pilarId] = (contagens[pilarId] ?? 0) + 1
    }
  }
  return contagens
}

function lerContagens() {
  const bruto = localStorage.getItem(CHAVE_CONTAGENS)
  if (bruto === null) {
    const migradas = migrarContagensDeCuidadosAntigos()
    localStorage.setItem(CHAVE_CONTAGENS, JSON.stringify(migradas))
    return migradas
  }
  try {
    return JSON.parse(bruto)
  } catch {
    return {}
  }
}

export default function MwaFarm({ onFechar }) {
  const { ingles } = useIdioma()
  const { diaAtual, game } = useApp()
  const [selecionado, setSelecionado] = useState(null)
  const [cuidados, setCuidados] = useState([])
  const [contagens, setContagens] = useState(lerContagens)
  const dialogRef = useRef(null)
  const dia = Math.min(90, Math.max(1, diaAtual ?? 1))
  const resumo = useMemo(() => resumoFazenda(contagens, dia), [contagens, dia])
  const percentual = Math.round((dia / 90) * 100)
  const indiceFase = dia <= 22 ? 0 : dia <= 45 ? 1 : dia <= 68 ? 2 : 3
  const inicioFase = [1, 23, 46, 69][indiceFase]
  const fimFase = [22, 45, 68, 90][indiceFase]
  const progressoFase = (dia - inicioFase) / Math.max(1, fimFase - inicioFase)
  const imagemAtual = FASES_FARM[indiceFase]
  const imagemSeguinte = FASES_FARM[Math.min(3, indiceFase + 1)]

  useEffect(() => setCuidados(lerCuidados(dia)), [dia])
  useEffect(() => dialogRef.current?.focus(), [])
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key !== 'Escape') return
      if (selecionado) setSelecionado(null)
      else onFechar?.()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [onFechar, selecionado])

  function abrirPilar(pilar) {
    setSelecionado({
      ...pilar,
      titulo: ingles ? pilar.tituloHabitoEN : pilar.tituloHabito,
      nome: ingles ? pilar.nomeEN : pilar.nome,
      texto: ingles ? pilar.textoEducativoEN : pilar.textoEducativo,
      estagioTexto: (ingles ? ESTAGIOS_EN : ESTAGIOS)[pilar.estagio],
    })
  }

  function cuidar(pilar) {
    if (!pilar || cuidados.includes(pilar.id)) return
    const novos = [...cuidados, pilar.id]
    setCuidados(novos)
    const novasContagens = { ...contagens, [pilar.id]: (contagens[pilar.id] ?? 0) + 1 }
    setContagens(novasContagens)
    try {
      localStorage.setItem(chaveCuidado(dia), JSON.stringify(novos))
      localStorage.setItem(CHAVE_CONTAGENS, JSON.stringify(novasContagens))
    } catch {
      // ignora falha de armazenamento (quota excedida, navegação privada, etc.)
    }
    setSelecionado({ ...pilar, estagio: estagioDoPilar(pilar.id, novasContagens), concluidoAgora: true })
  }

  const todosCuidados = resumo.pilares.length > 0 && resumo.pilares.every((p) => cuidados.includes(p.id))

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#102f20]/90 p-2 backdrop-blur-md sm:p-4" role="dialog" aria-modal="true">
      <div ref={dialogRef} tabIndex={-1} className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-[#f8dda0]/70 bg-[#f9efd7] shadow-2xl outline-none">
        <header className="relative z-30 bg-gradient-to-br from-[#f9edce] via-[#fff9e8] to-[#eed7a5] px-4 pb-4 pt-4 text-[#285332] shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-black tracking-wide">MWA FARM</h2>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#72915b]">
                {ingles ? 'Plant. Care. Watch it grow.' : 'Plante. Cuide. Veja florescer.'}
              </p>
            </div>
            <button type="button" onClick={onFechar} aria-label={ingles ? 'Close' : 'Fechar'} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d6b974] bg-white/70">
              <X size={18} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex justify-between text-xs font-black"><span>{ingles ? `Day ${dia} of 90` : `Dia ${dia} de 90`}</span><span>{percentual}%</span></div>
              <div className="h-3 overflow-hidden rounded-full border border-[#cba95e] bg-[#6b5535]/20">
                <div className="h-full rounded-full bg-gradient-to-r from-[#79bd55] to-[#3d8b4c] transition-all duration-700" style={{ width: `${percentual}%` }} />
              </div>
            </div>
            <span className="rounded-full border border-[#d4b565] bg-white/75 px-3 py-2 text-xs font-black">🌱 {game?.sementes ?? 0}</span>
          </div>
        </header>

        <main className="mwa-farm-mundo relative aspect-[2/3] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${imagemAtual})`,
              filter: indiceFase === 3 ? `saturate(${1 + progressoFase * 0.08}) brightness(${1 + progressoFase * 0.04})` : undefined,
            }}
          />
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            style={{
              backgroundImage: `url(${imagemSeguinte})`,
              opacity: indiceFase === 3 ? 0 : progressoFase,
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#163a25]/20" />

          {resumo.pilares.map((pilar) => {
            const area = AREAS_POR_ID[pilar.id]
            if (!area) return null
            return (
              <div key={pilar.id}>
                <button
                  type="button"
                  onClick={() => abrirPilar(pilar)}
                  style={{ left: area.left, top: area.top, width: area.width, height: area.height }}
                  className="mwa-farm-hotspot absolute z-10 rounded-[35%] transition hover:bg-white/10 focus:bg-white/10"
                  aria-label={ingles ? pilar.tituloHabitoEN : pilar.tituloHabito}
                >
                  <span className="sr-only">{ingles ? 'Open habit garden' : 'Abrir canteiro do hábito'}</span>
                </button>
              </div>
            )
          })}

        </main>

        <section className="relative z-30 border-t-2 border-[#f4d992] bg-[#fff8e8] px-5 py-4 text-center shadow-[0_-8px_24px_rgba(35,75,43,.14)]">
          <Sparkles className="mx-auto mb-1 text-[#d4a538]" size={19} />
          <p className="font-serif text-base font-black italic leading-snug text-[#315c3a]">
            {todosCuidados ? (ingles ? 'Your whole farm was cared for today. Come back tomorrow to keep growing!' : 'Toda a sua fazenda foi cuidada hoje. Volte amanhã para continuar florescendo!') : mensagemDoDia(dia, ingles)}
          </p>
          {!todosCuidados && (
            <p className="mt-1 text-xs font-bold text-[#5c8a4a]">
              {ingles ? 'Care for your plots to watch them bloom.' : 'Cuide dos canteiros para vê-los florescer.'}
            </p>
          )}
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#8e7443]">
            {ingles ? `${cuidados.length} of ${resumo.pilares.length} gardens cared for today` : `${cuidados.length} de ${resumo.pilares.length} canteiros cuidados hoje`}
          </p>
        </section>

        {selecionado && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#102f20]/55 p-3 backdrop-blur-sm" onClick={() => setSelecionado(null)}>
            <section className="w-full max-w-md rounded-[2rem] border-4 border-[#f4d992] bg-[#fff9e9] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} role="status" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f0d2]">
                  {selecionado.animal ? <Sparkles className="text-[#c08e2f]" /> : <PlantaFazenda estagio={selecionado.estagio} cor={selecionado.cor} coroaId={selecionado.coroaId} tamanho={52} />}
                </div>
                <button type="button" onClick={() => setSelecionado(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[#315c3a]/10 text-[#315c3a]"><X size={18} /></button>
              </div>
              {selecionado.nome && <p className="mt-4 text-xs font-black uppercase tracking-widest text-[#c08e2f]">{selecionado.nome}</p>}
              <h3 className="mt-1 font-serif text-2xl font-black italic leading-tight text-[#315c3a]">{selecionado.concluidoAgora ? (ingles ? 'Care complete!' : 'Cuidado concluído!') : selecionado.titulo}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#315c3a]/80">
                {selecionado.concluidoAgora ? (ingles ? 'Your attention today became growth for tomorrow.' : 'O cuidado de hoje se transformou no crescimento de amanhã.') : selecionado.texto}
              </p>
              {selecionado.estagioTexto && !selecionado.concluidoAgora && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#e7f0d8] p-3 text-sm font-bold text-[#315c3a]"><Sparkles size={16} className="text-[#c08e2f]" /> {selecionado.estagioTexto}</div>
              )}
              {!selecionado.concluidoAgora && (
                <button
                  type="button"
                  disabled={cuidados.includes(selecionado.id)}
                  onClick={() => cuidar(selecionado)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#5aa75d] to-[#2f7543] px-5 py-3 font-black text-white shadow-lg disabled:cursor-default disabled:opacity-60"
                >
                  {cuidados.includes(selecionado.id) ? <><Sparkles size={18} />{ingles ? 'Cared for today' : 'Cuidado hoje'}</> : selecionado.estagio === 0 ? <><Sprout size={18} />{ingles ? 'Plant today' : 'Plantar hoje'}</> : selecionado.estagio === 3 ? <><Hand size={18} />{ingles ? 'Harvest today' : 'Colher hoje'}</> : <><Droplets size={18} />{ingles ? 'Water today' : 'Regar hoje'}</>}
                </button>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
