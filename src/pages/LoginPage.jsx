import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthProvider.jsx'
import { ROLE_HOME, isRolePath } from '../auth/roles.js'
import LoginForm from '../components/organisms/login/LoginForm.jsx'
import AuthTemplate from '../components/templates/AuthTemplate.jsx'

export default function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)

  // While submitting, the redirect below waits so we can navigate with the welcome state instead.
  if (status === 'authenticated' && !submitting) return <Navigate to="/" replace />

  async function handleLogin(username, password) {
    setSubmitting(true)
    try {
      const user = await login(username, password)
      const from = location.state?.from?.pathname
      const target = from && isRolePath(user.role, from) ? from : ROLE_HOME[user.role]
      navigate(target, { replace: true, state: { welcome: true } })
    } catch (err) {
      setSubmitting(false)
      throw err
    }
  }

  return (
    <AuthTemplate>
      <LoginForm submitting={submitting} onLogin={handleLogin} />
    </AuthTemplate>
  )
}
