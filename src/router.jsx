import { createBrowserRouter } from 'react-router'
import RequireAuth from './auth/RequireAuth.jsx'
import RequireRole from './auth/RequireRole.jsx'
import RoleHomeRedirect from './auth/RoleHomeRedirect.jsx'
import { ROLE_HOME } from './auth/roles.js'
import AppLayout from './layouts/AppLayout.jsx'
import { NAV } from './layouts/navigation.js'
import ComingSoonPage from './pages/ComingSoonPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import AkunPage from './pages/akun/AkunPage.jsx'
import KkPage from './pages/kk/KkPage.jsx'
import PeriodePage from './pages/periode/PeriodePage.jsx'

// Nav path → page. Both roles share a key's page; role-only pages only appear in that role's NAV.
const PAGES = {
  '': <DashboardPage />,
  warga: <KkPage />,
  kk: <KkPage />,
  periode: <PeriodePage />,
  akun: <AkunPage />,
  pengaturan: <SettingsPage />,
}

function roleRoutes(role) {
  return {
    path: ROLE_HOME[role],
    element: <RequireRole role={role} />,
    children: [
      {
        element: <AppLayout />,
        children: NAV[role].map(({ path, label }) => ({
          ...(path ? { path } : { index: true }),
          element: PAGES[path] ?? <ComingSoonPage key={path} title={label} />,
        })),
      },
    ],
  }
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [{ path: '/', element: <RoleHomeRedirect /> }, roleRoutes('desa'), roleRoutes('rt')],
  },
  { path: '*', element: <NotFoundPage /> },
])
