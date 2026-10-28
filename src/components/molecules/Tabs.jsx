// tabs = [{ id, label, icon }]; the parent owns the active id (e.g. in the URL).
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-border" role="tablist">
      {tabs.map(({ id, label, icon: Icon }) => {
        const selected = id === active
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(id)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              selected ? 'border-primary text-primary' : 'border-transparent text-fg-muted hover:text-fg'
            }`}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </button>
        )
      })}
    </div>
  )
}
