// Content section on a page: title, optional description, then the body.
export default function Card({ title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}
