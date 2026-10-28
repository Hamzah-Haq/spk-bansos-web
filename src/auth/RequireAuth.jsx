import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './AuthProvider.jsx'
import FullPageSpinner from '../components/molecules/FullPageSpinner.jsx'

export default function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageSpinner />
  if (status === 'guest') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
