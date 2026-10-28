import { Link } from 'react-router'

// One headline number: label, value, optional hint line. With `to` the whole tile is a link.
export default function StatTile({ label, value, hint, icon: Icon, to }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">{label}</p>
        {Icon && (
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-semibold">{value.toLocaleString('id-ID')}</p>
      {hint && <p className="mt-1 text-xs text-fg-muted">{hint}</p>}
    </>
  )

  const className = 'block rounded-xl border border-border bg-surface p-5 shadow-sm'
  return to ? (
    <Link to={to} className={`${className} transition hover:border-primary/40`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  )
}
