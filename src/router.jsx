import { createBrowserRouter } from 'react-router'
import RequireAuth from './auth/RequireAuth.jsx'
import RequireRole from './auth/RequireRole.jsx'
import RoleHomeRedirect from './auth/RoleHomeRedirect.jsx'
import { ROLE_HOME } from './auth/roles.js'
import DashboardTemplate from './components/templates/DashboardTemplate.jsx'
import { NAV } from './navigation.js'
import AkunPage from './pages/AkunPage.jsx'
import ComingSoonPage from './pages/ComingSoonPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import KkPage from './pages/KkPage.jsx'
import KriteriaPage from './pages/KriteriaPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PeriodePage from './pages/PeriodePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import SurveiFormPage from './pages/SurveiFormPage.jsx'
import SurveiPage from './pages/SurveiPage.jsx'
import VerifikasiDetailPage from './pages/VerifikasiDetailPage.jsx'
import VerifikasiPage from './pages/VerifikasiPage.jsx'

// Nav path → page. Both roles share a key's page; role-only pages only appear in that role's NAV.
const PAGES = {
  '': <DashboardPage />,
  warga: <KkPage />,
  kk: <KkPage />,
  kriteria: <KriteriaPage />,
  periode: <PeriodePage />,
  akun: <AkunPage />,
  survei: <SurveiPage />,
  verifikasi: <VerifikasiPage />,
  pengaturan: <SettingsPage />,
}

// Pages that aren't menu items (detail/form pages), per role, relative to the role's home
const EXTRA_ROUTES = {
  desa: [
    {
      path: 'verifikasi/:id',
      element: <VerifikasiDetailPage />,
    },
  ],
  rt: [
    {
      path: 'survei/:id',
      element: <SurveiFormPage />,
    },
  ],
}

function roleRoutes(role) {
  return {
    path: ROLE_HOME[role],
    element: <RequireRole role={role} />,
    children: [
      {
        element: <DashboardTemplate />,
        children: [
          ...NAV[role].map(({ path, label }) => ({
            ...(path ? { path } : { index: true }),
            element: PAGES[path] ?? <ComingSoonPage key={path} title={label} />,
          })),
          ...EXTRA_ROUTES[role],
        ],
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
