import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { CircleCheck, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ROLE_HOME, ROLE_LABELS } from '../auth/roles.js'
import Brand from '../components/Brand.jsx'
import Modal from '../components/Modal.jsx'
import { NAV } from './navigation.js'

export default function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const home = ROLE_HOME[user.role]
  const roleLabel = ROLE_LABELS[user.role]

  function closeWelcome() {
    navigate(location.pathname, { replace: true, state: null })
  }

  return (
    <div className="min-h-svh">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-fg transition-transform lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-2 px-5 py-6">
          <Brand />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
            className="rounded-lg p-1 text-sidebar-muted hover:text-sidebar-fg lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Menu utama">
          {NAV[user.role].map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path ? `${home}/${path}` : home}
              end={!path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-primary-fg shadow-sm'
                    : 'text-sidebar-muted hover:bg-sidebar-fg/10 hover:text-sidebar-fg'
                }`
              }
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-fg/10 p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-muted transition hover:bg-danger/15 hover:text-danger"
          >
            <LogOut className="size-5" aria-hidden />
            Keluar
          </button>
          <p className="px-3 pt-3 text-xs text-sidebar-muted">Bersama untuk Kesejahteraan Masyarakat</p>
        </div>
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)} aria-hidden />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
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

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Modal open={Boolean(location.state?.welcome)} onClose={closeWelcome} labelledBy="welcome-title">
        <form method="dialog" className="flex flex-col items-center p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
            <CircleCheck className="size-8" aria-hidden />
          </span>
          <h2 id="welcome-title" className="mt-4 text-lg font-semibold">
            Berhasil Masuk
          </h2>
          <p className="mt-2 text-sm text-fg-muted">
            Berhasil masuk sebagai <strong className="text-fg">{user.nama}</strong> dengan jabatan{' '}
            <strong className="text-fg">{roleLabel}</strong>.
          </p>
          <button
            type="submit"
            autoFocus
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-fg hover:brightness-110 focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:outline-none"
          >
            Lanjutkan
          </button>
        </form>
      </Modal>
    </div>
  )
}

function initials(nama) {
  return nama
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}
