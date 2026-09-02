const VARIANTES = {
  primary: 'bg-forest text-offwhite hover:bg-forest-deep',
  secondary: 'bg-white text-forest border border-forest/30 hover:bg-forest/5',
  ghost: 'text-forest hover:bg-forest/5',
  danger: 'bg-red-700 text-white hover:bg-red-800',
}

export function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`font-ui inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
