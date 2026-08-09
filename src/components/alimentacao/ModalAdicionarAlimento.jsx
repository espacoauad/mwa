import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Search, Star, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ALIMENTOS, macrosDoAlimento } from '../../data/alimentos.js'
import { buscarAlimentos, formatarMedida, medidaPorId, quantidadeNaBase } from '../../utils/alimentos.js'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'
import { useIdioma } from '../../context/IdiomaContext.jsx'

const FILTROS_EN = { Todos: 'All', Recentes: 'Recent', Favoritos: 'Favorites', 'Meus alimentos': 'My foods' }

const lerLocal = (chave, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(chave)) ?? fallback } catch { return fallback }
}

export default function ModalAdicionarAlimento() {
  const { ingles } = useIdioma()
  const { modalRefeicao, adicionarItemRefeicao, atualizarItemRefeicao, voltarParaRefeicaoAberta, fecharModalRefeicao } = useApp()
  const editando = modalRefeicao.itemInicial
  const [modo, setModo] = useState(editando?.manual ? 'manual' : 'banco')
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [personalizados, setPersonalizados] = useState(() => lerLocal('mwa_alimentos_personalizados'))
  const [favoritos, setFavoritos] = useState(() => lerLocal('mwa_alimentos_favoritos'))
  const [recentes, setRecentes] = useState(() => lerLocal('mwa_alimentos_recentes'))
  const [alimentoId, setAlimentoId] = useState(editando?.alimentoId ?? null)
  const [quantidade, setQuantidade] = useState(editando?.quantidade ?? '')
  const [medidaId, setMedidaId] = useState(editando?.medidaId ?? 'g')
  const [salvarPersonalizado, setSalvarPersonalizado] = useState(false)
  const [manual, setManual] = useState({
    nome: editando?.manual ? editando.nome : '', marca: editando?.marca ?? '',
    calorias: editando?.manual ? editando.calorias : '', proteina: editando?.manual ? editando.proteina : '',
    carbos: editando?.manual ? editando.carbos : '', gordura: editando?.manual ? editando.gordura : '',
    fibras: editando?.manual ? editando.fibras : '',
  })
  const dialogRef = useRef(null)

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') voltarParaRefeicaoAberta()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [voltarParaRefeicaoAberta])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const todosAlimentos = useMemo(() => [...personalizados, ...ALIMENTOS], [personalizados])
  const alimento = todosAlimentos.find((a) => a.id === alimentoId)

  const resultados = useMemo(() => {
    let base = todosAlimentos
    if (filtro === 'Favoritos') base = base.filter((a) => favoritos.includes(a.id))
    else if (filtro === 'Recentes') base = recentes.map((id) => base.find((a) => a.id === id)).filter(Boolean)
    else if (filtro === 'Meus alimentos') base = base.filter((a) => a.categoria === 'Meus alimentos')
    return buscarAlimentos(base, busca, 60)
  }, [todosAlimentos, filtro, favoritos, recentes, busca])

  const macros = modo === 'banco' && alimento && Number(quantidade) > 0
    ? macrosDoAlimento(alimento, Number(quantidade), medidaId) : null

  function escolherAlimento(a) {
    setAlimentoId(a.id)
    setQuantidade('1')
    setMedidaId(a.medidas?.some((m) => m.id === 'porcao') ? 'porcao' : (a.unidadeBase ?? 'g'))
    const novos = [a.id, ...recentes.filter((id) => id !== a.id)].slice(0, 20)
    setRecentes(novos); localStorage.setItem('mwa_alimentos_recentes', JSON.stringify(novos))
  }

  function alternarFavorito(id) {
    const novos = favoritos.includes(id) ? favoritos.filter((x) => x !== id) : [id, ...favoritos]
    setFavoritos(novos); localStorage.setItem('mwa_alimentos_favoritos', JSON.stringify(novos))
  }

  const macrosManuaisValidos = ['calorias', 'proteina', 'carbos', 'gordura', 'fibras']
    .every((campo) => manual[campo] === '' || Number(manual[campo]) >= 0)
  const valido = modo === 'banco'
    ? alimento && Number(quantidade) > 0
    : manual.nome.trim() && manual.calorias !== '' && macrosManuaisValidos && Number(quantidade) > 0

  async function salvar() {
    let item
    if (modo === 'banco') {
      const medida = medidaPorId(alimento, medidaId)
      item = {
        nome: alimento.nome, marca: alimento.marca ?? null, alimentoId: alimento.id,
        quantidade: Number(quantidade), quantidadeBase: quantidadeNaBase(alimento, quantidade, medidaId),
        medidaId, medidaNome: formatarMedida(medida, quantidade),
        manual: false, ...macros,
      }
    } else {
      item = {
        nome: manual.nome.trim(), marca: manual.marca.trim() || null, alimentoId: null,
        quantidade: Number(quantidade), quantidadeBase: Number(quantidade), medidaId: 'g', medidaNome: 'g',
        manual: true, calorias: Math.round(Number(manual.calorias) || 0),
        proteina: Number(manual.proteina) || 0, carbos: Number(manual.carbos) || 0,
        gordura: Number(manual.gordura) || 0, fibras: Number(manual.fibras) || 0,
      }
      if (salvarPersonalizado && !editando) {
        const fator = 100 / Number(quantidade)
        const novo = {
          id: `custom-${Date.now()}`, nome: item.nome, marca: item.marca, categoria: 'Meus alimentos',
          kcal: item.calorias * fator, prot: item.proteina * fator, carb: item.carbos * fator,
          gord: item.gordura * fator, fibra: item.fibras * fator, porcao: Number(quantidade), unidadeBase: 'g',
          aliases: [], fonte: 'Cadastrado pela usuária', estimado: true,
          medidas: [{ id: 'g', nome: 'g', plural: 'g', base: 1 }, { id: 'porcao', nome: 'porção cadastrada', plural: 'porções cadastradas', base: Number(quantidade) }],
        }
        const novos = [novo, ...personalizados]
        setPersonalizados(novos); localStorage.setItem('mwa_alimentos_personalizados', JSON.stringify(novos))
      }
    }
    if (editando) await atualizarItemRefeicao(modalRefeicao.refeicaoId, editando.id, item)
    else await adicionarItemRefeicao(modalRefeicao.refeicaoId, item)
    voltarParaRefeicaoAberta()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={voltarParaRefeicaoAberta}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="max-h-[94vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6 outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-adicionar-alimento-titulo"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-adicionar-alimento-titulo" className="font-serif text-xl font-semibold italic text-verde">{editando ? (ingles ? 'Edit food' : 'Editar alimento') : (ingles ? 'Add food' : 'Adicionar alimento')}</h2>
          <button type="button" aria-label={ingles ? 'Close' : 'Fechar'} onClick={fecharModalRefeicao} className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-verde/60"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-cinza p-1">
          {[['banco', ingles ? 'Search foods' : 'Buscar alimento'], ['manual', ingles ? 'Enter manually' : 'Inserir manualmente']].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setModo(id)} aria-pressed={modo === id} className={`rounded-md py-2 text-sm font-semibold ${modo === id ? 'bg-white text-verde shadow-sm' : 'text-verde/80'}`}>{label}</button>
          ))}
        </div>
        {modo === 'banco' ? <div className="mt-4">
          <div className="flex items-center gap-2 rounded-lg border-2 border-sage/30 bg-white px-3 focus-within:border-sage"><Search size={16} className="text-verde/40" />
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder={ingles ? 'Search food, brand, or alternative name…' : 'Buscar alimento, marca ou apelido...'} className="w-full py-3 font-medium text-verde outline-none" />
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {['Todos', 'Recentes', 'Favoritos', 'Meus alimentos'].map((cat) => <button key={cat} type="button" onClick={() => setFiltro(cat)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${filtro === cat ? 'bg-verde text-white' : 'bg-white text-verde/80'}`}>{ingles ? FILTROS_EN[cat] : cat}</button>)}
          </div>
          <ul className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-cinza bg-white">
            {resultados.map((a) => <li key={a.id} className={`flex items-center ${alimentoId === a.id ? 'bg-sage-claro' : ''}`}>
              <button type="button" onClick={() => escolherAlimento(a)} className="min-w-0 flex-1 px-3 py-2.5 text-left text-sm text-verde/80">
                <span className="block truncate font-medium">{a.suplemento && '🌿 '}{a.nome}</span>
                <span className="text-[10px] text-verde/80">{a.origem === 'Estados Unidos' && '🇺🇸 '}{a.categoria} · {a.kcal} kcal/100{a.unidadeBase}</span>
              </button>
              <button type="button" aria-label={`${favoritos.includes(a.id) ? (ingles ? 'Remove from' : 'Remover') : (ingles ? 'Add to' : 'Adicionar')} ${ingles ? 'favorites' : 'favorito'}`} onClick={() => alternarFavorito(a.id)} className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-ouro"><Star size={16} fill={favoritos.includes(a.id) ? 'currentColor' : 'none'} /></button>
            </li>)}
            {!resultados.length && <li className="px-3 py-4 text-sm text-verde/80">{ingles ? 'Nothing found. Try another name or enter it manually.' : 'Nada encontrado. Tente um sinônimo ou cadastre manualmente.'}</li>}
          </ul>
          {alimento && <div className="mt-3 grid grid-cols-2 gap-3">
            <CampoNumero label={ingles ? 'Quantity' : 'Quantidade'} value={quantidade} onChange={setQuantidade} min="0" step="any" placeholder="1" />
            <label><span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Serving unit' : 'Medida'}</span><select value={medidaId} onChange={(e) => setMedidaId(e.target.value)} className="w-full rounded-lg border-2 border-sage/30 bg-white px-3 py-3.5 font-medium text-verde outline-none">{alimento.medidas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}</select></label>
          </div>}
          {macros && <div className="mt-3 grid grid-cols-5 gap-1 rounded-lg bg-verde p-3 text-center text-white">{[['kcal', macros.calorias], ['prot', `${macros.proteina}g`], ['carb', `${macros.carbos}g`], ['gord', `${macros.gordura}g`], ['fibra', `${macros.fibras}g`]].map(([l, v]) => <div key={l}><p className="text-sm font-bold text-ouro">{v}</p><p className="text-[10px] text-white/60">{l}</p></div>)}</div>}
          {alimento?.estimado && <p className="mt-2 flex items-start gap-1 text-[11px] text-verde/80"><AlertCircle size={13} className="mt-0.5 shrink-0" />{ingles ? 'Reference value: preparation, recipe, or brand may change the macros.' : 'Valor de referência: preparação, receita ou marca pode alterar os macros.'}</p>}
        </div> : <div className="mt-4 flex flex-col gap-3">
          <label><span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Food or meal name' : 'Nome do alimento'}</span><input value={manual.nome} onChange={(e) => setManual((m) => ({ ...m, nome: e.target.value }))} placeholder={ingles ? 'Example: Homemade casserole' : 'Ex.: Strogonoff da vovó'} className="w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-3.5 font-medium text-verde outline-none" /></label>
          <label><span className="mb-2 block text-sm font-semibold text-verde">{ingles ? 'Brand (optional)' : 'Marca (opcional)'}</span><input value={manual.marca} onChange={(e) => setManual((m) => ({ ...m, marca: e.target.value }))} className="w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-3.5 font-medium text-verde outline-none" /></label>
          <CampoNumero label={ingles ? 'Serving weight' : 'Peso desta porção'} sufixo="g" value={quantidade} onChange={setQuantidade} min="0.1" step="any" placeholder="100" />
          <div className="grid grid-cols-2 gap-3"><CampoNumero label="Calorias" sufixo="kcal" value={manual.calorias} onChange={(v) => setManual((m) => ({ ...m, calorias: v }))} min="0" /><CampoNumero label="Proteína" sufixo="g" value={manual.proteina} onChange={(v) => setManual((m) => ({ ...m, proteina: v }))} min="0" /><CampoNumero label="Carboidratos" sufixo="g" value={manual.carbos} onChange={(v) => setManual((m) => ({ ...m, carbos: v }))} min="0" /><CampoNumero label="Gordura" sufixo="g" value={manual.gordura} onChange={(v) => setManual((m) => ({ ...m, gordura: v }))} min="0" /></div>
          <CampoNumero label="Fibras" sufixo="g" value={manual.fibras} onChange={(v) => setManual((m) => ({ ...m, fibras: v }))} min="0" />
          {!editando && <label className="flex items-center gap-2 text-sm font-medium text-verde/70"><input type="checkbox" checked={salvarPersonalizado} onChange={(e) => setSalvarPersonalizado(e.target.checked)} /> {ingles ? 'Save for reuse in "My foods"' : 'Salvar para reutilizar em "Meus alimentos"'}</label>}
        </div>}
        <div className="mt-5"><Botao onClick={salvar} disabled={!valido}>{editando ? (ingles ? 'Save changes' : 'Salvar alterações') : (ingles ? 'Add to meal' : 'Adicionar à refeição')}</Botao></div>
      </div>
    </div>
  )
}
