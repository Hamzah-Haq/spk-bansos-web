import { ChevronLeft, ChevronRight, Inbox, LoaderCircle, RefreshCw } from 'lucide-react'

// columns = [{ key, header, render?(row), className? }]; without `render` the cell shows row[key].
// Shows loading / error (with retry) / empty states in place of the rows.
export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  loading = false,
  error,
  onRetry,
  emptyMessage = 'Belum ada data',
  footer,
}) {
  const hasRows = rows?.length > 0

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-surface-alt text-xs font-semibold tracking-wide text-fg-muted uppercase">
            <tr>
              {columns.map(({ key, header, className = '' }) => (
                <th key={key} scope="col" className={`px-4 py-3 whitespace-nowrap ${className}`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y divide-border ${loading && hasRows ? 'opacity-60' : ''}`}>
            {hasRows &&
              !error &&
              rows.map((row) => (
                <tr key={row[rowKey]} className="hover:bg-surface-alt/60">
                  {columns.map(({ key, render, className = '' }) => (
                    <td key={key} className={`px-4 py-3 ${className}`}>
                      {render ? render(row) : row[key]}
                    </td>
                  ))}
                </tr>
              ))}

            {(error || !hasRows) && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12">
                  <TableState
                    loading={loading}
                    error={error}
                    onRetry={onRetry}
                    emptyMessage={emptyMessage}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  )
}

function TableState({ loading, error, onRetry, emptyMessage }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-fg-muted" role="status">
        <LoaderCircle className="size-5 animate-spin" aria-hidden />
        Memuat data…
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-danger">{error.message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <RefreshCw className="size-4" aria-hidden />
            Coba lagi
          </button>
        )}
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-2 text-fg-muted">
      <Inbox className="size-8" aria-hidden />
      {emptyMessage}
    </div>
  )
}

// Footer for paginated lists; meta = { page, limit, total, totalPages } from the API.
export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.total === 0) return null

  const from = (meta.page - 1) * meta.limit + 1
  const to = Math.min(meta.page * meta.limit, meta.total)

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-sm text-fg-muted">
      <span>
        Menampilkan {from}–{to} dari {meta.total} data
      </span>
      <div className="flex items-center gap-1">
        <PageButton
          label="Halaman sebelumnya"
          icon={ChevronLeft}
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        />
        <span className="px-2">
          {meta.page} / {meta.totalPages}
        </span>
        <PageButton
          label="Halaman berikutnya"
          icon={ChevronRight}
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        />
      </div>
    </div>
  )
}

function PageButton({ label, icon: Icon, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-border p-1.5 hover:bg-surface-alt hover:text-fg disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
