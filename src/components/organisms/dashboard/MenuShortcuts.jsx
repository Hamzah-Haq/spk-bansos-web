import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { useAuth } from '../../../auth/AuthProvider.jsx'
import { ROLE_HOME } from '../../../auth/roles.js'
import { NAV } from '../../../navigation.js'

// Cards linking to every menu page of the user's role except the dashboard itself.
export default function MenuShortcuts() {
  const { user } = useAuth()
  const home = ROLE_HOME[user.role]
  const shortcuts = NAV[user.role].filter((item) => item.path)

  return (
    <section>
      <h2 className="mb-3 font-semibold">Menu</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={`${home}/${path}`}
            className="group flex items-center gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm transition hover:border-primary/40"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="flex-1 text-sm font-medium">{label}</span>
            <ChevronRight className="size-4 text-fg-muted transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  )
}
