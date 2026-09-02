export function EmptyState({ title, description, action }) {
  return (
    <div className="font-ui flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sand bg-white/50 p-10 text-center">
      <p className="text-lg font-semibold text-forest-deep">{title}</p>
      {description && <p className="max-w-md text-sm text-mist">{description}</p>}
      {action}
    </div>
  )
}
