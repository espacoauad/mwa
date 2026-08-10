import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

const OPCOES = [
  {
    chave: 'calma',
    label: 'Quero voltar com calma',
    mensagem: 'Sem pressa. Vamos retomar no seu tempo — um passo simples hoje já é o suficiente.',
  },
  {
    chave: 'dias_dificeis',
    label: 'Tive dias difíceis',
    mensagem: 'Dias difíceis acontecem, e isso não apaga o que você já construiu. Hoje, cuide de você primeiro.',
  },
  {
    chave: 'reorganizar',
    label: 'Preciso reorganizar minha rotina',
    mensagem: 'Faz sentido. Que tal começar só registrando uma refeição hoje, sem se cobrar pelo resto?',
  },
]

export default function ModoRecomecar() {
  const { escolherOpcaoRecomecar, fecharModoRecomecar } = useApp()
  const [opcaoEscolhida, setOpcaoEscolhida] = useState(null)
  const dialogRef = useRef(null)

  // a11y: fecha com Esc e move o foco para o diálogo assim que ele é aberto
  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') fecharModoRecomecar()
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [fecharModoRecomecar])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  async function escolher(chave) {
    setOpcaoEscolhida(chave)
    await escolherOpcaoRecomecar(chave)
  }

  const resposta = OPCOES.find((o) => o.chave === opcaoEscolhida)

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-verde-escuro/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modo-recomecar-titulo"
    >
      <button
        type="button"
        onClick={fecharModoRecomecar}
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
        {!resposta ? (
          <>
            <p id="modo-recomecar-titulo" className="font-serif text-xl font-bold italic text-white">
              Você não perdeu tudo o que construiu.
            </p>
            <p className="mt-2 text-sm text-white/85">Vamos recomeçar de onde estamos?</p>
            <div className="mt-6 space-y-3">
              {OPCOES.map((o) => (
                <button
                  key={o.chave}
                  type="button"
                  onClick={() => escolher(o.chave)}
                  className="w-full rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white hover:bg-white/25"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p id="modo-recomecar-titulo" className="text-base leading-relaxed text-white">
              {resposta.mensagem}
            </p>
            <button
              type="button"
              onClick={fecharModoRecomecar}
              className="mt-6 w-full rounded-2xl bg-ouro px-4 py-3 text-sm font-bold text-verde-escuro hover:brightness-105"
            >
              Ir para o Hoje
            </button>
          </>
        )}
      </div>
    </div>
  )
}
