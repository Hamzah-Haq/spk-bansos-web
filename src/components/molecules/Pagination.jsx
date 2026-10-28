import { ChevronLeft, ChevronRight } from 'lucide-react'

// Footer for paginated lists (pass it as DataTable's `footer`); meta = { page, limit, total, totalPages }
// from the API.
export default function Pagination({ meta, onPageChange }) {
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
