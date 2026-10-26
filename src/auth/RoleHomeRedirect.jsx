import { Navigate } from 'react-router'
import { useAuth } from './AuthProvider.jsx'
import { ROLE_HOME } from './roles.js'

export default function RoleHomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={ROLE_HOME[user.role]} replace />
}
