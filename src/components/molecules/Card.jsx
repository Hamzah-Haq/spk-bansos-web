// Content section on a page: title, optional description and header `actions`, then the body.
export default function Card({ title, description, actions, children }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
