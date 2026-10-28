import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../organisms/layout/Sidebar.jsx'
import Topbar from '../organisms/layout/Topbar.jsx'
import WelcomeModal from '../organisms/layout/WelcomeModal.jsx'

// App shell for logged-in users (route element): sidebar + header, the page renders in <Outlet />.
export default function DashboardTemplate() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-svh">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="lg:pl-64">
        <Topbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <WelcomeModal />
    </div>
  )
}
