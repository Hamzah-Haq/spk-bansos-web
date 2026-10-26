import { Outlet } from 'react-router'
import { useAuth } from './AuthProvider.jsx'
import ForbiddenPage from '../pages/ForbiddenPage.jsx'

export default function RequireRole({ role }) {
  const { user } = useAuth()
  return user.role === role ? <Outlet /> : <ForbiddenPage />
}
