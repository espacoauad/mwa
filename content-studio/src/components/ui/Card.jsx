export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-sand bg-white/70 p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}
