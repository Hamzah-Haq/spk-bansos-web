import { Menu } from 'lucide-react'
import { useAuth } from '../../../auth/AuthProvider.jsx'
import { ROLE_LABELS } from '../../../auth/roles.js'

// Sticky header: drawer toggle (below `lg`) and the logged-in user.
export default function Topbar({ onOpenMenu }) {
  const { user } = useAuth()
  const roleLabel = ROLE_LABELS[user.role]

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Buka menu"
        className="rounded-lg p-1.5 text-fg-muted hover:bg-surface-alt hover:text-fg lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      <span className="font-semibold lg:hidden">SPK Bansos</span>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-semibold">{user.nama}</p>
          <p className="text-xs text-fg-muted">{roleLabel}</p>
        </div>
        <span
          className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary"
          title={`${user.nama} · ${roleLabel}`}
        >
          {initials(user.nama)}
        </span>
      </div>
    </header>
  )
}

function initials(nama) {
  return nama
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}
