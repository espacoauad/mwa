import { Button } from './Button'

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="font-ui fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <p className="text-lg font-semibold text-forest-deep">{title}</p>
        {description && <p className="mt-2 text-sm text-mist">{description}</p>}
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
