// Fallback exibido pelo <Suspense> enquanto um chunk carregado sob demanda
// (React.lazy) ainda está baixando — flash breve, sem alterar comportamento.
export default function CarregandoFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-creme"
    >
      <span className="sr-only">Carregando…</span>
      <div
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-sage/25 border-t-verde"
      />
    </div>
  )
}
