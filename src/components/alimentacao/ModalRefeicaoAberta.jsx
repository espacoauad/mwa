import { useState } from 'react'
import { X, Plus, Camera, Pencil, Trash2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { totaisDaRefeicao } from '../../utils/refeicoes.js'
import Botao from '../ui/Botao.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const REFEICOES_EN = {
  'Café da manhã': 'Breakfast', 'Lanche da manhã': 'Morning snack', Almoço: 'Lunch',
  'Lanche da tarde': 'Afternoon snack', Jantar: 'Dinner', Ceia: 'Evening snack',
}

export default function ModalRefeicaoAberta() {
  const { ingles } = useIdioma()
  const {
    modalRefeicao, refeicoesHoje, abrirAdicionarAlimento,
    removerItemRefeicao, removerRefeicaoCompleta, atualizarFotoRefeicao, fecharModalRefeicao,
  } = useApp()
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [erroFoto, setErroFoto] = useState(null)
  const refeicao = refeicoesHoje.find((r) => r.id === modalRefeicao.refeicaoId)

  if (!refeicao) return null
  const totais = totaisDaRefeicao(refeicao)

  async function escolherFoto(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setEnviandoFoto(true)
    setErroFoto(null)
    try {
      await atualizarFotoRefeicao(refeicao.id, arquivo)
    } catch (erro) {
      setErroFoto(ingles ? 'Failed to upload photo. Please try again.' : 'Falha ao enviar foto. Tente novamente.')
      console.error('Erro ao fazer upload de foto:', erro)
    } finally {
      setEnviandoFoto(false)
      e.target.value = ''
    }
  }

  async function excluirRefeicao() {
    const confirmado = window.confirm(
      ingles ? `Delete the whole "${refeicao.tipo}" meal, with all its foods?` : `Excluir a refeição "${refeicao.tipo}" inteira, com todos os alimentos?`,
    )
    if (confirmado) {
      await removerRefeicaoCompleta(refeicao.id)
      fecharModalRefeicao()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={fecharModalRefeicao}>
      <div
        className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-refeicao-aberta-titulo"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-refeicao-aberta-titulo" className="font-serif text-xl font-semibold italic text-verde">{ingles ? REFEICOES_EN[refeicao.tipo] : refeicao.tipo} · {refeicao.horario}</h2>
          <button type="button" aria-label={ingles ? 'Close' : 'Fechar'} onClick={fecharModalRefeicao} className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"><X size={18} /></button>
        </div>

        <div>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-sage/40 bg-white p-4 focus-within:border-sage focus-within:ring-2 focus-within:ring-sage focus-within:ring-offset-2">
            {refeicao.fotoUrl ? <img src={refeicao.fotoUrl} alt={ingles ? 'Meal' : 'Foto da refeição'} className="h-14 w-14 rounded-lg object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-sage-claro text-sage"><Camera size={22} /></span>}
            <span className="text-sm font-medium text-verde/70">{enviandoFoto ? (ingles ? 'Sending…' : 'Enviando…') : refeicao.fotoUrl ? (ingles ? 'Change meal photo' : 'Trocar foto da refeição') : (ingles ? 'Add meal photo 📸' : 'Adicionar foto da refeição 📸')}</span>
            <input type="file" accept="image/*" capture="environment" onChange={escolherFoto} disabled={enviandoFoto} className="sr-only" />
          </label>
          {erroFoto && <p className="mt-2 rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{erroFoto}</p>}
        </div>

        {totais.calorias > 0 && (
          <div className="mt-3 grid grid-cols-5 gap-1 rounded-lg bg-verde p-3 text-center text-white">
            {[['kcal', totais.calorias], ['prot', `${totais.proteina}g`], ['carb', `${totais.carbos}g`], ['gord', `${totais.gordura}g`], ['fibra', `${totais.fibras}g`]].map(([l, v]) => <div key={l}><p className="text-sm font-bold text-ouro">{v}</p><p className="text-[10px] text-white/60">{l}</p></div>)}
          </div>
        )}

        <ul className="mt-4 flex flex-col gap-2">
          {refeicao.itens.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm shadow-verde/5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-verde">{item.nome}</p>
                <p className="text-[11px] text-verde/80">{item.quantidade} {item.medidaNome ?? 'g'} · {item.calorias} kcal</p>
              </div>
              <button type="button" aria-label={`${ingles ? 'Edit' : 'Editar'} ${item.nome}`} onClick={() => abrirAdicionarAlimento(item)} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-verde/60 hover:bg-sage-claro hover:text-verde"><Pencil size={16} /></button>
              <button type="button" aria-label={`${ingles ? 'Delete' : 'Excluir'} ${item.nome}`} onClick={() => removerItemRefeicao(refeicao.id, item.id)} className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-verde/60 hover:bg-red-50 hover:text-red-700"><Trash2 size={16} /></button>
            </li>
          ))}
          {refeicao.itens.length === 0 && (
            <li className="rounded-lg bg-white p-4 text-center text-sm text-verde/60">{ingles ? 'No foods yet.' : 'Nenhum alimento ainda.'}</li>
          )}
        </ul>

        <div className="mt-4 flex flex-col gap-2">
          <Botao onClick={() => abrirAdicionarAlimento()}><Plus size={18} className="mr-1 inline" />{ingles ? 'Add food' : 'Adicionar alimento'}</Botao>
          <button type="button" onClick={excluirRefeicao} className="py-2 text-sm font-semibold text-red-700">{ingles ? 'Delete whole meal' : 'Excluir refeição inteira'}</button>
        </div>
      </div>
    </div>
  )
}
