import { itemPorId } from '../../data/skins.js'

// Renderiza o avatar equipado: personagem + fundo + moldura
// tamanho: 'sm' (chip no cabeçalho) | 'md' | 'lg' (loja/perfil)
export default function Avatar({ avatar, tamanho = 'md' }) {
  const personagem = itemPorId('personagem', avatar?.personagem)
  const fundo = itemPorId('fundo', avatar?.fundo)
  const moldura = itemPorId('moldura', avatar?.moldura)

  const dims = {
    sm: { caixa: 'h-10 w-10', emoji: 'text-xl', decor: 'text-[10px] -top-1 -right-1' },
    md: { caixa: 'h-16 w-16', emoji: 'text-3xl', decor: 'text-sm -top-1.5 -right-1.5' },
    lg: { caixa: 'h-24 w-24', emoji: 'text-5xl', decor: 'text-xl -top-2 -right-2' },
  }[tamanho]

  return (
    <div className="relative inline-block">
      <div
        className={`flex items-center justify-center rounded-full ${dims.caixa} ${moldura.classe}`}
        style={{ background: fundo.css }}
      >
        <span className={dims.emoji}>{personagem.emoji}</span>
      </div>
      {moldura.decor && (
        <span className={`absolute ${dims.decor}`}>{moldura.decor}</span>
      )}
    </div>
  )
}
