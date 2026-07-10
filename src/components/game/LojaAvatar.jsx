import { useState } from 'react'
import { X, Check, Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { CATALOGO, RECOMPENSAS } from '../../data/skins.js'
import Avatar from './Avatar.jsx'

const CATEGORIAS = [
  { id: 'personagem', label: 'Personagens' },
  { id: 'fundo', label: 'Fundos' },
  { id: 'moldura', label: 'Molduras' },
]

export default function LojaAvatar({ onFechar }) {
  const { game, comprarSkin, equiparSkin } = useApp()
  const [categoria, setCategoria] = useState('personagem')
  const [aviso, setAviso] = useState(null)

  if (!game) return null

  const itens = CATALOGO[categoria]

  async function agir(item) {
    const possui = game.skins.includes(item.id)
    if (possui) {
      await equiparSkin(categoria, item.id)
      return
    }
    if (game.sementes < item.preco) {
      setAviso(`Faltam ${item.preco - game.sementes} sementes. Complete tarefas para ganhar mais! 🌱`)
      setTimeout(() => setAviso(null), 3000)
      return
    }
    const ok = await comprarSkin(categoria, item.id, item.preco)
    if (ok) {
      setAviso(`${item.nome} é sua! ✨`)
      setTimeout(() => setAviso(null), 2500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-verde/60 backdrop-blur-sm sm:items-center">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-3xl bg-creme sm:rounded-3xl">
        {/* Cabeçalho com avatar e saldo */}
        <div className="rounded-t-3xl bg-verde p-5 text-white sm:rounded-t-3xl">
          <div className="flex items-start justify-between">
            <h2 className="font-serif text-xl font-semibold italic">Seu avatar</h2>
            <button type="button" onClick={onFechar} className="rounded-full bg-white/15 p-1.5 hover:bg-white/25">
              <X size={18} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Avatar avatar={game.avatar} tamanho="lg" />
            <div>
              <p className="text-sm text-white/70">Suas sementes</p>
              <p className="text-3xl font-bold text-ouro">{game.sementes} 🌱</p>
            </div>
          </div>
        </div>

        {aviso && (
          <p className="bg-ouro-claro px-5 py-2.5 text-center text-sm font-semibold text-verde">{aviso}</p>
        )}

        {/* Abas de categoria */}
        <div className="grid grid-cols-3 gap-1 bg-cinza p-1">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoria(c.id)}
              className={`rounded-md py-2 text-sm font-semibold transition-colors ${
                categoria === c.id ? 'bg-white text-verde shadow-sm' : 'text-verde/50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Grade de skins */}
        <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-5">
          {itens.map((item) => {
            const possui = game.skins.includes(item.id)
            const equipada = game.avatar[categoria] === item.id
            const podeComprar = game.sementes >= item.preco

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => agir(item)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 bg-white p-3 transition-all ${
                  equipada
                    ? 'border-verde shadow-md'
                    : possui
                      ? 'border-sage/40 hover:border-sage'
                      : podeComprar
                        ? 'border-cinza hover:border-ouro'
                        : 'border-cinza opacity-60'
                }`}
              >
                {/* Miniatura */}
                {categoria === 'personagem' && <span className="text-3xl">{item.emoji}</span>}
                {categoria === 'fundo' && (
                  <span className="h-9 w-9 rounded-full" style={{ background: item.css }} />
                )}
                {categoria === 'moldura' && (
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-creme ${item.classe}`}>
                    {item.decor ?? ''}
                  </span>
                )}

                <p className="text-[11px] font-semibold leading-tight text-verde">{item.nome}</p>

                {equipada ? (
                  <span className="flex items-center gap-1 rounded-full bg-verde px-2 py-0.5 text-[10px] font-bold text-white">
                    <Check size={10} /> Em uso
                  </span>
                ) : possui ? (
                  <span className="rounded-full bg-sage-claro px-2 py-0.5 text-[10px] font-bold text-verde">
                    Equipar
                  </span>
                ) : (
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      podeComprar ? 'bg-ouro-claro text-verde' : 'bg-cinza text-verde/50'
                    }`}
                  >
                    {!podeComprar && <Lock size={9} />}
                    {item.preco} 🌱
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Como ganhar sementes */}
        <div className="border-t border-cinza bg-white p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-verde/50">Como ganhar sementes</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {Object.entries(RECOMPENSAS)
              .filter(([tipo]) => tipo !== 'boas_vindas')
              .map(([tipo, r]) => (
                <p key={tipo} className="text-[11px] text-verde/70">
                  <strong className="text-sage">+{r.sementes} 🌱</strong> {r.label}
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
