export default function Botao({ children, variante = 'primario', disabled, ...props }) {
  const estilos = {
    primario:
      'bg-verde text-white hover:bg-verde-escuro disabled:bg-verde/30 disabled:cursor-not-allowed',
    secundario:
      'bg-white text-verde border-2 border-sage/40 hover:border-sage hover:bg-sage-claro',
    ouro: 'bg-ouro text-verde-escuro hover:brightness-95 font-semibold',
  }

  return (
    <button
      disabled={disabled}
      className={`w-full rounded-lg px-6 py-4 text-base font-medium transition-all active:scale-[0.98] ${estilos[variante]}`}
      {...props}
    >
      {children}
    </button>
  )
}
