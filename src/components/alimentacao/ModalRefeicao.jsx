import { useMemo, useState } from 'react'
import { X, Search, Camera } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ALIMENTOS, macrosDoAlimento } from '../../data/alimentos.js'
import { TIPOS_REFEICAO, horarioAgora } from '../../utils/calculos.js'
import Botao from '../ui/Botao.jsx'
import CampoNumero from '../ui/CampoNumero.jsx'

export default function ModalRefeicao() {
  const { modalRefeicao, fecharModalRefeicao, adicionarRefeicao, atualizarRefeicao } = useApp()
  const editando = modalRefeicao.inicial

  const [modo, setModo] = useState(editando?.manual ? 'manual' : 'banco')
  const [busca, setBusca] = useState('')
  const [alimentoId, setAlimentoId] = useState(editando?.alimentoId ?? null)
  const [quantidade, setQuantidade] = useState(editando?.quantidade ?? '')
  const [tipo, setTipo] = useState(editando?.tipo ?? 'Almoço')
  const [horario, setHorario] = useState(editando?.horario ?? horarioAgora())
  const [fotoUrl, setFotoUrl] = useState(editando?.fotoUrl ?? null)
  const [manual, setManual] = useState({
    nome: editando?.manual ? editando.nome : '',
    calorias: editando?.manual ? editando.calorias : '',
    proteina: editando?.manual ? editando.proteina : '',
    carbos: editando?.manual ? editando.carbos : '',
    gordura: editando?.manual ? editando.gordura : '',
    fibras: editando?.manual ? editando.fibras : '',
  })

  const alimento = ALIMENTOS.find((a) => a.id === alimentoId)

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return ALIMENTOS.slice(0, 8)
    return ALIMENTOS.filter((a) => a.nome.toLowerCase().includes(q)).slice(0, 10)
  }, [busca])

  const macros =
    modo === 'banco' && alimento && Number(quantidade) > 0
      ? macrosDoAlimento(alimento, Number(quantidade))
      : null

  function escolherAlimento(a) {
    setAlimentoId(a.id)
    if (!quantidade) setQuantidade(String(a.porcao))
  }

  function escolherFoto(e) {
    const arquivo = e.target.files?.[0]
    if (arquivo) setFotoUrl(URL.createObjectURL(arquivo))
  }

  const valido =
    modo === 'banco'
      ? alimento && Number(quantidade) > 0
      : manual.nome.trim() && Number(manual.calorias) >= 0

  function salvar() {
    const base =
      modo === 'banco'
        ? {
            nome: alimento.nome,
            alimentoId: alimento.id,
            quantidade: Number(quantidade),
            manual: false,
            ...macros,
          }
        : {
            nome: manual.nome.trim(),
            alimentoId: null,
            quantidade: Number(quantidade) || null,
            manual: true,
            calorias: Math.round(Number(manual.calorias) || 0),
            proteina: Number(manual.proteina) || 0,
            carbos: Number(manual.carbos) || 0,
            gordura: Number(manual.gordura) || 0,
            fibras: Number(manual.fibras) || 0,
          }

    const refeicao = { ...base, tipo, horario, fotoUrl }
    if (editando) atualizarRefeicao(editando.id, refeicao)
    else adicionarRefeicao(refeicao)
    fecharModalRefeicao()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde-escuro/50" onClick={fecharModalRefeicao}>
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-creme p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold italic text-verde">
            {editando ? 'Editar refeição' : 'Adicionar refeição'}
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={fecharModalRefeicao}
            className="rounded-full bg-white p-2 text-verde/60"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tipo e horário */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-verde">Refeição</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full rounded-lg border-2 border-sage/30 bg-white px-3 py-3.5 font-medium text-verde outline-none focus:border-sage"
            >
              {TIPOS_REFEICAO.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-verde">Horário</span>
            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="w-full rounded-lg border-2 border-sage/30 bg-white px-3 py-3.5 font-medium text-verde outline-none focus:border-sage"
            />
          </label>
        </div>

        {/* Alternância banco / manual */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg bg-cinza p-1">
          {[
            { id: 'banco', label: 'Buscar alimento' },
            { id: 'manual', label: 'Inserir manualmente' },
          ].map((op) => (
            <button
              key={op.id}
              type="button"
              onClick={() => setModo(op.id)}
              className={`rounded-md py-2 text-sm font-semibold transition-colors ${
                modo === op.id ? 'bg-white text-verde shadow-sm' : 'text-verde/50'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {modo === 'banco' ? (
          <div className="mt-4">
            <div className="flex items-center gap-2 rounded-lg border-2 border-sage/30 bg-white px-3 focus-within:border-sage">
              <Search size={16} className="text-verde/40" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar: frango, arroz, shake..."
                className="w-full py-3 font-medium text-verde outline-none"
              />
            </div>
            <ul className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-cinza bg-white">
              {resultados.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => escolherAlimento(a)}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors ${
                      alimentoId === a.id ? 'bg-sage-claro font-semibold text-verde' : 'text-verde/80 hover:bg-creme'
                    }`}
                  >
                    <span className="truncate">
                      {a.herbalife && '🌿 '}
                      {a.nome}
                    </span>
                    <span className="ml-2 shrink-0 text-xs text-verde/40">{a.kcal} kcal/100g</span>
                  </button>
                </li>
              ))}
              {resultados.length === 0 && (
                <li className="px-3 py-3 text-sm text-verde/50">Nada encontrado — use o modo manual.</li>
              )}
            </ul>
            <div className="mt-3">
              <CampoNumero
                label="Quantidade"
                sufixo="g"
                value={quantidade}
                onChange={setQuantidade}
                placeholder={alimento ? String(alimento.porcao) : '100'}
              />
            </div>
            {macros && (
              <div className="mt-3 grid grid-cols-5 gap-1 rounded-lg bg-verde p-3 text-center text-white">
                {[
                  ['kcal', macros.calorias],
                  ['prot', `${macros.proteina}g`],
                  ['carb', `${macros.carbos}g`],
                  ['gord', `${macros.gordura}g`],
                  ['fibra', `${macros.fibras}g`],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-sm font-bold text-ouro">{v}</p>
                    <p className="text-[10px] text-white/60">{l}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-verde">Nome do alimento/refeição</span>
              <input
                type="text"
                value={manual.nome}
                onChange={(e) => setManual((m) => ({ ...m, nome: e.target.value }))}
                placeholder="Ex.: Strogonoff da vovó"
                className="w-full rounded-lg border-2 border-sage/30 bg-white px-4 py-3.5 font-medium text-verde outline-none focus:border-sage"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <CampoNumero label="Calorias" sufixo="kcal" value={manual.calorias} onChange={(v) => setManual((m) => ({ ...m, calorias: v }))} placeholder="0" />
              <CampoNumero label="Proteína" sufixo="g" value={manual.proteina} onChange={(v) => setManual((m) => ({ ...m, proteina: v }))} placeholder="0" />
              <CampoNumero label="Carboidratos" sufixo="g" value={manual.carbos} onChange={(v) => setManual((m) => ({ ...m, carbos: v }))} placeholder="0" />
              <CampoNumero label="Gordura" sufixo="g" value={manual.gordura} onChange={(v) => setManual((m) => ({ ...m, gordura: v }))} placeholder="0" />
            </div>
            <CampoNumero label="Fibras" sufixo="g" value={manual.fibras} onChange={(v) => setManual((m) => ({ ...m, fibras: v }))} placeholder="0" />
          </div>
        )}

        {/* Foto */}
        <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-sage/40 bg-white p-4">
          {fotoUrl ? (
            <img src={fotoUrl} alt="Foto da refeição" className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-sage-claro text-sage">
              <Camera size={22} />
            </span>
          )}
          <span className="text-sm font-medium text-verde/70">
            {fotoUrl ? 'Trocar foto da refeição' : 'Adicionar foto da refeição 📸'}
          </span>
          <input type="file" accept="image/*" capture="environment" onChange={escolherFoto} className="hidden" />
        </label>

        <div className="mt-5">
          <Botao onClick={salvar} disabled={!valido}>
            {editando ? 'Salvar alterações' : 'Adicionar ao dia'}
          </Botao>
        </div>
      </div>
    </div>
  )
}
