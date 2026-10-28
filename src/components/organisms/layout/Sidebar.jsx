import { NavLink } from 'react-router'
import { LogOut, X } from 'lucide-react'
import { useAuth } from '../../../auth/AuthProvider.jsx'
import { ROLE_HOME } from '../../../auth/roles.js'
import { NAV } from '../../../navigation.js'
import Brand from '../../molecules/Brand.jsx'

// Role menu. Always visible from `lg` up; below that it is a drawer toggled by `open`.
export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const home = ROLE_HOME[user.role]

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar text-sidebar-fg transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-2 px-5 py-6">
          <Brand />
          <button
            type="button"
            onClick={onClose}
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
              onClick={onClose}
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

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden />
      )}
    </>
  )
}
